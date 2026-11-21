"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "HSA Calculator - Health Savings Account Tax Savings & Growth 2024",
  description:
    "Free HSA calculator. Estimate your Health Savings Account balance at retirement, triple tax savings, and compare with vs without HSA. 2024 contribution limits.",
  keywords:
    "HSA calculator, health savings account calculator, HSA contribution calculator, HSA tax savings, HSA growth calculator, HSA retirement, HSA limits 2024, triple tax advantage",
};

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const HSA_LIMITS = {
  self: 4150,
  family: 8300,
  catchUp: 1000,
};

export default function HsaCalculatorPage() {
  const [coverageType, setCoverageType] = useState("self");
  const [annualContribution, setAnnualContribution] = useState("3000");
  const [employerContribution, setEmployerContribution] = useState("500");
  const [currentBalance, setCurrentBalance] = useState("5000");
  const [annualMedicalExpenses, setAnnualMedicalExpenses] = useState("1500");
  const [yearsToRetirement, setYearsToRetirement] = useState("25");
  const [expectedReturn, setExpectedReturn] = useState("7");
  const [taxBracket, setTaxBracket] = useState("22");
  const [isCatchUp, setIsCatchUp] = useState(false);

  const contribution = parseFloat(annualContribution) || 0;
  const employer = parseFloat(employerContribution) || 0;
  const balance = parseFloat(currentBalance) || 0;
  const medExpenses = parseFloat(annualMedicalExpenses) || 0;
  const years = parseInt(yearsToRetirement) || 0;
  const returnRate = (parseFloat(expectedReturn) || 7) / 100;
  const taxRate = (parseFloat(taxBracket) || 22) / 100;

  const maxContrib = coverageType === "family" ? HSA_LIMITS.family : HSA_LIMITS.self;
  const totalMaxContrib = maxContrib + (isCatchUp ? HSA_LIMITS.catchUp : 0);
  const totalAnnualContrib = Math.min(contribution + employer, totalMaxContrib);

  // Projected HSA balance at retirement
  const yearlyData: { year: number; contribution: number; growth: number; balance: number }[] = [];
  let projectedBalance = balance;
  let totalContributions = balance;
  let totalGrowth = 0;

  for (let i = 1; i <= years; i++) {
    const growth = projectedBalance * returnRate;
    projectedBalance = projectedBalance + growth + totalAnnualContrib;
    totalContributions += totalAnnualContrib;
    totalGrowth += growth;
    yearlyData.push({
      year: i,
      contribution: totalAnnualContrib,
      growth: Math.round(growth),
      balance: Math.round(projectedBalance),
    });
  }

  // Tax savings calculations
  const annualContribTaxSavings = contribution * taxRate; // employee contribution tax savings
  const totalContribTaxSavings = annualContribTaxSavings * years;
  const growthTaxSavings = totalGrowth * taxRate; // tax on growth avoided
  const withdrawalTaxSavings = medExpenses * years * taxRate; // tax-free medical spending
  const totalTaxSavings = totalContribTaxSavings + growthTaxSavings + withdrawalTaxSavings;

  // With vs without HSA comparison
  const withoutHsaBalance = balance;
  let taxableBalance = withoutHsaBalance;
  for (let i = 1; i <= years; i++) {
    const growth = taxableBalance * returnRate;
    const afterTaxGrowth = growth * (1 - taxRate);
    taxableBalance = taxableBalance + afterTaxGrowth + totalAnnualContrib * (1 - taxRate);
  }

  // Milestones for table
  const milestones = yearlyData.filter(
    (d, i) => i === 0 || i === years - 1 || d.year % 5 === 0 || d.year === 10
  );

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/us-hsa-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="/tools/us-hsa-calculator" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">HSA Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Estimate your Health Savings Account balance at retirement, calculate triple tax savings, and compare HSA vs taxable investing. Updated for 2024 limits.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Coverage Type</label>
              <select value={coverageType} onChange={(e) => setCoverageType(e.target.value)} className="input-field">
                <option value="self">Self-Only</option>
                <option value="family">Family</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Your Annual Contribution ($)</label>
              <input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(e.target.value)} className="input-field" placeholder="3000" />
              <p className="text-xs text-[var(--muted)] mt-1">2024 max: {fmt(totalMaxContrib)} (incl. employer)</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Employer Contribution ($)</label>
              <input type="number" value={employerContribution} onChange={(e) => setEmployerContribution(e.target.value)} className="input-field" placeholder="500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Current HSA Balance ($)</label>
              <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} className="input-field" placeholder="5000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Annual Medical Expenses ($)</label>
              <input type="number" value={annualMedicalExpenses} onChange={(e) => setAnnualMedicalExpenses(e.target.value)} className="input-field" placeholder="1500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Years Until Retirement</label>
              <input type="number" value={yearsToRetirement} onChange={(e) => setYearsToRetirement(e.target.value)} className="input-field" min="1" max="50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expected Annual Return (%)</label>
              <input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} className="input-field" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tax Bracket (%)</label>
              <input type="number" value={taxBracket} onChange={(e) => setTaxBracket(e.target.value)} className="input-field" />
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" id="catchUp" checked={isCatchUp} onChange={(e) => setIsCatchUp(e.target.checked)} className="rounded" />
              <label htmlFor="catchUp" className="text-sm font-medium">Age 55+ catch-up contribution (+$1,000)</label>
            </div>
          </div>
        </div>

        {years > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">HSA Balance at Retirement</p>
                <p className="text-2xl font-bold text-green-700">{fmt(Math.round(projectedBalance))}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Tax Savings</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(Math.round(totalTaxSavings))}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Tax-Free Growth</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(Math.round(totalGrowth))}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Triple Tax Advantage Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Tax Benefit</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annual Savings</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Over {years} Years</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">1. Tax-Free Contributions</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(Math.round(annualContribTaxSavings))}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(Math.round(totalContribTaxSavings))}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">2. Tax-Free Growth</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">varies</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(Math.round(growthTaxSavings))}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">3. Tax-Free Withdrawals (medical)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(Math.round(medExpenses * taxRate))}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(Math.round(withdrawalTaxSavings))}</td>
                  </tr>
                  <tr className="bg-green-50 font-bold">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Tax Savings</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right"></td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(Math.round(totalTaxSavings))}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">HSA vs Taxable Account Comparison</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left"></th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">HSA</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Taxable Account</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Contributions</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(Math.round(totalContributions))}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(Math.round(totalContributions * (1 - taxRate)))}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Balance at Retirement</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-medium">{fmt(Math.round(projectedBalance))}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-medium">{fmt(Math.round(taxableBalance))}</td>
                  </tr>
                  <tr className="bg-yellow-50 font-semibold">
                    <td className="border border-[var(--card-border)] px-3 py-2">HSA Advantage</td>
                    <td colSpan={2} className="border border-[var(--card-border)] px-3 py-2 text-center text-green-700">
                      {fmt(Math.round(projectedBalance - taxableBalance))} more with HSA
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Projected Growth</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Year</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Contribution</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Growth</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestones.map((d) => (
                      <tr key={d.year} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{d.year}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(d.contribution)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(d.growth)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-medium">{fmt(d.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="result-card mb-6" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
              <h3 className="font-bold mb-2">2024 HSA Contribution Limits</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Self-only coverage:</strong> $4,150</li>
                <li><strong>Family coverage:</strong> $8,300</li>
                <li><strong>Catch-up (age 55+):</strong> Additional $1,000</li>
                <li><strong>Includes employer contributions</strong> toward the limit</li>
              </ul>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>HSA Calculator: Plan Your Health Savings Account</h2>
          <p>
            A Health Savings Account (HSA) is one of the most tax-advantaged accounts available in the United States. Often called the &#34;stealth IRA,&#34; an HSA offers a triple tax advantage that no other account can match: contributions are tax-deductible, growth is tax-free, and withdrawals for qualified medical expenses are tax-free. This HSA calculator helps you project your account balance at retirement and shows exactly how much you save in taxes by using an HSA instead of a regular taxable investment account.
          </p>

          <h2>The Triple Tax Advantage Explained</h2>
          <p>
            The HSA&#39;s triple tax advantage makes it uniquely powerful. First, your contributions reduce your taxable income. If you contribute $4,150 and are in the 22 percent tax bracket, you save $913 in federal taxes that year. Second, any investment growth inside the HSA is completely tax-free — no capital gains tax, no dividend tax, no interest tax. Third, when you withdraw money for qualified medical expenses, those withdrawals are also tax-free. No other account in the US tax code offers all three benefits simultaneously.
          </p>

          <h2>2024 HSA Contribution Limits</h2>
          <p>
            For 2024, the IRS allows individuals with self-only high-deductible health plan (HDHP) coverage to contribute up to $4,150 to an HSA. Those with family HDHP coverage can contribute up to $8,300. If you are age 55 or older, you can make an additional $1,000 catch-up contribution. These limits include any employer contributions. To be eligible for an HSA, you must be enrolled in a qualifying HDHP with a minimum deductible of $1,600 for self-only coverage or $3,200 for family coverage.
          </p>

          <h2>HSA as a Retirement Savings Tool</h2>
          <p>
            Many financial advisors recommend using an HSA as a supplemental retirement account. If you can afford to pay current medical expenses out of pocket and let your HSA grow, the account becomes an incredibly powerful retirement tool. After age 65, you can withdraw HSA funds for any purpose — not just medical expenses — and you will only pay ordinary income tax on non-medical withdrawals, similar to a traditional IRA. For medical withdrawals at any age, the funds remain completely tax-free. This flexibility makes the HSA potentially even more valuable than a Roth IRA.
          </p>

          <h2>Investing Your HSA Funds</h2>
          <p>
            Most HSA providers offer investment options beyond a simple savings account. Once your balance exceeds a minimum threshold (typically $1,000 to $2,000), you can invest in mutual funds, index funds, and ETFs. By investing your HSA in a diversified portfolio of low-cost index funds and letting it grow for decades, you can accumulate a substantial tax-free nest egg. The HSA calculator above models this investment growth to show you the projected balance at retirement.
          </p>

          <h3>HSA vs FSA: Key Differences</h3>
          <p>
            An HSA should not be confused with a Flexible Spending Account (FSA). While both offer tax-free medical spending, there are critical differences. An HSA is portable and stays with you if you change jobs. HSA funds roll over indefinitely — there is no use-it-or-lose-it rule. HSA funds can be invested for long-term growth. An FSA, by contrast, is typically use-it-or-lose-it (with a possible $640 carryover), cannot be invested, and does not follow you when you leave your employer. For long-term savings, the HSA is far superior.
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
            name: "HSA Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/us-hsa-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
