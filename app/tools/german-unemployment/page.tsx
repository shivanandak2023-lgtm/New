"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import LanguageSwitcher, { useTranslation, type LangCode } from "@/components/LanguageSwitcher";

const META = {
  title: "ALG I Rechner - German Unemployment Benefit Calculator",
  description:
    "Free ALG I Rechner to calculate German unemployment benefits (Arbeitslosengeld I). Includes tax class, children bonus, and duration based on age and contribution history.",
  keywords:
    "ALG I Rechner, Arbeitslosengeld Rechner, unemployment benefit calculator Germany, ALG 1 berechnen, German unemployment insurance, Arbeitslosengeld berechnen",
};

const translations: Record<LangCode, Record<string, string>> = {
  en: {
    title: "German Unemployment Benefit Calculator",
    subtitle: "Calculate your ALG I (Arbeitslosengeld I) based on your previous gross salary, tax class, and family situation.",
    grossSalary: "Monthly Gross Salary",
    grossSalaryHelp: "Your average monthly gross salary before unemployment",
    taxClass: "Tax Class (Steuerklasse)",
    children: "Children",
    childrenYes: "Yes (67%)",
    childrenNo: "No (60%)",
    bundesland: "State (Bundesland)",
    age: "Age",
    ageUnder50: "Under 50",
    age50Plus: "50 or older",
    calculate: "Calculate",
    dailyRate: "Daily Benefit Rate",
    monthlyAlg: "Monthly ALG I",
    duration: "Duration",
    totalBenefit: "Total Benefit",
    months: "months",
    resultTitle: "Your ALG I Calculation",
    detailsTitle: "Calculation Breakdown",
    grossMonthly: "Gross Monthly Salary",
    estimatedNet: "Estimated Net (after tax & social)",
    benefitRate: "Benefit Rate",
    dailyGross: "Daily Gross",
    dailyNet: "Daily Net",
    dailyBenefit: "Daily ALG I",
    childrenLabel: "Children",
    yes: "Yes",
    no: "No",
    seoTitle1: "What Is Arbeitslosengeld I (ALG I)?",
    seoText1: "Arbeitslosengeld I (ALG I) is the primary unemployment benefit in Germany, funded through mandatory unemployment insurance contributions from both employers and employees. To qualify, you must have paid into the unemployment insurance system for at least 12 months within the last 30 months. ALG I is administered by the Bundesagentur f\u00FCr Arbeit (Federal Employment Agency) and provides temporary income replacement while you search for new employment. Unlike ALG II (B\u00FCrgergeld), ALG I is an insurance benefit, not a welfare payment, and the amount you receive depends on your previous salary and personal circumstances. It is essential to register as unemployed with the Arbeitsagentur at least three months before your employment ends, or immediately when you learn of your upcoming unemployment. Late registration may result in a waiting period before benefits begin.",
    seoTitle2: "How ALG I Is Calculated",
    seoText2: "ALG I is calculated based on your average gross salary during the last 12 months of employment. First, your daily gross salary is determined by dividing your annual gross by 365. Then, taxes and social contributions are deducted to arrive at a daily net amount (Leistungsentgelt). The benefit rate is 60% of this daily net amount, or 67% if you have at least one child. The maximum daily assessment ceiling (Bemessungsgrenze) is \u20AC7,550/month in western Germany and \u20AC7,150/month in eastern Germany for 2024. The minimum benefit is not explicitly defined, but the calculated amount cannot fall below the ALG II level. Benefits are paid monthly in arrears, and you must remain available for work and actively seek employment to continue receiving them.",
    seoTitle3: "How Long Can You Receive ALG I?",
    seoText3: "The duration of ALG I benefits depends on two factors: your age and how long you contributed to unemployment insurance. If you are under 50, you can receive ALG I for a maximum of 12 months if you contributed for at least 24 months. For those aged 50 and above, the maximum duration extends up to 24 months based on longer contribution periods. Specifically: 50+ with 30 months of contributions get 15 months, 55+ with 36 months get 18 months, and 58+ with 48 months get 24 months. The contribution period is assessed within the last 5 years (30 months framework for under 50, extended for older workers). During your benefit period, you can take on short-term employment (under 15 hours per week) without losing your ALG I, though earnings above \u20AC165/month will reduce your benefit.",
    seoTitle4: "Tax Class Impact on ALG I",
    seoText4: "Your tax class (Steuerklasse) significantly affects your ALG I amount because it determines the net salary used for the calculation. Tax Class III (married, higher earner) results in lower tax deductions and therefore a higher net salary, leading to higher ALG I. Conversely, Tax Class V (married, lower earner) results in higher tax deductions and lower ALG I. If you anticipate unemployment, it may be beneficial to switch to a more favorable tax class before becoming unemployed, though the Arbeitsagentur may review tax class changes made within 12 months of unemployment. For ALG I purposes, the Arbeitsagentur uses a simplified flat-rate calculation (Pauschalabzug) rather than your actual tax deductions. Social contributions (pension, health, long-term care insurance) are also deducted at standardized rates to arrive at the daily net amount used for the benefit calculation.",
  },
  de: {
    title: "Arbeitslosengeld I Rechner",
    subtitle: "Berechnen Sie Ihr ALG I basierend auf Ihrem bisherigen Bruttogehalt, Ihrer Steuerklasse und Ihrer famili\u00E4ren Situation.",
    grossSalary: "Monatliches Bruttogehalt",
    grossSalaryHelp: "Ihr durchschnittliches monatliches Bruttogehalt vor der Arbeitslosigkeit",
    taxClass: "Steuerklasse",
    children: "Kinder",
    childrenYes: "Ja (67%)",
    childrenNo: "Nein (60%)",
    bundesland: "Bundesland",
    age: "Alter",
    ageUnder50: "Unter 50",
    age50Plus: "50 oder \u00E4lter",
    calculate: "Berechnen",
    dailyRate: "T\u00E4glicher Leistungssatz",
    monthlyAlg: "Monatliches ALG I",
    duration: "Bezugsdauer",
    totalBenefit: "Gesamtleistung",
    months: "Monate",
    resultTitle: "Ihre ALG I Berechnung",
    detailsTitle: "Berechnungsdetails",
    grossMonthly: "Monatliches Bruttogehalt",
    estimatedNet: "Gesch\u00E4tztes Netto (nach Steuern & Sozialabgaben)",
    benefitRate: "Leistungssatz",
    dailyGross: "T\u00E4gliches Brutto",
    dailyNet: "T\u00E4gliches Netto",
    dailyBenefit: "T\u00E4gliches ALG I",
    childrenLabel: "Kinder",
    yes: "Ja",
    no: "Nein",
    seoTitle1: "Was ist Arbeitslosengeld I (ALG I)?",
    seoText1: "Das Arbeitslosengeld I (ALG I) ist die prim\u00E4re Arbeitslosenversicherungsleistung in Deutschland. Es wird durch Pflichtbeitr\u00E4ge zur Arbeitslosenversicherung von Arbeitgebern und Arbeitnehmern finanziert. Um Anspruch zu haben, m\u00FCssen Sie in den letzten 30 Monaten mindestens 12 Monate in die Arbeitslosenversicherung eingezahlt haben. ALG I wird von der Bundesagentur f\u00FCr Arbeit verwaltet und bietet eine vor\u00FCbergehende Einkommensersatzleistung w\u00E4hrend der Arbeitssuche. Im Gegensatz zum ALG II (B\u00FCrgergeld) ist ALG I eine Versicherungsleistung und keine Sozialleistung. Die H\u00F6he h\u00E4ngt von Ihrem bisherigen Gehalt und Ihren pers\u00F6nlichen Umst\u00E4nden ab. Es ist wichtig, sich sp\u00E4testens drei Monate vor Ende des Arbeitsverh\u00E4ltnisses oder sofort nach Kenntnis der bevorstehenden Arbeitslosigkeit bei der Arbeitsagentur arbeitsuchend zu melden. Eine versp\u00E4tete Meldung kann zu einer Sperrzeit f\u00FChren.",
    seoTitle2: "Wie wird ALG I berechnet?",
    seoText2: "ALG I wird auf Basis Ihres durchschnittlichen Bruttogehalts der letzten 12 Besch\u00E4ftigungsmonate berechnet. Zun\u00E4chst wird das t\u00E4gliche Bruttogehalt ermittelt, indem das Jahresbrutto durch 365 geteilt wird. Dann werden Steuern und Sozialabgaben abgezogen, um das t\u00E4gliche Netto (Leistungsentgelt) zu ermitteln. Der Leistungssatz betr\u00E4gt 60% dieses t\u00E4glichen Nettos, oder 67% wenn Sie mindestens ein Kind haben. Die maximale t\u00E4gliche Bemessungsgrenze liegt bei 7.550 \u20AC/Monat in Westdeutschland und 7.150 \u20AC/Monat in Ostdeutschland f\u00FCr 2024. Es gibt keinen expliziten Mindestbetrag, aber der berechnete Betrag darf nicht unter das ALG II-Niveau fallen. Leistungen werden monatlich nachtr\u00E4glich gezahlt, und Sie m\u00FCssen dem Arbeitsmarkt zur Verf\u00FCgung stehen und aktiv Arbeit suchen.",
    seoTitle3: "Wie lange kann man ALG I beziehen?",
    seoText3: "Die Bezugsdauer des ALG I h\u00E4ngt von zwei Faktoren ab: Ihrem Alter und der Dauer Ihrer Beitragszahlung zur Arbeitslosenversicherung. Unter 50 Jahren k\u00F6nnen Sie ALG I maximal 12 Monate beziehen, wenn Sie mindestens 24 Monate Beitr\u00E4ge gezahlt haben. Ab 50 Jahren verl\u00E4ngert sich die maximale Bezugsdauer auf bis zu 24 Monate bei l\u00E4ngeren Beitragszeiten. Im Detail: Ab 50 mit 30 Beitragsmonaten 15 Monate, ab 55 mit 36 Monaten 18 Monate, und ab 58 mit 48 Monaten 24 Monate. Die Beitragszeit wird innerhalb der letzten 5 Jahre gepr\u00FCft. W\u00E4hrend des Leistungsbezugs k\u00F6nnen Sie kurzfristig arbeiten (unter 15 Stunden pro Woche), ohne ALG I zu verlieren, wobei Einkommen \u00FCber 165 \u20AC/Monat angerechnet wird.",
    seoTitle4: "Einfluss der Steuerklasse auf ALG I",
    seoText4: "Ihre Steuerklasse beeinflusst die H\u00F6he Ihres ALG I erheblich, da sie das f\u00FCr die Berechnung verwendete Nettogehalt bestimmt. Steuerklasse III (verheiratet, Besserverdiener) f\u00FChrt zu niedrigeren Steuerabz\u00FCgen und damit zu einem h\u00F6heren Nettogehalt und h\u00F6herem ALG I. Steuerklasse V (verheiratet, Geringverdiener) f\u00FChrt hingegen zu h\u00F6heren Steuerabz\u00FCgen und niedrigerem ALG I. Wenn Sie Arbeitslosigkeit erwarten, kann ein Wechsel zu einer g\u00FCnstigeren Steuerklasse sinnvoll sein, obwohl die Arbeitsagentur Steuerklassenwechsel innerhalb von 12 Monaten vor der Arbeitslosigkeit \u00FCberpr\u00FCfen kann. F\u00FCr die ALG I-Berechnung verwendet die Arbeitsagentur eine vereinfachte pauschale Berechnung statt Ihrer tats\u00E4chlichen Steuerabz\u00FCge. Sozialversicherungsbeitr\u00E4ge (Renten-, Kranken- und Pflegeversicherung) werden ebenfalls zu Pauschals\u00E4tzen abgezogen.",
  },
  ja: {}, pt: {}, fr: {}, es: {}, hi: {},
  no: {},
};

