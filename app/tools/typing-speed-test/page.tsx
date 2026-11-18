"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Typing Speed Test - Check Your WPM & Accuracy Online",
  description:
    "Free Typing Speed Test to measure your words per minute (WPM) and accuracy. Multiple difficulty levels with easy, medium, and hard texts. Improve your typing skills.",
  keywords: "typing speed test, wpm test, typing test, words per minute, typing accuracy, typing practice",
};

const TEXTS: Record<string, string[]> = {
  easy: [
    "The quick brown fox jumps over the lazy dog. The sun is warm and the sky is blue. Birds sing in the trees while cats sleep on the porch. Life is simple and good when you take time to enjoy the small things around you.",
    "I like to read books in the park. The flowers are very pretty in spring. My dog likes to play with his ball. We go for a walk every day after work. The coffee shop on the corner makes the best drinks.",
    "Today is a nice day to go outside. The wind is calm and the air is fresh. I will take my bike and ride to the lake. The water is clear and cool. It is a perfect day to relax and have fun with friends.",
  ],
  medium: [
    "Programming is both an art and a science that requires patience and dedication. Developers spend hours writing code, debugging errors, and optimizing performance. The most successful programmers are those who never stop learning and adapting to new technologies.",
    "The history of computing stretches back thousands of years, from ancient abacuses to modern quantum processors. Each breakthrough built upon previous discoveries, creating an exponential growth in capability that continues to reshape how we live, work, and communicate.",
    "Effective communication is essential in every aspect of life, whether in personal relationships or professional settings. Clear writing helps convey ideas precisely, reduces misunderstandings, and builds stronger connections between people across different cultures.",
  ],
  hard: [
    "Quantum entanglement, a phenomenon Einstein skeptically called \"spooky action at a distance,\" has been experimentally verified countless times. When two particles become entangled, measuring one instantaneously affects the other regardless of the distance separating them — a fact that challenges our classical intuitions about locality and causation.",
    "The philosophical implications of artificial general intelligence extend far beyond technological considerations; they encompass fundamental questions about consciousness, free will, and the nature of intelligence itself. As machines approach human-level reasoning capabilities, society must grapple with unprecedented ethical dilemmas regarding autonomy, responsibility, and the definition of personhood.",
    "Cryptographic hash functions serve as indispensable primitives in modern cybersecurity infrastructure, providing collision-resistant one-way transformations that underpin digital signatures, blockchain verification, and password storage mechanisms. The mathematical elegance of algorithms like SHA-256 lies in their deterministic yet practically irreversible nature.",
  ],
};

