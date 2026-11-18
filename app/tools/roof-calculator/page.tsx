"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Roofing Calculator - How Many Shingles Do I Need?",
  description:
    "Free roofing calculator to estimate roof area, shingles, bundles, underlayment, drip edge, and cost based on roof dimensions, pitch, and material type.",
  keywords:
    "roof calculator, roofing calculator, how many shingles do I need, roof area calculator, roofing squares calculator, roof pitch calculator, shingle calculator, roofing cost estimator",
};

type RoofMaterial = "asphalt" | "metal" | "tile" | "wood";

type PitchKey = "4/12" | "6/12" | "8/12" | "10/12" | "12/12";

const PITCH_MULTIPLIER: Record<PitchKey, number> = {
  "4/12": 1.054,
  "6/12": 1.118,
  "8/12": 1.202,
  "10/12": 1.302,
  "12/12": 1.414,
};

const MATERIAL_INFO: Record<RoofMaterial, { label: string; costPerSquare: number; bundlesPerSquare: number }> = {
  asphalt: { label: "Asphalt Shingles", costPerSquare: 350, bundlesPerSquare: 3 },
  metal: { label: "Metal Roofing", costPerSquare: 700, bundlesPerSquare: 0 },
  tile: { label: "Tile Roofing", costPerSquare: 900, bundlesPerSquare: 0 },
  wood: { label: "Wood Shakes", costPerSquare: 600, bundlesPerSquare: 4 },
};

