"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Mortgage Calculator - Monthly Payment & Amortization Schedule",
  description:
    "Free mortgage calculator to estimate monthly payments, total interest, and view a full amortization schedule. Includes property tax, insurance, and PMI estimates.",
  keywords:
    "mortgage calculator, home loan calculator, mortgage payment calculator, house payment calculator, mortgage rate calculator, amortization schedule, monthly mortgage payment",
};

export default function MortgageCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [homePrice, setHomePrice] = useState<string>("350000");
  const [downPayment, setDownPayment] = useState<string>("70000");
  const [downPaymentType, setDownPaymentType] = useState<"dollar" | "percent">("dollar");
  const [interestRate, setInterestRate] = useState<string>("6.5");
  const [loanTerm, setLoanTerm] = useState<string>("30");
  const [propertyTax, setPropertyTax] = useState<string>("3500");
  const [insurance, setInsurance] = useState<string>("1200");
  const [showSchedule, setShowSchedule] = useState(false);
  const [result, setResult] = useState<{
    loanAmount: number;
    monthlyPrincipalInterest: number;
    monthlyTax: number;
    monthlyInsurance: number;
    monthlyTotal: number;
    totalInterest: number;
    totalPayment: number;
    schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[];
  } | null>(null);

  function calculate() {
    const price = parseFloat(homePrice);
    const rate = parseFloat(interestRate);
    const term = parseInt(loanTerm);
    const tax = parseFloat(propertyTax) || 0;
    const ins = parseFloat(insurance) || 0;

    if (!price || !rate || !term || price <= 0 || rate <= 0 || term <= 0) return;

    let dp: number;
    if (downPaymentType === "percent") {
      dp = price * ((parseFloat(downPayment) || 0) / 100);
    } else {
      dp = parseFloat(downPayment) || 0;
    }

    const loanAmount = price - dp;
    if (loanAmount <= 0) return;

    const n = term * 12;
    const r = rate / 12 / 100;
    const monthlyPI = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const monthlyTax = tax / 12;
    const monthlyInsurance = ins / 12;
    const monthlyTotal = monthlyPI + monthlyTax + monthlyInsurance;

    const schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
    let balance = loanAmount;
    let totalInterest = 0;

    for (let i = 1; i <= n; i++) {
      const interestPart = balance * r;
      const principalPart = monthlyPI - interestPart;
      balance -= principalPart;
      totalInterest += interestPart;

      schedule.push({
        month: i,
        payment: Math.round(monthlyPI),
        principal: Math.round(principalPart),
        interest: Math.round(interestPart),
        balance: Math.max(0, Math.round(balance)),
      });
    }

    setResult({
      loanAmount,
      monthlyPrincipalInterest: monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyTotal,
      totalInterest,
      totalPayment: monthlyPI * n + tax * term + ins * term,
      schedule,
    });
  }

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);
  const fmtExact = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/mortgage-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/mortgage-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Mortgage Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your monthly mortgage payment including principal, interest, property tax, and insurance. View a full amortization schedule for your home loan.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Home Price ({currency.symbol})</label>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(e.target.value)}
                className="input-field"
                placeholder="e.g., 350000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Down Payment ({downPaymentType === "dollar" ? currency.symbol : "%"})
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="input-field flex-1"
                  placeholder={downPaymentType === "dollar" ? "e.g., 70000" : "e.g., 20"}
                />
                <select
                  value={downPaymentType}
                  onChange={(e) => {
                    const type = e.target.value as "dollar" | "percent";
                    setDownPaymentType(type);
                    setDownPayment(type === "dollar" ? "70000" : "20");
                  }}
                  className="input-field w-20"
                >
                  <option value="dollar">{currency.symbol}</option>
                  <option value="percent">%</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="input-field"
                step="0.125"
                placeholder="e.g., 6.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Loan Term</label>
              <select value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="input-field">
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="30">30 Years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Annual Property Tax ({currency.symbol})</label>
              <input
                type="number"
                value={propertyTax}
                onChange={(e) => setPropertyTax(e.target.value)}
                className="input-field"
                placeholder="e.g., 3500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Annual Home Insurance ({currency.symbol})</label>
              <input
                type="number"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                className="input-field"
                placeholder="e.g., 1200"
              />
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Mortgage
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Monthly Payment</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmtExact(result.monthlyTotal)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Loan Amount</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.loanAmount)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Payment Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Principal &amp; Interest</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.monthlyPrincipalInterest)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Property Tax</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.monthlyTax)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Home Insurance</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.monthlyInsurance)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Total Monthly Payment</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.monthlyTotal)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-[var(--muted-bg)] rounded-lg">
                  <p className="text-sm text-[var(--muted)]">Total Interest</p>
                  <p className="font-bold text-red-600">{fmt(result.totalInterest)}</p>
                </div>
                <div className="text-center p-3 bg-[var(--muted-bg)] rounded-lg">
                  <p className="text-sm text-[var(--muted)]">Total Cost of Loan</p>
                  <p className="font-bold">{fmt(result.totalPayment)}</p>
                </div>
              </div>
            </div>

            <div className="tool-card overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Amortization Schedule</h2>
                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  {showSchedule ? "Hide Schedule" : "Show Schedule"}
                </button>
              </div>

              {showSchedule && (
                <>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-[var(--muted-bg)]">
                        <th className="border border-[var(--card-border)] px-3 py-2 text-left">Month</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Payment</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Principal</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Interest</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.slice(0, 60).map((row) => (
                        <tr key={row.month} className="hover:bg-[var(--muted-bg)]">
                          <td className="border border-[var(--card-border)] px-3 py-2">{row.month}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.payment)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.principal)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.interest)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.schedule.length > 60 && (
                    <p className="text-sm text-[var(--muted)] mt-3 text-center">
                      Showing first 60 of {result.schedule.length} months
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does a Mortgage Calculator Work?</h2>
          <p>
            A mortgage calculator estimates your monthly home loan payment based on the home price, down payment,
            interest rate, and loan term. It uses the standard amortization formula to calculate the fixed monthly
            principal and interest payment, then adds estimated property taxes and insurance.
          </p>

          <h2>The Mortgage Payment Formula</h2>
          <p>The monthly principal and interest payment is calculated using:</p>
          <p><strong>M = P[r(1+r)^n] / [(1+r)^n - 1]</strong></p>
          <ul>
            <li><strong>M</strong> = Monthly payment</li>
            <li><strong>P</strong> = Loan principal (home price minus down payment)</li>
            <li><strong>r</strong> = Monthly interest rate (annual rate / 12)</li>
            <li><strong>n</strong> = Total number of payments (years x 12)</li>
          </ul>

          <h2>How Much House Can I Afford?</h2>
          <p>
            Financial experts generally recommend that your total monthly housing costs (mortgage, taxes, insurance)
            should not exceed 28% of your gross monthly income. Your total debt payments should not exceed 36% of
            gross income. Use this calculator to find a comfortable payment amount.
          </p>

          <h3>15-Year vs 30-Year Mortgage</h3>
          <p>
            A 15-year mortgage has higher monthly payments but significantly lower total interest cost. A 30-year
            mortgage offers lower monthly payments but you pay much more in interest over the life of the loan.
            Consider your budget and long-term financial goals when choosing.
          </p>

          <h3>The Importance of Down Payment</h3>
          <ul>
            <li>A larger down payment means a smaller loan and lower monthly payments</li>
            <li>Putting 20% or more down typically eliminates the need for PMI</li>
            <li>A bigger down payment can help you qualify for better interest rates</li>
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
            name: "Mortgage Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/mortgage-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
