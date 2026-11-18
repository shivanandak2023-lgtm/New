"use client";

import { useState, useRef, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Background Remover - Remove Image Background Online Free",
  description:
    "Free background remover tool. Upload an image and remove the background using threshold-based detection. Download PNG with transparent background.",
  keywords: "background remover, remove background, transparent background, image background remover, remove bg",
};

export default function BackgroundRemoverPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [threshold, setThreshold] = useState(220);
  const [mode, setMode] = useState<"light" | "dark" | "color">("light");
  const [targetColor, setTargetColor] = useState("#ffffff");
  const [tolerance, setTolerance] = useState(50);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFile(f: File) {
    if (!f.type.startsWith("image/")) return;
    setOriginalFile(f);
    setOriginalUrl(URL.createObjectURL(f));
    setResultUrl("");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  const removeBackground = useCallback(async () => {
    if (!originalFile) return;
    setProcessing(true);

    try {
      const img = new Image();
      img.src = URL.createObjectURL(originalFile);
      await new Promise<void>((resolve) => { img.onload = () => resolve(); });

      const canvas = canvasRef.current || document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      if (mode === "color") {
        // Remove specific color
        const hex = targetColor.replace("#", "");
        const tr = parseInt(hex.substring(0, 2), 16);
        const tg = parseInt(hex.substring(2, 4), 16);
        const tb = parseInt(hex.substring(4, 6), 16);

        for (let i = 0; i < data.length; i += 4) {
          const dist = Math.sqrt(
            Math.pow(data[i] - tr, 2) +
            Math.pow(data[i + 1] - tg, 2) +
            Math.pow(data[i + 2] - tb, 2)
          );
          if (dist < tolerance) {
            data[i + 3] = 0; // Make transparent
          }
        }
      } else if (mode === "light") {
        // Remove light/white background
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness > threshold) {
            data[i + 3] = 0;
          }
        }
      } else {
        // Remove dark/black background
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness < 255 - threshold) {
            data[i + 3] = 0;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      // silently fail
    } finally {
      setProcessing(false);
    }
  }, [originalFile, mode, threshold, targetColor, tolerance]);

  function download() {
    if (!resultUrl || !originalFile) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `no-bg-${originalFile.name.replace(/\.[^.]+$/, "")}.png`;
    a.click();
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/background-remover`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/background-remover`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Background Remover</h1>
        <p className="text-[var(--muted)] mb-8">
          Remove the background from images using threshold-based color detection. Download the result as a PNG with transparent background.
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
          </div>

          {originalFile && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Removal Mode</label>
                <div className="flex flex-wrap gap-2">
                  {([
                    { value: "light" as const, label: "Remove Light Background" },
                    { value: "dark" as const, label: "Remove Dark Background" },
                    { value: "color" as const, label: "Remove Specific Color" },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setMode(opt.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        mode === opt.value
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--card-bg)] border border-[var(--card-border)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {mode === "color" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Target Color</label>
                    <input
                      type="color"
                      value={targetColor}
                      onChange={(e) => setTargetColor(e.target.value)}
                      className="w-full h-10 rounded border border-[var(--card-border)] cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tolerance: {tolerance}</label>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={tolerance}
                      onChange={(e) => setTolerance(Number(e.target.value))}
                      className="w-full accent-[var(--primary)]"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Threshold: {threshold} {mode === "light" ? "(higher = more removal)" : "(higher = more removal)"}
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="255"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full accent-[var(--primary)]"
                  />
                  <div className="flex justify-between text-xs text-[var(--muted)]">
                    <span>Less removal</span>
                    <span>More removal</span>
                  </div>
                </div>
              )}

              <button onClick={removeBackground} disabled={processing} className="btn-primary w-full">
                {processing ? "Processing..." : "Remove Background"}
              </button>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {resultUrl && (
          <div className="result-card mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="tool-card">
                <p className="text-sm font-medium mb-2">Original</p>
                <img src={originalUrl} alt="Original" className="w-full rounded-lg" />
              </div>
              <div className="tool-card" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' width='10' height='10' fill='%23fff'/%3E%3Crect y='10' width='10' height='10' fill='%23fff'/%3E%3C/svg%3E\")" }}>
                <p className="text-sm font-medium mb-2 bg-white/80 inline-block px-2 rounded">Result (transparent)</p>
                <img src={resultUrl} alt="Background removed" className="w-full rounded-lg" />
              </div>
            </div>
            <button onClick={download} className="btn-primary w-full">
              Download PNG (Transparent)
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does Background Removal Work?</h2>
          <p>
            This tool uses Canvas-based pixel analysis to detect and remove background colors. It works
            by analyzing each pixel&apos;s brightness or color distance from a target, then making matching
            pixels transparent.
          </p>

          <h2>Tips for Best Results</h2>
          <ul>
            <li>Works best with solid-color backgrounds (white, black, or single color)</li>
            <li>Adjust the threshold slider to fine-tune the removal</li>
            <li>Use &quot;Remove Specific Color&quot; mode for colored backgrounds</li>
            <li>Increase tolerance for slight color variations in the background</li>
          </ul>

          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
            Note: For complex backgrounds (gradients, photos), professional AI-powered tools like
            remove.bg will produce better results. This tool works best with simple, solid backgrounds.
          </p>

          <h2>Privacy</h2>
          <p>
            Your images are processed entirely in your browser. No files are uploaded to any server.
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
            name: "Background Remover",
            description: META.description,
            url: `${SITE_URL}/tools/background-remover`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
