"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "PDF Split - Split PDF Pages Online Free",
  description:
    "Free PDF Splitter. Upload a PDF and extract specific pages, split into individual pages, or split every N pages. Uses pdf-lib. 100% browser-based.",
  keywords: "pdf split, split pdf, extract pdf pages, pdf splitter, separate pdf pages, split pdf online free",
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

type SplitMode = "range" | "individual" | "every-n";

export default function PdfSplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [mode, setMode] = useState<SplitMode>("range");
  const [rangeInput, setRangeInput] = useState<string>("");
  const [everyN, setEveryN] = useState<number>(1);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [done, setDone] = useState(false);
  const [resultCount, setResultCount] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(f: File) {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setDone(false);
    setResultCount(0);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
    } catch {
      setPageCount(0);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  function parsePageRanges(input: string, max: number): number[] {
    const pages = new Set<number>();
    const parts = input.split(",").map((s) => s.trim());
    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(max, end); i++) {
            pages.add(i);
          }
        }
      } else {
        const n = Number(part);
        if (!isNaN(n) && n >= 1 && n <= max) pages.add(n);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  }

  async function downloadPdf(bytes: Uint8Array, filename: string) {
    const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function splitPdf() {
    if (!file || pageCount === 0) return;
    setProcessing(true);
    setDone(false);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(bytes);
      const baseName = file.name.replace(/\.pdf$/i, "");

      if (mode === "range") {
        const pages = parsePageRanges(rangeInput || `1-${pageCount}`, pageCount);
        if (pages.length === 0) return;
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(srcPdf, pages.map((p) => p - 1));
        copiedPages.forEach((page) => newPdf.addPage(page));
        const resultBytes = await newPdf.save();
        await downloadPdf(resultBytes, `${baseName}_pages_${rangeInput || "all"}.pdf`);
        setResultCount(1);
      } else if (mode === "individual") {
        let count = 0;
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(srcPdf, [i]);
          newPdf.addPage(page);
          const resultBytes = await newPdf.save();
          await downloadPdf(resultBytes, `${baseName}_page_${i + 1}.pdf`);
          count++;
        }
        setResultCount(count);
      } else if (mode === "every-n") {
        const n = Math.max(1, everyN);
        let count = 0;
        for (let start = 0; start < pageCount; start += n) {
          const end = Math.min(start + n, pageCount);
          const newPdf = await PDFDocument.create();
          const indices = Array.from({ length: end - start }, (_, i) => start + i);
          const copiedPages = await newPdf.copyPages(srcPdf, indices);
          copiedPages.forEach((page) => newPdf.addPage(page));
          const resultBytes = await newPdf.save();
          await downloadPdf(resultBytes, `${baseName}_part_${count + 1}.pdf`);
          count++;
        }
        setResultCount(count);
      }
      setDone(true);
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
      <link rel="canonical" href={`${SITE_URL}/tools/pdf-split`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Split PDF</h1>
        <p className="text-[var(--muted)] mb-8">
          Upload a PDF and extract specific pages, split into individual pages, or split every N pages.
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
              {file ? `${file.name} (${formatBytes(file.size)})` : "Drag & drop a PDF or click to browse"}
            </p>
            {file && pageCount > 0 && (
              <p className="text-sm text-[var(--primary)] mt-1 font-medium">{pageCount} page{pageCount !== 1 ? "s" : ""}</p>
            )}
          </div>

          {file && pageCount > 0 && (
            <>
              {/* Mode Selection */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Split Mode</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {([
                    { value: "range", label: "Extract Page Range", desc: "e.g. 1,3,5-8" },
                    { value: "individual", label: "Individual Pages", desc: "One PDF per page" },
                    { value: "every-n", label: "Split Every N Pages", desc: "Equal chunks" },
                  ] as { value: SplitMode; label: string; desc: string }[]).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setMode(opt.value)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        mode === opt.value ? "border-[var(--primary)] bg-blue-50" : "border-[var(--card-border)]"
                      }`}
                    >
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-[var(--muted)]">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {mode === "range" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Page Range (e.g. 1,3,5-8)</label>
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder={`1-${pageCount}`}
                    className="w-full p-3 border rounded-lg bg-[var(--muted-bg)]"
                  />
                  <p className="text-xs text-[var(--muted)] mt-1">Leave empty to extract all pages</p>
                </div>
              )}

              {mode === "every-n" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Split every {everyN} page{everyN !== 1 ? "s" : ""}</label>
                  <input
                    type="range"
                    min="1"
                    max={pageCount}
                    value={everyN}
                    onChange={(e) => setEveryN(Number(e.target.value))}
                    className="w-full accent-[var(--primary)]"
                  />
                  <div className="flex justify-between text-xs text-[var(--muted)]">
                    <span>1 page</span>
                    <span>{pageCount} pages</span>
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    This will create {Math.ceil(pageCount / everyN)} file{Math.ceil(pageCount / everyN) !== 1 ? "s" : ""}
                  </p>
                </div>
              )}

              <button onClick={splitPdf} disabled={processing} className="btn-primary mt-4 w-full">
                {processing ? "Splitting..." : "Split PDF"}
              </button>

              {done && (
                <p className="text-center text-sm text-green-600 mt-3 font-medium">
                  {resultCount} file{resultCount !== 1 ? "s" : ""} downloaded!
                </p>
              )}
            </>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does PDF Splitting Work?</h2>
          <p>
            This tool uses pdf-lib to read your PDF and create new documents containing only the pages you
            specify. The original formatting and quality are fully preserved.
          </p>

          <h2>Split Modes</h2>
          <ul>
            <li><strong>Extract Page Range:</strong> Specify pages like &quot;1,3,5-8&quot; to extract only those pages</li>
            <li><strong>Individual Pages:</strong> Each page becomes its own PDF file</li>
            <li><strong>Split Every N Pages:</strong> Divide the PDF into equal chunks</li>
          </ul>

          <h2>Common Uses</h2>
          <ul>
            <li>Extract specific pages from a large document</li>
            <li>Split a scanned book into chapters</li>
            <li>Remove pages you don&apos;t need</li>
            <li>Share only relevant pages from a report</li>
          </ul>

          <h3>Privacy</h3>
          <p>
            All processing happens locally in your browser. No files are uploaded to any server.
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
            name: "PDF Split",
            description: META.description,
            url: `${SITE_URL}/tools/pdf-split`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
