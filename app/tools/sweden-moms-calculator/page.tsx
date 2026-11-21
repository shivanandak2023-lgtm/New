"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Sweden Moms Calculator (VAT) 2024",
  description:
    "Free Sweden Moms/VAT calculator. Calculate Swedish Mervardeskatt at 25%, 12%, 6%, and 0% rates. Add or remove moms for invoices, goods, and services.",
  keywords:
    "moms kalkulator, moms calculator Sweden, momsberakning, Swedish VAT calculator, Mervardeskatt kalkulator, Sweden VAT rates, 25% moms, 12% moms food",
};

type Lang = "en" | "sv";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    title: "Sweden Moms/VAT Calculator",
    subtitle: "Calculate Swedish Moms (Mervardeskatt) at standard, food/hotel, books/transport, or exempt rates. Add or remove moms from any amount.",
    amount: "Amount (kr)",
    momsRate: "Moms Rate",
    amountType: "Amount Type",
    exclusive: "Excl. Moms (Add Moms)",
    inclusive: "Incl. Moms (Remove Moms)",
    calculate: "Calculate Moms",
    priceExcl: "Price without Moms",
    momsAmount: "Moms Amount",
    priceIncl: "Price with Moms",
    breakdown: "Calculation Breakdown",
    netPrice: "Net Price (Before Moms)",
    rate: "Moms Rate",
    total: "Total Price (Incl. Moms)",
    formulas: "Moms Formulas",
    addMoms: "Add Moms (Exclusive to Inclusive)",
    removeMoms: "Remove Moms (Inclusive to Exclusive)",
    standard: "Standard (25%)",
    food: "Food/Hotel (12%)",
    books: "Books/Transport (6%)",
    exempt: "Exempt (0%)",
    langSwitch: "Svenska",
  },
  sv: {
    title: "Momskalkylator Sverige",
    subtitle: "Berakna svensk moms (mervardeskatt) med standard-, mat/hotell-, bocker/transport- eller nollskattesats. Lagg till eller ta bort moms fran ett belopp.",
    amount: "Belopp (kr)",
    momsRate: "Momssats",
    amountType: "Beloppstyp",
    exclusive: "Utan moms (Lagg till moms)",
    inclusive: "Med moms (Ta bort moms)",
    calculate: "Berakna",
    priceExcl: "Pris utan moms",
    momsAmount: "Momsbelopp",
    priceIncl: "Pris med moms",
    breakdown: "Berakningsdetaljer",
    netPrice: "Nettopris (fore moms)",
    rate: "Momssats",
    total: "Totalpris (inkl. moms)",
    formulas: "Momsformler",
    addMoms: "Lagg till moms (exklusiv till inklusiv)",
    removeMoms: "Ta bort moms (inklusiv till exklusiv)",
    standard: "Standard (25 %)",
    food: "Mat/Hotell (12 %)",
    books: "Bocker/Transport (6 %)",
    exempt: "Undantagen (0 %)",
    langSwitch: "English",
  },
};

type MomsMode = "exclusive" | "inclusive";

interface MomsResult {
  netPrice: number;
  momsAmount: number;
  totalPrice: number;
  momsRate: number;
}

export default function SwedenMomsCalculatorPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [amount, setAmount] = useState<string>("1000");
  const [momsRate, setMomsRate] = useState<string>("25");
  const [mode, setMode] = useState<MomsMode>("exclusive");
  const [result, setResult] = useState<MomsResult | null>(null);

  const t = (key: string): string => translations[lang]?.[key] || translations["en"]?.[key] || key;

  function calculate() {
    const value = parseFloat(amount);
    const rate = parseFloat(momsRate);
    if (!value || value <= 0) return;

    let netPrice: number;
    let momsAmount: number;
    let totalPrice: number;

    if (mode === "exclusive") {
      netPrice = value;
      momsAmount = value * (rate / 100);
      totalPrice = value + momsAmount;
    } else {
      totalPrice = value;
      momsAmount = value - value / (1 + rate / 100);
      netPrice = value - momsAmount;
    }

    setResult({ netPrice, momsAmount, totalPrice, momsRate: rate });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/sweden-moms-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/sweden-moms-calculator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Language:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                lang === "en"
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "border-[var(--card-border)] hover:border-[var(--primary)]"
              }`}
              style={lang !== "en" ? { color: "var(--foreground)" } : {}}
            >
              English
            </button>
            <button
              onClick={() => setLang("sv")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                lang === "sv"
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "border-[var(--card-border)] hover:border-[var(--primary)]"
              }`}
              style={lang !== "sv" ? { color: "var(--foreground)" } : {}}
            >
              Svenska
            </button>
          </div>
        </div>

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
              <label className="block text-sm font-medium mb-1">{t("momsRate")}</label>
              <select
                value={momsRate}
                onChange={(e) => setMomsRate(e.target.value)}
                className="input-field"
              >
                <option value="25">{t("standard")}</option>
                <option value="12">{t("food")}</option>
                <option value="6">{t("books")}</option>
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
                <p className="text-sm text-[var(--muted)] mb-1">{t("momsAmount")}</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.momsAmount)}</p>
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
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{result.momsRate}%</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{t("momsAmount")}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-[var(--primary)] font-semibold">{fmt(result.momsAmount)}</td>
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
                  <p className="font-semibold mb-2">{t("addMoms")}</p>
                  <p className="text-sm font-mono">Moms = Belopp &times; {result.momsRate / 100}</p>
                  <p className="text-sm font-mono">Total = Belopp &times; {1 + result.momsRate / 100}</p>
                </div>
                <div className="p-4 bg-[var(--muted-bg)] rounded-lg">
                  <p className="font-semibold mb-2">{t("removeMoms")}</p>
                  <p className="text-sm font-mono">Netto = Belopp &divide; {1 + result.momsRate / 100}</p>
                  <p className="text-sm font-mono">Moms = Belopp - Netto</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is Moms (Mervardeskatt) in Sweden?</h2>
          <p>
            Moms (Mervardeskatt) is the Swedish value-added tax, equivalent to VAT in other European countries. It is a consumption
            tax applied to most goods and services sold in Sweden. The standard moms rate is 25%, which is among the highest VAT
            rates in the world. This moms kalkulator helps businesses and consumers calculate Swedish VAT quickly and accurately
            for invoicing, pricing, and financial planning.
          </p>

          <h2>Swedish Moms Rates in 2024</h2>
          <p>
            Sweden applies four different moms rates depending on the type of goods or services:
          </p>
          <ul>
            <li><strong>25% (Standard rate)</strong> &mdash; Applies to most goods and services, including electronics, clothing, furniture, professional services, and alcohol.</li>
            <li><strong>12% (Reduced rate)</strong> &mdash; Applies to foodstuffs, restaurant and catering services (excluding alcohol), hotel accommodation, and camping.</li>
            <li><strong>6% (Low rate)</strong> &mdash; Applies to books (physical and digital), newspapers, magazines, public transport, cultural events, and sports activities.</li>
            <li><strong>0% (Exempt/zero rate)</strong> &mdash; Applies to exports, certain financial services, healthcare, education, and insurance services.</li>
          </ul>

          <h2>Moms Registration in Sweden</h2>
          <p>
            Businesses in Sweden must register for moms with Skatteverket (the Swedish Tax Agency) if they sell taxable goods or
            services. Unlike some countries, Sweden does not have a registration threshold for domestic businesses &mdash; all
            businesses making taxable supplies must register. Once registered, businesses charge moms on sales (utgaende moms)
            and can deduct moms paid on business purchases (ingaende moms). Moms returns are typically filed monthly, quarterly,
            or annually depending on the business turnover.
          </p>

          <h2>How to Calculate Moms in Sweden</h2>
          <p>
            To add moms to a price, multiply the moms-exclusive amount by the appropriate rate factor. For the standard 25% rate,
            multiply by 1.25. For example, a product priced at kr 1,000 excluding moms would cost kr 1,250 including moms
            (kr 1,000 &times; 1.25). To remove moms from an inclusive price, divide by the rate factor. So kr 1,250 divided
            by 1.25 gives a net price of kr 1,000 and moms of kr 250. This momsberakning tool handles all four rates automatically.
          </p>

          <h2>Moms for E-commerce and Digital Services</h2>
          <p>
            Sweden follows EU VAT rules for digital services and e-commerce. Since July 2021, the Import One-Stop Shop (IOSS)
            scheme allows sellers outside the EU to collect and remit Swedish moms on goods valued up to EUR 150. For digital
            services sold to Swedish consumers by non-EU businesses, the One-Stop Shop (OSS) simplifies VAT registration and
            reporting. Swedish consumers pay 25% moms on most digital services including streaming, software, and online advertising.
          </p>

          <h2>Moms Deductions and Refunds</h2>
          <p>
            VAT-registered businesses in Sweden can claim back moms paid on business-related purchases and expenses. This includes
            moms on raw materials, office supplies, professional services, and business travel. However, some items have restricted
            deductibility, such as representation costs (limited to 50%) and passenger cars used for mixed business/private purposes.
            Foreign businesses that are not registered for moms in Sweden can apply for a moms refund through the EU refund procedure
            or the 13th Directive refund process for non-EU businesses. Use this calculator to determine the correct moms amounts
            for your Swedish business transactions.
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
            name: "Sweden Moms Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/sweden-moms-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "SEK" },
          }),
        }}
      />
    </>
  );
}
