"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Text Summarizer - Summarize Text Online Free",
  description:
    "Free online Text Summarizer tool. Extract key sentences from any text using client-side extractive summarization. No data sent to servers.",
  keywords: "text summarizer, summarize text, extractive summarization, text summary tool, auto summarizer, online summarizer",
};

function splitSentences(text: string): string[] {
  const raw = text.match(/[^.!?]*[.!?]+[\s]*/g);
  if (!raw) return text.trim() ? [text.trim()] : [];
  return raw.map((s) => s.trim()).filter((s) => s.length > 0);
}

function scoreSentences(sentences: string[]): { sentence: string; score: number }[] {
  const wordFreq: Record<string, number> = {};
  const allWords = sentences.join(" ").toLowerCase().split(/\s+/).filter(Boolean);
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "shall",
    "should", "may", "might", "must", "can", "could", "of", "in", "to",
    "for", "with", "on", "at", "from", "by", "as", "into", "through",
    "during", "before", "after", "and", "but", "or", "nor", "not", "so",
    "yet", "both", "either", "neither", "each", "every", "all", "any",
    "few", "more", "most", "other", "some", "such", "no", "only", "own",
    "same", "than", "too", "very", "just", "because", "if", "when", "while",
    "it", "its", "this", "that", "these", "those", "i", "me", "my", "we",
    "our", "you", "your", "he", "him", "his", "she", "her", "they", "them",
    "their", "what", "which", "who", "whom", "how", "where", "there",
  ]);

  for (const w of allWords) {
    const clean = w.replace(/[^a-z]/g, "");
    if (clean.length > 2 && !stopWords.has(clean)) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  }

  const maxFreq = Math.max(...Object.values(wordFreq), 1);

  return sentences.map((sentence, index) => {
    const words = sentence.toLowerCase().split(/\s+/).filter(Boolean);
    let freqScore = 0;
    for (const w of words) {
      const clean = w.replace(/[^a-z]/g, "");
      if (wordFreq[clean]) {
        freqScore += wordFreq[clean] / maxFreq;
      }
    }
    freqScore = words.length > 0 ? freqScore / words.length : 0;

    const positionScore = index < sentences.length * 0.3 ? 0.3 : index > sentences.length * 0.8 ? 0.15 : 0.05;

    const lengthScore = words.length >= 8 && words.length <= 35 ? 0.2 : 0.05;

    return { sentence, score: freqScore + positionScore + lengthScore };
  });
}

export default function TextSummarizerPage() {
  const [text, setText] = useState("");
  const [numSentences, setNumSentences] = useState(3);
  const [showSummary, setShowSummary] = useState(false);

  const summary = useMemo(() => {
    if (!showSummary || !text.trim()) return { sentences: [], originalWords: 0, summaryWords: 0 };

    const sentences = splitSentences(text);
    if (sentences.length === 0) return { sentences: [], originalWords: 0, summaryWords: 0 };

    const scored = scoreSentences(sentences);
    const topN = Math.min(numSentences, scored.length);
    const sorted = [...scored].sort((a, b) => b.score - a.score).slice(0, topN);
    const ordered = sorted.sort(
      (a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence)
    );

    const originalWords = text.trim().split(/\s+/).filter(Boolean).length;
    const summaryText = ordered.map((s) => s.sentence).join(" ");
    const summaryWords = summaryText.trim().split(/\s+/).filter(Boolean).length;

    return { sentences: ordered.map((s) => s.sentence), originalWords, summaryWords };
  }, [text, numSentences, showSummary]);

  const handleSummarize = () => {
    setShowSummary(true);
  };

  const handleTextChange = (val: string) => {
    setText(val);
    setShowSummary(false);
  };

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/text-summarizer`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Text Summarizer</h1>
        <p className="text-[var(--muted)] mb-8">
          Extract the most important sentences from your text using client-side extractive summarization.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <label className="block text-sm font-semibold mb-2">Paste your text</label>
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="input-field min-h-[200px] resize-y font-mono text-sm"
            placeholder="Paste a paragraph or article here to summarize..."
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sentences:</label>
              <input
                type="range"
                min={1}
                max={5}
                value={numSentences}
                onChange={(e) => { setNumSentences(Number(e.target.value)); setShowSummary(false); }}
                className="w-32"
              />
              <span className="text-sm font-bold text-[var(--primary)]">{numSentences}</span>
            </div>
            <button
              onClick={handleSummarize}
              disabled={!text.trim()}
              className="btn-primary"
            >
              Summarize
            </button>
            {text && (
              <button onClick={() => { setText(""); setShowSummary(false); }} className="btn-secondary text-sm">
                Clear
              </button>
            )}
          </div>
        </div>

        {showSummary && summary.sentences.length > 0 && (
          <div className="result-card mb-6">
            <div className="flex gap-4 mb-4">
              <div className="tool-card text-center py-3 flex-1">
                <p className="text-2xl font-bold text-[var(--primary)]">{summary.originalWords}</p>
                <p className="text-xs text-[var(--muted)] mt-1">Original Words</p>
              </div>
              <div className="tool-card text-center py-3 flex-1">
                <p className="text-2xl font-bold text-[var(--primary)]">{summary.summaryWords}</p>
                <p className="text-xs text-[var(--muted)] mt-1">Summary Words</p>
              </div>
              <div className="tool-card text-center py-3 flex-1">
                <p className="text-2xl font-bold text-[var(--primary)]">
                  {summary.originalWords > 0
                    ? Math.round((1 - summary.summaryWords / summary.originalWords) * 100)
                    : 0}%
                </p>
                <p className="text-xs text-[var(--muted)] mt-1">Reduced</p>
              </div>
            </div>
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-sm leading-relaxed">{summary.sentences.join(" ")}</p>
          </div>
        )}

        {showSummary && summary.sentences.length === 0 && text.trim() && (
          <div className="result-card mb-6">
            <p className="text-sm text-[var(--muted)]">Could not extract sentences. Try adding more text with proper punctuation.</p>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is a Text Summarizer?</h2>
          <p>
            A Text Summarizer condenses long content into shorter versions by extracting the most important sentences.
            This tool uses extractive summarization, which scores sentences by word frequency, position, and length
            to identify the key points.
          </p>

          <h2>How Does It Work?</h2>
          <ul>
            <li><strong>Word Frequency Analysis:</strong> Sentences with more frequently used important words score higher</li>
            <li><strong>Position Scoring:</strong> Sentences at the beginning and end of text are weighted more</li>
            <li><strong>Length Optimization:</strong> Sentences of moderate length are preferred over very short or very long ones</li>
            <li><strong>Order Preservation:</strong> Summary sentences appear in their original order</li>
          </ul>

          <h2>Who Uses Text Summarizers?</h2>
          <ul>
            <li><strong>Students:</strong> Quickly grasp key points from lengthy study material</li>
            <li><strong>Researchers:</strong> Extract main findings from academic papers</li>
            <li><strong>Professionals:</strong> Summarize reports and emails for quick review</li>
            <li><strong>Content Creators:</strong> Create concise overviews of longer articles</li>
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
            name: "Text Summarizer",
            description: META.description,
            url: `${SITE_URL}/tools/text-summarizer`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
