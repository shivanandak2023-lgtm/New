"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Singapore CPF Calculator",
  description:
    "Free Singapore CPF contribution calculator. Calculate employee and employer CPF contributions, OA/SA/MA allocation, and take-home pay based on age group and salary.",
  keywords:
    "CPF calculator Singapore, CPF contribution calculator, Singapore CPF rates, CPF contribution rates 2024, CPF OA SA MA, CPF employer employee, Singapore salary calculator",
};

type AgeGroup = "55below" | "55to60" | "60to65" | "65to70" | "above70";

interface CPFRates {
  employee: number;
  employer: number;
  oa: number;
  sa: number;
  ma: number;
  label: string;
}

const cpfRates: Record<AgeGroup, CPFRates> = {
  "55below": { employee: 20, employer: 17, oa: 23, sa: 6, ma: 8, label: "55 and below" },
  "55to60": { employee: 15, employer: 15, oa: 16.42, sa: 4.39, ma: 9.19, label: "Above 55 to 60" },
  "60to65": { employee: 9.5, employer: 11.5, oa: 10.33, sa: 2.98, ma: 7.19, label: "Above 60 to 65" },
  "65to70": { employee: 7, employer: 9, oa: 4.17, sa: 2.63, ma: 9.2, label: "Above 65 to 70" },
  "above70": { employee: 5, employer: 7.5, oa: 1.5, sa: 1, ma: 10, label: "Above 70" },
};

