"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Quadratic Equation Solver - Find Roots, Graph Parabola",
  description:
    "Free quadratic equation solver. Enter a, b, c coefficients to find real or complex roots, discriminant, vertex, axis of symmetry, and graph the parabola.",
  keywords:
    "quadratic equation solver, quadratic formula, find roots, discriminant calculator, parabola graph, ax2+bx+c, complex roots, vertex calculator",
};

export default function QuadraticSolverPage() {
  const [aStr, setAStr] = useState("1");
  const [bStr, setBStr] = useState("-5");
  const [cStr, setCStr] = useState("6");

  const a = parseFloat(aStr) || 0;
  const b = parseFloat(bStr) || 0;
  const c = parseFloat(cStr) || 0;

  const valid = a !== 0;
  const discriminant = b * b - 4 * a * c;
  const vertexX = valid ? -b / (2 * a) : 0;
  const vertexY = valid ? a * vertexX * vertexX + b * vertexX + c : 0;

  const roots = useMemo(() => {
    if (!valid) return null;
    if (discriminant > 0) {
      const sqrtD = Math.sqrt(discriminant);
      return {
        type: "real" as const,
        r1: (-b + sqrtD) / (2 * a),
        r2: (-b - sqrtD) / (2 * a),
      };
    } else if (discriminant === 0) {
      return { type: "repeated" as const, r1: -b / (2 * a) };
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-discriminant) / (2 * a);
      return { type: "complex" as const, real: realPart, imag: Math.abs(imagPart) };
    }
  }, [a, b, c, valid, discriminant]);

  const fmt = (n: number) => {
    const r = Math.round(n * 1e6) / 1e6;
    return r === Math.round(r) ? String(Math.round(r)) : r.toFixed(4).replace(/0+$/, "");
  };

  // SVG graph
  const svgW = 400;
  const svgH = 300;
  const graphPoints = useMemo(() => {
    if (!valid) return "";
    const xMin = vertexX - 5;
    const xMax = vertexX + 5;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = xMin + (xMax - xMin) * (i / 100);
      const y = a * x * x + b * x + c;
      pts.push({ x, y });
    }
    const yVals = pts.map((p) => p.y);
    const yMin = Math.min(...yVals, 0) - 1;
    const yMax = Math.max(...yVals, 0) + 1;
    const toSvgX = (x: number) => ((x - xMin) / (xMax - xMin)) * svgW;
    const toSvgY = (y: number) => svgH - ((y - yMin) / (yMax - yMin)) * svgH;
    return pts.map((p) => `${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`).join(" ");
  }, [a, b, c, valid, vertexX]);

  // axis lines for SVG
  const svgAxis = useMemo(() => {
    if (!valid) return { xAxisY: 0, yAxisX: 0, show: false };
    const xMin = vertexX - 5;
    const xMax = vertexX + 5;
    const pts: number[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = xMin + (xMax - xMin) * (i / 100);
      pts.push(a * x * x + b * x + c);
    }
    const yMin = Math.min(...pts, 0) - 1;
    const yMax = Math.max(...pts, 0) + 1;
    const toSvgX = (x: number) => ((x - xMin) / (xMax - xMin)) * svgW;
    const toSvgY = (y: number) => svgH - ((y - yMin) / (yMax - yMin)) * svgH;
    return { xAxisY: toSvgY(0), yAxisX: toSvgX(0), show: true };
  }, [a, b, c, valid, vertexX]);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/quadratic-solver`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Quadratic Equation Solver</h1>
        <p className="text-[var(--muted)] mb-8">
          Solve ax&sup2; + bx + c = 0. Find roots (real or complex), discriminant, vertex, axis of symmetry, and see the parabola graph.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Enter Coefficients</h2>
          <p className="text-sm text-[var(--muted)] mb-4">ax&sup2; + bx + c = 0</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">a</label>
              <input type="number" value={aStr} onChange={(e) => setAStr(e.target.value)} className="input-field" placeholder="a" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">b</label>
              <input type="number" value={bStr} onChange={(e) => setBStr(e.target.value)} className="input-field" placeholder="b" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">c</label>
              <input type="number" value={cStr} onChange={(e) => setCStr(e.target.value)} className="input-field" placeholder="c" />
            </div>
          </div>
          {!valid && aStr !== "" && <p className="text-red-600 text-sm mt-2">Coefficient &apos;a&apos; cannot be zero for a quadratic equation.</p>}
        </div>

        {valid && roots && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Discriminant (b&sup2; - 4ac)</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(discriminant)}</p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {discriminant > 0 ? "Two distinct real roots" : discriminant === 0 ? "One repeated real root" : "Two complex conjugate roots"}
                </p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Roots</p>
                {roots.type === "real" && (
                  <p className="text-2xl font-bold text-green-700">
                    x = {fmt(roots.r1)}, x = {fmt(roots.r2)}
                  </p>
                )}
                {roots.type === "repeated" && (
                  <p className="text-2xl font-bold text-green-700">x = {fmt(roots.r1)} (repeated)</p>
                )}
                {roots.type === "complex" && (
                  <p className="text-2xl font-bold text-green-700">
                    {fmt(roots.real)} &plusmn; {fmt(roots.imag)}i
                  </p>
                )}
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Vertex</p>
                <p className="text-2xl font-bold text-amber-700">({fmt(vertexX)}, {fmt(vertexY)})</p>
              </div>
              <div className="result-card text-center" style={{ background: "#faf5ff", borderColor: "#e9d5ff" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Axis of Symmetry</p>
                <p className="text-2xl font-bold text-purple-700">x = {fmt(vertexX)}</p>
              </div>
            </div>

            {/* Step by step */}
            <div className="tool-card mb-8">
              <h2 className="text-lg font-bold mb-4">Step-by-Step Solution</h2>
              <div className="space-y-2 text-sm text-[var(--muted)]">
                <p><strong>1.</strong> Equation: {fmt(a)}x&sup2; + ({fmt(b)})x + ({fmt(c)}) = 0</p>
                <p><strong>2.</strong> Discriminant: D = b&sup2; - 4ac = ({fmt(b)})&sup2; - 4({fmt(a)})({fmt(c)}) = {fmt(discriminant)}</p>
                {roots.type === "real" && (
                  <>
                    <p><strong>3.</strong> Since D &gt; 0, two real roots exist.</p>
                    <p><strong>4.</strong> x = (-b &plusmn; &radic;D) / 2a</p>
                    <p className="ml-4">x&#8321; = ({fmt(-b)} + {fmt(Math.sqrt(discriminant))}) / {fmt(2 * a)} = {fmt(roots.r1)}</p>
                    <p className="ml-4">x&#8322; = ({fmt(-b)} - {fmt(Math.sqrt(discriminant))}) / {fmt(2 * a)} = {fmt(roots.r2)}</p>
                  </>
                )}
                {roots.type === "repeated" && (
                  <>
                    <p><strong>3.</strong> Since D = 0, one repeated root exists.</p>
                    <p><strong>4.</strong> x = -b / 2a = {fmt(-b)} / {fmt(2 * a)} = {fmt(roots.r1)}</p>
                  </>
                )}
                {roots.type === "complex" && (
                  <>
                    <p><strong>3.</strong> Since D &lt; 0, two complex conjugate roots exist.</p>
                    <p><strong>4.</strong> x = (-b &plusmn; i&radic;|D|) / 2a</p>
                    <p className="ml-4">x = {fmt(roots.real)} &plusmn; {fmt(roots.imag)}i</p>
                  </>
                )}
                <p><strong>5.</strong> Vertex: ({fmt(vertexX)}, {fmt(vertexY)})</p>
                <p><strong>6.</strong> Axis of symmetry: x = {fmt(vertexX)}</p>
              </div>
            </div>

            {/* SVG Graph */}
            <div className="tool-card mb-8">
              <h2 className="text-lg font-bold mb-4">Parabola Graph</h2>
              <div className="flex justify-center overflow-x-auto">
                <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} className="border rounded bg-white">
                  {svgAxis.show && (
                    <>
                      <line x1="0" y1={svgAxis.xAxisY} x2={svgW} y2={svgAxis.xAxisY} stroke="#ccc" strokeWidth="1" />
                      <line x1={svgAxis.yAxisX} y1="0" x2={svgAxis.yAxisX} y2={svgH} stroke="#ccc" strokeWidth="1" />
                    </>
                  )}
                  <polyline points={graphPoints} fill="none" stroke="var(--primary, #2563eb)" strokeWidth="2" />
                </svg>
              </div>
              <p className="text-xs text-[var(--muted)] text-center mt-2">Graph of y = {fmt(a)}x&sup2; + ({fmt(b)})x + ({fmt(c)})</p>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is a Quadratic Equation?</h2>
          <p>
            A quadratic equation is a second-degree polynomial equation of the form ax&sup2; + bx + c = 0, where a, b, and c are constants and a &ne; 0. Quadratic equations appear frequently in physics, engineering, economics, and many areas of mathematics.
          </p>

          <h2>The Quadratic Formula</h2>
          <p>
            The quadratic formula x = (-b &plusmn; &radic;(b&sup2; - 4ac)) / 2a gives the solutions (roots) of any quadratic equation. The expression under the square root, b&sup2; - 4ac, is called the discriminant and determines the nature of the roots.
          </p>

          <h3>Understanding the Discriminant</h3>
          <p>
            If the discriminant is positive, the equation has two distinct real roots. If it equals zero, there is exactly one repeated real root. If negative, the equation has two complex conjugate roots.
          </p>

          <h3>Vertex Form</h3>
          <p>
            Every parabola has a vertex at the point (-b/2a, f(-b/2a)). The vertex represents the minimum value of the function when a &gt; 0 (parabola opens upward) or the maximum when a &lt; 0 (parabola opens downward). The line x = -b/2a is the axis of symmetry.
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
            name: "Quadratic Equation Solver",
            description: META.description,
            url: `${SITE_URL}/tools/quadratic-solver`,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
