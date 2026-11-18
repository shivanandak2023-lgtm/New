"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "SIP Calculator - Calculate SIP Returns Online",
  description:
    "Free SIP Calculator to estimate returns on your Systematic Investment Plan. Calculate invested amount, estimated returns, and total future value.",
  keywords: "sip calculator, mutual fund sip calculator, sip returns calculator, monthly investment calculator",
};

export default function SIPCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>("5000");
  const [returnRate, setReturnRate] = useState<string>("12");
  const [years, setYears] = useState<string>("10");
  const [result, setResult] = useState<{
    invested: number;
    returns: number;
    totalValue: number;
  } | null>(null);

  function calculate() {
    const P = parseFloat(monthlyInvestment);
    const annualRate = parseFloat(returnRate);
    const n = parseInt(years) * 12;

    if (!P || !annualRate || !n || P <= 0 || annualRate <= 0 || n <= 0) return;

    const r = annualRate / 12 / 100;
    const totalValue = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const invested = P * n;
    const returns = totalValue - invested;

    setResult({ invested, returns, totalValue });
  }

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  const investedPercent = result ? Math.round((result.invested / result.totalValue) * 100) : 0;

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/sip-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/sip-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">SIP Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate returns on your Systematic Investment Plan (SIP) and plan your mutual fund investments.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Investment ({currency.symbol})</label>
              <input
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(e.target.value)}
                className="input-field"
                placeholder="e.g., 5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expected Return Rate (% p.a.)</label>
              <input
                type="number"
                value={returnRate}
                onChange={(e) => setReturnRate(e.target.value)}
                className="input-field"
                step="0.5"
                placeholder="e.g., 12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time Period (Years)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="input-field"
                placeholder="e.g., 10"
              />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Returns
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Invested Amount</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.invested)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Estimated Returns</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.returns)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Value</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(result.totalValue)}</p>
              </div>
            </div>

            <div className="tool-card">
              <h3 className="text-sm font-medium mb-2">Investment Breakdown</h3>
              <div className="w-full h-6 rounded-full overflow-hidden bg-gray-200 flex">
                <div
                  className="h-full bg-[var(--primary)] transition-all"
                  style={{ width: `${investedPercent}%` }}
                />
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${100 - investedPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-[var(--muted)]">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[var(--primary)] inline-block" /> Invested ({investedPercent}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Returns ({100 - investedPercent}%)
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is a SIP?</h2>
          <p>
            SIP (Systematic Investment Plan) is a method of investing a fixed amount regularly in mutual funds. It allows
            you to invest in a disciplined manner, taking advantage of the power of compounding and rupee cost averaging.
          </p>

          <h2>How SIP Returns are Calculated</h2>
          <p>
            SIP returns are calculated using the future value of an annuity formula. Each monthly installment earns
            returns based on the expected annual rate, compounded monthly over the remaining investment period.
          </p>
          <p>
            <strong>FV = P x [((1 + r)^n - 1) / r] x (1 + r)</strong>
          </p>
          <ul>
            <li><strong>P</strong> = Monthly investment amount</li>
            <li><strong>r</strong> = Monthly rate of return (annual rate / 12)</li>
            <li><strong>n</strong> = Total number of installments</li>
          </ul>

          <h2>Benefits of SIP Investing</h2>
          <ul>
            <li>Start with as little as Rs. 500 per month</li>
            <li>Benefit from rupee cost averaging</li>
            <li>Power of compounding grows your wealth over time</li>
            <li>Flexible — increase, decrease, or pause anytime</li>
            <li>Disciplined approach to wealth creation</li>
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
            name: "SIP Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/sip-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
