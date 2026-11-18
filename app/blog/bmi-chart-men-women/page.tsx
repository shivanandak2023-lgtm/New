import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const TITLE = "BMI Chart for Men & Women - Ranges, Calculation & Health Risks";
const DESCRIPTION =
  "Complete BMI chart with health categories for men and women. Learn how to calculate BMI, understand healthy ranges, and know the limitations of BMI.";
const SLUG = "bmi-chart-men-women";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: SITE_NAME,
    type: "article",
    publishedTime: "2026-11-01T00:00:00Z",
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
    question: "What is a healthy BMI range?",
    answer:
      "A healthy BMI for adults is between 18.5 and 24.9. Below 18.5 is considered underweight, 25-29.9 is overweight, and 30 or above is classified as obese. These ranges apply to both men and women, though body composition differences mean BMI may be interpreted slightly differently.",
  },
  {
    question: "Is BMI accurate for athletes and muscular people?",
    answer:
      "BMI can be misleading for athletes, bodybuilders, and people with high muscle mass because muscle weighs more than fat. A muscular person may have a high BMI but low body fat. In such cases, body fat percentage, waist circumference, or DEXA scans provide better health assessments.",
  },
  {
    question: "Does BMI differ by age?",
    answer:
      "For adults 20 and older, standard BMI categories apply regardless of age. For children and teens (ages 2-19), BMI is interpreted using age-and-sex-specific percentiles because body composition changes as children grow. A BMI-for-age percentile above the 85th is considered overweight.",
  },
  {
    question: "What health risks are associated with high BMI?",
    answer:
      "A BMI of 30 or higher is associated with increased risk of heart disease, type 2 diabetes, high blood pressure, sleep apnea, certain cancers, and joint problems. Even a BMI in the overweight range (25-29.9) carries elevated risk compared to the normal range. However, BMI is just one factor — overall lifestyle, diet, and activity level also matter significantly.",
  },
];

