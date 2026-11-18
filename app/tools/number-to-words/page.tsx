"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Number to Words Converter - Convert Numbers to English Words",
  description:
    "Convert numbers to English words instantly. Supports up to trillions, Indian numbering system (lakhs, crores), and currency mode for dollars and cents.",
  keywords:
    "number to words, number to english, convert number to words, number spelling, indian numbering system, lakhs crores, currency words, number words converter",
};

const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function convertChunk(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? "-" + ones[n % 10] : "");
  return ones[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + convertChunk(n % 100) : "");
}

function numberToWords(n: number): string {
  if (n === 0) return "zero";
  if (n < 0) return "negative " + numberToWords(-n);

  const scales = ["", " thousand", " million", " billion", " trillion"];
  let result = "";
  let scaleIndex = 0;
  let num = Math.floor(n);

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk !== 0) {
      result = convertChunk(chunk) + scales[scaleIndex] + (result ? " " + result : "");
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return result.trim();
}

function numberToWordsIndian(n: number): string {
  if (n === 0) return "zero";
  if (n < 0) return "negative " + numberToWordsIndian(-n);

  let num = Math.floor(n);
  let result = "";

  // First handle last 3 digits (hundreds)
  const lastThree = num % 1000;
  num = Math.floor(num / 1000);
  if (lastThree > 0) result = convertChunk(lastThree);

  // Then groups of 2 (thousands, lakhs, crores, arab, kharab)
  const indianScales = [" thousand", " lakh", " crore", " arab", " kharab"];
  let idx = 0;
  while (num > 0 && idx < indianScales.length) {
    const chunk = num % 100;
    if (chunk !== 0) {
      result = convertChunk(chunk) + indianScales[idx] + (result ? " " + result : "");
    }
    num = Math.floor(num / 100);
    idx++;
  }

  return result.trim();
}

function numberToCurrency(numStr: string): string {
  const parts = numStr.split(".");
  const dollars = Math.abs(parseInt(parts[0]) || 0);
  const centsStr = parts[1] ? parts[1].substring(0, 2).padEnd(2, "0") : "00";
  const cents = parseInt(centsStr) || 0;
  const neg = numStr.startsWith("-") ? "negative " : "";

  let result = neg;
  result += numberToWords(dollars);
  result += dollars === 1 ? " dollar" : " dollars";
  if (cents > 0) {
    result += " and " + numberToWords(cents);
    result += cents === 1 ? " cent" : " cents";
  }
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type Mode = "standard" | "indian" | "currency";

export default function NumberToWordsPage() {
  const [input, setInput] = useState("1234567");
  const [mode, setMode] = useState<Mode>("standard");

  const num = parseFloat(input) || 0;
  const isValid = input.trim() !== "" && !isNaN(Number(input));
  const absNum = Math.abs(Math.floor(num));
  const tooLarge = absNum > 999999999999999;

  const result = (() => {
    if (!isValid || tooLarge) return "";
    switch (mode) {
      case "standard":
        return capitalize(numberToWords(Math.floor(num)));
      case "indian":
        return capitalize(numberToWordsIndian(Math.floor(num)));
      case "currency":
        return numberToCurrency(input);
    }
  })();

  // Format number with commas
  const formatted = (() => {
    if (!isValid) return "";
    const parts = input.split(".");
    const intPart = Math.abs(parseInt(parts[0]) || 0);
    if (mode === "indian") {
      const s = intPart.toString();
      if (s.length <= 3) return (num < 0 ? "-" : "") + s + (parts[1] ? "." + parts[1] : "");
      let formatted = s.slice(-3);
      let remaining = s.slice(0, -3);
      while (remaining.length > 0) {
        formatted = remaining.slice(-2) + "," + formatted;
        remaining = remaining.slice(0, -2);
      }
      return (num < 0 ? "-" : "") + formatted + (parts[1] ? "." + parts[1] : "");
    }
    return (num < 0 ? "-" : "") + intPart.toLocaleString("en-US") + (parts[1] ? "." + parts[1] : "");
  })();

  const modes: { key: Mode; label: string }[] = [
    { key: "standard", label: "Standard" },
    { key: "indian", label: "Indian System" },
    { key: "currency", label: "Currency (USD)" },
  ];

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/number-to-words`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/number-to-words`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Number to Words Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert any number to English words. Supports standard, Indian numbering (lakhs, crores), and USD currency mode.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Mode</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {modes.map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                  mode === m.key
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <label className="block text-sm font-medium mb-1">Enter a Number</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field text-lg font-mono"
            placeholder={mode === "currency" ? "1234.56" : "1234567"}
          />
          {isValid && <p className="text-xs text-[var(--muted)] mt-1">Formatted: {formatted}</p>}
        </div>

        {isValid && !tooLarge && result && (
          <div className="mb-8">
            <div className="result-card">
              <p className="text-sm text-[var(--muted)] mb-2">In Words</p>
              <p className="text-xl sm:text-2xl font-bold text-[var(--primary)] leading-relaxed">{result}</p>
            </div>
          </div>
        )}

        {tooLarge && (
          <div className="result-card text-center mb-8">
            <p className="text-red-600 font-semibold">Number too large. Maximum supported: 999,999,999,999,999 (trillions).</p>
          </div>
        )}

        {/* Quick examples */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Quick Examples</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[100, 1000, 10000, 100000, 1000000, 1000000000].map((n) => (
              <div key={n} className="flex justify-between py-1 border-b border-[var(--card-border)]">
                <span className="font-mono">{n.toLocaleString("en-US")}</span>
                <span className="text-[var(--muted)]">{capitalize(numberToWords(n))}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Convert Numbers to Words</h2>
          <p>
            Numbers are broken into groups of three digits (ones, thousands, millions, billions, trillions). Each group is converted individually and then combined with the appropriate scale word. For example, 1,234,567 becomes &quot;one million two hundred thirty-four thousand five hundred sixty-seven.&quot;
          </p>

          <h2>Indian Numbering System</h2>
          <p>
            The Indian system groups digits differently after the thousands place: in pairs instead of threes. So 10,00,000 (ten lakh) equals one million, and 1,00,00,000 (one crore) equals ten million. This system is widely used in India, Pakistan, Bangladesh, Nepal, and Sri Lanka.
          </p>

          <h3>Currency Conversion</h3>
          <p>
            In currency mode, the whole number part is converted to dollars and the decimal part (up to two digits) to cents. For example, $1,234.56 becomes &quot;One Thousand Two Hundred Thirty-Four Dollars and Fifty-Six Cents.&quot;
          </p>

          <h3>Common Uses</h3>
          <p>
            Number-to-words conversion is used on checks and bank documents, legal contracts, invoices, and anywhere amounts must be written out in full for clarity and fraud prevention.
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
            name: "Number to Words Converter",
            description: META.description,
            url: `${SITE_URL}/tools/number-to-words`,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
