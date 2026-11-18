"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { WORD_LIST } from "@/lib/word-list";

const META = {
  title: "Word Scramble Solver - Unscramble Letters into Words",
  description:
    "Free Word Scramble Solver. Enter scrambled letters and find all valid English words. Great for Scrabble, Words with Friends, and word puzzles.",
  keywords: "word scramble solver, unscramble letters, word finder, scrabble helper, words with friends cheat, anagram solver",
};

export default function WordScrambleSolverPage() {
  const [letters, setLetters] = useState("");
  const [filterLen, setFilterLen] = useState(0);

  const results = useMemo(() => {
    const input = letters.toLowerCase().replace(/[^a-z]/g, "");
    if (input.length < 2) return [];

    const inputCounts: Record<string, number> = {};
    for (const ch of input) {
      inputCounts[ch] = (inputCounts[ch] || 0) + 1;
    }

    const matches: string[] = [];
    for (const word of WORD_LIST) {
      if (word.length > input.length || word.length < 2) continue;
      const wordCounts: Record<string, number> = {};
      let valid = true;
      for (const ch of word) {
        wordCounts[ch] = (wordCounts[ch] || 0) + 1;
        if (wordCounts[ch] > (inputCounts[ch] || 0)) {
          valid = false;
          break;
        }
      }
      if (valid) matches.push(word);
    }

    matches.sort((a, b) => b.length - a.length || a.localeCompare(b));
    return matches;
  }, [letters]);

  const filtered = filterLen > 0 ? results.filter((w) => w.length === filterLen) : results;
  const lengths = [...new Set(results.map((w) => w.length))].sort((a, b) => b - a);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/word-scramble-solver`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/word-scramble-solver`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Word Scramble Solver</h1>
        <p className="text-[var(--muted)] mb-8">
          Enter scrambled letters and find all valid English words you can make from them.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <label className="block text-sm font-medium mb-2">Enter Scrambled Letters</label>
          <input
            type="text"
            value={letters}
            onChange={(e) => { setLetters(e.target.value); setFilterLen(0); }}
            className="input-field text-lg font-mono tracking-widest uppercase"
            placeholder="e.g. TRSLEA"
            maxLength={15}
          />
          {letters && (
            <button onClick={() => { setLetters(""); setFilterLen(0); }} className="btn-secondary text-sm mt-3">
              Clear
            </button>
          )}
        </div>

        {results.length > 0 && (
          <div className="tool-card mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm font-medium">Found {results.length} words</span>
              <span className="text-[var(--muted)]">|</span>
              <span className="text-sm text-[var(--muted)]">Filter by length:</span>
              <button
                onClick={() => setFilterLen(0)}
                className={`text-xs px-2 py-1 rounded ${filterLen === 0 ? "bg-[var(--primary)] text-white" : "bg-[var(--bg-secondary)]"}`}
              >
                All
              </button>
              {lengths.map((len) => (
                <button
                  key={len}
                  onClick={() => setFilterLen(len)}
                  className={`text-xs px-2 py-1 rounded ${filterLen === len ? "bg-[var(--primary)] text-white" : "bg-[var(--bg-secondary)]"}`}
                >
                  {len} letters
                </button>
              ))}
            </div>

            <div className="result-card max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {filtered.map((word) => (
                  <div key={word} className="bg-[var(--bg-secondary)] px-3 py-2 rounded text-sm font-mono">
                    <span className="font-semibold">{word}</span>
                    <span className="text-xs text-[var(--muted)] ml-2">({word.length})</span>
                  </div>
                ))}
              </div>
              {filtered.length === 0 && (
                <p className="text-sm text-[var(--muted)] text-center py-4">No words of that length found.</p>
              )}
            </div>
          </div>
        )}

        {letters.length >= 2 && results.length === 0 && (
          <div className="tool-card mb-6 text-center py-6">
            <p className="text-[var(--muted)]">No valid words found with those letters. Try different letters.</p>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does the Word Scramble Solver Work?</h2>
          <p>
            Enter any combination of scrambled letters, and this tool finds all valid English words that can be
            formed using those letters. Each letter can only be used as many times as it appears in your input.
          </p>

          <h2>Perfect For</h2>
          <ul>
            <li><strong>Scrabble:</strong> Find high-scoring words from your letter tiles</li>
            <li><strong>Words with Friends:</strong> Discover all possible plays</li>
            <li><strong>Word Puzzles:</strong> Solve newspaper word scrambles and jumbles</li>
            <li><strong>Learning:</strong> Expand your vocabulary by exploring word combinations</li>
          </ul>

          <h2>Tips</h2>
          <p>
            Enter up to 15 letters. Results are sorted by length (longest first) and can be filtered by word length.
            The dictionary contains over 5,000 common English words.
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
            name: "Word Scramble Solver",
            description: META.description,
            url: `${SITE_URL}/tools/word-scramble-solver`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
