"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Area Calculator - Calculate Area of Any Shape",
  description:
    "Free area calculator for rectangle, circle, triangle, trapezoid, ellipse, and parallelogram. Get results in square feet, square inches, square meters, and square centimeters.",
  keywords:
    "area calculator, area of circle, area of triangle, square feet calculator, area formula, rectangle area, trapezoid area calculator",
};

type Shape = "rectangle" | "circle" | "triangle" | "trapezoid" | "ellipse" | "parallelogram";

const SHAPES: { id: Shape; label: string }[] = [
  { id: "rectangle", label: "Rectangle" },
  { id: "circle", label: "Circle" },
  { id: "triangle", label: "Triangle" },
  { id: "trapezoid", label: "Trapezoid" },
  { id: "ellipse", label: "Ellipse" },
  { id: "parallelogram", label: "Parallelogram" },
];

const UNIT_LABELS: Record<string, string> = { ft: "ft", in: "in", m: "m", cm: "cm" };

const UNIT_TO_FT2: Record<string, number> = {
  ft: 1,
  in: 1 / 144,
  m: 10.7639,
  cm: 1 / 929.03,
};

export default function AreaCalculatorPage() {
  const [shape, setShape] = useState<Shape>("rectangle");
  const [unit, setUnit] = useState<string>("ft");
  const [length, setLength] = useState<string>("10");
  const [width, setWidth] = useState<string>("6");
  const [radius, setRadius] = useState<string>("5");
  const [base, setBase] = useState<string>("8");
  const [height, setHeight] = useState<string>("5");
  const [sideA, setSideA] = useState<string>("6");
  const [sideB, setSideB] = useState<string>("10");
  const [radiusA, setRadiusA] = useState<string>("5");
  const [radiusB, setRadiusB] = useState<string>("3");

  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const r = parseFloat(radius) || 0;
  const b = parseFloat(base) || 0;
  const h = parseFloat(height) || 0;
  const a1 = parseFloat(sideA) || 0;
  const a2 = parseFloat(sideB) || 0;
  const rA = parseFloat(radiusA) || 0;
  const rB = parseFloat(radiusB) || 0;

  let area = 0;
  let formula = "";

  switch (shape) {
    case "rectangle":
      area = l * w;
      formula = `A = l \u00D7 w = ${l} \u00D7 ${w} = ${area.toFixed(4)}`;
      break;
    case "circle":
      area = Math.PI * r ** 2;
      formula = `A = \u03C0r\u00B2 = \u03C0 \u00D7 ${r}\u00B2 = ${area.toFixed(4)}`;
      break;
    case "triangle":
      area = 0.5 * b * h;
      formula = `A = \u00BD \u00D7 b \u00D7 h = \u00BD \u00D7 ${b} \u00D7 ${h} = ${area.toFixed(4)}`;
      break;
    case "trapezoid":
      area = 0.5 * (a1 + a2) * h;
      formula = `A = \u00BD(a + b) \u00D7 h = \u00BD(${a1} + ${a2}) \u00D7 ${h} = ${area.toFixed(4)}`;
      break;
    case "ellipse":
      area = Math.PI * rA * rB;
      formula = `A = \u03C0 \u00D7 a \u00D7 b = \u03C0 \u00D7 ${rA} \u00D7 ${rB} = ${area.toFixed(4)}`;
      break;
    case "parallelogram":
      area = b * h;
      formula = `A = b \u00D7 h = ${b} \u00D7 ${h} = ${area.toFixed(4)}`;
      break;
  }

  const uLabel = UNIT_LABELS[unit];
  const areaInFt2 = area * (UNIT_TO_FT2[unit] || 1);

  const conversions = [
    { label: "ft\u00B2", value: areaInFt2 },
    { label: "in\u00B2", value: areaInFt2 * 144 },
    { label: "m\u00B2", value: areaInFt2 / 10.7639 },
    { label: "cm\u00B2", value: areaInFt2 * 929.03 },
  ];

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/area-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Area Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate the area of common 2D shapes. Select a shape, enter the dimensions, and get results in multiple units including square feet and square meters.
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

            {shape === "rectangle" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Length ({uLabel})</label>
                  <input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="input-field" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Width ({uLabel})</label>
                  <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="input-field" step="0.01" />
                </div>
              </>
            )}

            {shape === "circle" && (
              <div>
                <label className="block text-sm font-medium mb-1">Radius ({uLabel})</label>
                <input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} className="input-field" step="0.01" />
              </div>
            )}

            {shape === "triangle" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Base ({uLabel})</label>
                  <input type="number" value={base} onChange={(e) => setBase(e.target.value)} className="input-field" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height ({uLabel})</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="input-field" step="0.01" />
                </div>
              </>
            )}

            {shape === "trapezoid" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Side A ({uLabel})</label>
                  <input type="number" value={sideA} onChange={(e) => setSideA(e.target.value)} className="input-field" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Side B ({uLabel})</label>
                  <input type="number" value={sideB} onChange={(e) => setSideB(e.target.value)} className="input-field" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height ({uLabel})</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="input-field" step="0.01" />
                </div>
              </>
            )}

            {shape === "ellipse" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Semi-Major Axis a ({uLabel})</label>
                  <input type="number" value={radiusA} onChange={(e) => setRadiusA(e.target.value)} className="input-field" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Semi-Minor Axis b ({uLabel})</label>
                  <input type="number" value={radiusB} onChange={(e) => setRadiusB(e.target.value)} className="input-field" step="0.01" />
                </div>
              </>
            )}

            {shape === "parallelogram" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Base ({uLabel})</label>
                  <input type="number" value={base} onChange={(e) => setBase(e.target.value)} className="input-field" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height ({uLabel})</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="input-field" step="0.01" />
                </div>
              </>
            )}
          </div>
        </div>

        {area > 0 && (
          <div className="mb-8">
            <div className="result-card text-center mb-6">
              <p className="text-sm text-[var(--muted)] mb-1">Area</p>
              <p className="text-3xl font-bold text-[var(--primary)]">{area.toFixed(4)} {uLabel}&sup2;</p>
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
          <h2>Area Formulas</h2>
          <p>
            Area measures the amount of two-dimensional space a shape covers. Here are the standard formulas:
          </p>
          <ul>
            <li><strong>Rectangle:</strong> A = length &times; width</li>
            <li><strong>Circle:</strong> A = &pi;r&sup2;</li>
            <li><strong>Triangle:</strong> A = &frac12; &times; base &times; height</li>
            <li><strong>Trapezoid:</strong> A = &frac12;(a + b) &times; height</li>
            <li><strong>Ellipse:</strong> A = &pi; &times; a &times; b</li>
            <li><strong>Parallelogram:</strong> A = base &times; height</li>
          </ul>

          <h2>Square Footage in Real Estate</h2>
          <p>
            In the United States, square footage (ft&sup2;) is the standard unit for measuring floor space in homes and
            commercial properties. The average American home is about 2,300 square feet. Knowing how to calculate area is
            essential for flooring, painting, landscaping, and property valuation.
          </p>

          <h3>Common Area Conversions</h3>
          <p>
            1 square foot = 144 square inches = 0.0929 square meters. 1 acre = 43,560 square feet. These conversions
            are useful for land measurements, construction projects, and interior design planning.
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
            name: "Area Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/area-calculator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
