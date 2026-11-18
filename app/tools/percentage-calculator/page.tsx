"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Percentage Calculator - Calculate Percentages Online",
  description:
    "Free Percentage Calculator with multiple modes: find percentage of a number, what percent one number is of another, and percentage increase or decrease.",
  keywords: "percentage calculator, percent calculator, percentage of number, percentage increase, percentage decrease",
};

type Mode = "of" | "is" | "change";

export default function PercentageCalculatorPage() {
  const [mode, setMode] = useState<Mode>("of");

  // Mode: What is X% of Y
  const [percentOf, setPercentOf] = useState({ x: "25", y: "200" });
  const [resultOf, setResultOf] = useState<number | null>(null);

  // Mode: X is what % of Y
  const [percentIs, setPercentIs] = useState({ x: "50", y: "200" });
  const [resultIs, setResultIs] = useState<number | null>(null);

  // Mode: % change from X to Y
  const [percentChange, setPercentChange] = useState({ x: "100", y: "150" });
  const [resultChange, setResultChange] = useState<{ percent: number; direction: string } | null>(null);

  function calculateOf() {
    const x = parseFloat(percentOf.x);
    const y = parseFloat(percentOf.y);
    if (isNaN(x) || isNaN(y)) return;
    setResultOf((x / 100) * y);
  }

  function calculateIs() {
    const x = parseFloat(percentIs.x);
    const y = parseFloat(percentIs.y);
    if (isNaN(x) || isNaN(y) || y === 0) return;
    setResultIs((x / y) * 100);
  }

  function calculateChange() {
    const x = parseFloat(percentChange.x);
    const y = parseFloat(percentChange.y);
    if (isNaN(x) || isNaN(y) || x === 0) return;
    const change = ((y - x) / Math.abs(x)) * 100;
    setResultChange({
      percent: Math.abs(change),
      direction: change >= 0 ? "increase" : "decrease",
    });
  }

  const modes = [
    { key: "of" as Mode, label: "What is X% of Y?" },
    { key: "is" as Mode, label: "X is what % of Y?" },
    { key: "change" as Mode, label: "% Increase / Decrease" },
  ];

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/percentage-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Percentage Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate percentages easily with multiple modes: find a percentage, reverse percentage, and percentage change.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="flex flex-wrap gap-2 mb-6">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === m.key ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-gray-200"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "of" && (
          <div className="tool-card mb-8">
            <h2 className="font-bold text-lg mb-4">What is X% of Y?</h2>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Percentage</label>
                <input
                  type="number"
                  value={percentOf.x}
                  onChange={(e) => setPercentOf({ ...percentOf, x: e.target.value })}
                  className="input-field w-32"
                  placeholder="X"
                />
              </div>
              <span className="text-lg font-bold pb-2">% of</span>
              <div>
                <label className="block text-sm font-medium mb-1">Number</label>
                <input
                  type="number"
                  value={percentOf.y}
                  onChange={(e) => setPercentOf({ ...percentOf, y: e.target.value })}
                  className="input-field w-40"
                  placeholder="Y"
                />
              </div>
              <button onClick={calculateOf} className="btn-primary">Calculate</button>
            </div>
            {resultOf !== null && (
              <div className="result-card mt-4">
                <p className="text-sm text-[var(--muted)]">Result</p>
                <p className="text-2xl font-bold text-[var(--primary)]">
                  {percentOf.x}% of {percentOf.y} = <span className="underline decoration-2">{resultOf.toFixed(4).replace(/\.?0+$/, "")}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {mode === "is" && (
          <div className="tool-card mb-8">
            <h2 className="font-bold text-lg mb-4">X is what % of Y?</h2>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Value</label>
                <input
                  type="number"
                  value={percentIs.x}
                  onChange={(e) => setPercentIs({ ...percentIs, x: e.target.value })}
                  className="input-field w-32"
                  placeholder="X"
                />
              </div>
              <span className="text-lg font-bold pb-2">is what % of</span>
              <div>
                <label className="block text-sm font-medium mb-1">Total</label>
                <input
                  type="number"
                  value={percentIs.y}
                  onChange={(e) => setPercentIs({ ...percentIs, y: e.target.value })}
                  className="input-field w-40"
                  placeholder="Y"
                />
              </div>
              <button onClick={calculateIs} className="btn-primary">Calculate</button>
            </div>
            {resultIs !== null && (
              <div className="result-card mt-4">
                <p className="text-sm text-[var(--muted)]">Result</p>
                <p className="text-2xl font-bold text-[var(--primary)]">
                  {percentIs.x} is <span className="underline decoration-2">{resultIs.toFixed(4).replace(/\.?0+$/, "")}%</span> of {percentIs.y}
                </p>
              </div>
            )}
          </div>
        )}

        {mode === "change" && (
          <div className="tool-card mb-8">
            <h2 className="font-bold text-lg mb-4">Percentage Increase / Decrease</h2>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">From</label>
                <input
                  type="number"
                  value={percentChange.x}
                  onChange={(e) => setPercentChange({ ...percentChange, x: e.target.value })}
                  className="input-field w-36"
                  placeholder="Old value"
                />
              </div>
              <span className="text-lg font-bold pb-2">to</span>
              <div>
                <label className="block text-sm font-medium mb-1">To</label>
                <input
                  type="number"
                  value={percentChange.y}
                  onChange={(e) => setPercentChange({ ...percentChange, y: e.target.value })}
                  className="input-field w-36"
                  placeholder="New value"
                />
              </div>
              <button onClick={calculateChange} className="btn-primary">Calculate</button>
            </div>
            {resultChange && (
              <div className="result-card mt-4">
                <p className="text-sm text-[var(--muted)]">Result</p>
                <p className="text-2xl font-bold">
                  <span className={resultChange.direction === "increase" ? "text-green-700" : "text-red-600"}>
                    {resultChange.percent.toFixed(2)}% {resultChange.direction}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Percentages</h2>
          <p>
            A percentage represents a fraction of 100. For example, 25% means 25 out of 100. Percentage calculations
            are essential in everyday life, from calculating discounts and tips to understanding financial returns.
          </p>

          <h2>Percentage Formulas</h2>
          <ul>
            <li><strong>X% of Y:</strong> (X / 100) x Y</li>
            <li><strong>X is what % of Y:</strong> (X / Y) x 100</li>
            <li><strong>% Change:</strong> ((New - Old) / |Old|) x 100</li>
          </ul>

          <h2>Common Use Cases</h2>
          <ul>
            <li>Calculate discounts during shopping</li>
            <li>Find tax amounts on purchases</li>
            <li>Determine grade percentages in exams</li>
            <li>Calculate profit or loss percentages in business</li>
            <li>Understand investment returns</li>
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
            name: "Percentage Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/percentage-calculator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
