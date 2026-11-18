"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Car Lease Calculator - Estimate Monthly Lease Payments",
  description:
    "Free car lease calculator. Estimate monthly lease payments, total lease cost, and compare leasing vs buying. Enter MSRP, residual value, and money factor.",
  keywords:
    "car lease calculator, lease payment calculator, auto lease calculator, car lease vs buy, monthly lease payment, money factor to APR, lease cost calculator, vehicle lease calculator",
};

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CarLeaseCalculatorPage() {
  const [msrp, setMsrp] = useState("35000");
  const [negotiatedPrice, setNegotiatedPrice] = useState("33000");
  const [residualPct, setResidualPct] = useState("55");
  const [moneyFactor, setMoneyFactor] = useState("0.00125");
  const [leaseTerm, setLeaseTerm] = useState("36");
  const [downPayment, setDownPayment] = useState("2000");
  const [tradeIn, setTradeIn] = useState("0");
  const [fees, setFees] = useState("1200");
  const [salesTaxRate, setSalesTaxRate] = useState("6");

  const msrpVal = parseFloat(msrp) || 0;
  const negPrice = parseFloat(negotiatedPrice) || 0;
  const residualVal = msrpVal * ((parseFloat(residualPct) || 0) / 100);
  const mf = parseFloat(moneyFactor) || 0;
  const term = parseInt(leaseTerm) || 36;
  const down = parseFloat(downPayment) || 0;
  const trade = parseFloat(tradeIn) || 0;
  const feesVal = parseFloat(fees) || 0;
  const taxRate = (parseFloat(salesTaxRate) || 0) / 100;

  const apr = mf * 2400;
  const adjustedCap = negPrice + feesVal - down - trade;
  const depreciation = (adjustedCap - residualVal) / term;
  const financeCharge = (adjustedCap + residualVal) * mf;
  const monthlyPreTax = depreciation + financeCharge;
  const monthlyTax = monthlyPreTax * taxRate;
  const monthlyPayment = monthlyPreTax + monthlyTax;
  const totalLeaseCost = monthlyPayment * term + down + trade;
  const totalInterest = financeCharge * term;
  const totalDepreciation = depreciation * term;

  // Lease vs Buy comparison (simple: 60-month loan at APR)
  const buyLoanTerm = 60;
  const buyRate = apr / 100 / 12;
  const buyPrincipal = negPrice + feesVal - down - trade;
  const buyMonthly = buyRate > 0
    ? (buyPrincipal * buyRate * Math.pow(1 + buyRate, buyLoanTerm)) / (Math.pow(1 + buyRate, buyLoanTerm) - 1)
    : buyPrincipal / buyLoanTerm;
  const buyTotalCost = buyMonthly * buyLoanTerm + down + trade;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/car-lease-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/car-lease-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Car Lease Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Estimate your monthly car lease payment, total lease cost, and compare leasing vs buying. Includes money factor to APR conversion.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">MSRP / Sticker Price ($)</label>
              <input type="number" value={msrp} onChange={(e) => setMsrp(e.target.value)} className="input-field" placeholder="35000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Negotiated Price ($)</label>
              <input type="number" value={negotiatedPrice} onChange={(e) => setNegotiatedPrice(e.target.value)} className="input-field" placeholder="33000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Residual Value (%)</label>
              <input type="number" value={residualPct} onChange={(e) => setResidualPct(e.target.value)} className="input-field" placeholder="55" step="0.1" />
              <p className="text-xs text-[var(--muted)] mt-1">Residual: {fmt(residualVal)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Money Factor</label>
              <input type="number" value={moneyFactor} onChange={(e) => setMoneyFactor(e.target.value)} className="input-field" placeholder="0.00125" step="0.00001" />
              <p className="text-xs text-[var(--muted)] mt-1">Equivalent APR: {apr.toFixed(2)}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lease Term (months)</label>
              <select value={leaseTerm} onChange={(e) => setLeaseTerm(e.target.value)} className="input-field">
                <option value="24">24 months</option>
                <option value="36">36 months</option>
                <option value="39">39 months</option>
                <option value="48">48 months</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Down Payment ($)</label>
              <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="input-field" placeholder="2000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trade-In Value ($)</label>
              <input type="number" value={tradeIn} onChange={(e) => setTradeIn(e.target.value)} className="input-field" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fees &mdash; Acquisition, Title, etc. ($)</label>
              <input type="number" value={fees} onChange={(e) => setFees(e.target.value)} className="input-field" placeholder="1200" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sales Tax Rate (%)</label>
              <input type="number" value={salesTaxRate} onChange={(e) => setSalesTaxRate(e.target.value)} className="input-field" placeholder="6" step="0.01" />
            </div>
          </div>
        </div>

        {msrpVal > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Monthly Payment</p>
                <p className="text-2xl font-bold text-green-700">{fmt(monthlyPayment)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Lease Cost</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(totalLeaseCost)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Equivalent APR</p>
                <p className="text-2xl font-bold text-amber-700">{apr.toFixed(2)}%</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Lease Cost Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    ["Adjusted Capitalized Cost", fmt(adjustedCap)],
                    ["Residual Value", fmt(residualVal)],
                    ["Monthly Depreciation", fmt(depreciation)],
                    ["Monthly Finance Charge", fmt(financeCharge)],
                    ["Monthly Tax", fmt(monthlyTax)],
                    ["Monthly Payment", fmt(monthlyPayment)],
                  ].map(([label, value]) => (
                    <tr key={label} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{label}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-medium">{value}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-semibold">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Depreciation ({term} mo)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(totalDepreciation)}</td>
                  </tr>
                  <tr className="bg-blue-50 font-semibold">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Interest ({term} mo)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(totalInterest)}</td>
                  </tr>
                  <tr className="bg-green-50 font-bold">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Lease Cost</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(totalLeaseCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Lease vs Buy Comparison</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left"></th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Lease ({term} mo)</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Buy ({buyLoanTerm} mo loan)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-[var(--card-border)] px-3 py-2">Monthly Payment</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(monthlyPayment)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(buyMonthly)}</td>
                  </tr>
                  <tr>
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Cost</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(totalLeaseCost)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(buyTotalCost)}</td>
                  </tr>
                  <tr>
                    <td className="border border-[var(--card-border)] px-3 py-2">Own the Car?</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">No</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does a Car Lease Work?</h2>
          <p>
            When you lease a car, you are essentially paying for the vehicle&apos;s depreciation during the lease term plus
            finance charges, rather than paying for the full price of the car. At the end of the lease, you return the vehicle
            to the dealer (or buy it at the residual value). Leasing typically results in lower monthly payments compared to
            buying, but you do not build equity in the vehicle. This car lease calculator helps you estimate your monthly
            payment and total cost so you can decide whether leasing or buying is right for you.
          </p>

          <h2>Understanding the Money Factor</h2>
          <p>
            The money factor is the leasing equivalent of an interest rate. To convert a money factor to an APR (Annual
            Percentage Rate), simply multiply by 2,400. For example, a money factor of 0.00125 equals an APR of 3.0%. A
            lower money factor means lower finance charges on your lease. You can negotiate the money factor just like you
            would negotiate an interest rate on a car loan. Dealers often mark up the money factor from what the leasing
            company offers, so always ask for the base rate.
          </p>

          <h2>Residual Value Explained</h2>
          <p>
            Residual value is the estimated worth of the car at the end of your lease term, expressed as a percentage of the
            MSRP. A higher residual value means lower depreciation costs and therefore a lower monthly payment. Luxury
            brands and popular models often have higher residual values. Typical residual values range from 45% to 65% for a
            36-month lease. The residual value is set by the leasing company and is generally not negotiable, unlike the
            selling price or money factor.
          </p>

          <h2>Capitalized Cost and Negotiation</h2>
          <p>
            The capitalized cost (cap cost) is the agreed-upon price of the vehicle for lease purposes. Just like when buying,
            you can negotiate this price below MSRP. The adjusted capitalized cost equals the negotiated price plus fees,
            minus your down payment and trade-in value. Lowering the cap cost directly reduces your monthly payment. Always
            negotiate the selling price before discussing lease terms with the dealer.
          </p>

          <h2>Lease vs Buy: Which Is Better?</h2>
          <p>
            Leasing is better if you prefer lower monthly payments, like driving a new car every few years, and typically
            drive fewer than 12,000 to 15,000 miles per year. Buying makes more sense if you plan to keep the car long-term,
            drive high mileage, or want to build equity. When comparing lease vs buy, consider total cost of ownership over
            your expected ownership period, not just the monthly payment. This auto lease calculator includes a lease vs
            buy comparison to help you evaluate both options side by side.
          </p>

          <h3>Tips for Getting the Best Lease Deal</h3>
          <p>
            Negotiate the vehicle price (cap cost) before mentioning that you want to lease. Look for manufacturer lease
            specials and incentives. Choose vehicles with high residual values for the lowest payments. Avoid putting too
            much money down on a lease because if the car is totaled or stolen, you may lose that upfront payment. Keep your
            mileage within the agreed limit to avoid excess mileage charges, which typically run $0.15 to $0.30 per mile.
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
            name: "Car Lease Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/car-lease-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
