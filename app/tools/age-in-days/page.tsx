"use client";

import { useState, useEffect, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Age in Days Calculator - How Many Days Old Are You?",
  description:
    "Calculate your exact age in days, hours, minutes, and seconds with a live ticking counter. Find your zodiac sign, Chinese zodiac, day of birth, and fun facts.",
  keywords: "age in days, days old calculator, how many days old, age in hours, age in minutes, birthday calculator",
};

const ZODIAC_SIGNS = [
  { sign: "Capricorn", start: [1, 1], end: [1, 19], emoji: "\u2651" },
  { sign: "Aquarius", start: [1, 20], end: [2, 18], emoji: "\u2652" },
  { sign: "Pisces", start: [2, 19], end: [3, 20], emoji: "\u2653" },
  { sign: "Aries", start: [3, 21], end: [4, 19], emoji: "\u2648" },
  { sign: "Taurus", start: [4, 20], end: [5, 20], emoji: "\u2649" },
  { sign: "Gemini", start: [5, 21], end: [6, 20], emoji: "\u264A" },
  { sign: "Cancer", start: [6, 21], end: [7, 22], emoji: "\u264B" },
  { sign: "Leo", start: [7, 23], end: [8, 22], emoji: "\u264C" },
  { sign: "Virgo", start: [8, 23], end: [9, 22], emoji: "\u264D" },
  { sign: "Libra", start: [9, 23], end: [10, 22], emoji: "\u264E" },
  { sign: "Scorpio", start: [10, 23], end: [11, 21], emoji: "\u264F" },
  { sign: "Sagittarius", start: [11, 22], end: [12, 21], emoji: "\u2650" },
  { sign: "Capricorn", start: [12, 22], end: [12, 31], emoji: "\u2651" },
];

const CHINESE_ZODIAC = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat"];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getZodiacSign(month: number, day: number) {
  for (const z of ZODIAC_SIGNS) {
    const afterStart = month > z.start[0] || (month === z.start[0] && day >= z.start[1]);
    const beforeEnd = month < z.end[0] || (month === z.end[0] && day <= z.end[1]);
    if (afterStart && beforeEnd) return z;
  }
  return ZODIAC_SIGNS[0];
}

function getChineseZodiac(year: number) {
  return CHINESE_ZODIAC[year % 12];
}

export default function AgeInDaysPage() {
  const [birthDate, setBirthDate] = useState("");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const calculate = useCallback(() => {
    if (!birthDate || !now) return null;
    const birth = new Date(birthDate + "T00:00:00");
    if (isNaN(birth.getTime()) || birth > now) return null;

    const diffMs = now.getTime() - birth.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const dayOfWeek = DAYS[birth.getDay()];
    const month = birth.getMonth() + 1;
    const day = birth.getDate();
    const year = birth.getFullYear();
    const zodiac = getZodiacSign(month, day);
    const chineseZodiac = getChineseZodiac(year);

    // Days until next birthday
    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const heartbeats = Math.floor(totalMinutes * 72); // avg 72 bpm
    const breaths = Math.floor(totalMinutes * 16); // avg 16 per minute
    const sleepHours = Math.floor(totalDays * 8); // avg 8 hours sleep

    return {
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      dayOfWeek,
      zodiac,
      chineseZodiac,
      daysUntilBirthday,
      heartbeats,
      breaths,
      sleepHours,
    };
  }, [birthDate, now]);

  const result = calculate();

  function formatBigNumber(n: number): string {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
    return n.toLocaleString();
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/age-in-days`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Age in Days Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Find out exactly how many days, hours, minutes, and seconds you have been alive.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <label className="block text-sm font-medium mb-2">Your Birth Date</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="input-field text-lg"
            max={now ? now.toISOString().split("T")[0] : ""}
          />
        </div>

        {result && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Days", value: result.totalDays.toLocaleString() },
                { label: "Hours", value: result.totalHours.toLocaleString() },
                { label: "Minutes", value: result.totalMinutes.toLocaleString() },
                { label: "Seconds", value: result.totalSeconds.toLocaleString() },
              ].map((item) => (
                <div key={item.label} className="tool-card text-center py-4">
                  <p className="text-2xl font-bold text-[var(--primary)] font-mono">{item.value}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <div className="tool-card py-3 text-center">
                <p className="text-sm text-[var(--muted)]">Born on</p>
                <p className="text-lg font-bold">{result.dayOfWeek}</p>
              </div>
              <div className="tool-card py-3 text-center">
                <p className="text-sm text-[var(--muted)]">Zodiac Sign</p>
                <p className="text-lg font-bold">{result.zodiac.emoji} {result.zodiac.sign}</p>
              </div>
              <div className="tool-card py-3 text-center">
                <p className="text-sm text-[var(--muted)]">Chinese Zodiac</p>
                <p className="text-lg font-bold">{result.chineseZodiac}</p>
              </div>
              <div className="tool-card py-3 text-center">
                <p className="text-sm text-[var(--muted)]">Days Until Birthday</p>
                <p className="text-lg font-bold text-[var(--primary)]">{result.daysUntilBirthday}</p>
              </div>
              <div className="tool-card py-3 text-center">
                <p className="text-sm text-[var(--muted)]">Heartbeats</p>
                <p className="text-lg font-bold">{formatBigNumber(result.heartbeats)}</p>
              </div>
              <div className="tool-card py-3 text-center">
                <p className="text-sm text-[var(--muted)]">Breaths Taken</p>
                <p className="text-lg font-bold">{formatBigNumber(result.breaths)}</p>
              </div>
            </div>

            <div className="tool-card mb-8 bg-[var(--bg-secondary)]">
              <p className="text-sm font-medium mb-2">Fun Facts</p>
              <ul className="text-sm text-[var(--muted)] space-y-1">
                <li>You have slept approximately <strong>{result.sleepHours.toLocaleString()} hours</strong> in your life</li>
                <li>Your heart has beaten roughly <strong>{formatBigNumber(result.heartbeats)} times</strong></li>
                <li>You have taken about <strong>{formatBigNumber(result.breaths)} breaths</strong></li>
                <li>You are <strong>{(result.totalDays / 365.25).toFixed(2)} years</strong> old precisely</li>
              </ul>
            </div>
          </>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does the Age in Days Calculator Work?</h2>
          <p>
            Enter your birth date and the tool calculates the exact difference between your birth date and
            the current moment in days, hours, minutes, and seconds. The counter updates every second in real-time.
          </p>

          <h2>Additional Information</h2>
          <ul>
            <li><strong>Day of Birth:</strong> Find out what day of the week you were born on</li>
            <li><strong>Zodiac Sign:</strong> Your Western zodiac sign based on your birthday</li>
            <li><strong>Chinese Zodiac:</strong> Your Chinese zodiac animal based on your birth year</li>
            <li><strong>Next Birthday:</strong> How many days until your next birthday</li>
            <li><strong>Heartbeats:</strong> Estimated based on average of 72 beats per minute</li>
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
            name: "Age in Days Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/age-in-days`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
