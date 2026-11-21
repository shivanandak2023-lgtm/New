"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import LanguageSwitcher, { useTranslation, type LangCode } from "@/components/LanguageSwitcher";

const META = {
  title: "Unterhaltsrechner - German Child Maintenance Calculator",
  description:
    "Free Unterhaltsrechner based on the D\u00FCsseldorfer Tabelle 2024. Calculate German child maintenance (Kindesunterhalt) with Kindergeld offset for all income groups and age brackets.",
  keywords:
    "Unterhaltsrechner, Kindesunterhalt berechnen, D\u00FCsseldorfer Tabelle 2024, child maintenance calculator Germany, Unterhalt Rechner, Kindergeld Anrechnung",
};

const translations: Record<LangCode, Record<string, string>> = {
  en: {
    title: "German Child Maintenance Calculator",
    subtitle: "Calculate child maintenance (Kindesunterhalt) based on the D\u00FCsseldorfer Tabelle 2024 with Kindergeld offset.",
    netIncome: "Net Income of Obligated Parent",
    netIncomeHelp: "Monthly net income of the parent who must pay maintenance",
    childAge: "Age Group of Child",
    age0to5: "0\u20135 years",
    age6to11: "6\u201311 years",
    age12to17: "12\u201317 years",
    age18plus: "18+ years",
    numberOfChildren: "Number of Children",
    calculate: "Calculate",
    maintenanceBefore: "Maintenance (Before Kindergeld)",
    kindergeldOffset: "Kindergeld Offset",
    actualPayment: "Actual Payment (Zahlbetrag)",
    perChild: "per child",
    totalPayment: "Total Payment",
    resultTitle: "Your Maintenance Calculation",
    detailsTitle: "D\u00FCsseldorfer Tabelle Breakdown",
    incomeGroup: "Income Group",
    tableAmount: "Table Amount",
    kindergeld: "Kindergeld (\u20AC250/child)",
    zahlbetrag: "Payment Amount",
    noteTitle: "Important Notes",
    note1: "The D\u00FCsseldorfer Tabelle amounts shown are simplified guidelines. Actual amounts may vary.",
    note2: "Kindergeld offset: 50% for minors (both parents share), 100% for children 18+.",
    note3: "Self-retention (Selbstbehalt): \u20AC1,370/month for employed, \u20AC1,120/month for unemployed parents.",
    seoTitle1: "What Is the D\u00FCsseldorfer Tabelle?",
    seoText1: "The D\u00FCsseldorfer Tabelle (D\u00FCsseldorf Table) is the standard guideline used by German family courts to determine child maintenance payments. Published annually by the Higher Regional Court of D\u00FCsseldorf (Oberlandesgericht D\u00FCsseldorf), it establishes minimum maintenance amounts based on the paying parent's net income and the child's age group. The table has been in use since 1962 and is updated regularly to reflect changes in living costs and legal requirements. While the D\u00FCsseldorfer Tabelle is not legally binding, it is applied by virtually all German family courts and serves as the de facto standard for calculating Kindesunterhalt (child maintenance). The amounts in the table represent the child's total maintenance need, from which Kindergeld (child benefit) is partially or fully offset depending on the child's age.",
    seoTitle2: "Income Groups and Maintenance Amounts",
    seoText2: "The D\u00FCsseldorfer Tabelle divides parents into income groups based on monthly net income. The 2024 table uses the following brackets: Group 1 covers net income up to \u20AC1,900, Group 2 from \u20AC1,901 to \u20AC2,300, Group 3 from \u20AC2,301 to \u20AC2,700, Group 4 from \u20AC2,701 to \u20AC3,100, and Group 5 covers \u20AC3,101 to \u20AC3,500. Higher income groups continue up to \u20AC11,000 and above, with proportionally higher maintenance amounts. Each group specifies different amounts for four age brackets: 0\u20135 years, 6\u201311 years, 12\u201317 years, and 18 years and older. The amounts increase with both income and the child's age, as older children have higher living costs. For incomes above the highest table group, maintenance is calculated on a case-by-case basis.",
    seoTitle3: "Kindergeld Offset and Zahlbetrag",
    seoText3: "The actual payment amount (Zahlbetrag) is calculated by deducting the Kindergeld (child benefit) offset from the D\u00FCsseldorfer Tabelle amount. As of 2024, Kindergeld is \u20AC250 per month per child. For minor children, 50% of Kindergeld (\u20AC125) is offset against the maintenance amount, as both parents are deemed to benefit from the child benefit. For children aged 18 and older, 100% of Kindergeld (\u20AC250) is offset, as the full amount is credited to the child's maintenance need. If the paying parent's income is very low, there is a minimum self-retention amount (Selbstbehalt) of \u20AC1,370 per month for employed parents and \u20AC1,120 for non-employed parents. The court may reduce maintenance below the table amount if paying it would leave the parent below the self-retention threshold.",
    seoTitle4: "How to Apply for Child Maintenance in Germany",
    seoText4: "If parents cannot agree on maintenance amounts, either parent can apply to the local family court (Familiengericht) for a maintenance order. The process typically begins with the custodial parent requesting an income disclosure from the non-custodial parent. If the non-custodial parent refuses to pay voluntarily, a simplified procedure called the vereinfachte Verfahren can be used for underage children, which is faster and less expensive than a full court proceeding. Legal aid (Verfahrenskostenhilfe) is available for parents who cannot afford court and attorney fees. The Jugendamt (Youth Welfare Office) can also assist in establishing paternity and enforcing maintenance claims. It is advisable to seek legal advice early, as maintenance claims can only be made retroactive to the date the paying parent was formally requested to pay.",
  },
  de: {
    title: "Unterhaltsrechner",
    subtitle: "Berechnen Sie den Kindesunterhalt nach der D\u00FCsseldorfer Tabelle 2024 mit Kindergeldanrechnung.",
    netIncome: "Nettoeinkommen des Unterhaltspflichtigen",
    netIncomeHelp: "Monatliches Nettoeinkommen des unterhaltspflichtigen Elternteils",
    childAge: "Alter des Kindes",
    age0to5: "0\u20135 Jahre",
    age6to11: "6\u201311 Jahre",
    age12to17: "12\u201317 Jahre",
    age18plus: "18+ Jahre",
    numberOfChildren: "Anzahl der Kinder",
    calculate: "Berechnen",
    maintenanceBefore: "Kindesunterhalt (vor Kindergeld)",
    kindergeldOffset: "Kindergeldanrechnung",
    actualPayment: "Zahlbetrag",
    perChild: "pro Kind",
    totalPayment: "Gesamtzahlung",
    resultTitle: "Ihre Unterhaltsberechnung",
    detailsTitle: "D\u00FCsseldorfer Tabelle \u00DCbersicht",
    incomeGroup: "Einkommensgruppe",
    tableAmount: "Tabellenbetrag",
    kindergeld: "Kindergeld (250 \u20AC/Kind)",
    zahlbetrag: "Zahlbetrag",
    noteTitle: "Wichtige Hinweise",
    note1: "Die D\u00FCsseldorfer Tabelle-Betr\u00E4ge sind vereinfachte Richtwerte. Tats\u00E4chliche Betr\u00E4ge k\u00F6nnen abweichen.",
    note2: "Kindergeldanrechnung: 50% bei Minderj\u00E4hrigen (beide Eltern teilen), 100% ab 18 Jahren.",
    note3: "Selbstbehalt: 1.370 \u20AC/Monat f\u00FCr Erwerbst\u00E4tige, 1.120 \u20AC/Monat f\u00FCr nicht erwerbst\u00E4tige Unterhaltspflichtige.",
    seoTitle1: "Was ist die D\u00FCsseldorfer Tabelle?",
    seoText1: "Die D\u00FCsseldorfer Tabelle ist die Standardleitlinie, die von deutschen Familiengerichten zur Bestimmung von Kindesunterhaltszahlungen verwendet wird. Sie wird j\u00E4hrlich vom Oberlandesgericht D\u00FCsseldorf ver\u00F6ffentlicht und legt Mindestunterhaltsbetr\u00E4ge basierend auf dem Nettoeinkommen des zahlenden Elternteils und der Altersgruppe des Kindes fest. Die Tabelle wird seit 1962 verwendet und regelm\u00E4\u00DFig aktualisiert, um Ver\u00E4nderungen der Lebenshaltungskosten und rechtlichen Anforderungen widerzuspiegeln. Obwohl die D\u00FCsseldorfer Tabelle rechtlich nicht bindend ist, wird sie von praktisch allen deutschen Familiengerichten angewandt und dient als De-facto-Standard f\u00FCr die Berechnung des Kindesunterhalts. Die Betr\u00E4ge in der Tabelle stellen den gesamten Unterhaltsbedarf des Kindes dar, von dem das Kindergeld je nach Alter des Kindes teilweise oder vollst\u00E4ndig angerechnet wird.",
    seoTitle2: "Einkommensgruppen und Unterhaltsbetr\u00E4ge",
    seoText2: "Die D\u00FCsseldorfer Tabelle teilt Eltern in Einkommensgruppen nach monatlichem Nettoeinkommen ein. Die Tabelle 2024 verwendet folgende Stufen: Gruppe 1 umfasst Nettoeinkommen bis 1.900 \u20AC, Gruppe 2 von 1.901 bis 2.300 \u20AC, Gruppe 3 von 2.301 bis 2.700 \u20AC, Gruppe 4 von 2.701 bis 3.100 \u20AC und Gruppe 5 von 3.101 bis 3.500 \u20AC. H\u00F6here Einkommensgruppen reichen bis 11.000 \u20AC und dar\u00FCber, mit entsprechend h\u00F6heren Unterhaltsbetr\u00E4gen. Jede Gruppe gibt unterschiedliche Betr\u00E4ge f\u00FCr vier Altersstufen an: 0\u20135 Jahre, 6\u201311 Jahre, 12\u201317 Jahre und ab 18 Jahren. Die Betr\u00E4ge steigen sowohl mit dem Einkommen als auch mit dem Alter des Kindes, da \u00E4ltere Kinder h\u00F6here Lebenshaltungskosten haben.",
    seoTitle3: "Kindergeldanrechnung und Zahlbetrag",
    seoText3: "Der tats\u00E4chliche Zahlbetrag wird berechnet, indem die Kindergeldanrechnung vom D\u00FCsseldorfer Tabelle-Betrag abgezogen wird. Ab 2024 betr\u00E4gt das Kindergeld 250 \u20AC pro Monat und Kind. Bei minderj\u00E4hrigen Kindern werden 50% des Kindergeldes (125 \u20AC) angerechnet, da beide Eltern als Empf\u00E4nger des Kindergeldes gelten. Bei Kindern ab 18 Jahren werden 100% des Kindergeldes (250 \u20AC) angerechnet, da der volle Betrag dem Unterhaltsbedarf des Kindes zugerechnet wird. Wenn das Einkommen des zahlenden Elternteils sehr niedrig ist, gibt es einen Mindestselbstbehalt von 1.370 \u20AC pro Monat f\u00FCr Erwerbst\u00E4tige und 1.120 \u20AC f\u00FCr nicht erwerbst\u00E4tige Eltern. Das Gericht kann den Unterhalt unter den Tabellenbetrag reduzieren, wenn die Zahlung den Elternteil unter den Selbstbehalt bringen w\u00FCrde.",
    seoTitle4: "Wie beantragt man Kindesunterhalt in Deutschland?",
    seoText4: "Wenn sich Eltern nicht auf Unterhaltsbetr\u00E4ge einigen k\u00F6nnen, kann jeder Elternteil beim \u00F6rtlichen Familiengericht einen Unterhaltstitel beantragen. Das Verfahren beginnt typischerweise damit, dass der betreuende Elternteil eine Einkommensauskunft vom nicht betreuenden Elternteil verlangt. Wenn der nicht betreuende Elternteil die freiwillige Zahlung verweigert, kann f\u00FCr minderj\u00E4hrige Kinder das vereinfachte Verfahren genutzt werden, das schneller und kosteng\u00FCnstiger als ein vollst\u00E4ndiges Gerichtsverfahren ist. Verfahrenskostenhilfe steht Eltern zur Verf\u00FCgung, die sich Gerichts- und Anwaltskosten nicht leisten k\u00F6nnen. Das Jugendamt kann ebenfalls bei der Vaterschaftsfeststellung und Durchsetzung von Unterhaltsanspr\u00FCchen helfen. Es ist ratsam, fr\u00FChzeitig rechtliche Beratung einzuholen, da Unterhaltsanspr\u00FCche nur r\u00FCckwirkend ab dem Datum der formellen Zahlungsaufforderung geltend gemacht werden k\u00F6nnen.",
  },
  ja: {}, pt: {}, fr: {}, es: {}, hi: {},
  no: {},
};

