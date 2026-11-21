"use client";

import { useState, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "UUID/GUID Generator - Generate Random UUIDs Online Free",
  description:
    "Generate UUID v4 (random) instantly. Create single or bulk UUIDs in multiple formats — standard, no hyphens, uppercase, lowercase, braces. Copy or download results.",
  keywords: "uuid generator, guid generator, random uuid online, uuid v4, generate uuid, bulk uuid generator, unique identifier",
};

type UUIDFormat = "standard" | "no-hyphens" | "uppercase" | "braces";

function generateUUIDv4(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

function formatUUID(uuid: string, fmt: UUIDFormat): string {
  switch (fmt) {
    case "standard":
      return uuid;
    case "no-hyphens":
      return uuid.replace(/-/g, "");
    case "uppercase":
      return uuid.toUpperCase();
    case "braces":
      return `{${uuid}}`;
    default:
      return uuid;
  }
}

export default function UUIDGeneratorPage() {
  const [count, setCount] = useState(1);
  const [format, setFormat] = useState<UUIDFormat>("standard");
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = useCallback(() => {
    const n = Math.max(1, Math.min(100, count));
    const result: string[] = [];
    for (let i = 0; i < n; i++) {
      result.push(formatUUID(generateUUIDv4(), format));
    }
    setUuids(result);
    setCopiedIndex(null);
    setCopiedAll(false);
  }, [count, format]);

  function copySingle(index: number) {
    navigator.clipboard.writeText(uuids[index]);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  function copyAll() {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  function download() {
    if (uuids.length === 0) return;
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "uuids.txt";
    a.click();
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/uuid-generator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="/tools/uuid-generator" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">UUID/GUID Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Generate cryptographically random UUID v4 identifiers. Create single or bulk UUIDs in multiple formats.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">How many UUIDs (1-100)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as UUIDFormat)}
                className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
              >
                <option value="standard">Standard (with hyphens)</option>
                <option value="no-hyphens">No Hyphens</option>
                <option value="uppercase">Uppercase</option>
                <option value="braces">With Braces &#123;...&#125;</option>
              </select>
            </div>
          </div>

          <button onClick={generate} className="btn-primary w-full">
            Generate UUID{count > 1 ? "s" : ""}
          </button>
        </div>

        {uuids.length > 0 && (
          <div className="result-card mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium">Generated UUID{uuids.length > 1 ? "s" : ""} ({uuids.length})</label>
              <div className="flex gap-2">
                {uuids.length > 1 && (
                  <button onClick={copyAll} className="text-xs text-[var(--primary)]">
                    {copiedAll ? "Copied!" : "Copy All"}
                  </button>
                )}
                <button onClick={download} className="text-xs text-[var(--primary)]">
                  Download .txt
                </button>
              </div>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {uuids.map((uuid, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 border border-[var(--card-border)] rounded-lg px-3 py-2">
                  <code className="text-sm font-mono break-all">{uuid}</code>
                  <button
                    onClick={() => copySingle(i)}
                    className="text-xs text-[var(--primary)] ml-2 whitespace-nowrap"
                  >
                    {copiedIndex === i ? "Copied!" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is a UUID?</h2>
          <p>
            A UUID (Universally Unique Identifier), also known as a GUID (Globally Unique Identifier),
            is a 128-bit label used to uniquely identify information in computer systems. UUIDs are
            standardized by RFC 4122 and are widely used in databases, distributed systems, and software
            development to create identifiers that are unique across space and time without requiring
            a central authority.
          </p>

          <h2>UUID Version 4 (Random)</h2>
          <p>
            This generator creates UUID v4, which uses cryptographically secure random numbers. Each
            UUID v4 contains 122 random bits, with 6 bits reserved for version and variant information.
            The standard format is <code>xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code> where x is a
            random hex digit and y is one of 8, 9, A, or B. The probability of generating a duplicate
            UUID v4 is astronomically low — you would need to generate approximately 2.71 quintillion
            UUIDs to have a 50% chance of a single collision.
          </p>

          <h2>UUID Formats Explained</h2>
          <p>
            The <strong>standard format</strong> includes hyphens separating the five groups (8-4-4-4-12):
            for example, <code>550e8400-e29b-41d4-a716-446655440000</code>. The <strong>no-hyphens</strong>
            format removes all dashes, producing a compact 32-character hex string ideal for use in URLs
            or file names. The <strong>uppercase</strong> format converts the standard form to capital letters
            as required by some systems like Microsoft&apos;s COM. The <strong>braces format</strong> wraps
            the UUID in curly braces, which is the convention used in Windows registry entries and some
            programming frameworks.
          </p>

          <h2>Common Use Cases for UUIDs</h2>
          <ul>
            <li>Database primary keys in distributed systems (PostgreSQL, MongoDB, DynamoDB)</li>
            <li>Session tokens and authentication identifiers</li>
            <li>Microservice request correlation and tracing</li>
            <li>File naming to prevent collisions in cloud storage</li>
            <li>Message queue deduplication in event-driven architectures</li>
            <li>API idempotency keys to prevent duplicate transactions</li>
          </ul>

          <h2>Why Use Cryptographic Randomness?</h2>
          <p>
            This tool uses <code>crypto.getRandomValues()</code>, which provides cryptographically secure
            pseudo-random numbers from the browser&apos;s built-in CSPRNG (Cryptographically Secure
            Pseudo-Random Number Generator). Unlike <code>Math.random()</code>, which may produce
            predictable sequences, crypto-grade randomness ensures your UUIDs cannot be guessed or
            predicted, making them safe for security-sensitive applications like session tokens and
            API keys.
          </p>

          <h2>Bulk UUID Generation</h2>
          <p>
            Need multiple unique identifiers at once? This generator supports bulk creation of up to
            100 UUIDs in a single click. You can copy all UUIDs to your clipboard or download them
            as a text file, with one UUID per line, ready to import into databases, configuration
            files, or test scripts. All generation and formatting happens entirely in your browser
            — no data is sent to any server, ensuring complete privacy.
          </p>

          <h2>Privacy and Security</h2>
          <p>
            All UUID generation is performed locally in your browser using the Web Crypto API. No data
            is transmitted to external servers. Your generated UUIDs are never stored, logged, or
            tracked. This makes the tool safe for generating identifiers for sensitive applications.
          </p>
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "UUID/GUID Generator",
            description: META.description,
            url: `${SITE_URL}/tools/uuid-generator`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
