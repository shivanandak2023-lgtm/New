"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Decking Calculator - Free Boards, Joists & Cost Estimator (2025)",
  description:
    "Decking calculator to estimate boards, joists, screws, and cost. Calculate how much decking you need for pressure treated, composite, and cedar decks.",
  keywords:
    "deck calculator, decking calculator, how much decking do I need, deck board calculator, deck cost calculator, composite decking calculator, deck material calculator, deck joist calculator, deck square footage, deck estimator",
};

interface DeckingType {
  name: string;
  costPerSqFtLow: number;
  costPerSqFtHigh: number;
}

const DECKING_TYPES: DeckingType[] = [
  { name: "Pressure Treated", costPerSqFtLow: 2, costPerSqFtHigh: 5 },
  { name: "Composite", costPerSqFtLow: 6, costPerSqFtHigh: 12 },
  { name: "Cedar", costPerSqFtLow: 4, costPerSqFtHigh: 8 },
  { name: "Tropical Hardwood (Ipe)", costPerSqFtLow: 8, costPerSqFtHigh: 15 },
];

interface BoardSize {
  label: string;
  widthIn: number;
  thicknessIn: number;
}

const BOARD_SIZES: BoardSize[] = [
  { label: '5/4" x 6"', widthIn: 5.5, thicknessIn: 1.0 },
  { label: '2" x 6"', widthIn: 5.5, thicknessIn: 1.5 },
];

