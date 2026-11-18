"use client";

import { useState, useMemo, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Word Rewriter & Synonym Replacer - Paraphrase Text Online",
  description:
    "Free online word rewriter and synonym replacer. Paste your text, click on highlighted words to cycle through synonyms, and create unique paraphrased content.",
  keywords:
    "word rewriter, paraphrasing tool, text rewriter, sentence rewriter, rephrase text, synonym replacer, text spinner",
};

const SYNONYMS: Record<string, string[]> = {
  good: ["great", "excellent", "fine", "superb", "wonderful", "outstanding", "fantastic"],
  bad: ["poor", "terrible", "awful", "dreadful", "horrible", "unpleasant", "inferior"],
  big: ["large", "huge", "enormous", "massive", "vast", "immense", "substantial"],
  small: ["tiny", "little", "minute", "compact", "miniature", "modest", "slight"],
  fast: ["quick", "rapid", "swift", "speedy", "hasty", "brisk", "prompt"],
  slow: ["gradual", "unhurried", "leisurely", "sluggish", "steady", "deliberate"],
  happy: ["joyful", "cheerful", "delighted", "pleased", "content", "glad", "thrilled"],
  sad: ["unhappy", "sorrowful", "gloomy", "melancholy", "dejected", "downcast"],
  beautiful: ["gorgeous", "stunning", "lovely", "attractive", "elegant", "exquisite"],
  ugly: ["unattractive", "unsightly", "hideous", "grotesque", "plain"],
  important: ["crucial", "essential", "vital", "significant", "critical", "key"],
  easy: ["simple", "straightforward", "effortless", "uncomplicated", "basic"],
  hard: ["difficult", "challenging", "tough", "demanding", "arduous", "complex"],
  start: ["begin", "commence", "initiate", "launch", "kick off", "embark on"],
  end: ["finish", "conclude", "terminate", "complete", "wrap up", "cease"],
  make: ["create", "produce", "build", "construct", "generate", "craft", "develop"],
  use: ["utilize", "employ", "apply", "leverage", "harness", "adopt"],
  get: ["obtain", "acquire", "receive", "gain", "secure", "attain", "procure"],
  give: ["provide", "offer", "supply", "deliver", "grant", "present", "donate"],
  help: ["assist", "aid", "support", "facilitate", "enable", "contribute"],
  show: ["display", "demonstrate", "reveal", "present", "exhibit", "illustrate"],
  think: ["believe", "consider", "suppose", "assume", "reckon", "contemplate"],
  say: ["state", "declare", "mention", "express", "assert", "remark", "note"],
  tell: ["inform", "notify", "advise", "communicate", "convey", "disclose"],
  ask: ["inquire", "request", "query", "question", "seek", "solicit"],
  work: ["function", "operate", "perform", "labor", "toil", "endeavor"],
  need: ["require", "demand", "necessitate", "want", "call for"],
  try: ["attempt", "endeavor", "strive", "aim", "seek", "undertake"],
  keep: ["maintain", "retain", "preserve", "hold", "sustain", "continue"],
  change: ["modify", "alter", "adjust", "transform", "revise", "amend"],
  move: ["shift", "transfer", "relocate", "transport", "migrate", "transition"],
  grow: ["expand", "increase", "develop", "flourish", "thrive", "progress"],
  run: ["operate", "execute", "manage", "administer", "conduct"],
  look: ["appear", "seem", "glance", "observe", "examine", "inspect"],
  find: ["discover", "locate", "identify", "detect", "uncover", "determine"],
  know: ["understand", "recognize", "comprehend", "realize", "appreciate"],
  want: ["desire", "wish", "crave", "long for", "aspire", "seek"],
  also: ["additionally", "furthermore", "moreover", "besides", "likewise"],
  very: ["extremely", "highly", "remarkably", "exceptionally", "incredibly"],
  really: ["truly", "genuinely", "actually", "indeed", "certainly"],
  always: ["constantly", "perpetually", "continually", "invariably", "forever"],
  never: ["at no time", "not ever", "not once", "under no circumstances"],
  often: ["frequently", "regularly", "commonly", "routinely", "repeatedly"],
  many: ["numerous", "several", "various", "multiple", "countless", "abundant"],
  few: ["some", "several", "a handful of", "a couple of", "not many"],
  new: ["novel", "fresh", "modern", "recent", "innovative", "contemporary"],
  old: ["aged", "ancient", "vintage", "former", "previous", "outdated"],
  best: ["optimal", "finest", "top", "greatest", "premier", "superior"],
  worst: ["poorest", "lowest", "least favorable", "most inferior"],
  increase: ["boost", "enhance", "raise", "elevate", "amplify", "escalate"],
  decrease: ["reduce", "lower", "diminish", "decline", "lessen", "minimize"],
  problem: ["issue", "challenge", "concern", "difficulty", "obstacle", "dilemma"],
  answer: ["response", "reply", "solution", "resolution", "explanation"],
  area: ["region", "zone", "domain", "sector", "territory", "field"],
  group: ["team", "collection", "cluster", "assembly", "community", "unit"],
  place: ["location", "spot", "site", "position", "venue", "setting"],
  result: ["outcome", "consequence", "effect", "conclusion", "product"],
  part: ["portion", "section", "segment", "component", "element", "piece"],
  world: ["globe", "earth", "planet", "realm", "domain", "universe"],
  point: ["aspect", "detail", "matter", "topic", "factor", "feature"],
  information: ["data", "details", "facts", "intelligence", "knowledge"],
  however: ["nevertheless", "nonetheless", "yet", "still", "though", "although"],
  because: ["since", "as", "due to", "owing to", "given that"],
  therefore: ["consequently", "hence", "thus", "accordingly", "as a result"],
  about: ["regarding", "concerning", "relating to", "with respect to"],
  like: ["similar to", "resembling", "akin to", "comparable to"],
  different: ["distinct", "diverse", "varied", "unique", "dissimilar", "unlike"],
  same: ["identical", "equal", "equivalent", "matching", "uniform"],
  enough: ["sufficient", "adequate", "ample", "plenty of", "satisfactory"],
};

