"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import LanguageSwitcher, { useTranslation, type LangCode } from "@/components/LanguageSwitcher";

const META = {
  title: "ETF Sparplanrechner - German ETF Savings Plan Calculator",
  description:
    "Free ETF Sparplanrechner to calculate investment growth with monthly contributions, TER costs, and German Kapitalertragsteuer. See year-by-year growth and after-tax returns.",
  keywords:
    "ETF Sparplanrechner, ETF Sparplan Rechner, ETF savings plan calculator Germany, Kapitalertragsteuer, Sparerpauschbetrag, ETF Rendite Rechner",
};

const translations: Record<LangCode, Record<string, string>> = {
  en: {
    title: "German ETF Savings Plan Calculator",
    subtitle: "Calculate your ETF savings plan growth with monthly contributions, expected returns, costs (TER), and German capital gains tax (Kapitalertragsteuer).",
    monthlyContribution: "Monthly Contribution",
    duration: "Duration",
    durationYears: "years",
    expectedReturn: "Expected Annual Return",
    initialInvestment: "Initial Investment",
    ter: "Total Expense Ratio (TER)",
    taxToggle: "Apply German Tax",
    taxYes: "Yes (26.375%)",
    taxNo: "No",
    calculate: "Calculate",
    finalAmount: "Final Amount",
    totalInvested: "Total Invested",
    totalReturns: "Total Returns",
    afterTax: "After Tax",
    taxPaid: "Tax Paid",
    resultTitle: "Your Investment Summary",
    growthTitle: "Year-by-Year Growth",
    year: "Year",
    invested: "Invested",
    value: "Value",
    gain: "Gain",
    afterTaxCol: "After Tax",
    taxNote: "Tax: 26.375% Kapitalertragsteuer (25% + 5.5% Soli) on gains above \u20AC1,000 Sparerpauschbetrag",
    beforeTax: "Before Tax",
    seoTitle1: "What Is an ETF Sparplan?",
    seoText1: "An ETF Sparplan (ETF savings plan) is one of the most popular investment vehicles in Germany. It allows investors to automatically invest a fixed monthly amount into one or more Exchange-Traded Funds (ETFs). Most German online brokers (Neobroker) such as Trade Republic, Scalable Capital, and ING offer ETF Sparpl\u00E4ne with minimal or zero commission fees. The minimum monthly contribution is typically as low as \u20AC1 to \u20AC25, making it accessible to virtually anyone. ETF Sparpl\u00E4ne benefit from the cost-averaging effect (Durchschnittskosteneffekt): by investing the same amount each month regardless of market conditions, you buy more shares when prices are low and fewer when prices are high, potentially reducing the average purchase price over time. This systematic approach removes the emotional element from investing and is particularly well-suited for long-term wealth building.",
    seoTitle2: "Understanding TER (Total Expense Ratio)",
    seoText2: "The Total Expense Ratio (TER), known in German as Gesamtkostenquote, represents the annual cost of holding an ETF as a percentage of the invested amount. It covers the fund's management fees, administrative costs, and other operating expenses. For passive index ETFs that track major indices like the MSCI World, DAX, or S&P 500, TERs typically range from 0.05% to 0.50% per year. For example, a TER of 0.20% on a \u20AC10,000 investment means \u20AC20 per year in fees, deducted automatically from the fund's value. While TERs may seem small, they compound significantly over long investment horizons. A difference of just 0.30% in TER over 30 years can result in tens of thousands of euros less in your portfolio. This is why cost-conscious German investors typically choose low-cost ETFs from providers like iShares, Vanguard, Xtrackers, or Amundi.",
    seoTitle3: "German Capital Gains Tax (Kapitalertragsteuer)",
    seoText3: "In Germany, investment gains are subject to Kapitalertragsteuer (capital gains tax) at a flat rate of 25%, plus 5.5% Solidarit\u00E4tszuschlag on the tax amount, resulting in an effective rate of 26.375% (or 27.995% with church tax). This tax applies to dividends, interest, and realized capital gains. However, German investors benefit from the Sparerpauschbetrag (saver's flat-rate allowance) of \u20AC1,000 per person per year (\u20AC2,000 for married couples filing jointly). Investment gains up to this threshold are tax-free. To utilize this allowance, you must file a Freistellungsauftrag (exemption order) with your bank or broker. For accumulating (thesaurierende) ETFs, the Vorabpauschale (advance lump sum) mechanism applies, taxing a small portion of unrealized gains annually based on the ECB base interest rate.",
    seoTitle4: "Building Long-Term Wealth with ETF Sparpl\u00E4ne",
    seoText4: "The power of an ETF Sparplan lies in compound growth over time. Historical data shows that broadly diversified global equity ETFs (such as MSCI World or FTSE All-World) have delivered average annual returns of approximately 7\u20139% over the past several decades. With a monthly contribution of \u20AC500 over 30 years at a 7% average annual return, you would invest \u20AC180,000 total but could accumulate over \u20AC550,000 before tax \u2014 the majority of the wealth coming from compound returns rather than your contributions. Key strategies for German ETF investors include: starting as early as possible to maximize the compounding period, choosing broadly diversified global ETFs to minimize risk, keeping costs low with competitive TERs, maintaining discipline through market downturns, and gradually increasing contributions as income grows. Many financial advisors in Germany recommend the MSCI World ETF or FTSE All-World ETF as a core holding for long-term Verm\u00F6gensaufbau (wealth building).",
  },
  de: {
    title: "ETF Sparplanrechner",
    subtitle: "Berechnen Sie das Wachstum Ihres ETF-Sparplans mit monatlicher Sparrate, erwarteter Rendite, Kosten (TER) und deutscher Kapitalertragsteuer.",
    monthlyContribution: "Monatliche Sparrate",
    duration: "Laufzeit",
    durationYears: "Jahre",
    expectedReturn: "Erwartete j\u00E4hrliche Rendite",
    initialInvestment: "Anfangskapital",
    ter: "Gesamtkostenquote (TER)",
    taxToggle: "Deutsche Steuer anwenden",
    taxYes: "Ja (26,375%)",
    taxNo: "Nein",
    calculate: "Berechnen",
    finalAmount: "Endkapital",
    totalInvested: "Eingezahltes Kapital",
    totalReturns: "Gewinn",
    afterTax: "Nach Steuern",
    taxPaid: "Gezahlte Steuern",
    resultTitle: "Ihre Anlage\u00FCbersicht",
    growthTitle: "J\u00E4hrliche Wertentwicklung",
    year: "Jahr",
    invested: "Eingezahlt",
    value: "Wert",
    gain: "Gewinn",
    afterTaxCol: "Nach Steuern",
    taxNote: "Steuer: 26,375% Kapitalertragsteuer (25% + 5,5% Soli) auf Gewinne \u00FCber 1.000 \u20AC Sparerpauschbetrag",
    beforeTax: "Vor Steuern",
    seoTitle1: "Was ist ein ETF-Sparplan?",
    seoText1: "Ein ETF-Sparplan ist eines der beliebtesten Anlageprodukte in Deutschland. Er erm\u00F6glicht es Anlegern, automatisch einen festen monatlichen Betrag in einen oder mehrere Exchange-Traded Funds (ETFs) zu investieren. Die meisten deutschen Online-Broker (Neobroker) wie Trade Republic, Scalable Capital und ING bieten ETF-Sparpl\u00E4ne mit minimalen oder keinen Ordergeb\u00FChren an. Die monatliche Mindestrate betr\u00E4gt typischerweise nur 1 bis 25 \u20AC, was ihn f\u00FCr praktisch jeden zug\u00E4nglich macht. ETF-Sparpl\u00E4ne profitieren vom Durchschnittskosteneffekt: Durch die Investition desselben Betrags jeden Monat unabh\u00E4ngig von den Marktbedingungen kaufen Sie mehr Anteile bei niedrigen Kursen und weniger bei hohen Kursen, was den durchschnittlichen Kaufpreis \u00FCber die Zeit potenziell senkt. Dieser systematische Ansatz entfernt die emotionale Komponente aus dem Investieren und eignet sich besonders f\u00FCr den langfristigen Verm\u00F6gensaufbau.",
    seoTitle2: "TER (Gesamtkostenquote) verstehen",
    seoText2: "Die Gesamtkostenquote (TER \u2013 Total Expense Ratio) stellt die j\u00E4hrlichen Kosten f\u00FCr das Halten eines ETF als Prozentsatz des investierten Betrags dar. Sie umfasst die Verwaltungsgeb\u00FChren, administrative Kosten und sonstige Betriebsausgaben des Fonds. Bei passiven Index-ETFs, die gro\u00DFe Indizes wie den MSCI World, DAX oder S&P 500 abbilden, liegt die TER typischerweise zwischen 0,05% und 0,50% pro Jahr. Eine TER von 0,20% auf eine Anlage von 10.000 \u20AC bedeutet 20 \u20AC pro Jahr an Geb\u00FChren, die automatisch vom Fondswert abgezogen werden. Obwohl die TER gering erscheint, wirkt sie sich \u00FCber lange Anlagezeitr\u00E4ume erheblich aus. Ein Unterschied von nur 0,30% in der TER \u00FCber 30 Jahre kann zu Zehntausenden Euro weniger in Ihrem Portfolio f\u00FChren. Deshalb w\u00E4hlen kostenbewusste deutsche Anleger typischerweise g\u00FCnstige ETFs von Anbietern wie iShares, Vanguard, Xtrackers oder Amundi.",
    seoTitle3: "Deutsche Kapitalertragsteuer",
    seoText3: "In Deutschland unterliegen Anlagegewinne der Kapitalertragsteuer mit einem Pauschalsatz von 25% zuz\u00FCglich 5,5% Solidarit\u00E4tszuschlag, was einem effektiven Satz von 26,375% entspricht (oder 27,995% mit Kirchensteuer). Diese Steuer gilt f\u00FCr Dividenden, Zinsen und realisierte Kursgewinne. Deutsche Anleger profitieren jedoch vom Sparerpauschbetrag von 1.000 \u20AC pro Person und Jahr (2.000 \u20AC f\u00FCr gemeinsam veranlagte Ehepaare). Anlagegewinne bis zu dieser Grenze sind steuerfrei. Um diesen Freibetrag zu nutzen, m\u00FCssen Sie einen Freistellungsauftrag bei Ihrer Bank oder Ihrem Broker einreichen. Bei thesaurierenden ETFs gilt der Vorabpauschale-Mechanismus, der einen kleinen Teil der nicht realisierten Gewinne j\u00E4hrlich auf Basis des EZB-Basiszinssatzes besteuert.",
    seoTitle4: "Langfristiger Verm\u00F6gensaufbau mit ETF-Sparpl\u00E4nen",
    seoText4: "Die St\u00E4rke eines ETF-Sparplans liegt im Zinseszinseffekt \u00FCber die Zeit. Historische Daten zeigen, dass breit diversifizierte globale Aktien-ETFs (wie MSCI World oder FTSE All-World) in den letzten Jahrzehnten durchschnittliche j\u00E4hrliche Renditen von etwa 7\u20139% erzielt haben. Mit einer monatlichen Sparrate von 500 \u20AC \u00FCber 30 Jahre bei einer durchschnittlichen j\u00E4hrlichen Rendite von 7% w\u00FCrden Sie insgesamt 180.000 \u20AC einzahlen, k\u00F6nnten aber vor Steuern \u00FCber 550.000 \u20AC ansammeln \u2014 der Gro\u00DFteil des Verm\u00F6gens stammt aus Zinseszinsrenditen statt aus Ihren Beitr\u00E4gen. Wichtige Strategien f\u00FCr deutsche ETF-Anleger sind: so fr\u00FCh wie m\u00F6glich beginnen, breit diversifizierte globale ETFs w\u00E4hlen, Kosten mit wettbewerbsf\u00E4higen TERs niedrig halten, bei Markteinbr\u00FCchen Disziplin bewahren und die Sparrate mit steigendem Einkommen schrittweise erh\u00F6hen. Viele Finanzberater in Deutschland empfehlen den MSCI World ETF oder FTSE All-World ETF als Kernposition f\u00FCr den langfristigen Verm\u00F6gensaufbau.",
  },
  ja: {}, pt: {}, fr: {}, es: {}, hi: {},
  no: {},
};

