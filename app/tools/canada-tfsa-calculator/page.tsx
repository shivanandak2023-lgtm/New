"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "TFSA Calculator Canada - Tax-Free Savings Growth",
  description:
    "Free Canadian TFSA calculator to project your tax-free savings growth. Calculate future value, total contributions, and tax-free investment growth. 2024 contribution limit: $7,000. Total room since 2009: $95,000.",
  keywords:
    "TFSA calculator Canada, tax free savings calculator, TFSA contribution room, TFSA growth calculator, tax free savings account Canada, TFSA limit 2024",
};

const TFSA_LIMITS: { year: number; limit: number }[] = [
  { year: 2009, limit: 5000 },
  { year: 2010, limit: 5000 },
  { year: 2011, limit: 5000 },
  { year: 2012, limit: 5000 },
  { year: 2013, limit: 5500 },
  { year: 2014, limit: 5500 },
  { year: 2015, limit: 10000 },
  { year: 2016, limit: 5500 },
  { year: 2017, limit: 5500 },
  { year: 2018, limit: 5500 },
  { year: 2019, limit: 6000 },
  { year: 2020, limit: 6000 },
  { year: 2021, limit: 6000 },
  { year: 2022, limit: 6000 },
  { year: 2023, limit: 6500 },
  { year: 2024, limit: 7000 },
];

const TOTAL_ROOM = TFSA_LIMITS.reduce((sum, y) => sum + y.limit, 0);

interface YearRow {
  year: number;
  openingBalance: number;
  contribution: number;
  growth: number;
  closingBalance: number;
}

export default function CanadaTfsaCalculatorPage() {
  const [currentBalance, setCurrentBalance] = useState<string>("10000");
  const [annualContribution, setAnnualContribution] = useState<string>("7000");
  const [returnRate, setReturnRate] = useState<string>("6");
  const [investYears, setInvestYears] = useState<string>("25");
  const [ageAt18, setAgeAt18] = useState<string>("2009");

  const balance = parseFloat(currentBalance) || 0;
  const contrib = parseFloat(annualContribution) || 0;
  const ret = (parseFloat(returnRate) || 6) / 100;
  const years = parseInt(investYears) || 25;
  const eligibleYear = parseInt(ageAt18) || 2009;

  // Calculate contribution room
  const eligibleLimits = TFSA_LIMITS.filter(y => y.year >= eligibleYear);
  const contributionRoom = eligibleLimits.reduce((sum, y) => sum + y.limit, 0);

  const rows: YearRow[] = [];
  let runningBalance = balance;
  let totalContributions = 0;
  let totalGrowth = 0;

  for (let i = 0; i < years; i++) {
    const opening = runningBalance;
    const growth = (opening + contrib) * ret;
    const closing = opening + contrib + growth;
    totalContributions += contrib;
    totalGrowth += growth;
    rows.push({
      year: i + 1,
      openingBalance: opening,
      contribution: contrib,
      growth,
      closingBalance: closing,
    });
    runningBalance = closing;
  }

  const futureValue = runningBalance;
  const taxSaved = totalGrowth * 0.30; // Approximate tax saved on growth (assuming ~30% marginal rate)

  const fmt = (n: number) => "C$" + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const fmt2 = (n: number) => "C$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/canada-tfsa-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/canada-tfsa-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">TFSA Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Project your Canadian Tax-Free Savings Account (TFSA) growth. All investment income earned inside a TFSA is completely tax-free.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Current TFSA Balance (C$)</label>
              <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} className="input-field" placeholder="10000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Annual Contribution (C$)</label>
              <input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(e.target.value)} className="input-field" placeholder="7000" />
              <p className="text-xs text-[var(--muted)] mt-1">2024 annual limit: C$7,000</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expected Annual Return (%)</label>
              <input type="number" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} className="input-field" step="0.5" placeholder="6" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Investment Period (Years)</label>
              <input type="number" value={investYears} onChange={(e) => setInvestYears(e.target.value)} className="input-field" placeholder="25" min="1" max="50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Year You Turned 18 (for Contribution Room)</label>
              <select value={ageAt18} onChange={(e) => setAgeAt18(e.target.value)} className="input-field">
                {TFSA_LIMITS.map((y) => (
                  <option key={y.year} value={y.year}>{y.year} or earlier</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {years > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Future TFSA Value</p>
                <p className="text-2xl font-bold text-green-700">{fmt(futureValue)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Contributions</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(totalContributions + balance)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Tax-Free Growth</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(totalGrowth)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Approx. Tax Saved</p>
                <p className="text-2xl font-bold text-blue-700">{fmt(taxSaved)}</p>
              </div>
            </div>

            {/* Contribution Room Tracker */}
            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">TFSA Contribution Room Tracker</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-[var(--muted-bg)]">
                  <p className="font-semibold">Your Total Contribution Room</p>
                  <p className="text-lg font-bold text-[var(--primary)]">{fmt(contributionRoom)}</p>
                  <p className="text-xs text-[var(--muted)]">Based on eligibility from {eligibleYear}</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--muted-bg)]">
                  <p className="font-semibold">Maximum Lifetime Room (since 2009)</p>
                  <p className="text-lg font-bold text-[var(--primary)]">{fmt(TOTAL_ROOM)}</p>
                  <p className="text-xs text-[var(--muted)]">For those 18+ since 2009</p>
                </div>
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Year</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annual Limit</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let cumulative = 0;
                    return TFSA_LIMITS.map((y) => {
                      cumulative += y.limit;
                      const eligible = y.year >= eligibleYear;
                      return (
                        <tr key={y.year} className={`hover:bg-[var(--muted-bg)] ${!eligible ? "opacity-40" : ""}`}>
                          <td className="border border-[var(--card-border)] px-3 py-2">{y.year}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(y.limit)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(cumulative)}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>

            <div className="tool-card overflow-x-auto">
              <h2 className="text-lg font-bold mb-4">Year-by-Year Growth</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Year</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Opening</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Contribution</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Growth</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Closing</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.year} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{r.year}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(r.openingBalance)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt2(r.contribution)}</td>
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
          <h2>What Is a TFSA?</h2>
          <p>
            A Tax-Free Savings Account (TFSA) is a Canadian savings vehicle where all investment income — interest, dividends, and capital gains — is earned completely tax-free. Unlike an RRSP, contributions are made with after-tax dollars, but withdrawals are never taxed.
          </p>
          <h2>TFSA Contribution Limits</h2>
          <p>
            The annual TFSA contribution limit for 2024 is C$7,000. The cumulative contribution room since the TFSA was introduced in 2009 is C$95,000 for anyone who was 18 or older and a Canadian resident since 2009. Unused contribution room carries forward indefinitely, and withdrawn amounts are added back to your room the following year.
          </p>
          <h2>TFSA Investment Options</h2>
          <p>
            A TFSA can hold most of the same investments as an RRSP: stocks, bonds, ETFs, mutual funds, GICs, and even some alternative investments. The key advantage is that all growth is permanently tax-free — there is no tax when you contribute, while invested, or upon withdrawal.
          </p>
          <h3>TFSA vs RRSP</h3>
          <p>
            Both are excellent retirement tools. Use a TFSA when you expect to be in the same or higher tax bracket in retirement, want flexibility to withdraw anytime, or have maximized your RRSP. Use an RRSP when you want an immediate tax deduction and expect a lower tax bracket in retirement. Many Canadians benefit from using both.
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
            name: "TFSA Calculator Canada",
            description: META.description,
            url: `${SITE_URL}/tools/canada-tfsa-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
          }),
        }}
      />
    </>
  );
}
