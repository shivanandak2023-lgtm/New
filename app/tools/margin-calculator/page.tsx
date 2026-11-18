"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Margin Calculator - Calculate Profit Margin, Markup & Revenue",
  description:
    "Free margin calculator to find profit margin, markup percentage, revenue, and cost. Understand the difference between margin and markup with three calculation modes.",
  keywords:
    "margin calculator, profit margin calculator, markup calculator, gross margin, revenue calculator, margin vs markup, business profit calculator, cost calculator",
};

type Mode = "cost-margin" | "revenue-cost" | "revenue-margin";

export default function MarginCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [mode, setMode] = useState<Mode>("cost-margin");
  const [cost, setCost] = useState("80");
  const [revenue, setRevenue] = useState("100");
  const [marginPct, setMarginPct] = useState("25");

  const costVal = parseFloat(cost) || 0;
  const revVal = parseFloat(revenue) || 0;
  const marginVal = parseFloat(marginPct) || 0;

  let calcRevenue = 0;
  let calcCost = 0;
  let calcProfit = 0;
  let calcMargin = 0;
  let calcMarkup = 0;
  let valid = true;

  switch (mode) {
    case "cost-margin":
      if (marginVal >= 100) { valid = false; break; }
      calcCost = costVal;
      calcRevenue = costVal / (1 - marginVal / 100);
      calcProfit = calcRevenue - calcCost;
      calcMargin = marginVal;
      calcMarkup = calcCost > 0 ? (calcProfit / calcCost) * 100 : 0;
      break;
    case "revenue-cost":
      calcRevenue = revVal;
      calcCost = costVal;
      calcProfit = revVal - costVal;
      calcMargin = revVal > 0 ? (calcProfit / revVal) * 100 : 0;
      calcMarkup = costVal > 0 ? (calcProfit / costVal) * 100 : 0;
      break;
    case "revenue-margin":
      calcRevenue = revVal;
      calcMargin = marginVal;
      calcProfit = revVal * (marginVal / 100);
      calcCost = revVal - calcProfit;
      calcMarkup = calcCost > 0 ? (calcProfit / calcCost) * 100 : 0;
      break;
  }

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  const pct = (n: number) => n.toFixed(2) + "%";

  const modes: { key: Mode; label: string }[] = [
    { key: "cost-margin", label: "Cost + Margin%" },
    { key: "revenue-cost", label: "Revenue + Cost" },
    { key: "revenue-margin", label: "Revenue + Margin%" },
  ];

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/margin-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Margin Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate profit margin, markup, revenue, and cost. Choose one of three modes depending on which values you know.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <label className="block text-sm font-medium mb-3">Calculation Mode</label>
          <div className="flex flex-wrap gap-2 mb-6">
            {modes.map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                  mode === m.key
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(mode === "cost-margin" || mode === "revenue-cost") && (
              <div>
                <label className="block text-sm font-medium mb-1">Cost ({currency.symbol})</label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 80"
                  step="0.01"
                />
              </div>
            )}
            {(mode === "revenue-cost" || mode === "revenue-margin") && (
              <div>
                <label className="block text-sm font-medium mb-1">Revenue ({currency.symbol})</label>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 100"
                  step="0.01"
                />
              </div>
            )}
            {(mode === "cost-margin" || mode === "revenue-margin") && (
              <div>
                <label className="block text-sm font-medium mb-1">Margin (%)</label>
                <input
                  type="number"
                  value={marginPct}
                  onChange={(e) => setMarginPct(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 25"
                  step="0.1"
                />
              </div>
            )}
          </div>
        </div>

        {valid && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Revenue</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmt(calcRevenue)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Cost</p>
                <p className="text-xl font-bold text-[var(--foreground)]">{fmt(calcCost)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Profit</p>
                <p className="text-xl font-bold text-green-700">{fmt(calcProfit)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Margin %</p>
                <p className="text-xl font-bold text-amber-700">{pct(calcMargin)}</p>
              </div>
            </div>

            <div className="tool-card">
              <h2 className="text-lg font-bold mb-4">Summary</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Revenue</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(calcRevenue)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Cost</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(calcCost)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Profit</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-green-700">{fmt(calcProfit)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Margin %</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{pct(calcMargin)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)] bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">Markup %</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{pct(calcMarkup)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!valid && (
          <div className="result-card text-center mb-8">
            <p className="text-red-600 font-semibold">Margin cannot be 100% or more (revenue would be infinite).</p>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Margin vs. Markup: What Is the Difference?</h2>
          <p>
            Margin and markup are both measures of profit, but they use different bases. <strong>Margin</strong> is the
            percentage of the selling price (revenue) that is profit. <strong>Markup</strong> is the percentage of the
            cost that is added as profit.
          </p>
          <ul>
            <li><strong>Margin formula:</strong> Margin% = (Revenue - Cost) / Revenue x 100</li>
            <li><strong>Markup formula:</strong> Markup% = (Revenue - Cost) / Cost x 100</li>
          </ul>
          <p>
            For example, if you buy an item for $80 and sell it for $100, the profit is $20. The margin is 20/100 = 20%,
            while the markup is 20/80 = 25%.
          </p>

          <h2>How to Calculate Profit Margin</h2>
          <p>
            To calculate profit margin, subtract the cost from the revenue to find the profit, then divide the profit by the
            revenue. Multiply by 100 to express it as a percentage. A higher margin means more profit per dollar of revenue.
          </p>

          <h3>Common Margin Benchmarks</h3>
          <p>
            Profit margins vary widely by industry. Retail businesses often operate on 2-5% net margins, while software
            companies may achieve 20-40% margins. Understanding your industry benchmarks helps you set competitive prices.
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
            name: "Margin Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/margin-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