const STATES = [
  "Baden-W\u00FCrttemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg",
  "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen",
  "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Th\u00FCringen",
];

const EAST_STATES = ["Berlin", "Brandenburg", "Mecklenburg-Vorpommern", "Sachsen", "Sachsen-Anhalt", "Th\u00FCringen"];

function getTaxClassFactor(taxClass: string): number {
  switch (taxClass) {
    case "I": return 1.0;
    case "II": return 0.90;
    case "III": return 0.65;
    case "IV": return 1.0;
    case "V": return 1.35;
    case "VI": return 1.20;
    default: return 1.0;
  }
}

export default function GermanUnemploymentPage() {
  const { lang, setLang, t } = useTranslation(translations);
  const [grossSalary, setGrossSalary] = useState<string>("3500");
  const [taxClass, setTaxClass] = useState<string>("I");
  const [hasChildren, setHasChildren] = useState<boolean>(false);
  const [bundesland, setBundesland] = useState<string>("Nordrhein-Westfalen");
  const [ageGroup, setAgeGroup] = useState<string>("under50");

  const monthly = parseFloat(grossSalary) || 0;

  // Cap at Bemessungsgrenze
  const isEast = EAST_STATES.includes(bundesland);
  const cap = isEast ? 7150 : 7550;
  const cappedMonthly = Math.min(monthly, cap);

  // Estimate net from gross using simplified tax calculation
  const annualGross = cappedMonthly * 12;
  const socialRate = 0.206; // ~20.6% employee share
  const socialDeductions = cappedMonthly * socialRate;

  // Simplified income tax estimation
  const factor = getTaxClassFactor(taxClass);
  let annualTax = 0;
  const taxable = annualGross;
  if (taxable > 11604) {
    if (taxable <= 17005) {
      const y = (taxable - 11604) / 10000;
      annualTax = (922.98 * y + 1400) * y;
    } else if (taxable <= 66760) {
      const z = (taxable - 17005) / 10000;
      annualTax = (181.19 * z + 2397) * z + 1025.38;
    } else if (taxable <= 277825) {
      annualTax = 0.42 * taxable - 10602.13;
    } else {
      annualTax = 0.45 * taxable - 18936.88;
    }
  }
  annualTax = Math.max(0, annualTax * factor);
  const monthlyTax = annualTax / 12;

  const estimatedNet = cappedMonthly - socialDeductions - monthlyTax;
  const dailyNet = estimatedNet / 30;

  // ALG I rate
  const algRate = hasChildren ? 0.67 : 0.60;
  const dailyBenefit = dailyNet * algRate;
  const monthlyAlg = dailyBenefit * 30;

  // Duration
  const durationMonths = ageGroup === "under50" ? 12 : 24;
  const totalBenefit = monthlyAlg * durationMonths;

  const fmt = (n: number) => "\u20AC" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/german-unemployment`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/german-unemployment`} />
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
              <label className="block text-sm font-medium mb-1">{t("grossSalary")} (&euro;)</label>
              <input
                type="number"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                className="input-field"
                placeholder="3500"
              />
              <p className="text-xs text-[var(--muted)] mt-1">{t("grossSalaryHelp")}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("taxClass")}</label>
              <select value={taxClass} onChange={(e) => setTaxClass(e.target.value)} className="input-field">
                <option value="I">Klasse I</option>
                <option value="II">Klasse II</option>
                <option value="III">Klasse III</option>
                <option value="IV">Klasse IV</option>
                <option value="V">Klasse V</option>
                <option value="VI">Klasse VI</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("children")}</label>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setHasChildren(false)}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    !hasChildren
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {t("childrenNo")}
                </button>
                <button
                  onClick={() => setHasChildren(true)}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    hasChildren
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {t("childrenYes")}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("bundesland")}</label>
              <select value={bundesland} onChange={(e) => setBundesland(e.target.value)} className="input-field">
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("age")}</label>
              <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="input-field">
                <option value="under50">{t("ageUnder50")}</option>
                <option value="50plus">{t("age50Plus")}</option>
              </select>
            </div>
          </div>
        </div>

        {monthly > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t("dailyRate")}</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(dailyBenefit)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("monthlyAlg")}</p>
                <p className="text-2xl font-bold text-green-700">{fmt(monthlyAlg)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t("duration")}</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{durationMonths} {t("months")}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("totalBenefit")}</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(totalBenefit)}</p>
              </div>
            </div>

            <div className="tool-card">
              <h2 className="text-lg font-bold mb-4">{t("detailsTitle")}</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{t("grossMonthly")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(cappedMonthly)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{t("estimatedNet")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(estimatedNet)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{t("dailyNet")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(dailyNet)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{t("benefitRate")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{(algRate * 100).toFixed(0)}%</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)] bg-green-50 font-semibold">
                    <td className="border border-[var(--card-border)] px-3 py-2">{t("dailyBenefit")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(dailyBenefit)}</td>
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
            name: "German Unemployment Benefit Calculator (ALG I Rechner)",
            description: META.description,
            url: `${SITE_URL}/tools/german-unemployment`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
