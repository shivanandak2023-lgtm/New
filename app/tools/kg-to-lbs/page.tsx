"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Kg to Lbs Converter - Kilograms to Pounds & Stones",
  description:
    "Free kg to lbs converter. Convert kilograms to pounds and stones instantly. Quick reference table for 50-150kg. Formula: lbs = kg x 2.20462.",
  keywords:
    "kg to lbs, kilograms to pounds, lbs to kg, pounds to kilograms, kg to stones, weight converter, mass converter, kg lbs conversion",
};

const KG_TO_LBS = 2.20462;
const KG_TO_STONES = 0.157473;

function kgToLbs(kg: number): number {
  return kg * KG_TO_LBS;
}

function lbsToKg(lbs: number): number {
  return lbs / KG_TO_LBS;
}

function toStones(kg: number): { stones: number; remainLbs: number } {
  const totalLbs = kgToLbs(kg);
  const stones = Math.floor(totalLbs / 14);
  const remainLbs = totalLbs - stones * 14;
  return { stones, remainLbs };
}

const REF_TABLE = Array.from({ length: 21 }, (_, i) => {
  const kg = 50 + i * 5;
  return { kg, lbs: kgToLbs(kg), ...toStones(kg) };
});

export default function KgToLbsPage() {
  const [kg, setKg] = useState("70");
  const [lbs, setLbs] = useState("154.32");
  const [lastEdited, setLastEdited] = useState<"kg" | "lbs">("kg");

  const handleKgChange = (val: string) => {
    setKg(val);
    setLastEdited("kg");
    const v = parseFloat(val);
    if (!isNaN(v)) {
      setLbs(kgToLbs(v).toFixed(2));
    }
  };

  const handleLbsChange = (val: string) => {
    setLbs(val);
    setLastEdited("lbs");
    const v = parseFloat(val);
    if (!isNaN(v)) {
      setKg(lbsToKg(v).toFixed(2));
    }
  };

  const kgVal = parseFloat(kg) || 0;
  const lbsVal = parseFloat(lbs) || 0;
  const currentKg = lastEdited === "kg" ? kgVal : lbsToKg(lbsVal);
  const stoneResult = toStones(currentKg);

  const fmt = (n: number) => n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/kg-to-lbs`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/kg-to-lbs`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Kg to Lbs Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Instantly convert between kilograms and pounds. Also shows stones (UK). Enter a value in either field and the other updates automatically.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Kilograms (kg)</label>
              <input
                type="number"
                value={kg}
                onChange={(e) => handleKgChange(e.target.value)}
                className="input-field"
                placeholder="e.g., 70"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pounds (lbs)</label>
              <input
                type="number"
                value={lbs}
                onChange={(e) => handleLbsChange(e.target.value)}
                className="input-field"
                placeholder="e.g., 154.32"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="result-card text-center">
              <p className="text-sm text-[var(--muted)] mb-1">Kilograms</p>
              <p className="text-2xl font-bold text-[var(--primary)]">{fmt(currentKg)} kg</p>
            </div>
            <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
              <p className="text-sm text-[var(--muted)] mb-1">Pounds</p>
              <p className="text-2xl font-bold text-green-700">{fmt(kgToLbs(currentKg))} lbs</p>
            </div>
            <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
              <p className="text-sm text-[var(--muted)] mb-1">Stones (UK)</p>
              <p className="text-2xl font-bold text-amber-700">{stoneResult.stones} st {fmt(stoneResult.remainLbs)} lbs</p>
            </div>
          </div>

          <div className="tool-card mb-6">
            <h2 className="text-lg font-bold mb-2">Formula</h2>
            <ul className="text-sm text-[var(--muted)] space-y-1">
              <li><strong>lbs = kg x 2.20462</strong></li>
              <li><strong>kg = lbs / 2.20462</strong></li>
              <li><strong>1 stone = 14 lbs = 6.35029 kg</strong></li>
            </ul>
          </div>
        </div>

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Quick Reference Table (50-150 kg)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Kg</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Lbs</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Stones + Lbs</th>
                </tr>
              </thead>
              <tbody>
                {REF_TABLE.map((r) => (
                  <tr key={r.kg} className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{r.kg}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(r.lbs)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{r.stones} st {fmt(r.remainLbs)} lbs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Convert Kilograms to Pounds</h2>
          <p>
            To convert kilograms to pounds, multiply the weight in kilograms by 2.20462. For example,
            70 kg x 2.20462 = 154.32 lbs. This conversion factor is exact and works for any weight value.
          </p>

          <h2>How to Convert Pounds to Kilograms</h2>
          <p>
            To convert pounds to kilograms, divide the weight in pounds by 2.20462 (or multiply by 0.453592).
            For example, 150 lbs / 2.20462 = 68.04 kg.
          </p>

          <h2>What Are Stones?</h2>
          <p>
            The stone (st) is a unit of weight commonly used in the United Kingdom and Ireland for measuring body weight.
            One stone equals 14 pounds (6.35 kg). For example, 70 kg is approximately 11 stone 0.2 lbs.
          </p>

          <h3>Quick Mental Estimate</h3>
          <p>
            For a quick rough estimate, you can double the kg value and add 10% of the result. For example,
            70 kg: 70 x 2 = 140, plus 10% (14) = 154 lbs. The actual value is 154.32 lbs, so this trick is quite accurate.
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
            name: "Kg to Lbs Converter",
            description: META.description,
            url: `${SITE_URL}/tools/kg-to-lbs`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
