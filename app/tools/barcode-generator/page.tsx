"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Barcode Generator - Create Barcodes Online Free",
  description:
    "Generate barcodes online for free. Support for Code 128, Code 39, EAN-13, EAN-8, and UPC-A formats. Download barcodes as PNG images.",
  keywords: "barcode generator, barcode maker, create barcode online, code 128, code 39, ean-13, upc-a, free barcode",
};

type BarcodeType = "code128" | "code39" | "ean13" | "ean8" | "upca";

// Code 128 encoding tables
const CODE128_START_B = 104;
const CODE128_STOP = 106;

const CODE128_PATTERNS: number[][] = [
  [2,1,2,2,2,2],[2,2,2,1,2,2],[2,2,2,2,2,1],[1,2,1,2,2,3],[1,2,1,3,2,2],
  [1,3,1,2,2,2],[1,2,2,2,1,3],[1,2,2,3,1,2],[1,3,2,2,1,2],[2,2,1,2,1,3],
  [2,2,1,3,1,2],[2,3,1,2,1,2],[1,1,2,2,3,2],[1,2,2,1,3,2],[1,2,2,2,3,1],
  [1,1,3,2,2,2],[1,2,3,1,2,2],[1,2,3,2,2,1],[2,2,3,2,1,1],[2,2,1,1,3,2],
  [2,2,1,2,3,1],[2,1,3,2,1,2],[2,2,3,1,1,2],[3,1,2,1,3,1],[3,1,1,2,2,2],
  [3,2,1,1,2,2],[3,2,1,2,2,1],[3,1,2,2,1,2],[3,2,2,1,1,2],[3,2,2,2,1,1],
  [2,1,2,1,2,3],[2,1,2,3,2,1],[2,3,2,1,2,1],[1,1,1,3,2,3],[1,3,1,1,2,3],
  [1,3,1,3,2,1],[1,1,2,3,1,3],[1,3,2,1,1,3],[1,3,2,3,1,1],[2,1,1,3,1,3],
  [2,3,1,1,1,3],[2,3,1,3,1,1],[1,1,2,1,3,3],[1,1,2,3,3,1],[1,3,2,1,3,1],
  [1,1,3,1,2,3],[1,1,3,3,2,1],[1,3,3,1,2,1],[3,1,3,1,2,1],[2,1,1,3,3,1],
  [2,3,1,1,3,1],[2,1,3,1,1,3],[2,1,3,3,1,1],[2,1,3,1,3,1],[3,1,1,1,2,3],
  [3,1,1,3,2,1],[3,3,1,1,2,1],[3,1,2,1,1,3],[3,1,2,3,1,1],[3,3,2,1,1,1],
  [3,1,4,1,1,1],[2,2,1,4,1,1],[4,3,1,1,1,1],[1,1,1,2,2,4],[1,1,1,4,2,2],
  [1,2,1,1,2,4],[1,2,1,4,2,1],[1,4,1,1,2,2],[1,4,1,2,2,1],[1,1,2,2,1,4],
  [1,1,2,4,1,2],[1,2,2,1,1,4],[1,2,2,4,1,1],[1,4,2,1,1,2],[1,4,2,2,1,1],
  [2,4,1,2,1,1],[2,2,1,1,1,4],[4,1,3,1,1,1],[2,4,1,1,1,2],[1,3,4,1,1,1],
  [1,1,1,2,4,2],[1,2,1,1,4,2],[1,2,1,2,4,1],[1,1,4,2,1,2],[1,2,4,1,1,2],
  [1,2,4,2,1,1],[4,1,1,2,1,2],[4,2,1,1,1,2],[4,2,1,2,1,1],[2,1,2,1,4,1],
  [2,1,4,1,2,1],[4,1,2,1,2,1],[1,1,1,1,4,3],[1,1,1,3,4,1],[1,3,1,1,4,1],
  [1,1,4,1,1,3],[1,1,4,3,1,1],[4,1,1,1,1,3],[4,1,1,3,1,1],[1,1,3,1,4,1],
  [1,1,4,1,3,1],[3,1,1,1,4,1],[4,1,1,1,3,1],[2,1,1,4,1,2],[2,1,1,2,1,4],
  [2,1,1,2,3,2],[2,3,3,1,1,1,2],
];

