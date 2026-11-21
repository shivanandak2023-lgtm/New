"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Home Affordability Calculator - How Much House Can I Afford?",
  description:
    "Free home affordability calculator. Find out how much house you can afford based on income, debts, down payment, and interest rate. Uses 28/36 DTI rule.",
  keywords:
    "home affordability calculator, how much house can I afford, mortgage affordability calculator, home buying calculator, house affordability, DTI calculator, mortgage qualification calculator",
};

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmt2(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function calcMaxLoan(maxMonthlyPI: number, annualRate: number, termYears: number): number {
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return maxMonthlyPI * n;
  return (maxMonthlyPI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
}

interface Scenario {
  label: string;
  frontEnd: number;
  backEnd: number;
  color: string;
  bg: string;
  border: string;
}

const SCENARIOS: Scenario[] = [
  { label: "Conservative", frontEnd: 0.25, backEnd: 0.33, color: "text-green-700", bg: "#f0fdf4", border: "#bbf7d0" },
  { label: "Moderate", frontEnd: 0.28, backEnd: 0.36, color: "text-blue-700", bg: "#eff6ff", border: "#bfdbfe" },
  { label: "Aggressive", frontEnd: 0.32, backEnd: 0.43, color: "text-amber-700", bg: "#fefce8", border: "#fef08a" },
];

export default function HomeAffordabilityPage() {
  const [annualIncome, setAnnualIncome] = useState("85000");
  const [monthlyDebts, setMonthlyDebts] = useState("500");
  const [downPayment, setDownPayment] = useState("50000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [propertyTaxRate, setPropertyTaxRate] = useState("1.2");
  const [monthlyInsurance, setMonthlyInsurance] = useState("150");
  const [monthlyHoa, setMonthlyHoa] = useState("0");

  const income = parseFloat(annualIncome) || 0;
  const debts = parseFloat(monthlyDebts) || 0;
  const down = parseFloat(downPayment) || 0;
  const rate = parseFloat(interestRate) || 6.5;
  const term = parseInt(loanTerm) || 30;
  const taxRate = (parseFloat(propertyTaxRate) || 1.2) / 100;
  const insurance = parseFloat(monthlyInsurance) || 0;
  const hoa = parseFloat(monthlyHoa) || 0;

  const monthlyIncome = income / 12;

  function calcScenario(scenario: Scenario) {
    // Front-end DTI: housing expenses / gross monthly income
    const maxHousingPayment = monthlyIncome * scenario.frontEnd;
    // Back-end DTI: (housing + debts) / gross monthly income
    const maxTotalPayment = monthlyIncome * scenario.backEnd;
    const maxHousingFromBackEnd = maxTotalPayment - debts;

    // Use the lower of front-end and back-end constraints
    const maxMonthlyHousing = Math.min(maxHousingPayment, Math.max(0, maxHousingFromBackEnd));

    // Subtract fixed costs to get max P&I
    // Property tax depends on home price, so we iterate
    // Start with estimate, then refine
    let homePrice = 0;
    for (let i = 0; i < 20; i++) {
      const monthlyTax = (homePrice * taxRate) / 12;
      const maxPI = maxMonthlyHousing - monthlyTax - insurance - hoa;
      if (maxPI <= 0) { homePrice = 0; break; }
      const loanAmount = calcMaxLoan(maxPI, rate, term);
      homePrice = loanAmount + down;
    }

    // Final numbers
    const loanAmount = Math.max(0, homePrice - down);
    const monthlyPI = calcMonthlyPayment(loanAmount, rate, term);
    const monthlyTax = (homePrice * taxRate) / 12;
    const totalMonthly = monthlyPI + monthlyTax + insurance + hoa;
    const frontEndDTI = monthlyIncome > 0 ? (totalMonthly / monthlyIncome) * 100 : 0;
    const backEndDTI = monthlyIncome > 0 ? ((totalMonthly + debts) / monthlyIncome) * 100 : 0;

    return { homePrice: Math.round(homePrice), loanAmount: Math.round(loanAmount), monthlyPI, monthlyTax, totalMonthly, frontEndDTI, backEndDTI };
  }

  const results = SCENARIOS.map((s) => ({ ...s, ...calcScenario(s) }));
  const moderate = results[1]; // primary scenario

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/us-home-affordability`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="/tools/us-home-affordability" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Home Affordability Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Find out how much house you can afford based on your income, debts, and down payment. Uses the 28/36 debt-to-income rule used by most US lenders.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Annual Household Income ($)</label>
              <input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="input-field" placeholder="85000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Debts ($)</label>
              <input type="number" value={monthlyDebts} onChange={(e) => setMonthlyDebts(e.target.value)} className="input-field" placeholder="500" />
              <p className="text-xs text-[var(--muted)] mt-1">Car payments, student loans, credit cards</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Down Payment ($)</label>
              <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="input-field" placeholder="50000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="input-field" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Loan Term</label>
              <select value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="input-field">
                <option value="15">15 years</option>
                <option value="20">20 years</option>
                <option value="30">30 years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Property Tax Rate (%)</label>
              <input type="number" value={propertyTaxRate} onChange={(e) => setPropertyTaxRate(e.target.value)} className="input-field" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Homeowner&apos;s Insurance ($/mo)</label>
              <input type="number" value={monthlyInsurance} onChange={(e) => setMonthlyInsurance(e.target.value)} className="input-field" placeholder="150" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">HOA Fees ($/mo)</label>
              <input type="number" value={monthlyHoa} onChange={(e) => setMonthlyHoa(e.target.value)} className="input-field" placeholder="0" />
            </div>
          </div>
        </div>

        {income > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Max Home Price (Moderate)</p>
                <p className="text-2xl font-bold text-green-700">{fmt(moderate.homePrice)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Max Monthly Payment</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt2(moderate.totalMonthly)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Loan Amount</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(moderate.loanAmount)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Monthly Payment Breakdown (Moderate)</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Principal &amp; Interest</span><span className="font-medium">{fmt2(moderate.monthlyPI)}</span></div>
                <div className="flex justify-between"><span>Property Tax</span><span className="font-medium">{fmt2(moderate.monthlyTax)}</span></div>
                <div className="flex justify-between"><span>Homeowner&apos;s Insurance</span><span className="font-medium">{fmt2(insurance)}</span></div>
                {hoa > 0 && <div className="flex justify-between"><span>HOA Fees</span><span className="font-medium">{fmt2(hoa)}</span></div>}
                <div className="flex justify-between border-t pt-2"><span className="font-bold">Total Housing Payment</span><span className="font-bold">{fmt2(moderate.totalMonthly)}</span></div>
                <div className="flex justify-between"><span>Front-End DTI</span><span className="font-medium">{moderate.frontEndDTI.toFixed(1)}%</span></div>
                <div className="flex justify-between"><span>Back-End DTI (with debts)</span><span className="font-medium">{moderate.backEndDTI.toFixed(1)}%</span></div>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Affordability Scenarios</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Scenario</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Max Home Price</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Monthly Payment</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Front DTI</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Back DTI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.label} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2 font-medium">
                          <span className={r.color}>{r.label}</span>
                          <span className="text-xs text-[var(--muted)] ml-1">({(r.frontEnd * 100).toFixed(0)}/{(r.backEnd * 100).toFixed(0)})</span>
                        </td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-medium">{fmt(r.homePrice)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt2(r.totalMonthly)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{r.frontEndDTI.toFixed(1)}%</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{r.backEndDTI.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[var(--muted)] mt-2">
                Conservative: 25/33 DTI | Moderate: 28/36 DTI (standard) | Aggressive: 32/43 DTI
              </p>
            </div>

            <div className="result-card mb-6" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
              <h3 className="font-bold mb-2">The 28/36 Rule</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Front-end ratio (28%):</strong> Total housing costs should not exceed 28% of gross monthly income</li>
                <li><strong>Back-end ratio (36%):</strong> Total debt payments (housing + all debts) should not exceed 36% of gross monthly income</li>
                <li>Your monthly income: <strong>{fmt(Math.round(monthlyIncome))}</strong></li>
                <li>Max housing (28%): <strong>{fmt(Math.round(monthlyIncome * 0.28))}</strong></li>
                <li>Max total debts (36%): <strong>{fmt(Math.round(monthlyIncome * 0.36))}</strong></li>
              </ul>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Home Affordability Calculator: How Much House Can I Afford?</h2>
          <p>
            Buying a home is the largest financial decision most Americans will ever make. This home affordability calculator uses the same debt-to-income (DTI) ratios that mortgage lenders use to determine how much house you can afford. By entering your annual income, monthly debts, down payment, and current interest rates, you get a clear picture of the maximum home price that fits your budget across conservative, moderate, and aggressive scenarios.
          </p>

          <h2>Understanding the 28/36 Rule</h2>
          <p>
            The 28/36 rule is the standard guideline used by most US mortgage lenders. The front-end ratio (28 percent) means your total monthly housing costs — including principal, interest, property taxes, homeowner&#39;s insurance, and HOA fees — should not exceed 28 percent of your gross monthly income. The back-end ratio (36 percent) means your total monthly debt obligations, including housing costs plus car payments, student loans, credit card minimums, and other debts, should not exceed 36 percent of your gross monthly income. This calculator applies both constraints and uses the more restrictive one.
          </p>

          <h2>Factors That Affect Home Affordability</h2>
          <p>
            Several factors determine how much house you can afford. Your income is the primary driver — higher income means higher maximum housing payments. Your existing monthly debts reduce your buying power because they consume part of your allowable DTI ratio. The interest rate significantly impacts affordability because even a small rate change affects the monthly payment on a large mortgage. A larger down payment increases your buying power by reducing the loan amount needed. Property tax rates vary significantly by state and county, and they add to your monthly housing cost.
          </p>

          <h2>Down Payment Considerations</h2>
          <p>
            The traditional recommendation is a 20 percent down payment, which avoids private mortgage insurance (PMI). However, many loan programs allow lower down payments. FHA loans require as little as 3.5 percent down. Conventional loans may accept 3 to 5 percent down with PMI. VA loans for veterans require zero down payment. A larger down payment reduces your loan amount, lowers your monthly payment, and may qualify you for a better interest rate. This mortgage affordability calculator adds your down payment to the maximum loan amount to show the total home price you can afford.
          </p>

          <h2>Conservative vs Moderate vs Aggressive Scenarios</h2>
          <p>
            This calculator shows three affordability scenarios. The conservative scenario uses a 25/33 DTI ratio, leaving more room in your budget for savings, emergencies, and lifestyle spending. The moderate scenario uses the standard 28/36 rule that most lenders apply. The aggressive scenario uses a 32/43 DTI ratio, which some lenders may approve for borrowers with strong credit and significant assets. Financial advisors generally recommend staying closer to the conservative scenario to maintain financial flexibility, especially if you are a first-time homebuyer adjusting to homeownership costs.
          </p>

          <h3>Hidden Costs of Homeownership</h3>
          <p>
            When calculating how much house you can afford, remember that the mortgage payment is not your only cost. Homeowners typically spend 1 to 2 percent of the home&#39;s value annually on maintenance and repairs. Utilities, lawn care, pest control, and potential HOA fees add to monthly costs. Closing costs typically range from 2 to 5 percent of the purchase price. Setting aside funds for these expenses is essential to avoid becoming house-poor, where your housing costs consume so much income that other financial goals suffer.
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
            name: "Home Affordability Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/us-home-affordability`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
