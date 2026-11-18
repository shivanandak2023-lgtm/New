"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "PDF Merge - Combine PDF Files Online Free",
  description:
    "Free PDF Merger. Upload multiple PDF files and combine them into one. Reorder pages, see file sizes. No upload to server — 100% browser-based using pdf-lib.",
  keywords: "pdf merge, combine pdf, merge pdf files, join pdf, pdf combiner, merge pdf online free",
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

interface PdfFile {
  file: File;
  pageCount: number;
}

export default function PdfMergePage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [mergedSize, setMergedSize] = useState<number>(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList) {
    const { PDFDocument } = await import("pdf-lib");
    const newFiles: PdfFile[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      if (f.type !== "application/pdf") continue;
      try {
        const bytes = await f.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        newFiles.push({ file: f, pageCount: pdf.getPageCount() });
      } catch {
        // skip invalid PDFs
      }
    }
    setFiles((prev) => [...prev, ...newFiles]);
    setDone(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setDone(false);
  }

  function moveFile(index: number, direction: -1 | 1) {
    setFiles((prev) => {
      const arr = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= arr.length) return arr;
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr;
    });
    setDone(false);
  }

  async function mergePdfs() {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of files) {
        const bytes = await pdfFile.file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      setMergedSize(mergedBytes.length);

      const blob = new Blob([mergedBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch {
      // silently fail
    } finally {
      setProcessing(false);
    }
  }

  const totalPages = files.reduce((sum, f) => sum + f.pageCount, 0);
  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/pdf-merge`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/pdf-merge`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Merge PDF Files</h1>
        <p className="text-[var(--muted)] mb-8">
          Upload multiple PDFs and combine them into a single file. Reorder as needed.
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
              multiple
              className="hidden"
              onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
            />
            <svg className="mx-auto mb-3 text-[var(--muted)]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-[var(--muted)]">
              {files.length > 0 ? `${files.length} PDF(s) added — click to add more` : "Drag & drop PDF files or click to browse"}
            </p>
          </div>

          {files.length > 0 && (
            <>
              <div className="mt-6 space-y-3">
                {files.map((pdfFile, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border rounded-lg bg-[var(--muted-bg)]">
                    <div className="w-10 h-10 rounded bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">PDF</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{pdfFile.file.name}</p>
                      <p className="text-xs text-[var(--muted)]">{pdfFile.pageCount} page{pdfFile.pageCount !== 1 ? "s" : ""} &middot; {formatBytes(pdfFile.file.size)}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => moveFile(i, -1)} disabled={i === 0} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 text-sm">&uarr;</button>
                      <button onClick={() => moveFile(i, 1)} disabled={i === files.length - 1} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 text-sm">&darr;</button>
                      <button onClick={() => removeFile(i)} className="p-1.5 rounded hover:bg-red-100 text-red-600 text-sm">&times;</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 rounded-lg bg-[var(--muted-bg)]">
                  <p className="text-xs text-[var(--muted)]">Total Pages</p>
                  <p className="text-lg font-bold">{totalPages}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-[var(--muted-bg)]">
                  <p className="text-xs text-[var(--muted)]">Total Size</p>
                  <p className="text-lg font-bold">{formatBytes(totalSize)}</p>
                </div>
              </div>

              <button onClick={mergePdfs} disabled={processing || files.length < 2} className="btn-primary mt-4 w-full disabled:opacity-50">
                {processing ? "Merging..." : `Merge ${files.length} PDFs`}
              </button>

              {done && mergedSize > 0 && (
                <p className="text-center text-sm text-green-600 mt-3 font-medium">
                  Merged PDF downloaded! ({formatBytes(mergedSize)})
                </p>
              )}
            </>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does PDF Merging Work?</h2>
          <p>
            This tool uses the pdf-lib library to read each PDF file and copy all pages into a new
            combined document. The original formatting, images, and layout are preserved.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Merge unlimited PDF files into one document</li>
            <li>Reorder files with up/down buttons before merging</li>
            <li>See page count and file size for each PDF</li>
            <li>Remove individual files from the list</li>
            <li>Instant download of the merged result</li>
          </ul>

          <h2>Common Uses</h2>
          <ul>
            <li>Combine multiple invoices into one document</li>
            <li>Merge chapters of an eBook or report</li>
            <li>Combine scanned pages into a single file</li>
            <li>Consolidate forms and applications</li>
          </ul>

          <h3>Privacy</h3>
          <p>
            All merging happens in your browser. No PDFs are uploaded to any server.
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
            name: "PDF Merge",
            description: META.description,
            url: `${SITE_URL}/tools/pdf-merge`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
