import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Blog - Financial Guides & Calculator Tips | ${SITE_NAME}`,
  description:
    "Expert guides on EMI calculation, compound interest, percentage formulas, BMI charts, and mortgage rates. Learn with examples and use our free calculators.",
  openGraph: {
    title: `Blog - Financial Guides & Calculator Tips | ${SITE_NAME}`,
    description:
      "Expert guides on EMI calculation, compound interest, percentage formulas, BMI charts, and mortgage rates.",
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

const BLOG_POSTS = [
  {
    slug: "how-to-calculate-emi",
    title: "How to Calculate EMI - Formula, Examples & Tips (2026)",
    description:
      "Learn the EMI formula step by step, see worked examples, and discover tips to reduce your monthly installments.",
    category: "Finance",
    date: "2026-10-15",
    readTime: "8 min read",
  },
  {
    slug: "compound-interest-formula",
    title: "Compound Interest Formula Explained with Examples",
    description:
      "Understand the power of compounding, break down the formula, and see comparison tables for different rates and periods.",
    category: "Finance",
    date: "2026-10-20",
    readTime: "7 min read",
  },
  {
    slug: "how-to-calculate-percentage",
    title: "How to Calculate Percentage - 5 Easy Methods with Examples",
    description:
      "Master percentage calculations with 5 simple methods, real-world examples, and quick mental math tricks.",
    category: "Math",
    date: "2026-10-25",
    readTime: "6 min read",
  },
  {
    slug: "bmi-chart-men-women",
    title: "BMI Chart for Men & Women - Ranges, Calculation & Health Risks",
    description:
      "Complete BMI chart with health categories, calculation method, and important limitations to know.",
    category: "Health",
    date: "2026-11-01",
    readTime: "7 min read",
  },
  {
    slug: "mortgage-rates-guide",
    title: "Mortgage Rates 2026 - Current Rates, How They Work & Tips",
    description:
      "Understand fixed vs variable mortgage rates, how they are determined, and tips to secure the best rate.",
    category: "Finance",
    date: "2026-11-05",
    readTime: "8 min read",
  },
];

const categoryColors: Record<string, string> = {
  Finance: "bg-green-100 text-green-800",
  Math: "bg-blue-100 text-blue-800",
  Health: "bg-red-100 text-red-800",
};

export default function BlogIndexPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          Blog
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-2xl">
          Expert guides, formulas, and tips to help you make smarter financial
          and mathematical decisions.
        </p>
      </div>

      <div className="grid gap-6">
        {BLOG_POSTS.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block tool-card hover:shadow-lg transition-shadow group"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      categoryColors[post.category] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {post.date}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-lg font-bold group-hover:text-[var(--primary)] transition-colors mb-1">
                  {post.title}
                </h2>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {post.description}
                </p>
              </div>
              <span className="text-[var(--primary)] text-sm font-medium shrink-0 self-center">
                Read &rarr;
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-12 p-6 bg-[var(--muted-bg)] rounded-xl text-center">
        <h2 className="text-lg font-bold mb-2">Need a quick calculation?</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Try our 110+ free online calculators and tools.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2.5 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
          Browse All Tools
        </a>
      </div>
    </section>
  );
}
