"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Code Beautifier & Formatter - Format Code Online Free",
  description:
    "Beautify and format code online for free. Supports JSON, HTML, CSS, JavaScript, SQL, and XML. Indent, prettify, or minify code instantly.",
  keywords: "code beautifier, code formatter online, format code, json formatter, html beautifier, css formatter, sql formatter, minify code",
};

type Language = "json" | "html" | "css" | "javascript" | "sql" | "xml";

function formatJSON(code: string): string {
  const parsed = JSON.parse(code);
  return JSON.stringify(parsed, null, 2);
}

function formatHTML(code: string): string {
  let indent = 0;
  const lines: string[] = [];
  const tokens = code.replace(/>\s*</g, ">\n<").split("\n");

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("</")) {
      indent = Math.max(0, indent - 1);
      lines.push("  ".repeat(indent) + trimmed);
    } else if (
      trimmed.startsWith("<") &&
      !trimmed.startsWith("<!") &&
      !trimmed.startsWith("<br") &&
      !trimmed.startsWith("<hr") &&
      !trimmed.startsWith("<img") &&
      !trimmed.startsWith("<input") &&
      !trimmed.startsWith("<meta") &&
      !trimmed.startsWith("<link") &&
      !trimmed.endsWith("/>") &&
      /<\//.test(trimmed)
    ) {
      lines.push("  ".repeat(indent) + trimmed);
    } else if (
      trimmed.startsWith("<") &&
      !trimmed.startsWith("<!") &&
      !trimmed.startsWith("<br") &&
      !trimmed.startsWith("<hr") &&
      !trimmed.startsWith("<img") &&
      !trimmed.startsWith("<input") &&
      !trimmed.startsWith("<meta") &&
      !trimmed.startsWith("<link") &&
      !trimmed.endsWith("/>")
    ) {
      lines.push("  ".repeat(indent) + trimmed);
      if (!trimmed.includes("</")) indent++;
    } else {
      lines.push("  ".repeat(indent) + trimmed);
    }
  }

  return lines.join("\n");
}

function formatCSS(code: string): string {
  let result = code.trim();
  result = result.replace(/\s*{\s*/g, " {\n  ");
  result = result.replace(/\s*}\s*/g, "\n}\n\n");
  result = result.replace(/;\s*/g, ";\n  ");
  result = result.replace(/\n  \n}/g, "\n}");
  result = result.replace(/\n{3,}/g, "\n\n");
  return result.trim();
}

function formatJS(code: string): string {
  let indent = 0;
  const lines: string[] = [];
  const rawLines = code.split("\n");

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      lines.push("");
      continue;
    }

    if (trimmed.startsWith("}") || trimmed.startsWith("]") || trimmed.startsWith(")")) {
      indent = Math.max(0, indent - 1);
    }

    lines.push("  ".repeat(indent) + trimmed);

    const opens = (trimmed.match(/[{[(]/g) || []).length;
    const closes = (trimmed.match(/[}\])]/g) || []).length;
    indent += opens - closes;
    if (indent < 0) indent = 0;
  }

  return lines.join("\n");
}

function formatSQL(code: string): string {
  const keywords = [
    "SELECT", "FROM", "WHERE", "AND", "OR", "ORDER BY", "GROUP BY",
    "HAVING", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN",
    "FULL JOIN", "CROSS JOIN", "ON", "INSERT INTO", "VALUES", "UPDATE",
    "SET", "DELETE FROM", "CREATE TABLE", "ALTER TABLE", "DROP TABLE",
    "LIMIT", "OFFSET", "UNION", "UNION ALL", "AS", "IN", "NOT", "NULL",
    "IS", "LIKE", "BETWEEN", "EXISTS", "CASE", "WHEN", "THEN", "ELSE",
    "END", "ASC", "DESC", "DISTINCT", "COUNT", "SUM", "AVG", "MIN", "MAX",
  ];

  let result = code.trim();
  for (const kw of keywords) {
    const regex = new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi");
    result = result.replace(regex, kw);
  }

  const clauseKeywords = [
    "SELECT", "FROM", "WHERE", "ORDER BY", "GROUP BY", "HAVING",
    "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN",
    "FULL JOIN", "CROSS JOIN", "INSERT INTO", "VALUES", "UPDATE",
    "SET", "DELETE FROM", "CREATE TABLE", "LIMIT", "OFFSET",
    "UNION ALL", "UNION",
  ];

  for (const kw of clauseKeywords) {
    const regex = new RegExp(`\\b(${kw})\\b`, "g");
    result = result.replace(regex, `\n${kw}`);
  }

  result = result.replace(/^\n+/, "");
  return result;
}

function formatXML(code: string): string {
  return formatHTML(code);
}

function minifyCode(code: string, lang: Language): string {
  if (lang === "json") {
    try {
      return JSON.stringify(JSON.parse(code));
    } catch {
      return code.replace(/\s+/g, " ").trim();
    }
  }
  if (lang === "css") {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*([{}:;,])\s*/g, "$1")
      .trim();
  }
  if (lang === "html" || lang === "xml") {
    return code
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/>\s+</g, "><")
      .replace(/\s+/g, " ")
      .trim();
  }
  if (lang === "javascript") {
    return code
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  return code.replace(/\s+/g, " ").trim();
}

