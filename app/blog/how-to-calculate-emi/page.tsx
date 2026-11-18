import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const TITLE = "How to Calculate EMI - Formula, Examples & Tips (2026)";
const DESCRIPTION =
  "Learn the EMI formula step by step. See worked examples for home loan, car loan, and personal loan EMI. Plus tips to reduce your monthly installments.";
const SLUG = "how-to-calculate-emi";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: SITE_NAME,
    type: "article",
    publishedTime: "2026-10-15T00:00:00Z",
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
    question: "What is the EMI formula?",
    answer:
      "The EMI formula is: EMI = P x r x (1+r)^n / ((1+r)^n - 1), where P is the principal loan amount, r is the monthly interest rate (annual rate divided by 12 and by 100), and n is the total number of monthly installments.",
  },
  {
    question: "How can I reduce my EMI?",
    answer:
      "You can reduce your EMI by negotiating a lower interest rate, making a larger down payment to reduce the principal, opting for a longer loan tenure, or making partial prepayments when possible.",
  },
  {
    question: "Is EMI the same for all types of loans?",
    answer:
      "The EMI formula is the same for all reducing-balance loans (home loans, car loans, personal loans). However, flat-rate loans calculate interest on the original principal throughout the tenure, resulting in higher effective interest.",
  },
  {
    question: "Does EMI include insurance and processing fees?",
    answer:
      "Standard EMI calculation only includes principal and interest. Processing fees are usually charged upfront, and insurance premiums may be added separately or bundled into the loan amount, which would then increase the EMI.",
  },
];