function encodeCode128(text: string): number[][] | null {
  if (!text) return null;
  const values: number[] = [CODE128_START_B];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code < 32 || code > 126) return null;
    values.push(code - 32);
  }
  let checksum = values[0];
  for (let i = 1; i < values.length; i++) {
    checksum += values[i] * i;
  }
  checksum = checksum % 103;
  values.push(checksum);
  values.push(CODE128_STOP);

  return values.map((v) => CODE128_PATTERNS[v]);
}

// Code 39 encoding
const CODE39_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%*";
const CODE39_PATTERNS: string[] = [
  "nnnwwnwnn","wnnnnnnwn","nnwnnnnwn","wnwnnnnnn","nnnwnnnwn",
  "wnnwnnnnn","nnwnwnnnnn".slice(0,9)==="nnwnwnnnn"?"nnwnwnnnn":"nnwnwnnnn","nnnnnwnwn",
  "wnnnnwnnn","nnwnnwnnn","wnnnnnnwn", // duplicated intentionally for simple lookup
];

// Simplified Code 39 binary patterns (narrow=1, wide=3)
const CODE39_ENCODING: Record<string, string> = {
  "0":"101001101101","1":"110100101011","2":"101100101011","3":"110110010101",
  "4":"101001101011","5":"110100110101","6":"101100110101","7":"101001011011",
  "8":"110100101101","9":"101100101101","A":"110101001011","B":"101101001011",
  "C":"110110100101","D":"101011001011","E":"110101100101","F":"101101100101",
  "G":"101010011011","H":"110101001101","I":"101101001101","J":"101011001101",
  "K":"110101010011","L":"101101010011","M":"110110101001","N":"101011010011",
  "O":"110101101001","P":"101101101001","Q":"101010110011","R":"110101011001",
  "S":"101101011001","T":"101011011001","U":"110010101011","V":"100110101011",
  "W":"110011010101","X":"100101101011","Y":"110010110101","Z":"100110110101",
  "-":"100101011011",".":"110010101101"," ":"100110101101","$":"100100100101",
  "/":"100100101001","+":"100101001001","%":"101001001001","*":"100101101101",
};

function encodeCode39(text: string): string | null {
  const upper = text.toUpperCase();
  for (const ch of upper) {
    if (!(ch in CODE39_ENCODING)) return null;
  }
  let binary = CODE39_ENCODING["*"] + "0";
  for (const ch of upper) {
    binary += CODE39_ENCODING[ch] + "0";
  }
  binary += CODE39_ENCODING["*"];
  return binary;
}

// EAN/UPC encoding
const EAN_L: string[] = ["0001101","0011001","0010011","0111101","0100011","0110001","0101111","0111011","0110111","0001011"];
const EAN_G: string[] = ["0100111","0110011","0011011","0100001","0011101","0111001","0000101","0010001","0001001","0010111"];
const EAN_R: string[] = ["1110010","1100110","1101100","1000010","1011100","1001110","1010000","1000100","1001000","1110100"];
const EAN13_PARITY: string[] = ["LLLLLL","LLGLGG","LLGGLG","LLGGGL","LGLLGG","LGGLLG","LGGGLL","LGLGLG","LGLGGL","LGGLGL"];

function eanCheckDigit(digits: number[], length: number): number {
  let sum = 0;
  for (let i = 0; i < length - 1; i++) {
    sum += digits[i] * (i % 2 === 0 ? 1 : 3);
  }
  return (10 - (sum % 10)) % 10;
}

function encodeEAN13(text: string): string | null {
  const digits = text.replace(/\D/g, "").split("").map(Number);
  if (digits.length < 12 || digits.length > 13) return null;
  if (digits.length === 12) digits.push(eanCheckDigit(digits, 13));
  const parity = EAN13_PARITY[digits[0]];
  let binary = "101";
  for (let i = 0; i < 6; i++) {
    binary += parity[i] === "L" ? EAN_L[digits[i + 1]] : EAN_G[digits[i + 1]];
  }
  binary += "01010";
  for (let i = 7; i < 13; i++) {
    binary += EAN_R[digits[i]];
  }
  binary += "101";
  return binary;
}

