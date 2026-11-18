import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const TITLE = "Compound Interest Formula Explained with Examples";
const DESCRIPTION =
  "Understand the compound interest formula, see the power of compounding with real examples, and compare growth at different rates and periods.";
const SLUG = "compound-interest-formula";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: SITE_NAME,
    type: "article",
    publishedTime: "2026-10-20T00:00:00Z",
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
    question: "What is compound interest?",
    answer:
      "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest, which is calculated only on the principal, compound interest allows your money to grow exponentially over time.",
  },
  {
    question: "How often is interest compounded?",
    answer:
      "Interest can be compounded annually, semi-annually, quarterly, monthly, weekly, or even daily. The more frequently interest is compounded, the more total interest you earn. Most savings accounts compound daily, while many investments compound monthly or quarterly.",
  },
  {
    question: "What is the Rule of 72?",
    answer:
      "The Rule of 72 is a quick way to estimate how long it takes for an investment to double. Divide 72 by the annual interest rate. For example, at 8% interest, your money doubles in approximately 72/8 = 9 years.",
  },
  {
    question: "Is compound interest always beneficial?",
    answer:
      "Compound interest works in your favor when you are saving or investing, as your returns generate additional returns. However, it works against you when you are borrowing, as unpaid interest gets added to the principal, increasing the total amount owed. Credit card debt is a common example where compounding hurts borrowers.",
  },
];

