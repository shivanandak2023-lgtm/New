"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Slug Generator - Create URL Slugs Free",
  description:
    "Free online Slug Generator. Convert text to clean URL slugs with customizable separator, max length, and bulk mode. Perfect for SEO-friendly URLs. 100% client-side.",
  keywords:
    "slug generator, url slug, url friendly text, seo slug, permalink generator, url slug maker",
};

function toSlug(text: string, separator: string, maxLength: number): string {
  let slug = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric
    .replace(/\s+/g, separator) // Replace spaces with separator
    .replace(new RegExp(`[${separator.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&")}]+`, "g"), separator) // Collapse multiple separators
    .replace(new RegExp(`^[${separator.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&")}]+`), "") // Trim leading
    .replace(new RegExp(`[${separator.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&")}]+$`), ""); // Trim trailing

  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    // Don't cut in the middle of a word — trim to last separator
    const lastSep = slug.lastIndexOf(separator);
    if (lastSep > 0) {
      slug = slug.substring(0, lastSep);
    }
  }

  return slug;
}

export default function SlugGeneratorPage() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");
  const [maxLength, setMaxLength] = useState(0);
  const [bulkMode, setBulkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    if (bulkMode) {
      return input
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => toSlug(line, separator, maxLength))
        .join("\n");
    }
    return toSlug(input, separator, maxLength);
  }, [input, separator, maxLength, bulkMode]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const slugCount = useMemo(() => {
    if (!output) return 0;
    if (bulkMode) return output.split("\n").filter(Boolean).length;
    return 1;
  }, [output, bulkMode]);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/slug-generator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Slug Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert text to clean, SEO-friendly URL slugs with customizable options.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-semibold">
              {bulkMode ? "Enter text (one per line)" : "Enter text"}
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={bulkMode}
                onChange={(e) => setBulkMode(e.target.checked)}
                className="rounded"
              />
              Bulk Mode
            </label>
          </div>

          {bulkMode ? (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field min-h-[150px] resize-y font-mono text-sm"
              placeholder="How to Build a Website&#10;10 Tips for Better SEO&#10;My Blog Post Title"
            />
          ) : (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field"
              placeholder="e.g. How to Build a Website in 2024"
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Separator</label>
              <div className="flex gap-2">
                {[
                  { label: "Hyphen (-)", value: "-" },
                  { label: "Underscore (_)", value: "_" },
                  { label: "Dot (.)", value: "." },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSeparator(opt.value)}
                    className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                      separator === opt.value
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "border-[var(--border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Max Length {maxLength > 0 ? `(${maxLength} chars)` : "(no limit)"}
              </label>
              <input
                type="range"
                min={0}
                max={200}
                step={5}
                value={maxLength}
                onChange={(e) => setMaxLength(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[var(--muted)]">
                <span>No limit</span>
                <span>200</span>
              </div>
            </div>
          </div>
        </div>

        {output && (
          <div className="result-card mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">
                Generated Slug{slugCount > 1 ? "s" : ""} ({slugCount})
              </h3>
              <button onClick={handleCopy} className="btn-secondary text-sm">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {bulkMode ? (
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)]">
                {output}
              </pre>
            ) : (
              <div className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)]">
                <p className="text-lg font-mono text-[var(--primary)] break-all">{output}</p>
                <p className="text-xs text-[var(--muted)] mt-2">{output.length} characters</p>
              </div>
            )}

            {!bulkMode && (
              <div className="mt-3 tool-card">
                <p className="text-sm text-[var(--muted)]">
                  <strong>Example URL:</strong>{" "}
                  <span className="font-mono text-[var(--foreground)]">
                    https://example.com/{output}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is a Slug Generator?</h2>
          <p>
            A Slug Generator converts regular text into clean, URL-friendly slugs. Slugs are the part of
            a URL that identifies a page in a human-readable way. Good slugs improve SEO and make URLs
            easier to share and understand.
          </p>

          <h2>How Does It Work?</h2>
          <ul>
            <li><strong>Lowercase Conversion:</strong> All text is converted to lowercase for consistency</li>
            <li><strong>Special Character Removal:</strong> Non-alphanumeric characters and diacritics are removed</li>
            <li><strong>Space Replacement:</strong> Spaces are replaced with your chosen separator (hyphen, underscore, or dot)</li>
            <li><strong>Length Control:</strong> Optionally limit slug length without cutting words</li>
            <li><strong>Bulk Mode:</strong> Convert multiple titles to slugs at once</li>
          </ul>

          <h2>Best Practices for URL Slugs</h2>
          <ul>
            <li><strong>Keep it short:</strong> Shorter slugs are easier to read and share</li>
            <li><strong>Use hyphens:</strong> Search engines prefer hyphens over underscores as word separators</li>
            <li><strong>Include keywords:</strong> Place important keywords in your slug for better SEO</li>
            <li><strong>Avoid stop words:</strong> Remove words like "the", "and", "a" when possible</li>
          </ul>

          <h2>Who Uses Slug Generators?</h2>
          <ul>
            <li><strong>Bloggers:</strong> Create SEO-friendly URLs for blog posts</li>
            <li><strong>Web Developers:</strong> Generate clean slugs for dynamic content</li>
            <li><strong>Content Managers:</strong> Ensure consistent URL formatting across websites</li>
            <li><strong>SEO Specialists:</strong> Optimize URL structure for search engine rankings</li>
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
            name: "Slug Generator",
            description: META.description,
            url: `${SITE_URL}/tools/slug-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
