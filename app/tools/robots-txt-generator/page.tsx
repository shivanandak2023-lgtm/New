"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Robots.txt Generator - Create Robots.txt File Free",
  description:
    "Free online Robots.txt Generator. Create robots.txt files with custom rules, presets for allowing/blocking crawlers and AI bots, and sitemap URL. 100% client-side.",
  keywords:
    "robots.txt generator, robots txt maker, create robots.txt, block ai bots, robots txt file, crawler rules",
};

interface Rule {
  id: number;
  userAgent: string;
  disallow: string[];
  allow: string[];
}

let ruleIdCounter = 1;

const PRESETS = {
  "allow-all": {
    label: "Allow All",
    rules: [{ userAgent: "*", disallow: [], allow: ["/"] }],
  },
  "block-all": {
    label: "Block All",
    rules: [{ userAgent: "*", disallow: ["/"], allow: [] }],
  },
  "block-ai-bots": {
    label: "Block AI Bots",
    rules: [
      { userAgent: "*", disallow: [], allow: ["/"] },
      { userAgent: "GPTBot", disallow: ["/"], allow: [] },
      { userAgent: "ChatGPT-User", disallow: ["/"], allow: [] },
      { userAgent: "Google-Extended", disallow: ["/"], allow: [] },
      { userAgent: "CCBot", disallow: ["/"], allow: [] },
      { userAgent: "anthropic-ai", disallow: ["/"], allow: [] },
      { userAgent: "ClaudeBot", disallow: ["/"], allow: [] },
      { userAgent: "Bytespider", disallow: ["/"], allow: [] },
      { userAgent: "Omgilibot", disallow: ["/"], allow: [] },
      { userAgent: "FacebookBot", disallow: ["/"], allow: [] },
    ],
  },
  "standard-seo": {
    label: "Standard SEO",
    rules: [
      {
        userAgent: "*",
        disallow: ["/admin/", "/private/", "/api/", "/tmp/", "/*.json$"],
        allow: ["/"],
      },
    ],
  },
};

function generateRobotsTxt(rules: Rule[], sitemapUrl: string): string {
  const lines: string[] = [];

  rules.forEach((rule, i) => {
    if (i > 0) lines.push("");
    lines.push(`User-agent: ${rule.userAgent}`);
    if (rule.disallow.length === 0 && rule.allow.length === 0) {
      lines.push("Disallow:");
    } else {
      rule.disallow.forEach((d) => {
        if (d.trim()) lines.push(`Disallow: ${d.trim()}`);
      });
      rule.allow.forEach((a) => {
        if (a.trim()) lines.push(`Allow: ${a.trim()}`);
      });
      if (rule.disallow.length === 0) {
        lines.push("Disallow:");
      }
    }
  });

  if (sitemapUrl.trim()) {
    lines.push("");
    lines.push(`Sitemap: ${sitemapUrl.trim()}`);
  }

  return lines.join("\n");
}

export default function RobotsTxtGeneratorPage() {
  const [rules, setRules] = useState<Rule[]>([
    { id: ruleIdCounter++, userAgent: "*", disallow: ["/"], allow: [] },
  ]);
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const output = generateRobotsTxt(rules, sitemapUrl);

  const addRule = () => {
    setRules([...rules, { id: ruleIdCounter++, userAgent: "*", disallow: [""], allow: [] }]);
  };

  const removeRule = (id: number) => {
    if (rules.length <= 1) return;
    setRules(rules.filter((r) => r.id !== id));
  };

  const updateRuleAgent = (id: number, agent: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, userAgent: agent } : r)));
  };

  const updateDisallow = (id: number, value: string) => {
    setRules(
      rules.map((r) =>
        r.id === id ? { ...r, disallow: value.split("\n").map((v) => v.trim()) } : r
      )
    );
  };

  const updateAllow = (id: number, value: string) => {
    setRules(
      rules.map((r) =>
        r.id === id ? { ...r, allow: value.split("\n").map((v) => v.trim()) } : r
      )
    );
  };

  const applyPreset = (key: keyof typeof PRESETS) => {
    const preset = PRESETS[key];
    setRules(
      preset.rules.map((r) => ({
        ...r,
        id: ruleIdCounter++,
      }))
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/robots-txt-generator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/robots-txt-generator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Robots.txt Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Create robots.txt files with custom rules, presets, and sitemap URLs.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <h3 className="font-semibold mb-3">Presets</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((key) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className="btn-secondary text-sm"
              >
                {PRESETS[key].label}
              </button>
            ))}
          </div>

          <h3 className="font-semibold mb-3">Rules</h3>
          {rules.map((rule) => (
            <div key={rule.id} className="border border-[var(--border)] rounded-lg p-4 mb-3">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold">User-Agent</label>
                {rules.length > 1 && (
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={rule.userAgent}
                onChange={(e) => updateRuleAgent(rule.id, e.target.value)}
                className="input-field mb-3"
                placeholder="* (all bots)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Disallow (one per line)</label>
                  <textarea
                    value={rule.disallow.join("\n")}
                    onChange={(e) => updateDisallow(rule.id, e.target.value)}
                    className="input-field min-h-[80px] resize-y font-mono text-sm"
                    placeholder="/admin/&#10;/private/"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Allow (one per line)</label>
                  <textarea
                    value={rule.allow.join("\n")}
                    onChange={(e) => updateAllow(rule.id, e.target.value)}
                    className="input-field min-h-[80px] resize-y font-mono text-sm"
                    placeholder="/"
                  />
                </div>
              </div>
            </div>
          ))}

          <button onClick={addRule} className="btn-secondary text-sm mb-4">
            + Add Rule
          </button>

          <div className="mt-4">
            <label className="block text-sm font-semibold mb-2">Sitemap URL</label>
            <input
              type="url"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              className="input-field"
              placeholder="https://example.com/sitemap.xml"
            />
          </div>
        </div>

        <div className="result-card mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Generated robots.txt</h3>
            <button onClick={handleCopy} className="btn-secondary text-sm">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)] overflow-x-auto">
            {output}
          </pre>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is a Robots.txt Generator?</h2>
          <p>
            A Robots.txt Generator creates the robots.txt file that tells web crawlers and bots which
            pages they can and cannot access on your website. This file is essential for SEO and
            controlling how search engines interact with your site.
          </p>

          <h2>Available Presets</h2>
          <ul>
            <li><strong>Allow All:</strong> Permits all crawlers to access all pages</li>
            <li><strong>Block All:</strong> Prevents all crawlers from accessing any pages</li>
            <li><strong>Block AI Bots:</strong> Blocks known AI training bots like GPTBot, CCBot, and ClaudeBot</li>
            <li><strong>Standard SEO:</strong> Allows crawling but blocks admin, API, and private directories</li>
          </ul>

          <h2>Who Uses Robots.txt Generators?</h2>
          <ul>
            <li><strong>Web Developers:</strong> Configure crawler access for websites</li>
            <li><strong>SEO Specialists:</strong> Optimize crawl budget and indexing</li>
            <li><strong>Website Owners:</strong> Protect private content from bots</li>
            <li><strong>Privacy Advocates:</strong> Block AI training bots from scraping content</li>
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
            name: "Robots.txt Generator",
            description: META.description,
            url: `${SITE_URL}/tools/robots-txt-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
