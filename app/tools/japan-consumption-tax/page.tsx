"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import LanguageSwitcher, { useTranslation, type LangCode } from "@/components/LanguageSwitcher";

const META = {
  title: "Japan Consumption Tax Calculator - 消費税計算",
  description:
    "Free Japan consumption tax calculator. Calculate 消費税 (shohizei) with standard 10% and reduced 8% rates. Supports tax-inclusive and tax-exclusive modes.",
  keywords: "消費税計算, consumption tax calculator Japan, 消費税 計算ツール, japanese tax calculator, shohizei calculator, 10% tax japan, 8% reduced rate",
};

const translations: Record<LangCode, Record<string, string>> = {
  en: {
    title: "Japan Consumption Tax Calculator",
    subtitle: "Calculate Japanese consumption tax with standard (10%) and reduced (8%) rates.",
    amount: "Amount",
    amountPlaceholder: "Enter amount",
    taxRate: "Tax Rate",
    standardRate: "Standard Rate (10%)",
    reducedRate: "Reduced Rate (8%)",
    reducedHint: "Food, non-alcoholic beverages, newspapers",
    calculationMode: "Calculation Mode",
    beforeToAfter: "Before Tax \u2192 After Tax (税抜\u2192税込)",
    afterToBefore: "After Tax \u2192 Before Tax (税込\u2192税抜)",
    calculate: "Calculate",
    priceWithoutTax: "Price Without Tax (税抜価格)",
    taxAmount: "Tax Amount (消費税額)",
    priceWithTax: "Price With Tax (税込価格)",
    seoTitle1: "What is Japan's Consumption Tax?",
    seoText1: "Japan's consumption tax (消費税, shohizei) is a value-added tax applied to most goods and services sold in Japan. As of October 2019, the standard rate is 10%, with a reduced rate of 8% for certain items.",
    seoTitle2: "Standard Rate (10%) vs Reduced Rate (8%)",
    seoText2: "The standard 10% rate applies to most goods and services. The reduced 8% rate (軽減税率) applies to food and non-alcoholic beverages (excluding dining in at restaurants) and newspaper subscriptions published at least twice per week.",
    seoTitle3: "Tax-Inclusive vs Tax-Exclusive Pricing",
    seoText3: "In Japan, prices are often displayed as tax-inclusive (税込, zeikomi). Tax-exclusive pricing (税抜, zeinuki) shows the base price before tax is added. This calculator supports both modes to help you determine the breakdown.",
    seoTitle4: "Common Uses",
    seoUse1: "Shopping in Japan and calculating the actual cost",
    seoUse2: "Business invoicing with correct tax breakdown",
    seoUse3: "Comparing prices between tax-inclusive and tax-exclusive listings",
    seoUse4: "Determining the tax component of a purchase",
  },
  ja: {
    title: "消費税計算ツール",
    subtitle: "標準税率（10%）と軽減税率（8%）で消費税を計算します。",
    amount: "金額",
    amountPlaceholder: "金額を入力",
    taxRate: "消費税率",
    standardRate: "標準税率（10%）",
    reducedRate: "軽減税率（8%）",
    reducedHint: "食品、非アルコール飲料、新聞",
    calculationMode: "計算モード",
    beforeToAfter: "税抜 \u2192 税込",
    afterToBefore: "税込 \u2192 税抜",
    calculate: "計算",
    priceWithoutTax: "税抜価格",
    taxAmount: "消費税額",
    priceWithTax: "税込価格",
    seoTitle1: "消費税とは？",
    seoText1: "消費税（しょうひぜい）は、日本国内で販売されるほとんどの商品やサービスに適用される付加価値税です。2019年10月より標準税率は10%で、一部の品目には軽減税率8%が適用されます。",
    seoTitle2: "標準税率（10%）と軽減税率（8%）",
    seoText2: "標準税率10%はほとんどの商品・サービスに適用されます。軽減税率8%は、食品・非アルコール飲料（外食を除く）および週2回以上発行される新聞の定期購読に適用されます。",
    seoTitle3: "税込価格と税抜価格",
    seoText3: "日本では価格表示は税込（ぜいこみ）が一般的です。税抜（ぜいぬき）は税を加える前の本体価格を表示します。この計算ツールは両方のモードに対応し、内訳を確認できます。",
    seoTitle4: "よくある使い方",
    seoUse1: "日本での買い物時の実際のコスト計算",
    seoUse2: "正確な税額内訳を含むビジネス請求書の作成",
    seoUse3: "税込価格と税抜価格の比較",
    seoUse4: "購入品の税額成分の特定",
  },
  de: {}, fr: {}, es: {}, hi: {}, pt: {},
};

