"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Swiss Salary Calculator 2024 — Brutto to Netto",
  description:
    "Free Swiss salary calculator. Calculate your net salary after AHV/IV/EO, ALV, pension (BVG), and cantonal/federal income tax. Supports all 26 cantons with accurate 2024 rates.",
  keywords:
    "Swiss salary calculator, Lohnrechner Schweiz, Brutto Netto Rechner Schweiz, AHV calculator, Swiss tax calculator, canton tax rates, Quellensteuer, Swiss net salary",
};

const translations = {
  en: {
    title: "Swiss Salary Calculator",
    subtitle: "Calculate your net salary after AHV, ALV, pension (BVG), and cantonal/federal income tax in Switzerland.",
    grossLabel: "Gross Annual Salary (CHF)",
    cantonLabel: "Canton",
    churchLabel: "Church Tax",
    childrenLabel: "Number of Children",
    maritalLabel: "Marital Status",
    single: "Single",
    married: "Married",
    calculate: "Calculate Net Salary",
    netAnnual: "Annual Net Salary",
    netMonthly: "Monthly Net Salary",
    effectiveRate: "Effective Tax & Deduction Rate",
    breakdown: "Salary Breakdown",
    component: "Component",
    annual: "Annual",
    monthly: "Monthly",
    gross: "Gross Salary",
    ahv: "AHV/IV/EO (5.3%)",
    alv: "ALV (1.1%)",
    bvg: "BVG Pension (est.)",
    federalTax: "Federal Tax",
    cantonalTax: "Cantonal & Municipal Tax",
    churchTaxLabel: "Church Tax",
    takeHome: "Net Salary",
    lang: "DE",
  },
  de: {
    title: "Lohnrechner Schweiz",
    subtitle: "Berechnen Sie Ihren Nettolohn nach AHV, ALV, BVG und Kantons-/Bundessteuern in der Schweiz.",
    grossLabel: "Bruttolohn pro Jahr (CHF)",
    cantonLabel: "Kanton",
    churchLabel: "Kirchensteuer",
    childrenLabel: "Anzahl Kinder",
    maritalLabel: "Zivilstand",
    single: "Ledig",
    married: "Verheiratet",
    calculate: "Nettolohn berechnen",
    netAnnual: "Jahresnettolohn",
    netMonthly: "Monatlicher Nettolohn",
    effectiveRate: "Effektiver Abzugssatz",
    breakdown: "Lohnabrechnung",
    component: "Komponente",
    annual: "Jaehrlich",
    monthly: "Monatlich",
    gross: "Bruttolohn",
    ahv: "AHV/IV/EO (5,3%)",
    alv: "ALV (1,1%)",
    bvg: "BVG-Beitraege (ca.)",
    federalTax: "Bundessteuer",
    cantonalTax: "Kantons- & Gemeindesteuer",
    churchTaxLabel: "Kirchensteuer",
    takeHome: "Nettolohn",
    lang: "EN",
  },
};

const CANTONS: { code: string; name: string; rate: number }[] = [
  { code: "ZH", name: "Zuerich", rate: 0.1190 },
  { code: "BE", name: "Bern", rate: 0.1540 },
  { code: "LU", name: "Luzern", rate: 0.1230 },
  { code: "UR", name: "Uri", rate: 0.1100 },
  { code: "SZ", name: "Schwyz", rate: 0.0820 },
  { code: "OW", name: "Obwalden", rate: 0.0960 },
  { code: "NW", name: "Nidwalden", rate: 0.0930 },
  { code: "GL", name: "Glarus", rate: 0.1280 },
  { code: "ZG", name: "Zug", rate: 0.0620 },
  { code: "FR", name: "Fribourg", rate: 0.1510 },
  { code: "SO", name: "Solothurn", rate: 0.1360 },
  { code: "BS", name: "Basel-Stadt", rate: 0.1510 },
  { code: "BL", name: "Basel-Landschaft", rate: 0.1340 },
  { code: "SH", name: "Schaffhausen", rate: 0.1180 },
  { code: "AR", name: "Appenzell A.Rh.", rate: 0.1340 },
  { code: "AI", name: "Appenzell I.Rh.", rate: 0.0980 },
  { code: "SG", name: "St. Gallen", rate: 0.1300 },
  { code: "GR", name: "Graubuenden", rate: 0.1200 },
  { code: "AG", name: "Aargau", rate: 0.1130 },
  { code: "TG", name: "Thurgau", rate: 0.1150 },
  { code: "TI", name: "Ticino", rate: 0.1340 },
  { code: "VD", name: "Vaud", rate: 0.1540 },
  { code: "VS", name: "Valais", rate: 0.1300 },
  { code: "NE", name: "Neuchatel", rate: 0.1580 },
  { code: "GE", name: "Geneve", rate: 0.1470 },
  { code: "JU", name: "Jura", rate: 0.1600 },
];

