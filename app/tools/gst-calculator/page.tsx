"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "GST Calculator - Calculate GST Amount Online",
  description:
    "Free GST Calculator to calculate GST amount, CGST, SGST, and total price. Supports 5%, 12%, 18%, and 28% GST rates with inclusive and exclusive modes.",
  keywords: "gst calculator, gst calculation, cgst sgst calculator, 18% gst, gst inclusive exclusive",
};

const GST_RATES = [5, 12, 18, 28];

export default function GSTCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [amount, setAmount] = useState<string>("10000");
  const [gstRate, setGstRate] = useState<number>(18);
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");
  const [result, setResult] = useState<{
    originalAmount: number;
    gstAmount: number;
    cgst: number;
    sgst: number;
    totalAmount: number;
  } | null>(null);

  function calculate() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;

    let originalAmount: number;
    let gstAmount: number;
    let totalAmount: number;

    if (mode === "exclusive") {
      originalAmount = amt;
      gstAmount = (amt * gstRate) / 100;
      totalAmount = amt + gstAmount;
    } else {
      totalAmount = amt;
      originalAmount = (amt * 100) / (100 + gstRate);
      gstAmount = totalAmount - originalAmount;
    }

    setResult({
      originalAmount,
      gstAmount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      totalAmount,
    });
  }

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/gst-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/gst-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">GST Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate GST amount with CGST and SGST breakdown. Supports inclusive and exclusive calculations.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Amount ({currency.symbol})</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GST Rate</label>
              <select value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} className="input-field">
                {GST_RATES.map((r) => (
                  <option key={r} value={r}>
                    {r}%
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Calculation Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "exclusive"}
                  onChange={() => setMode("exclusive")}
                  className="accent-[var(--primary)]"
                />
                <span className="text-sm">GST Exclusive (Add GST)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "inclusive"}
                  onChange={() => setMode("inclusive")}
                  className="accent-[var(--primary)]"
                />
                <span className="text-sm">GST Inclusive (Extract GST)</span>
              </label>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate GST
          </button>
        </div>

        {result && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="result-card">
              <p className="text-sm text-[var(--muted)] mb-1">
                {mode === "exclusive" ? "Base Amount" : "Amount Before GST"}
              </p>
              <p className="text-xl font-bold">{fmt(result.originalAmount)}</p>
            </div>
            <div className="result-card" style={{ background: "#fef3c7", borderColor: "#fde68a" }}>
              <p className="text-sm text-[var(--muted)] mb-1">Total GST ({gstRate}%)</p>
              <p className="text-xl font-bold text-amber-700">{fmt(result.gstAmount)}</p>
            </div>
            <div className="result-card" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
              <p className="text-sm text-[var(--muted)] mb-1">CGST ({gstRate / 2}%)</p>
              <p className="text-xl font-bold text-green-700">{fmt(result.cgst)}</p>
            </div>
            <div className="result-card" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
              <p className="text-sm text-[var(--muted)] mb-1">SGST ({gstRate / 2}%)</p>
              <p className="text-xl font-bold text-green-700">{fmt(result.sgst)}</p>
            </div>
            <div className="result-card sm:col-span-2 text-center" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
              <p className="text-sm text-[var(--muted)] mb-1">Total Amount (incl. GST)</p>
              <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.totalAmount)}</p>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is GST?</h2>
          <p>
            GST (Goods and Services Tax) is a comprehensive indirect tax levied on the supply of goods and services in
            India. It replaced multiple indirect taxes like VAT, excise duty, and service tax, creating a unified tax
            system across the country.
          </p>

          <h2>GST Rate Slabs in India</h2>
          <ul>
            <li><strong>5% GST</strong> — Essential items like packaged food, footwear below Rs.1000</li>
            <li><strong>12% GST</strong> — Items like processed food, mobile phones, furniture</li>
            <li><strong>18% GST</strong> — Most goods and services including IT, telecom, financial services</li>
            <li><strong>28% GST</strong> — Luxury items, cars, tobacco products, aerated drinks</li>
          </ul>

          <h2>GST Exclusive vs Inclusive</h2>
          <p>
            <strong>GST Exclusive:</strong> The GST is added on top of the base price. If an item costs Rs.100 and GST is
            18%, the total becomes Rs.118.
          </p>
          <p>
            <strong>GST Inclusive:</strong> The GST is already included in the stated price. If the total is Rs.118 with
            18% GST, the base price is Rs.100 and the GST component is Rs.18.
          </p>

          <h3>How CGST and SGST Work</h3>
          <p>
            For intra-state (within the same state) transactions, the GST is split equally into CGST (Central GST) and
            SGST (State GST). For inter-state transactions, IGST (Integrated GST) applies at the full rate.
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
            name: "GST Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/gst-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
