import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const TITLE = "How to Calculate Percentage - 5 Easy Methods with Examples";
const DESCRIPTION =
  "Master percentage calculations with 5 simple methods. Learn how to find percentage of a number, percentage increase/decrease, and quick mental math tricks.";
const SLUG = "how-to-calculate-percentage";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: SITE_NAME,
    type: "article",
    publishedTime: "2026-10-25T00:00:00Z",
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
    question: "How do I calculate the percentage of a number?",
    answer:
      "To find X% of a number, multiply the number by X and divide by 100. For example, 25% of 200 = 200 x 25 / 100 = 50. Alternatively, convert the percentage to a decimal (25% = 0.25) and multiply: 200 x 0.25 = 50.",
  },
  {
    question: "How do I calculate percentage increase?",
    answer:
      "Percentage increase = ((New Value - Old Value) / Old Value) x 100. For example, if a price goes from $80 to $100: ((100 - 80) / 80) x 100 = 25% increase.",
  },
  {
    question: "How do I find what percentage one number is of another?",
    answer:
      "Divide the part by the whole and multiply by 100. For example, 45 out of 200: (45 / 200) x 100 = 22.5%. This tells you that 45 is 22.5% of 200.",
  },
  {
    question: "What is the difference between percentage and percentile?",
    answer:
      "Percentage is a way of expressing a number as a fraction of 100. Percentile indicates the value below which a given percentage of observations fall. For example, scoring in the 90th percentile means you scored higher than 90% of test takers, regardless of your actual percentage score.",
  },
];

