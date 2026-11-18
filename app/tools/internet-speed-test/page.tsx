"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Internet Speed Test - Check Connection Speed & Network Info",
  description:
    "Free Internet Speed Test and Connection Info tool. Check your download speed, connection type, latency, and network status. Measure actual download speed in Mbps.",
  keywords: "internet speed test, speed test, connection speed, download speed, network info, bandwidth test",
};

interface ConnectionInfo {
  online: boolean;
  type: string;
  downlink: string;
  effectiveType: string;
  rtt: string;
}

interface SpeedResult {
  speed: number;
  duration: number;
  fileSize: number;
}

export default function InternetSpeedTestPage() {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);
  const [testing, setTesting] = useState(false);
  const [speedResult, setSpeedResult] = useState<SpeedResult | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    function detectConnection() {
      const nav = navigator as Navigator & {
        connection?: {
          type?: string;
          downlink?: number;
          effectiveType?: string;
          rtt?: number;
        };
      };

      const conn = nav.connection;

      setConnectionInfo({
        online: navigator.onLine,
        type: conn?.type || "Unknown",
        downlink: conn?.downlink ? `${conn.downlink} Mbps` : "N/A",
        effectiveType: conn?.effectiveType || "N/A",
        rtt: conn?.rtt !== undefined ? `${conn.rtt} ms` : "N/A",
      });
    }

    detectConnection();
    window.addEventListener("online", detectConnection);
    window.addEventListener("offline", detectConnection);
    return () => {
      window.removeEventListener("online", detectConnection);
      window.removeEventListener("offline", detectConnection);
    };
  }, []);

  async function runSpeedTest() {
    setTesting(true);
    setError("");
    setSpeedResult(null);

    // Fetch a known file and measure download time
    // Using a ~1MB file from a public CDN
    const testUrls = [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/800px-Tsunami_by_hokusai_19th_century.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    ];

    try {
      // Use a random URL to avoid caching
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      const url = testUrls[arr[0] % testUrls.length] + `?nocache=${Date.now()}`;

      const startTime = performance.now();
      const response = await fetch(url, { cache: "no-store" });

      if (!response.ok) throw new Error("Failed to fetch test file");

      const blob = await response.blob();
      const endTime = performance.now();

      const durationMs = endTime - startTime;
      const durationSec = durationMs / 1000;
      const fileSizeBytes = blob.size;
      const fileSizeBits = fileSizeBytes * 8;
      const speedBps = fileSizeBits / durationSec;
      const speedMbps = speedBps / (1024 * 1024);

      setSpeedResult({
        speed: Math.round(speedMbps * 100) / 100,
        duration: Math.round(durationMs),
        fileSize: fileSizeBytes,
      });
    } catch {
      setError(
        "Speed test failed. This could be due to CORS restrictions or network issues. The connection info above still shows your browser's network estimates."
      );
    } finally {
      setTesting(false);
    }
  }

  function getSpeedRating(speed: number): { label: string; color: string } {
    if (speed >= 100) return { label: "Excellent", color: "#22c55e" };
    if (speed >= 50) return { label: "Very Good", color: "#3b82f6" };
    if (speed >= 25) return { label: "Good", color: "#8b5cf6" };
    if (speed >= 10) return { label: "Fair", color: "#f59e0b" };
    return { label: "Slow", color: "#ef4444" };
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/internet-speed-test`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/internet-speed-test`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Internet Speed Test</h1>
        <p className="text-[var(--muted)] mb-8">
          Check your internet connection info and test your download speed.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Connection Info */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Connection Information</h2>

          {connectionInfo ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <div
                  className="w-4 h-4 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: connectionInfo.online ? "#22c55e" : "#ef4444" }}
                />
                <p className="text-lg font-bold">{connectionInfo.online ? "Online" : "Offline"}</p>
                <p className="text-xs text-[var(--muted)]">Status</p>
              </div>
              <div className="result-card text-center">
                <p className="text-lg font-bold capitalize">{connectionInfo.type}</p>
                <p className="text-xs text-[var(--muted)]">Connection Type</p>
              </div>
              <div className="result-card text-center">
                <p className="text-lg font-bold">{connectionInfo.downlink}</p>
                <p className="text-xs text-[var(--muted)]">Est. Downlink</p>
              </div>
              <div className="result-card text-center">
                <p className="text-lg font-bold uppercase">{connectionInfo.effectiveType}</p>
                <p className="text-xs text-[var(--muted)]">Effective Type</p>
              </div>
              <div className="result-card text-center">
                <p className="text-lg font-bold">{connectionInfo.rtt}</p>
                <p className="text-xs text-[var(--muted)]">Round Trip Time</p>
              </div>
            </div>
          ) : (
            <p className="text-[var(--muted)]">Detecting connection info...</p>
          )}

          <p className="text-xs text-[var(--muted)] mb-2">
            Note: Connection type and estimates rely on the Network Information API, which is supported in Chrome and Edge.
            Other browsers may show &quot;N/A&quot; for some values.
          </p>
        </div>

        {/* Speed Test */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Download Speed Test</h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Measures actual download speed by fetching a file and timing the transfer.
          </p>

          <button
            onClick={runSpeedTest}
            disabled={testing}
            className="btn-primary w-full mb-6 disabled:opacity-50"
          >
            {testing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Testing...
              </span>
            ) : (
              "Test Your Speed"
            )}
          </button>

          {error && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 mb-4">
              {error}
            </div>
          )}

          {speedResult && (
            <div>
              <div className="text-center mb-6">
                <p className="text-6xl font-bold" style={{ color: getSpeedRating(speedResult.speed).color }}>
                  {speedResult.speed}
                </p>
                <p className="text-lg text-[var(--muted)]">Mbps</p>
                <p
                  className="text-sm font-medium mt-1"
                  style={{ color: getSpeedRating(speedResult.speed).color }}
                >
                  {getSpeedRating(speedResult.speed).label}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="result-card text-center">
                  <p className="text-lg font-bold">{speedResult.duration} ms</p>
                  <p className="text-xs text-[var(--muted)]">Download Time</p>
                </div>
                <div className="result-card text-center">
                  <p className="text-lg font-bold">{formatBytes(speedResult.fileSize)}</p>
                  <p className="text-xs text-[var(--muted)]">File Size</p>
                </div>
                <div className="result-card text-center">
                  <p className="text-lg font-bold">
                    {(speedResult.speed / 8).toFixed(2)} MB/s
                  </p>
                  <p className="text-xs text-[var(--muted)]">Megabytes/sec</p>
                </div>
              </div>

              {/* Speed comparison */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-3">Speed Comparison</h3>
                {[
                  { label: "Email & Browsing", speed: 5 },
                  { label: "HD Video Streaming", speed: 25 },
                  { label: "4K Video Streaming", speed: 50 },
                  { label: "Online Gaming", speed: 75 },
                  { label: "Heavy Downloads", speed: 100 },
                ].map((item) => {
                  const percent = Math.min((speedResult.speed / item.speed) * 100, 100);
                  return (
                    <div key={item.label} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="text-[var(--muted)]">{item.speed} Mbps needed</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: percent >= 100 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Internet Speed Test</h2>
          <p>
            This tool combines browser-reported network information with an actual download speed test.
            The connection info section uses the Network Information API to display your connection type
            and estimated bandwidth, while the speed test measures real download performance.
          </p>

          <h2>How the Speed Test Works</h2>
          <p>
            The speed test downloads a file from a public CDN and measures the time it takes to complete.
            The download speed in Mbps is calculated as: (file size in bits) / (time in seconds) / (1,024 x 1,024).
          </p>

          <h2>What Speeds Do You Need?</h2>
          <ul>
            <li><strong>1-5 Mbps:</strong> Basic email, web browsing, and social media</li>
            <li><strong>15-25 Mbps:</strong> HD video streaming on one device</li>
            <li><strong>40-100 Mbps:</strong> 4K streaming, gaming, and multiple devices</li>
            <li><strong>200+ Mbps:</strong> Heavy downloads, large file transfers, and multiple 4K streams</li>
          </ul>

          <h3>Connection Types Explained</h3>
          <ul>
            <li><strong>4G:</strong> Mobile broadband with good speed for most tasks</li>
            <li><strong>3G:</strong> Older mobile standard, suitable for basic browsing</li>
            <li><strong>WiFi:</strong> Wireless connection, speed depends on router and plan</li>
            <li><strong>Ethernet:</strong> Wired connection, typically fastest and most stable</li>
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
            name: "Internet Speed Test",
            description: META.description,
            url: `${SITE_URL}/tools/internet-speed-test`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
