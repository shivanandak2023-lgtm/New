"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Age Calculator - Calculate Your Exact Age Online",
  description:
    "Free Age Calculator to find your exact age in years, months, days, hours, and minutes. Also shows your next birthday countdown.",
  keywords: "age calculator, calculate age, date of birth age calculator, how old am i, birthday calculator",
};

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState<string>("");
  const [targetDate, setTargetDate] = useState<string>("");

  useEffect(() => {
    setTargetDate(new Date().toISOString().split("T")[0]);
  }, []);
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    nextBirthday: string;
    daysUntilBirthday: number;
  } | null>(null);

  function calculate() {
    if (!dob) return;

    const birth = new Date(dob);
    const target = new Date(targetDate || new Date().toISOString().split("T")[0]);

    if (birth >= target) return;

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    // Next birthday
    let nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= target) {
      nextBirthday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      nextBirthday: nextBirthday.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      daysUntilBirthday,
    });
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/age-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/age-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Age Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Find your exact age in years, months, days, hours, and minutes. See your next birthday countdown.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="input-field"
                max={targetDate || undefined}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Age at Date (optional)</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Age
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="result-card text-center mb-6">
              <p className="text-sm text-[var(--muted)] mb-2">Your Age</p>
              <p className="text-3xl font-extrabold text-[var(--primary)]">
                {result.years} years, {result.months} months, {result.days} days
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="tool-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Days</p>
                <p className="text-xl font-bold">{result.totalDays.toLocaleString()}</p>
              </div>
              <div className="tool-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Hours</p>
                <p className="text-xl font-bold">{result.totalHours.toLocaleString()}</p>
              </div>
              <div className="tool-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Minutes</p>
                <p className="text-xl font-bold">{result.totalMinutes.toLocaleString()}</p>
              </div>
            </div>

            <div className="tool-card text-center" style={{ background: "#fef3c7", borderColor: "#fde68a" }}>
              <p className="text-sm text-[var(--muted)] mb-1">Next Birthday</p>
              <p className="text-lg font-bold">{result.nextBirthday}</p>
              <p className="text-sm text-amber-700 mt-1">
                {result.daysUntilBirthday} day{result.daysUntilBirthday !== 1 ? "s" : ""} to go!
              </p>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does the Age Calculator Work?</h2>
          <p>
            The Age Calculator calculates the exact difference between your date of birth and the current date
            (or any target date you specify). It accounts for varying month lengths and leap years to give you
            a precise result in years, months, and days.
          </p>

          <h2>Age in Different Units</h2>
          <p>
            Besides years, months, and days, the calculator also shows your age in total days, hours, and
            minutes, giving you a unique perspective on the time you have lived.
          </p>

          <h2>Use Cases</h2>
          <ul>
            <li>Find your exact age for official documents</li>
            <li>Calculate age on a specific date (past or future)</li>
            <li>Check how many days until your next birthday</li>
            <li>Determine age eligibility for exams, retirement, etc.</li>
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
            name: "Age Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/age-calculator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
