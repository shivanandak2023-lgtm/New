"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Gold Karat Calculator - Convert Between Gold Karats",
  description:
    "Free gold karat calculator to convert gold weight between karats. Convert 14K to 24K gold, calculate pure gold content, and see the value at current prices.",
  keywords:
    "gold karat calculator, 14k to 24k gold converter, gold purity calculator, gold karat conversion, gold weight converter, convert gold karats, gold fineness calculator",
};

const GOLD_PRICE_PER_OZ_USD = 2650;
const GRAMS_PER_OZ = 31.1035;
const GOLD_PRICE_PER_GRAM_USD = GOLD_PRICE_PER_OZ_USD / GRAMS_PER_OZ;

const KARATS = [
  { karat: "24K", purity: 0.999, color: "Rich Yellow", use: "Investment bars, coins, bullion" },
  { karat: "22K", purity: 0.916, color: "Deep Yellow", use: "Indian & Middle Eastern jewelry" },
  { karat: "21K", purity: 0.875, color: "Yellow", use: "Middle Eastern jewelry" },
  { karat: "18K", purity: 0.75, color: "Warm Yellow", use: "Fine jewelry worldwide" },
  { karat: "14K", purity: 0.583, color: "Light Yellow", use: "US standard jewelry" },
  { karat: "12K", purity: 0.5, color: "Pale Yellow", use: "Some jewelry, dental gold" },
  { karat: "10K", purity: 0.417, color: "Pale / Rose tint", use: "Budget jewelry (US minimum)" },
  { karat: "9K", purity: 0.375, color: "Very Pale", use: "UK/Australia budget jewelry" },
];

