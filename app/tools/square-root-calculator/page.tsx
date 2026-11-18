"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Square Root Calculator - Find Square, Cube & Nth Root",
  description:
    "Free square root calculator. Find the square root, cube root, or any nth root of a number. Check if a number is a perfect square and see a table of common roots.",
  keywords:
    "square root calculator, cube root calculator, nth root calculator, perfect square checker, sqrt calculator, radical calculator, root finder",
};

const COMMON_ROOTS = Array.from({ length: 25 }, (_, i) => {
  const n = i + 1;
  return { n, square: n * n, sqrt: Math.sqrt(n).toFixed(4).replace(/0+$/, "").replace(/\.$/, "") };
});

export default function SquareRootCalculatorPage() {
  const [value, setValue] = useState("144");
  const [nthRoot, setNthRoot] = useState("2");

  const num = parseFloat(value) || 0;
  const n = parseFloat(nthRoot) || 2;

  const sqrtVal = num >= 0 ? Math.sqrt(num) : NaN;
  const cbrtVal = Math.cbrt(num);
  const nthVal = n > 0 && num >= 0 ? Math.pow(num, 1 / n) : n > 0 && num < 0 && n % 2 !== 0 ? -Math.pow(-num, 1 / n) : NaN;

  const isPerfectSquare = num >= 0 && Number.isInteger(Math.sqrt(num));
  const isPerfectCube = Number.isInteger(Math.round(Math.cbrt(num) * 1e10) / 1e10) && Math.abs(Math.cbrt(num) - Math.round(Math.cbrt(num))) < 1e-9;

  const fmt = (v: number) => isNaN(v) ? "N/A" : v.toFixed(8).replace(/0+$/, "").replace(/\.$/, "");

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/square-root-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Square Root Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate the square root, cube root, or any nth root of a number. Check if a number is a perfect square and explore a table of common square roots.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Number</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="input-field"
                placeholder="e.g., 144"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nth Root (n)</label>
              <input
                type="number"
                value={nthRoot}
                onChange={(e) => setNthRoot(e.target.value)}
                className="input-field"
                placeholder="e.g., 2"
                min="1"
                step="1"
              />
            </div>
          </div>
        </div>

        {num !== 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Square Root</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(sqrtVal)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Cube Root</p>
                <p className="text-2xl font-bold text-green-700">{fmt(cbrtVal)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">{n === 2 ? "Square" : n === 3 ? "Cube" : `${n}th`} Root</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(nthVal)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Perfect Square?</p>
                <p className={`text-lg font-bold ${isPerfectSquare ? "text-green-700" : "text-red-600"}`}>
                  {num < 0 ? "No (negative)" : isPerfectSquare ? `Yes (${Math.sqrt(num)}^2 = ${num})` : "No"}
                </p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Perfect Cube?</p>
                <p className={`text-lg font-bold ${isPerfectCube ? "text-green-700" : "text-red-600"}`}>
                  {isPerfectCube ? `Yes (${Math.round(Math.cbrt(num))}^3 = ${num})` : "No"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Common Square Roots (1-25)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Number</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Square (n^2)</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Square Root</th>
                </tr>
              </thead>
              <tbody>
                {COMMON_ROOTS.map((r) => (
                  <tr key={r.n} className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-semibold">{r.n}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2">{r.square}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2">{r.sqrt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Square Root</h2>
          <p>
            The square root of a number x is a value y such that y x y = x. It is denoted as the radical sign followed by x.
            For example, the square root of 144 is 12 because 12 x 12 = 144.
          </p>

          <h2>What Is a Perfect Square?</h2>
          <p>
            A perfect square is a number that can be expressed as the product of an integer with itself. Examples include
            1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, and so on. The square root of a perfect square is always a
            whole number.
          </p>

          <h2>Nth Root Explained</h2>
          <p>
            The nth root of a number x is a value y such that y raised to the power n equals x. The square root is the
            2nd root, the cube root is the 3rd root, and so on. The formula is: nth root of x = x^(1/n).
          </p>

          <h3>Cube Root</h3>
          <p>
            The cube root of a number x is a value y such that y x y x y = x. Unlike square roots, cube roots can be
            calculated for negative numbers. For example, the cube root of -27 is -3 because (-3) x (-3) x (-3) = -27.
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
            name: "Square Root Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/square-root-calculator`,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
