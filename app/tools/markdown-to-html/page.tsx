"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Markdown to HTML Converter - Live Preview Editor",
  description:
    "Free Markdown to HTML converter with live preview. Supports headers, bold, italic, links, lists, code blocks, images, and more. Copy HTML output instantly.",
  keywords:
    "markdown to html, markdown converter, markdown preview, md to html, markdown editor, markdown renderer",
};

function parseMarkdown(md: string): string {
  let html = md;

  // Escape HTML special chars (but preserve our markdown processing)
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Images ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Headers
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Horizontal rule
  html = html.replace(/^---+$/gm, "<hr />");

  // Bold and Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Blockquotes
  html = html.replace(/^&gt;\s+(.+)$/gm, "<blockquote>$1</blockquote>");

  // Unordered lists
  html = html.replace(/^[\*\-]\s+(.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>");
  // Avoid double-wrapping already-wrapped uls
  html = html.replace(/(?<!<\/ul>)((?:<li>.*<\/li>\n?)+)(?!<\/ul>)/g, (match) => {
    if (match.includes("<ul>")) return match;
    return `<ol>${match}</ol>`;
  });

  // Paragraphs - wrap standalone lines (not already wrapped in tags)
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (/^<(h[1-6]|ul|ol|li|pre|blockquote|hr|img)/.test(trimmed)) return trimmed;
      return `<p>${trimmed}</p>`;
    })
    .join("\n");

  // Clean up line breaks inside paragraphs
  html = html.replace(/<p>([\s\S]*?)<\/p>/g, (_match, content) => {
    return `<p>${content.replace(/\n/g, "<br />")}</p>`;
  });

  return html;
}

const SAMPLE_MD = `# Welcome to Markdown

This is a **free** markdown to HTML converter with *live preview*.

## Features

- **Bold** and *italic* text
- [Links](https://example.com)
- Inline \`code\` formatting
- Lists (ordered and unordered)

### Code Block

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Ordered List

1. First item
2. Second item
3. Third item

> This is a blockquote

---

*Built with CalcTools*`;

export default function MarkdownToHtmlPage() {
  const [markdown, setMarkdown] = useState(SAMPLE_MD);
  const [showRawHtml, setShowRawHtml] = useState(false);
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => parseMarkdown(markdown), [markdown]);

  function copyHtml() {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/markdown-to-html`} />
      

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">
            &larr; All Tools
          </a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Markdown to HTML Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Write Markdown on the left and see the rendered HTML preview on the right, updated live as you type.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="tool-card">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-lg">Markdown</h2>
              <button
                onClick={() => setMarkdown("")}
                className="text-sm text-[var(--primary)] hover:underline"
              >
                Clear
              </button>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="input-field font-mono text-sm min-h-[500px] resize-y"
              placeholder="Type your markdown here..."
              spellCheck={false}
            />
          </div>

          <div className="tool-card">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-lg">Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRawHtml(false)}
                  className={`text-sm px-3 py-1 rounded transition-colors ${
                    !showRawHtml
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-gray-200"
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setShowRawHtml(true)}
                  className={`text-sm px-3 py-1 rounded transition-colors ${
                    showRawHtml
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-gray-200"
                  }`}
                >
                  HTML
                </button>
              </div>
            </div>

            {showRawHtml ? (
              <div className="relative">
                <pre className="input-field font-mono text-sm min-h-[500px] overflow-auto whitespace-pre-wrap">
                  {html}
                </pre>
                <button
                  onClick={copyHtml}
                  className="absolute top-2 right-2 btn-secondary text-xs"
                >
                  {copied ? "Copied!" : "Copy HTML"}
                </button>
              </div>
            ) : (
              <div
                className="prose prose-sm max-w-none min-h-[500px] p-4 border border-[var(--card-border)] rounded-lg overflow-auto"
                style={{
                  lineHeight: 1.75,
                }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}
          </div>
        </div>

        {/* Copy button */}
        <div className="text-center mb-8">
          <button onClick={copyHtml} className="btn-primary px-8">
            {copied ? "Copied!" : "Copy HTML to Clipboard"}
          </button>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card max-w-4xl mx-auto">
          <h2>What is Markdown?</h2>
          <p>
            Markdown is a lightweight markup language created by John Gruber in 2004. It allows you to write formatted
            content using plain text syntax that can be converted to HTML. Markdown is widely used for documentation,
            README files, blog posts, and more.
          </p>

          <h2>Supported Syntax</h2>
          <ul>
            <li><strong>Headers:</strong> Use # for h1, ## for h2, up to ###### for h6</li>
            <li><strong>Bold:</strong> Wrap text with **double asterisks** or __double underscores__</li>
            <li><strong>Italic:</strong> Wrap text with *single asterisks* or _single underscores_</li>
            <li><strong>Links:</strong> [link text](url)</li>
            <li><strong>Images:</strong> ![alt text](image-url)</li>
            <li><strong>Code:</strong> Use backticks for inline code or triple backticks for code blocks</li>
            <li><strong>Lists:</strong> Use - or * for unordered lists, numbers for ordered lists</li>
            <li><strong>Blockquotes:</strong> Prefix lines with &gt;</li>
            <li><strong>Horizontal Rule:</strong> Three or more dashes ---</li>
          </ul>

          <h2>Why Use Markdown?</h2>
          <ul>
            <li>Easy to read and write compared to raw HTML</li>
            <li>Platform-independent and works everywhere</li>
            <li>Used by GitHub, Stack Overflow, Reddit, and many other platforms</li>
            <li>Can be version-controlled with Git</li>
            <li>Converts cleanly to HTML, PDF, and other formats</li>
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
            name: "Markdown to HTML Converter",
            description: META.description,
            url: `${SITE_URL}/tools/markdown-to-html`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
