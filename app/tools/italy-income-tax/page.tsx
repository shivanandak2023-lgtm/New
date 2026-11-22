"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Italy Income Tax Calculator 2024 — Calcolo IRPEF",
  description:
    "Free Italian income tax calculator (calcolo IRPEF). Calculate your IRPEF with 2024 brackets (23%, 35%, 43%), social contributions (INPS), and net salary.",
  keywords:
    "Italy income tax calculator, calcolo IRPEF, IRPEF 2024, Italian tax calculator, aliquote IRPEF, stipendio netto, calcolatore tasse Italia",
};

const translations = {
  en: {
    title: "Italy Income Tax Calculator",
    subtitle: "Calculate your Italian income tax (IRPEF) with 2024 brackets, INPS social contributions, and net salary.",
    grossLabel: "Gross Annual Salary (EUR)",
    regionLabel: "Regional Surcharge (%)",
    municipalLabel: "Municipal Surcharge (%)",
    calculate: "Calculate Tax",
    netAnnual: "Annual Net Salary",
    netMonthly: "Monthly Net (13x)",
    effectiveRate: "Effective Tax Rate",
    breakdown: "Tax & Contributions Breakdown",
    component: "Component",
    annual: "Annual",
    monthly: "Monthly",
    gross: "Gross Salary",
    inps: "INPS Social Contributions (9.19%)",
    irpef: "IRPEF Income Tax",
    regional: "Regional Surcharge",
    municipal: "Municipal Surcharge",
    takeHome: "Net Salary",
    bracketBreakdown: "IRPEF Bracket Breakdown",
    bracket: "Bracket",
    rate: "Rate",
    taxable: "Taxable",
    tax: "Tax",
    lang: "IT",
  },
  it: {
    title: "Calcolo IRPEF 2024",
    subtitle: "Calcola la tua IRPEF con le aliquote 2024, i contributi INPS e lo stipendio netto.",
    grossLabel: "Stipendio lordo annuale (EUR)",
    regionLabel: "Addizionale regionale (%)",
    municipalLabel: "Addizionale comunale (%)",
    calculate: "Calcola",
    netAnnual: "Stipendio netto annuale",
    netMonthly: "Netto mensile (13x)",
    effectiveRate: "Aliquota effettiva",
    breakdown: "Dettaglio tasse e contributi",
    component: "Componente",
    annual: "Annuale",
    monthly: "Mensile",
    gross: "Stipendio lordo",
    inps: "Contributi INPS (9,19%)",
    irpef: "IRPEF",
    regional: "Addizionale regionale",
    municipal: "Addizionale comunale",
    takeHome: "Stipendio netto",
    bracketBreakdown: "Dettaglio scaglioni IRPEF",
    bracket: "Scaglione",
    rate: "Aliquota",
    taxable: "Imponibile",
    tax: "Imposta",
    lang: "EN",
  },
};

const TAX_BRACKETS = [
  { limit: 28000, rate: 0.23 },
  { limit: 50000, rate: 0.35 },
  { limit: Infinity, rate: 0.43 },
];

interface Result {
  gross: number;
  inps: number;
  taxableIncome: number;
  irpef: number;
  regionalTax: number;
  municipalTax: number;
  totalTax: number;
  net: number;
  effectiveRate: number;
  bands: { bracket: string; rate: string; taxable: number; tax: number }[];
}