export default function SingaporeCPFCalculatorPage() {
  const [salary, setSalary] = useState<string>("5000");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("55below");
  const [result, setResult] = useState<{
    monthlySalary: number;
    employeeContribution: number;
    employerContribution: number;
    totalCPF: number;
    takeHome: number;
    oaAmount: number;
    saAmount: number;
    maAmount: number;
    rates: CPFRates;
  } | null>(null);

  function calculate() {
    const monthlySalary = parseFloat(salary);
    if (!monthlySalary || monthlySalary <= 0) return;

    const rates = cpfRates[ageGroup];

    const employeeContribution = monthlySalary * (rates.employee / 100);
    const employerContribution = monthlySalary * (rates.employer / 100);
    const totalCPF = employeeContribution + employerContribution;
    const takeHome = monthlySalary - employeeContribution;

    // Allocate total CPF into OA, SA, MA based on age-group percentages
    const totalRate = rates.oa + rates.sa + rates.ma;
    const oaAmount = totalCPF * (rates.oa / totalRate);
    const saAmount = totalCPF * (rates.sa / totalRate);
    const maAmount = totalCPF * (rates.ma / totalRate);

    setResult({
      monthlySalary,
      employeeContribution,
      employerContribution,
      totalCPF,
      takeHome,
      oaAmount,
      saAmount,
      maAmount,
      rates,
    });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-SG", {
      style: "currency",
      currency: "SGD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/singapore-cpf-calculator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${SITE_URL}/tools/singapore-cpf-calculator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Singapore CPF Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your Central Provident Fund (CPF) contributions based on monthly salary and age group.
          See employee and employer shares, OA/SA/MA allocation, and take-home pay.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Salary (S$)</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="input-field"
                placeholder="e.g., 5000"
                min="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Age Group</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                className="input-field"
              >
                <option value="55below">55 and below</option>
                <option value="55to60">Above 55 to 60</option>
                <option value="60to65">Above 60 to 65</option>
                <option value="65to70">Above 65 to 70</option>
                <option value="above70">Above 70</option>
              </select>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate CPF
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Take-Home Pay</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmt(result.takeHome)}</p>
                <p className="text-xs text-[var(--muted)]">per month</p>
              </div>
              <div className="result-card text-center" style={{ background: "#ecfdf5", borderColor: "#6ee7b7" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Employee CPF</p>
                <p className="text-xl font-bold text-green-700">{fmt(result.employeeContribution)}</p>
                <p className="text-xs text-[var(--muted)]">{result.rates.employee}% of salary</p>
              </div>
              <div className="result-card text-center" style={{ background: "#eff6ff", borderColor: "#93c5fd" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Employer CPF</p>
                <p className="text-xl font-bold text-blue-700">{fmt(result.employerContribution)}</p>
                <p className="text-xs text-[var(--muted)]">{result.rates.employer}% of salary</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total CPF</p>
                <p className="text-xl font-bold">{fmt(result.totalCPF)}</p>
                <p className="text-xs text-[var(--muted)]">{result.rates.employee + result.rates.employer}% combined</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">CPF Account Allocation</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Account</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Rate</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Monthly</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Ordinary Account (OA)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{result.rates.oa}%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.oaAmount)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.oaAmount * 12)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Special Account (SA)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{result.rates.sa}%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.saAmount)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.saAmount * 12)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Medisave Account (MA)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{result.rates.ma}%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.maAmount)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.maAmount * 12)}</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Total CPF</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold">{result.rates.employee + result.rates.employer}%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(result.totalCPF)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold">{fmt(result.totalCPF * 12)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Monthly Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Gross Monthly Salary</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.monthlySalary)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">Employee CPF Deduction ({result.rates.employee}%)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-red-600">-{fmt(result.employeeContribution)}</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Take-Home Pay</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmt(result.takeHome)}</td>
                    </tr>
                    <tr className="bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Employer CPF Contribution ({result.rates.employer}%)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.employerContribution)}</td>
                    </tr>
                    <tr className="bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Total Cost to Employer</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.monthlySalary + result.employerContribution)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CPF Rates Reference */}
            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">CPF Contribution Rates by Age Group</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Age Group</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Employee</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Employer</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(cpfRates).map(([key, rates]) => (
                      <tr key={key} className={key === ageGroup ? "bg-blue-50" : "hover:bg-[var(--muted-bg)]"}>
                        <td className={`border border-[var(--card-border)] px-3 py-2 ${key === ageGroup ? "font-bold" : ""}`}>{rates.label}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{rates.employee}%</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{rates.employer}%</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{rates.employee + rates.employer}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is CPF (Central Provident Fund)?</h2>
          <p>
            The Central Provident Fund (CPF) is Singapore&rsquo;s mandatory social security savings scheme. Established in 1955,
            CPF is funded by contributions from both employees and employers. The scheme helps Singapore citizens and permanent
            residents save for retirement, healthcare, and housing. The CPF Board administers the fund under the Ministry of
            Manpower. CPF contributions are mandatory for all employees earning more than S$50 per month, with rates varying
            based on the employee&rsquo;s age and wage level.
          </p>

          <h2>CPF Contribution Rates for 2024</h2>
          <p>
            For employees aged 55 and below, the CPF contribution rate is 37% of monthly wages — 20% from the employee and 17%
            from the employer. These rates apply to wages up to the CPF monthly salary ceiling. Rates decrease progressively as
            employees age: 30% total for ages 55-60, 21% for ages 60-65, 16% for ages 65-70, and 12.5% for those above 70.
            The graduated rates help older workers maintain take-home pay while still building their retirement savings.
          </p>

          <h2>Three CPF Accounts Explained</h2>
          <h3>Ordinary Account (OA)</h3>
          <p>
            The Ordinary Account receives the largest share of CPF contributions for younger workers. OA savings can be used for
            housing purchases (HDB flats and private property), CPF investment scheme, education, and insurance. For employees
            aged 55 and below, approximately 23% of total wages goes to the OA. The OA earns a minimum interest of 2.5% per annum.
          </p>

          <h3>Special Account (SA)</h3>
          <p>
            The Special Account is designated primarily for retirement savings and investment in retirement-related financial
            products. SA funds cannot be used for housing. The SA earns a higher interest rate of at least 4% per annum, making
            it an effective long-term savings vehicle. At age 55, SA savings are transferred to the Retirement Account (RA).
          </p>

          <h3>Medisave Account (MA)</h3>
          <p>
            The Medisave Account is used for healthcare expenses, including hospital bills, approved outpatient treatments,
            MediShield Life premiums, and Integrated Shield Plan premiums. The MA earns at least 4% per annum. As workers age,
            a larger proportion of CPF contributions is allocated to Medisave to help cover increasing healthcare costs.
          </p>

          <h2>CPF Monthly Salary Ceiling</h2>
          <p>
            CPF contributions are calculated on ordinary wages up to the CPF monthly salary ceiling. The ceiling is being
            progressively increased and applies to the ordinary wage component. Additional wages such as bonuses are subject
            to a separate annual ceiling. Employees earning above the salary ceiling pay CPF only on the capped amount,
            which affects the total contribution amounts.
          </p>

          <h2>How to Use This CPF Calculator</h2>
          <p>
            Enter your monthly gross salary in Singapore dollars and select your age group. The calculator instantly shows your
            employee CPF deduction, employer contribution, total CPF, take-home pay, and the breakdown across OA, SA, and MA
            accounts. This tool is useful for salary planning, understanding your CPF savings rate, and estimating the total
            cost of employment for employers in Singapore.
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
            name: "Singapore CPF Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/singapore-cpf-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "SGD" },
          }),
        }}
      />
    </>
  );
}
