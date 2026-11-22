"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Denmark Income Tax Calculator 2024",
  description:
    "Free Denmark income tax calculator for 2024. Calculate Danish tax with AM-bidrag, bundskat, topskat, municipal tax, and church tax. See your net salary after all deductions in DKK.",
  keywords:
    "Denmark income tax calculator, Danish tax calculator, skat beregner, AM-bidrag, bundskat, topskat, kommuneskat, Danish salary calculator, Denmark tax 2024",
};

interface TaxResult {
  grossIncome: number;
  amBidrag: number;
  incomeAfterAM: number;
  personalDeduction: number;
  taxableIncome: number;
  bundskat: number;
  topskat: number;
  municipalTax: number;
  churchTax: number;
  totalTax: number;
  netIncome: number;
  effectiveRate: number;
  monthlyNet: number;
}

export default function DenmarkIncomeTaxPage() {
  const [grossIncome, setGrossIncome] = useState<string>("450000");
  const [municipalRate, setMunicipalRate] = useState<string>("24.9");
  const [churchTaxEnabled, setChurchTaxEnabled] = useState<boolean>(false);
  const [churchRate, setChurchRate] = useState<string>("0.7");
  const [result, setResult] = useState<TaxResult | null>(null);

  function calculate() {
    const gross = parseFloat(grossIncome) || 0;
    if (gross <= 0) return;

    const munRate = parseFloat(municipalRate) || 24.9;
    const chRate = churchTaxEnabled ? (parseFloat(churchRate) || 0.7) : 0;

    // AM-bidrag (labour market contribution) 8%
    const amBidrag = gross * 0.08;
    const incomeAfterAM = gross - amBidrag;

    // Personal deduction 2024: 49,700 DKK
    const personalDeduction = 49700;
    const taxableIncome = Math.max(0, incomeAfterAM - personalDeduction);

    // Bundskat (bottom tax) 12.09%
    const bundskat = taxableIncome * 0.1209;

    // Topskat (top tax) 15% on income above 588,900 DKK (after AM-bidrag)
    const topskatThreshold = 588900;
    const topskat = incomeAfterAM > topskatThreshold
      ? (incomeAfterAM - topskatThreshold) * 0.15
      : 0;

    // Municipal tax (average ~24.9%)
    const municipalTax = taxableIncome * (munRate / 100);

    // Church tax (optional, ~0.7%)
    const churchTax = taxableIncome * (chRate / 100);

    // Tax ceiling: combined tax rate capped at ~52.07% (before AM-bidrag)
    const totalTax = amBidrag + bundskat + topskat + municipalTax + churchTax;
    const netIncome = gross - totalTax;
    const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;
    const monthlyNet = netIncome / 12;

    setResult({
      grossIncome: gross,
      amBidrag,
      incomeAfterAM,
      personalDeduction,
      taxableIncome,
      bundskat,
      topskat,
      municipalTax,
      churchTax,
      totalTax,
      netIncome,
      effectiveRate,
      monthlyNet,
    });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  const comparisonSalaries = [250000, 350000, 450000, 550000, 650000, 750000, 900000];

  function quickCalcNet(g: number): number {
    const am = g * 0.08;
    const afterAM = g - am;
    const pd = 49700;
    const ti = Math.max(0, afterAM - pd);
    const bs = ti * 0.1209;
    const ts = afterAM > 588900 ? (afterAM - 588900) * 0.15 : 0;
    const munRate = parseFloat(municipalRate) || 24.9;
    const mt = ti * (munRate / 100);
    const chRate2 = churchTaxEnabled ? (parseFloat(churchRate) || 0.7) : 0;
    const ct = ti * (chRate2 / 100);
    return g - am - bs - ts - mt - ct;
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/denmark-income-tax`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/denmark-income-tax`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Denmark Income Tax Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your Danish net salary after AM-bidrag, bundskat, topskat, municipal tax, and church tax for 2024.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Gross Annual Income (DKK)</label>
              <input
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(e.target.value)}
                className="input-field"
                placeholder="e.g., 450000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Municipal Tax Rate (%)</label>
              <input
                type="number"
                value={municipalRate}
                onChange={(e) => setMunicipalRate(e.target.value)}
                className="input-field"
                placeholder="e.g., 24.9"
                min="0"
                max="40"
                step="0.1"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="churchTax"
                checked={churchTaxEnabled}
                onChange={(e) => setChurchTaxEnabled(e.target.checked)}
                className="w-5 h-5 accent-[var(--primary)]"
              />
              <label htmlFor="churchTax" className="text-sm font-medium">
                Member of the Danish National Church (kirkeskat)
              </label>
            </div>
          </div>

          {churchTaxEnabled && (
            <div className="mt-4 max-w-xs">
              <label className="block text-sm font-medium mb-1">Church Tax Rate (%)</label>
              <input
                type="number"
                value={churchRate}
                onChange={(e) => setChurchRate(e.target.value)}
                className="input-field"
                placeholder="e.g., 0.7"
                min="0"
                max="2"
                step="0.1"
              />
            </div>
          )}

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Danish Tax
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Annual Net Income</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.netIncome)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Monthly Net Income</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.monthlyNet)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Tax</p>
                <p className="text-2xl font-bold text-red-600">{fmt(result.totalTax)}</p>
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
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Rate</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annual</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Monthly</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Gross Income</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">-</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.grossIncome)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.grossIncome / 12)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">AM-bidrag</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">8%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.amBidrag)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.amBidrag / 12)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">Bundskat (Bottom Tax)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">12.09%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.bundskat)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.bundskat / 12)}</td>
                    </tr>
                    {result.topskat > 0 && (
                      <tr className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">Topskat (Top Tax)</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">15%</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.topskat)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.topskat / 12)}</td>
                      </tr>
                    )}
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">Municipal Tax (Kommuneskat)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{municipalRate}%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.municipalTax)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.municipalTax / 12)}</td>
                    </tr>
                    {result.churchTax > 0 && (
                      <tr className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">Church Tax (Kirkeskat)</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{churchRate}%</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.churchTax)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.churchTax / 12)}</td>
                      </tr>
                    )}
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Net Income</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">-</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.netIncome)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.monthlyNet)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Salary Comparison Table</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Gross Annual</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Net Annual</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Net Monthly</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Tax Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonSalaries.map((sal) => {
                      const net = quickCalcNet(sal);
                      const rate = ((sal - net) / sal * 100).toFixed(1);
                      return (
                        <tr key={sal} className={sal === result.grossIncome ? "bg-blue-50 font-semibold" : "hover:bg-[var(--muted-bg)]"}>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(sal)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(net)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(net / 12)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{rate}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does Danish Income Tax Work?</h2>
          <p>
            Denmark has one of the most comprehensive tax systems in the world. The Danish income tax system consists of several components that together determine your total tax burden. The first deduction from your salary is the AM-bidrag (Arbejdsmarkedsbidrag), which is a flat 8% labour market contribution applied to your gross income before any other taxes are calculated. This Denmark income tax calculator helps you understand each component of your Danish tax obligation.
          </p>

          <h2>AM-bidrag: Labour Market Contribution</h2>
          <p>
            The AM-bidrag is a mandatory 8% contribution deducted from your gross salary. It funds the Danish labour market system, including unemployment benefits and active labour market policies. Unlike income tax, the AM-bidrag is calculated on your full gross income without any deductions. After AM-bidrag is deducted, the remaining amount forms the basis for calculating your income taxes. This is an important distinction because it effectively reduces your taxable base for other taxes.
          </p>

          <h2>Bundskat and Topskat: State Income Tax</h2>
          <p>
            Denmark levies two levels of state income tax. The bundskat (bottom tax) is charged at 12.09% on your taxable income after the personal deduction of 49,700 DKK. The topskat (top tax) is an additional 15% charged on income exceeding 588,900 DKK after AM-bidrag. This means higher earners face a combined state tax rate of approximately 27.09% on income above the topskat threshold. The Danish skat beregner system ensures progressive taxation where higher incomes contribute proportionally more.
          </p>

          <h2>Municipal Tax (Kommuneskat)</h2>
          <p>
            Municipal tax is the largest component of Danish income tax and varies by municipality. The average rate across Denmark is approximately 24.9%, but rates range from about 22.5% to 27.8% depending on where you live. Copenhagen has a rate of around 23.8%, while some smaller municipalities charge higher rates. When using this Danish tax calculator, enter your specific municipal tax rate for the most accurate results. Municipal tax is calculated on your taxable income after the personal deduction.
          </p>

          <h2>Church Tax (Kirkeskat)</h2>
          <p>
            Members of the Danish National Church (Folkekirken) pay church tax at approximately 0.4% to 1.3% of their taxable income, depending on the municipality. About 73% of Danes are members of the national church. This tax is optional in the sense that you can opt out by leaving the church. If you are not a member, you do not pay church tax. The church tax rate varies by municipality and is included in this calculator as an optional component.
          </p>

          <h2>Personal Deduction (Personfradrag)</h2>
          <p>
            Every Danish taxpayer receives a personal deduction of 49,700 DKK for 2024. This amount is tax-free and reduces your taxable income before municipal tax and state tax are calculated. The personal deduction does not apply to AM-bidrag, which is calculated on gross income. For married couples, unused personal deductions can in some cases be transferred between spouses, providing additional tax benefits for households where one spouse earns significantly less.
          </p>

          <h2>Tax Ceiling (Skatteloft)</h2>
          <p>
            Denmark has a tax ceiling to prevent the combined tax rate from exceeding approximately 52.07% (excluding AM-bidrag and church tax). This means that even in municipalities with the highest tax rates, the total state and municipal tax combined cannot exceed this ceiling. When the ceiling applies, the topskat is effectively reduced. Including AM-bidrag, the maximum marginal tax rate is approximately 55.9%. This salary calculator Denmark tool provides an estimate based on standard rates.
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
            name: "Denmark Income Tax Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/denmark-income-tax`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "DKK" },
          }),
        }}
      />
    </>
  );
}
