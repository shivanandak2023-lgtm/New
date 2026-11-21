"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Child Tax Credit Calculator 2024 - CTC & Additional Child Tax Credit",
  description:
    "Free child tax credit calculator for 2024. Calculate your CTC amount, phase-out reduction, additional child tax credit (refundable), and per-child breakdown.",
  keywords:
    "child tax credit calculator, child tax credit 2024, CTC calculator, additional child tax credit, child tax credit phase out, child tax credit income limit, how much is child tax credit",
};

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const PHASE_OUT: Record<string, number> = {
  single: 200000,
  married: 400000,
  hoh: 200000,
};

const CTC_PER_CHILD = 2000;
const OTHER_DEPENDENT_CREDIT = 500;
const ACTC_MAX = 1700;
const PHASE_OUT_RATE = 50; // $50 per $1,000 over threshold

export default function ChildTaxCreditPage() {
  const [filingStatus, setFilingStatus] = useState("married");
  const [agi, setAgi] = useState("150000");
  const [childrenUnder17, setChildrenUnder17] = useState("2");
  const [otherDependents, setOtherDependents] = useState("0");

  const income = parseFloat(agi) || 0;
  const kids = parseInt(childrenUnder17) || 0;
  const others = parseInt(otherDependents) || 0;

  const threshold = PHASE_OUT[filingStatus] || 200000;

  // Total CTC before phase-out
  const totalCTC = kids * CTC_PER_CHILD;
  const totalOtherCredit = others * OTHER_DEPENDENT_CREDIT;
  const totalCreditBeforePhaseOut = totalCTC + totalOtherCredit;

  // Phase-out calculation
  const excessIncome = Math.max(0, income - threshold);
  const phaseOutReduction = Math.ceil(excessIncome / 1000) * PHASE_OUT_RATE;
  const netCredit = Math.max(0, totalCreditBeforePhaseOut - phaseOutReduction);

  // CTC portion vs other dependent portion (phase-out applies proportionally)
  const ctcPortion = totalCreditBeforePhaseOut > 0 ? (totalCTC / totalCreditBeforePhaseOut) * netCredit : 0;
  const otherPortion = netCredit - ctcPortion;

  // Additional Child Tax Credit (refundable portion)
  // Up to $1,700 per child is refundable if CTC exceeds tax liability
  const maxRefundable = Math.min(ctcPortion, kids * ACTC_MAX);

  // Per-child breakdown
  const perChildCredit = kids > 0 ? ctcPortion / kids : 0;

  const isPhaseOutActive = excessIncome > 0;
  const isFullyPhasedOut = netCredit <= 0;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/us-child-tax-credit`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="/tools/us-child-tax-credit" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Child Tax Credit Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your 2024 Child Tax Credit (CTC), including phase-out reductions and the Additional Child Tax Credit refundable portion.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Filing Status</label>
              <select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)} className="input-field">
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
                <option value="hoh">Head of Household</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Adjusted Gross Income ($)</label>
              <input type="number" value={agi} onChange={(e) => setAgi(e.target.value)} className="input-field" placeholder="150000" />
              <p className="text-xs text-[var(--muted)] mt-1">Phase-out starts at {fmt(threshold)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Children Under 17</label>
              <input type="number" value={childrenUnder17} onChange={(e) => setChildrenUnder17(e.target.value)} className="input-field" min="0" max="20" />
              <p className="text-xs text-[var(--muted)] mt-1">$2,000 credit per qualifying child</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Other Dependents (17+)</label>
              <input type="number" value={otherDependents} onChange={(e) => setOtherDependents(e.target.value)} className="input-field" min="0" max="20" />
              <p className="text-xs text-[var(--muted)] mt-1">$500 credit per other dependent</p>
            </div>
          </div>
        </div>

        {(kids > 0 || others > 0) && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Tax Credit</p>
                <p className="text-2xl font-bold text-green-700">{fmt(netCredit)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Phase-Out Reduction</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{isPhaseOutActive ? `-${fmt(phaseOutReduction)}` : "$0"}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Max Refundable (ACTC)</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(Math.round(maxRefundable))}</p>
              </div>
            </div>

            {isFullyPhasedOut && (
              <div className="result-card mb-6" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
                <p className="text-sm text-red-700 font-medium">
                  Your income of {fmt(income)} exceeds the phase-out threshold of {fmt(threshold)} by {fmt(excessIncome)}.
                  Your Child Tax Credit has been fully phased out.
                </p>
              </div>
            )}

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Credit Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Component</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {kids > 0 && (
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Child Tax Credit ({kids} child{kids > 1 ? "ren" : ""} x $2,000)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(totalCTC)}</td>
                    </tr>
                  )}
                  {others > 0 && (
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Other Dependent Credit ({others} dependent{others > 1 ? "s" : ""} x $500)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(totalOtherCredit)}</td>
                    </tr>
                  )}
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Total Before Phase-Out</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-medium">{fmt(totalCreditBeforePhaseOut)}</td>
                  </tr>
                  {isPhaseOutActive && (
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 text-red-600">Phase-Out Reduction ({fmt(excessIncome)} over threshold)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-red-600">-{fmt(phaseOutReduction)}</td>
                    </tr>
                  )}
                  <tr className="bg-green-50 font-bold">
                    <td className="border border-[var(--card-border)] px-3 py-2">Net Tax Credit</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">{fmt(netCredit)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {kids > 0 && !isFullyPhasedOut && (
              <div className="tool-card mb-6">
                <h2 className="text-lg font-bold mb-4">Per-Child Breakdown</h2>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Child</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Credit Amount</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Refundable (ACTC)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: kids }, (_, i) => (
                      <tr key={i} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">Child {i + 1}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(Math.round(perChildCredit))}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(Math.round(Math.min(perChildCredit, ACTC_MAX)))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="result-card mb-6" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
              <h3 className="font-bold mb-2">2024 Child Tax Credit at a Glance</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Credit per child (under 17):</strong> $2,000</li>
                <li><strong>Refundable portion (ACTC):</strong> Up to $1,700 per child</li>
                <li><strong>Other dependent credit:</strong> $500 (non-refundable)</li>
                <li><strong>Phase-out threshold (Single / HOH):</strong> $200,000</li>
                <li><strong>Phase-out threshold (Married Filing Jointly):</strong> $400,000</li>
                <li><strong>Phase-out rate:</strong> $50 reduction per $1,000 over threshold</li>
              </ul>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Child Tax Credit Calculator: Maximize Your 2024 CTC</h2>
          <p>
            The Child Tax Credit (CTC) is one of the most valuable tax benefits available to American families. For the 2024 tax year, qualifying families can claim up to $2,000 per child under age 17. This child tax credit calculator helps you determine your total credit amount, whether the income phase-out applies to you, and how much of the credit is refundable through the Additional Child Tax Credit. Understanding your CTC is essential for accurate tax planning and maximizing your family&#39;s tax savings.
          </p>

          <h2>How the Child Tax Credit Works in 2024</h2>
          <p>
            The Child Tax Credit provides a dollar-for-dollar reduction in your federal tax liability. For 2024, each qualifying child under age 17 entitles you to a $2,000 credit. To qualify, the child must be your son, daughter, stepchild, foster child, sibling, or a descendant of one of these, be under 17 at the end of the tax year, have a valid Social Security number, live with you for more than half the year, and not provide more than half of their own financial support. The child must also be claimed as a dependent on your tax return.
          </p>

          <h2>Income Phase-Out Rules</h2>
          <p>
            The Child Tax Credit begins to phase out at higher income levels. For single filers and heads of household, the phase-out starts at $200,000 of adjusted gross income (AGI). For married couples filing jointly, it starts at $400,000. For every $1,000 of income above the threshold, the credit is reduced by $50. This means a married couple with two children earning $450,000 would see their $4,000 credit reduced by $2,500, leaving a net credit of $1,500. At very high incomes, the credit can be entirely phased out.
          </p>

          <h2>Additional Child Tax Credit (ACTC)</h2>
          <p>
            The Additional Child Tax Credit is the refundable portion of the CTC. If your Child Tax Credit exceeds your tax liability, you may receive the difference as a refund through the ACTC. For 2024, up to $1,700 per qualifying child is refundable. This is particularly valuable for lower-income families who may not owe enough tax to use the full non-refundable credit. To claim the ACTC, you must have earned income of at least $2,500. The refundable amount is calculated as 15 percent of earned income above $2,500, capped at $1,700 per child.
          </p>

          <h2>Other Dependent Credit</h2>
          <p>
            Dependents who do not qualify for the full $2,000 Child Tax Credit may still qualify for the $500 Other Dependent Credit. This includes dependents aged 17 and older, dependent parents, and other qualifying relatives. Unlike the Child Tax Credit, the Other Dependent Credit is non-refundable, meaning it can reduce your tax bill to zero but will not generate a refund. The same income phase-out rules apply to this credit.
          </p>

          <h3>Tips for Maximizing Your Child Tax Credit</h3>
          <p>
            To maximize your CTC, ensure each qualifying child has a valid Social Security number and is claimed on your return. If you are near the phase-out threshold, consider strategies to reduce your AGI, such as contributing to a traditional 401(k) or IRA, maximizing HSA contributions, or claiming above-the-line deductions. Keep records of custody arrangements and ensure each child meets the residency requirement. If you share custody, only one parent can claim the credit per child per year.
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
            name: "Child Tax Credit Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/us-child-tax-credit`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
