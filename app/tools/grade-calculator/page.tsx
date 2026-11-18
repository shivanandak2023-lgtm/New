"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Grade Calculator - Final Grade & Weighted Grade Calculator",
  description:
    "Free grade calculator with two modes: calculate what you need on the final exam, or compute your weighted average from multiple categories. See your letter grade instantly.",
  keywords:
    "grade calculator, final grade calculator, weighted grade calculator, test grade calculator, what grade do i need, class grade calculator, gpa calculator",
};

interface Category {
  id: number;
  name: string;
  weight: string;
  score: string;
}

function getLetterGrade(score: number): string {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 67) return "D+";
  if (score >= 63) return "D";
  if (score >= 60) return "D-";
  return "F";
}

function getGradeColor(score: number): string {
  if (score >= 90) return "text-green-700";
  if (score >= 80) return "text-blue-700";
  if (score >= 70) return "text-yellow-700";
  if (score >= 60) return "text-orange-600";
  return "text-red-600";
}

export default function GradeCalculatorPage() {
  const [mode, setMode] = useState<"final" | "weighted">("final");

  const [currentGrade, setCurrentGrade] = useState<string>("85");
  const [finalWeight, setFinalWeight] = useState<string>("30");
  const [desiredGrade, setDesiredGrade] = useState<string>("90");
  const [finalResult, setFinalResult] = useState<number | null>(null);

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Homework", weight: "20", score: "95" },
    { id: 2, name: "Quizzes", weight: "15", score: "88" },
    { id: 3, name: "Midterm", weight: "25", score: "82" },
    { id: 4, name: "Final Exam", weight: "40", score: "78" },
  ]);
  const [weightedResult, setWeightedResult] = useState<number | null>(null);

  function calculateFinal() {
    const current = parseFloat(currentGrade);
    const weight = parseFloat(finalWeight) / 100;
    const desired = parseFloat(desiredGrade);

    if (isNaN(current) || isNaN(weight) || isNaN(desired) || weight <= 0 || weight > 1) return;

    const needed = (desired - current * (1 - weight)) / weight;
    setFinalResult(needed);
  }

  function calculateWeighted() {
    let totalWeight = 0;
    let weightedSum = 0;

    for (const cat of categories) {
      const w = parseFloat(cat.weight) || 0;
      const s = parseFloat(cat.score) || 0;
      totalWeight += w;
      weightedSum += (w / 100) * s;
    }

    if (totalWeight === 0) return;

    const average = totalWeight !== 100
      ? (weightedSum / (totalWeight / 100))
      : weightedSum;

    setWeightedResult(average);
  }

  function updateCategory(id: number, field: string, value: string) {
    setCategories(categories.map((c) => c.id === id ? { ...c, [field]: value } : c));
  }

  function addCategory() {
    setCategories([...categories, { id: categories.length + 1, name: `Category ${categories.length + 1}`, weight: "10", score: "80" }]);
  }

  function removeCategory(id: number) {
    if (categories.length > 1) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  }

  const totalWeight = categories.reduce((s, c) => s + (parseFloat(c.weight) || 0), 0);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/grade-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/grade-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Grade Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate what score you need on your final exam, or compute your weighted average grade from multiple assignment categories.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode("final")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === "final" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}
          >
            Final Grade Calculator
          </button>
          <button
            onClick={() => setMode("weighted")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === "weighted" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}
          >
            Weighted Grade Calculator
          </button>
        </div>

        {mode === "final" && (
          <>
            <div className="tool-card mb-8">
              <h2 className="text-lg font-bold mb-4">What Score Do I Need on My Final?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Grade (%)</label>
                  <input
                    type="number"
                    value={currentGrade}
                    onChange={(e) => setCurrentGrade(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 85"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Final Exam Weight (%)</label>
                  <input
                    type="number"
                    value={finalWeight}
                    onChange={(e) => setFinalWeight(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Desired Grade (%)</label>
                  <input
                    type="number"
                    value={desiredGrade}
                    onChange={(e) => setDesiredGrade(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 90"
                  />
                </div>
              </div>

              <button onClick={calculateFinal} className="btn-primary mt-6">
                Calculate Needed Score
              </button>
            </div>

            {finalResult !== null && (
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="result-card text-center">
                    <p className="text-sm text-[var(--muted)] mb-1">Score Needed on Final</p>
                    <p className={`text-2xl font-bold ${finalResult <= 100 ? "text-[var(--primary)]" : "text-red-600"}`}>
                      {finalResult.toFixed(1)}%
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      {finalResult > 100
                        ? "Not possible - score exceeds 100%"
                        : finalResult < 0
                        ? "You already have your desired grade!"
                        : `To get a ${getLetterGrade(parseFloat(desiredGrade))} in the class`}
                    </p>
                  </div>
                  <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                    <p className="text-sm text-[var(--muted)] mb-1">Target Letter Grade</p>
                    <p className={`text-2xl font-bold ${getGradeColor(parseFloat(desiredGrade))}`}>
                      {getLetterGrade(parseFloat(desiredGrade))}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-1">{desiredGrade}% needed overall</p>
                  </div>
                </div>

                <div className="tool-card mb-6">
                  <h2 className="text-lg font-bold mb-4">What If Scenarios</h2>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-[var(--muted-bg)]">
                        <th className="border border-[var(--card-border)] px-3 py-2 text-left">Target Grade</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Score Needed on Final</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-center">Possible?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[90, 85, 80, 75, 70, 65, 60].map((target) => {
                        const weight = parseFloat(finalWeight) / 100;
                        const current = parseFloat(currentGrade);
                        const needed = (target - current * (1 - weight)) / weight;
                        return (
                          <tr key={target} className="hover:bg-[var(--muted-bg)]">
                            <td className="border border-[var(--card-border)] px-3 py-2">{getLetterGrade(target)} ({target}%)</td>
                            <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{needed.toFixed(1)}%</td>
                            <td className="border border-[var(--card-border)] px-3 py-2 text-center">
                              {needed <= 100 && needed >= 0 ? (
                                <span className="text-green-700 font-semibold">Yes</span>
                              ) : (
                                <span className="text-red-600 font-semibold">No</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {mode === "weighted" && (
          <>
            <div className="tool-card mb-8">
              <h2 className="text-lg font-bold mb-4">Weighted Grade Calculator</h2>
              <table className="w-full text-sm border-collapse mb-4">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Category</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-center">Weight (%)</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-center">Your Score (%)</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-center w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => updateCategory(cat.id, "name", e.target.value)}
                          className="input-field w-full"
                        />
                      </td>
                      <td className="border border-[var(--card-border)] px-3 py-2">
                        <input
                          type="number"
                          value={cat.weight}
                          onChange={(e) => updateCategory(cat.id, "weight", e.target.value)}
                          className="input-field w-full text-center"
                        />
                      </td>
                      <td className="border border-[var(--card-border)] px-3 py-2">
                        <input
                          type="number"
                          value={cat.score}
                          onChange={(e) => updateCategory(cat.id, "score", e.target.value)}
                          className="input-field w-full text-center"
                        />
                      </td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-center">
                        {categories.length > 1 && (
                          <button onClick={() => removeCategory(cat.id)} className="text-red-500 text-xs hover:underline">
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className={`text-xs mb-4 ${totalWeight === 100 ? "text-green-700" : "text-orange-600"}`}>
                Total Weight: {totalWeight}% {totalWeight !== 100 && "(should be 100%)"}
              </p>

              <div className="flex gap-4">
                <button onClick={addCategory} className="text-sm text-[var(--primary)] hover:underline">
                  + Add Category
                </button>
              </div>

              <button onClick={calculateWeighted} className="btn-primary mt-6">
                Calculate Weighted Grade
              </button>
            </div>

            {weightedResult !== null && (
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="result-card text-center">
                    <p className="text-sm text-[var(--muted)] mb-1">Weighted Average</p>
                    <p className={`text-2xl font-bold ${getGradeColor(weightedResult)}`}>
                      {weightedResult.toFixed(2)}%
                    </p>
                  </div>
                  <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                    <p className="text-sm text-[var(--muted)] mb-1">Letter Grade</p>
                    <p className={`text-2xl font-bold ${getGradeColor(weightedResult)}`}>
                      {getLetterGrade(weightedResult)}
                    </p>
                  </div>
                </div>

                <div className="tool-card mb-6">
                  <h2 className="text-lg font-bold mb-4">Category Contributions</h2>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-[var(--muted-bg)]">
                        <th className="border border-[var(--card-border)] px-3 py-2 text-left">Category</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Weight</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Score</th>
                        <th className="border border-[var(--card-border)] px-3 py-2 text-right">Contribution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => {
                        const contribution = ((parseFloat(cat.weight) || 0) / 100) * (parseFloat(cat.score) || 0);
                        return (
                          <tr key={cat.id} className="hover:bg-[var(--muted-bg)]">
                            <td className="border border-[var(--card-border)] px-3 py-2">{cat.name}</td>
                            <td className="border border-[var(--card-border)] px-3 py-2 text-right">{cat.weight}%</td>
                            <td className="border border-[var(--card-border)] px-3 py-2 text-right">{cat.score}%</td>
                            <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{contribution.toFixed(2)}%</td>
                          </tr>
                        );
                      })}
                      <tr className="bg-blue-50">
                        <td className="border border-[var(--card-border)] px-3 py-2 font-bold" colSpan={3}>Weighted Average</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{weightedResult.toFixed(2)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Letter Grade Scale</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--muted-bg)]">
                <th className="border border-[var(--card-border)] px-3 py-2 text-left">Letter Grade</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-right">Percentage Range</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-right">GPA Points</th>
              </tr>
            </thead>
            <tbody>
              {[
                { letter: "A+", range: "97-100%", gpa: "4.0" },
                { letter: "A", range: "93-96%", gpa: "4.0" },
                { letter: "A-", range: "90-92%", gpa: "3.7" },
                { letter: "B+", range: "87-89%", gpa: "3.3" },
                { letter: "B", range: "83-86%", gpa: "3.0" },
                { letter: "B-", range: "80-82%", gpa: "2.7" },
                { letter: "C+", range: "77-79%", gpa: "2.3" },
                { letter: "C", range: "73-76%", gpa: "2.0" },
                { letter: "C-", range: "70-72%", gpa: "1.7" },
                { letter: "D+", range: "67-69%", gpa: "1.3" },
                { letter: "D", range: "63-66%", gpa: "1.0" },
                { letter: "D-", range: "60-62%", gpa: "0.7" },
                { letter: "F", range: "0-59%", gpa: "0.0" },
              ].map((g) => (
                <tr key={g.letter} className="hover:bg-[var(--muted-bg)]">
                  <td className={`border border-[var(--card-border)] px-3 py-2 font-semibold ${getGradeColor(g.letter === "F" ? 50 : parseInt(g.range))}`}>{g.letter}</td>
                  <td className="border border-[var(--card-border)] px-3 py-2 text-right">{g.range}</td>
                  <td className="border border-[var(--card-border)] px-3 py-2 text-right">{g.gpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Your Final Grade</h2>
          <p>
            To figure out what score you need on your final exam, use this formula:
          </p>
          <p><strong>Needed Score = (Desired Grade - Current Grade x (1 - Final Weight)) / Final Weight</strong></p>
          <p>
            For example, if you have an 85% and want a 90% with a final worth 30%:
            Needed = (90 - 85 x 0.7) / 0.3 = (90 - 59.5) / 0.3 = 101.7%
          </p>

          <h2>How Weighted Grades Work</h2>
          <p>
            Weighted grades assign different importance to different categories. Each category&apos;s contribution equals
            its weight multiplied by your score. The total weighted average is the sum of all contributions.
          </p>

          <h3>Example Weighted Calculation</h3>
          <ul>
            <li>Homework (20% weight) x 95% score = 19% contribution</li>
            <li>Midterm (30% weight) x 80% score = 24% contribution</li>
            <li>Final (50% weight) x 85% score = 42.5% contribution</li>
            <li><strong>Weighted Average = 85.5%</strong></li>
          </ul>

          <h3>Tips for Improving Your Grade</h3>
          <ul>
            <li>Focus on high-weight categories (finals, major projects) for maximum impact</li>
            <li>Use this calculator early in the semester to set goals</li>
            <li>A strong final exam score can significantly boost your overall grade</li>
            <li>Talk to your professor about extra credit opportunities</li>
          </ul>
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Grade Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/grade-calculator`,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
