"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import LanguageSwitcher, { useTranslation, type LangCode } from "@/components/LanguageSwitcher";

const META = {
  title: "Elterngeldrechner - German Parental Allowance Calculator",
  description:
    "Free Elterngeldrechner to calculate German parental allowance (Elterngeld). Supports Basiselterngeld and ElterngeldPlus with accurate replacement rates, minimum and maximum amounts.",
  keywords:
    "Elterngeldrechner, Elterngeld berechnen, parental allowance calculator Germany, Basiselterngeld, ElterngeldPlus, Elterngeld Rechner, parental leave Germany",
};

const translations: Record<LangCode, Record<string, string>> = {
  en: {
    title: "German Parental Allowance Calculator",
    subtitle: "Calculate your Elterngeld (parental allowance) based on your net income before birth. Supports Basiselterngeld and ElterngeldPlus.",
    netIncome: "Net Income Before Birth",
    netIncomeHelp: "Average monthly net income in the 12 months before birth",
    elterngeldType: "Elterngeld Type",
    basiselterngeld: "Basiselterngeld (12+2 months)",
    elterngeldPlus: "ElterngeldPlus (24+4 months)",
    calculate: "Calculate",
    monthlyElterngeld: "Monthly Elterngeld",
    duration: "Duration",
    totalElterngeld: "Total Elterngeld",
    months: "months",
    replacementRate: "Replacement Rate",
    resultTitle: "Your Elterngeld Calculation",
    detailsTitle: "Calculation Details",
    baseIncome: "Net Income",
    rateApplied: "Rate Applied",
    beforeCap: "Before Min/Max Cap",
    afterCap: "After Min/Max Cap",
    minNote: "Minimum: \u20AC300/month (Basis) or \u20AC150/month (Plus)",
    maxNote: "Maximum: \u20AC1,800/month (Basis) or \u20AC900/month (Plus)",
    seoTitle1: "What Is Elterngeld (Parental Allowance)?",
    seoText1: "Elterngeld is a German government benefit paid to parents after the birth of a child. It replaces a portion of the parent's pre-birth net income and is designed to allow parents to take time off work to care for their newborn. Elterngeld is available to all parents who reduce their working hours or stop working entirely after their child's birth. The benefit is funded by the German federal government and administered by local Elterngeldstellen (parental allowance offices). Both mothers and fathers are eligible, and same-sex couples as well as adoptive parents can also claim Elterngeld. The minimum amount is \u20AC300 per month, ensuring that even parents without prior income receive support. The maximum is capped at \u20AC1,800 per month for Basiselterngeld.",
    seoTitle2: "Basiselterngeld vs. ElterngeldPlus",
    seoText2: "Germany offers two main Elterngeld variants. Basiselterngeld is paid for up to 14 months (12 months for one parent plus 2 partner months). The replacement rate is between 65% and 67% of pre-birth net income, with higher rates for lower earners. ElterngeldPlus was introduced in 2015 and pays half the monthly Basiselterngeld amount but for twice as long \u2014 up to 28 months (24 plus 4 partner months). ElterngeldPlus is particularly beneficial for parents who want to work part-time during parental leave, as it can be combined with part-time employment more flexibly. Parents can also mix both variants, taking some months as Basiselterngeld and others as ElterngeldPlus.",
    seoTitle3: "How Is the Replacement Rate Calculated?",
    seoText3: "The standard replacement rate for Elterngeld is 67% of pre-birth net income. However, this rate varies based on income level. For parents earning less than \u20AC1,000 per month net, the rate increases by 0.1 percentage points for every \u20AC2 below the \u20AC1,000 threshold, up to a maximum of 100%. For example, if your net income was \u20AC800, the rate would be 67% + (200/2 \u00D7 0.1%) = 77%. For parents earning more than \u20AC1,200 net per month, the rate decreases to 65%. The calculated amount is then subject to the minimum of \u20AC300 and maximum of \u20AC1,800 per month. For ElterngeldPlus, these caps are halved to \u20AC150 minimum and \u20AC900 maximum.",
    seoTitle4: "Who Is Eligible for Elterngeld in Germany?",
    seoText4: "To be eligible for Elterngeld, you must live in Germany and reside with your child, care for and raise your child yourself, work no more than 32 hours per week (since September 2021), and have taxable income below \u20AC300,000 per year (or \u20AC500,000 for couples). EU/EEA citizens working in Germany are also eligible. Self-employed parents can claim Elterngeld based on their profit from the previous calendar year. Applications must be submitted within three months of the child's birth, and retroactive payments are limited to three months before the application date. It is advisable to apply as early as possible to avoid delays.",
  },
  de: {
    title: "Elterngeldrechner",
    subtitle: "Berechnen Sie Ihr Elterngeld basierend auf Ihrem Nettoeinkommen vor der Geburt. Unterst\u00FCtzt Basiselterngeld und ElterngeldPlus.",
    netIncome: "Nettoeinkommen vor der Geburt",
    netIncomeHelp: "Durchschnittliches monatliches Nettoeinkommen in den 12 Monaten vor der Geburt",
    elterngeldType: "Elterngeld-Variante",
    basiselterngeld: "Basiselterngeld (12+2 Monate)",
    elterngeldPlus: "ElterngeldPlus (24+4 Monate)",
    calculate: "Berechnen",
    monthlyElterngeld: "Monatliches Elterngeld",
    duration: "Bezugsdauer",
    totalElterngeld: "Gesamtbetrag",
    months: "Monate",
    replacementRate: "Ersatzrate",
    resultTitle: "Ihre Elterngeld-Berechnung",
    detailsTitle: "Berechnungsdetails",
    baseIncome: "Nettoeinkommen",
    rateApplied: "Angewandte Rate",
    beforeCap: "Vor Min/Max-Begrenzung",
    afterCap: "Nach Min/Max-Begrenzung",
    minNote: "Minimum: 300 \u20AC/Monat (Basis) oder 150 \u20AC/Monat (Plus)",
    maxNote: "Maximum: 1.800 \u20AC/Monat (Basis) oder 900 \u20AC/Monat (Plus)",
    seoTitle1: "Was ist Elterngeld?",
    seoText1: "Elterngeld ist eine staatliche Leistung in Deutschland, die Eltern nach der Geburt eines Kindes gezahlt wird. Es ersetzt einen Teil des Nettoeinkommens vor der Geburt und soll es Eltern erm\u00F6glichen, sich nach der Geburt um ihr Neugeborenes zu k\u00FCmmern. Elterngeld steht allen Eltern zu, die ihre Arbeitszeit reduzieren oder ganz aufh\u00F6ren zu arbeiten. Die Leistung wird vom Bund finanziert und von den \u00F6rtlichen Elterngeldstellen verwaltet. Sowohl M\u00FCtter als auch V\u00E4ter sind anspruchsberechtigt, ebenso gleichgeschlechtliche Paare und Adoptiveltern. Der Mindestbetrag betr\u00E4gt 300 \u20AC pro Monat, sodass auch Eltern ohne vorheriges Einkommen Unterst\u00FCtzung erhalten. Der H\u00F6chstbetrag ist beim Basiselterngeld auf 1.800 \u20AC pro Monat begrenzt.",
    seoTitle2: "Basiselterngeld vs. ElterngeldPlus",
    seoText2: "Deutschland bietet zwei Hauptvarianten des Elterngeldes an. Das Basiselterngeld wird f\u00FCr bis zu 14 Monate gezahlt (12 Monate f\u00FCr einen Elternteil plus 2 Partnermonate). Die Ersatzrate liegt zwischen 65% und 67% des Nettoeinkommens vor der Geburt, mit h\u00F6heren S\u00E4tzen f\u00FCr Geringverdiener. Das ElterngeldPlus wurde 2015 eingef\u00FChrt und zahlt die H\u00E4lfte des monatlichen Basiselterngeldes, daf\u00FCr aber doppelt so lange \u2014 bis zu 28 Monate (24 plus 4 Partnermonate). ElterngeldPlus ist besonders vorteilhaft f\u00FCr Eltern, die w\u00E4hrend der Elternzeit in Teilzeit arbeiten m\u00F6chten, da es flexibler mit Teilzeitarbeit kombiniert werden kann. Eltern k\u00F6nnen auch beide Varianten mischen und einige Monate als Basiselterngeld und andere als ElterngeldPlus beziehen.",
    seoTitle3: "Wie wird die Ersatzrate berechnet?",
    seoText3: "Die Standard-Ersatzrate f\u00FCr Elterngeld betr\u00E4gt 67% des Nettoeinkommens vor der Geburt. Dieser Satz variiert jedoch je nach Einkommensh\u00F6he. F\u00FCr Eltern mit einem Nettoeinkommen unter 1.000 \u20AC pro Monat erh\u00F6ht sich der Satz um 0,1 Prozentpunkte f\u00FCr je 2 \u20AC unter der 1.000 \u20AC-Grenze, bis maximal 100%. Wenn Ihr Nettoeinkommen beispielsweise 800 \u20AC betrug, w\u00E4re der Satz 67% + (200/2 \u00D7 0,1%) = 77%. F\u00FCr Eltern mit einem Nettoeinkommen \u00FCber 1.200 \u20AC pro Monat sinkt der Satz auf 65%. Der berechnete Betrag unterliegt dann dem Minimum von 300 \u20AC und dem Maximum von 1.800 \u20AC pro Monat. Beim ElterngeldPlus werden diese Grenzen halbiert: 150 \u20AC Minimum und 900 \u20AC Maximum.",
    seoTitle4: "Wer hat Anspruch auf Elterngeld?",
    seoText4: "Um Anspruch auf Elterngeld zu haben, m\u00FCssen Sie in Deutschland leben und mit Ihrem Kind zusammenwohnen, Ihr Kind selbst betreuen und erziehen, nicht mehr als 32 Stunden pro Woche arbeiten (seit September 2021) und ein zu versteuerndes Einkommen unter 300.000 \u20AC pro Jahr (oder 500.000 \u20AC f\u00FCr Paare) haben. EU/EWR-B\u00FCrger, die in Deutschland arbeiten, sind ebenfalls anspruchsberechtigt. Selbstst\u00E4ndige Eltern k\u00F6nnen Elterngeld auf Basis ihres Gewinns aus dem Vorjahr beantragen. Antr\u00E4ge m\u00FCssen innerhalb von drei Monaten nach der Geburt des Kindes gestellt werden, und r\u00FCckwirkende Zahlungen sind auf drei Monate vor dem Antragsdatum begrenzt. Es ist ratsam, den Antrag so fr\u00FCh wie m\u00F6glich zu stellen, um Verz\u00F6gerungen zu vermeiden.",
  },
  ja: {}, pt: {}, fr: {}, es: {}, hi: {},
  no: {},
};