export default function TypingSpeedTestPage() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [targetText, setTargetText] = useState<string>("");
  const [typedText, setTypedText] = useState<string>("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsed, setElapsed] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const pickText = useCallback((diff: "easy" | "medium" | "hard") => {
    const options = TEXTS[diff];
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return options[arr[0] % options.length];
  }, []);

  const startTest = useCallback(() => {
    const text = pickText(difficulty);
    setTargetText(text);
    setTypedText("");
    setStarted(false);
    setFinished(false);
    setStartTime(0);
    setElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [difficulty, pickText]);

  // Initialize first text
  useEffect(() => {
    setTargetText(pickText(difficulty));
  }, [difficulty, pickText]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function handleType(value: string) {
    if (finished) return;

    if (!started && value.length > 0) {
      setStarted(true);
      const now = Date.now();
      setStartTime(now);
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - now) / 1000));
      }, 100);
    }

    // Prevent typing beyond target length
    if (value.length > targetText.length) return;

    setTypedText(value);

    if (value.length === targetText.length) {
      setFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }
  }

  // Calculate stats
  let correctChars = 0;
  let incorrectChars = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === targetText[i]) {
      correctChars++;
    } else {
      incorrectChars++;
    }
  }

  const totalTyped = typedText.length;
  const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 0;
  const minutes = elapsed / 60;
  const wordCount = typedText.trim().split(/\s+/).filter(Boolean).length;
  const wpm = minutes > 0 ? Math.round(wordCount / minutes) : 0;

  // Render target text with coloring
  const renderTarget = () => {
    return targetText.split("").map((char, i) => {
      let className = "text-gray-400";
      if (i < typedText.length) {
        className = typedText[i] === char ? "text-green-600" : "text-red-500 bg-red-100";
      } else if (i === typedText.length) {
        className = "text-gray-800 border-b-2 border-[var(--primary)]";
      }
      return (
        <span key={i} className={className}>
          {char}
        </span>
      );
    });
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/typing-speed-test`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/typing-speed-test`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Typing Speed Test</h1>
        <p className="text-[var(--muted)] mb-8">
          Test your typing speed and accuracy. Start typing to begin the timer.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          {/* Difficulty selector */}
          <div className="flex gap-2 mb-6">
            {(["easy", "medium", "hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDifficulty(d);
                  if (!started) setTargetText(pickText(d));
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  difficulty === d
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--muted-bg)] hover:bg-gray-200"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Live stats bar */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--primary)]">{wpm}</p>
              <p className="text-xs text-[var(--muted)]">WPM</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{accuracy}%</p>
              <p className="text-xs text-[var(--muted)]">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{formatTime(elapsed)}</p>
              <p className="text-xs text-[var(--muted)]">Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{typedText.length}/{targetText.length}</p>
              <p className="text-xs text-[var(--muted)]">Characters</p>
            </div>
          </div>

          {/* Target text */}
          {targetText && (
            <div className="p-4 bg-[var(--muted-bg)] rounded-lg mb-4 font-mono text-sm leading-7 select-none">
              {renderTarget()}
            </div>
          )}

          {/* Input area */}
          <textarea
            ref={textareaRef}
            value={typedText}
            onChange={(e) => handleType(e.target.value)}
            disabled={finished}
            rows={4}
            className="w-full p-4 border rounded-lg bg-white text-sm font-mono resize-none mb-4"
            placeholder={finished ? "Test complete!" : "Start typing here..."}
            onPaste={(e) => e.preventDefault()}
          />

          <button onClick={startTest} className="btn-primary w-full">
            {started || finished ? "Restart Test" : "New Text"}
          </button>
        </div>

        {/* Results card */}
        {finished && (
          <div className="tool-card mb-8">
            <h2 className="text-xl font-bold mb-4 text-center">Test Results</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="result-card text-center">
                <p className="text-3xl font-bold text-[var(--primary)]">{wpm}</p>
                <p className="text-sm text-[var(--muted)]">Words/Min</p>
              </div>
              <div className="result-card text-center">
                <p className="text-3xl font-bold" style={{ color: accuracy >= 95 ? "#22c55e" : accuracy >= 80 ? "#f59e0b" : "#ef4444" }}>
                  {accuracy}%
                </p>
                <p className="text-sm text-[var(--muted)]">Accuracy</p>
              </div>
              <div className="result-card text-center">
                <p className="text-3xl font-bold text-green-600">{correctChars}</p>
                <p className="text-sm text-[var(--muted)]">Correct</p>
              </div>
              <div className="result-card text-center">
                <p className="text-3xl font-bold text-red-500">{incorrectChars}</p>
                <p className="text-sm text-[var(--muted)]">Incorrect</p>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-[var(--muted)]">
                Time: {formatTime(elapsed)} | Characters: {totalTyped} | Difficulty: <span className="capitalize">{difficulty}</span>
              </p>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Typing Speed Test</h2>
          <p>
            This typing speed test measures your typing speed in words per minute (WPM) and your accuracy
            percentage. The timer starts automatically when you begin typing and stops when you complete
            the passage.
          </p>

          <h2>How WPM is Calculated</h2>
          <p>
            Words per minute is calculated by dividing the number of words you typed by the time elapsed
            in minutes. A &quot;word&quot; is defined as any group of characters separated by spaces.
          </p>

          <h2>Average Typing Speeds</h2>
          <ul>
            <li><strong>Beginner:</strong> 20-30 WPM</li>
            <li><strong>Average:</strong> 40-50 WPM</li>
            <li><strong>Proficient:</strong> 60-70 WPM</li>
            <li><strong>Fast:</strong> 80-100 WPM</li>
            <li><strong>Professional:</strong> 100+ WPM</li>
          </ul>

          <h3>Tips to Improve Typing Speed</h3>
          <ul>
            <li>Practice proper finger placement on the home row</li>
            <li>Look at the screen, not your keyboard</li>
            <li>Focus on accuracy first, then speed will follow</li>
            <li>Practice regularly with different difficulty levels</li>
            <li>Use all ten fingers for maximum efficiency</li>
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
            name: "Typing Speed Test",
            description: META.description,
            url: `${SITE_URL}/tools/typing-speed-test`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
