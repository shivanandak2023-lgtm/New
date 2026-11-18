"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Text Diff Checker - Compare Text Online Free",
  description:
    "Free online text diff checker. Compare two texts side by side and see added, removed, and unchanged lines highlighted. Uses LCS algorithm.",
  keywords: "text diff, diff checker, compare text, text comparison, find differences, diff tool online",
};

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  text: string;
}

function computeDiff(a: string[], b: string[]): DiffLine[] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffLine[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.push({ type: "unchanged", text: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ type: "added", text: b[j - 1] });
      j--;
    } else {
      result.push({ type: "removed", text: a[i - 1] });
      i--;
    }
  }

  return result.reverse();
}

export default function TextDiffCheckerPage() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [compared, setCompared] = useState(false);

  function compare() {
    const linesA = textA.split("\n");
    const linesB = textB.split("\n");
    setDiff(computeDiff(linesA, linesB));
    setCompared(true);
  }

  const stats = {
    added: diff.filter((d) => d.type === "added").length,
    removed: diff.filter((d) => d.type === "removed").length,
    unchanged: diff.filter((d) => d.type === "unchanged").length,
  };

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/text-diff-checker`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/text-diff-checker`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Text Diff Checker</h1>
        <p className="text-[var(--muted)] mb-8">
          Compare two texts and see the differences highlighted line by line.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Original Text</label>
              <textarea
                value={textA}
                onChange={(e) => setTextA(e.target.value)}
                placeholder="Paste original text here..."
                rows={12}
                className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Modified Text</label>
              <textarea
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
                placeholder="Paste modified text here..."
                rows={12}
                className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>

          <button onClick={compare} className="btn-primary w-full">
            Compare Texts
          </button>
        </div>

        {compared && (
          <div className="result-card mb-8">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "#f0fdf4" }}>
                <p className="text-2xl font-bold text-green-700">+{stats.added}</p>
                <p className="text-xs text-[var(--muted)]">Added</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "#fef2f2" }}>
                <p className="text-2xl font-bold text-red-600">-{stats.removed}</p>
                <p className="text-xs text-[var(--muted)]">Removed</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "#f8fafc" }}>
                <p className="text-2xl font-bold text-gray-600">{stats.unchanged}</p>
                <p className="text-xs text-[var(--muted)]">Unchanged</p>
              </div>
            </div>

            <div className="border border-[var(--card-border)] rounded-lg overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto">
                {diff.map((line, i) => (
                  <div
                    key={i}
                    className={`px-3 py-1 text-sm font-mono border-b border-[var(--card-border)] last:border-b-0 ${
                      line.type === "added"
                        ? "bg-green-50 text-green-800"
                        : line.type === "removed"
                        ? "bg-red-50 text-red-800"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    <span className="inline-block w-6 text-xs opacity-60">
                      {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                    </span>
                    {line.text || "\u00A0"}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does the Diff Checker Work?</h2>
          <p>
            This tool uses the Longest Common Subsequence (LCS) algorithm to find the optimal
            alignment between two texts. Lines present only in the original are marked as removed
            (red), lines only in the modified text are marked as added (green), and matching lines
            are shown as unchanged (gray).
          </p>

          <h2>Common Uses for Text Comparison</h2>
          <ul>
            <li>Comparing code changes before committing</li>
            <li>Finding differences between document versions</li>
            <li>Checking for plagiarism between texts</li>
            <li>Reviewing configuration file changes</li>
            <li>Verifying data transformation results</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            All text comparison happens entirely in your browser. No text is sent to any server.
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
            name: "Text Diff Checker",
            description: META.description,
            url: `${SITE_URL}/tools/text-diff-checker`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
