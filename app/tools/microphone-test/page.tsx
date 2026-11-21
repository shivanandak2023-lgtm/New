"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Microphone Test - Test Your Mic Online Free",
  description:
    "Free online Microphone Test tool. Check if your mic works, see real-time volume levels, record audio, and play it back. Test mic sensitivity and device info.",
  keywords: "microphone test, test my mic online, mic test, microphone checker, test microphone, online mic test",
};

export default function MicrophoneTestPage() {
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const [volume, setVolume] = useState(0);
  const [peakVolume, setPeakVolume] = useState(0);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [sampleRate, setSampleRate] = useState(0);
  const [channels, setChannels] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  const startMic = useCallback(async (deviceId?: string) => {
    setError("");
    stopStream();
    try {
      const constraints: MediaStreamConstraints = {
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const track = stream.getAudioTracks()[0];
      const settings = track.getSettings();
      setDeviceName(track.label || "Unknown Microphone");
      setSampleRate(audioCtx.sampleRate);
      setChannels(settings.channelCount || 1);

      // Enumerate devices
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = allDevices.filter((d) => d.kind === "audioinput");
      setDevices(audioDevices);
      if (!deviceId && audioDevices.length > 0) {
        setSelectedDevice(settings.deviceId || audioDevices[0].deviceId);
      }

      // Volume meter
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let peak = 0;
      const measure = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(dataArray);
        let maxVal = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const val = Math.abs(dataArray[i] - 128);
          if (val > maxVal) maxVal = val;
        }
        const normalized = Math.round((maxVal / 128) * 100);
        setVolume(normalized);
        if (normalized > peak) {
          peak = normalized;
          setPeakVolume(peak);
        }
        animFrameRef.current = requestAnimationFrame(measure);
      };
      animFrameRef.current = requestAnimationFrame(measure);

      setStarted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not access microphone";
      setError(msg);
    }
  }, [stopStream]);

  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  function handleDeviceChange(id: string) {
    setSelectedDevice(id);
    startMic(id);
  }

  function startRecording() {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(URL.createObjectURL(blob));
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  }

  function downloadRecording() {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "mic-recording.webm";
    a.click();
  }

  function getVolumeColor(v: number): string {
    if (v < 20) return "bg-green-500";
    if (v < 50) return "bg-yellow-500";
    if (v < 80) return "bg-orange-500";
    return "bg-red-500";
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/microphone-test`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/microphone-test`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Microphone Test</h1>
        <p className="text-[var(--muted)] mb-8">
          Test your microphone, check volume levels, record audio, and verify device settings.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          {!started && (
            <div className="text-center py-12">
              <p className="text-[var(--muted)] mb-4">Click the button below to start your microphone test.</p>
              <button onClick={() => startMic()} className="btn-primary px-8 py-3 text-lg">
                Start Microphone Test
              </button>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center py-4">
              <p className="font-medium">Microphone Error</p>
              <p className="text-sm">{error}</p>
              <p className="text-sm mt-2 text-[var(--muted)]">
                Make sure you have granted microphone permission in your browser settings.
              </p>
            </div>
          )}

          {started && (
            <div>
              {/* Volume Meter */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Volume Level</span>
                  <span className="text-sm font-bold text-[var(--primary)]">{volume}%</span>
                </div>
                <div className="w-full h-8 bg-[var(--muted-bg)] rounded-full overflow-hidden border">
                  <div
                    className={`h-full transition-all duration-75 rounded-full ${getVolumeColor(volume)}`}
                    style={{ width: `${Math.min(volume, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[var(--muted)] mt-1">
                  <span>Silent</span>
                  <span>Peak: {peakVolume}%</span>
                  <span>Loud</span>
                </div>
              </div>

              {/* Animated bars */}
              <div className="flex items-end justify-center gap-1 mb-6 h-24">
                {Array.from({ length: 32 }).map((_, i) => {
                  const barHeight = Math.max(4, (volume / 100) * (60 + Math.sin(i * 0.5) * 40));
                  return (
                    <div
                      key={i}
                      className={`w-2 rounded-t transition-all duration-75 ${getVolumeColor(volume)}`}
                      style={{ height: `${barHeight}%` }}
                    />
                  );
                })}
              </div>

              {/* Device Info */}
              <div className="result-card mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-[var(--muted)]">Device Name</p>
                    <p className="font-bold text-sm truncate">{deviceName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)]">Sample Rate</p>
                    <p className="font-bold text-[var(--primary)]">{sampleRate} Hz</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)]">Channels</p>
                    <p className="font-bold text-[var(--primary)]">{channels}</p>
                  </div>
                </div>
              </div>

              {/* Device Selector */}
              {devices.length > 1 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Select Microphone</label>
                  <select
                    value={selectedDevice}
                    onChange={(e) => handleDeviceChange(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-[var(--muted-bg)]"
                  >
                    {devices.map((d) => (
                      <option key={d.deviceId} value={d.deviceId}>
                        {d.label || `Microphone ${devices.indexOf(d) + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-wrap gap-2 mb-4">
                {!recording ? (
                  <button onClick={startRecording} className="btn-primary text-sm">
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors animate-pulse"
                  >
                    Stop Recording
                  </button>
                )}
                {audioUrl && (
                  <button onClick={downloadRecording} className="btn-primary text-sm">
                    Download Recording
                  </button>
                )}
                <button
                  onClick={() => { stopStream(); setStarted(false); setVolume(0); setPeakVolume(0); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  Stop Mic
                </button>
              </div>

              {/* Playback */}
              {audioUrl && (
                <div className="result-card">
                  <p className="text-sm font-medium text-[var(--muted)] mb-2">Recorded Audio</p>
                  <audio controls src={audioUrl} className="w-full" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Microphone Test Tool</h2>
          <p>
            Our free online Microphone Test helps you quickly verify that your microphone is working
            correctly. Before joining a Zoom meeting, Google Meet call, Discord voice chat, or recording
            a podcast, it is essential to confirm your mic is picking up audio properly. This tool runs
            entirely in your browser with no installation required, and all audio processing happens
            locally on your device — nothing is uploaded to any server.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Real-Time Volume Meter:</strong> See your microphone input level as a visual bar that updates in real-time using the Web Audio API AnalyserNode</li>
            <li><strong>Animated Visualizer:</strong> A dynamic bar visualizer shows your audio activity with smooth, responsive animations</li>
            <li><strong>Device Information:</strong> View your microphone name, sample rate, and channel count</li>
            <li><strong>Device Selector:</strong> Choose between multiple microphones if you have several audio input devices connected</li>
            <li><strong>Audio Recording:</strong> Record your microphone input using MediaRecorder and download the result as a WebM audio file</li>
            <li><strong>Instant Playback:</strong> Play back your recorded audio directly in the browser to verify quality</li>
            <li><strong>Peak Volume Tracking:</strong> Monitors the highest volume level reached during your test session</li>
          </ul>

          <h2>How to Test Your Microphone</h2>
          <ol>
            <li>Click the &quot;Start Microphone Test&quot; button above</li>
            <li>Allow microphone access when your browser prompts you</li>
            <li>Speak into your microphone and watch the volume meter respond</li>
            <li>Check the device information displayed below the meter</li>
            <li>Optionally record a short clip and play it back to verify audio quality</li>
          </ol>

          <h2>Troubleshooting Microphone Issues</h2>
          <p>
            If your microphone is not detected, start by checking that it is properly connected to your
            computer. For USB microphones, try a different port. Make sure no other application is
            exclusively using the microphone. Check your browser permissions — in Chrome, click the lock
            icon in the address bar and ensure microphone access is set to &quot;Allow.&quot; On Windows, go to
            Settings &gt; Privacy &gt; Microphone and ensure your browser is listed. On macOS, check System
            Preferences &gt; Privacy &amp; Security &gt; Microphone. If the volume meter shows no movement,
            check your system audio input settings and make sure the correct device is selected as the
            default recording device.
          </p>

          <h2>Privacy and Security</h2>
          <p>
            Your audio data never leaves your device. This microphone test processes all audio locally
            using the Web Audio API (AnalyserNode for volume analysis) and MediaRecorder for recording.
            No audio data is transmitted to any server. Recordings are stored temporarily in your browser
            memory and are lost when you close or refresh the page. We take your privacy seriously and
            designed this tool to work completely offline after the initial page load.
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
            name: "Microphone Test",
            description: META.description,
            url: `${SITE_URL}/tools/microphone-test`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
