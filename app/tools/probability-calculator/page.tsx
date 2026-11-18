"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Probability Calculator - Combinations, Permutations, Binomial",
  description:
    "Free probability calculator with multiple modes: simple probability, combinations (nCr), permutations (nPr), binomial probability, and coin flip probability.",
  keywords:
    "probability calculator, combination calculator, permutation calculator, nCr calculator, nPr calculator, binomial probability, coin flip probability",
};

function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  let result = 1;
  for (let i = 0; i < Math.min(r, n - r); i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

function nPr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  let result = 1;
  for (let i = 0; i < r; i++) result *= n - i;
  return result;
}

type Mode = "simple" | "combination" | "permutation" | "binomial" | "coin";

export default function ProbabilityCalculatorPage() {
  const [mode, setMode] = useState<Mode>("simple");
  const [favorable, setFavorable] = useState("3");
  const [total, setTotal] = useState("10");
  const [nVal, setNVal] = useState("10");
  const [rVal, setRVal] = useState("3");
  const [trials, setTrials] = useState("10");
  const [succProb, setSuccProb] = useState("0.5");
  const [kSucc, setKSucc] = useState("5");
  const [flips, setFlips] = useState("10");
  const [heads, setHeads] = useState("5");

  const modes: { key: Mode; label: string }[] = [
    { key: "simple", label: "Simple" },
    { key: "combination", label: "Combination (nCr)" },
    { key: "permutation", label: "Permutation (nPr)" },
    { key: "binomial", label: "Binomial" },
    { key: "coin", label: "Coin Flip" },
  ];

  const fmt = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return "N/A";
    const r = Math.round(n * 1e8) / 1e8;
    return r === Math.round(r) ? String(Math.round(r)) : r.toFixed(8).replace(/0+$/, "");
  };

  const pct = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return "N/A";
    return (n * 100).toFixed(4).replace(/0+$/, "").replace(/\.$/, "") + "%";
  };

  const renderResult = () => {
    switch (mode) {
      case "simple": {
        const f = parseInt(favorable) || 0;
        const t = parseInt(total) || 0;
        if (t <= 0) return <p className="text-red-600">Total outcomes must be greater than 0.</p>;
        if (f < 0 || f > t) return <p className="text-red-600">Favorable outcomes must be between 0 and total.</p>;
        const p = f / t;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Probability</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(p)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Percentage</p>
                <p className="text-2xl font-bold text-green-700">{pct(p)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Odds</p>
                <p className="text-2xl font-bold text-amber-700">{f} : {t - f}</p>
              </div>
            </div>
            <div className="text-sm text-[var(--muted)]">
              <p><strong>Formula:</strong> P(A) = Favorable / Total = {f} / {t} = {fmt(p)}</p>
            </div>
          </div>
        );
      }
      case "combination": {
        const n = parseInt(nVal) || 0;
        const r = parseInt(rVal) || 0;
        if (n < 0 || r < 0) return <p className="text-red-600">Values must be non-negative.</p>;
        if (r > n) return <p className="text-red-600">r cannot be greater than n.</p>;
        const result = nCr(n, r);
        return (
          <div className="space-y-4">
            <div className="result-card text-center">
              <p className="text-sm text-[var(--muted)] mb-1">C({n}, {r})</p>
              <p className="text-3xl font-bold text-[var(--primary)]">{fmt(result)}</p>
            </div>
            <div className="text-sm text-[var(--muted)]">
              <p><strong>Formula:</strong> C(n, r) = n! / (r! &times; (n-r)!)</p>
              <p>C({n}, {r}) = {n}! / ({r}! &times; {n - r}!) = {fmt(result)}</p>
            </div>
          </div>
        );
      }
      case "permutation": {
        const n = parseInt(nVal) || 0;
        const r = parseInt(rVal) || 0;
        if (n < 0 || r < 0) return <p className="text-red-600">Values must be non-negative.</p>;
        if (r > n) return <p className="text-red-600">r cannot be greater than n.</p>;
        const result = nPr(n, r);
        return (
          <div className="space-y-4">
            <div className="result-card text-center">
              <p className="text-sm text-[var(--muted)] mb-1">P({n}, {r})</p>
              <p className="text-3xl font-bold text-[var(--primary)]">{fmt(result)}</p>
            </div>
            <div className="text-sm text-[var(--muted)]">
              <p><strong>Formula:</strong> P(n, r) = n! / (n-r)!</p>
              <p>P({n}, {r}) = {n}! / {n - r}! = {fmt(result)}</p>
            </div>
          </div>
        );
      }
      case "binomial": {
        const n = parseInt(trials) || 0;
        const p = parseFloat(succProb) || 0;
        const k = parseInt(kSucc) || 0;
        if (n < 0 || k < 0) return <p className="text-red-600">Values must be non-negative.</p>;
        if (p < 0 || p > 1) return <p className="text-red-600">Probability must be between 0 and 1.</p>;
        if (k > n) return <p className="text-red-600">Successes cannot exceed trials.</p>;
        const prob = nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
        const mean = n * p;
        const variance = n * p * (1 - p);
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">P(X = {k})</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(prob)}</p>
                <p className="text-xs text-[var(--muted)]">{pct(prob)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Expected Value</p>
                <p className="text-2xl font-bold text-green-700">{fmt(mean)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Std Deviation</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(Math.sqrt(variance))}</p>
              </div>
            </div>
            <div className="text-sm text-[var(--muted)]">
              <p><strong>Formula:</strong> P(X=k) = C(n,k) &times; p^k &times; (1-p)^(n-k)</p>
              <p>= C({n},{k}) &times; {fmt(p)}^{k} &times; {fmt(1 - p)}^{n - k}</p>
              <p>= {fmt(nCr(n, k))} &times; {fmt(Math.pow(p, k))} &times; {fmt(Math.pow(1 - p, n - k))} = {fmt(prob)}</p>
            </div>
          </div>
        );
      }
      case "coin": {
        const n = parseInt(flips) || 0;
        const k = parseInt(heads) || 0;
        if (n < 0 || k < 0) return <p className="text-red-600">Values must be non-negative.</p>;
        if (k > n) return <p className="text-red-600">Heads cannot exceed flips.</p>;
        const prob = nCr(n, k) * Math.pow(0.5, n);
        const atLeastK = Array.from({ length: n - k + 1 }, (_, i) => nCr(n, k + i) * Math.pow(0.5, n)).reduce(
          (a, b) => a + b,
          0
        );
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Exactly {k} heads in {n} flips</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{pct(prob)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">At least {k} heads</p>
                <p className="text-2xl font-bold text-green-700">{pct(atLeastK)}</p>
              </div>
            </div>
            <div className="text-sm text-[var(--muted)]">
              <p><strong>Formula:</strong> P(exactly {k} heads) = C({n},{k}) &times; (0.5)^{n}</p>
              <p>= {fmt(nCr(n, k))} &times; {fmt(Math.pow(0.5, n))} = {fmt(prob)}</p>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/probability-calculator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Probability Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate probabilities for simple events, combinations, permutations, binomial distribution, and coin flips.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Mode</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {modes.map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                  mode === m.key
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {mode === "simple" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Favorable Outcomes</label>
                <input type="number" value={favorable} onChange={(e) => setFavorable(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Outcomes</label>
                <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} className="input-field" />
              </div>
            </div>
          )}

          {(mode === "combination" || mode === "permutation") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">n (total items)</label>
                <input type="number" value={nVal} onChange={(e) => setNVal(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">r (items chosen)</label>
                <input type="number" value={rVal} onChange={(e) => setRVal(e.target.value)} className="input-field" />
              </div>
            </div>
          )}

          {mode === "binomial" && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Trials (n)</label>
                <input type="number" value={trials} onChange={(e) => setTrials(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">P(success)</label>
                <input type="number" step="0.01" value={succProb} onChange={(e) => setSuccProb(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Successes (k)</label>
                <input type="number" value={kSucc} onChange={(e) => setKSucc(e.target.value)} className="input-field" />
              </div>
            </div>
          )}

          {mode === "coin" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Number of Flips</label>
                <input type="number" value={flips} onChange={(e) => setFlips(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Desired Heads</label>
                <input type="number" value={heads} onChange={(e) => setHeads(e.target.value)} className="input-field" />
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">{renderResult()}</div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Understanding Probability</h2>
          <p>
            Probability measures the likelihood of an event occurring, expressed as a number between 0 (impossible) and 1 (certain). The basic formula is P(A) = number of favorable outcomes / total number of outcomes.
          </p>

          <h2>Combinations vs Permutations</h2>
          <p>
            Combinations (nCr) count selections where order does not matter (e.g., choosing a committee). Permutations (nPr) count arrangements where order matters (e.g., ranking finishers in a race).
          </p>

          <h3>Binomial Distribution</h3>
          <p>
            The binomial distribution models the number of successes in a fixed number of independent trials, each with the same probability of success. It is widely used in quality control, clinical trials, and survey analysis.
          </p>

          <h3>Coin Flip Probability</h3>
          <p>
            A fair coin has a 50% chance of landing heads on each flip. The probability of getting exactly k heads in n flips follows the binomial distribution with p = 0.5. For example, the probability of exactly 3 heads in 5 flips is C(5,3) &times; 0.5^5 = 31.25%.
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
            name: "Probability Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/probability-calculator`,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
