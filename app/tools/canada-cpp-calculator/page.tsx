"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "CPP Calculator Canada - Canada Pension Plan Calculator 2024",
  description:
    "Free Canada Pension Plan (CPP) calculator. Calculate your CPP contributions and estimate monthly retirement benefits at age 60, 65, and 70 with 2024 rates.",
  keywords: "CPP calculator Canada, Canada Pension Plan calculator, CPP contribution, CPP retirement benefit, CPP at 60 65 70",
};

const CPP = {
  basicExemption: 3500,
  maxPensionableEarnings: 68500,
  employeeRate: 0.0595,
  maxEmployeeContribution: 3867.50,
  maxMonthlyBenefitAt65: 1364.60,
  earlyReductionPerMonth: 0.006, // 0.6% per month before 65 (36% at 60)
  lateIncreasePerMonth: 0.007, // 0.7% per month after 65 (42% at 70)
  maxContributionYears: 39,
};

export default function CanadaCPPCalculatorPage() {
  const [income, setIncome] = useState<string>("60000");
  const [age, setAge] = useState<string>("35");
  const [yearsContributed, setYearsContributed] = useState<string>("10");
  const [result, setResult] = useState<{
    pensionableEarnings: number;
    annualContribution: number;
    monthlyContribution: number;
    projectedYears: number;
    benefitAt60: number;
    benefitAt65: number;
    benefitAt70: number;
    contributionPercentage: number;
  } | null>(null);

  function calculate() {
    const annualIncome = parseFloat(income);
    const currentAge = parseInt(age);
    const years = parseInt(yearsContributed);
    if (!annualIncome || annualIncome <= 0 || !currentAge || !years) return;

    // Calculate pensionable earnings
    const pensionableEarnings = Math.min(annualIncome, CPP.maxPensionableEarnings) - CPP.basicExemption;
    const cappedEarnings = Math.max(0, pensionableEarnings);

    // Calculate contribution
    const annualContribution = Math.min(cappedEarnings * CPP.employeeRate, CPP.maxEmployeeContribution);
    const monthlyContribution = annualContribution / 12;

    // Estimate contribution percentage relative to max
    const currentContributionRatio = cappedEarnings / (CPP.maxPensionableEarnings - CPP.basicExemption);
    const cappedRatio = Math.min(1, currentContributionRatio);

    // Projected total contribution years by age 65
    const yearsTo65 = Math.max(0, 65 - currentAge);
    const projectedYears = Math.min(CPP.maxContributionYears, years + yearsTo65);
    const yearsFraction = projectedYears / CPP.maxContributionYears;

    // Benefit estimate at 65 based on earnings ratio and years
    const benefitAt65 = CPP.maxMonthlyBenefitAt65 * cappedRatio * yearsFraction;

    // Early (60) and late (70) adjustments
    const earlyMonths = 5 * 12; // 60 months early
    const lateMonths = 5 * 12; // 60 months late
    const benefitAt60 = benefitAt65 * (1 - CPP.earlyReductionPerMonth * earlyMonths);
    const benefitAt70 = benefitAt65 * (1 + CPP.lateIncreasePerMonth * lateMonths);

    setResult({
      pensionableEarnings: cappedEarnings,
      annualContribution,
      monthlyContribution,
      projectedYears,
      benefitAt60,
      benefitAt65,
      benefitAt70,
      contributionPercentage: cappedRatio * 100,
    });
  }

  const fmtCAD = (n: number) => `C$${n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/canada-cpp-calculator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">CPP Calculator (Canada Pension Plan)</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your CPP contributions and estimate monthly retirement benefits at age 60, 65, and 70.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Annual Employment Income (C$)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="input-field"
                placeholder="Enter annual income"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Current Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="input-field"
                placeholder="Enter your age"
                min="18"
                max="70"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Years of CPP Contribution</label>
              <input
                type="number"
                value={yearsContributed}
                onChange={(e) => setYearsContributed(e.target.value)}
                className="input-field"
                placeholder="Years contributed"
                min="0"
                max="39"
              />
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate CPP
          </button>
        </div>

        {result && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="result-card">
                <p className="text-sm text-[var(--muted)] mb-1">Pensionable Earnings</p>
                <p className="text-xl font-bold">{fmtCAD(result.pensionableEarnings)}</p>
              </div>
              <div className="result-card" style={{ background: "#fef3c7", borderColor: "#fde68a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Annual CPP Contribution (Employee)</p>
                <p className="text-xl font-bold text-amber-700">{fmtCAD(result.annualContribution)}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{fmtCAD(result.monthlyContribution)}/month</p>
              </div>
              <div className="result-card">
                <p className="text-sm text-[var(--muted)] mb-1">Earnings as % of Maximum</p>
                <p className="text-xl font-bold">{result.contributionPercentage.toFixed(1)}%</p>
              </div>
              <div className="result-card">
                <p className="text-sm text-[var(--muted)] mb-1">Projected Contribution Years (by 65)</p>
                <p className="text-xl font-bold">{result.projectedYears} years</p>
              </div>
            </div>

            <div className="tool-card mb-8">
              <h3 className="text-lg font-bold mb-4">Estimated Monthly CPP Retirement Benefit</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--card-border)]">
                      <th className="text-left py-3 pr-4">Retirement Age</th>
                      <th className="text-left py-3 pr-4">Adjustment</th>
                      <th className="text-right py-3 pr-4">Monthly Benefit</th>
                      <th className="text-right py-3">Annual Benefit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--card-border)]">
                      <td className="py-3 pr-4 font-medium">Age 60</td>
                      <td className="py-3 pr-4 text-red-600">-36.0% (early)</td>
                      <td className="py-3 pr-4 text-right font-medium">{fmtCAD(result.benefitAt60)}</td>
                      <td className="py-3 text-right">{fmtCAD(result.benefitAt60 * 12)}</td>
                    </tr>
                    <tr className="border-b border-[var(--card-border)] bg-blue-50/50">
                      <td className="py-3 pr-4 font-bold">Age 65 (Standard)</td>
                      <td className="py-3 pr-4">No adjustment</td>
                      <td className="py-3 pr-4 text-right font-bold text-[var(--primary)]">{fmtCAD(result.benefitAt65)}</td>
                      <td className="py-3 text-right font-bold">{fmtCAD(result.benefitAt65 * 12)}</td>
                    </tr>
                    <tr className="border-b border-[var(--card-border)]">
                      <td className="py-3 pr-4 font-medium">Age 70</td>
                      <td className="py-3 pr-4 text-green-600">+42.0% (delayed)</td>
                      <td className="py-3 pr-4 text-right font-medium">{fmtCAD(result.benefitAt70)}</td>
                      <td className="py-3 text-right">{fmtCAD(result.benefitAt70 * 12)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[var(--muted)] mt-3">
                * Estimates based on current income level and projected contribution years. Actual benefits depend on your complete earnings history.
                Maximum monthly CPP at age 65 (2024): {fmtCAD(CPP.maxMonthlyBenefitAt65)}.
              </p>
            </div>
          </>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is the Canada Pension Plan (CPP)?</h2>
          <p>
            The Canada Pension Plan (CPP) is a contributory, earnings-related social insurance program that provides
            retirement pensions, disability benefits, and survivor benefits to eligible Canadians. Almost all employed
            and self-employed individuals in Canada outside Quebec contribute to CPP.
          </p>

          <h2>2024 CPP Contribution Rates</h2>
          <ul>
            <li><strong>Employee contribution rate:</strong> 5.95% of pensionable earnings</li>
            <li><strong>Basic exemption amount:</strong> C$3,500</li>
            <li><strong>Maximum pensionable earnings:</strong> C$68,500</li>
            <li><strong>Maximum annual employee contribution:</strong> C$3,867.50</li>
          </ul>
          <p>
            Employers match the employee contribution. Self-employed individuals pay both the employee and employer
            portions (11.90% total).
          </p>

          <h2>When to Start Receiving CPP</h2>
          <p>
            You can start receiving CPP as early as age 60 or as late as age 70. The standard age is 65. Starting
            early reduces your benefit by 0.6% for each month before 65 (36% reduction at 60). Delaying increases
            your benefit by 0.7% for each month after 65 (42% increase at 70).
          </p>

          <h3>Early vs. Delayed Benefits</h3>
          <p>
            <strong>Starting at 60:</strong> You receive payments for 5 extra years, but each payment is 36% smaller.
            This may be advantageous if you need income sooner or have a shorter life expectancy.
          </p>
          <p>
            <strong>Starting at 70:</strong> You miss 5 years of payments, but each payment is 42% larger. This can
            result in more total income if you live past your mid-80s.
          </p>

          <h2>How Benefits Are Calculated</h2>
          <p>
            CPP retirement benefits are based on your average earnings throughout your working life, the contributions
            you made, and the age at which you start receiving benefits. The maximum monthly benefit at age 65 in 2024
            is C$1,364.60, though the average amount received is typically lower.
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
            name: "CPP Calculator Canada",
            description: META.description,
            url: `${SITE_URL}/tools/canada-cpp-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