export default function CompoundInterestFormula() {
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
    datePublished: "2026-10-20",
    dateModified: "2026-11-01",
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
        <span className="text-[var(--foreground)]">Compound Interest Formula</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
        {TITLE}
      </h1>
      <div className="flex items-center gap-4 text-sm text-[var(--muted)] mb-8">
        <span>October 20, 2026</span>
        <span>7 min read</span>
      </div>

      {/* Ad placeholder */}
      <div className="w-full h-24 bg-[var(--muted-bg)] rounded-lg flex items-center justify-center text-xs text-[var(--muted)] mb-8 border border-dashed border-[var(--card-border)]">
        Advertisement
      </div>

      <div className="prose-custom">
        <p className="text-lg leading-relaxed mb-6">
          Albert Einstein reportedly called compound interest the &quot;eighth wonder of the world.&quot; Whether or not he actually said it, the power of compounding is undeniable. It is the single most important concept in personal finance and investing, and understanding it can help you build wealth over decades.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">The Compound Interest Formula</h2>
        <p className="mb-4">
          The formula to calculate compound interest is:
        </p>
        <div className="bg-[var(--muted-bg)] p-5 rounded-lg my-6 text-center border border-[var(--card-border)]">
          <p className="text-lg font-mono font-semibold">
            A = P &times; (1 + r/n)<sup>n&times;t</sup>
          </p>
        </div>
        <p className="mb-2">Where:</p>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li><strong>A</strong> = Final amount (principal + interest)</li>
          <li><strong>P</strong> = Initial principal (starting amount)</li>
          <li><strong>r</strong> = Annual interest rate (as a decimal)</li>
          <li><strong>n</strong> = Number of times interest is compounded per year</li>
          <li><strong>t</strong> = Number of years</li>
        </ul>
        <p className="mb-6">
          The compound interest earned is simply <strong>CI = A &minus; P</strong>.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Step-by-Step Example</h2>
        <p className="mb-4">
          Suppose you invest <strong>$10,000</strong> at <strong>8% annual interest</strong>, compounded monthly, for <strong>10 years</strong>.
        </p>
        <ol className="list-decimal pl-6 mb-6 space-y-3">
          <li>P = $10,000, r = 0.08, n = 12 (monthly), t = 10</li>
          <li>A = 10,000 &times; (1 + 0.08/12)<sup>12&times;10</sup></li>
          <li>A = 10,000 &times; (1.00667)<sup>120</sup></li>
          <li>A = 10,000 &times; 2.2196</li>
          <li><strong>A = $22,196</strong></li>
        </ol>
        <p className="mb-6">
          Your $10,000 grows to $22,196 — more than doubling in 10 years. The compound interest earned is <strong>$12,196</strong>. With simple interest at the same rate, you would have earned only $8,000 in interest.
        </p>

        <div className="my-8 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm font-medium">
            Try different scenarios with our{" "}
            <a href="/tools/compound-interest-calculator" className="text-[var(--primary)] font-bold hover:underline">
              Compound Interest Calculator
            </a>{" "}
            — see your money grow in real time.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">The Power of Compounding: Comparison Table</h2>
        <p className="mb-4">
          Here is how $10,000 grows at different interest rates over various time periods (compounded annually):
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--muted-bg)]">
                <th className="border border-[var(--card-border)] px-4 py-2 text-left">Rate</th>
                <th className="border border-[var(--card-border)] px-4 py-2 text-right">5 Years</th>
                <th className="border border-[var(--card-border)] px-4 py-2 text-right">10 Years</th>
                <th className="border border-[var(--card-border)] px-4 py-2 text-right">20 Years</th>
                <th className="border border-[var(--card-border)] px-4 py-2 text-right">30 Years</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2">5%</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$12,763</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$16,289</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$26,533</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$43,219</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2">8%</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$14,693</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$21,589</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$46,610</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$100,627</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2">10%</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$16,105</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$25,937</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$67,275</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$174,494</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2">12%</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$17,623</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$31,058</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$96,463</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-right">$299,599</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mb-6 text-sm text-[var(--muted)]">
          Notice how the difference between rates becomes dramatic over longer periods. At 12%, $10,000 becomes nearly $300,000 in 30 years without any additional contributions.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Simple Interest vs Compound Interest</h2>
        <p className="mb-4">
          <strong>Simple interest</strong> is calculated only on the original principal: SI = P &times; r &times; t. <strong>Compound interest</strong> is calculated on the principal plus accumulated interest. Over short periods, the difference is small. Over long periods, compounding creates exponentially more wealth.
        </p>
        <p className="mb-6">
          For a $10,000 investment at 8% over 30 years: simple interest gives you $24,000 in interest, while compound interest gives you approximately $90,627 — nearly four times more.
        </p>

        {/* Ad placeholder */}
        <div className="w-full h-24 bg-[var(--muted-bg)] rounded-lg flex items-center justify-center text-xs text-[var(--muted)] my-8 border border-dashed border-[var(--card-border)]">
          Advertisement
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">How Compounding Frequency Affects Returns</h2>
        <p className="mb-4">
          The more frequently interest is compounded, the more you earn. Here is $10,000 at 8% over 10 years with different compounding frequencies:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li><strong>Annually:</strong> $21,589</li>
          <li><strong>Quarterly:</strong> $22,080</li>
          <li><strong>Monthly:</strong> $22,196</li>
          <li><strong>Daily:</strong> $22,253</li>
        </ul>
        <p className="mb-6">
          The difference between annual and daily compounding over 10 years is about $664 on $10,000. For larger amounts, this gap becomes significant.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">The Rule of 72</h2>
        <p className="mb-4">
          The Rule of 72 provides a quick mental estimate for how long it takes your money to double. Simply divide 72 by the annual interest rate:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>At 6%: doubles in ~12 years</li>
          <li>At 8%: doubles in ~9 years</li>
          <li>At 10%: doubles in ~7.2 years</li>
          <li>At 12%: doubles in ~6 years</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">Practical Tips for Maximizing Compound Interest</h2>
        <ol className="list-decimal pl-6 mb-6 space-y-3">
          <li>
            <strong>Start early:</strong> Time is the most powerful variable in the compounding formula. Starting 10 years earlier can double or triple your final amount.
          </li>
          <li>
            <strong>Reinvest dividends and returns:</strong> Let your returns generate more returns instead of withdrawing them.
          </li>
          <li>
            <strong>Make regular contributions:</strong> Adding a monthly{" "}
            <a href="/tools/sip-calculator" className="text-[var(--primary)] hover:underline">
              SIP investment
            </a>{" "}
            dramatically accelerates wealth building through compounding.
          </li>
          <li>
            <strong>Avoid debt with compound interest:</strong> Credit card debt compounds against you. Pay off high-interest debt before investing.
          </li>
          <li>
            <strong>Choose higher compounding frequency:</strong> When comparing savings accounts, pick the one with more frequent compounding, all else being equal.
          </li>
        </ol>

        <div className="my-8 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm font-medium">
            Related tools:{" "}
            <a href="/tools/compound-interest-calculator" className="text-[var(--primary)] hover:underline">Compound Interest Calculator</a>
            {" "}&middot;{" "}
            <a href="/tools/sip-calculator" className="text-[var(--primary)] hover:underline">SIP Calculator</a>
            {" "}&middot;{" "}
            <a href="/tools/investment-calculator" className="text-[var(--primary)] hover:underline">Investment Calculator</a>
            {" "}&middot;{" "}
            <a href="/tools/401k-calculator" className="text-[var(--primary)] hover:underline">401k Calculator</a>
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
