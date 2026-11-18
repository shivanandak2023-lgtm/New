"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "GPA Calculator - Calculate Your Grade Point Average",
  description:
    "Free GPA Calculator to compute your cumulative GPA from grades and credit hours. Supports 4.0 and 10.0 grading scales for college and university students.",
  keywords:
    "gpa calculator, grade point average, college gpa calculator, cgpa calculator, sgpa to cgpa, cumulative gpa",
};

type Scale = "4.0" | "10.0";

interface Course {
  id: number;
  name: string;
  credits: string;
  grade: string;
}

const GRADES_4: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0.0,
};

const GRADES_10: Record<string, number> = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  D: 4,
  F: 0,
};

let nextId = 1;

function makeEmptyCourse(): Course {
  return { id: nextId++, name: "", credits: "3", grade: "A" };
}

export default function GpaCalculatorPage() {
  const [scale, setScale] = useState<Scale>("4.0");
  const [courses, setCourses] = useState<Course[]>([
    makeEmptyCourse(),
    makeEmptyCourse(),
    makeEmptyCourse(),
  ]);
  const [result, setResult] = useState<{
    gpa: number;
    totalCredits: number;
    totalPoints: number;
  } | null>(null);

  const gradeMap = scale === "4.0" ? GRADES_4 : GRADES_10;
  const gradeKeys = Object.keys(gradeMap);

  function updateCourse(id: number, field: keyof Course, value: string) {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  }

  function addCourse() {
    setCourses((prev) => [...prev, makeEmptyCourse()]);
  }

  function removeCourse(id: number) {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  function calculate() {
    let totalCredits = 0;
    let totalPoints = 0;

    for (const c of courses) {
      const credits = parseFloat(c.credits);
      if (isNaN(credits) || credits <= 0) continue;
      const gradePoint = gradeMap[c.grade];
      if (gradePoint === undefined) continue;
      totalCredits += credits;
      totalPoints += credits * gradePoint;
    }

    if (totalCredits === 0) return;
    setResult({
      gpa: totalPoints / totalCredits,
      totalCredits,
      totalPoints,
    });
  }

  function reset() {
    setCourses([makeEmptyCourse(), makeEmptyCourse(), makeEmptyCourse()]);
    setResult(null);
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/gpa-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/gpa-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">
            &larr; All Tools
          </a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">GPA Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your cumulative GPA from course grades and credit hours. Supports both 4.0 and 10.0 grading scales.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Scale selector */}
        <div className="flex gap-2 mb-6">
          {(["4.0", "10.0"] as Scale[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                setScale(s);
                setResult(null);
                setCourses((prev) =>
                  prev.map((c) => ({ ...c, grade: s === "4.0" ? "A" : "A" }))
                );
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                scale === s
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-gray-200"
              }`}
            >
              {s} Scale
            </button>
          ))}
        </div>

        <div className="tool-card mb-8">
          <h2 className="font-bold text-lg mb-4">Enter Your Courses</h2>

          {/* Header row */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_100px_100px_40px] gap-3 mb-2 text-sm font-medium text-[var(--muted)]">
            <span>Course Name</span>
            <span>Credits</span>
            <span>Grade</span>
            <span></span>
          </div>

          {courses.map((course) => (
            <div
              key={course.id}
              className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px_40px] gap-3 mb-3 items-end"
            >
              <input
                type="text"
                value={course.name}
                onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                className="input-field"
                placeholder="Course name (optional)"
              />
              <input
                type="number"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                className="input-field"
                placeholder="Credits"
                min="0"
                step="0.5"
              />
              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                className="input-field"
              >
                {gradeKeys.map((g) => (
                  <option key={g} value={g}>
                    {g} ({gradeMap[g]})
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeCourse(course.id)}
                className="text-red-500 hover:text-red-700 text-xl font-bold pb-1 cursor-pointer"
                title="Remove course"
              >
                &times;
              </button>
            </div>
          ))}

          <div className="flex flex-wrap gap-3 mt-4">
            <button onClick={addCourse} className="btn-secondary text-sm">
              + Add Course
            </button>
            <button onClick={calculate} className="btn-primary">
              Calculate GPA
            </button>
            <button onClick={reset} className="btn-secondary text-sm">
              Reset
            </button>
          </div>

          {result && (
            <div className="result-card mt-6">
              <p className="text-sm text-[var(--muted)] mb-1">Your Cumulative GPA</p>
              <p className="text-4xl font-bold text-[var(--primary)]">
                {result.gpa.toFixed(2)}
                <span className="text-base font-normal text-[var(--muted)] ml-2">
                  / {scale}
                </span>
              </p>
              <div className="flex flex-wrap gap-6 mt-3 text-sm text-[var(--muted)]">
                <span>Total Credits: <strong className="text-[var(--foreground)]">{result.totalCredits}</strong></span>
                <span>Total Quality Points: <strong className="text-[var(--foreground)]">{result.totalPoints.toFixed(2)}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Grade reference table */}
        <div className="tool-card mb-8">
          <h2 className="font-bold text-lg mb-4">Grade Point Reference ({scale} Scale)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Grade</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Points</th>
                </tr>
              </thead>
              <tbody>
                {gradeKeys.map((g) => (
                  <tr key={g}>
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{g}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2">{gradeMap[g].toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate GPA</h2>
          <p>
            GPA (Grade Point Average) is calculated by dividing the total number of quality points earned by the total number
            of credit hours attempted. Quality points for each course equal the grade points multiplied by the number of
            credit hours.
          </p>

          <h2>GPA Formula</h2>
          <p>
            <strong>GPA = Total Quality Points / Total Credit Hours</strong>
          </p>
          <p>
            For example, if you earn an A (4.0) in a 3-credit course and a B (3.0) in a 4-credit course, your GPA
            would be: (4.0 x 3 + 3.0 x 4) / (3 + 4) = 24.0 / 7 = 3.43
          </p>

          <h2>4.0 vs 10.0 Grading Scale</h2>
          <p>
            The 4.0 scale is used predominantly in the United States and Canada, while the 10.0 scale is commonly used
            in Indian universities. This calculator supports both systems so students worldwide can compute their GPA accurately.
          </p>

          <h2>Tips to Improve Your GPA</h2>
          <ul>
            <li>Focus on courses with higher credit hours for maximum impact</li>
            <li>Retake courses where you received low grades if your institution allows it</li>
            <li>Take advantage of office hours and tutoring services</li>
            <li>Plan your course load to balance difficult and easier courses</li>
            <li>Stay consistent with studying rather than cramming before exams</li>
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
            name: "GPA Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/gpa-calculator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
