"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Cron Expression Generator - Build Cron Jobs Online Free",
  description:
    "Free cron expression generator and parser. Build cron schedules visually or paste a cron expression to get a human-readable description. Supports standard 5-field cron syntax.",
  keywords: "cron generator, cron expression, crontab, cron builder, cron parser, cron schedule, cron job",
};

const MONTHS = ["Any", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS_OF_WEEK = ["Any", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function describeCronField(value: string, singular: string, names?: string[]): string {
  if (value === "*") return `every ${singular}`;
  if (value.startsWith("*/")) return `every ${value.slice(2)} ${singular}s`;
  if (value.includes(",")) {
    const parts = value.split(",").map((v) => names ? (names[parseInt(v)] || v) : v);
    return `at ${singular} ${parts.join(", ")}`;
  }
  if (value.includes("-")) {
    const [start, end] = value.split("-");
    return `${singular}s ${names ? names[parseInt(start)] || start : start} through ${names ? names[parseInt(end)] || end : end}`;
  }
  return names ? (names[parseInt(value)] || value) : value;
}

function describeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron expression (need 5 fields)";

  const [min, hour, dom, month, dow] = parts;
  const segments: string[] = [];

  if (min === "*" && hour === "*" && dom === "*" && month === "*" && dow === "*") {
    return "Every minute";
  }
  if (min !== "*" && hour === "*") {
    segments.push(describeCronField(min, "minute"));
  }
  if (hour !== "*" && min !== "*") {
    const h = parseInt(hour);
    const m = parseInt(min);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    segments.push(`At ${h12}:${String(m).padStart(2, "0")} ${ampm}`);
  } else if (hour !== "*") {
    segments.push(describeCronField(hour, "hour"));
  }
  if (dom !== "*") segments.push(`on day ${dom} of the month`);
  if (month !== "*") segments.push(`in ${describeCronField(month, "month", MONTHS)}`);
  if (dow !== "*") segments.push(`on ${describeCronField(dow, "day", DAYS_OF_WEEK)}`);

  return segments.join(", ") || "Every minute";
}

export default function CronGeneratorPage() {
  const [mode, setMode] = useState<"build" | "parse">("build");
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");
  const [parseInput, setParseInput] = useState("");
  const [copied, setCopied] = useState(false);

  const [everyMinutes, setEveryMinutes] = useState("5");
  const [specificHour, setSpecificHour] = useState("0");
  const [specificMinute, setSpecificMinute] = useState("0");

  const cronExpr = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  const description = useMemo(() => {
    return mode === "build" ? describeCron(cronExpr) : describeCron(parseInput);
  }, [mode, cronExpr, parseInput]);

  function setPreset(preset: string) {
    const parts = preset.split(" ");
    setMinute(parts[0]);
    setHour(parts[1]);
    setDayOfMonth(parts[2]);
    setMonth(parts[3]);
    setDayOfWeek(parts[4]);
  }

  function applyEveryMinutes() {
    setMinute(`*/${everyMinutes}`);
    setHour("*");
    setDayOfMonth("*");
    setMonth("*");
    setDayOfWeek("*");
  }

  function applySpecificTime() {
    setMinute(specificMinute);
    setHour(specificHour);
  }

  function copy() {
    const text = mode === "build" ? cronExpr : parseInput;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/cron-generator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Cron Expression Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Build cron expressions visually or parse existing ones to human-readable descriptions.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("build")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "build" ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
            }`}
          >
            Build Expression
          </button>
          <button
            onClick={() => setMode("parse")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "parse" ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
            }`}
          >
            Parse Expression
          </button>
        </div>

        {mode === "build" && (
          <div className="tool-card mb-8">
            <p className="text-sm font-medium mb-3">Quick Presets</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { label: "Every minute", expr: "* * * * *" },
                { label: "Every hour", expr: "0 * * * *" },
                { label: "Every day at midnight", expr: "0 0 * * *" },
                { label: "Every Monday at 9 AM", expr: "0 9 * * 1" },
                { label: "Every 1st of month", expr: "0 0 1 * *" },
                { label: "Weekdays at 8 AM", expr: "0 8 * * 1-5" },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => setPreset(p.expr)}
                  className="px-3 py-1 text-xs rounded-full border border-[var(--card-border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-xs font-medium mb-1">Every X minutes</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={everyMinutes}
                    onChange={(e) => setEveryMinutes(e.target.value)}
                    min={1}
                    max={59}
                    className="w-20 border border-[var(--card-border)] rounded px-2 py-1 text-sm"
                  />
                  <button onClick={applyEveryMinutes} className="text-xs text-[var(--primary)] hover:underline">
                    Apply
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Specific time (daily)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={specificHour}
                    onChange={(e) => setSpecificHour(e.target.value)}
                    min={0}
                    max={23}
                    placeholder="HH"
                    className="w-16 border border-[var(--card-border)] rounded px-2 py-1 text-sm"
                  />
                  <span className="self-center">:</span>
                  <input
                    type="number"
                    value={specificMinute}
                    onChange={(e) => setSpecificMinute(e.target.value)}
                    min={0}
                    max={59}
                    placeholder="MM"
                    className="w-16 border border-[var(--card-border)] rounded px-2 py-1 text-sm"
                  />
                  <button onClick={applySpecificTime} className="text-xs text-[var(--primary)] hover:underline">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3 mb-6">
              {[
                { label: "Minute", value: minute, set: setMinute, hint: "0-59" },
                { label: "Hour", value: hour, set: setHour, hint: "0-23" },
                { label: "Day (Month)", value: dayOfMonth, set: setDayOfMonth, hint: "1-31" },
                { label: "Month", value: month, set: setMonth, hint: "1-12" },
                { label: "Day (Week)", value: dayOfWeek, set: setDayOfWeek, hint: "0-6" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-medium mb-1">{f.label}</label>
                  <input
                    type="text"
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    className="w-full border border-[var(--card-border)] rounded px-2 py-1 text-sm font-mono text-center"
                  />
                  <p className="text-[10px] text-[var(--muted)] text-center mt-1">{f.hint}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-center text-lg mb-4">
              {cronExpr}
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-[var(--muted)]">{description}</p>
            </div>

            <button onClick={copy} className="btn-primary w-full">
              {copied ? "Copied!" : "Copy Cron Expression"}
            </button>
          </div>
        )}

        {mode === "parse" && (
          <div className="tool-card mb-8">
            <label className="block text-sm font-medium mb-2">Paste Cron Expression</label>
            <input
              type="text"
              value={parseInput}
              onChange={(e) => setParseInput(e.target.value)}
              placeholder="*/5 * * * *"
              className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 font-mono text-sm mb-4"
            />

            {parseInput.trim() && (
              <div className="result-card">
                <p className="text-sm font-medium mb-1">Human-Readable Description</p>
                <p className="text-lg">{description}</p>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is a Cron Expression?</h2>
          <p>
            A cron expression is a string of five fields representing a schedule. It&apos;s used in
            Unix/Linux systems, CI/CD pipelines, and cloud services to schedule recurring tasks.
          </p>

          <h2>Cron Expression Format</h2>
          <ul>
            <li><strong>Minute</strong> (0-59) — When in the hour to run</li>
            <li><strong>Hour</strong> (0-23) — Which hour to run</li>
            <li><strong>Day of Month</strong> (1-31) — Which day of the month</li>
            <li><strong>Month</strong> (1-12) — Which month</li>
            <li><strong>Day of Week</strong> (0-6, Sun=0) — Which day of the week</li>
          </ul>

          <h3>Special Characters</h3>
          <ul>
            <li><code>*</code> — Every value (wildcard)</li>
            <li><code>*/n</code> — Every n intervals</li>
            <li><code>a-b</code> — Range from a to b</li>
            <li><code>a,b,c</code> — Specific values</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            All processing happens in your browser. No data is sent to any server.
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
            name: "Cron Expression Generator",
            description: META.description,
            url: `${SITE_URL}/tools/cron-generator`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
