"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "HTML Encoder/Decoder - Encode HTML Entities Online Free",
  description:
    "Free HTML encoder and decoder. Convert special characters to HTML entities and back. Encode <, >, &, quotes, and more. Copy results instantly.",
  keywords: "html encoder, html decoder, html entities, encode html, decode html, html special characters, html escape",
};

const ENTITY_TABLE = [
  { char: "<", entity: "&lt;", name: "Less than" },
  { char: ">", entity: "&gt;", name: "Greater than" },
  { char: "&", entity: "&amp;", name: "Ampersand" },
  { char: '"', entity: "&quot;", name: "Double quote" },
  { char: "'", entity: "&#39;", name: "Single quote / Apostrophe" },
  { char: "\u00A0", entity: "&nbsp;", name: "Non-breaking space" },
  { char: "\u00A9", entity: "&copy;", name: "Copyright" },
  { char: "\u00AE", entity: "&reg;", name: "Registered" },
  { char: "\u2122", entity: "&trade;", name: "Trademark" },
  { char: "\u2013", entity: "&ndash;", name: "En dash" },
  { char: "\u2014", entity: "&mdash;", name: "Em dash" },
  { char: "\u2018", entity: "&lsquo;", name: "Left single quote" },
  { char: "\u2019", entity: "&rsquo;", name: "Right single quote" },
  { char: "\u201C", entity: "&ldquo;", name: "Left double quote" },
  { char: "\u201D", entity: "&rdquo;", name: "Right double quote" },
  { char: "\u2022", entity: "&bull;", name: "Bullet" },
  { char: "\u2026", entity: "&hellip;", name: "Ellipsis" },
  { char: "\u00B0", entity: "&deg;", name: "Degree" },
  { char: "\u00B1", entity: "&plusmn;", name: "Plus-minus" },
  { char: "\u00D7", entity: "&times;", name: "Multiplication" },
  { char: "\u00F7", entity: "&divide;", name: "Division" },
];

function encodeHTML(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return ch;
    }
  });
}

function decodeHTML(text: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

export default function HtmlEncoderPage() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function convert() {
    if (!input) return;
    setOutput(mode === "encode" ? encodeHTML(input) : decodeHTML(input));
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/html-encoder`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/html-encoder`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">HTML Encoder / Decoder</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert special characters to HTML entities or decode entities back to characters.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode("encode"); setOutput(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "encode" ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => { setMode("decode"); setOutput(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "decode" ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
            }`}
          >
            Decode
          </button>
        </div>

        <div className="tool-card mb-8">
          <label className="block text-sm font-medium mb-2">
            {mode === "encode" ? "Text to Encode" : "HTML Entities to Decode"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? '<div class="hello">Hello & "World"</div>'
                : "&lt;div class=&quot;hello&quot;&gt;Hello &amp; &quot;World&quot;&lt;/div&gt;"
            }
            rows={6}
            className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono mb-4"
          />

          <button onClick={convert} className="btn-primary w-full">
            {mode === "encode" ? "Encode HTML" : "Decode HTML"}
          </button>
        </div>

        {output && (
          <div className="result-card mb-8">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Result</label>
              <button onClick={copy} className="text-xs text-[var(--primary)]">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              rows={6}
              className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono bg-gray-50"
            />
          </div>
        )}

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Common HTML Entities Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="text-left px-3 py-2 font-medium">Character</th>
                  <th className="text-left px-3 py-2 font-medium">Entity</th>
                  <th className="text-left px-3 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {ENTITY_TABLE.map((e, i) => (
                  <tr key={i} className="border-b border-[var(--card-border)] last:border-b-0">
                    <td className="px-3 py-2 font-mono">{e.char}</td>
                    <td className="px-3 py-2 font-mono text-[var(--primary)]">{e.entity}</td>
                    <td className="px-3 py-2 text-[var(--muted)]">{e.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is HTML Encoding?</h2>
          <p>
            HTML encoding converts special characters like &lt;, &gt;, &amp;, and quotes into their
            HTML entity equivalents. This prevents the browser from interpreting them as HTML tags
            or attributes.
          </p>

          <h2>Why Encode HTML?</h2>
          <ul>
            <li>Prevent XSS (Cross-Site Scripting) attacks</li>
            <li>Display code snippets on web pages</li>
            <li>Safely include user input in HTML</li>
            <li>Ensure special characters render correctly</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            All encoding and decoding happens in your browser. No data is sent to any server.
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
            name: "HTML Encoder/Decoder",
            description: META.description,
            url: `${SITE_URL}/tools/html-encoder`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
