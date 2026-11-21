"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "New Zealand GST Calculator (15%) 2024",
  description:
    "Free New Zealand GST calculator. Add or remove 15% GST instantly. Calculate GST-inclusive and GST-exclusive prices for NZ goods and services.",
  keywords:
    "GST calculator NZ, New Zealand GST calculator 15%, NZ GST calculator, add GST NZ, remove GST NZ, GST inclusive exclusive calculator, goods and services tax NZ",
};

type GSTMode = "exclusive" | "inclusive";

interface GSTResult {
  netPrice: number;
  gstAmount: number;
  totalPrice: number;
  gstRate: number;
}

export default function NZGSTCalculatorPage() {
  const [amount, setAmount] = useState<string>("100");
  const [mode, setMode] = useState<GSTMode>("exclusive");
  const [result, setResult] = useState<GSTResult | null>(null);

  const GST_RATE = 15;

  function calculate() {
    const value = parseFloat(amount);
    if (!value || value <= 0) return;

    let netPrice: number;
    let gstAmount: number;
    let totalPrice: number;

    if (mode === "exclusive") {
      netPrice = value;
      gstAmount = value * (GST_RATE / 100);
      totalPrice = value + gstAmount;
    } else {
      totalPrice = value;
      gstAmount = value - value / (1 + GST_RATE / 100);
      netPrice = value - gstAmount;
    }

    setResult({ netPrice, gstAmount, totalPrice, gstRate: GST_RATE });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/nz-gst-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/nz-gst-calculator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">New Zealand GST Calculator (15%)</h1>
        <p className="text-[var(--muted)] mb-8">
          Add or remove 15% GST (Goods and Services Tax) for New Zealand. Enter a GST-exclusive or GST-inclusive amount to calculate the net price, GST amount, and total price.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (NZ$)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                placeholder="e.g., 100"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount Type</label>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setMode("exclusive")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    mode === "exclusive"
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  GST Exclusive (Add GST)
                </button>
                <button
                  onClick={() => setMode("inclusive")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    mode === "inclusive"
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  GST Inclusive (Remove GST)
                </button>
              </div>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate GST
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Price (Excl. GST)</p>
                <p className="text-2xl font-bold">{fmt(result.netPrice)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">GST Amount (15%)</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.gstAmount)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Price (Incl. GST)</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.totalPrice)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Calculation Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Net Price (Before GST)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.netPrice)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">GST Rate</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{result.gstRate}%</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">GST Amount</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-[var(--primary)] font-semibold">{fmt(result.gstAmount)}</td>
                    </tr>
                    <tr className="bg-green-50 font-bold">
                      <td className="border border-[var(--card-border)] px-3 py-2">Total Price (Incl. GST)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(result.totalPrice)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">GST Formulas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--muted-bg)] rounded-lg">
                  <p className="font-semibold mb-2">Add GST (Exclusive to Inclusive)</p>
                  <p className="text-sm font-mono">GST = Amount &times; 0.15</p>
                  <p className="text-sm font-mono">Total = Amount &times; 1.15</p>
                </div>
                <div className="p-4 bg-[var(--muted-bg)] rounded-lg">
                  <p className="font-semibold mb-2">Remove GST (Inclusive to Exclusive)</p>
                  <p className="text-sm font-mono">Net = Amount &divide; 1.15</p>
                  <p className="text-sm font-mono">GST = Amount - Net</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is GST in New Zealand?</h2>
          <p>
            Goods and Services Tax (GST) is a broad-based consumption tax applied to most goods and services sold in New Zealand.
            Introduced on 1 October 1986, New Zealand was one of the first countries to implement a comprehensive GST system. The
            current rate is 15%, which has been in effect since 1 October 2010. This New Zealand GST calculator 15% tool makes it
            easy to add or remove GST from any amount.
          </p>

          <h2>How Does NZ GST Work?</h2>
          <p>
            GST is charged at a flat rate of 15% on most goods and services in New Zealand. Unlike some countries that have multiple
            VAT rates, New Zealand keeps its GST system simple with a single rate applied broadly. Businesses registered for GST
            collect the tax on behalf of the Inland Revenue Department (IRD) and can claim back GST on their business purchases.
            This GST calculator NZ tool helps both businesses and consumers quickly calculate GST amounts.
          </p>

          <h2>GST-Exempt Items in New Zealand</h2>
          <p>
            While most goods and services are subject to GST, there are some important exemptions. Financial services such as
            bank interest, life insurance premiums, and share trading are exempt from GST. Residential rental property is also
            exempt, meaning landlords do not charge GST on rent. Donated goods and services to non-profit organizations, and
            certain precious metals sold as investments may also be exempt.
          </p>

          <h2>GST Registration Requirements</h2>
          <p>
            In New Zealand, businesses must register for GST if their taxable supplies exceed $60,000 in any 12-month period
            (or are expected to). Businesses below this threshold can voluntarily register. Once registered, businesses must file
            GST returns (typically every two or six months) and pay the difference between GST collected on sales and GST paid on
            purchases. GST-registered businesses must display prices inclusive of GST to consumers.
          </p>

          <h2>How to Calculate GST</h2>
          <p>
            To add GST to a price, multiply the GST-exclusive amount by 1.15. For example, if an item costs NZ$100 before GST,
            the GST-inclusive price is NZ$115 (NZ$100 &times; 1.15). To remove GST from an inclusive price, divide by 1.15. So
            if an item costs NZ$115 including GST, the net price is NZ$100 (NZ$115 &divide; 1.15) and the GST component is NZ$15.
          </p>

          <h2>History of GST Rates in New Zealand</h2>
          <p>
            New Zealand&apos;s GST rate has changed over the years. When first introduced in 1986, the rate was 10%. It increased
            to 12.5% on 1 July 1989, where it remained for over two decades. On 1 October 2010, the rate was raised to the current
            15% as part of a broader tax reform package that also reduced income tax rates. New Zealand&apos;s GST is notable for
            its broad base and single rate, making it one of the most efficient consumption taxes globally.
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
            name: "New Zealand GST Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/nz-gst-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "NZD" },
          }),
        }}
      />
    </>
  );
}
