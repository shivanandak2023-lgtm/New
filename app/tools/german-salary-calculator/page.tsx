"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import LanguageSwitcher, { useTranslation, type LangCode } from "@/components/LanguageSwitcher";

const META = {
  title: "Brutto Netto Rechner - German Salary Calculator",
  description:
    "Free Brutto-Netto Rechner to calculate your German take-home salary. Includes Lohnsteuer, Solidaritätszuschlag, Kirchensteuer, and social contributions for all tax classes (Steuerklassen I-VI).",
  keywords:
    "Brutto Netto Rechner, Gehaltsrechner, salary calculator Germany, German tax calculator, Lohnsteuer, Steuerklasse, Netto Gehalt, gross net calculator Germany",
};

const translations: Record<LangCode, Record<string, string>> = {
  en: {
    title: "German Salary Calculator",
    subtitle: "Calculate your net salary (Netto) from gross income (Brutto) with German tax and social contribution deductions for 2024.",
    grossSalary: "Annual Gross Salary",
    taxClass: "Tax Class (Steuerklasse)",
    state: "State (Bundesland)",
    churchTax: "Church Tax (Kirchensteuer)",
    churchTaxYes: "Yes",
    churchTaxNo: "No",
    churchTaxRate: "Church Tax Rate",
    calculate: "Calculate",
    monthlyGross: "Monthly Gross",
    monthlyNet: "Monthly Net",
    annualNet: "Annual Net",
    breakdownTitle: "Monthly Deductions Breakdown",
    deduction: "Deduction",
    monthly: "Monthly",
    annual: "Annual",
    incomeTax: "Income Tax (Lohnsteuer)",
    solidarity: "Solidarity Surcharge (Soli)",
    churchTaxLabel: "Church Tax (Kirchensteuer)",
    pension: "Pension Insurance (9.3%)",
    health: "Health Insurance (7.3% + 1.3%)",
    unemployment: "Unemployment Insurance (1.3%)",
    care: "Care Insurance (1.7%)",
    socialTotal: "Social Contributions",
    totalDeductions: "Total Deductions",
    netPay: "Net Pay (Netto)",
    seoTitle1: "How German Income Tax Works",
    seoText1: "Germany uses a progressive income tax system for 2024. The starting rate is 14% for taxable income above the basic allowance (Grundfreibetrag) of €11,604. The rate increases progressively to 42% for income above €62,810 and 45% (Reichensteuer) for income above €277,826.",
    seoTitle2: "Tax Classes in Germany (Steuerklassen)",
    seoText2: "Germany has six tax classes: Class I for single persons, Class II for single parents, Class III for married (higher earner), Class IV for married (equal earners), Class V for married (lower earner), and Class VI for second jobs. Your tax class affects your monthly withholding but not your final annual tax liability.",
    seoTitle3: "Social Contributions",
    seoText3: "German employees pay approximately 20.6% in social contributions: pension insurance (9.3%), health insurance (7.3% base + ~1.3% supplementary), unemployment insurance (1.3%), and long-term care insurance (1.7%, or 2.3% for childless over 23). Employers match these contributions.",
    seoTitle4: "Solidarity Surcharge (Solidaritätszuschlag)",
    seoText4: "The solidarity surcharge is 5.5% of income tax, but since 2021 it has been eliminated for most taxpayers. It only applies when annual income tax exceeds €18,130 (single) or €36,260 (married), with a phase-in zone above these thresholds.",
  },
  de: {
    title: "Brutto-Netto-Rechner",
    subtitle: "Berechnen Sie Ihr Nettogehalt aus dem Bruttoeinkommen mit deutschen Steuer- und Sozialversicherungsabzügen für 2024.",
    grossSalary: "Jahresbruttoeinkommen",
    taxClass: "Steuerklasse",
    state: "Bundesland",
    churchTax: "Kirchensteuer",
    churchTaxYes: "Ja",
    churchTaxNo: "Nein",
    churchTaxRate: "Kirchensteuersatz",
    calculate: "Berechnen",
    monthlyGross: "Monatliches Brutto",
    monthlyNet: "Monatliches Netto",
    annualNet: "Jährliches Netto",
    breakdownTitle: "Monatliche Abzüge im Detail",
    deduction: "Abzug",
    monthly: "Monatlich",
    annual: "Jährlich",
    incomeTax: "Lohnsteuer",
    solidarity: "Solidaritätszuschlag",
    churchTaxLabel: "Kirchensteuer",
    pension: "Rentenversicherung (9,3%)",
    health: "Krankenversicherung (7,3% + 1,3%)",
    unemployment: "Arbeitslosenversicherung (1,3%)",
    care: "Pflegeversicherung (1,7%)",
    socialTotal: "Sozialabgaben",
    totalDeductions: "Gesamtabzüge",
    netPay: "Nettolohn",
    seoTitle1: "Wie die deutsche Einkommensteuer funktioniert",
    seoText1: "Deutschland verwendet ein progressives Einkommensteuersystem für 2024. Der Eingangssteuersatz beträgt 14% für zu versteuerndes Einkommen über dem Grundfreibetrag von 11.604 €. Der Satz steigt progressiv auf 42% für Einkommen über 62.810 € und 45% (Reichensteuer) für Einkommen über 277.826 €.",
    seoTitle2: "Steuerklassen in Deutschland",
    seoText2: "Deutschland hat sechs Steuerklassen: Klasse I für Ledige, Klasse II für Alleinerziehende, Klasse III für Verheiratete (Besserverdiener), Klasse IV für Verheiratete (gleiches Einkommen), Klasse V für Verheiratete (Geringverdiener) und Klasse VI für Zweitjobs. Ihre Steuerklasse beeinflusst den monatlichen Abzug, nicht die endgültige Jahressteuer.",
    seoTitle3: "Sozialversicherungsbeiträge",
    seoText3: "Deutsche Arbeitnehmer zahlen ca. 20,6% Sozialabgaben: Rentenversicherung (9,3%), Krankenversicherung (7,3% Basis + ~1,3% Zusatzbeitrag), Arbeitslosenversicherung (1,3%) und Pflegeversicherung (1,7% bzw. 2,3% für Kinderlose über 23). Arbeitgeber übernehmen die gleichen Beiträge.",
    seoTitle4: "Solidaritätszuschlag",
    seoText4: "Der Solidaritätszuschlag beträgt 5,5% der Einkommensteuer, wurde aber seit 2021 für die meisten Steuerzahler abgeschafft. Er gilt nur, wenn die jährliche Einkommensteuer 18.130 € (Ledige) bzw. 36.260 € (Verheiratete) übersteigt, mit einer Gleitzone oberhalb dieser Schwellen.",
  },
  ja: {}, pt: {}, fr: {}, es: {}, hi: {},
    no: {},
};