export default function GermanETFSparplanPage() {
  const { lang, setLang, t } = useTranslation(translations);
  const [monthlyContribution, setMonthlyContribution] = useState<string>("500");
  const [duration, setDuration] = useState<string>("20");
  const [expectedReturn, setExpectedReturn] = useState<string>("7");
  const [initialInvestment, setInitialInvestment] = useState<string>("0");
  const [ter, setTer] = useState<string>("0.2");
  const [applyTax, setApplyTax] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(false);

  const monthly = parseFloat(monthlyContribution) || 0;
  const years = parseInt(duration) || 0;
  const returnRate = (parseFloat(expectedReturn) || 0) / 100;
  const initial = parseFloat(initialInvestment) || 0;
  const terRate = (parseFloat(ter) || 0) / 100;

  // Net return after TER
  const netReturn = returnRate - terRate;
  const monthlyReturn = netReturn / 12;

  // Build year-by-year table
  const yearData: { year: number; invested: number; value: number; gain: number; afterTax: number }[] = [];
  let totalValue = initial;
  const sparerpauschbetrag = 1000;
  const taxRate = 0.26375;

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      totalValue = totalValue * (1 + monthlyReturn) + monthly;
    }
    const totalInvested = initial + monthly * 12 * y;
    const totalGain = totalValue - totalInvested;

    let afterTaxValue = totalValue;
    if (applyTax && totalGain > 0) {
      const taxableGain = Math.max(0, totalGain - sparerpauschbetrag);
      const tax = taxableGain * taxRate;
      afterTaxValue = totalValue - tax;
    }

    yearData.push({
      year: y,
      invested: totalInvested,
      value: totalValue,
      gain: totalGain,
      afterTax: afterTaxValue,
    });
  }

  const finalData = yearData.length > 0 ? yearData[yearData.length - 1] : null;
  const totalInvested = finalData ? finalData.invested : 0;
  const finalAmount = finalData ? finalData.value : 0;
  const totalGain = finalData ? finalData.gain : 0;
  const afterTaxAmount = finalData ? finalData.afterTax : 0;
  const taxPaid = finalAmount - afterTaxAmount;

  const fmt = (n: number) => "\u20AC" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const fmtShort = (n: number) => "\u20AC" + Math.round(n).toLocaleString("en");

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/german-etf-sparplan`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/german-etf-sparplan`} />
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
              <label className="block text-sm font-medium mb-1">{t("monthlyContribution")} (&euro;)</label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="input-field"
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("duration")} ({t("durationYears")})</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="input-field"
                min="1"
                max="50"
                placeholder="20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("expectedReturn")} (%)</label>
              <input
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                className="input-field"
                step="0.5"
                placeholder="7"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("initialInvestment")} (&euro;)</label>
              <input
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                className="input-field"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("ter")} (%)</label>
              <input
                type="number"
                value={ter}
                onChange={(e) => setTer(e.target.value)}
                className="input-field"
                step="0.05"
                placeholder="0.2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("taxToggle")}</label>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setApplyTax(false)}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    !applyTax
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {t("taxNo")}
                </button>
                <button
                  onClick={() => setApplyTax(true)}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    applyTax
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {t("taxYes")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {finalData && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("finalAmount")}</p>
                <p className="text-xl font-bold text-green-700">{fmtShort(finalAmount)}</p>
                <p className="text-xs text-[var(--muted)]">{t("beforeTax")}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t("totalInvested")}</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmtShort(totalInvested)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("totalReturns")}</p>
                <p className="text-xl font-bold text-amber-700">{fmtShort(totalGain)}</p>
              </div>
              {applyTax && (
                <div className="result-card text-center" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                  <p className="text-sm text-[var(--muted)] mb-1">{t("afterTax")}</p>
                  <p className="text-xl font-bold text-blue-700">{fmtShort(afterTaxAmount)}</p>
                  <p className="text-xs text-[var(--muted)]">{t("taxPaid")}: {fmtShort(taxPaid)}</p>
                </div>
              )}
            </div>

            {applyTax && (
              <p className="text-xs text-[var(--muted)] mb-4">{t("taxNote")}</p>
            )}

            <div className="tool-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">{t("growthTitle")}</h2>
                <button
                  onClick={() => setShowTable(!showTable)}
                  className="text-sm px-4 py-1.5 rounded-lg border border-[var(--card-border)] hover:border-[var(--primary)] transition-colors"
                >
                  {showTable ? "\u25B2" : "\u25BC"} {showTable ? "Hide" : "Show"}
                </button>
              </div>
              {showTable && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-[var(--muted-bg)]">
                        <th className="border border-[var(--card-border)] px-3 py-2 text-left">{t("year")}</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("invested")}</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("value")}</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("gain")}</th>
                        {applyTax && <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("afterTaxCol")}</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {yearData.map((row) => (
                        <tr key={row.year} className="hover:bg-[var(--muted-bg)]">
                          <td className="border border-[var(--card-border)] px-3 py-2">{row.year}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtShort(row.invested)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right font-medium">{fmtShort(row.value)}</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-600">{fmtShort(row.gain)}</td>
                          {applyTax && <td className="border border-[var(--card-border)] px-3 py-2 text-right text-blue-600">{fmtShort(row.afterTax)}</td>}
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
            name: "German ETF Savings Plan Calculator (ETF Sparplanrechner)",
            description: META.description,
            url: `${SITE_URL}/tools/german-etf-sparplan`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
