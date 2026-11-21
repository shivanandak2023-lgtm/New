"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Saudi Arabia VAT Calculator (15%)",
  description:
    "Free Saudi Arabia VAT calculator. Calculate 15% VAT on any amount in SAR. Add or remove VAT instantly. حاسبة ضريبة القيمة المضافة السعودية.",
  keywords:
    "Saudi VAT calculator, حاسبة ضريبة القيمة المضافة, VAT calculator Saudi Arabia 15%, Saudi Arabia tax calculator, ضريبة القيمة المضافة, حساب الضريبة",
};

type Lang = "en" | "ar";

const labels = {
  en: {
    title: "Saudi Arabia VAT Calculator",
    subtitle: "Calculate 15% Value Added Tax (VAT) on any amount in Saudi Riyals (SAR).",
    amount: "Amount (SAR)",
    direction: "Calculation Direction",
    exclusive: "Price is exclusive of VAT (add VAT)",
    inclusive: "Price is inclusive of VAT (remove VAT)",
    calculate: "Calculate VAT",
    priceWithout: "Price without VAT",
    vatAmount: "VAT Amount (15%)",
    priceWith: "Price with VAT",
    breakdown: "Calculation Breakdown",
    originalAmount: "Original Amount",
    vatRate: "VAT Rate",
    vatCalculated: "VAT Calculated",
    totalAmount: "Total Amount",
  },
  ar: {
    title: "حاسبة ضريبة القيمة المضافة السعودية",
    subtitle: "احسب ضريبة القيمة المضافة بنسبة 15% على أي مبلغ بالريال السعودي.",
    amount: "المبلغ (ريال)",
    direction: "اتجاه الحساب",
    exclusive: "السعر بدون ضريبة (إضافة الضريبة)",
    inclusive: "السعر شامل الضريبة (إزالة الضريبة)",
    calculate: "احسب",
    priceWithout: "السعر بدون ضريبة",
    vatAmount: "مبلغ الضريبة (15%)",
    priceWith: "السعر شامل الضريبة",
    breakdown: "تفصيل الحساب",
    originalAmount: "المبلغ الأصلي",
    vatRate: "نسبة الضريبة",
    vatCalculated: "الضريبة المحسوبة",
    totalAmount: "المبلغ الإجمالي",
  },
};

