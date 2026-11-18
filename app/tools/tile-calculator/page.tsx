"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Tile Calculator - Free Square Feet & Cost Estimator (2025)",
  description:
    "Tile calculator to estimate how many tiles you need. Calculate square feet, boxes, waste, and cost for floors, walls, and backsplashes.",
  keywords:
    "tile calculator, how many tiles do I need, tile calculator square feet, floor tile calculator, tile cost calculator, tile coverage calculator, ceramic tile calculator, backsplash tile calculator, tile waste calculator, tile per square foot",
};

interface TileSize {
  label: string;
  widthIn: number;
  heightIn: number;
}

const TILE_SIZES: TileSize[] = [
  { label: '6" x 6"', widthIn: 6, heightIn: 6 },
  { label: '12" x 12"', widthIn: 12, heightIn: 12 },
  { label: '12" x 24"', widthIn: 12, heightIn: 24 },
  { label: '18" x 18"', widthIn: 18, heightIn: 18 },
  { label: '24" x 24"', widthIn: 24, heightIn: 24 },
  { label: "Custom", widthIn: 0, heightIn: 0 },
];

interface PatternType {
  name: string;
  wastePercent: number;
}

const PATTERNS: PatternType[] = [
  { name: "Straight Lay", wastePercent: 10 },
  { name: "Diagonal (45°)", wastePercent: 15 },
  { name: "Herringbone", wastePercent: 20 },
];

