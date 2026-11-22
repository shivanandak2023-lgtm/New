"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Spain Income Tax Calculator 2024 — Calculadora IRPF",
  description:
    "Free Spanish income tax calculator (calculadora IRPF). Calculate your IRPF with 2024 brackets (19%, 24%, 30%, 37%, 45%, 47%), social security, and net salary.",
  keywords:
    "Spain income tax calculator, calculadora IRPF, IRPF 2024, Spanish tax calculator, tramos IRPF, sueldo neto, calculo impuestos Espana",
};

const translations = {
  en: {
    title: "Spain Income Tax Calculator",
    subtitle: "Calculate your Spanish income tax (IRPF) with 2024 brackets, social security, and net salary.",
    grossLabel: "Gross Annual Salary (EUR)",
    paymentsLabel: "Salary Payments per Year",
    calculate: "Calculate Tax",
    netAnnual: "Annual Net Salary",
    netMonthly: "Monthly Net",
    effectiveRate: "Effective Tax Rate",
    breakdown: "Tax & Contributions Breakdown",
    component: "Component",
    annual: "Annual",
    monthly: "Monthly",
    gross: "Gross Salary",
    socialSec: "Social Security (6.35%)",
    irpf: "IRPF Income Tax",
    takeHome: "Net Salary",
    bracketBreakdown: "IRPF Bracket Breakdown",
    bracket: "Bracket",
    rate: "Rate",
    taxable: "Taxable",
    tax: "Tax",
    lang: "ES",
    payments12: "12 payments",
    payments14: "14 payments",
  },
  es: {
    title: "Calculadora IRPF 2024",
    subtitle: "Calcula tu IRPF con los tramos 2024, cotizaciones a la Seguridad Social y sueldo neto.",
    grossLabel: "Salario bruto anual (EUR)",
    paymentsLabel: "Pagas anuales",
    calculate: "Calcular",
    netAnnual: "Sueldo neto anual",
    netMonthly: "Neto mensual",
    effectiveRate: "Tipo efectivo",
    breakdown: "Desglose de impuestos y cotizaciones",
    component: "Concepto",
    annual: "Anual",
    monthly: "Mensual",
    gross: "Salario bruto",
    socialSec: "Seguridad Social (6,35%)",
    irpf: "IRPF",
    takeHome: "Sueldo neto",
    bracketBreakdown: "Desglose por tramos IRPF",
    bracket: "Tramo",
    rate: "Tipo",
    taxable: "Base imponible",
    tax: "Cuota",
    lang: "EN",
    payments12: "12 pagas",
    payments14: "14 pagas",
  },
};

const TAX_BRACKETS = [
  { limit: 12450, rate: 0.19 },
  { limit: 20200, rate: 0.24 },
  { limit: 35200, rate: 0.30 },
  { limit: 60000, rate: 0.37 },
  { limit: 300000, rate: 0.45 },
  { limit: Infinity, rate: 0.47 },
];

interface Result {
  gross: number;
  socialSecurity: number;
  taxableIncome: number;
  irpf: number;
  totalTax: number;
  net: number;
  effectiveRate: number;
  payments: number;
  bands: { bracket: string; rate: string; taxable: number; tax: number }[];
}

