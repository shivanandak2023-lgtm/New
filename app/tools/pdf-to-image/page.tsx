"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Image Format Converter - Convert JPG, PNG, WebP Online",
  description:
    "Free online image format converter. Convert images between JPG, PNG, and WebP formats instantly in your browser. No upload to server required.",
  keywords:
    "image converter, jpg to png, png to webp, webp to jpg, image format converter, convert image online, pdf to image",
};

type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

const FORMATS: { label: string; mime: OutputFormat; ext: string }[] = [
  { label: "JPG", mime: "image/jpeg", ext: "jpg" },
  { label: "PNG", mime: "image/png", ext: "png" },
  { label: "WebP", mime: "image/webp", ext: "webp" },
];

export default function PdfToImagePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/png");
  const [quality, setQuality] = useState(90);
  const [convertedUrl, setConvertedUrl] = useState("");
  const [convertedSize, setConvertedSize] = useState(0);
  const [converting, setConverting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setImageFile(file);
    setConvertedUrl("");
    setConvertedSize(0);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function convert() {
    if (!preview) return;
    setConverting(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          setConvertedUrl(url);
          setConvertedSize(blob.size);
          setConverting(false);
        },
        outputFormat,
        quality / 100
      );
    };
    img.src = preview;
  }

  function downloadConverted() {
    if (!convertedUrl || !imageFile) return;
    const format = FORMATS.find((f) => f.mime === outputFormat);
    const baseName = imageFile.name.replace(/\.[^.]+$/, "");
    const a = document.createElement("a");
    a.href = convertedUrl;
    a.download = `${baseName}.${format?.ext || "png"}`;
    a.click();
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/pdf-to-image`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/pdf-to-image`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">
            &larr; All Tools
          </a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Image Format Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert images between JPG, PNG, and WebP formats right in your browser. No files are uploaded to any server.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Upload area */}
        <div className="tool-card mb-8">
          <h2 className="font-bold text-lg mb-4">Upload Image</h2>
          <label className="block border-2 border-dashed border-[var(--card-border)] rounded-xl p-8 text-center cursor-pointer hover:border-[var(--primary)] transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {imageFile ? (
              <div>
                <p className="text-lg font-medium">{imageFile.name}</p>
                <p className="text-sm text-[var(--muted)] mt-1">
                  {imageFile.type} &middot; {formatSize(imageFile.size)}
                </p>
                <p className="text-sm text-[var(--primary)] mt-2">Click to change file</p>
              </div>
            ) : (
              <div>
                <p className="text-4xl mb-2">🖼️</p>
                <p className="text-lg font-medium">Click or drop an image here</p>
                <p className="text-sm text-[var(--muted)] mt-1">Supports JPG, PNG, WebP, GIF, BMP</p>
              </div>
            )}
          </label>
        </div>

        {/* Conversion options */}
        {preview && (
          <div className="tool-card mb-8">
            <h2 className="font-bold text-lg mb-4">Conversion Settings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Output Format</label>
                <div className="flex gap-2">
                  {FORMATS.map((f) => (
                    <button
                      key={f.mime}
                      onClick={() => {
                        setOutputFormat(f.mime);
                        setConvertedUrl("");
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        outputFormat === f.mime
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-gray-200"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {outputFormat !== "image/png" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => {
                      setQuality(Number(e.target.value));
                      setConvertedUrl("");
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[var(--muted)]">
                    <span>Low (small file)</span>
                    <span>High (large file)</span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={convert}
              disabled={converting}
              className="btn-primary mt-6"
            >
              {converting ? "Converting..." : "Convert Image"}
            </button>
          </div>
        )}

        {/* Preview & Result */}
        {preview && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="tool-card">
              <h3 className="font-bold mb-3">Original</h3>
              <img
                src={preview}
                alt="Original"
                className="w-full rounded-lg"
                style={{ maxHeight: 300, objectFit: "contain" }}
              />
              {imageFile && (
                <p className="text-sm text-[var(--muted)] mt-2">
                  {imageFile.type} &middot; {formatSize(imageFile.size)}
                </p>
              )}
            </div>

            {convertedUrl && (
              <div className="tool-card">
                <h3 className="font-bold mb-3">Converted</h3>
                <img
                  src={convertedUrl}
                  alt="Converted"
                  className="w-full rounded-lg"
                  style={{ maxHeight: 300, objectFit: "contain" }}
                />
                <p className="text-sm text-[var(--muted)] mt-2">
                  {FORMATS.find((f) => f.mime === outputFormat)?.label} &middot;{" "}
                  {formatSize(convertedSize)}
                </p>
                <button onClick={downloadConverted} className="btn-primary mt-3 w-full">
                  Download Converted Image
                </button>
              </div>
            )}
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Image Format Conversion Guide</h2>
          <p>
            Different image formats serve different purposes. Understanding when to use each format can help you
            optimize your images for the web, print, or storage.
          </p>

          <h2>Format Comparison</h2>
          <ul>
            <li><strong>JPG/JPEG:</strong> Best for photographs and complex images. Lossy compression offers small file sizes. Does not support transparency.</li>
            <li><strong>PNG:</strong> Best for graphics, logos, and images needing transparency. Lossless compression preserves quality but results in larger files.</li>
            <li><strong>WebP:</strong> Modern format by Google, offering superior compression for both lossy and lossless images. Supports transparency. Ideal for web use.</li>
          </ul>

          <h2>When to Use Each Format</h2>
          <ul>
            <li>Use <strong>JPG</strong> for photos on websites and social media</li>
            <li>Use <strong>PNG</strong> for logos, icons, screenshots, and images with text</li>
            <li>Use <strong>WebP</strong> for modern websites to reduce page load times</li>
          </ul>

          <h2>Privacy &amp; Security</h2>
          <p>
            All image processing happens directly in your browser using the HTML5 Canvas API. Your images are never
            uploaded to any server, ensuring complete privacy and instant conversion speeds.
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
            name: "Image Format Converter",
            description: META.description,
            url: `${SITE_URL}/tools/pdf-to-image`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
