"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Time Card Calculator - Weekly Timesheet & Overtime Calculator",
  description:
    "Free time card calculator to compute daily hours, weekly totals, and overtime pay from clock in/out times. Calculate gross pay with hourly rate.",
  keywords:
    "time card calculator, timesheet calculator, work hours calculator, overtime calculator, clock in out calculator, weekly hours calculator, gross pay calculator",
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface DayEntry {
  day: string;
  clockIn: string;
  clockOut: string;
  breakMinutes: string;
  hours: number;
}

export default function TimeCardCalculatorPage() {
  const [entries, setEntries] = useState<DayEntry[]>(
    DAYS.map((day, i) => ({
      day,
      clockIn: i < 5 ? "09:00" : "",
      clockOut: i < 5 ? "17:00" : "",
      breakMinutes: i < 5 ? "30" : "0",
      hours: 0,
    }))
  );
  const [hourlyRate, setHourlyRate] = useState<string>("25");
  const [overtimeThreshold, setOvertimeThreshold] = useState<string>("40");
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<string>("1.5");
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState<{
    totalHours: number;
    regularHours: number;
    overtimeHours: number;
    regularPay: number;
    overtimePay: number;
    grossPay: number;
  } | null>(null);

  function parseTime(time: string): number | null {
    if (!time) return null;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  function calculate() {
    const rate = parseFloat(hourlyRate) || 0;
    const otThreshold = parseFloat(overtimeThreshold) || 40;
    const otMultiplier = parseFloat(overtimeMultiplier) || 1.5;

    const updated = entries.map((entry) => {
      const inTime = parseTime(entry.clockIn);
      const outTime = parseTime(entry.clockOut);
      const breakMins = parseFloat(entry.breakMinutes) || 0;

      if (inTime === null || outTime === null) return { ...entry, hours: 0 };

      let totalMinutes = outTime - inTime;
      if (totalMinutes < 0) totalMinutes += 24 * 60;
      totalMinutes -= breakMins;
      if (totalMinutes < 0) totalMinutes = 0;

      return { ...entry, hours: totalMinutes / 60 };
    });

    setEntries(updated);

    const totalHours = updated.reduce((s, e) => s + e.hours, 0);
    const regularHours = Math.min(totalHours, otThreshold);
    const overtimeHours = Math.max(0, totalHours - otThreshold);
    const regularPay = regularHours * rate;
    const overtimePay = overtimeHours * rate * otMultiplier;

    setResult({
      totalHours,
      regularHours,
      overtimeHours,
      regularPay,
      overtimePay,
      grossPay: regularPay + overtimePay,
    });
    setCalculated(true);
  }

  function updateEntry(index: number, field: string, value: string) {
    setEntries(entries.map((e, i) => i === index ? { ...e, [field]: value } : e));
  }

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  function formatHours(h: number): string {
    const hours = Math.floor(h);
    const minutes = Math.round((h - hours) * 60);
    return `${hours}h ${minutes}m`;
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/time-card-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Time Card Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Enter your clock-in and clock-out times for each day of the week. Calculate daily hours, weekly total, overtime, and gross pay.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Hourly Rate ($)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="input-field"
                placeholder="e.g., 25"
                step="0.25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Overtime After (hours)</label>
              <input
                type="number"
                value={overtimeThreshold}
                onChange={(e) => setOvertimeThreshold(e.target.value)}
                className="input-field"
                placeholder="e.g., 40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Overtime Rate (multiplier)</label>
              <input
                type="number"
                value={overtimeMultiplier}
                onChange={(e) => setOvertimeMultiplier(e.target.value)}
                className="input-field"
                placeholder="e.g., 1.5"
                step="0.25"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Day</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-center">Clock In</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-center">Clock Out</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-center">Break (min)</th>
                  {calculated && <th className="border border-[var(--card-border)] px-3 py-2 text-right">Hours</th>}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={entry.day} className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{entry.day}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2">
                      <input
                        type="time"
                        value={entry.clockIn}
                        onChange={(e) => updateEntry(idx, "clockIn", e.target.value)}
                        className="input-field text-center"
                      />
                    </td>
                    <td className="border border-[var(--card-border)] px-3 py-2">
                      <input
                        type="time"
                        value={entry.clockOut}
                        onChange={(e) => updateEntry(idx, "clockOut", e.target.value)}
                        className="input-field text-center"
                      />
                    </td>
                    <td className="border border-[var(--card-border)] px-3 py-2">
                      <input
                        type="number"
                        value={entry.breakMinutes}
                        onChange={(e) => updateEntry(idx, "breakMinutes", e.target.value)}
                        className="input-field text-center w-20 mx-auto"
                        min="0"
                      />
                    </td>
                    {calculated && (
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">
                        {entry.hours > 0 ? formatHours(entry.hours) : "-"}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Time Card
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Hours</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{formatHours(result.totalHours)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Regular Hours</p>
                <p className="text-2xl font-bold">{formatHours(result.regularHours)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Overtime Hours</p>
                <p className="text-2xl font-bold text-orange-600">{formatHours(result.overtimeHours)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Gross Pay</p>
                <p className="text-2xl font-bold text-green-700">{fmtExact(result.grossPay)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Pay Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Regular Hours</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{result.regularHours.toFixed(2)} hrs</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">@ {fmtExact(parseFloat(hourlyRate) || 0)}/hr</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.regularPay)}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2">Overtime Hours</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{result.overtimeHours.toFixed(2)} hrs</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">@ {fmtExact((parseFloat(hourlyRate) || 0) * (parseFloat(overtimeMultiplier) || 1.5))}/hr</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold text-orange-600">{fmtExact(result.overtimePay)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-bold" colSpan={3}>Gross Pay</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.grossPay)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Use the Time Card Calculator</h2>
          <p>
            Enter your clock-in and clock-out times for each day of the week, along with any break time in minutes.
            The calculator will compute your daily hours, weekly total, overtime hours, and gross pay based on your
            hourly rate.
          </p>

          <h2>How Overtime Is Calculated</h2>
          <p>
            Under the Fair Labor Standards Act (FLSA), non-exempt employees must receive overtime pay of at least 1.5
            times their regular rate for all hours worked over 40 in a workweek. Some states have additional overtime
            rules, such as daily overtime after 8 hours in California.
          </p>

          <h3>Time Card Tips</h3>
          <ul>
            <li>Federal overtime kicks in after 40 hours per week at 1.5x pay</li>
            <li>Lunch breaks (typically 30-60 min) are usually unpaid</li>
            <li>Short breaks (5-20 min) are typically paid time</li>
            <li>Always track your hours accurately for payroll purposes</li>
          </ul>

          <h3>Understanding Your Pay</h3>
          <ul>
            <li><strong>Gross Pay</strong> = Total pay before taxes and deductions</li>
            <li><strong>Regular Pay</strong> = Regular hours x hourly rate</li>
            <li><strong>Overtime Pay</strong> = OT hours x hourly rate x 1.5 (or applicable multiplier)</li>
            <li><strong>Net Pay</strong> = Gross pay minus taxes and deductions</li>
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
            name: "Time Card Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/time-card-calculator`,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
