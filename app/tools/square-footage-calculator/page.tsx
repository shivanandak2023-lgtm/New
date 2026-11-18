"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Square Footage Calculator - Calculate Room & Floor Area",
  description:
    "Free square footage calculator for rectangles, L-shapes, circles, and triangles. Add multiple rooms to get total sqft with cost estimates for flooring and painting.",
  keywords:
    "square footage calculator, sq ft calculator, room size calculator, floor area calculator, land area calculator, sqft to cost, flooring calculator",
};

type RoomShape = "rectangle" | "lshape" | "circle" | "triangle";

interface Room {
  id: number;
  shape: RoomShape;
  name: string;
  lengthFt: string;
  lengthIn: string;
  widthFt: string;
  widthIn: string;
  length2Ft: string;
  length2In: string;
  width2Ft: string;
  width2In: string;
  radiusFt: string;
  radiusIn: string;
  baseFt: string;
  baseIn: string;
  heightFt: string;
  heightIn: string;
  sqft: number;
}

function createRoom(id: number): Room {
  return {
    id,
    shape: "rectangle",
    name: `Room ${id}`,
    lengthFt: "12", lengthIn: "0",
    widthFt: "10", widthIn: "0",
    length2Ft: "6", length2In: "0",
    width2Ft: "5", width2In: "0",
    radiusFt: "8", radiusIn: "0",
    baseFt: "10", baseIn: "0",
    heightFt: "8", heightIn: "0",
    sqft: 0,
  };
}

