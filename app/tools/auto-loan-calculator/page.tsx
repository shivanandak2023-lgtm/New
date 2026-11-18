"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Auto Loan Calculator - Calculate Your Monthly Car Payment",
  description:
    "Free auto loan calculator to estimate your monthly car payment, total interest, and total cost. Includes down payment, trade-in, sales tax, and amortization schedule.",
  keywords:
    "auto loan calculator, car payment calculator, car loan calculator, vehicle loan calculator, monthly car payment, car loan interest, auto financing calculator",
};

const LOAN_TERMS = [36, 48, 60, 72, 84];

export default function AutoLoanCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [vehiclePrice, setVehiclePrice] = useState<string>("35000");
  const [downPayment, setDownPayment] = useState<string>("5000");
  const [tradeIn, setTradeIn] = useState<string>("0");
  const [interestRate, setInterestRate] = useState<string>("6.5");
  const [loanTerm, setLoanTerm] = useState<number>(60);
  const [salesTaxPct, setSalesTaxPct] = useState<string>("6");
  const [showAmortization, setShowAmortization] = useState(false);

  const price = parseFloat(vehiclePrice) || 0;
  const down = parseFloat(downPayment) || 0;
  const trade = parseFloat(tradeIn) || 0;
  const rate = parseFloat(interestRate) || 0;
  const taxPct = parseFloat(salesTaxPct) || 0;

  const salesTax = price * (taxPct / 100);
  const loanAmount = Math.max(0, price + salesTax - down - trade);
  const monthlyRate = rate / 100 / 12;
  const n = loanTerm;

  let monthlyPayment = 0;
  if (monthlyRate > 0 && n > 0) {
    monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  } else if (n > 0) {
    monthlyPayment = loanAmount / n;
  }

  const totalPaid = monthlyPayment * n;
  const totalInterest = totalPaid - loanAmount;
  const totalCost = price + salesTax + totalInterest;

  // Amortization schedule
  const amortization: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
  let balance = loanAmount;
  for (let i = 1; i <= n && balance > 0; i++) {
    const intPayment = balance * monthlyRate;
    const princPayment = monthlyPayment - intPayment;
    balance = Math.max(0, balance - princPayment);
    amortization.push({
      month: i,
      payment: monthlyPayment,
      principal: princPayment,
      interest: intPayment,
      balance,
    });
  }

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/auto-loan-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Auto Loan Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your monthly car payment including down payment, trade-in value, sales tax, and interest. View a full amortization schedule.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Vehicle Price ({currency.symbol})</label>
              <input type="number" value={vehiclePrice} onChange={(e) => setVehiclePrice(e.target.value)} className="input-field" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Down Payment ({currency.symbol})</label>
              <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="input-field" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trade-In Value ({currency.symbol})</label>
              <input type="number" value={tradeIn} onChange={(e) => setTradeIn(e.target.value)} className="input-field" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Interest Rate (APR %)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="input-field" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sales Tax (%)</label>
              <input type="number" value={salesTaxPct} onChange={(e) => setSalesTaxPct(e.target.value)} className="input-field" step="0.25" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-3">Loan Term (months)</label>
              <div className="flex flex-wrap gap-2">
                {LOAN_TERMS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setLoanTerm(t)}
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                      loanTerm === t
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    {t} mo
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loanAmount > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Monthly Payment</p>
                <p className="text-2xl font-bold text-green-700">{fmt(monthlyPayment)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Loan Amount</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(loanAmount)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(totalInterest)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#faf5ff", borderColor: "#e9d5ff" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Cost</p>
                <p className="text-2xl font-bold text-purple-700">{fmt(totalCost)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Loan Summary</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Vehicle Price</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(price)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Sales Tax ({salesTaxPct}%)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(salesTax)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Down Payment</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmt(down)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Trade-In Value</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmt(trade)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)] bg-blue-50 font-semibold">
                    <td className="border border-[var(--card-border)] px-3 py-2">Amount Financed</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(loanAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tool-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Amortization Schedule</h2>
                <button
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  {showAmortization ? "Hide Schedule" : "Show Schedule"}
                </button>
              </div>
              {showAmortization && (
                <div className="overflow-x-auto">
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
                      {amortization.map((row) => (
                        <tr key={row.month} className="hover:bg-[var(--muted-bg)]">
                          <td className="border border-[var(--card-border)] px-3 py-2">{row.month}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.payment)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.principal)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.interest)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Auto Loans Work</h2>
          <p>
            An auto loan is a secured loan used to purchase a vehicle. The car serves as collateral, which typically results
            in lower interest rates compared to unsecured loans. Monthly payments are calculated using the loan amount,
            interest rate, and loan term.
          </p>

          <h2>How to Get the Best Car Loan Rate</h2>
          <ul>
            <li><strong>Check your credit score:</strong> A score above 720 typically qualifies for the best rates</li>
            <li><strong>Shop multiple lenders:</strong> Compare rates from banks, credit unions, and dealerships</li>
            <li><strong>Make a larger down payment:</strong> 20% or more reduces your loan amount and may lower your rate</li>
            <li><strong>Choose a shorter term:</strong> 36-48 month loans usually have lower rates than 72-84 month loans</li>
          </ul>

          <h2>Average Auto Loan Rates in 2024</h2>
          <p>
            Average new car loan rates range from about 5% to 7% for buyers with good credit, while used car rates are
            typically 1-2% higher. Buyers with excellent credit (750+) may qualify for rates as low as 3-4% or even 0%
            promotional financing from some manufacturers.
          </p>

          <h3>The True Cost of a Longer Loan</h3>
          <p>
            While a 72 or 84-month loan has lower monthly payments, you will pay significantly more in total interest. A
            $30,000 loan at 6.5% costs about $2,600 in interest over 36 months but over $7,300 over 84 months. Choose the
            shortest term you can comfortably afford.
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
            name: "Auto Loan Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/auto-loan-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
