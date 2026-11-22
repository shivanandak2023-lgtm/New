"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "France Income Tax Calculator — Simulateur Impot sur le Revenu",
  description:
    "Free French income tax calculator (simulateur impot sur le revenu) with 2024 tax brackets and quotient familial. Calculate your impot net and taux effectif.",
  keywords:
    "simulateur impot sur le revenu, calculateur impot France, France income tax calculator, impot 2024, quotient familial, barème impot, taux effectif imposition",
};

type Lang = "en" | "fr";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    title: "France Income Tax Calculator",
    subtitle: "Calculate French income tax (impot sur le revenu) with 2024 brackets and family quotient (quotient familial).",
    income: "Net Taxable Income (€)",
    parts: "Family Quotient (Parts Fiscales)",
    partsHelp: "1 = single, 1.5 = single parent + 1 child, 2 = married, 2.5 = married + 1 child, 3 = married + 2 children",
    calculate: "Calculate",
    taxableIncome: "Taxable Income",
    incomeTax: "Income Tax (Impot)",
    effectiveRate: "Effective Tax Rate",
    netAfterTax: "Net Income After Tax",
    breakdownTitle: "Tax Bracket Breakdown",
    bracket: "Bracket",
    rate: "Rate",
    taxableAmount: "Taxable Amount",
    taxAmount: "Tax Amount",
    totalTax: "Total Tax",
    seoTitle1: "How French Income Tax Works",
    seoText1: "France uses a progressive income tax system known as the impot sur le revenu (IR). For 2024, there are five tax brackets: 0% on income up to 11,294 euros, 11% from 11,294 to 28,797 euros, 30% from 28,797 to 82,341 euros, 41% from 82,341 to 177,106 euros, and 45% on income above 177,106 euros. These brackets apply to each part of the quotient familial, making the system particularly favorable for families with children. The French tax year follows the calendar year, and most taxpayers now use the prelevement a la source (withholding at source) system introduced in 2019.",
    seoTitle2: "Understanding the Quotient Familial",
    seoText2: "The quotient familial is a unique feature of the French tax system that reduces the tax burden for families. Your total household income is divided by the number of parts fiscales before applying the tax brackets. A single person counts as 1 part, a married couple as 2 parts, and each dependent child adds 0.5 parts (1 part for the third child and beyond). For single parents, the first child adds 1 part instead of 0.5. This system means that a married couple with two children earning 80,000 euros pays significantly less tax than a single person with the same income, as the income is divided by 3 parts instead of 1. However, the tax advantage per half-part is capped at 1,759 euros for 2024.",
    seoTitle3: "Social Contributions (CSG and CRDS)",
    seoText3: "In addition to income tax, French residents pay social contributions on their income. The Contribution Sociale Generalisee (CSG) is 9.2% on employment income, of which 6.8% is deductible from taxable income. The Contribution pour le Remboursement de la Dette Sociale (CRDS) adds 0.5%. These contributions fund the social security system, healthcare, and debt repayment. For salaried employees, these contributions are typically deducted at source by the employer. Self-employed workers pay these through their URSSAF declarations. Investment income is subject to a flat tax (prelevement forfaitaire unique) of 30%, combining 12.8% income tax and 17.2% social contributions.",
    seoTitle4: "Tax Credits and Deductions in France",
    seoText4: "France offers numerous tax credits and deductions to reduce your tax liability. Common deductions include charitable donations (66% credit up to 20% of taxable income), home energy improvements (MaPrimeRenov), domestic employee costs (50% credit), and childcare expenses (credit of 50% up to 3,500 euros per child). The employment bonus (prime d activite) is available for low-income workers. Professional expenses can be deducted either as a 10% flat deduction or as actual expenses (frais reels). Retirement savings contributions to PER (Plan Epargne Retraite) are deductible from taxable income up to certain limits. Understanding these deductions can significantly reduce your effective tax rate.",
  },
  fr: {
    title: "Simulateur Impot sur le Revenu",
    subtitle: "Calculez votre impot sur le revenu 2024 avec le bareme progressif et le quotient familial.",
    income: "Revenu Net Imposable (€)",
    parts: "Parts Fiscales (Quotient Familial)",
    partsHelp: "1 = celibataire, 1.5 = parent isole + 1 enfant, 2 = couple, 2.5 = couple + 1 enfant, 3 = couple + 2 enfants",
    calculate: "Calculer",
    taxableIncome: "Revenu Imposable",
    incomeTax: "Impot sur le Revenu",
    effectiveRate: "Taux Effectif d'Imposition",
    netAfterTax: "Revenu Net Apres Impot",
    breakdownTitle: "Detail par Tranche",
    bracket: "Tranche",
    rate: "Taux",
    taxableAmount: "Montant Imposable",
    taxAmount: "Montant de l'Impot",
    totalTax: "Impot Total",
    seoTitle1: "Comment fonctionne l'impot sur le revenu en France",
    seoText1: "La France utilise un systeme d'imposition progressif appele impot sur le revenu (IR). Pour 2024, il existe cinq tranches d'imposition : 0% sur les revenus jusqu'a 11 294 euros, 11% de 11 294 a 28 797 euros, 30% de 28 797 a 82 341 euros, 41% de 82 341 a 177 106 euros, et 45% au-dela de 177 106 euros. Ces tranches s'appliquent a chaque part du quotient familial, rendant le systeme particulierement favorable aux familles avec enfants. L'annee fiscale francaise suit l'annee civile, et la plupart des contribuables utilisent desormais le prelevement a la source introduit en 2019.",
    seoTitle2: "Comprendre le Quotient Familial",
    seoText2: "Le quotient familial est une particularite du systeme fiscal francais qui reduit la charge fiscale des familles. Le revenu total du foyer est divise par le nombre de parts fiscales avant application du bareme. Une personne seule compte pour 1 part, un couple marie pour 2 parts, et chaque enfant a charge ajoute 0,5 part (1 part a partir du troisieme enfant). Pour les parents isoles, le premier enfant ajoute 1 part au lieu de 0,5. Ce systeme signifie qu'un couple marie avec deux enfants gagnant 80 000 euros paie nettement moins d'impot qu'une personne seule avec le meme revenu.",
    seoTitle3: "Contributions Sociales (CSG et CRDS)",
    seoText3: "En plus de l'impot sur le revenu, les residents francais paient des contributions sociales sur leurs revenus. La Contribution Sociale Generalisee (CSG) est de 9,2% sur les revenus d'activite, dont 6,8% sont deductibles du revenu imposable. La Contribution pour le Remboursement de la Dette Sociale (CRDS) ajoute 0,5%. Ces contributions financent le systeme de securite sociale, la sante et le remboursement de la dette. Pour les salaries, ces contributions sont generalement prelevees a la source par l'employeur.",
    seoTitle4: "Credits d'Impot et Deductions en France",
    seoText4: "La France offre de nombreux credits d'impot et deductions pour reduire votre charge fiscale. Les deductions courantes comprennent les dons aux associations (credit de 66% dans la limite de 20% du revenu imposable), les travaux d'amelioration energetique (MaPrimeRenov), les frais d'emploi a domicile (credit de 50%), et les frais de garde d'enfants (credit de 50% dans la limite de 3 500 euros par enfant). La prime d'activite est disponible pour les travailleurs a faibles revenus. Les frais professionnels peuvent etre deduits soit comme deduction forfaitaire de 10%, soit comme frais reels.",
  },
};