export default function HowToCalculateEMI() {
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
    datePublished: "2026-10-15",
    dateModified: "2026-11-01",
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
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
        <span className="text-[var(--foreground)]">How to Calculate EMI</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
        {TITLE}
      </h1>
      <div className="flex items-center gap-4 text-sm text-[var(--muted)] mb-8">
        <span>October 15, 2026</span>
        <span>8 min read</span>
      </div>

      {/* Ad placeholder */}
      <div className="w-full h-24 bg-[var(--muted-bg)] rounded-lg flex items-center justify-center text-xs text-[var(--muted)] mb-8 border border-dashed border-[var(--card-border)]">
        Advertisement
      </div>

      <div className="prose-custom">
        <p className="text-lg leading-relaxed mb-6">
          EMI, or <strong>Equated Monthly Installment</strong>, is the fixed amount you pay your lender every month until your loan is fully repaid. Whether you are taking a home loan, car loan, or personal loan, understanding how EMI works helps you plan your finances better and avoid surprises.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">What Is EMI?</h2>
        <p className="mb-4">
          An EMI consists of two components: the <strong>principal repayment</strong> and the <strong>interest payment</strong>. In the early months of a loan, a larger portion of your EMI goes toward interest. As you progress through the loan tenure, more of each EMI goes toward repaying the principal. This is known as a reducing-balance method.
        </p>
        <p className="mb-6">
          For example, on a home loan of $300,000 at 7% annual interest for 30 years, your monthly EMI would be approximately $1,996. Over the loan tenure, you would pay about $418,527 in total interest — more than the original loan amount.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">The EMI Formula</h2>
        <p className="mb-4">
          The standard EMI formula used by banks and financial institutions worldwide is:
        </p>
        <div className="bg-[var(--muted-bg)] p-5 rounded-lg my-6 text-center border border-[var(--card-border)]">
          <p className="text-lg font-mono font-semibold">
            EMI = P &times; r &times; (1 + r)<sup>n</sup> / ((1 + r)<sup>n</sup> &minus; 1)
          </p>
        </div>
        <p className="mb-2">Where:</p>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li><strong>P</strong> = Principal loan amount</li>
          <li><strong>r</strong> = Monthly interest rate (annual rate &divide; 12 &divide; 100)</li>
          <li><strong>n</strong> = Total number of monthly installments (years &times; 12)</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">Step-by-Step EMI Calculation Example</h2>
        <p className="mb-4">
          Let us calculate the EMI for a <strong>home loan of $200,000</strong> at <strong>8% annual interest</strong> for <strong>20 years</strong>.
        </p>
        <ol className="list-decimal pl-6 mb-6 space-y-3">
          <li>
            <strong>Convert annual rate to monthly rate:</strong> r = 8 / 12 / 100 = 0.00667
          </li>
          <li>
            <strong>Calculate total installments:</strong> n = 20 &times; 12 = 240
          </li>
          <li>
            <strong>Apply the formula:</strong>
            <br />
            EMI = 200,000 &times; 0.00667 &times; (1.00667)<sup>240</sup> / ((1.00667)<sup>240</sup> &minus; 1)
          </li>
          <li>
            <strong>Calculate (1 + r)<sup>n</sup>:</strong> (1.00667)<sup>240</sup> = 4.9268
          </li>
          <li>
            <strong>Final EMI:</strong> 200,000 &times; 0.00667 &times; 4.9268 / (4.9268 &minus; 1) = <strong>$1,673 per month</strong>
          </li>
        </ol>

        <div className="my-8 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm font-medium">
            Skip the manual math —{" "}
            <a href="/tools/emi-calculator" className="text-[var(--primary)] font-bold hover:underline">
              use our free EMI Calculator
            </a>{" "}
            to get instant results with amortization schedule.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">Factors That Affect Your EMI</h2>
        <p className="mb-4">Three main factors determine your EMI amount:</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">1. Loan Amount (Principal)</h3>
        <p className="mb-4">
          The higher the loan amount, the higher your EMI. Making a larger down payment reduces the principal and therefore lowers your monthly burden. For home loans, a 20% down payment is standard, but putting down more can significantly reduce your EMI.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">2. Interest Rate</h3>
        <p className="mb-4">
          Even a small difference in interest rate can have a large impact over the loan tenure. For a $200,000 loan over 20 years, the difference between 7% and 8% interest is about $130 per month — or over $31,000 in total interest paid. Always compare rates from multiple lenders before committing.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3. Loan Tenure</h3>
        <p className="mb-4">
          Longer tenure means lower EMI but higher total interest paid. A 30-year tenure versus a 20-year tenure reduces your monthly EMI but you end up paying significantly more in interest. Choose a tenure that balances affordability with total cost.
        </p>

        {/* Ad placeholder */}
        <div className="w-full h-24 bg-[var(--muted-bg)] rounded-lg flex items-center justify-center text-xs text-[var(--muted)] my-8 border border-dashed border-[var(--card-border)]">
          Advertisement
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">EMI Comparison Table</h2>
        <p className="mb-4">
          Here is how EMI varies for a $200,000 loan at different interest rates and tenures:
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--muted-bg)]">
                <th className="border border-[var(--card-border)] px-4 py-2 text-left">Interest Rate</th>
                <th className="border border-[var(--card-border)] px-4 py-2 text-right">15 Years</th>
                <th className="border border-[var(--card-border)] px-4 py-2 text-right">20 Years</th>
                <th className="border border-[var(--card-border)] px-4 py-2 text-right">30 Years</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2">6%</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$1,688</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$1,432</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$1,199</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2">7%</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$1,798</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$1,550</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$1,331</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2">8%</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$1,911</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$1,673</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$1,468</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2">9%</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$2,028</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$1,800</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$1,609</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">Tips to Reduce Your EMI</h2>
        <ol className="list-decimal pl-6 mb-6 space-y-3">
          <li>
            <strong>Negotiate your interest rate:</strong> Banks often have room to negotiate, especially if you have a good credit score (750+). Even a 0.25% reduction saves thousands over the loan tenure.
          </li>
          <li>
            <strong>Make a larger down payment:</strong> Saving up for a bigger down payment directly reduces your principal and therefore your EMI.
          </li>
          <li>
            <strong>Opt for a balance transfer:</strong> If interest rates drop or you find a better offer, transferring your loan to another lender can reduce your EMI.
          </li>
          <li>
            <strong>Make prepayments:</strong> Whenever you receive a bonus or windfall, use it to prepay part of the principal. This reduces the remaining balance and can lower your EMI or shorten your tenure.
          </li>
          <li>
            <strong>Choose the right tenure:</strong> Use the{" "}
            <a href="/tools/emi-calculator" className="text-[var(--primary)] hover:underline">
              EMI Calculator
            </a>{" "}
            to compare different tenure options and find the sweet spot between affordable EMI and minimum total interest.
          </li>
        </ol>

        <h2 className="text-2xl font-bold mt-10 mb-4">Fixed Rate vs Floating Rate EMI</h2>
        <p className="mb-4">
          <strong>Fixed-rate loans</strong> keep the same interest rate and EMI throughout the tenure. This gives you predictability in budgeting. <strong>Floating-rate loans</strong> are linked to a benchmark rate (like the repo rate) and can change periodically. While floating rates typically start lower, they carry the risk of increasing if market rates go up.
        </p>
        <p className="mb-6">
          For long-tenure loans like home loans, floating rates are more common in many countries. For short-tenure loans like car loans, fixed rates are often preferred for their simplicity.
        </p>

        <div className="my-8 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm font-medium">
            Related tools:{" "}
            <a href="/tools/mortgage-calculator" className="text-[var(--primary)] hover:underline">Mortgage Calculator</a>
            {" "}&middot;{" "}
            <a href="/tools/compound-interest-calculator" className="text-[var(--primary)] hover:underline">Compound Interest Calculator</a>
            {" "}&middot;{" "}
            <a href="/tools/auto-loan-calculator" className="text-[var(--primary)] hover:underline">Auto Loan Calculator</a>
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
