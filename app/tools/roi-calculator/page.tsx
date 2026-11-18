"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "ROI Calculator - Return on Investment Calculator",
  description:
    "Free ROI calculator to measure return on investment. Calculate ROI percentage, annualized return, and profit/loss. Compare multiple investments side by side.",
  keywords:
    "roi calculator, return on investment, investment return calculator, roi formula, profit calculator, annualized roi, investment comparison",
};

interface Investment {
  id: number;
  name: string;
  initialInvestment: string;
  finalValue: string;
  timePeriod: string;
  roi: number;
  annualizedRoi: number;
  profitLoss: number;
}

function createInvestment(id: number): Investment {
  return {
    id,
    name: `Investment ${id}`,
    initialInvestment: "10000",
    finalValue: "15000",
    timePeriod: "3",
    roi: 0,
    annualizedRoi: 0,
    profitLoss: 0,
  };
}

export default function RoiCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [investments, setInvestments] = useState<Investment[]>([createInvestment(1)]);
  const [calculated, setCalculated] = useState(false);

  function calculate() {
    const updated = investments.map((inv) => {
      const initial = parseFloat(inv.initialInvestment) || 0;
      const final_ = parseFloat(inv.finalValue) || 0;
      const years = parseFloat(inv.timePeriod) || 1;

      if (initial <= 0) return { ...inv, roi: 0, annualizedRoi: 0, profitLoss: 0 };

      const profitLoss = final_ - initial;
      const roi = (profitLoss / initial) * 100;
      const annualizedRoi = (Math.pow(final_ / initial, 1 / years) - 1) * 100;

      return { ...inv, roi, annualizedRoi, profitLoss };
    });
    setInvestments(updated);
    setCalculated(true);
  }

  function updateInvestment(id: number, field: string, value: string) {
    setInvestments(investments.map((inv) => inv.id === id ? { ...inv, [field]: value } : inv));
  }

  function addInvestment() {
    setInvestments([...investments, createInvestment(investments.length + 1)]);
  }

  function removeInvestment(id: number) {
    if (investments.length > 1) {
      setInvestments(investments.filter((inv) => inv.id !== id));
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
        <link rel="canonical" href={`${SITE_URL}/tools/roi-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">ROI Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate Return on Investment (ROI) to measure the profitability of your investments. Compare multiple investments side by side with annualized returns.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-4">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
        </div>

        {investments.map((inv) => (
          <div key={inv.id} className="tool-card mb-4">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={inv.name}
                onChange={(e) => updateInvestment(inv.id, "name", e.target.value)}
                className="input-field w-48 text-sm font-semibold"
              />
              {investments.length > 1 && (
                <button onClick={() => removeInvestment(inv.id)} className="text-red-500 text-sm hover:underline">
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Initial Investment ({currency.symbol})</label>
                <input
                  type="number"
                  value={inv.initialInvestment}
                  onChange={(e) => updateInvestment(inv.id, "initialInvestment", e.target.value)}
                  className="input-field"
                  placeholder="e.g., 10000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Final Value ({currency.symbol})</label>
                <input
                  type="number"
                  value={inv.finalValue}
                  onChange={(e) => updateInvestment(inv.id, "finalValue", e.target.value)}
                  className="input-field"
                  placeholder="e.g., 15000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time Period (years)</label>
                <input
                  type="number"
                  value={inv.timePeriod}
                  onChange={(e) => updateInvestment(inv.id, "timePeriod", e.target.value)}
                  className="input-field"
                  placeholder="e.g., 3"
                  step="0.5"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-4 mb-6">
          <button onClick={addInvestment} className="text-sm text-[var(--primary)] hover:underline">
            + Add Another Investment
          </button>
        </div>

        <div className="tool-card mb-8">
          <button onClick={calculate} className="btn-primary">
            Calculate ROI
          </button>
        </div>

        {calculated && (
          <div className="mb-8">
            {investments.length === 1 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="result-card text-center">
                    <p className="text-sm text-[var(--muted)] mb-1">ROI</p>
                    <p className={`text-2xl font-bold ${investments[0].roi >= 0 ? "text-green-700" : "text-red-600"}`}>
                      {investments[0].roi.toFixed(2)}%
                    </p>
                  </div>
                  <div className="result-card text-center">
                    <p className="text-sm text-[var(--muted)] mb-1">Annualized ROI</p>
                    <p className={`text-2xl font-bold ${investments[0].annualizedRoi >= 0 ? "text-[var(--primary)]" : "text-red-600"}`}>
                      {investments[0].annualizedRoi.toFixed(2)}%
                    </p>
                  </div>
                  <div className="result-card text-center" style={investments[0].profitLoss >= 0 ? { background: "#f0fdf4", borderColor: "#bbf7d0" } : { background: "#fef2f2", borderColor: "#fecaca" }}>
                    <p className="text-sm text-[var(--muted)] mb-1">Profit / Loss</p>
                    <p className={`text-2xl font-bold ${investments[0].profitLoss >= 0 ? "text-green-700" : "text-red-600"}`}>
                      {fmtExact(investments[0].profitLoss)}
                    </p>
                  </div>
                </div>

                <div className="tool-card mb-6">
                  <h2 className="text-lg font-bold mb-4">Investment Summary</h2>
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      <tr className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">Initial Investment</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(parseFloat(investments[0].initialInvestment) || 0)}</td>
                      </tr>
                      <tr className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">Final Value</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(parseFloat(investments[0].finalValue) || 0)}</td>
                      </tr>
                      <tr className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">Profit / Loss</td>
                        <td className={`border border-[var(--card-border)] px-3 py-2 text-right font-semibold ${investments[0].profitLoss >= 0 ? "text-green-700" : "text-red-600"}`}>{fmtExact(investments[0].profitLoss)}</td>
                      </tr>
                      <tr className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">Time Period</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{investments[0].timePeriod} years</td>
                      </tr>
                      <tr className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">Total ROI</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{investments[0].roi.toFixed(2)}%</td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Annualized ROI</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{investments[0].annualizedRoi.toFixed(2)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="tool-card mb-6">
                <h2 className="text-lg font-bold mb-4">Investment Comparison</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-[var(--muted-bg)]">
                        <th className="border border-[var(--card-border)] px-3 py-2 text-left">Investment</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Initial</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Final</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Profit/Loss</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">ROI %</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annualized</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map((inv) => (
                        <tr key={inv.id} className="hover:bg-[var(--muted-bg)]">
                          <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">{inv.name}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(parseFloat(inv.initialInvestment) || 0)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(parseFloat(inv.finalValue) || 0)}</td>
                          <td className={`border border-[var(--card-border)] px-3 py-2 text-right font-semibold ${inv.profitLoss >= 0 ? "text-green-700" : "text-red-600"}`}>{fmtExact(inv.profitLoss)}</td>
                          <td className={`border border-[var(--card-border)] px-3 py-2 text-right font-semibold ${inv.roi >= 0 ? "text-green-700" : "text-red-600"}`}>{inv.roi.toFixed(2)}%</td>
                          <td className={`border border-[var(--card-border)] px-3 py-2 text-right font-semibold ${inv.annualizedRoi >= 0 ? "text-[var(--primary)]" : "text-red-600"}`}>{inv.annualizedRoi.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate ROI</h2>
          <p>
            Return on Investment (ROI) measures the profitability of an investment relative to its cost. It is expressed
            as a percentage and is one of the most commonly used metrics for evaluating investment performance.
          </p>

          <h2>The ROI Formula</h2>
          <p><strong>ROI = ((Final Value - Initial Investment) / Initial Investment) x 100</strong></p>
          <p>For example, investing $10,000 that grows to $15,000 gives an ROI of 50%.</p>

          <h2>Annualized ROI</h2>
          <p>Annualized ROI accounts for the time period of the investment, allowing you to compare investments of different durations:</p>
          <p><strong>Annualized ROI = ((Final / Initial)^(1/Years) - 1) x 100</strong></p>

          <h3>When to Use ROI</h3>
          <ul>
            <li>Comparing different investment opportunities</li>
            <li>Evaluating business project returns</li>
            <li>Measuring marketing campaign effectiveness</li>
            <li>Analyzing real estate investments</li>
            <li>Assessing stock market performance</li>
          </ul>

          <h3>Limitations of ROI</h3>
          <ul>
            <li>Does not account for risk or volatility</li>
            <li>Simple ROI does not consider the time value of money</li>
            <li>Does not factor in ongoing costs (maintenance, taxes, fees)</li>
            <li>Use annualized ROI to fairly compare investments held for different periods</li>
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
            name: "ROI Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/roi-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
