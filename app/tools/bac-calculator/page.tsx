"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "BAC Calculator - Blood Alcohol Content Estimator",
  description:
    "Free BAC calculator. Estimate your blood alcohol content based on weight, gender, drinks consumed, and time. Know your legal status and time to sober.",
  keywords:
    "bac calculator, blood alcohol calculator, blood alcohol content calculator, am I over the limit, alcohol calculator, drunk calculator, bac estimator, dui calculator",
};

const DRINK_TYPES: { label: string; oz: number; abv: number }[] = [
  { label: "Beer (12 oz, 5%)", oz: 12, abv: 0.05 },
  { label: "Wine (5 oz, 12%)", oz: 5, abv: 0.12 },
  { label: "Shot/Spirit (1.5 oz, 40%)", oz: 1.5, abv: 0.40 },
  { label: "Cocktail (mixed, ~1.5 oz liquor)", oz: 1.5, abv: 0.40 },
  { label: "Strong Beer (12 oz, 8%)", oz: 12, abv: 0.08 },
  { label: "Malt Liquor (12 oz, 7%)", oz: 12, abv: 0.07 },
];

function getBacStatus(bac: number): { label: string; color: string; description: string } {
  if (bac <= 0) return { label: "Sober", color: "text-green-700", description: "No measurable alcohol in your system." };
  if (bac < 0.02) return { label: "Minimal Effects", color: "text-green-600", description: "Slight mood elevation. No loss of coordination." };
  if (bac < 0.05) return { label: "Mild Impairment", color: "text-yellow-600", description: "Relaxation, lowered inhibitions, slight impairment of reasoning." };
  if (bac < 0.08) return { label: "Under Legal Limit", color: "text-yellow-700", description: "Reduced coordination, impaired judgment. Still legal to drive in most states." };
  if (bac < 0.15) return { label: "LEGALLY IMPAIRED", color: "text-red-600", description: "Over the 0.08 legal limit. Significant impairment of motor control and judgment." };
  if (bac < 0.30) return { label: "SEVERELY IMPAIRED", color: "text-red-700", description: "Major loss of balance, blurred vision, impaired judgment and reaction time." };
  return { label: "LIFE-THREATENING", color: "text-red-900", description: "Risk of alcohol poisoning, loss of consciousness, and death. Seek emergency help." };
}

