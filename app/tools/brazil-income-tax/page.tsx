"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import LanguageSwitcher, { useTranslation, type LangCode } from "@/components/LanguageSwitcher";

const META = {
  title: "IRPF Calculator Brazil - Calculadora Imposto de Renda 2024",
  description:
    "Free Brazilian income tax (IRPF) calculator. Calculate your monthly tax with 2024 rates, dependent deductions, and INSS deduction. Calculadora IRPF com deducoes.",
  keywords: "calculadora IRPF, imposto de renda calculadora, income tax calculator Brazil, IRPF 2024, imposto de renda 2024",
};

const IRPF_BANDS = [
  { min: 0, max: 2259.20, rate: 0, deduction: 0 },
  { min: 2259.20, max: 2826.65, rate: 0.075, deduction: 169.44 },
  { min: 2826.65, max: 3751.05, rate: 0.15, deduction: 381.44 },
  { min: 3751.05, max: 4664.68, rate: 0.225, deduction: 662.77 },
  { min: 4664.68, max: Infinity, rate: 0.275, deduction: 896.00 },
];

const DEPENDENT_DEDUCTION = 189.59;

const translations: Record<LangCode, Record<string, string>> = {
  en: {
    title: "IRPF Calculator (Brazil Income Tax)",
    subtitle: "Calculate your Brazilian monthly income tax (IRPF) with 2024 rates, dependents, and INSS deduction.",
    monthlyIncome: "Monthly Income",
    incomePlaceholder: "Enter gross monthly income",
    dependents: "Number of Dependents",
    inssDeduction: "INSS Deduction",
    inssPlaceholder: "Enter INSS contribution amount",
    inssHint: "Use the INSS Calculator to find this value",
    calculate: "Calculate IRPF",
    taxableBase: "Taxable Base",
    incomeTax: "Income Tax (IRPF)",
    effectiveRate: "Effective Rate",
    netIncome: "Net Income",
    breakdownTitle: "Tax Calculation Breakdown",
    deductionsTitle: "Deductions Applied",
    grossIncome: "Gross Income",
    inssLabel: "INSS Deduction",
    dependentsDeduction: "Dependents Deduction",
    dependentCount: "dependents",
    taxableBaseLabel: "Taxable Base",
    band: "Band",
    range: "Range",
    rate: "Rate",
    taxCol: "Tax",
    total: "Total IRPF",
    exempt: "Exempt",
    seoTitle1: "What is IRPF?",
    seoText1: "IRPF (Imposto de Renda Pessoa Fisica) is Brazil's personal income tax. It is calculated monthly on employment income after deducting INSS contributions and dependent allowances.",
    seoTitle2: "2024 IRPF Tax Bands",
    seoText2: "Brazilian income tax uses progressive bands. The taxable base is calculated after deducting INSS contributions and R$189.59 per dependent. Each band has an associated deduction amount to simplify the calculation.",
    seoTitle3: "How to Calculate",
    seoStep1: "Start with gross monthly income",
    seoStep2: "Subtract INSS contribution",
    seoStep3: "Subtract R$189.59 per dependent",
    seoStep4: "Apply the tax rate for the resulting band",
    seoStep5: "Subtract the band's deduction amount",
    seoTitle4: "Deductions",
    seoText4: "The main deductions from taxable income are INSS contributions (mandatory social security) and R$189.59 per dependent. Other deductions like private pension contributions may also apply but are not covered in this simplified calculator.",
  },
  pt: {
    title: "Calculadora IRPF (Imposto de Renda)",
    subtitle: "Calcule seu Imposto de Renda mensal (IRPF) com as aliquotas de 2024, dependentes e deducao do INSS.",
    monthlyIncome: "Rendimento Mensal",
    incomePlaceholder: "Digite o rendimento bruto mensal",
    dependents: "Numero de Dependentes",
    inssDeduction: "Deducao INSS",
    inssPlaceholder: "Digite o valor da contribuicao INSS",
    inssHint: "Use a Calculadora INSS para encontrar este valor",
    calculate: "Calcular IRPF",
    taxableBase: "Base de Calculo",
    incomeTax: "Imposto de Renda (IRPF)",
    effectiveRate: "Aliquota Efetiva",
    netIncome: "Rendimento Liquido",
    breakdownTitle: "Detalhamento do Calculo",
    deductionsTitle: "Deducoes Aplicadas",
    grossIncome: "Rendimento Bruto",
    inssLabel: "Deducao INSS",
    dependentsDeduction: "Deducao por Dependentes",
    dependentCount: "dependentes",
    taxableBaseLabel: "Base de Calculo",
    band: "Faixa",
    range: "Faixa de Renda",
    rate: "Aliquota",
    taxCol: "Imposto",
    total: "IRPF Total",
    exempt: "Isento",
    seoTitle1: "O que e o IRPF?",
    seoText1: "O IRPF (Imposto de Renda Pessoa Fisica) e o imposto sobre a renda no Brasil. E calculado mensalmente sobre a renda do trabalho apos deduzir as contribuicoes do INSS e abatimentos por dependentes.",
    seoTitle2: "Faixas do IRPF 2024",
    seoText2: "O imposto de renda brasileiro usa faixas progressivas. A base de calculo e obtida apos deduzir a contribuicao do INSS e R$189,59 por dependente. Cada faixa possui uma parcela a deduzir para simplificar o calculo.",
    seoTitle3: "Como Calcular",
    seoStep1: "Comece com o rendimento bruto mensal",
    seoStep2: "Subtraia a contribuicao do INSS",
    seoStep3: "Subtraia R$189,59 por dependente",
    seoStep4: "Aplique a aliquota correspondente a faixa",
    seoStep5: "Subtraia a parcela a deduzir da faixa",
    seoTitle4: "Deducoes",
    seoText4: "As principais deducoes da base de calculo sao as contribuicoes ao INSS (previdencia social obrigatoria) e R$189,59 por dependente. Outras deducoes como contribuicoes a previdencia privada tambem podem ser aplicadas, mas nao estao cobertas nesta calculadora simplificada.",
  },
  de: {}, fr: {}, es: {}, hi: {}, ja: {},
};

