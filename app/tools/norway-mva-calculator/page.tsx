"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import LanguageSwitcher, { type LangCode, useTranslation } from "@/components/LanguageSwitcher";

const META = {
  title: "Norway MVA Calculator (VAT) 2024",
  description:
    "Free Norway MVA/VAT calculator. Calculate Norwegian Merverdiavgift at 25%, 15%, 12%, and 0% rates. Add or remove MVA for invoices, goods, and services.",
  keywords:
    "MVA kalkulator, MVA calculator Norway, mva beregning, Norwegian VAT calculator, Merverdiavgift kalkulator, Norway VAT rates, 25% MVA, 15% MVA food",
};

const translations: Record<LangCode, Record<string, string>> = {
  en: {
    title: "Norway MVA/VAT Calculator",
    subtitle: "Calculate Norwegian MVA (Merverdiavgift) at standard, food, transport/hotel, or exempt rates. Add or remove MVA from any amount.",
    amount: "Amount (kr)",
    mvaRate: "MVA Rate",
    amountType: "Amount Type",
    exclusive: "Excl. MVA (Add MVA)",
    inclusive: "Incl. MVA (Remove MVA)",
    calculate: "Calculate MVA",
    priceExcl: "Price without MVA",
    mvaAmount: "MVA Amount",
    priceIncl: "Price with MVA",
    breakdown: "Calculation Breakdown",
    netPrice: "Net Price (Before MVA)",
    rate: "MVA Rate",
    total: "Total Price (Incl. MVA)",
    formulas: "MVA Formulas",
    addMva: "Add MVA (Exclusive to Inclusive)",
    removeMva: "Remove MVA (Inclusive to Exclusive)",
    standard: "Standard (25%)",
    food: "Food (15%)",
    transport: "Transport/Hotel (12%)",
    exempt: "Exempt (0%)",
  },
  no: {
    title: "MVA-kalkulator Norge",
    subtitle: "Beregn norsk MVA (Merverdiavgift) med standard-, mat-, transport/hotell- eller fritatte satser. Legg til eller fjern MVA fra et belopp.",
    amount: "Belopp (kr)",
    mvaRate: "MVA-sats",
    amountType: "Beloppstype",
    exclusive: "Uten MVA (Legg til MVA)",
    inclusive: "Med MVA (Fjern MVA)",
    calculate: "Beregn",
    priceExcl: "Pris uten MVA",
    mvaAmount: "MVA-belopp",
    priceIncl: "Pris med MVA",
    breakdown: "Beregningsdetaljer",
    netPrice: "Nettopris (for MVA)",
    rate: "MVA-sats",
    total: "Totalpris (inkl. MVA)",
    formulas: "MVA-formler",
    addMva: "Legg til MVA (eksklusiv til inklusiv)",
    removeMva: "Fjern MVA (inklusiv til eksklusiv)",
    standard: "Standard (25 %)",
    food: "Mat (15 %)",
    transport: "Transport/Hotell (12 %)",
    exempt: "Fritatt (0 %)",
  },
  de: { title: "", subtitle: "", amount: "", mvaRate: "", amountType: "", exclusive: "", inclusive: "", calculate: "", priceExcl: "", mvaAmount: "", priceIncl: "", breakdown: "", netPrice: "", rate: "", total: "", formulas: "", addMva: "", removeMva: "", standard: "", food: "", transport: "", exempt: "" },
  ja: { title: "", subtitle: "", amount: "", mvaRate: "", amountType: "", exclusive: "", inclusive: "", calculate: "", priceExcl: "", mvaAmount: "", priceIncl: "", breakdown: "", netPrice: "", rate: "", total: "", formulas: "", addMva: "", removeMva: "", standard: "", food: "", transport: "", exempt: "" },
  pt: { title: "", subtitle: "", amount: "", mvaRate: "", amountType: "", exclusive: "", inclusive: "", calculate: "", priceExcl: "", mvaAmount: "", priceIncl: "", breakdown: "", netPrice: "", rate: "", total: "", formulas: "", addMva: "", removeMva: "", standard: "", food: "", transport: "", exempt: "" },
  fr: { title: "", subtitle: "", amount: "", mvaRate: "", amountType: "", exclusive: "", inclusive: "", calculate: "", priceExcl: "", mvaAmount: "", priceIncl: "", breakdown: "", netPrice: "", rate: "", total: "", formulas: "", addMva: "", removeMva: "", standard: "", food: "", transport: "", exempt: "" },
  es: { title: "", subtitle: "", amount: "", mvaRate: "", amountType: "", exclusive: "", inclusive: "", calculate: "", priceExcl: "", mvaAmount: "", priceIncl: "", breakdown: "", netPrice: "", rate: "", total: "", formulas: "", addMva: "", removeMva: "", standard: "", food: "", transport: "", exempt: "" },
  hi: { title: "", subtitle: "", amount: "", mvaRate: "", amountType: "", exclusive: "", inclusive: "", calculate: "", priceExcl: "", mvaAmount: "", priceIncl: "", breakdown: "", netPrice: "", rate: "", total: "", formulas: "", addMva: "", removeMva: "", standard: "", food: "", transport: "", exempt: "" },
};

