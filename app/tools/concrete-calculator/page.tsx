"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Concrete Calculator - Cubic Yards, Bags & Cost Estimator",
  description:
    "Free concrete calculator to estimate cubic yards, number of bags, and cost for slabs, columns, walls, and stairs. Calculate how much concrete you need for your project.",
  keywords:
    "concrete calculator, cubic yard calculator, concrete bags needed, cement calculator, how much concrete do i need, concrete slab calculator, concrete cost",
};

type ShapeType = "slab" | "column" | "wall" | "stairs";

interface Section {
  id: number;
  shape: ShapeType;
  name: string;
  lengthFt: string;
  widthFt: string;
  thicknessIn: string;
  diameterFt: string;
  heightFt: string;
  numSteps: string;
  stepRiseIn: string;
  stepRunIn: string;
  stepWidthFt: string;
  cubicFeet: number;
}

function createSection(id: number): Section {
  return {
    id,
    shape: "slab",
    name: `Section ${id}`,
    lengthFt: "10",
    widthFt: "10",
    thicknessIn: "4",
    diameterFt: "2",
    heightFt: "4",
    numSteps: "5",
    stepRiseIn: "7",
    stepRunIn: "11",
    stepWidthFt: "3",
    cubicFeet: 0,
  };
}

export default function ConcreteCalculatorPage() {
  const [sections, setSections] = useState<Section[]>([createSection(1)]);
  const [costPerYard, setCostPerYard] = useState<string>("150");
  const [calculated, setCalculated] = useState(false);

  function calcSection(s: Section): number {
    switch (s.shape) {
      case "slab": {
        const l = parseFloat(s.lengthFt) || 0;
        const w = parseFloat(s.widthFt) || 0;
        const t = (parseFloat(s.thicknessIn) || 0) / 12;
        return l * w * t;
      }
      case "column": {
        const d = parseFloat(s.diameterFt) || 0;
        const h = parseFloat(s.heightFt) || 0;
        return Math.PI * Math.pow(d / 2, 2) * h;
      }
      case "wall": {
        const l = parseFloat(s.lengthFt) || 0;
        const h = parseFloat(s.heightFt) || 0;
        const t = (parseFloat(s.thicknessIn) || 0) / 12;
        return l * h * t;
      }
      case "stairs": {
        const n = parseInt(s.numSteps) || 0;
        const rise = (parseFloat(s.stepRiseIn) || 0) / 12;
        const run = (parseFloat(s.stepRunIn) || 0) / 12;
        const w = parseFloat(s.stepWidthFt) || 0;
        let total = 0;
        for (let i = 1; i <= n; i++) {
          total += i * rise * run * w;
        }
        return total;
      }
      default:
        return 0;
    }
  }

  function calculate() {
    const updated = sections.map((s) => ({ ...s, cubicFeet: calcSection(s) }));
    setSections(updated);
    setCalculated(true);
  }

  function updateSection(id: number, field: string, value: string) {
    setSections(sections.map((s) => s.id === id ? { ...s, [field]: value } : s));
  }

  function addSection() {
    setSections([...sections, createSection(sections.length + 1)]);
  }

  function removeSection(id: number) {
    if (sections.length > 1) {
      setSections(sections.filter((s) => s.id !== id));
    }
  }

  const totalCubicFeet = sections.reduce((sum, s) => sum + s.cubicFeet, 0);
  const totalCubicYards = totalCubicFeet / 27;
  const bags80lb = Math.ceil(totalCubicFeet / 0.6);
  const bags60lb = Math.ceil(totalCubicFeet / 0.45);
  const cost = totalCubicYards * (parseFloat(costPerYard) || 150);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/concrete-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Concrete Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate how much concrete you need in cubic yards and bags. Supports slabs, columns/cylinders, walls, and stairs. Get cost estimates for your project.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {sections.map((section) => (
          <div key={section.id} className="tool-card mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={section.name}
                  onChange={(e) => updateSection(section.id, "name", e.target.value)}
                  className="input-field w-40 text-sm font-semibold"
                />
                <select
                  value={section.shape}
                  onChange={(e) => updateSection(section.id, "shape", e.target.value)}
                  className="input-field w-40 text-sm"
                >
                  <option value="slab">Slab</option>
                  <option value="column">Column / Cylinder</option>
                  <option value="wall">Wall</option>
                  <option value="stairs">Stairs</option>
                </select>
              </div>
              {sections.length > 1 && (
                <button onClick={() => removeSection(section.id)} className="text-red-500 text-sm hover:underline">
                  Remove
                </button>
              )}
            </div>

            {section.shape === "slab" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Length (ft)</label>
                  <input type="number" value={section.lengthFt} onChange={(e) => updateSection(section.id, "lengthFt", e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Width (ft)</label>
                  <input type="number" value={section.widthFt} onChange={(e) => updateSection(section.id, "widthFt", e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thickness (in)</label>
                  <input type="number" value={section.thicknessIn} onChange={(e) => updateSection(section.id, "thicknessIn", e.target.value)} className="input-field" />
                </div>
              </div>
            )}

            {section.shape === "column" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Diameter (ft)</label>
                  <input type="number" value={section.diameterFt} onChange={(e) => updateSection(section.id, "diameterFt", e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height (ft)</label>
                  <input type="number" value={section.heightFt} onChange={(e) => updateSection(section.id, "heightFt", e.target.value)} className="input-field" />
                </div>
              </div>
            )}

            {section.shape === "wall" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Length (ft)</label>
                  <input type="number" value={section.lengthFt} onChange={(e) => updateSection(section.id, "lengthFt", e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height (ft)</label>
                  <input type="number" value={section.heightFt} onChange={(e) => updateSection(section.id, "heightFt", e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thickness (in)</label>
                  <input type="number" value={section.thicknessIn} onChange={(e) => updateSection(section.id, "thicknessIn", e.target.value)} className="input-field" />
                </div>
              </div>
            )}

            {section.shape === "stairs" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Steps</label>
                  <input type="number" value={section.numSteps} onChange={(e) => updateSection(section.id, "numSteps", e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Step Rise (in)</label>
                  <input type="number" value={section.stepRiseIn} onChange={(e) => updateSection(section.id, "stepRiseIn", e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Step Run (in)</label>
                  <input type="number" value={section.stepRunIn} onChange={(e) => updateSection(section.id, "stepRunIn", e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Step Width (ft)</label>
                  <input type="number" value={section.stepWidthFt} onChange={(e) => updateSection(section.id, "stepWidthFt", e.target.value)} className="input-field" />
                </div>
              </div>
            )}

            {calculated && section.cubicFeet > 0 && (
              <p className="mt-3 text-sm font-semibold text-[var(--primary)]">
                {section.name}: {section.cubicFeet.toFixed(2)} cu ft ({(section.cubicFeet / 27).toFixed(2)} cu yd)
              </p>
            )}
          </div>
        ))}

        <div className="flex gap-4 mb-6">
          <button onClick={addSection} className="text-sm text-[var(--primary)] hover:underline">
            + Add Another Section
          </button>
        </div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Cost per Cubic Yard ($)</label>
              <input
                type="number"
                value={costPerYard}
                onChange={(e) => setCostPerYard(e.target.value)}
                className="input-field"
                placeholder="e.g., 150"
              />
              <p className="text-xs text-[var(--muted)] mt-1">Average ready-mix concrete: $120-$200/yard</p>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Concrete
          </button>
        </div>

        {calculated && totalCubicFeet > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Cubic Feet</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{totalCubicFeet.toFixed(2)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Cubic Yards</p>
                <p className="text-2xl font-bold text-green-700">{totalCubicYards.toFixed(2)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">80 lb Bags</p>
                <p className="text-2xl font-bold">{bags80lb}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">60 lb Bags</p>
                <p className="text-2xl font-bold">{bags60lb}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Cost Estimate</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Cubic Yards</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{totalCubicYards.toFixed(2)} yd&sup3;</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Cost per Cubic Yard</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(parseFloat(costPerYard) || 150)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">80 lb Bags ({bags80lb} bags x ~$6.50)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(bags80lb * 6.5)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Ready-Mix Estimated Cost</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(cost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {sections.length > 1 && (
              <div className="tool-card mb-6">
                <h2 className="text-lg font-bold mb-4">Section Breakdown</h2>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Section</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Type</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Cu Ft</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Cu Yd</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections.map((s) => (
                      <tr key={s.id} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{s.name}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 capitalize">{s.shape}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{s.cubicFeet.toFixed(2)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{(s.cubicFeet / 27).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold" colSpan={2}>Total</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold">{totalCubicFeet.toFixed(2)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold">{totalCubicYards.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Much Concrete Do I Need?</h2>
          <p>
            This concrete calculator helps you estimate the amount of concrete needed for your project. Enter your
            dimensions and the calculator will determine cubic feet, cubic yards, number of bags, and estimated cost.
          </p>

          <h2>Concrete Calculation Formulas</h2>
          <ul>
            <li><strong>Slab:</strong> Length (ft) x Width (ft) x Thickness (ft) = Cubic Feet</li>
            <li><strong>Column:</strong> &pi; x (Diameter/2)&sup2; x Height = Cubic Feet</li>
            <li><strong>Wall:</strong> Length (ft) x Height (ft) x Thickness (ft) = Cubic Feet</li>
            <li><strong>Cubic Yards:</strong> Cubic Feet / 27</li>
          </ul>

          <h2>Concrete Bag Coverage</h2>
          <ul>
            <li>One 80 lb bag covers approximately 0.6 cubic feet</li>
            <li>One 60 lb bag covers approximately 0.45 cubic feet</li>
            <li>One cubic yard equals 27 cubic feet</li>
            <li>Add 5-10% extra for waste and spillage</li>
          </ul>

          <h3>Concrete Cost Guide</h3>
          <p>
            Ready-mix concrete typically costs $120 to $200 per cubic yard, depending on your location and the type
            of mix. Pre-mixed bags from home improvement stores cost about $5-$7 per 80 lb bag. For small projects,
            bags may be more economical; for larger projects, order ready-mix delivery.
          </p>

          <h3>Tips for Your Concrete Project</h3>
          <ul>
            <li>Always order 5-10% more concrete than calculated</li>
            <li>Standard slab thickness is 4 inches for patios and walkways</li>
            <li>Driveways typically require 5-6 inches of thickness</li>
            <li>Concrete sets within 24-48 hours but takes 28 days to fully cure</li>
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
            name: "Concrete Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/concrete-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
