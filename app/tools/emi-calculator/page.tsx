"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { saveToHistory } from "@/lib/history";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareButtons from "@/components/ShareButtons";
import CalcHistory from "@/components/CalcHistory";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";
import AIInsight from "@/components/AIInsight";

const META = {
  title: "EMI Calculator - Calculate Monthly Loan EMI Online",
  description:
    "Free EMI Calculator to calculate monthly EMI for home loan, car loan, or personal loan. See total interest, total payment, and amortization schedule.",
  keywords: "emi calculator, loan emi calculator, home loan emi, car loan emi, personal loan emi, monthly emi",
};

const EMI_FAQS = [
  {
    question: "What is EMI and how is it calculated?",
    answer:
      "EMI stands for Equated Monthly Installment. It is the fixed amount you pay each month to repay a loan. EMI is calculated using the formula: EMI = P x r x (1+r)^n / ((1+r)^n - 1), where P is the principal loan amount, r is the monthly interest rate, and n is the total number of installments.",
  },
  {
    question: "Does prepaying a loan reduce EMI or tenure?",
    answer:
      "Prepaying a loan can reduce either the EMI amount or the loan tenure, depending on the option you choose with your lender. Reducing tenure saves more on total interest, while reducing EMI lowers your monthly outflow. Most banks allow you to choose either option.",
  },
  {
    question: "What happens if I miss an EMI payment?",
    answer:
      "Missing an EMI payment can result in late payment fees, a negative impact on your credit score, and potential legal action from the lender. It is advisable to set up auto-debit or reminders to avoid missing payments. Contact your bank immediately if you anticipate difficulty making a payment.",
  },
  {
    question: "Can I get a loan with zero or low EMI?",
    answer:
      "Some lenders offer promotional zero-EMI or low-EMI schemes, especially for consumer products. However, these often include processing fees or hidden charges. For home and car loans, the EMI depends on the loan amount, interest rate, and tenure. Longer tenures reduce EMI but increase total interest paid.",
  },
];

export default function EMICalculatorPage() {
  const [principal, setPrincipal] = useState<string>("1000000");
  const [rate, setRate] = useState<string>("8.5");
  const [tenure, setTenure] = useState<string>("20");
  const [tenureType, setTenureType] = useState<"years" | "months">("years");
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [result, setResult] = useState<{
    emi: number;
    totalInterest: number;
    totalPayment: number;
    schedule: { month: number; emi: number; principal: number; interest: number; balance: number }[];
  } | null>(null);

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  function calculate() {
    const P = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const n = tenureType === "years" ? parseInt(tenure) * 12 : parseInt(tenure);

    if (!P || !annualRate || !n || P <= 0 || annualRate <= 0 || n <= 0) return;

    const r = annualRate / 12 / 100;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    const schedule: { month: number; emi: number; principal: number; interest: number; balance: number }[] = [];
    let balance = P;
    for (let i = 1; i <= n; i++) {
      const interestPart = balance * r;
      const principalPart = emi - interestPart;
      balance -= principalPart;
      schedule.push({
        month: i,
        emi: Math.round(emi),
        principal: Math.round(principalPart),
        interest: Math.round(interestPart),
        balance: Math.max(0, Math.round(balance)),
      });
    }

    setResult({ emi, totalInterest, totalPayment, schedule });

    saveToHistory("emi-calculator", {
      input: `Loan: ${fmt(P)}, Rate: ${annualRate}%, Tenure: ${tenure} ${tenureType}`,
      result: `EMI: ${fmt(emi)}, Total Interest: ${fmt(totalInterest)}`,
    });
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/emi-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/emi-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Finance", href: "/" },
            { label: "EMI Calculator" },
          ]}
        />

        <h1 className="text-3xl font-extrabold mb-2">EMI Calculator</h1>
        <p className="text-[var(--muted)] mb-4">
          Calculate your monthly EMI for home loan, car loan, or personal loan. Get a detailed amortization schedule.
        </p>

        <ShareButtons
          title="EMI Calculator - Calculate Monthly Loan EMI Online"
          url={`${SITE_URL}/tools/emi-calculator`}
        />

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Loan Amount ({currency.symbol})</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="input-field"
                placeholder="e.g., 1000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Interest Rate (% per annum)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="input-field"
                step="0.1"
                placeholder="e.g., 8.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Loan Tenure</label>
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                className="input-field"
                placeholder={tenureType === "years" ? "e.g., 20" : "e.g., 240"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tenure Type</label>
              <select
                value={tenureType}
                onChange={(e) => setTenureType(e.target.value as "years" | "months")}
                className="input-field"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary mt-6">
            Calculate EMI
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Monthly EMI</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.emi)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.totalInterest)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Payment</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(result.totalPayment)}</p>
              </div>
            </div>

            <div className="tool-card overflow-x-auto">
              <h2 className="text-lg font-bold mb-4">Amortization Schedule</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Month</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">EMI</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Principal</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Interest</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.slice(0, 24).map((row) => (
                    <tr key={row.month} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">{row.month}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.emi)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.principal)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.interest)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.schedule.length > 24 && (
                <p className="text-sm text-[var(--muted)] mt-3 text-center">
                  Showing first 24 of {result.schedule.length} months
                </p>
              )}
            </div>
          </div>
        )}

        <CalcHistory toolSlug="emi-calculator" />

        {/* AI Insight */}
        {result && (
          <AIInsight
            toolName="EMI Calculator"
            getCalculationSummary={() =>
              result
                ? `Loan Amount: ${fmt(parseFloat(principal))}, Interest Rate: ${rate}%, Tenure: ${tenure} ${tenureType}, Monthly EMI: ${fmt(result.emi)}, Total Interest: ${fmt(result.totalInterest)}, Total Payment: ${fmt(result.totalPayment)}`
                : null
            }
          />
        )}

        <div className="ad-placeholder mb-8 mt-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is an EMI Calculator?</h2>
          <p>
            An EMI (Equated Monthly Installment) Calculator is a financial tool that helps you determine the fixed monthly
            payment you need to make to repay a loan over a specified period. Whether you are taking a home loan, car loan,
            or personal loan, the EMI calculator gives you an accurate breakdown of your repayment schedule.
          </p>

          <h2>How is EMI Calculated?</h2>
          <p>The EMI is calculated using the following formula:</p>
          <p>
            <strong>EMI = P x r x (1 + r)^n / ((1 + r)^n - 1)</strong>
          </p>
          <ul>
            <li><strong>P</strong> = Principal loan amount</li>
            <li><strong>r</strong> = Monthly interest rate (annual rate / 12 / 100)</li>
            <li><strong>n</strong> = Total number of monthly installments</li>
          </ul>

          <h2>Benefits of Using the EMI Calculator</h2>
          <ul>
            <li>Plan your finances by knowing exact monthly outflow</li>
            <li>Compare different loan offers from banks</li>
            <li>Understand interest vs principal split over time</li>
            <li>Make informed decisions about loan tenure</li>
          </ul>

          <h3>Types of Loans You Can Calculate</h3>
          <ul>
            <li>Home Loan / Mortgage</li>
            <li>Car / Vehicle Loan</li>
            <li>Personal Loan</li>
            <li>Education Loan</li>
            <li>Business Loan</li>
          </ul>
        </div>

        <ToolFAQ faqs={EMI_FAQS} />

        <RelatedTools currentSlug="emi-calculator" category="finance" />
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "EMI Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/emi-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
