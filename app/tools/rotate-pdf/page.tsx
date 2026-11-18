"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Rotate PDF - Rotate PDF Pages Online Free",
  description:
    "Free PDF page rotator. Rotate individual pages or all pages by 90, 180, or 270 degrees. Download the rotated PDF. No server upload.",
  keywords: "rotate pdf, rotate pdf pages, pdf rotator, turn pdf page, flip pdf",
};

type PageRotation = { pageNum: number; rotation: number };

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageRotations, setPageRotations] = useState<PageRotation[]>([]);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setError("");
    setResultUrl("");
    loadPages(f);
  }

  async function loadPages(f: File) {
    setLoading(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await f.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      setTotalPages(count);
      setPageRotations(
        Array.from({ length: count }, (_, i) => ({ pageNum: i + 1, rotation: 0 }))
      );
    } catch {
      setError("Failed to load PDF. The file may be corrupted or encrypted.");
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  function setRotation(pageIdx: number, rotation: number) {
    setPageRotations((prev) =>
      prev.map((p, i) => (i === pageIdx ? { ...p, rotation } : p))
    );
    setResultUrl("");
  }

  function rotateAll(deg: number) {
    setPageRotations((prev) =>
      prev.map((p) => ({ ...p, rotation: (p.rotation + deg + 360) % 360 }))
    );
    setResultUrl("");
  }

  async function applyRotation() {
    if (!file) return;
    setProcessing(true);
    setError("");

    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();

      pageRotations.forEach(({ rotation }, i) => {
        if (rotation !== 0 && pages[i]) {
          const currentRotation = pages[i].getRotation().angle;
          pages[i].setRotation(degrees(currentRotation + rotation));
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      setError("Failed to rotate PDF pages.");
    } finally {
      setProcessing(false);
    }
  }

  function download() {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `rotated-${file.name}`;
    a.click();
  }

  const hasChanges = pageRotations.some((p) => p.rotation !== 0);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/rotate-pdf`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/rotate-pdf`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Rotate PDF Pages</h1>
        <p className="text-[var(--muted)] mb-8">
          Rotate individual pages or all pages of your PDF by 90, 180, or 270 degrees. All processing happens in your browser.
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

          {loading && <p className="text-sm text-[var(--muted)] mt-4 text-center">Loading PDF pages...</p>}

          {totalPages > 0 && !loading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium">{totalPages} page(s) detected</p>
                <div className="flex gap-2">
                  <button onClick={() => rotateAll(90)} className="text-xs px-3 py-1 rounded bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--primary)]">
                    Rotate All +90&deg;
                  </button>
                  <button onClick={() => rotateAll(180)} className="text-xs px-3 py-1 rounded bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--primary)]">
                    Rotate All 180&deg;
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                {pageRotations.map((page, idx) => (
                  <div
                    key={idx}
                    className="border border-[var(--card-border)] rounded-lg p-3 text-center"
                  >
                    <div
                      className="w-full aspect-[3/4] bg-gray-100 rounded flex items-center justify-center mb-2 transition-transform"
                      style={{ transform: `rotate(${page.rotation}deg)` }}
                    >
                      <span className="text-2xl font-bold text-gray-400">{page.pageNum}</span>
                    </div>
                    <p className="text-xs text-[var(--muted)] mb-1">Page {page.pageNum}</p>
                    <div className="flex justify-center gap-1">
                      {[0, 90, 180, 270].map((deg) => (
                        <button
                          key={deg}
                          onClick={() => setRotation(idx, deg)}
                          className={`text-xs px-2 py-0.5 rounded ${
                            page.rotation === deg
                              ? "bg-[var(--primary)] text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {deg}&deg;
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={applyRotation}
                disabled={processing || !hasChanges}
                className="btn-primary w-full"
              >
                {processing ? "Rotating..." : "Apply Rotation & Download"}
              </button>
            </div>
          )}

          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </div>

        {resultUrl && (
          <div className="result-card mb-8">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-green-700">Pages Rotated!</h2>
              <p className="text-[var(--muted)] text-sm mt-1">
                {pageRotations.filter((p) => p.rotation !== 0).length} page(s) rotated
              </p>
            </div>
            <button onClick={download} className="btn-primary w-full">
              Download Rotated PDF
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does PDF Rotation Work?</h2>
          <p>
            This tool uses the pdf-lib library to modify the rotation property of individual pages in your PDF.
            You can rotate each page independently or rotate all pages at once.
          </p>

          <h2>Common Uses</h2>
          <ul>
            <li>Fix upside-down scanned documents</li>
            <li>Rotate landscape pages to portrait or vice versa</li>
            <li>Correct pages scanned at wrong orientations</li>
            <li>Prepare documents for printing</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            Your PDF is processed entirely in your browser. No files are uploaded to any server.
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
            name: "Rotate PDF",
            description: META.description,
            url: `${SITE_URL}/tools/rotate-pdf`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
