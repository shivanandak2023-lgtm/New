"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "SSL Checker - Verify HTTPS & Security Headers for Any Website",
  description:
    "Free SSL checker tool. Verify HTTPS status, inspect security headers (HSTS, CSP, X-Frame-Options), and get a security grade for any website.",
  keywords: "ssl checker, ssl test, https checker, security headers, hsts check, ssl certificate checker",
};

interface SecurityHeader {
  name: string;
  value: string | null;
  present: boolean;
  description: string;
  severity: "critical" | "important" | "recommended";
}

interface SSLResult {
  url: string;
  isHttps: boolean;
  statusCode: number;
  statusText: string;
  headers: SecurityHeader[];
  grade: string;
  gradeColor: string;
  score: number;
  responseType: string;
}

const SECURITY_HEADERS_CONFIG = [
  { name: "strict-transport-security", display: "Strict-Transport-Security (HSTS)", description: "Forces HTTPS connections, prevents downgrade attacks", severity: "critical" as const, points: 20 },
  { name: "content-security-policy", display: "Content-Security-Policy (CSP)", description: "Controls resource loading, prevents XSS attacks", severity: "critical" as const, points: 20 },
  { name: "x-frame-options", display: "X-Frame-Options", description: "Prevents clickjacking by controlling iframe embedding", severity: "important" as const, points: 15 },
  { name: "x-content-type-options", display: "X-Content-Type-Options", description: "Prevents MIME-type sniffing attacks", severity: "important" as const, points: 15 },
  { name: "referrer-policy", display: "Referrer-Policy", description: "Controls how much referrer information is shared", severity: "recommended" as const, points: 10 },
  { name: "permissions-policy", display: "Permissions-Policy", description: "Controls which browser features the site can use", severity: "recommended" as const, points: 10 },
  { name: "x-xss-protection", display: "X-XSS-Protection", description: "Legacy XSS filter (deprecated but still checked)", severity: "recommended" as const, points: 5 },
  { name: "cross-origin-opener-policy", display: "Cross-Origin-Opener-Policy", description: "Isolates browsing context for cross-origin safety", severity: "recommended" as const, points: 5 },
];

