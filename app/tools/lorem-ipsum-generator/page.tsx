"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Lorem Ipsum Generator - Generate Placeholder Text",
  description:
    "Free Lorem Ipsum Generator to create placeholder text for your designs. Generate paragraphs, sentences, or words of dummy text.",
  keywords: "lorem ipsum generator, dummy text generator, placeholder text, lorem ipsum, filler text",
};

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "sapiente", "totam",
  "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore",
  "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta", "explicabo",
  "nemo", "ipsam", "voluptatem", "quia", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi",
  "nesciunt", "neque", "porro", "quisquam", "dolorem", "adipisci", "numquam",
];

const FIRST_PARAGRAPH = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(): string {
  const len = 8 + Math.floor(Math.random() * 12);
  const words = Array.from({ length: len }, randomWord);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(): string {
  const sentenceCount = 4 + Math.floor(Math.random() * 4);
  return Array.from({ length: sentenceCount }, generateSentence).join(" ");
}

export default function LoremIpsumGeneratorPage() {
  const [count, setCount] = useState<number>(3);
  const [mode, setMode] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [startWithLorem, setStartWithLorem] = useState(true);

  function generate() {
    let result = "";

    if (mode === "paragraphs") {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && startWithLorem) {
          paragraphs.push(FIRST_PARAGRAPH);
        } else {
          paragraphs.push(generateParagraph());
        }
      }
      result = paragraphs.join("\n\n");
    } else if (mode === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && startWithLorem) {
          sentences.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
        } else {
          sentences.push(generateSentence());
        }
      }
      result = sentences.join(" ");
    } else {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && startWithLorem) {
          words.push("Lorem");
        } else {
          words.push(randomWord());
        }
      }
      result = words.join(" ") + ".";
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }

    setOutput(result);
    setCopied(false);
  }

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/lorem-ipsum-generator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/lorem-ipsum-generator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Lorem Ipsum Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Generate placeholder text for your designs, mockups, and layouts. Customize the amount and type.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                className="input-field"
                min="1"
                max="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as typeof mode)}
                className="input-field"
              >
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="accent-[var(--primary)] w-4 h-4"
                />
                <span className="text-sm">Start with &ldquo;Lorem ipsum...&rdquo;</span>
              </label>
            </div>
          </div>

          <button onClick={generate} className="btn-primary w-full">
            Generate Text
          </button>
        </div>

        {output && (
          <div className="tool-card mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Generated Text</h3>
              <button onClick={copyOutput} className="btn-primary text-sm">
                {copied ? "Copied!" : "Copy Text"}
              </button>
            </div>
            <div className="bg-[var(--muted-bg)] rounded-lg p-4 max-h-[400px] overflow-auto">
              {output.split("\n\n").map((para, i) => (
                <p key={i} className="mb-4 last:mb-0 text-sm leading-relaxed text-[var(--muted)]">
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is Lorem Ipsum?</h2>
          <p>
            Lorem Ipsum is placeholder text commonly used in the printing and typesetting industry. It has been the
            industry standard dummy text since the 1500s, when an unknown printer took a galley of type and scrambled
            it to make a type specimen book.
          </p>

          <h2>Why Use Lorem Ipsum?</h2>
          <ul>
            <li>Focus on visual design without being distracted by content</li>
            <li>Test how text flows in layouts and templates</li>
            <li>Fill mockups and wireframes with realistic-looking text</li>
            <li>Standard practice in web design, graphic design, and publishing</li>
          </ul>

          <h2>Where Does Lorem Ipsum Come From?</h2>
          <p>
            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical
            Latin literature from 45 BC, making it over 2000 years old. Richard McClintock discovered its source
            in sections 1.10.32 and 1.10.33 of &ldquo;de Finibus Bonorum et Malorum&rdquo; by Cicero.
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
            name: "Lorem Ipsum Generator",
            description: META.description,
            url: `${SITE_URL}/tools/lorem-ipsum-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
