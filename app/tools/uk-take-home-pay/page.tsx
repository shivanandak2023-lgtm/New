"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "UK Take Home Pay Calculator 2024-25",
  description:
    "Free UK take home pay calculator for 2024-25. Calculate your net salary after income tax, National Insurance, pension, and student loan deductions with annual, monthly, weekly, and hourly breakdowns.",
  keywords:
    "take home pay calculator UK, salary after tax UK, net pay calculator UK, UK tax calculator 2024, income tax calculator UK, national insurance calculator, PAYE calculator, Scottish tax calculator",
};

type StudentLoanPlan = "none" | "plan1" | "plan2" | "plan4" | "plan5" | "postgrad";

interface TaxBreakdown {
  grossAnnual: number;
  personalAllowance: number;
  taxableIncome: number;
  incomeTax: number;
  nationalInsurance: number;
  pensionContribution: number;
  studentLoanDeduction: number;
  netAnnual: number;
  netMonthly: number;
  netWeekly: number;
  netDaily: number;
  netHourly: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  taxBands: { band: string; rate: string; taxable: number; tax: number }[];
  niBands: { band: string; rate: string; taxable: number; ni: number }[];
}

const STUDENT_LOAN_THRESHOLDS: Record<string, { threshold: number; rate: number }> = {
  plan1: { threshold: 22015, rate: 0.09 },
  plan2: { threshold: 27295, rate: 0.09 },
  plan4: { threshold: 27660, rate: 0.09 },
  plan5: { threshold: 25000, rate: 0.09 },
  postgrad: { threshold: 21000, rate: 0.06 },
};

