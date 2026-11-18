"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Tip Calculator - Calculate Tip & Split Bill Easily",
  description:
    "Free tip calculator to quickly figure out the tip amount and split the bill. Calculate 15%, 18%, 20%, 25%, or custom tip percentage for any restaurant bill.",
  keywords:
    "tip calculator, how much to tip, restaurant tip calculator, bill splitter, gratuity calculator, tip percentage, split bill calculator, dining tip",
};

const TIP_PRESETS = [15, 18, 20, 25];

export default function TipCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [bill, setBill] = useState<string>("50");
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [customTip, setCustomTip] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [people, setPeople] = useState<string>("1");

  const billAmt = parseFloat(bill) || 0;
  const effectiveTip = isCustom ? (parseFloat(customTip) || 0) : tipPercent;
  const tipAmount = billAmt * (effectiveTip / 100);
  const totalAmount = billAmt + tipAmount;
  const numPeople = Math.max(1, parseInt(people) || 1);
  const perPerson = totalAmount / numPeople;
  const tipPerPerson = tipAmount / numPeople;

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/tip-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/tip-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Tip Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Quickly calculate the tip and total bill. Choose a preset tip percentage or enter a custom one, then split the bill between any number of people.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Bill Amount ({currency.symbol})</label>
              <input
                type="number"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                className="input-field"
                placeholder="e.g., 50.00"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Number of People</label>
              <input
                type="number"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="input-field"
                placeholder="e.g., 2"
                min="1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-3">Tip Percentage</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {TIP_PRESETS.map((pct) => (
                  <button
                    key={pct}
                    onClick={() => { setTipPercent(pct); setIsCustom(false); }}
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                      !isCustom && tipPercent === pct
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
                <button
                  onClick={() => setIsCustom(true)}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    isCustom
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  Custom
                </button>
              </div>
              {isCustom && (
                <input
                  type="number"
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  className="input-field"
                  placeholder="Enter custom tip %"
                  step="0.5"
                />
              )}
            </div>
          </div>
        </div>

        {billAmt > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Tip Amount</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(tipAmount)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total</p>
                <p className="text-2xl font-bold text-green-700">{fmt(totalAmount)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Per Person</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(perPerson)}</p>
              </div>
            </div>

            {numPeople > 1 && (
              <div className="tool-card">
                <h2 className="text-lg font-bold mb-4">Split Summary</h2>
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Bill per person</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(billAmt / numPeople)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Tip per person</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(tipPerPerson)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)] bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">Total per person</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(perPerson)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Tip</h2>
          <p>
            Calculating a tip is simple: multiply the bill amount by the tip percentage (as a decimal). For example,
            a 20% tip on a $50 bill is $50 x 0.20 = $10. The total would be $60.
          </p>

          <h2>Standard Tipping Guide in the US</h2>
          <p>
            In the United States, tipping is customary and expected for many services. Here are the standard tipping
            percentages for common situations:
          </p>
          <ul>
            <li><strong>Restaurants:</strong> 15-20% of the pre-tax bill</li>
            <li><strong>Bars:</strong> $1-2 per drink or 15-20% of the tab</li>
            <li><strong>Food Delivery:</strong> 15-20%, minimum $3-5</li>
            <li><strong>Hair Salons:</strong> 15-20% of the service cost</li>
            <li><strong>Taxi/Rideshare:</strong> 15-20% of the fare</li>
            <li><strong>Hotel Housekeeping:</strong> $2-5 per night</li>
          </ul>

          <h2>When Should You Tip More?</h2>
          <p>
            Consider tipping above 20% for exceptional service, large parties (some restaurants add automatic gratuity
            for groups of 6 or more), complex orders, or during holidays. Many people also choose to tip more for
            delivery drivers during bad weather.
          </p>

          <h3>Bill Splitting Tips</h3>
          <p>
            When splitting a bill, it is generally easier to calculate the total (including tip) first and then divide
            evenly among the group. This avoids the confusion of each person calculating their individual tip.
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
            name: "Tip Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/tip-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
