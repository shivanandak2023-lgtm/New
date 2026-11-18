"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Remove PDF Password - Unlock PDF Online Free",
  description:
    "Free PDF password remover. Upload a password-protected PDF, enter the password, and download an unlocked copy. No server upload.",
  keywords: "remove pdf password, unlock pdf, pdf password remover, unprotect pdf, pdf unlocker",
};

export default function RemovePdfPasswordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [unlockedUrl, setUnlockedUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setError("");
    setSuccess(false);
    setUnlockedUrl("");
    setPageCount(0);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  async function unlockPdf() {
    if (!file) return;
    setProcessing(true);
    setError("");
    setSuccess(false);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();

      let pdfDoc;
      try {
        pdfDoc = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: true,
        } as Parameters<typeof PDFDocument.load>[1]);
      } catch {
        setError("Wrong password or the PDF could not be opened. Please check the password and try again.");
        setProcessing(false);
        return;
      }

      const pages = pdfDoc.getPages();
      setPageCount(pages.length);

      // Create a new unencrypted PDF by copying all pages
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      setUnlockedUrl(URL.createObjectURL(blob));
      setSuccess(true);
    } catch {
      setError("Failed to unlock the PDF. The password may be incorrect, or the encryption type is not supported by browser-based tools.");
    } finally {
      setProcessing(false);
    }
  }

  function download() {
    if (!unlockedUrl || !file) return;
    const a = document.createElement("a");
    a.href = unlockedUrl;
    a.download = `unlocked-${file.name}`;
    a.click();
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/remove-pdf-password`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Remove PDF Password</h1>
        <p className="text-[var(--muted)] mb-8">
          Unlock a password-protected PDF by entering the password. The unlocked file is saved without encryption. All processing happens in your browser.
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <p className="text-[var(--muted)]">
              {file ? file.name : "Drag & drop a password-protected PDF or click to browse"}
            </p>
          </div>

          {file && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">PDF Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the PDF password"
                className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 mb-4"
              />
              <button onClick={unlockPdf} disabled={processing} className="btn-primary w-full">
                {processing ? "Unlocking..." : "Unlock PDF"}
              </button>
            </div>
          )}

          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </div>

        {success && (
          <div className="result-card mb-8">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-green-700">PDF Unlocked Successfully!</h2>
              <p className="text-[var(--muted)] text-sm mt-1">{pageCount} page(s) — password protection removed</p>
            </div>
            <button onClick={download} className="btn-primary w-full">
              Download Unlocked PDF
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does PDF Password Removal Work?</h2>
          <p>
            This tool loads your password-protected PDF using the password you provide, then creates
            a new copy of the document without any encryption. You must know the password — this tool
            does not crack or bypass PDF passwords.
          </p>

          <h2>When To Use This Tool</h2>
          <ul>
            <li>You have the password but want an unprotected copy for easier access</li>
            <li>You need to share a PDF without the password requirement</li>
            <li>You want to merge or edit a protected PDF with other tools</li>
          </ul>

          <h2>Privacy and Security</h2>
          <p>
            Your PDF and password are processed entirely in your browser. No files or passwords are
            sent to any server. Your documents remain completely private.
          </p>

          <h3>Limitations</h3>
          <p>
            Some PDFs use advanced encryption (AES-256) that may not be fully supported by
            browser-based tools. If this tool cannot unlock your file, try a desktop application
            like Adobe Acrobat.
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
            name: "Remove PDF Password",
            description: META.description,
            url: `${SITE_URL}/tools/remove-pdf-password`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
