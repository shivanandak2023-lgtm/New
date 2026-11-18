"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Image to PDF Converter - Convert Images to PDF Online Free",
  description:
    "Free Image to PDF Converter. Upload multiple images (JPG, PNG, WebP) and create a PDF with each image as a page. Choose page size, orientation, and margin. 100% browser-based.",
  keywords: "image to pdf, jpg to pdf, png to pdf, convert images to pdf, photo to pdf, picture to pdf",
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

interface ImageItem {
  file: File;
  url: string;
  width: number;
  height: number;
}

export default function ImageToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState<number>(10);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    const newImages: ImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!f.type.startsWith("image/")) continue;
      const url = URL.createObjectURL(f);
      const dims = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.src = url;
      });
      newImages.push({ file: f, url, width: dims.width, height: dims.height });
    }
    setImages((prev) => [...prev, ...newImages]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }

  function removeImage(index: number) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((prev) => {
      const arr = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= arr.length) return arr;
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr;
    });
  }

  async function generatePdf() {
    if (images.length === 0) return;
    setProcessing(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation,
        unit: "mm",
        format: pageSize,
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage();

        const img = images[i];
        const availWidth = pageWidth - margin * 2;
        const availHeight = pageHeight - margin * 2;

        // Scale image to fit within available space
        const imgRatio = img.width / img.height;
        const pageRatio = availWidth / availHeight;

        let drawWidth: number;
        let drawHeight: number;

        if (imgRatio > pageRatio) {
          drawWidth = availWidth;
          drawHeight = availWidth / imgRatio;
        } else {
          drawHeight = availHeight;
          drawWidth = availHeight * imgRatio;
        }

        const x = margin + (availWidth - drawWidth) / 2;
        const y = margin + (availHeight - drawHeight) / 2;

        // Convert image to data URL
        const canvas = document.createElement("canvas");
        const imgEl = new window.Image();
        imgEl.src = img.url;
        await new Promise<void>((resolve) => { imgEl.onload = () => resolve(); });
        canvas.width = imgEl.naturalWidth;
        canvas.height = imgEl.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(imgEl, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

        doc.addImage(dataUrl, "JPEG", x, y, drawWidth, drawHeight);
      }

      doc.save("images.pdf");
    } catch {
      // silently fail
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/image-to-pdf`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Image to PDF Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Upload multiple images and create a PDF with each image on its own page. Drag to reorder.
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
              {images.length > 0 ? `${images.length} image(s) selected — click to add more` : "Drag & drop images or click to browse"}
            </p>
          </div>

          {images.length > 0 && (
            <>
              {/* Thumbnail list */}
              <div className="mt-6 space-y-3">
                {images.map((img, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 border rounded-lg bg-[var(--muted-bg)]">
                    <img src={img.url} alt={img.file.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{img.file.name}</p>
                      <p className="text-xs text-[var(--muted)]">{img.width} x {img.height} &middot; {formatBytes(img.file.size)}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => moveImage(i, -1)} disabled={i === 0} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 text-sm">&uarr;</button>
                      <button onClick={() => moveImage(i, 1)} disabled={i === images.length - 1} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 text-sm">&darr;</button>
                      <button onClick={() => removeImage(i)} className="p-1.5 rounded hover:bg-red-100 text-red-600 text-sm">&times;</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Page Size</label>
                  <select value={pageSize} onChange={(e) => setPageSize(e.target.value as "a4" | "letter")} className="w-full p-2 border rounded-lg bg-[var(--muted-bg)]">
                    <option value="a4">A4 (210 x 297 mm)</option>
                    <option value="letter">Letter (8.5 x 11 in)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Orientation</label>
                  <select value={orientation} onChange={(e) => setOrientation(e.target.value as "portrait" | "landscape")} className="w-full p-2 border rounded-lg bg-[var(--muted-bg)]">
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Margin: {margin}mm</label>
                  <input type="range" min="0" max="30" value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
                </div>
              </div>

              <button onClick={generatePdf} disabled={processing} className="btn-primary mt-6 w-full">
                {processing ? "Generating PDF..." : `Create PDF (${images.length} page${images.length !== 1 ? "s" : ""})`}
              </button>
            </>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does Image to PDF Conversion Work?</h2>
          <p>
            This tool uses jsPDF to create a PDF document where each uploaded image becomes a separate page.
            Images are automatically scaled to fit the page while maintaining their aspect ratio.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Upload multiple images at once (JPG, PNG, WebP, GIF)</li>
            <li>Reorder images with up/down buttons</li>
            <li>Choose page size (A4 or Letter) and orientation</li>
            <li>Adjustable margins for professional output</li>
            <li>Preview thumbnails with file info</li>
          </ul>

          <h2>Common Uses</h2>
          <ul>
            <li>Create photo albums as PDF documents</li>
            <li>Combine scanned pages into a single PDF</li>
            <li>Package screenshots or receipts for sharing</li>
            <li>Prepare image portfolios for printing</li>
          </ul>

          <h3>Privacy</h3>
          <p>
            All processing happens in your browser. No images are uploaded to any server.
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
            name: "Image to PDF Converter",
            description: META.description,
            url: `${SITE_URL}/tools/image-to-pdf`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