export default function DeckingCalculatorPage() {
  const [deckLengthFt, setDeckLengthFt] = useState("20");
  const [deckWidthFt, setDeckWidthFt] = useState("12");
  const [boardSizeIdx, setBoardSizeIdx] = useState(0);
  const [boardLengthFt, setBoardLengthFt] = useState("12");
  const [joistSpacing, setJoistSpacing] = useState("16");
  const [deckingTypeIdx, setDeckingTypeIdx] = useState(0);
  const [calculated, setCalculated] = useState(false);

  function calculate() {
    setCalculated(true);
  }

  const deckLength = parseFloat(deckLengthFt) || 0;
  const deckWidth = parseFloat(deckWidthFt) || 0;
  const totalSqFt = deckLength * deckWidth;
  const board = BOARD_SIZES[boardSizeIdx];
  const boardLen = parseFloat(boardLengthFt) || 12;
  const boardWidthFt = board.widthIn / 12;
  const boardCoverage = boardWidthFt * boardLen;
  const boardsNeeded = boardCoverage > 0 ? Math.ceil((totalSqFt / boardCoverage) * 1.1) : 0;
  const spacing = parseInt(joistSpacing) || 16;
  const joists = deckWidth > 0 ? Math.ceil((deckLength * 12) / spacing) + 1 : 0;
  const rimJoists = 2;
  const totalJoists = joists + rimJoists;
  const screwsPerSqFt = 2.5;
  const screwsNeeded = Math.ceil(totalSqFt * screwsPerSqFt);
  const screwsPerBox = 350;
  const screwBoxes = Math.ceil(screwsNeeded / screwsPerBox);
  const selected = DECKING_TYPES[deckingTypeIdx];
  const costLow = totalSqFt * selected.costPerSqFtLow;
  const costHigh = totalSqFt * selected.costPerSqFtHigh;
  const costMid = (costLow + costHigh) / 2;

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/decking-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/decking-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Decking Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate how much decking you need — boards, joists, screws, and estimated cost for pressure treated, composite, cedar, and hardwood decks.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Deck Length (ft)</label>
              <input type="number" value={deckLengthFt} onChange={(e) => setDeckLengthFt(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deck Width (ft)</label>
              <input type="number" value={deckWidthFt} onChange={(e) => setDeckWidthFt(e.target.value)} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Board Size</label>
              <select value={boardSizeIdx} onChange={(e) => setBoardSizeIdx(parseInt(e.target.value))} className="input-field">
                {BOARD_SIZES.map((b, i) => (
                  <option key={i} value={i}>{b.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Board Length (ft)</label>
              <select value={boardLengthFt} onChange={(e) => setBoardLengthFt(e.target.value)} className="input-field">
                <option value="8">8 ft</option>
                <option value="10">10 ft</option>
                <option value="12">12 ft</option>
                <option value="16">16 ft</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Joist Spacing</label>
              <select value={joistSpacing} onChange={(e) => setJoistSpacing(e.target.value)} className="input-field">
                <option value="12">12 inches (heavy loads)</option>
                <option value="16">16 inches (standard)</option>
                <option value="24">24 inches (light loads)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Decking Type</label>
              <select value={deckingTypeIdx} onChange={(e) => setDeckingTypeIdx(parseInt(e.target.value))} className="input-field">
                {DECKING_TYPES.map((t, i) => (
                  <option key={i} value={i}>{t.name} (${t.costPerSqFtLow}-${t.costPerSqFtHigh}/sq ft)</option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary">Calculate Decking</button>
        </div>

        {calculated && totalSqFt > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Area</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{totalSqFt.toFixed(0)} sq ft</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Deck Boards</p>
                <p className="text-2xl font-bold text-green-700">{boardsNeeded}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Joists</p>
                <p className="text-2xl font-bold">{totalJoists}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Est. Cost</p>
                <p className="text-2xl font-bold">{fmtExact(costMid)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Materials Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Deck Size</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{deckLength} ft x {deckWidth} ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Area</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{totalSqFt.toFixed(0)} sq ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Board Size</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{board.label} x {boardLen} ft</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Deck Boards (incl. 10% waste)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{boardsNeeded} boards</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Joists ({spacing}&quot; spacing)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{joists} + {rimJoists} rim = {totalJoists}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Screws/Fasteners</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{screwsNeeded} (~{screwBoxes} boxes of {screwsPerBox})</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Decking Type</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{selected.name}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Material Cost Range</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(costLow)} - {fmtExact(costHigh)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Estimated Material Cost</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(costMid)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Much Decking Do I Need?</h2>
          <p>
            This free decking calculator helps you estimate the exact materials needed to build your deck. Enter your
            deck dimensions, choose your board size and material type, and the calculator will provide a complete
            materials list including deck boards, joists, screws, and estimated cost. Whether you are building a
            small patio deck or a large multi-level deck, this tool saves you time and money by ensuring you buy the
            right amount of materials.
          </p>

          <h2>How to Use the Decking Calculator</h2>
          <p>
            Measure the planned deck area in feet — length and width. Select your deck board size (5/4x6 is the most
            common residential choice; 2x6 is heavier-duty). Choose the board length that best minimizes waste —
            12-foot boards are the most popular for residential decks. Set your joist spacing (16 inches on center is
            standard for most decking; 12 inches for composite or diagonal layouts). Finally, select your decking
            material to see cost estimates.
          </p>

          <h2>Decking Calculation Formula</h2>
          <ul>
            <li><strong>Deck Area:</strong> Length (ft) x Width (ft) = Square Feet</li>
            <li><strong>Board Coverage:</strong> Board Width (ft) x Board Length (ft) = Sq Ft per board</li>
            <li><strong>Boards Needed:</strong> (Deck Area / Board Coverage) x 1.10 (10% waste factor)</li>
            <li><strong>Joists:</strong> (Deck Length x 12 / Joist Spacing) + 1 + 2 rim joists</li>
            <li><strong>Screws:</strong> ~2.5 screws per square foot of decking</li>
          </ul>

          <h3>Common Decking Questions</h3>
          <p>
            <strong>What joist spacing should I use?</strong> Standard joist spacing is 16 inches on center for most
            wood and composite decking. Use 12-inch spacing for diagonal board patterns, heavy-load areas, or when
            required by composite manufacturers. 24-inch spacing is acceptable only for 2x6 or thicker boards on
            light-use decks.
          </p>
          <p>
            <strong>How much does it cost to build a deck?</strong> Material costs range from $2-$5 per square foot
            for pressure treated lumber to $8-$15 per square foot for tropical hardwood. Including labor, a typical
            deck costs $15-$35 per square foot for wood and $25-$50 per square foot for composite, fully installed.
          </p>
          <p>
            <strong>Pressure treated vs. composite decking?</strong> Pressure treated wood costs less upfront ($2-$5/sq ft)
            but requires annual staining and sealing. Composite decking ($6-$12/sq ft) is virtually maintenance-free,
            resists rot and insects, and comes with 25-year warranties. Over 10+ years, composite often costs less in
            total due to zero maintenance.
          </p>

          <h3>Decking Buying Tips</h3>
          <ul>
            <li>Always buy 10-15% extra decking boards to account for cuts, waste, and defects</li>
            <li>Choose board lengths that match or slightly exceed your deck width to minimize waste</li>
            <li>Use corrosion-resistant screws — stainless steel or coated deck screws are essential</li>
            <li>Composite decking requires hidden fastener systems — budget $1-$2 per sq ft extra</li>
            <li>Pressure-treated lumber needs 3-6 months to dry before staining</li>
            <li>Check local building codes — most decks over 30 inches high require permits and railings</li>
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
            name: "Decking Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/decking-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
