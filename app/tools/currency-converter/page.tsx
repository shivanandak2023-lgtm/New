"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Currency Converter - Convert Between World Currencies",
  description:
    "Free currency converter to convert between USD, EUR, GBP, INR, JPY, and 10+ world currencies. Get approximate exchange rates instantly.",
  keywords:
    "currency converter, exchange rate calculator, USD to EUR, USD to INR, convert currency, money converter, forex calculator, currency exchange",
};

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "\u20ac" },
  { code: "GBP", name: "British Pound", symbol: "\u00a3" },
  { code: "INR", name: "Indian Rupee", symbol: "\u20b9" },
  { code: "JPY", name: "Japanese Yen", symbol: "\u00a5" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "\u00a5" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "AED", name: "UAE Dirham", symbol: "AED" },
  { code: "SAR", name: "Saudi Riyal", symbol: "SAR" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$" },
  { code: "KRW", name: "South Korean Won", symbol: "\u20a9" },
];

// Approximate exchange rates relative to 1 USD (as of Nov 2026)
const RATES_TO_USD: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 84.5,
  JPY: 151.2,
  AUD: 1.55,
  CAD: 1.37,
  CHF: 0.88,
  CNY: 7.24,
  SGD: 1.34,
  AED: 3.67,
  SAR: 3.75,
  BRL: 5.05,
  MXN: 17.6,
  KRW: 1340,
};

export default function CurrencyConverterPage() {
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [result, setResult] = useState<{
    convertedAmount: number;
    rate: number;
    inverseRate: number;
  } | null>(null);

  function convert() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;

    const fromRate = RATES_TO_USD[fromCurrency];
    const toRate = RATES_TO_USD[toCurrency];
    if (!fromRate || !toRate) return;

    const amountInUSD = amt / fromRate;
    const convertedAmount = amountInUSD * toRate;
    const rate = toRate / fromRate;
    const inverseRate = fromRate / toRate;

    setResult({ convertedAmount, rate, inverseRate });
  }

  function swapCurrencies() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  }

  useEffect(() => { setDisplayCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number, decimals = 2) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
  const fmtCurrency = (n: number) => formatCurrency(n, displayCurrency);

  const getCurrencySymbol = (code: string) => CURRENCIES.find((c) => c.code === code)?.symbol || code;

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/currency-converter`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Currency Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert between 15 world currencies using approximate exchange rates. Enter an amount, select currencies, and get instant results.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setDisplayCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                placeholder="e.g., 1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="input-field"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="input-field"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button onClick={convert} className="btn-primary">
              Convert
            </button>
            <button
              onClick={swapCurrencies}
              className="px-4 py-2 border border-[var(--card-border)] rounded-lg hover:bg-[var(--muted-bg)] transition-colors"
            >
              Swap
            </button>
          </div>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Converted Amount</p>
                <p className="text-2xl font-bold text-[var(--primary)]">
                  {getCurrencySymbol(toCurrency)} {fmt(result.convertedAmount)}
                </p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Exchange Rate</p>
                <p className="text-2xl font-bold text-green-700">
                  1 {fromCurrency} = {fmt(result.rate, 4)} {toCurrency}
                </p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Conversion Details</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Amount</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">
                      {getCurrencySymbol(fromCurrency)} {fmt(parseFloat(amount))}
                    </td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">From</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fromCurrency}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">To</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{toCurrency}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Rate ({fromCurrency} to {toCurrency})</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.rate, 6)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Inverse Rate ({toCurrency} to {fromCurrency})</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.inverseRate, 6)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Converted Amount</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">
                      {getCurrencySymbol(toCurrency)} {fmt(result.convertedAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-[var(--muted)] text-center italic">
              Rates are approximate and may not reflect real-time market rates. For financial transactions, please verify with your bank or financial institution.
            </p>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does Currency Conversion Work?</h2>
          <p>
            Currency conversion uses exchange rates to determine how much one currency is worth in another.
            The exchange rate represents the value of one currency relative to another and fluctuates based
            on economic factors, interest rates, inflation, and market demand.
          </p>

          <h2>Understanding Exchange Rates</h2>
          <p>
            Exchange rates can be quoted as direct or indirect rates. A direct quote tells you how much
            domestic currency you need to buy one unit of foreign currency. An indirect quote tells you
            how much foreign currency you can buy with one unit of domestic currency.
          </p>

          <h3>Factors Affecting Exchange Rates</h3>
          <ul>
            <li><strong>Interest rates</strong> - Higher interest rates attract foreign investment, strengthening the currency</li>
            <li><strong>Inflation</strong> - Lower inflation typically strengthens a currency over time</li>
            <li><strong>Economic stability</strong> - Strong economic performance increases demand for a currency</li>
            <li><strong>Trade balance</strong> - Countries with trade surpluses tend to have stronger currencies</li>
          </ul>

          <h3>Common Currency Pairs</h3>
          <p>
            The most traded currency pairs globally include EUR/USD, USD/JPY, GBP/USD, and USD/CHF.
            These major pairs account for a significant portion of daily forex trading volume, which
            exceeds $6 trillion per day.
          </p>

          <h3>Tips for Currency Exchange</h3>
          <ul>
            <li>Compare rates from multiple sources before exchanging large amounts</li>
            <li>Be aware of hidden fees and commission charges</li>
            <li>Airport and hotel exchange services typically offer worse rates</li>
            <li>Using a credit card abroad may offer competitive exchange rates</li>
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
            name: "Currency Converter",
            description: META.description,
            url: `${SITE_URL}/tools/currency-converter`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