type MVAMode = "exclusive" | "inclusive";

interface MVAResult {
  netPrice: number;
  mvaAmount: number;
  totalPrice: number;
  mvaRate: number;
}

export default function NorwayMVACalculatorPage() {
  const { lang, setLang, t } = useTranslation(translations, "en");
  const [amount, setAmount] = useState<string>("1000");
  const [mvaRate, setMvaRate] = useState<string>("25");
  const [mode, setMode] = useState<MVAMode>("exclusive");
  const [result, setResult] = useState<MVAResult | null>(null);

  function calculate() {
    const value = parseFloat(amount);
    const rate = parseFloat(mvaRate);
    if (!value || value <= 0) return;

    let netPrice: number;
    let mvaAmount: number;
    let totalPrice: number;

    if (mode === "exclusive") {
      netPrice = value;
      mvaAmount = value * (rate / 100);
      totalPrice = value + mvaAmount;
    } else {
      totalPrice = value;
      mvaAmount = value - value / (1 + rate / 100);
      netPrice = value - mvaAmount;
    }

    setResult({ netPrice, mvaAmount, totalPrice, mvaRate: rate });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/norway-mva-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/norway-mva-calculator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <LanguageSwitcher
          supportedLangs={["en", "no"]}
          onLanguageChange={(l) => setLang(l)}
          defaultLang="en"
        />

        <h1 className="text-3xl font-extrabold mb-2">{t("title")}</h1>
        <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">{t("amount")}</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                placeholder="e.g., 1000"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("mvaRate")}</label>
              <select
                value={mvaRate}
                onChange={(e) => setMvaRate(e.target.value)}
                className="input-field"
              >
                <option value="25">{t("standard")}</option>
                <option value="15">{t("food")}</option>
                <option value="12">{t("transport")}</option>
                <option value="0">{t("exempt")}</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">{t("amountType")}</label>
            <div className="flex gap-3">
              <button
                onClick={() => setMode("exclusive")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  mode === "exclusive"
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
              >
                {t("exclusive")}
              </button>
              <button
                onClick={() => setMode("inclusive")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  mode === "inclusive"
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
              >
                {t("inclusive")}
              </button>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            {t("calculate")}
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t("priceExcl")}</p>
                <p className="text-2xl font-bold">{fmt(result.netPrice)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t("mvaAmount")}</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.mvaAmount)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("priceIncl")}</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.totalPrice)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">{t("breakdown")}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{t("netPrice")}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.netPrice)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{t("rate")}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{result.mvaRate}%</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{t("mvaAmount")}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-[var(--primary)] font-semibold">{fmt(result.mvaAmount)}</td>
                    </tr>
                    <tr className="bg-green-50 font-bold">
                      <td className="border border-[var(--card-border)] px-3 py-2">{t("total")}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(result.totalPrice)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">{t("formulas")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--muted-bg)] rounded-lg">
                  <p className="font-semibold mb-2">{t("addMva")}</p>
                  <p className="text-sm font-mono">MVA = Belopp &times; {result.mvaRate / 100}</p>
                  <p className="text-sm font-mono">Total = Belopp &times; {1 + result.mvaRate / 100}</p>
                </div>
                <div className="p-4 bg-[var(--muted-bg)] rounded-lg">
                  <p className="font-semibold mb-2">{t("removeMva")}</p>
                  <p className="text-sm font-mono">Netto = Belopp &divide; {1 + result.mvaRate / 100}</p>
                  <p className="text-sm font-mono">MVA = Belopp - Netto</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is MVA (Merverdiavgift) in Norway?</h2>
          <p>
            MVA (Merverdiavgift) is the Norwegian value-added tax, equivalent to VAT in other European countries. It is a consumption
            tax charged on most goods and services sold in Norway. The standard MVA rate is 25%, making it one of the highest VAT
            rates globally. This MVA kalkulator helps businesses and consumers calculate MVA quickly and accurately for invoicing,
            pricing, and budgeting.
          </p>

          <h2>Norwegian MVA Rates in 2024</h2>
          <p>
            Norway has four MVA rates that apply to different categories of goods and services:
          </p>
          <ul>
            <li><strong>25% (Standard rate)</strong> &mdash; Applies to most goods and services, including electronics, clothing, furniture, and professional services.</li>
            <li><strong>15% (Food rate)</strong> &mdash; Applies to foodstuffs and non-alcoholic beverages. This reduced rate was introduced to lower the cost of basic necessities.</li>
            <li><strong>12% (Reduced rate)</strong> &mdash; Applies to passenger transport, hotel accommodation, cinema tickets, sports events, and amusement parks.</li>
            <li><strong>0% (Exempt/zero rate)</strong> &mdash; Applies to exports, international transport, newspapers, books, and electric vehicles (until further notice).</li>
          </ul>

          <h2>MVA Registration in Norway</h2>
          <p>
            Businesses in Norway must register for MVA if their taxable turnover exceeds NOK 50,000 in a 12-month period. Once
            registered, businesses must charge MVA on their sales, file MVA returns (typically every two months), and pay the net
            MVA to the Norwegian Tax Administration (Skatteetaten). Businesses can deduct MVA paid on purchases and expenses
            (inngaende MVA) from MVA collected on sales (utgaende MVA). This MVA calculator Norway tool helps businesses calculate
            the correct MVA amounts for their invoices.
          </p>

          <h2>How to Calculate MVA in Norway</h2>
          <p>
            To add MVA to a price, multiply the MVA-exclusive amount by the appropriate rate factor. For the standard 25% rate,
            multiply by 1.25. For example, a product priced at kr 1,000 excluding MVA would cost kr 1,250 including MVA. To remove
            MVA from an inclusive price, divide by the rate factor. So kr 1,250 divided by 1.25 gives a net price of kr 1,000 and
            MVA of kr 250. This mva beregning tool handles all four rates automatically.
          </p>

          <h2>MVA for International Businesses</h2>
          <p>
            Foreign businesses selling goods or services to Norwegian customers may be required to register for MVA in Norway.
            This applies to businesses selling digital services to Norwegian consumers (B2C), businesses with a permanent
            establishment in Norway, and foreign businesses that provide goods or services where the place of supply is in Norway.
            The VOEC (VAT On E-Commerce) scheme simplifies registration for foreign sellers of low-value goods. Understanding
            Norwegian MVA obligations is essential for international businesses trading with Norway. Use this calculator to
            determine the correct MVA to charge your Norwegian customers.
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
            name: "Norway MVA Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/norway-mva-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "NOK" },
          }),
        }}
      />
    </>
  );
}
