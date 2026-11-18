"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Sales Tax Calculator - Calculate Tax by US State",
  description:
    "Free sales tax calculator for all 50 US states. Enter a price and state to find the tax amount and total cost. Compare sales tax rates across states.",
  keywords:
    "sales tax calculator, tax calculator by state, sales tax rate, how much is sales tax, state sales tax, calculate sales tax, US sales tax rates",
};

const US_STATES: { name: string; abbr: string; rate: number }[] = [
  { name: "Alabama", abbr: "AL", rate: 4.0 },
  { name: "Alaska", abbr: "AK", rate: 0.0 },
  { name: "Arizona", abbr: "AZ", rate: 5.6 },
  { name: "Arkansas", abbr: "AR", rate: 6.5 },
  { name: "California", abbr: "CA", rate: 7.25 },
  { name: "Colorado", abbr: "CO", rate: 2.9 },
  { name: "Connecticut", abbr: "CT", rate: 6.35 },
  { name: "Delaware", abbr: "DE", rate: 0.0 },
  { name: "Florida", abbr: "FL", rate: 6.0 },
  { name: "Georgia", abbr: "GA", rate: 4.0 },
  { name: "Hawaii", abbr: "HI", rate: 4.0 },
  { name: "Idaho", abbr: "ID", rate: 6.0 },
  { name: "Illinois", abbr: "IL", rate: 6.25 },
  { name: "Indiana", abbr: "IN", rate: 7.0 },
  { name: "Iowa", abbr: "IA", rate: 6.0 },
  { name: "Kansas", abbr: "KS", rate: 6.5 },
  { name: "Kentucky", abbr: "KY", rate: 6.0 },
  { name: "Louisiana", abbr: "LA", rate: 4.45 },
  { name: "Maine", abbr: "ME", rate: 5.5 },
  { name: "Maryland", abbr: "MD", rate: 6.0 },
  { name: "Massachusetts", abbr: "MA", rate: 6.25 },
  { name: "Michigan", abbr: "MI", rate: 6.0 },
  { name: "Minnesota", abbr: "MN", rate: 6.875 },
  { name: "Mississippi", abbr: "MS", rate: 7.0 },
  { name: "Missouri", abbr: "MO", rate: 4.225 },
  { name: "Montana", abbr: "MT", rate: 0.0 },
  { name: "Nebraska", abbr: "NE", rate: 5.5 },
  { name: "Nevada", abbr: "NV", rate: 6.85 },
  { name: "New Hampshire", abbr: "NH", rate: 0.0 },
  { name: "New Jersey", abbr: "NJ", rate: 6.625 },
  { name: "New Mexico", abbr: "NM", rate: 5.0 },
  { name: "New York", abbr: "NY", rate: 4.0 },
  { name: "North Carolina", abbr: "NC", rate: 4.75 },
  { name: "North Dakota", abbr: "ND", rate: 5.0 },
  { name: "Ohio", abbr: "OH", rate: 5.75 },
  { name: "Oklahoma", abbr: "OK", rate: 4.5 },
  { name: "Oregon", abbr: "OR", rate: 0.0 },
  { name: "Pennsylvania", abbr: "PA", rate: 6.0 },
  { name: "Rhode Island", abbr: "RI", rate: 7.0 },
  { name: "South Carolina", abbr: "SC", rate: 6.0 },
  { name: "South Dakota", abbr: "SD", rate: 4.5 },
  { name: "Tennessee", abbr: "TN", rate: 7.0 },
  { name: "Texas", abbr: "TX", rate: 6.25 },
  { name: "Utah", abbr: "UT", rate: 6.1 },
  { name: "Vermont", abbr: "VT", rate: 6.0 },
  { name: "Virginia", abbr: "VA", rate: 5.3 },
  { name: "Washington", abbr: "WA", rate: 6.5 },
  { name: "West Virginia", abbr: "WV", rate: 6.0 },
  { name: "Wisconsin", abbr: "WI", rate: 5.0 },
  { name: "Wyoming", abbr: "WY", rate: 4.0 },
];

export default function SalesTaxCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [price, setPrice] = useState<string>("100");
  const [stateIdx, setStateIdx] = useState<number>(4); // California default
  const [showAll, setShowAll] = useState(false);

  const priceAmt = parseFloat(price) || 0;
  const selectedState = US_STATES[stateIdx];
  const taxAmount = priceAmt * (selectedState.rate / 100);
  const totalPrice = priceAmt + taxAmount;

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  const sortedStates = [...US_STATES].sort((a, b) => b.rate - a.rate);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/sales-tax-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Sales Tax Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate sales tax for any US state. Enter the price and select your state to see the tax amount and total cost. Compare rates across all 50 states.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Price ({currency.symbol})</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input-field"
                placeholder="e.g., 100.00"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <select
                value={stateIdx}
                onChange={(e) => setStateIdx(parseInt(e.target.value))}
                className="input-field"
              >
                {US_STATES.map((st, i) => (
                  <option key={st.abbr} value={i}>
                    {st.name} ({st.abbr}) - {st.rate}%
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {priceAmt > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Pre-Tax Price</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(priceAmt)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Tax ({selectedState.rate}%)</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(taxAmount)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Price</p>
                <p className="text-2xl font-bold text-green-700">{fmt(totalPrice)}</p>
              </div>
            </div>

            {selectedState.rate === 0 && (
              <div className="tool-card mb-6 bg-green-50 border-green-200">
                <p className="text-green-800 font-medium">
                  {selectedState.name} has no state sales tax! The total price equals the pre-tax price.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="tool-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Sales Tax Rates by State</h2>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              {showAll ? "Show Top 10" : "Show All 50"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">State</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Rate</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Tax on {fmt(priceAmt)}</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {(showAll ? sortedStates : sortedStates.slice(0, 10)).map((st) => (
                  <tr key={st.abbr} className={`hover:bg-[var(--muted-bg)] ${st.abbr === selectedState.abbr ? "bg-blue-50" : ""}`}>
                    <td className="border border-[var(--card-border)] px-3 py-2">{st.name} ({st.abbr})</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{st.rate}%</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(priceAmt * (st.rate / 100))}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(priceAmt + priceAmt * (st.rate / 100))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Understanding US Sales Tax</h2>
          <p>
            Sales tax in the United States is a consumption tax imposed by state and local governments on the sale of goods
            and certain services. Unlike VAT used in many countries, US sales tax is added at the point of sale and is not
            included in the listed price.
          </p>

          <h2>States With No Sales Tax</h2>
          <p>
            Five states have no state sales tax: Alaska, Delaware, Montana, New Hampshire, and Oregon. However, Alaska
            allows local jurisdictions to impose sales taxes. Delaware, Montana, New Hampshire, and Oregon have no sales
            tax at any level.
          </p>

          <h2>Highest Sales Tax States</h2>
          <ul>
            <li><strong>California:</strong> 7.25% (highest base state rate)</li>
            <li><strong>Indiana, Mississippi, Rhode Island, Tennessee:</strong> 7.0%</li>
            <li><strong>Minnesota:</strong> 6.875%</li>
            <li><strong>Nevada:</strong> 6.85%</li>
          </ul>

          <h3>Local Sales Tax</h3>
          <p>
            Many cities and counties add their own sales tax on top of the state rate. For example, while California has a
            7.25% state rate, the combined rate in Los Angeles is about 9.5%. This calculator shows state-level rates only;
            check your local government for combined rates.
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
            name: "Sales Tax Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/sales-tax-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
