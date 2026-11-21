"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "UK Student Loan Repayment Calculator 2024-25",
  description:
    "Free UK student loan repayment calculator. Calculate monthly repayments for Plan 1, Plan 2, Plan 4, Plan 5, and Postgraduate loans with year-by-year repayment schedule.",
  keywords:
    "student loan calculator UK, student loan repayment calculator, plan 2 repayment, plan 1 repayment, student loan threshold, student loan interest rate, postgraduate loan repayment",
};

type LoanPlan = "plan1" | "plan2" | "plan4" | "plan5" | "postgrad";

interface PlanInfo {
  name: string;
  threshold: number;
  rate: number;
  interestRate: number;
  writeOffYears: number;
}

const PLAN_INFO: Record<LoanPlan, PlanInfo> = {
  plan1: { name: "Plan 1", threshold: 22015, rate: 0.09, interestRate: 0.063, writeOffYears: 25 },
  plan2: { name: "Plan 2", threshold: 27295, rate: 0.09, interestRate: 0.063, writeOffYears: 30 },
  plan4: { name: "Plan 4 (Scotland)", threshold: 27660, rate: 0.09, interestRate: 0.063, writeOffYears: 30 },
  plan5: { name: "Plan 5", threshold: 25000, rate: 0.09, interestRate: 0.063, writeOffYears: 40 },
  postgrad: { name: "Postgraduate Loan", threshold: 21000, rate: 0.06, interestRate: 0.063, writeOffYears: 30 },
};

interface YearEntry {
  year: number;
  startBalance: number;
  interestAdded: number;
  repayment: number;
  endBalance: number;
}

interface LoanResult {
  plan: PlanInfo;
  salary: number;
  monthlyRepayment: number;
  annualRepayment: number;
  balance: number;
  yearsToRepay: number;
  totalRepaid: number;
  totalInterest: number;
  balanceWrittenOff: number;
  schedule: YearEntry[];
}

