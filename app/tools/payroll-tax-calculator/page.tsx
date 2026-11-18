"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Payroll Tax Calculator - Calculate Employer Payroll Taxes",
  description:
    "Free payroll tax calculator for employers. Calculate Social Security, Medicare, FUTA, and total employer tax costs per paycheck and annually.",
  keywords:
    "payroll tax calculator, employer tax calculator, fica calculator, social security tax, medicare tax, futa tax, employer payroll cost",
};

const PAY_FREQUENCIES: { label: string; periods: number }[] = [
  { label: "Weekly", periods: 52 },
  { label: "Bi-Weekly", periods: 26 },
  { label: "Semi-Monthly", periods: 24 },
  { label: "Monthly", periods: 12 },
];

export default function PayrollTaxCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [grossPay, setGrossPay] = useState<string>("2500");
  const [frequencyIdx, setFrequencyIdx] = useState<number>(1);
  const [numEmployees, setNumEmployees] = useState<string>("1");

  const payPerPeriod = parseFloat(grossPay) || 0;
  const freq = PAY_FREQUENCIES[frequencyIdx];
  const annualGross = payPerPeriod * freq.periods;
  const employees = Math.max(1, parseInt(numEmployees) || 1);

  // Employer FICA rates
  const ssRate = 0.062;
  const medicareRate = 0.0145;
  const ssWageCap = 168600;

  // Social Security per paycheck (capped annually)
  const annualSS = Math.min(annualGross, ssWageCap) * ssRate;
  const perPaycheckSS = annualSS / freq.periods;

  // Medicare per paycheck (no cap)
  const annualMedicare = annualGross * medicareRate;
  const perPaycheckMedicare = annualMedicare / freq.periods;

  // FUTA: 6% on first $7,000 of wages per employee per year
  const futaWageCap = 7000;
  const futaRate = 0.06;
  const futaCredit = 0.054; // standard credit for state unemployment tax
  const effectiveFutaRate = futaRate - futaCredit; // 0.6% effective
  const annualFUTA = Math.min(annualGross, futaWageCap) * effectiveFutaRate;
  const perPaycheckFUTA = annualFUTA / freq.periods;

  const totalPerPaycheck = perPaycheckSS + perPaycheckMedicare + perPaycheckFUTA;
  const totalAnnual = annualSS + annualMedicare + annualFUTA;
  const totalCostPerPaycheck = payPerPeriod + totalPerPaycheck;
  const totalCostAnnual = annualGross + totalAnnual;

  // Multi-employee totals
  const allEmployeesAnnual = totalAnnual * employees;
  const allEmployeesCost = totalCostAnnual * employees;

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/payroll-tax-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Payroll Tax Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate the employer-side payroll taxes including Social Security, Medicare, and FUTA. See the true cost of employment per paycheck and annually.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Employee Gross Pay Per Period ({currency.symbol})</label>
              <input
                type="number"
                value={grossPay}
                onChange={(e) => setGrossPay(e.target.value)}
                className="input-field"
                placeholder="e.g., 2500"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pay Frequency</label>
              <select
                value={frequencyIdx}
                onChange={(e) => setFrequencyIdx(parseInt(e.target.value))}
                className="input-field"
              >
                {PAY_FREQUENCIES.map((f, i) => (
                  <option key={f.label} value={i}>{f.label} ({f.periods}x/year)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Employees</label>
              <input
                type="number"
                value={numEmployees}
                onChange={(e) => setNumEmployees(e.target.value)}
                className="input-field"
                placeholder="1"
                min="1"
              />
            </div>
          </div>
        </div>

        {payPerPeriod > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Employer Tax Per Paycheck</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(totalPerPaycheck)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Employer Tax Annual</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(totalAnnual)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Cost Per Employee</p>
                <p className="text-2xl font-bold text-green-700">{fmt(totalCostAnnual)}/yr</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Tax Breakdown (Per Employee)</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Tax</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Rate</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Per Paycheck</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Social Security</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">6.2%</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(perPaycheckSS)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualSS)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Medicare</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">1.45%</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(perPaycheckMedicare)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualMedicare)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">FUTA (effective)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">0.6%</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(perPaycheckFUTA)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualFUTA)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)] bg-blue-50 font-semibold">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Employer Tax</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">-</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">{fmt(totalPerPaycheck)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">{fmt(totalAnnual)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)] bg-green-50 font-bold">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Cost (Wages + Tax)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">-</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(totalCostPerPaycheck)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(totalCostAnnual)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {employees > 1 && (
              <div className="tool-card">
                <h2 className="text-lg font-bold mb-4">All Employees Summary ({employees} employees)</h2>
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Total Annual Wages</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(annualGross * employees)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Total Annual Employer Tax</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-red-600">{fmt(allEmployeesAnnual)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)] bg-green-50 font-bold">
                      <td className="border border-[var(--card-border)] px-3 py-2">Total Annual Cost</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(allEmployeesCost)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Understanding Employer Payroll Taxes</h2>
          <p>
            Employers in the United States are required to pay payroll taxes on behalf of their employees. These taxes fund
            Social Security, Medicare, and federal unemployment insurance. The employer portion is separate from the amounts
            withheld from employee paychecks.
          </p>

          <h2>FICA Tax (Social Security & Medicare)</h2>
          <p>
            Employers pay 6.2% for Social Security on the first $168,600 of each employee&apos;s wages (2024 cap) and 1.45%
            for Medicare on all wages with no cap. This matches what employees pay, making the combined FICA rate 15.3%.
          </p>

          <h2>FUTA Tax</h2>
          <p>
            The Federal Unemployment Tax Act (FUTA) tax is 6.0% on the first $7,000 of each employee&apos;s wages per year.
            Employers who pay state unemployment tax on time receive a 5.4% credit, making the effective FUTA rate just 0.6%.
            The maximum FUTA tax per employee is $42 per year.
          </p>

          <h3>True Cost of Employment</h3>
          <p>
            Beyond payroll taxes, employers often pay for workers&apos; compensation insurance, state unemployment tax (SUTA),
            health insurance, and other benefits. The total cost to employ someone typically exceeds their salary by 20-40%.
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
            name: "Payroll Tax Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/payroll-tax-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
