"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "QR Code Generator - Create Free QR Codes Online",
  description:
    "Free QR Code Generator to create QR codes for URLs, text, Wi-Fi, and more. Download as PNG. No signup required.",
  keywords: "qr code generator, create qr code, qr code maker, free qr code, qr code online",
};

export default function QRCodeGeneratorPage() {
  const [text, setText] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [size, setSize] = useState<number>(300);

  async function generate() {
    if (!text.trim()) {
      setError("Please enter text or URL");
      setQrDataUrl("");
      return;
    }
    setError("");
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: "M",
      });
      setQrDataUrl(url);
    } catch {
      setError("Failed to generate QR code. Please try again.");
    }
  }

  function download() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qrcode.png";
    a.click();
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/qr-code-generator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">QR Code Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Generate QR codes for URLs, text, Wi-Fi credentials, and more. Download as PNG instantly.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="tool-card">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Text or URL</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input-field min-h-[120px] resize-y"
                placeholder="Enter URL, text, or any content..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Size: {size}px</label>
              <input
                type="range"
                min="100"
                max="600"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </div>
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <button onClick={generate} className="btn-primary w-full">
              Generate QR Code
            </button>
          </div>

          <div className="tool-card flex flex-col items-center justify-center min-h-[300px]">
            {qrDataUrl ? (
              <>
                <img src={qrDataUrl} alt="Generated QR Code" className="max-w-full border rounded-lg" />
                <button onClick={download} className="btn-primary mt-4">
                  Download PNG
                </button>
              </>
            ) : (
              <p className="text-[var(--muted)] text-center">
                Your QR code will appear here
              </p>
            )}
          </div>
        </div>

        <div className="ad-placeholder my-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is a QR Code?</h2>
          <p>
            A QR Code (Quick Response Code) is a two-dimensional barcode that can store information such as URLs, text,
            contact information, and more. QR codes can be scanned using smartphone cameras or QR code reader apps.
          </p>

          <h2>How to Use This QR Code Generator</h2>
          <ul>
            <li>Enter the URL or text you want to encode</li>
            <li>Adjust the size using the slider</li>
            <li>Click &ldquo;Generate QR Code&rdquo;</li>
            <li>Download the QR code as a PNG image</li>
          </ul>

          <h2>Common QR Code Uses</h2>
          <ul>
            <li>Share website URLs or landing pages</li>
            <li>Digital business cards and contact sharing</li>
            <li>Payment links and UPI codes</li>
            <li>Wi-Fi network sharing</li>
            <li>Event tickets and boarding passes</li>
            <li>Product packaging and inventory management</li>
          </ul>
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "QR Code Generator",
            description: META.description,
            url: `${SITE_URL}/tools/qr-code-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
