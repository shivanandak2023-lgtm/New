"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Test Grade Calculator - Calculate Percentage & Letter Grade",
  description:
    "Free test grade calculator. Enter questions correct and total questions to get your percentage and letter grade. Customize grading scale and see a quick reference table.",
  keywords:
    "test grade calculator, grade calculator, percentage grade, letter grade calculator, test score calculator, grading scale, A B C D F grade",
};

interface GradeScale {
  letter: string;
  min: number;
}

const DEFAULT_SCALE: GradeScale[] = [
  { letter: "A+", min: 97 },
  { letter: "A", min: 93 },
  { letter: "A-", min: 90 },
  { letter: "B+", min: 87 },
  { letter: "B", min: 83 },
  { letter: "B-", min: 80 },
  { letter: "C+", min: 77 },
  { letter: "C", min: 73 },
  { letter: "C-", min: 70 },
  { letter: "D+", min: 67 },
  { letter: "D", min: 63 },
  { letter: "D-", min: 60 },
  { letter: "F", min: 0 },
];

function getLetterGrade(pct: number, scale: GradeScale[]): string {
  for (const g of scale) {
    if (pct >= g.min) return g.letter;
  }
  return "F";
}

export default function TestGradeCalculatorPage() {
  const [correct, setCorrect] = useState("42");
  const [total, setTotal] = useState("50");
  const [scale, setScale] = useState<GradeScale[]>(DEFAULT_SCALE);
  const [showEditor, setShowEditor] = useState(false);

  const correctNum = parseFloat(correct) || 0;
  const totalNum = parseFloat(total) || 0;

  const percentage = totalNum > 0 ? (correctNum / totalNum) * 100 : 0;
  const wrong = totalNum - correctNum;
  const letter = totalNum > 0 ? getLetterGrade(percentage, scale) : "-";

  const handleScaleChange = (index: number, field: "letter" | "min", value: string) => {
    const updated = [...scale];
    if (field === "letter") {
      updated[index] = { ...updated[index], letter: value };
    } else {
      updated[index] = { ...updated[index], min: parseFloat(value) || 0 };
    }
    setScale(updated);
  };

  // Quick reference: how many wrong out of N total
  const refTotals = [10, 15, 20, 25, 30, 40, 50, 100];

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/test-grade-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/test-grade-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Test Grade Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Enter the number of questions correct and total questions to get your percentage and letter grade. Customize the grading scale to match your school.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Questions Correct</label>
              <input
                type="number"
                value={correct}
                onChange={(e) => setCorrect(e.target.value)}
                className="input-field"
                placeholder="e.g., 42"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Questions</label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="input-field"
                placeholder="e.g., 50"
                min="1"
              />
            </div>
          </div>
        </div>

        {totalNum > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Percentage</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{percentage.toFixed(1)}%</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Letter Grade</p>
                <p className="text-2xl font-bold text-green-700">{letter}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Wrong Answers</p>
                <p className="text-2xl font-bold text-amber-700">{wrong >= 0 ? wrong : 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Grading Scale Editor */}
        <div className="tool-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Grading Scale</h2>
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              {showEditor ? "Hide Editor" : "Customize Scale"}
            </button>
          </div>

          {showEditor ? (
            <div className="space-y-2">
              {scale.map((g, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={g.letter}
                    onChange={(e) => handleScaleChange(i, "letter", e.target.value)}
                    className="input-field w-20 text-center"
                  />
                  <span className="text-sm text-[var(--muted)]">Min %:</span>
                  <input
                    type="number"
                    value={g.min}
                    onChange={(e) => handleScaleChange(i, "min", e.target.value)}
                    className="input-field w-24 text-center"
                    step="1"
                  />
                </div>
              ))}
              <button
                onClick={() => setScale(DEFAULT_SCALE)}
                className="text-sm text-[var(--muted)] hover:underline mt-2"
              >
                Reset to default
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Letter Grade</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Percentage Range</th>
                  </tr>
                </thead>
                <tbody>
                  {scale.map((g, i) => (
                    <tr key={i} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">{g.letter}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2">
                        {g.min}% {i === 0 ? "- 100%" : `- ${scale[i - 1].min - 1}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Reference Table */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Quick Reference: Score to Grade</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Total Q</th>
                  {[0, 1, 2, 3, 5, 10].map((w) => (
                    <th key={w} className="border border-[var(--card-border)] px-3 py-2 text-center">{w} Wrong</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {refTotals.map((t) => (
                  <tr key={t} className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">{t}</td>
                    {[0, 1, 2, 3, 5, 10].map((w) => {
                      const p = t > 0 ? ((t - w) / t) * 100 : 0;
                      return (
                        <td key={w} className="border border-[var(--card-border)] px-3 py-2 text-center">
                          {p >= 0 ? `${p.toFixed(0)}% (${getLetterGrade(p, scale)})` : "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Test Grade</h2>
          <p>
            To calculate your test grade, divide the number of correct answers by the total number of questions, then
            multiply by 100 to get the percentage. For example, 42 correct out of 50 questions = 42/50 x 100 = 84%.
          </p>

          <h2>Standard Grading Scale</h2>
          <p>
            Most US schools use the standard grading scale: A (90-100%), B (80-89%), C (70-79%), D (60-69%), F (below 60%).
            Many schools also use plus and minus modifiers (A+, A, A-, etc.) for more granular grading.
          </p>

          <h3>Weighted vs. Unweighted Grades</h3>
          <p>
            This calculator uses unweighted grades. In a weighted system, different assignments carry different weights
            (e.g., exams might be worth 60% and homework 40%). For weighted grade calculations, use a weighted grade
            calculator.
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
            name: "Test Grade Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/test-grade-calculator`,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