export default function UKTakeHomePayPage() {
  const [grossSalary, setGrossSalary] = useState<string>("35000");
  const [pensionPercent, setPensionPercent] = useState<string>("5");
  const [studentLoan, setStudentLoan] = useState<StudentLoanPlan>("none");
  const [scottishTax, setScottishTax] = useState<boolean>(false);
  const [taxCode, setTaxCode] = useState<string>("1257L");
  const [result, setResult] = useState<TaxBreakdown | null>(null);

  function parseTaxCode(code: string): number {
    const match = code.match(/^(\d+)/);
    if (match) return parseInt(match[1]) * 10;
    return 12570;
  }

  function calculateIncomeTax(taxableIncome: number, isScottish: boolean): { total: number; bands: { band: string; rate: string; taxable: number; tax: number }[] } {
    const bands: { band: string; rate: string; taxable: number; tax: number }[] = [];
    let remaining = taxableIncome;
    let total = 0;

    if (isScottish) {
      const scottishBands = [
        { name: "Starter Rate", rate: 0.19, limit: 2306 },
        { name: "Basic Rate", rate: 0.20, limit: 11542 },
        { name: "Intermediate Rate", rate: 0.21, limit: 19233 },
        { name: "Higher Rate", rate: 0.42, limit: 93710 },
        { name: "Top Rate", rate: 0.47, limit: Infinity },
      ];

      for (const band of scottishBands) {
        if (remaining <= 0) break;
        const taxable = Math.min(remaining, band.limit);
        const tax = taxable * band.rate;
        bands.push({ band: band.name, rate: `${(band.rate * 100).toFixed(0)}%`, taxable, tax });
        total += tax;
        remaining -= taxable;
      }
    } else {
      const engBands = [
        { name: "Basic Rate", rate: 0.20, limit: 37700 },
        { name: "Higher Rate", rate: 0.40, limit: 87440 },
        { name: "Additional Rate", rate: 0.45, limit: Infinity },
      ];

      for (const band of engBands) {
        if (remaining <= 0) break;
        const taxable = Math.min(remaining, band.limit);
        const tax = taxable * band.rate;
        bands.push({ band: band.name, rate: `${(band.rate * 100).toFixed(0)}%`, taxable, tax });
        total += tax;
        remaining -= taxable;
      }
    }

    return { total, bands };
  }

  function calculateNI(grossAnnual: number): { total: number; bands: { band: string; rate: string; taxable: number; ni: number }[] } {
    const bands: { band: string; rate: string; taxable: number; ni: number }[] = [];
    let total = 0;

    const primaryThreshold = 12570;
    const upperEarningsLimit = 50270;

    if (grossAnnual > primaryThreshold) {
      const basicNIable = Math.min(grossAnnual, upperEarningsLimit) - primaryThreshold;
      const basicNI = basicNIable * 0.08;
      bands.push({ band: `£12,570 - £50,270`, rate: "8%", taxable: basicNIable, ni: basicNI });
      total += basicNI;

      if (grossAnnual > upperEarningsLimit) {
        const upperNIable = grossAnnual - upperEarningsLimit;
        const upperNI = upperNIable * 0.02;
        bands.push({ band: `Above £50,270`, rate: "2%", taxable: upperNIable, ni: upperNI });
        total += upperNI;
      }
    }

    return { total, bands };
  }

  function calculate() {
    const gross = parseFloat(grossSalary) || 0;
    if (gross <= 0) return;

    const pension = gross * ((parseFloat(pensionPercent) || 0) / 100);
    const taxableGross = gross - pension;

    // Personal allowance (tapers for income over £100,000)
    let personalAllowance = parseTaxCode(taxCode);
    if (gross > 100000) {
      personalAllowance = Math.max(0, personalAllowance - (gross - 100000) / 2);
    }

    const taxableIncome = Math.max(0, taxableGross - personalAllowance);
    const { total: incomeTax, bands: taxBands } = calculateIncomeTax(taxableIncome, scottishTax);
    const { total: nationalInsurance, bands: niBands } = calculateNI(gross);

    // Student loan
    let studentLoanDeduction = 0;
    if (studentLoan !== "none") {
      const plan = STUDENT_LOAN_THRESHOLDS[studentLoan];
      if (gross > plan.threshold) {
        studentLoanDeduction = (gross - plan.threshold) * plan.rate;
      }
    }

    const netAnnual = gross - incomeTax - nationalInsurance - pension - studentLoanDeduction;
    const netMonthly = netAnnual / 12;
    const netWeekly = netAnnual / 52;
    const netDaily = netAnnual / 260;
    const netHourly = netAnnual / (37.5 * 52);

    const totalDeductions = incomeTax + nationalInsurance + pension + studentLoanDeduction;
    const effectiveTaxRate = gross > 0 ? (totalDeductions / gross) * 100 : 0;

    // Marginal rate calculation
    let marginalTaxRate = 20;
    if (taxableIncome > 37700 + 87440) marginalTaxRate = scottishTax ? 47 : 45;
    else if (taxableIncome > 37700) marginalTaxRate = scottishTax ? 42 : 40;
    else if (scottishTax && taxableIncome > 2306 + 11542) marginalTaxRate = 21;

    setResult({
      grossAnnual: gross,
      personalAllowance,
      taxableIncome,
      incomeTax,
      nationalInsurance,
      pensionContribution: pension,
      studentLoanDeduction,
      netAnnual,
      netMonthly,
      netWeekly,
      netDaily,
      netHourly,
      effectiveTaxRate,
      marginalTaxRate,
      taxBands,
      niBands,
    });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  // Comparison salaries
  const comparisonSalaries = [20000, 25000, 30000, 35000, 40000, 50000, 60000, 75000, 100000];

  function quickCalcNet(gross: number): number {
    const pa = gross > 100000 ? Math.max(0, 12570 - (gross - 100000) / 2) : 12570;
    const pensionDed = gross * ((parseFloat(pensionPercent) || 0) / 100);
    const taxable = Math.max(0, gross - pensionDed - pa);
    let tax = 0;
    if (scottishTax) {
      const sBands = [2306, 11542, 19233, 93710];
      const sRates = [0.19, 0.20, 0.21, 0.42, 0.47];
      let rem = taxable;
      for (let i = 0; i < sRates.length; i++) {
        const limit = i < sBands.length ? sBands[i] : Infinity;
        const t = Math.min(rem, limit);
        tax += t * sRates[i];
        rem -= t;
        if (rem <= 0) break;
      }
    } else {
      const eBands = [37700, 87440];
      const eRates = [0.20, 0.40, 0.45];
      let rem = taxable;
      for (let i = 0; i < eRates.length; i++) {
        const limit = i < eBands.length ? eBands[i] : Infinity;
        const t = Math.min(rem, limit);
        tax += t * eRates[i];
        rem -= t;
        if (rem <= 0) break;
      }
    }
    let ni = 0;
    if (gross > 12570) {
      ni += Math.min(gross, 50270 - 12570 > 0 ? 50270 : gross) > 12570 ? (Math.min(gross, 50270) - 12570) * 0.08 : 0;
      if (gross > 50270) ni += (gross - 50270) * 0.02;
    }
    let sl = 0;
    if (studentLoan !== "none") {
      const plan = STUDENT_LOAN_THRESHOLDS[studentLoan];
      if (gross > plan.threshold) sl = (gross - plan.threshold) * plan.rate;
    }
    return gross - tax - ni - pensionDed - sl;
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/uk-take-home-pay`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/uk-take-home-pay`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">UK Take Home Pay Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your net salary after income tax, National Insurance, pension contributions, and student loan deductions. Supports English/Welsh and Scottish tax bands for 2024-25.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Gross Annual Salary (&pound;)</label>
              <input
                type="number"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                className="input-field"
                placeholder="e.g., 35000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tax Code</label>
              <input
                type="text"
                value={taxCode}
                onChange={(e) => setTaxCode(e.target.value.toUpperCase())}
                className="input-field"
                placeholder="e.g., 1257L"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pension Contribution (%)</label>
              <input
                type="number"
                value={pensionPercent}
                onChange={(e) => setPensionPercent(e.target.value)}
                className="input-field"
                placeholder="e.g., 5"
                min="0"
                max="100"
                step="0.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Student Loan Plan</label>
              <select
                value={studentLoan}
                onChange={(e) => setStudentLoan(e.target.value as StudentLoanPlan)}
                className="input-field"
              >
                <option value="none">No Student Loan</option>
                <option value="plan1">Plan 1 (pre-2012)</option>
                <option value="plan2">Plan 2 (post-2012)</option>
                <option value="plan4">Plan 4 (Scotland)</option>
                <option value="plan5">Plan 5 (from 2023)</option>
                <option value="postgrad">Postgraduate Loan</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              id="scottishTax"
              checked={scottishTax}
              onChange={(e) => setScottishTax(e.target.checked)}
              className="w-5 h-5 accent-[var(--primary)]"
            />
            <label htmlFor="scottishTax" className="text-sm font-medium">
              Scottish taxpayer (different income tax bands)
            </label>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Take Home Pay
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Annual Take Home</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmtExact(result.netAnnual)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Monthly Take Home</p>
                <p className="text-2xl font-bold text-green-700">{fmtExact(result.netMonthly)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Weekly Take Home</p>
                <p className="text-2xl font-bold">{fmtExact(result.netWeekly)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Effective Deduction Rate</p>
                <p className="text-2xl font-bold">{result.effectiveTaxRate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Pay Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Component</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annual</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Monthly</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Weekly</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Gross Salary</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.grossAnnual)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.grossAnnual / 12)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.grossAnnual / 52)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">Income Tax</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.incomeTax)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.incomeTax / 12)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.incomeTax / 52)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">National Insurance</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.nationalInsurance)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.nationalInsurance / 12)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.nationalInsurance / 52)}</td>
                    </tr>
                    {result.pensionContribution > 0 && (
                      <tr className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">Pension ({pensionPercent}%)</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.pensionContribution)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.pensionContribution / 12)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.pensionContribution / 52)}</td>
                      </tr>
                    )}
                    {result.studentLoanDeduction > 0 && (
                      <tr className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">Student Loan</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.studentLoanDeduction)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.studentLoanDeduction / 12)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.studentLoanDeduction / 52)}</td>
                      </tr>
                    )}
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Take Home Pay</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.netAnnual)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.netMonthly)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.netWeekly)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div><strong>Daily:</strong> {fmtExact(result.netDaily)}</div>
                <div><strong>Hourly (37.5h/wk):</strong> {fmtExact(result.netHourly)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="tool-card">
                <h2 className="text-lg font-bold mb-4">Income Tax Bands</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-[var(--muted-bg)]">
                        <th className="border border-[var(--card-border)] px-3 py-2 text-left">Band</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Rate</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">Personal Allowance</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">0%</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(0)}</td>
                      </tr>
                      {result.taxBands.map((band, i) => (
                        <tr key={i} className="hover:bg-[var(--muted-bg)]">
                          <td className="border border-[var(--card-border)] px-3 py-2">{band.band}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{band.rate}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(band.tax)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="tool-card">
                <h2 className="text-lg font-bold mb-4">National Insurance Bands</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-[var(--muted-bg)]">
                        <th className="border border-[var(--card-border)] px-3 py-2 text-left">Band</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Rate</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">NI</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">Below &pound;12,570</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">0%</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(0)}</td>
                      </tr>
                      {result.niBands.map((band, i) => (
                        <tr key={i} className="hover:bg-[var(--muted-bg)]">
                          <td className="border border-[var(--card-border)] px-3 py-2">{band.band}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{band.rate}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(band.ni)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Salary Comparison Table</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Gross Annual</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Net Annual</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Net Monthly</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Deduction %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonSalaries.map((sal) => {
                      const net = quickCalcNet(sal);
                      const deductPct = ((sal - net) / sal * 100).toFixed(1);
                      return (
                        <tr key={sal} className={sal === result.grossAnnual ? "bg-blue-50 font-semibold" : "hover:bg-[var(--muted-bg)]"}>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(sal)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(net)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(net / 12)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{deductPct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does UK Income Tax Work?</h2>
          <p>
            Income tax in the UK is charged on a progressive basis, meaning you pay higher rates on higher portions of your income. For the 2024-25 tax year in England, Wales, and Northern Ireland, the basic rate is 20% on income up to &pound;37,700 above your personal allowance, the higher rate is 40% on income between &pound;37,701 and &pound;125,140 above your personal allowance, and the additional rate is 45% on income above &pound;125,140. This take home pay calculator UK tool applies these rates automatically to show your salary after tax UK.
          </p>

          <h2>Scottish Income Tax Rates 2024-25</h2>
          <p>
            Scottish taxpayers pay different income tax rates set by the Scottish Parliament. For 2024-25, there are five bands: starter rate at 19% on the first &pound;2,306, basic rate at 20% on the next &pound;11,542, intermediate rate at 21% on the next &pound;19,233, higher rate at 42% on the next &pound;93,710, and top rate at 47% on income above &pound;125,140. If you live in Scotland, toggle the Scottish tax option in this calculator to see your accurate take-home pay.
          </p>

          <h2>National Insurance Contributions (NIC)</h2>
          <p>
            Employees pay National Insurance at 8% on earnings between &pound;12,570 and &pound;50,270 per year (the primary threshold to upper earnings limit), and 2% on earnings above &pound;50,270. National Insurance is calculated separately from income tax and funds the state pension, NHS, and other benefits. This net pay calculator UK includes NI in the total deductions calculation so you can see your actual take-home pay.
          </p>

          <h2>Personal Allowance and Tax Codes</h2>
          <p>
            The standard personal allowance for 2024-25 is &pound;12,570, which is the amount you can earn tax-free. This is reflected in the standard tax code 1257L. However, your personal allowance is reduced by &pound;1 for every &pound;2 of income above &pound;100,000, meaning it is completely eliminated at &pound;125,140. This creates an effective 60% marginal tax rate between &pound;100,000 and &pound;125,140. Different tax codes may give you a higher or lower allowance depending on your circumstances.
          </p>

          <h2>Pension Contributions and Tax Relief</h2>
          <p>
            Workplace pension contributions reduce your taxable income, which means you receive tax relief on your contributions. Under auto-enrolment, the minimum employee contribution is currently 5% of qualifying earnings. If your employer uses a salary sacrifice pension scheme, your contributions are deducted before tax and NI, giving you additional NI savings. Higher and additional rate taxpayers benefit more from pension contributions because they receive relief at their marginal rate.
          </p>

          <h2>Student Loan Deductions</h2>
          <p>
            Student loan repayments are deducted from your salary through PAYE if you earn above the repayment threshold. Plan 1 starts at &pound;22,015, Plan 2 at &pound;27,295, Plan 4 at &pound;27,660, Plan 5 at &pound;25,000, and Postgraduate loans at &pound;21,000. The repayment rate is 9% of earnings above the threshold for undergraduate plans and 6% for postgraduate loans. These deductions are shown in this UK take home pay calculator so you can see the full picture of your net pay.
          </p>

          <h2>Understanding Your Payslip</h2>
          <p>
            Your payslip should show your gross pay, income tax deducted, National Insurance contributions, pension deductions, any student loan repayments, and your net pay. The calculations in this salary after tax UK calculator match the standard PAYE calculations used by employers. If your actual payslip differs significantly from these figures, it may be because of benefits in kind, salary sacrifice arrangements, or a different tax code. Always check with your employer or HMRC if you believe your tax code is incorrect.
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
            name: "UK Take Home Pay Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/uk-take-home-pay`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          }),
        }}
      />
    </>
  );
}
