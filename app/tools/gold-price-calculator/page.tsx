"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Gold Price Calculator - Calculate Gold Value by Weight & Karat",
  description:
    "Free gold price calculator to calculate the value of gold by weight and karat. Supports grams, ounces, kg, and tola. Get gold price per gram for 24K, 22K, 18K, 14K, and 10K gold.",
  keywords:
    "gold price calculator, gold calculator per gram, gold value calculator, gold price per gram, 24k gold price, 22k gold price, gold weight calculator, gold rate calculator",
};

// Approximate gold price as of Nov 2026
const GOLD_PRICE_PER_OZ_USD = 2650;
const GRAMS_PER_OZ = 31.1035;
const GRAMS_PER_KG = 1000;
const GRAMS_PER_TOLA = 11.6638;

const GOLD_PRICE_PER_GRAM_USD = GOLD_PRICE_PER_OZ_USD / GRAMS_PER_OZ;

const WEIGHT_UNITS = [
  { value: "grams", label: "Grams (g)", toGrams: 1 },
  { value: "oz", label: "Troy Ounces (oz)", toGrams: GRAMS_PER_OZ },
  { value: "kg", label: "Kilograms (kg)", toGrams: GRAMS_PER_KG },
  { value: "tola", label: "Tola", toGrams: GRAMS_PER_TOLA },
];

const PURITIES = [
  { karat: "24K", purity: 0.999, label: "24K (99.9%)" },
  { karat: "22K", purity: 0.916, label: "22K (91.6%)" },
  { karat: "18K", purity: 0.75, label: "18K (75.0%)" },
  { karat: "14K", purity: 0.583, label: "14K (58.3%)" },
  { karat: "10K", purity: 0.417, label: "10K (41.7%)" },
];

