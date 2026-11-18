"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { WORD_LIST } from "@/lib/word-list";

const META = {
  title: "Anagram Solver - Find All Anagrams of Any Word",
  description:
    "Free Anagram Solver. Enter any word and find all possible anagrams from a dictionary of 5000+ English words. Results grouped by length.",
  keywords: "anagram solver, anagram finder, word anagrams, anagram generator, rearrange letters, anagram maker",
};

const FUN_FACTS = [
  '"Listen" is an anagram of "Silent"',
  '"Astronomer" is an anagram of "Moon starer"',
  '"The eyes" is an anagram of "They see"',
  '"Dormitory" is an anagram of "Dirty room"',
  '"Slot machines" is an anagram of "Cash lost in me"',
  '"Eleven plus two" is an anagram of "Twelve plus one"',
  '"A decimal point" is an anagram of "I\'m a dot in place"',
  '"Funeral" is an anagram of "Real fun"',
  '"Election results" is an anagram of "Lies, let\'s recount"',
  '"Snooze alarms" is an anagram of "Alas, no more z\'s"',
];

export default function AnagramSolverPage() {
  const [word, setWord] = useState("");

  const results = useMemo(() => {
    const input = word.toLowerCase().replace(/[^a-z]/g, "");
    if (input.length < 2) return [];

    const inputSorted = input.split("").sort().join("");
    const inputCounts: Record<string, number> = {};
    for (const ch of input) {
      inputCounts[ch] = (inputCounts[ch] || 0) + 1;
    }

    const anagrams: string[] = [];

    for (const w of WORD_LIST) {
      if (w.length > input.length || w.length < 2) continue;
      if (w === input) continue;

      // For exact anagrams (same length), check if sorted letters match
      if (w.length === input.length) {
        const wSorted = w.split("").sort().join("");
        if (wSorted === inputSorted) {
          anagrams.push(w);
        }
      } else {
        // For sub-anagrams, check letter counts
        const wCounts: Record<string, number> = {};
        let valid = true;
        for (const ch of w) {
          wCounts[ch] = (wCounts[ch] || 0) + 1;
          if (wCounts[ch] > (inputCounts[ch] || 0)) {
            valid = false;
            break;
          }
        }
        if (valid) anagrams.push(w);
      }
    }

    anagrams.sort((a, b) => b.length - a.length || a.localeCompare(b));
    return anagrams;
  }, [word]);

  const exactAnagrams = results.filter((w) => w.length === word.replace(/[^a-zA-Z]/g, "").length);
  const subAnagrams = results.filter((w) => w.length < word.replace(/[^a-zA-Z]/g, "").length);
  const groupedSub: Record<number, string[]> = {};
  for (const w of subAnagrams) {
    if (!groupedSub[w.length]) groupedSub[w.length] = [];
    groupedSub[w.length].push(w);
  }
  const subLengths = Object.keys(groupedSub).map(Number).sort((a, b) => b - a);

  const randomFact = FUN_FACTS[Math.abs(word.length * 7 + (word.charCodeAt(0) || 0)) % FUN_FACTS.length];

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/anagram-solver`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Anagram Solver</h1>
        <p className="text-[var(--muted)] mb-8">
          Enter a word and find all possible anagrams and sub-anagrams from our dictionary.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <label className="block text-sm font-medium mb-2">Enter a Word</label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="input-field text-lg font-mono tracking-widest uppercase"
            placeholder="e.g. LISTEN"
            maxLength={15}
          />
          {word && (
            <button onClick={() => setWord("")} className="btn-secondary text-sm mt-3">Clear</button>
          )}
        </div>

        {results.length > 0 && (
          <>
            {exactAnagrams.length > 0 && (
              <div className="tool-card mb-6">
                <h2 className="text-lg font-bold mb-3">
                  Exact Anagrams ({exactAnagrams.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {exactAnagrams.map((w) => (
                    <div key={w} className="bg-[var(--primary)] text-white px-3 py-2 rounded text-sm font-mono text-center font-semibold">
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subAnagrams.length > 0 && (
              <div className="tool-card mb-6">
                <h2 className="text-lg font-bold mb-3">
                  Sub-Anagrams ({subAnagrams.length} words)
                </h2>
                <div className="result-card max-h-[400px] overflow-y-auto space-y-4">
                  {subLengths.map((len) => (
                    <div key={len}>
                      <h3 className="text-sm font-semibold text-[var(--muted)] mb-2">{len}-letter words ({groupedSub[len].length})</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {groupedSub[len].map((w) => (
                          <div key={w} className="bg-[var(--bg-secondary)] px-3 py-2 rounded text-sm font-mono">
                            {w}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="tool-card mb-8 bg-[var(--bg-secondary)]">
              <p className="text-sm font-medium">Did you know?</p>
              <p className="text-sm text-[var(--muted)] mt-1">{randomFact}</p>
            </div>
          </>
        )}

        {word.length >= 2 && results.length === 0 && (
          <div className="tool-card mb-6 text-center py-6">
            <p className="text-[var(--muted)]">No anagrams found for &ldquo;{word}&rdquo;. Try a different word.</p>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is an Anagram?</h2>
          <p>
            An anagram is a word or phrase formed by rearranging the letters of another word or phrase,
            using all the original letters exactly once. For example, &ldquo;listen&rdquo; can be rearranged to &ldquo;silent&rdquo;.
          </p>

          <h2>How This Tool Works</h2>
          <ul>
            <li><strong>Exact Anagrams:</strong> Words that use ALL the same letters as your input</li>
            <li><strong>Sub-Anagrams:</strong> Shorter words that can be made from a subset of your letters</li>
            <li><strong>Dictionary:</strong> Searches through 5,000+ common English words</li>
          </ul>

          <h2>Fun Anagram Facts</h2>
          <ul>
            {FUN_FACTS.slice(0, 5).map((fact, i) => (
              <li key={i}>{fact}</li>
            ))}
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
            name: "Anagram Solver",
            description: META.description,
            url: `${SITE_URL}/tools/anagram-solver`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
