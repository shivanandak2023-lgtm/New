"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Rental Yield Calculator - Rental Property & Cap Rate Calculator",
  description:
    "Free rental yield calculator. Calculate gross yield, net yield, cap rate, cash-on-cash return, and monthly cash flow for rental property investments.",
  keywords:
    "rental yield calculator, rental property calculator, cap rate calculator, cash on cash return calculator, rental income calculator, investment property calculator, rental ROI calculator",
};

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmt2(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pct(n: number): string {
  return n.toFixed(2) + "%";
}

function calcMortgagePayment(principal: number, annualRate: number, termYears: number): number {
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function RentalYieldPage() {
  const [propertyPrice, setPropertyPrice] = useState("300000");
  const [monthlyRent, setMonthlyRent] = useState("2200");
  const [annualPropertyTax, setAnnualPropertyTax] = useState("3600");
  const [annualInsurance, setAnnualInsurance] = useState("1800");
  const [annualMaintenance, setAnnualMaintenance] = useState("3000");
  const [managementFeePercent, setManagementFeePercent] = useState("8");
  const [vacancyRate, setVacancyRate] = useState("5");

  // Mortgage section
  const [useMortgage, setUseMortgage] = useState(false);
  const [loanAmount, setLoanAmount] = useState("240000");
  const [mortgageRate, setMortgageRate] = useState("6.5");
  const [mortgageTerm, setMortgageTerm] = useState("30");

  const price = parseFloat(propertyPrice) || 0;
  const rent = parseFloat(monthlyRent) || 0;
  const propTax = parseFloat(annualPropertyTax) || 0;
  const ins = parseFloat(annualInsurance) || 0;
  const maint = parseFloat(annualMaintenance) || 0;
  const mgmtPct = (parseFloat(managementFeePercent) || 0) / 100;
  const vacancy = (parseFloat(vacancyRate) || 0) / 100;

  const loan = parseFloat(loanAmount) || 0;
  const mRate = parseFloat(mortgageRate) || 6.5;
  const mTerm = parseInt(mortgageTerm) || 30;

  // Calculations
  const annualGrossRent = rent * 12;
  const effectiveGrossIncome = annualGrossRent * (1 - vacancy);
  const managementFee = effectiveGrossIncome * mgmtPct;
  const totalAnnualExpenses = propTax + ins + maint + managementFee;
  const netOperatingIncome = effectiveGrossIncome - totalAnnualExpenses;

  const grossYield = price > 0 ? (annualGrossRent / price) * 100 : 0;
  const netYield = price > 0 ? (netOperatingIncome / price) * 100 : 0;
  const capRate = price > 0 ? (netOperatingIncome / price) * 100 : 0;

  const annualCashFlow = netOperatingIncome;
  const monthlyCashFlow = annualCashFlow / 12;

  // Mortgage calculations
  const monthlyMortgage = useMortgage ? calcMortgagePayment(loan, mRate, mTerm) : 0;
  const annualMortgage = monthlyMortgage * 12;
  const cashFlowAfterMortgage = netOperatingIncome - annualMortgage;
  const monthlyCashFlowAfterMortgage = cashFlowAfterMortgage / 12;
  const downPaymentAmount = price - loan;
  const totalCashInvested = Math.max(downPaymentAmount, 0);
  const cashOnCashReturn = totalCashInvested > 0 ? (cashFlowAfterMortgage / totalCashInvested) * 100 : 0;

  // Comparison table: different purchase prices
  const priceDiffs = [-50000, -25000, 0, 25000, 50000];
  const comparisonData = priceDiffs.map((diff) => {
    const p = price + diff;
    if (p <= 0) return null;
    const gy = (annualGrossRent / p) * 100;
    const noi = effectiveGrossIncome - (propTax + ins + maint + effectiveGrossIncome * mgmtPct);
    const ny = (noi / p) * 100;
    const cr = (noi / p) * 100;
    return { price: p, grossYield: gy, netYield: ny, capRate: cr };
  }).filter(Boolean) as { price: number; grossYield: number; netYield: number; capRate: number }[];

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/us-rental-yield`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="/tools/us-rental-yield" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Rental Yield Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate gross yield, net yield, cap rate, and cash-on-cash return for rental property investments. Compare yields across different purchase prices.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Property Purchase Price ($)</label>
              <input type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(e.target.value)} className="input-field" placeholder="300000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Rental Income ($)</label>
              <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} className="input-field" placeholder="2200" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Annual Property Tax ($)</label>
              <input type="number" value={annualPropertyTax} onChange={(e) => setAnnualPropertyTax(e.target.value)} className="input-field" placeholder="3600" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Annual Insurance ($)</label>
              <input type="number" value={annualInsurance} onChange={(e) => setAnnualInsurance(e.target.value)} className="input-field" placeholder="1800" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Annual Maintenance ($)</label>
              <input type="number" value={annualMaintenance} onChange={(e) => setAnnualMaintenance(e.target.value)} className="input-field" placeholder="3000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Property Management Fee (%)</label>
              <input type="number" value={managementFeePercent} onChange={(e) => setManagementFeePercent(e.target.value)} className="input-field" step="0.5" placeholder="8" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vacancy Rate (%)</label>
              <input type="number" value={vacancyRate} onChange={(e) => setVacancyRate(e.target.value)} className="input-field" step="0.5" placeholder="5" />
            </div>
          </div>
        </div>

        <div className="tool-card mb-8">
          <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" id="useMortgage" checked={useMortgage} onChange={(e) => setUseMortgage(e.target.checked)} className="rounded" />
            <label htmlFor="useMortgage" className="text-lg font-bold">Include Mortgage Financing</label>
          </div>
          {useMortgage && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Loan Amount ($)</label>
                <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="input-field" placeholder="240000" />
                <p className="text-xs text-[var(--muted)] mt-1">Down payment: {fmt(Math.max(0, price - loan))}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
                <input type="number" value={mortgageRate} onChange={(e) => setMortgageRate(e.target.value)} className="input-field" step="0.1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Loan Term (years)</label>
                <select value={mortgageTerm} onChange={(e) => setMortgageTerm(e.target.value)} className="input-field">
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="30">30 years</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {price > 0 && rent > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Gross Yield</p>
                <p className="text-2xl font-bold text-green-700">{pct(grossYield)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Net Yield / Cap Rate</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{pct(netYield)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{useMortgage ? "Cash-on-Cash Return" : "Annual Cash Flow"}</p>
                <p className="text-2xl font-bold text-amber-700">
                  {useMortgage ? pct(cashOnCashReturn) : fmt(Math.round(annualCashFlow))}
                </p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Income &amp; Expense Breakdown</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Annual Gross Rent ({fmt(rent)}/mo x 12)</span><span className="font-medium">{fmt(annualGrossRent)}</span></div>
                <div className="flex justify-between text-red-600"><span>Vacancy Loss ({(vacancy * 100).toFixed(1)}%)</span><span>-{fmt(Math.round(annualGrossRent * vacancy))}</span></div>
                <div className="flex justify-between border-t pt-2"><span className="font-medium">Effective Gross Income</span><span className="font-medium">{fmt(Math.round(effectiveGrossIncome))}</span></div>
                <div className="mt-2 pt-2 border-t">
                  <div className="flex justify-between text-red-600"><span>Property Tax</span><span>-{fmt(propTax)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Insurance</span><span>-{fmt(ins)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Maintenance</span><span>-{fmt(maint)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Management Fee ({(mgmtPct * 100).toFixed(1)}%)</span><span>-{fmt(Math.round(managementFee))}</span></div>
                </div>
                <div className="flex justify-between border-t pt-2"><span className="font-bold">Net Operating Income (NOI)</span><span className="font-bold">{fmt(Math.round(netOperatingIncome))}</span></div>
                {useMortgage && (
                  <>
                    <div className="flex justify-between text-red-600"><span>Mortgage Payment ({fmt2(monthlyMortgage)}/mo)</span><span>-{fmt(Math.round(annualMortgage))}</span></div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-bold">Cash Flow After Mortgage</span>
                      <span className={`font-bold ${cashFlowAfterMortgage >= 0 ? "text-green-700" : "text-red-600"}`}>{fmt(Math.round(cashFlowAfterMortgage))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Cash Flow</span>
                      <span className={`font-medium ${monthlyCashFlowAfterMortgage >= 0 ? "text-green-700" : "text-red-600"}`}>{fmt2(monthlyCashFlowAfterMortgage)}</span>
                    </div>
                  </>
                )}
                {!useMortgage && (
                  <div className="flex justify-between">
                    <span>Monthly Cash Flow</span>
                    <span className={`font-medium ${monthlyCashFlow >= 0 ? "text-green-700" : "text-red-600"}`}>{fmt2(monthlyCashFlow)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Key Metrics</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Metric</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Value</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Gross Yield</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{pct(grossYield)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-[var(--muted)]">Annual rent / purchase price</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Net Yield</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{pct(netYield)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-[var(--muted)]">NOI / purchase price</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Cap Rate</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{pct(capRate)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-[var(--muted)]">NOI / property value</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Annual Cash Flow</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(Math.round(useMortgage ? cashFlowAfterMortgage : annualCashFlow))}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-[var(--muted)]">{useMortgage ? "NOI minus mortgage" : "NOI (no mortgage)"}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Monthly Cash Flow</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt2(useMortgage ? monthlyCashFlowAfterMortgage : monthlyCashFlow)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-[var(--muted)]">Annual / 12</td>
                  </tr>
                  {useMortgage && (
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Cash-on-Cash Return</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{pct(cashOnCashReturn)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-[var(--muted)]">Cash flow / cash invested</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Purchase Price vs Yield Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Purchase Price</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Gross Yield</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Net Yield</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Cap Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((d) => (
                      <tr key={d.price} className={`hover:bg-[var(--muted-bg)] ${d.price === price ? "bg-green-50 font-bold" : ""}`}>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">
                          {fmt(d.price)} {d.price === price && <span className="text-xs text-green-700 ml-1">(current)</span>}
                        </td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{pct(d.grossYield)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{pct(d.netYield)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{pct(d.capRate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[var(--muted)] mt-2">Same rental income applied across different purchase prices</p>
            </div>

            <div className="result-card mb-6" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
              <h3 className="font-bold mb-2">Quick Reference: Yield Benchmarks</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Gross yield below 5%:</strong> Low yield — may rely on appreciation</li>
                <li><strong>Gross yield 5-8%:</strong> Average for most US markets</li>
                <li><strong>Gross yield above 8%:</strong> High yield — verify expenses carefully</li>
                <li><strong>Cap rate 4-6%:</strong> Common in strong rental markets</li>
                <li><strong>Cap rate above 8%:</strong> Higher risk or undervalued property</li>
              </ul>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Rental Yield Calculator: Analyze Your Rental Property Investment</h2>
          <p>
            Investing in rental property is one of the most popular ways to build wealth in the United States. Whether you are evaluating your first rental property or expanding an existing portfolio, understanding rental yield is essential. This rental yield calculator computes all the key metrics that real estate investors use to evaluate deals: gross yield, net yield, cap rate, cash-on-cash return, and monthly cash flow. Enter your property details and get instant analysis to make informed investment decisions.
          </p>

          <h2>Gross Yield vs Net Yield</h2>
          <p>
            Gross yield is the simplest measure of rental return. It is calculated by dividing the annual rental income by the property purchase price. For example, a property bought for $300,000 that rents for $2,200 per month ($26,400 per year) has a gross yield of 8.8 percent. Net yield accounts for operating expenses such as property taxes, insurance, maintenance, management fees, and vacancy loss. Net yield provides a more realistic picture of your actual return because it reflects the costs of owning and operating the property.
          </p>

          <h2>Understanding Cap Rate</h2>
          <p>
            The capitalization rate, or cap rate, is the ratio of net operating income (NOI) to the property value. It is the standard metric used by commercial real estate investors and appraisers to compare properties. A higher cap rate generally indicates higher potential return but also higher risk. In major US metros, cap rates typically range from 4 to 6 percent for residential rental properties. In smaller cities and secondary markets, cap rates of 7 to 10 percent are common. Cap rate excludes mortgage financing, making it useful for comparing properties regardless of how they are financed.
          </p>

          <h2>Cash-on-Cash Return with Mortgage</h2>
          <p>
            When you finance a rental property with a mortgage, the cash-on-cash return measures the annual pre-tax cash flow relative to the total cash you invested (down payment plus closing costs). This metric accounts for mortgage leverage. For example, if you put $60,000 down on a $300,000 property and generate $5,400 in annual cash flow after all expenses and mortgage payments, your cash-on-cash return is 9 percent. Leverage can amplify returns when property cash flow exceeds mortgage costs, but it also amplifies losses when cash flow is negative.
          </p>

          <h2>Key Expenses to Account For</h2>
          <p>
            Accurate expense estimation is critical for rental property analysis. Property taxes vary widely by location and typically range from 0.5 to 2.5 percent of property value annually. Insurance costs depend on location, property type, and coverage level. Maintenance typically runs 1 to 2 percent of property value per year. Property management fees range from 8 to 12 percent of collected rent. Vacancy should be estimated at 5 to 10 percent, accounting for turnover, marketing, and time between tenants. This rental property calculator includes all these expense categories.
          </p>

          <h3>Tips for Evaluating Rental Properties</h3>
          <p>
            Experienced investors often use the 1 percent rule as a quick screening tool: the monthly rent should be at least 1 percent of the purchase price. While this is a rough guideline, properties that meet it tend to have positive cash flow. Always verify actual expenses rather than relying on seller estimates. Factor in capital expenditures such as roof replacement, HVAC systems, and appliance upgrades. Consider the local rental market, job growth, and population trends when evaluating long-term rental demand. A thorough analysis using this rental yield calculator, combined with local market knowledge, will help you make confident investment decisions.
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
            name: "Rental Yield Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/us-rental-yield`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