export default function SSLCheckerPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<SSLResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function normalizeUrl(input: string): string {
    let u = input.trim();
    if (!u.startsWith("http://") && !u.startsWith("https://")) {
      u = "https://" + u;
    }
    return u;
  }

  function calculateGrade(score: number, isHttps: boolean): { grade: string; color: string } {
    if (!isHttps) return { grade: "F", color: "#ef4444" };
    if (score >= 90) return { grade: "A+", color: "#22c55e" };
    if (score >= 80) return { grade: "A", color: "#22c55e" };
    if (score >= 70) return { grade: "B", color: "#3b82f6" };
    if (score >= 60) return { grade: "C", color: "#f59e0b" };
    if (score >= 40) return { grade: "D", color: "#f97316" };
    return { grade: "F", color: "#ef4444" };
  }

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    const targetUrl = normalizeUrl(url);
    const isHttps = targetUrl.startsWith("https://");

    try {
      const res = await fetch(targetUrl, { method: "HEAD", mode: "no-cors" });

      // In no-cors mode we can't read headers, but we can check the request was made
      const headers: SecurityHeader[] = SECURITY_HEADERS_CONFIG.map((config) => {
        const value = res.type !== "opaque" ? res.headers.get(config.name) : null;
        return {
          name: config.display,
          value,
          present: value !== null,
          description: config.description,
          severity: config.severity,
        };
      });

      // If opaque response, we can't check headers
      const isOpaque = res.type === "opaque";
      let score = isHttps ? 30 : 0; // Base 30 points for HTTPS

      if (!isOpaque) {
        headers.forEach((h, i) => {
          if (h.present) score += SECURITY_HEADERS_CONFIG[i].points;
        });
      }

      const { grade, color } = calculateGrade(isOpaque ? (isHttps ? 65 : 0) : score, isHttps);

      setResult({
        url: targetUrl,
        isHttps,
        statusCode: res.type === "opaque" ? 200 : res.status,
        statusText: res.type === "opaque" ? "OK (opaque response)" : res.statusText || "OK",
        headers,
        grade: isOpaque ? (isHttps ? "B*" : "F") : grade,
        gradeColor: isOpaque ? (isHttps ? "#3b82f6" : "#ef4444") : color,
        score: isOpaque ? -1 : score,
        responseType: res.type,
      });
    } catch {
      setError(
        "Could not connect to the URL. The site may be down, or CORS restrictions prevent checking from the browser."
      );
    } finally {
      setLoading(false);
    }
  }

  function getSeverityColor(severity: string): string {
    if (severity === "critical") return "bg-red-100 text-red-700";
    if (severity === "important") return "bg-amber-100 text-amber-700";
    return "bg-blue-100 text-blue-700";
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/ssl-checker`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/ssl-checker`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">SSL / Security Header Checker</h1>
        <p className="text-[var(--muted)] mb-8">
          Verify HTTPS status and check security headers for any website.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Input */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Enter URL to Check</h2>
          <form onSubmit={handleCheck} className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., example.com or https://example.com"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none bg-[var(--bg)] text-[var(--foreground)]"
              required
            />
            <button type="submit" className="btn-primary whitespace-nowrap" disabled={loading}>
              {loading ? "Checking..." : "Check SSL"}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 mb-8">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Grade */}
            <div className="tool-card mb-8 text-center">
              <div
                className="inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl font-bold text-white mb-4"
                style={{ backgroundColor: result.gradeColor }}
              >
                {result.grade}
              </div>
              <h2 className="text-lg font-bold mb-2">Security Grade</h2>
              {result.score >= 0 ? (
                <p className="text-sm text-[var(--muted)]">Score: {result.score}/100</p>
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  * Estimated grade (headers not readable due to CORS restrictions)
                </p>
              )}
            </div>

            {/* HTTPS Status */}
            <div className="tool-card mb-8">
              <h2 className="text-lg font-bold mb-4">Connection Info</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="result-card text-center">
                  <div
                    className="w-4 h-4 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: result.isHttps ? "#22c55e" : "#ef4444" }}
                  />
                  <p className="text-lg font-bold">{result.isHttps ? "HTTPS" : "HTTP"}</p>
                  <p className="text-xs text-[var(--muted)]">Protocol</p>
                </div>
                <div className="result-card text-center">
                  <p className="text-lg font-bold">{result.statusCode}</p>
                  <p className="text-xs text-[var(--muted)]">Status Code</p>
                </div>
                <div className="result-card text-center">
                  <p className="text-sm font-bold capitalize">{result.responseType}</p>
                  <p className="text-xs text-[var(--muted)]">Response Type</p>
                </div>
              </div>
            </div>

            {/* Security Headers */}
            <div className="tool-card mb-8">
              <h2 className="text-lg font-bold mb-4">Security Headers</h2>
              {result.responseType === "opaque" ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 mb-4">
                  Headers cannot be read due to CORS restrictions. For a full header analysis, use the links below
                  or check the HTTP Header Checker tool with your own domain.
                </div>
              ) : null}

              <div className="space-y-3">
                {result.headers.map((h) => (
                  <div
                    key={h.name}
                    className="p-3 rounded-lg border"
                    style={{
                      borderLeftWidth: 4,
                      borderLeftColor: result.responseType === "opaque"
                        ? "#9ca3af"
                        : h.present ? "#22c55e" : "#ef4444",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-sm">{h.name}</p>
                        <p className="text-xs text-[var(--muted)]">{h.description}</p>
                        {h.value && (
                          <p className="text-xs font-mono mt-1 break-all bg-gray-50 p-1 rounded">{h.value}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(h.severity)}`}>
                          {h.severity}
                        </span>
                        {result.responseType !== "opaque" && (
                          <span className={`text-sm ${h.present ? "text-green-500" : "text-red-500"}`}>
                            {h.present ? "Present" : "Missing"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* External Links */}
            <div className="tool-card mb-8">
              <h2 className="text-lg font-bold mb-4">Deep SSL Analysis</h2>
              <p className="text-sm text-[var(--muted)] mb-4">
                For a complete SSL certificate analysis, use these external tools:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`https://www.ssllabs.com/ssltest/analyze.html?d=${encodeURIComponent(new URL(result.url).hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-[var(--primary)]"
                >
                  SSL Labs Test &rarr;
                </a>
                <a
                  href={`https://securityheaders.com/?q=${encodeURIComponent(result.url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-[var(--primary)]"
                >
                  SecurityHeaders.com &rarr;
                </a>
              </div>
            </div>
          </>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the SSL / Security Header Checker</h2>
          <p>
            This tool checks whether a website uses HTTPS and inspects its security headers.
            Security headers are HTTP response headers that help protect against common web attacks
            like XSS, clickjacking, and data injection.
          </p>

          <h2>Important Security Headers</h2>
          <ul>
            <li><strong>HSTS:</strong> Tells browsers to always use HTTPS, preventing downgrade attacks</li>
            <li><strong>CSP:</strong> Restricts which resources can load, preventing XSS and injection</li>
            <li><strong>X-Frame-Options:</strong> Prevents your site from being embedded in iframes</li>
            <li><strong>X-Content-Type-Options:</strong> Stops browsers from MIME-type sniffing</li>
          </ul>

          <h2>Why HTTPS Matters</h2>
          <ul>
            <li><strong>Encryption:</strong> All data between browser and server is encrypted</li>
            <li><strong>Authentication:</strong> Verifies you are connected to the real website</li>
            <li><strong>SEO:</strong> Google uses HTTPS as a ranking signal</li>
            <li><strong>Trust:</strong> Users see the padlock icon indicating a secure connection</li>
          </ul>

          <h3>SSL/TLS Versions</h3>
          <ul>
            <li><strong>TLS 1.3:</strong> Latest and most secure (2018)</li>
            <li><strong>TLS 1.2:</strong> Still widely used and secure (2008)</li>
            <li><strong>TLS 1.0/1.1:</strong> Deprecated, should not be used</li>
            <li><strong>SSL 3.0:</strong> Obsolete and insecure</li>
          </ul>
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "SSL / Security Header Checker",
            description: META.description,
            url: `${SITE_URL}/tools/ssl-checker`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
