"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Debt-to-Income Ratio Calculator - Check Your DTI",
  description:
    "Free DTI calculator to determine your debt-to-income ratio. Check if you qualify for a mortgage with front-end and back-end DTI analysis.",
  keywords:
    "debt to income ratio calculator, DTI calculator, debt to income ratio, mortgage qualification, front end DTI, back end DTI, how to calculate DTI",
};

export default function DebtToIncomeCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [grossIncome, setGrossIncome] = useState<string>("6000");
  const [housingPayment, setHousingPayment] = useState<string>("1500");
  const [carPayment, setCarPayment] = useState<string>("400");
  const [studentLoans, setStudentLoans] = useState<string>("300");
  const [creditCards, setCreditCards] = useState<string>("200");
  const [otherDebts, setOtherDebts] = useState<string>("0");
  const [result, setResult] = useState<{
    totalDebt: number;
    frontEndDTI: number;
    backEndDTI: number;
    rating: string;
    ratingColor: string;
  } | null>(null);

  function calculate() {
    const income = parseFloat(grossIncome);
    if (!income || income <= 0) return;

    const housing = parseFloat(housingPayment) || 0;
    const car = parseFloat(carPayment) || 0;
    const student = parseFloat(studentLoans) || 0;
    const credit = parseFloat(creditCards) || 0;
    const other = parseFloat(otherDebts) || 0;

    const totalDebt = housing + car + student + credit + other;
    const frontEndDTI = (housing / income) * 100;
    const backEndDTI = (totalDebt / income) * 100;

    let rating: string;
    let ratingColor: string;
    if (backEndDTI < 36) {
      rating = "Good";
      ratingColor = "text-green-700";
    } else if (backEndDTI <= 43) {
      rating = "Acceptable";
      ratingColor = "text-yellow-700";
    } else {
      rating = "High Risk";
      ratingColor = "text-red-700";
    }

    setResult({ totalDebt, frontEndDTI, backEndDTI, rating, ratingColor });
  }

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  const pct = (n: number) => n.toFixed(1) + "%";

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/debt-to-income-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Debt-to-Income Ratio Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your debt-to-income ratio to understand your financial health and mortgage qualification chances. Enter your monthly income and debts below.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Monthly Income</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Gross Monthly Income ({currency.symbol})</label>
              <input
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(e.target.value)}
                className="input-field"
                placeholder="e.g., 6000"
              />
            </div>
          </div>

          <h2 className="text-lg font-bold mb-4">Monthly Debts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Rent / Mortgage ({currency.symbol})</label>
              <input
                type="number"
                value={housingPayment}
                onChange={(e) => setHousingPayment(e.target.value)}
                className="input-field"
                placeholder="e.g., 1500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Car Payment ({currency.symbol})</label>
              <input
                type="number"
                value={carPayment}
                onChange={(e) => setCarPayment(e.target.value)}
                className="input-field"
                placeholder="e.g., 400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Student Loans ({currency.symbol})</label>
              <input
                type="number"
                value={studentLoans}
                onChange={(e) => setStudentLoans(e.target.value)}
                className="input-field"
                placeholder="e.g., 300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Credit Cards ({currency.symbol})</label>
              <input
                type="number"
                value={creditCards}
                onChange={(e) => setCreditCards(e.target.value)}
                className="input-field"
                placeholder="e.g., 200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Other Debts ({currency.symbol})</label>
              <input
                type="number"
                value={otherDebts}
                onChange={(e) => setOtherDebts(e.target.value)}
                className="input-field"
                placeholder="e.g., 0"
              />
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate DTI Ratio
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Back-End DTI</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{pct(result.backEndDTI)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Front-End DTI</p>
                <p className="text-2xl font-bold">{pct(result.frontEndDTI)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Rating</p>
                <p className={`text-2xl font-bold ${result.ratingColor}`}>{result.rating}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">DTI Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Gross Monthly Income</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(parseFloat(grossIncome))}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Monthly Debts</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.totalDebt)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Front-End DTI (Housing Only)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{pct(result.frontEndDTI)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Back-End DTI (All Debts)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{pct(result.backEndDTI)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">DTI Qualification Ranges</h2>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg border ${result.backEndDTI < 36 ? "bg-green-50 border-green-300" : "bg-[var(--muted-bg)] border-[var(--card-border)]"}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-700">Under 36% - Good</span>
                    <span className="text-sm text-[var(--muted)]">Excellent qualification</span>
                  </div>
                  <p className="text-sm text-[var(--muted)] mt-1">Most lenders consider this a healthy DTI. You should qualify for favorable loan terms.</p>
                </div>
                <div className={`p-3 rounded-lg border ${result.backEndDTI >= 36 && result.backEndDTI <= 43 ? "bg-yellow-50 border-yellow-300" : "bg-[var(--muted-bg)] border-[var(--card-border)]"}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-yellow-700">36% - 43% - Acceptable</span>
                    <span className="text-sm text-[var(--muted)]">May qualify with conditions</span>
                  </div>
                  <p className="text-sm text-[var(--muted)] mt-1">Some lenders will approve loans in this range, but terms may not be as favorable.</p>
                </div>
                <div className={`p-3 rounded-lg border ${result.backEndDTI > 43 ? "bg-red-50 border-red-300" : "bg-[var(--muted-bg)] border-[var(--card-border)]"}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-red-700">Over 43% - High Risk</span>
                    <span className="text-sm text-[var(--muted)]">Difficult to qualify</span>
                  </div>
                  <p className="text-sm text-[var(--muted)] mt-1">Most lenders will not approve a qualified mortgage above this threshold. Consider reducing debts.</p>
                </div>
              </div>

              {/* Visual DTI Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                  <span>0%</span>
                  <span>36%</span>
                  <span>43%</span>
                  <span>60%+</span>
                </div>
                <div className="w-full h-6 rounded-full overflow-hidden flex">
                  <div className="bg-green-400 h-full" style={{ width: "60%" }}></div>
                  <div className="bg-yellow-400 h-full" style={{ width: "12%" }}></div>
                  <div className="bg-red-400 h-full" style={{ width: "28%" }}></div>
                </div>
                <div className="relative mt-1">
                  <div
                    className="absolute text-xs font-bold"
                    style={{ left: `${Math.min(result.backEndDTI / 60 * 100, 100)}%`, transform: "translateX(-50%)" }}
                  >
                    You: {pct(result.backEndDTI)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is Debt-to-Income Ratio (DTI)?</h2>
          <p>
            Your debt-to-income ratio (DTI) compares your total monthly debt payments to your gross monthly
            income. It is one of the key metrics lenders use to evaluate your ability to manage monthly
            payments and repay borrowed money.
          </p>

          <h2>Front-End vs Back-End DTI</h2>
          <ul>
            <li><strong>Front-End DTI</strong> - Only includes housing costs (mortgage/rent, property tax, insurance). Lenders typically want this below 28%.</li>
            <li><strong>Back-End DTI</strong> - Includes all monthly debt obligations (housing + car loans + student loans + credit cards + other). Lenders typically want this below 36-43%.</li>
          </ul>

          <h2>How to Calculate DTI</h2>
          <p>The DTI formula is simple:</p>
          <p><strong>DTI = (Total Monthly Debt Payments / Gross Monthly Income) x 100</strong></p>

          <h3>How to Lower Your DTI</h3>
          <ul>
            <li>Pay down existing debts, starting with the highest-interest ones</li>
            <li>Avoid taking on new debt before applying for a mortgage</li>
            <li>Increase your income through raises, side jobs, or additional income sources</li>
            <li>Refinance existing loans for lower monthly payments</li>
            <li>Consider debt consolidation to simplify and reduce payments</li>
          </ul>

          <h3>Why DTI Matters for Mortgages</h3>
          <p>
            Most conventional lenders require a back-end DTI of 43% or lower for a qualified mortgage.
            FHA loans may allow up to 50% in some cases. A lower DTI not only helps you qualify but
            can also get you better interest rates and loan terms.
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
            name: "Debt-to-Income Ratio Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/debt-to-income-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
