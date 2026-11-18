"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "HTTP Header Checker - Inspect Response Headers & Generate Curl",
  description:
    "Free HTTP header checker tool. Inspect HTTP response headers, check security headers, and generate curl commands. View common headers reference checklist.",
  keywords: "http header checker, response headers, curl command generator, security headers check, http headers tool",
};

interface HeaderResult {
  name: string;
  value: string;
}

interface CheckResult {
  url: string;
  headers: HeaderResult[];
  status: number;
  statusText: string;
  isCors: boolean;
}

const SECURITY_HEADERS_CHECKLIST = [
  { header: "Strict-Transport-Security", category: "Security", description: "Enforces HTTPS connections (HSTS)", example: "max-age=31536000; includeSubDomains; preload" },
  { header: "Content-Security-Policy", category: "Security", description: "Controls resource loading to prevent XSS", example: "default-src 'self'; script-src 'self'" },
  { header: "X-Frame-Options", category: "Security", description: "Prevents clickjacking via iframe embedding", example: "DENY or SAMEORIGIN" },
  { header: "X-Content-Type-Options", category: "Security", description: "Prevents MIME type sniffing", example: "nosniff" },
  { header: "Referrer-Policy", category: "Security", description: "Controls referrer information sharing", example: "strict-origin-when-cross-origin" },
  { header: "Permissions-Policy", category: "Security", description: "Controls browser feature access", example: "camera=(), microphone=(), geolocation=()" },
  { header: "X-XSS-Protection", category: "Security", description: "Legacy XSS filter (use CSP instead)", example: "1; mode=block" },
  { header: "Cross-Origin-Opener-Policy", category: "Security", description: "Isolates browsing context", example: "same-origin" },
  { header: "Cross-Origin-Resource-Policy", category: "Security", description: "Controls cross-origin resource sharing", example: "same-origin" },
  { header: "Content-Type", category: "Content", description: "Media type of the response body", example: "text/html; charset=utf-8" },
  { header: "Cache-Control", category: "Performance", description: "Caching directives for the response", example: "public, max-age=3600, immutable" },
  { header: "ETag", category: "Performance", description: "Resource version identifier for caching", example: '\"33a64df551425fcc55e4d42a148795d9f25f89d4\"' },
  { header: "Content-Encoding", category: "Performance", description: "Compression algorithm used", example: "gzip, br" },
  { header: "Server", category: "Info", description: "Web server software (consider hiding)", example: "nginx, Apache" },
  { header: "X-Powered-By", category: "Info", description: "Server technology (should be removed)", example: "Express, PHP/8.0" },
  { header: "Set-Cookie", category: "Cookies", description: "Sets cookies with optional flags", example: "session=abc; Secure; HttpOnly; SameSite=Strict" },
];

export default function HTTPHeaderCheckerPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [curlCopied, setCurlCopied] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  function normalizeUrl(input: string): string {
    let u = input.trim();
    if (!u.startsWith("http://") && !u.startsWith("https://")) {
      u = "https://" + u;
    }
    return u;
  }

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    const targetUrl = normalizeUrl(url);

    try {
      const res = await fetch(targetUrl, { method: "HEAD" });
      const headers: HeaderResult[] = [];
      res.headers.forEach((value, name) => {
        headers.push({ name, value });
      });

      setResult({
        url: targetUrl,
        headers,
        status: res.status,
        statusText: res.statusText || "OK",
        isCors: false,
      });
    } catch {
      // Try no-cors
      try {
        const res = await fetch(targetUrl, { method: "HEAD", mode: "no-cors" });
        setResult({
          url: targetUrl,
          headers: [],
          status: res.type === "opaque" ? 200 : res.status,
          statusText: "Opaque response (CORS restricted)",
          isCors: true,
        });
      } catch {
        setError(
          "Could not connect to the URL. Try checking a URL on the same domain, or use the curl command below."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function getCurlCommand(): string {
    const targetUrl = normalizeUrl(url);
    return `curl -I -L "${targetUrl}"`;
  }

  function copyCurl() {
    navigator.clipboard.writeText(getCurlCommand());
    setCurlCopied(true);
    setTimeout(() => setCurlCopied(false), 2000);
  }

  const categories = ["All", ...Array.from(new Set(SECURITY_HEADERS_CHECKLIST.map((h) => h.category)))];
  const filteredHeaders = categoryFilter === "All"
    ? SECURITY_HEADERS_CHECKLIST
    : SECURITY_HEADERS_CHECKLIST.filter((h) => h.category === categoryFilter);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/http-header-checker`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">HTTP Header Checker</h1>
        <p className="text-[var(--muted)] mb-8">
          Inspect HTTP response headers, check security best practices, and generate curl commands.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Input */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Enter URL to Inspect</h2>
          <form onSubmit={handleCheck} className="flex gap-3 mb-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., example.com or https://your-site.com"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none bg-[var(--bg)] text-[var(--foreground)]"
              required
            />
            <button type="submit" className="btn-primary whitespace-nowrap" disabled={loading}>
              {loading ? "Checking..." : "Check Headers"}
            </button>
          </form>

          {url.trim() && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[var(--muted)]">Curl Command</span>
                <button onClick={copyCurl} className="text-xs text-[var(--primary)] hover:underline">
                  {curlCopied ? "Copied!" : "Copy"}
                </button>
              </div>
              <code className="text-sm font-mono break-all">{getCurlCommand()}</code>
            </div>
          )}

          <p className="text-xs text-[var(--muted)] mt-3">
            Note: Due to browser CORS restrictions, headers may not be visible for cross-origin URLs.
            Use the curl command in your terminal for full header inspection, or check URLs on your own domain.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 mb-8">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="tool-card mb-8">
            <h2 className="text-lg font-bold mb-4">Response Headers</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="result-card text-center">
                <p className="text-lg font-bold">{result.status}</p>
                <p className="text-xs text-[var(--muted)]">Status Code</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm font-bold">{result.statusText}</p>
                <p className="text-xs text-[var(--muted)]">Status</p>
              </div>
            </div>

            {result.isCors ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                CORS restrictions prevent reading headers for this URL. The request was successful but headers
                are hidden. Use the curl command above in your terminal to see all headers.
              </div>
            ) : result.headers.length > 0 ? (
              <div className="space-y-2">
                {result.headers.map((h, i) => {
                  const isSecurityHeader = SECURITY_HEADERS_CHECKLIST.some(
                    (sh) => sh.header.toLowerCase() === h.name.toLowerCase()
                  );
                  return (
                    <div
                      key={i}
                      className="p-3 rounded-lg border text-sm"
                      style={{
                        borderLeftWidth: 4,
                        borderLeftColor: isSecurityHeader ? "#22c55e" : "#e5e7eb",
                      }}
                    >
                      <p className="font-bold font-mono text-xs">{h.name}</p>
                      <p className="font-mono text-xs break-all text-[var(--muted)]">{h.value}</p>
                    </div>
                  );
                })}
                <p className="text-sm text-[var(--muted)] mt-2">
                  {result.headers.length} header{result.headers.length !== 1 ? "s" : ""} found.
                  Green border indicates a recognized security header.
                </p>
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">No headers available.</p>
            )}
          </div>
        )}

        {/* Security Headers Checklist */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">HTTP Headers Reference Checklist</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  categoryFilter === cat
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-[var(--bg)] text-[var(--foreground)] border-gray-300 hover:border-[var(--primary)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2 pr-4">Header</th>
                  <th className="pb-2 pr-4">Category</th>
                  <th className="pb-2 pr-4">Description</th>
                  <th className="pb-2">Example Value</th>
                </tr>
              </thead>
              <tbody>
                {filteredHeaders.map((h) => {
                  const present = result && !result.isCors && result.headers.some(
                    (rh) => rh.name.toLowerCase() === h.header.toLowerCase()
                  );
                  return (
                    <tr key={h.header} className="border-b last:border-0">
                      <td className="py-2 pr-4">
                        <span className="font-mono text-xs font-bold">{h.header}</span>
                        {result && !result.isCors && (
                          <span className={`ml-2 text-xs ${present ? "text-green-500" : "text-red-400"}`}>
                            {present ? "Present" : "Missing"}
                          </span>
                        )}
                      </td>
                      <td className="py-2 pr-4">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          h.category === "Security" ? "bg-red-100 text-red-700" :
                          h.category === "Performance" ? "bg-blue-100 text-blue-700" :
                          h.category === "Cookies" ? "bg-purple-100 text-purple-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {h.category}
                        </span>
                      </td>
                      <td className="py-2 pr-4">{h.description}</td>
                      <td className="py-2 font-mono text-xs break-all">{h.example}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the HTTP Header Checker</h2>
          <p>
            HTTP response headers are metadata sent by web servers along with every response.
            They control caching, security, content type, and more. This tool inspects headers
            for same-origin URLs and generates curl commands for cross-origin inspection.
          </p>

          <h2>Why Check HTTP Headers?</h2>
          <ul>
            <li><strong>Security Audit:</strong> Verify security headers protect against common attacks</li>
            <li><strong>Performance:</strong> Check caching and compression headers are configured</li>
            <li><strong>Debugging:</strong> Inspect content-type, encoding, and server information</li>
            <li><strong>Compliance:</strong> Ensure HSTS, CSP, and other policies are in place</li>
          </ul>

          <h2>Using Curl for Header Inspection</h2>
          <p>
            The <code>curl -I</code> command sends a HEAD request and displays only the response headers.
            Add <code>-L</code> to follow redirects. This is the most reliable way to inspect headers
            from any URL without CORS restrictions.
          </p>

          <h3>Essential Headers for Security</h3>
          <ul>
            <li><strong>HSTS:</strong> Prevents man-in-the-middle attacks by enforcing HTTPS</li>
            <li><strong>CSP:</strong> The most powerful defense against XSS attacks</li>
            <li><strong>Secure Cookies:</strong> Set-Cookie with Secure, HttpOnly, and SameSite flags</li>
            <li><strong>X-Content-Type-Options:</strong> Simple but effective MIME sniffing prevention</li>
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
            name: "HTTP Header Checker",
            description: META.description,
            url: `${SITE_URL}/tools/http-header-checker`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
