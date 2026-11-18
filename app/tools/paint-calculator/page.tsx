"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Paint Calculator - Free Room Size & Gallons Estimator (2025)",
  description:
    "Paint calculator to estimate how much paint you need by room size. Calculate gallons, quarts, and cost for walls and ceilings with door and window deductions.",
  keywords:
    "paint calculator, how much paint do I need, paint calculator by room size, wall paint calculator, paint gallons calculator, interior paint calculator, room painting calculator, paint coverage calculator, paint cost estimator, paint for walls",
};

interface Room {
  id: number;
  name: string;
  lengthFt: string;
  widthFt: string;
  heightFt: string;
  doors: string;
  windows: string;
}

function createRoom(id: number): Room {
  return {
    id,
    name: `Room ${id}`,
    lengthFt: "12",
    widthFt: "10",
    heightFt: "8",
    doors: "1",
    windows: "2",
  };
}

export default function PaintCalculatorPage() {
  const [inputMode, setInputMode] = useState<"rooms" | "sqft">("rooms");
  const [rooms, setRooms] = useState<Room[]>([createRoom(1)]);
  const [directSqFt, setDirectSqFt] = useState("400");
  const [coats, setCoats] = useState("2");
  const [coveragePerGallon, setCoveragePerGallon] = useState("375");
  const [costPerGallon, setCostPerGallon] = useState("35");
  const [calculated, setCalculated] = useState(false);

  function updateRoom(id: number, field: string, value: string) {
    setRooms(rooms.map((r) => r.id === id ? { ...r, [field]: value } : r));
  }

  function addRoom() {
    setRooms([...rooms, createRoom(rooms.length + 1)]);
  }

  function removeRoom(id: number) {
    if (rooms.length > 1) {
      setRooms(rooms.filter((r) => r.id !== id));
    }
  }

  function calculate() {
    setCalculated(true);
  }

  const DOOR_SQFT = 20;
  const WINDOW_SQFT = 15;

  function roomWallArea(r: Room): number {
    const l = parseFloat(r.lengthFt) || 0;
    const w = parseFloat(r.widthFt) || 0;
    const h = parseFloat(r.heightFt) || 0;
    const doors = parseInt(r.doors) || 0;
    const windows = parseInt(r.windows) || 0;
    const totalWallArea = 2 * (l + w) * h;
    const deductions = doors * DOOR_SQFT + windows * WINDOW_SQFT;
    return Math.max(totalWallArea - deductions, 0);
  }

  const totalPaintableSqFt = inputMode === "rooms"
    ? rooms.reduce((sum, r) => sum + roomWallArea(r), 0)
    : parseFloat(directSqFt) || 0;

  const numCoats = parseInt(coats) || 2;
  const coverage = parseFloat(coveragePerGallon) || 375;
  const totalSqFtWithCoats = totalPaintableSqFt * numCoats;
  const gallonsNeeded = totalSqFtWithCoats / coverage;
  const gallonsRounded = Math.ceil(gallonsNeeded);
  const quartsNeeded = Math.ceil(gallonsNeeded * 4);
  const cost = gallonsRounded * (parseFloat(costPerGallon) || 35);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/paint-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/paint-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Paint Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate how much paint you need by room size. Deduct doors and windows, choose number of coats, and get gallons and cost estimates.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Input Mode</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={inputMode === "rooms"} onChange={() => setInputMode("rooms")} />
                <span className="text-sm">Room Dimensions</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={inputMode === "sqft"} onChange={() => setInputMode("sqft")} />
                <span className="text-sm">Direct Wall Area (sq ft)</span>
              </label>
            </div>
          </div>
        </div>

        {inputMode === "rooms" && (
          <>
            {rooms.map((room) => (
              <div key={room.id} className="tool-card mb-4">
                <div className="flex justify-between items-center mb-4">
                  <input
                    type="text"
                    value={room.name}
                    onChange={(e) => updateRoom(room.id, "name", e.target.value)}
                    className="input-field w-40 text-sm font-semibold"
                  />
                  {rooms.length > 1 && (
                    <button onClick={() => removeRoom(room.id)} className="text-red-500 text-sm hover:underline">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Length (ft)</label>
                    <input type="number" value={room.lengthFt} onChange={(e) => updateRoom(room.id, "lengthFt", e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Width (ft)</label>
                    <input type="number" value={room.widthFt} onChange={(e) => updateRoom(room.id, "widthFt", e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Height (ft)</label>
                    <input type="number" value={room.heightFt} onChange={(e) => updateRoom(room.id, "heightFt", e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Doors</label>
                    <input type="number" value={room.doors} onChange={(e) => updateRoom(room.id, "doors", e.target.value)} className="input-field" />
                    <p className="text-xs text-[var(--muted)] mt-1">20 sq ft each</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Windows</label>
                    <input type="number" value={room.windows} onChange={(e) => updateRoom(room.id, "windows", e.target.value)} className="input-field" />
                    <p className="text-xs text-[var(--muted)] mt-1">15 sq ft each</p>
                  </div>
                </div>
                {calculated && (
                  <p className="mt-3 text-sm font-semibold text-[var(--primary)]">
                    {room.name}: {roomWallArea(room).toFixed(0)} sq ft paintable
                  </p>
                )}
              </div>
            ))}
            <div className="mb-6">
              <button onClick={addRoom} className="text-sm text-[var(--primary)] hover:underline">+ Add Another Room</button>
            </div>
          </>
        )}

        {inputMode === "sqft" && (
          <div className="tool-card mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Total Wall Area (sq ft)</label>
              <input type="number" value={directSqFt} onChange={(e) => setDirectSqFt(e.target.value)} className="input-field w-full md:w-1/2" />
              <p className="text-xs text-[var(--muted)] mt-1">Enter total paintable wall area after deducting doors/windows</p>
            </div>
          </div>
        )}

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Number of Coats</label>
              <select value={coats} onChange={(e) => setCoats(e.target.value)} className="input-field">
                <option value="1">1 Coat</option>
                <option value="2">2 Coats</option>
                <option value="3">3 Coats</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Coverage per Gallon (sq ft)</label>
              <input type="number" value={coveragePerGallon} onChange={(e) => setCoveragePerGallon(e.target.value)} className="input-field" />
              <p className="text-xs text-[var(--muted)] mt-1">Standard: 350-400 sq ft/gallon</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost per Gallon ($)</label>
              <input type="number" value={costPerGallon} onChange={(e) => setCostPerGallon(e.target.value)} className="input-field" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary mt-6">Calculate Paint</button>
        </div>

        {calculated && totalPaintableSqFt > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Paintable Area</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{totalPaintableSqFt.toFixed(0)} sq ft</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Gallons Needed</p>
                <p className="text-2xl font-bold text-green-700">{gallonsRounded}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Quarts Needed</p>
                <p className="text-2xl font-bold">{quartsNeeded}</p>
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
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Paintable Wall Area</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{totalPaintableSqFt.toFixed(0)} sq ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Number of Coats</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{numCoats}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Sq Ft to Paint</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{totalSqFtWithCoats.toFixed(0)} sq ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Coverage per Gallon</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{coverage} sq ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Gallons (exact)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{gallonsNeeded.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Estimated Paint Cost</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(cost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {inputMode === "rooms" && rooms.length > 1 && (
              <div className="tool-card mb-6">
                <h2 className="text-lg font-bold mb-4">Room Breakdown</h2>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Room</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Wall Area</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Gallons</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((r) => {
                      const area = roomWallArea(r);
                      return (
                        <tr key={r.id} className="hover:bg-[var(--muted-bg)]">
                          <td className="border border-[var(--card-border)] px-3 py-2">{r.name}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{area.toFixed(0)} sq ft</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{((area * numCoats) / coverage).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Total</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold">{totalPaintableSqFt.toFixed(0)} sq ft</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold">{gallonsNeeded.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Much Paint Do I Need?</h2>
          <p>
            This free paint calculator helps you estimate the exact amount of paint needed for any room or project.
            Whether you are painting one room or an entire house, the calculator accounts for room dimensions, doors,
            windows, number of coats, and paint coverage to give you an accurate gallon estimate. Stop guessing and
            avoid wasteful trips to the store with precise calculations.
          </p>

          <h2>How to Use the Paint Calculator</h2>
          <p>
            Enter your room dimensions — length, width, and ceiling height in feet. The calculator automatically
            computes the total wall area using the perimeter method: 2 x (Length + Width) x Height. Specify the number
            of doors and windows to deduct their area (20 sq ft per door, 15 sq ft per window). Select the number of
            coats (most projects need 2 coats) and your paint coverage rate. For multi-room projects, click &quot;Add
            Another Room&quot; to calculate everything at once. Alternatively, enter your wall area directly if you
            already know it.
          </p>

          <h2>Paint Calculation Formula</h2>
          <ul>
            <li><strong>Wall Area:</strong> 2 x (Length + Width) x Height</li>
            <li><strong>Deductions:</strong> (Doors x 20 sq ft) + (Windows x 15 sq ft)</li>
            <li><strong>Paintable Area:</strong> Wall Area - Deductions</li>
            <li><strong>Total Sq Ft:</strong> Paintable Area x Number of Coats</li>
            <li><strong>Gallons:</strong> Total Sq Ft / Coverage per Gallon (typically 350-400 sq ft)</li>
          </ul>

          <h3>Common Paint Questions</h3>
          <p>
            <strong>How much does a gallon of paint cover?</strong> One gallon of interior latex paint covers
            approximately 350 to 400 square feet on smooth surfaces. Rough or textured walls may reduce coverage to
            250-300 square feet per gallon. Always check the manufacturer&apos;s label for specific coverage rates.
          </p>
          <p>
            <strong>How many coats of paint do I need?</strong> Most interior painting projects require 2 coats for
            even coverage and color consistency. If you are painting over a similar color, 1 coat may suffice with
            a high-quality paint-and-primer combo. Dramatic color changes (such as dark to light) may need 3 coats
            or a tinted primer.
          </p>
          <p>
            <strong>Should I buy gallons or quarts?</strong> Gallons are more cost-effective for rooms and larger
            areas. Quarts are ideal for small projects like accent walls, touch-ups, or trim. A quart covers about
            90-100 square feet per coat.
          </p>

          <h3>Paint Buying Tips</h3>
          <ul>
            <li>Budget paint ($20-$30/gallon) may require more coats; premium paint ($40-$70/gallon) covers better</li>
            <li>Paint-and-primer combos save time and can reduce the number of coats needed</li>
            <li>Buy all paint at once to ensure consistent color across the room</li>
            <li>Keep leftover paint for touch-ups — store sealed cans at room temperature</li>
            <li>Flat/matte finishes hide imperfections; satin and semi-gloss are easier to clean</li>
            <li>One gallon of ceiling paint covers about 400 sq ft; ceilings often need only 1 coat</li>
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
            name: "Paint Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/paint-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
