"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "WebP to JPG Converter - Convert WebP to JPEG/PNG Online Free",
  description:
    "Free WebP to JPG Converter. Upload WebP images and convert to JPG or PNG. Quality slider and batch mode available. 100% browser-based using Canvas API.",
  keywords: "webp to jpg, webp to jpeg, webp to png, convert webp, webp converter, webp image converter online free",
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

export default function WebpToJpgPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ConvertedImage[]>([]);
  const [quality, setQuality] = useState<number>(85);
  const [outputFormat, setOutputFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList) {
    const newFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      if (f.type === "image/webp" || f.name.toLowerCase().endsWith(".webp")) {
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

        // Fill white background for JPG (no transparency)
        if (outputFormat === "image/jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        const qualityValue = outputFormat === "image/png" ? undefined : quality / 100;
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), outputFormat, qualityValue);
        });

        const ext = outputFormat === "image/png" ? ".png" : ".jpg";
        converted.push({
          name: file.name.replace(/\.webp$/i, ext),
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

  const totalOriginal = files.reduce((s, f) => s + f.size, 0);
  const totalConverted = results.reduce((s, r) => s + r.convertedSize, 0);
  const savings = totalOriginal > 0 && totalConverted > 0
    ? Math.round(((totalOriginal - totalConverted) / totalOriginal) * 100)
    : 0;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/webp-to-jpg`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">WebP to JPG Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert WebP images to JPG or PNG format. Batch conversion with quality control. 100% browser-based.
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
              accept=".webp"
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
              {files.length > 0 ? `${files.length} WebP file(s) selected` : "Drag & drop WebP images or click to browse"}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Output Format</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as "image/jpeg" | "image/png")}
                    className="w-full p-2 border rounded-lg bg-[var(--muted-bg)]"
                  >
                    <option value="image/jpeg">JPG (smaller file)</option>
                    <option value="image/png">PNG (lossless)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quality: {quality}%</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-[var(--primary)]"
                    disabled={outputFormat === "image/png"}
                  />
                </div>
              </div>

              <button onClick={convert} disabled={processing} className="btn-primary mt-4 w-full">
                {processing ? "Converting..." : `Convert ${files.length} File${files.length !== 1 ? "s" : ""}`}
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

            {results.length > 1 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 rounded-lg bg-[var(--muted-bg)]">
                  <p className="text-xs text-[var(--muted)]">Original Total</p>
                  <p className="text-sm font-bold">{formatBytes(totalOriginal)}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-[var(--muted-bg)]">
                  <p className="text-xs text-[var(--muted)]">Converted Total</p>
                  <p className="text-sm font-bold text-[var(--primary)]">{formatBytes(totalConverted)}</p>
                </div>
                <div className="text-center p-2 rounded-lg" style={{ background: savings > 0 ? "#f0fdf4" : "#fef2f2" }}>
                  <p className="text-xs text-[var(--muted)]">Size Change</p>
                  <p className={`text-sm font-bold ${savings > 0 ? "text-green-700" : "text-red-600"}`}>
                    {savings > 0 ? `-${savings}%` : `+${Math.abs(savings)}%`}
                  </p>
                </div>
              </div>
            )}

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
          <h2>What is WebP Format?</h2>
          <p>
            WebP is a modern image format developed by Google that provides superior compression for web
            images. While WebP is great for websites, many applications and devices still require JPG or
            PNG format for compatibility.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Convert WebP to JPG or PNG</li>
            <li>Adjustable quality slider for JPG output</li>
            <li>Batch convert multiple WebP files at once</li>
            <li>Before/after file size comparison</li>
            <li>Individual or bulk download</li>
          </ul>

          <h2>When to Use This Tool</h2>
          <ul>
            <li>Convert WebP images saved from websites</li>
            <li>Make WebP files compatible with older software</li>
            <li>Upload images to platforms that don&apos;t support WebP</li>
            <li>Edit WebP images in photo editing apps</li>
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
            name: "WebP to JPG Converter",
            description: META.description,
            url: `${SITE_URL}/tools/webp-to-jpg`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
