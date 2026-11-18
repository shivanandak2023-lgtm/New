"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Investment Calculator - Compound Growth & Returns Estimator",
  description:
    "Free investment calculator to estimate compound growth on your investments. See total invested, total returns, final value, and year-by-year growth table.",
  keywords:
    "investment calculator, compound interest calculator, investment return calculator, investment growth calculator, monthly contribution calculator, compound growth",
};

export default function InvestmentCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [initialInvestment, setInitialInvestment] = useState<string>("10000");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("500");
  const [annualReturn, setAnnualReturn] = useState<string>("8");
  const [years, setYears] = useState<string>("20");
  const [compoundFrequency, setCompoundFrequency] = useState<string>("12");
  const [showTable, setShowTable] = useState(false);
  const [result, setResult] = useState<{
    finalValue: number;
    totalInvested: number;
    totalReturns: number;
    yearlyData: { year: number; invested: number; returns: number; balance: number }[];
  } | null>(null);

  function calculate() {
    const P = parseFloat(initialInvestment) || 0;
    const PMT = parseFloat(monthlyContribution) || 0;
    const r = (parseFloat(annualReturn) || 0) / 100;
    const t = parseInt(years) || 0;
    const n = parseInt(compoundFrequency) || 12;

    if (t <= 0 || r < 0) return;

    const yearlyData: { year: number; invested: number; returns: number; balance: number }[] = [];
    let balance = P;
    let totalContributed = P;

    for (let year = 1; year <= t; year++) {
      for (let period = 0; period < n; period++) {
        balance = balance * (1 + r / n);
        const monthsInPeriod = 12 / n;
        balance += PMT * monthsInPeriod;
        totalContributed += PMT * monthsInPeriod;
      }

      yearlyData.push({
        year,
        invested: totalContributed,
        returns: balance - totalContributed,
        balance,
      });
    }

    const finalValue = balance;
    const totalInvested = totalContributed;
    const totalReturns = finalValue - totalInvested;

    setResult({ finalValue, totalInvested, totalReturns, yearlyData });
  }

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/investment-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/investment-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Investment Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Estimate the future value of your investments with compound growth. Enter your initial investment, monthly contributions, expected return rate, and time horizon.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Initial Investment ({currency.symbol})</label>
              <input
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                className="input-field"
                placeholder="e.g., 10000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Monthly Contribution ({currency.symbol})</label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="input-field"
                placeholder="e.g., 500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Annual Return Rate (%)</label>
              <input
                type="number"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
                className="input-field"
                step="0.5"
                placeholder="e.g., 8"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Investment Period (Years)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="input-field"
                placeholder="e.g., 20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Compound Frequency</label>
              <select
                value={compoundFrequency}
                onChange={(e) => setCompoundFrequency(e.target.value)}
                className="input-field"
              >
                <option value="1">Annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
                <option value="365">Daily</option>
              </select>
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
                <p className="text-sm text-[var(--muted)] mb-1">Final Value</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.finalValue)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Invested</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.totalInvested)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Returns</p>
                <p className="text-2xl font-bold text-blue-700">{fmt(result.totalReturns)}</p>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Investment vs Returns</h2>
              <div className="w-full rounded-full h-8 overflow-hidden flex">
                <div
                  className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ width: `${(result.totalInvested / result.finalValue) * 100}%` }}
                >
                  {((result.totalInvested / result.finalValue) * 100).toFixed(0)}%
                </div>
                <div
                  className="bg-blue-500 h-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ width: `${(result.totalReturns / result.finalValue) * 100}%` }}
                >
                  {((result.totalReturns / result.finalValue) * 100).toFixed(0)}%
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-[var(--muted)]">
                <span>Invested: {fmt(result.totalInvested)}</span>
                <span>Returns: {fmt(result.totalReturns)}</span>
              </div>
            </div>

            {/* Year-by-Year Table */}
            <div className="tool-card overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Year-by-Year Growth</h2>
                <button
                  onClick={() => setShowTable(!showTable)}
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  {showTable ? "Hide Table" : "Show Table"}
                </button>
              </div>

              {showTable && (
                <>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-[var(--muted-bg)]">
                        <th className="border border-[var(--card-border)] px-3 py-2 text-left">Year</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Total Invested</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Returns</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlyData.map((row) => (
                        <tr key={row.year} className="hover:bg-[var(--muted-bg)]">
                          <td className="border border-[var(--card-border)] px-3 py-2">{row.year}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.invested)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right text-blue-700">{fmt(row.returns)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does the Investment Calculator Work?</h2>
          <p>
            This investment calculator estimates the future value of your investments using compound interest.
            It factors in your initial investment, regular monthly contributions, expected annual return rate,
            and your selected compounding frequency to project growth over time.
          </p>

          <h2>The Power of Compound Interest</h2>
          <p>
            Compound interest means you earn returns not just on your original investment, but also on the
            returns that have already accumulated. This creates an exponential growth effect over time,
            which is why starting early is so important.
          </p>
          <p>The compound interest formula is:</p>
          <p><strong>A = P(1 + r/n)^(nt)</strong></p>
          <ul>
            <li><strong>A</strong> = Final amount</li>
            <li><strong>P</strong> = Principal (initial investment)</li>
            <li><strong>r</strong> = Annual interest rate (decimal)</li>
            <li><strong>n</strong> = Number of compounding periods per year</li>
            <li><strong>t</strong> = Number of years</li>
          </ul>

          <h3>Investment Tips for Beginners</h3>
          <ul>
            <li>Start investing as early as possible to maximize compound growth</li>
            <li>Diversify your portfolio across different asset classes</li>
            <li>Consider low-cost index funds for broad market exposure</li>
            <li>Stay consistent with monthly contributions regardless of market conditions</li>
            <li>Reinvest dividends to accelerate compound growth</li>
          </ul>

          <h3>Historical Average Returns</h3>
          <p>
            The S&P 500 has historically returned approximately 10% annually before inflation, or about
            7% after inflation. Bond markets typically return 4-6% annually. A balanced portfolio of
            stocks and bonds might average 7-8% per year over long periods.
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
            name: "Investment Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/investment-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
