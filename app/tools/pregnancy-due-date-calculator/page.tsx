"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Pregnancy Due Date Calculator - When Is My Baby Due?",
  description:
    "Free pregnancy due date calculator. Calculate your baby's due date based on your last menstrual period, conception date, or IVF transfer date. See week-by-week milestones.",
  keywords:
    "due date calculator, pregnancy calculator, when is my baby due, conception date calculator, pregnancy week calculator, ivf due date, pregnancy milestones",
};

type Method = "lmp" | "conception" | "ivf";

const MILESTONES: { week: number; label: string }[] = [
  { week: 4, label: "Positive pregnancy test possible" },
  { week: 6, label: "First heartbeat detectable" },
  { week: 8, label: "First prenatal visit" },
  { week: 10, label: "Baby is now a fetus" },
  { week: 12, label: "End of first trimester" },
  { week: 16, label: "Gender may be visible on ultrasound" },
  { week: 20, label: "Anatomy scan (mid-pregnancy ultrasound)" },
  { week: 24, label: "Viability milestone" },
  { week: 28, label: "Third trimester begins" },
  { week: 32, label: "Baby is practicing breathing" },
  { week: 37, label: "Full term begins" },
  { week: 39, label: "Early term complete" },
  { week: 40, label: "Estimated due date" },
];

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export default function PregnancyDueDateCalculatorPage() {
  const [method, setMethod] = useState<Method>("lmp");
  const [dateInput, setDateInput] = useState<string>("");
  const [ivfDayType, setIvfDayType] = useState<"3" | "5">("5");
  const [today, setToday] = useState<Date>(new Date(2026, 0, 1));

  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    setToday(now);
  }, []);

  let lmpDate: Date | null = null;
  let dueDate: Date | null = null;
  let conceptionDate: Date | null = null;

  if (dateInput) {
    const inputDate = new Date(dateInput + "T00:00:00");
    if (!isNaN(inputDate.getTime())) {
      switch (method) {
        case "lmp":
          lmpDate = inputDate;
          conceptionDate = addDays(inputDate, 14);
          dueDate = addDays(inputDate, 280); // 40 weeks from LMP
          break;
        case "conception":
          conceptionDate = inputDate;
          lmpDate = addDays(inputDate, -14);
          dueDate = addDays(inputDate, 266); // 38 weeks from conception
          break;
        case "ivf":
          conceptionDate = ivfDayType === "5" ? addDays(inputDate, -5) : addDays(inputDate, -3);
          lmpDate = addDays(conceptionDate, -14);
          dueDate = addDays(lmpDate, 280);
          break;
      }
    }
  }

  const totalDays = lmpDate && dueDate ? daysBetween(lmpDate, dueDate) : 280;
  const daysPregnant = lmpDate ? daysBetween(lmpDate, today) : 0;
  const currentWeek = Math.floor(daysPregnant / 7);
  const currentDay = daysPregnant % 7;
  const trimester = currentWeek < 13 ? 1 : currentWeek < 27 ? 2 : 3;
  const daysRemaining = dueDate ? daysBetween(today, dueDate) : 0;
  const progressPct = Math.min(100, Math.max(0, (daysPregnant / totalDays) * 100));

  const isValidPregnancy = lmpDate && dueDate && daysPregnant >= 0 && currentWeek <= 45;

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/pregnancy-due-date-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Pregnancy Due Date Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your estimated due date and see where you are in your pregnancy journey. Track milestones from first heartbeat to full term.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Calculation Method</label>
            <div className="flex flex-wrap gap-2">
              {([
                { id: "lmp" as Method, label: "Last Menstrual Period" },
                { id: "conception" as Method, label: "Conception Date" },
                { id: "ivf" as Method, label: "IVF Transfer Date" },
              ] as const).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    method === m.id
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                {method === "lmp" ? "First Day of Last Period" : method === "conception" ? "Conception Date" : "IVF Transfer Date"}
              </label>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="input-field"
              />
            </div>

            {method === "ivf" && (
              <div>
                <label className="block text-sm font-medium mb-3">Embryo Transfer Day</label>
                <div className="flex gap-2">
                  {(["3", "5"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setIvfDayType(d)}
                      className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                        ivfDayType === d
                          ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                          : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                      }`}
                    >
                      Day {d}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {isValidPregnancy && dueDate && lmpDate && conceptionDate && (
          <div className="mb-8">
            <div className="result-card text-center mb-6" style={{ background: "#fdf2f8", borderColor: "#fbcfe8" }}>
              <p className="text-sm text-[var(--muted)] mb-1">Estimated Due Date</p>
              <p className="text-3xl font-bold text-pink-700">{formatDate(dueDate)}</p>
              <p className="text-sm text-[var(--muted)] mt-2">
                {daysRemaining > 0 ? `${daysRemaining} days to go` : daysRemaining === 0 ? "Due today!" : `${Math.abs(daysRemaining)} days past due date`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Current Week</p>
                <p className="text-2xl font-bold text-[var(--primary)]">Week {currentWeek}, Day {currentDay}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Trimester</p>
                <p className="text-2xl font-bold text-amber-700">{trimester === 1 ? "1st" : trimester === 2 ? "2nd" : "3rd"} Trimester</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Conception Date</p>
                <p className="text-lg font-bold text-green-700">{formatDate(conceptionDate)}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-3">Pregnancy Progress</h2>
              <div className="w-full bg-gray-200 rounded-full h-6 mb-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progressPct}%`,
                    background: trimester === 1 ? "#f472b6" : trimester === 2 ? "#fb923c" : "#4ade80",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-[var(--muted)]">
                <span>Week 0</span>
                <span>Week 13 (2nd Tri)</span>
                <span>Week 27 (3rd Tri)</span>
                <span>Week 40</span>
              </div>
              <p className="text-center text-sm mt-2 font-medium">{progressPct.toFixed(1)}% complete</p>
            </div>

            {/* Milestones */}
            <div className="tool-card">
              <h2 className="text-lg font-bold mb-4">Key Milestones</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Week</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Milestone</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Date</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MILESTONES.map((m) => {
                    const milestoneDate = addDays(lmpDate!, m.week * 7);
                    const passed = currentWeek >= m.week;
                    const current = currentWeek >= m.week - 1 && currentWeek < m.week + 1;
                    return (
                      <tr key={m.week} className={`hover:bg-[var(--muted-bg)] ${current ? "bg-pink-50" : ""}`}>
                        <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Week {m.week}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2">{m.label}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-[var(--muted)]">
                          {milestoneDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-center">
                          {passed ? (
                            <span className="text-green-600 font-semibold">Passed</span>
                          ) : current ? (
                            <span className="text-pink-600 font-semibold">Current</span>
                          ) : (
                            <span className="text-[var(--muted)]">Upcoming</span>
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

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Is the Due Date Calculated?</h2>
          <p>
            The most common method is Naegele&apos;s Rule: add 280 days (40 weeks) to the first day of your last menstrual period
            (LMP). This assumes a 28-day cycle with ovulation on day 14. If you know your conception date, the due date is
            266 days (38 weeks) later.
          </p>

          <h2>Due Date by IVF Transfer</h2>
          <p>
            For IVF pregnancies, the due date is calculated differently. For a Day 5 (blastocyst) transfer, subtract 5 days
            from the transfer date to estimate conception, then add 266 days. For a Day 3 transfer, subtract 3 days instead.
            This method is often more accurate than LMP-based calculations.
          </p>

          <h2>Understanding Trimesters</h2>
          <ul>
            <li><strong>First Trimester (Weeks 1-12):</strong> Major organs begin forming. Morning sickness is common. First heartbeat at week 6.</li>
            <li><strong>Second Trimester (Weeks 13-26):</strong> Baby grows rapidly. Gender can be determined around week 16-20. Most comfortable trimester for many women.</li>
            <li><strong>Third Trimester (Weeks 27-40):</strong> Baby gains weight and prepares for birth. Full term begins at week 37.</li>
          </ul>

          <h3>How Accurate Is the Due Date?</h3>
          <p>
            Only about 5% of babies are born on their exact due date. Most babies are born within two weeks before or after
            the estimated date. A pregnancy is considered full term from 37 to 42 weeks. Your healthcare provider may adjust
            your due date based on early ultrasound measurements.
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
            name: "Pregnancy Due Date Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/pregnancy-due-date-calculator`,
            applicationCategory: "HealthApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
