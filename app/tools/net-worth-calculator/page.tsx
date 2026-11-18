"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Net Worth Calculator - Track Your Assets & Liabilities",
  description:
    "Free net worth calculator to compute your total assets, liabilities, and net worth. Visual breakdown with bar chart to track your financial health.",
  keywords:
    "net worth calculator, calculate net worth, total assets, total liabilities, financial health calculator, personal net worth, wealth calculator",
};

export default function NetWorthCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [cash, setCash] = useState<string>("5000");
  const [savings, setSavings] = useState<string>("15000");
  const [investments, setInvestments] = useState<string>("25000");
  const [realEstate, setRealEstate] = useState<string>("250000");
  const [vehicles, setVehicles] = useState<string>("20000");
  const [retirement, setRetirement] = useState<string>("50000");
  const [otherAssets, setOtherAssets] = useState<string>("0");

  const [mortgage, setMortgage] = useState<string>("180000");
  const [carLoans, setCarLoans] = useState<string>("12000");
  const [studentLoansVal, setStudentLoansVal] = useState<string>("30000");
  const [creditCardsVal, setCreditCardsVal] = useState<string>("5000");
  const [otherDebts, setOtherDebts] = useState<string>("0");

  const [result, setResult] = useState<{
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    assetBreakdown: { label: string; value: number }[];
    liabilityBreakdown: { label: string; value: number }[];
  } | null>(null);

  function calculate() {
    const assets = [
      { label: "Cash", value: parseFloat(cash) || 0 },
      { label: "Savings", value: parseFloat(savings) || 0 },
      { label: "Investments", value: parseFloat(investments) || 0 },
      { label: "Real Estate", value: parseFloat(realEstate) || 0 },
      { label: "Vehicles", value: parseFloat(vehicles) || 0 },
      { label: "Retirement Accounts", value: parseFloat(retirement) || 0 },
      { label: "Other Assets", value: parseFloat(otherAssets) || 0 },
    ];

    const liabilities = [
      { label: "Mortgage", value: parseFloat(mortgage) || 0 },
      { label: "Car Loans", value: parseFloat(carLoans) || 0 },
      { label: "Student Loans", value: parseFloat(studentLoansVal) || 0 },
      { label: "Credit Cards", value: parseFloat(creditCardsVal) || 0 },
      { label: "Other Debts", value: parseFloat(otherDebts) || 0 },
    ];

    const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.value, 0);
    const netWorth = totalAssets - totalLiabilities;

    setResult({
      totalAssets,
      totalLiabilities,
      netWorth,
      assetBreakdown: assets.filter((a) => a.value > 0),
      liabilityBreakdown: liabilities.filter((l) => l.value > 0),
    });
  }

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/net-worth-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Net Worth Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your net worth by entering all your assets and liabilities. See a complete breakdown of your financial health with a visual bar chart.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <h2 className="text-lg font-bold mb-4 text-green-700">Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Cash & Checking ({currency.symbol})</label>
              <input type="number" value={cash} onChange={(e) => setCash(e.target.value)} className="input-field" placeholder="e.g., 5000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Savings Accounts ({currency.symbol})</label>
              <input type="number" value={savings} onChange={(e) => setSavings(e.target.value)} className="input-field" placeholder="e.g., 15000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Investments ({currency.symbol})</label>
              <input type="number" value={investments} onChange={(e) => setInvestments(e.target.value)} className="input-field" placeholder="e.g., 25000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Real Estate ({currency.symbol})</label>
              <input type="number" value={realEstate} onChange={(e) => setRealEstate(e.target.value)} className="input-field" placeholder="e.g., 250000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vehicles ({currency.symbol})</label>
              <input type="number" value={vehicles} onChange={(e) => setVehicles(e.target.value)} className="input-field" placeholder="e.g., 20000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Retirement Accounts ({currency.symbol})</label>
              <input type="number" value={retirement} onChange={(e) => setRetirement(e.target.value)} className="input-field" placeholder="e.g., 50000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Other Assets ({currency.symbol})</label>
              <input type="number" value={otherAssets} onChange={(e) => setOtherAssets(e.target.value)} className="input-field" placeholder="e.g., 0" />
            </div>
          </div>
        </div>

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4 text-red-700">Liabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Mortgage ({currency.symbol})</label>
              <input type="number" value={mortgage} onChange={(e) => setMortgage(e.target.value)} className="input-field" placeholder="e.g., 180000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Car Loans ({currency.symbol})</label>
              <input type="number" value={carLoans} onChange={(e) => setCarLoans(e.target.value)} className="input-field" placeholder="e.g., 12000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Student Loans ({currency.symbol})</label>
              <input type="number" value={studentLoansVal} onChange={(e) => setStudentLoansVal(e.target.value)} className="input-field" placeholder="e.g., 30000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Credit Cards ({currency.symbol})</label>
              <input type="number" value={creditCardsVal} onChange={(e) => setCreditCardsVal(e.target.value)} className="input-field" placeholder="e.g., 5000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Other Debts ({currency.symbol})</label>
              <input type="number" value={otherDebts} onChange={(e) => setOtherDebts(e.target.value)} className="input-field" placeholder="e.g., 0" />
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Net Worth
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Assets</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.totalAssets)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Liabilities</p>
                <p className="text-2xl font-bold text-red-700">{fmt(result.totalLiabilities)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Net Worth</p>
                <p className={`text-2xl font-bold ${result.netWorth >= 0 ? "text-[var(--primary)]" : "text-red-700"}`}>
                  {fmt(result.netWorth)}
                </p>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Visual Breakdown</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Total Assets</span>
                    <span className="font-semibold text-green-700">{fmt(result.totalAssets)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div
                      className="bg-green-500 h-6 rounded-full transition-all"
                      style={{ width: `${Math.min((result.totalAssets / Math.max(result.totalAssets, result.totalLiabilities)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Total Liabilities</span>
                    <span className="font-semibold text-red-700">{fmt(result.totalLiabilities)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div
                      className="bg-red-500 h-6 rounded-full transition-all"
                      style={{ width: `${Math.min((result.totalLiabilities / Math.max(result.totalAssets, result.totalLiabilities)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Asset Breakdown */}
              {result.assetBreakdown.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold mb-3">Asset Breakdown</h3>
                  <div className="space-y-2">
                    {result.assetBreakdown.map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{item.label}</span>
                          <span className="font-semibold">{fmt(item.value)} ({((item.value / result.totalAssets) * 100).toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div
                            className="bg-green-300 h-3 rounded-full"
                            style={{ width: `${(item.value / result.totalAssets) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Liability Breakdown */}
              {result.liabilityBreakdown.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold mb-3">Liability Breakdown</h3>
                  <div className="space-y-2">
                    {result.liabilityBreakdown.map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{item.label}</span>
                          <span className="font-semibold">{fmt(item.value)} ({((item.value / result.totalLiabilities) * 100).toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div
                            className="bg-red-300 h-3 rounded-full"
                            style={{ width: `${(item.value / result.totalLiabilities) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is Net Worth?</h2>
          <p>
            Net worth is the value of everything you own (assets) minus everything you owe (liabilities).
            It provides a snapshot of your overall financial health at a specific point in time.
          </p>
          <p><strong>Net Worth = Total Assets - Total Liabilities</strong></p>

          <h2>Types of Assets</h2>
          <ul>
            <li><strong>Liquid assets</strong> - Cash, checking, and savings accounts that can be accessed quickly</li>
            <li><strong>Investment assets</strong> - Stocks, bonds, mutual funds, and retirement accounts</li>
            <li><strong>Fixed assets</strong> - Real estate, vehicles, and other physical property</li>
          </ul>

          <h2>Types of Liabilities</h2>
          <ul>
            <li><strong>Secured debt</strong> - Mortgage, auto loans (backed by collateral)</li>
            <li><strong>Unsecured debt</strong> - Credit cards, personal loans, medical bills</li>
            <li><strong>Student loans</strong> - Federal and private education debt</li>
          </ul>

          <h3>How to Increase Your Net Worth</h3>
          <ul>
            <li>Pay down high-interest debt aggressively</li>
            <li>Increase your savings rate each year</li>
            <li>Invest consistently in diversified portfolios</li>
            <li>Avoid lifestyle inflation as your income grows</li>
            <li>Track your net worth quarterly to stay motivated</li>
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
            name: "Net Worth Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/net-worth-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
