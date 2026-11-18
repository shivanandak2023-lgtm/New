"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Flooring Calculator - How Much Flooring Do I Need?",
  description:
    "Free flooring calculator to estimate square footage, boxes, underlayment, and cost for hardwood, laminate, vinyl plank, tile, and carpet flooring projects.",
  keywords:
    "flooring calculator, how much flooring do I need, flooring calculator square feet, hardwood flooring calculator, laminate flooring calculator, tile calculator, carpet calculator, flooring cost estimator",
};

type FlooringType = "hardwood" | "laminate" | "vinyl" | "tile" | "carpet";

interface Room {
  id: number;
  name: string;
  lengthFt: string;
  widthFt: string;
}

const FLOORING_INFO: Record<FlooringType, { label: string; costPerSqft: number; boxSqft: number }> = {
  hardwood: { label: "Hardwood", costPerSqft: 8, boxSqft: 20 },
  laminate: { label: "Laminate", costPerSqft: 3, boxSqft: 24 },
  vinyl: { label: "Vinyl Plank", costPerSqft: 4, boxSqft: 24 },
  tile: { label: "Tile", costPerSqft: 6, boxSqft: 15 },
  carpet: { label: "Carpet", costPerSqft: 5, boxSqft: 0 },
};

function createRoom(id: number): Room {
  return { id, name: `Room ${id}`, lengthFt: "12", widthFt: "10" };
}

