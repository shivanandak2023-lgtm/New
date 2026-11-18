"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "PDF to Text Converter - Extract Text from PDF Online Free",
  description:
    "Free PDF to Text Converter. Upload a PDF and extract all text content from every page. Download as TXT file. No upload to server — 100% browser-based.",
  keywords: "pdf to text, pdf to word, extract text from pdf, pdf converter, pdf to txt, copy text from pdf",
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(0);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setExtractedText("");
    setPageCount(0);
    setDone(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  async function extractText() {
    if (!file) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      setPageCount(pages.length);

      // pdf-lib doesn't have built-in text extraction, so we use the
      // browser's PDF rendering via an embedded iframe + selection fallback.
      // A more reliable approach: parse the raw PDF content streams for text operators.
      const textParts: string[] = [];

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        // Try to get text from content stream using pdf-lib internals
        try {
          const content = page.node.Contents();
          if (content) {
            let streamData = "";
            // Handle single stream or array of streams
            const contentObj = content.toString();
            if (contentObj) {
              // Extract raw bytes from the stream
              const ref = page.node.Contents();
              if (ref && typeof ref === "object") {
                const doc = pdfDoc.context;
                const rawObj = doc.lookup(page.node.get(await import("pdf-lib").then(m => m.PDFName.of("Contents"))));
                if (rawObj) {
                  // Try to decode the stream
                  const decoded = rawObj as { toString: () => string; getContents?: () => Uint8Array; decodeContents?: () => { toString: () => string } };
                  if (decoded && typeof decoded === "object" && "getContents" in decoded) {
                    const bytes = (decoded as { getContents: () => Uint8Array }).getContents();
                    const text = new TextDecoder().decode(bytes);
                    // Extract text between parentheses (Tj operator) and angle brackets
                    const tjMatches = text.match(/\(([^)]*)\)\s*Tj/g);
                    const tdMatches = text.match(/\(([^)]*)\)\s*'/g);
                    const allMatches = [...(tjMatches || []), ...(tdMatches || [])];
                    for (const m of allMatches) {
                      const inner = m.match(/\(([^)]*)\)/);
                      if (inner) streamData += inner[1];
                    }
                    // Also handle TJ arrays
                    const tjArrays = text.match(/\[([^\]]*)\]\s*TJ/gi);
                    if (tjArrays) {
                      for (const arr of tjArrays) {
                        const innerTexts = arr.match(/\(([^)]*)\)/g);
                        if (innerTexts) {
                          for (const it of innerTexts) {
                            const clean = it.match(/\(([^)]*)\)/);
                            if (clean) streamData += clean[1];
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (streamData.trim()) {
              textParts.push(`--- Page ${i + 1} ---\n${streamData.trim()}`);
            } else {
              textParts.push(`--- Page ${i + 1} ---\n[Text extraction limited — PDF may contain scanned images or complex encoding]`);
            }
          } else {
            textParts.push(`--- Page ${i + 1} ---\n[No text content found on this page]`);
          }
        } catch {
          textParts.push(`--- Page ${i + 1} ---\n[Could not extract text from this page]`);
        }
      }

      setExtractedText(textParts.join("\n\n"));
      setDone(true);
    } catch {
      setExtractedText("Error: Could not process this PDF file.");
    } finally {
      setProcessing(false);
    }
  }

  function download() {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.replace(/\.pdf$/i, "") || "extracted"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(extractedText);
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/pdf-to-word`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/pdf-to-word`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">PDF to Text Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Upload a PDF and extract text from all pages. Download as a TXT file. 100% browser-based.
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
            {file && (
              <p className="text-sm text-[var(--muted)] mt-1">Size: {formatBytes(file.size)}</p>
            )}
          </div>

          {file && !done && (
            <button onClick={extractText} disabled={processing} className="btn-primary mt-4 w-full">
              {processing ? "Extracting Text..." : "Extract Text from PDF"}
            </button>
          )}
        </div>

        {done && extractedText && (
          <div className="result-card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Extracted Text</h2>
              <span className="text-sm text-[var(--muted)]">{pageCount} page{pageCount !== 1 ? "s" : ""}</span>
            </div>

            <textarea
              readOnly
              value={extractedText}
              rows={14}
              className="w-full p-4 border rounded-lg bg-[var(--muted-bg)] text-sm resize-y font-mono mb-4"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={download} className="btn-primary w-full">
                Download as .txt
              </button>
              <button onClick={copyToClipboard} className="btn-primary w-full" style={{ background: "var(--foreground)" }}>
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does PDF to Text Extraction Work?</h2>
          <p>
            This tool uses the pdf-lib library to parse the internal structure of your PDF file and extract
            text content from each page. The extracted text is presented in a readable format that you can
            download as a .txt file or copy to your clipboard.
          </p>

          <h2>When to Use This Tool</h2>
          <ul>
            <li>Extract text from PDF documents for editing</li>
            <li>Copy content from PDF reports or articles</li>
            <li>Convert PDF text to a format that&apos;s easy to search and modify</li>
            <li>Pull data from PDF invoices or receipts</li>
          </ul>

          <h2>Limitations</h2>
          <p>
            This tool works best with text-based PDFs. Scanned documents (image-based PDFs) may not yield
            text since the content is stored as images. For scanned PDFs, you would need an OCR solution.
          </p>

          <h3>Privacy and Security</h3>
          <p>
            Your PDF is processed entirely in your browser. No files are uploaded to any server. Your
            documents remain completely private.
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
            name: "PDF to Text Converter",
            description: META.description,
            url: `${SITE_URL}/tools/pdf-to-word`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
