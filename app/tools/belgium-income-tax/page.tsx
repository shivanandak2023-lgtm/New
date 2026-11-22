"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Belgium Income Tax Calculator 2024 — Belgian Tax Calculator",
  description:
    "Free Belgian income tax calculator. Calculate your income tax with 2024 brackets (25%, 40%, 45%, 50%), social security, and net salary. Accurate Belgian personal tax calculation.",
  keywords:
    "Belgium income tax calculator, Belgian tax calculator, personenbelasting berekenen, impot des personnes physiques, Belgian tax brackets 2024, Belgium salary calculator",
};

const TAX_BRACKETS = [
  { limit: 15200, rate: 0.25 },
  { limit: 26830, rate: 0.40 },
  { limit: 46440, rate: 0.45 },
  { limit: Infinity, rate: 0.50 },
];

interface Result {
  gross: number;
  socialSecurity: number;
  taxableIncome: number;
  taxFreeAllowance: number;
  incomeTax: number;
  municipalSurcharge: number;
  totalTax: number;
  net: number;
  effectiveRate: number;
  bands: { bracket: string; rate: string; taxable: number; tax: number }[];
}

export default function BelgiumIncomeTaxPage() {
  const [grossSalary, setGrossSalary] = useState<string>("45000");
  const [municipalRate, setMunicipalRate] = useState<string>("7.0");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const gross = parseFloat(grossSalary) || 0;
    if (gross <= 0) return;

    // Social security (RSZ/ONSS): 13.07%
    const socialSecurity = gross * 0.1307;
    const afterSocial = gross - socialSecurity;

    // Tax-free allowance (belastingvrije som): EUR 10,160 for 2024
    const taxFreeAllowance = 10160;
    const taxableIncome = Math.max(0, afterSocial - taxFreeAllowance);

    // Progressive income tax
    let incomeTax = 0;
    let prev = 0;
    const bands: { bracket: string; rate: string; taxable: number; tax: number }[] = [];

    for (const b of TAX_BRACKETS) {
      const width = b.limit - prev;
      const taxable = Math.max(0, Math.min(taxableIncome - prev, width));
      const tax = taxable * b.rate;
      if (taxable > 0) {
        bands.push({
          bracket: `${prev.toLocaleString()} - ${b.limit === Infinity ? "+" : b.limit.toLocaleString()}`,
          rate: `${(b.rate * 100).toFixed(0)}%`,
          taxable,
          tax,
        });
      }
      incomeTax += tax;
      prev = b.limit;
    }

    // Municipal surcharge (gemeentebelasting): typically 6-9% of income tax
    const munRate = parseFloat(municipalRate) / 100 || 0.07;
    const municipalSurcharge = incomeTax * munRate;

    const totalTax = socialSecurity + incomeTax + municipalSurcharge;
    const net = gross - totalTax;
    const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;

    setResult({ gross, socialSecurity, taxableIncome, taxFreeAllowance, incomeTax, municipalSurcharge, totalTax, net, effectiveRate, bands });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/belgium-income-tax`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/belgium-income-tax`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Belgium Income Tax Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your Belgian income tax with 2024 brackets (25%, 40%, 45%, 50%), social security, and municipal surcharge.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Gross Annual Salary (EUR)</label>
              <input type="number" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} className="input-field" placeholder="e.g., 45000" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Municipal Surcharge (%)</label>
              <input type="number" value={municipalRate} onChange={(e) => setMunicipalRate(e.target.value)} className="input-field" placeholder="e.g., 7.0" min="0" max="12" step="0.1" />
              <p className="text-xs text-[var(--muted)] mt-1">Average ~7%. Brussels ~6.5%, varies by commune.</p>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary mt-6">Calculate Tax</button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Annual Net Salary</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmtExact(result.net)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Monthly Net Salary</p>
                <p className="text-2xl font-bold text-green-700">{fmtExact(result.net / 12)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Effective Tax Rate</p>
                <p className="text-2xl font-bold">{result.effectiveRate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Tax & Contributions Breakdown</h2>
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
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">Social Security (RSZ 13.07%)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.socialSecurity)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.socialSecurity / 12)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">Income Tax (Personenbelasting)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.incomeTax)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.incomeTax / 12)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">Municipal Surcharge ({municipalRate}%)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.municipalSurcharge)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.municipalSurcharge / 12)}</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Net Salary</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.net)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.net / 12)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Income Tax Bracket Breakdown</h2>
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
          <h2>How Does Belgian Income Tax Work?</h2>
          <p>
            Belgium has one of the highest tax burdens in Europe, with a progressive income tax system (personenbelasting / impot des personnes physiques) featuring four brackets: 25% on the first EUR 15,200 of taxable income, 40% from EUR 15,200 to EUR 26,830, 45% from EUR 26,830 to EUR 46,440, and 50% on all income above EUR 46,440. Before applying these brackets, social security contributions of 13.07% are deducted from gross salary, and a tax-free allowance (belastingvrije som) of EUR 10,160 reduces taxable income. This Belgian income tax calculator applies all these components to estimate your net salary.
          </p>

          <h2>Social Security Contributions (RSZ/ONSS)</h2>
          <p>
            Belgian employees pay 13.07% of their gross salary as social security contributions (Rijksdienst voor Sociale Zekerheid / Office National de Securite Sociale). Unlike many countries, there is no earnings ceiling for employee social security in Belgium, meaning the 13.07% applies to your entire gross salary. Employers pay an additional approximately 25-30% on top of gross salary, making Belgium&rsquo;s total social charges among the highest in Europe. These contributions fund healthcare, pensions, unemployment benefits, family allowances, and occupational disease insurance. The high social security rate is a major reason why Belgium&rsquo;s tax wedge (the difference between employer cost and employee take-home pay) is consistently among the highest in OECD countries.
          </p>

          <h2>Municipal Surcharge (Gemeentebelasting)</h2>
          <p>
            In addition to federal income tax, Belgian municipalities levy a surcharge (opcentiemen / centimes additionnels) calculated as a percentage of your federal income tax. This rate varies significantly by municipality, ranging from 0% in a few communes to over 9%. Brussels communes typically charge around 6-7%, while some Wallonian and Flemish municipalities have rates above 8%. The municipal surcharge is not a separate tax on income but rather a percentage added to your calculated income tax, so a municipality with a 7% surcharge increases your effective income tax by 7%. When comparing salaries across Belgium, the municipality of residence can make a noticeable difference in net pay.
          </p>

          <h2>Tax-Free Allowance and Deductions</h2>
          <p>
            The Belgian tax-free allowance (belastingvrije som) for 2024 is EUR 10,160, meaning the first EUR 10,160 of taxable income is not subject to income tax. This allowance increases for dependents: EUR 1,850 for one child, EUR 4,760 for two children, EUR 10,650 for three children, and EUR 17,210 for four children. Additional increases apply for disabled dependents and single parents. Belgium also offers deductions for pension savings (up to EUR 1,310 or EUR 990 depending on the scheme), home mortgage interest, donations, childcare costs, and professional expenses (a flat 30% deduction or actual expenses can be claimed).
          </p>

          <h2>Meal Vouchers, Eco-Cheques, and Benefits</h2>
          <p>
            Belgium has a unique system of extra-legal benefits that are partially or fully exempt from taxes and social security. Meal vouchers (maaltijdcheques) of up to EUR 8 per working day are common, with the employee contributing a maximum of EUR 1.09 and the employer the remainder tax-free. Eco-cheques (up to EUR 250/year) for sustainable purchases and sport/culture cheques are also tax-advantaged. Company cars with fuel cards remain one of the most common benefits in Belgium, though their tax treatment has tightened in recent years. These benefits significantly increase total compensation beyond the gross salary figure used in this calculator.
          </p>

          <h2>Regional Tax Differences in Belgium</h2>
          <p>
            Since Belgium&rsquo;s sixth state reform, the three regions (Flanders, Wallonia, and Brussels-Capital) have gained autonomy over certain tax matters. Each region applies different tax credits and reductions in addition to the federal system. Flanders offers a job bonus (werkbonus) for lower incomes, while Wallonia and Brussels have their own regional tax measures. The regions also set their own municipal surcharge frameworks. This complexity means that two employees with the same gross salary but living in different regions can have meaningfully different net incomes. For the most accurate calculation, consider both the federal rates calculated here and any regional-specific credits.
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
            name: "Belgium Income Tax Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/belgium-income-tax`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