interface WordToken {
  original: string;
  current: string;
  hasSynonyms: boolean;
  synonymIndex: number;
  isWord: boolean;
}

export default function WordRewriterPage() {
  const [inputText, setInputText] = useState("");
  const [tokens, setTokens] = useState<WordToken[]>([]);
  const [processed, setProcessed] = useState(false);
  const [copied, setCopied] = useState(false);

  const synonymCount = useMemo(() => {
    return tokens.filter((t) => t.hasSynonyms).length;
  }, [tokens]);

  const changedCount = useMemo(() => {
    return tokens.filter((t) => t.hasSynonyms && t.current !== t.original).length;
  }, [tokens]);

  function processText() {
    if (!inputText.trim()) return;

    // Split text into word and non-word tokens to preserve formatting
    const parts = inputText.split(/(\b\w+\b)/g);
    const newTokens: WordToken[] = parts.map((part) => {
      const lower = part.toLowerCase();
      const hasSynonyms = SYNONYMS[lower] !== undefined;
      return {
        original: part,
        current: part,
        hasSynonyms,
        synonymIndex: -1, // -1 means using original
        isWord: /^\w+$/.test(part),
      };
    });

    setTokens(newTokens);
    setProcessed(true);
  }

  const cycleSynonym = useCallback((index: number) => {
    setTokens((prev) => {
      const newTokens = [...prev];
      const token = { ...newTokens[index] };
      const lower = token.original.toLowerCase();
      const synonymList = SYNONYMS[lower];
      if (!synonymList) return prev;

      token.synonymIndex++;
      if (token.synonymIndex >= synonymList.length) {
        // Back to original
        token.synonymIndex = -1;
        token.current = token.original;
      } else {
        let replacement = synonymList[token.synonymIndex];
        // Match case of original
        if (token.original[0] === token.original[0].toUpperCase()) {
          replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        if (token.original === token.original.toUpperCase()) {
          replacement = replacement.toUpperCase();
        }
        token.current = replacement;
      }

      newTokens[index] = token;
      return newTokens;
    });
  }, []);

  function replaceAll() {
    setTokens((prev) =>
      prev.map((token) => {
        const lower = token.original.toLowerCase();
        const synonymList = SYNONYMS[lower];
        if (!synonymList || synonymList.length === 0) return token;

        // Pick first synonym
        let replacement = synonymList[0];
        if (token.original[0] === token.original[0].toUpperCase()) {
          replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        if (token.original === token.original.toUpperCase()) {
          replacement = replacement.toUpperCase();
        }

        return { ...token, current: replacement, synonymIndex: 0 };
      })
    );
  }

  function resetAll() {
    setTokens((prev) =>
      prev.map((token) => ({
        ...token,
        current: token.original,
        synonymIndex: -1,
      }))
    );
  }

  function getOutputText() {
    return tokens.map((t) => t.current).join("");
  }

  function copyOutput() {
    navigator.clipboard.writeText(getOutputText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/word-rewriter`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">
            &larr; All Tools
          </a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Word Rewriter &amp; Synonym Replacer</h1>
        <p className="text-[var(--muted)] mb-8">
          Paste your text below, then click on highlighted words to cycle through synonyms and create a rewritten version.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {!processed ? (
          <div className="tool-card mb-8">
            <h2 className="font-bold text-lg mb-4">Enter Text to Rewrite</h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="input-field min-h-[200px] resize-y text-sm"
              placeholder="Paste the text you want to rewrite here..."
              rows={8}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-[var(--muted)]">
                {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words
              </span>
              <button
                onClick={processText}
                disabled={!inputText.trim()}
                className="btn-primary"
              >
                Find Synonyms
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="tool-card text-center">
                <p className="text-sm text-[var(--muted)]">Replaceable Words</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{synonymCount}</p>
              </div>
              <div className="tool-card text-center">
                <p className="text-sm text-[var(--muted)]">Words Changed</p>
                <p className="text-2xl font-bold text-green-600">{changedCount}</p>
              </div>
              <div className="tool-card text-center">
                <p className="text-sm text-[var(--muted)]">Total Words</p>
                <p className="text-2xl font-bold">{tokens.filter((t) => t.isWord).length}</p>
              </div>
            </div>

            {/* Interactive text */}
            <div className="tool-card mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Click highlighted words to replace</h2>
                <div className="flex gap-2">
                  <button onClick={replaceAll} className="btn-primary text-sm">
                    Replace All
                  </button>
                  <button onClick={resetAll} className="btn-secondary text-sm">
                    Reset All
                  </button>
                </div>
              </div>

              <div className="p-4 border border-[var(--card-border)] rounded-lg bg-white leading-relaxed text-[15px]">
                {tokens.map((token, i) => {
                  if (!token.hasSynonyms) {
                    return <span key={i}>{token.current}</span>;
                  }

                  const isChanged = token.current !== token.original;

                  return (
                    <span
                      key={i}
                      onClick={() => cycleSynonym(i)}
                      className={`cursor-pointer rounded px-0.5 transition-colors ${
                        isChanged
                          ? "bg-green-200 text-green-800 hover:bg-green-300"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }`}
                      title={`Click to cycle synonyms. Original: "${token.original}"`}
                    >
                      {token.current}
                    </span>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs text-[var(--muted)]">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded bg-yellow-100 border border-yellow-300" /> Replaceable
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded bg-green-200 border border-green-400" /> Changed
                </span>
              </div>
            </div>

            {/* Output */}
            <div className="tool-card mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-lg">Rewritten Text</h2>
                <button onClick={copyOutput} className="btn-secondary text-sm">
                  {copied ? "Copied!" : "Copy Text"}
                </button>
              </div>
              <div className="result-card">
                <p className="text-sm whitespace-pre-wrap">{getOutputText()}</p>
              </div>
            </div>

            <div className="text-center mb-8">
              <button
                onClick={() => {
                  setProcessed(false);
                  setTokens([]);
                }}
                className="btn-secondary"
              >
                Start Over with New Text
              </button>
            </div>
          </>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How the Word Rewriter Works</h2>
          <p>
            This word rewriter tool analyzes your text and identifies words that have known synonyms. Highlighted words
            can be clicked to cycle through alternative word choices, allowing you to manually control how your text is
            rewritten.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Interactive replacement:</strong> Click any highlighted word to cycle through its synonyms</li>
            <li><strong>Replace All:</strong> Automatically replace all replaceable words with their first synonym</li>
            <li><strong>Case preservation:</strong> Synonyms match the capitalization of the original word</li>
            <li><strong>Visual feedback:</strong> Yellow highlights show replaceable words, green shows changed words</li>
            <li><strong>One-click copy:</strong> Copy the rewritten text to your clipboard instantly</li>
          </ul>

          <h2>Tips for Better Rewriting</h2>
          <ul>
            <li>Read the rewritten text aloud to check if it flows naturally</li>
            <li>Not every synonym fits every context — choose replacements carefully</li>
            <li>Vary your replacements rather than changing every word</li>
            <li>Use the tool as a starting point and refine manually for best results</li>
            <li>Consider the tone and audience when selecting synonyms</li>
          </ul>

          <h2>When to Use a Word Rewriter</h2>
          <ul>
            <li>Improving writing by expanding your vocabulary</li>
            <li>Avoiding repetition in essays and articles</li>
            <li>Learning new words and their synonyms</li>
            <li>Creating variations of marketing copy</li>
            <li>Academic writing — always properly cite sources regardless of rewording</li>
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
            name: "Word Rewriter & Synonym Replacer",
            description: META.description,
            url: `${SITE_URL}/tools/word-rewriter`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
