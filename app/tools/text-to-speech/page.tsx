"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Text to Speech - Convert Text to Voice Online Free",
  description:
    "Free online Text to Speech tool. Convert any text to natural-sounding speech using your browser. Choose voice, adjust speed and pitch, and listen instantly.",
  keywords: "text to speech, tts, text to voice, read aloud, speech synthesis, voice generator",
};

export default function TextToSpeechPage() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const v = speechSynthesis.getVoices();
      if (v.length > 0) {
        setVoices(v);
        if (!selectedVoice && v.length > 0) {
          const defaultVoice = v.find((voice) => voice.default) || v[0];
          setSelectedVoice(defaultVoice.name);
        }
      }
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    return () => { speechSynthesis.onvoiceschanged = null; };
  }, [selectedVoice]);

  const words = text.split(/\s+/).filter(Boolean);

  const handlePlay = useCallback(() => {
    if (!text.trim()) return;

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const spoken = text.substring(0, event.charIndex);
        const wordsBefore = spoken.split(/\s+/).filter(Boolean).length;
        setCurrentWordIndex(wordsBefore);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  }, [text, isPaused, voices, selectedVoice, rate, pitch]);

  const handlePause = () => {
    speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
  };

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/text-to-speech`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Text to Speech</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert text to natural-sounding speech. Choose a voice, adjust speed and pitch, and listen.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <label className="block text-sm font-medium mb-2">Enter Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-field min-h-[150px] resize-y text-sm"
            placeholder="Type or paste the text you want to hear spoken aloud..."
          />
        </div>

        <div className="tool-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Voice</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="input-field text-sm"
              >
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Speed: {rate.toFixed(1)}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pitch: {pitch.toFixed(1)}</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-3">
            {!isPlaying ? (
              <button onClick={handlePlay} className="btn-primary text-sm" disabled={!text.trim()}>
                {isPaused ? "Resume" : "Play"}
              </button>
            ) : (
              <button onClick={handlePause} className="btn-primary text-sm">Pause</button>
            )}
            <button onClick={handleStop} className="btn-secondary text-sm" disabled={!isPlaying && !isPaused}>
              Stop
            </button>
          </div>
        </div>

        {text.trim() && (
          <div className="tool-card mb-8">
            <label className="block text-sm font-medium mb-2">Live Preview</label>
            <div className="p-4 rounded bg-[var(--bg-secondary)] text-sm leading-relaxed flex flex-wrap gap-1">
              {words.map((word, i) => (
                <span
                  key={i}
                  className={`px-0.5 rounded transition-colors ${
                    i === currentWordIndex ? "bg-[var(--primary)] text-white" : ""
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is Text to Speech?</h2>
          <p>
            Text to Speech (TTS) converts written text into spoken words using your browser&apos;s built-in
            speech synthesis engine. No downloads or external services required.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Multiple Voices:</strong> Choose from all voices available in your browser</li>
            <li><strong>Speed Control:</strong> Adjust speech rate from 0.5x to 2x</li>
            <li><strong>Pitch Control:</strong> Modify voice pitch for natural sound</li>
            <li><strong>Word Highlighting:</strong> See which word is being spoken in real-time</li>
            <li><strong>Play/Pause/Stop:</strong> Full playback control</li>
          </ul>

          <h2>Use Cases</h2>
          <p>
            Ideal for proofreading, accessibility, language learning, or listening to articles while multitasking.
            Works entirely in your browser with no data sent to any server.
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
            name: "Text to Speech",
            description: META.description,
            url: `${SITE_URL}/tools/text-to-speech`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