export default function RoofCalculatorPage() {
  const [roofLength, setRoofLength] = useState("40");
  const [roofWidth, setRoofWidth] = useState("30");
  const [pitch, setPitch] = useState<PitchKey>("6/12");
  const [material, setMaterial] = useState<RoofMaterial>("asphalt");
  const [calculated, setCalculated] = useState(false);

  function calculate() {
    setCalculated(true);
  }

  const l = parseFloat(roofLength) || 0;
  const w = parseFloat(roofWidth) || 0;
  const multiplier = PITCH_MULTIPLIER[pitch];
  const info = MATERIAL_INFO[material];

  const flatArea = l * w;
  const roofArea = flatArea * multiplier;
  const wasteArea = roofArea * 1.1;
  const squares = wasteArea / 100;
  const squaresRounded = Math.ceil(squares);
  const bundles = info.bundlesPerSquare > 0 ? squaresRounded * info.bundlesPerSquare : 0;

  const underlaymentRolls = Math.ceil(wasteArea / 400);
  const perimeter = 2 * (l + w);
  const dripEdgeFt = Math.ceil(perimeter * 1.1);
  const totalCost = squaresRounded * info.costPerSquare;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/roof-calculator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Roofing Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate roof area, shingles, bundles, underlayment, drip edge, and estimated cost based on your roof dimensions, pitch, and material type.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Roof Length (ft)</label>
              <input type="number" value={roofLength} onChange={(e) => setRoofLength(e.target.value)} className="input-field" />
              <p className="text-xs text-[var(--muted)] mt-1">Footprint measurement (ground level)</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Roof Width (ft)</label>
              <input type="number" value={roofWidth} onChange={(e) => setRoofWidth(e.target.value)} className="input-field" />
              <p className="text-xs text-[var(--muted)] mt-1">Footprint measurement (ground level)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Roof Pitch</label>
              <select value={pitch} onChange={(e) => setPitch(e.target.value as PitchKey)} className="input-field">
                <option value="4/12">4/12 - Low slope (multiplier: 1.054)</option>
                <option value="6/12">6/12 - Medium slope (multiplier: 1.118)</option>
                <option value="8/12">8/12 - Standard slope (multiplier: 1.202)</option>
                <option value="10/12">10/12 - Steep slope (multiplier: 1.302)</option>
                <option value="12/12">12/12 - Very steep / 45&deg; (multiplier: 1.414)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Roofing Material</label>
              <select value={material} onChange={(e) => setMaterial(e.target.value as RoofMaterial)} className="input-field">
                <option value="asphalt">Asphalt Shingles (~$350/square)</option>
                <option value="metal">Metal Roofing (~$700/square)</option>
                <option value="tile">Tile Roofing (~$900/square)</option>
                <option value="wood">Wood Shakes (~$600/square)</option>
              </select>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary">Calculate Roofing</button>
        </div>

        {calculated && roofArea > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Roof Area</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{roofArea.toFixed(0)} sq ft</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Roofing Squares</p>
                <p className="text-2xl font-bold text-green-700">{squaresRounded}</p>
                <p className="text-xs text-[var(--muted)]">(incl. 10% waste)</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Estimated Cost</p>
                <p className="text-2xl font-bold">{fmt(totalCost)}</p>
                <p className="text-xs text-[var(--muted)]">material only</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Materials List</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Material</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">{info.label}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{squaresRounded} squares</td>
                  </tr>
                  {bundles > 0 && (
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Bundles</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{bundles} bundles</td>
                    </tr>
                  )}
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Underlayment Rolls (400 sq ft each)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{underlaymentRolls} rolls</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Drip Edge</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{dripEdgeFt} linear ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Flat Footprint Area</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{flatArea.toFixed(0)} sq ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Pitch Multiplier ({pitch})</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{multiplier}x</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Material Cost Estimate</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(totalCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Pitch Multiplier Reference</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Pitch</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Multiplier</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Angle</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.entries(PITCH_MULTIPLIER) as [PitchKey, number][]).map(([p, m]) => (
                    <tr key={p} className={p === pitch ? "bg-blue-50 font-semibold" : "hover:bg-[var(--muted-bg)]"}>
                      <td className="border border-[var(--card-border)] px-3 py-2">{p}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{m}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{(Math.atan(parseInt(p) / 12) * 180 / Math.PI).toFixed(1)}&deg;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Roofing Materials</h2>
          <p>
            Estimating roofing materials is one of the most important steps in any roofing project. Whether you are a
            homeowner getting quotes or a contractor planning a job, our roofing calculator helps you determine how many
            shingles, bundles, and squares you need based on your roof dimensions and pitch. Accurate estimates prevent
            costly shortages and reduce leftover waste.
          </p>

          <h2>Understanding Roof Pitch</h2>
          <p>
            Roof pitch is expressed as a ratio of vertical rise to horizontal run. A 6/12 pitch means the roof rises
            6 inches for every 12 inches of horizontal distance. The pitch determines the actual surface area of your
            roof, which is always larger than the flat footprint. The pitch multiplier converts the flat area to the
            true roof area. For example, a 1,200 sq ft flat footprint with a 6/12 pitch has an actual roof area of
            1,200 x 1.118 = 1,342 sq ft.
          </p>

          <h2>What Is a Roofing Square?</h2>
          <p>
            In the roofing industry, a &quot;square&quot; equals 100 square feet of roof area. This is the standard unit
            for ordering materials. For asphalt shingles, one square requires 3 bundles. So a 15-square roof needs 45
            bundles of shingles. Always add 10% for waste from cuts around valleys, hips, ridges, and edges.
          </p>

          <h2>Roofing Material Costs (US Average)</h2>
          <ul>
            <li><strong>Asphalt Shingles:</strong> $300-$500 per square installed, 20-30 year warranty, most popular in US</li>
            <li><strong>Metal Roofing:</strong> $600-$1,000 per square installed, 40-70 year lifespan, energy efficient</li>
            <li><strong>Tile Roofing:</strong> $800-$1,200 per square installed, 50-100 year lifespan, popular in Southwest</li>
            <li><strong>Wood Shakes:</strong> $500-$800 per square installed, 30-40 year lifespan, natural aesthetic</li>
          </ul>

          <h2>Underlayment and Drip Edge</h2>
          <p>
            Roofing underlayment is a water-resistant barrier installed between the roof deck and the shingles. Standard
            felt underlayment rolls cover about 400 square feet. Synthetic underlayment is more expensive but lasts longer
            and is easier to install. Drip edge is metal flashing installed along the roof edges to direct water away from
            the fascia and into the gutters. Building codes in most US states now require drip edge on all new roof
            installations.
          </p>

          <h2>How to Measure Your Roof</h2>
          <p>
            The easiest way to estimate roof size is to measure the building footprint from the ground. Measure the
            length and width of the building, then apply the pitch multiplier. For complex roofs with multiple sections,
            measure each rectangular section separately and add the areas together. If you are uncomfortable on a ladder,
            satellite imagery tools can also help estimate roof dimensions from above.
          </p>

          <h3>When to Replace Your Roof</h3>
          <ul>
            <li>Shingles are curling, cracking, or missing granules</li>
            <li>Roof is 20+ years old with asphalt shingles</li>
            <li>Visible leaks or water stains on interior ceilings</li>
            <li>Sagging or uneven roofline indicating structural issues</li>
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
            name: "Roofing Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/roof-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