const STATES = [
  "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg",
  "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen",
  "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen",
];

const CHURCH_TAX_RATES: Record<string, number> = {
  "Baden-Württemberg": 8, "Bayern": 8,
  "Berlin": 9, "Brandenburg": 9, "Bremen": 9, "Hamburg": 9,
  "Hessen": 9, "Mecklenburg-Vorpommern": 9, "Niedersachsen": 9,
  "Nordrhein-Westfalen": 9, "Rheinland-Pfalz": 9, "Saarland": 9,
  "Sachsen": 9, "Sachsen-Anhalt": 9, "Schleswig-Holstein": 9, "Thüringen": 9,
};

// Social contribution caps (annual, 2024)
const PENSION_CAP = 90600; // West
const HEALTH_CAP = 62100;

function calcGermanIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 11604) return 0;
  if (taxableIncome <= 17005) {
    const y = (taxableIncome - 11604) / 10000;
    return (922.98 * y + 1400) * y;
  }
  if (taxableIncome <= 66760) {
    const z = (taxableIncome - 17005) / 10000;
    return (181.19 * z + 2397) * z + 1025.38;
  }
  if (taxableIncome <= 277825) {
    return 0.42 * taxableIncome - 10602.13;
  }
  return 0.45 * taxableIncome - 18936.88;
}

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

