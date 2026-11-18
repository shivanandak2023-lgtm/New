"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Word Counter - Count Words & Characters Online",
  description:
    "Free Word Counter tool to count words, characters, sentences, paragraphs, and estimate reading time. Perfect for writers, students, and bloggers.",
  keywords: "word counter, character counter, letter counter, word count online, text counter, reading time",
};

export default function WordCounterPage() {
  const [text, setText] = useState<string>("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return { words: 0, characters: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, readingTime: "0 sec" };
    }

    const words = trimmed.split(/\s+/).filter(Boolean).length;
    const characters = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const paragraphs = trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

    const minutes = words / 200;
    let readingTime: string;
    if (minutes < 1) {
      readingTime = `${Math.ceil(minutes * 60)} sec`;
    } else {
      readingTime = `${Math.round(minutes)} min`;
    }

    return { words, characters, charsNoSpaces, sentences, paragraphs, readingTime };
  }, [text]);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/word-counter`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Word Counter</h1>
        <p className="text-[var(--muted)] mb-8">
          Count words, characters, sentences, paragraphs, and estimate reading time instantly.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {[
            { label: "Words", value: stats.words },
            { label: "Characters", value: stats.characters },
            { label: "No Spaces", value: stats.charsNoSpaces },
            { label: "Sentences", value: stats.sentences },
            { label: "Paragraphs", value: stats.paragraphs },
            { label: "Reading Time", value: stats.readingTime },
          ].map((item) => (
            <div key={item.label} className="tool-card text-center py-3">
              <p className="text-2xl font-bold text-[var(--primary)]">{item.value}</p>
              <p className="text-xs text-[var(--muted)] mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="tool-card mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-field min-h-[300px] resize-y font-mono text-sm"
            placeholder="Start typing or paste your text here..."
          />
          {text && (
            <button
              onClick={() => setText("")}
              className="btn-secondary mt-3 text-sm"
            >
              Clear Text
            </button>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is a Word Counter?</h2>
          <p>
            A Word Counter is a tool that counts the number of words, characters, sentences, and paragraphs in a
            piece of text. It also estimates reading time based on an average reading speed of 200 words per minute.
          </p>

          <h2>Who Uses Word Counters?</h2>
          <ul>
            <li><strong>Writers &amp; Bloggers:</strong> Track article length and meet word count targets</li>
            <li><strong>Students:</strong> Ensure essays meet minimum or maximum word requirements</li>
            <li><strong>SEO Professionals:</strong> Optimize content length for search engines</li>
            <li><strong>Social Media Managers:</strong> Stay within character limits for posts</li>
            <li><strong>Translators:</strong> Estimate project scope based on word count</li>
          </ul>

          <h2>How Reading Time is Calculated</h2>
          <p>
            The average adult reads approximately 200-250 words per minute. This tool uses 200 words per minute as
            the baseline to calculate estimated reading time.
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
            name: "Word Counter",
            description: META.description,
            url: `${SITE_URL}/tools/word-counter`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