function encodeEAN8(text: string): string | null {
  const digits = text.replace(/\D/g, "").split("").map(Number);
  if (digits.length < 7 || digits.length > 8) return null;
  if (digits.length === 7) {
    let sum = 0;
    for (let i = 0; i < 7; i++) sum += digits[i] * (i % 2 === 0 ? 3 : 1);
    digits.push((10 - (sum % 10)) % 10);
  }
  let binary = "101";
  for (let i = 0; i < 4; i++) binary += EAN_L[digits[i]];
  binary += "01010";
  for (let i = 4; i < 8; i++) binary += EAN_R[digits[i]];
  binary += "101";
  return binary;
}

function encodeUPCA(text: string): string | null {
  const digits = text.replace(/\D/g, "").split("").map(Number);
  if (digits.length < 11 || digits.length > 12) return null;
  if (digits.length === 11) {
    let sum = 0;
    for (let i = 0; i < 11; i++) sum += digits[i] * (i % 2 === 0 ? 3 : 1);
    digits.push((10 - (sum % 10)) % 10);
  }
  let binary = "101";
  for (let i = 0; i < 6; i++) binary += EAN_L[digits[i]];
  binary += "01010";
  for (let i = 6; i < 12; i++) binary += EAN_R[digits[i]];
  binary += "101";
  return binary;
}

function drawBinaryBarcode(
  canvas: HTMLCanvasElement,
  binary: string,
  text: string,
  barWidth: number,
  height: number
) {
  const width = binary.length * barWidth + 20;
  canvas.width = width;
  canvas.height = height + 30;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let x = 10;
  for (const bit of binary) {
    if (bit === "1") {
      ctx.fillStyle = "#000000";
      ctx.fillRect(x, 5, barWidth, height);
    }
    x += barWidth;
  }

  ctx.fillStyle = "#000000";
  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, height + 22);
}

function drawCode128Barcode(
  canvas: HTMLCanvasElement,
  patterns: number[][],
  text: string,
  moduleWidth: number,
  height: number
) {
  let totalModules = 0;
  for (const pattern of patterns) {
    for (const w of pattern) totalModules += w;
  }
  const width = totalModules * moduleWidth + 20;
  canvas.width = width;
  canvas.height = height + 30;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let x = 10;
  for (const pattern of patterns) {
    let isBar = true;
    for (const w of pattern) {
      if (isBar) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(x, 5, w * moduleWidth, height);
      }
      x += w * moduleWidth;
      isBar = !isBar;
    }
  }

  ctx.fillStyle = "#000000";
  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, height + 22);
}

