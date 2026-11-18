"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Shoe Size Converter - US, UK, EU & CM Conversion Chart",
  description:
    "Free shoe size converter between US Men, US Women, UK, EU, and CM sizing systems. Includes a comprehensive reference chart for all sizes.",
  keywords:
    "shoe size converter, shoe size chart, US to EU shoe size, UK to US shoe size, shoe size conversion, cm to shoe size, EU shoe size chart",
};

// Standard conversion table: US Men, US Women, UK, EU, CM
const SIZE_TABLE = [
  { usM: 3.5, usW: 5, uk: 3, eu: 35.5, cm: 22 },
  { usM: 4, usW: 5.5, uk: 3.5, eu: 36, cm: 22.5 },
  { usM: 4.5, usW: 6, uk: 4, eu: 36.5, cm: 23 },
  { usM: 5, usW: 6.5, uk: 4.5, eu: 37.5, cm: 23.5 },
  { usM: 5.5, usW: 7, uk: 5, eu: 38, cm: 24 },
  { usM: 6, usW: 7.5, uk: 5.5, eu: 38.5, cm: 24.5 },
  { usM: 6.5, usW: 8, uk: 6, eu: 39, cm: 25 },
  { usM: 7, usW: 8.5, uk: 6.5, eu: 40, cm: 25.5 },
  { usM: 7.5, usW: 9, uk: 7, eu: 40.5, cm: 26 },
  { usM: 8, usW: 9.5, uk: 7.5, eu: 41, cm: 26.5 },
  { usM: 8.5, usW: 10, uk: 8, eu: 42, cm: 27 },
  { usM: 9, usW: 10.5, uk: 8.5, eu: 42.5, cm: 27.5 },
  { usM: 9.5, usW: 11, uk: 9, eu: 43, cm: 28 },
  { usM: 10, usW: 11.5, uk: 9.5, eu: 44, cm: 28.5 },
  { usM: 10.5, usW: 12, uk: 10, eu: 44.5, cm: 29 },
  { usM: 11, usW: 12.5, uk: 10.5, eu: 45, cm: 29.5 },
  { usM: 11.5, usW: 13, uk: 11, eu: 45.5, cm: 30 },
  { usM: 12, usW: 13.5, uk: 11.5, eu: 46, cm: 30.5 },
  { usM: 12.5, usW: 14, uk: 12, eu: 47, cm: 31 },
  { usM: 13, usW: 14.5, uk: 12.5, eu: 47.5, cm: 31.5 },
  { usM: 14, usW: 15.5, uk: 13.5, eu: 48.5, cm: 32.5 },
  { usM: 15, usW: 16.5, uk: 14.5, eu: 49.5, cm: 33.5 },
];

type SizeSystem = "usM" | "usW" | "uk" | "eu" | "cm";

const SYSTEMS: { id: SizeSystem; label: string }[] = [
  { id: "usM", label: "US Men" },
  { id: "usW", label: "US Women" },
  { id: "uk", label: "UK" },
  { id: "eu", label: "EU" },
  { id: "cm", label: "CM" },
];

