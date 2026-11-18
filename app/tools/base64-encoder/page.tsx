"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Base64 Encoder & Decoder - Encode and Decode Text Online",
  description:
    "Free online Base64 encoder and decoder. Convert text to Base64 or decode Base64 to readable text instantly. Supports UTF-8 encoding.",
  keywords:
    "base64 encode, base64 decode, base64 converter, text to base64, base64 to text, base64 online",
};

type Mode = "encode" | "decode";

export default function Base64EncoderPage() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function encode(text: string) {
    try {
      // Support UTF-8 via TextEncoder
      const bytes = new TextEncoder().encode(text);
      let binary = "";
      bytes.forEach((b) => (binary += String.fromCharCode(b)));
      return btoa(binary);
    } catch {
      throw new Error("Failed to encode text to Base64");
    }
  }

  function decode(base64: string) {
    try {
      const binary = atob(base64.trim());
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    } catch {
      throw new Error("Invalid Base64 string. Please check your input.");
    }
  }

  function handleConvert() {
    setError("");
    setCopied(false);
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      if (mode === "encode") {
        setOutput(encode(input));
      } else {
        setOutput(decode(input));
      }
    } catch (err) {
      setError((err as Error).message);
      setOutput("");
    }
  }

  function handleSwap() {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
    setOutput("");
    setError("");
  }

  function handleInputChange(val: string) {
    setInput(val);
    setError("");
    // Live conversion
    if (!val.trim()) {
      setOutput("");
      return;
    }
    try {
      if (mode === "encode") {
        setOutput(encode(val));
      } else {
        setOutput(decode(val));
      }
      setError("");
    } catch {
      setOutput("");
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function clearAll() {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/base64-encoder`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">
            &larr; All Tools
          </a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Base64 Encoder / Decoder</h1>
        <p className="text-[var(--muted)] mb-8">
          Encode text to Base64 or decode Base64 back to readable text. Results update live as you type.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Mode selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setMode("encode");
              clearAll();
            }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "encode"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-gray-200"
            }`}
          >
            Encode (Text &rarr; Base64)
          </button>
          <button
            onClick={() => {
              setMode("decode");
              clearAll();
            }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "decode"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-gray-200"
            }`}
          >
            Decode (Base64 &rarr; Text)
          </button>
        </div>

        <div className="tool-card mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-lg">
              {mode === "encode" ? "Plain Text Input" : "Base64 Input"}
            </h2>
            <button onClick={clearAll} className="text-sm text-[var(--primary)] hover:underline">
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            className="input-field font-mono text-sm min-h-[160px] resize-y"
            placeholder={
              mode === "encode"
                ? "Type or paste text to encode..."
                : "Paste Base64 string to decode..."
            }
            rows={6}
          />
          <div className="text-right text-xs text-[var(--muted)] mt-1">
            {input.length} characters
          </div>
        </div>

        {/* Swap button */}
        <div className="text-center mb-6">
          <button
            onClick={handleSwap}
            className="btn-secondary inline-flex items-center gap-2"
            title="Swap input and output"
          >
            <span className="text-xl">&#8693;</span> Swap
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="tool-card mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-lg">
              {mode === "encode" ? "Base64 Output" : "Decoded Text Output"}
            </h2>
            {output && (
              <button onClick={copyOutput} className="btn-secondary text-sm">
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            className="input-field font-mono text-sm min-h-[160px] resize-y bg-[var(--muted-bg)]"
            placeholder="Output will appear here..."
            rows={6}
          />
          <div className="text-right text-xs text-[var(--muted)] mt-1">
            {output.length} characters
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is Base64 Encoding?</h2>
          <p>
            Base64 is a binary-to-text encoding scheme that represents binary data using a set of 64 ASCII characters
            (A-Z, a-z, 0-9, +, /). It is commonly used to encode data that needs to be transmitted over text-based
            protocols like email (MIME) or embedded in HTML/CSS.
          </p>

          <h2>How Base64 Works</h2>
          <p>
            Base64 encoding takes groups of 3 bytes (24 bits) and splits them into 4 groups of 6 bits each. Each 6-bit
            group is mapped to one of 64 characters. If the input length is not divisible by 3, padding characters (=) are
            added to the output.
          </p>

          <h2>Common Use Cases</h2>
          <ul>
            <li><strong>Data URIs:</strong> Embedding images directly in HTML or CSS using base64-encoded data</li>
            <li><strong>API Authentication:</strong> HTTP Basic Authentication encodes credentials in Base64</li>
            <li><strong>Email Attachments:</strong> MIME encoding uses Base64 to send binary files via email</li>
            <li><strong>JSON Web Tokens (JWT):</strong> JWT payloads are Base64url-encoded</li>
            <li><strong>Binary data in XML/JSON:</strong> Safely transmitting binary data in text formats</li>
          </ul>

          <h2>Important Notes</h2>
          <p>
            Base64 is <strong>not encryption</strong>. It is an encoding scheme that can be easily reversed. Never use
            Base64 to protect sensitive data. The encoded output is approximately 33% larger than the original input.
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
            name: "Base64 Encoder / Decoder",
            description: META.description,
            url: `${SITE_URL}/tools/base64-encoder`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
