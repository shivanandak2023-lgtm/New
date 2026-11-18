"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Fencing Calculator - Free Posts, Panels & Cost Estimator (2025)",
  description:
    "Fencing calculator to estimate posts, rails, pickets, and cost. Calculate how much fencing you need for wood, vinyl, chain link, and aluminum fences.",
  keywords:
    "fence calculator, fencing calculator, how much fencing do I need, fence cost calculator, fence post calculator, wood fence calculator, vinyl fence calculator, chain link fence calculator, fence panel calculator, fence estimator",
};

interface FenceType {
  name: string;
  costPerLfLow: number;
  costPerLfHigh: number;
  picketsPerFoot: number;
  railsPerSection: number;
}

const FENCE_TYPES: FenceType[] = [
  { name: "Wood (Privacy)", costPerLfLow: 15, costPerLfHigh: 35, picketsPerFoot: 2, railsPerSection: 3 },
  { name: "Chain Link", costPerLfLow: 10, costPerLfHigh: 25, picketsPerFoot: 0, railsPerSection: 1 },
  { name: "Vinyl", costPerLfLow: 20, costPerLfHigh: 45, picketsPerFoot: 0, railsPerSection: 2 },
  { name: "Aluminum", costPerLfLow: 25, costPerLfHigh: 55, picketsPerFoot: 0, railsPerSection: 2 },
];

