"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Netherlands BTW/VAT Calculator",
  description:
    "Free Netherlands BTW calculator. Calculate Dutch VAT at 21%, 9%, or 0% rates. Add or remove BTW from any amount. BTW berekenen — gratis online tool.",
  keywords:
    "BTW calculator, BTW berekenen, Netherlands VAT calculator, Dutch VAT calculator, BTW tarief, 21% BTW, 9% BTW, omzetbelasting berekenen",
};

type Lang = "en" | "nl";

const labels = {
  en: {
    title: "Netherlands BTW/VAT Calculator",
    subtitle: "Calculate Dutch BTW (VAT) at standard 21%, reduced 9%, or exempt 0% rates.",
    amount: "Amount",
    rate: "BTW Rate",
    direction: "Calculation Direction",
    exclusive: "Price is exclusive of BTW (add BTW)",
    inclusive: "Price is inclusive of BTW (remove BTW)",
    calculate: "Calculate BTW",
    priceWithout: "Price without BTW",
    btwAmount: "BTW Amount",
    priceWith: "Price with BTW",
    effectiveRate: "Effective BTW Rate",
    standard: "Standard (21%)",
    reduced: "Reduced (9%) — food, medicine, books",
    exempt: "Exempt (0%)",
    rateInfo: "BTW Rate Information",
  },
  nl: {
    title: "Nederland BTW Calculator",
    subtitle: "Bereken Nederlandse BTW tegen het standaard tarief van 21%, verlaagd tarief van 9%, of vrijgesteld 0%.",
    amount: "Bedrag",
    rate: "BTW-tarief",
    direction: "Berekeningsrichting",
    exclusive: "Prijs is exclusief BTW (BTW toevoegen)",
    inclusive: "Prijs is inclusief BTW (BTW verwijderen)",
    calculate: "BTW Berekenen",
    priceWithout: "Prijs zonder BTW",
    btwAmount: "BTW-bedrag",
    priceWith: "Prijs met BTW",
    effectiveRate: "Effectief BTW-tarief",
    standard: "Standaard (21%)",
    reduced: "Verlaagd (9%) — voeding, medicijnen, boeken",
    exempt: "Vrijgesteld (0%)",
    rateInfo: "BTW-tarief Informatie",
  },
};

export default function NetherlandsBTWCalculatorPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [amount, setAmount] = useState<string>("1000");
  const [rate, setRate] = useState<number>(21);
  const [inclusive, setInclusive] = useState<boolean>(false);
  const [result, setResult] = useState<{
    priceWithout: number;
    btwAmount: number;
    priceWith: number;
  } | null>(null);

  const t = labels[lang];

  function calculate() {
    const raw = parseFloat(amount);
    if (!raw || raw <= 0) return;

    let priceWithout: number;
    let btwAmount: number;
    let priceWith: number;

    if (inclusive) {
      priceWith = raw;
      btwAmount = raw - raw / (1 + rate / 100);
      priceWithout = raw - btwAmount;
    } else {
      priceWithout = raw;
      btwAmount = raw * (rate / 100);
      priceWith = raw + btwAmount;
    }

    setResult({ priceWithout, btwAmount, priceWith });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/netherlands-btw-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${SITE_URL}/tools/netherlands-btw-calculator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
          <button
            onClick={() => setLang(lang === "en" ? "nl" : "en")}
            className="text-sm px-3 py-1 border border-[var(--card-border)] rounded hover:bg-[var(--muted-bg)]"
          >
            {lang === "en" ? "🇳🇱 Nederlands" : "🇬🇧 English"}
          </button>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">{t.title}</h1>
        <p className="text-[var(--muted)] mb-8">{t.subtitle}</p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">{t.amount} (&euro;)</label>
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
              <label className="block text-sm font-medium mb-1">{t.rate}</label>
              <select
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="input-field"
              >
                <option value={21}>{t.standard}</option>
                <option value={9}>{t.reduced}</option>
                <option value={0}>{t.exempt}</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">{t.direction}</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  checked={!inclusive}
                  onChange={() => setInclusive(false)}
                />
                <span className="text-sm">{t.exclusive}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  checked={inclusive}
                  onChange={() => setInclusive(true)}
                />
                <span className="text-sm">{t.inclusive}</span>
              </label>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            {t.calculate}
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t.priceWithout}</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmt(result.priceWithout)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fef3c7", borderColor: "#fcd34d" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t.btwAmount}</p>
                <p className="text-xl font-bold text-amber-700">{fmt(result.btwAmount)}</p>
                <p className="text-xs text-[var(--muted)]">{rate}% BTW</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t.priceWith}</p>
                <p className="text-xl font-bold">{fmt(result.priceWith)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">{t.rateInfo}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">{lang === "en" ? "Rate" : "Tarief"}</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">{lang === "en" ? "Applies To" : "Van toepassing op"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">21%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2">
                        {lang === "en" ? "Standard rate — most goods and services" : "Standaardtarief — de meeste goederen en diensten"}
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">9%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2">
                        {lang === "en" ? "Reduced rate — food, medicine, books, hotels, water" : "Verlaagd tarief — voeding, medicijnen, boeken, hotels, water"}
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">0%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2">
                        {lang === "en" ? "Exempt — exports, intra-EU supplies, education, healthcare" : "Vrijgesteld — export, intracommunautaire leveringen, onderwijs, gezondheidszorg"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is BTW (Belasting Toegevoegde Waarde)?</h2>
          <p>
            BTW stands for Belasting Toegevoegde Waarde, which is the Dutch term for Value Added Tax (VAT). It is a consumption
            tax levied on goods and services in the Netherlands. The BTW system is governed by the Wet op de Omzetbelasting 1968
            and aligns with the European Union VAT Directive. Every business registered in the Netherlands with a turnover above
            the small business threshold must charge, collect, and remit BTW to the Belastingdienst (Dutch Tax Authority).
          </p>

          <h2>Netherlands BTW Rates Explained</h2>
          <h3>Standard Rate — 21%</h3>
          <p>
            The standard BTW rate of 21% applies to most goods and services sold in the Netherlands. This includes electronics,
            clothing, furniture, professional services, and most consumer goods. If a product or service does not qualify for a
            reduced or exempt rate, the 21% standard rate applies by default. This rate has been in effect since October 2012
            when it was raised from 19%.
          </p>

          <h3>Reduced Rate — 9%</h3>
          <p>
            The reduced BTW rate of 9% applies to essential goods and services. This includes food and non-alcoholic beverages,
            water supply, pharmaceutical products, medical aids, books (including e-books), newspapers, magazines, hotel
            accommodations, public transport, and admission to cultural and entertainment events such as museums, zoos, and
            cinemas. The reduced rate was increased from 6% to 9% on 1 January 2019.
          </p>

          <h3>Zero Rate — 0%</h3>
          <p>
            The 0% BTW rate applies to exports of goods to countries outside the EU, intra-Community supplies to VAT-registered
            businesses in other EU member states, and certain international transport services. Businesses that supply goods at
            the 0% rate can still reclaim input BTW on their purchases.
          </p>

          <h2>How to Calculate BTW</h2>
          <p>
            To add BTW to a price: multiply the net price by the BTW rate and add it to the original price. For example,
            a product costing &euro;100 excluding BTW at 21% results in &euro;21 BTW and a total of &euro;121 including BTW.
            To remove BTW from a gross price: divide the gross amount by (1 + rate). For &euro;121 including 21% BTW,
            the net price is &euro;121 / 1.21 = &euro;100.
          </p>

          <h2>BTW Registration and Filing</h2>
          <p>
            Businesses in the Netherlands must register for BTW with the Belastingdienst if their taxable turnover exceeds the
            threshold or if they conduct intra-Community transactions. BTW returns are typically filed quarterly, though monthly
            or annual filing may apply depending on the size of the business. The BTW identification number (BTW-id) is used
            on invoices and for cross-border trade within the EU.
          </p>

          <h2>BTW Berekenen — Hoe Werkt Het?</h2>
          <p>
            Met deze gratis BTW calculator kunt u eenvoudig de BTW berekenen over elk bedrag. Voer het bedrag in, selecteer
            het BTW-tarief (21%, 9% of 0%), en kies of de prijs inclusief of exclusief BTW is. De calculator toont direct
            de prijs zonder BTW, het BTW-bedrag, en de prijs met BTW. Ideaal voor ondernemers, boekhouders, en particulieren
            die snel BTW willen berekenen.
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
            name: "Netherlands BTW/VAT Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/netherlands-btw-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
