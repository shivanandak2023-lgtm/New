"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "XML Sitemap Generator - Create Sitemaps Free",
  description:
    "Free online XML Sitemap Generator. Paste your URLs, set priority and change frequency, then generate a valid XML sitemap. Copy or download the file. 100% client-side.",
  keywords:
    "xml sitemap generator, sitemap maker, create sitemap, sitemap.xml generator, seo sitemap tool, website sitemap",
};

interface SitemapEntry {
  id: number;
  url: string;
  priority: string;
  changefreq: string;
}

let entryIdCounter = 1;

const CHANGEFREQ_OPTIONS = [
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateSitemap(entries: SitemapEntry[]): string {
  const validEntries = entries.filter((e) => e.url.trim());
  if (validEntries.length === 0) {
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>';
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const entry of validEntries) {
    xml += "  <url>\n";
    xml += `    <loc>${escapeXml(entry.url.trim())}</loc>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    xml += "  </url>\n";
  }

  xml += "</urlset>";
  return xml;
}

export default function XmlSitemapGeneratorPage() {
  const [entries, setEntries] = useState<SitemapEntry[]>([
    { id: entryIdCounter++, url: "", priority: "0.8", changefreq: "weekly" },
  ]);
  const [bulkUrls, setBulkUrls] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [copied, setCopied] = useState(false);

  const output = generateSitemap(entries);
  const urlCount = entries.filter((e) => e.url.trim()).length;

  const addEntry = () => {
    setEntries([
      ...entries,
      { id: entryIdCounter++, url: "", priority: "0.8", changefreq: "weekly" },
    ]);
  };

  const removeEntry = (id: number) => {
    if (entries.length <= 1) return;
    setEntries(entries.filter((e) => e.id !== id));
  };

  const updateEntry = (id: number, field: keyof SitemapEntry, value: string) => {
    setEntries(entries.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const handleBulkAdd = () => {
    const urls = bulkUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    if (urls.length === 0) return;
    const newEntries: SitemapEntry[] = urls.map((url) => ({
      id: entryIdCounter++,
      url,
      priority: "0.8",
      changefreq: "weekly",
    }));
    setEntries([...entries, ...newEntries]);
    setBulkUrls("");
    setShowBulk(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/xml-sitemap-generator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">XML Sitemap Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Generate valid XML sitemaps with custom priority and change frequency per URL.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">URLs ({urlCount})</h3>
            <button
              onClick={() => setShowBulk(!showBulk)}
              className="btn-secondary text-sm"
            >
              {showBulk ? "Hide Bulk Add" : "Bulk Add URLs"}
            </button>
          </div>

          {showBulk && (
            <div className="mb-4 border border-[var(--border)] rounded-lg p-3">
              <label className="block text-sm font-semibold mb-2">Paste URLs (one per line)</label>
              <textarea
                value={bulkUrls}
                onChange={(e) => setBulkUrls(e.target.value)}
                className="input-field min-h-[120px] resize-y font-mono text-sm"
                placeholder="https://example.com/&#10;https://example.com/about&#10;https://example.com/contact"
              />
              <button onClick={handleBulkAdd} className="btn-primary mt-2 text-sm">
                Add URLs
              </button>
            </div>
          )}

          {entries.map((entry) => (
            <div
              key={entry.id}
              className="border border-[var(--border)] rounded-lg p-3 mb-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_120px_auto] gap-2 items-end">
                <div>
                  <label className="block text-xs font-medium mb-1">URL</label>
                  <input
                    type="url"
                    value={entry.url}
                    onChange={(e) => updateEntry(entry.id, "url", e.target.value)}
                    className="input-field text-sm"
                    placeholder="https://example.com/page"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Priority</label>
                  <select
                    value={entry.priority}
                    onChange={(e) => updateEntry(entry.id, "priority", e.target.value)}
                    className="input-field text-sm"
                  >
                    {["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1", "0.0"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Frequency</label>
                  <select
                    value={entry.changefreq}
                    onChange={(e) => updateEntry(entry.id, "changefreq", e.target.value)}
                    className="input-field text-sm"
                  >
                    {CHANGEFREQ_OPTIONS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  {entries.length > 1 && (
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="text-red-500 text-sm hover:underline px-2 py-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button onClick={addEntry} className="btn-secondary text-sm mt-2">
            + Add URL
          </button>
        </div>

        <div className="result-card mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Generated Sitemap</h3>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="btn-secondary text-sm">
                {copied ? "Copied!" : "Copy"}
              </button>
              <button onClick={handleDownload} className="btn-primary text-sm">
                Download
              </button>
            </div>
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)] overflow-x-auto max-h-[400px] overflow-y-auto">
            {output}
          </pre>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is an XML Sitemap?</h2>
          <p>
            An XML Sitemap is a file that lists all important URLs on your website, helping search engines
            discover and crawl your content more efficiently. It includes metadata like change frequency
            and priority to guide search engine crawlers.
          </p>

          <h2>How to Use This Tool</h2>
          <ul>
            <li><strong>Add URLs:</strong> Enter your website pages one by one or use bulk add to paste multiple URLs</li>
            <li><strong>Set Priority:</strong> Indicate relative importance of each page (0.0 to 1.0)</li>
            <li><strong>Set Frequency:</strong> Tell crawlers how often each page changes</li>
            <li><strong>Download:</strong> Save the generated sitemap.xml file to upload to your server</li>
          </ul>

          <h2>Who Uses XML Sitemap Generators?</h2>
          <ul>
            <li><strong>SEO Specialists:</strong> Ensure all pages are discoverable by search engines</li>
            <li><strong>Web Developers:</strong> Generate sitemaps for static sites and small projects</li>
            <li><strong>Website Owners:</strong> Improve search engine indexing of their content</li>
            <li><strong>Digital Marketers:</strong> Maintain proper technical SEO foundations</li>
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
            name: "XML Sitemap Generator",
            description: META.description,
            url: `${SITE_URL}/tools/xml-sitemap-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
