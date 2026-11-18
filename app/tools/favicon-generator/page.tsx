"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Favicon Generator - Create Favicons from Image Free",
  description:
    "Generate favicons in all sizes from any image. Create 16x16, 32x32, 48x48, 64x64, 180x180 (Apple Touch), 192x192, and 512x512 icons. Download individually or all at once.",
  keywords: "favicon generator, create favicon, favicon from image, apple touch icon, favicon sizes, ico generator",
};

const SIZES = [
  { size: 16, label: "16x16", desc: "Browser tab" },
  { size: 32, label: "32x32", desc: "Standard favicon" },
  { size: 48, label: "48x48", desc: "Windows site" },
  { size: 64, label: "64x64", desc: "High-res tab" },
  { size: 180, label: "180x180", desc: "Apple Touch Icon" },
  { size: 192, label: "192x192", desc: "Android Chrome" },
  { size: 512, label: "512x512", desc: "PWA icon" },
];

export default function FaviconGeneratorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [generated, setGenerated] = useState<{ size: number; label: string; desc: string; url: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setGenerated([]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  async function generate() {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise<void>((r) => { img.onload = () => r(); });

    const results: typeof generated = [];
    for (const s of SIZES) {
      const canvas = document.createElement("canvas");
      canvas.width = s.size;
      canvas.height = s.size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, s.size, s.size);
      const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/png"));
      results.push({ ...s, url: URL.createObjectURL(blob) });
    }
    setGenerated(results);
  }

  function downloadOne(url: string, size: number) {
    const a = document.createElement("a");
    a.href = url;
    a.download = `favicon-${size}x${size}.png`;
    a.click();
  }

  function downloadAll() {
    for (const g of generated) {
      downloadOne(g.url, g.size);
    }
  }

  const htmlTags = `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">`;

  function copyTags() {
    navigator.clipboard.writeText(htmlTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/favicon-generator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/favicon-generator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Favicon Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Upload an image and generate favicons in all standard sizes. Everything runs in your browser.
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
              {file ? file.name : "Drag & drop an image or click to browse"}
            </p>
          </div>

          {preview && (
            <div className="mt-4 flex items-center gap-4">
              <img src={preview} alt="Source" className="w-16 h-16 rounded-lg object-cover" />
              <button onClick={generate} className="btn-primary">
                Generate Favicons
              </button>
            </div>
          )}
        </div>

        {generated.length > 0 && (
          <div className="result-card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Generated Favicons</h2>
              <button onClick={downloadAll} className="btn-primary text-sm">
                Download All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {generated.map((g) => (
                <div key={g.size} className="tool-card text-center">
                  <div className="flex items-center justify-center mb-2" style={{ minHeight: 64 }}>
                    <img src={g.url} alt={g.label} style={{ width: Math.min(g.size, 64), height: Math.min(g.size, 64) }} />
                  </div>
                  <p className="text-sm font-medium">{g.label}</p>
                  <p className="text-xs text-[var(--muted)] mb-2">{g.desc}</p>
                  <button
                    onClick={() => downloadOne(g.url, g.size)}
                    className="text-xs text-[var(--primary)] hover:underline"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">HTML Link Tags</p>
                <button onClick={copyTags} className="text-xs text-[var(--primary)]">
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="bg-gray-50 border border-[var(--card-border)] rounded-lg p-3 text-xs font-mono overflow-x-auto whitespace-pre">
                {htmlTags}
              </pre>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Favicon Sizes Do You Need?</h2>
          <p>
            Modern websites need favicons in multiple sizes for different devices and platforms.
            This tool generates all common sizes from a single image.
          </p>

          <h2>Standard Favicon Sizes</h2>
          <ul>
            <li>16x16 and 32x32 — Browser tabs</li>
            <li>48x48 — Windows site icons</li>
            <li>180x180 — Apple Touch Icon (iOS home screen)</li>
            <li>192x192 and 512x512 — Android Chrome and PWA</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            All processing happens locally in your browser using the Canvas API.
            No images are uploaded to any server.
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
            name: "Favicon Generator",
            description: META.description,
            url: `${SITE_URL}/tools/favicon-generator`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
