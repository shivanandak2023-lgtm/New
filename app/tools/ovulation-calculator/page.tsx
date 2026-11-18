"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Ovulation Calculator & Fertility Calendar - Track Your Fertile Days",
  description:
    "Free ovulation calculator and fertility calendar. Find your ovulation date, fertile window, and next period. Track 3 future cycles with color-coded calendar.",
  keywords:
    "ovulation calculator, fertility calculator, when am I ovulating, ovulation calendar, fertile window calculator, period calculator, conception calculator, fertility tracker",
};

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toDateString(d: Date): string {
  return d.toISOString().split("T")[0];
}

interface CycleInfo {
  periodStart: Date;
  periodEnd: Date;
  fertileStart: Date;
  ovulationDate: Date;
  fertileEnd: Date;
  nextPeriod: Date;
}

function calcCycle(periodStart: Date, cycleLength: number): CycleInfo {
  const ovulationDay = cycleLength - 14;
  const ovulationDate = addDays(periodStart, ovulationDay);
  return {
    periodStart,
    periodEnd: addDays(periodStart, 4),
    fertileStart: addDays(ovulationDate, -5),
    ovulationDate,
    fertileEnd: ovulationDate,
    nextPeriod: addDays(periodStart, cycleLength),
  };
}

export default function OvulationCalculatorPage() {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState("28");

  const cycleDays = Math.min(45, Math.max(21, parseInt(cycleLength) || 28));
  const hasInput = lastPeriod.length > 0;
  const periodDate = hasInput ? new Date(lastPeriod + "T00:00:00") : null;

  const cycles: CycleInfo[] = [];
  if (periodDate && !isNaN(periodDate.getTime())) {
    for (let i = 0; i < 3; i++) {
      const start = addDays(periodDate, cycleDays * i);
      cycles.push(calcCycle(start, cycleDays));
    }
  }

  // Build calendar for current and next month
  const calendarMonths: { label: string; days: { date: Date; type: string }[] }[] = [];
  if (cycles.length > 0) {
    const startMonth = new Date(periodDate!.getFullYear(), periodDate!.getMonth(), 1);
    for (let m = 0; m < 3; m++) {
      const monthStart = new Date(startMonth.getFullYear(), startMonth.getMonth() + m, 1);
      const monthEnd = new Date(startMonth.getFullYear(), startMonth.getMonth() + m + 1, 0);
      const days: { date: Date; type: string }[] = [];

      // Pad start of month
      const startDay = monthStart.getDay();
      for (let p = 0; p < startDay; p++) {
        days.push({ date: addDays(monthStart, p - startDay), type: "pad" });
      }

      for (let d = 1; d <= monthEnd.getDate(); d++) {
        const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), d);
        const ds = toDateString(date);
        let type = "normal";

        for (const c of cycles) {
          if (ds === toDateString(c.ovulationDate)) { type = "ovulation"; break; }
          if (ds >= toDateString(c.fertileStart) && ds <= toDateString(c.fertileEnd)) { type = "fertile"; break; }
          if (ds >= toDateString(c.periodStart) && ds <= toDateString(c.periodEnd)) { type = "period"; break; }
        }
        days.push({ date, type });
      }

      calendarMonths.push({
        label: monthStart.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        days,
      });
    }
  }

  const dayColors: Record<string, string> = {
    ovulation: "bg-green-700 text-white font-bold",
    fertile: "bg-green-100 text-green-800",
    period: "bg-red-100 text-red-700",
    normal: "",
    pad: "text-gray-300",
  };

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/ovulation-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/ovulation-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Ovulation Calculator &amp; Fertility Calendar</h1>
        <p className="text-[var(--muted)] mb-8">
          Find your most fertile days and estimated ovulation date. Enter your last period date and cycle length to see a color-coded fertility calendar for the next 3 cycles.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">First Day of Last Period</label>
              <input
                type="date"
                value={lastPeriod}
                onChange={(e) => setLastPeriod(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Average Cycle Length (days)</label>
              <input
                type="number"
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                className="input-field"
                min="21"
                max="45"
                placeholder="28"
              />
              <p className="text-xs text-[var(--muted)] mt-1">Typical range: 21&ndash;35 days (default 28)</p>
            </div>
          </div>
        </div>

        {cycles.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Estimated Ovulation</p>
                <p className="text-xl font-bold text-green-700">{formatDate(cycles[0].ovulationDate)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Fertile Window</p>
                <p className="text-lg font-bold text-amber-700">
                  {formatDate(cycles[0].fertileStart)} &ndash; {formatDate(cycles[0].fertileEnd)}
                </p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Next Period</p>
                <p className="text-xl font-bold text-[var(--primary)]">{formatDate(cycles[0].nextPeriod)}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Next 3 Cycles</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--muted-bg)]">
                    <th className="border border-[var(--card-border)] px-3 py-2 text-left">Cycle</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-center">Period</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-center">Fertile Window</th>
                    <th className="border border-[var(--card-border)] px-3 py-2 text-center">Ovulation</th>
                  </tr>
                </thead>
                <tbody>
                  {cycles.map((c, i) => (
                    <tr key={i} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Cycle {i + 1}</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-center text-red-600">
                        {formatDate(c.periodStart)} &ndash; {formatDate(c.periodEnd)}
                      </td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-center text-green-600">
                        {formatDate(c.fertileStart)} &ndash; {formatDate(c.fertileEnd)}
                      </td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-center font-bold text-green-700">
                        {formatDate(c.ovulationDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Fertility Calendar</h2>
              <div className="flex flex-wrap gap-3 mb-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-red-100 border border-red-300"></span> Period</span>
                <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-green-100 border border-green-300"></span> Fertile</span>
                <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-green-700"></span> Ovulation</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {calendarMonths.map((month) => (
                  <div key={month.label}>
                    <h3 className="text-sm font-bold mb-2 text-center">{month.label}</h3>
                    <div className="grid grid-cols-7 gap-1 text-xs text-center">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                        <div key={d} className="font-medium text-[var(--muted)] py-1">{d}</div>
                      ))}
                      {month.days.map((d, i) => (
                        <div
                          key={i}
                          className={`py-1 rounded ${dayColors[d.type] || ""} ${d.type === "pad" ? "invisible" : ""}`}
                        >
                          {d.date.getDate()}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Ovulation Calculator: Track Your Most Fertile Days</h2>
          <p>
            Understanding your ovulation cycle is essential whether you are trying to conceive or simply want to understand
            your body better. Ovulation typically occurs about 14 days before your next period starts. This ovulation calculator
            uses your last menstrual period date and average cycle length to estimate when you are most likely to ovulate, giving
            you a clear picture of your fertile window each month.
          </p>

          <h2>How Does Ovulation Work?</h2>
          <p>
            Ovulation is the release of a mature egg from one of your ovaries. The egg travels down the fallopian tube where
            it can be fertilized by sperm. The egg survives for about 12 to 24 hours after release, while sperm can survive
            in the female reproductive tract for up to five days. This means your fertile window extends from about five days
            before ovulation through the day of ovulation itself — a total of approximately six days per cycle.
          </p>

          <h2>Understanding Your Fertile Window</h2>
          <p>
            Your fertile window is the span of days during which intercourse can lead to pregnancy. The most fertile days are
            the two to three days leading up to and including ovulation day. For a typical 28-day cycle, ovulation occurs around
            day 14, making days 9 through 14 the fertile window. Cycles shorter or longer than 28 days shift this window
            accordingly. If your cycle is 32 days, ovulation likely occurs around day 18 instead.
          </p>

          <h2>Signs of Ovulation</h2>
          <p>
            Many women experience physical signs that indicate ovulation is approaching or occurring. These include changes in
            cervical mucus (becoming clear, stretchy, and similar to egg whites), a slight rise in basal body temperature after
            ovulation, mild pelvic pain or cramping on one side (called mittelschmerz), breast tenderness, and increased libido.
            Tracking these signs alongside this fertility calculator can help you pinpoint your most fertile days more accurately.
          </p>

          <h2>Cycle Length Variations</h2>
          <p>
            A normal menstrual cycle ranges from 21 to 35 days. Shorter cycles mean ovulation occurs earlier, while longer
            cycles mean it occurs later. Stress, travel, illness, weight changes, and exercise can all affect your cycle length
            from month to month. For the most accurate results with this ovulation calendar, track your cycle length for several
            months and use the average. If your cycle is consistently irregular, consider consulting a healthcare provider for
            personalized fertility guidance.
          </p>

          <h3>When to Take a Pregnancy Test</h3>
          <p>
            If you are trying to conceive, the best time to take a pregnancy test is after a missed period — typically about
            14 days after ovulation. Testing too early may produce a false negative because the hormone hCG (human chorionic
            gonadotropin) may not yet be at detectable levels. For the most accurate result, use a first-morning urine sample
            and wait until at least one day after your expected period date.
          </p>

          <h3>Disclaimer</h3>
          <p>
            This ovulation calculator provides estimates based on average cycle patterns. Individual cycles vary, and this tool
            should not be used as a form of birth control. For medical advice regarding fertility or contraception, please
            consult your healthcare provider.
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
            name: "Ovulation Calculator & Fertility Calendar",
            description: META.description,
            url: `${SITE_URL}/tools/ovulation-calculator`,
            applicationCategory: "HealthApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