export default function JapanConsumptionTaxPage() {
  const { lang, setLang, t } = useTranslation(translations);
  const [amount, setAmount] = useState<string>("1000");
  const [taxRate, setTaxRate] = useState<number>(10);
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");
  const [result, setResult] = useState<{
    priceWithoutTax: number;
    taxAmount: number;
    priceWithTax: number;
  } | null>(null);

  function calculate() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;

    let priceWithoutTax: number;
    let taxAmount: number;
    let priceWithTax: number;

    if (mode === "exclusive") {
      priceWithoutTax = amt;
      taxAmount = Math.floor(amt * taxRate / 100);
      priceWithTax = priceWithoutTax + taxAmount;
    } else {
      priceWithTax = amt;
      priceWithoutTax = Math.ceil(amt / (1 + taxRate / 100));
      taxAmount = priceWithTax - priceWithoutTax;
    }

    setResult({ priceWithoutTax, taxAmount, priceWithTax });
  }

  const fmt = (n: number) => `\u00a5${n.toLocaleString()}`;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/japan-consumption-tax`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <LanguageSwitcher supportedLangs={["en", "ja"]} onLanguageChange={(l: LangCode) => setLang(l)} />

        <h1 className="text-3xl font-extrabold mb-2">{t("title")}</h1>
        <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">{t("amount")} (\u00a5)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                placeholder={t("amountPlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("taxRate")}</label>
              <select value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="input-field">
                <option value={10}>{t("standardRate")}</option>
                <option value={8}>{t("reducedRate")}</option>
              </select>
              {taxRate === 8 && (
                <p className="text-xs text-[var(--muted)] mt-1">{t("reducedHint")}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">{t("calculationMode")}</label>
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "exclusive"}
                  onChange={() => setMode("exclusive")}
                  className="accent-[var(--primary)]"
                />
                <span className="text-sm">{t("beforeToAfter")}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "inclusive"}
                  onChange={() => setMode("inclusive")}
                  className="accent-[var(--primary)]"
                />
                <span className="text-sm">{t("afterToBefore")}</span>
              </label>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            {t("calculate")}
          </button>
        </div>

        {result && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="result-card">
              <p className="text-sm text-[var(--muted)] mb-1">{t("priceWithoutTax")}</p>
              <p className="text-xl font-bold">{fmt(result.priceWithoutTax)}</p>
            </div>
            <div className="result-card" style={{ background: "#fef3c7", borderColor: "#fde68a" }}>
              <p className="text-sm text-[var(--muted)] mb-1">{t("taxAmount")}</p>
              <p className="text-xl font-bold text-amber-700">{fmt(result.taxAmount)}</p>
            </div>
            <div className="result-card" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
              <p className="text-sm text-[var(--muted)] mb-1">{t("priceWithTax")}</p>
              <p className="text-xl font-bold text-[var(--primary)]">{fmt(result.priceWithTax)}</p>
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

          <h3>{t("seoTitle4")}</h3>
          <ul>
            <li>{t("seoUse1")}</li>
            <li>{t("seoUse2")}</li>
            <li>{t("seoUse3")}</li>
            <li>{t("seoUse4")}</li>
          </ul>
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Japan Consumption Tax Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/japan-consumption-tax`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
