"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Compound Interest Calculator - Calculate Investment Growth",
  description:
    "Free compound interest calculator to see how your savings and investments grow over time. View year-by-year breakdown with monthly, quarterly, or annual compounding.",
  keywords:
    "compound interest calculator, investment calculator, savings calculator, compound interest formula, interest rate calculator, compound growth, money growth calculator",
};

type Frequency = "annually" | "semiannually" | "quarterly" | "monthly" | "daily";

const FREQ_MAP: Record<Frequency, number> = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

export default function CompoundInterestCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [principal, setPrincipal] = useState<string>("10000");
  const [rate, setRate] = useState<string>("7");
  const [years, setYears] = useState<string>("10");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("100");
  const [result, setResult] = useState<{
    finalAmount: number;
    totalInterest: number;
    totalContributions: number;
    schedule: { year: number; balance: number; interest: number; contributions: number }[];
  } | null>(null);

  function calculate() {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseInt(years);
    const n = FREQ_MAP[frequency];
    const mc = parseFloat(monthlyContribution) || 0;

    if (!P || !r || !t || P < 0 || r <= 0 || t <= 0) return;

    const schedule: { year: number; balance: number; interest: number; contributions: number }[] = [];
    let balance = P;
    let totalInterest = 0;
    let totalContributions = P;

    for (let y = 1; y <= t; y++) {
      let yearInterest = 0;
      let yearContributions = 0;

      for (let period = 0; period < n; period++) {
        const periodInterest = balance * (r / n);
        yearInterest += periodInterest;
        balance += periodInterest;

        // Add monthly contributions proportionally
        const monthsInPeriod = 12 / n;
        const periodContribution = mc * monthsInPeriod;
        balance += periodContribution;
        yearContributions += periodContribution;
      }

      totalInterest += yearInterest;
      totalContributions += yearContributions;

      schedule.push({
        year: y,
        balance: Math.round(balance * 100) / 100,
        interest: Math.round(yearInterest * 100) / 100,
        contributions: Math.round(yearContributions * 100) / 100,
      });
    }

    setResult({
      finalAmount: Math.round(balance * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalContributions: Math.round(totalContributions * 100) / 100,
      schedule,
    });
  }

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/compound-interest-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Compound Interest Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          See how your money grows over time with compound interest. Enter your principal, interest rate, and time period to get a detailed year-by-year breakdown.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Initial Investment ({currency.symbol})</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="input-field"
                placeholder="e.g., 10000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Annual Interest Rate (%)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="input-field"
                step="0.1"
                placeholder="e.g., 7"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time Period (years)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="input-field"
                placeholder="e.g., 10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Compounding Frequency</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)} className="input-field">
                <option value="annually">Annually</option>
                <option value="semiannually">Semi-Annually</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Monthly Contribution ({currency.symbol})</label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="input-field"
                placeholder="e.g., 100"
              />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary mt-6">
            Calculate
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Final Amount</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.finalAmount)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Interest Earned</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.totalInterest)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Contributions</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(result.totalContributions)}</p>
              </div>
            </div>

            <div className="tool-card overflow-x-auto">
              <h2 className="text-lg font-bold mb-4">Year-by-Year Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Year</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Contributions</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Interest</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.year} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{row.year}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.contributions)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.interest)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is Compound Interest?</h2>
          <p>
            Compound interest is the interest calculated on the initial principal and also on the accumulated interest from
            previous periods. It is often described as &quot;interest on interest&quot; and makes your money grow faster than
            simple interest, which is calculated only on the principal amount.
          </p>

          <h2>The Compound Interest Formula</h2>
          <p>The formula for compound interest is:</p>
          <p><strong>A = P(1 + r/n)^(nt)</strong></p>
          <ul>
            <li><strong>A</strong> = Final amount</li>
            <li><strong>P</strong> = Principal (initial investment)</li>
            <li><strong>r</strong> = Annual interest rate (decimal)</li>
            <li><strong>n</strong> = Number of times interest is compounded per year</li>
            <li><strong>t</strong> = Number of years</li>
          </ul>

          <h2>How Compounding Frequency Affects Growth</h2>
          <p>
            The more frequently interest is compounded, the more you earn. Monthly compounding yields more than annual
            compounding, and daily compounding yields even more. However, the difference between daily and monthly compounding
            is usually small for typical savings rates.
          </p>

          <h3>Tips for Maximizing Compound Interest</h3>
          <ul>
            <li>Start investing early -- time is the most powerful factor</li>
            <li>Make regular monthly contributions to accelerate growth</li>
            <li>Reinvest your earnings rather than withdrawing them</li>
            <li>Choose accounts with higher compounding frequencies</li>
            <li>Minimize fees that eat into your returns</li>
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
            name: "Compound Interest Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/compound-interest-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
