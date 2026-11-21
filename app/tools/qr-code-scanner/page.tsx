"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "QR Code Scanner - Scan & Read QR Codes Online Free",
  description:
    "Free online QR code scanner and reader. Upload an image or use your camera to scan QR codes instantly. No app download required.",
  keywords:
    "qr code scanner, qr code reader online, scan qr code, qr code decoder, read qr code from image",
};

export default function QrCodeScannerPage() {
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [scanning, setScanning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef<number>(0);

  const stopCamera = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  async function decodeFromImage(file: File) {
    setResult("");
    setError("");
    setScanning(true);

    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bitmap, 0, 0);

      if ("BarcodeDetector" in window) {
        const detector = new (window as unknown as { BarcodeDetector: new (opts: { formats: string[] }) => { detect: (source: HTMLCanvasElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector({ formats: ["qr_code"] });
        const barcodes = await detector.detect(canvas);
        if (barcodes.length > 0) {
          setResult(barcodes[0].rawValue);
        } else {
          setError("No QR code found in this image. Make sure the QR code is clear and well-lit.");
        }
      } else {
        setError("Your browser does not support the BarcodeDetector API. Try using Chrome, Edge, or Opera, or use the camera mode on a mobile device.");
      }
    } catch {
      setError("Failed to process the image. Please try a different file.");
    } finally {
      setScanning(false);
    }
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    decodeFromImage(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  async function startCamera() {
    setResult("");
    setError("");
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      if (!("BarcodeDetector" in window)) {
        setError("BarcodeDetector API not available in this browser. Try Chrome or Edge.");
        return;
      }

      const detector = new (window as unknown as { BarcodeDetector: new (opts: { formats: string[] }) => { detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector({ formats: ["qr_code"] });

      const scanFrame = async () => {
        if (!videoRef.current || !streamRef.current) return;
        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes.length > 0) {
            setResult(barcodes[0].rawValue);
            stopCamera();
            return;
          }
        } catch {
          // continue scanning
        }
        animRef.current = requestAnimationFrame(scanFrame);
      };
      animRef.current = requestAnimationFrame(scanFrame);
    } catch {
      setError("Could not access camera. Please allow camera permissions and try again.");
    }
  }

  function copyResult() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isUrl = result.startsWith("http://") || result.startsWith("https://");

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/qr-code-scanner`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/qr-code-scanner`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">QR Code Scanner</h1>
        <p className="text-[var(--muted)] mb-8">
          Scan QR codes from an image or your camera. All decoding happens in your browser — nothing is uploaded.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setMode("upload"); stopCamera(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "upload"
                  ? "bg-[var(--primary)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Upload Image
            </button>
            <button
              onClick={() => { setMode("camera"); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "camera"
                  ? "bg-[var(--primary)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Use Camera
            </button>
          </div>

          {mode === "upload" && (
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                dragActive
                  ? "border-[var(--primary)] bg-blue-50"
                  : "border-[var(--card-border)] hover:border-[var(--primary)]"
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
                {scanning ? "Scanning..." : "Drag & drop an image with a QR code, or click to browse"}
              </p>
            </div>
          )}

          {mode === "camera" && (
            <div className="text-center">
              <video
                ref={videoRef}
                className="w-full max-h-80 rounded-xl bg-black mb-4"
                playsInline
                muted
                style={{ display: cameraActive ? "block" : "none" }}
              />
              {!cameraActive && (
                <button onClick={startCamera} className="btn-primary">
                  Start Camera
                </button>
              )}
              {cameraActive && (
                <button onClick={stopCamera} className="btn-primary bg-red-600 hover:bg-red-700">
                  Stop Camera
                </button>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
          )}
        </div>

        {result && (
          <div className="result-card tool-card mb-8">
            <h2 className="text-lg font-bold mb-3">Decoded QR Code</h2>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-4">
              <p className="break-all text-sm">{result}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={copyResult} className="btn-primary">
                {copied ? "Copied!" : "Copy Text"}
              </button>
              {isUrl && (
                <a
                  href={result}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-block bg-green-600 hover:bg-green-700 text-center"
                >
                  Open Link
                </a>
              )}
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Free Online QR Code Scanner and Reader</h2>
          <p>
            QR codes are everywhere — on product packaging, restaurant menus, event tickets, business cards, and advertisements. This free QR code scanner lets you decode any QR code directly in your web browser without downloading an app. Whether you have a screenshot with a QR code or want to scan one live with your phone or laptop camera, this tool handles both scenarios instantly. All decoding happens locally in your browser using the native BarcodeDetector API, so your images and camera feed never leave your device.
          </p>

          <h2>How to Scan a QR Code Online</h2>
          <p>
            There are two ways to use this scanner. In Upload mode, click the upload area or drag and drop an image that contains a QR code. The tool will analyze the image and extract the encoded data within seconds. In Camera mode, click the Start Camera button to activate your device camera. Point the camera at a QR code and the scanner will automatically detect and decode it in real time. The camera mode works best on mobile devices with rear-facing cameras, but it also works with laptop webcams.
          </p>

          <h2>What Data Can QR Codes Contain?</h2>
          <ul>
            <li>Website URLs — the most common type, linking to web pages</li>
            <li>Plain text messages and notes</li>
            <li>WiFi network credentials for instant connection</li>
            <li>Contact information in vCard format</li>
            <li>Email addresses, phone numbers, and SMS messages</li>
            <li>Geographic coordinates and map locations</li>
            <li>Calendar events and appointments</li>
            <li>Payment information and cryptocurrency addresses</li>
          </ul>

          <h2>Browser Compatibility</h2>
          <p>
            This QR code reader uses the BarcodeDetector API, which is natively supported in Chrome, Edge, Opera, and Samsung Internet on both desktop and mobile. Safari on macOS Ventura and later also supports it. For the best experience scanning QR codes from your camera, use a mobile device with Chrome or Edge. If your browser does not support the BarcodeDetector API, the tool will notify you and suggest a compatible browser.
          </p>

          <h3>Privacy and Security</h3>
          <p>
            Your privacy is our priority. When you upload an image or use your camera, all processing happens entirely within your browser. No images, video frames, or decoded results are ever sent to any server. The camera stream is accessed through secure browser APIs and is immediately released when you stop scanning. Your QR code data remains completely private.
          </p>

          <h3>Tips for Successful Scanning</h3>
          <p>
            For the best results when uploading an image, ensure the QR code is clearly visible, well-lit, and not too small or blurry. When using the camera, hold your device steady about 6 to 12 inches from the QR code and ensure there is adequate lighting. Avoid scanning QR codes on reflective surfaces that may cause glare. If a scan fails, try taking a screenshot of the QR code and using the upload mode instead.
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
            name: "QR Code Scanner",
            description: META.description,
            url: `${SITE_URL}/tools/qr-code-scanner`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
