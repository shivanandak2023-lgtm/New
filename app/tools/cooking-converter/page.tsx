"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Cooking Measurement Converter - Cups, Tablespoons, ML & More",
  description:
    "Free cooking converter to convert between cups, tablespoons, teaspoons, fluid ounces, milliliters, liters, pints, quarts, gallons, and grams.",
  keywords:
    "cooking converter, measurement converter, cups to tablespoons, cups to ml, teaspoons to tablespoons, cooking measurements, kitchen converter, recipe converter",
};

const UNITS = [
  { id: "tsp", name: "Teaspoons", abbr: "tsp" },
  { id: "tbsp", name: "Tablespoons", abbr: "tbsp" },
  { id: "fl_oz", name: "Fluid Ounces", abbr: "fl oz" },
  { id: "cup", name: "Cups", abbr: "cup" },
  { id: "pint", name: "Pints", abbr: "pt" },
  { id: "quart", name: "Quarts", abbr: "qt" },
  { id: "gallon", name: "Gallons", abbr: "gal" },
  { id: "ml", name: "Milliliters", abbr: "mL" },
  { id: "liter", name: "Liters", abbr: "L" },
  { id: "gram", name: "Grams (water)", abbr: "g" },
];

// Conversion factors to milliliters
const TO_ML: Record<string, number> = {
  tsp: 4.929,
  tbsp: 14.787,
  fl_oz: 29.574,
  cup: 236.588,
  pint: 473.176,
  quart: 946.353,
  gallon: 3785.41,
  ml: 1,
  liter: 1000,
  gram: 1, // 1g water = 1mL
};

export default function CookingConverterPage() {
  const [amount, setAmount] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("cup");
  const [toUnit, setToUnit] = useState<string>("ml");
  const [result, setResult] = useState<{
    converted: number;
    fromName: string;
    toName: string;
  } | null>(null);

  function convert() {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    const mlValue = val * TO_ML[fromUnit];
    const converted = mlValue / TO_ML[toUnit];

    const fromName = UNITS.find((u) => u.id === fromUnit)?.name || fromUnit;
    const toName = UNITS.find((u) => u.id === toUnit)?.name || toUnit;

    setResult({ converted, fromName, toName });
  }

  function swapUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult(null);
  }

  const fmtNum = (n: number) => {
    if (n >= 1000) return n.toFixed(1);
    if (n >= 1) return n.toFixed(3);
    return n.toFixed(4);
  };

  const getAbbr = (id: string) => UNITS.find((u) => u.id === id)?.abbr || id;

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/cooking-converter`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Cooking Measurement Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert between common cooking measurements including cups, tablespoons, teaspoons, fluid ounces, milliliters, liters, pints, quarts, gallons, and grams.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                step="0.25"
                placeholder="e.g., 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="input-field"
              >
                {UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.abbr})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="input-field"
              >
                {UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.abbr})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button onClick={convert} className="btn-primary">
              Convert
            </button>
            <button
              onClick={swapUnits}
              className="px-4 py-2 border border-[var(--card-border)] rounded-lg hover:bg-[var(--muted-bg)] transition-colors"
            >
              Swap
            </button>
          </div>
        </div>

        {result && (
          <div className="mb-8">
            <div className="result-card text-center mb-6">
              <p className="text-sm text-[var(--muted)] mb-1">Result</p>
              <p className="text-2xl font-bold text-[var(--primary)]">
                {amount} {getAbbr(fromUnit)} = {fmtNum(result.converted)} {getAbbr(toUnit)}
              </p>
            </div>
          </div>
        )}

        {/* Quick Reference Card */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Quick Reference - Common Conversions</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--muted-bg)]">
                <th className="border border-[var(--card-border)] px-3 py-2 text-left">Measurement</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-right">Equivalent</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-[var(--muted-bg)]">
                <td className="border border-[var(--card-border)] px-3 py-2">1 cup</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">16 tablespoons</td>
              </tr>
              <tr className="hover:bg-[var(--muted-bg)]">
                <td className="border border-[var(--card-border)] px-3 py-2">1 cup</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">48 teaspoons</td>
              </tr>
              <tr className="hover:bg-[var(--muted-bg)]">
                <td className="border border-[var(--card-border)] px-3 py-2">1 cup</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">236 mL</td>
              </tr>
              <tr className="hover:bg-[var(--muted-bg)]">
                <td className="border border-[var(--card-border)] px-3 py-2">1 cup</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">8 fluid ounces</td>
              </tr>
              <tr className="hover:bg-[var(--muted-bg)]">
                <td className="border border-[var(--card-border)] px-3 py-2">1 tablespoon</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">3 teaspoons</td>
              </tr>
              <tr className="hover:bg-[var(--muted-bg)]">
                <td className="border border-[var(--card-border)] px-3 py-2">1 tablespoon</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">14.8 mL</td>
              </tr>
              <tr className="hover:bg-[var(--muted-bg)]">
                <td className="border border-[var(--card-border)] px-3 py-2">1 pint</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">2 cups</td>
              </tr>
              <tr className="hover:bg-[var(--muted-bg)]">
                <td className="border border-[var(--card-border)] px-3 py-2">1 quart</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">4 cups</td>
              </tr>
              <tr className="hover:bg-[var(--muted-bg)]">
                <td className="border border-[var(--card-border)] px-3 py-2">1 gallon</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">16 cups</td>
              </tr>
              <tr className="hover:bg-[var(--muted-bg)]">
                <td className="border border-[var(--card-border)] px-3 py-2">1 liter</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">4.23 cups</td>
              </tr>
              <tr className="hover:bg-[var(--muted-bg)]">
                <td className="border border-[var(--card-border)] px-3 py-2">1 fluid ounce</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">29.6 mL</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Convert Cooking Measurements</h2>
          <p>
            Converting between cooking measurements is essential when following recipes from different
            countries or scaling recipes up or down. This converter handles all common kitchen
            measurements including US customary units and metric units.
          </p>

          <h2>Common Kitchen Measurement Equivalents</h2>
          <ul>
            <li><strong>1 cup = 16 tablespoons = 48 teaspoons = 236 mL</strong></li>
            <li><strong>1 tablespoon = 3 teaspoons = 14.8 mL</strong></li>
            <li><strong>1 fluid ounce = 2 tablespoons = 29.6 mL</strong></li>
            <li><strong>1 pint = 2 cups = 473 mL</strong></li>
            <li><strong>1 quart = 2 pints = 4 cups = 946 mL</strong></li>
            <li><strong>1 gallon = 4 quarts = 16 cups = 3.785 L</strong></li>
          </ul>

          <h3>Grams and Water</h3>
          <p>
            The gram conversion in this tool is based on water, where 1 mL of water weighs approximately
            1 gram. For other ingredients, the weight will vary based on density. For example, 1 cup
            of flour weighs about 120g, while 1 cup of sugar weighs about 200g.
          </p>

          <h3>Tips for Accurate Measuring</h3>
          <ul>
            <li>Use liquid measuring cups for liquids and dry measuring cups for dry ingredients</li>
            <li>Level off dry ingredients with a flat edge for accuracy</li>
            <li>For baking, weight measurements (grams) are more precise than volume</li>
            <li>Spoon flour into the measuring cup rather than scooping to avoid packing</li>
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
            name: "Cooking Measurement Converter",
            description: META.description,
            url: `${SITE_URL}/tools/cooking-converter`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
