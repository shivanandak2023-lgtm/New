"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "HECS-HELP Repayment Calculator Australia",
  description:
    "Free HECS-HELP repayment calculator for Australia. Calculate your annual and monthly repayments based on 2024-25 thresholds, estimate years to repay, and see the impact of CPI indexation on your student debt.",
  keywords:
    "HECS calculator, HELP repayment calculator Australia, HECS-HELP debt calculator, student loan repayment Australia, HECS repayment thresholds 2024, student debt calculator",
};

const REPAYMENT_THRESHOLDS_2024 = [
  { min: 0, max: 51550, rate: 0 },
  { min: 51550, max: 59518, rate: 0.01 },
  { min: 59518, max: 63089, rate: 0.02 },
  { min: 63089, max: 66875, rate: 0.025 },
  { min: 66875, max: 70888, rate: 0.03 },
  { min: 70888, max: 75140, rate: 0.035 },
  { min: 75140, max: 79649, rate: 0.04 },
  { min: 79649, max: 84429, rate: 0.045 },
  { min: 84429, max: 89494, rate: 0.05 },
  { min: 89494, max: 94865, rate: 0.055 },
  { min: 94865, max: 100557, rate: 0.06 },
  { min: 100557, max: 106590, rate: 0.065 },
  { min: 106590, max: 112985, rate: 0.07 },
  { min: 112985, max: 119764, rate: 0.075 },
  { min: 119764, max: 126950, rate: 0.08 },
  { min: 126950, max: 134568, rate: 0.085 },
  { min: 134568, max: 142642, rate: 0.09 },
  { min: 142642, max: 151200, rate: 0.095 },
  { min: 151200, max: Infinity, rate: 0.10 },
];

function getRepaymentRate(income: number): number {
  for (const t of REPAYMENT_THRESHOLDS_2024) {
    if (income >= t.min && income < t.max) return t.rate;
  }
  return 0.10;
}

interface RepaymentRow {
  year: number;
  openingDebt: number;
  indexation: number;
  repayment: number;
  closingDebt: number;
}