export default function FlooringCalculatorPage() {
  const [rooms, setRooms] = useState<Room[]>([createRoom(1)]);
  const [flooringType, setFlooringType] = useState<FlooringType>("hardwood");
  const [wastePercent, setWastePercent] = useState("10");
  const [customBoxSqft, setCustomBoxSqft] = useState("");
  const [customCostPerSqft, setCustomCostPerSqft] = useState("");
  const [calculated, setCalculated] = useState(false);

  const info = FLOORING_INFO[flooringType];

  function updateRoom(id: number, field: string, value: string) {
    setRooms(rooms.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function addRoom() {
    setRooms([...rooms, createRoom(rooms.length + 1)]);
  }

  function removeRoom(id: number) {
    if (rooms.length > 1) setRooms(rooms.filter((r) => r.id !== id));
  }

  function calculate() {
    setCalculated(true);
  }

  const waste = Math.min(Math.max(parseFloat(wastePercent) || 10, 5), 15);
  const boxSqft = parseFloat(customBoxSqft) || info.boxSqft;
  const costSqft = parseFloat(customCostPerSqft) || info.costPerSqft;

  const roomAreas = rooms.map((r) => {
    const l = parseFloat(r.lengthFt) || 0;
    const w = parseFloat(r.widthFt) || 0;
    return { ...r, area: l * w };
  });

  const totalSqft = roomAreas.reduce((sum, r) => sum + r.area, 0);
  const totalWithWaste = totalSqft * (1 + waste / 100);
  const boxesNeeded = boxSqft > 0 ? Math.ceil(totalWithWaste / boxSqft) : 0;
  const underlaymentSqft = flooringType !== "carpet" ? Math.ceil(totalWithWaste) : 0;
  const transitionStrips = rooms.length;
  const totalCost = totalWithWaste * costSqft;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/flooring-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/flooring-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Flooring Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate how much flooring you need in square feet, boxes, and estimated cost. Supports multiple rooms with waste factor for hardwood, laminate, vinyl, tile, and carpet.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

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
                <button onClick={() => removeRoom(room.id)} className="text-red-500 text-sm hover:underline">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Length (ft)</label>
                <input type="number" value={room.lengthFt} onChange={(e) => updateRoom(room.id, "lengthFt", e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Width (ft)</label>
                <input type="number" value={room.widthFt} onChange={(e) => updateRoom(room.id, "widthFt", e.target.value)} className="input-field" />
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-4 mb-6">
          <button onClick={addRoom} className="text-sm text-[var(--primary)] hover:underline">
            + Add Another Room
          </button>
        </div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Flooring Type</label>
              <select value={flooringType} onChange={(e) => setFlooringType(e.target.value as FlooringType)} className="input-field">
                <option value="hardwood">Hardwood ($8/sq ft avg)</option>
                <option value="laminate">Laminate ($3/sq ft avg)</option>
                <option value="vinyl">Vinyl Plank ($4/sq ft avg)</option>
                <option value="tile">Tile ($6/sq ft avg)</option>
                <option value="carpet">Carpet ($5/sq ft avg)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Waste Factor (%)</label>
              <input type="number" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} className="input-field" min="5" max="15" />
              <p className="text-xs text-[var(--muted)] mt-1">5-15% recommended</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Sq Ft per Box (optional)</label>
              <input type="number" value={customBoxSqft} onChange={(e) => setCustomBoxSqft(e.target.value)} className="input-field" placeholder={`Default: ${info.boxSqft}`} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost per Sq Ft (optional)</label>
              <input type="number" value={customCostPerSqft} onChange={(e) => setCustomCostPerSqft(e.target.value)} className="input-field" placeholder={`Default: $${info.costPerSqft}`} step="0.25" />
            </div>
          </div>

          <button onClick={calculate} className="btn-primary">Calculate Flooring</button>
        </div>

        {calculated && totalSqft > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Sq Ft (with waste)</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{totalWithWaste.toFixed(0)} sq ft</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{boxSqft > 0 ? "Boxes Needed" : "Raw Area"}</p>
                <p className="text-2xl font-bold text-green-700">{boxSqft > 0 ? boxesNeeded : `${totalSqft.toFixed(0)} sq ft`}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Estimated Cost</p>
                <p className="text-2xl font-bold">{fmt(totalCost)}</p>
                <p className="text-xs text-[var(--muted)]">material only</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Materials Summary</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Item</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Amount</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">{info.label} Flooring</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{totalWithWaste.toFixed(0)} sq ft</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(totalCost)}</td>
                  </tr>
                  {boxSqft > 0 && (
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Boxes/Cartons ({boxSqft} sq ft each)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{boxesNeeded} boxes</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">-</td>
                    </tr>
                  )}
                  {underlaymentSqft > 0 && (
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Underlayment</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{underlaymentSqft} sq ft</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">-</td>
                    </tr>
                  )}
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Transition Strips</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{transitionStrips}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {rooms.length > 1 && (
              <div className="tool-card mb-6">
                <h2 className="text-lg font-bold mb-4">Room Breakdown</h2>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Room</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Sq Ft</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomAreas.map((r) => (
                      <tr key={r.id} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{r.name}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{r.area.toFixed(0)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(r.area * (1 + waste / 100) * costSqft)}</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Total</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold">{totalSqft.toFixed(0)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(totalCost)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Flooring for Your Home</h2>
          <p>
            Calculating the right amount of flooring is essential for any home renovation project. Whether you are
            installing hardwood, laminate, vinyl plank, tile, or carpet, buying too little means delays while buying
            too much wastes money. Our flooring calculator helps homeowners and contractors across the United States
            accurately estimate materials needed for single or multi-room flooring projects.
          </p>

          <h2>Flooring Calculation Formula</h2>
          <p>
            The basic formula is simple: <strong>Room Length (ft) x Room Width (ft) = Square Footage</strong>. Then
            add a waste factor of 5-15% depending on the installation pattern and room complexity. Diagonal or
            herringbone patterns require 15% waste, while straight lay patterns only need 5-10%. For multiple rooms,
            calculate each room separately and add the totals together.
          </p>

          <h2>Why Add a Waste Factor?</h2>
          <p>
            Waste is inevitable in any flooring project. Cuts along walls, around doorways, and at transitions create
            unusable pieces. Complex room shapes, closets, and hallways increase waste further. Additionally, keeping
            a few extra planks or tiles on hand for future repairs is highly recommended. Industry professionals
            typically use 10% as the standard waste allowance for rectangular rooms.
          </p>

          <h2>Flooring Cost Comparison</h2>
          <ul>
            <li><strong>Hardwood:</strong> $6-$12 per sq ft installed, 20-25 year lifespan, can be refinished</li>
            <li><strong>Laminate:</strong> $2-$5 per sq ft installed, 15-25 year lifespan, affordable wood look</li>
            <li><strong>Vinyl Plank (LVP):</strong> $3-$7 per sq ft installed, 15-20 year lifespan, waterproof</li>
            <li><strong>Tile:</strong> $5-$10 per sq ft installed, 50+ year lifespan, ideal for wet areas</li>
            <li><strong>Carpet:</strong> $3-$8 per sq ft installed, 5-15 year lifespan, warm and soft underfoot</li>
          </ul>

          <h2>What Is Underlayment and Do I Need It?</h2>
          <p>
            Underlayment is a thin layer of material installed between the subfloor and the flooring surface. It
            provides moisture protection, sound dampening, and a smoother surface for the flooring to sit on. Most
            hardwood, laminate, and vinyl plank floors require underlayment. Some premium vinyl planks and laminates
            come with underlayment already attached. Carpet uses a separate carpet pad instead of traditional
            underlayment.
          </p>

          <h2>Transition Strips</h2>
          <p>
            Transition strips are used where two different flooring types meet, at doorways, or where the floor
            changes elevation. Plan for one transition strip at each doorway and anywhere two different floor materials
            connect. T-moldings, reducers, and thresholds are the most common types. They typically cost $5-$20 each
            depending on the material and finish.
          </p>

          <h3>Tips for Buying Flooring</h3>
          <ul>
            <li>Measure each room separately for more accurate estimates</li>
            <li>Buy all flooring from the same lot number to ensure consistent color and pattern</li>
            <li>Acclimate hardwood and laminate flooring in your home for 48-72 hours before installation</li>
            <li>Keep leftover flooring for future repairs and replacements</li>
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
            name: "Flooring Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/flooring-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