export default function TileCalculatorPage() {
  const [roomLengthFt, setRoomLengthFt] = useState("12");
  const [roomWidthFt, setRoomWidthFt] = useState("10");
  const [tileSizeIdx, setTileSizeIdx] = useState(1);
  const [customTileW, setCustomTileW] = useState("12");
  const [customTileH, setCustomTileH] = useState("12");
  const [groutWidth, setGroutWidth] = useState("0.125");
  const [patternIdx, setPatternIdx] = useState(0);
  const [tilesPerBox, setTilesPerBox] = useState("12");
  const [costPerSqFt, setCostPerSqFt] = useState("3");
  const [calculated, setCalculated] = useState(false);

  function calculate() {
    setCalculated(true);
  }

  const roomSqFt = (parseFloat(roomLengthFt) || 0) * (parseFloat(roomWidthFt) || 0);
  const tileSize = TILE_SIZES[tileSizeIdx];
  const tileW = tileSize.label === "Custom" ? (parseFloat(customTileW) || 12) : tileSize.widthIn;
  const tileH = tileSize.label === "Custom" ? (parseFloat(customTileH) || 12) : tileSize.heightIn;
  const grout = parseFloat(groutWidth) || 0;
  const tileWithGroutW = tileW + grout;
  const tileWithGroutH = tileH + grout;
  const tileSqFt = (tileWithGroutW * tileWithGroutH) / 144;
  const pattern = PATTERNS[patternIdx];
  const wasteFactor = 1 + pattern.wastePercent / 100;
  const tilesNeeded = tileSqFt > 0 ? Math.ceil((roomSqFt / tileSqFt) * wasteFactor) : 0;
  const perBox = parseInt(tilesPerBox) || 12;
  const boxesNeeded = Math.ceil(tilesNeeded / perBox);
  const totalSqFtWithWaste = roomSqFt * wasteFactor;
  const costPerFt = parseFloat(costPerSqFt) || 3;
  const totalCost = totalSqFtWithWaste * costPerFt;

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/tile-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/tile-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Tile Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate how many tiles you need for your floor, wall, or backsplash. Get waste estimates by pattern type and total project cost.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Room Length (ft)</label>
              <input type="number" value={roomLengthFt} onChange={(e) => setRoomLengthFt(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Room Width (ft)</label>
              <input type="number" value={roomWidthFt} onChange={(e) => setRoomWidthFt(e.target.value)} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tile Size</label>
              <select value={tileSizeIdx} onChange={(e) => setTileSizeIdx(parseInt(e.target.value))} className="input-field">
                {TILE_SIZES.map((s, i) => (
                  <option key={i} value={i}>{s.label}</option>
                ))}
              </select>
            </div>
            {TILE_SIZES[tileSizeIdx].label === "Custom" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Tile Width (in)</label>
                  <input type="number" value={customTileW} onChange={(e) => setCustomTileW(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tile Height (in)</label>
                  <input type="number" value={customTileH} onChange={(e) => setCustomTileH(e.target.value)} className="input-field" />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Grout Width (in)</label>
              <input type="number" value={groutWidth} onChange={(e) => setGroutWidth(e.target.value)} className="input-field" step="0.0625" />
              <p className="text-xs text-[var(--muted)] mt-1">Standard: 1/8&quot; (0.125)</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pattern</label>
              <select value={patternIdx} onChange={(e) => setPatternIdx(parseInt(e.target.value))} className="input-field">
                {PATTERNS.map((p, i) => (
                  <option key={i} value={i}>{p.name} (+{p.wastePercent}% waste)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tiles per Box</label>
              <input type="number" value={tilesPerBox} onChange={(e) => setTilesPerBox(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost per Sq Ft ($)</label>
              <input type="number" value={costPerSqFt} onChange={(e) => setCostPerSqFt(e.target.value)} className="input-field" step="0.5" />
            </div>
          </div>

          <button onClick={calculate} className="btn-primary">Calculate Tiles</button>
        </div>

        {calculated && roomSqFt > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Room Area</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{roomSqFt.toFixed(0)} sq ft</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Tiles Needed</p>
                <p className="text-2xl font-bold text-green-700">{tilesNeeded}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Boxes</p>
                <p className="text-2xl font-bold">{boxesNeeded}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Est. Cost</p>
                <p className="text-2xl font-bold">{fmtExact(totalCost)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Detailed Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Room Area</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{roomSqFt.toFixed(1)} sq ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Tile Size (with grout)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{tileWithGroutW.toFixed(2)}&quot; x {tileWithGroutH.toFixed(2)}&quot;</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Tile Area (each)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{tileSqFt.toFixed(3)} sq ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Pattern</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{pattern.name}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Waste Factor</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">+{pattern.wastePercent}%</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Sq Ft (with waste)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{totalSqFtWithWaste.toFixed(1)} sq ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Tiles Needed</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{tilesNeeded} tiles</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Boxes ({perBox} tiles/box)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{boxesNeeded} boxes</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Estimated Material Cost</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(totalCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Many Tiles Do I Need?</h2>
          <p>
            This free tile calculator helps you figure out exactly how many tiles you need for your flooring, wall, or
            backsplash project. It accounts for tile size, grout spacing, layout pattern, and waste percentage so you
            can order the right amount the first time. Whether you are tiling a bathroom, kitchen, or entire floor,
            this tool eliminates the guesswork and helps you budget accurately.
          </p>

          <h2>How to Use the Tile Calculator</h2>
          <p>
            Measure your room length and width in feet. Select the tile size you plan to use or enter custom dimensions.
            Choose your grout width — standard grout lines are 1/8 inch for rectified tiles and 3/16 inch for standard
            tiles. Pick your layout pattern, as diagonal and herringbone patterns require more tiles due to cuts.
            Enter how many tiles come per box (check the product listing) and the cost per square foot for an accurate
            cost estimate.
          </p>

          <h2>Tile Calculation Formula</h2>
          <ul>
            <li><strong>Room Area:</strong> Length (ft) x Width (ft) = Square Feet</li>
            <li><strong>Tile Area (each):</strong> (Tile Width + Grout) x (Tile Height + Grout) / 144 = Sq Ft per tile</li>
            <li><strong>Tiles Needed:</strong> (Room Sq Ft / Tile Sq Ft) x Waste Factor, rounded up</li>
            <li><strong>Boxes:</strong> Tiles Needed / Tiles per Box, rounded up</li>
          </ul>

          <h3>Common Tile Questions</h3>
          <p>
            <strong>How much extra tile should I buy for waste?</strong> For a straight lay pattern, buy 10% extra.
            Diagonal patterns require 15% extra, and herringbone patterns need 20% extra. If your room has many
            obstacles like corners, columns, or curves, add even more.
          </p>
          <p>
            <strong>What size tile is best for small rooms?</strong> Larger tiles (12x24 or 18x18) can actually make
            small rooms appear bigger because there are fewer grout lines. However, very large tiles may require more
            cuts in tight spaces, increasing waste.
          </p>
          <p>
            <strong>How much does tile installation cost?</strong> Tile material typically costs $1-$15 per square foot.
            Professional installation adds $5-$15 per square foot depending on complexity. Budget an additional $1-$3
            per square foot for grout, mortar, and supplies.
          </p>

          <h3>Tile Buying Tips</h3>
          <ul>
            <li>Always buy all tile from the same lot number to ensure consistent color</li>
            <li>Keep extra tiles for future repairs — matching discontinued tiles is difficult</li>
            <li>Ceramic tiles ($1-$5/sq ft) are budget-friendly; porcelain ($3-$10/sq ft) is more durable</li>
            <li>Natural stone tiles ($5-$15/sq ft) require sealing and more maintenance</li>
            <li>Rectified (precision-cut) tiles allow thinner grout lines for a modern look</li>
            <li>Check tile ratings: PEI 3+ for residential floors, PEI 4+ for high-traffic areas</li>
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
            name: "Tile Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/tile-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
