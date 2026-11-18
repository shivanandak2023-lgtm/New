import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const TITLE = "Mortgage Rates 2026 - Current Rates, How They Work & Tips";
const DESCRIPTION =
  "Understand mortgage rates in 2026: fixed vs variable, how rates are determined, current rate trends, and expert tips to secure the best mortgage rate.";
const SLUG = "mortgage-rates-guide";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: SITE_NAME,
    type: "article",
    publishedTime: "2026-11-05T00:00:00Z",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: {
    canonical: `${SITE_URL}/blog/${SLUG}`,
  },
};

const FAQS = [
  {
    question: "What is a good mortgage rate in 2026?",
    answer:
      "A good mortgage rate depends on the loan type, your credit score, and current market conditions. Generally, a rate at or below the national average is considered good. In 2026, rates for well-qualified borrowers with credit scores above 740 are typically 0.25-0.5% below advertised average rates. Always compare multiple lenders to find the best rate for your situation.",
  },
  {
    question: "Should I choose a fixed or variable rate mortgage?",
    answer:
      "Fixed-rate mortgages provide payment stability — your rate stays the same for the entire loan term. Variable (adjustable) rate mortgages typically start lower but can increase over time. Choose fixed if you plan to stay long-term and want predictability. Choose variable if you plan to sell or refinance within 5-7 years and want a lower initial rate.",
  },
  {
    question: "How much does credit score affect mortgage rates?",
    answer:
      "Credit score significantly impacts your mortgage rate. Borrowers with scores above 760 typically receive the best rates. Each 20-point drop in score can increase your rate by 0.125-0.25%. Over a 30-year mortgage, this difference can amount to tens of thousands of dollars in additional interest.",
  },
  {
    question: "Can I negotiate my mortgage rate?",
    answer:
      "Yes, mortgage rates are negotiable. Get quotes from at least 3-5 lenders and use competing offers as leverage. You can also pay discount points (1 point = 1% of the loan amount) to buy down your rate. Additionally, some lenders offer rate-match guarantees. Negotiating your rate by even 0.125% can save thousands over the life of the loan.",
  },
];