export default function BacCalculatorPage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("180");
  const [drinkType, setDrinkType] = useState("0");
  const [numDrinks, setNumDrinks] = useState("3");
  const [hours, setHours] = useState("1");

  const weightLbs = parseFloat(weight) || 180;
  const drinks = parseFloat(numDrinks) || 0;
  const hoursSince = parseFloat(hours) || 0;
  const drink = DRINK_TYPES[parseInt(drinkType) || 0];

  // Widmark formula
  const r = gender === "male" ? 0.68 : 0.55;
  const alcoholOz = drink.oz * drink.abv * drinks;
  const alcoholGrams = alcoholOz * 28.3495 * 0.789; // oz to grams of pure alcohol (density 0.789)
  const bodyWeightGrams = weightLbs * 453.592;
  const rawBac = (alcoholGrams / (bodyWeightGrams * r)) * 100;
  const bac = Math.max(0, rawBac - 0.015 * hoursSince);
  const timeToSober = bac > 0 ? bac / 0.015 : 0;
  const status = getBacStatus(bac);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/bac-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/bac-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Blood Alcohol Content (BAC) Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Estimate your blood alcohol level based on your weight, gender, number of drinks, and time elapsed. See your legal status and estimated time until sober.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <div className="flex gap-2">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                      gender === g
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    {g === "male" ? "Male" : "Female"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Body Weight (lbs)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="input-field" placeholder="180" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Drink Type</label>
              <select value={drinkType} onChange={(e) => setDrinkType(e.target.value)} className="input-field">
                {DRINK_TYPES.map((d, i) => (
                  <option key={i} value={i}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Drinks</label>
              <input type="number" value={numDrinks} onChange={(e) => setNumDrinks(e.target.value)} className="input-field" min="0" step="0.5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hours Since First Drink</label>
              <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} className="input-field" min="0" step="0.25" />
            </div>
          </div>
        </div>

        {drinks > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center" style={{
                background: bac >= 0.08 ? "#fef2f2" : "#f0fdf4",
                borderColor: bac >= 0.08 ? "#fecaca" : "#bbf7d0"
              }}>
                <p className="text-sm text-[var(--muted)] mb-1">Estimated BAC</p>
                <p className={`text-3xl font-bold ${status.color}`}>{bac.toFixed(4)}%</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Status</p>
                <p className={`text-lg font-bold ${status.color}`}>{status.label}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Time Until Sober</p>
                <p className="text-xl font-bold text-amber-700">
                  {timeToSober > 0 ? `~${Math.floor(timeToSober)}h ${Math.round((timeToSober % 1) * 60)}m` : "Sober"}
                </p>
              </div>
            </div>

            <div className="result-card mb-6">
              <p className="text-sm">{status.description}</p>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">BAC Reference Chart</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">BAC Level</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Effects</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Legal Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["0.00 - 0.02%", "Minimal effects, slight mood change", "Legal"],
                    ["0.02 - 0.05%", "Relaxation, mild euphoria", "Legal"],
                    ["0.05 - 0.08%", "Reduced coordination, impaired judgment", "Legal (most states)"],
                    ["0.08 - 0.10%", "Significant impairment of motor control", "ILLEGAL to drive"],
                    ["0.10 - 0.15%", "Clear deterioration, slurred speech", "ILLEGAL"],
                    ["0.15 - 0.30%", "Major loss of balance, risk of blackout", "Very dangerous"],
                    ["0.30%+", "Risk of alcohol poisoning and death", "Medical emergency"],
                  ].map(([level, effects, legal]) => (
                    <tr key={level} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{level}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2">{effects}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2">{legal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="result-card mb-6" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
              <p className="font-bold text-red-700 mb-1">IMPORTANT DISCLAIMER</p>
              <p className="text-sm text-red-800">
                This BAC calculator provides an <strong>estimate only</strong>. Actual BAC depends on many factors including
                food intake, metabolism, medications, and individual tolerance. <strong>Do not drink and drive.</strong> If you
                have consumed any alcohol, use a designated driver, rideshare, or taxi. The legal BAC limit for driving is 0.08%
                in all 50 US states (0.04% for commercial drivers, 0.00% for drivers under 21).
              </p>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>BAC Calculator: Understanding Blood Alcohol Content</h2>
          <p>
            Blood Alcohol Content (BAC) measures the amount of alcohol in your bloodstream as a percentage. A BAC of 0.08%
            means that there are 0.08 grams of alcohol per 100 milliliters of blood. In all 50 US states, 0.08% is the legal
            limit for driving. This BAC calculator uses the Widmark formula to estimate your blood alcohol level based on your
            gender, body weight, the type and number of drinks consumed, and how much time has elapsed since your first drink.
          </p>

          <h2>The Widmark Formula</h2>
          <p>
            The Widmark formula is the most widely used method for estimating BAC. It calculates BAC as the total grams of
            alcohol consumed divided by body weight in grams multiplied by a gender-specific distribution ratio (0.68 for
            males, 0.55 for females), then subtracts the alcohol metabolized over time. The body eliminates alcohol at an
            average rate of about 0.015% BAC per hour, regardless of body weight or other factors.
          </p>

          <h2>What Counts as One Standard Drink?</h2>
          <p>
            In the United States, one standard drink contains approximately 14 grams (0.6 fluid ounces) of pure alcohol.
            This is equivalent to 12 ounces of regular beer (5% ABV), 5 ounces of wine (12% ABV), or 1.5 ounces of distilled
            spirits (40% ABV or 80 proof). Many cocktails contain more than one standard drink, and craft beers often have
            higher ABV than regular beer. Knowing what counts as one drink is essential for accurately estimating your BAC.
          </p>

          <h2>Factors That Affect BAC</h2>
          <p>
            Several factors influence how quickly alcohol enters and leaves your bloodstream. Body weight matters because a
            larger body has more water to dilute the alcohol. Gender plays a role because women typically have a higher
            percentage of body fat and lower water content than men of the same weight, resulting in higher BAC levels.
            Food in your stomach slows alcohol absorption, while drinking on an empty stomach leads to faster absorption.
            Medications, fatigue, and overall health can also affect how alcohol impacts you.
          </p>

          <h2>US Legal BAC Limits</h2>
          <p>
            All 50 US states enforce a 0.08% BAC limit for drivers aged 21 and over. Commercial vehicle operators face a
            stricter 0.04% limit. Drivers under 21 are subject to zero tolerance laws, meaning any detectable BAC (typically
            0.00% to 0.02%) can result in a DUI charge. Some states have enhanced penalties at higher BAC levels, such as
            0.15% or 0.20%. A DUI conviction can result in license suspension, fines of $5,000 to $10,000 or more, mandatory
            alcohol education programs, and possible jail time.
          </p>

          <h3>How Long Does Alcohol Stay in Your System?</h3>
          <p>
            The body metabolizes alcohol at a relatively constant rate of about 0.015% BAC per hour. This means if your BAC
            is 0.08%, it will take approximately 5.3 hours to reach 0.00%. Coffee, cold showers, and exercise do not speed up
            alcohol metabolism. The only thing that lowers your BAC is time. If you plan to drive, the safest approach is to
            wait until your estimated BAC has reached 0.00%, or simply arrange alternative transportation.
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
            name: "BAC Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/bac-calculator`,
            applicationCategory: "HealthApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
