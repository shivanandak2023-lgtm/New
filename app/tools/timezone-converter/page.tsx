"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Time Zone Converter - Convert Time Between Cities Worldwide",
  description:
    "Free time zone converter to quickly convert time between major cities worldwide. See current time in New York, London, Tokyo, Sydney, Mumbai, Dubai, and more.",
  keywords:
    "time zone converter, timezone converter, world clock, time difference calculator, EST to IST, PST to GMT, convert time zones, time zone calculator",
};

const TIMEZONES = [
  { city: "New York", tz: "America/New_York", label: "New York (EST/EDT)" },
  { city: "Los Angeles", tz: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
  { city: "Chicago", tz: "America/Chicago", label: "Chicago (CST/CDT)" },
  { city: "London", tz: "Europe/London", label: "London (GMT/BST)" },
  { city: "Berlin", tz: "Europe/Berlin", label: "Berlin (CET/CEST)" },
  { city: "Paris", tz: "Europe/Paris", label: "Paris (CET/CEST)" },
  { city: "Dubai", tz: "Asia/Dubai", label: "Dubai (GST)" },
  { city: "Mumbai", tz: "Asia/Kolkata", label: "Mumbai (IST)" },
  { city: "Singapore", tz: "Asia/Singapore", label: "Singapore (SGT)" },
  { city: "Tokyo", tz: "Asia/Tokyo", label: "Tokyo (JST)" },
  { city: "Sydney", tz: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
  { city: "Auckland", tz: "Pacific/Auckland", label: "Auckland (NZST/NZDT)" },
];

function formatTimeInZone(date: Date, tz: string): string {
  return date.toLocaleString("en-US", {
    timeZone: tz,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatTimeOnly(date: Date | null, tz: string): string {
  if (!date) return "--:--";
  return date.toLocaleString("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateOnly(date: Date | null, tz: string): string {
  if (!date) return "---";
  return date.toLocaleString("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TimezoneConverterPage() {
  const [fromTz, setFromTz] = useState("America/New_York");
  const [toTz, setToTz] = useState("Europe/London");
  const [inputDate, setInputDate] = useState("");
  const [inputTime, setInputTime] = useState("");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [convertedResult, setConvertedResult] = useState<{
    fromDisplay: string;
    toDisplay: string;
  } | null>(null);

  // Update clock every second
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Set default date/time
  useEffect(() => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 5);
    setInputDate(dateStr);
    setInputTime(timeStr);
  }, []);

  function convert() {
    if (!inputDate || !inputTime) return;

    // Create a date in the "from" timezone
    const dateTimeStr = `${inputDate}T${inputTime}:00`;

    // Get the offset for the source timezone
    const tempDate = new Date(dateTimeStr);
    const fromStr = tempDate.toLocaleString("en-US", { timeZone: fromTz });
    const utcStr = tempDate.toLocaleString("en-US", { timeZone: "UTC" });

    const fromDate = new Date(fromStr);
    const utcDate = new Date(utcStr);
    const offset = utcDate.getTime() - fromDate.getTime();

    const utcTime = new Date(tempDate.getTime() + offset);

    setConvertedResult({
      fromDisplay: formatTimeInZone(utcTime, fromTz),
      toDisplay: formatTimeInZone(utcTime, toTz),
    });
  }

  function swapTimezones() {
    setFromTz(toTz);
    setToTz(fromTz);
    setConvertedResult(null);
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/timezone-converter`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/timezone-converter`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Time Zone Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert time between major cities and time zones worldwide. See the current time in different zones and plan meetings across time zones.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Current time in selected zones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="result-card text-center">
            <p className="text-sm text-[var(--muted)] mb-1">
              Current time in {TIMEZONES.find((t) => t.tz === fromTz)?.city || fromTz}
            </p>
            <p className="text-xl font-bold text-[var(--primary)]">{formatTimeOnly(currentTime, fromTz)}</p>
            <p className="text-sm text-[var(--muted)]">{formatDateOnly(currentTime, fromTz)}</p>
          </div>
          <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
            <p className="text-sm text-[var(--muted)] mb-1">
              Current time in {TIMEZONES.find((t) => t.tz === toTz)?.city || toTz}
            </p>
            <p className="text-xl font-bold text-green-700">{formatTimeOnly(currentTime, toTz)}</p>
            <p className="text-sm text-[var(--muted)]">{formatDateOnly(currentTime, toTz)}</p>
          </div>
        </div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">From Timezone</label>
              <select value={fromTz} onChange={(e) => { setFromTz(e.target.value); setConvertedResult(null); }} className="input-field">
                {TIMEZONES.map((tz) => (
                  <option key={tz.tz} value={tz.tz}>{tz.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">To Timezone</label>
              <select value={toTz} onChange={(e) => { setToTz(e.target.value); setConvertedResult(null); }} className="input-field">
                {TIMEZONES.map((tz) => (
                  <option key={tz.tz} value={tz.tz}>{tz.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={convert} className="btn-primary">
              Convert Time
            </button>
            <button
              onClick={swapTimezones}
              className="px-4 py-2 rounded-lg border border-[var(--card-border)] hover:border-[var(--primary)] transition-colors font-medium"
            >
              Swap Zones
            </button>
          </div>
        </div>

        {convertedResult && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">
                  {TIMEZONES.find((t) => t.tz === fromTz)?.city || "Source"}
                </p>
                <p className="text-lg font-bold text-[var(--primary)]">{convertedResult.fromDisplay}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">
                  {TIMEZONES.find((t) => t.tz === toTz)?.city || "Target"}
                </p>
                <p className="text-lg font-bold text-green-700">{convertedResult.toDisplay}</p>
              </div>
            </div>
          </div>
        )}

        {/* World clock */}
        <div className="tool-card mb-8 overflow-x-auto">
          <h2 className="text-lg font-bold mb-4">World Clock - Current Time</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--muted-bg)]">
                <th className="border border-[var(--card-border)] px-3 py-2 text-left">City</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-right">Current Time</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {TIMEZONES.map((tz) => (
                <tr key={tz.tz} className="hover:bg-[var(--muted-bg)]">
                  <td className="border border-[var(--card-border)] px-3 py-2 font-medium">{tz.city}</td>
                  <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">
                    {formatTimeOnly(currentTime, tz.tz)}
                  </td>
                  <td className="border border-[var(--card-border)] px-3 py-2 text-right text-[var(--muted)]">
                    {formatDateOnly(currentTime, tz.tz)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Use the Time Zone Converter</h2>
          <p>
            Select the source and destination time zones, enter a date and time, and click &quot;Convert Time&quot; to see
            the equivalent time in the target zone. The world clock below shows the current time in all major cities.
          </p>

          <h2>Common Time Zone Conversions</h2>
          <ul>
            <li><strong>EST to GMT:</strong> Add 5 hours (EST is UTC-5)</li>
            <li><strong>PST to EST:</strong> Add 3 hours (PST is UTC-8, EST is UTC-5)</li>
            <li><strong>EST to IST:</strong> Add 10 hours 30 minutes (IST is UTC+5:30)</li>
            <li><strong>GMT to JST:</strong> Add 9 hours (JST is UTC+9)</li>
            <li><strong>PST to GMT:</strong> Add 8 hours (PST is UTC-8)</li>
          </ul>

          <h2>Daylight Saving Time</h2>
          <p>
            Many countries observe Daylight Saving Time (DST), which shifts clocks forward by one hour during warmer months.
            In the US, clocks &quot;spring forward&quot; in March and &quot;fall back&quot; in November. This converter automatically
            accounts for DST based on the date you enter.
          </p>

          <h3>Tips for Scheduling Across Time Zones</h3>
          <ul>
            <li>Always specify the time zone when scheduling international meetings</li>
            <li>Use UTC (Coordinated Universal Time) as a neutral reference point</li>
            <li>Be aware of DST changes, which happen on different dates in different countries</li>
            <li>Consider overlap hours that work for all participants</li>
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
            name: "Time Zone Converter",
            description: META.description,
            url: `${SITE_URL}/tools/timezone-converter`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