export default function MortgageRatesGuide() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    datePublished: "2026-11-05",
    dateModified: "2026-11-10",
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <nav className="text-sm text-[var(--muted)] mb-6">
        <a href="/" className="hover:text-[var(--primary)]">Home</a>
        <span className="mx-2">/</span>
        <a href="/blog" className="hover:text-[var(--primary)]">Blog</a>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">Mortgage Rates 2026</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
        {TITLE}
      </h1>
      <div className="flex items-center gap-4 text-sm text-[var(--muted)] mb-8">
        <span>November 5, 2026</span>
        <span>8 min read</span>
      </div>

      {/* Ad placeholder */}
      <div className="w-full h-24 bg-[var(--muted-bg)] rounded-lg flex items-center justify-center text-xs text-[var(--muted)] mb-8 border border-dashed border-[var(--card-border)]">
        Advertisement
      </div>

      <div className="prose-custom">
        <p className="text-lg leading-relaxed mb-6">
          Your mortgage rate is the single biggest factor determining how much your home will actually cost over time. Even a small difference in rate — as little as 0.25% — can mean tens of thousands of dollars over a 30-year loan. This guide covers everything you need to know about mortgage rates in 2026, from how they work to how to get the best deal.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">How Mortgage Rates Work</h2>
        <p className="mb-4">
          A mortgage rate is the interest a lender charges you for borrowing money to buy a home. It is expressed as an annual percentage. Your monthly payment consists of principal (paying back what you borrowed) and interest (the cost of borrowing). In the early years of your mortgage, most of your payment goes toward interest. Over time, more goes toward principal.
        </p>
        <p className="mb-6">
          For example, on a $350,000 loan at 6.5% over 30 years, your monthly payment would be about $2,212. Over the full 30 years, you would pay approximately $446,247 in total interest — more than the original loan amount.
        </p>

        <div className="my-8 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm font-medium">
            See your exact monthly payment with our{" "}
            <a href="/tools/mortgage-calculator" className="text-[var(--primary)] font-bold hover:underline">
              free Mortgage Calculator
            </a>{" "}
            — includes amortization schedule and total interest breakdown.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">Fixed-Rate vs Adjustable-Rate Mortgages</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">Fixed-Rate Mortgage (FRM)</h3>
        <p className="mb-4">
          Your interest rate stays the same for the entire loan term (typically 15 or 30 years). This means your monthly principal and interest payment never changes, making budgeting predictable.
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>Best for: Buyers who plan to stay long-term</li>
          <li>Advantage: Payment stability and protection from rate increases</li>
          <li>Disadvantage: Typically higher starting rate than adjustable-rate options</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Adjustable-Rate Mortgage (ARM)</h3>
        <p className="mb-4">
          The rate is fixed for an initial period (typically 5, 7, or 10 years), then adjusts periodically based on a benchmark index. A &quot;5/1 ARM&quot; means fixed for 5 years, then adjusting annually.
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>Best for: Buyers who plan to sell or refinance within 5-10 years</li>
          <li>Advantage: Lower initial rate, saving money in the short term</li>
          <li>Disadvantage: Rate can increase significantly after the fixed period</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">Mortgage Rate Comparison by Loan Term</h2>
        <p className="mb-4">
          Here is how different loan terms affect your monthly payment and total interest on a $300,000 mortgage:
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--muted-bg)]">
                <th className="border border-[var(--card-border)] px-4 py-2 text-left">Loan Term</th>
                <th className="border border-[var(--card-border)] px-4 py-2 text-right">Typical Rate</th>
                <th className="border border-[var(--card-border)] px-4 py-2 text-right">Monthly Payment</th>
                <th className="border border-[var(--card-border)] px-4 py-2 text-right">Total Interest</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2">15-Year Fixed</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">5.75%</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$2,494</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$148,889</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2">20-Year Fixed</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">6.00%</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$2,149</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$215,838</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2">30-Year Fixed</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">6.50%</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$1,896</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$382,633</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2">5/1 ARM</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">5.50%</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$1,703*</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">Varies</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted)] mb-6">
          *ARM payment shown is for the initial fixed-rate period. Payment may increase after adjustment.
        </p>

        {/* Ad placeholder */}
        <div className="w-full h-24 bg-[var(--muted-bg)] rounded-lg flex items-center justify-center text-xs text-[var(--muted)] my-8 border border-dashed border-[var(--card-border)]">
          Advertisement
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">What Determines Mortgage Rates?</h2>
        <p className="mb-4">
          Mortgage rates are influenced by both macroeconomic factors and your personal financial profile:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Economic Factors</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Federal Reserve policy:</strong> The Fed&apos;s benchmark rate indirectly influences mortgage rates. When the Fed raises rates, mortgage rates tend to follow.</li>
          <li><strong>Bond market:</strong> Mortgage rates closely track the yield on 10-year Treasury bonds. When bond yields rise, mortgage rates typically increase too.</li>
          <li><strong>Inflation:</strong> Higher inflation generally pushes mortgage rates up, as lenders need to maintain real returns.</li>
          <li><strong>Economic outlook:</strong> Strong economic growth can push rates higher, while recession fears tend to lower them.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Personal Factors</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Credit score:</strong> The most important personal factor. Scores above 740 get the best rates. Each tier below costs you more.</li>
          <li><strong>Down payment:</strong> Larger down payments (20%+) typically qualify for better rates and avoid PMI. Use our{" "}
            <a href="/tools/down-payment-calculator" className="text-[var(--primary)] hover:underline">Down Payment Calculator</a> to plan.
          </li>
          <li><strong>Debt-to-income ratio:</strong> Lenders prefer a DTI below 36%. Check yours with the{" "}
            <a href="/tools/debt-to-income-calculator" className="text-[var(--primary)] hover:underline">DTI Calculator</a>.
          </li>
          <li><strong>Loan amount:</strong> Very small or very large (jumbo) loans may carry different rates.</li>
          <li><strong>Property type:</strong> Primary residences get better rates than investment properties or vacation homes.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">10 Tips to Get the Best Mortgage Rate</h2>
        <ol className="list-decimal pl-6 mb-6 space-y-3">
          <li>
            <strong>Improve your credit score first:</strong> Pay down debt, fix errors on your credit report, and avoid new credit applications for 6+ months before applying for a mortgage.
          </li>
          <li>
            <strong>Save for a larger down payment:</strong> 20% or more eliminates PMI and qualifies you for better rates. Even going from 10% to 15% down can help.
          </li>
          <li>
            <strong>Shop multiple lenders:</strong> Get quotes from at least 3-5 lenders including banks, credit unions, and online lenders. Rates can vary by 0.5% or more between lenders.
          </li>
          <li>
            <strong>Compare on the same day:</strong> Rates change daily. To make fair comparisons, request all quotes on the same day.
          </li>
          <li>
            <strong>Look at APR, not just the rate:</strong> The APR includes fees and gives a more accurate picture of the total borrowing cost.
          </li>
          <li>
            <strong>Consider discount points:</strong> Paying points upfront (1 point = 1% of the loan) can lower your rate by 0.25%. This makes sense if you plan to keep the loan long term.
          </li>
          <li>
            <strong>Lock your rate at the right time:</strong> Once you find a good rate, lock it. Rate locks typically last 30-60 days. If rates are trending down, you might wait; if trending up, lock immediately.
          </li>
          <li>
            <strong>Consider a shorter term:</strong> 15-year mortgages typically offer rates 0.5-0.75% lower than 30-year terms.
          </li>
          <li>
            <strong>Reduce your DTI ratio:</strong> Pay off car loans, student loans, or credit card balances to lower your debt-to-income ratio before applying.
          </li>
          <li>
            <strong>Use a mortgage broker:</strong> Brokers can shop multiple lenders on your behalf and may find rates you would not discover on your own.
          </li>
        </ol>

        <h2 className="text-2xl font-bold mt-10 mb-4">When to Refinance Your Mortgage</h2>
        <p className="mb-4">
          Refinancing replaces your existing mortgage with a new one, typically at a lower rate. Consider refinancing when:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Rates have dropped at least 0.75-1% below your current rate</li>
          <li>Your credit score has improved significantly since your original mortgage</li>
          <li>You want to switch from an ARM to a fixed-rate mortgage</li>
          <li>You have enough equity to eliminate PMI</li>
          <li>You plan to stay in the home long enough to recoup closing costs</li>
        </ul>
        <p className="mb-6">
          A good rule of thumb: divide the closing costs by your monthly savings to find your break-even point. If you plan to stay past that point, refinancing makes sense.
        </p>

        <div className="my-8 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm font-medium">
            Related tools:{" "}
            <a href="/tools/mortgage-calculator" className="text-[var(--primary)] hover:underline">Mortgage Calculator</a>
            {" "}&middot;{" "}
            <a href="/tools/emi-calculator" className="text-[var(--primary)] hover:underline">EMI Calculator</a>
            {" "}&middot;{" "}
            <a href="/tools/down-payment-calculator" className="text-[var(--primary)] hover:underline">Down Payment Calculator</a>
            {" "}&middot;{" "}
            <a href="/tools/debt-to-income-calculator" className="text-[var(--primary)] hover:underline">DTI Calculator</a>
            {" "}&middot;{" "}
            <a href="/tools/credit-card-payoff-calculator" className="text-[var(--primary)] hover:underline">Credit Card Payoff Calculator</a>
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, index) => (
            <details key={index} className="tool-card group">
              <summary className="cursor-pointer font-semibold text-[var(--foreground)] list-none flex items-center justify-between">
                {faq.question}
                <span className="text-[var(--muted)] text-xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[var(--muted)] leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Ad placeholder */}
      <div className="w-full h-24 bg-[var(--muted-bg)] rounded-lg flex items-center justify-center text-xs text-[var(--muted)] mt-10 border border-dashed border-[var(--card-border)]">
        Advertisement
      </div>

      <div className="mt-10 text-center">
        <a
          href="/blog"
          className="text-[var(--primary)] font-semibold hover:underline"
        >
          &larr; Back to Blog
        </a>
      </div>
    </article>
  );
}
