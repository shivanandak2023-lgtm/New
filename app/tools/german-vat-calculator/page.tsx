"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import LanguageSwitcher, { useTranslation, type LangCode } from "@/components/LanguageSwitcher";

const META = {
  title: "Mehrwertsteuer Rechner - German VAT Calculator",
  description:
    "Free Mehrwertsteuer Rechner to calculate German VAT (MwSt). Supports 19% standard and 7% reduced rates. Convert between net (Netto) and gross (Brutto) amounts instantly.",
  keywords:
    "Mehrwertsteuer Rechner, MwSt Rechner, VAT calculator Germany, German VAT calculator, 19% MwSt, 7% MwSt, Netto Brutto Rechner, Umsatzsteuer",
};

const translations: Record<LangCode, Record<string, string>> = {
  en: {
    title: "German VAT Calculator (MwSt)",
    subtitle: "Calculate German Value Added Tax (Mehrwertsteuer) with standard 19% and reduced 7% rates. Convert between net and gross amounts.",
    amount: "Amount",
    vatRate: "VAT Rate (MwSt-Satz)",
    standard: "19% Standard",
    reduced: "7% Reduced",
    mode: "Calculation Mode",
    netToGross: "Net to Gross (Netto to Brutto)",
    grossToNet: "Gross to Net (Brutto to Netto)",
    netAmount: "Net Amount (Netto)",
    vatAmount: "VAT Amount (MwSt)",
    grossAmount: "Gross Amount (Brutto)",
    detailsTitle: "Calculation Details",
    formula: "Formula",
    result: "Result",
    seoTitle1: "German VAT (Mehrwertsteuer) Explained",
    seoText1: "Germany charges Value Added Tax (Mehrwertsteuer or MwSt) on most goods and services. The standard rate is 19%, while a reduced rate of 7% applies to essential goods such as food, books, newspapers, public transport, and cultural events.",
    seoTitle2: "When to Use 19% vs 7%",
    seoText2: "The standard 19% rate applies to most goods and services. The reduced 7% rate covers basic food items, books and e-books, newspapers and magazines, public transport tickets, hotel accommodations, cultural events, and agricultural products.",
    seoTitle3: "Net to Gross Calculation",
    seoText3: "To calculate the gross amount from a net amount: Gross = Net x (1 + VAT rate). For example, a net price of 100 EUR with 19% VAT gives a gross price of 119 EUR, with 19 EUR being the VAT amount.",
    seoTitle4: "Gross to Net Calculation",
    seoText4: "To extract the net amount from a gross amount: Net = Gross / (1 + VAT rate). For example, a gross price of 119 EUR with 19% VAT gives a net price of 100 EUR, with 19 EUR being the VAT included in the gross price.",
  },
  de: {
    title: "Mehrwertsteuerrechner (MwSt)",
    subtitle: "Berechnen Sie die deutsche Mehrwertsteuer mit dem Regelsatz von 19% und dem ermäßigten Satz von 7%. Umrechnung zwischen Netto- und Bruttobeträgen.",
    amount: "Betrag",
    vatRate: "MwSt-Satz",
    standard: "19% Regelsatz",
    reduced: "7% Ermäßigt",
    mode: "Berechnungsmodus",
    netToGross: "Netto zu Brutto",
    grossToNet: "Brutto zu Netto",
    netAmount: "Nettobetrag",
    vatAmount: "MwSt-Betrag",
    grossAmount: "Bruttobetrag",
    detailsTitle: "Berechnungsdetails",
    formula: "Formel",
    result: "Ergebnis",
    seoTitle1: "Deutsche Mehrwertsteuer (MwSt) erklärt",
    seoText1: "Deutschland erhebt auf die meisten Waren und Dienstleistungen eine Mehrwertsteuer (MwSt). Der Regelsatz beträgt 19%, während ein ermäßigter Satz von 7% für lebensnotwendige Güter wie Lebensmittel, Bücher, Zeitungen, öffentliche Verkehrsmittel und kulturelle Veranstaltungen gilt.",
    seoTitle2: "Wann 19% und wann 7%?",
    seoText2: "Der Regelsatz von 19% gilt für die meisten Waren und Dienstleistungen. Der ermäßigte Satz von 7% umfasst grundlegende Lebensmittel, Bücher und E-Books, Zeitungen und Zeitschriften, Fahrkarten für den öffentlichen Nahverkehr, Hotelübernachtungen, kulturelle Veranstaltungen und landwirtschaftliche Erzeugnisse.",
    seoTitle3: "Netto-zu-Brutto-Berechnung",
    seoText3: "Um den Bruttobetrag aus einem Nettobetrag zu berechnen: Brutto = Netto × (1 + MwSt-Satz). Zum Beispiel ergibt ein Nettopreis von 100 EUR bei 19% MwSt einen Bruttopreis von 119 EUR, wobei 19 EUR der MwSt-Betrag ist.",
    seoTitle4: "Brutto-zu-Netto-Berechnung",
    seoText4: "Um den Nettobetrag aus einem Bruttobetrag zu ermitteln: Netto = Brutto / (1 + MwSt-Satz). Zum Beispiel ergibt ein Bruttopreis von 119 EUR bei 19% MwSt einen Nettopreis von 100 EUR, wobei 19 EUR die im Bruttopreis enthaltene MwSt ist.",
  },
  ja: {}, pt: {}, fr: {}, es: {}, hi: {},
    no: {},
};

