"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Paycheck Calculator by State - Compare Take-Home Pay All 50 States",
  description:
    "Free paycheck calculator by state. Calculate take-home pay after federal and state taxes for all 50 US states. Compare net pay across no-income-tax states.",
  keywords:
    "paycheck calculator by state, take home pay calculator by state, salary after taxes by state, state income tax calculator, net pay by state, no income tax states, state tax comparison, paycheck estimator",
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
};

const STANDARD_DEDUCTION: Record<string, number> = {
  single: 14600,
  married: 29200,
};

const PAY_FREQUENCIES: Record<string, { label: string; periods: number }> = {
  weekly: { label: "Weekly", periods: 52 },
  biweekly: { label: "Bi-Weekly", periods: 26 },
  semimonthly: { label: "Semi-Monthly", periods: 24 },
  monthly: { label: "Monthly", periods: 12 },
};

const STATE_TAX_RATES: { abbr: string; name: string; rate: number }[] = [
  { abbr: "AL", name: "Alabama", rate: 4.0 },
  { abbr: "AK", name: "Alaska", rate: 0 },
  { abbr: "AZ", name: "Arizona", rate: 2.5 },
  { abbr: "AR", name: "Arkansas", rate: 4.4 },
  { abbr: "CA", name: "California", rate: 9.3 },
  { abbr: "CO", name: "Colorado", rate: 4.4 },
  { abbr: "CT", name: "Connecticut", rate: 5.0 },
  { abbr: "DE", name: "Delaware", rate: 6.6 },
  { abbr: "FL", name: "Florida", rate: 0 },
  { abbr: "GA", name: "Georgia", rate: 5.49 },
  { abbr: "HI", name: "Hawaii", rate: 7.2 },
  { abbr: "ID", name: "Idaho", rate: 5.8 },
  { abbr: "IL", name: "Illinois", rate: 4.95 },
  { abbr: "IN", name: "Indiana", rate: 3.05 },
  { abbr: "IA", name: "Iowa", rate: 5.7 },
  { abbr: "KS", name: "Kansas", rate: 5.7 },
  { abbr: "KY", name: "Kentucky", rate: 4.0 },
  { abbr: "LA", name: "Louisiana", rate: 4.25 },
  { abbr: "ME", name: "Maine", rate: 7.15 },
  { abbr: "MD", name: "Maryland", rate: 5.75 },
  { abbr: "MA", name: "Massachusetts", rate: 5.0 },
  { abbr: "MI", name: "Michigan", rate: 4.25 },
  { abbr: "MN", name: "Minnesota", rate: 7.85 },
  { abbr: "MS", name: "Mississippi", rate: 4.7 },
  { abbr: "MO", name: "Missouri", rate: 4.95 },
  { abbr: "MT", name: "Montana", rate: 5.9 },
  { abbr: "NE", name: "Nebraska", rate: 5.84 },
  { abbr: "NV", name: "Nevada", rate: 0 },
  { abbr: "NH", name: "New Hampshire", rate: 0 },
  { abbr: "NJ", name: "New Jersey", rate: 6.37 },
  { abbr: "NM", name: "New Mexico", rate: 4.9 },
  { abbr: "NY", name: "New York", rate: 6.85 },
  { abbr: "NC", name: "North Carolina", rate: 4.5 },
  { abbr: "ND", name: "North Dakota", rate: 1.95 },
  { abbr: "OH", name: "Ohio", rate: 3.99 },
  { abbr: "OK", name: "Oklahoma", rate: 4.75 },
  { abbr: "OR", name: "Oregon", rate: 8.75 },
  { abbr: "PA", name: "Pennsylvania", rate: 3.07 },
  { abbr: "RI", name: "Rhode Island", rate: 5.99 },
  { abbr: "SC", name: "South Carolina", rate: 6.4 },
  { abbr: "SD", name: "South Dakota", rate: 0 },
  { abbr: "TN", name: "Tennessee", rate: 0 },
  { abbr: "TX", name: "Texas", rate: 0 },
  { abbr: "UT", name: "Utah", rate: 4.65 },
  { abbr: "VT", name: "Vermont", rate: 6.6 },
  { abbr: "VA", name: "Virginia", rate: 5.75 },
  { abbr: "WA", name: "Washington", rate: 0 },
  { abbr: "WV", name: "West Virginia", rate: 5.12 },
  { abbr: "WI", name: "Wisconsin", rate: 5.3 },
  { abbr: "WY", name: "Wyoming", rate: 0 },
];

