"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "IP Lookup - Find IP Address Location, ISP & Details",
  description:
    "Free IP address lookup tool. Find geolocation, ISP, timezone, country, city, and organization for any IP address. Auto-detects your own IP on load.",
  keywords: "ip lookup, ip geolocation, ip location finder, ip address details, ip to location, ip info",
};

interface IPData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  org: string;
  asn: string;
  country_calling_code: string;
  currency: string;
  languages: string;
}

export default function IPLookupPage() {
  const [ipInput, setIpInput] = useState("");
  const [ipData, setIpData] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    lookupIP("");
  }, []);

  async function lookupIP(ip: string) {
    setLoading(true);
    setError("");
    setIpData(null);

    try {
      const url = ip
        ? `https://ipapi.co/${ip}/json/`
        : "https://ipapi.co/json/";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Lookup failed");
      const data = await res.json();
      if (data.error) throw new Error(data.reason || "Invalid IP address");
      setIpData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not look up IP address. Please check the IP and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    lookupIP(ipInput.trim());
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/ip-lookup`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">IP Address Lookup</h1>
        <p className="text-[var(--muted)] mb-8">
          Find detailed geolocation and network information for any IP address.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Input */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Look Up an IP Address</h2>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="Enter IP address (e.g., 8.8.8.8) or leave blank for yours"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none bg-[var(--bg)] text-[var(--foreground)]"
            />
            <button type="submit" className="btn-primary whitespace-nowrap" disabled={loading}>
              {loading ? "Looking up..." : "Lookup"}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 mb-8">
            {error}
          </div>
        )}

        {/* Results */}
        {ipData && (
          <div className="tool-card mb-8">
            <h2 className="text-lg font-bold mb-4">
              Results for <span className="font-mono text-[var(--primary)]">{ipData.ip}</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Country", value: `${ipData.country_name} (${ipData.country_code})` },
                { label: "Region", value: ipData.region || "N/A" },
                { label: "City", value: ipData.city || "N/A" },
                { label: "Postal Code", value: ipData.postal || "N/A" },
                { label: "Latitude", value: ipData.latitude?.toString() || "N/A" },
                { label: "Longitude", value: ipData.longitude?.toString() || "N/A" },
                { label: "Timezone", value: ipData.timezone || "N/A" },
                { label: "UTC Offset", value: ipData.utc_offset || "N/A" },
                { label: "Organization", value: ipData.org || "N/A" },
                { label: "ASN", value: ipData.asn || "N/A" },
                { label: "Calling Code", value: ipData.country_calling_code || "N/A" },
                { label: "Currency", value: ipData.currency || "N/A" },
              ].map((item) => (
                <div key={item.label} className="result-card text-center">
                  <p className="text-sm font-bold truncate" title={item.value}>{item.value}</p>
                  <p className="text-xs text-[var(--muted)]">{item.label}</p>
                </div>
              ))}
            </div>

            {ipData.latitude && ipData.longitude && (
              <div className="mt-4">
                <a
                  href={`https://www.openstreetmap.org/?mlat=${ipData.latitude}&mlon=${ipData.longitude}#map=10/${ipData.latitude}/${ipData.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  View on OpenStreetMap &rarr;
                </a>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About IP Address Lookup</h2>
          <p>
            An IP address lookup reveals geographic and organizational information associated with an IP address.
            This tool uses the ipapi.co API to provide accurate geolocation data including country, city, region,
            ISP, timezone, and coordinates.
          </p>

          <h2>What Information Can an IP Reveal?</h2>
          <ul>
            <li><strong>Location:</strong> Country, region, city, and approximate coordinates</li>
            <li><strong>Network:</strong> ISP name, organization, and ASN (Autonomous System Number)</li>
            <li><strong>Timezone:</strong> The timezone and UTC offset of the IP location</li>
            <li><strong>Country Details:</strong> Calling code, currency, and languages</li>
          </ul>

          <h2>Common Use Cases</h2>
          <ul>
            <li><strong>Security:</strong> Identify the origin of suspicious traffic or login attempts</li>
            <li><strong>Geolocation:</strong> Verify VPN connections or check server locations</li>
            <li><strong>Network Debugging:</strong> Verify IP routing and network configuration</li>
            <li><strong>Compliance:</strong> Check if traffic originates from expected regions</li>
          </ul>

          <h3>IP Address Classes</h3>
          <ul>
            <li><strong>Class A:</strong> 1.0.0.0 to 126.255.255.255 (large networks)</li>
            <li><strong>Class B:</strong> 128.0.0.0 to 191.255.255.255 (medium networks)</li>
            <li><strong>Class C:</strong> 192.0.0.0 to 223.255.255.255 (small networks)</li>
            <li><strong>Private:</strong> 10.x.x.x, 172.16-31.x.x, 192.168.x.x (local only)</li>
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
            name: "IP Address Lookup",
            description: META.description,
            url: `${SITE_URL}/tools/ip-lookup`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
