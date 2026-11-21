"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import LanguageSwitcher, { useTranslation, type LangCode } from "@/components/LanguageSwitcher";

const META = {
  title: "Tilgungsrechner - German Loan Repayment Calculator",
  description:
    "Free Tilgungsrechner to calculate German mortgage repayment with annuity system. See monthly payments, remaining debt, total interest, and year-by-year Tilgungsplan.",
  keywords:
    "Tilgungsrechner, Tilgungsplan, loan repayment calculator Germany, Annuit\u00E4tendarlehen, German mortgage calculator, Restschuld, Sondertilgung",
};

const translations: Record<LangCode, Record<string, string>> = {
  en: {
    title: "German Loan Repayment Calculator",
    subtitle: "Calculate your German mortgage (Annuit\u00E4tendarlehen) with monthly payments, remaining debt, and a detailed repayment schedule.",
    loanAmount: "Loan Amount (Darlehensbetrag)",
    interestRate: "Interest Rate (Sollzinssatz)",
    initialRepayment: "Initial Repayment Rate (Anf\u00E4ngliche Tilgung)",
    fixedPeriod: "Fixed Rate Period (Zinsbindung)",
    extraPayment: "Annual Extra Payment (Sondertilgung)",
    years: "years",
    calculate: "Calculate",
    monthlyPayment: "Monthly Payment",
    remainingDebt: "Remaining Debt",
    totalInterest: "Total Interest",
    totalTerm: "Est. Total Term",
    afterFixedPeriod: "after fixed period",
    overFixedPeriod: "over fixed period",
    resultTitle: "Your Repayment Summary",
    scheduleTitle: "Repayment Schedule (Tilgungsplan)",
    year: "Year",
    yearlyPayment: "Payment",
    interestPortion: "Interest",
    repaymentPortion: "Repayment",
    extraPaymentCol: "Extra",
    remainingDebtCol: "Remaining Debt",
    monthlyRate: "Monatsrate",
    seoTitle1: "How German Mortgages Work (Annuit\u00E4tendarlehen)",
    seoText1: "The most common type of mortgage in Germany is the Annuit\u00E4tendarlehen (annuity loan). Unlike variable-rate mortgages common in other countries, German mortgages typically feature a fixed interest rate (Sollzins) for a specified period called the Zinsbindung, usually 5, 10, 15, or 20 years. During this period, the monthly payment (Monatsrate) remains constant. Each payment consists of two parts: the interest portion (Zinsanteil) and the repayment portion (Tilgungsanteil). As the loan balance decreases, the interest portion shrinks and the repayment portion grows, while the total monthly payment stays the same. After the Zinsbindung expires, the remaining debt (Restschuld) must be refinanced at the then-current interest rates, which introduces the main risk of German mortgages \u2014 rising interest rates at refinancing time.",
    seoTitle2: "Understanding Initial Repayment Rate (Anf\u00E4ngliche Tilgung)",
    seoText2: "In Germany, mortgage terms are expressed differently than in many other countries. Instead of choosing a loan term (e.g., 30 years), borrowers select an initial repayment rate (anf\u00E4ngliche Tilgung), typically between 1% and 5% of the loan amount per year. A higher initial repayment rate means higher monthly payments but faster debt reduction. For example, with a 2% initial repayment rate on a \u20AC300,000 loan, you would repay \u20AC6,000 in principal in the first year. The repayment rate increases automatically each year as the interest portion decreases, accelerating the debt reduction. Most financial advisors recommend at least 2% initial repayment to ensure the loan is paid off within 25\u201330 years. With very low initial repayment rates (1%), the total loan term can extend to 40+ years.",
    seoTitle3: "Sondertilgung (Extra Payments)",
    seoText3: "Sondertilgung refers to extra lump-sum payments made in addition to the regular monthly payments. Most German mortgage contracts allow annual Sondertilgungen of 5\u201310% of the original loan amount without penalty. Making extra payments can significantly reduce the total interest paid and shorten the loan term. For example, on a \u20AC300,000 loan at 3% interest with 2% initial repayment, an annual Sondertilgung of \u20AC5,000 can save tens of thousands in interest and reduce the total term by several years. Some lenders offer higher Sondertilgung allowances, though these may come with a slightly higher interest rate. It is important to check your loan contract for the exact Sondertilgung terms, as exceeding the allowed amount may incur a prepayment penalty (Vorf\u00E4lligkeitsentsch\u00E4digung).",
    seoTitle4: "Tips for German Mortgage Borrowers",
    seoText4: "When taking out a mortgage in Germany, consider these key factors: First, compare offers from multiple banks and use a Kreditvermittler (mortgage broker) who can access deals from many lenders. Second, choose a Zinsbindung that matches your risk tolerance \u2014 longer fixed periods offer more security but may cost slightly more. Third, negotiate the best possible initial conditions, including Sondertilgung rights and the option to change repayment rates (Tilgungssatzwechsel). Fourth, consider the KfW (Kreditanstalt f\u00FCr Wiederaufbau) government-backed loans, which offer subsidized interest rates for energy-efficient homes and renovations. Fifth, factor in the Nebenkosten (additional purchase costs) of 7\u201315% of the property price, including Grunderwerbsteuer (property transfer tax), notary fees, and real estate agent commissions. These must typically be paid from your own funds, not financed through the mortgage.",
  },
  de: {
    title: "Tilgungsrechner",
    subtitle: "Berechnen Sie Ihr Annuit\u00E4tendarlehen mit monatlicher Rate, Restschuld und detailliertem Tilgungsplan.",
    loanAmount: "Darlehensbetrag",
    interestRate: "Sollzinssatz",
    initialRepayment: "Anf\u00E4ngliche Tilgung",
    fixedPeriod: "Zinsbindung",
    extraPayment: "J\u00E4hrliche Sondertilgung",
    years: "Jahre",
    calculate: "Berechnen",
    monthlyPayment: "Monatsrate",
    remainingDebt: "Restschuld",
    totalInterest: "Gesamtzinsen",
    totalTerm: "Gesch. Gesamtlaufzeit",
    afterFixedPeriod: "nach Zinsbindung",
    overFixedPeriod: "\u00FCber Zinsbindung",
    resultTitle: "Ihre Tilgungs\u00FCbersicht",
    scheduleTitle: "Tilgungsplan",
    year: "Jahr",
    yearlyPayment: "Zahlung",
    interestPortion: "Zinsen",
    repaymentPortion: "Tilgung",
    extraPaymentCol: "Sondertilg.",
    remainingDebtCol: "Restschuld",
    monthlyRate: "Monatsrate",
    seoTitle1: "Wie funktioniert ein Annuit\u00E4tendarlehen?",
    seoText1: "Die h\u00E4ufigste Hypothekenart in Deutschland ist das Annuit\u00E4tendarlehen. Im Gegensatz zu variabel verzinsten Hypotheken in anderen L\u00E4ndern zeichnen sich deutsche Hypotheken durch einen festen Zinssatz (Sollzins) f\u00FCr einen bestimmten Zeitraum aus, die sogenannte Zinsbindung, die in der Regel 5, 10, 15 oder 20 Jahre betr\u00E4gt. W\u00E4hrend dieses Zeitraums bleibt die monatliche Zahlung (Monatsrate) konstant. Jede Zahlung besteht aus zwei Teilen: dem Zinsanteil und dem Tilgungsanteil. Mit sinkender Restschuld nimmt der Zinsanteil ab und der Tilgungsanteil zu, w\u00E4hrend die monatliche Gesamtzahlung gleich bleibt. Nach Ablauf der Zinsbindung muss die Restschuld zu den dann g\u00FCltigen Zinss\u00E4tzen refinanziert werden, was das Hauptrisiko deutscher Hypotheken darstellt \u2014 steigende Zinsen zum Zeitpunkt der Anschlussfinanzierung.",
    seoTitle2: "Anf\u00E4ngliche Tilgung verstehen",
    seoText2: "In Deutschland werden Hypothekenkonditionen anders ausgedr\u00FCckt als in vielen anderen L\u00E4ndern. Statt einer festen Laufzeit (z.B. 30 Jahre) w\u00E4hlen Kreditnehmer eine anf\u00E4ngliche Tilgungsrate, typischerweise zwischen 1% und 5% der Darlehenssumme pro Jahr. Eine h\u00F6here anf\u00E4ngliche Tilgung bedeutet h\u00F6here monatliche Zahlungen, aber eine schnellere Schuldenreduzierung. Bei einer anf\u00E4nglichen Tilgung von 2% auf ein Darlehen von 300.000 \u20AC w\u00FCrden Sie im ersten Jahr 6.000 \u20AC tilgen. Die Tilgungsrate steigt automatisch jedes Jahr, da der Zinsanteil sinkt, was die Schuldenreduzierung beschleunigt. Die meisten Finanzberater empfehlen mindestens 2% anf\u00E4ngliche Tilgung, um das Darlehen innerhalb von 25\u201330 Jahren zur\u00FCckzuzahlen. Bei sehr niedrigen anf\u00E4nglichen Tilgungsraten (1%) kann sich die Gesamtlaufzeit auf \u00FCber 40 Jahre erstrecken.",
    seoTitle3: "Sondertilgung (Zus\u00E4tzliche Zahlungen)",
    seoText3: "Sondertilgung bezeichnet zus\u00E4tzliche Einmalzahlungen neben den regul\u00E4ren Monatsraten. Die meisten deutschen Hypothekenvertr\u00E4ge erlauben j\u00E4hrliche Sondertilgungen von 5\u201310% der urspr\u00FCnglichen Darlehenssumme ohne Strafgeb\u00FChren. Zus\u00E4tzliche Zahlungen k\u00F6nnen die Gesamtzinsen erheblich reduzieren und die Laufzeit verk\u00FCrzen. Bei einem Darlehen von 300.000 \u20AC mit 3% Zinsen und 2% anf\u00E4nglicher Tilgung kann eine j\u00E4hrliche Sondertilgung von 5.000 \u20AC Zehntausende an Zinsen sparen und die Gesamtlaufzeit um mehrere Jahre verk\u00FCrzen. Einige Kreditgeber bieten h\u00F6here Sondertilgungsm\u00F6glichkeiten an, die jedoch mit einem etwas h\u00F6heren Zinssatz verbunden sein k\u00F6nnen. Pr\u00FCfen Sie Ihren Darlehensvertrag auf die genauen Sondertilgungsbedingungen, da eine \u00DCberschreitung zu einer Vorf\u00E4lligkeitsentsch\u00E4digung f\u00FChren kann.",
    seoTitle4: "Tipps f\u00FCr Hypothekennehmer in Deutschland",
    seoText4: "Bei der Aufnahme einer Hypothek in Deutschland sollten Sie folgende Faktoren ber\u00FCcksichtigen: Erstens, vergleichen Sie Angebote mehrerer Banken und nutzen Sie einen Kreditvermittler, der auf Angebote vieler Kreditgeber zugreifen kann. Zweitens, w\u00E4hlen Sie eine Zinsbindung, die Ihrer Risikobereitschaft entspricht \u2014 l\u00E4ngere Festzinszeitr\u00E4ume bieten mehr Sicherheit, k\u00F6nnen aber etwas teurer sein. Drittens, verhandeln Sie die bestm\u00F6glichen Anfangskonditionen, einschlie\u00DFlich Sondertilgungsrechte und die M\u00F6glichkeit zum Tilgungssatzwechsel. Viertens, pr\u00FCfen Sie KfW-F\u00F6rderdarlehen mit subventionierten Zinss\u00E4tzen f\u00FCr energieeffiziente H\u00E4user und Sanierungen. F\u00FCnftens, ber\u00FCcksichtigen Sie die Nebenkosten von 7\u201315% des Kaufpreises, darunter Grunderwerbsteuer, Notarkosten und Maklerprovisionen. Diese m\u00FCssen in der Regel aus Eigenmitteln bezahlt werden.",
  },
  ja: {}, pt: {}, fr: {}, es: {}, hi: {},
  no: {},
};

