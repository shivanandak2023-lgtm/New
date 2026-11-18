"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Drywall Calculator - How Many Sheets of Drywall Do I Need?",
  description:
    "Free drywall calculator for rooms. Estimate sheets needed, joint tape, joint compound, screws, and cost based on room dimensions, doors, windows, and sheet size.",
  keywords:
    "drywall calculator, how many sheets of drywall, drywall calculator for room, drywall estimator, sheetrock calculator, drywall cost calculator, drywall sheets needed, drywall materials",
};

type SheetSize = "4x8" | "4x10" | "4x12";

const SHEET_SQFT: Record<SheetSize, number> = {
  "4x8": 32,
  "4x10": 40,
  "4x12": 48,
};

const DOOR_SQFT = 21;
const WINDOW_SQFT = 15;

export default function DrywallCalculatorPage() {
  const [roomLength, setRoomLength] = useState("12");
  const [roomWidth, setRoomWidth] = useState("12");
  const [roomHeight, setRoomHeight] = useState("8");
  const [doors, setDoors] = useState("2");
  const [windows, setWindows] = useState("2");
  const [sheetSize, setSheetSize] = useState<SheetSize>("4x8");
  const [includeCeiling, setIncludeCeiling] = useState(false);
  const [costPerSheet, setCostPerSheet] = useState("15");
  const [calculated, setCalculated] = useState(false);

  function calculate() {
    setCalculated(true);
  }

  const l = parseFloat(roomLength) || 0;
  const w = parseFloat(roomWidth) || 0;
  const h = parseFloat(roomHeight) || 0;
  const d = parseInt(doors) || 0;
  const win = parseInt(windows) || 0;
  const sheetArea = SHEET_SQFT[sheetSize];
  const price = parseFloat(costPerSheet) || 0;

  const wallArea = 2 * (l + w) * h;
  const ceilingArea = includeCeiling ? l * w : 0;
  const openings = d * DOOR_SQFT + win * WINDOW_SQFT;
  const netArea = Math.max(wallArea + ceilingArea - openings, 0);
  const wasteArea = netArea * 1.1;
  const sheetsNeeded = Math.ceil(wasteArea / sheetArea);

  const perimeterFt = 2 * (l + w);
  const jointTapeFt = Math.ceil(perimeterFt * h / 4 + (includeCeiling ? (l + w) * 2 : 0));
  const jointCompoundGal = Math.ceil(netArea / 100 * 0.4);
  const screws = Math.ceil(netArea / 32 * 32);
  const totalCost = sheetsNeeded * price;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/drywall-calculator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Drywall Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate how many sheets of drywall you need for your room, plus joint tape, joint compound, screws, and estimated cost.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <h2 className="text-lg font-bold mb-4">Room Dimensions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Room Length (ft)</label>
              <input type="number" value={roomLength} onChange={(e) => setRoomLength(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Room Width (ft)</label>
              <input type="number" value={roomWidth} onChange={(e) => setRoomWidth(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Room Height (ft)</label>
              <input type="number" value={roomHeight} onChange={(e) => setRoomHeight(e.target.value)} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Number of Doors</label>
              <input type="number" value={doors} onChange={(e) => setDoors(e.target.value)} className="input-field" min="0" />
              <p className="text-xs text-[var(--muted)] mt-1">{DOOR_SQFT} sq ft each</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Windows</label>
              <input type="number" value={windows} onChange={(e) => setWindows(e.target.value)} className="input-field" min="0" />
              <p className="text-xs text-[var(--muted)] mt-1">{WINDOW_SQFT} sq ft each</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sheet Size</label>
              <select value={sheetSize} onChange={(e) => setSheetSize(e.target.value as SheetSize)} className="input-field">
                <option value="4x8">4&apos; x 8&apos; (32 sq ft)</option>
                <option value="4x10">4&apos; x 10&apos; (40 sq ft)</option>
                <option value="4x12">4&apos; x 12&apos; (48 sq ft)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="ceiling"
                checked={includeCeiling}
                onChange={(e) => setIncludeCeiling(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="ceiling" className="text-sm font-medium">Include Ceiling</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost per Sheet ($)</label>
              <input type="number" value={costPerSheet} onChange={(e) => setCostPerSheet(e.target.value)} className="input-field" step="0.5" />
            </div>
          </div>

          <button onClick={calculate} className="btn-primary">Calculate Drywall</button>
        </div>

        {calculated && netArea > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Sheets Needed</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{sheetsNeeded}</p>
                <p className="text-xs text-[var(--muted)]">{sheetSize} sheets (10% waste)</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Net Wall Area</p>
                <p className="text-2xl font-bold text-green-700">{netArea.toFixed(0)} sq ft</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Estimated Cost</p>
                <p className="text-2xl font-bold">{price > 0 ? fmt(totalCost) : "N/A"}</p>
                <p className="text-xs text-[var(--muted)]">sheets only</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Materials List</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Material</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Drywall Sheets ({sheetSize})</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{sheetsNeeded} sheets</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Joint Tape</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{jointTapeFt} ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Joint Compound</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{jointCompoundGal} gallons</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Drywall Screws</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{screws} screws</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Gross Wall Area</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{(wallArea + ceilingArea).toFixed(0)} sq ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Openings Deducted</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{openings} sq ft</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Total Sheet Cost</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{price > 0 ? fmt(totalCost) : "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Drywall for a Room</h2>
          <p>
            Drywall, also known as sheetrock or plasterboard, is the most common wall and ceiling material in American
            homes. Correctly estimating the number of sheets you need prevents costly overbuying and multiple trips to
            the home improvement store. Our drywall calculator uses the standard industry approach to give you an
            accurate materials list.
          </p>

          <h2>Drywall Calculation Formula</h2>
          <p>
            The basic formula is: <strong>Total Wall Area = 2 x (Length + Width) x Height</strong>. Then subtract
            openings for doors (typically 21 sq ft each for a standard 3x7 door) and windows (typically 15 sq ft each
            for a standard 3x5 window). Add ceiling area (Length x Width) if you are drywalling the ceiling too.
            Finally, divide the net area by the sheet size and add 10% for waste from cuts, corners, and mistakes.
          </p>

          <h2>Drywall Sheet Sizes</h2>
          <p>
            Drywall sheets in the United States come in three standard sizes. The <strong>4x8 foot sheet</strong> (32 sq ft)
            is the most common for residential work and easiest to handle. The <strong>4x10 foot sheet</strong> (40 sq ft)
            works well for 9 and 10-foot ceilings, reducing horizontal seams. The <strong>4x12 foot sheet</strong> (48 sq ft)
            is preferred by professionals for its coverage and fewer joints, but requires extra help to install due to weight.
          </p>

          <h2>Joint Tape and Compound Estimates</h2>
          <p>
            For every 100 square feet of drywall, you will need approximately 35-40 feet of joint tape and about 0.4
            gallons of joint compound (mud). Joint compound comes in pre-mixed buckets (typically 3.5 or 4.5 gallon)
            or as a powder you mix yourself. Plan on three coats: a taping coat, a second coat, and a finishing coat.
            Professional finishers often use slightly more compound than DIYers because they build up thicker coats for
            a smoother finish.
          </p>

          <h2>How Many Drywall Screws Do I Need?</h2>
          <p>
            The general rule is about 32 screws per 4x8 sheet. Screws should be placed every 12 inches along edges and
            every 16 inches in the field (center of the sheet). Use coarse-thread drywall screws for wood framing and
            fine-thread screws for metal studs. The standard screw length is 1-1/4 inches for 1/2-inch thick drywall.
          </p>

          <h2>Drywall Cost Breakdown</h2>
          <ul>
            <li><strong>Standard 1/2" drywall:</strong> $12-$18 per 4x8 sheet</li>
            <li><strong>Moisture-resistant (green board):</strong> $15-$22 per sheet</li>
            <li><strong>Fire-resistant (Type X):</strong> $14-$20 per sheet</li>
            <li><strong>Joint compound:</strong> $8-$15 per 3.5-gallon bucket</li>
            <li><strong>Joint tape:</strong> $3-$6 per 250-ft roll</li>
            <li><strong>Drywall screws:</strong> $7-$10 per 1-lb box (about 200 screws)</li>
            <li><strong>Professional installation:</strong> $1.50-$3.00 per sq ft including materials</li>
          </ul>

          <h3>Tips for Buying Drywall</h3>
          <ul>
            <li>Always add 10% to your calculated amount for waste and cutting errors</li>
            <li>Use moisture-resistant drywall in bathrooms and laundry rooms</li>
            <li>Check local building codes for fire-rated drywall requirements in garages and shared walls</li>
            <li>Hang sheets horizontally on walls for fewer seams and stronger joints</li>
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
            name: "Drywall Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/drywall-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
