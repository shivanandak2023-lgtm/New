"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Paycheck Calculator - Calculate Your Take-Home Pay",
  description:
    "Free paycheck calculator to estimate your net take-home pay after federal tax, Social Security, Medicare, and state tax deductions. Supports hourly and salary.",
  keywords:
    "paycheck calculator, take home pay calculator, after tax salary, net pay calculator, paycheck estimator, federal tax calculator, salary after taxes",
};

const FEDERAL_BRACKETS_2024 = {
  single: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
  married: [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 },
  ],
  head: [
    { min: 0, max: 16550, rate: 0.10 },
    { min: 16550, max: 63100, rate: 0.12 },
    { min: 63100, max: 100500, rate: 0.22 },
    { min: 100500, max: 191950, rate: 0.24 },
    { min: 191950, max: 243700, rate: 0.32 },
    { min: 243700, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
};

const STANDARD_DEDUCTION: Record<string, number> = {
  single: 14600,
  married: 29200,
  head: 21900,
};

const PAY_FREQUENCIES: Record<string, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
};

function calcFederalTax(taxableIncome: number, brackets: { min: number; max: number; rate: number }[]): number {
  let tax = 0;
  for (const b of brackets) {
    if (taxableIncome <= b.min) break;
    const taxable = Math.min(taxableIncome, b.max) - b.min;
    tax += taxable * b.rate;
  }
  return tax;
}

export default function PaycheckCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [payType, setPayType] = useState<"salary" | "hourly">("salary");
  const [grossPay, setGrossPay] = useState<string>("55000");
  const [hourlyRate, setHourlyRate] = useState<string>("25");
  const [hoursPerWeek, setHoursPerWeek] = useState<string>("40");
  const [payFrequency, setPayFrequency] = useState<string>("biweekly");
  const [filingStatus, setFilingStatus] = useState<string>("single");
  const [allowances, setAllowances] = useState<string>("0");
  const [stateTaxRate, setStateTaxRate] = useState<string>("5");

  const periodsPerYear = PAY_FREQUENCIES[payFrequency] || 26;
  const annualGross =
    payType === "salary"
      ? parseFloat(grossPay) || 0
      : (parseFloat(hourlyRate) || 0) * (parseFloat(hoursPerWeek) || 40) * 52;
  const perPaycheckGross = annualGross / periodsPerYear;

  const allowanceDeduction = (parseInt(allowances) || 0) * 4300;
  const standardDed = STANDARD_DEDUCTION[filingStatus] || 14600;
  const taxableIncome = Math.max(0, annualGross - standardDed - allowanceDeduction);

  const brackets = FEDERAL_BRACKETS_2024[filingStatus as keyof typeof FEDERAL_BRACKETS_2024] || FEDERAL_BRACKETS_2024.single;
  const annualFedTax = calcFederalTax(taxableIncome, brackets);

  const ssWageCap = 168600;
  const annualSS = Math.min(annualGross, ssWageCap) * 0.062;
  const annualMedicare = annualGross * 0.0145;
  const additionalMedicare = annualGross > 200000 ? (annualGross - 200000) * 0.009 : 0;
  const annualStateTax = annualGross * ((parseFloat(stateTaxRate) || 0) / 100);

  const totalAnnualDeductions = annualFedTax + annualSS + annualMedicare + additionalMedicare + annualStateTax;
  const annualNetPay = annualGross - totalAnnualDeductions;

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/paycheck-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/paycheck-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Paycheck Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Estimate your take-home pay after federal income tax, Social Security, Medicare, and state tax deductions. Supports both salary and hourly pay.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Pay Type</label>
              <div className="flex gap-2">
                {(["salary", "hourly"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPayType(t)}
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                      payType === t
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    {t === "salary" ? "Salary" : "Hourly"}
                  </button>
                ))}
              </div>
            </div>

            {payType === "salary" ? (
              <div>
                <label className="block text-sm font-medium mb-1">Annual Gross Salary ({currency.symbol})</label>
                <input
                  type="number"
                  value={grossPay}
                  onChange={(e) => setGrossPay(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 55000"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Hourly Rate ({currency.symbol})</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 25"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hours Per Week</label>
                  <input
                    type="number"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 40"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Pay Frequency</label>
              <select
                value={payFrequency}
                onChange={(e) => setPayFrequency(e.target.value)}
                className="input-field"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="semimonthly">Semi-Monthly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Filing Status</label>
              <select
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value)}
                className="input-field"
              >
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
                <option value="head">Head of Household</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Federal Allowances</label>
              <input
                type="number"
                value={allowances}
                onChange={(e) => setAllowances(e.target.value)}
                className="input-field"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State Tax Rate (%)</label>
              <input
                type="number"
                value={stateTaxRate}
                onChange={(e) => setStateTaxRate(e.target.value)}
                className="input-field"
                placeholder="e.g., 5"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {annualGross > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Gross Per Paycheck</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(perPaycheckGross)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Net Per Paycheck</p>
                <p className="text-2xl font-bold text-green-700">{fmt(annualNetPay / periodsPerYear)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Annual Net Pay</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(annualNetPay)}</p>
              </div>
            </div>

            <div className="tool-card">
              <h2 className="text-lg font-bold mb-4">Deductions Breakdown (Per Paycheck)</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Deduction</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Per Paycheck</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Federal Income Tax</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualFedTax / periodsPerYear)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualFedTax)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Social Security (6.2%)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualSS / periodsPerYear)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualSS)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Medicare (1.45%)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt((annualMedicare + additionalMedicare) / periodsPerYear)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualMedicare + additionalMedicare)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">State Tax ({stateTaxRate}%)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualStateTax / periodsPerYear)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualStateTax)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)] bg-blue-50 font-semibold">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Deductions</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">{fmt(totalAnnualDeductions / periodsPerYear)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">{fmt(totalAnnualDeductions)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)] bg-green-50 font-bold">
                    <td className="border border-[var(--card-border)] px-3 py-2">Net Pay</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(annualNetPay / periodsPerYear)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(annualNetPay)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Your Paycheck</h2>
          <p>
            Your take-home pay is your gross income minus all tax withholdings and deductions. Federal income tax is calculated
            using 2024 tax brackets based on your filing status and taxable income after the standard deduction.
          </p>

          <h2>2024 Federal Tax Brackets</h2>
          <p>
            The U.S. uses a progressive tax system. For a single filer, the brackets are: 10% on the first $11,600; 12% on
            $11,601 to $47,150; 22% on $47,151 to $100,525; 24% on $100,526 to $191,950; 32% on $191,951 to $243,725; 35%
            on $243,726 to $609,350; and 37% on income above $609,350.
          </p>

          <h2>FICA Taxes</h2>
          <p>
            FICA (Federal Insurance Contributions Act) taxes include Social Security at 6.2% of earnings up to $168,600,
            and Medicare at 1.45% of all earnings. An additional 0.9% Medicare surtax applies to earnings above $200,000.
          </p>

          <h3>State Income Tax</h3>
          <p>
            State income tax rates vary widely across the U.S. Nine states have no income tax: Alaska, Florida, Nevada,
            New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming. Other states have rates ranging from
            about 1% to over 13%.
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
            name: "Paycheck Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/paycheck-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
