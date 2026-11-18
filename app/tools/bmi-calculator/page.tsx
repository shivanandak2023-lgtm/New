"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "BMI Calculator - Calculate Body Mass Index Online",
  description:
    "Free BMI Calculator to check your Body Mass Index. Enter your height and weight to find out if you are underweight, normal, overweight, or obese.",
  keywords: "bmi calculator, body mass index, bmi check, weight calculator, health calculator",
};

const CATEGORIES = [
  { label: "Underweight", range: "< 18.5", color: "#3b82f6", min: 0, max: 18.5 },
  { label: "Normal", range: "18.5 - 24.9", color: "#22c55e", min: 18.5, max: 25 },
  { label: "Overweight", range: "25 - 29.9", color: "#f59e0b", min: 25, max: 30 },
  { label: "Obese", range: "30+", color: "#ef4444", min: 30, max: 100 },
];

export default function BMICalculatorPage() {
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [heightCm, setHeightCm] = useState<string>("170");
  const [heightFt, setHeightFt] = useState<string>("5");
  const [heightIn, setHeightIn] = useState<string>("7");
  const [weight, setWeight] = useState<string>("70");
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  function calculate() {
    let h: number; // in meters
    if (heightUnit === "cm") {
      h = parseFloat(heightCm) / 100;
    } else {
      h = (parseFloat(heightFt) * 12 + parseFloat(heightIn || "0")) * 0.0254;
    }

    let w: number; // in kg
    if (weightUnit === "kg") {
      w = parseFloat(weight);
    } else {
      w = parseFloat(weight) * 0.453592;
    }

    if (!h || !w || h <= 0 || w <= 0) return;

    const bmi = w / (h * h);
    const cat = CATEGORIES.find((c) => bmi >= c.min && bmi < c.max) || CATEGORIES[CATEGORIES.length - 1];

    setResult({ bmi, category: cat.label, color: cat.color });
  }

  const bmiPosition = result ? Math.min(Math.max(((result.bmi - 10) / 35) * 100, 0), 100) : 0;

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/bmi-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">BMI Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your Body Mass Index (BMI) and check your health category. Works with both metric and imperial units.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Height</label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setHeightUnit("cm")}
                  className={`px-3 py-1 rounded text-sm ${heightUnit === "cm" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}
                >
                  cm
                </button>
                <button
                  onClick={() => setHeightUnit("ft")}
                  className={`px-3 py-1 rounded text-sm ${heightUnit === "ft" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}
                >
                  ft/in
                </button>
              </div>
              {heightUnit === "cm" ? (
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="input-field"
                  placeholder="Height in cm"
                />
              ) : (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    className="input-field"
                    placeholder="Feet"
                  />
                  <input
                    type="number"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    className="input-field"
                    placeholder="Inches"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Weight</label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setWeightUnit("kg")}
                  className={`px-3 py-1 rounded text-sm ${weightUnit === "kg" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}
                >
                  kg
                </button>
                <button
                  onClick={() => setWeightUnit("lbs")}
                  className={`px-3 py-1 rounded text-sm ${weightUnit === "lbs" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}
                >
                  lbs
                </button>
              </div>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input-field"
                placeholder={`Weight in ${weightUnit}`}
              />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary mt-6">
            Calculate BMI
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="result-card text-center mb-6">
              <p className="text-sm text-[var(--muted)] mb-1">Your BMI</p>
              <p className="text-4xl font-extrabold" style={{ color: result.color }}>
                {result.bmi.toFixed(1)}
              </p>
              <p className="text-lg font-semibold mt-1" style={{ color: result.color }}>
                {result.category}
              </p>
            </div>

            {/* Visual BMI Scale */}
            <div className="tool-card mb-6">
              <div className="flex h-4 rounded-full overflow-hidden mb-2">
                <div className="flex-1 bg-blue-400" />
                <div className="flex-1 bg-green-400" />
                <div className="flex-1 bg-amber-400" />
                <div className="flex-1 bg-red-400" />
              </div>
              <div className="relative h-4">
                <div
                  className="absolute -top-1 w-3 h-6 bg-[var(--foreground)] rounded-full transform -translate-x-1/2"
                  style={{ left: `${bmiPosition}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>

            <div className="tool-card">
              <h3 className="font-bold mb-3">BMI Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.label}
                    className="flex justify-between items-center px-3 py-2 rounded-lg"
                    style={{
                      background: result.category === cat.label ? cat.color + "15" : "transparent",
                      outline: result.category === cat.label ? `2px solid ${cat.color}` : "none",
                      outlineOffset: result.category === cat.label ? "1px" : "0",
                    }}
                  >
                    <span className="font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ background: cat.color }} />
                      {cat.label}
                    </span>
                    <span className="text-sm text-[var(--muted)]">{cat.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is BMI?</h2>
          <p>
            BMI (Body Mass Index) is a simple numerical value calculated from your height and weight. It provides a
            reliable indicator of body fatness for most people and is used to screen for weight categories that may
            lead to health problems.
          </p>

          <h2>BMI Formula</h2>
          <p><strong>BMI = Weight (kg) / Height (m)^2</strong></p>
          <p>Or in imperial units: <strong>BMI = (Weight (lbs) x 703) / Height (inches)^2</strong></p>

          <h2>BMI Categories</h2>
          <ul>
            <li><strong>Underweight:</strong> BMI less than 18.5</li>
            <li><strong>Normal weight:</strong> BMI 18.5 to 24.9</li>
            <li><strong>Overweight:</strong> BMI 25 to 29.9</li>
            <li><strong>Obese:</strong> BMI 30 or greater</li>
          </ul>

          <h3>Limitations of BMI</h3>
          <p>
            BMI does not directly measure body fat and may not be accurate for athletes, pregnant women, the elderly,
            or children. It is best used as a screening tool alongside other health assessments.
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
            name: "BMI Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/bmi-calculator`,
            applicationCategory: "HealthApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
