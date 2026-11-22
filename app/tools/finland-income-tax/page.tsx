"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Finland Income Tax Calculator 2024 — Finnish Verolaskuri",
  description:
    "Free Finnish income tax calculator. Calculate progressive state tax, municipal tax (~20%), social contributions, and net salary for 2024. Accurate Finnish tax brackets.",
  keywords:
    "Finland income tax calculator, Finnish tax calculator, verolaskuri, ansiotuloverotus, kunnallisvero, Finnish salary calculator, Finland tax brackets 2024",
};

const STATE_BRACKETS = [
  { limit: 20500, rate: 0 },
  { limit: 30500, rate: 0.06 },
  { limit: 50400, rate: 0.1725 },
  { limit: 88200, rate: 0.2125 },
  { limit: Infinity, rate: 0.3125 },
];

interface Result {
  gross: number;
  stateTax: number;
  municipalTax: number;
  healthInsurance: number;
  pensionContribution: number;
  unemploymentInsurance: number;
  totalTax: number;
  netSalary: number;
  effectiveRate: number;
  bands: { bracket: string; rate: string; taxable: number; tax: number }[];
}

export default function FinlandIncomeTaxPage() {
  const [grossSalary, setGrossSalary] = useState<string>("45000");
  const [municipalRate, setMunicipalRate] = useState<string>("20.0");
  const [churchMember, setChurchMember] = useState<boolean>(false);
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const gross = parseFloat(grossSalary) || 0;
    if (gross <= 0) return;

    // Employee pension contribution (TyEL): ~7.15% (under 53) or 8.65% (53-62)
    const pensionContribution = gross * 0.0715;

    // Unemployment insurance: 1.5%
    const unemploymentInsurance = gross * 0.015;

    // Taxable income after social contributions
    const taxableIncome = gross - pensionContribution - unemploymentInsurance;

    // State progressive tax
    let stateTax = 0;
    let prev = 0;
    const bands: { bracket: string; rate: string; taxable: number; tax: number }[] = [];
    for (const b of STATE_BRACKETS) {
      const width = b.limit - prev;
      const taxable = Math.max(0, Math.min(taxableIncome - prev, width));
      const tax = taxable * b.rate;
      if (taxable > 0) {
        bands.push({
          bracket: `${prev.toLocaleString()} - ${b.limit === Infinity ? "+" : b.limit.toLocaleString()}`,
          rate: `${(b.rate * 100).toFixed(2)}%`,
          taxable,
          tax,
        });
      }
      stateTax += tax;
      prev = b.limit;
    }

    // Municipal tax (kunnallisvero): varies, avg ~20%
    const munRate = parseFloat(municipalRate) / 100 || 0.20;
    // Basic deduction reduces municipal taxable income for lower earners
    const municipalTax = Math.max(0, taxableIncome - 3500) * munRate;

    // Health insurance (sairausvakuutusmaksu): ~1.96%
    const healthInsurance = taxableIncome * 0.0196;

    // Church tax: ~1.0-2.0% if member
    const churchTax = churchMember ? taxableIncome * 0.015 : 0;

    const totalTax = stateTax + municipalTax + healthInsurance + pensionContribution + unemploymentInsurance + churchTax;
    const netSalary = gross - totalTax;
    const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;

    setResult({
      gross,
      stateTax,
      municipalTax: municipalTax + churchTax,
      healthInsurance,
      pensionContribution,
      unemploymentInsurance,
      totalTax,
      netSalary,
      effectiveRate,
      bands,
    });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/finland-income-tax`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/finland-income-tax`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Finland Income Tax Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your Finnish income tax including progressive state tax, municipal tax, pension, and social contributions for 2024.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Gross Annual Salary (EUR)</label>
              <input type="number" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} className="input-field" placeholder="e.g., 45000" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Municipal Tax Rate (%)</label>
              <input type="number" value={municipalRate} onChange={(e) => setMunicipalRate(e.target.value)} className="input-field" placeholder="e.g., 20.0" min="16" max="24" step="0.1" />
              <p className="text-xs text-[var(--muted)] mt-1">Average ~20%. Ranges from ~17% to ~23.5%.</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input type="checkbox" id="churchMember" checked={churchMember} onChange={(e) => setChurchMember(e.target.checked)} className="w-5 h-5 accent-[var(--primary)]" />
            <label htmlFor="churchMember" className="text-sm font-medium">Church member (kirkollisverot ~1.5%)</label>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">Calculate Tax</button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Annual Net Salary</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.netSalary)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Monthly Net Salary</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.netSalary / 12)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Effective Tax Rate</p>
                <p className="text-2xl font-bold">{result.effectiveRate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Tax Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Component</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annual</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Monthly</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Gross Salary</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.gross)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.gross / 12)}</td>
                    </tr>
                    {[
                      { label: "Pension (TyEL, 7.15%)", value: result.pensionContribution },
                      { label: "Unemployment Insurance (1.5%)", value: result.unemploymentInsurance },
                      { label: "State Income Tax", value: result.stateTax },
                      { label: `Municipal Tax (${municipalRate}%)`, value: result.municipalTax },
                      { label: "Health Insurance (1.96%)", value: result.healthInsurance },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">{row.label}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(row.value)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(row.value / 12)}</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Net Salary</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.netSalary)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.netSalary / 12)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">State Tax Bracket Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Bracket</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Rate</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Taxable</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.bands.map((band, i) => (
                      <tr key={i} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{band.bracket}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{band.rate}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(band.taxable)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(band.tax)}</td>
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
          <h2>How Does Finnish Income Tax Work?</h2>
          <p>
            Finland has a dual income tax system where earned income (ansiotulot) and capital income (paaomatulot) are taxed separately. Earned income, including salaries, is subject to both progressive state tax and flat-rate municipal tax. The state tax uses progressive brackets ranging from 0% on income below 20,500 euros to 31.25% on income above 88,200 euros. Municipal tax (kunnallisvero) is a flat rate set by each municipality, averaging about 20%. Combined with social contributions, the total effective tax rate for an average earner is typically between 30-40%. This Finnish income tax calculator computes all components for 2024.
          </p>

          <h2>Municipal Tax (Kunnallisvero)</h2>
          <p>
            Municipal tax is the largest single tax component for most Finnish workers. Each of Finland&rsquo;s municipalities sets its own flat tax rate, which typically ranges from about 17% in the lowest-tax municipalities to over 23% in some smaller ones. Helsinki has a rate of approximately 18.5%, while the national average is around 20%. This tax funds local services including schools, healthcare, social services, and infrastructure. Unlike state tax, municipal tax has a flat rate that applies to all taxable income above certain basic deductions. When evaluating job opportunities in different Finnish cities, the municipal tax rate can significantly impact your net salary.
          </p>

          <h2>Employee Social Contributions</h2>
          <p>
            Finnish employees pay several mandatory social contributions deducted from their gross salary. The largest is the pension contribution (TyEL-maksu), which is 7.15% for employees aged 17-52 and 63-67, and 8.65% for those aged 53-62. Unemployment insurance (tyottomyysvakuutusmaksu) is 1.5% of gross pay. Health insurance (sairausvakuutusmaksu) includes a medical care premium of about 0.60% and a daily allowance premium of about 1.36%, totaling approximately 1.96%. These social contributions are deductible from your taxable income, so they reduce the base on which state and municipal taxes are calculated.
          </p>

          <h2>Tax Deductions in Finland</h2>
          <p>
            Finland provides several automatic and elective tax deductions. The basic deduction (perusvahennys) reduces municipal taxable income for lower earners and phases out as income increases. The earned income deduction (ansiotulovahennys) automatically reduces tax on employment income. Commuting costs above 750 euros per year (up to 7,000 euros) are deductible for public transport and up to 8,400 euros for car commuting under certain conditions. Home mortgage interest is partially deductible at 5% of interest paid in 2024. Union fees, unemployment fund contributions, and voluntary pension savings up to 5,000 euros per year are also deductible.
          </p>

          <h2>Tax-at-Source and Tax Card</h2>
          <p>
            Finnish employers withhold tax monthly based on the tax card (verokortti) issued by the Tax Administration (Vero). The tax card shows two rates: a base rate applied up to a certain income limit, and a higher additional rate for income above that limit. Employees can order a revised tax card online at vero.fi if their income changes during the year. At the end of the year, Vero issues a pre-completed tax return (esitaytetty veroilmoitus) in March or April, which taxpayers should check and correct if necessary. Any over- or under-payment results in a tax refund or additional tax demand.
          </p>

          <h2>Finland vs. Other Nordic Countries</h2>
          <p>
            Compared to other Nordic countries, Finland&rsquo;s tax system is broadly similar but has some differences. Denmark has higher marginal rates but no separate social contributions for employees. Sweden has a similar structure with progressive state tax plus municipal tax, but Sweden&rsquo;s state tax kicks in at a higher income level. Norway has lower overall tax rates. All Nordic countries provide comprehensive public services including universal healthcare, free education through university, generous parental leave, and strong social safety nets. The high tax rates fund these services, and Finnish residents generally report high levels of satisfaction with their public services and quality of life despite the tax burden.
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
            name: "Finland Income Tax Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/finland-income-tax`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