export default function SpainIncomeTaxPage() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [grossSalary, setGrossSalary] = useState<string>("30000");
  const [payments, setPayments] = useState<string>("14");
  const [result, setResult] = useState<Result | null>(null);

  const t = translations[lang];

  function calculate() {
    const gross = parseFloat(grossSalary) || 0;
    if (gross <= 0) return;

    // Social security employee contribution: ~6.35% (up to max base ~EUR 4,720.50/month)
    const ssCeiling = 56646;
    const socialSecurity = Math.min(gross, ssCeiling) * 0.0635;

    // Personal allowance: EUR 5,550 (general minimum)
    const personalAllowance = 5550;
    const taxableIncome = Math.max(0, gross - socialSecurity - personalAllowance);

    // Progressive IRPF
    let irpf = 0;
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
      irpf += tax;
      prev = b.limit;
    }

    const numPayments = parseInt(payments) || 14;
    const totalTax = socialSecurity + irpf;
    const net = gross - totalTax;
    const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;

    setResult({ gross, socialSecurity, taxableIncome, irpf, totalTax, net, effectiveRate, payments: numPayments, bands });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/spain-income-tax`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/spain-income-tax`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
          <button onClick={() => setLang(lang === "en" ? "es" : "en")} className="text-sm px-3 py-1 border border-[var(--card-border)] rounded hover:bg-[var(--muted-bg)]">
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
              <input type="number" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} className="input-field" placeholder="e.g., 30000" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.paymentsLabel}</label>
              <select value={payments} onChange={(e) => setPayments(e.target.value)} className="input-field">
                <option value="12">{t.payments12}</option>
                <option value="14">{t.payments14}</option>
              </select>
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
                <p className="text-2xl font-bold text-green-700">{fmtExact(result.net / result.payments)}</p>
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
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.gross / result.payments)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">{t.socialSec}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.socialSecurity)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.socialSecurity / result.payments)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">{t.irpf}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.irpf)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmtExact(result.irpf / result.payments)}</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">{t.takeHome}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.net)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.net / result.payments)}</td>
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
          <h2>How Does Spanish Income Tax (IRPF) Work?</h2>
          <p>
            Spain&rsquo;s personal income tax, IRPF (Impuesto sobre la Renta de las Personas Fisicas), uses a progressive system with six brackets for 2024. The state portion of the rates ranges from 9.5% to 24.5%, and autonomous communities add their own rates, bringing the combined totals to: 19% on the first EUR 12,450, 24% from EUR 12,450 to EUR 20,200, 30% from EUR 20,200 to EUR 35,200, 37% from EUR 35,200 to EUR 60,000, 45% from EUR 60,000 to EUR 300,000, and 47% above EUR 300,000. This calculadora IRPF applies the combined state and general autonomous community rates to estimate your sueldo neto.
          </p>

          <h2>Social Security Contributions in Spain</h2>
          <p>
            Spanish employees contribute approximately 6.35% of their gross salary to Social Security (Seguridad Social), broken down into common contingencies (4.70%), unemployment (1.55%), and training (0.10%). These contributions are capped at a maximum monthly base of approximately EUR 4,720.50 (about EUR 56,646 annually). Employers pay an additional approximately 30-35% of gross salary in social security contributions. The Spanish social security system funds public healthcare, pensions, unemployment benefits, and disability coverage. Self-employed workers (autonomos) pay a separate monthly quota based on their chosen contribution base.
          </p>

          <h2>14-Pay System (Pagas Extras)</h2>
          <p>
            Most Spanish employees receive 14 salary payments per year rather than 12. The two extra payments (pagas extraordinarias) are typically paid in June and December. Some companies allow employees to choose between 12 or 14 payments, with the annual total being the same. When receiving 14 payments, each monthly paycheck is smaller (1/14th of annual salary instead of 1/12th), but you receive two additional full salary payments during the year. This calculator lets you choose between 12 and 14 payments to show the correct monthly net salary. The total annual tax is the same regardless of payment frequency.
          </p>

          <h2>Autonomous Community Tax Differences</h2>
          <p>
            Spain&rsquo;s IRPF is split between the state (approximately 50%) and the autonomous communities (approximately 50%). While the state rates are uniform nationwide, each autonomous community sets its own complementary rates and deductions. This means your effective tax rate can vary depending on where you live. For example, Madrid has traditionally offered lower autonomous community rates and more generous deductions, while Catalonia and Andalusia have had higher rates for top earners. Some communities also offer specific deductions for rent, birth of children, home purchases, or investment in startups.
          </p>

          <h2>Tax Deductions and Allowances</h2>
          <p>
            Spain provides a personal minimum allowance (minimo personal) of EUR 5,550 per year that reduces taxable income. Additional allowances exist for descendants (EUR 2,400 for the first child, EUR 2,700 for the second, EUR 4,000 for the third), ascendants living with you, and disability. Workers can deduct social security contributions, union fees, and professional expenses. Homeowners who purchased their primary residence before 2013 can still deduct 15% of mortgage payments up to EUR 9,040. Pension plan contributions are deductible up to EUR 1,500 per year (or EUR 8,500 with employer contributions). Donations to qualifying organizations provide a 80% deduction on the first EUR 150 and 35% on amounts above.
          </p>

          <h2>Beckham Law for Expats</h2>
          <p>
            Spain offers a special tax regime popularly known as the Beckham Law (Regimen de Impatriados) for workers who move to Spain. Under this regime, qualifying individuals are taxed at a flat 24% on Spanish-source income up to EUR 600,000 (instead of progressive rates up to 47%), and at 47% on income above EUR 600,000. Capital gains on Spanish investments are taxed at 24%. This regime applies for the year of arrival and the following five tax years. To qualify, you must not have been a Spanish tax resident in the previous five years. This special regime makes Spain particularly attractive for high-earning professionals and is separate from the standard IRPF calculation in this tool.
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
            name: "Spain Income Tax Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/spain-income-tax`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
