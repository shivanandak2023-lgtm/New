"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Image to Text (OCR) - Extract Text from Images Free Online",
  description:
    "Free online OCR tool. Upload an image and extract text instantly using Tesseract.js. Supports English, Hindi, Spanish, and more languages. No server upload.",
  keywords:
    "image to text, ocr online, extract text from image, photo to text, picture to text converter, optical character recognition",
};

const LANGUAGES = [
  { code: "eng", name: "English" },
  { code: "hin", name: "Hindi" },
  { code: "spa", name: "Spanish" },
  { code: "fra", name: "French" },
  { code: "deu", name: "German" },
  { code: "por", name: "Portuguese" },
  { code: "ita", name: "Italian" },
  { code: "rus", name: "Russian" },
  { code: "jpn", name: "Japanese" },
  { code: "kor", name: "Korean" },
  { code: "chi_sim", name: "Chinese (Simplified)" },
  { code: "ara", name: "Arabic" },
];

export default function ImageToTextPage() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const [extractedText, setExtractedText] = useState<string>("");
  const [language, setLanguage] = useState("eng");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setImageUrl(URL.createObjectURL(file));
    setImageName(file.name);
    setExtractedText("");
    setError("");
    setProgress(0);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  async function extractText() {
    if (!imageUrl) return;
    setProcessing(true);
    setExtractedText("");
    setError("");
    setProgress(0);
    setProgressMsg("Loading OCR engine...");

    try {
      const Tesseract = await import("tesseract.js");
      const result = await Tesseract.recognize(imageUrl, language, {
        logger: (m: { status: string; progress: number }) => {
          setProgressMsg(m.status);
          setProgress(Math.round(m.progress * 100));
        },
      });
      const text = result.data.text.trim();
      if (text) {
        setExtractedText(text);
      } else {
        setError("No text was detected in this image. Try a clearer image with more visible text.");
      }
    } catch {
      setError("Failed to process the image. Make sure tesseract.js is installed (npm install tesseract.js).");
    } finally {
      setProcessing(false);
      setProgress(0);
      setProgressMsg("");
    }
  }

  function copyText() {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const wordCount = extractedText
    ? extractedText.split(/\s+/).filter((w) => w.length > 0).length
    : 0;
  const charCount = extractedText.length;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/image-to-text`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/image-to-text`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Image to Text (OCR)</h1>
        <p className="text-[var(--muted)] mb-8">
          Extract text from images using optical character recognition. Supports multiple languages. Processing happens in your browser.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
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
              {imageName ? imageName : "Drag & drop an image or click to browse"}
            </p>
          </div>

          {imageUrl && (
            <div className="mt-6">
              <img src={imageUrl} alt="Uploaded preview" className="max-h-64 mx-auto rounded-lg mb-4" />

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">OCR Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {processing && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                    <span>{progressMsg}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[var(--primary)] h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button onClick={extractText} disabled={processing} className="btn-primary w-full">
                {processing ? "Extracting Text..." : "Extract Text"}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
          )}
        </div>

        {extractedText && (
          <div className="result-card tool-card mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Extracted Text</h2>
              <span className="text-xs text-[var(--muted)]">
                {wordCount} words &middot; {charCount} characters
              </span>
            </div>
            <textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              rows={10}
              className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono resize-y mb-4"
            />
            <button onClick={copyText} className="btn-primary w-full">
              {copied ? "Copied!" : "Copy Text"}
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Free Online OCR - Image to Text Converter</h2>
          <p>
            Optical Character Recognition (OCR) technology lets you convert images containing printed or handwritten text into editable, searchable digital text. This image to text converter uses the powerful Tesseract.js OCR engine, which runs entirely in your web browser. That means your images are never uploaded to any server, keeping your documents completely private and secure. Whether you are digitizing old documents, extracting text from screenshots, or converting photos of printed pages, this tool delivers fast and accurate results.
          </p>

          <h2>How Does OCR Work?</h2>
          <p>
            OCR technology analyzes the shapes and patterns of characters in an image and matches them against known letter forms. The Tesseract OCR engine used here is one of the most accurate open-source OCR engines in the world, originally developed by HP Labs and now maintained by Google. It supports over 100 languages and can handle a wide variety of fonts, sizes, and printing styles. The engine first preprocesses the image to improve contrast and alignment, then segments text into lines and words, and finally recognizes individual characters using neural network models.
          </p>

          <h2>Supported Languages</h2>
          <p>
            This tool supports OCR in multiple languages including English, Hindi, Spanish, French, German, Portuguese, Italian, Russian, Japanese, Korean, Chinese (Simplified), and Arabic. Select the appropriate language before extracting text for the best accuracy. The language models are downloaded on demand, so the first extraction in a new language may take slightly longer while the model loads.
          </p>

          <h2>Tips for Best OCR Results</h2>
          <ul>
            <li>Use clear, high-resolution images with good contrast between text and background</li>
            <li>Ensure the text is horizontal and not rotated or skewed</li>
            <li>Crop the image to include only the text region for faster processing</li>
            <li>Avoid images with heavy shadows, glare, or watermarks over the text</li>
            <li>Printed text gives better results than handwriting</li>
            <li>Select the correct language for the text in the image</li>
          </ul>

          <h3>Common Use Cases</h3>
          <p>
            People use image to text conversion for many everyday tasks. Students photograph lecture notes and textbook pages to create searchable digital notes. Professionals extract text from scanned contracts, receipts, and business cards. Researchers digitize printed academic papers and historical documents. Developers extract text from UI screenshots for testing and documentation. Travelers photograph signs and menus in foreign languages and then translate the extracted text. This versatile tool saves hours of manual typing across all these scenarios.
          </p>

          <h3>Privacy First</h3>
          <p>
            Unlike many OCR services that require you to upload your images to a cloud server, this tool processes everything locally in your browser using WebAssembly. Your sensitive documents, personal photos, and confidential files never leave your device. This makes it ideal for processing private documents like medical records, financial statements, legal contracts, and personal correspondence.
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
            name: "Image to Text (OCR)",
            description: META.description,
            url: `${SITE_URL}/tools/image-to-text`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
