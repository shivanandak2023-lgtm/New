"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Volume Calculator - Calculate Volume of Any Shape",
  description:
    "Free volume calculator for cube, rectangular prism, cylinder, sphere, cone, and pyramid. Get results in cubic feet, cubic inches, cubic meters, and cubic centimeters.",
  keywords:
    "volume calculator, volume of cylinder, volume of sphere, volume of cone, cubic feet calculator, volume formula, 3d shape calculator",
};

type Shape = "cube" | "rectangular" | "cylinder" | "sphere" | "cone" | "pyramid";

const SHAPES: { id: Shape; label: string }[] = [
  { id: "cube", label: "Cube" },
  { id: "rectangular", label: "Rectangular Prism" },
  { id: "cylinder", label: "Cylinder" },
  { id: "sphere", label: "Sphere" },
  { id: "cone", label: "Cone" },
  { id: "pyramid", label: "Pyramid" },
];

const UNIT_LABELS: Record<string, string> = {
  ft: "ft",
  in: "in",
  m: "m",
  cm: "cm",
};

const UNIT_CONVERSIONS: Record<string, number> = {
  ft: 1,
  in: 1 / 1728,
  m: 35.3147,
  cm: 1 / 28316.8,
};

export default function VolumeCalculatorPage() {
  const [shape, setShape] = useState<Shape>("cube");
  const [unit, setUnit] = useState<string>("ft");
  const [side, setSide] = useState<string>("5");
  const [length, setLength] = useState<string>("5");
  const [width, setWidth] = useState<string>("3");
  const [height, setHeight] = useState<string>("4");
  const [radius, setRadius] = useState<string>("3");

  const s = parseFloat(side) || 0;
  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  const r = parseFloat(radius) || 0;

  let volume = 0;
  let formula = "";

  switch (shape) {
    case "cube":
      volume = s ** 3;
      formula = `V = s\u00B3 = ${s}\u00B3 = ${volume.toFixed(4)}`;
      break;
    case "rectangular":
      volume = l * w * h;
      formula = `V = l \u00D7 w \u00D7 h = ${l} \u00D7 ${w} \u00D7 ${h} = ${volume.toFixed(4)}`;
      break;
    case "cylinder":
      volume = Math.PI * r ** 2 * h;
      formula = `V = \u03C0r\u00B2h = \u03C0 \u00D7 ${r}\u00B2 \u00D7 ${h} = ${volume.toFixed(4)}`;
      break;
    case "sphere":
      volume = (4 / 3) * Math.PI * r ** 3;
      formula = `V = (4/3)\u03C0r\u00B3 = (4/3) \u00D7 \u03C0 \u00D7 ${r}\u00B3 = ${volume.toFixed(4)}`;
      break;
    case "cone":
      volume = (1 / 3) * Math.PI * r ** 2 * h;
      formula = `V = (1/3)\u03C0r\u00B2h = (1/3) \u00D7 \u03C0 \u00D7 ${r}\u00B2 \u00D7 ${h} = ${volume.toFixed(4)}`;
      break;
    case "pyramid":
      volume = (1 / 3) * l * w * h;
      formula = `V = (1/3) \u00D7 l \u00D7 w \u00D7 h = (1/3) \u00D7 ${l} \u00D7 ${w} \u00D7 ${h} = ${volume.toFixed(4)}`;
      break;
  }

  const uLabel = UNIT_LABELS[unit];
  const volInFt3 = volume * (UNIT_CONVERSIONS[unit] || 1);

  const conversions = [
    { label: "ft\u00B3", value: volInFt3 },
    { label: "in\u00B3", value: volInFt3 * 1728 },
    { label: "m\u00B3", value: volInFt3 / 35.3147 },
    { label: "cm\u00B3", value: volInFt3 * 28316.8 },
  ];

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/volume-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Volume Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate the volume of common 3D shapes. Select a shape, enter the dimensions, and get results in multiple units.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Select Shape</label>
            <div className="flex flex-wrap gap-2">
              {SHAPES.map((sh) => (
                <button
                  key={sh.id}
                  onClick={() => setShape(sh.id)}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    shape === sh.id
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {sh.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="input-field">
                <option value="ft">Feet (ft)</option>
                <option value="in">Inches (in)</option>
                <option value="m">Meters (m)</option>
                <option value="cm">Centimeters (cm)</option>
              </select>
            </div>

            {shape === "cube" && (
              <div>
                <label className="block text-sm font-medium mb-1">Side Length ({uLabel})</label>
                <input type="number" value={side} onChange={(e) => setSide(e.target.value)} className="input-field" step="0.01" />
              </div>
            )}

            {shape === "rectangular" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Length ({uLabel})</label>
                  <input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="input-field" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Width ({uLabel})</label>
                  <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="input-field" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height ({uLabel})</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="input-field" step="0.01" />
                </div>
              </>
            )}

            {shape === "cylinder" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Radius ({uLabel})</label>
                  <input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} className="input-field" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height ({uLabel})</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="input-field" step="0.01" />
                </div>
              </>
            )}

            {shape === "sphere" && (
              <div>
                <label className="block text-sm font-medium mb-1">Radius ({uLabel})</label>
                <input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} className="input-field" step="0.01" />
              </div>
            )}

            {shape === "cone" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Radius ({uLabel})</label>
                  <input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} className="input-field" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height ({uLabel})</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="input-field" step="0.01" />
                </div>
              </>
            )}

            {shape === "pyramid" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Base Length ({uLabel})</label>
                  <input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="input-field" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Base Width ({uLabel})</label>
                  <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="input-field" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height ({uLabel})</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="input-field" step="0.01" />
                </div>
              </>
            )}
          </div>
        </div>

        {volume > 0 && (
          <div className="mb-8">
            <div className="result-card text-center mb-6">
              <p className="text-sm text-[var(--muted)] mb-1">Volume</p>
              <p className="text-3xl font-bold text-[var(--primary)]">{volume.toFixed(4)} {uLabel}&sup3;</p>
              <p className="text-sm text-[var(--muted)] mt-2 font-mono">{formula}</p>
            </div>

            <div className="tool-card">
              <h2 className="text-lg font-bold mb-4">Unit Conversions</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {conversions.map((c) => (
                    <tr key={c.label} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{c.label}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">
                        {c.value < 0.01 ? c.value.toExponential(4) : c.value.toLocaleString("en-US", { maximumFractionDigits: 4 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Volume Formulas</h2>
          <p>
            Volume measures the amount of three-dimensional space an object occupies. Here are the standard formulas for common shapes:
          </p>
          <ul>
            <li><strong>Cube:</strong> V = s&sup3; (side cubed)</li>
            <li><strong>Rectangular Prism:</strong> V = l &times; w &times; h</li>
            <li><strong>Cylinder:</strong> V = &pi;r&sup2;h</li>
            <li><strong>Sphere:</strong> V = (4/3)&pi;r&sup3;</li>
            <li><strong>Cone:</strong> V = (1/3)&pi;r&sup2;h</li>
            <li><strong>Pyramid:</strong> V = (1/3) &times; base area &times; h</li>
          </ul>

          <h2>Common Volume Conversions</h2>
          <p>
            When working with volume in the US, cubic feet and cubic inches are the most common units. 1 cubic foot equals
            1,728 cubic inches. For metric conversions, 1 cubic foot is approximately 0.0283 cubic meters or 28,316.8 cubic centimeters.
          </p>

          <h3>Practical Applications</h3>
          <p>
            Volume calculations are essential for shipping, construction (concrete and fill material), aquariums, pool sizing,
            storage capacity, and HVAC system design. Knowing the exact volume helps you order the right amount of materials and avoid waste.
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
            name: "Volume Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/volume-calculator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
