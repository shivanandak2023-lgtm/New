"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "UCAS Tariff Points Calculator 2024-25",
  description:
    "Free UCAS tariff points calculator. Add A-Level, BTEC, T-Level, EPQ, and AS Level qualifications to calculate your total UCAS points with a full grade-to-points conversion table.",
  keywords:
    "UCAS points calculator, UCAS tariff calculator, A level points, A level UCAS points, BTEC UCAS points, T Level points, EPQ points, AS level points, university entry points",
};

type QualificationType = "a-level" | "btec-extended" | "btec-diploma" | "btec-certificate" | "t-level" | "epq" | "as-level";

interface Qualification {
  id: number;
  type: QualificationType;
  grade: string;
}

const POINTS_MAP: Record<QualificationType, Record<string, number>> = {
  "a-level": {
    "A*": 56,
    "A": 48,
    "B": 40,
    "C": 32,
    "D": 24,
    "E": 16,
  },
  "btec-extended": {
    "D*D*D*": 168,
    "D*D*D": 160,
    "D*DD": 152,
    "DDD": 144,
    "DDM": 128,
    "DMM": 112,
    "MMM": 96,
    "MMP": 80,
    "MPP": 64,
    "PPP": 48,
  },
  "btec-diploma": {
    "D*D*": 112,
    "D*D": 104,
    "DD": 96,
    "DM": 80,
    "MM": 64,
    "MP": 48,
    "PP": 32,
  },
  "btec-certificate": {
    "D*": 56,
    "D": 48,
    "M": 32,
    "P": 16,
  },
  "t-level": {
    "Distinction*": 168,
    "Distinction": 144,
    "Merit": 120,
    "Pass (C or above on core)": 96,
    "Pass (D or E on core)": 72,
  },
  "epq": {
    "A*": 28,
    "A": 24,
    "B": 20,
    "C": 16,
    "D": 12,
    "E": 8,
  },
  "as-level": {
    "A": 20,
    "B": 16,
    "C": 12,
    "D": 10,
    "E": 6,
  },
};

const QUAL_LABELS: Record<QualificationType, string> = {
  "a-level": "A-Level",
  "btec-extended": "BTEC Extended Diploma",
  "btec-diploma": "BTEC Diploma",
  "btec-certificate": "BTEC Certificate",
  "t-level": "T-Level",
  "epq": "EPQ (Extended Project)",
  "as-level": "AS Level",
};