export default function HowToCalculatePercentage() {
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
    datePublished: "2026-10-25",
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
        <span className="text-[var(--foreground)]">How to Calculate Percentage</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
        {TITLE}
      </h1>
      <div className="flex items-center gap-4 text-sm text-[var(--muted)] mb-8">
        <span>October 25, 2026</span>
        <span>6 min read</span>
      </div>

      {/* Ad placeholder */}
      <div className="w-full h-24 bg-[var(--muted-bg)] rounded-lg flex items-center justify-center text-xs text-[var(--muted)] mb-8 border border-dashed border-[var(--card-border)]">
        Advertisement
      </div>

      <div className="prose-custom">
        <p className="text-lg leading-relaxed mb-6">
          Percentages are everywhere — from sale discounts at the store to interest rates on your savings account, from exam scores to tax calculations. Knowing how to calculate percentages quickly and accurately is one of the most practical math skills you can have. Here are five methods that cover every common scenario.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Method 1: Finding X% of a Number</h2>
        <p className="mb-2">
          <strong>Formula:</strong> X% of Y = (X &times; Y) / 100
        </p>
        <p className="mb-4">This is the most common percentage calculation. Some examples:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>20% of 150:</strong> (20 &times; 150) / 100 = <strong>30</strong></li>
          <li><strong>15% of 80:</strong> (15 &times; 80) / 100 = <strong>12</strong></li>
          <li><strong>7.5% of 1,200:</strong> (7.5 &times; 1,200) / 100 = <strong>90</strong></li>
        </ul>
        <p className="mb-6">
          <strong>Quick tip:</strong> To find 10% of any number, just move the decimal point one place to the left. 10% of 450 = 45. Then you can derive other percentages: 20% = double the 10%, 5% = half the 10%.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Method 2: What Percentage Is X of Y?</h2>
        <p className="mb-2">
          <strong>Formula:</strong> Percentage = (X / Y) &times; 100
        </p>
        <p className="mb-4">Use this when you know two numbers and need to find their percentage relationship:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>35 out of 200:</strong> (35 / 200) &times; 100 = <strong>17.5%</strong></li>
          <li><strong>72 out of 90:</strong> (72 / 90) &times; 100 = <strong>80%</strong></li>
          <li><strong>450 out of 600:</strong> (450 / 600) &times; 100 = <strong>75%</strong></li>
        </ul>
        <p className="mb-6">
          This is commonly used for exam scores, completion rates, and comparing proportions.
        </p>

        <div className="my-8 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm font-medium">
            Need quick results?{" "}
            <a href="/tools/percentage-calculator" className="text-[var(--primary)] font-bold hover:underline">
              Use our free Percentage Calculator
            </a>{" "}
            for instant answers with all five methods built in.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">Method 3: Percentage Increase</h2>
        <p className="mb-2">
          <strong>Formula:</strong> Percentage Increase = ((New &minus; Old) / Old) &times; 100
        </p>
        <p className="mb-4">Use this when a value goes up and you want to know by what percentage:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Price from $50 to $65:</strong> ((65 &minus; 50) / 50) &times; 100 = <strong>30% increase</strong>
          </li>
          <li>
            <strong>Salary from $60,000 to $72,000:</strong> ((72,000 &minus; 60,000) / 60,000) &times; 100 = <strong>20% increase</strong>
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">Method 4: Percentage Decrease</h2>
        <p className="mb-2">
          <strong>Formula:</strong> Percentage Decrease = ((Old &minus; New) / Old) &times; 100
        </p>
        <p className="mb-4">The same idea as increase, but in reverse:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Price from $120 to $90:</strong> ((120 &minus; 90) / 120) &times; 100 = <strong>25% decrease</strong>
          </li>
          <li>
            <strong>Weight from 180 lbs to 162 lbs:</strong> ((180 &minus; 162) / 180) &times; 100 = <strong>10% decrease</strong>
          </li>
        </ul>

        {/* Ad placeholder */}
        <div className="w-full h-24 bg-[var(--muted-bg)] rounded-lg flex items-center justify-center text-xs text-[var(--muted)] my-8 border border-dashed border-[var(--card-border)]">
          Advertisement
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">Method 5: Finding the Original Number</h2>
        <p className="mb-2">
          <strong>Formula:</strong> Original = Final &times; 100 / (100 + Percentage)
        </p>
        <p className="mb-4">
          If you know the final price after a markup or tax, and you want to find the original price:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Final price $118 with 18% tax:</strong> 118 &times; 100 / 118 = <strong>$100 original</strong>
          </li>
          <li>
            <strong>Sale price $60 after 25% discount:</strong> Original = 60 &times; 100 / 75 = <strong>$80 original</strong>
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">Quick Mental Math Tricks</h2>
        <p className="mb-4">Speed up your percentage calculations with these tricks:</p>
        <ol className="list-decimal pl-6 mb-6 space-y-3">
          <li>
            <strong>The flip trick:</strong> X% of Y = Y% of X. So 8% of 50 = 50% of 8 = 4. The second calculation is much easier.
          </li>
          <li>
            <strong>Break it down:</strong> 15% = 10% + 5%. Find 10% first (move decimal), then add half of that for the 5%.
          </li>
          <li>
            <strong>Double and halve:</strong> 25% = divide by 4. 75% = multiply by 3 and divide by 4. 33.3% = divide by 3.
          </li>
          <li>
            <strong>Use 1% as a base:</strong> Find 1% (divide by 100), then multiply. For 7% of 300: 1% = 3, so 7% = 21.
          </li>
        </ol>

        <h2 className="text-2xl font-bold mt-10 mb-4">Real-World Percentage Applications</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Shopping:</strong> Calculate sale prices using the{" "}
            <a href="/tools/discount-calculator" className="text-[var(--primary)] hover:underline">Discount Calculator</a>
          </li>
          <li><strong>Tax:</strong> Figure GST or sales tax with the{" "}
            <a href="/tools/gst-calculator" className="text-[var(--primary)] hover:underline">GST Calculator</a> or{" "}
            <a href="/tools/sales-tax-calculator" className="text-[var(--primary)] hover:underline">Sales Tax Calculator</a>
          </li>
          <li><strong>Finance:</strong> Interest rates and returns use the{" "}
            <a href="/tools/compound-interest-calculator" className="text-[var(--primary)] hover:underline">Compound Interest Calculator</a>
          </li>
          <li><strong>Health:</strong> Body fat percentage, BMI categories</li>
          <li><strong>Grades:</strong> Calculate exam percentage scores with the{" "}
            <a href="/tools/grade-calculator" className="text-[var(--primary)] hover:underline">Grade Calculator</a>
          </li>
        </ul>

        <div className="my-8 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm font-medium">
            Related tools:{" "}
            <a href="/tools/percentage-calculator" className="text-[var(--primary)] hover:underline">Percentage Calculator</a>
            {" "}&middot;{" "}
            <a href="/tools/discount-calculator" className="text-[var(--primary)] hover:underline">Discount Calculator</a>
            {" "}&middot;{" "}
            <a href="/tools/gst-calculator" className="text-[var(--primary)] hover:underline">GST Calculator</a>
            {" "}&middot;{" "}
            <a href="/tools/margin-calculator" className="text-[var(--primary)] hover:underline">Margin Calculator</a>
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