export default function ShoeSizeConverterPage() {
  const [inputSize, setInputSize] = useState<string>("10");
  const [system, setSystem] = useState<SizeSystem>("usM");
  const [result, setResult] = useState<{
    usM: number;
    usW: number;
    uk: number;
    eu: number;
    cm: number;
    exact: boolean;
  } | null>(null);

  function convert() {
    const size = parseFloat(inputSize);
    if (isNaN(size)) return;

    // Find closest match in table
    let bestMatch = SIZE_TABLE[0];
    let bestDiff = Math.abs(SIZE_TABLE[0][system] - size);

    for (const row of SIZE_TABLE) {
      const diff = Math.abs(row[system] - size);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestMatch = row;
      }
    }

    setResult({
      usM: bestMatch.usM,
      usW: bestMatch.usW,
      uk: bestMatch.uk,
      eu: bestMatch.eu,
      cm: bestMatch.cm,
      exact: bestDiff === 0,
    });
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/shoe-size-converter`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Shoe Size Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert shoe sizes between US Men, US Women, UK, EU, and CM systems. Enter your size and see all conversions instantly.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Your Shoe Size</label>
              <input
                type="number"
                value={inputSize}
                onChange={(e) => setInputSize(e.target.value)}
                className="input-field"
                step="0.5"
                placeholder="e.g., 10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Size System</label>
              <select
                value={system}
                onChange={(e) => setSystem(e.target.value as SizeSystem)}
                className="input-field"
              >
                {SYSTEMS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button onClick={convert} className="btn-primary w-full">
                Convert
              </button>
            </div>
          </div>
        </div>

        {result && (
          <div className="mb-8">
            {!result.exact && (
              <p className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-4">
                Exact size not found. Showing the closest match.
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
              <div className={`result-card text-center ${system === "usM" ? "ring-2 ring-[var(--primary)]" : ""}`}>
                <p className="text-sm text-[var(--muted)] mb-1">US Men</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{result.usM}</p>
              </div>
              <div className={`result-card text-center ${system === "usW" ? "ring-2 ring-[var(--primary)]" : ""}`}>
                <p className="text-sm text-[var(--muted)] mb-1">US Women</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{result.usW}</p>
              </div>
              <div className={`result-card text-center ${system === "uk" ? "ring-2 ring-[var(--primary)]" : ""}`}>
                <p className="text-sm text-[var(--muted)] mb-1">UK</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{result.uk}</p>
              </div>
              <div className={`result-card text-center ${system === "eu" ? "ring-2 ring-[var(--primary)]" : ""}`}>
                <p className="text-sm text-[var(--muted)] mb-1">EU</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{result.eu}</p>
              </div>
              <div className={`result-card text-center ${system === "cm" ? "ring-2 ring-[var(--primary)]" : ""}`}>
                <p className="text-sm text-[var(--muted)] mb-1">CM</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{result.cm}</p>
              </div>
            </div>
          </div>
        )}

        {/* Full Reference Table */}
        <div className="tool-card mb-8 overflow-x-auto">
          <h2 className="text-lg font-bold mb-4">Complete Shoe Size Chart</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--muted-bg)]">
                <th className="border border-[var(--card-border)] px-3 py-2 text-center">US Men</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-center">US Women</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-center">UK</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-center">EU</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-center">CM</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_TABLE.map((row, i) => {
                const isHighlighted = result &&
                  row.usM === result.usM && row.usW === result.usW &&
                  row.uk === result.uk && row.eu === result.eu;
                return (
                  <tr key={i} className={isHighlighted ? "bg-blue-50 font-semibold" : "hover:bg-[var(--muted-bg)]"}>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-center">{row.usM}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-center">{row.usW}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-center">{row.uk}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-center">{row.eu}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-center">{row.cm}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Convert Shoe Sizes</h2>
          <p>
            Shoe sizing varies significantly between countries and systems. The most common systems are
            US (with separate Men and Women sizes), UK, EU (European), and CM (centimeters, used in
            Japan and many Asian countries). This converter uses standard conversion charts to find
            the equivalent size across all systems.
          </p>

          <h2>Understanding Different Shoe Size Systems</h2>
          <ul>
            <li><strong>US Sizes</strong> - US Men and US Women sizes differ by approximately 1.5 sizes (e.g., US Men 8 = US Women 9.5)</li>
            <li><strong>UK Sizes</strong> - Similar to US Men but typically 0.5-1 size smaller</li>
            <li><strong>EU Sizes</strong> - European sizes use a continuous numbering system (35-49) based on the Paris point (2/3 cm)</li>
            <li><strong>CM Sizes</strong> - Measured in centimeters from heel to toe, the most objective system</li>
          </ul>

          <h3>Tips for Finding the Right Size</h3>
          <ul>
            <li>Measure your feet in the afternoon when they are slightly larger</li>
            <li>Always try shoes on with the socks you plan to wear</li>
            <li>Sizes can vary between brands, so always try before buying</li>
            <li>Your foot length in CM is the most reliable way to find your size</li>
            <li>If between sizes, go with the larger size for comfort</li>
          </ul>

          <h3>How to Measure Your Foot</h3>
          <p>
            Stand on a piece of paper with your heel against a wall. Mark the tip of your longest toe
            and measure from the wall to the mark in centimeters. Use the CM measurement to find your
            size in any system using the chart above.
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
            name: "Shoe Size Converter",
            description: META.description,
            url: `${SITE_URL}/tools/shoe-size-converter`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
