"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import LanguageSwitcher, { useTranslation, type LangCode } from "@/components/LanguageSwitcher";

const META = {
  title: "INSS Calculator Brazil - Calculadora INSS 2024",
  description:
    "Free INSS calculator for Brazil. Calculate your social security contribution with 2024 progressive rates. Calculadora INSS com aliquotas progressivas.",
  keywords: "calculadora INSS, INSS calculator Brazil, INSS 2024, contribuicao INSS, previdencia social, brazilian social security",
};

const INSS_BANDS = [
  { min: 0, max: 1412.00, rate: 0.075 },
  { min: 1412.00, max: 2666.68, rate: 0.09 },
  { min: 2666.68, max: 4000.03, rate: 0.12 },
  { min: 4000.03, max: 7786.02, rate: 0.14 },
];

const translations: Record<LangCode, Record<string, string>> = {
  en: {
    title: "INSS Calculator (Brazil)",
    subtitle: "Calculate your Brazilian social security (INSS) contribution with 2024 progressive rates.",
    grossSalary: "Gross Salary",
    salaryPlaceholder: "Enter gross monthly salary",
    calculate: "Calculate INSS",
    contribution: "INSS Contribution",
    effectiveRate: "Effective Rate",
    netAfterINSS: "Net After INSS",
    breakdownTitle: "Contribution Breakdown by Band",
    band: "Band",
    range: "Range",
    rate: "Rate",
    contributionCol: "Contribution",
    total: "Total",
    seoTitle1: "What is INSS?",
    seoText1: "INSS (Instituto Nacional do Seguro Social) is Brazil's national social security institute. All employees in Brazil are required to contribute to INSS, which funds retirement pensions, disability benefits, maternity leave, and other social security programs.",
    seoTitle2: "2024 INSS Progressive Rates",
    seoText2: "Since 2020, INSS contributions are calculated using progressive rates, similar to income tax brackets. Each salary band is taxed at its respective rate, and only the portion within each band is subject to that rate.",
    seoTitle3: "INSS Rate Bands (2024)",
    seoText3Band1: "Up to R$1,412.00: 7.5%",
    seoText3Band2: "R$1,412.01 to R$2,666.68: 9%",
    seoText3Band3: "R$2,666.69 to R$4,000.03: 12%",
    seoText3Band4: "R$4,000.04 to R$7,786.02: 14%",
    seoTitle4: "Maximum Contribution",
    seoText4: "The INSS contribution ceiling is R$7,786.02. Any salary above this amount is not subject to additional INSS contribution. The maximum monthly contribution is approximately R$908.85.",
  },
  pt: {
    title: "Calculadora INSS (Brasil)",
    subtitle: "Calcule sua contribuicao ao INSS com as aliquotas progressivas de 2024.",
    grossSalary: "Salario Bruto",
    salaryPlaceholder: "Digite o salario bruto mensal",
    calculate: "Calcular INSS",
    contribution: "Contribuicao INSS",
    effectiveRate: "Aliquota Efetiva",
    netAfterINSS: "Salario Liquido (apos INSS)",
    breakdownTitle: "Detalhamento por Faixa",
    band: "Faixa",
    range: "Faixa Salarial",
    rate: "Aliquota",
    contributionCol: "Contribuicao",
    total: "Total",
    seoTitle1: "O que e o INSS?",
    seoText1: "O INSS (Instituto Nacional do Seguro Social) e o orgao responsavel pela Previdencia Social no Brasil. Todos os trabalhadores com carteira assinada contribuem para o INSS, que financia aposentadorias, auxilio-doenca, licenca-maternidade e outros beneficios.",
    seoTitle2: "Aliquotas Progressivas do INSS 2024",
    seoText2: "Desde 2020, as contribuicoes ao INSS sao calculadas com aliquotas progressivas, semelhantes ao Imposto de Renda. Cada faixa salarial e tributada com sua respectiva aliquota, e apenas a parcela dentro de cada faixa e sujeita aquela taxa.",
    seoTitle3: "Faixas de Contribuicao INSS (2024)",
    seoText3Band1: "Ate R$1.412,00: 7,5%",
    seoText3Band2: "R$1.412,01 a R$2.666,68: 9%",
    seoText3Band3: "R$2.666,69 a R$4.000,03: 12%",
    seoText3Band4: "R$4.000,04 a R$7.786,02: 14%",
    seoTitle4: "Teto de Contribuicao",
    seoText4: "O teto de contribuicao do INSS e R$7.786,02. Qualquer salario acima deste valor nao esta sujeito a contribuicao adicional ao INSS. A contribuicao mensal maxima e de aproximadamente R$908,85.",
  },
  de: {}, fr: {}, es: {}, hi: {}, ja: {},
};

