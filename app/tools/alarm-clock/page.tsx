"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Alarm Clock - Set Online Alarms Free",
  description:
    "Free online Alarm Clock. Set multiple alarms with custom times. Plays a beep sound when triggered. Snooze and dismiss controls. Large time display.",
  keywords: "alarm clock, online alarm, set alarm, wake up alarm, alarm clock online, timer alarm",
};

interface Alarm {
  id: number;
  hours: number;
  minutes: number;
  enabled: boolean;
  label: string;
  triggered: boolean;
}

export default function AlarmClockPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newHours, setNewHours] = useState(7);
  const [newMinutes, setNewMinutes] = useState(0);
  const [newLabel, setNewLabel] = useState("");
  const [ringingAlarmId, setRingingAlarmId] = useState<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextIdRef = useRef(1);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const playBeep = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.value = 0.4;
    osc.start();
    setTimeout(() => {
      osc.stop();
    }, 200);
  }, []);

  const startRinging = useCallback((alarmId: number) => {
    setRingingAlarmId(alarmId);
    playBeep();
    intervalRef.current = setInterval(() => playBeep(), 1500);
  }, [playBeep]);

  const stopRinging = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRingingAlarmId(null);
  }, []);

  // Check alarms
  useEffect(() => {
    if (!now || ringingAlarmId !== null) return;

    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    for (const alarm of alarms) {
      if (alarm.enabled && !alarm.triggered && alarm.hours === h && alarm.minutes === m && s === 0) {
        setAlarms((prev) =>
          prev.map((a) => (a.id === alarm.id ? { ...a, triggered: true } : a))
        );
        startRinging(alarm.id);
        break;
      }
    }
  }, [now, alarms, ringingAlarmId, startRinging]);

  const addAlarm = () => {
    const alarm: Alarm = {
      id: nextIdRef.current++,
      hours: newHours,
      minutes: newMinutes,
      enabled: true,
      label: newLabel || `Alarm ${alarms.length + 1}`,
      triggered: false,
    };
    setAlarms((prev) => [...prev, alarm]);
    setNewLabel("");
  };

  const deleteAlarm = (id: number) => {
    if (ringingAlarmId === id) stopRinging();
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleAlarm = (id: number) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled, triggered: false } : a))
    );
  };

  const dismissAlarm = () => {
    stopRinging();
  };

  const snoozeAlarm = () => {
    if (ringingAlarmId === null) return;
    const id = ringingAlarmId;
    stopRinging();

    // Set alarm 5 minutes from now
    const snoozeTime = new Date((now || new Date()).getTime() + 5 * 60 * 1000);
    setAlarms((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, hours: snoozeTime.getHours(), minutes: snoozeTime.getMinutes(), triggered: false, label: a.label + " (Snoozed)" }
          : a
      )
    );
  };

  const timeStr = now
    ? now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
    : "--:--:--";

  const dateStr = now
    ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "";

  function formatAlarmTime(h: number, m: number) {
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return `${String(displayH).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/alarm-clock`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/alarm-clock`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Alarm Clock</h1>
        <p className="text-[var(--muted)] mb-8">
          Set alarms, see the current time, and get notified with a beep when your alarm goes off.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Large Time Display */}
        <div className="tool-card mb-6 text-center py-8">
          <p className="text-5xl md:text-7xl font-bold font-mono text-[var(--primary)]">{timeStr}</p>
          <p className="text-sm text-[var(--muted)] mt-2">{dateStr}</p>
        </div>

        {/* Ringing Alert */}
        {ringingAlarmId !== null && (
          <div className="tool-card mb-6 border-2 border-red-500 bg-red-50 dark:bg-red-950 text-center py-6 animate-pulse">
            <p className="text-2xl font-bold mb-4">
              ALARM! {alarms.find((a) => a.id === ringingAlarmId)?.label}
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={snoozeAlarm} className="btn-secondary text-sm px-6 py-2">
                Snooze (5 min)
              </button>
              <button onClick={dismissAlarm} className="btn-primary text-sm px-6 py-2">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Add Alarm */}
        <div className="tool-card mb-6">
          <h2 className="text-lg font-bold mb-3">Add Alarm</h2>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Hour</label>
              <select value={newHours} onChange={(e) => setNewHours(Number(e.target.value))} className="input-field text-sm w-20">
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, "0")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Minute</label>
              <select value={newMinutes} onChange={(e) => setNewMinutes(Number(e.target.value))} className="input-field text-sm w-20">
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, "0")}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium mb-1">Label</label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="input-field text-sm"
                placeholder="Wake up, Meeting..."
              />
            </div>
            <button onClick={addAlarm} className="btn-primary text-sm">Add Alarm</button>
          </div>
        </div>

        {/* Alarm List */}
        {alarms.length > 0 && (
          <div className="tool-card mb-8">
            <h2 className="text-lg font-bold mb-3">Your Alarms ({alarms.length})</h2>
            <div className="space-y-3">
              {alarms.map((alarm) => (
                <div key={alarm.id} className={`flex items-center justify-between p-3 rounded-lg ${
                  alarm.enabled ? "bg-[var(--bg-secondary)]" : "bg-[var(--bg-secondary)] opacity-50"
                }`}>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        alarm.enabled ? "bg-[var(--primary)]" : "bg-gray-300"
                      } relative`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        alarm.enabled ? "left-5" : "left-1"
                      }`} />
                    </button>
                    <div>
                      <p className="text-xl font-bold font-mono">{formatAlarmTime(alarm.hours, alarm.minutes)}</p>
                      <p className="text-xs text-[var(--muted)]">{alarm.label}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteAlarm(alarm.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Online Alarm Clock</h2>
          <p>
            Set alarms directly in your browser. When the alarm time arrives, a beep sound plays
            to alert you. You can snooze for 5 minutes or dismiss the alarm.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Multiple Alarms:</strong> Set as many alarms as you need</li>
            <li><strong>Large Display:</strong> Easy-to-read current time</li>
            <li><strong>Snooze:</strong> 5-minute snooze option</li>
            <li><strong>Custom Labels:</strong> Name your alarms for easy identification</li>
            <li><strong>Toggle On/Off:</strong> Enable or disable individual alarms</li>
          </ul>

          <h2>Note</h2>
          <p>
            Keep this tab open for alarms to work. The alarm uses the Web Audio API to play sounds,
            so make sure your browser allows audio playback.
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
            name: "Alarm Clock",
            description: META.description,
            url: `${SITE_URL}/tools/alarm-clock`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
