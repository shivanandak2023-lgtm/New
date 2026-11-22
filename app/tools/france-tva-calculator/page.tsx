"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "France TVA Calculator — Calculateur TVA France",
  description:
    "Free French TVA (VAT) calculator with all rates: 20% normal, 10% intermediate, 5.5% reduced, 2.1% super-reduced. Calculate HT to TTC and TTC to HT instantly.",
  keywords:
    "calculateur TVA, TVA calculator France, calcul TVA 20%, TVA 10%, TVA 5.5%, TVA 2.1%, HT TTC calculatrice, montant TVA, taxe sur la valeur ajoutee",
};

type Lang = "en" | "fr";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    title: "France TVA Calculator",
    subtitle: "Calculate French TVA (VAT) with all four rates: 20% normal, 10% intermediate, 5.5% reduced, and 2.1% super-reduced.",
    amount: "Amount",
    rate: "TVA Rate",
    direction: "Calculation Direction",
    htToTtc: "HT to TTC (Add TVA)",
    ttcToHt: "TTC to HT (Remove TVA)",
    amountHT: "Amount Excl. Tax (HT)",
    amountTVA: "TVA Amount",
    amountTTC: "Amount Incl. Tax (TTC)",
    rateNormal: "20% — Normal (most goods & services)",
    rateIntermediate: "10% — Intermediate (restaurants, transport)",
    rateReduced: "5.5% — Reduced (food, books, energy)",
    rateSuperReduced: "2.1% — Super-reduced (medicine, press)",
    quickRef: "Quick Reference Table",
    htHeader: "Amount HT",
    tvaHeader: "TVA",
    ttcHeader: "Amount TTC",
    seoTitle1: "Understanding French TVA (Value Added Tax)",
    seoText1: "The TVA (Taxe sur la Valeur Ajoutee) is France's value-added tax, equivalent to VAT in other European countries. It is an indirect consumption tax applied to most goods and services sold in France. France has four TVA rates as of 2024: the standard rate of 20% applies to most goods and services, the intermediate rate of 10% applies to restaurant meals, public transport, renovation works, and certain cultural events, the reduced rate of 5.5% applies to essential food products, books, energy for heating, and cultural activities, and the super-reduced rate of 2.1% applies to prescription medicines, newspapers, and certain live performances. The TVA is collected by businesses at each stage of the supply chain but is ultimately borne by the final consumer.",
    seoTitle2: "HT vs TTC: Understanding French Pricing",
    seoText2: "In France, prices are commonly displayed in two formats: HT (Hors Taxes, meaning excluding tax) and TTC (Toutes Taxes Comprises, meaning all taxes included). Business-to-business transactions typically quote prices HT because companies can reclaim TVA as input tax. Consumer-facing prices must be displayed TTC by law, so shoppers always see the final price they will pay. To convert from HT to TTC, multiply by (1 + TVA rate). For example, an item at 100 euros HT with 20% TVA becomes 120 euros TTC. To convert from TTC to HT, divide by (1 + TVA rate). Understanding this distinction is essential for anyone doing business in France, whether freelancers invoicing clients, businesses pricing products, or consumers comparing prices.",
    seoTitle3: "TVA Registration and Compliance",
    seoText3: "Businesses operating in France must register for TVA if their annual turnover exceeds certain thresholds: 91,900 euros for goods sales and 36,800 euros for services (2024 thresholds for the micro-entreprise franchise en base de TVA). Once registered, businesses must charge TVA on their sales, file regular TVA declarations (monthly or quarterly), and can deduct TVA paid on business purchases (TVA deductible) from TVA collected (TVA collectee). The difference is paid to the Direction Generale des Finances Publiques (DGFiP). Auto-entrepreneurs below the thresholds are exempt from collecting TVA but cannot recover TVA on their purchases. EU intra-community transactions follow special reverse charge rules.",
    seoTitle4: "Common TVA Scenarios and Calculations",
    seoText4: "Understanding TVA calculations is essential for everyday business in France. For a restaurant bill of 50 euros TTC at the 10% rate, the HT amount is 45.45 euros and the TVA is 4.55 euros. When a freelancer charges 1,000 euros HT for services at 20%, the client pays 1,200 euros TTC. For a bookshop selling a novel at 15 euros TTC with 5.5% TVA, the HT price is 14.22 euros and TVA is 0.78 euros. Prescription medicines sold at 10 euros TTC at 2.1% contain only 0.21 euros of TVA. Businesses must keep accurate records of all TVA transactions, as the tax authorities conduct regular audits. Digital tools and accounting software like this calculator help ensure accurate TVA compliance and prevent costly errors.",
  },
  fr: {
    title: "Calculateur de TVA France",
    subtitle: "Calculez la TVA francaise avec les quatre taux : 20% normal, 10% intermediaire, 5,5% reduit et 2,1% super-reduit.",
    amount: "Montant",
    rate: "Taux de TVA",
    direction: "Sens du Calcul",
    htToTtc: "HT vers TTC (Ajouter la TVA)",
    ttcToHt: "TTC vers HT (Retirer la TVA)",
    amountHT: "Montant HT (Hors Taxes)",
    amountTVA: "Montant de la TVA",
    amountTTC: "Montant TTC (Toutes Taxes Comprises)",
    rateNormal: "20% — Normal (biens & services courants)",
    rateIntermediate: "10% — Intermediaire (restauration, transport)",
    rateReduced: "5,5% — Reduit (alimentation, livres, energie)",
    rateSuperReduced: "2,1% — Super-reduit (medicaments, presse)",
    quickRef: "Tableau de Reference Rapide",
    htHeader: "Montant HT",
    tvaHeader: "TVA",
    ttcHeader: "Montant TTC",
    seoTitle1: "Comprendre la TVA en France",
    seoText1: "La TVA (Taxe sur la Valeur Ajoutee) est l'impot indirect sur la consommation applique a la plupart des biens et services vendus en France. La France dispose de quatre taux de TVA en 2024 : le taux normal de 20% s'applique a la majorite des biens et services, le taux intermediaire de 10% s'applique aux repas au restaurant, aux transports en commun et aux travaux de renovation, le taux reduit de 5,5% concerne les produits alimentaires de premiere necessite, les livres et l'energie de chauffage, et le taux super-reduit de 2,1% s'applique aux medicaments sur ordonnance et a la presse. La TVA est collectee par les entreprises a chaque etape de la chaine d'approvisionnement mais est finalement supportee par le consommateur final.",
    seoTitle2: "HT et TTC : Comprendre les Prix en France",
    seoText2: "En France, les prix sont couramment affiches en deux formats : HT (Hors Taxes) et TTC (Toutes Taxes Comprises). Les transactions entre entreprises indiquent generalement les prix HT car les societes peuvent recuperer la TVA en tant que taxe deductible. Les prix destines aux consommateurs doivent etre affiches TTC par la loi. Pour convertir de HT a TTC, multipliez par (1 + taux de TVA). Par exemple, un article a 100 euros HT avec 20% de TVA devient 120 euros TTC. Pour convertir de TTC a HT, divisez par (1 + taux de TVA). Comprendre cette distinction est essentiel pour toute personne faisant des affaires en France.",
    seoTitle3: "Immatriculation et Conformite TVA",
    seoText3: "Les entreprises operant en France doivent s'immatriculer a la TVA si leur chiffre d'affaires annuel depasse certains seuils : 91 900 euros pour les ventes de biens et 36 800 euros pour les prestations de services (seuils 2024 pour la franchise en base de TVA des micro-entreprises). Une fois immatriculees, les entreprises doivent facturer la TVA sur leurs ventes, deposer des declarations de TVA regulieres (mensuelles ou trimestrielles), et peuvent deduire la TVA payee sur leurs achats professionnels de la TVA collectee. Les auto-entrepreneurs en dessous des seuils sont exoneres de la collecte de TVA.",
    seoTitle4: "Scenarios Courants de Calcul de TVA",
    seoText4: "Comprendre les calculs de TVA est essentiel pour les affaires quotidiennes en France. Pour une addition de restaurant de 50 euros TTC au taux de 10%, le montant HT est de 45,45 euros et la TVA de 4,55 euros. Lorsqu'un freelance facture 1 000 euros HT pour des services a 20%, le client paie 1 200 euros TTC. Pour une librairie vendant un roman a 15 euros TTC avec 5,5% de TVA, le prix HT est de 14,22 euros et la TVA de 0,78 euros. Les medicaments sur ordonnance vendus a 10 euros TTC au taux de 2,1% ne contiennent que 0,21 euros de TVA. Les entreprises doivent conserver des registres precis de toutes les transactions de TVA pour les controles fiscaux reguliers.",
  },
};

