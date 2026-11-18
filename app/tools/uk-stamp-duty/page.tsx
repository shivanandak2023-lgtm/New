"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "UK Stamp Duty Calculator (SDLT) 2024-25",
  description:
    "Free UK Stamp Duty Land Tax calculator for 2024-25. Calculate SDLT for first-time buyers, home movers, additional properties, and non-UK residents with band-by-band breakdown.",
  keywords:
    "stamp duty calculator UK 2024, SDLT calculator, stamp duty land tax, stamp duty rates, first time buyer stamp duty, additional property stamp duty, UK property tax",
};

type BuyerType = "standard" | "first-time" | "additional" | "non-uk";

interface BandBreakdown {
  from: number;
  to: number | null;
  rate: number;
  taxable: number;
  tax: number;
}

export default function UKStampDutyPage() {
  const [propertyPrice, setPropertyPrice] = useState<string>("300000");
  const [buyerType, setBuyerType] = useState<BuyerType>("standard");
  const [result, setResult] = useState<{
    bands: BandBreakdown[];
    totalSDLT: number;
    effectiveRate: number;
  } | null>(null);

  function calculate() {
    const price = parseFloat(propertyPrice);
    if (!price || price <= 0) return;

    let bands: BandBreakdown[] = [];

    if (buyerType === "first-time") {
      if (price <= 625000) {
        bands = [
          { from: 0, to: 425000, rate: 0, taxable: 0, tax: 0 },
          { from: 425000, to: 625000, rate: 5, taxable: 0, tax: 0 },
        ];
      } else {
        // Over 625K, first-time buyer relief does not apply, use standard rates
        bands = [
          { from: 0, to: 250000, rate: 0, taxable: 0, tax: 0 },
          { from: 250000, to: 925000, rate: 5, taxable: 0, tax: 0 },
          { from: 925000, to: 1500000, rate: 10, taxable: 0, tax: 0 },
          { from: 1500000, to: null, rate: 12, taxable: 0, tax: 0 },
        ];
      }
    } else if (buyerType === "additional") {
      bands = [
        { from: 0, to: 250000, rate: 3, taxable: 0, tax: 0 },
        { from: 250000, to: 925000, rate: 8, taxable: 0, tax: 0 },
        { from: 925000, to: 1500000, rate: 13, taxable: 0, tax: 0 },
        { from: 1500000, to: null, rate: 15, taxable: 0, tax: 0 },
      ];
    } else if (buyerType === "non-uk") {
      bands = [
        { from: 0, to: 250000, rate: 2, taxable: 0, tax: 0 },
        { from: 250000, to: 925000, rate: 7, taxable: 0, tax: 0 },
        { from: 925000, to: 1500000, rate: 12, taxable: 0, tax: 0 },
        { from: 1500000, to: null, rate: 14, taxable: 0, tax: 0 },
      ];
    } else {
      bands = [
        { from: 0, to: 250000, rate: 0, taxable: 0, tax: 0 },
        { from: 250000, to: 925000, rate: 5, taxable: 0, tax: 0 },
        { from: 925000, to: 1500000, rate: 10, taxable: 0, tax: 0 },
        { from: 1500000, to: null, rate: 12, taxable: 0, tax: 0 },
      ];
    }

    let totalSDLT = 0;
    const computed = bands.map((band) => {
      const upper = band.to !== null ? Math.min(price, band.to) : price;
      const lower = band.from;
      const taxable = Math.max(0, upper - lower);
      const tax = taxable * (band.rate / 100);
      totalSDLT += tax;
      return { ...band, taxable, tax };
    });

    // Filter out bands that don't apply (price below band start)
    const applicableBands = computed.filter((b) => b.taxable > 0 || b.from < price);

    const effectiveRate = price > 0 ? (totalSDLT / price) * 100 : 0;

    setResult({
      bands: applicableBands,
      totalSDLT,
      effectiveRate,
    });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  const fmtBand = (from: number, to: number | null) => {
    if (to === null) return `Over ${fmt(from)}`;
    return `${fmt(from)} - ${fmt(to)}`;
  };

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/uk-stamp-duty`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">UK Stamp Duty Calculator (SDLT)</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate Stamp Duty Land Tax for England and Northern Ireland using 2024-25 rates. See a full band-by-band breakdown for first-time buyers, home movers, additional properties, and non-UK residents.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Property Price (&pound;)</label>
              <input
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(e.target.value)}
                className="input-field"
                placeholder="e.g., 300000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Buyer Type</label>
              <select
                value={buyerType}
                onChange={(e) => setBuyerType(e.target.value as BuyerType)}
                className="input-field"
              >
                <option value="standard">Moving Home (Standard)</option>
                <option value="first-time">First-Time Buyer</option>
                <option value="additional">Additional Property (+3%)</option>
                <option value="non-uk">Non-UK Resident (+2%)</option>
              </select>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Stamp Duty
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Stamp Duty</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmtExact(result.totalSDLT)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Effective Rate</p>
                <p className="text-2xl font-bold text-green-700">{result.effectiveRate.toFixed(2)}%</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Property Price</p>
                <p className="text-2xl font-bold">{fmt(parseFloat(propertyPrice) || 0)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Band-by-Band Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Band</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Rate</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Taxable Amount</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Tax Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.bands.map((band, i) => (
                      <tr key={i} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{fmtBand(band.from, band.to)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{band.rate}%</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(band.taxable)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(band.tax)}</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50">
                      <td colSpan={3} className="border border-[var(--card-border)] px-3 py-2 font-bold">Total SDLT</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.totalSDLT)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is Stamp Duty Land Tax (SDLT)?</h2>
          <p>
            Stamp Duty Land Tax is a tax paid when you buy a residential property or piece of land in England and Northern Ireland
            over a certain price. Scotland has its own Land and Buildings Transaction Tax (LBTT), and Wales has Land Transaction Tax (LTT).
            This stamp duty calculator UK 2024 tool uses the latest HMRC rates for the 2024-25 tax year.
          </p>

          <h2>2024-25 SDLT Rates</h2>
          <h3>Standard Rates (Moving Home)</h3>
          <ul>
            <li><strong>0%</strong> on the first &pound;250,000</li>
            <li><strong>5%</strong> on &pound;250,001 to &pound;925,000</li>
            <li><strong>10%</strong> on &pound;925,001 to &pound;1,500,000</li>
            <li><strong>12%</strong> on the portion above &pound;1,500,000</li>
          </ul>

          <h3>First-Time Buyer Relief</h3>
          <p>
            First-time buyers pay no SDLT on properties up to &pound;425,000. For properties between &pound;425,001 and &pound;625,000,
            the rate is 5% on the amount above &pound;425,000. If the property exceeds &pound;625,000, standard rates apply.
          </p>

          <h3>Additional Property Surcharge</h3>
          <p>
            Buying a second home or buy-to-let property? A 3% surcharge is added on top of each standard band.
            This SDLT calculator automatically applies the surcharge across all bands.
          </p>

          <h3>Non-UK Resident Surcharge</h3>
          <p>
            Non-UK residents pay an additional 2% surcharge on top of standard rates when purchasing residential property in England
            and Northern Ireland.
          </p>

          <h2>How Is Stamp Duty Calculated?</h2>
          <p>
            SDLT is calculated using a progressive band system, similar to income tax. You only pay the higher rate on the portion
            of the property price that falls within each band, not on the entire purchase price. This means the effective rate is
            always lower than the highest band rate that applies.
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
            name: "UK Stamp Duty Calculator (SDLT)",
            description: META.description,
            url: `${SITE_URL}/tools/uk-stamp-duty`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          }),
        }}
      />
    </>
  );
}
