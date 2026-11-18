"use client";

import { useState, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Love Calculator - Test Your Love Compatibility",
  description:
    "Free Love Calculator to test your love compatibility! Enter your name and your partner's name to find your love percentage, compatibility rating, and fun relationship insights.",
  keywords: "love calculator, love test, compatibility test, love percentage, love meter, relationship calculator",
};

function hashNames(name1: string, name2: string): number {
  const combined = (name1 + "loves" + name2).toLowerCase().replace(/\s/g, "");
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  // Normalize to 35-99 range so it's always somewhat positive
  return 35 + Math.abs(hash % 65);
}

function getRating(pct: number) {
  if (pct >= 90) return { label: "Perfect Match!", emoji: "💕", color: "text-pink-600", bg: "bg-pink-100" };
  if (pct >= 75) return { label: "Great Chemistry!", emoji: "🔥", color: "text-red-500", bg: "bg-red-50" };
  if (pct >= 60) return { label: "Good Potential!", emoji: "✨", color: "text-orange-500", bg: "bg-orange-50" };
  if (pct >= 45) return { label: "Worth Exploring!", emoji: "🌱", color: "text-green-500", bg: "bg-green-50" };
  return { label: "Keep Trying!", emoji: "💪", color: "text-blue-500", bg: "bg-blue-50" };
}

function getDescription(pct: number, name1: string, name2: string): string {
  if (pct >= 90)
    return `Wow! ${name1} and ${name2} are a match made in heaven! The stars align perfectly for this incredible duo. You complete each other in ways that are truly magical.`;
  if (pct >= 75)
    return `${name1} and ${name2} share an amazing connection! There's undeniable chemistry between you two. This relationship has the spark that many couples dream of.`;
  if (pct >= 60)
    return `${name1} and ${name2} have solid potential together! There's a genuine connection here that can grow into something beautiful with time and effort.`;
  if (pct >= 45)
    return `${name1} and ${name2} might surprise everyone! Sometimes the best relationships start slow. Give it time and you might discover something wonderful.`;
  return `${name1} and ${name2} have a unique dynamic! Every great love story has its own path. Keep an open heart and see where the journey takes you.`;
}

export default function LoveCalculatorPage() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState<{ pct: number; rating: ReturnType<typeof getRating>; description: string } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    if (!name1.trim() || !name2.trim()) return;
    setIsCalculating(true);
    setResult(null);
    setShowHearts(false);

    setTimeout(() => {
      const pct = hashNames(name1.trim(), name2.trim());
      const rating = getRating(pct);
      const description = getDescription(pct, name1.trim(), name2.trim());
      setResult({ pct, rating, description });
      setIsCalculating(false);
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 3000);
    }, 1500);
  }, [name1, name2]);

  const shareResult = useCallback(() => {
    if (!result) return;
    const text = `${name1} ❤️ ${name2} = ${result.pct}% Love! ${result.rating.label} Try it: ${SITE_URL}/tools/love-calculator`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result, name1, name2]);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/love-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/love-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Love Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Enter your names and discover your love compatibility percentage!
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8 relative overflow-hidden">
          {/* Floating Hearts Background Animation */}
          {showHearts && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {Array.from({ length: 20 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    bottom: "-10%",
                    animation: `floatUp ${2 + Math.random() * 2}s ease-out ${Math.random() * 0.5}s forwards`,
                    opacity: 0.8,
                  }}
                >
                  {["❤️", "💕", "💖", "💗", "💓", "💘"][i % 6]}
                </span>
              ))}
            </div>
          )}

          <div className="relative z-10">
            {/* Name Inputs */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full p-3 border-2 rounded-xl bg-[var(--muted-bg)] text-lg text-center focus:border-pink-400 focus:outline-none transition-colors"
                  maxLength={30}
                />
              </div>

              <div className="text-4xl animate-pulse">❤️</div>

              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-1">Partner&apos;s Name</label>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder="Enter their name"
                  className="w-full p-3 border-2 rounded-xl bg-[var(--muted-bg)] text-lg text-center focus:border-pink-400 focus:outline-none transition-colors"
                  maxLength={30}
                  onKeyDown={(e) => e.key === "Enter" && calculate()}
                />
              </div>
            </div>

            <button
              onClick={calculate}
              disabled={isCalculating || !name1.trim() || !name2.trim()}
              className="w-full py-4 rounded-xl text-lg font-bold text-white transition-all duration-300 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #ec4899, #f43f5e, #ef4444)",
                boxShadow: "0 4px 15px rgba(244, 63, 94, 0.4)",
              }}
            >
              {isCalculating ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block animate-spin">💫</span> Calculating Love...
                </span>
              ) : (
                "💘 Calculate Love"
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="result-card mb-8 text-center">
            {/* Big Heart with Percentage */}
            <div className="relative inline-block mb-6">
              <div
                className="w-48 h-48 mx-auto flex items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#ec4899 ${result.pct}%, #f3f4f6 ${result.pct}%)`,
                  animation: "heartPulse 1.5s ease-in-out infinite",
                }}
              >
                <div className="w-40 h-40 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                  <span className="text-4xl font-black bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                    {result.pct}%
                  </span>
                  <span className="text-lg">{result.rating.emoji}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className={`inline-block px-6 py-3 rounded-full text-xl font-bold mb-4 ${result.rating.bg} ${result.rating.color}`}>
              {result.rating.emoji} {result.rating.label}
            </div>

            {/* Names */}
            <p className="text-2xl font-bold mb-4">
              <span className="text-pink-500">{name1}</span>
              {" "}❤️{" "}
              <span className="text-red-500">{name2}</span>
            </p>

            {/* Description */}
            <p className="text-[var(--muted)] mb-6 max-w-lg mx-auto leading-relaxed">
              {result.description}
            </p>

            {/* Love Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${result.pct}%`,
                    background: "linear-gradient(90deg, #ec4899, #f43f5e, #ef4444)",
                  }}
                />
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={shareResult}
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
              }}
            >
              {copied ? "✅ Copied to Clipboard!" : "📋 Share Result"}
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Love Calculator</h2>
          <p>
            Our Love Calculator uses a character-based algorithm to calculate the compatibility between two
            names. Enter the same names and you&apos;ll always get the same result, making it feel truly
            personalized! While it&apos;s all in good fun, many people find it surprisingly accurate.
          </p>

          <h2>How It Works</h2>
          <p>
            The calculator analyzes the characters in both names using a deterministic hash function. This
            means the result for any given pair of names is always consistent — try it with your friends
            and compare results!
          </p>

          <h2>Fun Ways to Use It</h2>
          <ul>
            <li><strong>Party Game:</strong> Test everyone&apos;s compatibility at a gathering</li>
            <li><strong>Icebreaker:</strong> A fun way to start a conversation</li>
            <li><strong>Social Media:</strong> Share your results with friends online</li>
            <li><strong>Celebrity Match:</strong> Test your compatibility with your favorite celebrity</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-600px) rotate(45deg);
            opacity: 0;
          }
        }
        @keyframes heartPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Love Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/love-calculator`,
            applicationCategory: "EntertainmentApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
