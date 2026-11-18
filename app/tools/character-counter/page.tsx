"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Character Counter - Count Characters, Words & Sentences Online",
  description:
    "Free Character Counter tool. Count characters, words, sentences, paragraphs, and lines. See live progress bars for Twitter, Instagram, Facebook, YouTube, and Meta description limits.",
  keywords: "character counter, word counter, letter counter, character count, text counter, twitter character limit",
};

const PLATFORM_LIMITS = [
  { name: "Twitter Post", limit: 280, color: "#1DA1F2" },
  { name: "Instagram Caption", limit: 2200, color: "#E4405F" },
  { name: "Facebook Post", limit: 63206, color: "#1877F2" },
  { name: "YouTube Title", limit: 100, color: "#FF0000" },
  { name: "Meta Description", limit: 160, color: "#4285F4" },
];

export default function CharacterCounterPage() {
  const [text, setText] = useState<string>("");

  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, "").length;
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const sentenceCount = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter((s) => s.trim()).length;
  const paragraphCount = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const lineCount = text.trim() === "" ? 0 : text.split(/\n/).length;

  const stats = [
    { label: "Characters", value: charCount },
    { label: "Characters (no spaces)", value: charNoSpaces },
    { label: "Words", value: wordCount },
    { label: "Sentences", value: sentenceCount },
    { label: "Paragraphs", value: paragraphCount },
    { label: "Lines", value: lineCount },
  ];

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/character-counter`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/character-counter`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Character Counter</h1>
        <p className="text-[var(--muted)] mb-8">
          Count characters, words, sentences, paragraphs, and lines with live platform limit tracking.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full p-4 border rounded-lg bg-[var(--muted-bg)] text-sm resize-y mb-6"
            placeholder="Type or paste your text here..."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="result-card text-center">
                <p className="text-2xl font-bold text-[var(--primary)]">{s.value.toLocaleString()}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Platform Character Limits</h3>
            <div className="space-y-4">
              {PLATFORM_LIMITS.map((platform) => {
                const percent = Math.min((charCount / platform.limit) * 100, 100);
                const isOver = charCount > platform.limit;
                return (
                  <div key={platform.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{platform.name}</span>
                      <span className={isOver ? "text-red-500 font-bold" : "text-[var(--muted)]"}>
                        {charCount.toLocaleString()} / {platform.limit.toLocaleString()}
                        {isOver && " (over limit!)"}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: isOver ? "#ef4444" : platform.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Character Counter</h2>
          <p>
            Our character counter provides instant, real-time statistics about your text. Whether you are
            writing a tweet, crafting an Instagram caption, or optimizing a meta description, this tool
            helps you stay within platform limits.
          </p>

          <h2>What Does This Tool Count?</h2>
          <ul>
            <li><strong>Characters:</strong> Total number of characters including spaces</li>
            <li><strong>Characters (no spaces):</strong> Only letters, numbers, and symbols</li>
            <li><strong>Words:</strong> Groups of characters separated by spaces</li>
            <li><strong>Sentences:</strong> Text segments ending with periods, exclamation marks, or question marks</li>
            <li><strong>Paragraphs:</strong> Text blocks separated by blank lines</li>
            <li><strong>Lines:</strong> Text segments separated by line breaks</li>
          </ul>

          <h2>Social Media Character Limits</h2>
          <ul>
            <li><strong>Twitter/X:</strong> 280 characters per tweet</li>
            <li><strong>Instagram:</strong> 2,200 characters per caption</li>
            <li><strong>Facebook:</strong> 63,206 characters per post</li>
            <li><strong>YouTube:</strong> 100 characters for video titles</li>
            <li><strong>Meta Description:</strong> 160 characters recommended for SEO</li>
          </ul>

          <h3>Tips for Better Writing</h3>
          <p>
            Keep your social media posts concise and engaging. For SEO, meta descriptions between 150-160
            characters perform best. On Twitter, shorter tweets often get more engagement than those
            hitting the 280-character limit.
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
            name: "Character Counter",
            description: META.description,
            url: `${SITE_URL}/tools/character-counter`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