export default function GermanLoanRepaymentPage() {
  const { lang, setLang, t } = useTranslation(translations);
  const [loanAmount, setLoanAmount] = useState<string>("300000");
  const [interestRate, setInterestRate] = useState<string>("3.5");
  const [initialRepayment, setInitialRepayment] = useState<string>("2");
  const [fixedPeriod, setFixedPeriod] = useState<string>("10");
  const [extraPayment, setExtraPayment] = useState<string>("0");
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const loan = parseFloat(loanAmount) || 0;
  const rate = (parseFloat(interestRate) || 0) / 100;
  const repaymentRate = (parseFloat(initialRepayment) || 0) / 100;
  const fixedYears = parseInt(fixedPeriod) || 10;
  const extra = parseFloat(extraPayment) || 0;

  // Monthly annuity = loan * (interest rate + initial repayment rate) / 12
  const annualAnnuity = loan * (rate + repaymentRate);
  const monthlyPayment = annualAnnuity / 12;

  // Build year-by-year schedule
  const schedule: { year: number; payment: number; interest: number; repayment: number; extraPmt: number; remaining: number }[] = [];
  let remaining = loan;
  let totalInterest = 0;
  let totalYears = 0;

  for (let y = 1; y <= 60 && remaining > 0; y++) {
    const yearInterest = remaining * rate;
    const yearRepayment = annualAnnuity - yearInterest;
    const yearExtra = Math.min(extra, remaining - yearRepayment > 0 ? remaining - yearRepayment : remaining);
    const totalRepaid = yearRepayment + yearExtra;

    remaining = Math.max(0, remaining - totalRepaid);
    totalInterest += yearInterest;
    totalYears = y;

    schedule.push({
      year: y,
      payment: remaining > 0 ? annualAnnuity : yearInterest + (totalRepaid - yearExtra > 0 ? totalRepaid - yearExtra : 0),
      interest: yearInterest,
      repayment: yearRepayment,
      extraPmt: yearExtra,
      remaining,
    });

    if (remaining <= 0) break;
  }

  const remainingAfterFixed = schedule.find(s => s.year === fixedYears)?.remaining || 0;
  const interestDuringFixed = schedule.filter(s => s.year <= fixedYears).reduce((sum, s) => sum + s.interest, 0);

  const fmt = (n: number) => "\u20AC" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const fmtShort = (n: number) => "\u20AC" + Math.round(n).toLocaleString("en");

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/german-loan-repayment`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/german-loan-repayment`} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">{t("loanAmount")} (&euro;)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="input-field"
                placeholder="300000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("interestRate")} (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="input-field"
                step="0.1"
                placeholder="3.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("initialRepayment")} (%)</label>
              <input
                type="number"
                value={initialRepayment}
                onChange={(e) => setInitialRepayment(e.target.value)}
                className="input-field"
                step="0.5"
                placeholder="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("fixedPeriod")}</label>
              <select value={fixedPeriod} onChange={(e) => setFixedPeriod(e.target.value)} className="input-field">
                <option value="5">5 {t("years")}</option>
                <option value="10">10 {t("years")}</option>
                <option value="15">15 {t("years")}</option>
                <option value="20">20 {t("years")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("extraPayment")} (&euro;)</label>
              <input
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(e.target.value)}
                className="input-field"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {loan > 0 && rate > 0 && repaymentRate > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("monthlyPayment")}</p>
                <p className="text-2xl font-bold text-green-700">{fmt(monthlyPayment)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("remainingDebt")}</p>
                <p className="text-xl font-bold text-red-600">{fmtShort(remainingAfterFixed)}</p>
                <p className="text-xs text-[var(--muted)]">{t("afterFixedPeriod")}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("totalInterest")}</p>
                <p className="text-xl font-bold text-amber-700">{fmtShort(interestDuringFixed)}</p>
                <p className="text-xs text-[var(--muted)]">{t("overFixedPeriod")}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t("totalTerm")}</p>
                <p className="text-2xl font-bold text-[var(--primary)]">~{totalYears} {t("years")}</p>
              </div>
            </div>

            <div className="tool-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">{t("scheduleTitle")}</h2>
                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="text-sm px-4 py-1.5 rounded-lg border border-[var(--card-border)] hover:border-[var(--primary)] transition-colors"
                >
                  {showSchedule ? "\u25B2" : "\u25BC"} {showSchedule ? "Hide" : "Show"}
                </button>
              </div>
              {showSchedule && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-[var(--muted-bg)]">
                        <th className="border border-[var(--card-border)] px-3 py-2 text-left">{t("year")}</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("interestPortion")}</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("repaymentPortion")}</th>
                        {extra > 0 && <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("extraPaymentCol")}</th>}
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("remainingDebtCol")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((row) => (
                        <tr key={row.year} className={`hover:bg-[var(--muted-bg)] ${row.year === fixedYears ? "bg-blue-50 font-semibold" : ""}`}>
                          <td className="border border-[var(--card-border)] px-3 py-2">{row.year}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtShort(row.interest)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtShort(row.repayment)}</td>
                          {extra > 0 && <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtShort(row.extraPmt)}</td>}
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right font-medium">{fmtShort(row.remaining)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
            name: "German Loan Repayment Calculator (Tilgungsrechner)",
            description: META.description,
            url: `${SITE_URL}/tools/german-loan-repayment`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
