"use client";

import { useState, useMemo, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Grammar Checker - Check Grammar & Spelling Online",
  description:
    "Free online Grammar Checker tool. Detect common grammar mistakes, spelling issues, and style errors. Client-side — your text never leaves your browser.",
  keywords: "grammar checker, grammar check, spelling checker, grammar corrector, proofreader, writing checker",
};

interface GrammarError {
  start: number;
  end: number;
  message: string;
  suggestion: string;
  type: "grammar" | "style" | "spelling";
}

const CONFUSED_WORDS: { wrong: RegExp; message: string; suggestion: string }[] = [
  { wrong: /\btheir\s+(is|was|are|were|has|have|will|would|can|could|should|might)\b/gi, message: "\"their\" is possessive. Did you mean \"there\"?", suggestion: "there" },
  { wrong: /\bthere\s+(car|house|book|dog|cat|name|friend|mother|father|brother|sister|family|phone|bag|work)\b/gi, message: "\"there\" indicates a place. Did you mean \"their\"?", suggestion: "their" },
  { wrong: /\bthey're\s+(car|house|book|dog|cat|name|friend|phone|bag|work)\b/gi, message: "\"they're\" means \"they are\". Did you mean \"their\"?", suggestion: "their" },
  { wrong: /\byour\s+(welcome|right|wrong|correct|going|coming|doing|making|being|getting|running|looking)\b/gi, message: "\"your\" is possessive. Did you mean \"you're\" (you are)?", suggestion: "you're" },
  { wrong: /\byou're\s+(car|house|book|dog|cat|name|friend|mother|father|phone|bag|work|email)\b/gi, message: "\"you're\" means \"you are\". Did you mean \"your\"?", suggestion: "your" },
  { wrong: /\bits\s+(a\s+)?(going|been|not|the|very|quite|already|always|never)\b/gi, message: "\"its\" is possessive. Did you mean \"it's\" (it is)?", suggestion: "it's" },
  { wrong: /\bit's\s+(own|color|colour|size|shape|name|purpose|function|role|value|effect)\b/gi, message: "\"it's\" means \"it is\". Did you mean \"its\" (possessive)?", suggestion: "its" },
  { wrong: /\baffect\s+(is|was|has|had|will|would|can|could)\b/gi, message: "\"affect\" is a verb. Did you mean \"effect\" (noun)?", suggestion: "effect" },
  { wrong: /\b(the|an?|this|that|no|positive|negative|side)\s+affect\b/gi, message: "\"affect\" is usually a verb. Did you mean \"effect\" (noun)?", suggestion: "effect" },
  { wrong: /\beffect\s+(the|a|an|change|how|your|my|our|their|his|her|it)\b/gi, message: "\"effect\" is usually a noun. Did you mean \"affect\" (verb)?", suggestion: "affect" },
  { wrong: /\bthen\s+(I|you|he|she|we|they|it)\b/gi, message: "Did you mean \"than\" (comparison) instead of \"then\" (time)?", suggestion: "than" },
  { wrong: /\b(more|less|greater|better|worse|faster|slower|bigger|smaller|larger|higher|lower)\s+then\b/gi, message: "Use \"than\" for comparisons, not \"then\".", suggestion: "than" },
  { wrong: /\b(to)\s+(much|many|soon|late|early|often|little|few|long|short|big|small|fast|slow|hard|easy)\b/gi, message: "Did you mean \"too\" (excessively) instead of \"to\"?", suggestion: "too" },
  { wrong: /\bme\s+(to|two)\b/gi, message: "Did you mean \"too\" (also)?", suggestion: "too" },
];

