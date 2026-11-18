"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "UK Council Tax Calculator 2024-25",
  description:
    "Free UK council tax calculator. Find your council tax amount by band (A-H) with discounts for single occupancy, students, and disability reduction. See annual, monthly, and weekly breakdowns.",
  keywords:
    "council tax calculator, council tax bands, council tax UK, council tax rates 2024, council tax band calculator, single person council tax discount, council tax bands explained",
};

interface BandInfo {
  band: string;
  ratio: string;
  valueRange: string;
  annualAmount: number;
}

const BAND_DATA: BandInfo[] = [
  { band: "A", ratio: "6/9", valueRange: "Up to \u00a340,000", annualAmount: 1398 },
  { band: "B", ratio: "7/9", valueRange: "\u00a340,001 - \u00a352,000", annualAmount: 1631 },
  { band: "C", ratio: "8/9", valueRange: "\u00a352,001 - \u00a368,000", annualAmount: 1864 },
  { band: "D", ratio: "9/9", valueRange: "\u00a368,001 - \u00a388,000", annualAmount: 2096 },
  { band: "E", ratio: "11/9", valueRange: "\u00a388,001 - \u00a3120,000", annualAmount: 2562 },
  { band: "F", ratio: "13/9", valueRange: "\u00a3120,001 - \u00a3160,000", annualAmount: 3027 },
  { band: "G", ratio: "15/9", valueRange: "\u00a3160,001 - \u00a3320,000", annualAmount: 3494 },
  { band: "H", ratio: "18/9", valueRange: "Over \u00a3320,000", annualAmount: 4193 },
];

type Discount = "none" | "single" | "student" | "disability";

