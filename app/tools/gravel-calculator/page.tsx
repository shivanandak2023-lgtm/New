"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Gravel Calculator - Free Tons, Cubic Yards & Cost Estimator (2025)",
  description:
    "Gravel calculator to estimate tons, cubic yards, and bags needed. Calculate how much gravel for driveways, patios, and landscaping projects.",
  keywords:
    "gravel calculator, how much gravel do I need, gravel calculator tons, gravel calculator cubic yards, crushed stone calculator, pea gravel calculator, driveway gravel calculator, gravel cost estimator, river rock calculator, gravel coverage calculator",
};

interface GravelType {
  name: string;
  tonsPerCuYd: number;
  costPerTonLow: number;
  costPerTonHigh: number;
}

const GRAVEL_TYPES: GravelType[] = [
  { name: "Pea Gravel", tonsPerCuYd: 1.4, costPerTonLow: 25, costPerTonHigh: 50 },
  { name: "Crushed Stone", tonsPerCuYd: 1.4, costPerTonLow: 20, costPerTonHigh: 45 },
  { name: "River Rock", tonsPerCuYd: 1.5, costPerTonLow: 40, costPerTonHigh: 75 },
  { name: "Decomposed Granite", tonsPerCuYd: 1.35, costPerTonLow: 25, costPerTonHigh: 50 },
];

export default function GravelCalculatorPage() {
  const [lengthFt, setLengthFt] = useState("20");
  const [widthFt, setWidthFt] = useState("10");
  const [depthIn, setDepthIn] = useState("4");
  const [gravelType, setGravelType] = useState(0);
  const [costPerTon, setCostPerTon] = useState("35");
  const [calculated, setCalculated] = useState(false);

  function calculate() {
    setCalculated(true);
  }

  const length = parseFloat(lengthFt) || 0;
  const width = parseFloat(widthFt) || 0;
  const depth = parseFloat(depthIn) || 0;
  const sqft = length * width;
  const cubicFeet = sqft * (depth / 12);
  const cubicYards = cubicFeet / 27;
  const selected = GRAVEL_TYPES[gravelType];
  const tons = cubicYards * selected.tonsPerCuYd;
  const bags50lb = Math.ceil(tons * 2000 / 50);
  const costCustom = tons * (parseFloat(costPerTon) || 35);
  const costLow = tons * selected.costPerTonLow;
  const costHigh = tons * selected.costPerTonHigh;

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/gravel-calculator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Gravel Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate how much gravel you need in tons, cubic yards, and bags. Supports pea gravel, crushed stone, river rock, and decomposed granite.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Length (ft)</label>
              <input type="number" value={lengthFt} onChange={(e) => setLengthFt(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Width (ft)</label>
              <input type="number" value={widthFt} onChange={(e) => setWidthFt(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Depth (inches)</label>
              <input type="number" value={depthIn} onChange={(e) => setDepthIn(e.target.value)} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Gravel Type</label>
              <select value={gravelType} onChange={(e) => setGravelType(parseInt(e.target.value))} className="input-field">
                {GRAVEL_TYPES.map((t, i) => (
                  <option key={i} value={i}>{t.name} (~{t.tonsPerCuYd} tons/yd&sup3;)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost per Ton ($)</label>
              <input type="number" value={costPerTon} onChange={(e) => setCostPerTon(e.target.value)} className="input-field" />
              <p className="text-xs text-[var(--muted)] mt-1">Typical: ${selected.costPerTonLow}-${selected.costPerTonHigh}/ton for {selected.name}</p>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary">Calculate Gravel</button>
        </div>

        {calculated && cubicFeet > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Cubic Yards</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{cubicYards.toFixed(2)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Tons</p>
                <p className="text-2xl font-bold text-green-700">{tons.toFixed(2)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">50 lb Bags</p>
                <p className="text-2xl font-bold">{bags50lb}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Est. Cost</p>
                <p className="text-2xl font-bold">{fmtExact(costCustom)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Cost Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Coverage Area</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{sqft.toFixed(0)} sq ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Depth</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{depthIn} inches</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Gravel Type</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{selected.name}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Cubic Yards</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{cubicYards.toFixed(2)} yd&sup3;</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Weight (tons)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{tons.toFixed(2)} tons</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">50 lb Bags</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{bags50lb} bags</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Price Range ({selected.name})</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(costLow)} - {fmtExact(costHigh)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Estimated Cost (custom rate)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(costCustom)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Much Gravel Do I Need?</h2>
          <p>
            This free gravel calculator helps you determine the exact amount of gravel required for your project, whether
            you are building a driveway, creating a patio base, filling a drainage area, or landscaping. The calculator
            converts your measurements into cubic yards, tons, and the number of 50 lb bags, so you can order the right
            quantity and avoid costly overages or shortages.
          </p>

          <h2>How to Use the Gravel Calculator</h2>
          <p>
            Measure the length and width of your project area in feet, then determine the depth of gravel you need in
            inches. For driveways, 4 to 6 inches is standard. For walkways and patios, 2 to 4 inches is typical. Enter
            these values into the calculator, select your gravel type, and click calculate. The tool will instantly show
            you the cubic yards, tonnage, and estimated cost based on current average pricing.
          </p>

          <h2>Gravel Calculation Formula</h2>
          <ul>
            <li><strong>Cubic Feet:</strong> Length (ft) x Width (ft) x Depth (in) / 12</li>
            <li><strong>Cubic Yards:</strong> Cubic Feet / 27</li>
            <li><strong>Tons:</strong> Cubic Yards x Density (typically 1.4 tons per cubic yard for most gravel)</li>
            <li><strong>50 lb Bags:</strong> (Tons x 2,000) / 50</li>
          </ul>
          <p>
            For instance, a 20 ft x 10 ft area at 4 inches deep needs approximately 2.47 cubic yards or about 3.46
            tons of crushed stone.
          </p>

          <h3>Common Gravel Questions</h3>
          <p>
            <strong>How deep should a gravel driveway be?</strong> A properly constructed gravel driveway should be 4 to
            6 inches deep. Many professionals recommend a 4-inch base layer of larger crushed stone topped with 2 inches
            of finer gravel for a total depth of 6 inches.
          </p>
          <p>
            <strong>How many tons is a cubic yard of gravel?</strong> Most gravel types weigh approximately 1.4 tons
            (2,800 lbs) per cubic yard. River rock is slightly heavier at about 1.5 tons per cubic yard, while
            decomposed granite is lighter at roughly 1.35 tons per cubic yard.
          </p>
          <p>
            <strong>What type of gravel is best for driveways?</strong> Crushed stone (such as #57 stone or #411 gravel)
            is the most popular choice for driveways because it compacts well and provides a stable surface. Pea gravel
            is better suited for walkways, patios, and decorative areas.
          </p>

          <h3>Gravel Buying Tips</h3>
          <ul>
            <li>Buy gravel by the ton for large projects — bulk delivery is much cheaper than bagged</li>
            <li>Expect delivery fees of $50-$150 depending on distance from the quarry</li>
            <li>Crushed stone is the most affordable option at $20-$45 per ton</li>
            <li>River rock and decorative gravel cost more at $40-$75 per ton</li>
            <li>Always order 10% extra to account for settling and compaction</li>
            <li>One ton of gravel covers about 80 sq ft at 3 inches deep</li>
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
            name: "Gravel Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/gravel-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
