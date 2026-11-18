"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "UK National Insurance Calculator 2024-25",
  description:
    "Free UK National Insurance calculator for 2024-25. Calculate employee NI, employer NI, income tax, and take-home pay with a full combined breakdown table.",
  keywords:
    "national insurance calculator, NI calculator UK, national insurance rates 2024, employee national insurance, employer NI, UK tax calculator, take home pay UK, PAYE calculator",
};

type PayFrequency = "annual" | "monthly" | "weekly";

export default function UKNationalInsurancePage() {
  const [salary, setSalary] = useState<string>("35000");
  const [payFrequency, setPayFrequency] = useState<PayFrequency>("annual");
  const [result, setResult] = useState<{
    annualSalary: number;
    employeeNI: number;
    employerNI: number;
    incomeTax: number;
    takeHome: number;
    effectiveNIRate: number;
    effectiveTaxRate: number;
    combinedRate: number;
    breakdown: { label: string; annual: number; monthly: number; weekly: number }[];
  } | null>(null);

  function calculate() {
    const rawSalary = parseFloat(salary);
    if (!rawSalary || rawSalary <= 0) return;

    // Convert to annual
    let annualSalary: number;
    if (payFrequency === "monthly") {
      annualSalary = rawSalary * 12;
    } else if (payFrequency === "weekly") {
      annualSalary = rawSalary * 52;
    } else {
      annualSalary = rawSalary;
    }

    // Employee NI Class 1 2024-25
    // 8% on earnings between £12,570 and £50,270
    // 2% on earnings above £50,270
    const niLower = 12570;
    const niUpper = 50270;

    let employeeNI = 0;
    if (annualSalary > niLower) {
      const bandOne = Math.min(annualSalary, niUpper) - niLower;
      employeeNI += Math.max(0, bandOne) * 0.08;
    }
    if (annualSalary > niUpper) {
      employeeNI += (annualSalary - niUpper) * 0.02;
    }

    // Employer NI Class 1 2024-25
    // 13.8% on earnings above £9,100
    const employerThreshold = 9100;
    let employerNI = 0;
    if (annualSalary > employerThreshold) {
      employerNI = (annualSalary - employerThreshold) * 0.138;
    }

    // Income Tax 2024-25
    // Personal Allowance: £12,570 (tapered above £100,000)
    // Basic rate: 20% on £12,571 - £50,270
    // Higher rate: 40% on £50,271 - £125,140
    // Additional rate: 45% above £125,140

    let personalAllowance = 12570;
    // Taper personal allowance for income over £100,000
    if (annualSalary > 100000) {
      const reduction = Math.floor((annualSalary - 100000) / 2);
      personalAllowance = Math.max(0, personalAllowance - reduction);
    }

    const basicRateUpper = 50270;
    const higherRateUpper = 125140;

    let incomeTax = 0;
    const taxableIncome = Math.max(0, annualSalary - personalAllowance);

    if (taxableIncome > 0) {
      // Basic rate band
      const basicBand = Math.min(taxableIncome, basicRateUpper - 12570);
      incomeTax += Math.max(0, basicBand) * 0.20;

      // Higher rate band
      if (taxableIncome > basicRateUpper - 12570) {
        const higherBand = Math.min(taxableIncome - (basicRateUpper - 12570), higherRateUpper - basicRateUpper);
        incomeTax += Math.max(0, higherBand) * 0.40;
      }

      // Additional rate
      if (taxableIncome > higherRateUpper - personalAllowance) {
        // Need to handle the case where personal allowance is tapered
        const additionalStart = higherRateUpper - personalAllowance;
        if (taxableIncome > additionalStart) {
          incomeTax += (taxableIncome - Math.max(additionalStart, higherRateUpper - 12570)) * 0.45;
        }
      }
    }

    // Recalculate income tax more cleanly
    incomeTax = 0;
    if (annualSalary > personalAllowance) {
      const taxable = annualSalary - personalAllowance;

      // Basic rate: 20% up to £37,700 above personal allowance (up to £50,270 total)
      const basicLimit = Math.max(0, basicRateUpper - personalAllowance);
      const basicTaxable = Math.min(taxable, basicLimit);
      incomeTax += basicTaxable * 0.20;

      // Higher rate: 40% from £50,271 to £125,140
      if (annualSalary > basicRateUpper) {
        const higherTaxable = Math.min(annualSalary, higherRateUpper) - basicRateUpper;
        incomeTax += Math.max(0, higherTaxable) * 0.40;
      }

      // Additional rate: 45% above £125,140
      if (annualSalary > higherRateUpper) {
        incomeTax += (annualSalary - higherRateUpper) * 0.45;
      }
    }

    const takeHome = annualSalary - employeeNI - incomeTax;
    const effectiveNIRate = annualSalary > 0 ? (employeeNI / annualSalary) * 100 : 0;
    const effectiveTaxRate = annualSalary > 0 ? (incomeTax / annualSalary) * 100 : 0;
    const combinedRate = effectiveNIRate + effectiveTaxRate;

    const breakdown = [
      { label: "Gross Salary", annual: annualSalary, monthly: annualSalary / 12, weekly: annualSalary / 52 },
      { label: "Income Tax", annual: -incomeTax, monthly: -incomeTax / 12, weekly: -incomeTax / 52 },
      { label: "Employee National Insurance", annual: -employeeNI, monthly: -employeeNI / 12, weekly: -employeeNI / 52 },
      { label: "Take-Home Pay", annual: takeHome, monthly: takeHome / 12, weekly: takeHome / 52 },
      { label: "Employer NI (cost to employer)", annual: employerNI, monthly: employerNI / 12, weekly: employerNI / 52 },
    ];

    setResult({
      annualSalary,
      employeeNI,
      employerNI,
      incomeTax,
      takeHome,
      effectiveNIRate,
      effectiveTaxRate,
      combinedRate,
      breakdown,
    });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));

  const fmtSigned = (n: number) => {
    const formatted = fmt(n);
    return n < 0 ? `-${formatted}` : formatted;
  };

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/uk-national-insurance`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">UK National Insurance Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your National Insurance contributions, income tax, and take-home pay using 2024-25 HMRC rates.
          See employee NI, employer NI, and a combined breakdown with annual, monthly, and weekly figures.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Salary (&pound;)</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="input-field"
                placeholder="e.g., 35000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pay Frequency</label>
              <select
                value={payFrequency}
                onChange={(e) => setPayFrequency(e.target.value as PayFrequency)}
                className="input-field"
              >
                <option value="annual">Annual</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate NI &amp; Tax
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Take-Home Pay</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmt(result.takeHome)}</p>
                <p className="text-xs text-[var(--muted)]">per year</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Employee NI</p>
                <p className="text-xl font-bold text-green-700">{fmt(result.employeeNI)}</p>
                <p className="text-xs text-[var(--muted)]">per year</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Income Tax</p>
                <p className="text-xl font-bold text-red-600">{fmt(result.incomeTax)}</p>
                <p className="text-xs text-[var(--muted)]">per year</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Employer NI</p>
                <p className="text-xl font-bold">{fmt(result.employerNI)}</p>
                <p className="text-xs text-[var(--muted)]">per year</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Combined Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Item</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annual</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Monthly</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Weekly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.breakdown.map((row, i) => (
                      <tr
                        key={i}
                        className={
                          row.label === "Take-Home Pay"
                            ? "bg-blue-50"
                            : row.label === "Employer NI (cost to employer)"
                            ? "bg-[var(--muted-bg)]"
                            : "hover:bg-[var(--muted-bg)]"
                        }
                      >
                        <td className={`border border-[var(--card-border)] px-3 py-2 ${row.label === "Take-Home Pay" ? "font-bold" : ""}`}>
                          {row.label}
                        </td>
                        <td className={`border border-[var(--card-border)] px-3 py-2 text-right ${
                          row.annual < 0 ? "text-red-600" : ""
                        } ${row.label === "Take-Home Pay" ? "font-bold text-[var(--primary)]" : "font-semibold"}`}>
                          {fmtSigned(row.annual)}
                        </td>
                        <td className={`border border-[var(--card-border)] px-3 py-2 text-right ${row.annual < 0 ? "text-red-600" : ""}`}>
                          {fmtSigned(row.monthly)}
                        </td>
                        <td className={`border border-[var(--card-border)] px-3 py-2 text-right ${row.annual < 0 ? "text-red-600" : ""}`}>
                          {fmtSigned(row.weekly)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Effective Rates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-[var(--muted-bg)] rounded-lg">
                  <p className="text-sm text-[var(--muted)]">Effective NI Rate</p>
                  <p className="font-bold text-lg">{result.effectiveNIRate.toFixed(2)}%</p>
                </div>
                <div className="text-center p-3 bg-[var(--muted-bg)] rounded-lg">
                  <p className="text-sm text-[var(--muted)]">Effective Tax Rate</p>
                  <p className="font-bold text-lg">{result.effectiveTaxRate.toFixed(2)}%</p>
                </div>
                <div className="text-center p-3 bg-[var(--muted-bg)] rounded-lg">
                  <p className="text-sm text-[var(--muted)]">Combined Deduction Rate</p>
                  <p className="font-bold text-lg text-red-600">{result.combinedRate.toFixed(2)}%</p>
                </div>
              </div>
            </div>

            {/* NI and Tax Bands Reference */}
            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">2024-25 NI &amp; Tax Bands</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Employee NI (Class 1)</h3>
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      <tr className="bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">&pound;0 - &pound;12,570</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">0%</td>
                      </tr>
                      <tr>
                        <td className="border border-[var(--card-border)] px-3 py-2">&pound;12,570 - &pound;50,270</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">8%</td>
                      </tr>
                      <tr>
                        <td className="border border-[var(--card-border)] px-3 py-2">Over &pound;50,270</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">2%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Income Tax</h3>
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      <tr className="bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">&pound;0 - &pound;12,570</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">0% (Personal Allowance)</td>
                      </tr>
                      <tr>
                        <td className="border border-[var(--card-border)] px-3 py-2">&pound;12,571 - &pound;50,270</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">20% (Basic)</td>
                      </tr>
                      <tr>
                        <td className="border border-[var(--card-border)] px-3 py-2">&pound;50,271 - &pound;125,140</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">40% (Higher)</td>
                      </tr>
                      <tr>
                        <td className="border border-[var(--card-border)] px-3 py-2">Over &pound;125,140</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">45% (Additional)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is National Insurance?</h2>
          <p>
            National Insurance (NI) is a UK tax paid by employees and employers on earnings. It funds the State Pension,
            NHS, and other benefits. This NI calculator UK tool uses the 2024-25 HMRC rates to calculate your exact
            National Insurance contributions alongside income tax.
          </p>

          <h2>2024-25 National Insurance Rates</h2>
          <h3>Employee Class 1 NI</h3>
          <p>
            Employees pay 8% on earnings between &pound;12,570 (the Primary Threshold) and &pound;50,270 (the Upper Earnings Limit),
            and 2% on earnings above &pound;50,270. The NI rate was reduced from 12% to 8% in April 2024.
          </p>

          <h3>Employer Class 1 NI</h3>
          <p>
            Employers pay 13.8% on employee earnings above &pound;9,100 (the Secondary Threshold). There is no upper limit
            on employer NI contributions. Employer NI is an additional cost on top of your salary.
          </p>

          <h2>Income Tax Bands 2024-25</h2>
          <p>
            Income tax is calculated on your earnings above the Personal Allowance of &pound;12,570. The basic rate is 20%
            on income up to &pound;50,270, the higher rate is 40% on income from &pound;50,271 to &pound;125,140, and the
            additional rate is 45% on income above &pound;125,140.
          </p>

          <h3>Personal Allowance Tapering</h3>
          <p>
            If your income exceeds &pound;100,000, your Personal Allowance is reduced by &pound;1 for every &pound;2 of income
            above &pound;100,000. This creates an effective 60% marginal tax rate between &pound;100,000 and &pound;125,140.
          </p>

          <h2>How NI Differs from Income Tax</h2>
          <ul>
            <li><strong>NI</strong> is paid by both employees and employers; income tax is only paid by the individual</li>
            <li><strong>NI</strong> contributes to your State Pension entitlement and other benefits</li>
            <li><strong>NI</strong> has different thresholds and rates compared to income tax</li>
            <li>Both are deducted through PAYE if you are employed</li>
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
            name: "UK National Insurance Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/uk-national-insurance`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          }),
        }}
      />
    </>
  );
}
