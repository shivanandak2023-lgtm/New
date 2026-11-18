"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Matrix Calculator - Add, Multiply, Determinant, Inverse",
  description:
    "Free matrix calculator to add, subtract, multiply matrices. Find determinant, transpose, and inverse. Supports 2x2, 3x3, and custom size matrices.",
  keywords:
    "matrix calculator, matrix multiplication, determinant calculator, matrix inverse, matrix transpose, 2x2 matrix, 3x3 matrix, linear algebra calculator",
};

type Matrix = number[][];

function createMatrix(rows: number, cols: number, fill = 0): Matrix {
  return Array.from({ length: rows }, () => Array(cols).fill(fill));
}

function addM(a: Matrix, b: Matrix): Matrix | null {
  if (a.length !== b.length || a[0].length !== b[0].length) return null;
  return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}

function subM(a: Matrix, b: Matrix): Matrix | null {
  if (a.length !== b.length || a[0].length !== b[0].length) return null;
  return a.map((row, i) => row.map((v, j) => v - b[i][j]));
}

function mulM(a: Matrix, b: Matrix): Matrix | null {
  if (a[0].length !== b.length) return null;
  const rows = a.length;
  const cols = b[0].length;
  const k = a[0].length;
  const res = createMatrix(rows, cols);
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      for (let p = 0; p < k; p++) res[i][j] += a[i][p] * b[p][j];
  return res;
}

function transposeM(m: Matrix): Matrix {
  return m[0].map((_, j) => m.map((row) => row[j]));
}

function det(m: Matrix): number | null {
  if (m.length !== m[0].length) return null;
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  let d = 0;
  for (let j = 0; j < n; j++) {
    const sub = m.slice(1).map((row) => [...row.slice(0, j), ...row.slice(j + 1)]);
    d += (j % 2 === 0 ? 1 : -1) * m[0][j] * (det(sub) ?? 0);
  }
  return d;
}

function inverseM(m: Matrix): Matrix | null {
  if (m.length !== m[0].length) return null;
  const n = m.length;
  const d = det(m);
  if (d === null || d === 0) return null;
  if (n === 1) return [[1 / d]];
  // cofactor matrix
  const cofactor = createMatrix(n, n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const sub = m.filter((_, ri) => ri !== i).map((row) => row.filter((_, ci) => ci !== j));
      cofactor[i][j] = ((i + j) % 2 === 0 ? 1 : -1) * (det(sub) ?? 0);
    }
  }
  const adj = transposeM(cofactor);
  return adj.map((row) => row.map((v) => v / d));
}

type Op = "add" | "sub" | "mul" | "det" | "transpose" | "inverse";