export default function FencingCalculatorPage() {
  const [inputMode, setInputMode] = useState<"perimeter" | "rectangle">("perimeter");
  const [perimeterFt, setPerimeterFt] = useState("200");
  const [rectLengthFt, setRectLengthFt] = useState("50");
  const [rectWidthFt, setRectWidthFt] = useState("30");
  const [fenceHeight, setFenceHeight] = useState("6");
  const [gateWidth, setGateWidth] = useState("4");
  const [gateCount, setGateCount] = useState("1");
  const [fenceTypeIdx, setFenceTypeIdx] = useState(0);
  const [postSpacing, setPostSpacing] = useState("8");
  const [calculated, setCalculated] = useState(false);

  function calculate() {
    setCalculated(true);
  }

  const totalPerimeter = inputMode === "perimeter"
    ? parseFloat(perimeterFt) || 0
    : 2 * ((parseFloat(rectLengthFt) || 0) + (parseFloat(rectWidthFt) || 0));

  const gates = parseInt(gateCount) || 0;
  const gateW = parseFloat(gateWidth) || 4;
  const totalGateWidth = gates * gateW;
  const fenceLinearFt = Math.max(totalPerimeter - totalGateWidth, 0);
  const spacing = parseFloat(postSpacing) || 8;
  const posts = Math.ceil(fenceLinearFt / spacing) + 1 + gates * 2;
  const selected = FENCE_TYPES[fenceTypeIdx];
  const sections = Math.ceil(fenceLinearFt / spacing);
  const rails = sections * selected.railsPerSection;
  const pickets = selected.picketsPerFoot > 0 ? Math.ceil(fenceLinearFt * selected.picketsPerFoot) : 0;
  const panels = selected.name !== "Wood (Privacy)" ? sections : 0;
  const height = parseFloat(fenceHeight) || 6;
  const costLow = totalPerimeter * selected.costPerLfLow;
  const costHigh = totalPerimeter * selected.costPerLfHigh;
  const costMid = (costLow + costHigh) / 2;

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/fencing-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/fencing-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Fencing Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate how much fencing you need — posts, rails, pickets, gates, and estimated cost for wood, chain link, vinyl, and aluminum fences.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Input Mode</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={inputMode === "perimeter"} onChange={() => setInputMode("perimeter")} />
                <span className="text-sm">Total Perimeter (ft)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={inputMode === "rectangle"} onChange={() => setInputMode("rectangle")} />
                <span className="text-sm">Rectangular Yard (L x W)</span>
              </label>
            </div>
          </div>

          {inputMode === "perimeter" ? (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Total Perimeter (ft)</label>
              <input type="number" value={perimeterFt} onChange={(e) => setPerimeterFt(e.target.value)} className="input-field w-full md:w-1/2" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Yard Length (ft)</label>
                <input type="number" value={rectLengthFt} onChange={(e) => setRectLengthFt(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Yard Width (ft)</label>
                <input type="number" value={rectWidthFt} onChange={(e) => setRectWidthFt(e.target.value)} className="input-field" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fence Height (ft)</label>
              <select value={fenceHeight} onChange={(e) => setFenceHeight(e.target.value)} className="input-field">
                <option value="4">4 ft</option>
                <option value="6">6 ft (Standard)</option>
                <option value="8">8 ft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fence Type</label>
              <select value={fenceTypeIdx} onChange={(e) => setFenceTypeIdx(parseInt(e.target.value))} className="input-field">
                {FENCE_TYPES.map((t, i) => (
                  <option key={i} value={i}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gates</label>
              <input type="number" value={gateCount} onChange={(e) => setGateCount(e.target.value)} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gate Width (ft)</label>
              <input type="number" value={gateWidth} onChange={(e) => setGateWidth(e.target.value)} className="input-field" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Post Spacing (ft)</label>
            <input type="number" value={postSpacing} onChange={(e) => setPostSpacing(e.target.value)} className="input-field w-full md:w-1/4" />
            <p className="text-xs text-[var(--muted)] mt-1">Standard: 8 ft between posts</p>
          </div>

          <button onClick={calculate} className="btn-primary">Calculate Fencing</button>
        </div>

        {calculated && totalPerimeter > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Linear Feet</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{totalPerimeter.toFixed(0)} ft</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Posts Needed</p>
                <p className="text-2xl font-bold text-green-700">{posts}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Rails</p>
                <p className="text-2xl font-bold">{rails}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Est. Cost</p>
                <p className="text-2xl font-bold">{fmtExact(costMid)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Materials Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Perimeter</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{totalPerimeter.toFixed(0)} ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Fence Line (minus gates)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fenceLinearFt.toFixed(0)} ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Fence Height</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{height} ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Fence Type</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{selected.name}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Posts (every {spacing} ft)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{posts} posts</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Sections</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{sections}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Rails ({selected.railsPerSection} per section)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{rails}</td>
                  </tr>
                  {pickets > 0 && (
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Pickets</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{pickets}</td>
                    </tr>
                  )}
                  {panels > 0 && (
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Panels</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{panels}</td>
                    </tr>
                  )}
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Gates</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{gates} ({gateW} ft wide)</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Cost Range ({selected.name})</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(costLow)} - {fmtExact(costHigh)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Estimated Total Cost</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(costMid)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Much Fencing Do I Need?</h2>
          <p>
            This free fencing calculator helps you determine the materials and cost needed to build a fence around your
            property. Whether you are installing a privacy fence, chain link fence, or decorative aluminum fence, the
            calculator estimates the number of posts, rails, pickets or panels, and gates required based on your
            perimeter measurements. It also provides cost estimates for each fence type to help you plan your budget.
          </p>

          <h2>How to Use the Fencing Calculator</h2>
          <p>
            You can enter your fence line in two ways: type in the total perimeter in linear feet, or enter the length
            and width of your rectangular yard and the calculator will compute the perimeter automatically. Choose
            your fence height (4, 6, or 8 feet), select the fence type, and specify how many gates you need. The
            standard post spacing is 8 feet, which works for most fence types. Click calculate to see the full
            materials list and cost estimate.
          </p>

          <h2>Fencing Calculation Formula</h2>
          <ul>
            <li><strong>Perimeter (rectangular):</strong> 2 x (Length + Width)</li>
            <li><strong>Fence Line:</strong> Total Perimeter - (Gates x Gate Width)</li>
            <li><strong>Posts:</strong> (Fence Line / Post Spacing) + 1 + (Gates x 2 for gate posts)</li>
            <li><strong>Sections:</strong> Fence Line / Post Spacing, rounded up</li>
            <li><strong>Rails:</strong> Sections x Rails per Section (typically 2-3)</li>
            <li><strong>Pickets (wood):</strong> Fence Linear Feet x ~2 pickets per foot</li>
          </ul>

          <h3>Common Fencing Questions</h3>
          <p>
            <strong>How far apart should fence posts be?</strong> The standard spacing for fence posts is 8 feet on
            center. This applies to most fence types including wood, vinyl, and chain link. For heavy wind areas or
            fences over 6 feet tall, consider reducing spacing to 6 feet for added strength.
          </p>
          <p>
            <strong>What is the cheapest fence to install?</strong> Chain link fencing is the most affordable option
            at $10-$25 per linear foot installed. Wood fencing costs $15-$35 per linear foot, while vinyl ($20-$45)
            and aluminum ($25-$55) are more expensive but require less maintenance over time.
          </p>
          <p>
            <strong>How deep should fence posts be set?</strong> The general rule is to bury one-third of the total
            post length. For a 6-foot fence, use 8-foot posts with 2 feet buried in concrete. In cold climates,
            post holes should extend below the frost line to prevent heaving.
          </p>

          <h3>Fencing Buying Tips</h3>
          <ul>
            <li>Get at least 3 quotes from local fence contractors for the best price</li>
            <li>Check local building codes and HOA rules before choosing a fence style</li>
            <li>Pressure-treated pine is the most economical wood fence option ($12-$20/ft)</li>
            <li>Vinyl fencing costs more upfront but requires zero staining or painting</li>
            <li>Budget $150-$600 per gate depending on size and material</li>
            <li>Always call 811 to locate underground utilities before digging post holes</li>
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
            name: "Fencing Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/fencing-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
