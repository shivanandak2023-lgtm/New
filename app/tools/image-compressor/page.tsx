"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Image Compressor - Compress Images Online Free",
  description:
    "Free Image Compressor to reduce image file size without losing quality. Compress JPEG, PNG, and WebP images online. No upload to server.",
  keywords: "image compressor, compress image, reduce image size, image optimizer, compress jpeg png",
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function ImageCompressorPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [compressedUrl, setCompressedUrl] = useState<string>("");
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(80);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setOriginalFile(file);
    setOriginalSize(file.size);
    setOriginalUrl(URL.createObjectURL(file));
    setCompressedUrl("");
    setCompressedSize(0);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  async function compress() {
    if (!originalFile) return;
    setProcessing(true);

    try {
      const img = new Image();
      img.src = URL.createObjectURL(originalFile);
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const mimeType = originalFile.type === "image/png" ? "image/png" : "image/jpeg";
      const qualityValue = mimeType === "image/png" ? undefined : quality / 100;

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), mimeType, qualityValue);
      });

      setCompressedUrl(URL.createObjectURL(blob));
      setCompressedSize(blob.size);
    } catch {
      // silently fail
    } finally {
      setProcessing(false);
    }
  }

  function download() {
    if (!compressedUrl || !originalFile) return;
    const ext = originalFile.name.split(".").pop() || "jpg";
    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = `compressed-${originalFile.name.replace(/\.[^.]+$/, "")}.${ext}`;
    a.click();
  }

  const savings = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/image-compressor`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/image-compressor`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Image Compressor</h1>
        <p className="text-[var(--muted)] mb-8">
          Compress images online without uploading to any server. All processing happens in your browser.
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
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <svg className="mx-auto mb-3 text-[var(--muted)]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-[var(--muted)]">
              {originalFile ? originalFile.name : "Drag & drop an image or click to browse"}
            </p>
            {originalFile && (
              <p className="text-sm text-[var(--muted)] mt-1">Original size: {formatBytes(originalSize)}</p>
            )}
          </div>

          {originalFile && (
            <div className="mt-6">
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
              <button onClick={compress} disabled={processing} className="btn-primary mt-4 w-full">
                {processing ? "Compressing..." : "Compress Image"}
              </button>
            </div>
          )}
        </div>

        {compressedUrl && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="tool-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Original</p>
                <p className="text-xl font-bold">{formatBytes(originalSize)}</p>
              </div>
              <div className="tool-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Compressed</p>
                <p className="text-xl font-bold text-[var(--primary)]">{formatBytes(compressedSize)}</p>
              </div>
              <div className="tool-card text-center" style={{ background: savings > 0 ? "#f0fdf4" : "#fef2f2" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Savings</p>
                <p className={`text-xl font-bold ${savings > 0 ? "text-green-700" : "text-red-600"}`}>
                  {savings}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="tool-card">
                <p className="text-sm font-medium mb-2">Original</p>
                <img src={originalUrl} alt="Original" className="w-full rounded-lg" />
              </div>
              <div className="tool-card">
                <p className="text-sm font-medium mb-2">Compressed</p>
                <img src={compressedUrl} alt="Compressed" className="w-full rounded-lg" />
              </div>
            </div>

            <button onClick={download} className="btn-primary w-full">
              Download Compressed Image
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does Image Compression Work?</h2>
          <p>
            This tool uses your browser&apos;s Canvas API to re-encode images at a lower quality setting. For JPEG
            images, lowering the quality reduces file size significantly while maintaining acceptable visual quality.
            PNG images use lossless compression.
          </p>

          <h2>Benefits of Compressing Images</h2>
          <ul>
            <li>Faster website loading times</li>
            <li>Reduced bandwidth usage</li>
            <li>Better SEO performance (page speed is a ranking factor)</li>
            <li>Lower storage costs</li>
            <li>Easier sharing via email or messaging</li>
          </ul>

          <h2>Privacy and Security</h2>
          <p>
            Your images are processed entirely in your browser. No files are uploaded to any server. This means your
            images remain completely private and secure.
          </p>

          <h3>Supported Formats</h3>
          <p>
            This tool supports JPEG, PNG, WebP, and other common image formats that your browser can render.
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
            name: "Image Compressor",
            description: META.description,
            url: `${SITE_URL}/tools/image-compressor`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
