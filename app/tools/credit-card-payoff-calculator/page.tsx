"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Credit Card Payoff Calculator - Pay Off Debt Faster",
  description:
    "Free credit card payoff calculator. Find out how long it will take to pay off your credit card debt and how much interest you will pay. Compare minimum vs fixed payment strategies.",
  keywords:
    "credit card payoff calculator, credit card payment calculator, debt payoff calculator, minimum payment calculator, credit card interest calculator, debt free calculator",
};

type Mode = "timeToPayoff" | "paymentNeeded";

export default function CreditCardPayoffCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [balance, setBalance] = useState<string>("5000");
  const [apr, setApr] = useState<string>("22.99");
  const [mode, setMode] = useState<Mode>("timeToPayoff");

  // Time to payoff mode
  const [paymentType, setPaymentType] = useState<"fixed" | "percent">("fixed");
  const [fixedPayment, setFixedPayment] = useState<string>("150");
  const [percentPayment, setPercentPayment] = useState<string>("2");

  // Payment needed mode
  const [targetMonths, setTargetMonths] = useState<string>("24");

  const bal = parseFloat(balance) || 0;
  const rate = (parseFloat(apr) || 0) / 100 / 12;

  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  let requiredPayment = 0;

  if (mode === "timeToPayoff" && bal > 0 && rate > 0) {
    const minPay = paymentType === "fixed"
      ? parseFloat(fixedPayment) || 0
      : bal * ((parseFloat(percentPayment) || 0) / 100);

    if (paymentType === "fixed" && minPay > 0) {
      const payment = minPay;
      if (payment <= bal * rate) {
        months = -1; // never pays off
      } else {
        months = Math.ceil(-Math.log(1 - (bal * rate) / payment) / Math.log(1 + rate));
        let tempBal = bal;
        for (let i = 0; i < months; i++) {
          const intCharge = tempBal * rate;
          totalInterest += intCharge;
          tempBal = tempBal + intCharge - payment;
          if (tempBal < 0) tempBal = 0;
        }
        totalPaid = bal + totalInterest;
      }
    } else if (paymentType === "percent" && minPay > 0) {
      const pctRate = (parseFloat(percentPayment) || 0) / 100;
      let tempBal = bal;
      const maxMonths = 600; // 50 years cap
      while (tempBal > 0.01 && months < maxMonths) {
        const intCharge = tempBal * rate;
        const payment = Math.max(tempBal * pctRate, 25); // typical minimum $25
        totalInterest += intCharge;
        tempBal = tempBal + intCharge - payment;
        if (tempBal < 0) tempBal = 0;
        months++;
      }
      if (months >= maxMonths) months = -1;
      totalPaid = bal + totalInterest;
    }
  } else if (mode === "paymentNeeded" && bal > 0 && rate > 0) {
    const target = parseInt(targetMonths) || 24;
    if (target > 0) {
      requiredPayment = bal * (rate * Math.pow(1 + rate, target)) / (Math.pow(1 + rate, target) - 1);
      totalPaid = requiredPayment * target;
      totalInterest = totalPaid - bal;
      months = target;
    }
  }

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  // Comparison: minimum payment vs double
  const comparePayments = [100, 150, 200, 300, 500].filter((p) => p > bal * rate);
  const comparisons = comparePayments.map((payment) => {
    if (rate <= 0) return { payment, months: 0, interest: 0, total: bal };
    const m = Math.ceil(-Math.log(1 - (bal * rate) / payment) / Math.log(1 + rate));
    let tempBal = bal;
    let interest = 0;
    for (let i = 0; i < m; i++) {
      const intCharge = tempBal * rate;
      interest += intCharge;
      tempBal = tempBal + intCharge - payment;
      if (tempBal < 0) tempBal = 0;
    }
    return { payment, months: m, interest, total: bal + interest };
  });

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/credit-card-payoff-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Credit Card Payoff Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Find out how long it will take to pay off your credit card balance and how much total interest you will pay. Compare strategies to become debt-free faster.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Current Balance ({currency.symbol})</label>
              <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} className="input-field" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Interest Rate (APR %)</label>
              <input type="number" value={apr} onChange={(e) => setApr(e.target.value)} className="input-field" step="0.01" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-3">Calculation Mode</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {([
                  { id: "timeToPayoff" as Mode, label: "How long to pay off?" },
                  { id: "paymentNeeded" as Mode, label: "How much to pay monthly?" },
                ] as const).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                      mode === m.id
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {mode === "timeToPayoff" && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Payment Type</label>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setPaymentType("fixed")}
                      className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                        paymentType === "fixed"
                          ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                          : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                      }`}
                    >
                      Fixed Amount ($)
                    </button>
                    <button
                      onClick={() => setPaymentType("percent")}
                      className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                        paymentType === "percent"
                          ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                          : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                      }`}
                    >
                      Percentage of Balance (%)
                    </button>
                  </div>
                </div>
                {paymentType === "fixed" ? (
                  <div>
                    <label className="block text-sm font-medium mb-1">Monthly Payment ({currency.symbol})</label>
                    <input type="number" value={fixedPayment} onChange={(e) => setFixedPayment(e.target.value)} className="input-field" step="10" />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment (% of balance)</label>
                    <input type="number" value={percentPayment} onChange={(e) => setPercentPayment(e.target.value)} className="input-field" step="0.5" />
                  </div>
                )}
              </>
            )}

            {mode === "paymentNeeded" && (
              <div>
                <label className="block text-sm font-medium mb-1">Target Months to Pay Off</label>
                <input type="number" value={targetMonths} onChange={(e) => setTargetMonths(e.target.value)} className="input-field" min="1" />
              </div>
            )}
          </div>
        </div>

        {bal > 0 && (
          <div className="mb-8">
            {months === -1 ? (
              <div className="result-card text-center mb-6" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
                <p className="text-lg font-bold text-red-700">
                  Your payment is too low to ever pay off the balance. The monthly interest ({fmt(bal * rate)}) exceeds your payment.
                </p>
              </div>
            ) : (months > 0 || requiredPayment > 0) ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {mode === "timeToPayoff" ? (
                    <div className="result-card text-center">
                      <p className="text-sm text-[var(--muted)] mb-1">Time to Pay Off</p>
                      <p className="text-2xl font-bold text-[var(--primary)]">
                        {Math.floor(months / 12) > 0 ? `${Math.floor(months / 12)}y ` : ""}{months % 12}mo
                      </p>
                      <p className="text-xs text-[var(--muted)]">({months} months)</p>
                    </div>
                  ) : (
                    <div className="result-card text-center">
                      <p className="text-sm text-[var(--muted)] mb-1">Required Monthly Payment</p>
                      <p className="text-2xl font-bold text-[var(--primary)]">{fmt(requiredPayment)}</p>
                    </div>
                  )}
                  <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                    <p className="text-sm text-[var(--muted)] mb-1">Total Interest</p>
                    <p className="text-2xl font-bold text-amber-700">{fmt(totalInterest)}</p>
                  </div>
                  <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                    <p className="text-sm text-[var(--muted)] mb-1">Total Amount Paid</p>
                    <p className="text-2xl font-bold text-green-700">{fmt(totalPaid)}</p>
                  </div>
                </div>
              </>
            ) : null}

            {comparisons.length > 0 && (
              <div className="tool-card">
                <h2 className="text-lg font-bold mb-4">Payment Comparison</h2>
                <p className="text-sm text-[var(--muted)] mb-3">
                  See how different monthly payments affect your payoff time and total interest on a {fmt(bal)} balance at {apr}% APR.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-[var(--muted-bg)]">
                        <th className="border border-[var(--card-border)] px-3 py-2 text-left">Monthly Payment</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Months</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Total Interest</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Total Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisons.map((c) => (
                        <tr key={c.payment} className="hover:bg-[var(--muted-bg)]">
                          <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">{fmt(c.payment)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{c.months}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(c.interest)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(c.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Credit Card Interest Works</h2>
          <p>
            Credit card interest is calculated daily using your APR (Annual Percentage Rate) divided by 365. The daily rate
            is applied to your outstanding balance each day. This means the longer you carry a balance, the more interest
            accumulates — even on the interest itself.
          </p>

          <h2>The Minimum Payment Trap</h2>
          <p>
            Credit card companies typically require a minimum payment of 1-3% of the balance or $25, whichever is greater.
            Paying only the minimum on a $5,000 balance at 22.99% APR would take over 25 years to pay off and cost more than
            $8,000 in interest — more than the original balance.
          </p>

          <h2>Strategies to Pay Off Credit Card Debt</h2>
          <ul>
            <li><strong>Avalanche Method:</strong> Pay off the highest-interest card first to minimize total interest</li>
            <li><strong>Snowball Method:</strong> Pay off the smallest balance first for quick psychological wins</li>
            <li><strong>Balance Transfer:</strong> Transfer to a 0% APR card (watch for transfer fees)</li>
            <li><strong>Debt Consolidation:</strong> Combine multiple debts into one lower-rate personal loan</li>
          </ul>

          <h3>Average Credit Card Rates</h3>
          <p>
            As of 2024, the average credit card APR in the US is about 21-25%. Rewards cards tend to have higher rates,
            while low-interest cards may offer rates around 13-18%. Always aim to pay your full balance each month to avoid
            interest charges entirely.
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
            name: "Credit Card Payoff Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/credit-card-payoff-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
