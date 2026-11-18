"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Salary Calculator - CTC to In-Hand Salary Calculator",
  description:
    "Free Salary Calculator to calculate in-hand monthly salary from CTC. See breakup of Basic, HRA, DA, PF, Professional Tax, and Income Tax deductions.",
  keywords: "salary calculator, ctc to in hand, take home salary calculator, salary breakup, net salary calculator",
};

export default function SalaryCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [ctc, setCtc] = useState<string>("1200000");
  const [result, setResult] = useState<{
    basic: number;
    hra: number;
    da: number;
    specialAllowance: number;
    grossSalary: number;
    pfEmployee: number;
    pfEmployer: number;
    professionalTax: number;
    incomeTax: number;
    totalDeductions: number;
    netMonthly: number;
    netAnnual: number;
  } | null>(null);

  function calculate() {
    const annualCTC = parseFloat(ctc);
    if (!annualCTC || annualCTC <= 0) return;

    const basic = annualCTC * 0.4;
    const hra = basic * 0.5;
    const da = basic * 0.1;
    const pfEmployer = Math.min(basic * 0.12, 21600);
    const specialAllowance = annualCTC - basic - hra - da - pfEmployer;
    const grossSalary = basic + hra + da + specialAllowance;

    const pfEmployee = Math.min(basic * 0.12, 21600);
    const professionalTax = 2400;

    // Simplified old regime tax calculation
    const taxableIncome = annualCTC - pfEmployee - 50000; // Standard deduction
    let incomeTax = 0;
    if (taxableIncome > 1500000) {
      incomeTax = 187500 + (taxableIncome - 1500000) * 0.3;
    } else if (taxableIncome > 1250000) {
      incomeTax = 125000 + (taxableIncome - 1250000) * 0.25;
    } else if (taxableIncome > 1000000) {
      incomeTax = 75000 + (taxableIncome - 1000000) * 0.2;
    } else if (taxableIncome > 750000) {
      incomeTax = 25000 + (taxableIncome - 750000) * 0.2;
    } else if (taxableIncome > 500000) {
      incomeTax = (taxableIncome - 500000) * 0.1;
    } else if (taxableIncome > 300000) {
      incomeTax = (taxableIncome - 300000) * 0.05;
    }
    // Tax rebate under section 87A for income up to 7 lakhs
    if (taxableIncome <= 700000) incomeTax = 0;
    incomeTax = Math.max(0, incomeTax);
    // Add 4% health and education cess
    incomeTax = incomeTax * 1.04;

    const totalDeductions = pfEmployee + professionalTax + incomeTax;
    const netAnnual = grossSalary - totalDeductions;
    const netMonthly = netAnnual / 12;

    setResult({
      basic,
      hra,
      da,
      specialAllowance: Math.max(0, specialAllowance),
      grossSalary,
      pfEmployee,
      pfEmployer,
      professionalTax,
      incomeTax,
      totalDeductions,
      netMonthly,
      netAnnual,
    });
  }

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/salary-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Salary Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your in-hand monthly salary from CTC with detailed breakup of all components and deductions.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div>
            <label className="block text-sm font-medium mb-1">Annual CTC ({currency.symbol})</label>
            <input
              type="number"
              value={ctc}
              onChange={(e) => setCtc(e.target.value)}
              className="input-field max-w-md"
              placeholder="e.g., 1200000"
            />
          </div>
          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Salary
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Monthly In-Hand Salary</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.netMonthly)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Annual Net Salary</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.netAnnual)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="tool-card">
                <h3 className="font-bold mb-4 text-green-700">Earnings (Monthly)</h3>
                <div className="space-y-3">
                  {[
                    { label: "Basic Salary", value: result.basic / 12 },
                    { label: "HRA", value: result.hra / 12 },
                    { label: "Dearness Allowance", value: result.da / 12 },
                    { label: "Special Allowance", value: result.specialAllowance / 12 },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-[var(--muted)]">{item.label}</span>
                      <span className="font-medium">{fmt(item.value)}</span>
                    </div>
                  ))}
                  <div className="border-t border-[var(--card-border)] pt-2 flex justify-between font-semibold">
                    <span>Gross Salary</span>
                    <span>{fmt(result.grossSalary / 12)}</span>
                  </div>
                </div>
              </div>

              <div className="tool-card">
                <h3 className="font-bold mb-4 text-red-600">Deductions (Monthly)</h3>
                <div className="space-y-3">
                  {[
                    { label: "Employee PF", value: result.pfEmployee / 12 },
                    { label: "Professional Tax", value: result.professionalTax / 12 },
                    { label: "Income Tax (est.)", value: result.incomeTax / 12 },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-[var(--muted)]">{item.label}</span>
                      <span className="font-medium text-red-600">-{fmt(item.value)}</span>
                    </div>
                  ))}
                  <div className="border-t border-[var(--card-border)] pt-2 flex justify-between font-semibold">
                    <span>Total Deductions</span>
                    <span className="text-red-600">-{fmt(result.totalDeductions / 12)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is a Salary Calculator?</h2>
          <p>
            A Salary Calculator helps you understand your in-hand salary from your CTC (Cost to Company). It breaks down
            your salary into components like Basic Pay, HRA, DA, and shows deductions for PF, Professional Tax, and
            Income Tax.
          </p>

          <h2>Salary Components Explained</h2>
          <ul>
            <li><strong>Basic Salary:</strong> Usually 40-50% of CTC. Forms the base for other calculations.</li>
            <li><strong>HRA:</strong> House Rent Allowance, typically 50% of Basic for metro cities.</li>
            <li><strong>DA:</strong> Dearness Allowance to offset inflation.</li>
            <li><strong>PF:</strong> Both employer and employee contribute 12% of Basic (capped at Rs.1,800/month).</li>
            <li><strong>Professional Tax:</strong> State-level tax, max Rs.200/month (Rs.2,400/year).</li>
          </ul>

          <h2>CTC vs In-Hand Salary</h2>
          <p>
            Your CTC includes all benefits the company spends on you, including employer PF contribution, insurance,
            and other perks. Your in-hand or take-home salary is what you actually receive after all deductions.
          </p>

          <h3>Disclaimer</h3>
          <p>
            This calculator provides an approximate estimate based on the new tax regime. Actual salary breakup may vary
            based on your company policy, city, state, and applicable tax exemptions. Consult a tax professional for
            accurate calculations.
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
            name: "Salary Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/salary-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
