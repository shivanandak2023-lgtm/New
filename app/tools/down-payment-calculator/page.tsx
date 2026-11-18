"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Down Payment Calculator - Home Down Payment & PMI Estimator",
  description:
    "Free down payment calculator for home buyers. Compare different down payment percentages, estimate monthly payments, and see PMI costs when under 20%.",
  keywords:
    "down payment calculator, home down payment, house down payment, PMI calculator, mortgage down payment, how much down payment for house, 20 percent down payment",
};

const PRESET_PERCENTAGES = [5, 10, 15, 20, 25];

export default function DownPaymentCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [homePrice, setHomePrice] = useState<string>("400000");
  const [downPaymentPct, setDownPaymentPct] = useState<string>("20");
  const [customPct, setCustomPct] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("6.5");
  const [loanTerm, setLoanTerm] = useState<string>("30");
  const [result, setResult] = useState<{
    downPayment: number;
    loanAmount: number;
    monthlyPayment: number;
    monthlyPMI: number;
    totalMonthly: number;
    comparison: { pct: number; dp: number; loan: number; monthly: number; pmi: number; total: number }[];
  } | null>(null);

  function calculate() {
    const price = parseFloat(homePrice);
    const rate = parseFloat(interestRate);
    const term = parseInt(loanTerm);

    if (!price || price <= 0 || !rate || rate <= 0 || !term || term <= 0) return;

    const pct = parseFloat(customPct || downPaymentPct);
    if (!pct || pct <= 0 || pct >= 100) return;

    function calcMonthly(loanAmt: number): number {
      const r = rate / 12 / 100;
      const n = term * 12;
      return (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    function calcPMI(loanAmt: number, dpPct: number): number {
      if (dpPct >= 20) return 0;
      // Approximate PMI: 0.5% to 1% of loan amount annually, depending on down payment
      const pmiRate = dpPct < 10 ? 0.01 : 0.005;
      return (loanAmt * pmiRate) / 12;
    }

    const downPayment = price * (pct / 100);
    const loanAmount = price - downPayment;
    const monthlyPayment = calcMonthly(loanAmount);
    const monthlyPMI = calcPMI(loanAmount, pct);
    const totalMonthly = monthlyPayment + monthlyPMI;

    // Build comparison table
    const allPcts = [...PRESET_PERCENTAGES];
    if (!allPcts.includes(pct)) allPcts.push(pct);
    allPcts.sort((a, b) => a - b);

    const comparison = allPcts.map((p) => {
      const dp = price * (p / 100);
      const loan = price - dp;
      const monthly = calcMonthly(loan);
      const pmi = calcPMI(loan, p);
      return { pct: p, dp, loan, monthly, pmi, total: monthly + pmi };
    });

    setResult({ downPayment, loanAmount, monthlyPayment, monthlyPMI, totalMonthly, comparison });
  }

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);
  const fmtExact = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/down-payment-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/down-payment-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Down Payment Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your home down payment, loan amount, estimated monthly payment, and PMI. Compare different down payment percentages side by side.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Home Price ({currency.symbol})</label>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(e.target.value)}
                className="input-field"
                placeholder="e.g., 400000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Down Payment %</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {PRESET_PERCENTAGES.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setDownPaymentPct(String(p)); setCustomPct(""); }}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold border transition-colors ${
                      downPaymentPct === String(p) && !customPct
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "bg-[var(--muted-bg)] border-[var(--card-border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={customPct}
                onChange={(e) => setCustomPct(e.target.value)}
                className="input-field"
                placeholder="Custom %"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="input-field"
                step="0.125"
                placeholder="e.g., 6.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Loan Term</label>
              <select value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="input-field">
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="30">30 Years</option>
              </select>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Down Payment
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Down Payment</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmt(result.downPayment)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Loan Amount</p>
                <p className="text-xl font-bold">{fmt(result.loanAmount)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Monthly Payment</p>
                <p className="text-xl font-bold text-green-700">{fmtExact(result.monthlyPayment)}</p>
              </div>
              <div className="result-card text-center" style={{ background: result.monthlyPMI > 0 ? "#fef2f2" : "#f0fdf4", borderColor: result.monthlyPMI > 0 ? "#fecaca" : "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">PMI / Month</p>
                <p className={`text-xl font-bold ${result.monthlyPMI > 0 ? "text-red-700" : "text-green-700"}`}>
                  {result.monthlyPMI > 0 ? fmtExact(result.monthlyPMI) : "None"}
                </p>
              </div>
            </div>

            {result.monthlyPMI > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg mb-6 text-sm">
                <strong>PMI Notice:</strong> Since your down payment is less than 20%, private mortgage insurance (PMI) of approximately {fmtExact(result.monthlyPMI)}/month is added. Your total monthly payment is <strong>{fmtExact(result.totalMonthly)}</strong>. PMI can be removed once you reach 20% equity.
              </div>
            )}

            {/* Comparison Table */}
            <div className="tool-card overflow-x-auto">
              <h2 className="text-lg font-bold mb-4">Down Payment Comparison</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Down %</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Down Payment</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Loan Amount</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Monthly (P&I)</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">PMI</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Total Monthly</th>
                  </tr>
                </thead>
                <tbody>
                  {result.comparison.map((row) => {
                    const isSelected = row.pct === parseFloat(customPct || downPaymentPct);
                    return (
                      <tr key={row.pct} className={isSelected ? "bg-blue-50 font-semibold" : "hover:bg-[var(--muted-bg)]"}>
                        <td className="border border-[var(--card-border)] px-3 py-2">
                          {row.pct}% {isSelected && "(selected)"}
                        </td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.dp)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.loan)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(row.monthly)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">
                          {row.pmi > 0 ? fmtExact(row.pmi) : "None"}
                        </td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">
                          {fmtExact(row.total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Much Down Payment Do You Need?</h2>
          <p>
            The down payment is the upfront amount you pay when purchasing a home. While 20% is the traditional
            recommendation, many loan programs allow much lower down payments. FHA loans require as little as
            3.5%, and some conventional loans start at 3%.
          </p>

          <h2>What is PMI?</h2>
          <p>
            Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home
            price. PMI protects the lender in case you default on the loan. It typically costs 0.5% to 1%
            of the loan amount annually and can be removed once you reach 20% equity.
          </p>

          <h3>Down Payment Guidelines by Loan Type</h3>
          <ul>
            <li><strong>Conventional loan</strong> - 3% to 20% down; PMI required under 20%</li>
            <li><strong>FHA loan</strong> - 3.5% minimum down with mortgage insurance premium (MIP)</li>
            <li><strong>VA loan</strong> - 0% down payment for eligible veterans</li>
            <li><strong>USDA loan</strong> - 0% down for eligible rural properties</li>
          </ul>

          <h3>Pros and Cons of a Large Down Payment</h3>
          <ul>
            <li>Lower monthly payments and total interest paid</li>
            <li>No PMI with 20% or more down</li>
            <li>Better loan terms and interest rates</li>
            <li>Less money available for other investments or emergencies</li>
            <li>Takes longer to save, potentially missing market opportunities</li>
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
            name: "Down Payment Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/down-payment-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
