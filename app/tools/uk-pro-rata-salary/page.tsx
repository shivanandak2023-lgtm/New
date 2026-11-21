"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Pro-Rata Salary Calculator UK 2024-25",
  description:
    "Free UK pro-rata salary calculator. Calculate part-time salary from full-time equivalent, hourly rate, monthly and weekly pay, plus pro-rata holiday entitlement.",
  keywords:
    "pro rata salary calculator, part time salary calculator UK, pro rata calculator, pro rata pay, part time salary UK, pro rata holiday entitlement, hourly rate calculator UK",
};

type CalcMode = "hours" | "days";

interface ProRataResult {
  fullTimeSalary: number;
  proRataAnnual: number;
  proRataMonthly: number;
  proRataWeekly: number;
  proRataDaily: number;
  hourlyRate: number;
  ftHoursPerWeek: number;
  actualHoursPerWeek: number;
  proportion: number;
  holidayDaysFT: number;
  holidayDaysProRata: number;
  holidayHoursProRata: number;
}

export default function UKProRataSalaryPage() {
  const [calcMode, setCalcMode] = useState<CalcMode>("hours");
  const [fullTimeSalary, setFullTimeSalary] = useState<string>("35000");
  const [ftHoursPerWeek, setFtHoursPerWeek] = useState<string>("37.5");
  const [actualHoursPerWeek, setActualHoursPerWeek] = useState<string>("22.5");
  const [daysWorkedPerWeek, setDaysWorkedPerWeek] = useState<string>("3");
  const [result, setResult] = useState<ProRataResult | null>(null);

  function calculate() {
    const salary = parseFloat(fullTimeSalary) || 0;
    if (salary <= 0) return;

    let proportion = 0;
    let ftHours = parseFloat(ftHoursPerWeek) || 37.5;
    let actualHours = 0;

    if (calcMode === "hours") {
      actualHours = parseFloat(actualHoursPerWeek) || 0;
      if (actualHours <= 0 || ftHours <= 0) return;
      proportion = actualHours / ftHours;
    } else {
      const days = parseFloat(daysWorkedPerWeek) || 0;
      if (days <= 0) return;
      proportion = days / 5;
      actualHours = ftHours * proportion;
    }

    const proRataAnnual = salary * proportion;
    const proRataMonthly = proRataAnnual / 12;
    const proRataWeekly = proRataAnnual / 52;
    const weeksPerYear = 52;
    const totalAnnualHours = actualHours * weeksPerYear;
    const proRataDaily = proRataAnnual / (calcMode === "days" ? parseFloat(daysWorkedPerWeek) * 52 : (actualHours / (ftHours / 5)) * 52);
    const hourlyRate = totalAnnualHours > 0 ? proRataAnnual / totalAnnualHours : 0;

    const holidayDaysFT = 28;
    const holidayDaysProRata = holidayDaysFT * proportion;
    const dailyHours = ftHours / 5;
    const holidayHoursProRata = holidayDaysProRata * dailyHours;

    setResult({
      fullTimeSalary: salary,
      proRataAnnual,
      proRataMonthly,
      proRataWeekly,
      proRataDaily: proRataWeekly / (calcMode === "days" ? parseFloat(daysWorkedPerWeek) || 5 : actualHours / (ftHours / 5)),
      hourlyRate,
      ftHoursPerWeek: ftHours,
      actualHoursPerWeek: actualHours,
      proportion,
      holidayDaysFT,
      holidayDaysProRata,
      holidayHoursProRata,
    });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/uk-pro-rata-salary`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/uk-pro-rata-salary`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Pro-Rata Salary Calculator UK</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your part-time pro-rata salary from the full-time equivalent. See annual, monthly, weekly, daily, and hourly breakdowns plus pro-rata holiday entitlement.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setCalcMode("hours")}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                calcMode === "hours"
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-white text-[var(--foreground)] border-[var(--card-border)]"
              }`}
            >
              By Hours per Week
            </button>
            <button
              onClick={() => setCalcMode("days")}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                calcMode === "days"
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-white text-[var(--foreground)] border-[var(--card-border)]"
              }`}
            >
              By Days per Week
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Full-Time Annual Salary (&pound;)</label>
              <input
                type="number"
                value={fullTimeSalary}
                onChange={(e) => setFullTimeSalary(e.target.value)}
                className="input-field"
                placeholder="e.g., 35000"
                min="0"
              />
            </div>

            {calcMode === "hours" ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Full-Time Hours per Week</label>
                  <input
                    type="number"
                    value={ftHoursPerWeek}
                    onChange={(e) => setFtHoursPerWeek(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 37.5"
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Your Actual Hours per Week</label>
                  <input
                    type="number"
                    value={actualHoursPerWeek}
                    onChange={(e) => setActualHoursPerWeek(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 22.5"
                    min="0"
                    step="0.5"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">Days Worked per Week</label>
                <select
                  value={daysWorkedPerWeek}
                  onChange={(e) => setDaysWorkedPerWeek(e.target.value)}
                  className="input-field"
                >
                  <option value="1">1 day</option>
                  <option value="2">2 days</option>
                  <option value="3">3 days</option>
                  <option value="4">4 days</option>
                  <option value="4.5">4.5 days</option>
                </select>
              </div>
            )}
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Pro-Rata Salary
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Pro-Rata Annual Salary</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmtExact(result.proRataAnnual)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Hourly Rate</p>
                <p className="text-2xl font-bold text-green-700">{fmtExact(result.hourlyRate)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Proportion of Full-Time</p>
                <p className="text-2xl font-bold">{(result.proportion * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Pay Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Period</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Full-Time</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Pro-Rata</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Annual</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.fullTimeSalary)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.proRataAnnual)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Monthly</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.fullTimeSalary / 12)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.proRataMonthly)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Weekly</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.fullTimeSalary / 52)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.proRataWeekly)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Daily</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.fullTimeSalary / 260)}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(result.proRataDaily)}</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Hourly Rate</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.fullTimeSalary / (result.ftHoursPerWeek * 52))}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.hourlyRate)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Pro-Rata Holiday Entitlement</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="result-card text-center">
                  <p className="text-sm text-[var(--muted)] mb-1">Full-Time Entitlement</p>
                  <p className="text-xl font-bold">{result.holidayDaysFT} days</p>
                </div>
                <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                  <p className="text-sm text-[var(--muted)] mb-1">Your Pro-Rata Days</p>
                  <p className="text-xl font-bold text-green-700">{result.holidayDaysProRata.toFixed(1)} days</p>
                </div>
                <div className="result-card text-center">
                  <p className="text-sm text-[var(--muted)] mb-1">Your Pro-Rata Hours</p>
                  <p className="text-xl font-bold">{result.holidayHoursProRata.toFixed(1)} hours</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is a Pro-Rata Salary?</h2>
          <p>
            A pro-rata salary is the proportional amount you earn when working part-time compared to the full-time equivalent salary for the same role. The term &ldquo;pro rata&rdquo; comes from Latin meaning &ldquo;in proportion.&rdquo; If a job advertises a salary of &pound;35,000 full-time (37.5 hours per week) and you work 22.5 hours per week, your pro-rata salary would be &pound;21,000 per year. This pro rata salary calculator UK tool makes it easy to work out exactly what you should earn.
          </p>

          <h2>How to Calculate Pro-Rata Salary</h2>
          <p>
            The pro-rata salary formula is straightforward: divide your actual working hours by the full-time hours, then multiply by the full-time salary. For example, if the full-time salary is &pound;30,000 for 37.5 hours per week and you work 22.5 hours: (22.5 / 37.5) &times; &pound;30,000 = &pound;18,000 per year. Alternatively, you can calculate by days: if you work 3 days out of a 5-day week, your pro-rata salary is 3/5 &times; &pound;30,000 = &pound;18,000.
          </p>

          <h2>Pro-Rata Holiday Entitlement</h2>
          <p>
            In the UK, all workers are legally entitled to a minimum of 5.6 weeks paid holiday per year, which equates to 28 days for a full-time worker on a 5-day week (this can include bank holidays). Part-time workers receive a proportional amount of holiday. For example, if you work 3 days per week, your statutory holiday entitlement is 3/5 &times; 28 = 16.8 days per year. Many employers calculate holiday in hours rather than days for part-time workers to make it fairer and easier to manage.
          </p>

          <h2>Understanding Your Hourly Rate</h2>
          <p>
            Knowing your hourly rate is essential for comparing part-time roles fairly. To calculate your hourly rate from an annual salary, divide the annual salary by the total number of working hours in a year (weekly hours &times; 52). For a &pound;30,000 salary at 37.5 hours per week: &pound;30,000 / (37.5 &times; 52) = &pound;15.38 per hour. The hourly rate should be the same whether you work full-time or part-time in the same role, as the pro-rata calculation is based on the same underlying rate of pay.
          </p>

          <h2>Part-Time Working Rights in the UK</h2>
          <p>
            Under UK employment law, part-time workers have the right to be treated no less favourably than comparable full-time workers. This means they should receive the same hourly pay rate, the same access to training and promotion opportunities, pro-rata pension contributions, and proportional benefits. The Part-time Workers (Prevention of Less Favourable Treatment) Regulations 2000 protect these rights. If you believe you are being treated unfairly as a part-time worker, you can raise a grievance with your employer or contact ACAS for advice.
          </p>

          <h2>Common Full-Time Hours in the UK</h2>
          <p>
            Standard full-time working hours in the UK typically range from 35 to 40 hours per week. The most common full-time contracts are 37.5 hours (7.5 hours per day) or 40 hours (8 hours per day) over five days. Some sectors, such as the NHS, use 37.5 hours as the standard full-time week, while others may use 35 or 40 hours. When calculating your pro-rata salary, always check what your employer considers to be the full-time equivalent hours for your role, as this directly affects the calculation.
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
            name: "Pro-Rata Salary Calculator UK",
            description: META.description,
            url: `${SITE_URL}/tools/uk-pro-rata-salary`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          }),
        }}
      />
    </>
  );
}
