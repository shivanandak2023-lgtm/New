"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Social Security Calculator - Estimate Your Retirement Benefits",
  description:
    "Free Social Security calculator to estimate your monthly retirement benefits at age 62, 67, or 70. See how filing age affects your benefit amount.",
  keywords:
    "social security calculator, social security benefits, retirement benefits calculator, ssa calculator, social security estimate, social security retirement age",
};

export default function SocialSecurityCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [currentAge, setCurrentAge] = useState<string>("40");
  const [avgAnnualIncome, setAvgAnnualIncome] = useState<string>("65000");
  const [result, setResult] = useState<{
    aime: number;
    pia: number;
    earlyBenefit: number;
    fullBenefit: number;
    delayedBenefit: number;
    earlyAnnual: number;
    fullAnnual: number;
    delayedAnnual: number;
    earlyLifetime: number;
    fullLifetime: number;
    delayedLifetime: number;
  } | null>(null);

  function calculate() {
    const age = parseInt(currentAge);
    const income = parseFloat(avgAnnualIncome);

    if (!age || !income || age < 22 || age > 69 || income <= 0) return;

    const aime = Math.min(income, 168600) / 12;

    const bp1 = 1115;
    const bp2 = 6721;

    let pia = 0;
    if (aime <= bp1) {
      pia = aime * 0.9;
    } else if (aime <= bp2) {
      pia = bp1 * 0.9 + (aime - bp1) * 0.32;
    } else {
      pia = bp1 * 0.9 + (bp2 - bp1) * 0.32 + (aime - bp2) * 0.15;
    }

    const earlyReduction = 1 - (67 - 62) * 0.00556 * 12 / 5;
    const earlyBenefit = pia * (1 - 0.30);
    const fullBenefit = pia;
    const delayedBenefit = pia * (1 + 0.24);

    const earlyAnnual = earlyBenefit * 12;
    const fullAnnual = fullBenefit * 12;
    const delayedAnnual = delayedBenefit * 12;

    const earlyLifetime = earlyAnnual * (85 - 62);
    const fullLifetime = fullAnnual * (85 - 67);
    const delayedLifetime = delayedAnnual * (85 - 70);

    setResult({
      aime,
      pia,
      earlyBenefit,
      fullBenefit,
      delayedBenefit,
      earlyAnnual,
      fullAnnual,
      delayedAnnual,
      earlyLifetime,
      fullLifetime,
      delayedLifetime,
    });
  }

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);
  const fmtExact = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/social-security-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/social-security-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Social Security Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Estimate your monthly Social Security retirement benefits based on your average income. Compare benefits at early (62), full (67), and delayed (70) retirement ages.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                className="input-field"
                placeholder="e.g., 40"
                min="22"
                max="69"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Average Annual Income ({currency.symbol})</label>
              <input
                type="number"
                value={avgAnnualIncome}
                onChange={(e) => setAvgAnnualIncome(e.target.value)}
                className="input-field"
                placeholder="e.g., 65000"
              />
              <p className="text-xs text-[var(--muted)] mt-1">Average of your highest 35 years of earnings</p>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Estimate Benefits
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Age 62 (Early)</p>
                <p className="text-2xl font-bold text-orange-600">{fmtExact(result.earlyBenefit)}</p>
                <p className="text-xs text-[var(--muted)]">per month</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Age 67 (Full)</p>
                <p className="text-2xl font-bold text-green-700">{fmtExact(result.fullBenefit)}</p>
                <p className="text-xs text-[var(--muted)]">per month</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Age 70 (Delayed)</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmtExact(result.delayedBenefit)}</p>
                <p className="text-xs text-[var(--muted)]">per month</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Benefit Comparison</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Filing Age</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Monthly Benefit</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annual Benefit</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Lifetime (to 85)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Age 62 (Early)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-orange-600">{fmtExact(result.earlyBenefit)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.earlyAnnual)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.earlyLifetime)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Age 67 (Full Retirement)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-green-700">{fmtExact(result.fullBenefit)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.fullAnnual)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.fullLifetime)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Age 70 (Delayed)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-[var(--primary)]">{fmtExact(result.delayedBenefit)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.delayedAnnual)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.delayedLifetime)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Benefit Calculation Details</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Average Indexed Monthly Earnings (AIME)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.aime)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Primary Insurance Amount (PIA)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.pia)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Early Filing Reduction (Age 62)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-red-600">-30%</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Delayed Retirement Credits (Age 70)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-green-700">+24%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does the Social Security Calculator Work?</h2>
          <p>
            This calculator estimates your Social Security retirement benefits using the SSA&apos;s benefit formula.
            It calculates your Average Indexed Monthly Earnings (AIME) from your average annual income, then applies
            the bend-point formula to determine your Primary Insurance Amount (PIA).
          </p>

          <h2>The Social Security Benefit Formula</h2>
          <p>The PIA is calculated using three &quot;bend points&quot;:</p>
          <ul>
            <li><strong>90%</strong> of the first $1,115 of AIME</li>
            <li><strong>32%</strong> of AIME between $1,115 and $6,721</li>
            <li><strong>15%</strong> of AIME above $6,721</li>
          </ul>

          <h2>When Should I Start Collecting Social Security?</h2>
          <p>
            You can start collecting Social Security as early as age 62, but your benefit will be permanently reduced
            by up to 30%. Waiting until your full retirement age (67 for most people) gives you 100% of your benefit.
            Delaying until age 70 earns you an extra 8% per year in delayed retirement credits, for a total of 24% more.
          </p>

          <h3>Early vs. Delayed Retirement</h3>
          <ul>
            <li><strong>Age 62:</strong> 30% reduction in monthly benefit, but more years of payments</li>
            <li><strong>Age 67:</strong> Full benefit amount (Primary Insurance Amount)</li>
            <li><strong>Age 70:</strong> 24% increase in monthly benefit, maximum possible amount</li>
          </ul>

          <h3>Factors That Affect Your Benefits</h3>
          <ul>
            <li>Your highest 35 years of earnings determine your benefit amount</li>
            <li>The Social Security taxable maximum ($168,600 in 2024) caps counted earnings</li>
            <li>Cost-of-living adjustments (COLAs) increase benefits annually</li>
            <li>Working while collecting early benefits may temporarily reduce payments</li>
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
            name: "Social Security Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/social-security-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
