"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Bitcoin & Crypto Converter - BTC to USD, ETH to USD & More",
  description:
    "Free Bitcoin and crypto converter. Convert BTC, ETH, SOL, BNB, XRP, DOGE, and more to USD, EUR, GBP, INR, JPY. Includes Satoshi converter and quick reference amounts.",
  keywords:
    "bitcoin to usd, crypto converter, btc to usd calculator, eth to usd, satoshi converter, bitcoin converter, crypto to fiat, btc calculator, bitcoin price calculator",
};

const SATS_PER_BTC = 100_000_000;

const CRYPTOS = [
  { symbol: "BTC", name: "Bitcoin", priceUSD: 95000 },
  { symbol: "ETH", name: "Ethereum", priceUSD: 3500 },
  { symbol: "SOL", name: "Solana", priceUSD: 250 },
  { symbol: "BNB", name: "BNB", priceUSD: 600 },
  { symbol: "XRP", name: "XRP", priceUSD: 1.1 },
  { symbol: "DOGE", name: "Dogecoin", priceUSD: 0.38 },
  { symbol: "ADA", name: "Cardano", priceUSD: 0.95 },
  { symbol: "DOT", name: "Polkadot", priceUSD: 8.5 },
  { symbol: "MATIC", name: "Polygon", priceUSD: 0.85 },
  { symbol: "AVAX", name: "Avalanche", priceUSD: 42 },
];

const FIAT_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
  { code: "EUR", name: "Euro", symbol: "\u20ac", rate: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "\u00a3", rate: 0.79 },
  { code: "INR", name: "Indian Rupee", symbol: "\u20b9", rate: 84.5 },
  { code: "JPY", name: "Japanese Yen", symbol: "\u00a5", rate: 151.2 },
];

const QUICK_AMOUNTS = [100, 500, 1000, 5000, 10000];

