"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Roth IRA Calculator - Tax-Free Retirement Growth Estimator",
  description:
    "Free Roth IRA calculator. Estimate tax-free retirement savings growth, compare Roth vs Traditional IRA, and see year-by-year projections with 2024 limits.",
  keywords:
    "roth ira calculator, roth ira growth calculator, roth vs traditional ira calculator, roth ira contribution limits, roth ira retirement calculator, tax free retirement, ira calculator, roth ira income limits",
};

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function RothIraCalculatorPage() {
  const [currentAge, setCurrentAge] = useState("30");
  const [retirementAge, setRetirementAge] = useState("65");
  const [currentBalance, setCurrentBalance] = useState("15000");
  const [annualContribution, setAnnualContribution] = useState("7000");
  const [expectedReturn, setExpectedReturn] = useState("7");
  const [currentTaxBracket, setCurrentTaxBracket] = useState("22");
  const [retirementTaxBracket, setRetirementTaxBracket] = useState("15");

  const age = parseInt(currentAge) || 30;
  const retAge = parseInt(retirementAge) || 65;
  const balance = parseFloat(currentBalance) || 0;
  const contribution = parseFloat(annualContribution) || 0;
  const returnRate = (parseFloat(expectedReturn) || 7) / 100;
  const currentTax = (parseFloat(currentTaxBracket) || 22) / 100;
  const retireTax = (parseFloat(retirementTaxBracket) || 15) / 100;

  const years = Math.max(0, retAge - age);
  const maxContrib = age >= 50 ? 8000 : 7000;

  // Year-by-year Roth projection
  const yearlyData: { year: number; age: number; contribution: number; balance: number }[] = [];
  let rothBalance = balance;
  let totalContributions = balance;
  for (let i = 0; i <= years; i++) {
    if (i > 0) {
      rothBalance = rothBalance * (1 + returnRate) + contribution;
      totalContributions += contribution;
    }
    yearlyData.push({
      year: i,
      age: age + i,
      contribution: i === 0 ? balance : contribution,
      balance: rothBalance,
    });
  }

  const rothFinalValue = rothBalance;
  const rothTaxFreeGrowth = rothFinalValue - totalContributions;

  // Traditional IRA comparison
  let tradBalance = balance;
  let tradTotalContrib = balance;
  const tradPreTaxContribution = contribution; // same dollar amount pre-tax
  for (let i = 1; i <= years; i++) {
    tradBalance = tradBalance * (1 + returnRate) + tradPreTaxContribution;
    tradTotalContrib += tradPreTaxContribution;
  }
  const tradAfterTaxValue = tradBalance * (1 - retireTax);
  const rothAfterTaxValue = rothFinalValue; // already tax-free

  // Show only key milestones in the table
  const milestones = yearlyData.filter(
    (d, i) => i === 0 || i === years || d.age % 5 === 0 || d.age === 50 || d.age === 59
  );

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/roth-ira-calculator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Roth IRA Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Estimate your tax-free Roth IRA growth over time. Compare Roth vs Traditional IRA and see year-by-year projections. Updated for 2024 contribution limits.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Current Age</label>
              <input type="number" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} className="input-field" min="18" max="80" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Retirement Age</label>
              <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} className="input-field" min="50" max="90" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Current Roth IRA Balance ($)</label>
              <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} className="input-field" placeholder="15000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Annual Contribution ($)</label>
              <input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(e.target.value)} className="input-field" placeholder="7000" />
              <p className="text-xs text-[var(--muted)] mt-1">
                2024 max: {fmt(maxContrib)} {age >= 50 ? "(50+ catch-up)" : "(under 50)"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expected Annual Return (%)</label>
              <input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} className="input-field" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Current Tax Bracket (%)</label>
              <input type="number" value={currentTaxBracket} onChange={(e) => setCurrentTaxBracket(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Retirement Tax Bracket (%)</label>
              <input type="number" value={retirementTaxBracket} onChange={(e) => setRetirementTaxBracket(e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        {years > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Roth IRA at Retirement</p>
                <p className="text-2xl font-bold text-green-700">{fmt(rothFinalValue)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Contributions</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(totalContributions)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Tax-Free Growth</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(rothTaxFreeGrowth)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Roth vs Traditional IRA Comparison</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left"></th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Roth IRA</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Traditional IRA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total at Retirement</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(rothFinalValue)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(tradBalance)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Taxes in Retirement</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">$0 (tax-free)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">{fmt(tradBalance * retireTax)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Tax on Contributions (now)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">{fmt(contribution * years * currentTax)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">$0 (deductible)</td>
                  </tr>
                  <tr className="bg-green-50 font-bold">
                    <td className="border border-[var(--card-border)] px-3 py-2">After-Tax Value</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(rothAfterTaxValue)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(tradAfterTaxValue)}</td>
                  </tr>
                  <tr className="bg-yellow-50 font-semibold">
                    <td className="border border-[var(--card-border)] px-3 py-2">Roth Advantage</td>
                    <td colSpan={2} className="border border-[var(--card-border)] px-3 py-2 text-center">
                      {rothAfterTaxValue > tradAfterTaxValue
                        ? <span className="text-green-700">Roth wins by {fmt(rothAfterTaxValue - tradAfterTaxValue)}</span>
                        : rothAfterTaxValue < tradAfterTaxValue
                        ? <span className="text-blue-700">Traditional wins by {fmt(tradAfterTaxValue - rothAfterTaxValue)}</span>
                        : <span>Both are equal</span>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Year-by-Year Growth</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Age</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Year</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Roth Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestones.map((d) => (
                      <tr key={d.age} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{d.age}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{d.year}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-medium">{fmt(d.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="result-card mb-6" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
              <h3 className="font-bold mb-2">2024 Roth IRA Income Limits</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Single filers:</strong> Full contribution if MAGI under $146,000. Phase-out $146,000 &ndash; $161,000.</li>
                <li><strong>Married filing jointly:</strong> Full contribution if MAGI under $230,000. Phase-out $230,000 &ndash; $240,000.</li>
                <li><strong>Contribution limit:</strong> $7,000 (under 50) or $8,000 (50 and older, catch-up).</li>
              </ul>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Roth IRA Calculator: Plan Your Tax-Free Retirement</h2>
          <p>
            A Roth IRA is one of the most powerful retirement savings vehicles available to American workers. Unlike a Traditional
            IRA or 401(k), contributions to a Roth IRA are made with after-tax dollars, meaning your money grows completely
            tax-free and withdrawals in retirement are also tax-free. This Roth IRA calculator helps you project how much your
            account will grow over time and compares the after-tax value of a Roth IRA versus a Traditional IRA.
          </p>

          <h2>How Does a Roth IRA Work?</h2>
          <p>
            You contribute money you have already paid income tax on. Inside the Roth IRA, your investments grow without
            being taxed on dividends, interest, or capital gains. When you reach age 59 and a half and your account has been
            open for at least five years, you can withdraw everything — contributions and earnings — completely tax-free.
            This is a significant advantage if you expect to be in a higher tax bracket in retirement or if tax rates
            increase in the future.
          </p>

          <h2>2024 Roth IRA Contribution Limits</h2>
          <p>
            For 2024, the annual Roth IRA contribution limit is $7,000 if you are under 50, or $8,000 if you are 50 or
            older (the extra $1,000 is a catch-up contribution). However, your ability to contribute depends on your
            Modified Adjusted Gross Income (MAGI). Single filers can make a full contribution if their MAGI is below
            $146,000, with contributions phasing out between $146,000 and $161,000. Married couples filing jointly can
            contribute fully with MAGI under $230,000, with phase-out between $230,000 and $240,000.
          </p>

          <h2>Roth IRA vs Traditional IRA</h2>
          <p>
            The key difference is when you pay taxes. With a Traditional IRA, you get a tax deduction now but pay income tax
            on withdrawals in retirement. With a Roth IRA, you pay tax now but enjoy tax-free withdrawals later. The Roth IRA
            is generally better if you expect your tax rate to be higher in retirement than it is today, or if you are young
            and have decades of tax-free growth ahead. The Traditional IRA may be better if you are in a high tax bracket now
            and expect to be in a lower bracket in retirement. This Roth IRA growth calculator shows you both scenarios.
          </p>

          <h2>The Power of Tax-Free Compound Growth</h2>
          <p>
            Compound interest is powerful on its own, but tax-free compound interest is extraordinary. In a taxable account,
            you lose a portion of your gains each year to taxes on dividends and realized capital gains. In a Roth IRA, 100%
            of your gains stay invested and continue compounding. Over 30 or 35 years, the difference can be hundreds of
            thousands of dollars. Starting early is the single most important factor in maximizing your Roth IRA growth.
          </p>

          <h3>Backdoor Roth IRA Strategy</h3>
          <p>
            If your income exceeds the Roth IRA contribution limits, you may still be able to contribute through a Backdoor
            Roth IRA. This involves making a non-deductible contribution to a Traditional IRA and then converting it to a
            Roth IRA. While the IRS allows this strategy, it works best if you have no existing Traditional IRA balances
            due to the pro-rata rule. Consult a tax professional to determine if the Backdoor Roth strategy is appropriate
            for your situation.
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
            name: "Roth IRA Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/roth-ira-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