export default function UKStudentLoanPage() {
  const [salary, setSalary] = useState<string>("35000");
  const [loanPlan, setLoanPlan] = useState<LoanPlan>("plan2");
  const [outstandingBalance, setOutstandingBalance] = useState<string>("45000");
  const [result, setResult] = useState<LoanResult | null>(null);

  function calculate() {
    const sal = parseFloat(salary) || 0;
    const balance = parseFloat(outstandingBalance) || 0;
    if (sal <= 0 || balance <= 0) return;

    const plan = PLAN_INFO[loanPlan];
    const annualRepayment = sal > plan.threshold ? (sal - plan.threshold) * plan.rate : 0;
    const monthlyRepayment = annualRepayment / 12;

    // Build year-by-year schedule
    const schedule: YearEntry[] = [];
    let currentBalance = balance;
    let totalRepaid = 0;
    let totalInterest = 0;
    let year = 1;

    while (currentBalance > 0 && year <= plan.writeOffYears) {
      const interestAdded = currentBalance * plan.interestRate;
      totalInterest += interestAdded;
      currentBalance += interestAdded;

      const repayment = Math.min(annualRepayment, currentBalance);
      currentBalance -= repayment;
      totalRepaid += repayment;

      schedule.push({
        year,
        startBalance: currentBalance + repayment - interestAdded,
        interestAdded,
        repayment,
        endBalance: Math.max(0, currentBalance),
      });

      if (currentBalance <= 0) break;
      year++;
    }

    const balanceWrittenOff = Math.max(0, currentBalance);
    const yearsToRepay = currentBalance <= 0 ? year : plan.writeOffYears;

    setResult({
      plan,
      salary: sal,
      monthlyRepayment,
      annualRepayment,
      balance,
      yearsToRepay,
      totalRepaid,
      totalInterest,
      balanceWrittenOff,
      schedule,
    });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/uk-student-loan`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/uk-student-loan`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">UK Student Loan Repayment Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your monthly student loan repayments based on your salary and loan plan. See a year-by-year repayment schedule with interest and estimated payoff time.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Annual Salary (&pound;)</label>
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
              <label className="block text-sm font-medium mb-1">Loan Plan</label>
              <select
                value={loanPlan}
                onChange={(e) => setLoanPlan(e.target.value as LoanPlan)}
                className="input-field"
              >
                {Object.entries(PLAN_INFO).map(([key, info]) => (
                  <option key={key} value={key}>{info.name} (threshold {fmt(info.threshold)})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Outstanding Balance (&pound;)</label>
              <input
                type="number"
                value={outstandingBalance}
                onChange={(e) => setOutstandingBalance(e.target.value)}
                className="input-field"
                placeholder="e.g., 45000"
                min="0"
              />
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Repayments
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Monthly Repayment</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmtExact(result.monthlyRepayment)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Annual Repayment</p>
                <p className="text-2xl font-bold">{fmtExact(result.annualRepayment)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Years to Repay</p>
                <p className="text-2xl font-bold text-green-700">{result.yearsToRepay}{result.balanceWrittenOff > 0 ? " (written off)" : ""}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Repaid</p>
                <p className="text-2xl font-bold">{fmt(result.totalRepaid)}</p>
              </div>
            </div>

            {result.balanceWrittenOff > 0 && (
              <div className="tool-card mb-6 border-amber-300" style={{ background: "#fffbeb", borderColor: "#fcd34d" }}>
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> At your current salary, the loan will not be fully repaid within the {result.plan.writeOffYears}-year write-off period. An estimated {fmt(result.balanceWrittenOff)} will be written off.
                </p>
              </div>
            )}

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Repayment Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Detail</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Loan Plan</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{result.plan.name}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Repayment Threshold</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.plan.threshold)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Repayment Rate</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{(result.plan.rate * 100).toFixed(0)}% above threshold</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Interest Rate</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{(result.plan.interestRate * 100).toFixed(1)}%</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Total Interest Accrued</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">{fmtExact(result.totalInterest)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Total Repaid</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.totalRepaid)}</td>
                    </tr>
                    {result.balanceWrittenOff > 0 && (
                      <tr className="bg-amber-50">
                        <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Balance Written Off</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-amber-700">{fmtExact(result.balanceWrittenOff)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Year-by-Year Schedule</h2>
              <div className="overflow-x-auto" style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0">
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Year</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Start Balance</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Interest</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Repayment</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">End Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((entry) => (
                      <tr key={entry.year} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{entry.year}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(entry.startBalance)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">+{fmt(entry.interestAdded)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">-{fmt(entry.repayment)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(entry.endBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Repayment Thresholds by Plan</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Plan</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Threshold</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Rate</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Write-Off</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(PLAN_INFO).map((info) => (
                      <tr key={info.name} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{info.name}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(info.threshold)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{(info.rate * 100).toFixed(0)}%</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{info.writeOffYears} years</td>
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
          <h2>How Do UK Student Loan Repayments Work?</h2>
          <p>
            UK student loan repayments are automatically deducted from your salary through the PAYE system once you earn above the repayment threshold for your loan plan. You repay 9% of everything you earn above the threshold (6% for Postgraduate loans). This student loan calculator UK tool helps you understand exactly how much you will repay each month and how long it will take to clear your balance, taking into account the interest that accrues on your loan.
          </p>

          <h2>Plan 1 Student Loans</h2>
          <p>
            Plan 1 applies to students who started their course before 1 September 2012 in England and Wales, or before 1 September 2023 in Northern Ireland. The repayment threshold for 2024-25 is &pound;22,015 per year. You repay 9% of everything earned above this threshold. Plan 1 loans are written off 25 years after the April you were first due to repay. The interest rate on Plan 1 loans is linked to the lower of RPI inflation or the Bank of England base rate plus 1%.
          </p>

          <h2>Plan 2 Student Loans</h2>
          <p>
            Plan 2 applies to students who started their course on or after 1 September 2012 in England and Wales. The repayment threshold is &pound;27,295 per year for 2024-25. Like Plan 1, you repay 9% of earnings above the threshold. Plan 2 loans carry higher interest than Plan 1 &mdash; while studying and during the first April after graduation, interest is RPI plus 3%. After that, it scales between RPI and RPI plus 3% based on your income. Plan 2 loans are written off 30 years after the April you were first due to repay.
          </p>

          <h2>Plan 4 Student Loans (Scotland)</h2>
          <p>
            Plan 4 replaced the old Plan 1 for Scottish students from April 2021. It applies to students who took out a loan from SAAS (Student Awards Agency Scotland). The repayment threshold is &pound;27,660 per year for 2024-25, which is higher than Plans 1 and 2. The repayment rate remains 9% of earnings above the threshold, and loans are written off after 30 years. If you have both a Plan 1 and Plan 4 loan, you will repay both simultaneously.
          </p>

          <h2>Plan 5 Student Loans</h2>
          <p>
            Plan 5 is the newest repayment plan, applying to students who start courses in England from August 2023 onwards. The repayment threshold is &pound;25,000, and the repayment rate is 9% of earnings above the threshold. The key difference is the write-off period: Plan 5 loans are written off after 40 years, which is longer than any other plan. However, the interest rate is capped at RPI only, with no additional percentage added on top, making it more favourable for high earners who would repay their loan in full.
          </p>

          <h2>Postgraduate Loan Repayments</h2>
          <p>
            Postgraduate loans have a separate repayment threshold of &pound;21,000 per year and a lower repayment rate of 6% (compared to 9% for undergraduate plans). If you have both an undergraduate and a postgraduate loan, you repay both simultaneously &mdash; meaning you could pay up to 15% of your income above the respective thresholds. Postgraduate loans are written off 30 years after the April you were first due to repay.
          </p>

          <h2>Will My Student Loan Be Written Off?</h2>
          <p>
            All UK student loans are eventually written off if not fully repaid within the write-off period. For many graduates, particularly those on average salaries, the loan will be written off before it is fully repaid. This means student loan repayments function more like a graduate tax than a traditional debt. It is important to understand that voluntary overpayments reduce your balance but may not save you money if your loan would have been written off anyway. Use this student loan repayment calculator to see whether your loan will be repaid or written off at your current salary.
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
            name: "UK Student Loan Repayment Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/uk-student-loan`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          }),
        }}
      />
    </>
  );
}