export default function BMIChartPage() {
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
    datePublished: "2026-11-01",
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
        <span className="text-[var(--foreground)]">BMI Chart for Men & Women</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
        {TITLE}
      </h1>
      <div className="flex items-center gap-4 text-sm text-[var(--muted)] mb-8">
        <span>November 1, 2026</span>
        <span>7 min read</span>
      </div>

      {/* Ad placeholder */}
      <div className="w-full h-24 bg-[var(--muted-bg)] rounded-lg flex items-center justify-center text-xs text-[var(--muted)] mb-8 border border-dashed border-[var(--card-border)]">
        Advertisement
      </div>

      <div className="prose-custom">
        <p className="text-lg leading-relaxed mb-6">
          Body Mass Index (BMI) is one of the most widely used screening tools to assess whether a person has a healthy body weight relative to their height. While not a perfect measure, it provides a quick and useful starting point for understanding weight-related health risks.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">What Is BMI?</h2>
        <p className="mb-4">
          BMI is a simple ratio of your weight to the square of your height. It was developed by Belgian mathematician Adolphe Quetelet in the 1830s and has been used as a population-level health indicator ever since. The formula works with both metric and imperial measurements.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">BMI Formula</h2>
        <div className="bg-[var(--muted-bg)] p-5 rounded-lg my-6 border border-[var(--card-border)]">
          <p className="font-mono font-semibold mb-2">
            Metric: BMI = weight (kg) / height (m)<sup>2</sup>
          </p>
          <p className="font-mono font-semibold">
            Imperial: BMI = (weight (lbs) &times; 703) / height (inches)<sup>2</sup>
          </p>
        </div>
        <p className="mb-6">
          For example, a person who weighs 70 kg and is 1.75 m tall has a BMI of 70 / (1.75)<sup>2</sup> = 70 / 3.0625 = <strong>22.9</strong>, which falls in the normal range.
        </p>

        <div className="my-8 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm font-medium">
            Check your BMI instantly with our{" "}
            <a href="/tools/bmi-calculator" className="text-[var(--primary)] font-bold hover:underline">
              free BMI Calculator
            </a>{" "}
            — includes category, health tips, and history tracking.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">BMI Categories Chart</h2>
        <p className="mb-4">
          The World Health Organization (WHO) defines the following BMI categories for adults:
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--muted-bg)]">
                <th className="border border-[var(--card-border)] px-4 py-2 text-left">BMI Range</th>
                <th className="border border-[var(--card-border)] px-4 py-2 text-left">Category</th>
                <th className="border border-[var(--card-border)] px-4 py-2 text-left">Health Risk</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2 font-mono">Below 16.0</td>
                <td className="border border-[var(--card-border)] px-4 py-2">Severe Thinness</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-red-600">Very High</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2 font-mono">16.0 - 16.9</td>
                <td className="border border-[var(--card-border)] px-4 py-2">Moderate Thinness</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-orange-600">High</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2 font-mono">17.0 - 18.4</td>
                <td className="border border-[var(--card-border)] px-4 py-2">Mild Thinness</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-yellow-600">Moderate</td>
              </tr>
              <tr className="bg-green-50 dark:bg-green-950">
                <td className="border border-[var(--card-border)] px-4 py-2 font-mono font-bold">18.5 - 24.9</td>
                <td className="border border-[var(--card-border)] px-4 py-2 font-bold">Normal</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-green-600 font-bold">Low</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2 font-mono">25.0 - 29.9</td>
                <td className="border border-[var(--card-border)] px-4 py-2">Overweight</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-yellow-600">Moderate</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2 font-mono">30.0 - 34.9</td>
                <td className="border border-[var(--card-border)] px-4 py-2">Obese Class I</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-orange-600">High</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2 font-mono">35.0 - 39.9</td>
                <td className="border border-[var(--card-border)] px-4 py-2">Obese Class II</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-red-600">Very High</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-4 py-2 font-mono">40.0+</td>
                <td className="border border-[var(--card-border)] px-4 py-2">Obese Class III</td>
                <td className="border border-[var(--card-border)] px-4 py-2 text-red-700 font-bold">Extremely High</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">BMI Differences Between Men and Women</h2>
        <p className="mb-4">
          While the same BMI categories apply to both men and women, there are important physiological differences:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Women</strong> naturally carry more body fat than men (20-25% vs 15-20% for healthy adults). A woman with a BMI of 24 may have a higher body fat percentage than a man with the same BMI.</li>
          <li><strong>Men</strong> tend to have more muscle mass, which can push BMI higher even at healthy body fat levels.</li>
          <li><strong>Fat distribution</strong> differs: men tend to store fat around the abdomen (visceral fat), while women store it in the hips and thighs. Abdominal fat carries higher cardiovascular risk regardless of BMI.</li>
        </ul>

        {/* Ad placeholder */}
        <div className="w-full h-24 bg-[var(--muted-bg)] rounded-lg flex items-center justify-center text-xs text-[var(--muted)] my-8 border border-dashed border-[var(--card-border)]">
          Advertisement
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">Height-Weight BMI Reference Table</h2>
        <p className="mb-4">
          Quick reference for normal BMI weight ranges by height:
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--muted-bg)]">
                <th className="border border-[var(--card-border)] px-3 py-2 text-left">Height</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-right">Min Normal (BMI 18.5)</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-right">Max Normal (BMI 24.9)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-[var(--card-border)] px-3 py-2">5&apos;0&quot; (152 cm)</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">95 lbs (43 kg)</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">128 lbs (58 kg)</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-3 py-2">5&apos;4&quot; (163 cm)</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">108 lbs (49 kg)</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">145 lbs (66 kg)</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-3 py-2">5&apos;8&quot; (173 cm)</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">122 lbs (55 kg)</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">164 lbs (74 kg)</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-3 py-2">6&apos;0&quot; (183 cm)</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">136 lbs (62 kg)</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">184 lbs (83 kg)</td>
              </tr>
              <tr>
                <td className="border border-[var(--card-border)] px-3 py-2">6&apos;4&quot; (193 cm)</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">152 lbs (69 kg)</td>
                <td className="border border-[var(--card-border)] px-3 py-2 text-right">204 lbs (93 kg)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">Limitations of BMI</h2>
        <p className="mb-4">
          BMI is a useful screening tool, but it has significant limitations:
        </p>
        <ol className="list-decimal pl-6 mb-6 space-y-3">
          <li>
            <strong>Does not distinguish fat from muscle:</strong> Athletes and bodybuilders may be classified as overweight or obese despite having low body fat.
          </li>
          <li>
            <strong>Ignores fat distribution:</strong> Two people with the same BMI can have very different health risks depending on where fat is stored. Visceral (abdominal) fat is more dangerous than subcutaneous fat.
          </li>
          <li>
            <strong>Not accurate for all ethnicities:</strong> Research shows that health risks associated with BMI vary by ethnicity. For example, Asian populations may face higher risks at lower BMI values.
          </li>
          <li>
            <strong>Age-related changes:</strong> Older adults naturally lose muscle and gain fat, but their BMI may remain the same, masking increased health risk.
          </li>
          <li>
            <strong>Not suitable for children:</strong> Children and teens need age-and-sex-specific BMI percentile charts rather than adult categories.
          </li>
        </ol>

        <h2 className="text-2xl font-bold mt-10 mb-4">Better Alternatives to BMI</h2>
        <p className="mb-4">
          For a more complete health picture, consider these measures alongside BMI:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Waist circumference:</strong> Greater than 40 inches (men) or 35 inches (women) indicates increased health risk.</li>
          <li><strong>Waist-to-hip ratio:</strong> Above 0.9 (men) or 0.85 (women) suggests elevated cardiovascular risk.</li>
          <li><strong>Body fat percentage:</strong> Measured via calipers, bioimpedance, or DEXA scan for a more accurate fat assessment.</li>
          <li><strong>Waist-to-height ratio:</strong> Keeping your waist circumference less than half your height is a simple health goal.</li>
        </ul>

        <div className="my-8 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm font-medium">
            Related tools:{" "}
            <a href="/tools/bmi-calculator" className="text-[var(--primary)] hover:underline">BMI Calculator</a>
            {" "}&middot;{" "}
            <a href="/tools/calorie-calculator" className="text-[var(--primary)] hover:underline">Calorie Calculator</a>
            {" "}&middot;{" "}
            <a href="/tools/pregnancy-due-date-calculator" className="text-[var(--primary)] hover:underline">Pregnancy Due Date Calculator</a>
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
