"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Online Stopwatch & Countdown Timer with Lap Tracking",
  description:
    "Free online stopwatch and countdown timer. Features lap tracking, precise timing, and audio alerts. Perfect for workouts, cooking, studying, and more.",
  keywords:
    "online stopwatch, online timer, countdown timer, lap timer, stopwatch online, free timer, workout timer",
};

type Tab = "stopwatch" | "timer";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const millis = Math.floor((ms % 1000) / 10);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${millis
    .toString()
    .padStart(2, "0")}`;
}

function formatTimerDisplay(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gain.gain.value = 0.5;
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      ctx.close();
    }, 500);
  } catch {
    // Audio not available
  }
}

export default function StopwatchTimerPage() {
  const [tab, setTab] = useState<Tab>("stopwatch");

  // Stopwatch state
  const [swRunning, setSwRunning] = useState(false);
  const [swElapsed, setSwElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const swIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const swStartTimeRef = useRef<number>(0);
  const swAccumulatedRef = useRef<number>(0);

  // Timer state
  const [timerHours, setTimerHours] = useState("0");
  const [timerMinutes, setTimerMinutes] = useState("5");
  const [timerSeconds, setTimerSeconds] = useState("0");
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [timerFinished, setTimerFinished] = useState(false);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerEndRef = useRef<number>(0);

  // Stopwatch controls
  const startStopwatch = useCallback(() => {
    if (swRunning) return;
    setSwRunning(true);
    swStartTimeRef.current = Date.now();
    swIntervalRef.current = setInterval(() => {
      setSwElapsed(swAccumulatedRef.current + (Date.now() - swStartTimeRef.current));
    }, 10);
  }, [swRunning]);

  const stopStopwatch = useCallback(() => {
    if (!swRunning) return;
    setSwRunning(false);
    if (swIntervalRef.current) clearInterval(swIntervalRef.current);
    swAccumulatedRef.current += Date.now() - swStartTimeRef.current;
    setSwElapsed(swAccumulatedRef.current);
  }, [swRunning]);

  const resetStopwatch = useCallback(() => {
    setSwRunning(false);
    if (swIntervalRef.current) clearInterval(swIntervalRef.current);
    swAccumulatedRef.current = 0;
    swStartTimeRef.current = 0;
    setSwElapsed(0);
    setLaps([]);
  }, []);

  const addLap = useCallback(() => {
    if (!swRunning) return;
    setLaps((prev) => [swElapsed, ...prev]);
  }, [swRunning, swElapsed]);

  // Timer controls
  const startTimer = useCallback(() => {
    if (timerRunning) return;
    let totalSec = timerRemaining;
    if (totalSec <= 0) {
      totalSec =
        parseInt(timerHours || "0") * 3600 +
        parseInt(timerMinutes || "0") * 60 +
        parseInt(timerSeconds || "0");
    }
    if (totalSec <= 0) return;

    setTimerFinished(false);
    setTimerRunning(true);
    timerEndRef.current = Date.now() + totalSec * 1000;

    timerIntervalRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((timerEndRef.current - Date.now()) / 1000));
      setTimerRemaining(remaining);
      if (remaining <= 0) {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setTimerRunning(false);
        setTimerFinished(true);
        playBeep();
        setTimeout(playBeep, 600);
        setTimeout(playBeep, 1200);
      }
    }, 100);
  }, [timerRunning, timerRemaining, timerHours, timerMinutes, timerSeconds]);

  const pauseTimer = useCallback(() => {
    if (!timerRunning) return;
    setTimerRunning(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimerRemaining(Math.max(0, Math.ceil((timerEndRef.current - Date.now()) / 1000)));
  }, [timerRunning]);

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerFinished(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimerRemaining(0);
  }, []);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const quickTimers = [
    { label: "1 min", s: 60 },
    { label: "3 min", s: 180 },
    { label: "5 min", s: 300 },
    { label: "10 min", s: 600 },
    { label: "15 min", s: 900 },
    { label: "25 min", s: 1500 },
    { label: "30 min", s: 1800 },
    { label: "1 hour", s: 3600 },
  ];

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/stopwatch-timer`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/stopwatch-timer`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">
            &larr; All Tools
          </a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Stopwatch &amp; Timer</h1>
        <p className="text-[var(--muted)] mb-8">
          Free online stopwatch with lap tracking and countdown timer with audio alerts.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Tab selector */}
        <div className="flex gap-2 mb-6">
          {([
            { key: "stopwatch" as Tab, label: "Stopwatch" },
            { key: "timer" as Tab, label: "Timer" },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Stopwatch */}
        {tab === "stopwatch" && (
          <div className="tool-card mb-8">
            <div className="text-center py-8">
              <p className="font-mono text-6xl sm:text-7xl font-bold tracking-wider text-[var(--foreground)]">
                {formatTime(swElapsed)}
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {!swRunning ? (
                <button onClick={startStopwatch} className="btn-primary px-8 py-3 text-lg">
                  {swElapsed > 0 ? "Resume" : "Start"}
                </button>
              ) : (
                <button onClick={stopStopwatch} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-medium cursor-pointer">
                  Stop
                </button>
              )}
              <button onClick={addLap} disabled={!swRunning} className="btn-secondary px-6 py-3 text-lg">
                Lap
              </button>
              <button onClick={resetStopwatch} className="btn-secondary px-6 py-3 text-lg">
                Reset
              </button>
            </div>

            {laps.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3">Laps</h3>
                <div className="max-h-60 overflow-y-auto">
                  {laps.map((lap, i) => (
                    <div
                      key={i}
                      className="flex justify-between py-2 border-b border-[var(--card-border)] text-sm font-mono"
                    >
                      <span className="text-[var(--muted)]">Lap {laps.length - i}</span>
                      <span className="font-bold">{formatTime(lap)}</span>
                      {i < laps.length - 1 && (
                        <span className="text-[var(--muted)]">
                          +{formatTime(lap - laps[i + 1])}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timer */}
        {tab === "timer" && (
          <div className="tool-card mb-8">
            {!timerRunning && timerRemaining <= 0 && !timerFinished ? (
              <>
                <h2 className="font-bold text-lg mb-4">Set Countdown Time</h2>
                <div className="flex justify-center items-end gap-4 mb-6">
                  <div className="text-center">
                    <label className="block text-sm text-[var(--muted)] mb-1">Hours</label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={timerHours}
                      onChange={(e) => setTimerHours(e.target.value)}
                      className="input-field w-20 text-center text-2xl font-mono"
                    />
                  </div>
                  <span className="text-3xl font-bold pb-2">:</span>
                  <div className="text-center">
                    <label className="block text-sm text-[var(--muted)] mb-1">Minutes</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={timerMinutes}
                      onChange={(e) => setTimerMinutes(e.target.value)}
                      className="input-field w-20 text-center text-2xl font-mono"
                    />
                  </div>
                  <span className="text-3xl font-bold pb-2">:</span>
                  <div className="text-center">
                    <label className="block text-sm text-[var(--muted)] mb-1">Seconds</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={timerSeconds}
                      onChange={(e) => setTimerSeconds(e.target.value)}
                      className="input-field w-20 text-center text-2xl font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {quickTimers.map((qt) => (
                    <button
                      key={qt.s}
                      onClick={() => {
                        const h = Math.floor(qt.s / 3600);
                        const m = Math.floor((qt.s % 3600) / 60);
                        const s = qt.s % 60;
                        setTimerHours(h.toString());
                        setTimerMinutes(m.toString());
                        setTimerSeconds(s.toString());
                      }}
                      className="btn-secondary text-sm"
                    >
                      {qt.label}
                    </button>
                  ))}
                </div>

                <div className="text-center">
                  <button onClick={startTimer} className="btn-primary px-8 py-3 text-lg">
                    Start Timer
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center py-8">
                  <p
                    className={`font-mono text-6xl sm:text-7xl font-bold tracking-wider ${
                      timerFinished
                        ? "text-red-500 animate-pulse"
                        : timerRemaining <= 10
                        ? "text-orange-500"
                        : "text-[var(--foreground)]"
                    }`}
                  >
                    {formatTimerDisplay(timerRemaining)}
                  </p>
                  {timerFinished && (
                    <p className="text-xl font-bold text-red-500 mt-4">
                      Time is up!
                    </p>
                  )}
                </div>

                <div className="flex justify-center gap-3">
                  {timerRunning ? (
                    <button onClick={pauseTimer} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-medium cursor-pointer">
                      Pause
                    </button>
                  ) : timerRemaining > 0 ? (
                    <button onClick={startTimer} className="btn-primary px-8 py-3 text-lg">
                      Resume
                    </button>
                  ) : null}
                  <button onClick={resetTimer} className="btn-secondary px-6 py-3 text-lg">
                    Reset
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Online Stopwatch &amp; Timer</h2>
          <p>
            This free online stopwatch and countdown timer is perfect for everyday timing needs. Whether you are
            exercising, studying, cooking, or working, this tool provides accurate, reliable timing with a clean interface.
          </p>

          <h2>Stopwatch Features</h2>
          <ul>
            <li>Precise timing with millisecond accuracy</li>
            <li>Lap tracking to record split times</li>
            <li>Start, stop, and resume functionality</li>
            <li>Clean, large display for easy reading</li>
          </ul>

          <h2>Timer Features</h2>
          <ul>
            <li>Set hours, minutes, and seconds for custom countdowns</li>
            <li>Quick preset buttons for common durations</li>
            <li>Audio alert when the countdown reaches zero</li>
            <li>Pause and resume support</li>
          </ul>

          <h2>Common Uses</h2>
          <ul>
            <li>Workout and exercise interval timing</li>
            <li>Pomodoro technique study sessions (25-minute focus blocks)</li>
            <li>Cooking and baking timers</li>
            <li>Presentation practice and speech timing</li>
            <li>Game timing and turn-based activities</li>
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
            name: "Stopwatch & Timer",
            description: META.description,
            url: `${SITE_URL}/tools/stopwatch-timer`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