const RATES = [
  { value: 0.20, labelKey: "rateNormal" },
  { value: 0.10, labelKey: "rateIntermediate" },
  { value: 0.055, labelKey: "rateReduced" },
  { value: 0.021, labelKey: "rateSuperReduced" },
];

export default function FranceTVACalculatorPage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = (key: string) => translations[lang][key] || key;

  const [amount, setAmount] = useState<string>("1000");
  const [rate, setRate] = useState<number>(0.20);
  const [direction, setDirection] = useState<"htToTtc" | "ttcToHt">("htToTtc");

  const value = parseFloat(amount) || 0;

  let amountHT: number, amountTVA: number, amountTTC: number;
  if (direction === "htToTtc") {
    amountHT = value;
    amountTVA = value * rate;
    amountTTC = value + amountTVA;
  } else {
    amountTTC = value;
    amountHT = value / (1 + rate);
    amountTVA = amountTTC - amountHT;
  }

  const fmt = (n: number) => "\u20AC" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const refAmounts = [100, 500, 1000, 5000, 10000];

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/france-tva-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/france-tva-calculator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <div className="mb-4 flex gap-2">
          <button onClick={() => setLang("en")} className={`px-3 py-1 rounded text-sm font-medium border transition-colors ${lang === "en" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"}`}>EN</button>
          <button onClick={() => setLang("fr")} className={`px-3 py-1 rounded text-sm font-medium border transition-colors ${lang === "fr" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"}`}>FR</button>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">{t("title")}</h1>
        <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">{t("amount")} (\u20AC)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" placeholder="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("rate")}</label>
              <select value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="input-field">
                {RATES.map((r) => (
                  <option key={r.value} value={r.value}>{t(r.labelKey)}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">{t("direction")}</label>
              <div className="flex gap-2 mt-1">
                <button onClick={() => setDirection("htToTtc")} className={`px-4 py-2 rounded-lg border font-medium transition-colors ${direction === "htToTtc" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"}`}>{t("htToTtc")}</button>
                <button onClick={() => setDirection("ttcToHt")} className={`px-4 py-2 rounded-lg border font-medium transition-colors ${direction === "ttcToHt" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"}`}>{t("ttcToHt")}</button>
              </div>
            </div>
          </div>
        </div>

        {value > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t("amountHT")}</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(amountHT)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("amountTVA")} ({(rate * 100).toFixed(1)}%)</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(amountTVA)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t("amountTTC")}</p>
                <p className="text-2xl font-bold text-green-700">{fmt(amountTTC)}</p>
              </div>
            </div>

            <div className="tool-card">
              <h2 className="text-lg font-bold mb-4">{t("quickRef")} ({(rate * 100).toFixed(1)}% TVA)</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("htHeader")}</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("tvaHeader")}</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">{t("ttcHeader")}</th>
                  </tr>
                </thead>
                <tbody>
                  {refAmounts.map((a) => (
                    <tr key={a} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(a)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(a * rate)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(a * (1 + rate))}</td>
                    </tr>
                  ))}
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
            name: "France TVA Calculator (Calculateur TVA)",
            description: META.description,
            url: `${SITE_URL}/tools/france-tva-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
