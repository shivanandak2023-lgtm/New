"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "PDF Viewer - View PDF Files Online Free",
  description:
    "Free online PDF Viewer. Upload and view PDF files in your browser with zoom controls, page navigation, fullscreen mode, and download option.",
  keywords: "pdf viewer, view pdf online, pdf reader, open pdf, pdf viewer free, read pdf online",
};

export default function PdfViewerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string>("");
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === "application/pdf") {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      const url = URL.createObjectURL(f);
      setFile(f);
      setObjectUrl(url);
      setZoom(100);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type === "application/pdf") {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      const url = URL.createObjectURL(f);
      setFile(f);
      setObjectUrl(url);
      setZoom(100);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleDownload = () => {
    if (!file || !objectUrl) return;
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = file.name;
    a.click();
  };

  const clearFile = () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setFile(null);
    setObjectUrl("");
    setZoom(100);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/pdf-viewer`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/pdf-viewer`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">PDF Viewer</h1>
        <p className="text-[var(--muted)] mb-8">
          Upload and view PDF files directly in your browser. Zoom, navigate, go fullscreen, or download.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {!file ? (
          <div
            className="tool-card mb-8 border-2 border-dashed border-[var(--border)] rounded-lg p-12 text-center cursor-pointer hover:border-[var(--primary)] transition-colors"
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <p className="text-4xl mb-4">📄</p>
            <p className="text-lg font-semibold mb-2">Drop a PDF file here or click to upload</p>
            <p className="text-sm text-[var(--muted)]">Only PDF files are supported</p>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="mb-8">
            <div className="tool-card mb-4">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
                <span className="text-xs text-[var(--muted)]">({(file.size / 1024).toFixed(1)} KB)</span>
                <div className="flex-1" />
                <div className="flex items-center gap-2">
                  <button onClick={() => setZoom((z) => Math.max(25, z - 25))} className="btn-secondary text-sm px-3 py-1">−</button>
                  <span className="text-sm font-mono w-14 text-center">{zoom}%</span>
                  <button onClick={() => setZoom((z) => Math.min(300, z + 25))} className="btn-secondary text-sm px-3 py-1">+</button>
                </div>
                <button onClick={toggleFullscreen} className="btn-secondary text-sm px-3 py-1">
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </button>
                <button onClick={handleDownload} className="btn-primary text-sm px-3 py-1">Download</button>
                <button onClick={clearFile} className="btn-secondary text-sm px-3 py-1">Clear</button>
              </div>
            </div>

            <div ref={containerRef} className="tool-card overflow-auto" style={{ height: "80vh" }}>
              <iframe
                src={objectUrl}
                title="PDF Viewer"
                style={{ width: `${zoom}%`, height: "100%", border: "none", transformOrigin: "top left" }}
              />
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is the PDF Viewer?</h2>
          <p>
            The PDF Viewer lets you open and read PDF files directly in your browser without installing any software.
            Your files are processed locally and never uploaded to any server.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Zoom Controls:</strong> Zoom in and out from 25% to 300% for comfortable reading</li>
            <li><strong>Fullscreen Mode:</strong> View your PDF in fullscreen for distraction-free reading</li>
            <li><strong>Download:</strong> Download the original PDF file at any time</li>
            <li><strong>Drag &amp; Drop:</strong> Simply drag a PDF file onto the page to open it</li>
            <li><strong>Privacy:</strong> All processing happens in your browser — no files are uploaded</li>
          </ul>

          <h2>Supported Formats</h2>
          <p>
            This tool supports standard PDF files. The viewing experience depends on your browser&apos;s built-in
            PDF rendering capabilities.
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
            name: "PDF Viewer",
            description: META.description,
            url: `${SITE_URL}/tools/pdf-viewer`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
