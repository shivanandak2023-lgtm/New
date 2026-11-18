"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Steps to KM Converter - Calculate Distance from Steps",
  description:
    "Convert steps to kilometers, miles, and calories burned. Track your daily walking goal with our free step counter converter.",
  keywords: "steps to km, steps to kilometers, step counter, steps to miles, walking distance calculator, calories burned walking",
};

type Gender = "male" | "female";
type StrideMode = "auto" | "manual";

const QUICK_REF = [1000, 2000, 5000, 7500, 10000, 15000, 20000];

function calcDistance(steps: number, strideCm: number) {
  const km = (steps * strideCm) / 100000;
  const miles = km * 0.621371;
  return { km, miles };
}

function calcCalories(steps: number, weightKg: number) {
  return steps * 0.04 * (weightKg / 70);
}

function calcTime(steps: number, pace: number) {
  const minutes = steps / pace;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return { hours, mins, totalMinutes: Math.round(minutes) };
}

function strideFromHeight(heightCm: number, gender: Gender) {
  return gender === "male" ? heightCm * 0.415 : heightCm * 0.413;
}

export default function StepsToKmPage() {
  const [steps, setSteps] = useState<string>("");
  const [gender, setGender] = useState<Gender>("male");
  const [strideMode, setStrideMode] = useState<StrideMode>("auto");
  const [heightCm, setHeightCm] = useState<string>("170");
  const [manualStride, setManualStride] = useState<string>("75");
  const [weightKg, setWeightKg] = useState<string>("70");
  const [dailyGoal, setDailyGoal] = useState<string>("10000");

  const strideCm = useMemo(() => {
    if (strideMode === "manual") return parseFloat(manualStride) || 75;
    const h = parseFloat(heightCm) || 170;
    return strideFromHeight(h, gender);
  }, [strideMode, manualStride, heightCm, gender]);

  const stepsNum = parseFloat(steps) || 0;
  const weightNum = parseFloat(weightKg) || 70;
  const goalNum = parseFloat(dailyGoal) || 10000;

  const { km, miles } = calcDistance(stepsNum, strideCm);
  const calories = calcCalories(stepsNum, weightNum);
  const time = calcTime(stepsNum, 100);
  const goalProgress = Math.min((stepsNum / goalNum) * 100, 100);

  const footballFields = km * 1000 / 91.44;
  const olympicPools = km * 1000 / 50;
  const eiffelTowers = km * 1000 / 330;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/steps-to-km`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/steps-to-km`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Steps to KM Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert your steps to distance in kilometers and miles. Track calories burned and daily walking goals.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="tool-card">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Number of Steps</label>
              <input
                type="number"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                className="input-field"
                placeholder="e.g. 10000"
                min="0"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Gender</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setGender("male")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${gender === "male" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)] text-[var(--foreground)] border border-[var(--card-border)]"}`}
                >
                  Male
                </button>
                <button
                  onClick={() => setGender("female")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${gender === "female" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)] text-[var(--foreground)] border border-[var(--card-border)]"}`}
                >
                  Female
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Stride Length</label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setStrideMode("auto")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${strideMode === "auto" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)] text-[var(--foreground)] border border-[var(--card-border)]"}`}
                >
                  Auto (from height)
                </button>
                <button
                  onClick={() => setStrideMode("manual")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${strideMode === "manual" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)] text-[var(--foreground)] border border-[var(--card-border)]"}`}
                >
                  Manual
                </button>
              </div>
              {strideMode === "auto" ? (
                <div>
                  <label className="block text-xs text-[var(--muted)] mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="input-field"
                    placeholder="170"
                    min="100"
                    max="250"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs text-[var(--muted)] mb-1">Stride Length (cm)</label>
                  <input
                    type="number"
                    value={manualStride}
                    onChange={(e) => setManualStride(e.target.value)}
                    className="input-field"
                    placeholder="75"
                    min="30"
                    max="150"
                  />
                </div>
              )}
              <p className="text-xs text-[var(--muted)] mt-1">Stride: {strideCm.toFixed(1)} cm</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="input-field"
                placeholder="70"
                min="20"
                max="300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Daily Step Goal</label>
              <input
                type="number"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                className="input-field"
                placeholder="10000"
                min="1000"
              />
            </div>
          </div>

          <div className="space-y-4">
            {stepsNum > 0 && (
              <>
                <div className="result-card">
                  <h3 className="font-semibold mb-3 text-lg">Results</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[var(--card)] rounded-lg p-3 border border-[var(--card-border)]">
                      <p className="text-xs text-[var(--muted)]">Distance</p>
                      <p className="text-xl font-bold text-[var(--primary)]">{km.toFixed(2)} km</p>
                    </div>
                    <div className="bg-[var(--card)] rounded-lg p-3 border border-[var(--card-border)]">
                      <p className="text-xs text-[var(--muted)]">Distance</p>
                      <p className="text-xl font-bold text-[var(--primary)]">{miles.toFixed(2)} mi</p>
                    </div>
                    <div className="bg-[var(--card)] rounded-lg p-3 border border-[var(--card-border)]">
                      <p className="text-xs text-[var(--muted)]">Calories Burned</p>
                      <p className="text-xl font-bold text-[var(--warning)]">{calories.toFixed(0)} kcal</p>
                    </div>
                    <div className="bg-[var(--card)] rounded-lg p-3 border border-[var(--card-border)]">
                      <p className="text-xs text-[var(--muted)]">Time Walked</p>
                      <p className="text-xl font-bold text-[var(--success)]">
                        {time.hours > 0 ? `${time.hours}h ` : ""}{time.mins}m
                      </p>
                    </div>
                  </div>
                </div>

                <div className="tool-card">
                  <h3 className="font-semibold mb-2">Goal Progress</h3>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{stepsNum.toLocaleString()} steps</span>
                    <span>{goalNum.toLocaleString()} goal</span>
                  </div>
                  <div className="w-full bg-[var(--muted-bg)] rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${goalProgress}%`,
                        background: goalProgress >= 100 ? "var(--success)" : "var(--primary)",
                      }}
                    />
                  </div>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    {goalProgress >= 100
                      ? "Goal reached! Great job!"
                      : `${(goalNum - stepsNum).toLocaleString()} steps remaining`}
                  </p>
                </div>

                <div className="tool-card">
                  <h3 className="font-semibold mb-2">Fun Facts</h3>
                  <ul className="space-y-1.5 text-sm text-[var(--muted)]">
                    <li>You walked ~{footballFields.toFixed(1)} football fields</li>
                    <li>That&apos;s ~{olympicPools.toFixed(1)} Olympic swimming pools in length</li>
                    <li>Equivalent to climbing {eiffelTowers.toFixed(1)} Eiffel Towers laid flat</li>
                    {km >= 1 && <li>You could have walked across {(km / 4.5).toFixed(1)} Brooklyn Bridges</li>}
                    {km >= 5 && <li>Almost a 5K run distance!</li>}
                    {km >= 10 && <li>You walked more than 10 kilometers today!</li>}
                    {km >= 42.195 && <li>You completed a marathon distance!</li>}
                  </ul>
                </div>
              </>
            )}

            {stepsNum === 0 && (
              <div className="tool-card flex items-center justify-center min-h-[300px]">
                <p className="text-[var(--muted)] text-center">
                  Enter your steps to see results
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="ad-placeholder my-8">Advertisement</div>

        <div className="tool-card mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Reference Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Steps</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">KM</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Miles</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Calories*</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Time (est.)</th>
                </tr>
              </thead>
              <tbody>
                {QUICK_REF.map((s) => {
                  const d = calcDistance(s, strideCm);
                  const c = calcCalories(s, weightNum);
                  const t = calcTime(s, 100);
                  return (
                    <tr key={s} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{s.toLocaleString()}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2">{d.km.toFixed(2)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2">{d.miles.toFixed(2)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2">{c.toFixed(0)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2">{t.hours > 0 ? `${t.hours}h ` : ""}{t.mins}m</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--muted)] mt-2">*Calories based on {weightNum}kg body weight. Actual values may vary.</p>
        </div>

        <div className="seo-content tool-card">
          <h2>How to Convert Steps to Kilometers</h2>
          <p>
            Converting steps to kilometers depends on your stride length. The average stride length is about 75 cm for
            men and 67 cm for women. The formula is: Distance (km) = Steps &times; Stride Length (cm) &divide; 100,000.
          </p>

          <h2>How Many Steps in a Kilometer?</h2>
          <p>
            For an average adult with a stride length of 75 cm, it takes approximately 1,333 steps to walk one kilometer.
            For someone with a shorter stride of 67 cm, it takes about 1,493 steps per kilometer.
          </p>

          <h2>Benefits of Walking 10,000 Steps a Day</h2>
          <ul>
            <li>Burns approximately 300-500 calories depending on weight and pace</li>
            <li>Improves cardiovascular health and reduces heart disease risk</li>
            <li>Helps maintain a healthy weight and boosts metabolism</li>
            <li>Reduces stress and improves mental well-being</li>
            <li>Strengthens bones and muscles</li>
            <li>Improves sleep quality</li>
          </ul>

          <h2>Tips for Increasing Your Daily Steps</h2>
          <ul>
            <li>Take the stairs instead of the elevator</li>
            <li>Park farther away from your destination</li>
            <li>Walk during phone calls or meetings</li>
            <li>Set hourly reminders to get up and move</li>
            <li>Take a short walk after each meal</li>
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
            name: "Steps to KM Converter",
            description: META.description,
            url: `${SITE_URL}/tools/steps-to-km`,
            applicationCategory: "HealthApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
