"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "UAE End of Service Gratuity Calculator",
  description:
    "Free UAE gratuity calculator. Calculate end of service benefits (EOSB) under UAE Labour Law for limited and unlimited contracts. Covers Dubai, Abu Dhabi, and all emirates.",
  keywords:
    "UAE gratuity calculator, end of service gratuity UAE, EOSB calculator Dubai, UAE end of service benefits, gratuity calculation UAE Labour Law, Dubai gratuity calculator",
};

type ContractType = "limited" | "unlimited";

export default function UAEGratuityCalculatorPage() {
  const [basicSalary, setBasicSalary] = useState<string>("10000");
  const [yearsOfService, setYearsOfService] = useState<string>("6");
  const [contractType, setContractType] = useState<ContractType>("unlimited");
  const [result, setResult] = useState<{
    gratuity: number;
    breakdown: { label: string; amount: number }[];
    capped: boolean;
    maxGratuity: number;
    dailyWage: number;
    yearsUsed: number;
  } | null>(null);

  function calculate() {
    const salary = parseFloat(basicSalary);
    const years = parseFloat(yearsOfService);
    if (!salary || salary <= 0 || !years || years <= 0) return;

    const dailyWage = salary / 30;
    let gratuity = 0;
    const breakdown: { label: string; amount: number }[] = [];

    // Calculate base gratuity (same for limited and unlimited)
    // First 5 years: 21 days per year
    // After 5 years: 30 days per year
    const firstFiveYears = Math.min(years, 5);
    const remainingYears = Math.max(0, years - 5);

    const firstFiveGratuity = firstFiveYears * 21 * dailyWage;
    const remainingGratuity = remainingYears * 30 * dailyWage;

    if (firstFiveYears > 0) {
      breakdown.push({
        label: `First ${firstFiveYears.toFixed(1)} year(s) x 21 days x ${dailyWage.toFixed(2)} AED/day`,
        amount: firstFiveGratuity,
      });
    }

    if (remainingYears > 0) {
      breakdown.push({
        label: `Next ${remainingYears.toFixed(1)} year(s) x 30 days x ${dailyWage.toFixed(2)} AED/day`,
        amount: remainingGratuity,
      });
    }

    let baseGratuity = firstFiveGratuity + remainingGratuity;

    if (contractType === "unlimited") {
      // Unlimited contract: prorated based on service
      // Less than 1 year: 0% (no gratuity)
      // 1 to 3 years: 1/3 of gratuity
      // 3 to 5 years: 2/3 of gratuity
      // 5+ years: full gratuity
      if (years < 1) {
        gratuity = 0;
        breakdown.push({ label: "Less than 1 year of service — no gratuity", amount: 0 });
      } else if (years < 3) {
        gratuity = baseGratuity * (1 / 3);
        breakdown.push({ label: "1-3 years service — 1/3 of base gratuity", amount: gratuity });
      } else if (years < 5) {
        gratuity = baseGratuity * (2 / 3);
        breakdown.push({ label: "3-5 years service — 2/3 of base gratuity", amount: gratuity });
      } else {
        gratuity = baseGratuity;
        breakdown.push({ label: "5+ years service — full gratuity", amount: gratuity });
      }
    } else {
      // Limited contract: full gratuity regardless of years (if completed)
      gratuity = baseGratuity;
    }

    // Cap at 2 years total salary
    const maxGratuity = salary * 24;
    const capped = gratuity > maxGratuity;
    if (capped) {
      gratuity = maxGratuity;
    }

    setResult({
      gratuity,
      breakdown,
      capped,
      maxGratuity,
      dailyWage,
      yearsUsed: years,
    });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-AE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/uae-gratuity-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${SITE_URL}/tools/uae-gratuity-calculator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">UAE End of Service Gratuity Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your end of service gratuity (EOSB) under UAE Labour Law. Enter your basic salary,
          years of service, and contract type to see your entitlement.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Basic Monthly Salary (AED)</label>
              <input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
                className="input-field"
                placeholder="e.g., 10000"
                min="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Years of Service</label>
              <input
                type="number"
                value={yearsOfService}
                onChange={(e) => setYearsOfService(e.target.value)}
                className="input-field"
                placeholder="e.g., 6"
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contract Type</label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value as ContractType)}
                className="input-field"
              >
                <option value="unlimited">Unlimited Contract</option>
                <option value="limited">Limited (Fixed-Term) Contract</option>
              </select>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Gratuity
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Gratuity</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.gratuity)} AED</p>
                {result.capped && (
                  <p className="text-xs text-red-600 mt-1">Capped at 2 years salary ({fmt(result.maxGratuity)} AED)</p>
                )}
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Daily Wage Used</p>
                <p className="text-xl font-bold">{fmt(result.dailyWage)} AED</p>
                <p className="text-xs text-[var(--muted)]">Basic salary / 30 days</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Calculation Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Component</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Amount (AED)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.breakdown.map((row, i) => (
                      <tr key={i} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{row.label}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">
                          {fmt(row.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Total Gratuity</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">
                        {fmt(result.gratuity)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Gratuity Rules Reference</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Base Gratuity Calculation</h3>
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      <tr className="bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">First 5 years</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">21 days/year</td>
                      </tr>
                      <tr>
                        <td className="border border-[var(--card-border)] px-3 py-2">After 5 years</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">30 days/year</td>
                      </tr>
                      <tr className="bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">Maximum</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">2 years salary</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Unlimited Contract Proration</h3>
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      <tr className="bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">&lt; 1 year</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">0% (none)</td>
                      </tr>
                      <tr>
                        <td className="border border-[var(--card-border)] px-3 py-2">1 &ndash; 3 years</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">1/3 of gratuity</td>
                      </tr>
                      <tr className="bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">3 &ndash; 5 years</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">2/3 of gratuity</td>
                      </tr>
                      <tr>
                        <td className="border border-[var(--card-border)] px-3 py-2">5+ years</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">Full gratuity</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is End of Service Gratuity in UAE?</h2>
          <p>
            End of Service Gratuity (EOSB) is a lump-sum payment that employers in the UAE are legally required to pay employees
            upon the termination of their employment contract. It is governed by Federal Decree-Law No. 33 of 2021 on the
            Regulation of Labour Relations (UAE Labour Law). The gratuity is calculated based on the employee&rsquo;s basic salary
            and total years of continuous service. It applies to all employees in the private sector across all emirates including
            Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.
          </p>

          <h2>How Is UAE Gratuity Calculated?</h2>
          <p>
            The gratuity calculation in the UAE follows a two-tier structure. For the first five years of service, the employee
            is entitled to 21 days of basic salary for each year of service. For each additional year beyond five years, the
            entitlement increases to 30 days of basic salary per year. The daily wage is calculated by dividing the monthly
            basic salary by 30. The total gratuity amount cannot exceed the equivalent of two years of the employee&rsquo;s
            total salary.
          </p>

          <h2>Limited vs. Unlimited Contracts</h2>
          <p>
            Under a limited (fixed-term) contract, the employee is entitled to the full gratuity amount regardless of who
            terminates the contract, provided they have completed at least one year of service. Under an unlimited contract,
            if the employee resigns, the gratuity is prorated: employees with 1-3 years of service receive one-third, those
            with 3-5 years receive two-thirds, and those with 5 or more years receive the full amount. Employees who are
            terminated by the employer receive the full gratuity under both contract types.
          </p>

          <h2>What Is Included in Basic Salary?</h2>
          <p>
            Gratuity is calculated on the basic salary only, not the total compensation package. Housing allowance, transportation
            allowance, bonuses, overtime pay, and other benefits are excluded from the calculation. This is an important
            distinction because many UAE employees receive a significant portion of their compensation as allowances. Only the
            base salary stated in the employment contract is used for gratuity purposes.
          </p>

          <h2>Gratuity for Partial Years</h2>
          <p>
            Employees who have served for more than one year are entitled to gratuity for partial years on a pro-rata basis.
            For example, if an employee has worked for 3 years and 6 months, the gratuity is calculated for the full 3.5 years.
            However, employees who have served less than one year under an unlimited contract are not entitled to any gratuity.
            The UAE Labour Law ensures that all qualifying employees receive fair compensation for their service upon leaving
            their employer.
          </p>

          <h2>EOSB Calculator for Dubai and All Emirates</h2>
          <p>
            This free UAE gratuity calculator applies to all seven emirates. Whether you work in Dubai, Abu Dhabi, or any other
            emirate, the gratuity rules are the same under federal law. Simply enter your basic monthly salary, total years
            of service, and contract type to get an instant estimate of your end of service benefits.
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
            name: "UAE End of Service Gratuity Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/uae-gratuity-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "AED" },
          }),
        }}
      />
    </>
  );
}
