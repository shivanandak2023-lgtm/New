"use client";

import { useState, useRef, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Image Resizer - Resize Images Online Free",
  description:
    "Free online image resizer. Resize images to exact dimensions with aspect ratio lock. Presets for Instagram, Facebook, Twitter, YouTube. No upload to server.",
  keywords: "image resizer, resize image online, image dimensions, resize photo, crop image, instagram size, facebook cover size",
};

const PRESETS = [
  { label: "Instagram Post", w: 1080, h: 1080 },
  { label: "Instagram Story", w: 1080, h: 1920 },
  { label: "Facebook Cover", w: 820, h: 312 },
  { label: "Twitter Header", w: 1500, h: 500 },
  { label: "YouTube Thumbnail", w: 1280, h: 720 },
];

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [resizedUrl, setResizedUrl] = useState("");
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    setResizedUrl("");
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
    img.src = url;
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) loadImage(e.dataTransfer.files[0]);
  }

  function updateWidth(w: number) {
    setWidth(w);
    if (lockAspect && origW > 0) {
      setHeight(Math.round((w / origW) * origH));
    }
  }

  function updateHeight(h: number) {
    setHeight(h);
    if (lockAspect && origH > 0) {
      setWidth(Math.round((h / origH) * origW));
    }
  }

  function applyPreset(w: number, h: number) {
    setLockAspect(false);
    setWidth(w);
    setHeight(h);
  }

  function resize() {
    if (!file || width <= 0 || height <= 0) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) setResizedUrl(URL.createObjectURL(blob));
      }, file.type === "image/png" ? "image/png" : "image/jpeg", 0.92);
    };
    img.src = URL.createObjectURL(file);
  }

  function download() {
    if (!resizedUrl || !file) return;
    const a = document.createElement("a");
    a.href = resizedUrl;
    const ext = file.name.split(".").pop() || "jpg";
    a.download = `resized-${width}x${height}.${ext}`;
    a.click();
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/image-resizer`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/image-resizer`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Image Resizer</h1>
        <p className="text-[var(--muted)] mb-8">
          Resize images to exact dimensions. All processing happens in your browser.
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
              onChange={(e) => e.target.files?.[0] && loadImage(e.target.files[0])}
            />
            <svg className="mx-auto mb-3 text-[var(--muted)]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-[var(--muted)]">
              {file ? file.name : "Drag & drop an image or click to browse"}
            </p>
            {file && (
              <p className="text-sm text-[var(--muted)] mt-1">Original: {origW} x {origH}px</p>
            )}
          </div>

          {file && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-3">Preset Sizes</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.w, p.h)}
                    className="px-3 py-1 text-xs rounded-full border border-[var(--card-border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                  >
                    {p.label} ({p.w}x{p.h})
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => updateWidth(Number(e.target.value))}
                    min={1}
                    className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => updateHeight(Number(e.target.value))}
                    min={1}
                    className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lockAspect}
                  onChange={(e) => setLockAspect(e.target.checked)}
                  className="accent-[var(--primary)]"
                />
                <span className="text-sm">Lock aspect ratio</span>
              </label>

              <button onClick={resize} className="btn-primary w-full">
                Resize Image
              </button>
            </div>
          )}
        </div>

        {resizedUrl && (
          <div className="result-card mb-8">
            <p className="text-sm font-medium mb-2">Resized Preview ({width} x {height}px)</p>
            <img src={resizedUrl} alt="Resized" className="w-full rounded-lg mb-4" />
            <button onClick={download} className="btn-primary w-full">
              Download Resized Image
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does Image Resizing Work?</h2>
          <p>
            This tool uses the HTML Canvas API to resize your images to exact pixel dimensions.
            You can lock the aspect ratio to prevent distortion, or set custom width and height
            independently. Everything runs in your browser — no files leave your device.
          </p>

          <h2>Social Media Image Size Presets</h2>
          <ul>
            <li>Instagram Post: 1080 x 1080px (square)</li>
            <li>Instagram Story: 1080 x 1920px (9:16 vertical)</li>
            <li>Facebook Cover: 820 x 312px (wide banner)</li>
            <li>Twitter/X Header: 1500 x 500px</li>
            <li>YouTube Thumbnail: 1280 x 720px (16:9)</li>
          </ul>

          <h2>Privacy and Security</h2>
          <p>
            Your images are processed entirely in your browser. No files are uploaded to any server.
            This means your images remain completely private and secure.
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
            name: "Image Resizer",
            description: META.description,
            url: `${SITE_URL}/tools/image-resizer`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
