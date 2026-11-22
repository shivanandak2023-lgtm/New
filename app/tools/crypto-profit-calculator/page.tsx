"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Crypto Profit Calculator - Calculate Crypto Gains & ROI",
  description:
    "Free crypto profit calculator to calculate your cryptocurrency gains, losses, and ROI. Works for Bitcoin, Ethereum, Solana, and all cryptocurrencies. Includes future value calculator.",
  keywords:
    "crypto profit calculator, bitcoin profit calculator, crypto ROI calculator, cryptocurrency profit loss, crypto gain calculator, bitcoin ROI, crypto investment calculator, crypto tax calculator",
};

const POPULAR_CRYPTOS = [
  { name: "Bitcoin (BTC)", symbol: "BTC", price: 95000 },
  { name: "Ethereum (ETH)", symbol: "ETH", price: 3500 },
  { name: "Solana (SOL)", symbol: "SOL", price: 250 },
  { name: "BNB (BNB)", symbol: "BNB", price: 600 },
  { name: "XRP (XRP)", symbol: "XRP", price: 1.1 },
  { name: "Dogecoin (DOGE)", symbol: "DOGE", price: 0.38 },
  { name: "Cardano (ADA)", symbol: "ADA", price: 0.95 },
  { name: "Polkadot (DOT)", symbol: "DOT", price: 8.5 },
  { name: "Polygon (MATIC)", symbol: "MATIC", price: 0.85 },
  { name: "Avalanche (AVAX)", symbol: "AVAX", price: 42 },
];

