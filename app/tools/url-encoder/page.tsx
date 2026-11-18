"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "URL Encoder/Decoder - Encode URLs Online Free",
  description:
    "Free URL encoder and decoder. Convert text to URL-encoded format (%20, %3A, etc.) and decode URL-encoded strings back to readable text.",
  keywords: "url encoder, url decoder, percent encoding, encode url, decode url, url escape, urlencode",
};

const ENCODING_TABLE = [
  { char: " ", encoded: "%20", desc: "Space" },
  { char: "!", encoded: "%21", desc: "Exclamation" },
  { char: "#", encoded: "%23", desc: "Hash" },
  { char: "$", encoded: "%24", desc: "Dollar" },
  { char: "%", encoded: "%25", desc: "Percent" },
  { char: "&", encoded: "%26", desc: "Ampersand" },
  { char: "'", encoded: "%27", desc: "Apostrophe" },
  { char: "(", encoded: "%28", desc: "Left paren" },
  { char: ")", encoded: "%29", desc: "Right paren" },
  { char: "+", encoded: "%2B", desc: "Plus" },
  { char: ",", encoded: "%2C", desc: "Comma" },
  { char: "/", encoded: "%2F", desc: "Slash" },
  { char: ":", encoded: "%3A", desc: "Colon" },
  { char: ";", encoded: "%3B", desc: "Semicolon" },
  { char: "=", encoded: "%3D", desc: "Equals" },
  { char: "?", encoded: "%3F", desc: "Question mark" },
  { char: "@", encoded: "%40", desc: "At sign" },
  { char: "[", encoded: "%5B", desc: "Left bracket" },
  { char: "]", encoded: "%5D", desc: "Right bracket" },
];

export default function UrlEncoderPage() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [encodeType, setEncodeType] = useState<"component" | "full">("component");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  function convert() {
    if (!input) return;
    setError("");
    try {
      if (mode === "encode") {
        setOutput(
          encodeType === "component" ? encodeURIComponent(input) : encodeURI(input)
        );
      } else {
        setOutput(
          encodeType === "component" ? decodeURIComponent(input) : decodeURI(input)
        );
      }
    } catch {
      setError("Failed to process. Check your input for malformed encoding.");
    }
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
        <link rel="canonical" href={`${SITE_URL}/tools/url-encoder`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">URL Encoder / Decoder</h1>
        <p className="text-[var(--muted)] mb-8">
          Encode text for URLs or decode percent-encoded strings back to readable text.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode("encode"); setOutput(""); setError(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "encode" ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => { setMode("decode"); setOutput(""); setError(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "decode" ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
            }`}
          >
            Decode
          </button>
        </div>

        <div className="tool-card mb-8">
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="encodeType"
                checked={encodeType === "component"}
                onChange={() => setEncodeType("component")}
                className="accent-[var(--primary)]"
              />
              <span className="text-sm">Component (encodes all special chars)</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="encodeType"
                checked={encodeType === "full"}
                onChange={() => setEncodeType("full")}
                className="accent-[var(--primary)]"
              />
              <span className="text-sm">Full URL (preserves :, /, ?, #, etc.)</span>
            </label>
          </div>

          <label className="block text-sm font-medium mb-2">
            {mode === "encode" ? "Text to Encode" : "URL-Encoded Text to Decode"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Hello World! How are you?"
                : "Hello%20World%21%20How%20are%20you%3F"
            }
            rows={5}
            className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono mb-4"
          />

          <button onClick={convert} className="btn-primary w-full">
            {mode === "encode" ? "Encode" : "Decode"}
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

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
              rows={5}
              className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono bg-gray-50"
            />
          </div>
        )}

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Common URL Encoding Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="text-left px-3 py-2 font-medium">Character</th>
                  <th className="text-left px-3 py-2 font-medium">Encoded</th>
                  <th className="text-left px-3 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {ENCODING_TABLE.map((e, i) => (
                  <tr key={i} className="border-b border-[var(--card-border)] last:border-b-0">
                    <td className="px-3 py-2 font-mono">{e.char === " " ? "(space)" : e.char}</td>
                    <td className="px-3 py-2 font-mono text-[var(--primary)]">{e.encoded}</td>
                    <td className="px-3 py-2 text-[var(--muted)]">{e.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is URL Encoding?</h2>
          <p>
            URL encoding (percent-encoding) converts characters that are not allowed in URLs into
            a format using % followed by two hexadecimal digits. For example, spaces become %20.
          </p>

          <h2>When to Use URL Encoding</h2>
          <ul>
            <li>Passing special characters in query parameters</li>
            <li>Encoding file names in URLs</li>
            <li>Building API request URLs</li>
            <li>Encoding form data for submission</li>
          </ul>

          <h2>encodeURI vs encodeURIComponent</h2>
          <p>
            <code>encodeURI()</code> encodes a full URL but preserves characters like :, /, ?, and #
            that have meaning in URLs. <code>encodeURIComponent()</code> encodes everything, making
            it suitable for query parameter values.
          </p>

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
            name: "URL Encoder/Decoder",
            description: META.description,
            url: `${SITE_URL}/tools/url-encoder`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
