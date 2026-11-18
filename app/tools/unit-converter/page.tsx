"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Unit Converter - Convert Between Units Online",
  description:
    "Free Unit Converter to convert between units of length, weight, temperature, area, volume, speed, and time. Fast and accurate conversions.",
  keywords: "unit converter, convert units, kg to lbs, celsius to fahrenheit, km to miles, unit conversion",
};

type Category = "length" | "weight" | "temperature" | "area" | "volume" | "speed" | "time";

interface UnitDef {
  name: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

const UNITS: Record<Category, UnitDef[]> = {
  length: [
    { name: "Meter (m)", toBase: (v) => v, fromBase: (v) => v },
    { name: "Kilometer (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: "Centimeter (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { name: "Millimeter (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: "Mile", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { name: "Yard", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { name: "Foot (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { name: "Inch (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  ],
  weight: [
    { name: "Kilogram (kg)", toBase: (v) => v, fromBase: (v) => v },
    { name: "Gram (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: "Milligram (mg)", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
    { name: "Pound (lb)", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { name: "Ounce (oz)", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { name: "Tonne", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  ],
  temperature: [
    { name: "Celsius", toBase: (v) => v, fromBase: (v) => v },
    { name: "Fahrenheit", toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => v * (9 / 5) + 32 },
    { name: "Kelvin", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  area: [
    { name: "Square Meter (m2)", toBase: (v) => v, fromBase: (v) => v },
    { name: "Square Kilometer (km2)", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    { name: "Square Foot (ft2)", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    { name: "Acre", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    { name: "Hectare", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
  ],
  volume: [
    { name: "Liter (L)", toBase: (v) => v, fromBase: (v) => v },
    { name: "Milliliter (mL)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: "Gallon (US)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    { name: "Quart (US)", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    { name: "Cup (US)", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    { name: "Cubic Meter (m3)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  ],
  speed: [
    { name: "m/s", toBase: (v) => v, fromBase: (v) => v },
    { name: "km/h", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    { name: "mph", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    { name: "knot", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
  ],
  time: [
    { name: "Second", toBase: (v) => v, fromBase: (v) => v },
    { name: "Minute", toBase: (v) => v * 60, fromBase: (v) => v / 60 },
    { name: "Hour", toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    { name: "Day", toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
    { name: "Week", toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
    { name: "Month (30d)", toBase: (v) => v * 2592000, fromBase: (v) => v / 2592000 },
    { name: "Year (365d)", toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 },
  ],
};

const CATEGORY_LABELS: Record<Category, string> = {
  length: "Length",
  weight: "Weight",
  temperature: "Temperature",
  area: "Area",
  volume: "Volume",
  speed: "Speed",
  time: "Time",
};

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>("length");
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [value, setValue] = useState<string>("1");

  const units = UNITS[category];

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return "";
    const base = units[fromIdx].toBase(v);
    const converted = units[toIdx].fromBase(base);
    return converted.toLocaleString(undefined, { maximumFractionDigits: 8 });
  }, [value, fromIdx, toIdx, units]);

  function swap() {
    setFromIdx(toIdx);
    setToIdx(fromIdx);
  }

  function handleCategoryChange(cat: Category) {
    setCategory(cat);
    setFromIdx(0);
    setToIdx(1);
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/unit-converter`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Unit Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert between units of length, weight, temperature, area, volume, speed, and time.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(UNITS) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-gray-200"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <select
                value={fromIdx}
                onChange={(e) => setFromIdx(Number(e.target.value))}
                className="input-field mb-3"
              >
                {units.map((u, i) => (
                  <option key={i} value={i}>{u.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="input-field text-lg"
                placeholder="Enter value"
              />
            </div>

            <div className="flex justify-center py-2">
              <button
                onClick={swap}
                className="w-10 h-10 rounded-full bg-[var(--muted-bg)] flex items-center justify-center hover:bg-gray-200 transition-colors"
                title="Swap units"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="7 16 3 12 7 8" />
                  <polyline points="17 8 21 12 17 16" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                </svg>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <select
                value={toIdx}
                onChange={(e) => setToIdx(Number(e.target.value))}
                className="input-field mb-3"
              >
                {units.map((u, i) => (
                  <option key={i} value={i}>{u.name}</option>
                ))}
              </select>
              <div className="input-field text-lg bg-[var(--muted-bg)] font-semibold">
                {result || "—"}
              </div>
            </div>
          </div>
        </div>

        {result && value && (
          <div className="result-card text-center mb-8">
            <p className="text-lg">
              <span className="font-bold">{value} {units[fromIdx].name}</span>
              <span className="text-[var(--muted)]"> = </span>
              <span className="font-bold text-[var(--primary)]">{result} {units[toIdx].name}</span>
            </p>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is a Unit Converter?</h2>
          <p>
            A Unit Converter is a tool that converts values from one measurement unit to another. It supports
            multiple categories including length, weight, temperature, area, volume, speed, and time conversions.
          </p>

          <h2>Common Conversions</h2>
          <ul>
            <li><strong>1 km</strong> = 0.621371 miles</li>
            <li><strong>1 kg</strong> = 2.20462 lbs</li>
            <li><strong>0 C</strong> = 32 F = 273.15 K</li>
            <li><strong>1 acre</strong> = 4046.86 square meters</li>
            <li><strong>1 gallon</strong> = 3.78541 liters</li>
          </ul>

          <h2>Supported Unit Categories</h2>
          <ul>
            <li><strong>Length:</strong> meters, kilometers, miles, feet, inches, etc.</li>
            <li><strong>Weight:</strong> kilograms, grams, pounds, ounces, tonnes</li>
            <li><strong>Temperature:</strong> Celsius, Fahrenheit, Kelvin</li>
            <li><strong>Area:</strong> square meters, square feet, acres, hectares</li>
            <li><strong>Volume:</strong> liters, milliliters, gallons, cups</li>
            <li><strong>Speed:</strong> m/s, km/h, mph, knots</li>
            <li><strong>Time:</strong> seconds, minutes, hours, days, weeks</li>
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
            name: "Unit Converter",
            description: META.description,
            url: `${SITE_URL}/tools/unit-converter`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