export default function BitcoinConverterPage() {
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [amount, setAmount] = useState<string>("1");
  const [fromCrypto, setFromCrypto] = useState<string>("BTC");
  const [toFiat, setToFiat] = useState<string>("USD");
  const [satoshis, setSatoshis] = useState<string>("");

  const crypto = CRYPTOS.find((c) => c.symbol === fromCrypto)!;
  const fiat = FIAT_CURRENCIES.find((f) => f.code === toFiat)!;

  const cryptoAmount = parseFloat(amount) || 0;
  const fiatValue = cryptoAmount * crypto.priceUSD * fiat.rate;

  // Satoshi conversion
  const satsValue = parseFloat(satoshis) || 0;
  const btcFromSats = satsValue / SATS_PER_BTC;
  const usdFromSats = btcFromSats * CRYPTOS[0].priceUSD;

  useEffect(() => { setDisplayCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number, decimals = 2) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
  const fmtCurrency = (n: number) => formatCurrency(n, displayCurrency);
  const fmtLarge = (n: number) => {
    if (n >= 1_000_000) return `${fmt(n / 1_000_000)}M`;
    if (n >= 1_000) return `${fmt(n / 1_000)}K`;
    return fmt(n);
  };

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/bitcoin-converter`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/bitcoin-converter`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Bitcoin / Crypto Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert between popular cryptocurrencies and fiat currencies. Live conversion as you type with Satoshi converter included.
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
                placeholder="e.g., 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">From (Crypto)</label>
              <select
                value={fromCrypto}
                onChange={(e) => setFromCrypto(e.target.value)}
                className="input-field"
              >
                {CRYPTOS.map((c) => (
                  <option key={c.symbol} value={c.symbol}>{c.symbol} - {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">To (Fiat)</label>
              <select
                value={toFiat}
                onChange={(e) => setToFiat(e.target.value)}
                className="input-field"
              >
                {FIAT_CURRENCIES.map((f) => (
                  <option key={f.code} value={f.code}>{f.code} - {f.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Live Result */}
          {cryptoAmount > 0 && (
            <div className="mt-6 p-4 rounded-lg" style={{ background: "var(--muted-bg)" }}>
              <p className="text-center text-lg">
                <span className="font-semibold">{fmt(cryptoAmount, 8)} {fromCrypto}</span>
                {" = "}
                <span className="font-bold text-[var(--primary)] text-2xl">{fiat.symbol}{fmt(fiatValue)}</span>
                {" "}<span className="text-sm text-[var(--muted)]">{toFiat}</span>
              </p>
              <p className="text-center text-xs text-[var(--muted)] mt-1">
                1 {fromCrypto} = {fiat.symbol}{fmt(crypto.priceUSD * fiat.rate)} {toFiat}
              </p>
            </div>
          )}
        </div>

        {/* Satoshi Converter */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Satoshi Converter</h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            1 BTC = 100,000,000 Satoshis (sats). The smallest unit of Bitcoin.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Satoshis (sats)</label>
              <input
                type="number"
                value={satoshis}
                onChange={(e) => setSatoshis(e.target.value)}
                className="input-field"
                placeholder="e.g., 100000"
              />
            </div>
            <div className="p-3 rounded-lg" style={{ background: "var(--muted-bg)" }}>
              <p className="text-sm"><strong>BTC:</strong> {fmt(btcFromSats, 8)}</p>
              <p className="text-sm"><strong>USD:</strong> ${fmt(usdFromSats)}</p>
            </div>
          </div>
        </div>

        {/* Quick Reference: How much crypto for $X */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">How Much Crypto Can You Buy?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Crypto</th>
                  {QUICK_AMOUNTS.map((amt) => (
                    <th key={amt} className="border border-[var(--card-border)] px-3 py-2 text-right">${fmtLarge(amt)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CRYPTOS.map((c) => (
                  <tr key={c.symbol} className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">{c.symbol}</td>
                    {QUICK_AMOUNTS.map((amt) => {
                      const coinAmt = amt / c.priceUSD;
                      return (
                        <td key={amt} className="border border-[var(--card-border)] px-3 py-2 text-right">
                          {coinAmt < 0.001 ? coinAmt.toFixed(8) : coinAmt < 1 ? coinAmt.toFixed(4) : fmt(coinAmt)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 10 Crypto Prices */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Top 10 Crypto Prices (Approx.)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">#</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Name</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Symbol</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Price (USD)</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Sats per $1</th>
                </tr>
              </thead>
              <tbody>
                {CRYPTOS.map((c, idx) => (
                  <tr key={c.symbol} className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">{idx + 1}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2">{c.name}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">{c.symbol}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">${fmt(c.priceUSD)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">
                      {c.symbol === "BTC" ? fmt(SATS_PER_BTC / c.priceUSD, 0) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--muted)] mt-2">
            Prices are approximate estimates. Always check live market rates before making any decisions.
          </p>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does the Bitcoin / Crypto Converter Work?</h2>
          <p>
            The Bitcoin and crypto converter lets you instantly convert between popular cryptocurrencies
            and major fiat currencies. Enter an amount in any supported cryptocurrency (BTC, ETH, SOL, BNB,
            XRP, DOGE, ADA, DOT, MATIC, AVAX) and see the equivalent value in USD, EUR, GBP, INR, or JPY.
            The conversion updates as you type, giving you real-time results.
          </p>

          <h2>Understanding Satoshis</h2>
          <p>
            A Satoshi (sat) is the smallest unit of Bitcoin, named after Bitcoin&apos;s pseudonymous creator,
            Satoshi Nakamoto. One Bitcoin equals 100,000,000 Satoshis. As the price of Bitcoin has increased,
            Satoshis have become a more practical unit for everyday transactions. For example, at $95,000
            per Bitcoin, one Satoshi is worth approximately $0.00095, making it easier to express small
            amounts of Bitcoin.
          </p>

          <h3>Why Convert Crypto to Fiat?</h3>
          <p>
            Converting cryptocurrency to fiat currency helps investors and traders understand the real-world
            value of their holdings. Whether you are checking your portfolio value, planning to sell, or
            comparing prices across exchanges, a crypto converter is an essential tool for anyone involved
            in the cryptocurrency market.
          </p>

          <h3>Major Cryptocurrencies Explained</h3>
          <ul>
            <li><strong>Bitcoin (BTC)</strong> — The first and largest cryptocurrency, often called digital gold</li>
            <li><strong>Ethereum (ETH)</strong> — A programmable blockchain supporting smart contracts and decentralized apps</li>
            <li><strong>Solana (SOL)</strong> — A high-performance blockchain known for fast transactions and low fees</li>
            <li><strong>BNB</strong> — The native token of the Binance ecosystem and BNB Chain</li>
            <li><strong>XRP</strong> — Designed for fast, low-cost international money transfers</li>
            <li><strong>Dogecoin (DOGE)</strong> — Originally a meme coin, now widely accepted for payments and tipping</li>
          </ul>

          <h3>Crypto Conversion Tips</h3>
          <ul>
            <li>Always compare exchange rates across multiple platforms before converting large amounts</li>
            <li>Be aware of network fees (gas fees) when transferring cryptocurrency</li>
            <li>Fiat on-ramps and off-ramps may charge additional fees for conversion</li>
            <li>Stablecoins (USDT, USDC) can be used as an intermediate step to reduce volatility risk</li>
            <li>Keep records of all conversions for tax reporting purposes</li>
          </ul>

          <h3>Bitcoin Denominations</h3>
          <p>
            Beyond Satoshis, Bitcoin has several informal denominations. A millibitcoin (mBTC) is one-thousandth
            of a Bitcoin, and a microbitcoin (uBTC or "bit") is one-millionth. As Bitcoin adoption grows and
            prices increase, smaller denominations become more relevant for everyday use and pricing. The
            Lightning Network, Bitcoin&apos;s layer-2 scaling solution, operates in Satoshis, making sats the
            de facto unit for microtransactions.
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
            name: "Bitcoin / Crypto Converter",
            description: META.description,
            url: `${SITE_URL}/tools/bitcoin-converter`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
