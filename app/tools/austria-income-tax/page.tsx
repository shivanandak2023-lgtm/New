"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Austria Income Tax Calculator 2024 — Einkommensteuerrechner",
  description:
    "Free Austrian income tax calculator (Einkommensteuerrechner). Calculate your Lohnsteuer with 2024 brackets (0%, 20%, 30%, 40%, 48%, 50%), social contributions, and net salary.",
  keywords:
    "Austria income tax calculator, Einkommensteuerrechner, Lohnsteuer Rechner, Austrian tax brackets 2024, Brutto Netto Rechner Oesterreich, Austrian salary calculator",
};

const translations = {
  en: {
    title: "Austria Income Tax Calculator",
    subtitle: "Calculate your Austrian income tax (Lohnsteuer) with 2024 brackets, social contributions, and net salary.",
    grossLabel: "Gross Annual Salary (EUR)",
    calculate: "Calculate Tax",
    netAnnual: "Annual Net Salary",
    netMonthly: "Monthly Net (14x)",
    effectiveRate: "Effective Tax Rate",
    breakdown: "Tax & Social Contribution Breakdown",
    component: "Component",
    annual: "Annual",
    monthly: "Monthly (14x)",
    gross: "Gross Salary",
    socialIns: "Social Insurance (18.12%)",
    incomeTax: "Income Tax (Lohnsteuer)",
    takeHome: "Net Salary",
    bracketBreakdown: "Income Tax Bracket Breakdown",
    bracket: "Bracket",
    rate: "Rate",
    taxable: "Taxable",
    tax: "Tax",
    lang: "DE",
  },
  de: {
    title: "Einkommensteuerrechner Oesterreich",
    subtitle: "Berechnen Sie Ihre Lohnsteuer mit den Tarifstufen 2024, Sozialversicherung und Nettolohn.",
    grossLabel: "Bruttojahresgehalt (EUR)",
    calculate: "Steuer berechnen",
    netAnnual: "Jahresnettolohn",
    netMonthly: "Monatlich netto (14x)",
    effectiveRate: "Effektiver Steuersatz",
    breakdown: "Steuer- & Sozialversicherungsaufstellung",
    component: "Komponente",
    annual: "Jaehrlich",
    monthly: "Monatlich (14x)",
    gross: "Bruttolohn",
    socialIns: "Sozialversicherung (18,12%)",
    incomeTax: "Lohnsteuer",
    takeHome: "Nettolohn",
    bracketBreakdown: "Lohnsteuer nach Tarifstufen",
    bracket: "Tarifstufe",
    rate: "Steuersatz",
    taxable: "Steuerpflichtiger Betrag",
    tax: "Steuer",
    lang: "EN",
  },
};

const TAX_BRACKETS = [
  { limit: 11693, rate: 0 },
  { limit: 19134, rate: 0.20 },
  { limit: 32075, rate: 0.30 },
  { limit: 62080, rate: 0.40 },
  { limit: 93120, rate: 0.48 },
  { limit: 1000000, rate: 0.50 },
  { limit: Infinity, rate: 0.55 },
];

interface Result {
  gross: number;
  socialInsurance: number;
  taxableIncome: number;
  incomeTax: number;
  net: number;
  effectiveRate: number;
  bands: { bracket: string; rate: string; taxable: number; tax: number }[];
}

