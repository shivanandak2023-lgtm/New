"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Stair Calculator - Calculate Risers, Treads & Stringer Length",
  description:
    "Free stair calculator to determine number of risers, treads, total run, stringer length, and angle of incline with building code compliance check and SVG diagram.",
  keywords:
    "stair calculator, staircase calculator, how to calculate stairs, stair riser calculator, stair tread calculator, stringer length calculator, stair building code, stair angle calculator",
};

export default function StairCalculatorPage() {
  const [totalRiseIn, setTotalRiseIn] = useState("108");
  const [riserHeightIn, setRiserHeightIn] = useState("7.5");
  const [treadDepthIn, setTreadDepthIn] = useState("10");
  const [stairWidthIn, setStairWidthIn] = useState("36");
  const [calculated, setCalculated] = useState(false);

  function calculate() {
    setCalculated(true);
  }

  const totalRise = parseFloat(totalRiseIn) || 0;
  const riserHeight = parseFloat(riserHeightIn) || 7.5;
  const treadDepth = parseFloat(treadDepthIn) || 10;
  const stairWidth = parseFloat(stairWidthIn) || 36;

  const numRisers = Math.round(totalRise / riserHeight);
  const actualRiserHeight = numRisers > 0 ? totalRise / numRisers : 0;
  const numTreads = Math.max(numRisers - 1, 0);
  const totalRunIn = numTreads * treadDepth;
  const stringerLength = Math.sqrt(totalRise * totalRise + totalRunIn * totalRunIn);
  const angleRad = totalRunIn > 0 ? Math.atan(totalRise / totalRunIn) : 0;
  const angleDeg = angleRad * (180 / Math.PI);

  const riserOk = actualRiserHeight >= 7 && actualRiserHeight <= 7.75;
  const treadOk = treadDepth >= 10 && treadDepth <= 11;
  const angleOk = angleDeg >= 30 && angleDeg <= 37;

  const toFeetIn = (inches: number) => {
    const ft = Math.floor(inches / 12);
    const rem = (inches % 12).toFixed(1);
    return `${ft}' ${rem}"`;
  };

  const svgW = 400;
  const svgH = 300;
  const margin = 30;
  const drawW = svgW - 2 * margin;
  const drawH = svgH - 2 * margin;

  const stepsToShow = Math.min(numTreads, 15);
  const stepW = stepsToShow > 0 ? drawW / stepsToShow : drawW;
  const stepH = stepsToShow > 0 ? drawH / stepsToShow : drawH;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/stair-calculator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Stair Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate the number of risers, treads, total run, stringer length, and angle of incline for your staircase with building code compliance checking.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Total Rise (inches)</label>
              <input type="number" value={totalRiseIn} onChange={(e) => setTotalRiseIn(e.target.value)} className="input-field" step="0.5" />
              <p className="text-xs text-[var(--muted)] mt-1">Floor-to-floor height</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Riser Height (inches)</label>
              <input type="number" value={riserHeightIn} onChange={(e) => setRiserHeightIn(e.target.value)} className="input-field" step="0.25" />
              <p className="text-xs text-[var(--muted)] mt-1">Typical: 7&quot; - 8&quot; (code: 7&quot; - 7.75&quot;)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Tread Depth (inches)</label>
              <input type="number" value={treadDepthIn} onChange={(e) => setTreadDepthIn(e.target.value)} className="input-field" step="0.25" />
              <p className="text-xs text-[var(--muted)] mt-1">Typical: 10&quot; - 11&quot; (code min: 10&quot;)</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stair Width (inches)</label>
              <input type="number" value={stairWidthIn} onChange={(e) => setStairWidthIn(e.target.value)} className="input-field" step="1" />
              <p className="text-xs text-[var(--muted)] mt-1">Code minimum: 36&quot;</p>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary">Calculate Stairs</button>
        </div>

        {calculated && numRisers > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Risers</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{numRisers}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Treads</p>
                <p className="text-2xl font-bold text-green-700">{numTreads}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Run</p>
                <p className="text-2xl font-bold">{toFeetIn(totalRunIn)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Angle</p>
                <p className="text-2xl font-bold">{angleDeg.toFixed(1)}&deg;</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Stair Details</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Measurement</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Value</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-center">Code Check</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Number of Risers</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{numRisers}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-center">-</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Actual Riser Height</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{actualRiserHeight.toFixed(2)}&quot;</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-center">
                      <span className={riserOk ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                        {riserOk ? "PASS" : "FAIL"} (7&quot;-7.75&quot;)
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Tread Depth</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{treadDepth.toFixed(2)}&quot;</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-center">
                      <span className={treadOk ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                        {treadOk ? "PASS" : "FAIL"} (10&quot;-11&quot;)
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Number of Treads</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{numTreads}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-center">-</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Run (horizontal)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{toFeetIn(totalRunIn)} ({totalRunIn.toFixed(1)}&quot;)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-center">-</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Stringer Length</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{toFeetIn(stringerLength)} ({stringerLength.toFixed(1)}&quot;)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-center">-</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Angle of Incline</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{angleDeg.toFixed(1)}&deg;</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-center">
                      <span className={angleOk ? "text-green-600 font-bold" : "text-orange-500 font-bold"}>
                        {angleOk ? "IDEAL" : angleDeg < 30 ? "SHALLOW" : "STEEP"}
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Stair Width</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{stairWidth}&quot;</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-center">
                      <span className={stairWidth >= 36 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                        {stairWidth >= 36 ? "PASS" : "FAIL"} (min 36&quot;)
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Min Headroom (6&apos;8&quot;)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">80&quot;</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-center text-[var(--muted)]">Check on site</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Side View Diagram</h2>
              <div className="flex justify-center">
                <svg
                  viewBox={`0 0 ${svgW} ${svgH}`}
                  className="w-full max-w-lg border border-[var(--card-border)] rounded bg-white"
                >
                  {Array.from({ length: stepsToShow }).map((_, i) => {
                    const x = margin + i * stepW;
                    const y = svgH - margin - (i + 1) * stepH;
                    return (
                      <g key={i}>
                        <rect
                          x={x}
                          y={y}
                          width={stepW}
                          height={stepH}
                          fill="#dbeafe"
                          stroke="#3b82f6"
                          strokeWidth="1.5"
                        />
                        {stepsToShow <= 10 && (
                          <text
                            x={x + stepW / 2}
                            y={y + stepH / 2 + 4}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#1e40af"
                          >
                            {i + 1}
                          </text>
                        )}
                      </g>
                    );
                  })}
                  <line
                    x1={margin}
                    y1={svgH - margin}
                    x2={margin + stepsToShow * stepW}
                    y2={svgH - margin - stepsToShow * stepH}
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="6,3"
                  />
                  <text x={margin} y={svgH - margin + 16} fontSize="11" fill="#666">
                    Run: {toFeetIn(totalRunIn)}
                  </text>
                  <text x={svgW - margin - 2} y={svgH / 2} fontSize="11" fill="#666" textAnchor="end">
                    Rise: {toFeetIn(totalRise)}
                  </text>
                  <text x={svgW / 2} y={16} fontSize="11" fill="#ef4444" textAnchor="middle">
                    Stringer: {toFeetIn(stringerLength)} @ {angleDeg.toFixed(1)}&deg;
                  </text>
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Stairs</h2>
          <p>
            Building a staircase requires precise calculations to ensure safety, comfort, and building code compliance.
            Our stair calculator takes the total rise (floor-to-floor height) and your preferred riser height to
            determine the number of steps, total run, stringer length, and angle of incline. Whether you are building
            interior stairs, deck stairs, or basement stairs, accurate measurements are critical for a safe and
            comfortable staircase.
          </p>

          <h2>Stair Calculation Formulas</h2>
          <p>
            The key formulas for stair building are:
          </p>
          <ul>
            <li><strong>Number of Risers:</strong> Total Rise / Riser Height (round to nearest whole number)</li>
            <li><strong>Number of Treads:</strong> Number of Risers - 1 (top floor acts as final tread)</li>
            <li><strong>Total Run:</strong> Number of Treads x Tread Depth</li>
            <li><strong>Stringer Length:</strong> Square root of (Total Rise&sup2; + Total Run&sup2;)</li>
            <li><strong>Angle:</strong> arctangent(Total Rise / Total Run)</li>
          </ul>

          <h2>IRC Building Code Requirements</h2>
          <p>
            The International Residential Code (IRC), adopted by most US states, sets strict requirements for
            residential stairs. These standards exist to prevent falls, which are one of the leading causes of home
            injuries in the United States.
          </p>
          <ul>
            <li><strong>Maximum Riser Height:</strong> 7-3/4 inches (7.75&quot;)</li>
            <li><strong>Minimum Tread Depth:</strong> 10 inches</li>
            <li><strong>Minimum Stair Width:</strong> 36 inches</li>
            <li><strong>Minimum Headroom:</strong> 6 feet 8 inches (80&quot;)</li>
            <li><strong>Maximum Riser Variation:</strong> 3/8 inch between largest and smallest riser</li>
            <li><strong>Handrail Height:</strong> 34-38 inches measured from stair nosing</li>
          </ul>

          <h2>Comfortable Stair Dimensions</h2>
          <p>
            While building codes set minimums and maximums, the most comfortable stairs follow the rule of thumb:
            <strong> Riser + Tread = 17 to 18 inches</strong>. A 7.5-inch riser with a 10.5-inch tread (totaling 18
            inches) is widely considered the ideal combination for residential stairs. The ideal angle of incline falls
            between 30 and 37 degrees. Steeper stairs feel uncomfortable climbing, while shallower stairs waste floor
            space.
          </p>

          <h2>Stringer Sizing</h2>
          <p>
            Stair stringers are the diagonal structural members that support the treads and risers. The stringer length
            is calculated using the Pythagorean theorem: the square root of the total rise squared plus the total run
            squared. For standard residential stairs, 2x12 lumber is used for stringers. You need a minimum of three
            stringers for stairs wider than 36 inches. The cut stringer should have at least 3.5 inches of solid wood
            remaining after the tread and riser cuts for adequate structural support.
          </p>

          <h2>Common Stair Configurations</h2>
          <ul>
            <li><strong>Straight stairs:</strong> Single flight, simplest to build, requires most horizontal space</li>
            <li><strong>L-shaped stairs:</strong> 90-degree turn with landing, fits corners well</li>
            <li><strong>U-shaped stairs:</strong> 180-degree turn with landing, compact footprint</li>
            <li><strong>Winder stairs:</strong> Triangular treads at the turn, saves space but less safe</li>
          </ul>

          <h3>Tips for Building Stairs</h3>
          <ul>
            <li>Always measure the actual floor-to-floor height, not the planned height</li>
            <li>Keep all risers within 3/8 inch of each other for safety</li>
            <li>Use a framing square with stair gauges for consistent stringer cuts</li>
            <li>Check local building codes as requirements may exceed IRC minimums</li>
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
            name: "Stair Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/stair-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