const BRACKETS = [
  { limit: 11294, rate: 0 },
  { limit: 28797, rate: 0.11 },
  { limit: 82341, rate: 0.30 },
  { limit: 177106, rate: 0.41 },
  { limit: Infinity, rate: 0.45 },
];

function calcTaxPerPart(incomePerPart: number): { total: number; details: { from: number; to: number; rate: number; taxable: number; tax: number }[] } {
  const details: { from: number; to: number; rate: number; taxable: number; tax: number }[] = [];
  let total = 0;
  let prev = 0;
  for (const b of BRACKETS) {
    if (incomePerPart <= prev) break;
    const taxable = Math.min(incomePerPart, b.limit) - prev;
    const tax = taxable * b.rate;
    details.push({ from: prev, to: Math.min(incomePerPart, b.limit), rate: b.rate, taxable, tax });
    total += tax;
    prev = b.limit;
  }
  return { total, details };
}

export default function FranceIncomeTaxPage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = (key: string) => translations[lang][key] || key;

  const [income, setIncome] = useState<string>("45000");
  const [parts, setParts] = useState<string>("1");

  const totalIncome = parseFloat(income) || 0;
  const numParts = parseFloat(parts) || 1;
  const incomePerPart = totalIncome / numParts;

  const { total: taxPerPart, details } = calcTaxPerPart(incomePerPart);
  const totalTax = Math.round(taxPerPart * numParts);
  const effectiveRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;
  const netAfterTax = totalIncome - totalTax;

  const fmt = (n: number) => "\u20AC" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/france-income-tax`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/france-income-tax`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <div className="mb-4 flex gap-2">
          <button onClick={() => setLang("en")} className={`px-3 py-1 rounded text-sm font-medium border transition-colors ${lang === "en" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"}`}>EN</button>
          <button onClick={() => setLang("fr")} className={`px-3 py-1 rounded text-sm font-medium border transition-colors ${lang === "fr" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"}`}>FR</button>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">{t("title")}</h1>
        <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">{t("income")}</label>
              <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="input-field" placeholder="45000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("parts")}</label>
              <select value={parts} onChange={(e) => setParts(e.target.value)} className="input-field">
                <option value="1">1</option>
                <option value="1.5">1.5</option>
                <option value="2">2</option>
                <option value="2.5">2.5</option>
                <option value="3">3</option>
                <option value="3.5">3.5</option>
                <option value="4">4</option>
              </select>
              <p className="text-xs text-[var(--muted)] mt-1">{t("partsHelp")}</p>
            </div>
          </div>
        </div>

        {totalIncome > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t("incomeTax")}</p>
                <p className="text-2xl font-bold text-red-600">{fmt(totalTax)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("netAfterTax")}</p>
                <p className="text-2xl font-bold text-green-700">{fmt(netAfterTax)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("effectiveRate")}</p>
                <p className="text-2xl font-bold text-amber-700">{effectiveRate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="tool-card">
              <h2 className="text-lg font-bold mb-4">{t("breakdownTitle")}</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">{t("bracket")}</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("rate")}</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("taxableAmount")}</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("taxAmount")}</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((d, i) => (
                    <tr key={i} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{fmt(d.from)} - {d.to === Infinity ? "..." : fmt(d.to)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{(d.rate * 100).toFixed(0)}%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(d.taxable)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(d.tax)}</td>
                    </tr>
                  ))}
                  <tr className="hover:bg-[var(--muted-bg)] bg-blue-50 font-bold">
                    <td className="border border-[var(--card-border)] px-3 py-2" colSpan={3}>{t("totalTax")} (x {numParts} {t("parts").toLowerCase()})</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">{fmt(totalTax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>{t("seoTitle1")}</h2>
          <p>{t("seoText1")}</p>
          <h2>{t("seoTitle2")}</h2>
          <p>{t("seoText2")}</p>
          <h2>{t("seoTitle3")}</h2>
          <p>{t("seoText3")}</p>
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
            name: "France Income Tax Calculator (Simulateur Impot)",
            description: META.description,
            url: `${SITE_URL}/tools/france-income-tax`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
