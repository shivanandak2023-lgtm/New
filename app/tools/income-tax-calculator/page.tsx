"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Income Tax Calculator India 2024-25 - Old & New Regime",
  description:
    "Free income tax calculator for India FY 2024-25. Calculate tax under old and new tax regime with slab-wise breakdown, cess, and take-home salary.",
  keywords:
    "income tax calculator, income tax calculator india, tax calculator 2024-25, new tax regime, old tax regime, income tax slab, tax calculation india, in-hand salary",
};

type Regime = "old" | "new";

interface SlabResult {
  from: number;
  to: number | null;
  rate: number;
  tax: number;
}

function calculateOldRegime(income: number, deductions: number): { slabs: SlabResult[]; totalTax: number; cess: number; netTax: number } {
  const taxableIncome = Math.max(0, income - deductions);
  const slabs: SlabResult[] = [];
  let remaining = taxableIncome;
  let totalTax = 0;

  const brackets = [
    { from: 0, to: 250000, rate: 0 },
    { from: 250000, to: 500000, rate: 5 },
    { from: 500000, to: 1000000, rate: 20 },
    { from: 1000000, to: null as number | null, rate: 30 },
  ];

  let consumed = 0;
  for (const bracket of brackets) {
    const slabWidth = bracket.to !== null ? bracket.to - bracket.from : Infinity;
    const taxable = Math.min(Math.max(0, remaining), slabWidth);
    const tax = taxable * (bracket.rate / 100);

    slabs.push({
      from: bracket.from,
      to: bracket.to,
      rate: bracket.rate,
      tax: Math.round(tax),
    });

    totalTax += tax;
    remaining -= taxable;
    consumed += taxable;
    if (remaining <= 0) break;
  }

  // Section 87A rebate (old regime) - up to 5L taxable income
  if (taxableIncome <= 500000) {
    totalTax = 0;
    slabs.forEach((s) => (s.tax = 0));
  }

  const cess = totalTax * 0.04;
  return { slabs, totalTax: Math.round(totalTax), cess: Math.round(cess), netTax: Math.round(totalTax + cess) };
}

function calculateNewRegime(income: number): { slabs: SlabResult[]; totalTax: number; cess: number; netTax: number } {
  // New regime FY 2024-25 (after Budget 2024)
  const standardDeduction = 75000;
  const taxableIncome = Math.max(0, income - standardDeduction);
  const slabs: SlabResult[] = [];
  let totalTax = 0;
  let remaining = taxableIncome;

  const brackets = [
    { from: 0, to: 300000, rate: 0 },
    { from: 300000, to: 700000, rate: 5 },
    { from: 700000, to: 1000000, rate: 10 },
    { from: 1000000, to: 1200000, rate: 15 },
    { from: 1200000, to: 1500000, rate: 20 },
    { from: 1500000, to: null as number | null, rate: 30 },
  ];

  for (const bracket of brackets) {
    const slabWidth = bracket.to !== null ? bracket.to - bracket.from : Infinity;
    const taxable = Math.min(Math.max(0, remaining), slabWidth);
    const tax = taxable * (bracket.rate / 100);

    slabs.push({
      from: bracket.from,
      to: bracket.to,
      rate: bracket.rate,
      tax: Math.round(tax),
    });

    totalTax += tax;
    remaining -= taxable;
    if (remaining <= 0) break;
  }

  // Section 87A rebate (new regime) - up to 7L taxable income
  if (taxableIncome <= 700000) {
    totalTax = 0;
    slabs.forEach((s) => (s.tax = 0));
  }

  const cess = totalTax * 0.04;
  return { slabs, totalTax: Math.round(totalTax), cess: Math.round(cess), netTax: Math.round(totalTax + cess) };
}

