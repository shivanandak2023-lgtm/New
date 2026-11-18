"use client";

import { useState, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Random Number Generator - Coin Flip, Dice Roller & Random Picker",
  description:
    "Free Random Number Generator with coin flip, dice roller, and random picker. Generate random numbers with custom range, quantity, and duplicate options.",
  keywords: "random number generator, coin flip, dice roller, random picker, random number, rng",
};

const SAMPLE_TEXTS = [
  "Apple", "Banana", "Cherry", "Date", "Elderberry",
  "Fig", "Grape", "Honeydew", "Kiwi", "Lemon",
];

export default function RandomNumberGeneratorPage() {
  // Random Number Generator
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [quantity, setQuantity] = useState<number>(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [numbers, setNumbers] = useState<number[]>([]);

  // Coin Flip
  const [coinResult, setCoinResult] = useState<string>("");
  const [coinFlipping, setCoinFlipping] = useState(false);

  // Dice Roller
  const [diceCount, setDiceCount] = useState<number>(1);
  const [diceResults, setDiceResults] = useState<number[]>([]);

  // Random Picker
  const [listText, setListText] = useState<string>(SAMPLE_TEXTS.join("\n"));
  const [pickedItem, setPickedItem] = useState<string>("");

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"numbers" | "coin" | "dice" | "picker">("numbers");

  const generateNumbers = useCallback(() => {
    if (min > max) return;
    const range = max - min + 1;
    if (!allowDuplicates && quantity > range) return;

    const result: number[] = [];
    const used = new Set<number>();

    for (let i = 0; i < quantity; i++) {
      let num: number;
      do {
        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        num = min + (arr[0] % range);
      } while (!allowDuplicates && used.has(num));
      used.add(num);
      result.push(num);
    }
    setNumbers(result);
    setCopied(false);
  }, [min, max, quantity, allowDuplicates]);

  const flipCoin = useCallback(() => {
    setCoinFlipping(true);
    setCoinResult("");
    setTimeout(() => {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      setCoinResult(arr[0] % 2 === 0 ? "Heads" : "Tails");
      setCoinFlipping(false);
    }, 600);
  }, []);

  const rollDice = useCallback(() => {
    const results: number[] = [];
    const arr = new Uint32Array(diceCount);
    crypto.getRandomValues(arr);
    for (let i = 0; i < diceCount; i++) {
      results.push((arr[i] % 6) + 1);
    }
    setDiceResults(results);
  }, [diceCount]);

  const pickRandom = useCallback(() => {
    const items = listText.split("\n").map((s) => s.trim()).filter(Boolean);
    if (items.length === 0) return;
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    setPickedItem(items[arr[0] % items.length]);
  }, [listText]);

  function copyResults() {
    const text = numbers.join(", ");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const tabs = [
    { key: "numbers" as const, label: "Numbers" },
    { key: "coin" as const, label: "Coin Flip" },
    { key: "dice" as const, label: "Dice Roller" },
    { key: "picker" as const, label: "Random Picker" },
  ];

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/random-number-generator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/random-number-generator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Random Number Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Generate random numbers, flip coins, roll dice, or pick random items from a list.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="flex gap-2 mb-6 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === t.key
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === "numbers" && (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Minimum</label>
                  <input
                    type="number"
                    value={min}
                    onChange={(e) => setMin(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg bg-[var(--muted-bg)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Maximum</label>
                  <input
                    type="number"
                    value={max}
                    onChange={(e) => setMax(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg bg-[var(--muted-bg)]"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Quantity: <span className="text-[var(--primary)] font-bold">{quantity}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
                <div className="flex justify-between text-xs text-[var(--muted)] mt-1">
                  <span>1</span>
                  <span>100</span>
                </div>
              </div>

              <label className="flex items-center gap-2 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowDuplicates}
                  onChange={(e) => setAllowDuplicates(e.target.checked)}
                  className="accent-[var(--primary)] w-4 h-4"
                />
                <span className="text-sm">Allow duplicate numbers</span>
              </label>

              {!allowDuplicates && quantity > max - min + 1 && (
                <p className="text-red-500 text-sm mb-4">
                  Quantity exceeds the range of unique numbers available ({max - min + 1}).
                </p>
              )}

              <button onClick={generateNumbers} className="btn-primary w-full mb-4">
                Generate Numbers
              </button>

              {numbers.length > 0 && (
                <div className="result-card">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-sm font-medium text-[var(--muted)]">Results</span>
                    <button onClick={copyResults} className="btn-primary text-sm shrink-0">
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {numbers.map((n, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[var(--primary)] text-white rounded-full text-sm font-mono"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "coin" && (
            <div className="text-center">
              <div className="mb-6">
                <div
                  className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-4xl font-bold border-4 transition-all ${
                    coinFlipping ? "animate-spin border-[var(--primary)]" : "border-gray-300"
                  } ${
                    coinResult === "Heads"
                      ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                      : coinResult === "Tails"
                      ? "bg-gray-100 border-gray-400 text-gray-700"
                      : "bg-[var(--muted-bg)]"
                  }`}
                >
                  {coinFlipping ? "..." : coinResult || "?"}
                </div>
              </div>
              {coinResult && !coinFlipping && (
                <p className="text-2xl font-bold mb-4">{coinResult}!</p>
              )}
              <button onClick={flipCoin} disabled={coinFlipping} className="btn-primary px-8">
                Flip Coin
              </button>
            </div>
          )}

          {activeTab === "dice" && (
            <div className="text-center">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Number of Dice: <span className="text-[var(--primary)] font-bold">{diceCount}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={diceCount}
                  onChange={(e) => setDiceCount(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
                <div className="flex justify-between text-xs text-[var(--muted)] mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              <button onClick={rollDice} className="btn-primary px-8 mb-6">
                Roll Dice
              </button>

              {diceResults.length > 0 && (
                <div>
                  <div className="flex justify-center gap-3 flex-wrap mb-4">
                    {diceResults.map((d, i) => (
                      <div
                        key={i}
                        className="w-16 h-16 bg-white border-2 border-gray-300 rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm"
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  <p className="text-lg font-medium">
                    Total: <span className="text-[var(--primary)] font-bold">{diceResults.reduce((a, b) => a + b, 0)}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "picker" && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Enter items (one per line)</label>
                <textarea
                  value={listText}
                  onChange={(e) => setListText(e.target.value)}
                  rows={6}
                  className="w-full p-3 border rounded-lg bg-[var(--muted-bg)] font-mono text-sm"
                  placeholder="Item 1&#10;Item 2&#10;Item 3"
                />
              </div>

              <button onClick={pickRandom} className="btn-primary w-full mb-4">
                Pick Random Item
              </button>

              {pickedItem && (
                <div className="result-card text-center">
                  <p className="text-sm text-[var(--muted)] mb-1">Selected Item</p>
                  <p className="text-3xl font-bold text-[var(--primary)]">{pickedItem}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Random Number Generator</h2>
          <p>
            Our random number generator uses the cryptographically secure Web Crypto API to produce truly
            unpredictable random numbers. Whether you need random numbers for games, lotteries, statistics,
            or decision-making, this tool has you covered.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Random Numbers:</strong> Generate one or multiple random numbers within a custom range with optional duplicate control</li>
            <li><strong>Coin Flip:</strong> Simulate a fair coin toss with heads or tails result</li>
            <li><strong>Dice Roller:</strong> Roll up to 10 dice simultaneously with automatic total</li>
            <li><strong>Random Picker:</strong> Paste a list of items and pick one at random for decisions</li>
          </ul>

          <h2>How It Works</h2>
          <p>
            This generator uses <code>crypto.getRandomValues()</code>, a cryptographically secure random number
            generator built into your browser. Unlike <code>Math.random()</code>, this method produces
            truly unpredictable values suitable for security-sensitive applications.
          </p>

          <h3>Common Use Cases</h3>
          <ul>
            <li>Lottery number generation</li>
            <li>Random sampling for statistics</li>
            <li>Game simulations and dice rolls</li>
            <li>Random selection for giveaways</li>
            <li>Decision making with coin flips</li>
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
            name: "Random Number Generator",
            description: META.description,
            url: `${SITE_URL}/tools/random-number-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