export default function GermanElterngeldPage() {
  const { lang, setLang, t } = useTranslation(translations);
  const [netIncome, setNetIncome] = useState<string>("2500");
  const [elterngeldType, setElterngeldType] = useState<string>("basis");

  const income = parseFloat(netIncome) || 0;

  // Calculate replacement rate
  let rate = 0.67;
  if (income > 1200) {
    rate = 0.65;
  } else if (income < 1000 && income > 0) {
    const diff = 1000 - income;
    const steps = Math.floor(diff / 2);
    rate = 0.67 + steps * 0.001;
    if (rate > 1) rate = 1;
  }

  // Calculate monthly amount
  let monthlyRaw = income * rate;
  let minAmount = 300;
  let maxAmount = 1800;
  let durationMonths = 14;

  if (elterngeldType === "plus") {
    monthlyRaw = monthlyRaw / 2;
    minAmount = 150;
    maxAmount = 900;
    durationMonths = 28;
  }

  const monthly = Math.min(maxAmount, Math.max(minAmount, Math.round(monthlyRaw * 100) / 100));
  const total = monthly * durationMonths;

  const fmt = (n: number) => "\u20AC" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/german-elterngeld`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/german-elterngeld`} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">{t("netIncome")} (&euro;)</label>
              <input
                type="number"
                value={netIncome}
                onChange={(e) => setNetIncome(e.target.value)}
                className="input-field"
                placeholder="2500"
              />
              <p className="text-xs text-[var(--muted)] mt-1">{t("netIncomeHelp")}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("elterngeldType")}</label>
              <select value={elterngeldType} onChange={(e) => setElterngeldType(e.target.value)} className="input-field">
                <option value="basis">{t("basiselterngeld")}</option>
                <option value="plus">{t("elterngeldPlus")}</option>
              </select>
            </div>
          </div>
        </div>

        {income > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("monthlyElterngeld")}</p>
                <p className="text-2xl font-bold text-green-700">{fmt(monthly)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t("duration")}</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{durationMonths} {t("months")}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("totalElterngeld")}</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(total)}</p>
              </div>
            </div>

            <div className="tool-card">
              <h2 className="text-lg font-bold mb-4">{t("detailsTitle")}</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{t("baseIncome")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(income)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{t("rateApplied")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{(rate * 100).toFixed(1)}%</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{t("beforeCap")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(monthlyRaw)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)] bg-green-50 font-semibold">
                    <td className="border border-[var(--card-border)] px-3 py-2">{t("afterCap")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(monthly)}</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-[var(--muted)] mt-3">{t("minNote")}</p>
              <p className="text-xs text-[var(--muted)]">{t("maxNote")}</p>
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
            name: "German Parental Allowance Calculator (Elterngeldrechner)",
            description: META.description,
            url: `${SITE_URL}/tools/german-elterngeld`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
