"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Wallpaper Calculator - Free Rolls & Strips Estimator (2025)",
  description:
    "Wallpaper calculator to estimate rolls needed by room size. Calculate strips, usable area per roll, and waste for US and Euro standard rolls.",
  keywords:
    "wallpaper calculator, how many rolls of wallpaper, wallpaper calculator by room size, wallpaper roll calculator, wallpaper coverage calculator, wallpaper strips calculator, wallpaper for room, wallpaper estimator, wallpaper pattern repeat, wallpaper cost calculator",
};

interface RollSize {
  label: string;
  widthIn: number;
  lengthFt: number;
}

const ROLL_SIZES: RollSize[] = [
  { label: "US Standard (27\" x 33 ft)", widthIn: 27, lengthFt: 33 },
  { label: "Euro Standard (21\" x 33 ft)", widthIn: 21, lengthFt: 33 },
];

export default function WallpaperCalculatorPage() {
  const [roomLengthFt, setRoomLengthFt] = useState("15");
  const [roomWidthFt, setRoomWidthFt] = useState("12");
  const [roomHeightFt, setRoomHeightFt] = useState("8");
  const [doors, setDoors] = useState("2");
  const [windows, setWindows] = useState("3");
  const [rollSizeIdx, setRollSizeIdx] = useState(0);
  const [patternRepeat, setPatternRepeat] = useState("0");
  const [costPerRoll, setCostPerRoll] = useState("40");
  const [calculated, setCalculated] = useState(false);

  function calculate() {
    setCalculated(true);
  }

  const length = parseFloat(roomLengthFt) || 0;
  const width = parseFloat(roomWidthFt) || 0;
  const height = parseFloat(roomHeightFt) || 0;
  const doorCount = parseInt(doors) || 0;
  const windowCount = parseInt(windows) || 0;

  const DOOR_SQFT = 20;
  const WINDOW_SQFT = 15;
  const perimeter = 2 * (length + width);
  const totalWallArea = perimeter * height;
  const deductions = doorCount * DOOR_SQFT + windowCount * WINDOW_SQFT;
  const coverableArea = Math.max(totalWallArea - deductions, 0);

  const roll = ROLL_SIZES[rollSizeIdx];
  const rollWidthFt = roll.widthIn / 12;
  const repeat = parseFloat(patternRepeat) || 0;
  const repeatFt = repeat / 12;

  const stripsFromRoll = roll.lengthFt > 0 ? Math.floor(roll.lengthFt / (height + repeatFt)) : 0;
  const usableWidthPerRoll = stripsFromRoll * rollWidthFt;
  const usableAreaPerRoll = usableWidthPerRoll * height;

  const stripsNeeded = rollWidthFt > 0 ? Math.ceil(perimeter / rollWidthFt) : 0;
  const stripDeductDoors = Math.floor(doorCount * (3 / rollWidthFt));
  const stripDeductWindows = Math.floor(windowCount * (2.5 / rollWidthFt));
  const adjustedStrips = Math.max(stripsNeeded - stripDeductDoors - stripDeductWindows, 0);

  const rollsNeeded = stripsFromRoll > 0 ? Math.ceil(adjustedStrips / stripsFromRoll) : 0;
  const totalRollArea = rollsNeeded * roll.widthIn / 12 * roll.lengthFt;
  const wastePercent = coverableArea > 0 ? Math.max(((totalRollArea - coverableArea) / totalRollArea) * 100, 0) : 0;
  const cost = rollsNeeded * (parseFloat(costPerRoll) || 40);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/wallpaper-calculator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Wallpaper Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate how many rolls of wallpaper you need by room size. Accounts for doors, windows, pattern repeat, and roll size.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Room Length (ft)</label>
              <input type="number" value={roomLengthFt} onChange={(e) => setRoomLengthFt(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Room Width (ft)</label>
              <input type="number" value={roomWidthFt} onChange={(e) => setRoomWidthFt(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ceiling Height (ft)</label>
              <input type="number" value={roomHeightFt} onChange={(e) => setRoomHeightFt(e.target.value)} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Doors</label>
              <input type="number" value={doors} onChange={(e) => setDoors(e.target.value)} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Windows</label>
              <input type="number" value={windows} onChange={(e) => setWindows(e.target.value)} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Roll Size</label>
              <select value={rollSizeIdx} onChange={(e) => setRollSizeIdx(parseInt(e.target.value))} className="input-field">
                {ROLL_SIZES.map((r, i) => (
                  <option key={i} value={i}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pattern Repeat (in)</label>
              <input type="number" value={patternRepeat} onChange={(e) => setPatternRepeat(e.target.value)} className="input-field" min="0" />
              <p className="text-xs text-[var(--muted)] mt-1">0 = no repeat pattern</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Cost per Roll ($)</label>
            <input type="number" value={costPerRoll} onChange={(e) => setCostPerRoll(e.target.value)} className="input-field w-full md:w-1/4" />
          </div>

          <button onClick={calculate} className="btn-primary">Calculate Wallpaper</button>
        </div>

        {calculated && coverableArea > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Wall Area</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{coverableArea.toFixed(0)} sq ft</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Rolls Needed</p>
                <p className="text-2xl font-bold text-green-700">{rollsNeeded}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Strips</p>
                <p className="text-2xl font-bold">{adjustedStrips}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Est. Cost</p>
                <p className="text-2xl font-bold">{fmtExact(cost)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Detailed Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Room Perimeter</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{perimeter.toFixed(0)} ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Wall Height</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{height} ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Wall Area</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{totalWallArea.toFixed(0)} sq ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Deductions ({doorCount} doors, {windowCount} windows)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">-{deductions} sq ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Coverable Area</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{coverableArea.toFixed(0)} sq ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Roll Size</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{roll.widthIn}&quot; x {roll.lengthFt} ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Usable Area per Roll</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{usableAreaPerRoll.toFixed(1)} sq ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Strips per Roll</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{stripsFromRoll}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Strips Needed</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{adjustedStrips}</td>
                  </tr>
                  {repeat > 0 && (
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Pattern Repeat</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{repeat}&quot;</td>
                    </tr>
                  )}
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Estimated Waste</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{wastePercent.toFixed(1)}%</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Estimated Cost ({rollsNeeded} rolls)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(cost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Many Rolls of Wallpaper Do I Need?</h2>
          <p>
            This free wallpaper calculator helps you determine exactly how many rolls of wallpaper you need for your
            room. It accounts for room dimensions, doors, windows, roll size, and pattern repeat to give you an
            accurate estimate. Whether you are wallpapering a bedroom, living room, or accent wall, this tool
            eliminates the frustration of running short or overspending on extra rolls.
          </p>

          <h2>How to Use the Wallpaper Calculator</h2>
          <p>
            Measure your room length, width, and ceiling height in feet. Count the number of standard doors and
            windows in the room — the calculator deducts approximately 20 sq ft per door and 15 sq ft per window.
            Select your wallpaper roll size: US standard rolls are 27 inches wide by 33 feet long, while European
            rolls are 21 inches wide by 33 feet long. If your wallpaper has a pattern repeat, enter the repeat
            distance in inches — this increases the number of rolls needed because each strip must be aligned.
          </p>

          <h2>Wallpaper Calculation Formula</h2>
          <ul>
            <li><strong>Room Perimeter:</strong> 2 x (Length + Width)</li>
            <li><strong>Wall Area:</strong> Perimeter x Ceiling Height</li>
            <li><strong>Coverable Area:</strong> Wall Area - Door/Window deductions</li>
            <li><strong>Strips from Roll:</strong> Roll Length / (Wall Height + Pattern Repeat)</li>
            <li><strong>Total Strips:</strong> Room Perimeter / Roll Width (adjusted for openings)</li>
            <li><strong>Rolls Needed:</strong> Total Strips / Strips per Roll, rounded up</li>
          </ul>

          <h3>Common Wallpaper Questions</h3>
          <p>
            <strong>What is a pattern repeat?</strong> A pattern repeat is the vertical distance between identical
            points in a wallpaper design. Each strip must be shifted to match the pattern at the seams, which creates
            waste. Larger pattern repeats (12-24 inches) require significantly more wallpaper than small repeats or
            no-repeat designs.
          </p>
          <p>
            <strong>How much extra wallpaper should I buy?</strong> Always buy at least one extra roll beyond what
            the calculator estimates. This ensures you have matching wallpaper for touch-ups and repairs. If your
            wallpaper has a large pattern repeat or the room has many corners and obstacles, buy two extra rolls.
          </p>
          <p>
            <strong>US vs. Euro wallpaper rolls?</strong> US standard rolls (American single rolls) are typically
            27 inches wide and 33 feet long, covering approximately 72 square feet. European rolls are 21 inches
            wide and 33 feet long, covering approximately 57 square feet. Many wallpapers sold in the US come
            packaged as double rolls.
          </p>

          <h3>Wallpaper Buying Tips</h3>
          <ul>
            <li>Always buy from the same batch or lot number to ensure consistent color</li>
            <li>Peel-and-stick wallpaper is beginner-friendly and removable for rentals</li>
            <li>Expect to pay $25-$50 per roll for mid-range wallpaper, $80+ for designer patterns</li>
            <li>Textured or embossed wallpaper is more forgiving of wall imperfections</li>
            <li>Vinyl-coated wallpaper is best for bathrooms and kitchens due to moisture resistance</li>
            <li>Keep at least one extra roll sealed in storage for future repairs</li>
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
            name: "Wallpaper Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/wallpaper-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
