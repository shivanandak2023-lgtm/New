"use client";

import { useState, useEffect, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Countdown to Date - Live Countdown Timer",
  description:
    "Free Countdown to Date tool. Set a target date and watch the live countdown in days, hours, minutes, and seconds. Preset events and fullscreen mode.",
  keywords: "countdown to date, countdown timer, days until, event countdown, new year countdown, live countdown",
};

const PRESETS = [
  { name: "New Year 2027", date: "2027-01-01T00:00:00" },
  { name: "Valentine's Day", date: "2027-02-14T00:00:00" },
  { name: "Halloween", date: "2026-10-31T00:00:00" },
  { name: "Christmas 2026", date: "2026-12-25T00:00:00" },
];

function getNextDate(dateStr: string): Date {
  const d = new Date(dateStr);
  const now = new Date();
  if (d < now) {
    d.setFullYear(d.getFullYear() + 1);
  }
  return d;
}

export default function CountdownToDatePage() {
  const [targetDate, setTargetDate] = useState("");
  const [targetLabel, setTargetLabel] = useState("");
  const [now, setNow] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const target = targetDate ? new Date(targetDate) : null;
  const diff = target && now ? target.getTime() - now.getTime() : 0;
  const isPast = diff <= 0 && target !== null;

  const absDiff = Math.abs(diff);
  const totalSeconds = Math.floor(absDiff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const setPreset = (preset: { name: string; date: string }) => {
    const d = getNextDate(preset.date);
    setTargetDate(d.toISOString().slice(0, 16));
    setTargetLabel(preset.name);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const shareLink = () => {
    if (!targetDate) return;
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}${window.location.pathname}?date=${encodeURIComponent(targetDate)}&label=${encodeURIComponent(targetLabel)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Parse URL params on load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("date");
    const labelParam = params.get("label");
    if (dateParam) {
      setTargetDate(dateParam);
      if (labelParam) setTargetLabel(labelParam);
    }
  }, []);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/countdown-to-date`} />

      <div className="max-w-4xl mx-auto px-4 py-8" ref={containerRef}>
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Countdown to Date</h1>
        <p className="text-[var(--muted)] mb-8">
          Set a target date and watch the live countdown. Use presets for popular events or enter a custom date.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {PRESETS.map((p) => (
              <button key={p.name} onClick={() => setPreset(p)} className="btn-secondary text-sm">
                {p.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event Name (optional)</label>
              <input
                type="text"
                value={targetLabel}
                onChange={(e) => setTargetLabel(e.target.value)}
                className="input-field text-sm"
                placeholder="e.g. My Birthday"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Date &amp; Time</label>
              <input
                type="datetime-local"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="input-field text-sm"
              />
            </div>
          </div>
        </div>

        {target && now && (
          <div className="tool-card mb-6 text-center py-8">
            {targetLabel && (
              <h2 className="text-xl font-bold mb-4">{targetLabel}</h2>
            )}

            {isPast ? (
              <p className="text-2xl font-bold text-green-600">This event has passed!</p>
            ) : (
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                {[
                  { value: days, label: "Days" },
                  { value: hours, label: "Hours" },
                  { value: minutes, label: "Minutes" },
                  { value: seconds, label: "Seconds" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-4xl md:text-5xl font-bold text-[var(--primary)] font-mono">
                      {String(item.value).padStart(2, "0")}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center gap-3 mt-6">
              <button onClick={toggleFullscreen} className="btn-secondary text-sm">
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </button>
              <button onClick={shareLink} className="btn-secondary text-sm">
                {copied ? "Link Copied!" : "Share Link"}
              </button>
            </div>
          </div>
        )}

        {target && now && !isPast && (
          <div className="tool-card mb-8">
            <h3 className="text-sm font-medium mb-2">Total Countdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[var(--bg-secondary)] p-3 rounded text-center">
                <p className="text-lg font-bold">{days.toLocaleString()}</p>
                <p className="text-xs text-[var(--muted)]">Total Days</p>
              </div>
              <div className="bg-[var(--bg-secondary)] p-3 rounded text-center">
                <p className="text-lg font-bold">{(days * 24 + hours).toLocaleString()}</p>
                <p className="text-xs text-[var(--muted)]">Total Hours</p>
              </div>
              <div className="bg-[var(--bg-secondary)] p-3 rounded text-center">
                <p className="text-lg font-bold">{((days * 24 + hours) * 60 + minutes).toLocaleString()}</p>
                <p className="text-xs text-[var(--muted)]">Total Minutes</p>
              </div>
              <div className="bg-[var(--bg-secondary)] p-3 rounded text-center">
                <p className="text-lg font-bold">{totalSeconds.toLocaleString()}</p>
                <p className="text-xs text-[var(--muted)]">Total Seconds</p>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Countdown Timer Tool</h2>
          <p>
            Set any future date and time to see a live countdown with days, hours, minutes, and seconds ticking down in real-time.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Preset Events:</strong> Quick countdowns to New Year, Christmas, Halloween, and Valentine&apos;s Day</li>
            <li><strong>Custom Dates:</strong> Enter any date and time for a personalized countdown</li>
            <li><strong>Share Link:</strong> Copy a link with your countdown pre-filled to share with others</li>
            <li><strong>Fullscreen Mode:</strong> Display the countdown in fullscreen for events</li>
            <li><strong>Live Ticking:</strong> Updates every second in real-time</li>
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
            name: "Countdown to Date",
            description: META.description,
            url: `${SITE_URL}/tools/countdown-to-date`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
