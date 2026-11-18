"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Factor Calculator - Factors, Prime Factorization, GCD & LCM",
  description:
    "Find all factors of a number, prime factorization with factor tree, GCD and LCM calculator, and number properties. Step-by-step solutions.",
  keywords:
    "factor calculator, prime factorization, factor tree, GCD calculator, LCM calculator, greatest common divisor, least common multiple, factors of a number",
};

function getFactors(n: number): number[] {
  if (n < 1) return [];
  const factors: number[] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      factors.push(i);
      if (i !== n / i) factors.push(n / i);
    }
  }
  return factors.sort((a, b) => a - b);
}

function primeFactorization(n: number): { factor: number; power: number }[] {
  if (n < 2) return [];
  const factors: { factor: number; power: number }[] = [];
  let num = n;
  for (let i = 2; i * i <= num; i++) {
    let count = 0;
    while (num % i === 0) {
      count++;
      num /= i;
    }
    if (count > 0) factors.push({ factor: i, power: count });
  }
  if (num > 1) factors.push({ factor: num, power: 1 });
  return factors;
}

function primeFactorizationSteps(n: number): { divisor: number; quotient: number }[] {
  if (n < 2) return [];
  const steps: { divisor: number; quotient: number }[] = [];
  let num = n;
  for (let i = 2; i * i <= num; i++) {
    while (num % i === 0) {
      steps.push({ divisor: i, quotient: num / i });
      num /= i;
    }
  }
  if (num > 1) steps.push({ divisor: num, quotient: 1 });
  return steps;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

type Tab = "factors" | "gcdlcm";

export default function FactorCalculatorPage() {
  const [tab, setTab] = useState<Tab>("factors");
  const [numInput, setNumInput] = useState("120");
  const [gcdA, setGcdA] = useState("24");
  const [gcdB, setGcdB] = useState("36");

  const num = Math.abs(parseInt(numInput) || 0);
  const gcdANum = Math.abs(parseInt(gcdA) || 0);
  const gcdBNum = Math.abs(parseInt(gcdB) || 0);

  const factors = useMemo(() => (num >= 1 ? getFactors(num) : []), [num]);
  const primeFactors = useMemo(() => (num >= 2 ? primeFactorization(num) : []), [num]);
  const steps = useMemo(() => (num >= 2 ? primeFactorizationSteps(num) : []), [num]);

  const gcdResult = useMemo(() => (gcdANum > 0 && gcdBNum > 0 ? gcd(gcdANum, gcdBNum) : 0), [gcdANum, gcdBNum]);
  const lcmResult = useMemo(() => (gcdANum > 0 && gcdBNum > 0 ? lcm(gcdANum, gcdBNum) : 0), [gcdANum, gcdBNum]);

  const isPerfectSquare = num > 0 && Math.sqrt(num) === Math.floor(Math.sqrt(num));
  const isEven = num % 2 === 0;
  const factorialVal = num <= 20 ? factorial(num) : null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "factors", label: "Factors & Prime" },
    { key: "gcdlcm", label: "GCD & LCM" },
  ];

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/factor-calculator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Factor Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Find all factors, prime factorization, GCD, LCM, and number properties with step-by-step solutions.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="flex gap-2 mb-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                  tab === t.key
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "factors" && (
            <div>
              <label className="block text-sm font-medium mb-1">Enter a Number</label>
              <input
                type="number"
                value={numInput}
                onChange={(e) => setNumInput(e.target.value)}
                className="input-field text-lg"
                placeholder="e.g. 120"
              />
            </div>
          )}

          {tab === "gcdlcm" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Number A</label>
                <input
                  type="number"
                  value={gcdA}
                  onChange={(e) => setGcdA(e.target.value)}
                  className="input-field"
                  placeholder="e.g. 24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Number B</label>
                <input
                  type="number"
                  value={gcdB}
                  onChange={(e) => setGcdB(e.target.value)}
                  className="input-field"
                  placeholder="e.g. 36"
                />
              </div>
            </div>
          )}
        </div>

        {tab === "factors" && num >= 1 && (
          <div className="mb-8">
            {/* All factors */}
            <div className="result-card mb-4">
              <p className="text-sm text-[var(--muted)] mb-2">Factors of {num.toLocaleString()} ({factors.length} total)</p>
              <div className="flex flex-wrap gap-2">
                {factors.map((f) => (
                  <span key={f} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm font-mono">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Factor pairs */}
            <div className="tool-card mb-4">
              <h3 className="text-sm font-bold mb-2">Factor Pairs</h3>
              <div className="flex flex-wrap gap-2 text-sm text-[var(--muted)]">
                {factors.filter((f) => f * f <= num).map((f) => (
                  <span key={f} className="px-2 py-1 border rounded" style={{ borderColor: "var(--card-border)" }}>
                    ({f} &times; {num / f})
                  </span>
                ))}
              </div>
            </div>

            {/* Prime factorization */}
            {primeFactors.length > 0 && (
              <div className="result-card mb-4" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-2">Prime Factorization</p>
                <p className="text-2xl font-bold text-green-700 font-mono">
                  {primeFactors
                    .map((f) => (f.power === 1 ? String(f.factor) : `${f.factor}${String.fromCharCode(8304 + f.power > 8313 ? 8304 : 8304 + f.power)}`))
                    .join(" × ")}
                </p>
                <p className="text-sm text-[var(--muted)] mt-1 font-mono">
                  {num} = {primeFactors.map((f) => (f.power === 1 ? String(f.factor) : `${f.factor}^${f.power}`)).join(" x ")}
                </p>
              </div>
            )}

            {/* Step by step factorization */}
            {steps.length > 0 && (
              <div className="tool-card mb-4">
                <h3 className="text-sm font-bold mb-2">Step-by-Step Prime Factorization</h3>
                <div className="space-y-1 text-sm text-[var(--muted)] font-mono">
                  {steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-20 text-right">
                        {i === 0 ? num : steps[i - 1].quotient}
                      </span>
                      <span className="text-[var(--primary)]">&divide; {s.divisor}</span>
                      <span>=</span>
                      <span>{s.quotient === 1 ? "1 (done)" : s.quotient}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Number properties */}
            <div className="tool-card">
              <h3 className="text-sm font-bold mb-2">Number Properties</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                <div className="p-2 border rounded" style={{ borderColor: "var(--card-border)" }}>
                  <span className="text-[var(--muted)]">Even/Odd:</span>{" "}
                  <span className="font-bold">{isEven ? "Even" : "Odd"}</span>
                </div>
                <div className="p-2 border rounded" style={{ borderColor: "var(--card-border)" }}>
                  <span className="text-[var(--muted)]">Perfect Square:</span>{" "}
                  <span className="font-bold">{isPerfectSquare ? "Yes" : "No"}</span>
                </div>
                {isPerfectSquare && (
                  <div className="p-2 border rounded" style={{ borderColor: "var(--card-border)" }}>
                    <span className="text-[var(--muted)]">Square Root:</span>{" "}
                    <span className="font-bold">{Math.sqrt(num)}</span>
                  </div>
                )}
                {factorialVal !== null && (
                  <div className="p-2 border rounded" style={{ borderColor: "var(--card-border)" }}>
                    <span className="text-[var(--muted)]">{num}!:</span>{" "}
                    <span className="font-bold">{factorialVal.toLocaleString()}</span>
                  </div>
                )}
                <div className="p-2 border rounded" style={{ borderColor: "var(--card-border)" }}>
                  <span className="text-[var(--muted)]">Divisor Count:</span>{" "}
                  <span className="font-bold">{factors.length}</span>
                </div>
                <div className="p-2 border rounded" style={{ borderColor: "var(--card-border)" }}>
                  <span className="text-[var(--muted)]">Sum of Factors:</span>{" "}
                  <span className="font-bold">{factors.reduce((a, b) => a + b, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "gcdlcm" && gcdANum > 0 && gcdBNum > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">GCD (Greatest Common Divisor)</p>
                <p className="text-3xl font-bold text-[var(--primary)]">{gcdResult.toLocaleString()}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">LCM (Least Common Multiple)</p>
                <p className="text-3xl font-bold text-green-700">{lcmResult.toLocaleString()}</p>
              </div>
            </div>

            {/* GCD Steps (Euclidean Algorithm) */}
            <div className="tool-card mb-4">
              <h3 className="text-sm font-bold mb-2">GCD via Euclidean Algorithm</h3>
              <div className="space-y-1 text-sm text-[var(--muted)] font-mono">
                {(() => {
                  const stepsArr: string[] = [];
                  let a = gcdANum;
                  let b = gcdBNum;
                  while (b !== 0) {
                    stepsArr.push(`${a} = ${Math.floor(a / b)} x ${b} + ${a % b}`);
                    [a, b] = [b, a % b];
                  }
                  stepsArr.push(`GCD = ${a}`);
                  return stepsArr.map((s, i) => <p key={i}>{s}</p>);
                })()}
              </div>
            </div>

            <div className="tool-card">
              <h3 className="text-sm font-bold mb-2">LCM Formula</h3>
              <p className="text-sm text-[var(--muted)] font-mono">
                LCM({gcdANum}, {gcdBNum}) = ({gcdANum} &times; {gcdBNum}) / GCD({gcdANum}, {gcdBNum}) = {gcdANum * gcdBNum} / {gcdResult} = {lcmResult}
              </p>
            </div>

            {/* Factors of both */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="tool-card">
                <h3 className="text-sm font-bold mb-2">Factors of {gcdANum}</h3>
                <p className="text-sm text-[var(--muted)]">{getFactors(gcdANum).join(", ")}</p>
              </div>
              <div className="tool-card">
                <h3 className="text-sm font-bold mb-2">Factors of {gcdBNum}</h3>
                <p className="text-sm text-[var(--muted)]">{getFactors(gcdBNum).join(", ")}</p>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Are Factors?</h2>
          <p>
            Factors of a number are integers that divide it evenly (with no remainder). For example, the factors of 12 are 1, 2, 3, 4, 6, and 12. Every number has at least two factors: 1 and itself.
          </p>

          <h2>Prime Factorization</h2>
          <p>
            Prime factorization expresses a number as a product of prime numbers. By the Fundamental Theorem of Arithmetic, every integer greater than 1 has a unique prime factorization. For example, 120 = 2&sup3; &times; 3 &times; 5.
          </p>

          <h3>GCD and LCM</h3>
          <p>
            The Greatest Common Divisor (GCD) of two numbers is the largest number that divides both. The Least Common Multiple (LCM) is the smallest number that both divide into. They are related by: GCD(a,b) &times; LCM(a,b) = a &times; b.
          </p>

          <h3>The Euclidean Algorithm</h3>
          <p>
            The Euclidean Algorithm finds the GCD efficiently by repeatedly dividing and taking remainders. It was described by Euclid around 300 BC and is one of the oldest algorithms still in common use.
          </p>

          <h3>Perfect Numbers and Factorial</h3>
          <p>
            A perfect number equals the sum of its proper factors (e.g., 6 = 1 + 2 + 3). The factorial of n (written n!) is the product of all positive integers up to n. These concepts are fundamental in combinatorics and number theory.
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
            name: "Factor Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/factor-calculator`,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
