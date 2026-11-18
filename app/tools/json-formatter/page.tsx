"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "JSON Formatter - Format & Validate JSON Online",
  description:
    "Free JSON Formatter and Validator to beautify, format, and validate JSON data. Syntax highlighting and error detection included.",
  keywords: "json formatter, json beautifier, json validator, format json online, json parser",
};

export default function JSONFormatterPage() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [indent, setIndent] = useState<number>(2);
  const [copied, setCopied] = useState(false);

  function format() {
    if (!input.trim()) {
      setError("Please enter JSON data");
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }

  function minify() {
    if (!input.trim()) {
      setError("Please enter JSON data");
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function loadSample() {
    const sample = JSON.stringify(
      {
        name: "CalcTools",
        version: "1.0.0",
        tools: ["EMI Calculator", "GST Calculator", "SIP Calculator"],
        features: { free: true, noSignup: true, clientSide: true },
      },
      null,
      2
    );
    setInput(sample);
    setOutput("");
    setError("");
  }

  // Simple syntax highlighting
  function highlightJson(json: string): string {
    return json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"([^"]+)"(?=\s*:)/g, '<span style="color:#1e40af">"$1"</span>')
      .replace(/"([^"]*)"/g, '<span style="color:#059669">"$1"</span>')
      .replace(/\b(true|false)\b/g, '<span style="color:#d97706">$1</span>')
      .replace(/\b(null)\b/g, '<span style="color:#dc2626">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#7c3aed">$1</span>');
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/json-formatter`} />
      

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">JSON Formatter</h1>
        <p className="text-[var(--muted)] mb-8">
          Format, beautify, validate, and minify JSON data with syntax highlighting.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={format} className="btn-primary">
              Format / Beautify
            </button>
            <button onClick={minify} className="btn-secondary">
              Minify
            </button>
            <button onClick={loadSample} className="btn-secondary">
              Load Sample
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm text-[var(--muted)]">Indent:</label>
              <select
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="input-field w-20 py-1.5 text-sm"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={1}>1 tab</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Input JSON</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input-field min-h-[400px] font-mono text-sm resize-y"
                placeholder='{"key": "value"}'
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">Formatted Output</label>
                {output && (
                  <button onClick={copyOutput} className="text-sm text-[var(--primary)] hover:underline">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
              {output ? (
                <pre
                  className="input-field min-h-[400px] font-mono text-sm overflow-auto whitespace-pre"
                  dangerouslySetInnerHTML={{ __html: highlightJson(output) }}
                />
              ) : (
                <div className="input-field min-h-[400px] bg-[var(--muted-bg)] flex items-center justify-center text-[var(--muted)] text-sm">
                  Formatted JSON will appear here
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is JSON?</h2>
          <p>
            JSON (JavaScript Object Notation) is a lightweight data interchange format that is easy for humans to
            read and write and easy for machines to parse and generate. It is widely used in web APIs, configuration
            files, and data storage.
          </p>

          <h2>Features of This JSON Formatter</h2>
          <ul>
            <li><strong>Format / Beautify:</strong> Converts minified JSON into readable, indented format</li>
            <li><strong>Minify:</strong> Removes all whitespace to create compact JSON</li>
            <li><strong>Validate:</strong> Detects and reports JSON syntax errors</li>
            <li><strong>Syntax Highlighting:</strong> Color-coded keys, strings, numbers, and booleans</li>
            <li><strong>Copy to Clipboard:</strong> One-click copy of formatted output</li>
          </ul>

          <h2>Common JSON Errors</h2>
          <ul>
            <li>Missing commas between key-value pairs</li>
            <li>Trailing commas after the last item</li>
            <li>Using single quotes instead of double quotes</li>
            <li>Unescaped special characters in strings</li>
            <li>Missing closing brackets or braces</li>
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
            name: "JSON Formatter",
            description: META.description,
            url: `${SITE_URL}/tools/json-formatter`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
