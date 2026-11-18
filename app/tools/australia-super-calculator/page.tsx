"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Superannuation Calculator Australia - Project Your Super Balance",
  description:
    "Free Australian superannuation calculator to project your retirement super balance. Includes employer contributions (11.5% for 2024-25), personal contributions, and investment growth projections.",
  keywords:
    "superannuation calculator Australia, super calculator, retirement calculator Australia, super balance projection, employer super contribution, super guarantee 11.5%",
};

interface YearRow {
  year: number;
  age: number;
  openingBalance: number;
  employerContrib: number;
  personalContrib: number;
  growth: number;
  closingBalance: number;
}

export default function AustraliaSuperCalculatorPage() {
  const [currentAge, setCurrentAge] = useState<string>("30");
  const [retirementAge, setRetirementAge] = useState<string>("67");
  const [currentBalance, setCurrentBalance] = useState<string>("50000");
  const [annualSalary, setAnnualSalary] = useState<string>("85000");
  const [employerRate, setEmployerRate] = useState<string>("11.5");
  const [personalContrib, setPersonalContrib] = useState<string>("2000");
  const [returnRate, setReturnRate] = useState<string>("7");

  const age = parseInt(currentAge) || 30;
  const retAge = parseInt(retirementAge) || 67;
  const balance = parseFloat(currentBalance) || 0;
  const salary = parseFloat(annualSalary) || 0;
  const empRate = (parseFloat(employerRate) || 11.5) / 100;
  const personal = parseFloat(personalContrib) || 0;
  const ret = (parseFloat(returnRate) || 7) / 100;

  const years = Math.max(0, retAge - age);
  const rows: YearRow[] = [];
  let runningBalance = balance;
  let totalEmployer = 0;
  let totalPersonal = 0;
  let totalGrowth = 0;

  for (let i = 0; i < years; i++) {
    const opening = runningBalance;
    const emp = salary * empRate;
    const pers = personal;
    const growth = (opening + emp + pers) * ret;
    const closing = opening + emp + pers + growth;
    totalEmployer += emp;
    totalPersonal += pers;
    totalGrowth += growth;
    rows.push({
      year: i + 1,
      age: age + i + 1,
      openingBalance: opening,
      employerContrib: emp,
      personalContrib: pers,
      growth,
      closingBalance: closing,
    });
    runningBalance = closing;
  }

  const projectedBalance = runningBalance;
  const totalContributions = totalEmployer + totalPersonal + balance;

  const fmt = (n: number) => "A$" + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const fmt2 = (n: number) => "A$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/australia-super-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/australia-super-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Superannuation Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Project your Australian superannuation balance at retirement. Includes employer contributions, personal contributions, and investment growth.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Current Age</label>
              <input type="number" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} className="input-field" min="18" max="70" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Retirement Age</label>
              <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} className="input-field" min="60" max="75" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Current Super Balance (A$)</label>
              <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} className="input-field" placeholder="50000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Annual Salary (A$)</label>
              <input type="number" value={annualSalary} onChange={(e) => setAnnualSalary(e.target.value)} className="input-field" placeholder="85000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Employer Contribution Rate (%)</label>
              <input type="number" value={employerRate} onChange={(e) => setEmployerRate(e.target.value)} className="input-field" step="0.5" placeholder="11.5" />
              <p className="text-xs text-[var(--muted)] mt-1">Super Guarantee: 11.5% for 2024-25</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Annual Personal Contribution (A$)</label>
              <input type="number" value={personalContrib} onChange={(e) => setPersonalContrib(e.target.value)} className="input-field" placeholder="2000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expected Annual Return (%)</label>
              <input type="number" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} className="input-field" step="0.5" placeholder="7" />
            </div>
          </div>
        </div>

        {years > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Projected Balance at {retAge}</p>
                <p className="text-2xl font-bold text-green-700">{fmt(projectedBalance)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Contributions</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(totalContributions)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Employer Contributions</p>
                <p className="text-2xl font-bold text-blue-700">{fmt(totalEmployer)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Investment Growth</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(totalGrowth)}</p>
              </div>
            </div>

            <div className="tool-card overflow-x-auto">
              <h2 className="text-lg font-bold mb-4">Year-by-Year Projection</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Year</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Age</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Opening</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Employer</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Personal</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Growth</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Closing</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.year} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{r.year}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2">{r.age}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(r.openingBalance)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt2(r.employerContrib)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt2(r.personalContrib)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt2(r.growth)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(r.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is Superannuation?</h2>
          <p>
            Superannuation (super) is Australia&apos;s compulsory retirement savings system. Employers must contribute a minimum percentage of your ordinary time earnings into a super fund. For 2024-25, the Super Guarantee rate is 11.5%, increasing to 12% from July 2025.
          </p>
          <h2>Employer vs Personal Contributions</h2>
          <p>
            Employer contributions are compulsory under the Super Guarantee. Personal (voluntary) contributions can be made as salary sacrifice (pre-tax) or after-tax contributions. The concessional contributions cap is $30,000 per year for 2024-25, which includes employer and salary sacrifice contributions.
          </p>
          <h2>Investment Returns</h2>
          <p>
            Super funds invest your money across various asset classes. Historical average returns for a balanced fund are around 7-8% per year over the long term, though past performance doesn&apos;t guarantee future results. Fees and tax within the fund (typically 15%) affect net returns.
          </p>
          <h3>When Can You Access Super?</h3>
          <p>
            You can generally access your super when you reach your preservation age (between 55 and 60, depending on when you were born) and retire, or when you turn 65 regardless of work status. Early access is available in limited circumstances such as severe financial hardship or terminal illness.
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
            name: "Superannuation Calculator Australia",
            description: META.description,
            url: `${SITE_URL}/tools/australia-super-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
          }),
        }}
      />
    </>
  );
}
