"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "401k Calculator - Estimate Your Retirement Savings",
  description:
    "Free 401k calculator to estimate your retirement savings with employer match, annual raises, and investment growth. See a year-by-year breakdown of contributions and returns.",
  keywords:
    "401k calculator, retirement calculator, 401k savings calculator, retirement savings, 401k employer match, retirement planning, 401k growth calculator",
};

export default function Calculator401kPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [currentAge, setCurrentAge] = useState<string>("30");
  const [retirementAge, setRetirementAge] = useState<string>("65");
  const [currentBalance, setCurrentBalance] = useState<string>("25000");
  const [annualSalary, setAnnualSalary] = useState<string>("65000");
  const [contributionPct, setContributionPct] = useState<string>("10");
  const [employerMatchPct, setEmployerMatchPct] = useState<string>("50");
  const [employerMatchLimit, setEmployerMatchLimit] = useState<string>("6");
  const [annualRaisePct, setAnnualRaisePct] = useState<string>("3");
  const [expectedReturnPct, setExpectedReturnPct] = useState<string>("7");

  const age = parseInt(currentAge) || 30;
  const retAge = parseInt(retirementAge) || 65;
  const balance = parseFloat(currentBalance) || 0;
  const salary = parseFloat(annualSalary) || 0;
  const contribPct = parseFloat(contributionPct) || 0;
  const matchPct = parseFloat(employerMatchPct) || 0;
  const matchLimit = parseFloat(employerMatchLimit) || 0;
  const raisePct = parseFloat(annualRaisePct) || 0;
  const returnPct = parseFloat(expectedReturnPct) || 0;

  const years = Math.max(0, retAge - age);

  const yearlyData: {
    year: number;
    age: number;
    salary: number;
    yourContrib: number;
    employerContrib: number;
    growth: number;
    balance: number;
  }[] = [];

  let runningBalance = balance;
  let runningSalary = salary;
  let totalYourContribs = 0;
  let totalEmployerContribs = 0;

  for (let i = 0; i < years; i++) {
    const yourContrib = runningSalary * (contribPct / 100);
    const matchableContrib = Math.min(contribPct, matchLimit);
    const employerContrib = runningSalary * (matchableContrib / 100) * (matchPct / 100);

    const startBal = runningBalance;
    runningBalance += yourContrib + employerContrib;
    const growth = runningBalance * (returnPct / 100);
    runningBalance += growth;

    totalYourContribs += yourContrib;
    totalEmployerContribs += employerContrib;

    yearlyData.push({
      year: i + 1,
      age: age + i + 1,
      salary: runningSalary,
      yourContrib,
      employerContrib,
      growth,
      balance: runningBalance,
    });

    runningSalary *= 1 + raisePct / 100;
  }

  const totalGrowth = runningBalance - balance - totalYourContribs - totalEmployerContribs;

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  const [showAllYears, setShowAllYears] = useState(false);
  const displayData = showAllYears ? yearlyData : yearlyData.slice(0, 10);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/401k-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">401k Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Estimate how much your 401k will be worth at retirement. Factor in employer match, annual salary raises, and expected investment returns.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Current Age</label>
              <input type="number" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} className="input-field" min="18" max="80" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Retirement Age</label>
              <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} className="input-field" min="18" max="80" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Current 401k Balance ({currency.symbol})</label>
              <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} className="input-field" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Annual Salary ({currency.symbol})</label>
              <input type="number" value={annualSalary} onChange={(e) => setAnnualSalary(e.target.value)} className="input-field" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Your Contribution (%)</label>
              <input type="number" value={contributionPct} onChange={(e) => setContributionPct(e.target.value)} className="input-field" min="0" max="100" step="0.5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Employer Match (% of your contribution)</label>
              <input type="number" value={employerMatchPct} onChange={(e) => setEmployerMatchPct(e.target.value)} className="input-field" min="0" max="100" step="1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Employer Match Limit (% of salary)</label>
              <input type="number" value={employerMatchLimit} onChange={(e) => setEmployerMatchLimit(e.target.value)} className="input-field" min="0" max="100" step="0.5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Annual Salary Raise (%)</label>
              <input type="number" value={annualRaisePct} onChange={(e) => setAnnualRaisePct(e.target.value)} className="input-field" min="0" step="0.5" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Expected Annual Return (%)</label>
              <input type="number" value={expectedReturnPct} onChange={(e) => setExpectedReturnPct(e.target.value)} className="input-field" min="0" step="0.5" />
            </div>
          </div>
        </div>

        {years > 0 && salary > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total at Retirement</p>
                <p className="text-2xl font-bold text-green-700">{fmt(runningBalance)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Your Contributions</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(totalYourContribs)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Employer Contributions</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(totalEmployerContribs)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#faf5ff", borderColor: "#e9d5ff" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Investment Growth</p>
                <p className="text-2xl font-bold text-purple-700">{fmt(totalGrowth)}</p>
              </div>
            </div>

            <div className="tool-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Year-by-Year Breakdown</h2>
                {yearlyData.length > 10 && (
                  <button onClick={() => setShowAllYears(!showAllYears)} className="text-sm text-[var(--primary)] hover:underline">
                    {showAllYears ? "Show First 10" : `Show All ${yearlyData.length}`}
                  </button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Year</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Age</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Salary</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Your Contrib</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Employer</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Growth</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((row) => (
                      <tr key={row.year} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{row.year}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{row.age}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.salary)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.yourContrib)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.employerContrib)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.growth)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(row.balance)}</td>
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
          <h2>How Does a 401k Work?</h2>
          <p>
            A 401k is an employer-sponsored retirement savings plan that allows you to contribute a portion of your
            pre-tax salary. Your contributions grow tax-deferred until you withdraw them in retirement. Many employers
            offer matching contributions, which is essentially free money for your retirement.
          </p>

          <h2>2024 Contribution Limits</h2>
          <p>
            For 2024, you can contribute up to $23,000 to your 401k. If you are 50 or older, you can make an additional
            catch-up contribution of $7,500, bringing your total limit to $30,500. The total limit including employer
            contributions is $69,000 (or $76,500 with catch-up).
          </p>

          <h2>Employer Match</h2>
          <p>
            A common employer match is 50% of your contributions up to 6% of your salary. This means if you earn $65,000
            and contribute 6% ($3,900), your employer adds $1,950. Always contribute at least enough to get the full
            employer match — it is an instant 50% return on your investment.
          </p>

          <h3>The Power of Compound Growth</h3>
          <p>
            Starting early makes a massive difference due to compound growth. A 25-year-old who invests $500/month at 7%
            annual returns will have about $1.2 million by age 65. Waiting until 35 to start the same contributions
            results in only about $567,000 — less than half.
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
            name: "401k Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/401k-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