export default function GoldPriceCalculatorPage() {
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [weight, setWeight] = useState<string>("10");
  const [unit, setUnit] = useState<string>("grams");
  const [purity, setPurity] = useState<string>("24K");
  const [quantity, setQuantity] = useState<string>("1");
  const [result, setResult] = useState<{
    weightInGrams: number;
    pureGoldGrams: number;
    pricePerUnit: number;
    totalValue: number;
  } | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    const q = parseInt(quantity);
    if (!w || w <= 0 || !q || q <= 0) return;

    const unitObj = WEIGHT_UNITS.find((u) => u.value === unit);
    const purityObj = PURITIES.find((p) => p.karat === purity);
    if (!unitObj || !purityObj) return;

    const weightInGrams = w * unitObj.toGrams;
    const pureGoldGrams = weightInGrams * purityObj.purity;
    const pricePerUnit = w * unitObj.toGrams * GOLD_PRICE_PER_GRAM_USD * purityObj.purity;
    const totalValue = pricePerUnit * q;

    setResult({ weightInGrams, pureGoldGrams, pricePerUnit, totalValue });
  }

  useEffect(() => { setDisplayCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number, decimals = 2) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
  const fmtCurrency = (n: number) => formatCurrency(n, displayCurrency);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/gold-price-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/gold-price-calculator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Gold Price Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate the value of gold based on weight, purity, and quantity. Supports grams, troy ounces, kilograms, and tola.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setDisplayCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Weight</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input-field"
                placeholder="e.g., 10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="input-field"
              >
                {WEIGHT_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Purity (Karat)</label>
              <select
                value={purity}
                onChange={(e) => setPurity(e.target.value)}
                className="input-field"
              >
                {PURITIES.map((p) => (
                  <option key={p.karat} value={p.karat}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input-field"
                placeholder="e.g., 1"
                min="1"
              />
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Value
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Gold Value</p>
                <p className="text-2xl font-bold text-[var(--primary)]">
                  {fmtCurrency(result.totalValue)}
                </p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fde68a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Pure Gold Content</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {fmt(result.pureGoldGrams)} grams
                </p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Calculation Details</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Weight</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">
                      {fmt(parseFloat(weight))} {WEIGHT_UNITS.find((u) => u.value === unit)?.label}
                    </td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Weight in Grams</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.weightInGrams)} g</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Purity</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{purity} ({fmt(PURITIES.find((p) => p.karat === purity)!.purity * 100, 1)}%)</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Pure Gold Content</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.pureGoldGrams)} g</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Quantity</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{quantity}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Value per Item</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtCurrency(result.pricePerUnit)}</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Total Value</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">
                      {fmtCurrency(result.totalValue)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-[var(--muted)] text-center italic">
              Prices are approximate. Check live market for current rates.
            </p>
          </div>
        )}

        {/* Reference Table */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Gold Price Per Gram by Karat (Approx.)</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--muted-bg)]">
                <th className="border border-[var(--card-border)] px-3 py-2 text-left">Karat</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-right">Purity %</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-right">Price / Gram (USD)</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-right">Price / Oz (USD)</th>
              </tr>
            </thead>
            <tbody>
              {PURITIES.map((p) => (
                <tr key={p.karat} className="hover:bg-[var(--muted-bg)]">
                  <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">{p.karat}</td>
                  <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(p.purity * 100, 1)}%</td>
                  <td className="border border-[var(--card-border)] px-3 py-2 text-right">${fmt(GOLD_PRICE_PER_GRAM_USD * p.purity)}</td>
                  <td className="border border-[var(--card-border)] px-3 py-2 text-right">${fmt(GOLD_PRICE_PER_OZ_USD * p.purity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-[var(--muted)] mt-2">
            Based on approximate gold spot price of ${fmt(GOLD_PRICE_PER_OZ_USD)} per troy ounce.
          </p>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does the Gold Price Calculator Work?</h2>
          <p>
            The gold price calculator helps you determine the value of gold based on its weight, purity (karat),
            and the current market price. Gold is priced per troy ounce on international markets, and this
            calculator converts that price into value per gram, per kilogram, or per tola, depending on your
            preferred unit. By selecting the karat, you can account for the purity of the gold — for example,
            24K gold is 99.9% pure, while 18K gold is 75% pure.
          </p>

          <h2>Understanding Gold Karats and Purity</h2>
          <p>
            Gold purity is measured in karats, with 24 karat being the purest form of gold available. The karat
            system divides gold into 24 parts, so 18 karat gold contains 18 parts gold and 6 parts other metals.
            Higher karat gold is softer and more yellow in color, while lower karat gold is harder and more
            durable due to the alloy metals mixed in.
          </p>

          <h3>Common Gold Purities</h3>
          <ul>
            <li><strong>24K Gold (99.9%)</strong> — The purest form, commonly used in investment bars and coins. Too soft for most jewelry.</li>
            <li><strong>22K Gold (91.6%)</strong> — Popular in Indian and Middle Eastern jewelry. Rich yellow color with good durability.</li>
            <li><strong>18K Gold (75.0%)</strong> — The standard for fine jewelry worldwide. Good balance of purity and strength.</li>
            <li><strong>14K Gold (58.3%)</strong> — Most popular in the United States for jewelry. Very durable and affordable.</li>
            <li><strong>10K Gold (41.7%)</strong> — The minimum karat that can be legally sold as gold in the US. Most durable and budget-friendly.</li>
          </ul>

          <h3>Gold Weight Units Explained</h3>
          <p>
            Gold is traditionally weighed in troy ounces (31.1035 grams), which is different from the standard
            avoirdupois ounce (28.35 grams). In South Asia, gold is often measured in tolas (11.66 grams),
            while most other regions use grams or kilograms. When buying or selling gold, always confirm
            which unit of weight is being used to avoid confusion.
          </p>

          <h3>Factors Affecting Gold Prices</h3>
          <ul>
            <li><strong>Supply and demand</strong> — Mining output, central bank purchases, and jewelry demand all influence price</li>
            <li><strong>Inflation</strong> — Gold is traditionally seen as a hedge against inflation</li>
            <li><strong>Currency strength</strong> — A weaker US dollar typically leads to higher gold prices</li>
            <li><strong>Geopolitical events</strong> — Uncertainty and conflict often drive investors toward gold as a safe haven</li>
            <li><strong>Interest rates</strong> — Higher rates can reduce gold demand as bonds offer better returns</li>
          </ul>

          <h3>Tips for Buying and Selling Gold</h3>
          <ul>
            <li>Always verify the karat and weight before purchasing gold jewelry</li>
            <li>Compare prices from multiple dealers when buying gold bars or coins</li>
            <li>Be aware of making charges and premiums above spot price for jewelry</li>
            <li>Keep certificates and receipts for all gold purchases</li>
            <li>Consider storage and insurance costs for physical gold investments</li>
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
            name: "Gold Price Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/gold-price-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
