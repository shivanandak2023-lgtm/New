"use client";

import { useState, useEffect, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Calendar - Monthly Calendar with Week Numbers",
  description:
    "Free online Calendar tool. Navigate months, view week numbers, highlight today, and click dates to see day-of-year and week-of-year info. Mini 3-month view.",
  keywords: "calendar, monthly calendar, week numbers, day of year, online calendar, date info",
};

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getDaysInYear(year: number): number {
  return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
}

interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

function getCalendarDays(year: number, month: number): CalendarDay[][] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    currentWeek.push({ date: d, month: m, year: y, isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push({ date: d, month, year, isCurrentMonth: true });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Next month days
  if (currentWeek.length > 0) {
    let nextDay = 1;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    while (currentWeek.length < 7) {
      currentWeek.push({ date: nextDay++, month: nextMonth, year: nextYear, isCurrentMonth: false });
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

function MiniCalendar({ year, month, todayStr }: { year: number; month: number; todayStr: string }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  return (
    <div className="text-center">
      <p className="text-sm font-bold mb-1">{MONTH_NAMES[month]} {year}</p>
      <div className="grid grid-cols-7 gap-0 text-xs">
        {DAY_NAMES.map((d) => (
          <span key={d} className="text-[var(--muted)] font-medium">{d[0]}</span>
        ))}
        {Array.from({ length: firstDay }, (_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1;
          const dateStr = `${year}-${month}-${d}`;
          const isToday = dateStr === todayStr;
          return (
            <span key={d} className={`py-0.5 ${isToday ? "bg-[var(--primary)] text-white rounded-full" : ""}`}>
              {d}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [today, setToday] = useState<Date | null>(null);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(0);
  const [selectedDate, setSelectedDate] = useState<CalendarDay | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(now);
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  }, []);

  const weeks = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);

  const todayStr = today ? `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}` : "";

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
    setSelectedDate(null);
  };

  const goToToday = () => {
    if (today) {
      setViewYear(today.getFullYear());
      setViewMonth(today.getMonth());
      setSelectedDate(null);
    }
  };

  const selectedInfo = selectedDate ? (() => {
    const d = new Date(selectedDate.year, selectedDate.month, selectedDate.date);
    const dayOfYear = getDayOfYear(d);
    const weekOfYear = getWeekNumber(d);
    const totalDays = getDaysInYear(selectedDate.year);
    const daysRemaining = totalDays - dayOfYear;
    const dayName = DAY_NAMES[d.getDay()];
    return { dayOfYear, weekOfYear, daysRemaining, dayName, totalDays };
  })() : null;

  // Mini calendar months
  const prevMiniMonth = viewMonth === 0 ? 11 : viewMonth - 1;
  const prevMiniYear = viewMonth === 0 ? viewYear - 1 : viewYear;
  const nextMiniMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const nextMiniYear = viewMonth === 11 ? viewYear + 1 : viewYear;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/calendar`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Calendar</h1>
        <p className="text-[var(--muted)] mb-8">
          Monthly calendar with week numbers. Click any date for detailed info.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Navigation */}
        <div className="tool-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="btn-secondary text-sm">&larr; Prev</button>
            <div className="text-center">
              <h2 className="text-xl font-bold">{MONTH_NAMES[viewMonth]} {viewYear}</h2>
              <button onClick={goToToday} className="text-xs text-[var(--primary)] hover:underline">Today</button>
            </div>
            <button onClick={nextMonth} className="btn-secondary text-sm">Next &rarr;</button>
          </div>

          {/* Calendar Grid */}
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-xs text-[var(--muted)] py-2 w-10">Wk</th>
                {DAY_NAMES.map((d) => (
                  <th key={d} className="text-xs text-[var(--muted)] py-2 font-medium">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, wi) => {
                const weekDate = new Date(week.find((d) => d.isCurrentMonth)?.year || viewYear, week.find((d) => d.isCurrentMonth)?.month || viewMonth, week.find((d) => d.isCurrentMonth)?.date || 1);
                const wn = getWeekNumber(weekDate);
                return (
                  <tr key={wi}>
                    <td className="text-xs text-[var(--muted)] text-center py-1">{wn}</td>
                    {week.map((day, di) => {
                      const dateStr = `${day.year}-${day.month}-${day.date}`;
                      const isToday = dateStr === todayStr;
                      const isSelected = selectedDate && selectedDate.year === day.year && selectedDate.month === day.month && selectedDate.date === day.date;

                      return (
                        <td key={di} className="text-center py-1">
                          <button
                            onClick={() => setSelectedDate(day)}
                            className={`w-9 h-9 rounded-full text-sm transition-colors ${
                              isToday
                                ? "bg-[var(--primary)] text-white font-bold"
                                : isSelected
                                ? "bg-[var(--primary)] bg-opacity-20 text-[var(--primary)] font-bold ring-2 ring-[var(--primary)]"
                                : day.isCurrentMonth
                                ? "hover:bg-[var(--bg-secondary)]"
                                : "text-[var(--muted)] opacity-40"
                            }`}
                          >
                            {day.date}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Date Info */}
        {selectedDate && selectedInfo && (
          <div className="tool-card mb-6">
            <h3 className="text-lg font-bold mb-3">
              {selectedInfo.dayName}, {MONTH_NAMES[selectedDate.month]} {selectedDate.date}, {selectedDate.year}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[var(--bg-secondary)] p-3 rounded text-center">
                <p className="text-lg font-bold text-[var(--primary)]">{selectedInfo.dayOfYear}</p>
                <p className="text-xs text-[var(--muted)]">Day of Year</p>
              </div>
              <div className="bg-[var(--bg-secondary)] p-3 rounded text-center">
                <p className="text-lg font-bold text-[var(--primary)]">{selectedInfo.weekOfYear}</p>
                <p className="text-xs text-[var(--muted)]">Week of Year</p>
              </div>
              <div className="bg-[var(--bg-secondary)] p-3 rounded text-center">
                <p className="text-lg font-bold text-[var(--primary)]">{selectedInfo.daysRemaining}</p>
                <p className="text-xs text-[var(--muted)]">Days Remaining</p>
              </div>
              <div className="bg-[var(--bg-secondary)] p-3 rounded text-center">
                <p className="text-lg font-bold text-[var(--primary)]">{selectedInfo.totalDays}</p>
                <p className="text-xs text-[var(--muted)]">Days in Year</p>
              </div>
            </div>
          </div>
        )}

        {/* Mini 3-month view */}
        <div className="tool-card mb-8">
          <h3 className="text-sm font-bold mb-3 text-center">3-Month Overview</h3>
          <div className="grid grid-cols-3 gap-4">
            <MiniCalendar year={prevMiniYear} month={prevMiniMonth} todayStr={todayStr} />
            <MiniCalendar year={viewYear} month={viewMonth} todayStr={todayStr} />
            <MiniCalendar year={nextMiniYear} month={nextMiniMonth} todayStr={todayStr} />
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Online Calendar Tool</h2>
          <p>
            A clean, interactive monthly calendar. Navigate between months, see week numbers, and click
            any date to get detailed information about that day.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Week Numbers:</strong> ISO week numbers displayed on each row</li>
            <li><strong>Today Highlight:</strong> Current date is highlighted for easy reference</li>
            <li><strong>Date Info:</strong> Click any date to see day of year, week of year, and days remaining</li>
            <li><strong>Mini 3-Month View:</strong> See previous, current, and next month at a glance</li>
            <li><strong>Navigation:</strong> Easily move between months with prev/next buttons</li>
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
            name: "Calendar",
            description: META.description,
            url: `${SITE_URL}/tools/calendar`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