export default function UKCouncilTaxPage() {
  const [selectedBand, setSelectedBand] = useState<string>("D");
  const [discount, setDiscount] = useState<Discount>("none");
  const [result, setResult] = useState<{
    band: string;
    annualAmount: number;
    discountAmount: number;
    finalAnnual: number;
    monthly: number;
    weekly: number;
    discountLabel: string;
  } | null>(null);

  function calculate() {
    const bandInfo = BAND_DATA.find((b) => b.band === selectedBand);
    if (!bandInfo) return;

    let annualAmount = bandInfo.annualAmount;
    let discountAmount = 0;
    let discountLabel = "No discount";

    if (discount === "single") {
      discountAmount = annualAmount * 0.25;
      discountLabel = "Single person discount (25%)";
    } else if (discount === "student") {
      discountAmount = annualAmount;
      discountLabel = "Student exemption (100%)";
    } else if (discount === "disability") {
      // Disability reduction moves you down one band
      const currentIndex = BAND_DATA.findIndex((b) => b.band === selectedBand);
      if (currentIndex > 0) {
        const reducedBand = BAND_DATA[currentIndex - 1];
        discountAmount = annualAmount - reducedBand.annualAmount;
        discountLabel = `Disability reduction (Band ${selectedBand} to Band ${reducedBand.band})`;
        annualAmount = reducedBand.annualAmount;
      } else {
        // Band A gets a further reduction (Band A reduced)
        discountAmount = annualAmount * (1 / 9);
        discountLabel = "Disability reduction (Band A reduced)";
      }
    }

    const finalAnnual = annualAmount - (discount === "disability" ? 0 : discountAmount);
    const monthly = finalAnnual / 12;
    const weekly = finalAnnual / 52;

    setResult({
      band: selectedBand,
      annualAmount: bandInfo.annualAmount,
      discountAmount,
      finalAnnual: Math.max(0, finalAnnual),
      monthly,
      weekly,
      discountLabel,
    });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/uk-council-tax`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/uk-council-tax`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">UK Council Tax Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your council tax based on your property band. See annual, monthly, and weekly amounts with available discounts for single occupancy, students, and disability reduction. Uses England average rates for 2024-25.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Property Band</label>
              <select
                value={selectedBand}
                onChange={(e) => setSelectedBand(e.target.value)}
                className="input-field"
              >
                {BAND_DATA.map((b) => (
                  <option key={b.band} value={b.band}>
                    Band {b.band} - {b.valueRange} ({fmt(b.annualAmount)}/year)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Discount / Exemption</label>
              <select
                value={discount}
                onChange={(e) => setDiscount(e.target.value as Discount)}
                className="input-field"
              >
                <option value="none">No Discount</option>
                <option value="single">Single Person (25% off)</option>
                <option value="student">Student Exemption (100% off)</option>
                <option value="disability">Disability Reduction (one band lower)</option>
              </select>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Council Tax
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Annual</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.finalAnnual)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Monthly</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.monthly)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Weekly</p>
                <p className="text-2xl font-bold">{fmt(result.weekly)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Property Band</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">Band {result.band}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Standard Annual Amount</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.annualAmount)}</td>
                  </tr>
                  {result.discountAmount > 0 && (
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{result.discountLabel}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-red-600">-{fmt(result.discountAmount)}</td>
                    </tr>
                  )}
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Amount Due (Annual)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(result.finalAnnual)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">All Bands Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Band</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Property Value (1991)</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Ratio</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annual</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Monthly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BAND_DATA.map((b) => (
                      <tr
                        key={b.band}
                        className={b.band === selectedBand ? "bg-blue-50" : "hover:bg-[var(--muted-bg)]"}
                      >
                        <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">
                          Band {b.band} {b.band === selectedBand ? "(yours)" : ""}
                        </td>
                        <td className="border border-[var(--card-border)] px-3 py-2">{b.valueRange}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{b.ratio}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(b.annualAmount)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(b.annualAmount / 12)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual bar chart comparison */}
            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Band Comparison Chart</h2>
              <div className="space-y-2">
                {BAND_DATA.map((b) => {
                  const maxAmount = BAND_DATA[BAND_DATA.length - 1].annualAmount;
                  const widthPercent = (b.annualAmount / maxAmount) * 100;
                  return (
                    <div key={b.band} className="flex items-center gap-3">
                      <span className="text-sm font-semibold w-16">Band {b.band}</span>
                      <div className="flex-1 bg-[var(--muted-bg)] rounded-full h-6 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${widthPercent}%`,
                            backgroundColor: b.band === selectedBand ? "var(--primary)" : "#93c5fd",
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-20 text-right">{fmt(b.annualAmount)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is Council Tax?</h2>
          <p>
            Council tax is a local tax set by your council to pay for local services like rubbish collection, street cleaning,
            libraries, and emergency services. It applies to all domestic properties in England, Scotland, and Wales.
            This council tax calculator uses the average England rates for 2024-25.
          </p>

          <h2>How Are Council Tax Bands Determined?</h2>
          <p>
            Properties are placed in bands (A to H) based on their value as of 1 April 1991 in England and Scotland.
            The Valuation Office Agency (VOA) assigns bands. Band D is the reference band, with other bands expressed
            as fractions of the Band D amount.
          </p>

          <h2>Council Tax Discounts and Exemptions</h2>
          <h3>Single Person Discount</h3>
          <p>
            If you are the only adult living in your property, you can claim a 25% single person discount on your council tax.
            This is the most commonly claimed council tax reduction in the UK.
          </p>

          <h3>Student Exemption</h3>
          <p>
            Properties occupied entirely by full-time students are exempt from council tax. If a property is shared between
            students and non-students, the non-students may qualify for a discount.
          </p>

          <h3>Disability Reduction</h3>
          <p>
            If your home has been adapted for a disabled person, or the disabled person needs an extra room, you may be
            entitled to a disability reduction. This effectively moves your bill down by one band (e.g., Band D becomes Band C).
            Band A properties receive a reduction of approximately one-ninth.
          </p>

          <h2>Important Notes</h2>
          <p>
            Actual council tax amounts vary significantly by local authority. The rates shown here are England averages.
            Check with your local council for the exact amount applicable to your property.
            Council tax bands in England are based on 1991 property values and have not been revalued since.
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
            name: "UK Council Tax Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/uk-council-tax`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          }),
        }}
      />
    </>
  );
}
