"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "W-4 Tax Withholding Calculator - Federal Withholding Estimator 2024",
  description:
    "Free W-4 tax withholding calculator. Estimate federal withholding per paycheck, annual tax liability, and how to fill out your W-4 form for 2024.",
  keywords:
    "w4 calculator, w-4 tax withholding calculator, how to fill out w4, federal withholding calculator, paycheck withholding calculator, w4 form calculator, tax withholding estimator 2024",
};

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmt2(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 2024 Federal Tax Brackets
const BRACKETS_SINGLE = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

const BRACKETS_MARRIED = [
  { min: 0, max: 23200, rate: 0.10 },
  { min: 23200, max: 94300, rate: 0.12 },
  { min: 94300, max: 201050, rate: 0.22 },
  { min: 201050, max: 383900, rate: 0.24 },
  { min: 383900, max: 487450, rate: 0.32 },
  { min: 487450, max: 731200, rate: 0.35 },
  { min: 731200, max: Infinity, rate: 0.37 },
];

const BRACKETS_HOH = [
  { min: 0, max: 16550, rate: 0.10 },
  { min: 16550, max: 63100, rate: 0.12 },
  { min: 63100, max: 100500, rate: 0.22 },
  { min: 100500, max: 191950, rate: 0.24 },
  { min: 191950, max: 243700, rate: 0.32 },
  { min: 243700, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

const STD_DEDUCTIONS: Record<string, number> = {
  single: 14600,
  married: 29200,
  hoh: 21900,
};

function calcTax(taxableIncome: number, brackets: typeof BRACKETS_SINGLE): number {
  let tax = 0;
  for (const b of brackets) {
    if (taxableIncome <= b.min) break;
    const taxable = Math.min(taxableIncome, b.max) - b.min;
    tax += taxable * b.rate;
  }
  return tax;
}

const PAY_PERIODS: Record<string, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
};

export default function W4CalculatorPage() {
  const [filingStatus, setFilingStatus] = useState("single");
  const [payFrequency, setPayFrequency] = useState("biweekly");
  const [grossPay, setGrossPay] = useState("3000");
  const [dependents, setDependents] = useState("0");
  const [additionalWithholding, setAdditionalWithholding] = useState("0");
  const [otherIncome, setOtherIncome] = useState("0");
  const [deductionType, setDeductionType] = useState("standard");
  const [itemizedAmount, setItemizedAmount] = useState("0");

  const periods = PAY_PERIODS[payFrequency] || 26;
  const gross = parseFloat(grossPay) || 0;
  const deps = parseInt(dependents) || 0;
  const addlWithholding = parseFloat(additionalWithholding) || 0;
  const other = parseFloat(otherIncome) || 0;
  const itemized = parseFloat(itemizedAmount) || 0;

  const annualGross = gross * periods + other;
  const stdDeduction = STD_DEDUCTIONS[filingStatus] || 14600;
  const deduction = deductionType === "standard" ? stdDeduction : Math.max(itemized, stdDeduction);
  const dependentCredit = deps * 2000;

  const brackets =
    filingStatus === "married" ? BRACKETS_MARRIED : filingStatus === "hoh" ? BRACKETS_HOH : BRACKETS_SINGLE;

  const taxableIncome = Math.max(0, annualGross - deduction);
  const annualTaxBeforeCredits = calcTax(taxableIncome, brackets);
  const annualTax = Math.max(0, annualTaxBeforeCredits - dependentCredit);

  const withholdingPerPaycheck = annualTax / periods + addlWithholding;
  const totalAnnualWithholding = withholdingPerPaycheck * periods;
  const effectiveRate = annualGross > 0 ? (annualTax / annualGross) * 100 : 0;
  const takeHomePay = gross - withholdingPerPaycheck;

  // Bracket breakdown
  const bracketBreakdown: { rate: string; taxable: string; tax: string }[] = [];
  for (const b of brackets) {
    if (taxableIncome <= b.min) break;
    const taxable = Math.min(taxableIncome, b.max) - b.min;
    bracketBreakdown.push({
      rate: (b.rate * 100).toFixed(0) + "%",
      taxable: fmt(taxable),
      tax: fmt(Math.round(taxable * b.rate)),
    });
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/us-w4-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="/tools/us-w4-calculator" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">W-4 Tax Withholding Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Estimate your recommended federal tax withholding per paycheck using 2024 tax brackets. Calculate how to fill out your W-4 form correctly.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Filing Status</label>
              <select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)} className="input-field">
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
                <option value="hoh">Head of Household</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pay Frequency</label>
              <select value={payFrequency} onChange={(e) => setPayFrequency(e.target.value)} className="input-field">
                <option value="weekly">Weekly (52 paychecks)</option>
                <option value="biweekly">Biweekly (26 paychecks)</option>
                <option value="semimonthly">Semi-Monthly (24 paychecks)</option>
                <option value="monthly">Monthly (12 paychecks)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gross Pay Per Period ($)</label>
              <input type="number" value={grossPay} onChange={(e) => setGrossPay(e.target.value)} className="input-field" placeholder="3000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Dependents</label>
              <input type="number" value={dependents} onChange={(e) => setDependents(e.target.value)} className="input-field" min="0" max="20" />
              <p className="text-xs text-[var(--muted)] mt-1">$2,000 credit per qualifying dependent</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Other Annual Income ($)</label>
              <input type="number" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} className="input-field" placeholder="0" />
              <p className="text-xs text-[var(--muted)] mt-1">Interest, dividends, side income</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Additional Withholding Per Paycheck ($)</label>
              <input type="number" value={additionalWithholding} onChange={(e) => setAdditionalWithholding(e.target.value)} className="input-field" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deduction Type</label>
              <select value={deductionType} onChange={(e) => setDeductionType(e.target.value)} className="input-field">
                <option value="standard">Standard Deduction ({fmt(stdDeduction)})</option>
                <option value="itemized">Itemized Deductions</option>
              </select>
            </div>
            {deductionType === "itemized" && (
              <div>
                <label className="block text-sm font-medium mb-1">Total Itemized Deductions ($)</label>
                <input type="number" value={itemizedAmount} onChange={(e) => setItemizedAmount(e.target.value)} className="input-field" placeholder="0" />
              </div>
            )}
          </div>
        </div>

        {gross > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Recommended Withholding / Paycheck</p>
                <p className="text-2xl font-bold text-green-700">{fmt2(withholdingPerPaycheck)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Estimated Annual Tax</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(annualTax)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Effective Tax Rate</p>
                <p className="text-2xl font-bold text-amber-700">{effectiveRate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Take-Home Pay / Paycheck</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt2(Math.max(0, takeHomePay))}</p>
                <p className="text-xs text-[var(--muted)]">Before state tax &amp; FICA</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Annual Withholding</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(totalAnnualWithholding)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Tax Bracket Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Tax Rate</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Taxable Amount</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {bracketBreakdown.map((b, i) => (
                    <tr key={i} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{b.rate}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{b.taxable}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{b.tax}</td>
                    </tr>
                  ))}
                  <tr className="bg-green-50 font-bold">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(taxableIncome)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(Math.round(annualTaxBeforeCredits))}</td>
                  </tr>
                </tbody>
              </table>
              {dependentCredit > 0 && (
                <p className="text-sm text-[var(--muted)] mt-3">
                  Dependent tax credit applied: <strong className="text-green-700">-{fmt(dependentCredit)}</strong> ({deps} dependent{deps > 1 ? "s" : ""} x $2,000)
                </p>
              )}
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Income Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Gross Annual Income</span><span className="font-medium">{fmt(annualGross)}</span></div>
                <div className="flex justify-between"><span>Deduction ({deductionType === "standard" ? "Standard" : "Itemized"})</span><span className="font-medium text-red-600">-{fmt(deduction)}</span></div>
                <div className="flex justify-between border-t pt-2"><span className="font-bold">Taxable Income</span><span className="font-bold">{fmt(taxableIncome)}</span></div>
                <div className="flex justify-between"><span>Federal Tax (before credits)</span><span className="font-medium">{fmt(Math.round(annualTaxBeforeCredits))}</span></div>
                {dependentCredit > 0 && <div className="flex justify-between"><span>Dependent Credit</span><span className="font-medium text-green-700">-{fmt(dependentCredit)}</span></div>}
                <div className="flex justify-between border-t pt-2"><span className="font-bold">Net Federal Tax</span><span className="font-bold">{fmt(annualTax)}</span></div>
              </div>
            </div>

            <div className="result-card mb-6" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
              <h3 className="font-bold mb-2">2024 Standard Deductions</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Single:</strong> $14,600</li>
                <li><strong>Married Filing Jointly:</strong> $29,200</li>
                <li><strong>Head of Household:</strong> $21,900</li>
              </ul>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>W-4 Calculator: How to Fill Out Your W-4 Form in 2024</h2>
          <p>
            The IRS Form W-4 determines how much federal income tax your employer withholds from each paycheck. Getting your W-4 right means you do not owe a large tax bill in April and you do not give the government an interest-free loan by over-withholding. This W-4 tax withholding calculator uses the 2024 federal tax brackets and standard deductions to estimate the correct amount your employer should withhold from every paycheck.
          </p>

          <h2>How the W-4 Withholding Calculator Works</h2>
          <p>
            This calculator takes your filing status, pay frequency, gross pay per period, number of dependents, and any additional income or deductions. It calculates your projected annual taxable income by subtracting the appropriate standard or itemized deduction from your gross annual wages. Then it applies the 2024 federal income tax brackets to determine your estimated annual tax liability. The result is divided by the number of pay periods to give you the recommended federal withholding per paycheck.
          </p>

          <h2>Understanding the 2024 W-4 Form</h2>
          <p>
            The current W-4 form was redesigned in 2020 and no longer uses withholding allowances. Instead, it has five steps. Step 1 requires your personal information and filing status. Step 2 is for multiple jobs or working spouses. Step 3 is where you claim dependents — the form provides $2,000 per qualifying child under 17 and $500 per other dependent. Step 4 allows for adjustments such as other income, itemized deductions, and extra withholding. Step 5 is your signature. This calculator helps you determine what values to enter in Steps 3 and 4.
          </p>

          <h2>Filing Status and Its Impact on Withholding</h2>
          <p>
            Your filing status has a significant impact on your tax withholding. Single filers receive a standard deduction of $14,600 for 2024. Married filing jointly filers get $29,200, effectively doubling the deduction. Head of household filers receive $21,900. The tax brackets also differ by filing status, with married filing jointly brackets being roughly double the single brackets. Choosing the correct filing status on your W-4 is essential for accurate withholding.
          </p>

          <h2>When to Update Your W-4</h2>
          <p>
            You should update your W-4 whenever you experience a life change that affects your tax situation. This includes getting married or divorced, having a child, buying a home, starting a side job, or receiving a significant raise. If you owed taxes or received a large refund when you filed your last return, that is also a signal to adjust your W-4. The IRS recommends reviewing your withholding at least once a year to ensure accuracy. Use this W-4 calculator each time your financial situation changes to avoid surprises at tax time.
          </p>

          <h3>Common W-4 Mistakes to Avoid</h3>
          <p>
            Many taxpayers make errors on their W-4 that lead to under-withholding or over-withholding. One common mistake is failing to account for a working spouse when both spouses earn income. Another is not claiming the dependent credit when eligible, which results in too much tax being withheld. If you have significant non-wage income such as investment earnings or freelance income, failing to report that on your W-4 can lead to an unexpected tax bill. This calculator factors in all these variables so you can fill out your W-4 with confidence.
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
            name: "W-4 Tax Withholding Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/us-w4-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
