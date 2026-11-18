"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "CM to Inches Converter - Centimeters to Inches & Feet",
  description:
    "Free cm to inches converter. Convert centimeters to inches and feet+inches instantly. Reference table for common heights. Formula: inches = cm / 2.54.",
  keywords:
    "cm to inches, centimeters to inches, inches to cm, cm to feet, height converter, cm inches conversion, length converter, metric to imperial",
};

const CM_PER_INCH = 2.54;

function cmToInches(cm: number): number {
  return cm / CM_PER_INCH;
}

function inchesToCm(inches: number): number {
  return inches * CM_PER_INCH;
}

function toFeetInches(totalInches: number): { feet: number; inches: number } {
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches - feet * 12;
  return { feet, inches };
}

const HEIGHT_TABLE = [
  { label: "Child (4 years)", cm: 102 },
  { label: "Child (8 years)", cm: 128 },
  { label: "Short Adult", cm: 152 },
  { label: "5 feet", cm: 152.4 },
  { label: "5'2\"", cm: 157.48 },
  { label: "5'4\"", cm: 162.56 },
  { label: "Average Woman (US)", cm: 163 },
  { label: "5'6\"", cm: 167.64 },
  { label: "5'8\"", cm: 172.72 },
  { label: "Average Man (US)", cm: 175.3 },
  { label: "5'10\"", cm: 177.8 },
  { label: "6 feet", cm: 182.88 },
  { label: "6'2\"", cm: 187.96 },
  { label: "6'4\"", cm: 193.04 },
  { label: "Very Tall", cm: 198.12 },
];

export default function CmToInchesPage() {
  const [cm, setCm] = useState("170");
  const [inches, setInches] = useState("66.93");
  const [lastEdited, setLastEdited] = useState<"cm" | "in">("cm");

  const handleCmChange = (val: string) => {
    setCm(val);
    setLastEdited("cm");
    const v = parseFloat(val);
    if (!isNaN(v)) {
      setInches(cmToInches(v).toFixed(2));
    }
  };

  const handleInchesChange = (val: string) => {
    setInches(val);
    setLastEdited("in");
    const v = parseFloat(val);
    if (!isNaN(v)) {
      setCm(inchesToCm(v).toFixed(2));
    }
  };

  const cmVal = parseFloat(cm) || 0;
  const inVal = parseFloat(inches) || 0;
  const currentCm = lastEdited === "cm" ? cmVal : inchesToCm(inVal);
  const currentIn = lastEdited === "cm" ? cmToInches(cmVal) : inVal;
  const feetIn = toFeetInches(currentIn);

  const fmt = (n: number) => n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/cm-to-inches`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">CM to Inches Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Instantly convert between centimeters and inches. Also shows feet and inches. Enter a value in either field and the other updates automatically.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Centimeters (cm)</label>
              <input
                type="number"
                value={cm}
                onChange={(e) => handleCmChange(e.target.value)}
                className="input-field"
                placeholder="e.g., 170"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Inches (in)</label>
              <input
                type="number"
                value={inches}
                onChange={(e) => handleInchesChange(e.target.value)}
                className="input-field"
                placeholder="e.g., 66.93"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="result-card text-center">
              <p className="text-sm text-[var(--muted)] mb-1">Centimeters</p>
              <p className="text-2xl font-bold text-[var(--primary)]">{fmt(currentCm)} cm</p>
            </div>
            <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
              <p className="text-sm text-[var(--muted)] mb-1">Inches</p>
              <p className="text-2xl font-bold text-green-700">{fmt(currentIn)} in</p>
            </div>
            <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
              <p className="text-sm text-[var(--muted)] mb-1">Feet + Inches</p>
              <p className="text-2xl font-bold text-amber-700">{feetIn.feet}&apos; {fmt(feetIn.inches)}&quot;</p>
            </div>
          </div>

          <div className="tool-card mb-6">
            <h2 className="text-lg font-bold mb-2">Formula</h2>
            <ul className="text-sm text-[var(--muted)] space-y-1">
              <li><strong>inches = cm / 2.54</strong></li>
              <li><strong>cm = inches x 2.54</strong></li>
              <li><strong>1 foot = 12 inches = 30.48 cm</strong></li>
            </ul>
          </div>
        </div>

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Common Heights Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Description</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">CM</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Inches</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Feet + Inches</th>
                </tr>
              </thead>
              <tbody>
                {HEIGHT_TABLE.map((h) => {
                  const totalIn = cmToInches(h.cm);
                  const fi = toFeetInches(totalIn);
                  return (
                    <tr key={h.label} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{h.label}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(h.cm)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(totalIn)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fi.feet}&apos; {fmt(fi.inches)}&quot;</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Convert CM to Inches</h2>
          <p>
            To convert centimeters to inches, divide the length in centimeters by 2.54. For example,
            170 cm / 2.54 = 66.93 inches. One inch is exactly 2.54 centimeters by definition.
          </p>

          <h2>How to Convert Inches to CM</h2>
          <p>
            To convert inches to centimeters, multiply the length in inches by 2.54. For example,
            12 inches x 2.54 = 30.48 cm (which equals 1 foot).
          </p>

          <h2>Feet and Inches</h2>
          <p>
            In the US and UK, height is often expressed in feet and inches. One foot equals 12 inches.
            To convert total inches to feet and inches, divide by 12 — the quotient is feet and the remainder is inches.
            For example, 66.93 inches = 5 feet 6.93 inches.
          </p>

          <h3>Quick Mental Estimate</h3>
          <p>
            For a quick rough conversion from cm to inches, divide by 2.5 instead of 2.54. For example,
            180 cm / 2.5 = 72 inches. The actual value is 70.87 inches, so this gives a close estimate.
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
            name: "CM to Inches Converter",
            description: META.description,
            url: `${SITE_URL}/tools/cm-to-inches`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
