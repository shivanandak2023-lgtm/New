"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "KiwiSaver Calculator NZ 2024",
  description:
    "Free KiwiSaver retirement calculator for New Zealand. Project your KiwiSaver balance at 65 with employee contributions, employer contributions, government contribution, and investment returns.",
  keywords:
    "KiwiSaver calculator NZ, KiwiSaver retirement calculator, KiwiSaver balance calculator, NZ retirement calculator, KiwiSaver contribution calculator, KiwiSaver projections",
};

interface YearRow {
  age: number;
  yourContrib: number;
  employerContrib: number;
  govtContrib: number;
  returns: number;
  balance: number;
}

interface KiwiResult {
  projectedBalance: number;
  totalYourContributions: number;
  totalEmployerContributions: number;
  totalGovtContributions: number;
  totalReturns: number;
  yearByYear: YearRow[];
}

export default function NZKiwiSaverPage() {
  const [age, setAge] = useState<string>("30");
  const [salary, setSalary] = useState<string>("70000");
  const [kiwiRate, setKiwiRate] = useState<string>("3");
  const [employerRate] = useState<string>("3");
  const [returnRate, setReturnRate] = useState<string>("5");
  const [result, setResult] = useState<KiwiResult | null>(null);

  function calculate() {
    const currentAge = parseInt(age);
    const annualSalary = parseFloat(salary);
    const kRate = parseFloat(kiwiRate) / 100;
    const eRate = parseFloat(employerRate) / 100;
    const rRate = parseFloat(returnRate) / 100;
    const govtAnnual = 521.43;

    if (!currentAge || !annualSalary || currentAge >= 65 || currentAge < 18 || annualSalary <= 0) return;

    const yearsToRetirement = 65 - currentAge;
    let balance = 0;
    let totalYour = 0;
    let totalEmployer = 0;
    let totalGovt = 0;
    let totalReturns = 0;
    const rows: YearRow[] = [];

    for (let i = 0; i < yearsToRetirement; i++) {
      const yourContrib = annualSalary * kRate;
      const employerContrib = annualSalary * eRate;
      const govtContrib = govtAnnual;
      const yearReturn = balance * rRate;

      balance += yourContrib + employerContrib + govtContrib + yearReturn;
      totalYour += yourContrib;
      totalEmployer += employerContrib;
      totalGovt += govtContrib;
      totalReturns += yearReturn;

      rows.push({
        age: currentAge + i + 1,
        yourContrib,
        employerContrib,
        govtContrib,
        returns: yearReturn,
        balance,
      });
    }

    setResult({
      projectedBalance: balance,
      totalYourContributions: totalYour,
      totalEmployerContributions: totalEmployer,
      totalGovtContributions: totalGovt,
      totalReturns: totalReturns,
      yearByYear: rows,
    });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/nz-kiwisaver-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/nz-kiwisaver-calculator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">New Zealand KiwiSaver Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Project your KiwiSaver balance at age 65 with employee contributions, employer contributions (3%), government contributions ($521.43/yr), and investment returns.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Your Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="input-field"
                placeholder="e.g., 30"
                min="18"
                max="64"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Annual Salary (NZ$)</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="input-field"
                placeholder="e.g., 70000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">KiwiSaver Contribution Rate</label>
              <select
                value={kiwiRate}
                onChange={(e) => setKiwiRate(e.target.value)}
                className="input-field"
              >
                <option value="3">3%</option>
                <option value="4">4%</option>
                <option value="6">6%</option>
                <option value="8">8%</option>
                <option value="10">10%</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Expected Annual Return (%)</label>
              <input
                type="number"
                value={returnRate}
                onChange={(e) => setReturnRate(e.target.value)}
                className="input-field"
                placeholder="e.g., 5"
                min="0"
                max="20"
                step="0.5"
              />
            </div>
          </div>

          <p className="text-xs text-[var(--muted)] mt-3">Employer contribution fixed at 3%. Government contribution $521.43/year (max).</p>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate KiwiSaver
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Projected Balance at 65</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.projectedBalance)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Your Contributions</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmt(result.totalYourContributions)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Employer Contributions</p>
                <p className="text-xl font-bold">{fmt(result.totalEmployerContributions)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Government Contributions</p>
                <p className="text-xl font-bold">{fmt(result.totalGovtContributions)}</p>
              </div>
            </div>

            <div className="result-card text-center mb-6">
              <p className="text-sm text-[var(--muted)] mb-1">Total Investment Returns</p>
              <p className="text-xl font-bold text-green-700">{fmt(result.totalReturns)}</p>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Year-by-Year Projection</h2>
              <div className="overflow-x-auto" style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0">
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Age</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Your Contribution</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Employer</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Govt</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Returns</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearByYear.map((row, i) => (
                      <tr key={i} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{row.age}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(row.yourContrib)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(row.employerContrib)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(row.govtContrib)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(row.returns)}</td>
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
          <h2>What Is KiwiSaver?</h2>
          <p>
            KiwiSaver is New Zealand&apos;s voluntary, work-based retirement savings scheme. Introduced in 2007, it helps New Zealanders
            save for retirement through regular contributions from their salary, matched by employer contributions and an annual
            government contribution. This KiwiSaver calculator NZ tool helps you project how much your KiwiSaver balance could grow
            by the time you reach the age of eligibility at 65.
          </p>

          <h2>How Do KiwiSaver Contributions Work?</h2>
          <p>
            As a KiwiSaver member, you choose your contribution rate from 3%, 4%, 6%, 8%, or 10% of your before-tax salary. Your
            employer is required to contribute a minimum of 3% of your gross salary. These contributions are deducted from your pay
            and sent to your chosen KiwiSaver fund provider, who invests the money on your behalf. This KiwiSaver retirement calculator
            models all three contribution sources to give you a comprehensive projection.
          </p>

          <h2>Government Contributions to KiwiSaver</h2>
          <p>
            The New Zealand government provides an annual Member Tax Credit (MTC) of up to $521.43 per year to eligible KiwiSaver
            members. To receive the maximum government contribution, you need to contribute at least $1,042.86 during the KiwiSaver
            year (1 July to 30 June). The government matches 50 cents for every dollar you contribute, up to the annual cap. Members
            aged 18 to 64 who are normally resident in New Zealand are eligible.
          </p>

          <h2>Choosing the Right KiwiSaver Fund</h2>
          <p>
            KiwiSaver funds range from conservative to aggressive, each with different expected returns and risk levels. Conservative
            funds invest mainly in bonds and cash, typically returning 3-5% per year. Balanced funds mix bonds and shares, targeting
            5-7% returns. Growth and aggressive funds invest heavily in shares, potentially returning 7-10% but with more volatility.
            Your choice should consider your age, risk tolerance, and years until retirement.
          </p>

          <h2>When Can You Access Your KiwiSaver?</h2>
          <p>
            You can generally access your KiwiSaver savings when you turn 65, or after you have been a member for at least five
            years, whichever is later. Early withdrawal is possible in limited circumstances: purchasing your first home, significant
            financial hardship, serious illness, or permanent emigration from New Zealand (excluding Australia). The first home
            withdrawal allows you to withdraw all your contributions and returns, but not the government contributions.
          </p>

          <h2>How to Maximize Your KiwiSaver Balance</h2>
          <p>
            To get the most from KiwiSaver, contribute at least $1,042.86 per year to receive the full government contribution.
            Consider increasing your contribution rate from the minimum 3% to 4%, 6%, 8%, or 10% if you can afford it. Starting
            early makes a huge difference due to compound returns. A 25-year-old contributing 3% of a $60,000 salary could accumulate
            significantly more than someone who starts at 40 with the same salary, thanks to decades of additional compound growth.
            Use this calculator to compare different scenarios and find the right strategy for your retirement goals.
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
            name: "KiwiSaver Calculator NZ",
            description: META.description,
            url: `${SITE_URL}/tools/nz-kiwisaver-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "NZD" },
          }),
        }}
      />
    </>
  );
}
