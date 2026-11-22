"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Silver Price Calculator - Calculate Silver Value by Weight & Purity",
  description:
    "Free silver price calculator to calculate the value of silver by weight and purity. Supports grams, ounces, kg. Calculate sterling silver value, coin silver, and fine silver prices.",
  keywords:
    "silver price calculator, silver calculator per gram, sterling silver value, silver value calculator, silver price per gram, silver coin calculator, 925 silver calculator, silver melt value",
};

// Approximate silver price as of Nov 2026
const SILVER_PRICE_PER_OZ_USD = 31;
const GRAMS_PER_OZ = 31.1035;
const GRAMS_PER_KG = 1000;

const SILVER_PRICE_PER_GRAM_USD = SILVER_PRICE_PER_OZ_USD / GRAMS_PER_OZ;

const WEIGHT_UNITS = [
  { value: "grams", label: "Grams (g)", toGrams: 1 },
  { value: "oz", label: "Troy Ounces (oz)", toGrams: GRAMS_PER_OZ },
  { value: "kg", label: "Kilograms (kg)", toGrams: GRAMS_PER_KG },
];

const PURITIES = [
  { name: "Fine Silver (999)", purity: 0.999, label: ".999 Fine Silver" },
  { name: "Sterling Silver (925)", purity: 0.925, label: ".925 Sterling Silver" },
  { name: "Coin Silver (900)", purity: 0.9, label: ".900 Coin Silver" },
  { name: "European Silver (800)", purity: 0.8, label: ".800 European Silver" },
];

const SILVER_COINS = [
  { name: "Morgan Silver Dollar (1878-1921)", weight: 26.73, purity: 0.9, silver: 24.057 },
  { name: "Walking Liberty Half Dollar", weight: 12.5, purity: 0.9, silver: 11.25 },
  { name: "American Silver Eagle (1 oz)", weight: 31.1035, purity: 0.999, silver: 31.072 },
  { name: "Canadian Silver Maple Leaf (1 oz)", weight: 31.1035, purity: 0.9999, silver: 31.1 },
  { name: "Roosevelt Dime (1946-1964)", weight: 2.5, purity: 0.9, silver: 2.25 },
  { name: "Washington Quarter (1932-1964)", weight: 6.25, purity: 0.9, silver: 5.625 },
  { name: "Kennedy Half Dollar (1964)", weight: 12.5, purity: 0.9, silver: 11.25 },
  { name: "Kennedy Half Dollar (1965-1970)", weight: 11.5, purity: 0.4, silver: 4.6 },
];

