"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "WHOIS Lookup - Domain Info, Registration & TLD Reference",
  description:
    "Free WHOIS and domain info lookup tool. Check domain availability, view registration links, and explore common TLD information. Look up any domain instantly.",
  keywords: "whois lookup, domain lookup, domain info, domain registration, whois search, domain check",
};

interface DomainCheckResult {
  domain: string;
  resolves: boolean;
  error?: string;
  checkedAt: string;
}

const TLD_INFO = [
  { tld: ".com", type: "Generic", registrar: "Verisign", description: "Commercial, most popular TLD worldwide", avgPrice: "$10-15/yr" },
  { tld: ".org", type: "Generic", registrar: "PIR", description: "Organizations, non-profits", avgPrice: "$10-12/yr" },
  { tld: ".net", type: "Generic", registrar: "Verisign", description: "Network infrastructure, tech companies", avgPrice: "$10-15/yr" },
  { tld: ".io", type: "ccTLD", registrar: "NIC.io", description: "Tech startups, SaaS products", avgPrice: "$30-50/yr" },
  { tld: ".dev", type: "Generic", registrar: "Google", description: "Developers, requires HTTPS", avgPrice: "$12-16/yr" },
  { tld: ".app", type: "Generic", registrar: "Google", description: "Applications, requires HTTPS", avgPrice: "$12-16/yr" },
  { tld: ".co", type: "ccTLD", registrar: "Colombia", description: "Companies, short alternative to .com", avgPrice: "$25-35/yr" },
  { tld: ".ai", type: "ccTLD", registrar: "Anguilla", description: "Artificial intelligence companies", avgPrice: "$50-90/yr" },
  { tld: ".me", type: "ccTLD", registrar: "Montenegro", description: "Personal sites, portfolios", avgPrice: "$15-20/yr" },
  { tld: ".info", type: "Generic", registrar: "Afilias", description: "Informational websites", avgPrice: "$5-10/yr" },
  { tld: ".xyz", type: "Generic", registrar: "XYZ.COM", description: "General purpose, popular budget TLD", avgPrice: "$2-10/yr" },
  { tld: ".tech", type: "Generic", registrar: "Radix", description: "Technology companies and blogs", avgPrice: "$40-55/yr" },
  { tld: ".site", type: "Generic", registrar: "Radix", description: "General websites", avgPrice: "$3-10/yr" },
  { tld: ".online", type: "Generic", registrar: "Radix", description: "Online businesses and services", avgPrice: "$3-10/yr" },
  { tld: ".store", type: "Generic", registrar: "Radix", description: "E-commerce and retail", avgPrice: "$40-55/yr" },
];

export default function WhoisLookupPage() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<DomainCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [tldFilter, setTldFilter] = useState("");

  function cleanDomain(input: string): string {
    return input.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
  }

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    const d = cleanDomain(domain);
    if (!d) return;

    setLoading(true);
    setResult(null);

    let resolves = false;
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(d)}&type=A`);
      const data = await res.json();
      resolves = !!(data.Answer && data.Answer.length > 0);
    } catch {
      // DNS check failed
    }

    const now = new Date();
    setResult({
      domain: d,
      resolves,
      checkedAt: now.toLocaleString(),
    });
    setLoading(false);
  }

  const filteredTLDs = TLD_INFO.filter(
    (t) =>
      t.tld.toLowerCase().includes(tldFilter.toLowerCase()) ||
      t.description.toLowerCase().includes(tldFilter.toLowerCase()) ||
      t.type.toLowerCase().includes(tldFilter.toLowerCase())
  );

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/whois-lookup`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/whois-lookup`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">WHOIS / Domain Info Lookup</h1>
        <p className="text-[var(--muted)] mb-8">
          Check domain status, look up WHOIS records via external services, and explore TLD information.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Domain Input */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Check a Domain</h2>
          <form onSubmit={handleCheck} className="flex gap-3">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., example.com"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none bg-[var(--bg)] text-[var(--foreground)]"
              required
            />
            <button type="submit" className="btn-primary whitespace-nowrap" disabled={loading}>
              {loading ? "Checking..." : "Check Domain"}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="tool-card mb-8">
            <h2 className="text-lg font-bold mb-4">
              Results for <span className="font-mono text-[var(--primary)]">{result.domain}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <div
                  className="w-4 h-4 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: result.resolves ? "#22c55e" : "#ef4444" }}
                />
                <p className="text-lg font-bold">
                  {result.resolves ? "Resolves (Active)" : "Does Not Resolve"}
                </p>
                <p className="text-xs text-[var(--muted)]">DNS Status</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm font-bold">{result.checkedAt}</p>
                <p className="text-xs text-[var(--muted)]">Checked At</p>
              </div>
            </div>

            <h3 className="font-bold text-sm mb-3">Look Up Full WHOIS Records</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`https://who.is/whois/${result.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-[var(--primary)]"
              >
                who.is &rarr;
              </a>
              <a
                href={`https://whois.domaintools.com/${result.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-[var(--primary)]"
              >
                DomainTools &rarr;
              </a>
              <a
                href={`https://www.icann.org/lookup#${result.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-[var(--primary)]"
              >
                ICANN Lookup &rarr;
              </a>
              <a
                href={`https://lookup.icann.org/en/lookup?name=${result.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-[var(--primary)]"
              >
                ICANN RDAP &rarr;
              </a>
            </div>

            <p className="text-xs text-[var(--muted)] mt-4">
              Note: Direct WHOIS queries cannot be made from a browser. Use the links above to view full
              registration details including registrar, creation date, expiration date, and nameservers.
            </p>
          </div>
        )}

        {/* TLD Reference Table */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Common TLD Reference</h2>
          <input
            type="text"
            value={tldFilter}
            onChange={(e) => setTldFilter(e.target.value)}
            placeholder="Filter TLDs..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none mb-4 bg-[var(--bg)] text-[var(--foreground)]"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2 pr-4">TLD</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4">Description</th>
                  <th className="pb-2">Avg. Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredTLDs.map((t) => (
                  <tr key={t.tld} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-bold font-mono">{t.tld}</td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        t.type === "Generic" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-2 pr-4">{t.description}</td>
                    <td className="py-2 font-mono text-xs">{t.avgPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About WHOIS Lookup</h2>
          <p>
            WHOIS is a query protocol that provides registration information about domain names,
            including the registrar, registration and expiration dates, nameservers, and sometimes
            registrant contact information. Due to GDPR and privacy regulations, many WHOIS records
            now redact personal contact details.
          </p>

          <h2>What WHOIS Records Contain</h2>
          <ul>
            <li><strong>Registrar:</strong> The company where the domain was registered</li>
            <li><strong>Registration Date:</strong> When the domain was first registered</li>
            <li><strong>Expiration Date:</strong> When the domain registration expires</li>
            <li><strong>Nameservers:</strong> DNS servers that host the domain&apos;s records</li>
            <li><strong>Status Codes:</strong> Domain status flags (clientTransferProhibited, etc.)</li>
          </ul>

          <h2>Choosing a TLD</h2>
          <ul>
            <li><strong>.com:</strong> Best for global businesses and brand recognition</li>
            <li><strong>.io / .dev:</strong> Popular for tech startups and developer tools</li>
            <li><strong>.org:</strong> Ideal for non-profits and open-source projects</li>
            <li><strong>Country TLDs:</strong> Good for region-specific businesses (.co.uk, .de, .in)</li>
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
            name: "WHOIS / Domain Info Lookup",
            description: META.description,
            url: `${SITE_URL}/tools/whois-lookup`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
