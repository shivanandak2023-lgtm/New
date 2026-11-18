"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Calorie Calculator - Daily Calorie Intake & TDEE Calculator",
  description:
    "Free calorie calculator to find your daily calorie needs. Uses the Mifflin-St Jeor formula to calculate BMR, TDEE, and calories for weight loss, maintenance, or gain.",
  keywords:
    "calorie calculator, daily calorie intake, TDEE calculator, BMR calculator, how many calories should I eat, calorie counter, weight loss calories, calorie needs",
};

type Gender = "male" | "female";
type UnitSystem = "metric" | "imperial";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (little or no exercise)",
  light: "Lightly Active (1-3 days/week)",
  moderate: "Moderately Active (3-5 days/week)",
  active: "Active (6-7 days/week)",
  very_active: "Very Active (hard exercise daily)",
};

export default function CalorieCalculatorPage() {
  const [age, setAge] = useState<string>("25");
  const [gender, setGender] = useState<Gender>("male");
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");
  const [weight, setWeight] = useState<string>("154");
  const [heightCm, setHeightCm] = useState<string>("175");
  const [heightFt, setHeightFt] = useState<string>("5");
  const [heightIn, setHeightIn] = useState<string>("9");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [result, setResult] = useState<{
    bmr: number;
    tdee: number;
    lose: number;
    loseFast: number;
    maintain: number;
    gain: number;
    gainFast: number;
  } | null>(null);

  function calculate() {
    const a = parseInt(age);
    let w: number; // in kg
    let h: number; // in cm

    if (unitSystem === "metric") {
      w = parseFloat(weight);
      h = parseFloat(heightCm);
    } else {
      w = parseFloat(weight) * 0.453592;
      h = parseFloat(heightFt) * 30.48 + parseFloat(heightIn) * 2.54;
    }

    if (!a || !w || !h || a <= 0 || w <= 0 || h <= 0) return;

    // Mifflin-St Jeor Formula
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const tdee = bmr * ACTIVITY_MULTIPLIERS[activity];

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      loseFast: Math.round(tdee - 1000),
      lose: Math.round(tdee - 500),
      maintain: Math.round(tdee),
      gain: Math.round(tdee + 500),
      gainFast: Math.round(tdee + 1000),
    });
  }

  const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/calorie-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Calorie Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your daily calorie needs using the Mifflin-St Jeor equation. Find your BMR, TDEE, and recommended intake for weight loss, maintenance, or gain.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="input-field"
                placeholder="e.g., 25"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value as Gender)} className="input-field">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Unit System</label>
              <select
                value={unitSystem}
                onChange={(e) => {
                  const sys = e.target.value as UnitSystem;
                  setUnitSystem(sys);
                  if (sys === "metric") {
                    setWeight("70");
                    setHeightCm("175");
                  } else {
                    setWeight("154");
                    setHeightFt("5");
                    setHeightIn("9");
                  }
                }}
                className="input-field"
              >
                <option value="imperial">Imperial (lbs, ft/in)</option>
                <option value="metric">Metric (kg, cm)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Weight ({unitSystem === "metric" ? "kg" : "lbs"})
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input-field"
                placeholder={unitSystem === "metric" ? "e.g., 70" : "e.g., 154"}
              />
            </div>

            {unitSystem === "metric" ? (
              <div>
                <label className="block text-sm font-medium mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 175"
                />
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Height (ft)</label>
                  <input
                    type="number"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    className="input-field"
                    placeholder="5"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Height (in)</label>
                  <input
                    type="number"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    className="input-field"
                    placeholder="9"
                  />
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Activity Level</label>
              <select value={activity} onChange={(e) => setActivity(e.target.value as ActivityLevel)} className="input-field">
                {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((key) => (
                  <option key={key} value={key}>{ACTIVITY_LABELS[key]}</option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Calories
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Basal Metabolic Rate (BMR)</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.bmr)} cal/day</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Daily Energy Expenditure (TDEE)</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.tdee)} cal/day</p>
              </div>
            </div>

            <div className="tool-card">
              <h2 className="text-lg font-bold mb-4">Daily Calorie Goals</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Goal</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Calories/Day</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Lose weight fast (~2 lbs/week)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-red-600">{fmt(Math.max(result.loseFast, 1200))}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Lose weight (~1 lb/week)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-orange-600">{fmt(Math.max(result.lose, 1200))}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)] bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">Maintain weight</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(result.maintain)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Gain weight (~1 lb/week)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-green-600">{fmt(result.gain)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Gain weight fast (~2 lbs/week)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-green-700">{fmt(result.gainFast)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does the Calorie Calculator Work?</h2>
          <p>
            This calorie calculator uses the <strong>Mifflin-St Jeor equation</strong>, which is considered one of the most
            accurate formulas for estimating Basal Metabolic Rate (BMR). Your BMR represents the number of calories your body
            burns at rest to maintain basic life functions like breathing, circulation, and cell production.
          </p>

          <h2>The Mifflin-St Jeor Formula</h2>
          <p>The BMR is calculated using the following formulas:</p>
          <ul>
            <li><strong>Men:</strong> BMR = (10 x weight in kg) + (6.25 x height in cm) - (5 x age) + 5</li>
            <li><strong>Women:</strong> BMR = (10 x weight in kg) + (6.25 x height in cm) - (5 x age) - 161</li>
          </ul>
          <p>
            The Total Daily Energy Expenditure (TDEE) is then calculated by multiplying your BMR by an activity factor
            that reflects your lifestyle and exercise habits.
          </p>

          <h2>Understanding Activity Levels</h2>
          <ul>
            <li><strong>Sedentary:</strong> Desk job with little to no exercise</li>
            <li><strong>Lightly Active:</strong> Light exercise or sports 1-3 days per week</li>
            <li><strong>Moderately Active:</strong> Moderate exercise 3-5 days per week</li>
            <li><strong>Active:</strong> Hard exercise 6-7 days per week</li>
            <li><strong>Very Active:</strong> Very hard exercise, physical job, or training twice per day</li>
          </ul>

          <h2>How Many Calories Should I Eat?</h2>
          <p>
            The recommended daily calorie intake varies by individual. On average, adult men need about 2,500 calories per day
            and adult women about 2,000 calories per day. However, your actual needs depend on age, height, weight, and activity
            level. Use this calculator to get a personalized recommendation.
          </p>

          <h3>Calories for Weight Loss</h3>
          <p>
            To lose approximately 1 pound per week, you need a calorie deficit of about 500 calories per day. For 2 pounds per
            week, aim for a 1,000 calorie deficit. It is generally not recommended to eat fewer than 1,200 calories per day
            without medical supervision.
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
            name: "Calorie Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/calorie-calculator`,
            applicationCategory: "HealthApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