export default function SquareFootageCalculatorPage() {
  const [rooms, setRooms] = useState<Room[]>([createRoom(1)]);
  const [pricePerSqft, setPricePerSqft] = useState<string>("6");
  const [calculated, setCalculated] = useState(false);

  function toFeet(ft: string, inches: string): number {
    return (parseFloat(ft) || 0) + (parseFloat(inches) || 0) / 12;
  }

  function calcRoom(room: Room): number {
    switch (room.shape) {
      case "rectangle": {
        const l = toFeet(room.lengthFt, room.lengthIn);
        const w = toFeet(room.widthFt, room.widthIn);
        return l * w;
      }
      case "lshape": {
        const l1 = toFeet(room.lengthFt, room.lengthIn);
        const w1 = toFeet(room.widthFt, room.widthIn);
        const l2 = toFeet(room.length2Ft, room.length2In);
        const w2 = toFeet(room.width2Ft, room.width2In);
        return (l1 * w1) + (l2 * w2);
      }
      case "circle": {
        const r = toFeet(room.radiusFt, room.radiusIn);
        return Math.PI * r * r;
      }
      case "triangle": {
        const b = toFeet(room.baseFt, room.baseIn);
        const h = toFeet(room.heightFt, room.heightIn);
        return 0.5 * b * h;
      }
      default:
        return 0;
    }
  }

  function calculate() {
    const updated = rooms.map((r) => ({ ...r, sqft: calcRoom(r) }));
    setRooms(updated);
    setCalculated(true);
  }

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

  const totalSqft = rooms.reduce((sum, r) => sum + r.sqft, 0);
  const price = parseFloat(pricePerSqft) || 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/square-footage-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Square Footage Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate the square footage of rooms in various shapes. Add multiple rooms to get total area with cost estimates for flooring, painting, and more.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {rooms.map((room, idx) => (
          <div key={room.id} className="tool-card mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={room.name}
                  onChange={(e) => updateRoom(room.id, "name", e.target.value)}
                  className="input-field w-40 text-sm font-semibold"
                />
                <select
                  value={room.shape}
                  onChange={(e) => updateRoom(room.id, "shape", e.target.value)}
                  className="input-field w-36 text-sm"
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="lshape">L-Shape</option>
                  <option value="circle">Circle</option>
                  <option value="triangle">Triangle</option>
                </select>
              </div>
              {rooms.length > 1 && (
                <button onClick={() => removeRoom(room.id)} className="text-red-500 text-sm hover:underline">
                  Remove
                </button>
              )}
            </div>

            {room.shape === "rectangle" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Length (ft)</label>
                  <input type="number" value={room.lengthFt} onChange={(e) => updateRoom(room.id, "lengthFt", e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Length (in)</label>
                  <input type="number" value={room.lengthIn} onChange={(e) => updateRoom(room.id, "lengthIn", e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Width (ft)</label>
                  <input type="number" value={room.widthFt} onChange={(e) => updateRoom(room.id, "widthFt", e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Width (in)</label>
                  <input type="number" value={room.widthIn} onChange={(e) => updateRoom(room.id, "widthIn", e.target.value)} className="input-field" />
                </div>
              </div>
            )}

            {room.shape === "lshape" && (
              <>
                <p className="text-xs text-[var(--muted)] mb-2">Section 1</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Length (ft)</label>
                    <input type="number" value={room.lengthFt} onChange={(e) => updateRoom(room.id, "lengthFt", e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Length (in)</label>
                    <input type="number" value={room.lengthIn} onChange={(e) => updateRoom(room.id, "lengthIn", e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Width (ft)</label>
                    <input type="number" value={room.widthFt} onChange={(e) => updateRoom(room.id, "widthFt", e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Width (in)</label>
                    <input type="number" value={room.widthIn} onChange={(e) => updateRoom(room.id, "widthIn", e.target.value)} className="input-field" />
                  </div>
                </div>
                <p className="text-xs text-[var(--muted)] mb-2">Section 2</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Length (ft)</label>
                    <input type="number" value={room.length2Ft} onChange={(e) => updateRoom(room.id, "length2Ft", e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Length (in)</label>
                    <input type="number" value={room.length2In} onChange={(e) => updateRoom(room.id, "length2In", e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Width (ft)</label>
                    <input type="number" value={room.width2Ft} onChange={(e) => updateRoom(room.id, "width2Ft", e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Width (in)</label>
                    <input type="number" value={room.width2In} onChange={(e) => updateRoom(room.id, "width2In", e.target.value)} className="input-field" />
                  </div>
                </div>
              </>
            )}

            {room.shape === "circle" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Radius (ft)</label>
                  <input type="number" value={room.radiusFt} onChange={(e) => updateRoom(room.id, "radiusFt", e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Radius (in)</label>
                  <input type="number" value={room.radiusIn} onChange={(e) => updateRoom(room.id, "radiusIn", e.target.value)} className="input-field" />
                </div>
              </div>
            )}

            {room.shape === "triangle" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Base (ft)</label>
                  <input type="number" value={room.baseFt} onChange={(e) => updateRoom(room.id, "baseFt", e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Base (in)</label>
                  <input type="number" value={room.baseIn} onChange={(e) => updateRoom(room.id, "baseIn", e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height (ft)</label>
                  <input type="number" value={room.heightFt} onChange={(e) => updateRoom(room.id, "heightFt", e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height (in)</label>
                  <input type="number" value={room.heightIn} onChange={(e) => updateRoom(room.id, "heightIn", e.target.value)} className="input-field" />
                </div>
              </div>
            )}

            {calculated && room.sqft > 0 && (
              <p className="mt-3 text-sm font-semibold text-[var(--primary)]">
                {room.name}: {room.sqft.toFixed(2)} sq ft
              </p>
            )}
          </div>
        ))}

        <div className="flex gap-4 mb-8">
          <button onClick={addRoom} className="text-sm text-[var(--primary)] hover:underline">
            + Add Another Room
          </button>
        </div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Price per Sq Ft ($)</label>
              <input
                type="number"
                value={pricePerSqft}
                onChange={(e) => setPricePerSqft(e.target.value)}
                className="input-field"
                placeholder="e.g., 6"
                step="0.25"
              />
              <p className="text-xs text-[var(--muted)] mt-1">For flooring, painting, or other cost estimates</p>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Square Footage
          </button>
        </div>

        {calculated && totalSqft > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Square Footage</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{totalSqft.toFixed(2)} sq ft</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Square Meters</p>
                <p className="text-2xl font-bold text-green-700">{(totalSqft * 0.0929).toFixed(2)} m&sup2;</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Estimated Cost</p>
                <p className="text-2xl font-bold">{price > 0 ? fmtExact(totalSqft * price) : "N/A"}</p>
              </div>
            </div>

            {rooms.length > 1 && (
              <div className="tool-card mb-6">
                <h2 className="text-lg font-bold mb-4">Room Breakdown</h2>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Room</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Shape</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Sq Ft</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room.id} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{room.name}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 capitalize">{room.shape === "lshape" ? "L-Shape" : room.shape}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{room.sqft.toFixed(2)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{price > 0 ? fmtExact(room.sqft * price) : "N/A"}</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold" colSpan={2}>Total</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold">{totalSqft.toFixed(2)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{price > 0 ? fmtExact(totalSqft * price) : "N/A"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Square Footage</h2>
          <p>
            Square footage is the area of a space measured in square feet (sq ft). It is commonly used in the United States
            for measuring rooms, homes, flooring, and land. The formula depends on the shape of the area.
          </p>

          <h2>Square Footage Formulas</h2>
          <ul>
            <li><strong>Rectangle:</strong> Length x Width</li>
            <li><strong>L-Shape:</strong> Split into two rectangles, calculate each, then add together</li>
            <li><strong>Circle:</strong> &pi; x Radius&sup2;</li>
            <li><strong>Triangle:</strong> 0.5 x Base x Height</li>
          </ul>

          <h2>Common Uses for Square Footage</h2>
          <ul>
            <li>Estimating flooring costs (hardwood, tile, carpet)</li>
            <li>Calculating paint needed for walls</li>
            <li>Measuring room sizes for furniture placement</li>
            <li>Comparing home or apartment sizes</li>
            <li>Calculating landscaping materials</li>
          </ul>

          <h3>Quick Conversions</h3>
          <ul>
            <li>1 square foot = 0.0929 square meters</li>
            <li>1 square foot = 144 square inches</li>
            <li>1 acre = 43,560 square feet</li>
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
            name: "Square Footage Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/square-footage-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
