"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Roman Numeral Converter - Number to Roman & Roman to Number",
  description:
    "Free Roman numeral converter. Convert numbers to Roman numerals and Roman numerals to numbers. Includes validation, reference table, and history.",
  keywords:
    "roman numeral converter, roman numerals, number to roman, roman to number, MMXXIV, roman numeral chart, roman numeral calculator",
};

const romanPairs: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(num: number): string {
  if (num <= 0 || num > 3999 || !Number.isInteger(num)) return "";
  let result = "";
  let n = num;
  for (const [value, symbol] of romanPairs) {
    while (n >= value) {
      result += symbol;
      n -= value;
    }
  }
  return result;
}

function fromRoman(s: string): number | null {
  const upper = s.toUpperCase().trim();
  if (!upper || !/^[MDCLXVI]+$/.test(upper)) return null;
  const map: Record<string, number> = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
  let total = 0;
  for (let i = 0; i < upper.length; i++) {
    const curr = map[upper[i]];
    const next = i + 1 < upper.length ? map[upper[i + 1]] : 0;
    if (curr < next) {
      total -= curr;
    } else {
      total += curr;
    }
  }
  // Validate: convert back and check
  if (toRoman(total) !== upper) return null;
  return total;
}

type Mode = "toRoman" | "fromRoman";

const referenceTable = [
  { num: 1, roman: "I" }, { num: 4, roman: "IV" }, { num: 5, roman: "V" },
  { num: 9, roman: "IX" }, { num: 10, roman: "X" }, { num: 40, roman: "XL" },
  { num: 50, roman: "L" }, { num: 90, roman: "XC" }, { num: 100, roman: "C" },
  { num: 400, roman: "CD" }, { num: 500, roman: "D" }, { num: 900, roman: "CM" },
  { num: 1000, roman: "M" },
];

export default function RomanNumeralConverterPage() {
  const [mode, setMode] = useState<Mode>("toRoman");
  const [numInput, setNumInput] = useState("2024");
  const [romanInput, setRomanInput] = useState("MMXXIV");

  const numVal = parseInt(numInput) || 0;
  const romanResult = mode === "toRoman" && numVal > 0 && numVal <= 3999 ? toRoman(numVal) : "";
  const numberResult = mode === "fromRoman" ? fromRoman(romanInput) : null;

  const isValidRoman = mode === "fromRoman" && romanInput.trim() !== "" && numberResult !== null;
  const isInvalidRoman = mode === "fromRoman" && romanInput.trim() !== "" && numberResult === null;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/roman-numeral-converter`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Roman Numeral Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert numbers to Roman numerals and vice versa. Live conversion with validation and a complete reference table.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("toRoman")}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                mode === "toRoman"
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
              }`}
            >
              Number &rarr; Roman
            </button>
            <button
              onClick={() => setMode("fromRoman")}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                mode === "fromRoman"
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
              }`}
            >
              Roman &rarr; Number
            </button>
          </div>

          {mode === "toRoman" && (
            <div>
              <label className="block text-sm font-medium mb-1">Enter a Number (1-3999)</label>
              <input
                type="number"
                min="1"
                max="3999"
                value={numInput}
                onChange={(e) => setNumInput(e.target.value)}
                className="input-field text-lg"
                placeholder="e.g. 2024"
              />
            </div>
          )}

          {mode === "fromRoman" && (
            <div>
              <label className="block text-sm font-medium mb-1">Enter Roman Numeral</label>
              <input
                type="text"
                value={romanInput}
                onChange={(e) => setRomanInput(e.target.value.toUpperCase())}
                className="input-field text-lg font-mono uppercase"
                placeholder="e.g. MMXXIV"
              />
            </div>
          )}
        </div>

        {mode === "toRoman" && romanResult && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Number</p>
                <p className="text-3xl font-bold text-[var(--primary)]">{numVal.toLocaleString()}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Roman Numeral</p>
                <p className="text-3xl font-bold text-green-700 font-mono">{romanResult}</p>
              </div>
            </div>
          </div>
        )}

        {mode === "toRoman" && numVal > 0 && (numVal > 3999 || numVal < 1) && (
          <div className="result-card text-center mb-8">
            <p className="text-red-600 font-semibold">Roman numerals only support numbers from 1 to 3999.</p>
          </div>
        )}

        {mode === "fromRoman" && isValidRoman && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Roman Numeral</p>
                <p className="text-3xl font-bold text-[var(--primary)] font-mono">{romanInput.toUpperCase()}</p>
                <p className="text-xs text-green-600 mt-1">Valid Roman numeral</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Number</p>
                <p className="text-3xl font-bold text-green-700">{numberResult?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {isInvalidRoman && (
          <div className="result-card text-center mb-8">
            <p className="text-red-600 font-semibold">Invalid Roman numeral. Please check the input.</p>
          </div>
        )}

        {/* Reference Table */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Reference Table</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {referenceTable.map((r) => (
              <div key={r.num} className="flex justify-between items-center px-3 py-2 border rounded text-sm" style={{ borderColor: "var(--card-border)" }}>
                <span className="font-mono font-bold text-[var(--primary)]">{r.roman}</span>
                <span className="text-[var(--muted)]">{r.num}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Common years */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Common Years in Roman Numerals</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {[1990, 2000, 2010, 2020, 2024, 2025, 2026, 2030, 2050].map((y) => (
              <div key={y} className="flex justify-between py-1 border-b border-[var(--card-border)]">
                <span>{y}</span>
                <span className="font-mono font-bold text-[var(--primary)]">{toRoman(y)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>History of Roman Numerals</h2>
          <p>
            Roman numerals originated in ancient Rome and were the standard number system throughout the Roman Empire and medieval Europe. They use combinations of letters from the Latin alphabet: I, V, X, L, C, D, and M to represent values 1, 5, 10, 50, 100, 500, and 1000.
          </p>

          <h2>How Roman Numerals Work</h2>
          <p>
            Roman numerals use an additive-subtractive system. When a smaller numeral appears before a larger one, it is subtracted (e.g., IV = 4). When after, it is added (e.g., VI = 6). Only I, X, and C can be used as subtractive numerals.
          </p>

          <h3>Rules for Roman Numerals</h3>
          <p>
            A symbol can be repeated at most three times consecutively (III = 3, but IIII is not valid; 4 is written as IV). The subtractive pairs allowed are: IV (4), IX (9), XL (40), XC (90), CD (400), and CM (900). The maximum standard Roman numeral is 3999 (MMMCMXCIX).
          </p>

          <h3>Where Roman Numerals Are Used Today</h3>
          <p>
            Roman numerals are used on clock faces, for numbering Super Bowl games, in movie credits and copyright dates, for book chapter numbering, outlines, and to distinguish kings and popes with the same name (e.g., King Henry VIII).
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
            name: "Roman Numeral Converter",
            description: META.description,
            url: `${SITE_URL}/tools/roman-numeral-converter`,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
