"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Scrap Gold Calculator - Calculate Gold Melt Value & Payout",
  description:
    "Free scrap gold calculator to estimate the melt value of your gold jewelry and items. Add multiple items, set buyer discount, and get estimated payout for selling scrap gold.",
  keywords:
    "scrap gold calculator, gold melt value calculator, sell gold calculator, scrap gold value, gold scrap price, melt value of gold, gold buyback calculator, gold payout calculator",
};

const GOLD_PRICE_PER_OZ_USD = 2650;
const GRAMS_PER_OZ = 31.1035;
const GOLD_PRICE_PER_GRAM_USD = GOLD_PRICE_PER_OZ_USD / GRAMS_PER_OZ;

const KARAT_OPTIONS = [
  { karat: "24K", purity: 0.999 },
  { karat: "22K", purity: 0.916 },
  { karat: "21K", purity: 0.875 },
  { karat: "18K", purity: 0.75 },
  { karat: "14K", purity: 0.583 },
  { karat: "12K", purity: 0.5 },
  { karat: "10K", purity: 0.417 },
  { karat: "9K", purity: 0.375 },
];

interface ScrapItem {
  id: number;
  description: string;
  weight: string;
  karat: string;
}

let nextId = 1;

export default function ScrapGoldCalculatorPage() {
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [items, setItems] = useState<ScrapItem[]>([
    { id: nextId++, description: "Gold Ring", weight: "5", karat: "14K" },
  ]);
  const [discount, setDiscount] = useState<number>(80);
  const [calculated, setCalculated] = useState(false);

  function addItem() {
    setItems([...items, { id: nextId++, description: "", weight: "", karat: "14K" }]);
    setCalculated(false);
  }

  function removeItem(id: number) {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
    setCalculated(false);
  }

  function updateItem(id: number, field: keyof Omit<ScrapItem, "id">, value: string) {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    setCalculated(false);
  }

  function getItemCalc(item: ScrapItem) {
    const w = parseFloat(item.weight);
    if (!w || w <= 0) return null;
    const karatObj = KARAT_OPTIONS.find((k) => k.karat === item.karat);
    if (!karatObj) return null;
    const pureGold = w * karatObj.purity;
    const meltValue = pureGold * GOLD_PRICE_PER_GRAM_USD;
    const payout = meltValue * (discount / 100);
    return { pureGold, meltValue, payout, weight: w };
  }

  function calculate() {
    setCalculated(true);
  }

  const totals = items.reduce(
    (acc, item) => {
      const calc = getItemCalc(item);
      if (calc) {
        acc.totalWeight += calc.weight;
        acc.totalPureGold += calc.pureGold;
        acc.totalMeltValue += calc.meltValue;
        acc.totalPayout += calc.payout;
      }
      return acc;
    },
    { totalWeight: 0, totalPureGold: 0, totalMeltValue: 0, totalPayout: 0 }
  );

  useEffect(() => { setDisplayCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number, decimals = 2) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
  const fmtCurrency = (n: number) => formatCurrency(n, displayCurrency);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/scrap-gold-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/scrap-gold-calculator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Scrap Gold Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Estimate the melt value and payout for your scrap gold. Add multiple items, adjust the buyer discount, and see per-item and total values.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setDisplayCurrency} className="mb-4" />

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Buyer Discount: <span className="text-[var(--primary)] font-bold">{discount}%</span> of spot price
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={discount}
              onChange={(e) => { setDiscount(parseInt(e.target.value)); setCalculated(false); }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--muted)]">
              <span>50% (Low offer)</span>
              <span>70-90% (Typical)</span>
              <span>100% (Spot)</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {items.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end p-4 rounded-lg" style={{ background: "var(--muted-bg)" }}>
                <div>
                  <label className="block text-xs font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="input-field text-sm"
                    placeholder={`Item ${idx + 1}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Weight (grams)</label>
                  <input
                    type="number"
                    value={item.weight}
                    onChange={(e) => updateItem(item.id, "weight", e.target.value)}
                    className="input-field text-sm"
                    placeholder="e.g., 5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Karat</label>
                  <select
                    value={item.karat}
                    onChange={(e) => updateItem(item.id, "karat", e.target.value)}
                    className="input-field text-sm"
                  >
                    {KARAT_OPTIONS.map((k) => (
                      <option key={k.karat} value={k.karat}>{k.karat} ({fmt(k.purity * 100, 1)}%)</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button onClick={addItem} className="px-4 py-2 border border-[var(--card-border)] rounded-lg hover:bg-[var(--muted-bg)] transition-colors text-sm">
              + Add Item
            </button>
            <button onClick={calculate} className="btn-primary">
              Calculate Value
            </button>
          </div>
        </div>

        {calculated && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-xs text-[var(--muted)] mb-1">Total Weight</p>
                <p className="text-xl font-bold">{fmt(totals.totalWeight)} g</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fde68a" }}>
                <p className="text-xs text-[var(--muted)] mb-1">Pure Gold</p>
                <p className="text-xl font-bold text-yellow-700">{fmt(totals.totalPureGold)} g</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-[var(--muted)] mb-1">Melt Value</p>
                <p className="text-xl font-bold">{fmtCurrency(totals.totalMeltValue)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-xs text-[var(--muted)] mb-1">Est. Payout ({discount}%)</p>
                <p className="text-xl font-bold text-green-700">{fmtCurrency(totals.totalPayout)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Item Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Item</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Weight (g)</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-center">Karat</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Pure Gold (g)</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Melt Value</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Payout ({discount}%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => {
                      const calc = getItemCalc(item);
                      if (!calc) return null;
                      return (
                        <tr key={item.id} className="hover:bg-[var(--muted-bg)]">
                          <td className="border border-[var(--card-border)] px-3 py-2">{item.description || `Item ${idx + 1}`}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(calc.weight)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-center">{item.karat}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(calc.pureGold)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtCurrency(calc.meltValue)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-green-700">{fmtCurrency(calc.payout)}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-yellow-50 font-bold">
                      <td className="border border-[var(--card-border)] px-3 py-2">Total</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(totals.totalWeight)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-center">-</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(totals.totalPureGold)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtCurrency(totals.totalMeltValue)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmtCurrency(totals.totalPayout)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-sm text-[var(--muted)] text-center italic">
              Prices are approximate. Check live market for current rates. Actual payout may vary by dealer.
            </p>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does the Scrap Gold Calculator Work?</h2>
          <p>
            The scrap gold calculator estimates how much your gold jewelry and items are worth based on their
            weight, karat purity, and the current gold spot price. It calculates the melt value — the theoretical
            value of the pure gold content — and then applies a buyer discount percentage to estimate what a
            dealer or gold buyer would typically pay you. Most gold buyers pay between 70% and 90% of the
            spot melt value, depending on the buyer, market conditions, and quantity being sold.
          </p>

          <h2>Understanding Melt Value vs. Payout</h2>
          <p>
            The melt value is what the pure gold content of your item is worth at the current spot price. However,
            gold buyers need to cover their costs for refining, assaying, shipping, and profit margin. This is why
            the actual payout is typically lower than the full melt value. Reputable dealers usually offer 75-90%
            of melt value, while pawn shops may offer as low as 50-60%.
          </p>

          <h3>How to Get the Best Price for Scrap Gold</h3>
          <ul>
            <li><strong>Know your gold</strong> — Identify the karat and weigh your items before visiting a buyer</li>
            <li><strong>Shop around</strong> — Get quotes from at least 3-5 different buyers</li>
            <li><strong>Check spot prices</strong> — Know the current gold spot price so you can calculate a fair offer</li>
            <li><strong>Separate by karat</strong> — Sort items by karat to get accurate valuations for each piece</li>
            <li><strong>Consider online buyers</strong> — Online gold buyers often offer higher percentages than local shops</li>
          </ul>

          <h3>What Items Qualify as Scrap Gold?</h3>
          <p>
            Scrap gold includes any gold item sold primarily for its metal content rather than its craftsmanship
            or design. Common scrap gold items include broken jewelry, single earrings, outdated or unfashionable
            pieces, dental gold, gold-plated items (for the gold layer), and old gold coins that are not
            numismatically valuable.
          </p>

          <h3>Red Flags When Selling Gold</h3>
          <ul>
            <li>Buyer refuses to weigh items in front of you or uses an uncalibrated scale</li>
            <li>Offer is significantly below 70% of calculated melt value</li>
            <li>Pressure to sell immediately without time to consider</li>
            <li>Buyer does not provide a detailed receipt or breakdown</li>
            <li>No physical business address or proper licensing</li>
          </ul>

          <h3>Gold Refining Process</h3>
          <p>
            When you sell scrap gold, it goes through a refining process to extract pure gold. The most common
            methods are the Miller process (using chlorine gas) and the Wohlwill process (using electrolysis).
            Refining costs and the complexity of separating gold from other metals are factored into the
            discount buyers apply to their offers.
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
            name: "Scrap Gold Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/scrap-gold-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