export default function CodeBeautifierPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState<Language>("json");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function beautify() {
    if (!input.trim()) return;
    setError("");
    try {
      let formatted: string;
      switch (language) {
        case "json":
          formatted = formatJSON(input);
          break;
        case "html":
          formatted = formatHTML(input);
          break;
        case "css":
          formatted = formatCSS(input);
          break;
        case "javascript":
          formatted = formatJS(input);
          break;
        case "sql":
          formatted = formatSQL(input);
          break;
        case "xml":
          formatted = formatXML(input);
          break;
        default:
          formatted = input;
      }
      setOutput(formatted);
    } catch {
      setError(`Failed to format ${language.toUpperCase()}. Check your input syntax.`);
    }
  }

  function minify() {
    if (!input.trim()) return;
    setError("");
    try {
      setOutput(minifyCode(input, language));
    } catch {
      setError(`Failed to minify. Check your input.`);
    }
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/code-beautifier`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="/tools/code-beautifier" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Code Beautifier &amp; Formatter</h1>
        <p className="text-[var(--muted)] mb-8">
          Format, beautify, or minify your code. Supports JSON, HTML, CSS, JavaScript, SQL, and XML.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
            >
              <option value="json">JSON</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="javascript">JavaScript</option>
              <option value="sql">SQL</option>
              <option value="xml">XML</option>
            </select>
          </div>

          <label className="block text-sm font-medium mb-2">Code Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === "json"
                ? '{"name":"John","age":30,"city":"New York"}'
                : language === "html"
                ? "<div><p>Hello</p><span>World</span></div>"
                : language === "css"
                ? "body{margin:0;padding:0;}.container{display:flex;}"
                : language === "javascript"
                ? "function hello(){if(true){console.log('hi');}}"
                : language === "sql"
                ? "select id, name from users where age > 18 order by name asc limit 10"
                : "<root><item><name>Test</name></item></root>"
            }
            rows={10}
            className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono mb-4"
          />

          <div className="flex gap-2">
            <button onClick={beautify} className="btn-primary flex-1">
              Beautify / Format
            </button>
            <button
              onClick={minify}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-[var(--card-border)] hover:bg-gray-50 transition-colors"
            >
              Minify
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {output && (
          <div className="result-card mb-8">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Formatted Output</label>
              <button onClick={copy} className="text-xs text-[var(--primary)]">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="bg-gray-50 border border-[var(--card-border)] rounded-lg p-3 text-xs font-mono overflow-x-auto max-h-[500px] overflow-y-auto whitespace-pre">
              {output}
            </pre>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is Code Beautification?</h2>
          <p>
            Code beautification (also called code formatting or prettifying) is the process of
            restructuring source code to improve readability without changing its functionality.
            This includes adding proper indentation, line breaks, and consistent spacing. Well-formatted
            code is easier to read, debug, maintain, and collaborate on. This tool handles formatting
            for six popular languages and data formats used in web development.
          </p>

          <h2>Supported Languages</h2>
          <p>
            <strong>JSON</strong> — Parses the JSON structure and re-serializes it with 2-space
            indentation. This also validates that the JSON is syntactically correct. Invalid JSON
            will produce an error message indicating the parsing issue.
          </p>
          <p>
            <strong>HTML</strong> — Reformats HTML markup with proper indentation based on tag
            nesting levels. Self-closing tags like <code>&lt;br&gt;</code>, <code>&lt;img&gt;</code>,
            and <code>&lt;input&gt;</code> are handled correctly without increasing the indent level.
          </p>
          <p>
            <strong>CSS</strong> — Formats CSS rules with each property on its own line, proper
            indentation inside rule blocks, and blank lines between rules for readability. Useful
            for cleaning up minified stylesheets.
          </p>
          <p>
            <strong>JavaScript</strong> — Applies basic indentation based on brace, bracket, and
            parenthesis nesting. Handles common patterns like function definitions, if statements,
            object literals, and array declarations.
          </p>
          <p>
            <strong>SQL</strong> — Converts SQL keywords to uppercase and adds line breaks before
            major clauses like SELECT, FROM, WHERE, JOIN, ORDER BY, and GROUP BY. This makes complex
            queries much easier to read and understand.
          </p>
          <p>
            <strong>XML</strong> — Applies the same indentation logic as HTML, reformatting nested
            XML elements with proper hierarchy visualization. Useful for configuration files, data
            feeds, and API responses.
          </p>

          <h2>Code Minification</h2>
          <p>
            The Minify button performs the opposite operation — it removes unnecessary whitespace,
            comments, and formatting to produce the smallest possible output. Minification is
            commonly used for production deployments where smaller file sizes reduce bandwidth
            and improve page load times. JSON minification removes all formatting, CSS minification
            strips comments and whitespace around selectors and properties, and JavaScript
            minification removes comments and excess spaces.
          </p>

          <h2>Use Cases</h2>
          <ul>
            <li>Clean up minified API responses for debugging</li>
            <li>Format configuration files (JSON, XML) for readability</li>
            <li>Beautify copied code snippets before sharing</li>
            <li>Prepare SQL queries for documentation</li>
            <li>Minify code for production deployment</li>
            <li>Standardize code formatting across teams</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            All formatting and minification happens entirely in your browser. No code is sent to
            any server. Your source code remains private and is never stored or logged.
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
            name: "Code Beautifier & Formatter",
            description: META.description,
            url: `${SITE_URL}/tools/code-beautifier`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
