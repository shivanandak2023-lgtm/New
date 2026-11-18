"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "UK Pension Calculator - Retirement Savings Estimator 2024-25",
  description:
    "Free UK pension calculator. Project your retirement pot with employer contributions, investment growth, and state pension. See year-by-year growth and combined retirement income.",
  keywords:
    "pension calculator UK, retirement calculator UK, pension pot calculator, state pension calculator, workplace pension calculator, UK pension forecast, retirement planning UK",
};

const STATE_PENSION_FULL = 11502; // 2024-25 full new state pension annual amount

interface YearRow {
  year: number;
  age: number;
  yourContribution: number;
  employerContribution: number;
  growth: number;
  potValue: number;
}

export default function UKPensionPage() {
  const [currentAge, setCurrentAge] = useState<string>("30");
  const [retirementAge, setRetirementAge] = useState<string>("67");
  const [currentPot, setCurrentPot] = useState<string>("25000");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("300");
  const [employerPercent, setEmployerPercent] = useState<string>("5");
  const [annualReturn, setAnnualReturn] = useState<string>("5");
  const [showYearTable, setShowYearTable] = useState(false);
  const [result, setResult] = useState<{
    projectedPot: number;
    totalYourContributions: number;
    totalEmployerContributions: number;
    totalGrowth: number;
    statePension: number;
    combinedAnnualIncome: number;
    yearlyBreakdown: YearRow[];
  } | null>(null);

  function calculate() {
    const age = parseInt(currentAge);
    const retAge = parseInt(retirementAge);
    const pot = parseFloat(currentPot) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const employerPct = parseFloat(employerPercent) || 0;
    const returnRate = parseFloat(annualReturn) || 0;

    if (!age || !retAge || age >= retAge || age < 16 || retAge > 75) return;

    const years = retAge - age;
    const monthlyReturn = returnRate / 100 / 12;
    const monthlyEmployer = monthly * (employerPct / 100) / (100 / 100); // employer pct of salary - simplified as % of your contribution
    // Employer contribution as a percentage of your monthly contribution
    const employerMonthly = monthly * (employerPct / 100);

    let currentPotValue = pot;
    let totalYours = 0;
    let totalEmployer = 0;
    let totalGrowth = 0;
    const yearlyBreakdown: YearRow[] = [];

    for (let y = 1; y <= years; y++) {
      let yearYours = 0;
      let yearEmployer = 0;
      let yearGrowth = 0;

      for (let m = 0; m < 12; m++) {
        const growthThisMonth = currentPotValue * monthlyReturn;
        currentPotValue += growthThisMonth;
        currentPotValue += monthly;
        currentPotValue += employerMonthly;

        yearYours += monthly;
        yearEmployer += employerMonthly;
        yearGrowth += growthThisMonth;
      }

      totalYours += yearYours;
      totalEmployer += yearEmployer;
      totalGrowth += yearGrowth;

      yearlyBreakdown.push({
        year: y,
        age: age + y,
        yourContribution: yearYours,
        employerContribution: yearEmployer,
        growth: yearGrowth,
        potValue: currentPotValue,
      });
    }

    // 4% drawdown rule for annual pension income estimate from pot
    const annualFromPot = currentPotValue * 0.04;

    setResult({
      projectedPot: currentPotValue,
      totalYourContributions: totalYours,
      totalEmployerContributions: totalEmployer,
      totalGrowth: totalGrowth,
      statePension: STATE_PENSION_FULL,
      combinedAnnualIncome: annualFromPot + STATE_PENSION_FULL,
      yearlyBreakdown,
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
      <link rel="canonical" href={`${SITE_URL}/tools/uk-pension`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/uk-pension`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">UK Pension Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Estimate your pension pot at retirement including your contributions, employer contributions, and investment growth.
          See how the UK State Pension combines with your workplace pension for total retirement income.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                className="input-field"
                placeholder="e.g., 30"
                min="16"
                max="74"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Retirement Age</label>
              <select
                value={retirementAge}
                onChange={(e) => setRetirementAge(e.target.value)}
                className="input-field"
              >
                <option value="55">55</option>
                <option value="57">57</option>
                <option value="60">60</option>
                <option value="65">65</option>
                <option value="66">66</option>
                <option value="67">67 (Current State Pension age)</option>
                <option value="68">68 (Future State Pension age)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Current Pension Pot (&pound;)</label>
              <input
                type="number"
                value={currentPot}
                onChange={(e) => setCurrentPot(e.target.value)}
                className="input-field"
                placeholder="e.g., 25000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Your Monthly Contribution (&pound;)</label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="input-field"
                placeholder="e.g., 300"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Employer Contribution (% of your contribution)</label>
              <input
                type="number"
                value={employerPercent}
                onChange={(e) => setEmployerPercent(e.target.value)}
                className="input-field"
                placeholder="e.g., 5"
                min="0"
                max="200"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Expected Annual Return (%)</label>
              <input
                type="number"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
                className="input-field"
                placeholder="e.g., 5"
                min="0"
                max="20"
                step="0.5"
              />
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Pension
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Projected Pension Pot</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.projectedPot)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Combined Annual Income</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.combinedAnnualIncome)}</p>
                <p className="text-xs text-[var(--muted)]">(4% drawdown + State Pension)</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Contributions Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Starting Pot</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(parseFloat(currentPot) || 0)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Your Total Contributions</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.totalYourContributions)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Employer Total Contributions</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.totalEmployerContributions)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Investment Growth</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-green-600">{fmt(result.totalGrowth)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Projected Pension Pot</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(result.projectedPot)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Retirement Income Estimate</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Annual Income from Pot (4% drawdown)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.projectedPot * 0.04)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Full State Pension (2024-25)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(STATE_PENSION_FULL)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Combined Annual Income</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(result.combinedAnnualIncome)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Combined Monthly Income</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.combinedAnnualIncome / 12)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tool-card overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Year-by-Year Growth</h2>
                <button
                  onClick={() => setShowYearTable(!showYearTable)}
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  {showYearTable ? "Hide Table" : "Show Table"}
                </button>
              </div>

              {showYearTable && (
                <>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-[var(--muted-bg)]">
                        <th className="border border-[var(--card-border)] px-3 py-2 text-left">Year</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Age</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Your Contrib.</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Employer Contrib.</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Growth</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Pot Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlyBreakdown.slice(0, 50).map((row) => (
                        <tr key={row.year} className="hover:bg-[var(--muted-bg)]">
                          <td className="border border-[var(--card-border)] px-3 py-2">{row.year}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{row.age}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.yourContribution)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.employerContribution)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-600">{fmt(row.growth)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(row.potValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.yearlyBreakdown.length > 50 && (
                    <p className="text-sm text-[var(--muted)] mt-3 text-center">
                      Showing first 50 of {result.yearlyBreakdown.length} years
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does a UK Pension Calculator Work?</h2>
          <p>
            This pension calculator UK tool projects your retirement savings by modelling monthly contributions from both
            you and your employer, plus compound investment returns over the years until retirement. It helps you plan how
            much you need to save for a comfortable retirement.
          </p>

          <h2>UK State Pension 2024-25</h2>
          <p>
            The full new State Pension for 2024-25 is &pound;11,502 per year (&pound;221.20 per week). To qualify for the full
            amount, you need 35 qualifying years of National Insurance contributions. You can receive a partial State Pension
            with at least 10 qualifying years.
          </p>

          <h3>State Pension Age</h3>
          <ul>
            <li><strong>Current:</strong> 66 for both men and women</li>
            <li><strong>Rising to 67:</strong> Between 2026 and 2028</li>
            <li><strong>Rising to 68:</strong> Between 2044 and 2046 (under review)</li>
          </ul>

          <h2>Workplace Pensions (Auto-Enrolment)</h2>
          <p>
            Under auto-enrolment, most UK employers must enrol eligible workers into a workplace pension. The minimum
            contribution is 8% of qualifying earnings, with at least 3% from the employer and 5% from the employee.
            Many employers offer more generous matching schemes.
          </p>

          <h2>The 4% Rule</h2>
          <p>
            The 4% drawdown rule is a commonly used guideline for retirement income. It suggests you can withdraw 4%
            of your pension pot each year in retirement, with adjustments for inflation, without running out of money
            over a 30-year retirement. This retirement calculator UK tool uses this rule for income estimates.
          </p>

          <h3>Tips to Boost Your Pension</h3>
          <ul>
            <li>Start saving as early as possible to maximise compound growth</li>
            <li>Increase contributions when you receive a pay rise</li>
            <li>Maximise employer matching to get &ldquo;free money&rdquo;</li>
            <li>Review your pension investments regularly</li>
            <li>Consider salary sacrifice for tax-efficient contributions</li>
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
            name: "UK Pension Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/uk-pension`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          }),
        }}
      />
    </>
  );
}
