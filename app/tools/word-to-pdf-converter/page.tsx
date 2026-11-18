"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Word to PDF Converter - Convert DOCX to PDF Online Free",
  description:
    "Free Word to PDF Converter. Upload a DOCX file or paste text and convert to a formatted PDF document. Uses mammoth and jsPDF. 100% browser-based.",
  keywords: "word to pdf, docx to pdf, convert word to pdf, doc to pdf, word to pdf converter online free",
};

export default function WordToPdfConverterPage() {
  const [mode, setMode] = useState<"docx" | "text">("docx");
  const [file, setFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(14);
  const [fontFamily, setFontFamily] = useState<string>("serif");
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [converted, setConverted] = useState(false);

  const FONTS: Record<string, string> = {
    serif: "Georgia, 'Times New Roman', serif",
    "sans-serif": "Arial, Helvetica, sans-serif",
    monospace: "'Courier New', Courier, monospace",
  };

  async function handleFile(f: File) {
    if (!f.name.match(/\.docx?$/i)) return;
    setFile(f);
    setConverted(false);
    setHtmlContent("");

    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await f.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
      setConverted(true);
    } catch {
      setHtmlContent("<p>Error: Could not read this DOCX file.</p>");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  function downloadPdf() {
    if (mode === "docx" && !htmlContent) return;
    if (mode === "text" && !textContent.trim()) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const fontValue = FONTS[fontFamily];
    let bodyContent = "";

    if (mode === "docx") {
      bodyContent = htmlContent;
    } else {
      const escaped = textContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const titleHtml = title
        ? `<div style="font-size:${fontSize * 1.8}px;font-weight:bold;margin-bottom:0.5em">${title.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div><hr style="border:none;border-top:1px solid #ccc;margin:1em 0">`
        : "";
      bodyContent = `${titleHtml}<div style="white-space:pre-wrap;word-wrap:break-word">${escaped}</div>`;
    }

    printWindow.document.write(`<!DOCTYPE html><html><head><title>${title || file?.name || "Document"}</title>
      <style>
        @page { margin: 1in; size: A4; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: ${fontValue}; font-size: ${fontSize}px; line-height: 1.6; color: #1a1a1a; }
        img { max-width: 100%; }
        table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        td, th { border: 1px solid #ccc; padding: 6px 10px; }
      </style></head><body>${bodyContent}
      <script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}};<\/script>
      </body></html>`);
    printWindow.document.close();
  }

  async function generateJsPdf() {
    if (!textContent.trim()) return;
    setProcessing(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      let y = margin;

      const fontName = fontFamily === "monospace" ? "courier" : fontFamily === "sans-serif" ? "helvetica" : "times";
      doc.setFont(fontName);
      doc.setFontSize(fontSize);

      if (title) {
        doc.setFontSize(fontSize * 1.5);
        doc.setFont(fontName, "bold");
        const titleLines = doc.splitTextToSize(title, maxWidth);
        doc.text(titleLines, margin, y);
        y += titleLines.length * (fontSize * 1.5 * 0.5) + 8;
        doc.setDrawColor(200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        doc.setFontSize(fontSize);
        doc.setFont(fontName, "normal");
      }

      const lines = doc.splitTextToSize(textContent, maxWidth);
      const lineHeight = fontSize * 0.45;

      for (const line of lines) {
        if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      }

      doc.save(`${title || "document"}.pdf`);
    } catch {
      // silently fail
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/word-to-pdf-converter`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/word-to-pdf-converter`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Word to PDF Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Upload a DOCX file or type text to convert into a PDF document. 100% browser-based.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("docx")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "docx" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}
            >
              Upload DOCX
            </button>
            <button
              onClick={() => setMode("text")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "text" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}
            >
              Type / Paste Text
            </button>
          </div>

          {mode === "docx" && (
            <>
              <div
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                  dragActive ? "border-[var(--primary)] bg-blue-50" : "border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("docx-input")?.click()}
              >
                <input
                  id="docx-input"
                  type="file"
                  accept=".docx,.doc"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <svg className="mx-auto mb-3 text-[var(--muted)]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="text-[var(--muted)]">
                  {file ? file.name : "Drag & drop a DOCX file or click to browse"}
                </p>
              </div>

              {converted && (
                <button onClick={downloadPdf} className="btn-primary mt-4 w-full">
                  Download as PDF (Print Dialog)
                </button>
              )}

              {converted && htmlContent && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Preview</h3>
                  <div
                    className="border rounded-lg p-6 bg-white max-h-96 overflow-y-auto prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
              )}
            </>
          )}

          {mode === "text" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Document Title (optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title..."
                  className="w-full p-3 border rounded-lg bg-[var(--muted-bg)]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={10}
                  className="w-full p-4 border rounded-lg bg-[var(--muted-bg)] text-sm resize-y font-mono"
                  placeholder="Type or paste your text here..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Font Size: {fontSize}px</label>
                  <input type="range" min="10" max="24" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Font Family</label>
                  <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full p-2 border rounded-lg bg-[var(--muted-bg)]">
                    <option value="serif">Serif (Georgia)</option>
                    <option value="sans-serif">Sans-serif (Arial)</option>
                    <option value="monospace">Monospace (Courier)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onClick={generateJsPdf} disabled={processing || !textContent.trim()} className="btn-primary w-full disabled:opacity-50">
                  {processing ? "Generating..." : "Download PDF (jsPDF)"}
                </button>
                <button onClick={downloadPdf} disabled={!textContent.trim()} className="btn-primary w-full disabled:opacity-50" style={{ background: "var(--foreground)" }}>
                  Download PDF (Print Dialog)
                </button>
              </div>
            </>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does Word to PDF Conversion Work?</h2>
          <p>
            This tool offers two methods: upload a DOCX file which is converted to HTML using the mammoth
            library, or type/paste text and generate a PDF using jsPDF. Both methods run entirely in your
            browser &mdash; no files are sent to any server.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Upload DOCX files and convert to PDF via print dialog</li>
            <li>Type or paste text with custom font, size, and title options</li>
            <li>Two PDF generation methods: jsPDF direct download or browser print</li>
            <li>Preview your document before converting</li>
            <li>100% private &mdash; nothing leaves your browser</li>
          </ul>

          <h2>Tips for Best Results</h2>
          <p>
            For DOCX files, the converter handles text, headings, lists, tables, and basic formatting.
            Complex layouts with embedded objects may not render perfectly. For plain text, use the
            jsPDF method for direct download without a print dialog.
          </p>

          <h3>Privacy</h3>
          <p>
            Your documents are processed entirely in your browser. No data is uploaded to any server.
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
            name: "Word to PDF Converter",
            description: META.description,
            url: `${SITE_URL}/tools/word-to-pdf-converter`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
