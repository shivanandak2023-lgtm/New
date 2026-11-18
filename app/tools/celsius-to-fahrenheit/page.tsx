"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Celsius to Fahrenheit Converter - Temperature Conversion",
  description:
    "Free temperature converter. Convert Celsius to Fahrenheit, Fahrenheit to Celsius, and Kelvin. See formulas and a reference table of common temperatures.",
  keywords:
    "celsius to fahrenheit, fahrenheit to celsius, temperature converter, C to F, F to C, kelvin converter, temperature conversion calculator",
};

const COMMON_TEMPS = [
  { label: "Absolute Zero", c: -273.15 },
  { label: "Freezing Point of Water", c: 0 },
  { label: "Cold Winter Day", c: -10 },
  { label: "Cool Day", c: 10 },
  { label: "Room Temperature", c: 20 },
  { label: "Warm Day", c: 25 },
  { label: "Hot Summer Day", c: 35 },
  { label: "Human Body Temperature", c: 37 },
  { label: "Fever Temperature", c: 39 },
  { label: "Water Boils", c: 100 },
  { label: "Oven Low (Slow Bake)", c: 150 },
  { label: "Oven Medium", c: 180 },
  { label: "Oven High", c: 220 },
  { label: "Pizza Oven", c: 260 },
];

function cToF(c: number): number {
  return (c * 9) / 5 + 32;
}

function fToC(f: number): number {
  return ((f - 32) * 5) / 9;
}

function cToK(c: number): number {
  return c + 273.15;
}

export default function CelsiusToFahrenheitPage() {
  const [celsius, setCelsius] = useState("100");
  const [fahrenheit, setFahrenheit] = useState("212");
  const [lastEdited, setLastEdited] = useState<"c" | "f">("c");

  const handleCelsiusChange = (val: string) => {
    setCelsius(val);
    setLastEdited("c");
    const c = parseFloat(val);
    if (!isNaN(c)) {
      setFahrenheit(cToF(c).toFixed(2).replace(/0+$/, "").replace(/\.$/, ""));
    }
  };

  const handleFahrenheitChange = (val: string) => {
    setFahrenheit(val);
    setLastEdited("f");
    const f = parseFloat(val);
    if (!isNaN(f)) {
      setCelsius(fToC(f).toFixed(2).replace(/0+$/, "").replace(/\.$/, ""));
    }
  };

  const cVal = parseFloat(celsius) || 0;
  const fVal = parseFloat(fahrenheit) || 0;
  const kelvin = lastEdited === "c" ? cToK(cVal) : cToK(fToC(fVal));

  const fmt = (n: number) => n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/celsius-to-fahrenheit`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Celsius to Fahrenheit Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Instantly convert temperatures between Celsius, Fahrenheit, and Kelvin. Enter a value in either field and the other will update automatically.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Celsius (C)</label>
              <input
                type="number"
                value={celsius}
                onChange={(e) => handleCelsiusChange(e.target.value)}
                className="input-field"
                placeholder="e.g., 100"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fahrenheit (F)</label>
              <input
                type="number"
                value={fahrenheit}
                onChange={(e) => handleFahrenheitChange(e.target.value)}
                className="input-field"
                placeholder="e.g., 212"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="result-card text-center">
              <p className="text-sm text-[var(--muted)] mb-1">Celsius</p>
              <p className="text-2xl font-bold text-[var(--primary)]">{fmt(cVal)} °C</p>
            </div>
            <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
              <p className="text-sm text-[var(--muted)] mb-1">Fahrenheit</p>
              <p className="text-2xl font-bold text-green-700">{fmt(fVal)} °F</p>
            </div>
            <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
              <p className="text-sm text-[var(--muted)] mb-1">Kelvin</p>
              <p className="text-2xl font-bold text-amber-700">{fmt(kelvin)} K</p>
            </div>
          </div>

          <div className="tool-card mb-6">
            <h2 className="text-lg font-bold mb-2">Formulas</h2>
            <ul className="text-sm text-[var(--muted)] space-y-1">
              <li><strong>°F = °C x 9/5 + 32</strong></li>
              <li><strong>°C = (°F - 32) x 5/9</strong></li>
              <li><strong>K = °C + 273.15</strong></li>
            </ul>
          </div>
        </div>

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Common Temperatures Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Description</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">°C</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">°F</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">K</th>
                </tr>
              </thead>
              <tbody>
                {COMMON_TEMPS.map((t) => (
                  <tr key={t.label} className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">{t.label}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(t.c)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(cToF(t.c))}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(cToK(t.c))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Convert Celsius to Fahrenheit</h2>
          <p>
            To convert Celsius to Fahrenheit, multiply the Celsius temperature by 9/5 (or 1.8) and then add 32.
            For example, 100°C x 9/5 + 32 = 212°F. This is because water boils at 100°C and 212°F.
          </p>

          <h2>How to Convert Fahrenheit to Celsius</h2>
          <p>
            To convert Fahrenheit to Celsius, subtract 32 from the Fahrenheit temperature and then multiply by 5/9.
            For example, (72°F - 32) x 5/9 = 22.22°C. Room temperature of about 72°F equals about 22°C.
          </p>

          <h2>What Is Kelvin?</h2>
          <p>
            Kelvin is the SI unit of temperature. It starts at absolute zero (-273.15°C), the lowest possible temperature.
            To convert Celsius to Kelvin, simply add 273.15. Kelvin is widely used in science and engineering.
          </p>

          <h3>Quick Mental Conversion Tips</h3>
          <p>
            For a quick rough estimate: double the Celsius value and add 30 to get an approximate Fahrenheit value.
            For example, 20°C x 2 + 30 = 70°F (actual: 68°F). This trick works well for everyday temperatures.
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
            name: "Celsius to Fahrenheit Converter",
            description: META.description,
            url: `${SITE_URL}/tools/celsius-to-fahrenheit`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
