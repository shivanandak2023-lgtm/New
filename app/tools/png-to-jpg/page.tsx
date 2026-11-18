"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "PNG to JPG Converter - Convert PNG to JPEG Online Free",
  description:
    "Free PNG to JPG Converter. Upload PNG images and convert to JPEG with adjustable quality. Batch mode available. See file size comparison. 100% browser-based.",
  keywords: "png to jpg, png to jpeg, convert png to jpg, image converter, png jpg converter, reduce image size",
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

export default function PngToJpgPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ConvertedImage[]>([]);
  const [quality, setQuality] = useState<number>(85);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList) {
    const newFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      if (f.type === "image/png") {
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
        // Fill white background since JPG doesn't support transparency
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), "image/jpeg", quality / 100);
        });

        converted.push({
          name: file.name.replace(/\.png$/i, ".jpg"),
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
      <link rel="canonical" href={`${SITE_URL}/tools/png-to-jpg`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">PNG to JPG Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert PNG images to JPG with adjustable quality. Batch conversion supported. 100% browser-based.
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
              accept=".png"
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
              {files.length > 0 ? `${files.length} PNG file(s) selected` : "Drag & drop PNG images or click to browse"}
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

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
                <div className="flex justify-between text-xs text-[var(--muted)]">
                  <span>Small file (10%)</span>
                  <span>Best quality (100%)</span>
                </div>
              </div>

              <button onClick={convert} disabled={processing} className="btn-primary mt-4 w-full">
                {processing ? "Converting..." : `Convert ${files.length} Image${files.length !== 1 ? "s" : ""} to JPG`}
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
                  <p className="text-xs text-[var(--muted)]">Savings</p>
                  <p className={`text-sm font-bold ${savings > 0 ? "text-green-700" : "text-red-600"}`}>{savings}%</p>
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
                      {r.originalSize > r.convertedSize && (
                        <span className="text-green-600 ml-1">(-{Math.round(((r.originalSize - r.convertedSize) / r.originalSize) * 100)}%)</span>
                      )}
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
          <h2>Why Convert PNG to JPG?</h2>
          <p>
            JPG (JPEG) uses lossy compression that produces much smaller files than PNG. This is ideal for
            photographs and images where a slight reduction in quality is acceptable in exchange for
            significantly smaller file sizes.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Adjustable quality slider (10% to 100%)</li>
            <li>Batch convert multiple PNG files at once</li>
            <li>White background fills transparent areas</li>
            <li>Before/after size comparison for each file</li>
            <li>Individual or bulk download</li>
          </ul>

          <h2>PNG vs JPG</h2>
          <ul>
            <li><strong>PNG:</strong> Lossless, supports transparency, larger file sizes</li>
            <li><strong>JPG:</strong> Lossy, no transparency, much smaller file sizes</li>
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
            name: "PNG to JPG Converter",
            description: META.description,
            url: `${SITE_URL}/tools/png-to-jpg`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
