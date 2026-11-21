"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "South Korea Income Tax Calculator",
  description:
    "Free South Korea income tax calculator. Calculate Korean income tax with 2024 brackets, local income tax (10%), and effective tax rate. 한국 소득세 계산기.",
  keywords:
    "South Korea income tax calculator, 한국 소득세 계산기, Korea tax calculator, Korean income tax brackets 2024, 소득세 계산, local income tax Korea",
};

type Lang = "en" | "ko";

const labels = {
  en: {
    title: "South Korea Income Tax Calculator",
    subtitle: "Calculate your Korean income tax, local income tax, and effective tax rate using 2024 tax brackets.",
    salary: "Annual Salary",
    calculate: "Calculate Tax",
    incomeTax: "Income Tax",
    localTax: "Local Income Tax",
    totalTax: "Total Tax",
    netIncome: "Net Income",
    effectiveRate: "Effective Tax Rate",
    bracketBreakdown: "Tax Bracket Breakdown",
    bracket: "Income Bracket",
    rate: "Rate",
    taxableInBracket: "Taxable in Bracket",
    taxFromBracket: "Tax from Bracket",
    summary: "Tax Summary",
    taxBrackets: "2024 Income Tax Brackets",
  },
  ko: {
    title: "한국 소득세 계산기",
    subtitle: "2024년 과세표준을 적용하여 소득세, 지방소득세, 실효세율을 계산합니다.",
    salary: "연간 급여",
    calculate: "세금 계산",
    incomeTax: "소득세",
    localTax: "지방소득세",
    totalTax: "총 세금",
    netIncome: "순수입",
    effectiveRate: "실효세율",
    bracketBreakdown: "과세구간 내역",
    bracket: "소득 구간",
    rate: "세율",
    taxableInBracket: "구간 과세소득",
    taxFromBracket: "구간 세액",
    summary: "세금 요약",
    taxBrackets: "2024년 소득세 과세표준",
  },
};

const brackets = [
  { min: 0, max: 14000000, rate: 6 },
  { min: 14000000, max: 50000000, rate: 15 },
  { min: 50000000, max: 88000000, rate: 24 },
  { min: 88000000, max: 150000000, rate: 35 },
  { min: 150000000, max: 300000000, rate: 38 },
  { min: 300000000, max: 500000000, rate: 40 },
  { min: 500000000, max: 1000000000, rate: 42 },
  { min: 1000000000, max: Infinity, rate: 45 },
];

export default function SouthKoreaIncomeTaxPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [salary, setSalary] = useState<string>("50000000");
  const [result, setResult] = useState<{
    annualSalary: number;
    incomeTax: number;
    localTax: number;
    totalTax: number;
    netIncome: number;
    effectiveRate: number;
    bracketDetails: { min: number; max: number; rate: number; taxable: number; tax: number }[];
  } | null>(null);

  const t = labels[lang];

  function calculate() {
    const annualSalary = parseFloat(salary);
    if (!annualSalary || annualSalary <= 0) return;

    let remainingIncome = annualSalary;
    let incomeTax = 0;
    const bracketDetails: { min: number; max: number; rate: number; taxable: number; tax: number }[] = [];

    for (const bracket of brackets) {
      if (remainingIncome <= 0) {
        bracketDetails.push({ ...bracket, taxable: 0, tax: 0 });
        continue;
      }

      const bracketSize = bracket.max === Infinity ? remainingIncome : bracket.max - bracket.min;
      const taxableInBracket = Math.min(remainingIncome, bracketSize);
      const taxFromBracket = taxableInBracket * (bracket.rate / 100);

      bracketDetails.push({
        ...bracket,
        taxable: taxableInBracket,
        tax: taxFromBracket,
      });

      incomeTax += taxFromBracket;
      remainingIncome -= taxableInBracket;
    }

    const localTax = incomeTax * 0.1;
    const totalTax = incomeTax + localTax;
    const netIncome = annualSalary - totalTax;
    const effectiveRate = annualSalary > 0 ? (totalTax / annualSalary) * 100 : 0;

    setResult({
      annualSalary,
      incomeTax,
      localTax,
      totalTax,
      netIncome,
      effectiveRate,
      bracketDetails,
    });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);

  const fmtBracket = (n: number) => {
    if (n === Infinity) return lang === "en" ? "No limit" : "한도 없음";
    if (n >= 100000000) return `${lang === "en" ? "₩" : ""}${(n / 100000000).toFixed(0)}${lang === "en" ? "B" : "억"}`;
    if (n >= 10000000) return `${lang === "en" ? "₩" : ""}${(n / 10000000).toFixed(0)}${lang === "en" ? "0M" : "천만"}`;
    if (n >= 1000000) return `${lang === "en" ? "₩" : ""}${(n / 1000000).toFixed(0)}${lang === "en" ? "M" : "백만"}`;
    return fmt(n);
  };

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/south-korea-income-tax`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${SITE_URL}/tools/south-korea-income-tax`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
          <button
            onClick={() => setLang(lang === "en" ? "ko" : "en")}
            className="text-sm px-3 py-1 border border-[var(--card-border)] rounded hover:bg-[var(--muted-bg)]"
          >
            {lang === "en" ? "한국어" : "English"}
          </button>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">{t.title}</h1>
        <p className="text-[var(--muted)] mb-8">{t.subtitle}</p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">{t.salary} (&#8361; KRW)</label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="input-field"
              placeholder="e.g., 50000000"
              min="0"
              step="1000000"
            />
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            {t.calculate}
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t.incomeTax}</p>
                <p className="text-xl font-bold text-red-600">{fmt(result.incomeTax)}</p>
                <p className="text-xs text-[var(--muted)]">{lang === "en" ? "소득세" : "Income Tax"}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t.localTax}</p>
                <p className="text-xl font-bold text-orange-600">{fmt(result.localTax)}</p>
                <p className="text-xs text-[var(--muted)]">10% {lang === "en" ? "of income tax" : "소득세의"}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t.totalTax}</p>
                <p className="text-xl font-bold text-red-700">{fmt(result.totalTax)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t.netIncome}</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmt(result.netIncome)}</p>
                <p className="text-xs text-[var(--muted)]">{lang === "en" ? "순수입" : "Net Income"}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t.effectiveRate}</p>
                <p className="text-xl font-bold">{result.effectiveRate.toFixed(2)}%</p>
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
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t.taxableInBracket}</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t.taxFromBracket}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.bracketDetails.map((b, i) => (
                      <tr key={i} className={b.taxable > 0 ? "hover:bg-[var(--muted-bg)]" : "opacity-50"}>
                        <td className="border border-[var(--card-border)] px-3 py-2">
                          {fmtBracket(b.min)} &ndash; {fmtBracket(b.max)}
                        </td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{b.rate}%</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(b.taxable)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(b.tax)}</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold" colSpan={2}>
                        {lang === "en" ? "Total Income Tax" : "소득세 합계"}
                      </td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold">{fmt(result.annualSalary)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-red-600">{fmt(result.incomeTax)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">{t.summary}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{lang === "en" ? "Annual Salary" : "연간 급여"}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.annualSalary)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">{t.incomeTax} ({lang === "en" ? "소득세" : "Income Tax"})</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-red-600">-{fmt(result.incomeTax)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-orange-600">{t.localTax} ({lang === "en" ? "지방소득세" : "Local Tax"} 10%)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-orange-600">-{fmt(result.localTax)}</td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">{t.totalTax}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-red-700">-{fmt(result.totalTax)}</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">{t.netIncome} ({lang === "en" ? "순수입" : "Net Income"})</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(result.netIncome)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{t.effectiveRate}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{result.effectiveRate.toFixed(2)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>South Korea Income Tax System Overview</h2>
          <p>
            South Korea operates a progressive income tax system administered by the National Tax Service (NTS, &#xAD6D;&#xC138;&#xCCAD;).
            Residents are taxed on their worldwide income, while non-residents are taxed only on Korean-source income.
            The income tax rates range from 6% on the lowest bracket to 45% on income exceeding &#8361;1 billion, making
            it one of the more progressive tax systems in Asia. All employees in South Korea have income tax withheld
            at source through the pay-as-you-earn (PAYE) system.
          </p>

          <h2>2024 Korean Income Tax Brackets</h2>
          <p>
            Korea uses eight progressive tax brackets. The first &#8361;14 million of taxable income is taxed at 6%.
            Income between &#8361;14 million and &#8361;50 million is taxed at 15%. The 24% rate applies from &#8361;50 million
            to &#8361;88 million. Higher brackets apply at 35% (up to &#8361;150M), 38% (up to &#8361;300M), 40% (up to
            &#8361;500M), 42% (up to &#8361;1B), and 45% (above &#8361;1B). These brackets apply to taxable income after
            deductions and exemptions.
          </p>

          <h2>Local Income Tax (&#xC9C0;&#xBC29;&#xC18C;&#xB4DD;&#xC138;)</h2>
          <p>
            In addition to national income tax, South Korea levies a local income tax (&#xC9C0;&#xBC29;&#xC18C;&#xB4DD;&#xC138;)
            at a flat rate of 10% of the calculated national income tax. This tax is collected by local governments and is
            automatically added to the income tax liability. For example, if your national income tax is &#8361;5 million,
            the local income tax would be &#8361;500,000, bringing the total to &#8361;5.5 million. This effectively increases
            each tax bracket by 10% of its rate.
          </p>

          <h2>How to Calculate Korean Income Tax</h2>
          <p>
            Korean income tax is calculated by applying progressive rates to each portion of income that falls within
            each bracket. For example, an annual salary of &#8361;50 million would be taxed as follows: &#8361;14 million
            at 6% (&#8361;840,000) plus &#8361;36 million at 15% (&#8361;5,400,000), totaling &#8361;6,240,000 in income tax.
            Adding the 10% local tax of &#8361;624,000 gives a total tax burden of &#8361;6,864,000. The effective tax rate
            would be approximately 13.73%.
          </p>

          <h2>&#xD55C;&#xAD6D; &#xC18C;&#xB4DD;&#xC138; &#xACC4;&#xC0B0;&#xAE30;</h2>
          <p>
            This free Korean income tax calculator uses the official 2024 tax brackets to compute your income tax liability.
            Enter your annual salary in Korean Won (KRW) to see the income tax, local income tax, total tax, net income,
            and effective tax rate. The calculator provides a detailed bracket-by-bracket breakdown so you can see exactly
            how much tax applies at each rate level. It is useful for Korean employees, expatriates working in South Korea,
            and anyone planning their tax obligations in the Korean tax system.
          </p>

          <h2>Deductions and Credits</h2>
          <p>
            South Korea offers various tax deductions and credits that reduce taxable income. Common deductions include
            employment income deduction (up to &#8361;20 million), personal exemptions for dependents, national pension
            contributions, health insurance premiums, and housing-related deductions. Tax credits are available for
            medical expenses, education costs, donations, and credit card usage. This calculator shows the tax on gross
            income; your actual tax may be lower after applying applicable deductions and credits.
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
            name: "South Korea Income Tax Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/south-korea-income-tax`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
          }),
        }}
      />
    </>
  );
}