export default function CryptoProfitCalculatorPage() {
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [mode, setMode] = useState<"profit" | "future">("profit");

  // Profit/Loss mode
  const [buyPrice, setBuyPrice] = useState<string>("30000");
  const [sellPrice, setSellPrice] = useState<string>("95000");
  const [qty, setQty] = useState<string>("0.5");
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [profitResult, setProfitResult] = useState<{
    investment: number;
    sellValue: number;
    profitLoss: number;
    roi: number;
    quantity: number;
  } | null>(null);

  // Future value mode
  const [futureInvestment, setFutureInvestment] = useState<string>("1000");
  const [futureBuyPrice, setFutureBuyPrice] = useState<string>("30000");
  const [futureSellPrice, setFutureSellPrice] = useState<string>("95000");
  const [futureResult, setFutureResult] = useState<{
    coinsBought: number;
    futureValue: number;
    profit: number;
    roi: number;
  } | null>(null);

  function calculateProfit() {
    const bp = parseFloat(buyPrice);
    const sp = parseFloat(sellPrice);
    const q = parseFloat(qty);
    const inv = parseFloat(investmentAmount);

    if (!bp || bp <= 0 || !sp || sp <= 0) return;

    let quantity = q;
    let investment = bp * q;

    if (inv && inv > 0) {
      quantity = inv / bp;
      investment = inv;
    } else if (!q || q <= 0) {
      return;
    }

    const sellValue = quantity * sp;
    const profitLoss = sellValue - investment;
    const roi = (profitLoss / investment) * 100;

    setProfitResult({ investment, sellValue, profitLoss, roi, quantity });
  }

  function calculateFuture() {
    const inv = parseFloat(futureInvestment);
    const bp = parseFloat(futureBuyPrice);
    const sp = parseFloat(futureSellPrice);

    if (!inv || inv <= 0 || !bp || bp <= 0 || !sp || sp <= 0) return;

    const coinsBought = inv / bp;
    const futureValue = coinsBought * sp;
    const profit = futureValue - inv;
    const roi = (profit / inv) * 100;

    setFutureResult({ coinsBought, futureValue, profit, roi });
  }

  useEffect(() => { setDisplayCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number, decimals = 2) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
  const fmtCurrency = (n: number) => formatCurrency(n, displayCurrency);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/crypto-profit-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/crypto-profit-calculator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Crypto Profit Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your cryptocurrency profit or loss, ROI percentage, and explore hypothetical investment scenarios.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setDisplayCurrency} className="mb-4" />

          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("profit")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "profit"
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[var(--card-border)] hover:bg-[var(--muted-bg)]"
              }`}
            >
              Profit / Loss
            </button>
            <button
              onClick={() => setMode("future")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "future"
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[var(--card-border)] hover:bg-[var(--muted-bg)]"
              }`}
            >
              Future Value
            </button>
          </div>

          {mode === "profit" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Buy Price ($)</label>
                  <input
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 30000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sell Price ($)</label>
                  <input
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 95000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity (coins)</label>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Or Investment Amount ($)</label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 15000 (overrides qty)"
                  />
                </div>
              </div>
              <button onClick={calculateProfit} className="btn-primary mt-6">
                Calculate Profit/Loss
              </button>
            </>
          )}

          {mode === "future" && (
            <>
              <p className="text-sm text-[var(--muted)] mb-4">
                &ldquo;If I invested $X at price $Y, what would it be worth at $Z?&rdquo;
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Investment Amount ($)</label>
                  <input
                    type="number"
                    value={futureInvestment}
                    onChange={(e) => setFutureInvestment(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Buy Price ($)</label>
                  <input
                    type="number"
                    value={futureBuyPrice}
                    onChange={(e) => setFutureBuyPrice(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 30000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target / Sell Price ($)</label>
                  <input
                    type="number"
                    value={futureSellPrice}
                    onChange={(e) => setFutureSellPrice(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 95000"
                  />
                </div>
              </div>
              <button onClick={calculateFuture} className="btn-primary mt-6">
                Calculate Future Value
              </button>
            </>
          )}
        </div>

        {/* Profit/Loss Result */}
        {mode === "profit" && profitResult && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Investment</p>
                <p className="text-2xl font-bold">{fmtCurrency(profitResult.investment)}</p>
              </div>
              <div
                className="result-card text-center"
                style={{
                  background: profitResult.profitLoss >= 0 ? "#f0fdf4" : "#fef2f2",
                  borderColor: profitResult.profitLoss >= 0 ? "#bbf7d0" : "#fecaca",
                }}
              >
                <p className="text-sm text-[var(--muted)] mb-1">Profit / Loss</p>
                <p className={`text-2xl font-bold ${profitResult.profitLoss >= 0 ? "text-green-700" : "text-red-600"}`}>
                  {profitResult.profitLoss >= 0 ? "+" : ""}{fmtCurrency(profitResult.profitLoss)}
                </p>
              </div>
              <div
                className="result-card text-center"
                style={{
                  background: profitResult.roi >= 0 ? "#f0fdf4" : "#fef2f2",
                  borderColor: profitResult.roi >= 0 ? "#bbf7d0" : "#fecaca",
                }}
              >
                <p className="text-sm text-[var(--muted)] mb-1">ROI</p>
                <p className={`text-2xl font-bold ${profitResult.roi >= 0 ? "text-green-700" : "text-red-600"}`}>
                  {profitResult.roi >= 0 ? "+" : ""}{fmt(profitResult.roi)}%
                </p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Calculation Details</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Buy Price</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">${fmt(parseFloat(buyPrice))}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Sell Price</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">${fmt(parseFloat(sellPrice))}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Quantity</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(profitResult.quantity, 8)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Investment</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtCurrency(profitResult.investment)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Value at Sell Price</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtCurrency(profitResult.sellValue)}</td>
                  </tr>
                  <tr className={profitResult.profitLoss >= 0 ? "bg-green-50" : "bg-red-50"}>
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Profit / Loss</td>
                    <td className={`border border-[var(--card-border)] px-3 py-2 text-right font-bold ${profitResult.profitLoss >= 0 ? "text-green-700" : "text-red-600"}`}>
                      {profitResult.profitLoss >= 0 ? "+" : ""}{fmtCurrency(profitResult.profitLoss)} ({fmt(profitResult.roi)}%)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Future Value Result */}
        {mode === "future" && futureResult && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-xs text-[var(--muted)] mb-1">Coins Bought</p>
                <p className="text-xl font-bold">{fmt(futureResult.coinsBought, 8)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-[var(--muted)] mb-1">Future Value</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmtCurrency(futureResult.futureValue)}</p>
              </div>
              <div
                className="result-card text-center"
                style={{
                  background: futureResult.profit >= 0 ? "#f0fdf4" : "#fef2f2",
                  borderColor: futureResult.profit >= 0 ? "#bbf7d0" : "#fecaca",
                }}
              >
                <p className="text-xs text-[var(--muted)] mb-1">Profit</p>
                <p className={`text-xl font-bold ${futureResult.profit >= 0 ? "text-green-700" : "text-red-600"}`}>
                  {futureResult.profit >= 0 ? "+" : ""}{fmtCurrency(futureResult.profit)}
                </p>
              </div>
              <div
                className="result-card text-center"
                style={{
                  background: futureResult.roi >= 0 ? "#f0fdf4" : "#fef2f2",
                  borderColor: futureResult.roi >= 0 ? "#bbf7d0" : "#fecaca",
                }}
              >
                <p className="text-xs text-[var(--muted)] mb-1">ROI</p>
                <p className={`text-xl font-bold ${futureResult.roi >= 0 ? "text-green-700" : "text-red-600"}`}>
                  {futureResult.roi >= 0 ? "+" : ""}{fmt(futureResult.roi)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tax Implications Note */}
        <div className="tool-card mb-8" style={{ background: "#fefce8", borderColor: "#fde68a" }}>
          <h2 className="text-lg font-bold mb-2">Tax Implications</h2>
          <p className="text-sm mb-2">
            Cryptocurrency gains are taxable in most jurisdictions. In the US, the IRS treats crypto as property:
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li><strong>Short-term capital gains</strong> (held less than 1 year) — Taxed as ordinary income (10-37%)</li>
            <li><strong>Long-term capital gains</strong> (held more than 1 year) — Taxed at 0%, 15%, or 20% depending on income</li>
            <li>Every trade, sale, or exchange is a taxable event</li>
            <li>Crypto received as income, mining, or staking rewards is taxed as ordinary income</li>
          </ul>
          <p className="text-xs text-[var(--muted)] mt-2 italic">
            This is general information, not tax advice. Consult a qualified tax professional for your specific situation.
          </p>
        </div>

        {/* Popular Crypto Reference Prices */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Popular Crypto Reference Prices (Approx.)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Cryptocurrency</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Symbol</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Approx. Price (USD)</th>
                </tr>
              </thead>
              <tbody>
                {POPULAR_CRYPTOS.map((c) => (
                  <tr key={c.symbol} className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">{c.name}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">{c.symbol}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">${fmt(c.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--muted)] mt-2">
            Prices are approximate estimates. Always check live market rates before making investment decisions.
          </p>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does the Crypto Profit Calculator Work?</h2>
          <p>
            The crypto profit calculator helps you determine how much profit or loss you have made (or would make)
            on a cryptocurrency investment. Simply enter the price at which you bought the crypto, the price at
            which you sold (or plan to sell), and the quantity. The calculator instantly shows your total profit
            or loss in dollar terms and as a percentage return on investment (ROI).
          </p>

          <h2>Understanding Crypto ROI</h2>
          <p>
            Return on Investment (ROI) is a performance measure used to evaluate the efficiency of an investment.
            In cryptocurrency, ROI is calculated as (Sell Value - Buy Value) / Buy Value * 100. A positive ROI
            indicates a profitable trade, while a negative ROI means a loss. Due to the high volatility of
            cryptocurrencies, ROI can vary dramatically over short time periods.
          </p>

          <h3>Future Value Mode Explained</h3>
          <p>
            The future value mode lets you explore hypothetical scenarios. For example, you can calculate
            what a $1,000 investment in Bitcoin at $30,000 would be worth if Bitcoin reached $95,000. This is
            useful for planning investment strategies and understanding potential outcomes at different
            price targets.
          </p>

          <h3>Key Crypto Investment Concepts</h3>
          <ul>
            <li><strong>DCA (Dollar-Cost Averaging)</strong> — Investing fixed amounts at regular intervals to reduce timing risk</li>
            <li><strong>HODL</strong> — Holding cryptocurrency long-term regardless of short-term price movements</li>
            <li><strong>Market Cap</strong> — Total value of all coins in circulation (price times circulating supply)</li>
            <li><strong>Volume</strong> — Amount of crypto traded in a given period, indicating market activity and liquidity</li>
          </ul>

          <h3>Risk Management in Crypto</h3>
          <ul>
            <li>Never invest more than you can afford to lose</li>
            <li>Diversify across multiple cryptocurrencies and asset classes</li>
            <li>Set stop-loss orders to limit potential losses</li>
            <li>Keep records of all transactions for tax reporting purposes</li>
            <li>Use secure wallets and enable two-factor authentication</li>
          </ul>

          <h3>Short-Term vs. Long-Term Capital Gains</h3>
          <p>
            In many countries, including the United States, the tax rate on cryptocurrency gains depends on
            how long you held the asset. Assets held for less than one year are subject to short-term capital
            gains tax, which is taxed at your ordinary income rate. Assets held for more than one year qualify
            for long-term capital gains rates, which are typically lower. Understanding this distinction can
            significantly impact your after-tax returns.
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
            name: "Crypto Profit Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/crypto-profit-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
