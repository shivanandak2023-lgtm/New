"use client";

import { useState, useRef, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "JPG to PDF Converter - Convert Images to PDF Free Online",
  description:
    "Free JPG to PDF converter. Upload multiple JPG or PNG images, reorder them, choose page size and orientation, and download a single PDF. No upload to server.",
  keywords:
    "jpg to pdf, image to pdf converter, convert jpg to pdf free, png to pdf, photo to pdf, picture to pdf online",
};

interface ImageItem {
  id: string;
  file: File;
  url: string;
  name: string;
}

export default function JpgToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "letter" | "auto">("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState<"none" | "small" | "medium">("small");
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const newImages: ImageItem[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      newImages.push({
        id: Math.random().toString(36).slice(2),
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      });
    });
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function moveImage(index: number, direction: "up" | "down") {
    setImages((prev) => {
      const arr = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return prev;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  }

  function removeImage(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  async function generatePdf() {
    if (images.length === 0) return;
    setProcessing(true);

    try {
      const { jsPDF } = await import("jspdf");

      const marginMap = { none: 0, small: 10, medium: 25 };
      const m = marginMap[margin];

      let pdf: InstanceType<typeof jsPDF> | null = null;

      for (let i = 0; i < images.length; i++) {
        const img = new Image();
        img.src = images[i].url;
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
        });

        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;

        let pageW: number;
        let pageH: number;

        if (pageSize === "auto") {
          const pxToMm = 0.264583;
          pageW = imgW * pxToMm + m * 2;
          pageH = imgH * pxToMm + m * 2;
        } else {
          const sizes = {
            a4: { w: 210, h: 297 },
            letter: { w: 215.9, h: 279.4 },
          };
          const s = sizes[pageSize];
          pageW = orientation === "portrait" ? s.w : s.h;
          pageH = orientation === "portrait" ? s.h : s.w;
        }

        if (i === 0) {
          pdf = new jsPDF({
            orientation: pageW > pageH ? "landscape" : "portrait",
            unit: "mm",
            format: [pageW, pageH],
          });
        } else {
          pdf!.addPage([pageW, pageH], pageW > pageH ? "landscape" : "portrait");
        }

        const availW = pageW - m * 2;
        const availH = pageH - m * 2;
        const ratio = Math.min(availW / imgW, availH / imgH);
        const drawW = imgW * ratio;
        const drawH = imgH * ratio;
        const x = m + (availW - drawW) / 2;
        const y = m + (availH - drawH) / 2;

        const canvas = document.createElement("canvas");
        canvas.width = imgW;
        canvas.height = imgH;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

        pdf!.addImage(dataUrl, "JPEG", x, y, drawW, drawH);
      }

      if (pdf) {
        pdf.save("converted-images.pdf");
      }
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
      <link rel="canonical" href={`${SITE_URL}/tools/jpg-to-pdf`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/jpg-to-pdf`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">JPG to PDF Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert JPG, PNG, and other images to a single PDF. Reorder pages, choose size and orientation. Everything runs in your browser.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-[var(--primary)] bg-blue-50"
                : "border-[var(--card-border)] hover:border-[var(--primary)]"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
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
              onChange={(e) => e.target.files?.length && addFiles(e.target.files)}
            />
            <svg className="mx-auto mb-3 text-[var(--muted)]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-[var(--muted)]">
              {images.length > 0
                ? `${images.length} image(s) selected — click or drop to add more`
                : "Drag & drop images or click to browse (JPG, PNG)"}
            </p>
          </div>

          {images.length > 0 && (
            <>
              <div className="mt-6 space-y-2 max-h-64 overflow-y-auto">
                {images.map((img, idx) => (
                  <div key={img.id} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)]">
                    <img src={img.url} alt={img.name} className="w-12 h-12 object-cover rounded" />
                    <span className="flex-1 text-sm truncate">{img.name}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveImage(idx, "up")}
                        disabled={idx === 0}
                        className="px-2 py-1 text-xs rounded border border-[var(--card-border)] disabled:opacity-30 hover:bg-gray-100"
                        title="Move up"
                      >
                        &uarr;
                      </button>
                      <button
                        onClick={() => moveImage(idx, "down")}
                        disabled={idx === images.length - 1}
                        className="px-2 py-1 text-xs rounded border border-[var(--card-border)] disabled:opacity-30 hover:bg-gray-100"
                        title="Move down"
                      >
                        &darr;
                      </button>
                      <button
                        onClick={() => removeImage(img.id)}
                        className="px-2 py-1 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50"
                        title="Remove"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Page Size</label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as "a4" | "letter" | "auto")}
                    className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="a4">A4</option>
                    <option value="letter">Letter</option>
                    <option value="auto">Auto (fit image)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Orientation</label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as "portrait" | "landscape")}
                    className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                    disabled={pageSize === "auto"}
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Margin</label>
                  <select
                    value={margin}
                    onChange={(e) => setMargin(e.target.value as "none" | "small" | "medium")}
                    className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="none">None</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
              </div>

              <button onClick={generatePdf} disabled={processing} className="btn-primary mt-6 w-full">
                {processing ? "Generating PDF..." : `Convert ${images.length} Image(s) to PDF`}
              </button>
            </>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Free JPG to PDF Converter Online</h2>
          <p>
            Converting JPG images to PDF is one of the most common document tasks on the internet, with millions of people searching for a reliable, free tool every month. Whether you need to compile multiple photos into a single document for a job application, merge scanned receipts for expense reporting, or create a photo album in PDF format, this tool handles it all with zero hassle. Our JPG to PDF converter runs entirely in your browser, meaning your images never leave your device and are never uploaded to any external server. Privacy and speed are built right in.
          </p>

          <h2>How to Convert JPG to PDF</h2>
          <p>
            Using this tool is straightforward. Click the upload area or drag and drop your JPG, PNG, or other image files. You can add multiple images at once. Once uploaded, you will see thumbnails of every image in a list. Use the up and down arrows to reorder images so they appear in the correct sequence in the final PDF. Then choose your preferred page size (A4, US Letter, or Auto which fits each page to the image dimensions), orientation (portrait or landscape), and margin size. When everything looks right, click the convert button and your browser will generate a PDF file and download it instantly.
          </p>

          <h2>Why Choose This Image to PDF Converter?</h2>
          <ul>
            <li>100% free with no watermarks, no sign-up, and no file limits</li>
            <li>All processing happens in your browser — your files stay private</li>
            <li>Support for JPG, JPEG, PNG, WebP, BMP, and other browser-supported formats</li>
            <li>Reorder images before conversion to control page sequence</li>
            <li>Choose from A4, US Letter, or auto-fit page sizes</li>
            <li>Portrait and landscape orientation options</li>
            <li>Adjustable margins (none, small, or medium)</li>
            <li>Each image is placed on its own page and properly scaled to fit</li>
          </ul>

          <h2>Common Use Cases for JPG to PDF Conversion</h2>
          <p>
            People convert images to PDF for many reasons. Students scan handwritten notes and compile them into a single PDF for sharing. Professionals merge screenshots and diagrams into presentations or reports. Photographers create PDF portfolios of their work. Business owners compile receipts, invoices, and contracts into organized PDF archives. Government forms and visa applications often require documents in PDF format, so converting photos of your documents is essential. This tool makes all of these workflows quick and painless.
          </p>

          <h3>Supported Image Formats</h3>
          <p>
            While this tool is called a JPG to PDF converter, it actually supports any image format that your web browser can render. This includes JPEG, PNG, WebP, BMP, GIF (first frame), and AVIF on supported browsers. Simply drag and drop any combination of these formats and they will all be included in the final PDF document.
          </p>

          <h3>Tips for Best Results</h3>
          <p>
            For the sharpest output, use high-resolution source images. If your images are photos of documents, make sure they are well-lit and aligned before uploading. Use the Auto page size option when you want each page to match the exact dimensions of the corresponding image, which is ideal for mixed-size images. For uniform documents, stick with A4 or Letter size. The small margin setting works well for most use cases, adding a clean border around each image without wasting too much space.
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
            name: "JPG to PDF Converter",
            description: META.description,
            url: `${SITE_URL}/tools/jpg-to-pdf`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
