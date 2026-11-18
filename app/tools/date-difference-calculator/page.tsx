"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Date Difference Calculator - Days Between Two Dates",
  description:
    "Free date difference calculator to find the exact number of days, weeks, months, and years between two dates. Also calculate days until a future date.",
  keywords:
    "date difference calculator, days between dates, date calculator, how many days until, how many days between, date duration calculator, days counter",
};

function getDateDiff(start: Date, end: Date) {
  const diffMs = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDaysAfterWeeks = totalDays % 7;

  // Calculate years, months, days
  let startDate = start < end ? new Date(start) : new Date(end);
  let endDate = start < end ? new Date(end) : new Date(start);

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    remainingDaysAfterWeeks,
    totalHours,
    totalMinutes,
  };
}

export default function DateDifferenceCalculatorPage() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [upcomingEvents, setUpcomingEvents] = useState<{ name: string; dateStr: string; daysAway: number }[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setStartDate(today);
    setEndDate(today);

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const year = now.getFullYear();
    const events = [
      { name: "New Year's Day", date: new Date(year + 1, 0, 1) },
      { name: "Valentine's Day", date: new Date(now.getMonth() >= 2 ? year + 1 : year, 1, 14) },
      { name: "Independence Day (US)", date: new Date(now.getMonth() >= 7 ? year + 1 : year, 6, 4) },
      { name: "Halloween", date: new Date(now.getMonth() >= 10 && now.getDate() > 31 ? year + 1 : year, 9, 31) },
      { name: "Christmas", date: new Date(now.getMonth() === 11 && now.getDate() > 25 ? year + 1 : year, 11, 25) },
    ];
    setUpcomingEvents(
      events.map((event) => {
        let targetDate = event.date;
        if (targetDate < now) {
          targetDate = new Date(targetDate);
          targetDate.setFullYear(targetDate.getFullYear() + 1);
        }
        const daysAway = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          name: event.name,
          dateStr: targetDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          daysAway,
        };
      })
    );
  }, []);
  const [futureDate, setFutureDate] = useState<string>("");
  const [result, setResult] = useState<ReturnType<typeof getDateDiff> | null>(null);
  const [daysUntil, setDaysUntil] = useState<number | null>(null);

  function calculateDifference() {
    if (!startDate || !endDate) return;
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");
    setResult(getDateDiff(start, end));
  }

  function calculateDaysUntil() {
    if (!futureDate) return;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(futureDate + "T00:00:00");
    const diffMs = target.getTime() - now.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    setDaysUntil(days);
  }

  const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/date-difference-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Date Difference Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Find the exact difference between two dates in years, months, days, weeks, and hours. Also calculate how many days until a future date.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Date Difference */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Date Difference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <button onClick={calculateDifference} className="btn-primary mt-6">
            Calculate Difference
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="result-card text-center mb-4">
              <p className="text-sm text-[var(--muted)] mb-1">Difference</p>
              <p className="text-2xl font-bold text-[var(--primary)]">
                {result.years > 0 && `${result.years} year${result.years !== 1 ? "s" : ""}, `}
                {result.months > 0 && `${result.months} month${result.months !== 1 ? "s" : ""}, `}
                {result.days} day{result.days !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Days</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmt(result.totalDays)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Weeks</p>
                <p className="text-xl font-bold text-green-700">
                  {fmt(result.totalWeeks)}
                  {result.remainingDaysAfterWeeks > 0 && (
                    <span className="text-sm font-normal"> + {result.remainingDaysAfterWeeks}d</span>
                  )}
                </p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Hours</p>
                <p className="text-xl font-bold text-amber-700">{fmt(result.totalHours)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Minutes</p>
                <p className="text-xl font-bold text-red-700">{fmt(result.totalMinutes)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Days Until */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Days Until a Date</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Target Date</label>
              <input
                type="date"
                value={futureDate}
                onChange={(e) => setFutureDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <button onClick={calculateDaysUntil} className="btn-primary w-full">
                Calculate
              </button>
            </div>
          </div>

          {daysUntil !== null && (
            <div className="mt-4">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">
                  {daysUntil >= 0 ? "Days remaining" : "Days ago"}
                </p>
                <p className="text-3xl font-bold text-[var(--primary)]">
                  {fmt(Math.abs(daysUntil))} day{Math.abs(daysUntil) !== 1 ? "s" : ""}
                </p>
                {daysUntil > 0 && (
                  <p className="text-sm text-[var(--muted)] mt-1">
                    That is {Math.floor(Math.abs(daysUntil) / 7)} weeks and {Math.abs(daysUntil) % 7} days
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick references */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Common Date Countdowns</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--muted-bg)]">
                <th className="border border-[var(--card-border)] px-3 py-2 text-left">Event</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-left">Date</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-right">Days Away</th>
              </tr>
            </thead>
            <tbody>
              {upcomingEvents.map((event) => (
                <tr key={event.name} className="hover:bg-[var(--muted-bg)]">
                  <td className="border border-[var(--card-border)] px-3 py-2">{event.name}</td>
                  <td className="border border-[var(--card-border)] px-3 py-2">{event.dateStr}</td>
                  <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">
                    {event.daysAway} days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Days Between Two Dates</h2>
          <p>
            To find the number of days between two dates, this calculator subtracts the earlier date from the later date.
            It accounts for varying month lengths, leap years, and provides the result in multiple units including
            years, months, days, weeks, and hours.
          </p>

          <h2>Understanding Date Calculations</h2>
          <ul>
            <li><strong>Days:</strong> The most common way to measure the difference between dates</li>
            <li><strong>Weeks:</strong> Total days divided by 7, with remaining days shown separately</li>
            <li><strong>Months:</strong> Calendar months, accounting for different month lengths (28-31 days)</li>
            <li><strong>Years:</strong> Full calendar years between the two dates</li>
          </ul>

          <h2>Common Uses for Date Calculators</h2>
          <ul>
            <li>Calculate how many days until your vacation, wedding, or event</li>
            <li>Find the exact age or duration between two events</li>
            <li>Track project timelines and deadlines</li>
            <li>Calculate lease or contract durations</li>
            <li>Determine business days between two dates</li>
          </ul>

          <h3>Leap Year Considerations</h3>
          <p>
            A leap year occurs every 4 years (with exceptions for century years not divisible by 400). In a leap year,
            February has 29 days instead of 28. This calculator automatically accounts for leap years in all calculations.
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
            name: "Date Difference Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/date-difference-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
