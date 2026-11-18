"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "JPG to PNG Converter - Convert JPEG to PNG Online Free",
  description:
    "Free JPG to PNG Converter. Upload JPEG images and convert to PNG format with transparency support. Batch mode available. 100% browser-based.",
  keywords: "jpg to png, jpeg to png, convert jpg to png, image converter, jpg png converter, batch image converter",
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

interface ConvertedImage {
  name: string;
  originalSize: number;
  convertedSize: number;
  url: string;
}

export default function JpgToPngPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ConvertedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList) {
    const newFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      if (f.type === "image/jpeg" || f.type === "image/jpg") {
        newFiles.push(f);
      }
    }
    setFiles((prev) => [...prev, ...newFiles]);
    setResults([]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }

  async function convert() {
    if (files.length === 0) return;
    setProcessing(true);
    const converted: ConvertedImage[] = [];

    for (const file of files) {
      try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise<void>((resolve) => { img.onload = () => resolve(); });

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), "image/png");
        });

        converted.push({
          name: file.name.replace(/\.jpe?g$/i, ".png"),
          originalSize: file.size,
          convertedSize: blob.size,
          url: URL.createObjectURL(blob),
        });

        URL.revokeObjectURL(img.src);
      } catch {
        // skip failed files
      }
    }

    setResults(converted);
    setProcessing(false);
  }

  function downloadOne(result: ConvertedImage) {
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.name;
    a.click();
  }

  function downloadAll() {
    results.forEach((r) => downloadOne(r));
  }

  function reset() {
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setFiles([]);
    setResults([]);
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/jpg-to-png`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/jpg-to-png`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">JPG to PNG Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert JPEG images to PNG format. Supports batch conversion. 100% browser-based.
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
              accept=".jpg,.jpeg"
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
              {files.length > 0 ? `${files.length} JPG file(s) selected` : "Drag & drop JPG images or click to browse"}
            </p>
          </div>

          {files.length > 0 && results.length === 0 && (
            <>
              <div className="mt-4 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-[var(--muted-bg)] rounded-lg text-sm">
                    <span className="truncate">{f.name}</span>
                    <span className="text-[var(--muted)] ml-2 shrink-0">{formatBytes(f.size)}</span>
                  </div>
                ))}
              </div>
              <button onClick={convert} disabled={processing} className="btn-primary mt-4 w-full">
                {processing ? "Converting..." : `Convert ${files.length} Image${files.length !== 1 ? "s" : ""} to PNG`}
              </button>
            </>
          )}
        </div>

        {results.length > 0 && (
          <div className="result-card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Converted Images</h2>
              <button onClick={reset} className="text-sm text-[var(--primary)] hover:underline">Convert More</button>
            </div>

            <div className="space-y-3 mb-4">
              {results.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-[var(--muted-bg)]">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{r.name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {formatBytes(r.originalSize)} &rarr; {formatBytes(r.convertedSize)}
                    </p>
                  </div>
                  <button onClick={() => downloadOne(r)} className="text-sm text-[var(--primary)] hover:underline ml-3 shrink-0">
                    Download
                  </button>
                </div>
              ))}
            </div>

            {results.length > 1 && (
              <button onClick={downloadAll} className="btn-primary w-full">
                Download All ({results.length} files)
              </button>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Why Convert JPG to PNG?</h2>
          <p>
            PNG format supports transparency and uses lossless compression, making it ideal for graphics,
            logos, screenshots, and images that need crisp edges. Unlike JPG, PNG does not introduce
            compression artifacts.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Batch convert multiple JPG files at once</li>
            <li>Lossless conversion preserving full image quality</li>
            <li>See before/after file sizes</li>
            <li>Individual or bulk download</li>
          </ul>

          <h2>JPG vs PNG</h2>
          <ul>
            <li><strong>JPG:</strong> Smaller files, lossy compression, no transparency</li>
            <li><strong>PNG:</strong> Larger files, lossless compression, supports transparency</li>
          </ul>

          <h3>Privacy</h3>
          <p>
            All conversion happens in your browser using the Canvas API. No images are uploaded to any server.
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
            name: "JPG to PNG Converter",
            description: META.description,
            url: `${SITE_URL}/tools/jpg-to-png`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
