"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Hourly to Salary Converter - Calculate Annual Pay from Hourly Wage",
  description:
    "Free hourly to salary converter. Convert hourly wage to annual salary and salary to hourly rate. See daily, weekly, biweekly, and monthly income breakdowns.",
  keywords:
    "hourly to salary, salary to hourly, annual salary calculator, hourly wage calculator, yearly salary from hourly, wage converter, pay calculator",
};

export default function HourlyToSalaryConverterPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [mode, setMode] = useState<"hourly" | "salary">("hourly");
  const [hourlyRate, setHourlyRate] = useState<string>("25");
  const [annualSalary, setAnnualSalary] = useState<string>("52000");
  const [hoursPerWeek, setHoursPerWeek] = useState<string>("40");
  const [weeksPerYear, setWeeksPerYear] = useState<string>("52");
  const [result, setResult] = useState<{
    hourly: number;
    daily: number;
    weekly: number;
    biweekly: number;
    monthly: number;
    annual: number;
  } | null>(null);

  function calculate() {
    const hpw = parseFloat(hoursPerWeek) || 40;
    const wpy = parseFloat(weeksPerYear) || 52;

    if (mode === "hourly") {
      const rate = parseFloat(hourlyRate);
      if (!rate || rate <= 0) return;
      const annual = rate * hpw * wpy;
      setResult({
        hourly: rate,
        daily: rate * (hpw / 5),
        weekly: rate * hpw,
        biweekly: rate * hpw * 2,
        monthly: annual / 12,
        annual,
      });
    } else {
      const salary = parseFloat(annualSalary);
      if (!salary || salary <= 0) return;
      const hourly = salary / (hpw * wpy);
      setResult({
        hourly,
        daily: salary / (wpy * 5),
        weekly: salary / wpy,
        biweekly: (salary / wpy) * 2,
        monthly: salary / 12,
        annual: salary,
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
        <link rel="canonical" href={`${SITE_URL}/tools/hourly-to-salary-converter`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/hourly-to-salary-converter`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Hourly to Salary Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert hourly wage to annual salary or annual salary to hourly rate. See your income broken down by hour, day, week, biweekly, month, and year.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode("hourly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === "hourly" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}
            >
              Hourly to Salary
            </button>
            <button
              onClick={() => setMode("salary")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === "salary" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}
            >
              Salary to Hourly
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mode === "hourly" ? (
              <div>
                <label className="block text-sm font-medium mb-1">Hourly Rate ({currency.symbol})</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 25"
                  step="0.25"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">Annual Salary ({currency.symbol})</label>
                <input
                  type="number"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 52000"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Hours per Week</label>
              <input
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="input-field"
                placeholder="e.g., 40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Weeks per Year</label>
              <input
                type="number"
                value={weeksPerYear}
                onChange={(e) => setWeeksPerYear(e.target.value)}
                className="input-field"
                placeholder="e.g., 52"
              />
              <p className="text-xs text-[var(--muted)] mt-1">Use 50 for 2 weeks unpaid vacation</p>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Convert
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Hourly Rate</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmtExact(result.hourly)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Annual Salary</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.annual)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Income Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Period</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Hourly</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.hourly)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Daily (8 hrs)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.daily)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Weekly</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.weekly)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Biweekly</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.biweekly)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Monthly</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.monthly)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Annual</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.annual)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Common Hourly to Salary Conversions</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Hourly Rate</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Weekly (40 hrs)</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Monthly</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annual (52 wks)</th>
                  </tr>
                </thead>
                <tbody>
                  {[15, 20, 25, 30, 35, 40, 50, 75, 100].map((rate) => (
                    <tr key={rate} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{fmtExact(rate)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(rate * 40)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt((rate * 40 * 52) / 12)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(rate * 40 * 52)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Convert Hourly Wage to Annual Salary</h2>
          <p>
            To convert an hourly wage to an annual salary, multiply the hourly rate by the number of hours worked per
            week, then multiply by the number of weeks worked per year. The standard formula assumes 40 hours per week
            and 52 weeks per year.
          </p>

          <h2>The Conversion Formula</h2>
          <p><strong>Annual Salary = Hourly Rate x Hours per Week x Weeks per Year</strong></p>
          <p>For example, $25/hour x 40 hours x 52 weeks = $52,000/year</p>

          <h2>Salary to Hourly Conversion</h2>
          <p>To convert salary to hourly rate, divide the annual salary by total working hours in a year:</p>
          <p><strong>Hourly Rate = Annual Salary / (Hours per Week x Weeks per Year)</strong></p>

          <h3>Key Considerations</h3>
          <ul>
            <li>Standard full-time is 40 hours/week, 52 weeks/year (2,080 hours)</li>
            <li>If you get unpaid vacation, use 50 weeks instead of 52</li>
            <li>Overtime hours (over 40/week) are typically paid at 1.5x the regular rate</li>
            <li>Benefits, taxes, and deductions affect your actual take-home pay</li>
          </ul>

          <h3>Federal Minimum Wage</h3>
          <p>
            The federal minimum wage in the United States is $7.25 per hour, which equals approximately $15,080 per
            year for full-time work. Many states and cities have higher minimum wages.
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
            name: "Hourly to Salary Converter",
            description: META.description,
            url: `${SITE_URL}/tools/hourly-to-salary-converter`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