export default function MatrixCalculatorPage() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [matA, setMatA] = useState<Matrix>([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
  const [matB, setMatB] = useState<Matrix>([
    [9, 8, 7],
    [6, 5, 4],
    [3, 2, 1],
  ]);
  const [op, setOp] = useState<Op>("add");
  const [error, setError] = useState("");

  const resizeMatrices = (r: number, c: number) => {
    const resize = (old: Matrix): Matrix => {
      const m = createMatrix(r, c);
      for (let i = 0; i < Math.min(r, old.length); i++)
        for (let j = 0; j < Math.min(c, old[0]?.length ?? 0); j++) m[i][j] = old[i][j];
      return m;
    };
    setMatA((prev) => resize(prev));
    setMatB((prev) => resize(prev));
    setRows(r);
    setCols(c);
  };

  const updateCell = (
    mat: Matrix,
    setMat: React.Dispatch<React.SetStateAction<Matrix>>,
    i: number,
    j: number,
    val: string
  ) => {
    const copy = mat.map((r) => [...r]);
    copy[i][j] = parseFloat(val) || 0;
    setMat(copy);
  };

  const [result, setResult] = useState<Matrix | null>(null);

  const compute = () => {
    setError("");
    setResult(null);
    let r: Matrix | null = null;
    switch (op) {
      case "add":
        r = addM(matA, matB);
        if (!r) setError("Matrices must have the same dimensions for addition.");
        break;
      case "sub":
        r = subM(matA, matB);
        if (!r) setError("Matrices must have the same dimensions for subtraction.");
        break;
      case "mul":
        r = mulM(matA, matB);
        if (!r) setError("Number of columns in A must equal number of rows in B.");
        break;
      case "det": {
        const d = det(matA);
        if (d === null) { setError("Matrix must be square for determinant."); break; }
        r = [[d]];
        break;
      }
      case "transpose":
        r = transposeM(matA);
        break;
      case "inverse":
        r = inverseM(matA);
        if (!r) setError("Matrix must be square and non-singular for inverse.");
        break;
    }
    setResult(r);
  };

  const fmt = (n: number) => {
    const r = Math.round(n * 1e6) / 1e6;
    return r === Math.round(r) ? String(Math.round(r)) : r.toFixed(4).replace(/0+$/, "");
  };

  const ops: { key: Op; label: string }[] = [
    { key: "add", label: "A + B" },
    { key: "sub", label: "A - B" },
    { key: "mul", label: "A x B" },
    { key: "det", label: "det(A)" },
    { key: "transpose", label: "A^T" },
    { key: "inverse", label: "A^(-1)" },
  ];

  const needsB = op === "add" || op === "sub" || op === "mul";

  const renderMatrixInput = (
    label: string,
    mat: Matrix,
    setMat: React.Dispatch<React.SetStateAction<Matrix>>
  ) => (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="inline-block border rounded p-2" style={{ borderColor: "var(--card-border)" }}>
        {mat.map((row, i) => (
          <div key={i} className="flex gap-1 mb-1">
            {row.map((v, j) => (
              <input
                key={j}
                type="number"
                value={v}
                onChange={(e) => updateCell(mat, setMat, i, j, e.target.value)}
                className="input-field w-16 text-center text-sm"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/matrix-calculator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Matrix Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Add, subtract, multiply matrices. Find determinant, transpose, and inverse with step-by-step results.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Matrix Size</h2>
          <div className="flex gap-4 items-center mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Rows</label>
              <select
                value={rows}
                onChange={(e) => resizeMatrices(parseInt(e.target.value), cols)}
                className="input-field"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Columns</label>
              <select
                value={cols}
                onChange={(e) => resizeMatrices(rows, parseInt(e.target.value))}
                className="input-field"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <h2 className="text-lg font-bold mb-4">Operation</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {ops.map((o) => (
              <button
                key={o.key}
                onClick={() => setOp(o.key)}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                  op === o.key
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <button onClick={compute} className="btn-primary w-full mt-4 mb-4">Calculate</button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderMatrixInput("Matrix A", matA, setMatA)}
            {needsB && renderMatrixInput("Matrix B", matB, setMatB)}
          </div>
        </div>

        {error && (
          <div className="result-card text-center mb-8">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {result && !error && (
          <div className="mb-8">
            <div className="result-card">
              <p className="text-sm text-[var(--muted)] mb-2">
                {op === "det" ? "Determinant" : "Result"}
              </p>
              {op === "det" ? (
                <p className="text-3xl font-bold text-[var(--primary)]">{fmt(result[0][0])}</p>
              ) : (
                <div className="inline-block">
                  {result.map((row, i) => (
                    <div key={i} className="flex gap-4">
                      {row.map((v, j) => (
                        <span key={j} className="w-20 text-center text-lg font-mono font-bold text-[var(--primary)]">
                          {fmt(v)}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Multiply Matrices</h2>
          <p>
            To multiply matrix A (m x n) by matrix B (n x p), compute each element of the resulting m x p matrix by taking the dot product of the corresponding row of A and column of B. The number of columns in A must equal the number of rows in B.
          </p>

          <h2>What is a Determinant?</h2>
          <p>
            The determinant is a scalar value that encodes important properties of a square matrix. For a 2x2 matrix [[a, b], [c, d]], the determinant is ad - bc. A matrix is invertible if and only if its determinant is non-zero.
          </p>

          <h3>Matrix Inverse</h3>
          <p>
            The inverse of a square matrix A is a matrix A&#8315;&sup1; such that A &times; A&#8315;&sup1; = I (identity matrix). The inverse exists only when the determinant is non-zero. It is computed using the adjugate (transpose of the cofactor matrix) divided by the determinant.
          </p>

          <h3>Transpose of a Matrix</h3>
          <p>
            The transpose of a matrix is obtained by swapping rows and columns. If A is an m x n matrix, its transpose A&#7488; is an n x m matrix where the element at position (i, j) becomes (j, i).
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
            name: "Matrix Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/matrix-calculator`,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
