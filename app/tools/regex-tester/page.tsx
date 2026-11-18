"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Regex Tester - Test Regular Expressions Online Free",
  description:
    "Free online regex tester. Test regular expressions with real-time highlighting, match groups, and common presets for email, URL, phone, IP, and date patterns.",
  keywords: "regex tester, regular expression tester, regex checker, regex online, regex match, regex pattern",
};

const PRESETS = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { label: "URL", pattern: "https?:\\/\\/[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=%]+", flags: "gi" },
  { label: "Phone (US)", pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}", flags: "g" },
  { label: "IP Address", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
  { label: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}", flags: "g" },
  { label: "Hex Color", pattern: "#[0-9a-fA-F]{3,8}\\b", flags: "gi" },
];

interface MatchInfo {
  fullMatch: string;
  index: number;
  groups: string[];
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [flagG, setFlagG] = useState(true);
  const [flagI, setFlagI] = useState(false);
  const [flagM, setFlagM] = useState(false);
  const [flagS, setFlagS] = useState(false);
  const [testStr, setTestStr] = useState("");
  const [regexError, setRegexError] = useState("");

  const flags = `${flagG ? "g" : ""}${flagI ? "i" : ""}${flagM ? "m" : ""}${flagS ? "s" : ""}`;

  const { matches, highlighted } = useMemo(() => {
    if (!pattern || !testStr) return { matches: [] as MatchInfo[], highlighted: "" };
    try {
      const re = new RegExp(pattern, flags);
      setRegexError("");
      const allMatches: MatchInfo[] = [];
      let match: RegExpExecArray | null;

      if (flagG) {
        while ((match = re.exec(testStr)) !== null) {
          allMatches.push({
            fullMatch: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (!match[0]) re.lastIndex++;
        }
      } else {
        match = re.exec(testStr);
        if (match) {
          allMatches.push({
            fullMatch: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      let html = "";
      let lastIndex = 0;
      for (const m of allMatches) {
        const before = testStr.slice(lastIndex, m.index);
        html += escapeHtml(before);
        html += `<mark style="background:#fbbf24;padding:1px 2px;border-radius:3px">${escapeHtml(m.fullMatch)}</mark>`;
        lastIndex = m.index + m.fullMatch.length;
      }
      html += escapeHtml(testStr.slice(lastIndex));

      return { matches: allMatches, highlighted: html };
    } catch (e) {
      setRegexError((e as Error).message);
      return { matches: [] as MatchInfo[], highlighted: "" };
    }
  }, [pattern, testStr, flags, flagG]);

  function escapeHtml(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function applyPreset(p: typeof PRESETS[0]) {
    setPattern(p.pattern);
    setFlagG(p.flags.includes("g"));
    setFlagI(p.flags.includes("i"));
    setFlagM(p.flags.includes("m"));
    setFlagS(p.flags.includes("s"));
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/regex-tester`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/regex-tester`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Regex Tester</h1>
        <p className="text-[var(--muted)] mb-8">
          Test regular expressions with real-time matching, highlighting, and group extraction.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <p className="text-sm font-medium mb-2">Common Presets</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="px-3 py-1 text-xs rounded-full border border-[var(--card-border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Regex Pattern</label>
            <div className="flex items-center gap-2">
              <span className="text-lg text-[var(--muted)]">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                className="flex-1 border border-[var(--card-border)] rounded-lg px-3 py-2 font-mono text-sm"
              />
              <span className="text-lg text-[var(--muted)]">/{flags}</span>
            </div>
            {regexError && <p className="text-xs text-red-600 mt-1">{regexError}</p>}
          </div>

          <div className="flex gap-4 mb-4">
            {[
              { label: "g (global)", val: flagG, set: setFlagG },
              { label: "i (case-insensitive)", val: flagI, set: setFlagI },
              { label: "m (multiline)", val: flagM, set: setFlagM },
              { label: "s (dotAll)", val: flagS, set: setFlagS },
            ].map((f) => (
              <label key={f.label} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={f.val}
                  onChange={(e) => f.set(e.target.checked)}
                  className="accent-[var(--primary)]"
                />
                <span className="text-xs">{f.label}</span>
              </label>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Test String</label>
            <textarea
              value={testStr}
              onChange={(e) => setTestStr(e.target.value)}
              placeholder="Enter text to test against..."
              rows={6}
              className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>

        {highlighted && (
          <div className="result-card mb-8">
            <p className="text-sm font-medium mb-2">
              Matches: <span className="text-[var(--primary)]">{matches.length}</span>
            </p>

            <div
              className="border border-[var(--card-border)] rounded-lg p-3 text-sm font-mono bg-white mb-4 whitespace-pre-wrap break-all"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />

            {matches.length > 0 && (
              <div className="border border-[var(--card-border)] rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 py-2 font-medium">#</th>
                      <th className="text-left px-3 py-2 font-medium">Match</th>
                      <th className="text-left px-3 py-2 font-medium">Index</th>
                      <th className="text-left px-3 py-2 font-medium">Groups</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((m, i) => (
                      <tr key={i} className="border-t border-[var(--card-border)]">
                        <td className="px-3 py-2 text-[var(--muted)]">{i + 1}</td>
                        <td className="px-3 py-2 font-mono">{m.fullMatch}</td>
                        <td className="px-3 py-2">{m.index}</td>
                        <td className="px-3 py-2 font-mono">
                          {m.groups.length > 0 ? m.groups.join(", ") : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Use the Regex Tester</h2>
          <p>
            Enter a regular expression pattern and test string. Matches are highlighted in
            real-time. Toggle flags to control matching behavior. Use capture groups with
            parentheses to extract specific parts of matches.
          </p>

          <h2>Regex Flags Explained</h2>
          <ul>
            <li><strong>g (global)</strong> — Find all matches, not just the first</li>
            <li><strong>i (case-insensitive)</strong> — Ignore letter casing</li>
            <li><strong>m (multiline)</strong> — ^ and $ match start/end of each line</li>
            <li><strong>s (dotAll)</strong> — Dot (.) matches newlines too</li>
          </ul>

          <h2>Common Regex Patterns</h2>
          <ul>
            <li>Email: <code>[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]&#123;2,&#125;</code></li>
            <li>URL: <code>https?:\/\/[\w\-._~:/?#\[\]@!$&apos;()*+,;=%]+</code></li>
            <li>Phone: <code>\(?\d&#123;3&#125;\)?[-.\s]?\d&#123;3&#125;[-.\s]?\d&#123;4&#125;</code></li>
          </ul>

          <h2>Privacy</h2>
          <p>
            All regex testing happens in your browser. No data is sent to any server.
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
            name: "Regex Tester",
            description: META.description,
            url: `${SITE_URL}/tools/regex-tester`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
