"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Image to Base64 Converter - Encode Images Online Free",
  description:
    "Convert images to Base64 strings online for free. Get data URI, raw Base64, CSS background, and HTML img tag. Also decode Base64 back to image.",
  keywords: "image to base64, base64 encode image, data uri, image encoder, base64 to image, convert image base64",
};

export default function ImageToBase64Page() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [base64, setBase64] = useState("");
  const [dataUri, setDataUri] = useState("");
  const [fileName, setFileName] = useState("");
  const [copied, setCopied] = useState("");
  const [decodePreview, setDecodePreview] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!f.type.startsWith("image/")) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setDataUri(result);
      setBase64(result.split(",")[1] || "");
    };
    reader.readAsDataURL(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  }

  function decodeBase64() {
    let input = decodeInput.trim();
    if (!input) return;
    if (!input.startsWith("data:")) {
      input = `data:image/png;base64,${input}`;
    }
    setDecodePreview(input);
  }

  const cssCode = dataUri ? `background-image: url('${dataUri}');` : "";
  const htmlCode = dataUri ? `<img src="${dataUri}" alt="${fileName}" />` : "";

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/image-to-base64`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/image-to-base64`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Image to Base64 Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert images to Base64 strings or decode Base64 back to images. All processing in your browser.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "encode" ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
            }`}
          >
            Image &rarr; Base64
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "decode" ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
            }`}
          >
            Base64 &rarr; Image
          </button>
        </div>

        {mode === "encode" && (
          <>
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
                  {fileName || "Drag & drop an image or click to browse"}
                </p>
              </div>
            </div>

            {dataUri && (
              <div className="result-card mb-8 space-y-6">
                <div>
                  <img src={dataUri} alt="Preview" className="max-h-48 rounded-lg mb-4" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">Data URI</label>
                    <button onClick={() => copy(dataUri, "datauri")} className="text-xs text-[var(--primary)]">
                      {copied === "datauri" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <textarea readOnly value={dataUri} rows={3} className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-xs font-mono" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">Raw Base64</label>
                    <button onClick={() => copy(base64, "raw")} className="text-xs text-[var(--primary)]">
                      {copied === "raw" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <textarea readOnly value={base64} rows={3} className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-xs font-mono" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">CSS Background</label>
                    <button onClick={() => copy(cssCode, "css")} className="text-xs text-[var(--primary)]">
                      {copied === "css" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <textarea readOnly value={cssCode} rows={2} className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-xs font-mono" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">HTML img Tag</label>
                    <button onClick={() => copy(htmlCode, "html")} className="text-xs text-[var(--primary)]">
                      {copied === "html" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <textarea readOnly value={htmlCode} rows={2} className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-xs font-mono" />
                </div>
              </div>
            )}
          </>
        )}

        {mode === "decode" && (
          <div className="tool-card mb-8">
            <label className="block text-sm font-medium mb-2">Paste Base64 String</label>
            <textarea
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              placeholder="Paste data URI or raw Base64 string..."
              rows={5}
              className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-xs font-mono mb-4"
            />
            <button onClick={decodeBase64} className="btn-primary w-full">
              Decode to Image
            </button>

            {decodePreview && (
              <div className="mt-6 text-center">
                <p className="text-sm font-medium mb-2">Decoded Image</p>
                <img src={decodePreview} alt="Decoded" className="max-w-full rounded-lg mx-auto" />
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is Base64 Encoding?</h2>
          <p>
            Base64 is an encoding scheme that converts binary data (like images) into ASCII text.
            This is useful for embedding images directly in HTML, CSS, or JSON without needing
            a separate image file.
          </p>

          <h2>When to Use Base64 Images</h2>
          <ul>
            <li>Embedding small icons or logos directly in CSS</li>
            <li>Including images in email templates</li>
            <li>Storing images in JSON or databases</li>
            <li>Reducing HTTP requests for small images</li>
          </ul>

          <h2>Privacy and Security</h2>
          <p>
            All conversion happens in your browser using the FileReader API. No images are
            uploaded to any server.
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
            name: "Image to Base64 Converter",
            description: META.description,
            url: `${SITE_URL}/tools/image-to-base64`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
