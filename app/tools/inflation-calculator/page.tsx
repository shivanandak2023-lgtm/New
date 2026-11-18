"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Inflation Calculator - Calculate Buying Power Over Time",
  description:
    "Free inflation calculator to see how the purchasing power of the US dollar has changed over time. Calculate equivalent values from 1913 to 2026 using average CPI data.",
  keywords:
    "inflation calculator, cpi calculator, purchasing power calculator, inflation rate, dollar value calculator, cost of living calculator, inflation adjustment",
};

// Average annual CPI inflation rates by decade (approximate US averages)
const DECADE_RATES: { decade: string; avgRate: number }[] = [
  { decade: "1913-1919", avgRate: 8.7 },
  { decade: "1920-1929", avgRate: -1.1 },
  { decade: "1930-1939", avgRate: -2.0 },
  { decade: "1940-1949", avgRate: 5.6 },
  { decade: "1950-1959", avgRate: 2.2 },
  { decade: "1960-1969", avgRate: 2.5 },
  { decade: "1970-1979", avgRate: 7.4 },
  { decade: "1980-1989", avgRate: 5.1 },
  { decade: "1990-1999", avgRate: 2.9 },
  { decade: "2000-2009", avgRate: 2.6 },
  { decade: "2010-2019", avgRate: 1.8 },
  { decade: "2020-2026", avgRate: 4.8 },
];

const AVG_INFLATION_RATE = 3.2; // long-run average

export default function InflationCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [amount, setAmount] = useState<string>("100");
  const [startYear, setStartYear] = useState<string>("2000");
  const [endYear, setEndYear] = useState<string>("2026");

  const amt = parseFloat(amount) || 0;
  const start = parseInt(startYear) || 2000;
  const end = parseInt(endYear) || 2026;
  const years = end - start;

  const cumulativeRate = Math.pow(1 + AVG_INFLATION_RATE / 100, Math.abs(years));
  const equivalentValue = years >= 0 ? amt * cumulativeRate : amt / Math.pow(1 + AVG_INFLATION_RATE / 100, Math.abs(years));
  const cumulativeInflation = (cumulativeRate - 1) * 100;
  const buyingPowerChange = years >= 0
    ? ((amt / equivalentValue) - 1) * 100
    : ((equivalentValue / amt) - 1) * 100;

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  // Year-by-year table (show every 5 years)
  const yearlyData: { year: number; value: number }[] = [];
  const step = Math.abs(years) > 20 ? 5 : Math.abs(years) > 10 ? 2 : 1;
  if (years >= 0) {
    for (let y = start; y <= end; y += step) {
      const elapsed = y - start;
      yearlyData.push({ year: y, value: amt * Math.pow(1 + AVG_INFLATION_RATE / 100, elapsed) });
    }
    if (yearlyData.length === 0 || yearlyData[yearlyData.length - 1].year !== end) {
      yearlyData.push({ year: end, value: equivalentValue });
    }
  } else {
    for (let y = start; y >= end; y -= step) {
      const elapsed = start - y;
      yearlyData.push({ year: y, value: amt / Math.pow(1 + AVG_INFLATION_RATE / 100, elapsed) });
    }
    if (yearlyData.length === 0 || yearlyData[yearlyData.length - 1].year !== end) {
      yearlyData.push({ year: end, value: equivalentValue });
    }
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/inflation-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Inflation Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate how inflation has affected the purchasing power of the US dollar. See what an amount from any year is
          worth today, or what today&apos;s dollars were worth in the past.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Amount ({currency.symbol})</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" step="1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Year</label>
              <input type="number" value={startYear} onChange={(e) => setStartYear(e.target.value)} className="input-field" min="1913" max="2026" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Year</label>
              <input type="number" value={endYear} onChange={(e) => setEndYear(e.target.value)} className="input-field" min="1913" max="2026" />
            </div>
          </div>
          <p className="text-xs text-[var(--muted)] mt-3">
            Uses the average US CPI inflation rate of ~{AVG_INFLATION_RATE}% per year (historical long-run average from 1913 to 2026).
          </p>
        </div>

        {amt > 0 && years !== 0 && (
          <div className="mb-8">
            <div className="result-card text-center mb-6">
              <p className="text-sm text-[var(--muted)] mb-1">
                {fmt(amt)} in {start} is equivalent to
              </p>
              <p className="text-3xl font-bold text-[var(--primary)]">{fmt(equivalentValue)}</p>
              <p className="text-sm text-[var(--muted)] mt-1">in {end}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Cumulative Inflation</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{cumulativeInflation.toFixed(1)}%</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Average Annual Rate</p>
                <p className="text-2xl font-bold text-amber-700">{AVG_INFLATION_RATE}%</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Buying Power Change</p>
                <p className="text-2xl font-bold text-red-700">{buyingPowerChange > 0 ? "-" : "+"}{Math.abs(buyingPowerChange).toFixed(1)}%</p>
              </div>
            </div>

            {yearlyData.length > 1 && (
              <div className="tool-card mb-6">
                <h2 className="text-lg font-bold mb-4">Value Over Time</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-[var(--muted-bg)]">
                        <th className="border border-[var(--card-border)] px-3 py-2 text-left">Year</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Equivalent Value</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Cumulative Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyData.map((row) => (
                        <tr key={row.year} className="hover:bg-[var(--muted-bg)]">
                          <td className="border border-[var(--card-border)] px-3 py-2">{row.year}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(row.value)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">
                            {((row.value / amt - 1) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="tool-card">
              <h2 className="text-lg font-bold mb-4">US Inflation by Decade</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Period</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Average Annual Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DECADE_RATES.map((d) => (
                      <tr key={d.decade} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{d.decade}</td>
                        <td className={`border border-[var(--card-border)] px-3 py-2 text-right font-semibold ${d.avgRate < 0 ? "text-green-700" : d.avgRate > 5 ? "text-red-600" : ""}`}>
                          {d.avgRate > 0 ? "+" : ""}{d.avgRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is Inflation?</h2>
          <p>
            Inflation is the rate at which the general level of prices for goods and services rises, causing the purchasing
            power of currency to fall. In the United States, inflation is primarily measured by the Consumer Price Index (CPI),
            published monthly by the Bureau of Labor Statistics.
          </p>

          <h2>How Inflation Affects Your Money</h2>
          <p>
            At the historical average rate of about 3.2% per year, the purchasing power of $100 is cut in half roughly
            every 22 years. This means $100 in 2000 buys about the same as $56 bought in 1980. This is why investing and
            earning returns above the inflation rate is critical for long-term wealth building.
          </p>

          <h2>Notable Periods of US Inflation</h2>
          <ul>
            <li><strong>1970s Stagflation:</strong> Inflation averaged 7.4% per year, peaking at 13.5% in 1980</li>
            <li><strong>Great Depression (1930s):</strong> Deflation averaged -2.0% per year</li>
            <li><strong>Post-COVID (2021-2022):</strong> Inflation surged to 7-9% due to supply chain disruptions</li>
            <li><strong>2010s Low Inflation:</strong> One of the lowest decades at just 1.8% average</li>
          </ul>

          <h3>Protecting Against Inflation</h3>
          <p>
            Common strategies to protect your money against inflation include investing in stocks (historically ~10%
            annual returns), real estate, Treasury Inflation-Protected Securities (TIPS), I Bonds, and commodities.
            Keeping large amounts in a savings account with rates below inflation means losing purchasing power over time.
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
            name: "Inflation Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/inflation-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
