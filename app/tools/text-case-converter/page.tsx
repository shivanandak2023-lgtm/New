"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Text Case Converter - UPPERCASE, lowercase, Title Case & More",
  description:
    "Free online text case converter. Transform text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, and more.",
  keywords:
    "text case converter, uppercase converter, lowercase converter, title case converter, capitalize text, camelCase, snake_case",
};

export default function TextCaseConverterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [lastAction, setLastAction] = useState("");
  const [copied, setCopied] = useState(false);

  function toUpperCase() {
    setOutput(input.toUpperCase());
    setLastAction("UPPERCASE");
  }

  function toLowerCase() {
    setOutput(input.toLowerCase());
    setLastAction("lowercase");
  }

  function toTitleCase() {
    setOutput(
      input
        .toLowerCase()
        .replace(/(?:^|\s|[-/])\S/g, (char) => char.toUpperCase())
    );
    setLastAction("Title Case");
  }

  function toSentenceCase() {
    setOutput(
      input
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, (char) => char.toUpperCase())
    );
    setLastAction("Sentence case");
  }

  function toCamelCase() {
    setOutput(
      input
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
        .replace(/^[A-Z]/, (char) => char.toLowerCase())
    );
    setLastAction("camelCase");
  }

  function toSnakeCase() {
    setOutput(
      input
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[\s\-]+/g, "_")
        .toLowerCase()
    );
    setLastAction("snake_case");
  }

  function toKebabCase() {
    setOutput(
      input
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase()
    );
    setLastAction("kebab-case");
  }

  function toToggleCase() {
    setOutput(
      input
        .split("")
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join("")
    );
    setLastAction("tOGGLE cASE");
  }

  function removeExtraSpaces() {
    setOutput(input.replace(/\s+/g, " ").trim());
    setLastAction("Remove Extra Spaces");
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const buttons = [
    { label: "UPPERCASE", fn: toUpperCase },
    { label: "lowercase", fn: toLowerCase },
    { label: "Title Case", fn: toTitleCase },
    { label: "Sentence case", fn: toSentenceCase },
    { label: "camelCase", fn: toCamelCase },
    { label: "snake_case", fn: toSnakeCase },
    { label: "kebab-case", fn: toKebabCase },
    { label: "tOGGLE cASE", fn: toToggleCase },
    { label: "Remove Extra Spaces", fn: removeExtraSpaces },
  ];

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/text-case-converter`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/text-case-converter`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">
            &larr; All Tools
          </a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Text Case Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert your text to any case format instantly. Supports UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <h2 className="font-bold text-lg mb-4">Enter Your Text</h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field min-h-[150px] resize-y font-mono"
            placeholder="Type or paste your text here..."
            rows={6}
          />
          <div className="flex justify-between text-sm text-[var(--muted)] mt-2">
            <span>{wordCount} words &middot; {charCount} characters</span>
            <button
              onClick={() => {
                setInput("");
                setOutput("");
                setLastAction("");
              }}
              className="text-[var(--primary)] hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="tool-card mb-8">
          <h2 className="font-bold text-lg mb-4">Choose Conversion</h2>
          <div className="flex flex-wrap gap-2">
            {buttons.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.fn}
                disabled={!input.trim()}
                className="btn-primary text-sm"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {output && (
          <div className="tool-card mb-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-lg">
                Result{lastAction && <span className="text-sm font-normal text-[var(--muted)] ml-2">({lastAction})</span>}
              </h2>
              <button onClick={copyOutput} className="btn-secondary text-sm">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="result-card">
              <p className="font-mono whitespace-pre-wrap break-all">{output}</p>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About Text Case Conversion</h2>
          <p>
            Text case conversion is the process of changing text between different capitalization styles. Each case style
            has specific use cases in writing, programming, and design.
          </p>

          <h2>Case Types Explained</h2>
          <ul>
            <li><strong>UPPERCASE:</strong> All letters capitalized. Used for acronyms, headings, and emphasis.</li>
            <li><strong>lowercase:</strong> All letters in lowercase. Common in URLs and email addresses.</li>
            <li><strong>Title Case:</strong> First letter of each word capitalized. Standard for titles and headings.</li>
            <li><strong>Sentence case:</strong> Only the first letter of each sentence is capitalized.</li>
            <li><strong>camelCase:</strong> First word lowercase, subsequent words capitalized. Used in JavaScript and Java variable names.</li>
            <li><strong>snake_case:</strong> Words separated by underscores, all lowercase. Popular in Python and Ruby.</li>
            <li><strong>kebab-case:</strong> Words separated by hyphens, all lowercase. Used in URLs and CSS class names.</li>
            <li><strong>tOGGLE cASE:</strong> Inverts the case of each letter.</li>
          </ul>

          <h2>Programming Naming Conventions</h2>
          <p>
            Different programming languages have different naming conventions. JavaScript typically uses camelCase for
            variables and PascalCase for classes. Python uses snake_case for variables and functions. CSS uses kebab-case
            for class names. Following the correct convention makes your code more readable and consistent.
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
            name: "Text Case Converter",
            description: META.description,
            url: `${SITE_URL}/tools/text-case-converter`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