export default function GoldKaratCalculatorPage() {
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [weight, setWeight] = useState<string>("10");
  const [fromKarat, setFromKarat] = useState<string>("14K");
  const [toKarat, setToKarat] = useState<string>("24K");
  const [result, setResult] = useState<{
    pureGoldGrams: number;
    equivalentWeight: number;
    fromValue: number;
    toValue: number;
  } | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;

    const fromObj = KARATS.find((k) => k.karat === fromKarat);
    const toObj = KARATS.find((k) => k.karat === toKarat);
    if (!fromObj || !toObj) return;

    const pureGoldGrams = w * fromObj.purity;
    const equivalentWeight = pureGoldGrams / toObj.purity;
    const fromValue = pureGoldGrams * GOLD_PRICE_PER_GRAM_USD;
    const toValue = fromValue; // Same gold content = same value

    setResult({ pureGoldGrams, equivalentWeight, fromValue, toValue });
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
      <link rel="canonical" href={`${SITE_URL}/tools/gold-karat-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/gold-karat-calculator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Gold Karat Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert gold weight between different karats. Find the equivalent weight when converting from one karat to another while maintaining the same gold content.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setDisplayCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Weight (grams)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input-field"
                placeholder="e.g., 10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">From Karat</label>
              <select
                value={fromKarat}
                onChange={(e) => setFromKarat(e.target.value)}
                className="input-field"
              >
                {KARATS.map((k) => (
                  <option key={k.karat} value={k.karat}>{k.karat} ({fmt(k.purity * 100, 1)}%)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">To Karat</label>
              <select
                value={toKarat}
                onChange={(e) => setToKarat(e.target.value)}
                className="input-field"
              >
                {KARATS.map((k) => (
                  <option key={k.karat} value={k.karat}>{k.karat} ({fmt(k.purity * 100, 1)}%)</option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Convert Karat
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Equivalent Weight in {toKarat}</p>
                <p className="text-2xl font-bold text-[var(--primary)]">
                  {fmt(result.equivalentWeight)} g
                </p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fde68a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Pure Gold Content</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {fmt(result.pureGoldGrams)} g
                </p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Gold Value</p>
                <p className="text-2xl font-bold text-green-700">
                  {fmtCurrency(result.fromValue)}
                </p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Conversion Details</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Input Weight</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(parseFloat(weight))} g of {fromKarat}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">From Purity</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fromKarat} ({fmt(KARATS.find((k) => k.karat === fromKarat)!.purity * 100, 1)}%)</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">To Purity</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{toKarat} ({fmt(KARATS.find((k) => k.karat === toKarat)!.purity * 100, 1)}%)</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Pure Gold Content</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.pureGoldGrams)} g</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Equivalent Weight in {toKarat}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(result.equivalentWeight)} g</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-[var(--muted)] text-center italic">
              Prices are approximate. Check live market for current rates.
            </p>
          </div>
        )}

        {/* Karat Comparison Table */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Gold Karat Comparison Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Karat</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Purity %</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Color</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Common Use</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Price / Gram (USD)</th>
                </tr>
              </thead>
              <tbody>
                {KARATS.map((k) => (
                  <tr key={k.karat} className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">{k.karat}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(k.purity * 100, 1)}%</td>
                    <td className="border border-[var(--card-border)] px-3 py-2">{k.color}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2">{k.use}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">${fmt(GOLD_PRICE_PER_GRAM_USD * k.purity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does the Gold Karat Calculator Work?</h2>
          <p>
            The gold karat calculator converts gold weight between different purities while maintaining the same
            amount of pure gold content. When you convert gold from one karat to another, the total weight changes
            because different karats contain different percentages of pure gold. For example, 10 grams of 14K gold
            contains 5.83 grams of pure gold, which would weigh only 5.84 grams if it were 24K gold (since 24K
            is 99.9% pure).
          </p>

          <h2>Understanding Gold Karat Conversion</h2>
          <p>
            Gold karat conversion is essential when comparing jewelry or investments of different purities. The
            formula is straightforward: multiply the weight by the from-karat purity, then divide by the to-karat
            purity. This gives you the equivalent weight in the target karat that contains the same amount of
            actual gold. Jewelers, pawn shops, and gold dealers use this calculation daily when evaluating pieces.
          </p>

          <h3>The Karat System Explained</h3>
          <p>
            The karat system has been used to measure gold purity for centuries. The word "karat" comes from the
            carob seeds that were historically used as balance weights for gold trading. In the karat system,
            pure gold is designated as 24 karats. Any number below 24 represents the proportion of gold in the
            alloy — for example, 18K gold is 18/24 or 75% pure gold.
          </p>

          <h3>Karat vs. Carat</h3>
          <ul>
            <li><strong>Karat (K)</strong> — Measures the purity of gold, with 24K being the purest</li>
            <li><strong>Carat (ct)</strong> — Measures the weight of gemstones, where 1 carat equals 0.2 grams</li>
            <li>In some countries, both gold purity and gemstone weight use the spelling "carat"</li>
            <li>The United States distinguishes between the two with different spellings</li>
          </ul>

          <h3>Why Different Karats Are Used</h3>
          <p>
            Pure 24K gold is too soft for everyday jewelry, so it is alloyed with other metals like silver,
            copper, zinc, and palladium to increase durability. Lower karat gold is harder, more scratch-resistant,
            and comes in a wider range of colors including white gold, rose gold, and green gold. The choice of
            karat depends on the intended use, budget, and regional preferences.
          </p>

          <h3>Regional Preferences for Gold Karat</h3>
          <ul>
            <li><strong>India and Middle East</strong> — 22K gold is preferred for its rich yellow color and high purity</li>
            <li><strong>United States</strong> — 14K gold is most popular for jewelry, offering a balance of durability and value</li>
            <li><strong>Europe</strong> — 18K gold is the standard for fine jewelry</li>
            <li><strong>United Kingdom and Australia</strong> — 9K gold is accepted and common for budget jewelry</li>
            <li><strong>China</strong> — 24K gold is preferred for investment pieces and special occasion jewelry</li>
          </ul>

          <h3>Tips for Gold Karat Assessment</h3>
          <ul>
            <li>Look for hallmark stamps on jewelry indicating the karat (e.g., 585 for 14K, 750 for 18K)</li>
            <li>Use a professional assay for accurate purity testing</li>
            <li>Acid testing kits can help verify karat at home, but are less precise</li>
            <li>XRF (X-ray fluorescence) analyzers provide non-destructive, highly accurate results</li>
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
            name: "Gold Karat Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/gold-karat-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
