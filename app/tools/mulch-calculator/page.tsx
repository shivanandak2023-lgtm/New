"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Mulch Calculator - Free Cubic Yards & Bags Estimator (2025)",
  description:
    "Mulch calculator to estimate cubic yards, bags, and cost. Find how much mulch you need for your garden beds, landscaping, and flower beds.",
  keywords:
    "mulch calculator, how much mulch do I need, mulch calculator cubic yards, mulch calculator bags, mulch cost estimator, garden mulch calculator, landscaping mulch, bark mulch calculator, mulch coverage calculator, mulch depth calculator",
};

interface MulchType {
  name: string;
  costPerYardLow: number;
  costPerYardHigh: number;
}

const MULCH_TYPES: MulchType[] = [
  { name: "Hardwood", costPerYardLow: 30, costPerYardHigh: 45 },
  { name: "Cedar", costPerYardLow: 35, costPerYardHigh: 50 },
  { name: "Pine Bark", costPerYardLow: 30, costPerYardHigh: 40 },
  { name: "Rubber", costPerYardLow: 80, costPerYardHigh: 160 },
  { name: "Cocoa", costPerYardLow: 35, costPerYardHigh: 50 },
];

export default function MulchCalculatorPage() {
  const [inputMode, setInputMode] = useState<"dimensions" | "sqft">("dimensions");
  const [lengthFt, setLengthFt] = useState("20");
  const [widthFt, setWidthFt] = useState("10");
  const [totalSqFt, setTotalSqFt] = useState("200");
  const [depthIn, setDepthIn] = useState("3");
  const [mulchType, setMulchType] = useState(0);
  const [costPerYard, setCostPerYard] = useState("40");
  const [addWaste, setAddWaste] = useState(false);
  const [calculated, setCalculated] = useState(false);

  function calculate() {
    setCalculated(true);
  }

  const sqft = inputMode === "dimensions"
    ? (parseFloat(lengthFt) || 0) * (parseFloat(widthFt) || 0)
    : parseFloat(totalSqFt) || 0;
  const depth = parseFloat(depthIn) || 0;
  const cubicFeet = sqft * (depth / 12);
  const wasteFactor = addWaste ? 1.1 : 1.0;
  const cubicYards = (cubicFeet / 27) * wasteFactor;
  const bags2cuft = Math.ceil((cubicFeet * wasteFactor) / 2);
  const cost = cubicYards * (parseFloat(costPerYard) || 40);
  const selected = MULCH_TYPES[mulchType];
  const costLow = cubicYards * selected.costPerYardLow;
  const costHigh = cubicYards * selected.costPerYardHigh;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/mulch-calculator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Mulch Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate how much mulch you need in cubic yards and bags. Estimate cost for hardwood, cedar, pine bark, rubber, and cocoa mulch.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Input Mode</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={inputMode === "dimensions"} onChange={() => setInputMode("dimensions")} />
                <span className="text-sm">Length x Width</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={inputMode === "sqft"} onChange={() => setInputMode("sqft")} />
                <span className="text-sm">Total Sq Ft</span>
              </label>
            </div>
          </div>

          {inputMode === "dimensions" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Length (ft)</label>
                <input type="number" value={lengthFt} onChange={(e) => setLengthFt(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Width (ft)</label>
                <input type="number" value={widthFt} onChange={(e) => setWidthFt(e.target.value)} className="input-field" />
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Total Area (sq ft)</label>
              <input type="number" value={totalSqFt} onChange={(e) => setTotalSqFt(e.target.value)} className="input-field w-full md:w-1/2" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Desired Depth (inches)</label>
              <select value={depthIn} onChange={(e) => setDepthIn(e.target.value)} className="input-field">
                <option value="2">2 inches</option>
                <option value="3">3 inches</option>
                <option value="4">4 inches</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mulch Type</label>
              <select value={mulchType} onChange={(e) => setMulchType(parseInt(e.target.value))} className="input-field">
                {MULCH_TYPES.map((t, i) => (
                  <option key={i} value={i}>{t.name} (${t.costPerYardLow}-${t.costPerYardHigh}/yd)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Custom Cost per Cu Yd ($)</label>
              <input type="number" value={costPerYard} onChange={(e) => setCostPerYard(e.target.value)} className="input-field" />
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={addWaste} onChange={(e) => setAddWaste(e.target.checked)} />
              <span className="text-sm font-medium">Add 10% waste factor</span>
            </label>
            <p className="text-xs text-[var(--muted)] mt-1">Recommended for irregular shapes and settling</p>
          </div>

          <button onClick={calculate} className="btn-primary">Calculate Mulch</button>
        </div>

        {calculated && sqft > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Area</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{sqft.toFixed(0)} sq ft</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Cubic Yards</p>
                <p className="text-2xl font-bold text-green-700">{cubicYards.toFixed(2)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Bags (2 cu ft)</p>
                <p className="text-2xl font-bold">{bags2cuft}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Est. Cost</p>
                <p className="text-2xl font-bold">{fmtExact(cost)}</p>
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
                    <td className="border border-[var(--card-border)] px-3 py-2">Mulch Type</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{selected.name}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Cubic Yards Needed</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{cubicYards.toFixed(2)} yd&sup3;</td>
                  </tr>
                  {addWaste && (
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Waste Factor</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">+10%</td>
                    </tr>
                  )}
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Bags (2 cu ft each)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{bags2cuft} bags</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Price Range ({selected.name})</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(costLow)} - {fmtExact(costHigh)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Estimated Cost (custom rate)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(cost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Much Mulch Do I Need?</h2>
          <p>
            This free mulch calculator helps you determine exactly how much mulch you need for your landscaping project.
            Whether you are covering garden beds, flower beds, tree rings, or walkway borders, knowing the right amount
            of mulch prevents waste and saves money. Simply enter your area dimensions and desired depth, and the
            calculator will tell you the cubic yards, number of bags, and estimated cost.
          </p>

          <h2>How to Use the Mulch Calculator</h2>
          <p>
            Start by measuring the length and width of the area you want to cover in feet. If your bed is an irregular
            shape, break it into smaller rectangles and add them together, or enter the total square footage directly.
            Next, choose your desired mulch depth. Most landscaping professionals recommend 2 to 4 inches of mulch for
            optimal weed control and moisture retention. Select your mulch type from the dropdown to see pricing ranges,
            and optionally enable the 10% waste factor for irregular areas.
          </p>

          <h2>Mulch Calculation Formula</h2>
          <p>
            The formula for calculating mulch is straightforward:
          </p>
          <ul>
            <li><strong>Cubic Feet:</strong> Length (ft) x Width (ft) x Depth (ft) where depth in feet = inches / 12</li>
            <li><strong>Cubic Yards:</strong> Cubic Feet / 27 (there are 27 cubic feet in one cubic yard)</li>
            <li><strong>Bags (2 cu ft):</strong> Total Cubic Feet / 2, rounded up</li>
          </ul>
          <p>
            For example, a 20 ft x 10 ft bed at 3 inches deep requires 200 x 0.25 = 50 cubic feet, which equals
            approximately 1.85 cubic yards or 25 bags of mulch.
          </p>

          <h3>Common Mulch Questions</h3>
          <p>
            <strong>How deep should mulch be?</strong> For most garden beds and landscaping, 2 to 3 inches is ideal.
            Use 4 inches for areas with heavy weed problems or steep slopes. Avoid exceeding 4 inches, as too much
            mulch can suffocate plant roots and prevent water from reaching the soil.
          </p>
          <p>
            <strong>How often should I replace mulch?</strong> Organic mulch such as hardwood and pine bark decomposes
            over time and should be replenished annually. Cedar mulch lasts longer, typically 2 to 3 years. Rubber
            mulch is the most durable and may last 10 years or more.
          </p>
          <p>
            <strong>What is the best mulch for flower beds?</strong> Hardwood mulch and cedar mulch are the most popular
            choices for flower beds. Cedar is naturally insect-resistant and has a pleasant scent. Pine bark mulch is
            also excellent, especially for acid-loving plants like azaleas and blueberries.
          </p>

          <h3>Mulch Buying Tips</h3>
          <ul>
            <li>Buy in bulk (by the cubic yard) for large projects — it is significantly cheaper than bags</li>
            <li>Bagged mulch (2 cu ft bags) is convenient for small areas and is easier to transport</li>
            <li>Expect to pay $30-$50 per cubic yard for organic mulch, delivered</li>
            <li>Rubber mulch costs more upfront ($80-$160/yard) but lasts much longer</li>
            <li>Order mulch in spring before peak landscaping season for the best prices</li>
            <li>One cubic yard of mulch covers about 162 sq ft at 2 inches deep, 108 sq ft at 3 inches, or 81 sq ft at 4 inches</li>
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
            name: "Mulch Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/mulch-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