export default function IncomeTaxCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [income, setIncome] = useState<string>("1200000");
  const [regime, setRegime] = useState<Regime>("new");
  const [deductions80C, setDeductions80C] = useState<string>("150000");
  const [deductionsOther, setDeductionsOther] = useState<string>("50000");
  const [result, setResult] = useState<{
    regime: Regime;
    slabs: SlabResult[];
    totalTax: number;
    cess: number;
    netTax: number;
    inHand: number;
    effectiveRate: number;
  } | null>(null);

  function calculate() {
    const inc = parseFloat(income);
    if (!inc || inc <= 0) return;

    let res;
    if (regime === "old") {
      const totalDeductions = (parseFloat(deductions80C) || 0) + (parseFloat(deductionsOther) || 0) + 50000; // 50k standard deduction
      res = calculateOldRegime(inc, totalDeductions);
    } else {
      res = calculateNewRegime(inc);
    }

    setResult({
      regime,
      slabs: res.slabs,
      totalTax: res.totalTax,
      cess: res.cess,
      netTax: res.netTax,
      inHand: Math.round(inc - res.netTax),
      effectiveRate: inc > 0 ? Math.round((res.netTax / inc) * 10000) / 100 : 0,
    });
  }

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  const fmtSlab = (n: number | null) => (n === null ? "Above" : fmt(n));

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/income-tax-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Income Tax Calculator (India)</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your income tax for FY 2024-25 under both old and new tax regimes. See slab-wise breakdown, cess, and in-hand income.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Tax Regime</label>
            <div className="flex gap-2">
              <button
                onClick={() => setRegime("new")}
                className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                  regime === "new"
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
              >
                New Regime (Default)
              </button>
              <button
                onClick={() => setRegime("old")}
                className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                  regime === "old"
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
              >
                Old Regime
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={regime === "old" ? "" : "md:col-span-2"}>
              <label className="block text-sm font-medium mb-1">Annual Income ({currency.symbol})</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="input-field"
                placeholder="e.g., 1200000"
              />
            </div>

            {regime === "old" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Section 80C Deductions</label>
                  <input
                    type="number"
                    value={deductions80C}
                    onChange={(e) => setDeductions80C(e.target.value)}
                    className="input-field"
                    placeholder="Max 1,50,000"
                  />
                  <p className="text-xs text-[var(--muted)] mt-1">PF, PPF, ELSS, LIC, etc. (max 1.5L)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Other Deductions (80D, 80E, etc.)</label>
                  <input
                    type="number"
                    value={deductionsOther}
                    onChange={(e) => setDeductionsOther(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 50000"
                  />
                  <p className="text-xs text-[var(--muted)] mt-1">Health insurance, education loan, NPS, etc.</p>
                </div>
              </>
            )}
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Tax
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Tax</p>
                <p className="text-2xl font-bold text-red-600">{fmt(result.netTax)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">In-Hand Income</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.inHand)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Effective Tax Rate</p>
                <p className="text-2xl font-bold text-amber-700">{result.effectiveRate}%</p>
              </div>
            </div>

            <div className="tool-card overflow-x-auto">
              <h2 className="text-lg font-bold mb-4">
                Slab-wise Breakdown ({result.regime === "new" ? "New Regime" : "Old Regime"})
              </h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Income Slab</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-center">Rate</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {result.slabs.map((slab, idx) => (
                    <tr key={idx} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">
                        {fmt(slab.from)} - {slab.to === null ? "Above" : fmt(slab.to)}
                      </td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-center">{slab.rate}%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(slab.tax)}</td>
                    </tr>
                  ))}
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-semibold" colSpan={2}>Total Tax (before cess)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.totalTax)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2" colSpan={2}>Health &amp; Education Cess (4%)</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.cess)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold" colSpan={2}>Total Tax Payable</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(result.netTax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Income Tax Slabs for FY 2024-25 (AY 2025-26)</h2>
          <p>
            India has two income tax regimes: the <strong>Old Regime</strong> with deductions and exemptions, and the
            <strong> New Regime</strong> (default from FY 2023-24) with lower tax rates but fewer deductions.
          </p>

          <h2>New Tax Regime Slabs (FY 2024-25)</h2>
          <ul>
            <li>Up to 3,00,000 - Nil</li>
            <li>3,00,001 to 7,00,000 - 5%</li>
            <li>7,00,001 to 10,00,000 - 10%</li>
            <li>10,00,001 to 12,00,000 - 15%</li>
            <li>12,00,001 to 15,00,000 - 20%</li>
            <li>Above 15,00,000 - 30%</li>
          </ul>
          <p>Standard deduction of Rs. 75,000 is available. Rebate under Section 87A for taxable income up to Rs. 7,00,000.</p>

          <h2>Old Tax Regime Slabs (FY 2024-25)</h2>
          <ul>
            <li>Up to 2,50,000 - Nil</li>
            <li>2,50,001 to 5,00,000 - 5%</li>
            <li>5,00,001 to 10,00,000 - 20%</li>
            <li>Above 10,00,000 - 30%</li>
          </ul>

          <h2>Which Tax Regime is Better?</h2>
          <p>
            The new regime generally benefits individuals who do not have significant deductions. If you claim deductions
            under sections 80C, 80D, HRA, etc. totaling more than Rs. 3-4 lakh, the old regime might be more beneficial.
            Use this calculator to compare both regimes for your specific situation.
          </p>

          <h3>Key Deductions Under Old Regime</h3>
          <ul>
            <li><strong>Section 80C:</strong> Up to Rs. 1.5 lakh (PF, PPF, ELSS, LIC, NSC)</li>
            <li><strong>Section 80D:</strong> Health insurance premiums (up to Rs. 25,000 / Rs. 50,000 for senior citizens)</li>
            <li><strong>HRA:</strong> House Rent Allowance exemption for salaried individuals</li>
            <li><strong>Standard Deduction:</strong> Rs. 50,000 for salaried employees</li>
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
            name: "Income Tax Calculator India",
            description: META.description,
            url: `${SITE_URL}/tools/income-tax-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
