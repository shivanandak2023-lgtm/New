"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Ping Test - Measure Website Response Time & Latency",
  description:
    "Free online ping test tool. Measure HTTP response time to any URL with min, max, and average latency stats. Run multiple pings and view detailed results.",
  keywords: "ping test, ping tool, latency test, response time checker, website speed test, ping online",
};

interface PingResult {
  attempt: number;
  url: string;
  status: number;
  statusText: string;
  time: number;
  headersCount: number;
  error?: string;
}

interface PingStats {
  min: number;
  max: number;
  avg: number;
  successful: number;
  failed: number;
}

export default function PingTestPage() {
  const [url, setUrl] = useState("");
  const [pingCount, setPingCount] = useState(5);
  const [results, setResults] = useState<PingResult[]>([]);
  const [stats, setStats] = useState<PingStats | null>(null);
  const [loading, setLoading] = useState(false);

  function normalizeUrl(input: string): string {
    let u = input.trim();
    if (!u.startsWith("http://") && !u.startsWith("https://")) {
      u = "https://" + u;
    }
    return u;
  }

  async function singlePing(targetUrl: string, attempt: number): Promise<PingResult> {
    const startTime = performance.now();
    try {
      const res = await fetch(targetUrl, {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-store",
      });
      const endTime = performance.now();
      const time = Math.round(endTime - startTime);

      // In no-cors mode, response is opaque (status 0)
      // If we get here, the request succeeded
      const headersCount = res.type === "opaque" ? 0 : Array.from(res.headers).length;

      return {
        attempt,
        url: targetUrl,
        status: res.type === "opaque" ? 200 : res.status,
        statusText: res.type === "opaque" ? "OK (opaque)" : res.statusText || "OK",
        time,
        headersCount,
      };
    } catch {
      const endTime = performance.now();
      return {
        attempt,
        url: targetUrl,
        status: 0,
        statusText: "Failed",
        time: Math.round(endTime - startTime),
        headersCount: 0,
        error: "Request failed (CORS or network error)",
      };
    }
  }

  async function runPing(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setResults([]);
    setStats(null);

    const targetUrl = normalizeUrl(url);
    const allResults: PingResult[] = [];

    for (let i = 1; i <= pingCount; i++) {
      const result = await singlePing(targetUrl, i);
      allResults.push(result);
      setResults([...allResults]);
    }

    const successful = allResults.filter((r) => !r.error);
    const failed = allResults.filter((r) => r.error);

    if (successful.length > 0) {
      const times = successful.map((r) => r.time);
      setStats({
        min: Math.min(...times),
        max: Math.max(...times),
        avg: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
        successful: successful.length,
        failed: failed.length,
      });
    }

    setLoading(false);
  }

  function getLatencyColor(ms: number): string {
    if (ms < 100) return "#22c55e";
    if (ms < 300) return "#f59e0b";
    return "#ef4444";
  }

  function getLatencyLabel(ms: number): string {
    if (ms < 50) return "Excellent";
    if (ms < 100) return "Good";
    if (ms < 300) return "Fair";
    return "Slow";
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/ping-test`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/ping-test`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Ping Test</h1>
        <p className="text-[var(--muted)] mb-8">
          Measure HTTP response time to any URL with multiple pings and statistics.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Input */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Enter URL to Ping</h2>
          <form onSubmit={runPing} className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g., google.com or https://example.com"
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none bg-[var(--bg)] text-[var(--foreground)]"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap" disabled={loading}>
                {loading ? "Pinging..." : "Start Ping"}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Number of pings:</label>
              <select
                value={pingCount}
                onChange={(e) => setPingCount(Number(e.target.value))}
                className="px-3 py-1 border rounded-lg bg-[var(--bg)] text-[var(--foreground)]"
              >
                {[3, 5, 10, 15, 20].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </form>

          <p className="text-xs text-[var(--muted)] mt-3">
            Note: This measures HTTP request time using the Fetch API. Due to browser CORS restrictions,
            responses may appear as &quot;opaque&quot; but timing is still measured accurately.
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="tool-card mb-8">
            <h2 className="text-lg font-bold mb-4">Ping Statistics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="result-card text-center">
                <p className="text-2xl font-bold" style={{ color: getLatencyColor(stats.min) }}>
                  {stats.min} ms
                </p>
                <p className="text-xs text-[var(--muted)]">Min</p>
              </div>
              <div className="result-card text-center">
                <p className="text-2xl font-bold" style={{ color: getLatencyColor(stats.avg) }}>
                  {stats.avg} ms
                </p>
                <p className="text-xs text-[var(--muted)]">Average</p>
              </div>
              <div className="result-card text-center">
                <p className="text-2xl font-bold" style={{ color: getLatencyColor(stats.max) }}>
                  {stats.max} ms
                </p>
                <p className="text-xs text-[var(--muted)]">Max</p>
              </div>
              <div className="result-card text-center">
                <p className="text-2xl font-bold text-green-500">{stats.successful}</p>
                <p className="text-xs text-[var(--muted)]">Successful</p>
              </div>
              <div className="result-card text-center">
                <p className="text-2xl font-bold text-red-500">{stats.failed}</p>
                <p className="text-xs text-[var(--muted)]">Failed</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm font-medium" style={{ color: getLatencyColor(stats.avg) }}>
                Rating: {getLatencyLabel(stats.avg)}
              </p>
            </div>
          </div>
        )}

        {/* Individual Results */}
        {results.length > 0 && (
          <div className="tool-card mb-8">
            <h2 className="text-lg font-bold mb-4">Individual Pings</h2>
            <div className="space-y-2">
              {results.map((r) => (
                <div
                  key={r.attempt}
                  className="flex items-center justify-between p-3 rounded-lg border text-sm"
                  style={{ borderLeftWidth: 4, borderLeftColor: r.error ? "#ef4444" : getLatencyColor(r.time) }}
                >
                  <span className="font-medium">Ping #{r.attempt}</span>
                  <span className="text-[var(--muted)]">
                    {r.error ? r.error : `Status: ${r.status} ${r.statusText}`}
                  </span>
                  <span className="font-bold font-mono" style={{ color: r.error ? "#ef4444" : getLatencyColor(r.time) }}>
                    {r.time} ms
                  </span>
                </div>
              ))}
            </div>

            {/* Visual bar chart */}
            {results.length > 1 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-3">Response Time Chart</h3>
                <div className="space-y-2">
                  {results.map((r) => {
                    const maxTime = Math.max(...results.map((x) => x.time), 1);
                    const percent = (r.time / maxTime) * 100;
                    return (
                      <div key={r.attempt} className="flex items-center gap-3">
                        <span className="text-xs w-8 text-right">#{r.attempt}</span>
                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: r.error ? "#ef4444" : getLatencyColor(r.time),
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono w-16 text-right">{r.time} ms</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Ping Test</h2>
          <p>
            This tool measures HTTP response time to any URL by sending fetch requests and measuring
            round-trip time. While it cannot perform traditional ICMP ping from a browser, HTTP timing
            provides a reliable measure of server responsiveness and network latency.
          </p>

          <h2>Understanding Ping Times</h2>
          <ul>
            <li><strong>Under 50ms:</strong> Excellent response time, typical for nearby servers</li>
            <li><strong>50-100ms:</strong> Good response time, suitable for most applications</li>
            <li><strong>100-300ms:</strong> Fair, may affect real-time applications like gaming</li>
            <li><strong>Over 300ms:</strong> Slow, noticeable lag in interactive applications</li>
          </ul>

          <h2>Factors Affecting Latency</h2>
          <ul>
            <li><strong>Distance:</strong> Physical distance between you and the server</li>
            <li><strong>Network Congestion:</strong> Heavy traffic on the network path</li>
            <li><strong>Server Load:</strong> How busy the target server is</li>
            <li><strong>DNS Resolution:</strong> First request may include DNS lookup time</li>
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
            name: "Ping Test",
            description: META.description,
            url: `${SITE_URL}/tools/ping-test`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
