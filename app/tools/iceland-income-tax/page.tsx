"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Iceland Income Tax Calculator 2024 — Icelandic Tax Calculator",
  description:
    "Free Icelandic income tax calculator. Calculate your income tax with 2024 brackets (31.45%, 37.95%, 46.25%), social contributions, and net salary in ISK.",
  keywords:
    "Iceland income tax calculator, Icelandic tax calculator, skattur a Islandi, Iceland tax brackets 2024, ISK salary calculator, Iceland net salary",
};

const TAX_BRACKETS = [
  { limit: 4707060, rate: 0.3145 },
  { limit: 13231938, rate: 0.3795 },
  { limit: Infinity, rate: 0.4625 },
];

interface Result {
  gross: number;
  pensionContribution: number;
  taxableIncome: number;
  personalCredit: number;
  incomeTax: number;
  totalDeductions: number;
  net: number;
  effectiveRate: number;
  bands: { bracket: string; rate: string; taxable: number; tax: number }[];
}

export default function IcelandIncomeTaxPage() {
  const [grossSalary, setGrossSalary] = useState<string>("8000000");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const gross = parseFloat(grossSalary) || 0;
    if (gross <= 0) return;

    // Mandatory pension contribution: 4%
    const pensionContribution = gross * 0.04;

    const taxableIncome = gross - pensionContribution;

    // Progressive income tax
    let grossTax = 0;
    let prev = 0;
    const bands: { bracket: string; rate: string; taxable: number; tax: number }[] = [];

    for (const b of TAX_BRACKETS) {
      const width = b.limit - prev;
      const taxable = Math.max(0, Math.min(taxableIncome - prev, width));
      const tax = taxable * b.rate;
      if (taxable > 0) {
        bands.push({
          bracket: `${(prev / 1000).toFixed(0)}k - ${b.limit === Infinity ? "+" : (b.limit / 1000).toFixed(0) + "k"}`,
          rate: `${(b.rate * 100).toFixed(2)}%`,
          taxable,
          tax,
        });
      }
      grossTax += tax;
      prev = b.limit;
    }

    // Personal tax credit (persонuafslattr): ISK 69,882/month = ISK 838,584/year for 2024
    const personalCredit = 838584;
    const incomeTax = Math.max(0, grossTax - personalCredit);

    const totalDeductions = pensionContribution + incomeTax;
    const net = gross - totalDeductions;
    const effectiveRate = gross > 0 ? (totalDeductions / gross) * 100 : 0;

    setResult({ gross, pensionContribution, taxableIncome, personalCredit, incomeTax, totalDeductions, net, effectiveRate, bands });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("is-IS", { style: "currency", currency: "ISK", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/iceland-income-tax`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/iceland-income-tax`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Iceland Income Tax Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your Icelandic income tax with 2024 brackets (31.45%, 37.95%, 46.25%), pension contribution, and personal tax credit.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">Gross Annual Salary (ISK)</label>
            <input type="number" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} className="input-field" placeholder="e.g., 8000000" min="0" />
            <p className="text-xs text-[var(--muted)] mt-1">Average annual salary in Iceland is approximately ISK 8,000,000 - 10,000,000.</p>
          </div>
          <button onClick={calculate} className="btn-primary mt-6">Calculate Tax</button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Annual Net Salary</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.net)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Monthly Net Salary</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.net / 12)}</p>
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
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.gross)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.gross / 12)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">Pension Contribution (4%)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmt(result.pensionContribution)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmt(result.pensionContribution / 12)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">Income Tax (after personal credit)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmt(result.incomeTax)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmt(result.incomeTax / 12)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-green-600">Personal Tax Credit Applied</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-600">{fmt(result.personalCredit)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-600">{fmt(result.personalCredit / 12)}</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Net Salary</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(result.net)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(result.net / 12)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Tax Bracket Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Bracket</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Rate</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Taxable</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Tax (before credit)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.bands.map((band, i) => (
                      <tr key={i} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{band.bracket}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{band.rate}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(band.taxable)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(band.tax)}</td>
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
          <h2>How Does Icelandic Income Tax Work?</h2>
          <p>
            Iceland uses a progressive income tax system with three brackets for 2024. The combined state and municipal tax rates are: 31.45% on income up to ISK 4,707,060, 37.95% on income from ISK 4,707,060 to ISK 13,231,938, and 46.25% on income above ISK 13,231,938. These rates include both the national income tax (set by the state) and municipal tax (set by each municipality, averaging about 14.44%). A generous personal tax credit (persónuafsláttur) of ISK 69,882 per month (ISK 838,584 per year) is applied directly against your calculated tax, significantly reducing the effective tax rate for lower and middle incomes. This Iceland income tax calculator applies all these elements to estimate your net salary.
          </p>

          <h2>Personal Tax Credit (Persónuafsláttur)</h2>
          <p>
            The personal tax credit is one of the most important features of the Icelandic tax system. For 2024, every taxpayer receives a credit of ISK 69,882 per month (ISK 838,584 annually) that directly reduces their calculated income tax. If your total tax liability is less than the personal credit, the unused portion can be transferred to a spouse. This credit effectively means that the first several hundred thousand ISK of annual income are tax-free. For someone earning the average Icelandic salary, the personal credit reduces their effective tax rate by approximately 8-10 percentage points compared to the nominal bracket rates. Married couples and registered partners can share unused credits, providing additional tax benefits for single-income households.
          </p>

          <h2>Pension Contributions in Iceland</h2>
          <p>
            All employed persons in Iceland must contribute 4% of their gross salary to a mandatory pension fund (lífeyrissjóður). Employers are required to contribute an additional 11.5% (recently increased from 11.5% historically), making it one of the most generous employer pension contributions globally. These combined 15.5% contributions fund Iceland&rsquo;s occupational pension system, which supplements the state social security pension. Many employees also make voluntary supplementary pension contributions of 2-4%, which their employers are required to match with an additional 2%. Pension contributions are tax-deductible, reducing your taxable income before income tax is calculated.
          </p>

          <h2>Municipal Tax Variation</h2>
          <p>
            Icelandic income tax consists of a national component and a municipal component. While the national tax rates are set by the government, each of Iceland&rsquo;s municipalities sets its own flat tax rate. The average municipal tax rate is approximately 14.44%, with Reykjavik at 14.44%. Other municipalities range from about 12.44% to 14.52%. The combined rates shown in this calculator (31.45%, 37.95%, 46.25%) use the standard municipal rate. If you live in a municipality with a different rate, your effective tax may vary slightly. The municipal tax funds local services including schools, social services, and infrastructure.
          </p>

          <h2>Social Security and Benefits</h2>
          <p>
            Beyond income tax and pension contributions, Iceland provides comprehensive social benefits funded through the system. The state social security pension (almannatryggingar) provides a base pension to all residents who have lived in Iceland for at least three years. Healthcare is largely publicly funded with modest co-payments. Parental leave is generous at 12 months total (6 months each for each parent, with some transferable). Unemployment benefits provide 70% of previous average salary for up to three months, then a flat rate. These benefits are funded through employer social insurance contributions rather than direct employee deductions, so they do not appear in this calculator but represent a significant part of the total social contract.
          </p>

          <h2>Iceland Cost of Living Context</h2>
          <p>
            When evaluating an Icelandic salary, it is essential to consider the high cost of living. Iceland consistently ranks among the most expensive countries in the world, with Reykjavik being one of the priciest cities for food, housing, and consumer goods. Import duties, geographical isolation, and a small market contribute to high prices. However, Icelandic salaries are correspondingly high by international standards, with average monthly wages around ISK 650,000-850,000 (approximately EUR 4,000-5,500). Despite the high nominal tax rates, the personal tax credit significantly reduces effective rates, and comprehensive public services reduce out-of-pocket expenses for healthcare and education.
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
            name: "Iceland Income Tax Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/iceland-income-tax`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "ISK" },
          }),
        }}
      />
    </>
  );
}
