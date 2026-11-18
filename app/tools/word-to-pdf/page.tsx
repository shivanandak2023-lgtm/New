"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Text to PDF Converter - Convert Text to PDF Online Free",
  description:
    "Free Text to PDF Converter. Type or paste text, customize font size, margins, and title, then generate a clean PDF using your browser's print function.",
  keywords: "text to pdf, convert text to pdf, word to pdf, text to pdf converter, pdf generator, create pdf online",
};

export default function WordToPdfPage() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(14);
  const [margin, setMargin] = useState<string>("normal");
  const [fontFamily, setFontFamily] = useState<string>("serif");
  const printRef = useRef<HTMLDivElement>(null);

  const MARGINS: Record<string, string> = {
    narrow: "0.5in",
    normal: "1in",
    wide: "1.5in",
  };

  const FONTS: Record<string, string> = {
    serif: "Georgia, 'Times New Roman', serif",
    "sans-serif": "Arial, Helvetica, sans-serif",
    monospace: "'Courier New', Courier, monospace",
  };

  function generatePDF() {
    if (!content.trim()) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const marginValue = MARGINS[margin];
    const fontValue = FONTS[fontFamily];

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      
        <title>${title || "Document"}</title>
        <style>
          @page {
            margin: ${marginValue};
            size: A4;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: ${fontValue};
            font-size: ${fontSize}px;
            line-height: 1.6;
            color: #1a1a1a;
          }
          .title {
            font-size: ${fontSize * 1.8}px;
            font-weight: bold;
            margin-bottom: 0.5em;
            color: #000;
          }
          .content {
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .separator {
            border: none;
            border-top: 1px solid #ccc;
            margin: 1em 0;
          }
        </style>
      
      <body>
        ${title ? `<div class="title">${title.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div><hr class="separator">` : ""}
        <div class="content">${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          };
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/word-to-pdf`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/word-to-pdf`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Text to PDF Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Type or paste your text, customize formatting, and generate a clean PDF.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Document Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your document..."
              className="w-full p-3 border rounded-lg bg-[var(--muted-bg)]"
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full p-4 border rounded-lg bg-[var(--muted-bg)] text-sm resize-y font-mono"
              placeholder="Type or paste your text here..."
            />
            <div className="flex gap-4 text-xs text-[var(--muted)] mt-1">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Font Size: <span className="text-[var(--primary)]">{fontSize}px</span>
              </label>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
              <div className="flex justify-between text-xs text-[var(--muted)]">
                <span>10px</span>
                <span>24px</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[var(--muted-bg)]"
              >
                <option value="serif">Serif (Georgia)</option>
                <option value="sans-serif">Sans-serif (Arial)</option>
                <option value="monospace">Monospace (Courier)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Margins</label>
              <select
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[var(--muted-bg)]"
              >
                <option value="narrow">Narrow (0.5in)</option>
                <option value="normal">Normal (1in)</option>
                <option value="wide">Wide (1.5in)</option>
              </select>
            </div>
          </div>

          <button
            onClick={generatePDF}
            disabled={!content.trim()}
            className="btn-primary w-full disabled:opacity-50"
          >
            Generate PDF
          </button>
        </div>

        {/* Preview */}
        {content.trim() && (
          <div className="tool-card mb-8">
            <h2 className="text-lg font-bold mb-4">Preview</h2>
            <div
              ref={printRef}
              className="border rounded-lg p-8 bg-white max-h-96 overflow-y-auto"
              style={{
                fontFamily: FONTS[fontFamily],
                fontSize: `${fontSize}px`,
                lineHeight: "1.6",
              }}
            >
              {title && (
                <>
                  <h2 className="font-bold mb-2" style={{ fontSize: `${fontSize * 1.8}px` }}>
                    {title}
                  </h2>
                  <hr className="mb-4 border-gray-300" />
                </>
              )}
              <div className="whitespace-pre-wrap break-words">{content}</div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Text to PDF Converter</h2>
          <p>
            This tool lets you convert plain text into a professionally formatted PDF document.
            Simply type or paste your text, adjust the formatting options, and click Generate PDF.
            The PDF is created entirely in your browser &mdash; no data is sent to any server.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Custom Font Size:</strong> Adjust from 10px to 24px for readability</li>
            <li><strong>Font Family:</strong> Choose between Serif, Sans-serif, or Monospace</li>
            <li><strong>Margins:</strong> Select narrow, normal, or wide page margins</li>
            <li><strong>Document Title:</strong> Add an optional title header to your PDF</li>
            <li><strong>Live Preview:</strong> See how your document will look before generating</li>
          </ul>

          <h2>How It Works</h2>
          <p>
            When you click Generate PDF, the tool opens a new browser window with your formatted text
            and triggers the browser&apos;s built-in print dialog. Select &quot;Save as PDF&quot; as the destination
            to download your document. This approach ensures your data stays private and never leaves your device.
          </p>

          <h3>Tips for Best Results</h3>
          <ul>
            <li>Use line breaks to separate paragraphs in your text</li>
            <li>Choose Serif fonts for formal documents and Sans-serif for modern looks</li>
            <li>In the print dialog, select &quot;Save as PDF&quot; as the printer destination</li>
            <li>Disable headers and footers in print settings for a cleaner output</li>
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
            name: "Text to PDF Converter",
            description: META.description,
            url: `${SITE_URL}/tools/word-to-pdf`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
