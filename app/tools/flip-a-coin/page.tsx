"use client";

import { useState, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Flip a Coin - Heads or Tails with Stats & Multi-Coin Flip",
  description:
    "Free coin flip simulator with beautiful animations! Flip one or multiple coins, track your heads/tails history, streaks, and statistics. Fun, fast, and fair.",
  keywords: "flip a coin, coin flip, heads or tails, coin toss, virtual coin flip, flip coin online, coin flipper",
};

interface FlipResult {
  id: number;
  value: "Heads" | "Tails";
}

export default function FlipACoinPage() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentResult, setCurrentResult] = useState<"Heads" | "Tails" | null>(null);
  const [history, setHistory] = useState<FlipResult[]>([]);
  const [coinCount, setCoinCount] = useState(1);
  const [multiResults, setMultiResults] = useState<("Heads" | "Tails")[]>([]);
  const [flipDeg, setFlipDeg] = useState(0);
  const [streak, setStreak] = useState({ type: "" as "Heads" | "Tails" | "", count: 0, best: 0 });

  const flipCoins = useCallback(() => {
    if (isFlipping) return;
    setIsFlipping(true);
    setCurrentResult(null);
    setMultiResults([]);
    setFlipDeg((prev) => prev + 720 + Math.random() * 360);

    setTimeout(() => {
      const arr = new Uint32Array(coinCount);
      crypto.getRandomValues(arr);
      const results: ("Heads" | "Tails")[] = [];

      for (let i = 0; i < coinCount; i++) {
        results.push(arr[i] % 2 === 0 ? "Heads" : "Tails");
      }

      setMultiResults(results);
      if (coinCount === 1) {
        setCurrentResult(results[0]);
      }

      setHistory((prev) => {
        const newHistory = [
          ...results.map((v, i) => ({ id: Date.now() + i, value: v })),
          ...prev,
        ].slice(0, 100);
        return newHistory;
      });

      // Update streak
      setStreak((prev) => {
        const lastResult = results[results.length - 1];
        if (prev.type === lastResult) {
          const newCount = prev.count + results.filter((r) => r === lastResult).length;
          return { type: lastResult, count: newCount, best: Math.max(prev.best, newCount) };
        }
        const sameCount = results.filter((r) => r === lastResult).length;
        return { type: lastResult, count: sameCount, best: Math.max(prev.best, sameCount) };
      });

      setIsFlipping(false);
    }, 800);
  }, [coinCount, isFlipping]);

  const resetAll = () => {
    setHistory([]);
    setCurrentResult(null);
    setMultiResults([]);
    setStreak({ type: "", count: 0, best: 0 });
  };

  const headsCount = history.filter((h) => h.value === "Heads").length;
  const tailsCount = history.filter((h) => h.value === "Tails").length;
  const totalFlips = history.length;
  const headsPercent = totalFlips > 0 ? ((headsCount / totalFlips) * 100).toFixed(1) : "0";
  const tailsPercent = totalFlips > 0 ? ((tailsCount / totalFlips) * 100).toFixed(1) : "0";

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/flip-a-coin`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/flip-a-coin`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Flip a Coin</h1>
        <p className="text-[var(--muted)] mb-8">
          Flip a virtual coin with realistic animation. Track your stats and flip multiple coins at once!
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          {/* Coin Visual */}
          <div className="flex justify-center mb-8">
            <div
              className="relative"
              style={{
                perspective: "600px",
              }}
            >
              <div
                className="w-40 h-40 rounded-full flex items-center justify-center cursor-pointer select-none"
                onClick={flipCoins}
                style={{
                  transform: `rotateY(${flipDeg}deg)`,
                  transition: isFlipping ? "transform 0.8s cubic-bezier(0.2, 0.8, 0.3, 1)" : "none",
                  background: currentResult === "Tails"
                    ? "linear-gradient(145deg, #94a3b8, #64748b)"
                    : "linear-gradient(145deg, #fbbf24, #f59e0b)",
                  boxShadow: currentResult === "Tails"
                    ? "0 8px 30px rgba(100, 116, 139, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)"
                    : "0 8px 30px rgba(245, 158, 11, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)",
                  border: "4px solid",
                  borderColor: currentResult === "Tails" ? "#475569" : "#d97706",
                }}
              >
                <span
                  className="text-5xl font-black"
                  style={{
                    color: currentResult === "Tails" ? "#1e293b" : "#78350f",
                    textShadow: "0 1px 2px rgba(255,255,255,0.3)",
                  }}
                >
                  {isFlipping ? "?" : currentResult ? currentResult[0] : "?"}
                </span>
              </div>
            </div>
          </div>

          {/* Result Text */}
          {currentResult && !isFlipping && coinCount === 1 && (
            <div className="text-center mb-6">
              <p
                className="text-3xl font-black"
                style={{
                  color: currentResult === "Heads" ? "#d97706" : "#475569",
                  animation: "bounceIn 0.5s ease-out",
                }}
              >
                {currentResult === "Heads" ? "🪙" : "⚪"} {currentResult}!
              </p>
            </div>
          )}

          {/* Multi-coin results */}
          {multiResults.length > 1 && !isFlipping && (
            <div className="mb-6">
              <p className="text-center text-sm font-medium text-[var(--muted)] mb-3">Results:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {multiResults.map((r, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-3"
                    style={{
                      background: r === "Heads"
                        ? "linear-gradient(145deg, #fbbf24, #f59e0b)"
                        : "linear-gradient(145deg, #94a3b8, #64748b)",
                      color: r === "Heads" ? "#78350f" : "#1e293b",
                      border: `3px solid ${r === "Heads" ? "#d97706" : "#475569"}`,
                      animation: `popIn 0.3s ease-out ${i * 0.1}s both`,
                    }}
                  >
                    {r[0]}
                  </div>
                ))}
              </div>
              <p className="text-center mt-3 text-sm">
                <span className="text-yellow-600 font-bold">{multiResults.filter((r) => r === "Heads").length} Heads</span>
                {" / "}
                <span className="text-gray-600 font-bold">{multiResults.filter((r) => r === "Tails").length} Tails</span>
              </p>
            </div>
          )}

          {/* Coin Count Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-center">
              Number of Coins: <span className="text-[var(--primary)] font-bold">{coinCount}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={coinCount}
              onChange={(e) => setCoinCount(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
            <div className="flex justify-between text-xs text-[var(--muted)] mt-1">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={flipCoins}
              disabled={isFlipping}
              className="btn-primary flex-1 py-3 text-lg"
            >
              {isFlipping ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block animate-spin">🪙</span> Flipping...
                </span>
              ) : (
                `🪙 Flip ${coinCount > 1 ? `${coinCount} Coins` : "Coin"}`
              )}
            </button>
            {totalFlips > 0 && (
              <button
                onClick={resetAll}
                className="px-6 py-3 rounded-xl bg-[var(--muted-bg)] hover:bg-gray-200 transition-colors font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Statistics */}
        {totalFlips > 0 && (
          <div className="result-card mb-8">
            <h2 className="text-lg font-bold mb-4">Statistics</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 rounded-xl bg-yellow-50">
                <p className="text-2xl font-black text-yellow-600">{headsCount}</p>
                <p className="text-xs text-[var(--muted)]">Heads ({headsPercent}%)</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-100">
                <p className="text-2xl font-black text-gray-600">{tailsCount}</p>
                <p className="text-xs text-[var(--muted)]">Tails ({tailsPercent}%)</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-blue-50">
                <p className="text-2xl font-black text-blue-600">{totalFlips}</p>
                <p className="text-xs text-[var(--muted)]">Total Flips</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-purple-50">
                <p className="text-2xl font-black text-purple-600">{streak.best}</p>
                <p className="text-xs text-[var(--muted)]">Best Streak</p>
              </div>
            </div>

            {/* Distribution Bar */}
            <div className="mb-4">
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden flex">
                <div
                  className="h-full transition-all duration-500 flex items-center justify-center text-xs font-bold text-yellow-900"
                  style={{
                    width: `${parseFloat(headsPercent)}%`,
                    background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
                    minWidth: headsCount > 0 ? "2rem" : "0",
                  }}
                >
                  {headsCount > 0 && "H"}
                </div>
                <div
                  className="h-full transition-all duration-500 flex items-center justify-center text-xs font-bold text-gray-100"
                  style={{
                    width: `${parseFloat(tailsPercent)}%`,
                    background: "linear-gradient(90deg, #64748b, #475569)",
                    minWidth: tailsCount > 0 ? "2rem" : "0",
                  }}
                >
                  {tailsCount > 0 && "T"}
                </div>
              </div>
            </div>

            {/* Current Streak */}
            {streak.type && streak.count > 1 && (
              <p className="text-sm text-center text-[var(--muted)]">
                Current Streak: <span className="font-bold">{streak.count} {streak.type}</span> in a row
                {streak.count >= 5 && " 🔥"}
              </p>
            )}

            {/* Recent History */}
            <div className="mt-4">
              <p className="text-sm font-medium text-[var(--muted)] mb-2">Recent Flips:</p>
              <div className="flex flex-wrap gap-1.5">
                {history.slice(0, 30).map((h) => (
                  <span
                    key={h.id}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      h.value === "Heads"
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                        : "bg-gray-200 text-gray-600 border border-gray-300"
                    }`}
                  >
                    {h.value[0]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Coin Flipper</h2>
          <p>
            Our Flip a Coin tool uses a cryptographically secure random number generator to simulate a fair
            coin toss. Each flip is truly random, giving you a perfectly unbiased 50/50 chance of heads or
            tails.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Realistic Animation:</strong> Beautiful coin flip animation with 3D rotation effect</li>
            <li><strong>Multi-Coin Flip:</strong> Flip up to 10 coins at once and see all results</li>
            <li><strong>Statistics Tracking:</strong> See your heads/tails ratio with visual distribution bar</li>
            <li><strong>Streak Tracker:</strong> Track your current streak and best streak ever</li>
            <li><strong>History Log:</strong> View your last 30 flips at a glance</li>
          </ul>

          <h2>When to Flip a Coin</h2>
          <ul>
            <li>Making a quick decision between two options</li>
            <li>Settling a friendly debate</li>
            <li>Choosing who goes first in a game</li>
            <li>Testing probability and statistics concepts</li>
            <li>Random selection for any binary choice</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          80% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Flip a Coin",
            description: META.description,
            url: `${SITE_URL}/tools/flip-a-coin`,
            applicationCategory: "EntertainmentApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
