"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Pool Volume Calculator - How Many Gallons in My Pool?",
  description:
    "Free swimming pool volume calculator for rectangle, round, oval, and kidney pools. Calculate gallons, liters, chemical amounts, and fill time estimates.",
  keywords:
    "pool volume calculator, pool gallon calculator, how many gallons in my pool, swimming pool calculator, pool water calculator, pool chemical calculator, pool fill time, pool size calculator",
};

type PoolShape = "rectangle" | "round" | "oval" | "kidney";

const GALLONS_PER_CUFT = 7.48052;
const LITERS_PER_GALLON = 3.78541;
const HOSE_GPH = 540;

export default function PoolVolumeCalculatorPage() {
  const [shape, setShape] = useState<PoolShape>("rectangle");
  const [lengthFt, setLengthFt] = useState("30");
  const [widthFt, setWidthFt] = useState("15");
  const [diameterFt, setDiameterFt] = useState("18");
  const [longDiameterFt, setLongDiameterFt] = useState("24");
  const [shortDiameterFt, setShortDiameterFt] = useState("12");
  const [shallowDepthFt, setShallowDepthFt] = useState("3");
  const [deepDepthFt, setDeepDepthFt] = useState("8");
  const [calculated, setCalculated] = useState(false);

  function getVolumeCuFt(): number {
    const shallow = parseFloat(shallowDepthFt) || 0;
    const deep = parseFloat(deepDepthFt) || 0;
    const avgDepth = (shallow + deep) / 2;

    switch (shape) {
      case "rectangle": {
        const l = parseFloat(lengthFt) || 0;
        const w = parseFloat(widthFt) || 0;
        return l * w * avgDepth;
      }
      case "round": {
        const d = parseFloat(diameterFt) || 0;
        const r = d / 2;
        return Math.PI * r * r * avgDepth;
      }
      case "oval": {
        const ld = parseFloat(longDiameterFt) || 0;
        const sd = parseFloat(shortDiameterFt) || 0;
        return Math.PI * (ld / 2) * (sd / 2) * avgDepth;
      }
      case "kidney": {
        const l = parseFloat(lengthFt) || 0;
        const w = parseFloat(widthFt) || 0;
        return l * w * avgDepth * 0.75;
      }
      default:
        return 0;
    }
  }

  function calculate() {
    setCalculated(true);
  }

  const cuFt = getVolumeCuFt();
  const gallons = cuFt * GALLONS_PER_CUFT;
  const liters = gallons * LITERS_PER_GALLON;

  const chlorineOz = (gallons / 10000) * 2;
  const shockLbs = Math.ceil(gallons / 10000);
  const phOz = (gallons / 10000) * 6;
  const fillTimeHrs = gallons / HOSE_GPH;

  const fmt = (n: number, digits = 0) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/pool-volume-calculator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Swimming Pool Volume Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your pool volume in gallons and liters for rectangle, round, oval, and kidney-shaped pools. Get chemical amounts and fill time estimates.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Pool Shape</label>
            <div className="flex flex-wrap gap-2">
              {(["rectangle", "round", "oval", "kidney"] as PoolShape[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setShape(s)}
                  className={`px-4 py-2 rounded text-sm font-medium capitalize ${shape === s ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}
                >
                  {s === "kidney" ? "Kidney / Freeform" : s}
                </button>
              ))}
            </div>
          </div>

          {(shape === "rectangle" || shape === "kidney") && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Length (ft)</label>
                <input type="number" value={lengthFt} onChange={(e) => setLengthFt(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Width (ft)</label>
                <input type="number" value={widthFt} onChange={(e) => setWidthFt(e.target.value)} className="input-field" />
              </div>
            </div>
          )}

          {shape === "round" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Diameter (ft)</label>
                <input type="number" value={diameterFt} onChange={(e) => setDiameterFt(e.target.value)} className="input-field" />
              </div>
            </div>
          )}

          {shape === "oval" && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Long Diameter (ft)</label>
                <input type="number" value={longDiameterFt} onChange={(e) => setLongDiameterFt(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Short Diameter (ft)</label>
                <input type="number" value={shortDiameterFt} onChange={(e) => setShortDiameterFt(e.target.value)} className="input-field" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Shallow End Depth (ft)</label>
              <input type="number" value={shallowDepthFt} onChange={(e) => setShallowDepthFt(e.target.value)} className="input-field" step="0.5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deep End Depth (ft)</label>
              <input type="number" value={deepDepthFt} onChange={(e) => setDeepDepthFt(e.target.value)} className="input-field" step="0.5" />
            </div>
          </div>

          <button onClick={calculate} className="btn-primary">Calculate Pool Volume</button>
        </div>

        {calculated && gallons > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Volume (Gallons)</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(gallons)} gal</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Volume (Liters)</p>
                <p className="text-2xl font-bold text-green-700">{fmt(liters)} L</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Volume (Cubic Feet)</p>
                <p className="text-2xl font-bold">{fmt(cuFt)} ft&sup3;</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Chemical Estimates</h2>
              <p className="text-xs text-[var(--muted)] mb-3">Based on pool volume. Always test water before adding chemicals.</p>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Chemical</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Amount</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Liquid Chlorine (12.5%)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{chlorineOz.toFixed(1)} oz</td>
                    <td className="border border-[var(--card-border)] px-3 py-2">Raise 1 ppm free chlorine</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Shock Treatment</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{shockLbs} lbs</td>
                    <td className="border border-[var(--card-border)] px-3 py-2">Calcium hypochlorite shock</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">pH Decreaser (dry acid)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{phOz.toFixed(1)} oz</td>
                    <td className="border border-[var(--card-border)] px-3 py-2">Lower pH by 0.2</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Fill Time Estimate</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="result-card text-center">
                  <p className="text-sm text-[var(--muted)] mb-1">Garden Hose (~{HOSE_GPH} gal/hr)</p>
                  <p className="text-xl font-bold text-[var(--primary)]">{fillTimeHrs.toFixed(1)} hours</p>
                  <p className="text-xs text-[var(--muted)]">({(fillTimeHrs / 24).toFixed(1)} days)</p>
                </div>
                <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                  <p className="text-sm text-[var(--muted)] mb-1">Water Cost Estimate</p>
                  <p className="text-xl font-bold text-green-700">${((gallons / 748) * 5).toFixed(0)}</p>
                  <p className="text-xs text-[var(--muted)]">~$5 per 748 gallons avg</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Swimming Pool Volume</h2>
          <p>
            Knowing your pool volume in gallons is essential for proper chemical treatment, heating calculations, and
            equipment sizing. Whether you are a new pool owner or a seasoned professional, our pool volume calculator
            provides accurate gallon estimates for rectangular, round, oval, and kidney-shaped swimming pools commonly
            found across the United States.
          </p>

          <h2>Pool Volume Formulas</h2>
          <p>
            All pool volume calculations start with finding the cubic footage, then converting to gallons using the
            factor of 7.48 gallons per cubic foot.
          </p>
          <ul>
            <li><strong>Rectangle:</strong> Length x Width x Average Depth x 7.48 = Gallons</li>
            <li><strong>Round:</strong> Diameter x Diameter x Average Depth x 5.9 = Gallons</li>
            <li><strong>Oval:</strong> Long Diameter x Short Diameter x Average Depth x 5.9 = Gallons</li>
            <li><strong>Kidney/Freeform:</strong> Length x Width x Average Depth x 7.48 x 0.75 = Gallons</li>
          </ul>

          <h2>How to Measure Average Depth</h2>
          <p>
            Most residential pools have a shallow end and a deep end. The simplest way to calculate average depth is
            to add the shallow end depth and the deep end depth, then divide by two. For example, a pool with a 3-foot
            shallow end and an 8-foot deep end has an average depth of 5.5 feet. For pools with a flat bottom (like
            many above-ground pools), simply enter the same depth for both shallow and deep ends.
          </p>

          <h2>Pool Chemical Dosing by Volume</h2>
          <p>
            Accurate pool volume is critical for safe chemical dosing. Too little chemical leaves your pool unsanitary,
            while too much can irritate skin and damage equipment. The ideal free chlorine level is 1-3 ppm (parts per
            million). To raise free chlorine by 1 ppm, you need approximately 2 ounces of 12.5% liquid chlorine per
            10,000 gallons. Always test your water with a reliable test kit before adding chemicals.
          </p>

          <h2>How Long Does It Take to Fill a Pool?</h2>
          <p>
            A standard garden hose delivers about 540 gallons per hour (9 gallons per minute). At this rate, filling
            a typical 15,000-gallon pool takes about 28 hours. Many homeowners use two hoses to cut fill time in half.
            Check with your local water utility about fill rates and costs, as some municipalities charge higher rates
            for pool filling. Some areas also require a fill permit during drought restrictions.
          </p>

          <h2>Common Pool Sizes and Volumes</h2>
          <ul>
            <li><strong>12x24 ft (avg 5 ft deep):</strong> ~10,800 gallons</li>
            <li><strong>15x30 ft (avg 5 ft deep):</strong> ~16,800 gallons</li>
            <li><strong>16x32 ft (avg 5.5 ft deep):</strong> ~19,700 gallons</li>
            <li><strong>18x36 ft (avg 5.5 ft deep):</strong> ~26,700 gallons</li>
            <li><strong>20x40 ft (avg 5.5 ft deep):</strong> ~33,000 gallons</li>
            <li><strong>18 ft round (4 ft deep):</strong> ~7,600 gallons</li>
            <li><strong>24 ft round (4 ft deep):</strong> ~13,500 gallons</li>
          </ul>

          <h3>Tips for Pool Owners</h3>
          <ul>
            <li>Record your pool volume and keep it accessible for chemical calculations</li>
            <li>Recheck volume if you have renovated or changed pool depth</li>
            <li>Water expands when heated, so keep water level 1 inch below the skimmer for warm weather</li>
            <li>A pool cover can reduce evaporation by up to 95%, saving thousands of gallons per season</li>
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
            name: "Swimming Pool Volume Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/pool-volume-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