export default function BarcodeGeneratorPage() {
  const [input, setInput] = useState("");
  const [barcodeType, setBarcodeType] = useState<BarcodeType>("code128");
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(() => {
    if (!input.trim()) return;
    setError("");
    setGenerated(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const height = 120;
    const moduleWidth = 2;

    if (barcodeType === "code128") {
      const patterns = encodeCode128(input);
      if (!patterns) {
        setError("Invalid input for Code 128. Use ASCII characters (32-126).");
        return;
      }
      drawCode128Barcode(canvas, patterns, input, moduleWidth, height);
      setGenerated(true);
    } else if (barcodeType === "code39") {
      const binary = encodeCode39(input);
      if (!binary) {
        setError("Invalid input for Code 39. Use A-Z, 0-9, and - . $ / + % space.");
        return;
      }
      drawBinaryBarcode(canvas, binary, `*${input.toUpperCase()}*`, moduleWidth, height);
      setGenerated(true);
    } else if (barcodeType === "ean13") {
      const binary = encodeEAN13(input);
      if (!binary) {
        setError("EAN-13 requires 12 or 13 digits.");
        return;
      }
      drawBinaryBarcode(canvas, binary, input.replace(/\D/g, "").slice(0, 13), moduleWidth, height);
      setGenerated(true);
    } else if (barcodeType === "ean8") {
      const binary = encodeEAN8(input);
      if (!binary) {
        setError("EAN-8 requires 7 or 8 digits.");
        return;
      }
      drawBinaryBarcode(canvas, binary, input.replace(/\D/g, "").slice(0, 8), moduleWidth, height);
      setGenerated(true);
    } else if (barcodeType === "upca") {
      const binary = encodeUPCA(input);
      if (!binary) {
        setError("UPC-A requires 11 or 12 digits.");
        return;
      }
      drawBinaryBarcode(canvas, binary, input.replace(/\D/g, "").slice(0, 12), moduleWidth, height);
      setGenerated(true);
    }
  }, [input, barcodeType]);

  useEffect(() => {
    setGenerated(false);
  }, [input, barcodeType]);

  function downloadPNG() {
    const canvas = canvasRef.current;
    if (!canvas || !generated) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `barcode-${barcodeType}.png`;
    a.click();
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/barcode-generator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="/tools/barcode-generator" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Barcode Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Generate barcodes in multiple formats. Enter text or numbers and download as PNG.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Barcode Type</label>
            <select
              value={barcodeType}
              onChange={(e) => setBarcodeType(e.target.value as BarcodeType)}
              className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
            >
              <option value="code128">Code 128 (text &amp; numbers)</option>
              <option value="code39">Code 39 (A-Z, 0-9, symbols)</option>
              <option value="ean13">EAN-13 (12-13 digits)</option>
              <option value="ean8">EAN-8 (7-8 digits)</option>
              <option value="upca">UPC-A (11-12 digits)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {barcodeType === "code128" || barcodeType === "code39" ? "Text to Encode" : "Digits to Encode"}
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                barcodeType === "code128"
                  ? "Hello World 123"
                  : barcodeType === "code39"
                  ? "HELLO-123"
                  : barcodeType === "ean13"
                  ? "5901234123457"
                  : barcodeType === "ean8"
                  ? "96385074"
                  : "012345678905"
              }
              className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono"
            />
          </div>

          <button onClick={generate} className="btn-primary w-full">
            Generate Barcode
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className={`result-card mb-8 ${!generated ? "hidden" : ""}`}>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium">Generated Barcode</label>
            <button onClick={downloadPNG} className="text-xs text-[var(--primary)]">
              Download PNG
            </button>
          </div>
          <div className="flex justify-center bg-white p-4 border border-[var(--card-border)] rounded-lg overflow-x-auto">
            <canvas ref={canvasRef} />
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is a Barcode?</h2>
          <p>
            A barcode is a visual representation of data using parallel lines of varying widths and
            spacings. Barcodes are machine-readable and are widely used in retail, logistics,
            healthcare, and manufacturing to identify products, track inventory, and automate data
            entry. When scanned by a barcode reader or smartphone camera, the pattern of bars and
            spaces is decoded back into the original data.
          </p>

          <h2>Barcode Types Explained</h2>
          <p>
            <strong>Code 128</strong> is the most versatile linear barcode symbology. It can encode
            all 128 ASCII characters, making it suitable for shipping labels, product identification,
            and general-purpose encoding. Code 128 uses three character sets (A, B, C) and produces
            compact barcodes with high data density. This generator uses Code Set B, which covers
            standard printable characters.
          </p>
          <p>
            <strong>Code 39</strong> (also called Code 3 of 9) encodes uppercase letters A-Z, digits
            0-9, and special characters (- . $ / + % space). Each character is represented by nine
            elements — five bars and four spaces — with three of the nine being wide. Code 39 is
            self-checking and widely used in government, defense, and automotive industries.
          </p>
          <p>
            <strong>EAN-13</strong> (European Article Number) is the standard barcode for retail
            products worldwide. It encodes 13 digits including a check digit. The first two or three
            digits represent the country code, followed by the manufacturer code, product code, and
            a check digit. EAN-13 is the international standard for point-of-sale scanning.
          </p>
          <p>
            <strong>EAN-8</strong> is a compact version of EAN-13 designed for small packages where
            space is limited. It encodes 8 digits and is commonly used on small items like candy bars,
            cigarettes, and pencils.
          </p>
          <p>
            <strong>UPC-A</strong> (Universal Product Code) is the standard barcode used in North
            America for retail products. It encodes 12 digits and is essentially a subset of EAN-13.
            Every product sold in a US or Canadian retail store requires a UPC-A barcode.
          </p>

          <h2>How to Use This Generator</h2>
          <ul>
            <li>Select the barcode type that matches your needs</li>
            <li>Enter the text or numbers you want to encode</li>
            <li>Click Generate to create the barcode</li>
            <li>Download the barcode as a PNG image for printing or digital use</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            All barcode generation happens locally in your browser using Canvas drawing. No data
            is sent to any server. Your encoded data remains completely private.
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
            name: "Barcode Generator",
            description: META.description,
            url: `${SITE_URL}/tools/barcode-generator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