interface BandResult {
  min: number;
  max: number;
  rate: number;
  taxable: number;
  contribution: number;
}

export default function BrazilINSSCalculatorPage() {
  const { lang, setLang, t } = useTranslation(translations);
  const [salary, setSalary] = useState<string>("5000");
  const [result, setResult] = useState<{
    totalContribution: number;
    effectiveRate: number;
    netSalary: number;
    bands: BandResult[];
  } | null>(null);

  function calculate() {
    const gross = parseFloat(salary);
    if (!gross || gross <= 0) return;

    const cappedSalary = Math.min(gross, 7786.02);
    let totalContribution = 0;
    const bands: BandResult[] = [];

    for (const band of INSS_BANDS) {
      if (cappedSalary <= band.min) break;
      const taxable = Math.min(cappedSalary, band.max) - band.min;
      const contribution = taxable * band.rate;
      totalContribution += contribution;
      bands.push({
        min: band.min,
        max: band.max,
        rate: band.rate,
        taxable,
        contribution,
      });
    }

    setResult({
      totalContribution,
      effectiveRate: (totalContribution / gross) * 100,
      netSalary: gross - totalContribution,
      bands,
    });
  }

  const fmtBRL = (n: number) => `R$${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/brazil-inss-calculator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <LanguageSwitcher supportedLangs={["en", "pt"]} onLanguageChange={(l: LangCode) => setLang(l)} />

        <h1 className="text-3xl font-extrabold mb-2">{t("title")}</h1>
        <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">{t("grossSalary")} (R$)</label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="input-field"
              placeholder={t("salaryPlaceholder")}
            />
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            {t("calculate")}
          </button>
        </div>

        {result && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="result-card" style={{ background: "#fef3c7", borderColor: "#fde68a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("contribution")}</p>
                <p className="text-xl font-bold text-amber-700">{fmtBRL(result.totalContribution)}</p>
              </div>
              <div className="result-card">
                <p className="text-sm text-[var(--muted)] mb-1">{t("effectiveRate")}</p>
                <p className="text-xl font-bold">{result.effectiveRate.toFixed(2)}%</p>
              </div>
              <div className="result-card" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("netAfterINSS")}</p>
                <p className="text-xl font-bold text-green-700">{fmtBRL(result.netSalary)}</p>
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
                      <th className="text-right py-2">{t("contributionCol")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.bands.map((b, i) => (
                      <tr key={i} className="border-b border-[var(--card-border)]">
                        <td className="py-2 pr-4">{i + 1}</td>
                        <td className="py-2 pr-4">{fmtBRL(b.min)} - {fmtBRL(b.max)}</td>
                        <td className="py-2 pr-4">{(b.rate * 100).toFixed(1)}%</td>
                        <td className="py-2 text-right font-medium">{fmtBRL(b.contribution)}</td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td className="py-2 pr-4" colSpan={3}>{t("total")}</td>
                      <td className="py-2 text-right">{fmtBRL(result.totalContribution)}</td>
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
          <ul>
            <li><strong>{t("seoText3Band1")}</strong></li>
            <li><strong>{t("seoText3Band2")}</strong></li>
            <li><strong>{t("seoText3Band3")}</strong></li>
            <li><strong>{t("seoText3Band4")}</strong></li>
          </ul>

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
            name: "INSS Calculator Brazil",
            description: META.description,
            url: `${SITE_URL}/tools/brazil-inss-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
