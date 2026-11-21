"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "JSON to CSV Converter - Convert JSON to CSV Online Free",
  description:
    "Convert JSON arrays to CSV files online for free. Choose delimiters, toggle headers, and download results. Also convert CSV back to JSON.",
  keywords: "json to csv, convert json to csv online, json to csv converter, csv to json, json csv tool, json array to csv",
};

type Delimiter = "," | ";" | "\t";

function jsonToCSV(
  text: string,
  delimiter: Delimiter,
  includeHeaders: boolean
): { csv: string; error: string } {
  try {
    const data = JSON.parse(text);
    if (!Array.isArray(data) || data.length === 0) {
      return { csv: "", error: "JSON must be a non-empty array of objects." };
    }

    if (typeof data[0] !== "object" || Array.isArray(data[0]) || data[0] === null) {
      return { csv: "", error: "Each array element must be a plain object." };
    }

    const headers = Array.from(
      new Set(data.flatMap((obj: Record<string, unknown>) => Object.keys(obj)))
    );

    function escapeField(val: unknown): string {
      const s = val === null || val === undefined ? "" : String(val);
      if (s.includes(delimiter) || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    }

    const rows = data.map((obj: Record<string, unknown>) =>
      headers.map((h) => escapeField(obj[h])).join(delimiter)
    );

    if (includeHeaders) {
      return { csv: [headers.join(delimiter), ...rows].join("\n"), error: "" };
    }
    return { csv: rows.join("\n"), error: "" };
  } catch {
    return { csv: "", error: "Invalid JSON. Please check your input." };
  }
}

function csvToJSON(text: string, delimiter: Delimiter): { json: string; error: string } {
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
          } else if (ch === delimiter) {
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

    if (lines.length < 2) return { json: "[]", error: "" };

    const headers = lines[0];
    const data = lines.slice(1).map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] || "";
      });
      return obj;
    });

    return { json: JSON.stringify(data, null, 2), error: "" };
  } catch {
    return { json: "", error: "Failed to parse CSV. Check your input." };
  }
}

export default function JsonToCsvConverterPage() {
  const [mode, setMode] = useState<"jsonToCsv" | "csvToJson">("jsonToCsv");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [delimiter, setDelimiter] = useState<Delimiter>(",");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [copied, setCopied] = useState(false);

  function convert() {
    if (!input.trim()) return;
    if (mode === "jsonToCsv") {
      const result = jsonToCSV(input, delimiter, includeHeaders);
      setOutput(result.csv);
      setError(result.error);
    } else {
      const result = csvToJSON(input, delimiter);
      setOutput(result.json);
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
    const ext = mode === "jsonToCsv" ? "csv" : "json";
    const mime = mode === "jsonToCsv" ? "text/csv" : "application/json";
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
      <link rel="canonical" href={`${SITE_URL}/tools/json-to-csv-converter`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="/tools/json-to-csv-converter" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">JSON to CSV Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert between JSON and CSV formats with custom delimiters and header options.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode("jsonToCsv"); setOutput(""); setError(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "jsonToCsv" ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
            }`}
          >
            JSON &rarr; CSV
          </button>
          <button
            onClick={() => { setMode("csvToJson"); setOutput(""); setError(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "csvToJson" ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
            }`}
          >
            CSV &rarr; JSON
          </button>
        </div>

        <div className="tool-card mb-8">
          <label className="block text-sm font-medium mb-2">
            {mode === "jsonToCsv" ? "JSON Input" : "CSV Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "jsonToCsv"
                ? '[{"name":"John","age":30,"city":"New York"},{"name":"Jane","age":25,"city":"London"}]'
                : "name,age,city\nJohn,30,New York\nJane,25,London"
            }
            rows={10}
            className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono mb-4"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Delimiter</label>
              <select
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value as Delimiter)}
                className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value={"\t"}>Tab</option>
              </select>
            </div>
            {mode === "jsonToCsv" && (
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeHeaders}
                    onChange={(e) => setIncludeHeaders(e.target.checked)}
                    className="accent-[var(--primary)]"
                  />
                  <span className="text-sm">Include header row</span>
                </label>
              </div>
            )}
          </div>

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
                {mode === "jsonToCsv" ? "CSV Output" : "JSON Output"}
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
          <h2>How JSON to CSV Conversion Works</h2>
          <p>
            This tool takes a JSON array of objects and flattens it into a CSV (Comma-Separated Values)
            table. Each object key becomes a column header, and each object becomes a row. The converter
            automatically detects all unique keys across all objects, so even if some objects have missing
            fields, the output will still be a consistent table with empty values for missing columns.
          </p>

          <h2>Delimiter Options</h2>
          <p>
            While CSV traditionally uses commas, many European applications use semicolons because commas
            serve as decimal separators. This tool supports three delimiter options: <strong>comma</strong>
            (standard CSV), <strong>semicolon</strong> (common in European Excel), and <strong>tab</strong>
            (TSV format). Fields containing the chosen delimiter, double quotes, or newlines are
            automatically wrapped in quotes with proper escaping.
          </p>

          <h2>CSV to JSON Mode</h2>
          <p>
            Switch to CSV to JSON mode to convert tabular data back into structured JSON. The first row
            is treated as headers, and each subsequent row becomes a JSON object with those headers as
            keys. This is useful for importing spreadsheet data into JavaScript applications, REST APIs,
            or NoSQL databases like MongoDB and Firebase.
          </p>

          <h2>Use Cases for JSON to CSV Conversion</h2>
          <ul>
            <li>Export API response data to spreadsheets for analysis in Excel or Google Sheets</li>
            <li>Convert database exports from JSON format to CSV for reporting</li>
            <li>Prepare bulk data imports for applications that accept CSV uploads</li>
            <li>Transform logs and analytics data between formats</li>
            <li>Convert configuration files between JSON and tabular formats</li>
          </ul>

          <h2>Handling Complex Data</h2>
          <p>
            The converter handles common edge cases including fields with commas, quotes, and newlines.
            Nested objects and arrays within JSON are converted to their string representation. For best
            results, provide a flat array of objects where each value is a string, number, boolean, or null.
            Deeply nested structures should be flattened before conversion.
          </p>

          <h2>Download and Integration</h2>
          <p>
            After conversion, you can copy the output to your clipboard or download it as a file. JSON
            output downloads as a <code>.json</code> file, and CSV output downloads as a <code>.csv</code>
            file. Downloaded CSV files can be opened directly in Microsoft Excel, Google Sheets, LibreOffice
            Calc, or any spreadsheet application. All processing happens locally in your browser for
            complete privacy and security.
          </p>

          <h2>Privacy</h2>
          <p>
            All conversion happens in your browser. No data is sent to any server. Your JSON and CSV
            data remains completely private and is never stored or logged.
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
            name: "JSON to CSV Converter",
            description: META.description,
            url: `${SITE_URL}/tools/json-to-csv-converter`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