export default function AustraliaHecsCalculatorPage() {
  const [debtBalance, setDebtBalance] = useState<string>("30000");
  const [annualIncome, setAnnualIncome] = useState<string>("70000");
  const [cpiRate, setCpiRate] = useState<string>("3.5");

  const debt = parseFloat(debtBalance) || 0;
  const income = parseFloat(annualIncome) || 0;
  const cpi = (parseFloat(cpiRate) || 3.5) / 100;

  const repaymentRate = getRepaymentRate(income);
  const annualRepayment = income * repaymentRate;
  const monthlyRepayment = annualRepayment / 12;

  // Simulate year-by-year repayment with indexation
  const rows: RepaymentRow[] = [];
  let remaining = debt;
  let totalRepaid = 0;
  let yr = 0;

  while (remaining > 0 && yr < 50) {
    yr++;
    const indexation = remaining * cpi;
    const debtAfterIndex = remaining + indexation;
    const repayment = Math.min(annualRepayment, debtAfterIndex);
    const closing = Math.max(0, debtAfterIndex - repayment);
    totalRepaid += repayment;
    rows.push({
      year: yr,
      openingDebt: remaining,
      indexation,
      repayment,
      closingDebt: closing,
    });
    remaining = closing;
  }

  const yearsToRepay = rows.length;

  const fmt = (n: number) => "A$" + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const fmt2 = (n: number) => "A$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/australia-hecs-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/australia-hecs-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">HECS-HELP Repayment Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your HECS-HELP student loan repayments based on 2024-25 Australian repayment thresholds. See how long it will take to pay off your debt including CPI indexation.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">HECS-HELP Debt Balance (A$)</label>
              <input type="number" value={debtBalance} onChange={(e) => setDebtBalance(e.target.value)} className="input-field" placeholder="30000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Annual Income (A$)</label>
              <input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="input-field" placeholder="70000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CPI Indexation Rate (%)</label>
              <input type="number" value={cpiRate} onChange={(e) => setCpiRate(e.target.value)} className="input-field" step="0.1" placeholder="3.5" />
              <p className="text-xs text-[var(--muted)] mt-1">Historical average ~3.5%</p>
            </div>
          </div>
        </div>

        {debt > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Repayment Rate</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{(repaymentRate * 100).toFixed(1)}%</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Annual Repayment</p>
                <p className="text-2xl font-bold text-amber-700">{fmt2(annualRepayment)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Monthly Repayment</p>
                <p className="text-2xl font-bold text-blue-700">{fmt2(monthlyRepayment)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Years to Repay</p>
                <p className="text-2xl font-bold text-green-700">{annualRepayment > 0 ? yearsToRepay : "N/A"}</p>
              </div>
            </div>

            {annualRepayment > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="result-card text-center">
                  <p className="text-sm text-[var(--muted)] mb-1">Total Repaid</p>
                  <p className="text-2xl font-bold text-[var(--primary)]">{fmt(totalRepaid)}</p>
                </div>
                <div className="result-card text-center" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
                  <p className="text-sm text-[var(--muted)] mb-1">Extra Paid (Indexation)</p>
                  <p className="text-2xl font-bold text-red-700">{fmt(totalRepaid - debt)}</p>
                </div>
              </div>
            )}

            {/* Repayment thresholds table */}
            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">2024-25 Repayment Thresholds</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Income Range</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {REPAYMENT_THRESHOLDS_2024.filter(t => t.rate > 0).map((t, i) => (
                    <tr key={i} className={`hover:bg-[var(--muted-bg)] ${income >= t.min && income < t.max ? "bg-blue-50 font-semibold" : ""}`}>
                      <td className="border border-[var(--card-border)] px-3 py-2">
                        {fmt(t.min)} {t.max === Infinity ? "+" : `- ${fmt(t.max)}`}
                      </td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{(t.rate * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Year-by-year table */}
            {annualRepayment > 0 && rows.length > 0 && (
              <div className="tool-card overflow-x-auto">
                <h2 className="text-lg font-bold mb-4">Year-by-Year Repayment Schedule</h2>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Year</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Opening Debt</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Indexation</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Repayment</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Closing Debt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.year} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{r.year}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(r.openingDebt)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">+{fmt2(r.indexation)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">-{fmt2(r.repayment)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(r.closingDebt)}</td>
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
          <h2>How HECS-HELP Repayments Work</h2>
          <p>
            HECS-HELP is Australia&apos;s student loan scheme. Repayments are income-contingent, meaning you only repay when your income exceeds the minimum threshold ($51,550 for 2024-25). The repayment rate increases as your income rises, from 1% to a maximum of 10%.
          </p>
          <h2>HECS-HELP Indexation</h2>
          <p>
            Your HECS-HELP debt is indexed annually on 1 June based on the Consumer Price Index (CPI). This means your debt grows with inflation each year. From 2023, indexation is capped at the lower of CPI or the Wage Price Index (WPI) to prevent debt from growing faster than wages.
          </p>
          <h2>Repayment Through the Tax System</h2>
          <p>
            HECS-HELP repayments are automatically withheld from your pay by your employer if you tick the HELP box on your Tax File Number Declaration. You can also make voluntary repayments at any time to reduce your debt faster. Any amount over $500 in voluntary repayments used to receive a 5% bonus, but this was removed in 2017.
          </p>
          <h3>Tips for Managing HECS-HELP Debt</h3>
          <p>
            Since HECS-HELP is indexed at CPI (effectively an interest-free loan in real terms), many financial advisors suggest prioritizing other higher-interest debts first. However, making voluntary repayments can be beneficial if you want to reduce the total amount repaid over time.
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
            name: "HECS-HELP Repayment Calculator Australia",
            description: META.description,
            url: `${SITE_URL}/tools/australia-hecs-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
          }),
        }}
      />
    </>
  );
}