function checkGrammar(text: string): GrammarError[] {
  const errors: GrammarError[] = [];
  if (!text.trim()) return errors;

  // Double spaces
  let match: RegExpExecArray | null;
  const doubleSpace = /  +/g;
  while ((match = doubleSpace.exec(text)) !== null) {
    errors.push({
      start: match.index,
      end: match.index + match[0].length,
      message: "Multiple consecutive spaces detected.",
      suggestion: " ",
      type: "style",
    });
  }

  // Missing capitalization after period
  const missingCap = /[.!?]\s+[a-z]/g;
  while ((match = missingCap.exec(text)) !== null) {
    const charIndex = match.index + match[0].length - 1;
    errors.push({
      start: charIndex,
      end: charIndex + 1,
      message: "Sentence should start with a capital letter.",
      suggestion: text[charIndex].toUpperCase(),
      type: "grammar",
    });
  }

  // First character not capitalized
  const firstNonSpace = text.search(/\S/);
  if (firstNonSpace >= 0 && /[a-z]/.test(text[firstNonSpace])) {
    errors.push({
      start: firstNonSpace,
      end: firstNonSpace + 1,
      message: "Text should start with a capital letter.",
      suggestion: text[firstNonSpace].toUpperCase(),
      type: "grammar",
    });
  }

  // Repeated words
  const repeated = /\b(\w+)\s+\1\b/gi;
  while ((match = repeated.exec(text)) !== null) {
    errors.push({
      start: match.index,
      end: match.index + match[0].length,
      message: `Repeated word: "${match[1]}".`,
      suggestion: match[1],
      type: "grammar",
    });
  }

  // Confused words
  for (const rule of CONFUSED_WORDS) {
    const regex = new RegExp(rule.wrong.source, rule.wrong.flags);
    while ((match = regex.exec(text)) !== null) {
      errors.push({
        start: match.index,
        end: match.index + match[0].length,
        message: rule.message,
        suggestion: rule.suggestion,
        type: "spelling",
      });
    }
  }

  // Missing period at end
  const trimmed = text.trimEnd();
  if (trimmed.length > 0 && !/[.!?]$/.test(trimmed)) {
    errors.push({
      start: trimmed.length,
      end: trimmed.length,
      message: "Text does not end with a period or punctuation mark.",
      suggestion: ".",
      type: "style",
    });
  }

  // Sort by position and deduplicate overlaps
  errors.sort((a, b) => a.start - b.start);
  return errors;
}