interface Result {
  gross: number;
  ahv: number;
  alv: number;
  bvg: number;
  federalTax: number;
  cantonalTax: number;
  churchTax: number;
  net: number;
  effectiveRate: number;
}

export default function SwissSalaryCalculatorPage() {
  const [lang, setLang] = useState<"en" | "de">("en");
  const [grossSalary, setGrossSalary] = useState<string>("100000");
  const [canton, setCanton] = useState<string>("ZH");
  const [churchTax, setChurchTax] = useState<boolean>(false);
  const [children, setChildren] = useState<string>("0");
  const [marital, setMarital] = useState<string>("single");
  const [result, setResult] = useState<Result | null>(null);

  const t = translations[lang];

  function calculate() {
    const gross = parseFloat(grossSalary) || 0;
    if (gross <= 0) return;

    const ahv = gross * 0.053;
    const alv = Math.min(gross, 148200) * 0.011;

    const coordinationDeduction = 25725;
    const bvgSalary = Math.max(0, Math.min(gross, 88200) - coordinationDeduction);
    const bvg = bvgSalary * 0.07;

    const socialDeductions = ahv + alv + bvg;
    let taxableIncome = gross - socialDeductions;

    if (marital === "married") taxableIncome -= 2600;
    const numChildren = parseInt(children) || 0;
    taxableIncome -= numChildren * 6500;
    taxableIncome = Math.max(0, taxableIncome);

    let federalTax = 0;
    const fedBrackets = [
      { limit: 17800, rate: 0 },
      { limit: 31600, rate: 0.0077 },
      { limit: 41400, rate: 0.0088 },
      { limit: 55200, rate: 0.0264 },
      { limit: 72500, rate: 0.0297 },
      { limit: 78100, rate: 0.0561 },
      { limit: 103600, rate: 0.0624 },
      { limit: 134600, rate: 0.0668 },
      { limit: 176000, rate: 0.0890 },
      { limit: Infinity, rate: 0.1100 },
    ];
    let prev = 0;
    let rem = taxableIncome;
    for (const b of fedBrackets) {
      const width = b.limit - prev;
      const taxable = Math.min(rem, width);
      federalTax += taxable * b.rate;
      rem -= taxable;
      prev = b.limit;
      if (rem <= 0) break;
    }

    const cantonData = CANTONS.find((c) => c.code === canton);
    const cantonalRate = cantonData ? cantonData.rate : 0.12;
    const cantonalTax = taxableIncome * cantonalRate;

    const church = churchTax ? cantonalTax * 0.09 : 0;

    const totalDeductions = ahv + alv + bvg + federalTax + cantonalTax + church;
    const net = gross - totalDeductions;
    const effectiveRate = gross > 0 ? (totalDeductions / gross) * 100 : 0;

    setResult({ gross, ahv, alv, bvg, federalTax, cantonalTax, churchTax: church, net, effectiveRate });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/swiss-salary-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/swiss-salary-calculator`} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">{t.grossLabel}</label>
              <input type="number" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} className="input-field" placeholder="e.g., 100000" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.cantonLabel}</label>
              <select value={canton} onChange={(e) => setCanton(e.target.value)} className="input-field">
                {CANTONS.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} &mdash; {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.maritalLabel}</label>
              <select value={marital} onChange={(e) => setMarital(e.target.value)} className="input-field">
                <option value="single">{t.single}</option>
                <option value="married">{t.married}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.childrenLabel}</label>
              <input type="number" value={children} onChange={(e) => setChildren(e.target.value)} className="input-field" min="0" max="10" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input type="checkbox" id="churchTax" checked={churchTax} onChange={(e) => setChurchTax(e.target.checked)} className="w-5 h-5 accent-[var(--primary)]" />
            <label htmlFor="churchTax" className="text-sm font-medium">{t.churchLabel}</label>
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
                <p className="text-2xl font-bold text-green-700">{fmtExact(result.net / 12)}</p>
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
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.gross / 12)}</td>
                    </tr>
                    {[
                      { label: t.ahv, value: result.ahv },
                      { label: t.alv, value: result.alv },
                      { label: t.bvg, value: result.bvg },
                      { label: t.federalTax, value: result.federalTax },
                      { label: t.cantonalTax, value: result.cantonalTax },
                      ...(result.churchTax > 0 ? [{ label: t.churchTaxLabel, value: result.churchTax }] : []),
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">{row.label}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(row.value)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(row.value / 12)}</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">{t.takeHome}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.net)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.net / 12)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does the Swiss Tax System Work?</h2>
          <p>
            Switzerland has a unique three-tier taxation system where taxes are levied at the federal, cantonal, and municipal levels. This Swiss salary calculator (Lohnrechner Schweiz) accounts for all three levels plus mandatory social security contributions. The federal direct tax uses progressive rates set by the federal government, while cantonal and municipal taxes vary significantly across Switzerland&rsquo;s 26 cantons. For example, Zug has one of the lowest cantonal tax rates at around 6.2%, while Jura can be as high as 16%. Understanding which canton you work and live in is essential for accurately estimating your Brutto-Netto (gross-to-net) take-home pay.
          </p>

          <h2>AHV/IV/EO Social Security Contributions</h2>
          <p>
            All employees in Switzerland must contribute 5.3% of their gross salary to the AHV (old-age and survivors insurance), IV (disability insurance), and EO (loss of earnings compensation). Your employer matches this contribution, paying another 5.3%. The combined 10.6% funds the first pillar of Switzerland&rsquo;s three-pillar retirement system. The AHV provides a basic state pension upon retirement, with the maximum single pension being around CHF 29,400 per year. This calculator automatically deducts the employee&rsquo;s 5.3% share from your gross salary.
          </p>

          <h2>ALV Unemployment Insurance</h2>
          <p>
            Unemployment insurance (ALV/AC) is mandatory at 1.1% of salary up to CHF 148,200. Above this threshold, an additional solidarity contribution of 0.5% applies. This insurance provides income replacement benefits if you lose your job, covering up to 70-80% of your insured salary for a defined period depending on your age and contribution history. Both employee and employer each pay 1.1%, so the total ALV contribution is 2.2% of gross salary up to the ceiling.
          </p>

          <h2>BVG Occupational Pension (Second Pillar)</h2>
          <p>
            The BVG (Berufliche Vorsorge) is the second pillar of the Swiss pension system. Contributions are based on the coordinated salary, the portion of your salary between CHF 25,725 (coordination deduction) and CHF 88,200. The contribution rate depends on your age: 7% for ages 25-34, 10% for ages 35-44, 15% for ages 45-54, and 18% for ages 55-65, split equally between employee and employer. This calculator uses an estimated 7% rate, but your actual rate may differ based on your age and your employer&rsquo;s pension plan, which may offer above-minimum benefits.
          </p>

          <h2>Cantonal Tax Differences in Switzerland</h2>
          <p>
            One of the most distinctive features of the Swiss tax system is the wide variation in cantonal and municipal tax rates. The canton of Zug is famous for having the lowest tax burden in Switzerland, making it attractive to high earners and businesses. In contrast, cantons like Jura, Neuchatel, and Bern have significantly higher rates. When comparing job offers across cantons, the difference in take-home pay can be substantial even for the same gross salary. Church tax, where applicable, is typically calculated as a percentage (around 8-10%) of your cantonal tax and is optional in most cantons.
          </p>

          <h2>Federal Direct Tax Rates</h2>
          <p>
            The Swiss federal direct tax uses a progressive rate structure that starts at 0% for the first CHF 17,800 of taxable income and gradually increases to a maximum marginal rate of about 11.5% on very high incomes. Married couples benefit from joint taxation with wider brackets, and families receive deductions of CHF 6,500 per child. The federal tax is relatively modest compared to cantonal taxes. In most cases, your cantonal and municipal taxes combined will be two to four times higher than the federal portion. This Brutto-Netto Rechner Schweiz applies both levels to give you an accurate total deduction estimate.
          </p>

          <h2>Comparing Swiss Salaries Across Cantons</h2>
          <p>
            When evaluating a Swiss salary offer, always consider the canton of residence, not just the gross figure. A CHF 100,000 salary in Zug yields significantly more net income than the same salary in Geneva or Basel. Additionally, consider that cost of living varies by region. Zurich and Geneva are among the most expensive cities globally, while smaller cantons may offer lower rents. Using this Swiss net salary calculator with different canton selections helps you make informed decisions about relocating within Switzerland or evaluating competing job offers. Remember that cross-border workers may have different tax arrangements depending on bilateral agreements.
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
            name: "Swiss Salary Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/swiss-salary-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "CHF" },
          }),
        }}
      />
    </>
  );
}