export default function SilverPriceCalculatorPage() {
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [weight, setWeight] = useState<string>("100");
  const [unit, setUnit] = useState<string>("grams");
  const [purity, setPurity] = useState<string>(".925 Sterling Silver");
  const [quantity, setQuantity] = useState<string>("1");
  const [result, setResult] = useState<{
    weightInGrams: number;
    pureSilverGrams: number;
    totalValue: number;
    pricePerUnit: number;
  } | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    const q = parseInt(quantity);
    if (!w || w <= 0 || !q || q <= 0) return;

    const unitObj = WEIGHT_UNITS.find((u) => u.value === unit);
    const purityObj = PURITIES.find((p) => p.label === purity);
    if (!unitObj || !purityObj) return;

    const weightInGrams = w * unitObj.toGrams;
    const pureSilverGrams = weightInGrams * purityObj.purity;
    const pricePerUnit = pureSilverGrams * SILVER_PRICE_PER_GRAM_USD;
    const totalValue = pricePerUnit * q;

    setResult({ weightInGrams, pureSilverGrams, totalValue, pricePerUnit });
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
      <link rel="canonical" href={`${SITE_URL}/tools/silver-price-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/silver-price-calculator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Silver Price Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate the value of silver based on weight, purity, and quantity. Includes sterling silver, fine silver, coin silver, and a silver coin value reference.
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
                placeholder="e.g., 100"
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
              <label className="block text-sm font-medium mb-1">Purity</label>
              <select
                value={purity}
                onChange={(e) => setPurity(e.target.value)}
                className="input-field"
              >
                {PURITIES.map((p) => (
                  <option key={p.label} value={p.label}>{p.label}</option>
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
                <p className="text-sm text-[var(--muted)] mb-1">Total Silver Value</p>
                <p className="text-2xl font-bold text-[var(--primary)]">
                  {fmtCurrency(result.totalValue)}
                </p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0f0f5", borderColor: "#c0c0c0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Pure Silver Content</p>
                <p className="text-2xl font-bold" style={{ color: "#6b7280" }}>
                  {fmt(result.pureSilverGrams)} grams
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
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{purity}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Pure Silver Content</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.pureSilverGrams)} g</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Quantity</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{quantity}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Value per Item</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtCurrency(result.pricePerUnit)}</td>
                  </tr>
                  <tr className="bg-blue-50">
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

        {/* Silver Coin Reference */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Silver Coin Value Reference (Approx.)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Coin</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Weight (g)</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Purity</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Silver (g)</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Melt Value (USD)</th>
                </tr>
              </thead>
              <tbody>
                {SILVER_COINS.map((coin) => (
                  <tr key={coin.name} className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">{coin.name}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(coin.weight)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(coin.purity * 100, 1)}%</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(coin.silver)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">${fmt(coin.silver * SILVER_PRICE_PER_GRAM_USD)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--muted)] mt-2">
            Based on approximate silver spot price of ${fmt(SILVER_PRICE_PER_OZ_USD)} per troy ounce. Numismatic value may be significantly higher.
          </p>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does the Silver Price Calculator Work?</h2>
          <p>
            The silver price calculator helps you determine the value of silver based on its weight, purity, and
            the current market price. Silver is priced per troy ounce on international markets, and this calculator
            converts that into a per-gram price adjusted for the purity of your silver. Whether you have fine
            silver, sterling silver, or coin silver, this tool gives you an accurate valuation.
          </p>

          <h2>Understanding Silver Purity Standards</h2>
          <p>
            Silver purity is measured in parts per thousand, often referred to as "fineness." Fine silver is .999
            (99.9% pure), while sterling silver is .925 (92.5% pure). The remaining percentage consists of other
            metals, usually copper, which are added to increase durability and hardness since pure silver is very
            soft and malleable.
          </p>

          <h3>Common Silver Purities</h3>
          <ul>
            <li><strong>.999 Fine Silver</strong> — The purest commercial form, used in bullion bars, coins, and industrial applications</li>
            <li><strong>.925 Sterling Silver</strong> — The most common standard for silver jewelry worldwide. Contains 92.5% silver and 7.5% copper or other metals</li>
            <li><strong>.900 Coin Silver</strong> — The traditional standard for US silver coins minted before 1965</li>
            <li><strong>.800 European Silver</strong> — Common in European continental silverware and older jewelry</li>
          </ul>

          <h3>Why Sterling Silver Is the Standard</h3>
          <p>
            Sterling silver (.925) became the dominant standard for jewelry and silverware because it offers the
            best balance between purity, durability, and workability. Pure silver is too soft for practical use
            in jewelry, while the small amount of copper in sterling silver gives it the strength needed for
            everyday wear while retaining the beautiful white luster silver is known for.
          </p>

          <h3>Silver vs. Gold as an Investment</h3>
          <ul>
            <li><strong>Price ratio</strong> — The gold-to-silver ratio typically ranges from 60:1 to 90:1</li>
            <li><strong>Volatility</strong> — Silver tends to be more volatile than gold, with larger percentage swings</li>
            <li><strong>Industrial demand</strong> — Silver has significant industrial use in electronics, solar panels, and medicine</li>
            <li><strong>Storage</strong> — Silver requires more space to store the same dollar value compared to gold</li>
            <li><strong>Accessibility</strong> — Silver's lower price makes it more accessible to small investors</li>
          </ul>

          <h3>Tips for Buying and Selling Silver</h3>
          <ul>
            <li>Compare premiums above spot price when buying silver coins vs. bars</li>
            <li>Look for the .925 or Sterling stamp on jewelry to verify authenticity</li>
            <li>Silver rounds and bars typically carry lower premiums than government coins</li>
            <li>Store silver in a cool, dry place to prevent tarnishing</li>
            <li>Consider the gold-to-silver ratio when deciding between the two metals</li>
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
            name: "Silver Price Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/silver-price-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