export default function GermanSalaryCalculatorPage() {
  const { lang, setLang, t } = useTranslation(translations);
  const [grossSalary, setGrossSalary] = useState<string>("50000");
  const [taxClass, setTaxClass] = useState<string>("I");
  const [state, setState] = useState<string>("Nordrhein-Westfalen");
  const [churchTax, setChurchTax] = useState<boolean>(false);

  const annual = parseFloat(grossSalary) || 0;
  const monthlyGross = annual / 12;

  // Income tax calculation
  const baseTax = calcGermanIncomeTax(annual);
  const factor = getTaxClassFactor(taxClass);
  const annualIncomeTax = Math.max(0, Math.round(baseTax * factor * 100) / 100);

  // Solidarity surcharge (5.5% of income tax, phased out for most)
  const soliThreshold = taxClass === "III" ? 36260 : 18130;
  let annualSoli = 0;
  if (annualIncomeTax > soliThreshold) {
    annualSoli = annualIncomeTax * 0.055;
  }

  // Church tax
  const churchRate = churchTax ? (CHURCH_TAX_RATES[state] || 9) / 100 : 0;
  const annualChurchTax = annualIncomeTax * churchRate;

  // Social contributions (employee share)
  const pensionBase = Math.min(annual, PENSION_CAP);
  const healthBase = Math.min(annual, HEALTH_CAP);

  const annualPension = pensionBase * 0.093;
  const annualHealth = healthBase * (0.073 + 0.013); // base + avg supplementary
  const annualUnemployment = healthBase * 0.013;
  const annualCare = healthBase * 0.017;
  const annualSocial = annualPension + annualHealth + annualUnemployment + annualCare;

  const totalDeductions = annualIncomeTax + annualSoli + annualChurchTax + annualSocial;
  const annualNet = annual - totalDeductions;

  const fmt = (n: number) => "€" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/german-salary-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/german-salary-calculator`} />
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
              <label className="block text-sm font-medium mb-1">{t("grossSalary")} (€)</label>
              <input
                type="number"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                className="input-field"
                placeholder="50000"
              />
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
              <label className="block text-sm font-medium mb-1">{t("state")}</label>
              <select value={state} onChange={(e) => setState(e.target.value)} className="input-field">
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("churchTax")}</label>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setChurchTax(false)}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    !churchTax
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {t("churchTaxNo")}
                </button>
                <button
                  onClick={() => setChurchTax(true)}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    churchTax
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {t("churchTaxYes")} ({CHURCH_TAX_RATES[state] || 9}%)
                </button>
              </div>
            </div>
          </div>
        </div>

        {annual > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t("monthlyGross")}</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(monthlyGross)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("monthlyNet")}</p>
                <p className="text-2xl font-bold text-green-700">{fmt(annualNet / 12)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("annualNet")}</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(annualNet)}</p>
              </div>
            </div>

            <div className="tool-card">
              <h2 className="text-lg font-bold mb-4">{t("breakdownTitle")}</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">{t("deduction")}</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("monthly")}</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("annual")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">{t("incomeTax")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualIncomeTax / 12)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualIncomeTax)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">{t("solidarity")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualSoli / 12)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualSoli)}</td>
                  </tr>
                  {churchTax && (
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{t("churchTaxLabel")}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualChurchTax / 12)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualChurchTax)}</td>
                    </tr>
                  )}
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">{t("pension")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualPension / 12)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualPension)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">{t("health")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualHealth / 12)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualHealth)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">{t("unemployment")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualUnemployment / 12)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualUnemployment)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">{t("care")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualCare / 12)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(annualCare)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)] bg-blue-50 font-semibold">
                    <td className="border border-[var(--card-border)] px-3 py-2">{t("totalDeductions")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">{fmt(totalDeductions / 12)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">{fmt(totalDeductions)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)] bg-green-50 font-bold">
                    <td className="border border-[var(--card-border)] px-3 py-2">{t("netPay")}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(annualNet / 12)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(annualNet)}</td>
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
            name: "German Salary Calculator (Brutto Netto Rechner)",
            description: META.description,
            url: `${SITE_URL}/tools/german-salary-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
