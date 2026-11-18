"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "SVG to PNG Converter - Convert SVG Online Free",
  description:
    "Convert SVG to PNG online for free. Paste SVG code or upload a file. Choose output scale (1x-4x). Download high-quality PNG. No server upload required.",
  keywords: "svg to png, convert svg, svg converter, svg to image, vector to raster, svg to png online",
};

export default function SvgToPngPage() {
  const [svgCode, setSvgCode] = useState("");
  const [svgPreview, setSvgPreview] = useState("");
  const [pngUrl, setPngUrl] = useState("");
  const [scale, setScale] = useState(2);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setSvgCode(text);
      previewSvg(text);
    };
    reader.readAsText(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  function previewSvg(code: string) {
    const blob = new Blob([code], { type: "image/svg+xml" });
    setSvgPreview(URL.createObjectURL(blob));
    setPngUrl("");
  }

  function handleCodeChange(code: string) {
    setSvgCode(code);
    if (code.trim().startsWith("<svg")) {
      previewSvg(code);
    }
  }

  async function convert() {
    if (!svgCode.trim()) return;
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.src = url;
    await new Promise<void>((r) => { img.onload = () => r(); });

    const w = (img.naturalWidth || 300) * scale;
    const h = (img.naturalHeight || 150) * scale;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);

    const pngBlob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/png"));
    setPngUrl(URL.createObjectURL(pngBlob));
  }

  function download() {
    if (!pngUrl) return;
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = `converted-${scale}x.png`;
    a.click();
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/svg-to-png`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">SVG to PNG Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert SVG to high-quality PNG. Paste SVG code or upload a file. All processing in your browser.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors mb-4 ${
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
              accept=".svg"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <svg className="mx-auto mb-2 text-[var(--muted)]" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-sm text-[var(--muted)]">Upload .svg file or drag & drop</p>
          </div>

          <label className="block text-sm font-medium mb-2">Or paste SVG code</label>
          <textarea
            value={svgCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">...</svg>'
            rows={8}
            className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-xs font-mono mb-4"
          />

          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-medium">Output Scale:</label>
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  scale === s ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button onClick={convert} disabled={!svgCode.trim()} className="btn-primary w-full">
            Convert to PNG
          </button>
        </div>

        {svgPreview && (
          <div className="tool-card mb-8">
            <p className="text-sm font-medium mb-2">SVG Preview</p>
            <div className="border border-[var(--card-border)] rounded-lg p-4 bg-white flex items-center justify-center" style={{ minHeight: 150 }}>
              <img src={svgPreview} alt="SVG preview" className="max-w-full max-h-64" />
            </div>
          </div>
        )}

        {pngUrl && (
          <div className="result-card mb-8">
            <p className="text-sm font-medium mb-2">PNG Output ({scale}x)</p>
            <div className="border border-[var(--card-border)] rounded-lg p-4 bg-white flex items-center justify-center mb-4" style={{ minHeight: 150 }}>
              <img src={pngUrl} alt="PNG output" className="max-w-full max-h-64" />
            </div>
            <button onClick={download} className="btn-primary w-full">
              Download PNG
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How SVG to PNG Conversion Works</h2>
          <p>
            This tool renders your SVG in the browser and draws it onto an HTML Canvas at your chosen
            scale factor. The Canvas is then exported as a PNG image. Higher scale factors produce
            larger, higher-resolution images.
          </p>

          <h2>Why Convert SVG to PNG?</h2>
          <ul>
            <li>Not all platforms support SVG (social media, email)</li>
            <li>PNG provides pixel-perfect rendering at a specific size</li>
            <li>Easier to share as standalone images</li>
            <li>Required for some app stores and icon submissions</li>
          </ul>

          <h2>PNG to SVG (Reverse)</h2>
          <p>
            Converting PNG to SVG requires vector tracing, which produces approximate results.
            Tools like Inkscape (free) or Adobe Illustrator can auto-trace raster images to vectors.
            For best results, use high-contrast images with clean edges.
          </p>

          <h2>Privacy</h2>
          <p>
            All conversion happens in your browser. No files are uploaded to any server.
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
            name: "SVG to PNG Converter",
            description: META.description,
            url: `${SITE_URL}/tools/svg-to-png`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
