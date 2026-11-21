"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Ireland USC & Income Tax Calculator 2024",
  description:
    "Free Ireland USC calculator with income tax and PRSI. Calculate Universal Social Charge, PAYE income tax, total deductions, net pay, and effective tax rate for Irish salaries.",
  keywords:
    "USC calculator Ireland, income tax calculator Ireland, PAYE calculator, Ireland tax calculator 2024, Universal Social Charge, PRSI calculator, Irish salary calculator",
};

interface TaxResult {
  gross: number;
  usc: number;
  uscBands: { label: string; rate: number; taxable: number; tax: number }[];
  incomeTax: number;
  incomeTaxBands: { label: string; rate: number; taxable: number; tax: number }[];
  prsi: number;
  totalDeductions: number;
  netPay: number;
  effectiveRate: number;
}

export default function IrelandUSCCalculatorPage() {
  const [salary, setSalary] = useState<string>("50000");
  const [result, setResult] = useState<TaxResult | null>(null);

  function calculate() {
    const gross = parseFloat(salary);
    if (!gross || gross <= 0) return;

    // USC 2024 bands
    const uscBands = [
      { label: "First \u20AC12,012", rate: 0.5, from: 0, to: 12012 },
      { label: "\u20AC12,012 - \u20AC25,760", rate: 2, from: 12012, to: 25760 },
      { label: "\u20AC25,760 - \u20AC70,044", rate: 4, from: 25760, to: 70044 },
      { label: "Above \u20AC70,044", rate: 8, from: 70044, to: Infinity },
    ];

    let usc = 0;
    const uscBreakdown = uscBands.map((band) => {
      const taxable = Math.max(0, Math.min(gross, band.to) - band.from);
      const tax = taxable * (band.rate / 100);
      usc += tax;
      return { label: band.label, rate: band.rate, taxable, tax };
    });

    // Income Tax 2024
    const incomeTaxBands = [
      { label: "First \u20AC42,000 @ 20%", rate: 20, from: 0, to: 42000 },
      { label: "Above \u20AC42,000 @ 40%", rate: 40, from: 42000, to: Infinity },
    ];

    let incomeTax = 0;
    const itBreakdown = incomeTaxBands.map((band) => {
      const taxable = Math.max(0, Math.min(gross, band.to) - band.from);
      const tax = taxable * (band.rate / 100);
      incomeTax += tax;
      return { label: band.label, rate: band.rate, taxable, tax };
    });

    // PRSI 4%
    const prsi = gross * 0.04;

    const totalDeductions = usc + incomeTax + prsi;
    const netPay = gross - totalDeductions;
    const effectiveRate = gross > 0 ? (totalDeductions / gross) * 100 : 0;

    setResult({
      gross,
      usc,
      uscBands: uscBreakdown,
      incomeTax,
      incomeTaxBands: itBreakdown,
      prsi,
      totalDeductions,
      netPay,
      effectiveRate,
    });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/ireland-usc-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/ireland-usc-calculator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Ireland USC & Income Tax Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your Irish Universal Social Charge (USC), income tax (PAYE), and PRSI contributions using 2024 rates. See a full breakdown of deductions, net pay, and effective tax rate.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Annual Salary (&euro;)</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="input-field"
                placeholder="e.g., 50000"
                min="0"
              />
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Tax
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Deductions</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.totalDeductions)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Net Pay</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.netPay)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Effective Rate</p>
                <p className="text-2xl font-bold">{result.effectiveRate.toFixed(2)}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">USC</p>
                <p className="text-xl font-bold">{fmt(result.usc)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Income Tax</p>
                <p className="text-xl font-bold">{fmt(result.incomeTax)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">PRSI (4%)</p>
                <p className="text-xl font-bold">{fmt(result.prsi)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">USC Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Band</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Rate</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Taxable Amount</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">USC Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.uscBands.filter(b => b.taxable > 0).map((band, i) => (
                      <tr key={i} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{band.label}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{band.rate}%</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(band.taxable)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(band.tax)}</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50">
                      <td colSpan={3} className="border border-[var(--card-border)] px-3 py-2 font-bold">Total USC</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(result.usc)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Income Tax Breakdown</h2>
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
                    {result.incomeTaxBands.filter(b => b.taxable > 0).map((band, i) => (
                      <tr key={i} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{band.label}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{band.rate}%</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(band.taxable)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(band.tax)}</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50">
                      <td colSpan={3} className="border border-[var(--card-border)] px-3 py-2 font-bold">Total Income Tax</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(result.incomeTax)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Annual Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Gross Salary</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.gross)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">USC</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmt(result.usc)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Income Tax (PAYE)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmt(result.incomeTax)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">PRSI (4%)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmt(result.prsi)}</td>
                    </tr>
                    <tr className="bg-blue-50 font-bold">
                      <td className="border border-[var(--card-border)] px-3 py-2">Total Deductions</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmt(result.totalDeductions)}</td>
                    </tr>
                    <tr className="bg-green-50 font-bold">
                      <td className="border border-[var(--card-border)] px-3 py-2">Net Pay (Annual)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(result.netPay)}</td>
                    </tr>
                    <tr className="bg-green-50 font-bold">
                      <td className="border border-[var(--card-border)] px-3 py-2">Net Pay (Monthly)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(result.netPay / 12)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is the Universal Social Charge (USC) in Ireland?</h2>
          <p>
            The Universal Social Charge (USC) is a tax on income that replaced the previous income levy and health levy in Ireland.
            It was introduced in January 2011 as part of the government&apos;s fiscal reforms following the financial crisis. The USC applies
            to all gross income before pension contributions and is charged at progressive rates. This USC calculator Ireland tool
            uses the official 2024 rates to give you an accurate breakdown of your USC liability.
          </p>

          <h2>2024 USC Rates in Ireland</h2>
          <p>
            The USC is calculated on a band system similar to income tax. For 2024, the Universal Social Charge rates are:
          </p>
          <ul>
            <li><strong>0.5%</strong> on the first &euro;12,012 of income</li>
            <li><strong>2%</strong> on income from &euro;12,012 to &euro;25,760</li>
            <li><strong>4%</strong> on income from &euro;25,760 to &euro;70,044</li>
            <li><strong>8%</strong> on income above &euro;70,044</li>
          </ul>
          <p>
            Individuals with total income of &euro;13,000 or less are exempt from USC. Medical card holders and those aged 70 and over
            with income under &euro;60,000 may qualify for reduced rates.
          </p>

          <h2>How Does Irish Income Tax Work?</h2>
          <p>
            Ireland operates a progressive income tax system with two rates. For single individuals in 2024, the standard rate of 20%
            applies to the first &euro;42,000 of taxable income. Income above this threshold is taxed at the higher rate of 40%. This
            income tax calculator Ireland feature provides a clear band-by-band breakdown so you can see exactly how much income tax
            you owe at each rate.
          </p>
          <p>
            Married couples and civil partners may have different standard rate cut-off points depending on whether one or both partners
            are earning. The cut-off point for a couple with one income is &euro;51,000, while two-income couples can have up to &euro;84,000
            at the standard rate.
          </p>

          <h2>What Is PRSI?</h2>
          <p>
            Pay Related Social Insurance (PRSI) is a social insurance contribution that funds benefits such as the State Pension,
            Jobseeker&apos;s Benefit, Illness Benefit, and Maternity Benefit. Most employees pay Class A PRSI at a rate of 4% on all
            earnings. Employers also contribute an additional amount. This PAYE calculator includes PRSI in the total deductions
            to give you an accurate picture of your take-home pay.
          </p>

          <h2>How to Use This Irish Tax Calculator</h2>
          <p>
            Enter your gross annual salary in euros and click &ldquo;Calculate Tax.&rdquo; The calculator will instantly show your USC
            breakdown by band, income tax at both the 20% and 40% rates, PRSI contributions, total deductions, annual and monthly
            net pay, and your overall effective tax rate. This tool is designed for single PAYE employees and provides a simplified
            estimate. For more complex situations involving tax credits, additional income, or pension contributions, consult a
            qualified tax advisor or use Revenue&apos;s online services.
          </p>

          <h2>Tips for Reducing Your Irish Tax Bill</h2>
          <p>
            There are several legitimate ways to reduce your tax liability in Ireland. Contributing to an approved pension scheme
            reduces your taxable income for income tax purposes (though not for USC). Tax credits such as the Personal Tax Credit
            (&euro;1,875 for 2024), Employee Tax Credit (&euro;1,875), and various other credits can significantly reduce your tax bill.
            Additionally, expenses such as medical expenses, tuition fees, and certain work-from-home costs may qualify for tax relief.
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
            name: "Ireland USC & Income Tax Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/ireland-usc-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
