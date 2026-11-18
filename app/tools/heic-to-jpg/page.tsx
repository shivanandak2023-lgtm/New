"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "HEIC to JPG Converter - Convert iPhone Photos Online Free",
  description:
    "Free HEIC to JPG Converter. Upload HEIC/HEIF photos from iPhone and convert to JPG or PNG. Adjustable quality. Batch mode. 100% browser-based.",
  keywords: "heic to jpg, heic to jpeg, heif to jpg, convert heic, iphone photo converter, heic converter online free",
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

export default function HeicToJpgPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ConvertedImage[]>([]);
  const [quality, setQuality] = useState<number>(85);
  const [outputFormat, setOutputFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList) {
    const newFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      const ext = f.name.toLowerCase();
      if (ext.endsWith(".heic") || ext.endsWith(".heif") || f.type === "image/heic" || f.type === "image/heif") {
        newFiles.push(f);
      }
    }
    if (newFiles.length === 0) {
      setError("Please upload HEIC or HEIF files only.");
      return;
    }
    setFiles((prev) => [...prev, ...newFiles]);
    setResults([]);
    setError("");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }

  async function convert() {
    if (files.length === 0) return;
    setProcessing(true);
    setError("");
    const converted: ConvertedImage[] = [];

    try {
      const heic2any = (await import("heic2any")).default;

      for (const file of files) {
        try {
          const result = await heic2any({
            blob: file,
            toType: outputFormat,
            quality: quality / 100,
          });

          const blob = Array.isArray(result) ? result[0] : result;
          const ext = outputFormat === "image/png" ? ".png" : ".jpg";

          converted.push({
            name: file.name.replace(/\.heic$/i, ext).replace(/\.heif$/i, ext),
            originalSize: file.size,
            convertedSize: blob.size,
            url: URL.createObjectURL(blob),
          });
        } catch {
          converted.push({
            name: file.name + " (failed)",
            originalSize: file.size,
            convertedSize: 0,
            url: "",
          });
        }
      }
    } catch {
      setError("Failed to load the HEIC conversion library. Please try again.");
    }

    setResults(converted.filter((r) => r.url));
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
    setError("");
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/heic-to-jpg`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/heic-to-jpg`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">HEIC to JPG Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert iPhone HEIC/HEIF photos to JPG or PNG. Batch conversion supported. 100% browser-based.
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
              accept=".heic,.heif"
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
              {files.length > 0 ? `${files.length} HEIC file(s) selected` : "Drag & drop HEIC/HEIF images or click to browse"}
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 mt-3">{error}</p>
          )}

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
          <h2>What is HEIC Format?</h2>
          <p>
            HEIC (High Efficiency Image Container) is the default photo format on iPhones and iPads since
            iOS 11. It offers better compression than JPEG while maintaining higher quality. However, many
            devices and applications don&apos;t support HEIC natively.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Convert HEIC/HEIF to JPG or PNG</li>
            <li>Adjustable quality for JPG output</li>
            <li>Batch convert multiple files at once</li>
            <li>See original and converted file sizes</li>
            <li>Individual or bulk download</li>
          </ul>

          <h2>When to Use This Tool</h2>
          <ul>
            <li>Share iPhone photos on platforms that don&apos;t support HEIC</li>
            <li>Upload photos to websites that require JPG or PNG</li>
            <li>Open HEIC files on Windows or older devices</li>
            <li>Edit photos in applications that don&apos;t support HEIC</li>
          </ul>

          <h3>Privacy</h3>
          <p>
            All conversion happens in your browser. No photos are uploaded to any server.
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
            name: "HEIC to JPG Converter",
            description: META.description,
            url: `${SITE_URL}/tools/heic-to-jpg`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
