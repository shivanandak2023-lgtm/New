"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Discount Calculator - Calculate Sale Price & Savings",
  description:
    "Free discount calculator to find the final price after discount. Calculate percentage off, savings amount, or reverse-calculate the original price from the sale price.",
  keywords:
    "discount calculator, percentage off calculator, sale price calculator, how much is percent off, discount percentage, savings calculator, price after discount",
};

type Mode = "forward" | "reverse";

export default function DiscountCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [mode, setMode] = useState<Mode>("forward");
  // Forward: original price + discount % => final price
  const [originalPrice, setOriginalPrice] = useState<string>("100");
  const [discountPercent, setDiscountPercent] = useState<string>("25");
  // Reverse: final price + discount % => original price
  const [finalPrice, setFinalPrice] = useState<string>("75");
  const [reverseDiscount, setReverseDiscount] = useState<string>("25");

  // Forward calculations
  const origPrice = parseFloat(originalPrice) || 0;
  const discPct = parseFloat(discountPercent) || 0;
  const discountAmount = origPrice * (discPct / 100);
  const priceAfterDiscount = origPrice - discountAmount;

  // Reverse calculations
  const finPrice = parseFloat(finalPrice) || 0;
  const revDisc = parseFloat(reverseDiscount) || 0;
  const calcOriginalPrice = revDisc < 100 ? finPrice / (1 - revDisc / 100) : 0;
  const calcDiscountAmount = calcOriginalPrice - finPrice;

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/discount-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/discount-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Discount Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate the sale price after a discount, or reverse-calculate the original price from the discounted price. Quick and easy savings calculator.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("forward")}
              className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                mode === "forward"
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
              }`}
            >
              Calculate Sale Price
            </button>
            <button
              onClick={() => setMode("reverse")}
              className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                mode === "reverse"
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
              }`}
            >
              Find Original Price
            </button>
          </div>

          {mode === "forward" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Original Price ({currency.symbol})</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 100"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 25"
                  step="0.5"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Sale / Final Price ({currency.symbol})</label>
                <input
                  type="number"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 75"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount Applied (%)</label>
                <input
                  type="number"
                  value={reverseDiscount}
                  onChange={(e) => setReverseDiscount(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 25"
                  step="0.5"
                />
              </div>
            </div>
          )}
        </div>

        {mode === "forward" && origPrice > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">You Save</p>
                <p className="text-2xl font-bold text-green-700">{fmt(discountAmount)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Final Price</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(priceAfterDiscount)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Original Price</p>
                <p className="text-2xl font-bold text-amber-700 line-through">{fmt(origPrice)}</p>
              </div>
            </div>
          </div>
        )}

        {mode === "reverse" && finPrice > 0 && revDisc > 0 && revDisc < 100 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Original Price</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(calcOriginalPrice)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Discount Amount</p>
                <p className="text-2xl font-bold text-green-700">{fmt(calcDiscountAmount)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Sale Price</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(finPrice)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick reference table */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Quick Discount Reference</h2>
          {origPrice > 0 && mode === "forward" && (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Discount</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">You Save</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Final Price</th>
                </tr>
              </thead>
              <tbody>
                {[5, 10, 15, 20, 25, 30, 40, 50, 60, 75].map((pct) => (
                  <tr key={pct} className={`hover:bg-[var(--muted-bg)] ${pct === discPct ? "bg-blue-50 font-semibold" : ""}`}>
                    <td className="border border-[var(--card-border)] px-3 py-2">{pct}% off</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(origPrice * pct / 100)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(origPrice * (1 - pct / 100))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {(mode === "reverse" || origPrice <= 0) && (
            <p className="text-[var(--muted)]">Enter an original price in forward mode to see a quick discount reference table.</p>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate a Discount</h2>
          <p>
            To calculate the sale price after a discount, use this formula:
          </p>
          <p><strong>Sale Price = Original Price x (1 - Discount% / 100)</strong></p>
          <p>
            For example, if an item costs $80 and is 25% off: $80 x (1 - 0.25) = $80 x 0.75 = $60.
            You save $20.
          </p>

          <h2>How to Find the Original Price from Sale Price</h2>
          <p>
            If you know the sale price and the discount percentage, you can reverse-calculate the original price:
          </p>
          <p><strong>Original Price = Sale Price / (1 - Discount% / 100)</strong></p>
          <p>
            For example, if the sale price is $60 after a 25% discount: $60 / (1 - 0.25) = $60 / 0.75 = $80.
          </p>

          <h2>Common Discount Calculations</h2>
          <ul>
            <li><strong>10% off $50</strong> = $45 (you save $5)</li>
            <li><strong>20% off $100</strong> = $80 (you save $20)</li>
            <li><strong>25% off $200</strong> = $150 (you save $50)</li>
            <li><strong>30% off $75</strong> = $52.50 (you save $22.50)</li>
            <li><strong>50% off $120</strong> = $60 (you save $60)</li>
          </ul>

          <h3>Stacking Discounts</h3>
          <p>
            When two discounts are stacked (e.g., 20% off then an additional 10% off), they are not simply added together.
            Instead, apply them sequentially: $100 with 20% off = $80, then 10% off $80 = $72. The total discount is 28%, not 30%.
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
            name: "Discount Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/discount-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