export default function GrammarCheckerPage() {
  const [text, setText] = useState("");
  const [selectedError, setSelectedError] = useState<GrammarError | null>(null);
  const [checked, setChecked] = useState(false);

  const errors = useMemo(() => {
    if (!checked) return [];
    return checkGrammar(text);
  }, [text, checked]);

  const handleCheck = () => {
    setChecked(true);
    setSelectedError(null);
  };

  const handleTextChange = (val: string) => {
    setText(val);
    setChecked(false);
    setSelectedError(null);
  };

  const highlightedHtml = useCallback(() => {
    if (!checked || errors.length === 0) return null;
    const parts: string[] = [];
    let lastIndex = 0;
    for (const err of errors) {
      if (err.start > lastIndex) {
        parts.push(escapeHtml(text.slice(lastIndex, err.start)));
      }
      if (err.start < err.end) {
        const color = err.type === "grammar" ? "#ef4444" : err.type === "spelling" ? "#f59e0b" : "#3b82f6";
        parts.push(
          `<span style="text-decoration: wavy underline ${color}; text-decoration-skip-ink: none; cursor: pointer;" data-idx="${errors.indexOf(err)}">${escapeHtml(text.slice(err.start, err.end))}</span>`
        );
      }
      lastIndex = Math.max(lastIndex, err.end);
    }
    if (lastIndex < text.length) {
      parts.push(escapeHtml(text.slice(lastIndex)));
    }
    return parts.join("");
  }, [text, errors, checked]);

  const handleHighlightClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const idx = target.getAttribute("data-idx");
    if (idx !== null) {
      setSelectedError(errors[Number(idx)]);
    }
  };

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/grammar-checker`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/grammar-checker`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Grammar Checker</h1>
        <p className="text-[var(--muted)] mb-8">
          Detect common grammar mistakes, double spaces, missing capitalization, confused words, and repeated words.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <label className="block text-sm font-semibold mb-2">Enter your text</label>
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="input-field min-h-[200px] resize-y text-sm"
            placeholder="Type or paste your text here to check for grammar issues..."
          />
          <div className="flex gap-3 mt-4">
            <button onClick={handleCheck} disabled={!text.trim()} className="btn-primary">
              Check Grammar
            </button>
            {text && (
              <button onClick={() => handleTextChange("")} className="btn-secondary text-sm">
                Clear
              </button>
            )}
          </div>
        </div>

        {checked && (
          <div className="result-card mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="tool-card text-center py-3 flex-1">
                <p className="text-2xl font-bold text-[var(--primary)]">{errors.length}</p>
                <p className="text-xs text-[var(--muted)] mt-1">Issues Found</p>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1"><span style={{ color: "#ef4444" }}>&#9679;</span> Grammar</span>
                <span className="flex items-center gap-1"><span style={{ color: "#f59e0b" }}>&#9679;</span> Spelling</span>
                <span className="flex items-center gap-1"><span style={{ color: "#3b82f6" }}>&#9679;</span> Style</span>
              </div>
            </div>

            {errors.length > 0 && highlightedHtml() ? (
              <div
                className="p-4 rounded-lg border text-sm leading-relaxed whitespace-pre-wrap"
                style={{ background: "var(--bg-secondary, #f9fafb)" }}
                onClick={handleHighlightClick}
                dangerouslySetInnerHTML={{ __html: highlightedHtml()! }}
              />
            ) : errors.length === 0 ? (
              <p className="text-sm text-green-600 font-medium">No issues found. Your text looks good!</p>
            ) : null}

            {selectedError && (
              <div className="mt-4 p-4 rounded-lg border border-amber-200 bg-amber-50">
                <p className="text-sm font-semibold text-amber-800 mb-1">{selectedError.message}</p>
                <p className="text-xs text-amber-600">Suggestion: <strong>{selectedError.suggestion}</strong></p>
              </div>
            )}

            {errors.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-sm mb-2">All Issues:</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {errors.map((err, i) => (
                    <div
                      key={i}
                      className="p-3 rounded border text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedError(err)}
                    >
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${err.type === "grammar" ? "bg-red-500" : err.type === "spelling" ? "bg-amber-500" : "bg-blue-500"}`} />
                      {err.message}
                      {err.suggestion && <span className="ml-2 text-[var(--muted)]">→ {err.suggestion}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is a Grammar Checker?</h2>
          <p>
            A Grammar Checker analyzes your text for common writing errors. This tool uses client-side rule-based
            checking to detect grammar mistakes, style issues, and commonly confused words without sending your
            text to any server.
          </p>

          <h2>What Does It Check?</h2>
          <ul>
            <li><strong>Double Spaces:</strong> Finds multiple consecutive spaces</li>
            <li><strong>Capitalization:</strong> Detects missing capital letters after periods and at the start of text</li>
            <li><strong>Confused Words:</strong> Catches their/there/they&apos;re, your/you&apos;re, its/it&apos;s, affect/effect, then/than, to/too</li>
            <li><strong>Repeated Words:</strong> Finds duplicated words like &quot;the the&quot;</li>
            <li><strong>Missing Punctuation:</strong> Flags text that doesn&apos;t end with a period</li>
          </ul>

          <h2>Who Uses Grammar Checkers?</h2>
          <ul>
            <li><strong>Students:</strong> Proofread essays and assignments before submission</li>
            <li><strong>Professionals:</strong> Polish emails and reports</li>
            <li><strong>Bloggers:</strong> Ensure published content is error-free</li>
            <li><strong>ESL Learners:</strong> Improve English writing skills</li>
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
            name: "Grammar Checker",
            description: META.description,
            url: `${SITE_URL}/tools/grammar-checker`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