export default function UKUCASPointsPage() {
  const [qualifications, setQualifications] = useState<Qualification[]>([
    { id: 1, type: "a-level", grade: "A" },
    { id: 2, type: "a-level", grade: "B" },
    { id: 3, type: "a-level", grade: "B" },
  ]);
  const [showTable, setShowTable] = useState<QualificationType>("a-level");

  function addQualification() {
    setQualifications([...qualifications, { id: Date.now(), type: "a-level", grade: "A" }]);
  }

  function removeQualification(id: number) {
    if (qualifications.length > 1) {
      setQualifications(qualifications.filter((q) => q.id !== id));
    }
  }

  function updateQualification(id: number, field: "type" | "grade", value: string) {
    setQualifications(
      qualifications.map((q) => {
        if (q.id !== id) return q;
        if (field === "type") {
          const newType = value as QualificationType;
          const grades = Object.keys(POINTS_MAP[newType]);
          return { ...q, type: newType, grade: grades[0] };
        }
        return { ...q, [field]: value };
      })
    );
  }

  const totalPoints = qualifications.reduce((sum, q) => {
    return sum + (POINTS_MAP[q.type]?.[q.grade] || 0);
  }, 0);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/uk-ucas-points`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/uk-ucas-points`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">UCAS Tariff Points Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Add your qualifications below to calculate your total UCAS tariff points. Supports A-Level, BTEC, T-Level, EPQ, and AS Level grades.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Your Qualifications</h2>
            <button onClick={addQualification} className="text-sm text-[var(--primary)] hover:underline">
              + Add Qualification
            </button>
          </div>

          {qualifications.map((q) => (
            <div key={q.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-3 mb-3 items-center">
              <select
                value={q.type}
                onChange={(e) => updateQualification(q.id, "type", e.target.value)}
                className="input-field"
              >
                {Object.entries(QUAL_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <select
                value={q.grade}
                onChange={(e) => updateQualification(q.id, "grade", e.target.value)}
                className="input-field"
              >
                {Object.entries(POINTS_MAP[q.type]).map(([grade, points]) => (
                  <option key={grade} value={grade}>{grade} ({points} pts)</option>
                ))}
              </select>
              <div className="text-center font-bold text-[var(--primary)] min-w-[60px]">
                {POINTS_MAP[q.type]?.[q.grade] || 0} pts
              </div>
              <button
                onClick={() => removeQualification(q.id)}
                className="text-red-500 hover:text-red-700 text-sm px-2"
                title="Remove"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="result-card text-center">
              <p className="text-sm text-[var(--muted)] mb-1">Total UCAS Tariff Points</p>
              <p className="text-4xl font-bold text-[var(--primary)]">{totalPoints}</p>
            </div>
            <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
              <p className="text-sm text-[var(--muted)] mb-1">Qualifications Added</p>
              <p className="text-4xl font-bold text-green-700">{qualifications.length}</p>
            </div>
          </div>
        </div>

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Grade-to-Points Conversion Table</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(QUAL_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setShowTable(key as QualificationType)}
                className={`px-3 py-1 text-sm rounded-full border ${
                  showTable === key
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Grade</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">UCAS Points</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(POINTS_MAP[showTable]).map(([grade, points]) => (
                  <tr key={grade} className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{grade}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Are UCAS Tariff Points?</h2>
          <p>
            UCAS tariff points are a numerical system used by UK universities to compare and assess the qualifications of prospective students. The Universities and Colleges Admissions Service (UCAS) assigns a point value to each qualification grade, allowing admissions teams to compare applicants who may have studied different qualifications. This UCAS points calculator helps you work out your total tariff points across all your qualifications.
          </p>

          <h2>A-Level UCAS Points</h2>
          <p>
            A-Levels are the most common qualification used for university entry in England, Wales, and Northern Ireland. Each A-Level grade is worth a specific number of UCAS tariff points: A* is worth 56 points, A is 48, B is 40, C is 32, D is 24, and E is 16 points. For example, a student with three A-Levels at grades A, B, B would have 48 + 40 + 40 = 128 UCAS points. Many competitive courses at Russell Group universities typically require 128-144+ UCAS points from A-Levels.
          </p>

          <h2>BTEC UCAS Points</h2>
          <p>
            BTEC qualifications are vocational alternatives to A-Levels and also carry UCAS tariff points. A BTEC Extended Diploma (equivalent to three A-Levels) with top grades of D*D*D* is worth 168 UCAS points, while DDD is worth 144 points. BTEC Diplomas (equivalent to two A-Levels) range from 32 points (PP) to 112 points (D*D*). BTEC Certificates (equivalent to one A-Level) range from 16 points (P) to 56 points (D*). BTECs are widely accepted by universities across the UK.
          </p>

          <h2>T-Level UCAS Points</h2>
          <p>
            T-Levels are newer technical qualifications introduced in England as an alternative to A-Levels and BTECs. A T-Level with a Distinction* grade is worth 168 UCAS points, Distinction is 144 points, Merit is 120 points, and a Pass ranges from 72 to 96 points depending on the core component grade. T-Levels include a substantial industry placement and are designed in collaboration with employers, making them highly valued for specific career paths.
          </p>

          <h2>EPQ and AS Level Points</h2>
          <p>
            The Extended Project Qualification (EPQ) is an independent research project worth up to 28 UCAS points for an A* grade. Many universities value the EPQ highly and may make reduced offers to students who complete one. AS Levels, which were previously the first year of A-Levels, carry their own UCAS points ranging from 6 (grade E) to 20 (grade A). Some students take additional AS Levels alongside their A-Levels to boost their UCAS points total.
          </p>

          <h2>How Do Universities Use UCAS Points?</h2>
          <p>
            Universities use UCAS tariff points in different ways. Some set their entry requirements in terms of specific grades (such as ABB at A-Level), while others specify a minimum number of UCAS tariff points (such as 112 points from at least two A-Levels). Points-based offers give students more flexibility because they can achieve the required total through different combinations of qualifications and grades. Always check individual university course pages for their specific entry requirements, as some courses may require particular subjects or specific grades rather than just a points total.
          </p>

          <h2>Typical University Entry Requirements in UCAS Points</h2>
          <p>
            Entry requirements vary widely between universities and courses. Top Russell Group universities for competitive courses may require 144+ UCAS points (equivalent to AAA at A-Level). Most mid-ranking universities typically ask for 96-128 points (equivalent to CCC to ABB). Many universities will accept applicants with 64-96 points for certain courses. Foundation year programmes may accept students with lower points totals. Use this UCAS tariff calculator to check whether your predicted or achieved grades meet the entry requirements for your chosen courses.
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
            name: "UCAS Tariff Points Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/uk-ucas-points`,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          }),
        }}
      />
    </>
  );
}
