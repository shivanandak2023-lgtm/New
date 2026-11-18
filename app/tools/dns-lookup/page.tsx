"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "DNS Lookup - Query DNS Records for Any Domain",
  description:
    "Free DNS lookup tool. Query A, AAAA, CNAME, MX, NS, TXT, and SOA records for any domain using Google DNS. View DNS record types reference.",
  keywords: "dns lookup, dns checker, dns records, mx lookup, a record lookup, domain dns query",
};

interface DNSRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface DNSResult {
  type: string;
  records: DNSRecord[];
  error?: string;
}

const RECORD_TYPES = [
  { type: "A", code: 1, description: "IPv4 address" },
  { type: "AAAA", code: 28, description: "IPv6 address" },
  { type: "CNAME", code: 5, description: "Canonical name (alias)" },
  { type: "MX", code: 15, description: "Mail exchange server" },
  { type: "NS", code: 2, description: "Name server" },
  { type: "TXT", code: 16, description: "Text record (SPF, DKIM, etc.)" },
  { type: "SOA", code: 6, description: "Start of authority" },
];

const REFERENCE_RECORDS = [
  { type: "A", description: "Maps domain to IPv4 address", example: "93.184.216.34" },
  { type: "AAAA", description: "Maps domain to IPv6 address", example: "2606:2800:220:1:..." },
  { type: "CNAME", description: "Alias pointing to another domain", example: "www.example.com -> example.com" },
  { type: "MX", description: "Mail server with priority", example: "10 mail.example.com" },
  { type: "NS", description: "Authoritative name servers", example: "ns1.example.com" },
  { type: "TXT", description: "Arbitrary text (SPF, DKIM, verification)", example: "v=spf1 include:_spf.google.com ~all" },
  { type: "SOA", description: "Zone authority information", example: "ns1.example.com admin.example.com ..." },
  { type: "SRV", description: "Service location record", example: "_sip._tcp.example.com 5060" },
  { type: "PTR", description: "Reverse DNS lookup", example: "34.216.184.93.in-addr.arpa" },
  { type: "CAA", description: "Certificate authority authorization", example: '0 issue "letsencrypt.org"' },
];

export default function DNSLookupPage() {
  const [domain, setDomain] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["A", "AAAA", "CNAME", "MX", "NS", "TXT"]);
  const [results, setResults] = useState<DNSResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleType(type: string) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const d = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!d) return;

    setLoading(true);
    setError("");
    setResults([]);

    const lookupResults: DNSResult[] = [];

    for (const rt of RECORD_TYPES.filter((r) => selectedTypes.includes(r.type))) {
      try {
        const res = await fetch(
          `https://dns.google/resolve?name=${encodeURIComponent(d)}&type=${rt.type}`
        );
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();

        if (data.Answer && data.Answer.length > 0) {
          lookupResults.push({
            type: rt.type,
            records: data.Answer,
          });
        } else {
          lookupResults.push({
            type: rt.type,
            records: [],
            error: data.Comment || "No records found",
          });
        }
      } catch {
        lookupResults.push({
          type: rt.type,
          records: [],
          error: "Query failed",
        });
      }
    }

    setResults(lookupResults);
    setLoading(false);

    if (lookupResults.every((r) => r.records.length === 0)) {
      setError("No DNS records found. Check the domain name and try again.");
    }
  }

  function getRecordTypeName(code: number): string {
    const found = RECORD_TYPES.find((r) => r.code === code);
    return found ? found.type : `Type ${code}`;
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/dns-lookup`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/dns-lookup`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">DNS Lookup</h1>
        <p className="text-[var(--muted)] mb-8">
          Query DNS records for any domain using Google Public DNS.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Input */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Enter Domain</h2>
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g., google.com"
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none bg-[var(--bg)] text-[var(--foreground)]"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap" disabled={loading}>
                {loading ? "Querying..." : "Lookup DNS"}
              </button>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Record Types:</p>
              <div className="flex flex-wrap gap-2">
                {RECORD_TYPES.map((rt) => (
                  <button
                    key={rt.type}
                    type="button"
                    onClick={() => toggleType(rt.type)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      selectedTypes.includes(rt.type)
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "bg-[var(--bg)] text-[var(--foreground)] border-gray-300 hover:border-[var(--primary)]"
                    }`}
                  >
                    {rt.type}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 mb-8">
            {error}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="tool-card mb-8">
            <h2 className="text-lg font-bold mb-4">DNS Records</h2>
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.type} className="result-card">
                  <h3 className="font-bold text-sm mb-2">
                    {result.type} Records
                    <span className="ml-2 text-xs text-[var(--muted)] font-normal">
                      ({result.records.length} found)
                    </span>
                  </h3>
                  {result.records.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left border-b">
                            <th className="pb-2 pr-4">Name</th>
                            <th className="pb-2 pr-4">Type</th>
                            <th className="pb-2 pr-4">TTL</th>
                            <th className="pb-2">Data</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.records.map((rec, i) => (
                            <tr key={i} className="border-b last:border-0">
                              <td className="py-2 pr-4 font-mono text-xs">{rec.name}</td>
                              <td className="py-2 pr-4">{getRecordTypeName(rec.type)}</td>
                              <td className="py-2 pr-4">{rec.TTL}s</td>
                              <td className="py-2 font-mono text-xs break-all">{rec.data}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--muted)]">{result.error || "No records found"}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reference Table */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">DNS Record Types Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4">Description</th>
                  <th className="pb-2">Example</th>
                </tr>
              </thead>
              <tbody>
                {REFERENCE_RECORDS.map((rec) => (
                  <tr key={rec.type} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-bold">{rec.type}</td>
                    <td className="py-2 pr-4">{rec.description}</td>
                    <td className="py-2 font-mono text-xs break-all">{rec.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About DNS Lookup</h2>
          <p>
            DNS (Domain Name System) is the internet&apos;s phone book, translating human-readable domain names
            into IP addresses. This tool queries Google Public DNS (dns.google) to retrieve DNS records
            for any domain name.
          </p>

          <h2>Common DNS Record Types</h2>
          <ul>
            <li><strong>A Record:</strong> Maps a domain to an IPv4 address (most fundamental record)</li>
            <li><strong>AAAA Record:</strong> Maps a domain to an IPv6 address</li>
            <li><strong>MX Record:</strong> Specifies mail servers that handle email for the domain</li>
            <li><strong>CNAME Record:</strong> Creates an alias from one domain to another</li>
            <li><strong>TXT Record:</strong> Holds text data for SPF, DKIM, domain verification</li>
            <li><strong>NS Record:</strong> Identifies the authoritative name servers for a domain</li>
          </ul>

          <h2>Why DNS Matters</h2>
          <ul>
            <li><strong>Website Access:</strong> DNS resolves your domain to the correct server IP</li>
            <li><strong>Email Delivery:</strong> MX records direct email to the right mail server</li>
            <li><strong>Security:</strong> TXT records verify domain ownership and email authentication</li>
            <li><strong>Performance:</strong> TTL values control how long DNS results are cached</li>
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
            name: "DNS Lookup",
            description: META.description,
            url: `${SITE_URL}/tools/dns-lookup`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