interface BandResult {
  min: number;
  max: number;
  rate: number;
  taxable: number;
  tax: number;
}

export default function BrazilIncomeTaxPage() {
  const { lang, setLang, t } = useTranslation(translations);
  const [income, setIncome] = useState<string>("5000");
  const [dependents, setDependents] = useState<string>("0");
  const [inss, setInss] = useState<string>("0");
  const [result, setResult] = useState<{
    grossIncome: number;
    inssDeduction: number;
    dependentsDeduction: number;
    taxableBase: number;
    totalTax: number;
    effectiveRate: number;
    netIncome: number;
    bands: BandResult[];
  } | null>(null);

  function calculate() {
    const gross = parseFloat(income);
    if (!gross || gross <= 0) return;

    const inssVal = parseFloat(inss) || 0;
    const depCount = parseInt(dependents) || 0;
    const depDeduction = depCount * DEPENDENT_DEDUCTION;
    const taxableBase = Math.max(0, gross - inssVal - depDeduction);

    let totalTax = 0;
    const bandResults: BandResult[] = [];

    for (const band of IRPF_BANDS) {
      if (taxableBase <= band.min) {
        bandResults.push({
          min: band.min,
          max: band.max === Infinity ? Infinity : band.max,
          rate: band.rate,
          taxable: 0,
          tax: 0,
        });
        continue;
      }

      const upper = band.max === Infinity ? taxableBase : Math.min(taxableBase, band.max);
      const taxable = upper - band.min;
      const tax = taxable * band.rate;

      bandResults.push({
        min: band.min,
        max: band.max === Infinity ? Infinity : band.max,
        rate: band.rate,
        taxable,
        tax,
      });

      totalTax += tax;
    }

    // Apply simplified deduction method
    // Find the applicable band and use its deduction
    let simplifiedTax = 0;
    for (let i = IRPF_BANDS.length - 1; i >= 0; i--) {
      if (taxableBase > IRPF_BANDS[i].min) {
        simplifiedTax = taxableBase * IRPF_BANDS[i].rate - IRPF_BANDS[i].deduction;
        break;
      }
    }
    totalTax = Math.max(0, simplifiedTax);

    setResult({
      grossIncome: gross,
      inssDeduction: inssVal,
      dependentsDeduction: depDeduction,
      taxableBase,
      totalTax,
      effectiveRate: gross > 0 ? (totalTax / gross) * 100 : 0,
      netIncome: gross - inssVal - totalTax,
      bands: bandResults,
    });
  }

  const fmtBRL = (n: number) => `R$${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/brazil-income-tax`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/brazil-income-tax`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <LanguageSwitcher supportedLangs={["en", "pt"]} onLanguageChange={(l: LangCode) => setLang(l)} />

        <h1 className="text-3xl font-extrabold mb-2">{t("title")}</h1>
        <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">{t("monthlyIncome")} (R$)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="input-field"
                placeholder={t("incomePlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("dependents")}</label>
              <input
                type="number"
                value={dependents}
                onChange={(e) => setDependents(e.target.value)}
                className="input-field"
                min="0"
                max="20"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">{t("inssDeduction")} (R$)</label>
            <input
              type="number"
              value={inss}
              onChange={(e) => setInss(e.target.value)}
              className="input-field"
              placeholder={t("inssPlaceholder")}
            />
            <p className="text-xs text-[var(--muted)] mt-1">{t("inssHint")}</p>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            {t("calculate")}
          </button>
        </div>

        {result && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="result-card">
                <p className="text-sm text-[var(--muted)] mb-1">{t("taxableBase")}</p>
                <p className="text-xl font-bold">{fmtBRL(result.taxableBase)}</p>
              </div>
              <div className="result-card" style={{ background: "#fef3c7", borderColor: "#fde68a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("incomeTax")}</p>
                <p className="text-xl font-bold text-amber-700">{fmtBRL(result.totalTax)}</p>
              </div>
              <div className="result-card">
                <p className="text-sm text-[var(--muted)] mb-1">{t("effectiveRate")}</p>
                <p className="text-xl font-bold">{result.effectiveRate.toFixed(2)}%</p>
              </div>
              <div className="result-card" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("netIncome")}</p>
                <p className="text-xl font-bold text-green-700">{fmtBRL(result.netIncome)}</p>
              </div>
            </div>

            <div className="tool-card mb-4">
              <h3 className="text-lg font-bold mb-4">{t("deductionsTitle")}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t("grossIncome")}</span>
                  <span className="font-medium">{fmtBRL(result.grossIncome)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>- {t("inssLabel")}</span>
                  <span className="font-medium">-{fmtBRL(result.inssDeduction)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>- {t("dependentsDeduction")} ({dependents} {t("dependentCount")} x {fmtBRL(DEPENDENT_DEDUCTION)})</span>
                  <span className="font-medium">-{fmtBRL(result.dependentsDeduction)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-[var(--card-border)] pt-2">
                  <span>{t("taxableBaseLabel")}</span>
                  <span>{fmtBRL(result.taxableBase)}</span>
                </div>
              </div>
            </div>

            <div className="tool-card mb-8">
              <h3 className="text-lg font-bold mb-4">{t("breakdownTitle")}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--card-border)]">
                      <th className="text-left py-2 pr-4">{t("band")}</th>
                      <th className="text-left py-2 pr-4">{t("range")}</th>
                      <th className="text-left py-2 pr-4">{t("rate")}</th>
                      <th className="text-right py-2">{t("taxCol")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.bands.map((b, i) => (
                      <tr key={i} className="border-b border-[var(--card-border)]">
                        <td className="py-2 pr-4">{i + 1}</td>
                        <td className="py-2 pr-4">
                          {fmtBRL(b.min)} - {b.max === Infinity ? "+" : fmtBRL(b.max)}
                        </td>
                        <td className="py-2 pr-4">{b.rate === 0 ? t("exempt") : `${(b.rate * 100).toFixed(1)}%`}</td>
                        <td className="py-2 text-right font-medium">{fmtBRL(b.tax)}</td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td className="py-2 pr-4" colSpan={3}>{t("total")}</td>
                      <td className="py-2 text-right">{fmtBRL(result.totalTax)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>{t("seoTitle1")}</h2>
          <p>{t("seoText1")}</p>

          <h2>{t("seoTitle2")}</h2>
          <p>{t("seoText2")}</p>

          <h3>{t("seoTitle3")}</h3>
          <ol>
            <li>{t("seoStep1")}</li>
            <li>{t("seoStep2")}</li>
            <li>{t("seoStep3")}</li>
            <li>{t("seoStep4")}</li>
            <li>{t("seoStep5")}</li>
          </ol>

          <h2>{t("seoTitle4")}</h2>
          <p>{t("seoText4")}</p>
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "IRPF Calculator Brazil",
            description: META.description,
            url: `${SITE_URL}/tools/brazil-income-tax`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
