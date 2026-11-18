"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Soil & Topsoil Calculator - How Much Soil Do I Need?",
  description:
    "Free soil calculator to estimate cubic yards, bags, and tons of topsoil, garden soil, potting mix, or compost needed for your garden beds and landscaping projects.",
  keywords:
    "soil calculator, topsoil calculator cubic yards, how much soil do I need, garden soil calculator, raised bed soil calculator, cubic yards of soil, topsoil calculator, soil estimator",
};

type SoilType = "topsoil" | "garden" | "potting" | "compost";
type Mode = "area" | "raised";

const SOIL_INFO: Record<SoilType, { label: string; density: number; costPerYard: number }> = {
  topsoil: { label: "Topsoil", density: 1.0, costPerYard: 30 },
  garden: { label: "Garden Soil", density: 0.9, costPerYard: 35 },
  potting: { label: "Potting Mix", density: 0.5, costPerYard: 55 },
  compost: { label: "Compost", density: 0.6, costPerYard: 40 },
};

export default function SoilCalculatorPage() {
  const [mode, setMode] = useState<Mode>("area");
  const [lengthFt, setLengthFt] = useState("20");
  const [widthFt, setWidthFt] = useState("10");
  const [depthIn, setDepthIn] = useState("6");
  const [bedLengthFt, setBedLengthFt] = useState("8");
  const [bedWidthFt, setBedWidthFt] = useState("4");
  const [bedHeightIn, setBedHeightIn] = useState("12");
  const [soilType, setSoilType] = useState<SoilType>("topsoil");
  const [calculated, setCalculated] = useState(false);

  const info = SOIL_INFO[soilType];

  function getVolumeCuFt(): number {
    if (mode === "area") {
      const l = parseFloat(lengthFt) || 0;
      const w = parseFloat(widthFt) || 0;
      const d = (parseFloat(depthIn) || 0) / 12;
      return l * w * d;
    }
    const l = parseFloat(bedLengthFt) || 0;
    const w = parseFloat(bedWidthFt) || 0;
    const h = (parseFloat(bedHeightIn) || 0) / 12;
    return l * w * h;
  }

  function calculate() {
    setCalculated(true);
  }

  const cuFt = getVolumeCuFt();
  const cuYd = cuFt / 27;
  const tons = cuYd * info.density;
  const bags1 = Math.ceil(cuFt);
  const bags2 = Math.ceil(cuFt / 2);
  const cost = cuYd * info.costPerYard;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/soil-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/soil-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Soil &amp; Topsoil Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate how much soil, topsoil, garden soil, potting mix, or compost you need in cubic yards, cubic feet, bags, and tons with estimated cost.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode("area")}
              className={`px-4 py-2 rounded text-sm font-medium ${mode === "area" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}
            >
              Area (Length x Width)
            </button>
            <button
              onClick={() => setMode("raised")}
              className={`px-4 py-2 rounded text-sm font-medium ${mode === "raised" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}
            >
              Raised Bed
            </button>
          </div>

          {mode === "area" && (
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
          )}

          {mode === "raised" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Bed Length (ft)</label>
                <input type="number" value={bedLengthFt} onChange={(e) => setBedLengthFt(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bed Width (ft)</label>
                <input type="number" value={bedWidthFt} onChange={(e) => setBedWidthFt(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bed Height (inches)</label>
                <input type="number" value={bedHeightIn} onChange={(e) => setBedHeightIn(e.target.value)} className="input-field" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Soil Type</label>
              <select value={soilType} onChange={(e) => setSoilType(e.target.value as SoilType)} className="input-field">
                <option value="topsoil">Topsoil</option>
                <option value="garden">Garden Soil</option>
                <option value="potting">Potting Mix</option>
                <option value="compost">Compost</option>
              </select>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary">Calculate Soil Needed</button>
        </div>

        {calculated && cuFt > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Cubic Yards</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{cuYd.toFixed(2)} yd&sup3;</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Cubic Feet</p>
                <p className="text-2xl font-bold text-green-700">{cuFt.toFixed(2)} ft&sup3;</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Estimated Weight</p>
                <p className="text-2xl font-bold">{tons.toFixed(2)} tons</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Materials Needed</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Item</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">{info.label} (bulk)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{cuYd.toFixed(2)} cubic yards</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">1 cu ft Bags</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{bags1} bags</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">2 cu ft Bags</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{bags2} bags</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Weight (approx.)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{tons.toFixed(2)} tons</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Estimated Cost (bulk)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(cost)}</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-[var(--muted)] mt-2">* Cost estimate based on average bulk delivery price of {fmt(info.costPerYard)}/cubic yard for {info.label.toLowerCase()}. Actual prices vary by region.</p>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Soil Needed for Your Project</h2>
          <p>
            Whether you are starting a new garden, filling raised beds, or topdressing your lawn, knowing exactly how
            much soil you need saves time, money, and multiple trips to the garden center. Our soil calculator helps
            homeowners and landscapers across the United States estimate the volume of topsoil, garden soil, potting
            mix, or compost required for any project.
          </p>

          <h2>Soil Volume Formula</h2>
          <p>
            The basic formula for calculating soil volume is straightforward: <strong>Length (ft) x Width (ft) x Depth (ft) = Cubic Feet</strong>.
            To convert cubic feet to cubic yards (the standard bulk delivery unit), divide by 27, since one cubic yard equals 27 cubic feet.
            For depth measured in inches, divide the inch value by 12 to convert to feet before multiplying.
          </p>

          <h2>How Much Does Soil Weigh?</h2>
          <p>
            Soil weight varies significantly by type and moisture content. As a general rule, one cubic yard of topsoil weighs
            approximately 2,000 pounds (1 ton). Garden soil is slightly lighter at around 1,800 pounds per cubic yard, while
            compost weighs about 1,200 pounds per cubic yard. Potting mix is the lightest at roughly 1,000 pounds per cubic yard
            because it contains perlite and peat moss. These weights matter when planning delivery and ensuring your raised bed
            structure can support the load.
          </p>

          <h2>Raised Bed Soil Calculator</h2>
          <p>
            Raised beds are increasingly popular in American gardens. A standard 4x8 foot raised bed that is 12 inches deep
            requires approximately 32 cubic feet or about 1.2 cubic yards of soil. For best results, fill raised beds with a
            mix of 60% topsoil, 30% compost, and 10% potting mix. This creates a nutrient-rich growing medium that retains
            moisture while draining well.
          </p>

          <h2>Tips for Ordering Soil</h2>
          <ul>
            <li>Always order 10-15% extra to account for settling and compaction</li>
            <li>Bulk delivery is more cost-effective for orders over 3 cubic yards</li>
            <li>Bagged soil from stores works well for small projects under 1 cubic yard</li>
            <li>Check soil quality before ordering and ask about screened vs. unscreened topsoil</li>
            <li>Schedule delivery when you can spread the soil immediately to prevent rain washout</li>
            <li>One cubic yard covers about 162 square feet at 2 inches deep or 54 square feet at 6 inches deep</li>
          </ul>

          <h3>Common Coverage by Depth</h3>
          <ul>
            <li><strong>2 inches deep:</strong> 1 cubic yard covers ~162 sq ft</li>
            <li><strong>4 inches deep:</strong> 1 cubic yard covers ~81 sq ft</li>
            <li><strong>6 inches deep:</strong> 1 cubic yard covers ~54 sq ft</li>
            <li><strong>12 inches deep:</strong> 1 cubic yard covers ~27 sq ft</li>
          </ul>

          <h2>Soil Types Explained</h2>
          <p>
            <strong>Topsoil</strong> is the top layer of natural soil, ideal for filling, grading, and establishing lawns.
            <strong>Garden soil</strong> is topsoil enriched with organic matter and nutrients, perfect for flower beds and
            vegetable gardens. <strong>Potting mix</strong> is a lightweight soilless blend designed for containers and
            indoor plants. <strong>Compost</strong> is decomposed organic matter used as a soil amendment to improve
            structure and fertility. Choosing the right type ensures your plants thrive and you get the best value for
            your landscaping investment.
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
            name: "Soil & Topsoil Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/soil-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