export default function SaudiVATCalculatorPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [amount, setAmount] = useState<string>("1000");
  const [inclusive, setInclusive] = useState<boolean>(false);
  const [result, setResult] = useState<{
    priceWithout: number;
    vatAmount: number;
    priceWith: number;
  } | null>(null);

  const t = labels[lang];
  const VAT_RATE = 0.15;

  function calculate() {
    const raw = parseFloat(amount);
    if (!raw || raw <= 0) return;

    let priceWithout: number;
    let vatAmount: number;
    let priceWith: number;

    if (inclusive) {
      priceWith = raw;
      vatAmount = raw - raw / (1 + VAT_RATE);
      priceWithout = raw - vatAmount;
    } else {
      priceWithout = raw;
      vatAmount = raw * VAT_RATE;
      priceWith = raw + vatAmount;
    }

    setResult({ priceWithout, vatAmount, priceWith });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-SA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/saudi-vat-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${SITE_URL}/tools/saudi-vat-calculator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="text-sm px-3 py-1 border border-[var(--card-border)] rounded hover:bg-[var(--muted-bg)]"
          >
            {lang === "en" ? "العربية" : "English"}
          </button>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">{t.title}</h1>
        <p className="text-[var(--muted)] mb-8">{t.subtitle}</p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">{t.amount}</label>
            <div className="relative">
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
                <p className="text-xl font-bold text-[var(--primary)]">{fmt(result.priceWithout)} <span className="text-sm">SAR &#xFDFC;</span></p>
              </div>
              <div className="result-card text-center" style={{ background: "#ecfdf5", borderColor: "#6ee7b7" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{t.vatAmount}</p>
                <p className="text-xl font-bold text-green-700">{fmt(result.vatAmount)} <span className="text-sm">SAR &#xFDFC;</span></p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">{t.priceWith}</p>
                <p className="text-xl font-bold">{fmt(result.priceWith)} <span className="text-sm">SAR &#xFDFC;</span></p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">{t.breakdown}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{t.originalAmount}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">
                        {fmt(inclusive ? result.priceWith : result.priceWithout)} SAR
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{t.vatRate}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">15%</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{t.vatCalculated}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-green-700">
                        {fmt(result.vatAmount)} SAR
                      </td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">{t.totalAmount}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">
                        {fmt(result.priceWith)} SAR
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card" dir="ltr">
          <h2>Saudi Arabia VAT — Overview</h2>
          <p>
            Saudi Arabia introduced Value Added Tax (VAT) on 1 January 2018 at a rate of 5% as part of the GCC VAT Framework
            Agreement. On 1 July 2020, the rate was increased to 15% to support government revenue following the decline in
            oil prices and the economic impact of the global pandemic. The General Authority of Zakat and Tax (ZATCA, formerly
            GAZT) is responsible for administering and collecting VAT in the Kingdom.
          </p>

          <h2>How Saudi VAT Works</h2>
          <p>
            VAT in Saudi Arabia is a consumption tax applied at each stage of the supply chain. Businesses registered for VAT
            must charge 15% on taxable supplies of goods and services. They can reclaim input VAT paid on business purchases,
            and the net difference is remitted to ZATCA. VAT registration is mandatory for businesses with annual taxable
            supplies exceeding SAR 375,000, and voluntary registration is available for businesses exceeding SAR 187,500.
          </p>

          <h2>What Is Taxable at 15%?</h2>
          <p>
            Most goods and services in Saudi Arabia are subject to the standard 15% VAT rate. This includes retail sales,
            restaurant meals, professional services, telecommunications, electronics, and most consumer goods. Certain
            supplies are zero-rated, including exports of goods outside the GCC, international transportation, and newly
            constructed residential properties. Exempt supplies include financial services, residential rent, and certain
            healthcare and education services.
          </p>

          <h2>How to Calculate Saudi VAT</h2>
          <p>
            To add 15% VAT to a price: multiply the base amount by 0.15 and add the result. For example, an item priced at
            SAR 1,000 excluding VAT would have SAR 150 VAT, totaling SAR 1,150. To extract VAT from an inclusive price:
            divide the total by 1.15. For SAR 1,150 inclusive, the base price is SAR 1,000 and the VAT is SAR 150. This
            Saudi VAT calculator handles both directions automatically.
          </p>

          <h2>&#x062D;&#x0627;&#x0633;&#x0628;&#x0629; &#x0636;&#x0631;&#x064A;&#x0628;&#x0629; &#x0627;&#x0644;&#x0642;&#x064A;&#x0645;&#x0629; &#x0627;&#x0644;&#x0645;&#x0636;&#x0627;&#x0641;&#x0629;</h2>
          <p>
            Use this free Saudi VAT calculator to quickly compute the 15% VAT on any transaction amount. Whether you are a
            business owner preparing invoices, an accountant reconciling VAT returns, or a consumer checking if the VAT
            charged is correct, this tool provides instant and accurate results. The calculator supports both adding VAT
            to a net price and removing VAT from a gross price, making it versatile for all your Saudi Arabia VAT
            calculation needs.
          </p>

          <h2>VAT Filing in Saudi Arabia</h2>
          <p>
            VAT returns in Saudi Arabia are filed through the ZATCA online portal. Businesses with annual taxable supplies
            exceeding SAR 40 million file monthly, while others file quarterly. Returns must include details of output tax
            collected, input tax paid, and the net amount due. Late filing or payment is subject to penalties ranging from
            5% to 25% of the unpaid tax amount.
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
            name: "Saudi Arabia VAT Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/saudi-vat-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "SAR" },
          }),
        }}
      />
    </>
  );
}