export default function GermanVatCalculatorPage() {
  const { lang, setLang, t } = useTranslation(translations);
  const [amount, setAmount] = useState<string>("1000");
  const [vatRate, setVatRate] = useState<number>(19);
  const [mode, setMode] = useState<"netToGross" | "grossToNet">("netToGross");

  const value = parseFloat(amount) || 0;
  const rate = vatRate / 100;

  let netAmount: number, vatAmount: number, grossAmount: number;

  if (mode === "netToGross") {
    netAmount = value;
    vatAmount = value * rate;
    grossAmount = value + vatAmount;
  } else {
    grossAmount = value;
    netAmount = value / (1 + rate);
    vatAmount = grossAmount - netAmount;
  }

  const fmt = (n: number) => "€" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/german-vat-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/german-vat-calculator`} />
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
              <label className="block text-sm font-medium mb-1">{t("amount")} (€)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                placeholder="1000"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("vatRate")}</label>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setVatRate(19)}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    vatRate === 19
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {t("standard")}
                </button>
                <button
                  onClick={() => setVatRate(7)}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    vatRate === 7
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {t("reduced")}
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">{t("mode")}</label>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setMode("netToGross")}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    mode === "netToGross"
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {t("netToGross")}
                </button>
                <button
                  onClick={() => setMode("grossToNet")}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    mode === "grossToNet"
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {t("grossToNet")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {value > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t("netAmount")}</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(netAmount)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("vatAmount")} ({vatRate}%)</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(vatAmount)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("grossAmount")}</p>
                <p className="text-2xl font-bold text-green-700">{fmt(grossAmount)}</p>
              </div>
            </div>

            <div className="tool-card">
              <h2 className="text-lg font-bold mb-4">{t("detailsTitle")}</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">{t("formula")}</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("result")}</th>
                  </tr>
                </thead>
                <tbody>
                  {mode === "netToGross" ? (
                    <>
                      <tr className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{t("netAmount")}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(netAmount)}</td>
                      </tr>
                      <tr className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{t("vatAmount")} ({fmt(netAmount)} x {vatRate}%)</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(vatAmount)}</td>
                      </tr>
                      <tr className="hover:bg-[var(--muted-bg)] bg-green-50 font-bold">
                        <td className="border border-[var(--card-border)] px-3 py-2">{t("grossAmount")} ({fmt(netAmount)} + {fmt(vatAmount)})</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(grossAmount)}</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{t("grossAmount")}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(grossAmount)}</td>
                      </tr>
                      <tr className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{t("netAmount")} ({fmt(grossAmount)} / 1.{vatRate === 19 ? "19" : "07"})</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(netAmount)}</td>
                      </tr>
                      <tr className="hover:bg-[var(--muted-bg)] bg-amber-50 font-bold">
                        <td className="border border-[var(--card-border)] px-3 py-2">{t("vatAmount")} ({fmt(grossAmount)} - {fmt(netAmount)})</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right text-amber-700">{fmt(vatAmount)}</td>
                      </tr>
                    </>
                  )}
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
            name: "German VAT Calculator (Mehrwertsteuer Rechner)",
            description: META.description,
            url: `${SITE_URL}/tools/german-vat-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
