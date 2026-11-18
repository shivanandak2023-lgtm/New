"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Fraction Calculator - Add, Subtract, Multiply, Divide Fractions",
  description:
    "Free fraction calculator to add, subtract, multiply, and divide fractions. Simplify fractions to lowest terms and convert to decimal or mixed number.",
  keywords:
    "fraction calculator, add fractions, subtract fractions, multiply fractions, divide fractions, simplify fractions, mixed number calculator, fraction to decimal",
};

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function simplify(num: number, den: number): [number, number] {
  if (den === 0) return [num, den];
  const g = gcd(num, den);
  let sn = num / g;
  let sd = den / g;
  if (sd < 0) {
    sn = -sn;
    sd = -sd;
  }
  return [sn, sd];
}

function toMixed(num: number, den: number): string {
  if (den === 0) return "undefined";
  const [sn, sd] = simplify(num, den);
  if (sd === 1) return `${sn}`;
  const whole = Math.trunc(sn / sd);
  const remainder = Math.abs(sn % sd);
  if (whole === 0) return `${sn}/${sd}`;
  return `${whole} ${remainder}/${sd}`;
}

type Op = "add" | "sub" | "mul" | "div";

export default function FractionCalculatorPage() {
  const [n1, setN1] = useState("1");
  const [d1, setD1] = useState("2");
  const [n2, setN2] = useState("1");
  const [d2, setD2] = useState("3");
  const [op, setOp] = useState<Op>("add");

  const num1 = parseInt(n1) || 0;
  const den1 = parseInt(d1) || 0;
  const num2 = parseInt(n2) || 0;
  const den2 = parseInt(d2) || 0;

  let resNum = 0;
  let resDen = 0;
  let valid = den1 !== 0 && den2 !== 0;

  if (valid) {
    switch (op) {
      case "add":
        resNum = num1 * den2 + num2 * den1;
        resDen = den1 * den2;
        break;
      case "sub":
        resNum = num1 * den2 - num2 * den1;
        resDen = den1 * den2;
        break;
      case "mul":
        resNum = num1 * num2;
        resDen = den1 * den2;
        break;
      case "div":
        if (num2 === 0) {
          valid = false;
        } else {
          resNum = num1 * den2;
          resDen = den1 * num2;
        }
        break;
    }
  }

  const [simpNum, simpDen] = valid ? simplify(resNum, resDen) : [0, 0];
  const decimal = valid && resDen !== 0 ? resNum / resDen : 0;
  const mixed = valid ? toMixed(resNum, resDen) : "";

  const opLabels: Record<Op, string> = { add: "+", sub: "\u2212", mul: "\u00d7", div: "\u00f7" };
  const ops: Op[] = ["add", "sub", "mul", "div"];

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/fraction-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/fraction-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Fraction Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Add, subtract, multiply, or divide two fractions. Results are simplified to lowest terms and shown as a fraction, decimal, and mixed number.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
            {/* Fraction 1 */}
            <div>
              <label className="block text-sm font-medium mb-1">Fraction 1</label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={n1}
                    onChange={(e) => setN1(e.target.value)}
                    className="input-field text-center"
                    placeholder="Numerator"
                  />
                  <div className="border-t-2 border-[var(--foreground)] my-1"></div>
                  <input
                    type="number"
                    value={d1}
                    onChange={(e) => setD1(e.target.value)}
                    className="input-field text-center"
                    placeholder="Denominator"
                  />
                </div>
              </div>
            </div>

            {/* Operator */}
            <div className="flex flex-wrap justify-center gap-2">
              {ops.map((o) => (
                <button
                  key={o}
                  onClick={() => setOp(o)}
                  className={`w-12 h-12 rounded-lg border text-xl font-bold transition-colors ${
                    op === o
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {opLabels[o]}
                </button>
              ))}
            </div>

            {/* Fraction 2 */}
            <div>
              <label className="block text-sm font-medium mb-1">Fraction 2</label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={n2}
                    onChange={(e) => setN2(e.target.value)}
                    className="input-field text-center"
                    placeholder="Numerator"
                  />
                  <div className="border-t-2 border-[var(--foreground)] my-1"></div>
                  <input
                    type="number"
                    value={d2}
                    onChange={(e) => setD2(e.target.value)}
                    className="input-field text-center"
                    placeholder="Denominator"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {valid && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Simplified Fraction</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{simpNum}/{simpDen}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Decimal</p>
                <p className="text-2xl font-bold text-green-700">{decimal.toFixed(6).replace(/0+$/, "").replace(/\.$/, "")}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Mixed Number</p>
                <p className="text-2xl font-bold text-amber-700">{mixed}</p>
              </div>
            </div>

            <div className="tool-card">
              <h2 className="text-lg font-bold mb-4">Step-by-Step</h2>
              <p className="text-sm text-[var(--muted)]">
                {num1}/{den1} {opLabels[op]} {num2}/{den2} = {resNum}/{resDen}
                {(resNum !== simpNum || resDen !== simpDen) && (
                  <> = {simpNum}/{simpDen} (simplified using GCD of {gcd(Math.abs(resNum), Math.abs(resDen))})</>
                )}
              </p>
            </div>
          </div>
        )}

        {!valid && (den1 === 0 || den2 === 0) && (
          <div className="result-card text-center mb-8">
            <p className="text-red-600 font-semibold">Denominator cannot be zero.</p>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Add Fractions</h2>
          <p>
            To add fractions with different denominators, find a common denominator by multiplying the two denominators together. Then adjust each numerator accordingly and add them. Finally, simplify the result by dividing both the numerator and denominator by their greatest common divisor (GCD).
          </p>
          <p>
            For example: 1/2 + 1/3 = 3/6 + 2/6 = 5/6
          </p>

          <h2>How to Multiply Fractions</h2>
          <p>
            Multiplying fractions is straightforward: multiply the numerators together and the denominators together. Then simplify the resulting fraction if possible.
          </p>
          <p>
            For example: 2/3 x 3/4 = 6/12 = 1/2
          </p>

          <h2>How to Divide Fractions</h2>
          <p>
            To divide fractions, multiply the first fraction by the reciprocal (flip) of the second fraction. For example, (1/2) / (3/4) = (1/2) x (4/3) = 4/6 = 2/3.
          </p>

          <h3>Converting to Mixed Numbers</h3>
          <p>
            A mixed number has a whole number part and a fractional part. To convert an improper fraction like 7/3 to a mixed number, divide 7 by 3 to get 2 with a remainder of 1, giving 2 1/3.
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
            name: "Fraction Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/fraction-calculator`,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