export default function AustriaIncomeTaxPage() {
  const [lang, setLang] = useState<"en" | "de">("en");
  const [grossSalary, setGrossSalary] = useState<string>("45000");
  const [result, setResult] = useState<Result | null>(null);

  const t = translations[lang];

  function calculate() {
    const gross = parseFloat(grossSalary) || 0;
    if (gross <= 0) return;

    // Social insurance (employee): ~18.12% up to ceiling of EUR 5,850/month (EUR 81,900/year)
    const socialCeiling = 81900;
    const socialRate = 0.1812;
    const socialInsurance = Math.min(gross, socialCeiling) * socialRate;

    const taxableIncome = Math.max(0, gross - socialInsurance);

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

    const totalDeductions = socialInsurance + incomeTax;
    const net = gross - totalDeductions;
    const effectiveRate = gross > 0 ? (totalDeductions / gross) * 100 : 0;

    setResult({ gross, socialInsurance, taxableIncome, incomeTax, net, effectiveRate, bands });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/austria-income-tax`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/austria-income-tax`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
          <button onClick={() => setLang(lang === "en" ? "de" : "en")} className="text-sm px-3 py-1 border border-[var(--card-border)] rounded hover:bg-[var(--muted-bg)]">
            {t.lang}
          </button>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">{t.title}</h1>
        <p className="text-[var(--muted)] mb-8">{t.subtitle}</p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">{t.grossLabel}</label>
            <input type="number" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} className="input-field" placeholder="e.g., 45000" min="0" />
          </div>
          <button onClick={calculate} className="btn-primary mt-6">{t.calculate}</button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t.netAnnual}</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmtExact(result.net)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t.netMonthly}</p>
                <p className="text-2xl font-bold text-green-700">{fmtExact(result.net / 14)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t.effectiveRate}</p>
                <p className="text-2xl font-bold">{result.effectiveRate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">{t.breakdown}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">{t.component}</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t.annual}</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t.monthly}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{t.gross}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.gross)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.gross / 14)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">{t.socialIns}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.socialInsurance)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.socialInsurance / 14)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">{t.incomeTax}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.incomeTax)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.incomeTax / 14)}</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">{t.takeHome}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.net)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.net / 14)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">{t.bracketBreakdown}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">{t.bracket}</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t.rate}</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t.taxable}</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t.tax}</th>
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
          <h2>How Does Austrian Income Tax Work?</h2>
          <p>
            Austria uses a progressive income tax system (Einkommensteuer) with seven brackets for 2024. The first EUR 11,693 is tax-free, then rates progress from 20% through 30%, 40%, 48%, 50%, and finally 55% for income above EUR 1,000,000. This Austrian income tax calculator (Einkommensteuerrechner) applies these brackets after deducting social insurance contributions, giving you an accurate estimate of your Lohnsteuer and net salary. Austria also features a unique 14-pay system where employees receive their salary 14 times per year, with the 13th and 14th salaries (Urlaubs- and Weihnachtsgeld) taxed at a favorable flat rate of approximately 6%.
          </p>

          <h2>Austrian Social Insurance Contributions</h2>
          <p>
            All employees in Austria must pay social insurance contributions (Sozialversicherungsbeitraege) totaling approximately 18.12% of gross salary, up to a monthly ceiling of EUR 5,850 (EUR 81,900 annually). This breaks down into pension insurance (Pensionsversicherung) at 10.25%, health insurance (Krankenversicherung) at 3.87%, unemployment insurance (Arbeitslosenversicherung) at 3%, and other minor contributions. Your employer pays an additional approximately 21.23% on top of your gross salary. These contributions fund the comprehensive Austrian social security system including public healthcare, pension, unemployment benefits, and accident insurance.
          </p>

          <h2>The 13th and 14th Month Salary</h2>
          <p>
            A distinctive feature of Austrian employment is that employees receive 14 monthly salary payments per year. The 13th salary (Urlaubsgeld, vacation bonus) is typically paid in June, and the 14th salary (Weihnachtsgeld, Christmas bonus) in November. These additional payments are taxed at a highly favorable flat rate of approximately 6% (after a tax-free allowance of EUR 620), rather than the regular progressive income tax rates. This means the effective overall tax rate for Austrian employees is lower than the bracket rates alone would suggest, making the 14-pay system a significant tax advantage unique to Austria.
          </p>

          <h2>Tax Credits and Deductions in Austria</h2>
          <p>
            Austria provides several tax credits (Absetzbetraege) that directly reduce your tax liability. The most important is the Verkehrsabsetzbetrag (commuter tax credit) of EUR 421 per year for all employees. Commuters receive additional credits based on distance (Pendlerpauschale). The Alleinverdienerabsetzbetrag (sole earner credit) benefits single-income families with children, worth EUR 494-669 depending on the number of children. Families also receive the Familienbonus Plus of up to EUR 2,000 per child per year (EUR 650 for children over 18). These credits can significantly reduce your effective tax rate.
          </p>

          <h2>Austrian Tax Return and Filing</h2>
          <p>
            Austrian employees under PAYE (Lohnsteuer) generally do not need to file a tax return, as their employer withholds all required taxes. However, filing voluntarily (Arbeitnehmerveranlagung) is recommended to claim additional deductions and credits that may result in a refund. Deductible expenses include professional development costs, work-related travel, home office expenses (up to EUR 300/year), donations to approved organizations, church tax (up to EUR 400), and childcare costs. The Austrian tax office (Finanzamt) allows electronic filing through FinanzOnline, and voluntary returns can be filed for up to five years retroactively.
          </p>

          <h2>Comparing Austrian Tax with Neighboring Countries</h2>
          <p>
            Austria&rsquo;s tax system is comparable to Germany but with some key differences. The top marginal rate of 55% for income over EUR 1 million is higher than Germany&rsquo;s 45% (plus solidarity surcharge). However, Austria&rsquo;s 14-pay system with favorable taxation on the 13th and 14th salaries often results in a lower effective rate. Social insurance contributions are slightly lower in Austria than in Germany. Compared to Switzerland, Austria has significantly higher tax rates but provides more comprehensive public services. This Brutto Netto Rechner Oesterreich helps you understand your actual take-home pay after all Austrian deductions and contributions.
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
            name: "Austria Income Tax Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/austria-income-tax`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
