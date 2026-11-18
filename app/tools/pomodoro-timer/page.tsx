"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Pomodoro Timer - Focus Timer with Work & Break Sessions",
  description:
    "Free Pomodoro Timer for productivity. Customizable work and break intervals, visual circular progress, session counter, and audio notifications.",
  keywords: "pomodoro timer, focus timer, productivity timer, work timer, study timer, 25 minute timer",
};

type Phase = "work" | "shortBreak" | "longBreak";

function playBeep() {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gain.gain.value = 0.3;
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    oscillator.stop(ctx.currentTime + 0.5);
    // Second beep
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 1000;
      osc2.type = "sine";
      gain2.gain.value = 0.3;
      osc2.start();
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 0.5);
    }, 300);
  } catch {
    // Audio not supported
  }
}

export default function PomodoroTimerPage() {
  const [workTime, setWorkTime] = useState<number>(25);
  const [shortBreakTime, setShortBreakTime] = useState<number>(5);
  const [longBreakTime, setLongBreakTime] = useState<number>(15);
  const [sessionsBeforeLong, setSessionsBeforeLong] = useState<number>(4);

  const [phase, setPhase] = useState<Phase>("work");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [initialized, setInitialized] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize timeLeft on mount and when workTime changes (while not running)
  useEffect(() => {
    if (!isRunning && !initialized) {
      setTimeLeft(workTime * 60);
      setInitialized(true);
    }
  }, [workTime, isRunning, initialized]);

  const getTotalSeconds = useCallback(() => {
    switch (phase) {
      case "work": return workTime * 60;
      case "shortBreak": return shortBreakTime * 60;
      case "longBreak": return longBreakTime * 60;
    }
  }, [phase, workTime, shortBreakTime, longBreakTime]);

  const startNextPhase = useCallback((currentPhase: Phase, sessions: number) => {
    playBeep();
    if (currentPhase === "work") {
      const newSessions = sessions + 1;
      setCompletedSessions(newSessions);
      if (newSessions % sessionsBeforeLong === 0) {
        setPhase("longBreak");
        setTimeLeft(longBreakTime * 60);
      } else {
        setPhase("shortBreak");
        setTimeLeft(shortBreakTime * 60);
      }
    } else {
      setPhase("work");
      setTimeLeft(workTime * 60);
    }
  }, [sessionsBeforeLong, workTime, shortBreakTime, longBreakTime]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            startNextPhase(phase, completedSessions);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, phase, completedSessions, startNextPhase]);

  function toggleTimer() {
    if (!isRunning && timeLeft === 0) {
      setTimeLeft(getTotalSeconds());
    }
    setIsRunning(!isRunning);
  }

  function resetTimer() {
    setIsRunning(false);
    setPhase("work");
    setTimeLeft(workTime * 60);
    setCompletedSessions(0);
  }

  function skipPhase() {
    setIsRunning(false);
    startNextPhase(phase, completedSessions);
  }

  const totalSeconds = getTotalSeconds();
  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) : 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // SVG circle properties
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const phaseColors: Record<Phase, string> = {
    work: "var(--primary)",
    shortBreak: "#22c55e",
    longBreak: "#3b82f6",
  };

  const phaseLabels: Record<Phase, string> = {
    work: "Work",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  };

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/pomodoro-timer`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Pomodoro Timer</h1>
        <p className="text-[var(--muted)] mb-8">
          Stay focused and productive with customizable work and break sessions.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          {/* Phase indicator */}
          <div className="flex justify-center gap-3 mb-8">
            {(["work", "shortBreak", "longBreak"] as Phase[]).map((p) => (
              <button
                key={p}
                onClick={() => {
                  if (!isRunning) {
                    setPhase(p);
                    setTimeLeft(
                      p === "work" ? workTime * 60 : p === "shortBreak" ? shortBreakTime * 60 : longBreakTime * 60
                    );
                  }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  phase === p
                    ? "text-white"
                    : "bg-[var(--muted-bg)] hover:bg-gray-200"
                }`}
                style={phase === p ? { backgroundColor: phaseColors[p] } : {}}
              >
                {phaseLabels[p]}
              </button>
            ))}
          </div>

          {/* Circular timer */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg width="280" height="280" className="transform -rotate-90">
                <circle
                  cx="140"
                  cy="140"
                  r={radius}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="140"
                  cy="140"
                  r={radius}
                  fill="none"
                  stroke={phaseColors[phase]}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold font-mono">
                  {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                </span>
                <span
                  className="text-sm font-medium mt-2"
                  style={{ color: phaseColors[phase] }}
                >
                  {phaseLabels[phase]}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3 mb-6">
            <button onClick={toggleTimer} className="btn-primary px-8 py-3 text-lg">
              {isRunning ? "Pause" : timeLeft === 0 ? "Start" : timeLeft === getTotalSeconds() ? "Start" : "Resume"}
            </button>
            <button onClick={resetTimer} className="px-6 py-3 border rounded-lg hover:bg-gray-50 text-sm">
              Reset
            </button>
            <button onClick={skipPhase} className="px-6 py-3 border rounded-lg hover:bg-gray-50 text-sm">
              Skip
            </button>
          </div>

          {/* Session counter */}
          <div className="text-center mb-8">
            <div className="flex justify-center gap-2">
              {Array.from({ length: sessionsBeforeLong }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full transition-colors"
                  style={{
                    backgroundColor:
                      i < (completedSessions % sessionsBeforeLong)
                        ? phaseColors.work
                        : "#e5e7eb",
                  }}
                />
              ))}
            </div>
            <p className="text-sm text-[var(--muted)] mt-2">
              Sessions completed: {completedSessions}
            </p>
          </div>

          {/* Settings */}
          <details className="border rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-sm">Settings</summary>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Work (min)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={workTime}
                  onChange={(e) => {
                    const v = Math.max(1, Math.min(120, Number(e.target.value)));
                    setWorkTime(v);
                    if (!isRunning && phase === "work") setTimeLeft(v * 60);
                  }}
                  className="w-full p-2 border rounded-lg bg-[var(--muted-bg)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Short Break (min)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={shortBreakTime}
                  onChange={(e) => {
                    const v = Math.max(1, Math.min(30, Number(e.target.value)));
                    setShortBreakTime(v);
                    if (!isRunning && phase === "shortBreak") setTimeLeft(v * 60);
                  }}
                  className="w-full p-2 border rounded-lg bg-[var(--muted-bg)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Long Break (min)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakTime}
                  onChange={(e) => {
                    const v = Math.max(1, Math.min(60, Number(e.target.value)));
                    setLongBreakTime(v);
                    if (!isRunning && phase === "longBreak") setTimeLeft(v * 60);
                  }}
                  className="w-full p-2 border rounded-lg bg-[var(--muted-bg)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Sessions before long break</label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={sessionsBeforeLong}
                  onChange={(e) => setSessionsBeforeLong(Math.max(2, Math.min(10, Number(e.target.value))))}
                  className="w-full p-2 border rounded-lg bg-[var(--muted-bg)]"
                />
              </div>
            </div>
          </details>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is the Pomodoro Technique?</h2>
          <p>
            The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s.
            It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by
            short breaks. After four work sessions, you take a longer break.
          </p>

          <h2>How to Use the Pomodoro Timer</h2>
          <ul>
            <li>Set your work duration (default: 25 minutes)</li>
            <li>Click Start and focus on your task until the timer rings</li>
            <li>Take a short break (default: 5 minutes)</li>
            <li>After 4 work sessions, take a long break (default: 15 minutes)</li>
            <li>Repeat the cycle throughout your work day</li>
          </ul>

          <h2>Benefits of the Pomodoro Technique</h2>
          <ul>
            <li>Improved focus and concentration</li>
            <li>Reduced mental fatigue through regular breaks</li>
            <li>Better time awareness and estimation</li>
            <li>Increased accountability and motivation</li>
            <li>Reduced procrastination</li>
          </ul>

          <h3>Customization Tips</h3>
          <p>
            While the traditional Pomodoro uses 25-minute work sessions, you can adjust the intervals
            to match your workflow. Some people prefer 50-minute work sessions with 10-minute breaks
            for deep work. Experiment to find what works best for you.
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
            name: "Pomodoro Timer",
            description: META.description,
            url: `${SITE_URL}/tools/pomodoro-timer`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