export default function ItalyIncomeTaxPage() {
  const [lang, setLang] = useState<"en" | "it">("en");
  const [grossSalary, setGrossSalary] = useState<string>("35000");
  const [regionalRate, setRegionalRate] = useState<string>("1.73");
  const [municipalRate, setMunicipalRate] = useState<string>("0.8");
  const [result, setResult] = useState<Result | null>(null);

  const t = translations[lang];

  function calculate() {
    const gross = parseFloat(grossSalary) || 0;
    if (gross <= 0) return;

    // INPS employee contribution: 9.19% (up to ceiling ~EUR 113,520)
    const inpsCeiling = 113520;
    const inps = Math.min(gross, inpsCeiling) * 0.0919;

    const taxableIncome = gross - inps;

    // IRPEF progressive tax
    let irpef = 0;
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
      irpef += tax;
      prev = b.limit;
    }

    // Tax credit for employees (detrazione lavoro dipendente)
    let taxCredit = 0;
    if (taxableIncome <= 15000) {
      taxCredit = 1955;
    } else if (taxableIncome <= 28000) {
      taxCredit = 1910 + 1190 * ((28000 - taxableIncome) / 13000);
    } else if (taxableIncome <= 50000) {
      taxCredit = 1910 * ((50000 - taxableIncome) / 22000);
    }
    irpef = Math.max(0, irpef - taxCredit);

    // Regional surcharge (addizionale regionale): ~1.23% to 3.33%
    const regRate = parseFloat(regionalRate) / 100 || 0.0173;
    const regionalTax = taxableIncome * regRate;

    // Municipal surcharge (addizionale comunale): 0% to ~0.9%
    const munRate = parseFloat(municipalRate) / 100 || 0.008;
    const municipalTax = taxableIncome * munRate;

    const totalTax = inps + irpef + regionalTax + municipalTax;
    const net = gross - totalTax;
    const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;

    setResult({ gross, inps, taxableIncome, irpef, regionalTax, municipalTax, totalTax, net, effectiveRate, bands });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/italy-income-tax`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/italy-income-tax`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
          <button onClick={() => setLang(lang === "en" ? "it" : "en")} className="text-sm px-3 py-1 border border-[var(--card-border)] rounded hover:bg-[var(--muted-bg)]">
            {t.lang}
          </button>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">{t.title}</h1>
        <p className="text-[var(--muted)] mb-8">{t.subtitle}</p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">{t.grossLabel}</label>
              <input type="number" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} className="input-field" placeholder="e.g., 35000" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.regionLabel}</label>
              <input type="number" value={regionalRate} onChange={(e) => setRegionalRate(e.target.value)} className="input-field" placeholder="e.g., 1.73" min="0" max="4" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.municipalLabel}</label>
              <input type="number" value={municipalRate} onChange={(e) => setMunicipalRate(e.target.value)} className="input-field" placeholder="e.g., 0.8" min="0" max="1" step="0.1" />
            </div>
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
                <p className="text-2xl font-bold text-green-700">{fmtExact(result.net / 13)}</p>
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
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.gross / 13)}</td>
                    </tr>
                    {[
                      { label: t.inps, value: result.inps },
                      { label: t.irpef, value: result.irpef },
                      { label: t.regional, value: result.regionalTax },
                      { label: t.municipal, value: result.municipalTax },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">{row.label}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(row.value)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(row.value / 13)}</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">{t.takeHome}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.net)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.net / 13)}</td>
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
          <h2>How Does Italian Income Tax (IRPEF) Work?</h2>
          <p>
            Italy&rsquo;s income tax, known as IRPEF (Imposta sul Reddito delle Persone Fisiche), uses a progressive system with three brackets for 2024: 23% on income up to EUR 28,000, 35% from EUR 28,000 to EUR 50,000, and 43% on income above EUR 50,000. The 2024 reform simplified the previous five-bracket system into three brackets. This calcolo IRPEF calculator applies these rates after deducting INPS social contributions from your gross salary, giving you an accurate estimate of your stipendio netto (net salary). Italy also applies regional and municipal surcharges on top of the national IRPEF.
          </p>

          <h2>INPS Social Contributions</h2>
          <p>
            All Italian employees contribute to INPS (Istituto Nazionale della Previdenza Sociale) at a rate of approximately 9.19% of gross salary, up to an annual ceiling of about EUR 113,520. Your employer pays an additional approximately 30% on top of your gross salary. These contributions fund Italy&rsquo;s public pension system, unemployment benefits, sickness pay, maternity leave, and other social insurance programs. The INPS contribution is deducted before IRPEF is calculated, so it reduces your taxable income. Self-employed workers and certain contractors pay different INPS rates and may contribute to separate funds (gestione separata).
          </p>

          <h2>Tax Credits for Employees</h2>
          <p>
            Italian employees benefit from a tax credit (detrazione per lavoro dipendente) that reduces IRPEF. For 2024, the credit is EUR 1,955 for incomes up to EUR 15,000, gradually decreasing to EUR 1,910 for incomes up to EUR 28,000, and further decreasing to zero at EUR 50,000. Additionally, families receive tax credits for dependent spouses and children, though the introduction of the Assegno Unico (universal child benefit) in 2022 replaced most child-related tax deductions with a direct monthly payment. Medical expenses, mortgage interest (on primary residence), education costs, and renovation expenses also provide tax deductions or credits.
          </p>

          <h2>Regional and Municipal Surcharges</h2>
          <p>
            In addition to national IRPEF, Italy levies regional (addizionale regionale) and municipal (addizionale comunale) surcharges on taxable income. Regional rates vary from about 1.23% to 3.33%, with Lazio and Campania among the highest. Municipal surcharges range from 0% to approximately 0.9%. These surcharges are calculated on the same taxable income as IRPEF but are paid to the respective regional and municipal governments. When evaluating job offers in different Italian regions, these surcharges can create a meaningful difference in net pay. This Italian tax calculator allows you to input your specific regional and municipal rates.
          </p>

          <h2>The 13th Month Salary (Tredicesima)</h2>
          <p>
            Italian employees receive their salary 13 times per year. The 13th salary payment (tredicesima mensilita) is typically paid in December and is subject to the same tax and social contribution rates as regular monthly salary. Some sectors and collective agreements (CCNL) also provide a 14th month payment (quattordicesima), particularly in commerce, tourism, and certain industrial sectors. The 13th and 14th payments are included in the annual gross salary figure, so when this calculator shows a monthly net figure, it divides the annual net by 13 to reflect the actual monthly take-home pay including the tredicesima.
          </p>

          <h2>Flat Tax Regime for New Residents</h2>
          <p>
            Italy offers a special flat tax regime (regime forfettario) for new tax residents who transfer their tax residence to Italy. High-net-worth individuals can opt for a flat tax of EUR 100,000 per year on all foreign-source income, regardless of the actual amount. This program, known as the flat tax for neo-residents, has attracted wealthy individuals from other countries. Additionally, the impatriate regime offers a 70% exemption on employment income (90% if moving to southern Italy) for workers who transfer their tax residence to Italy, making it highly attractive for professionals relocating. These special regimes are separate from the standard IRPEF calculation provided by this calculator.
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
            name: "Italy Income Tax Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/italy-income-tax`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
