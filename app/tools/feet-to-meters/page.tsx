"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Feet to Meters Converter - Feet & Inches to Meters, CM, Yards",
  description:
    "Free feet to meters converter. Convert feet and inches to meters, centimeters, and yards instantly. Reference table and formula: meters = feet x 0.3048.",
  keywords:
    "feet to meters, meters to feet, feet to cm, feet to yards, height converter, ft to m, imperial to metric, length converter",
};

const FT_TO_M = 0.3048;
const IN_TO_M = 0.0254;
const M_TO_YD = 1.09361;

function feetInchesToMeters(feet: number, inches: number): number {
  return feet * FT_TO_M + inches * IN_TO_M;
}

function metersToFeetInches(m: number): { feet: number; inches: number } {
  const totalInches = m / IN_TO_M;
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches - feet * 12;
  return { feet, inches };
}

const REF_TABLE = [
  { label: "1 foot", ft: 1, inch: 0 },
  { label: "3 feet", ft: 3, inch: 0 },
  { label: "5 feet", ft: 5, inch: 0 },
  { label: "5'2\"", ft: 5, inch: 2 },
  { label: "5'4\"", ft: 5, inch: 4 },
  { label: "5'6\"", ft: 5, inch: 6 },
  { label: "5'8\"", ft: 5, inch: 8 },
  { label: "5'10\"", ft: 5, inch: 10 },
  { label: "6 feet", ft: 6, inch: 0 },
  { label: "6'2\"", ft: 6, inch: 2 },
  { label: "6'4\"", ft: 6, inch: 4 },
  { label: "6'6\"", ft: 6, inch: 6 },
  { label: "10 feet", ft: 10, inch: 0 },
  { label: "20 feet", ft: 20, inch: 0 },
  { label: "50 feet", ft: 50, inch: 0 },
  { label: "100 feet", ft: 100, inch: 0 },
];

export default function FeetToMetersPage() {
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("10");
  const [meters, setMeters] = useState("1.778");
  const [lastEdited, setLastEdited] = useState<"ft" | "m">("ft");

  const handleFeetChange = (val: string) => {
    setFeet(val);
    setLastEdited("ft");
    const f = parseFloat(val) || 0;
    const i = parseFloat(inches) || 0;
    setMeters(feetInchesToMeters(f, i).toFixed(4));
  };

  const handleInchesChange = (val: string) => {
    setInches(val);
    setLastEdited("ft");
    const f = parseFloat(feet) || 0;
    const i = parseFloat(val) || 0;
    setMeters(feetInchesToMeters(f, i).toFixed(4));
  };

  const handleMetersChange = (val: string) => {
    setMeters(val);
    setLastEdited("m");
    const m = parseFloat(val) || 0;
    const fi = metersToFeetInches(m);
    setFeet(fi.feet.toString());
    setInches(fi.inches.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""));
  };

  const ftVal = parseFloat(feet) || 0;
  const inVal = parseFloat(inches) || 0;
  const mVal = parseFloat(meters) || 0;

  const currentMeters = lastEdited === "ft" ? feetInchesToMeters(ftVal, inVal) : mVal;
  const currentFI = lastEdited === "m" ? metersToFeetInches(mVal) : { feet: ftVal, inches: inVal };
  const currentCm = currentMeters * 100;
  const currentYards = currentMeters * M_TO_YD;

  const fmt = (n: number) => n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  const fmt2 = (n: number) => n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/feet-to-meters`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/feet-to-meters`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Feet to Meters Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert between feet (and inches) and meters instantly. Also shows centimeters and yards. Enter values in either direction.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Feet</label>
              <input
                type="number"
                value={feet}
                onChange={(e) => handleFeetChange(e.target.value)}
                className="input-field"
                placeholder="e.g., 5"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Inches</label>
              <input
                type="number"
                value={inches}
                onChange={(e) => handleInchesChange(e.target.value)}
                className="input-field"
                placeholder="e.g., 10"
                min="0"
                max="11.99"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meters</label>
              <input
                type="number"
                value={meters}
                onChange={(e) => handleMetersChange(e.target.value)}
                className="input-field"
                placeholder="e.g., 1.778"
                step="0.001"
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="result-card text-center">
              <p className="text-sm text-[var(--muted)] mb-1">Feet + Inches</p>
              <p className="text-xl font-bold text-[var(--primary)]">{Math.floor(currentFI.feet)}&apos; {fmt2(currentFI.inches)}&quot;</p>
            </div>
            <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
              <p className="text-sm text-[var(--muted)] mb-1">Meters</p>
              <p className="text-xl font-bold text-green-700">{fmt(currentMeters)} m</p>
            </div>
            <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
              <p className="text-sm text-[var(--muted)] mb-1">Centimeters</p>
              <p className="text-xl font-bold text-amber-700">{fmt2(currentCm)} cm</p>
            </div>
            <div className="result-card text-center">
              <p className="text-sm text-[var(--muted)] mb-1">Yards</p>
              <p className="text-xl font-bold text-[var(--foreground)]">{fmt(currentYards)} yd</p>
            </div>
          </div>

          <div className="tool-card mb-6">
            <h2 className="text-lg font-bold mb-2">Formulas</h2>
            <ul className="text-sm text-[var(--muted)] space-y-1">
              <li><strong>meters = feet x 0.3048</strong></li>
              <li><strong>feet = meters / 0.3048</strong></li>
              <li><strong>1 foot = 12 inches = 30.48 cm</strong></li>
              <li><strong>1 yard = 3 feet = 0.9144 meters</strong></li>
            </ul>
          </div>
        </div>

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Reference Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Description</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Feet + Inches</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Meters</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">CM</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Yards</th>
                </tr>
              </thead>
              <tbody>
                {REF_TABLE.map((r) => {
                  const m = feetInchesToMeters(r.ft, r.inch);
                  return (
                    <tr key={r.label} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{r.label}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{r.ft}&apos; {r.inch}&quot;</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(m)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt2(m * 100)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(m * M_TO_YD)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Convert Feet to Meters</h2>
          <p>
            To convert feet to meters, multiply the number of feet by 0.3048. For example,
            6 feet x 0.3048 = 1.8288 meters. If you also have inches, convert them separately
            (inches x 0.0254) and add to the result.
          </p>

          <h2>How to Convert Meters to Feet</h2>
          <p>
            To convert meters to feet, divide the number of meters by 0.3048 (or multiply by 3.28084).
            For example, 1.80 meters / 0.3048 = 5.906 feet, which is about 5 feet 10.87 inches.
          </p>

          <h2>Feet, Yards, and Meters</h2>
          <p>
            In the imperial system, 3 feet make 1 yard. One yard is approximately 0.9144 meters.
            In sports, a football field is 100 yards (91.44 meters) long, and a soccer field is
            typically about 100-110 meters (109-120 yards).
          </p>

          <h3>Quick Mental Estimate</h3>
          <p>
            For a quick rough conversion from feet to meters, multiply by 0.3. For example,
            6 feet x 0.3 = 1.8 meters (actual: 1.8288 m). This gives a close enough estimate for everyday use.
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
            name: "Feet to Meters Converter",
            description: META.description,
            url: `${SITE_URL}/tools/feet-to-meters`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
