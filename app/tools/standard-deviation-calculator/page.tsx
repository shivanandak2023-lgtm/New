"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Standard Deviation Calculator - Mean, Variance, Statistics",
  description:
    "Free standard deviation calculator. Enter your data to find mean, median, mode, range, variance, standard deviation (population and sample), sum, count, min, and max.",
  keywords:
    "standard deviation calculator, variance calculator, mean calculator, median calculator, statistics calculator, population standard deviation, sample standard deviation",
};

export default function StandardDeviationCalculatorPage() {
  const [input, setInput] = useState("10, 12, 23, 23, 16, 23, 21, 16");

  const stats = useMemo(() => {
    const raw = input
      .split(/[,\n\s]+/)
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map(Number)
      .filter((n) => !isNaN(n));
    if (raw.length === 0) return null;

    const sorted = [...raw].sort((a, b) => a - b);
    const n = raw.length;
    const sum = raw.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    // Median
    const median = n % 2 === 1 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

    // Mode
    const freq: Record<number, number> = {};
    raw.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.entries(freq)
      .filter(([, f]) => f === maxFreq && f > 1)
      .map(([v]) => Number(v));

    // Variance and standard deviation
    const diffSquares = raw.map((v) => (v - mean) ** 2);
    const popVariance = diffSquares.reduce((a, b) => a + b, 0) / n;
    const sampleVariance = n > 1 ? diffSquares.reduce((a, b) => a + b, 0) / (n - 1) : 0;
    const popStdDev = Math.sqrt(popVariance);
    const sampleStdDev = Math.sqrt(sampleVariance);

    return {
      data: raw,
      sorted,
      n,
      sum,
      mean,
      median,
      modes,
      maxFreq,
      min,
      max,
      range,
      diffSquares,
      popVariance,
      sampleVariance,
      popStdDev,
      sampleStdDev,
    };
  }, [input]);

  const fmt = (n: number) => {
    const r = Math.round(n * 1e6) / 1e6;
    return r === Math.round(r) ? String(Math.round(r)) : r.toFixed(6).replace(/0+$/, "");
  };

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/standard-deviation-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/standard-deviation-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Standard Deviation Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Enter numbers separated by commas or newlines. Get mean, median, mode, variance, standard deviation, and more.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <label className="block text-sm font-medium mb-2">Enter Data (comma or newline separated)</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field font-mono"
            rows={4}
            placeholder="e.g. 10, 12, 23, 23, 16, 23, 21, 16"
          />
          <p className="text-xs text-[var(--muted)] mt-1">
            {stats ? `${stats.n} numbers detected` : "Enter at least one number"}
          </p>
        </div>

        {stats && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-xs text-[var(--muted)] mb-1">Count</p>
                <p className="text-xl font-bold text-[var(--primary)]">{stats.n}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-[var(--muted)] mb-1">Sum</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmt(stats.sum)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-[var(--muted)] mb-1">Mean</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmt(stats.mean)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-[var(--muted)] mb-1">Median</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmt(stats.median)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-[var(--muted)] mb-1">Mode</p>
                <p className="text-xl font-bold text-[var(--primary)]">
                  {stats.modes.length > 0 ? stats.modes.join(", ") : "None"}
                </p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-[var(--muted)] mb-1">Range</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmt(stats.range)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-[var(--muted)] mb-1">Min</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmt(stats.min)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-[var(--muted)] mb-1">Max</p>
                <p className="text-xl font-bold text-[var(--primary)]">{fmt(stats.max)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Population Std Dev (&sigma;)</p>
                <p className="text-2xl font-bold text-green-700">{fmt(stats.popStdDev)}</p>
                <p className="text-xs text-[var(--muted)] mt-1">Variance: {fmt(stats.popVariance)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Sample Std Dev (s)</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(stats.sampleStdDev)}</p>
                <p className="text-xs text-[var(--muted)] mt-1">Variance: {fmt(stats.sampleVariance)}</p>
              </div>
            </div>

            {/* Step by step */}
            <div className="tool-card">
              <h2 className="text-lg font-bold mb-4">Step-by-Step Calculation</h2>
              <div className="space-y-2 text-sm text-[var(--muted)]">
                <p><strong>1.</strong> Sorted data: {stats.sorted.join(", ")}</p>
                <p><strong>2.</strong> Count (n) = {stats.n}</p>
                <p><strong>3.</strong> Sum = {fmt(stats.sum)}</p>
                <p><strong>4.</strong> Mean = Sum / n = {fmt(stats.sum)} / {stats.n} = {fmt(stats.mean)}</p>
                <p><strong>5.</strong> Differences from mean squared:</p>
                <div className="ml-4 overflow-x-auto">
                  <p className="font-mono text-xs">
                    {stats.data.map((v, i) => `(${fmt(v)} - ${fmt(stats.mean)})${String.fromCharCode(178)} = ${fmt(stats.diffSquares[i])}`).join(", ")}
                  </p>
                </div>
                <p><strong>6.</strong> Population variance = {fmt(stats.diffSquares.reduce((a, b) => a + b, 0))} / {stats.n} = {fmt(stats.popVariance)}</p>
                <p><strong>7.</strong> Population std dev = &radic;{fmt(stats.popVariance)} = {fmt(stats.popStdDev)}</p>
                {stats.n > 1 && (
                  <>
                    <p><strong>8.</strong> Sample variance = {fmt(stats.diffSquares.reduce((a, b) => a + b, 0))} / {stats.n - 1} = {fmt(stats.sampleVariance)}</p>
                    <p><strong>9.</strong> Sample std dev = &radic;{fmt(stats.sampleVariance)} = {fmt(stats.sampleStdDev)}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is Standard Deviation?</h2>
          <p>
            Standard deviation measures the amount of variation or dispersion in a set of values. A low standard deviation means the values tend to be close to the mean, while a high standard deviation indicates the values are spread out over a wider range.
          </p>

          <h2>Population vs Sample Standard Deviation</h2>
          <p>
            Population standard deviation (&sigma;) divides by N (the total count), while sample standard deviation (s) divides by N-1 (Bessel&apos;s correction). Use population when you have data for the entire group, and sample when you have a subset.
          </p>

          <h3>How to Calculate Standard Deviation</h3>
          <p>
            1. Find the mean of the data set. 2. Subtract the mean from each value and square the result. 3. Find the average of those squared differences (variance). 4. Take the square root of the variance. This gives you the standard deviation.
          </p>

          <h3>Related Statistics</h3>
          <p>
            The mean is the average value. The median is the middle value when sorted. The mode is the most frequently occurring value. The range is the difference between the maximum and minimum values.
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
            name: "Standard Deviation Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/standard-deviation-calculator`,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
