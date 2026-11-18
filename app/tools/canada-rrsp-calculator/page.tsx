"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "RRSP Calculator Canada - Retirement Savings Projection",
  description:
    "Free Canadian RRSP calculator to project your retirement savings. Calculate future RRSP value, tax savings from contributions, and year-by-year growth. 2024 contribution limit: $31,560.",
  keywords:
    "RRSP calculator Canada, retirement savings calculator Canada, RRSP contribution calculator, RRSP tax savings, RRSP growth calculator, registered retirement savings plan",
};

interface YearRow {
  year: number;
  age: number;
  openingBalance: number;
  contribution: number;
  growth: number;
  closingBalance: number;
  cumulativeTaxSaved: number;
}

export default function CanadaRrspCalculatorPage() {
  const [currentAge, setCurrentAge] = useState<string>("30");
  const [retirementAge, setRetirementAge] = useState<string>("65");
  const [currentBalance, setCurrentBalance] = useState<string>("25000");
  const [annualContribution, setAnnualContribution] = useState<string>("10000");
  const [returnRate, setReturnRate] = useState<string>("6");
  const [marginalTaxRate, setMarginalTaxRate] = useState<string>("30");

  const age = parseInt(currentAge) || 30;
  const retAge = parseInt(retirementAge) || 65;
  const balance = parseFloat(currentBalance) || 0;
  const contrib = parseFloat(annualContribution) || 0;
  const ret = (parseFloat(returnRate) || 6) / 100;
  const taxRate = (parseFloat(marginalTaxRate) || 30) / 100;

  const years = Math.max(0, retAge - age);
  const rows: YearRow[] = [];
  let runningBalance = balance;
  let totalContributions = 0;
  let totalGrowth = 0;
  let cumulativeTaxSaved = 0;

  for (let i = 0; i < years; i++) {
    const opening = runningBalance;
    const growth = (opening + contrib) * ret;
    const closing = opening + contrib + growth;
    totalContributions += contrib;
    totalGrowth += growth;
    cumulativeTaxSaved += contrib * taxRate;
    rows.push({
      year: i + 1,
      age: age + i + 1,
      openingBalance: opening,
      contribution: contrib,
      growth,
      closingBalance: closing,
      cumulativeTaxSaved,
    });
    runningBalance = closing;
  }

  const futureValue = runningBalance;
  const totalTaxSaved = totalContributions * taxRate;

  const fmt = (n: number) => "C$" + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const fmt2 = (n: number) => "C$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/canada-rrsp-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/canada-rrsp-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">RRSP Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Project your Canadian Registered Retirement Savings Plan (RRSP) growth, tax savings, and future value at retirement.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Current Age</label>
              <input type="number" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} className="input-field" min="18" max="71" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Retirement Age</label>
              <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} className="input-field" min="50" max="71" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Current RRSP Balance (C$)</label>
              <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} className="input-field" placeholder="25000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Annual Contribution (C$)</label>
              <input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(e.target.value)} className="input-field" placeholder="10000" />
              <p className="text-xs text-[var(--muted)] mt-1">2024 limit: C$31,560 or 18% of earned income</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expected Annual Return (%)</label>
              <input type="number" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} className="input-field" step="0.5" placeholder="6" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Marginal Tax Rate (%)</label>
              <input type="number" value={marginalTaxRate} onChange={(e) => setMarginalTaxRate(e.target.value)} className="input-field" step="0.5" placeholder="30" />
              <p className="text-xs text-[var(--muted)] mt-1">Combined federal + provincial rate</p>
            </div>
          </div>
        </div>

        {years > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Future RRSP Value</p>
                <p className="text-2xl font-bold text-green-700">{fmt(futureValue)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Contributions</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(totalContributions + balance)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Investment Growth</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(totalGrowth)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Tax Savings</p>
                <p className="text-2xl font-bold text-blue-700">{fmt(totalTaxSaved)}</p>
              </div>
            </div>

            {/* Contribution limit info */}
            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">RRSP Contribution Limits</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-[var(--muted-bg)]">
                  <p className="font-semibold">2024 Maximum</p>
                  <p className="text-lg font-bold text-[var(--primary)]">C$31,560</p>
                  <p className="text-[var(--muted)]">or 18% of previous year earned income, whichever is less</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--muted-bg)]">
                  <p className="font-semibold">Your Annual Contribution</p>
                  <p className="text-lg font-bold text-[var(--primary)]">{fmt2(contrib)}</p>
                  <p className="text-[var(--muted)]">{contrib > 31560 ? "Exceeds 2024 limit!" : `${((contrib / 31560) * 100).toFixed(1)}% of 2024 limit`}</p>
                </div>
              </div>
            </div>

            <div className="tool-card overflow-x-auto">
              <h2 className="text-lg font-bold mb-4">Year-by-Year Growth</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Year</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Age</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Opening</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Contribution</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Growth</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Closing</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Tax Saved</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.year} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{r.year}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2">{r.age}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(r.openingBalance)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt2(r.contribution)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt2(r.growth)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(r.closingBalance)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-blue-700">{fmt(r.cumulativeTaxSaved)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is an RRSP?</h2>
          <p>
            A Registered Retirement Savings Plan (RRSP) is a Canadian tax-deferred retirement savings account. Contributions are tax-deductible, reducing your taxable income in the year you contribute. Investment growth within the RRSP is tax-sheltered until withdrawal.
          </p>
          <h2>RRSP Tax Benefits</h2>
          <p>
            The key tax advantage of an RRSP is the tax deduction on contributions. If you contribute C$10,000 at a 30% marginal tax rate, you save C$3,000 in taxes. When you withdraw in retirement, you&apos;ll likely be in a lower tax bracket, resulting in a net tax savings.
          </p>
          <h2>RRSP Contribution Limits</h2>
          <p>
            For 2024, the RRSP contribution limit is 18% of your previous year&apos;s earned income, up to a maximum of C$31,560. Unused contribution room carries forward indefinitely. You can contribute to an RRSP until December 31 of the year you turn 71.
          </p>
          <h3>RRSP vs TFSA</h3>
          <p>
            While RRSP contributions are tax-deductible (but withdrawals are taxed), TFSA contributions are made with after-tax dollars but withdrawals are completely tax-free. Generally, an RRSP is better if you expect to be in a lower tax bracket in retirement, while a TFSA is better if you expect to be in the same or higher bracket.
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
            name: "RRSP Calculator Canada",
            description: META.description,
            url: `${SITE_URL}/tools/canada-rrsp-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
          }),
        }}
      />
    </>
  );
}