const NO_TAX_STATES = STATE_TAX_RATES.filter((s) => s.rate === 0);

function calcFederalTax(taxableIncome: number, brackets: { min: number; max: number; rate: number }[]): number {
  let tax = 0;
  for (const b of brackets) {
    if (taxableIncome <= b.min) break;
    tax += (Math.min(taxableIncome, b.max) - b.min) * b.rate;
  }
  return tax;
}

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function StatePaycheckCalculatorPage() {
  const [grossPay, setGrossPay] = useState("75000");
  const [payFrequency, setPayFrequency] = useState("biweekly");
  const [filingStatus, setFilingStatus] = useState("single");
  const [selectedState, setSelectedState] = useState("CA");

  const annualGross = parseFloat(grossPay) || 0;
  const periods = PAY_FREQUENCIES[payFrequency]?.periods || 26;
  const standardDed = STANDARD_DEDUCTION[filingStatus] || 14600;
  const taxableIncome = Math.max(0, annualGross - standardDed);
  const brackets = FEDERAL_BRACKETS_2024[filingStatus as keyof typeof FEDERAL_BRACKETS_2024] || FEDERAL_BRACKETS_2024.single;
  const fedTax = calcFederalTax(taxableIncome, brackets);

  const ssWageCap = 168600;
  const ss = Math.min(annualGross, ssWageCap) * 0.062;
  const medicare = annualGross * 0.0145 + (annualGross > 200000 ? (annualGross - 200000) * 0.009 : 0);

  const stateObj = STATE_TAX_RATES.find((s) => s.abbr === selectedState)!;
  const stateTax = annualGross * (stateObj.rate / 100);
  const totalDeductions = fedTax + ss + medicare + stateTax;
  const netPay = annualGross - totalDeductions;

  const noTaxComparison = NO_TAX_STATES.slice(0, 3).map((s) => {
    const net = annualGross - fedTax - ss - medicare;
    return { name: s.name, abbr: s.abbr, net, savings: net - netPay };
  });

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/state-paycheck-calculator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Paycheck Calculator by State</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your take-home pay in any US state. Compare net pay across all 50 states including no-income-tax states like Texas, Florida, and Washington.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Annual Gross Salary ($)</label>
              <input
                type="number"
                value={grossPay}
                onChange={(e) => setGrossPay(e.target.value)}
                className="input-field"
                placeholder="e.g., 75000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pay Frequency</label>
              <select value={payFrequency} onChange={(e) => setPayFrequency(e.target.value)} className="input-field">
                {Object.entries(PAY_FREQUENCIES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Filing Status</label>
              <select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)} className="input-field">
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="input-field">
                {STATE_TAX_RATES.map((s) => (
                  <option key={s.abbr} value={s.abbr}>
                    {s.name} ({s.rate === 0 ? "No Income Tax" : s.rate + "%"})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {annualGross > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Gross Per Paycheck</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(annualGross / periods)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Net Per Paycheck</p>
                <p className="text-2xl font-bold text-green-700">{fmt(netPay / periods)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Annual Net Pay</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(netPay)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Deductions Breakdown &mdash; {stateObj.name}</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Deduction</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Per Paycheck</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annual</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Federal Income Tax", amount: fedTax },
                    { label: "Social Security (6.2%)", amount: ss },
                    { label: "Medicare (1.45%)", amount: medicare },
                    { label: `State Tax — ${stateObj.name} (${stateObj.rate}%)`, amount: stateTax },
                  ].map((row) => (
                    <tr key={row.label} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{row.label}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.amount / periods)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.amount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-semibold">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Deductions</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">{fmt(totalDeductions / periods)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">{fmt(totalDeductions)}</td>
                  </tr>
                  <tr className="bg-green-50 font-bold">
                    <td className="border border-[var(--card-border)] px-3 py-2">Net Pay</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(netPay / periods)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(netPay)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {stateObj.rate > 0 && (
              <div className="tool-card mb-6">
                <h2 className="text-lg font-bold mb-4">What If You Lived in a No-Income-Tax State?</h2>
                <p className="text-sm text-[var(--muted)] mb-4">
                  Compare your {stateObj.name} take-home pay to states with no income tax.
                </p>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">State</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annual Net Pay</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">You Save</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-yellow-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{stateObj.name} (current)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(netPay)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">&mdash;</td>
                    </tr>
                    {noTaxComparison.map((s) => (
                      <tr key={s.abbr} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{s.name}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700 font-medium">{fmt(s.net)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700 font-bold">+{fmt(s.savings)}/yr</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Paycheck Calculator by State: Understand Your Take-Home Pay</h2>
          <p>
            Your take-home pay varies significantly depending on which US state you live in. While federal income tax, Social Security,
            and Medicare are the same nationwide, state income tax rates range from 0% to over 13%. This paycheck calculator by state
            helps you estimate your net pay after all deductions so you can make informed decisions about where to live and work.
          </p>

          <h2>How State Income Tax Affects Your Paycheck</h2>
          <p>
            Nine US states have no state income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas,
            Washington, and Wyoming. Living in one of these states means more money in your pocket each paycheck. For example,
            a worker earning $75,000 in California pays roughly $6,975 in state income tax at the 9.3% rate, while the same
            worker in Texas pays $0 in state income tax. That is nearly $7,000 more per year in take-home pay.
          </p>

          <h2>Federal Tax Brackets for 2024</h2>
          <p>
            The US uses a progressive federal income tax system with seven brackets for 2024. Single filers pay 10% on the
            first $11,600 of taxable income, 12% on income from $11,601 to $47,150, 22% from $47,151 to $100,525, 24% from
            $100,526 to $191,950, 32% from $191,951 to $243,725, 35% from $243,726 to $609,350, and 37% on income above
            $609,350. Married filing jointly filers enjoy wider brackets, with the 10% bracket extending to $23,200.
          </p>

          <h2>FICA Taxes: Social Security and Medicare</h2>
          <p>
            Regardless of your state, every worker pays FICA taxes. Social Security tax is 6.2% of earnings up to the wage
            base of $168,600 in 2024. Medicare tax is 1.45% on all earnings, with an additional 0.9% surtax on earnings above
            $200,000. These payroll taxes are unavoidable and represent a significant portion of your total tax burden, especially
            for lower and middle-income earners. Understanding FICA helps you accurately estimate your net paycheck.
          </p>

          <h2>Comparing Take-Home Pay Across States</h2>
          <p>
            When evaluating a job offer or considering a move, comparing take-home pay across states is essential. High-tax
            states like California, New York, and Oregon can reduce your paycheck substantially, but they may also offer higher
            average salaries and additional public services. No-income-tax states like Florida and Texas let you keep more of
            each dollar earned, but cost of living and other factors also matter. Use this state paycheck calculator to run
            side-by-side comparisons and see exactly how much you would take home in each state.
          </p>

          <h3>Highest State Income Tax Rates</h3>
          <p>
            California leads with a top marginal rate of 13.3%, followed by Hawaii at 11%, New Jersey at 10.75%, Oregon at
            9.9%, and Minnesota at 9.85%. These high rates primarily affect top earners, but even the mid-bracket rates in
            these states are significantly higher than the national average. Workers in New York City face an additional city
            income tax on top of the state rate, making it one of the highest-taxed jurisdictions in the country.
          </p>

          <h3>Tips to Maximize Your Take-Home Pay</h3>
          <p>
            Consider contributing to pre-tax retirement accounts like a 401(k) to reduce your taxable income. Health Savings
            Accounts (HSAs) and Flexible Spending Accounts (FSAs) also reduce your tax burden. If you are self-employed,
            quarterly estimated tax payments help you avoid penalties. Always review your W-4 withholding to ensure your
            employer is deducting the correct amount from each paycheck.
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
            name: "Paycheck Calculator by State",
            description: META.description,
            url: `${SITE_URL}/tools/state-paycheck-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
