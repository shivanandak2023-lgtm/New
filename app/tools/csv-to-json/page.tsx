"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "CSV to JSON Converter - Convert CSV Online Free",
  description:
    "Convert CSV to JSON and JSON to CSV online for free. Handle commas in quotes, first row as headers, formatted output. Copy or download results.",
  keywords: "csv to json, json to csv, csv converter, csv parser, json converter, convert csv online",
};

function parseCSV(text: string, hasHeaders: boolean): { json: string; error: string } {
  try {
    const lines: string[][] = [];
    const rows = text.trim().split("\n");

    for (const row of rows) {
      const cells: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        if (inQuotes) {
          if (ch === '"' && row[i + 1] === '"') {
            current += '"';
            i++;
          } else if (ch === '"') {
            inQuotes = false;
          } else {
            current += ch;
          }
        } else {
          if (ch === '"') {
            inQuotes = true;
          } else if (ch === ",") {
            cells.push(current.trim());
            current = "";
          } else {
            current += ch;
          }
        }
      }
      cells.push(current.trim());
      lines.push(cells);
    }

    if (lines.length === 0) return { json: "[]", error: "" };

    if (hasHeaders && lines.length > 1) {
      const headers = lines[0];
      const data = lines.slice(1).map((row) => {
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          obj[h] = row[i] || "";
        });
        return obj;
      });
      return { json: JSON.stringify(data, null, 2), error: "" };
    }

    return { json: JSON.stringify(lines, null, 2), error: "" };
  } catch {
    return { json: "", error: "Failed to parse CSV. Check your input format." };
  }
}

function jsonToCSV(text: string): { csv: string; error: string } {
  try {
    const data = JSON.parse(text);
    if (!Array.isArray(data) || data.length === 0) {
      return { csv: "", error: "JSON must be an array of objects." };
    }

    if (typeof data[0] === "object" && !Array.isArray(data[0])) {
      const headers = Object.keys(data[0]);
      const rows = data.map((obj: Record<string, unknown>) =>
        headers.map((h) => {
          const val = String(obj[h] ?? "");
          return val.includes(",") || val.includes('"') || val.includes("\n")
            ? `"${val.replace(/"/g, '""')}"`
            : val;
        }).join(",")
      );
      return { csv: [headers.join(","), ...rows].join("\n"), error: "" };
    }

    if (Array.isArray(data[0])) {
      const rows = data.map((row: unknown[]) =>
        row.map((val) => {
          const s = String(val ?? "");
          return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
        }).join(",")
      );
      return { csv: rows.join("\n"), error: "" };
    }

    return { csv: "", error: "Unsupported JSON structure." };
  } catch {
    return { csv: "", error: "Invalid JSON. Check your input." };
  }
}

export default function CsvToJsonPage() {
  const [mode, setMode] = useState<"csvToJson" | "jsonToCsv">("csvToJson");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [hasHeaders, setHasHeaders] = useState(true);
  const [copied, setCopied] = useState(false);

  function convert() {
    if (!input.trim()) return;
    if (mode === "csvToJson") {
      const result = parseCSV(input, hasHeaders);
      setOutput(result.json);
      setError(result.error);
    } else {
      const result = jsonToCSV(input);
      setOutput(result.csv);
      setError(result.error);
    }
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    if (!output) return;
    const ext = mode === "csvToJson" ? "json" : "csv";
    const mime = mode === "csvToJson" ? "application/json" : "text/csv";
    const blob = new Blob([output], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `converted.${ext}`;
    a.click();
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/csv-to-json`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/csv-to-json`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">CSV to JSON Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert between CSV and JSON formats. Handles quoted fields and nested data.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode("csvToJson"); setOutput(""); setError(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "csvToJson" ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
            }`}
          >
            CSV &rarr; JSON
          </button>
          <button
            onClick={() => { setMode("jsonToCsv"); setOutput(""); setError(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "jsonToCsv" ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
            }`}
          >
            JSON &rarr; CSV
          </button>
        </div>

        <div className="tool-card mb-8">
          <label className="block text-sm font-medium mb-2">
            {mode === "csvToJson" ? "CSV Input" : "JSON Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "csvToJson"
                ? "name,age,city\nJohn,30,New York\nJane,25,London"
                : '[{"name":"John","age":30},{"name":"Jane","age":25}]'
            }
            rows={10}
            className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono mb-4"
          />

          {mode === "csvToJson" && (
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={hasHeaders}
                onChange={(e) => setHasHeaders(e.target.checked)}
                className="accent-[var(--primary)]"
              />
              <span className="text-sm">First row contains headers</span>
            </label>
          )}

          <button onClick={convert} className="btn-primary w-full">
            Convert
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
              <label className="text-sm font-medium">
                {mode === "csvToJson" ? "JSON Output" : "CSV Output"}
              </label>
              <div className="flex gap-2">
                <button onClick={copy} className="text-xs text-[var(--primary)]">
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={download} className="text-xs text-[var(--primary)]">
                  Download
                </button>
              </div>
            </div>
            <pre className="bg-gray-50 border border-[var(--card-border)] rounded-lg p-3 text-xs font-mono overflow-x-auto max-h-[400px] overflow-y-auto whitespace-pre">
              {output}
            </pre>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How CSV to JSON Conversion Works</h2>
          <p>
            This tool parses CSV (Comma-Separated Values) data and converts it to JSON format.
            When &quot;first row as headers&quot; is enabled, it creates an array of objects using
            the header row as keys. It properly handles commas inside quoted fields and escaped quotes.
          </p>

          <h2>Supported Features</h2>
          <ul>
            <li>CSV to JSON with header row support</li>
            <li>JSON to CSV (array of objects or arrays)</li>
            <li>Handles quoted fields with commas</li>
            <li>Escaped double quotes (&quot;&quot;)</li>
            <li>Copy and download output</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            All conversion happens in your browser. No data is sent to any server.
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
            name: "CSV to JSON Converter",
            description: META.description,
            url: `${SITE_URL}/tools/csv-to-json`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
