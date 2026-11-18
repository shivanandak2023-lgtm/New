"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Annuity Calculator - Monthly Payout & Lump Sum Estimator",
  description:
    "Free annuity calculator with two modes: calculate monthly payouts from a lump sum, or find how much you need to invest for a desired monthly income.",
  keywords:
    "annuity calculator, annuity payout calculator, retirement annuity, annuity payment, lump sum annuity, monthly payout calculator, annuity investment",
};

export default function AnnuityCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [mode, setMode] = useState<"payout" | "needed">("payout");

  // Mode 1: How much will I receive?
  const [lumpSum, setLumpSum] = useState<string>("500000");
  const [payoutRate, setPayoutRate] = useState<string>("5");
  const [payoutYears, setPayoutYears] = useState<string>("20");

  // Mode 2: How much do I need?
  const [desiredMonthly, setDesiredMonthly] = useState<string>("3000");
  const [neededRate, setNeededRate] = useState<string>("5");
  const [neededYears, setNeededYears] = useState<string>("20");

  const [result, setResult] = useState<{
    monthlyPayout: number;
    totalPayout: number;
    lumpSumNeeded: number;
    totalInvested: number;
    gainOrCost: number;
  } | null>(null);

  function calculate() {
    if (mode === "payout") {
      const PV = parseFloat(lumpSum);
      const r = parseFloat(payoutRate) / 100 / 12;
      const n = parseInt(payoutYears) * 12;

      if (!PV || PV <= 0 || !r || r <= 0 || !n || n <= 0) return;

      const monthlyPayout = (PV * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayout = monthlyPayout * n;

      setResult({
        monthlyPayout,
        totalPayout,
        lumpSumNeeded: PV,
        totalInvested: PV,
        gainOrCost: totalPayout - PV,
      });
    } else {
      const PMT = parseFloat(desiredMonthly);
      const r = parseFloat(neededRate) / 100 / 12;
      const n = parseInt(neededYears) * 12;

      if (!PMT || PMT <= 0 || !r || r <= 0 || !n || n <= 0) return;

      const lumpSumNeeded = (PMT * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
      const totalPayout = PMT * n;

      setResult({
        monthlyPayout: PMT,
        totalPayout,
        lumpSumNeeded,
        totalInvested: lumpSumNeeded,
        gainOrCost: totalPayout - lumpSumNeeded,
      });
    }
  }

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);
  const fmtExact = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/annuity-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/annuity-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Annuity Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate annuity payouts or find how much you need to invest. Choose between two modes to plan your retirement income.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setMode("payout"); setResult(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "payout" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)] border border-[var(--card-border)]"}`}
            >
              How much will I receive?
            </button>
            <button
              onClick={() => { setMode("needed"); setResult(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "needed" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)] border border-[var(--card-border)]"}`}
            >
              How much do I need?
            </button>
          </div>

          {mode === "payout" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Lump Sum Investment ({currency.symbol})</label>
                <input
                  type="number"
                  value={lumpSum}
                  onChange={(e) => setLumpSum(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 500000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  value={payoutRate}
                  onChange={(e) => setPayoutRate(e.target.value)}
                  className="input-field"
                  step="0.25"
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payout Period (Years)</label>
                <input
                  type="number"
                  value={payoutYears}
                  onChange={(e) => setPayoutYears(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 20"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Desired Monthly Payout ({currency.symbol})</label>
                <input
                  type="number"
                  value={desiredMonthly}
                  onChange={(e) => setDesiredMonthly(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 3000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  value={neededRate}
                  onChange={(e) => setNeededRate(e.target.value)}
                  className="input-field"
                  step="0.25"
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payout Period (Years)</label>
                <input
                  type="number"
                  value={neededYears}
                  onChange={(e) => setNeededYears(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 20"
                />
              </div>
            </div>
          )}

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Annuity
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Monthly Payout</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmtExact(result.monthlyPayout)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">
                  {mode === "payout" ? "Lump Sum Invested" : "Lump Sum Needed"}
                </p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.lumpSumNeeded)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Annuity Summary</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">
                      {mode === "payout" ? "Lump Sum Invested" : "Lump Sum Required"}
                    </td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.lumpSumNeeded)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Monthly Payout</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.monthlyPayout)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Payouts Over Period</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.totalPayout)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Interest Earned</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-blue-700">{fmt(result.gainOrCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Comparison Visual */}
            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Investment vs Total Payouts</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-[var(--muted)] mb-2">Investment</p>
                  <div className="mx-auto bg-green-100 border-2 border-green-400 rounded-lg p-4">
                    <p className="text-xl font-bold text-green-700">{fmt(result.lumpSumNeeded)}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-[var(--muted)] mb-2">Total Payouts</p>
                  <div className="mx-auto bg-blue-100 border-2 border-blue-400 rounded-lg p-4">
                    <p className="text-xl font-bold text-blue-700">{fmt(result.totalPayout)}</p>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4 p-3 bg-[var(--muted-bg)] rounded-lg">
                <p className="text-sm text-[var(--muted)]">
                  You receive <strong className="text-[var(--primary)]">{fmt(result.gainOrCost)}</strong> more than your initial investment ({((result.totalPayout / result.lumpSumNeeded) * 100).toFixed(1)}% return)
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is an Annuity?</h2>
          <p>
            An annuity is a financial product that provides regular payments over a specified period, typically
            used for retirement income. You invest a lump sum with an insurance company or financial institution,
            and in return, you receive guaranteed monthly or annual payments.
          </p>

          <h2>Types of Annuities</h2>
          <ul>
            <li><strong>Fixed annuity</strong> - Provides guaranteed payments at a fixed interest rate</li>
            <li><strong>Variable annuity</strong> - Payments vary based on the performance of underlying investments</li>
            <li><strong>Immediate annuity</strong> - Payments begin right away after a lump sum investment</li>
            <li><strong>Deferred annuity</strong> - Accumulates value over time before payments begin</li>
          </ul>

          <h2>The Annuity Payment Formula</h2>
          <p>The monthly payment from an annuity is calculated using:</p>
          <p><strong>PMT = PV x [r(1+r)^n] / [(1+r)^n - 1]</strong></p>
          <ul>
            <li><strong>PMT</strong> = Monthly payment amount</li>
            <li><strong>PV</strong> = Present value (lump sum invested)</li>
            <li><strong>r</strong> = Monthly interest rate (annual rate / 12)</li>
            <li><strong>n</strong> = Total number of payments (years x 12)</li>
          </ul>

          <h3>Pros and Cons of Annuities</h3>
          <ul>
            <li>Guaranteed income stream for retirement</li>
            <li>Tax-deferred growth on investment</li>
            <li>Can provide income for life or a set period</li>
            <li>May have high fees and surrender charges</li>
            <li>Less liquidity compared to other investments</li>
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
            name: "Annuity Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/annuity-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
