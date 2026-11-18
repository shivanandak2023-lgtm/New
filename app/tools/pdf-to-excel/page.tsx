"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "PDF to CSV - Extract Tables from PDF Online Free",
  description:
    "Free PDF to CSV converter. Upload a PDF and extract text data as a downloadable CSV file. All processing in your browser.",
  keywords: "pdf to csv, pdf to excel, extract table from pdf, pdf data extractor, pdf converter",
};

export default function PdfToExcelPage() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [csvData, setCsvData] = useState("");
  const [preview, setPreview] = useState<string[][]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [delimiter, setDelimiter] = useState<"auto" | "tab" | "spaces">("auto");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setError("");
    setExtractedText("");
    setCsvData("");
    setPreview([]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  async function extractText() {
    if (!file) return;
    setProcessing(true);
    setError("");

    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();

      // pdf-lib cannot extract text directly, so we use a manual text extraction approach
      // We'll read the raw PDF content stream to extract text objects
      let allText = "";
      const reader = new FileReader();
      const textContent = await new Promise<string>((resolve) => {
        reader.onload = () => {
          const text = reader.result as string;
          // Extract text between BT and ET markers (PDF text objects)
          const textParts: string[] = [];
          const btPattern = /BT\s([\s\S]*?)ET/g;
          let match;
          while ((match = btPattern.exec(text)) !== null) {
            const block = match[1];
            // Extract strings in parentheses (Tj operator) or hex strings
            const tjPattern = /\(([^)]*)\)\s*Tj/g;
            let tj;
            while ((tj = tjPattern.exec(block)) !== null) {
              textParts.push(tj[1]);
            }
            // TJ arrays
            const tjArrayPattern = /\[(.*?)\]\s*TJ/g;
            let tjArr;
            while ((tjArr = tjArrayPattern.exec(block)) !== null) {
              const parts = tjArr[1].match(/\(([^)]*)\)/g);
              if (parts) {
                textParts.push(parts.map((p) => p.slice(1, -1)).join(""));
              }
            }
          }
          resolve(textParts.join("\n"));
        };
        reader.readAsBinaryString(file);
      });

      allText = textContent || `PDF loaded: ${pages.length} page(s). Text extraction from this PDF format may be limited.`;

      if (!textContent.trim()) {
        allText = `Could not extract readable text from this PDF. The PDF may use embedded fonts or images. Pages: ${pages.length}`;
      }

      setExtractedText(allText);

      // Convert text to CSV
      const lines = allText.split("\n").filter((l) => l.trim().length > 0);
      const csvLines = lines.map((line) => {
        let cells: string[];
        if (delimiter === "tab") {
          cells = line.split("\t");
        } else if (delimiter === "spaces") {
          cells = line.split(/\s{2,}/);
        } else {
          // Auto: try tab first, then multiple spaces
          if (line.includes("\t")) {
            cells = line.split("\t");
          } else if (/\s{2,}/.test(line)) {
            cells = line.split(/\s{2,}/);
          } else {
            cells = [line];
          }
        }
        return cells.map((c) => `"${c.trim().replace(/"/g, '""')}"`).join(",");
      });

      const csv = csvLines.join("\n");
      setCsvData(csv);

      // Build preview
      const previewRows = csvLines.slice(0, 20).map((line) =>
        line.split(",").map((c) => c.replace(/^"|"$/g, "").replace(/""/g, '"'))
      );
      setPreview(previewRows);
    } catch (err) {
      setError("Failed to process PDF. The file may be corrupted or password-protected.");
    } finally {
      setProcessing(false);
    }
  }

  function downloadCsv() {
    if (!csvData) return;
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${file?.name.replace(/\.pdf$/i, "") || "extracted"}.csv`;
    a.click();
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/pdf-to-excel`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">PDF to CSV Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Upload a PDF to extract text data and download it as a CSV file. All processing happens in your browser.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              dragActive ? "border-[var(--primary)] bg-blue-50" : "border-[var(--card-border)] hover:border-[var(--primary)]"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <svg className="mx-auto mb-3 text-[var(--muted)]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-[var(--muted)]">
              {file ? file.name : "Drag & drop a PDF or click to browse"}
            </p>
          </div>

          {file && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Column Delimiter Detection</label>
              <div className="flex gap-3 mb-4">
                {(["auto", "tab", "spaces"] as const).map((d) => (
                  <label key={d} className="flex items-center gap-1 text-sm">
                    <input
                      type="radio"
                      name="delimiter"
                      checked={delimiter === d}
                      onChange={() => setDelimiter(d)}
                      className="accent-[var(--primary)]"
                    />
                    {d === "auto" ? "Auto-detect" : d === "tab" ? "Tab-separated" : "Multiple spaces"}
                  </label>
                ))}
              </div>
              <button onClick={extractText} disabled={processing} className="btn-primary w-full">
                {processing ? "Extracting..." : "Extract Data from PDF"}
              </button>
            </div>
          )}

          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </div>

        {extractedText && (
          <div className="result-card mb-8">
            <h2 className="text-lg font-bold mb-4">Extracted Text</h2>
            <textarea
              readOnly
              value={extractedText}
              className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 font-mono text-xs h-40 resize-y mb-4"
            />

            {preview.length > 0 && (
              <>
                <h3 className="text-md font-semibold mb-2">CSV Preview (first 20 rows)</h3>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      {preview.map((row, ri) => (
                        <tr key={ri} className={ri === 0 ? "bg-blue-50 font-semibold" : ri % 2 === 0 ? "" : "bg-gray-50"}>
                          {row.map((cell, ci) => (
                            <td key={ci} className="border border-gray-300 px-2 py-1">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <button onClick={downloadCsv} className="btn-primary w-full">
              Download CSV File
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does PDF to CSV Work?</h2>
          <p>
            This tool reads the PDF file in your browser and extracts text content from the document&apos;s
            internal structure. It then detects tabular patterns (tabs, consistent spacing) and converts
            the data into CSV format for use in Excel, Google Sheets, or other spreadsheet applications.
          </p>

          <h2>Tips for Best Results</h2>
          <ul>
            <li>Works best with PDFs that contain actual text (not scanned images)</li>
            <li>Tables with tab-separated or well-spaced columns extract most reliably</li>
            <li>Try different delimiter options if auto-detect doesn&apos;t work well</li>
            <li>For scanned PDFs, you may need an OCR tool first</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            Your PDF is processed entirely in your browser. No files are uploaded to any server.
            Your data remains completely private.
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
            name: "PDF to CSV Converter",
            description: META.description,
            url: `${SITE_URL}/tools/pdf-to-excel`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