// Düsseldorfer Tabelle 2024 (simplified 5 income brackets)
// [age0-5, age6-11, age12-17, age18+]
const DUESSELDORFER_TABELLE: { maxIncome: number; label: string; amounts: number[] }[] = [
  { maxIncome: 1900, label: "\u20AC0 \u2013 \u20AC1,900", amounts: [480, 551, 645, 689] },
  { maxIncome: 2300, label: "\u20AC1,901 \u2013 \u20AC2,300", amounts: [504, 579, 678, 724] },
  { maxIncome: 2700, label: "\u20AC2,301 \u2013 \u20AC2,700", amounts: [528, 607, 710, 758] },
  { maxIncome: 3100, label: "\u20AC2,701 \u2013 \u20AC3,100", amounts: [552, 634, 743, 793] },
  { maxIncome: Infinity, label: "\u20AC3,101+", amounts: [576, 662, 775, 828] },
];

const AGE_GROUPS = ["0to5", "6to11", "12to17", "18plus"];

export default function GermanChildMaintenancePage() {
  const { lang, setLang, t } = useTranslation(translations);
  const [netIncome, setNetIncome] = useState<string>("3000");
  const [childAgeGroup, setChildAgeGroup] = useState<string>("0to5");
  const [numberOfChildren, setNumberOfChildren] = useState<string>("1");

  const income = parseFloat(netIncome) || 0;
  const numChildren = Math.max(1, parseInt(numberOfChildren) || 1);

  // Find income bracket
  const bracket = DUESSELDORFER_TABELLE.find(b => income <= b.maxIncome) || DUESSELDORFER_TABELLE[DUESSELDORFER_TABELLE.length - 1];

  // Find age group index
  const ageIndex = AGE_GROUPS.indexOf(childAgeGroup);
  const tableAmount = bracket.amounts[ageIndex >= 0 ? ageIndex : 0];

  // Kindergeld offset
  const isAdult = childAgeGroup === "18plus";
  const kindergeldPerChild = 250;
  const kindergeldOffset = isAdult ? kindergeldPerChild : kindergeldPerChild / 2;

  const zahlbetragPerChild = Math.max(0, tableAmount - kindergeldOffset);
  const totalPayment = zahlbetragPerChild * numChildren;

  const fmt = (n: number) => "\u20AC" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/german-child-maintenance`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/german-child-maintenance`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <LanguageSwitcher supportedLangs={["en", "de"]} onLanguageChange={setLang} defaultLang="en" />

        <h1 className="text-3xl font-extrabold mb-2">{t("title")}</h1>
        <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">{t("netIncome")} (&euro;)</label>
              <input
                type="number"
                value={netIncome}
                onChange={(e) => setNetIncome(e.target.value)}
                className="input-field"
                placeholder="3000"
              />
              <p className="text-xs text-[var(--muted)] mt-1">{t("netIncomeHelp")}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("childAge")}</label>
              <select value={childAgeGroup} onChange={(e) => setChildAgeGroup(e.target.value)} className="input-field">
                <option value="0to5">{t("age0to5")}</option>
                <option value="6to11">{t("age6to11")}</option>
                <option value="12to17">{t("age12to17")}</option>
                <option value="18plus">{t("age18plus")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("numberOfChildren")}</label>
              <input
                type="number"
                value={numberOfChildren}
                onChange={(e) => setNumberOfChildren(e.target.value)}
                className="input-field"
                min="1"
                max="10"
                placeholder="1"
              />
            </div>
          </div>
        </div>

        {income > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t("maintenanceBefore")}</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(tableAmount)} {t("perChild")}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("kindergeldOffset")}</p>
                <p className="text-2xl font-bold text-red-600">-{fmt(kindergeldOffset)} {t("perChild")}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("actualPayment")}</p>
                <p className="text-2xl font-bold text-green-700">{fmt(zahlbetragPerChild)} {t("perChild")}</p>
              </div>
            </div>

            {numChildren > 1 && (
              <div className="result-card text-center mb-6" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("totalPayment")} ({numChildren} {lang === "de" ? "Kinder" : "children"})</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(totalPayment)}</p>
              </div>
            )}

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">{t("detailsTitle")}</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">{t("incomeGroup")}</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("age0to5")}</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("age6to11")}</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("age12to17")}</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("age18plus")}</th>
                  </tr>
                </thead>
                <tbody>
                  {DUESSELDORFER_TABELLE.map((row, i) => {
                    const isActive = row === bracket;
                    return (
                      <tr key={i} className={isActive ? "bg-blue-50 font-semibold" : "hover:bg-[var(--muted-bg)]"}>
                        <td className="border border-[var(--card-border)] px-3 py-2">{row.label}</td>
                        {row.amounts.map((amt, j) => (
                          <td key={j} className={`border border-[var(--card-border)] px-3 py-2 text-right ${isActive && j === ageIndex ? "text-[var(--primary)] font-bold" : ""}`}>
                            &euro;{amt}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="tool-card bg-amber-50 border-amber-200">
              <h3 className="text-sm font-bold mb-2">{t("noteTitle")}</h3>
              <ul className="text-xs text-[var(--muted)] space-y-1">
                <li>&bull; {t("note1")}</li>
                <li>&bull; {t("note2")}</li>
                <li>&bull; {t("note3")}</li>
              </ul>
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
            name: "German Child Maintenance Calculator (Unterhaltsrechner)",
            description: META.description,
            url: `${SITE_URL}/tools/german-child-maintenance`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
