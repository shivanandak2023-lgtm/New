"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "PDF Watermark - Add Watermark to PDF Online Free",
  description:
    "Free PDF watermark tool. Add custom text watermarks to every page of your PDF. Choose font size, color, opacity, rotation, and position. No server upload.",
  keywords: "pdf watermark, add watermark to pdf, watermark pdf online, pdf stamp, text watermark pdf",
};

export default function PdfWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(30);
  const [color, setColor] = useState("#ff0000");
  const [rotation, setRotation] = useState(45);
  const [position, setPosition] = useState<"center" | "diagonal" | "top" | "bottom">("center");
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");
  const [pageCount, setPageCount] = useState(0);
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
    setPageCount(0);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16) / 255, g: parseInt(result[2], 16) / 255, b: parseInt(result[3], 16) / 255 }
      : { r: 1, g: 0, b: 0 };
  }

  async function addWatermark() {
    if (!file || !watermarkText.trim()) return;
    setProcessing(true);
    setError("");

    try {
      const { PDFDocument, rgb, degrees, StandardFonts } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      setPageCount(pages.length);

      const { r, g, b } = hexToRgb(color);
      const opacityVal = opacity / 100;

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);

        let x: number;
        let y: number;
        let rot: number;

        switch (position) {
          case "diagonal":
            x = width / 2 - textWidth / 2;
            y = height / 2;
            rot = -45;
            break;
          case "top":
            x = width / 2 - textWidth / 2;
            y = height - 60;
            rot = 0;
            break;
          case "bottom":
            x = width / 2 - textWidth / 2;
            y = 40;
            rot = 0;
            break;
          default: // center
            x = width / 2 - textWidth / 2;
            y = height / 2 - fontSize / 2;
            rot = rotation;
        }

        page.drawText(watermarkText, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(r, g, b),
          opacity: opacityVal,
          rotate: degrees(rot),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      setError("Failed to add watermark. The PDF may be encrypted or corrupted.");
    } finally {
      setProcessing(false);
    }
  }

  function download() {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `watermarked-${file.name}`;
    a.click();
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/pdf-watermark`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/pdf-watermark`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">PDF Watermark</h1>
        <p className="text-[var(--muted)] mb-8">
          Add a custom text watermark to every page of your PDF. Choose font size, color, opacity, and position. All processing happens in your browser.
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

          {file && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Watermark Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2"
                  placeholder="e.g. CONFIDENTIAL"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Font Size: {fontSize}px</label>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Opacity: {opacity}%</label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-9 rounded border border-[var(--card-border)] cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rotation: {rotation}&deg;</label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full accent-[var(--primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <div className="flex flex-wrap gap-2">
                  {(["center", "diagonal", "top", "bottom"] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setPosition(pos)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        position === pos
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--card-bg)] border border-[var(--card-border)]"
                      }`}
                    >
                      {pos.charAt(0).toUpperCase() + pos.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="border border-[var(--card-border)] rounded-lg p-6 bg-white relative overflow-hidden" style={{ minHeight: 200 }}>
                <p className="text-xs text-[var(--muted)] mb-2">Preview</p>
                <div className="flex items-center justify-center" style={{ minHeight: 150 }}>
                  <span
                    style={{
                      fontSize: `${Math.min(fontSize, 40)}px`,
                      color: color,
                      opacity: opacity / 100,
                      transform: `rotate(${position === "diagonal" ? -45 : rotation}deg)`,
                      fontFamily: "Helvetica, Arial, sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {watermarkText}
                  </span>
                </div>
              </div>

              <button onClick={addWatermark} disabled={processing || !watermarkText.trim()} className="btn-primary w-full">
                {processing ? "Adding Watermark..." : "Add Watermark to PDF"}
              </button>
            </div>
          )}

          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </div>

        {resultUrl && (
          <div className="result-card mb-8">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-green-700">Watermark Added!</h2>
              <p className="text-[var(--muted)] text-sm mt-1">
                Applied &quot;{watermarkText}&quot; to {pageCount} page(s)
              </p>
            </div>
            <button onClick={download} className="btn-primary w-full">
              Download Watermarked PDF
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does PDF Watermark Work?</h2>
          <p>
            This tool uses the pdf-lib library to add text watermarks directly onto every page of your PDF.
            You can customize the text, font size, color, opacity, rotation angle, and position of the watermark.
          </p>

          <h2>Common Watermark Uses</h2>
          <ul>
            <li>Mark documents as &quot;CONFIDENTIAL&quot; or &quot;DRAFT&quot;</li>
            <li>Add company name or logo text to documents</li>
            <li>Mark documents as &quot;COPY&quot; or &quot;SAMPLE&quot;</li>
            <li>Add date stamps or version numbers</li>
            <li>Protect documents from unauthorized distribution</li>
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
            name: "PDF Watermark",
            description: META.description,
            url: `${SITE_URL}/tools/pdf-watermark`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
