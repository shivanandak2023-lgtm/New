"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Meta Tag Generator - Generate HTML Meta Tags Free",
  description:
    "Free online Meta Tag Generator. Create HTML meta tags for title, description, keywords, Open Graph, and more. Preview Google SERP appearance. 100% client-side.",
  keywords:
    "meta tag generator, html meta tags, seo meta tags, open graph tags, meta description generator, serp preview",
};

export default function MetaTagGeneratorPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [canonical, setCanonical] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [ogUrl, setOgUrl] = useState("");
  const [ogType, setOgType] = useState("website");
  const [ogSiteName, setOgSiteName] = useState("");
  const [copied, setCopied] = useState(false);

  const generatedHTML = useMemo(() => {
    const lines: string[] = [];

    if (title) {
      lines.push(`<title>${title}</title>`);
    }
    if (description) {
      lines.push(`<meta name="description" content="${description}" />`);
    }
    if (keywords) {
      lines.push(`<meta name="keywords" content="${keywords}" />`);
    }
    if (author) {
      lines.push(`<meta name="author" content="${author}" />`);
    }
    if (robots) {
      lines.push(`<meta name="robots" content="${robots}" />`);
    }
    if (canonical) {
      lines.push(`<link rel="canonical" href="${canonical}" />`);
    }

    // Open Graph
    if (ogTitle || title) {
      lines.push(`<meta property="og:title" content="${ogTitle || title}" />`);
    }
    if (ogDescription || description) {
      lines.push(`<meta property="og:description" content="${ogDescription || description}" />`);
    }
    if (ogImage) {
      lines.push(`<meta property="og:image" content="${ogImage}" />`);
    }
    if (ogUrl || canonical) {
      lines.push(`<meta property="og:url" content="${ogUrl || canonical}" />`);
    }
    if (ogType) {
      lines.push(`<meta property="og:type" content="${ogType}" />`);
    }
    if (ogSiteName) {
      lines.push(`<meta property="og:site_name" content="${ogSiteName}" />`);
    }

    // Twitter Card
    if (ogTitle || title) {
      lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
      lines.push(`<meta name="twitter:title" content="${ogTitle || title}" />`);
    }
    if (ogDescription || description) {
      lines.push(`<meta name="twitter:description" content="${ogDescription || description}" />`);
    }
    if (ogImage) {
      lines.push(`<meta name="twitter:image" content="${ogImage}" />`);
    }

    return lines.join("\n");
  }, [title, description, keywords, author, robots, canonical, ogTitle, ogDescription, ogImage, ogUrl, ogType, ogSiteName]);

  const handleCopy = () => {
    if (!generatedHTML) return;
    navigator.clipboard.writeText(generatedHTML).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const serpTitle = title || "Page Title";
  const serpUrl = canonical || "https://example.com/page";
  const serpDesc = description || "Your meta description will appear here. Write a compelling description to improve click-through rates from search results.";

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/meta-tag-generator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Meta Tag Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Generate HTML meta tags for SEO, Open Graph, and Twitter Cards with a live Google SERP preview.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <h3 className="font-semibold mb-4">Basic Meta Tags</h3>

          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">
              Title <span className="text-[var(--muted)] font-normal">({title.length}/60)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
              className="input-field"
              placeholder="Your page title (max 60 characters)"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">
              Description <span className="text-[var(--muted)] font-normal">({description.length}/160)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={160}
              className="input-field min-h-[80px] resize-y"
              placeholder="Your meta description (max 160 characters)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Keywords</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="input-field"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="input-field"
                placeholder="Author name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Robots</label>
              <select
                value={robots}
                onChange={(e) => setRobots(e.target.value)}
                className="input-field"
              >
                <option value="index, follow">index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Canonical URL</label>
              <input
                type="url"
                value={canonical}
                onChange={(e) => setCanonical(e.target.value)}
                className="input-field"
                placeholder="https://example.com/page"
              />
            </div>
          </div>
        </div>

        <div className="tool-card mb-6">
          <h3 className="font-semibold mb-4">Open Graph Tags</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-semibold mb-1">OG Title</label>
              <input
                type="text"
                value={ogTitle}
                onChange={(e) => setOgTitle(e.target.value)}
                className="input-field"
                placeholder="Falls back to title"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">OG Type</label>
              <select
                value={ogType}
                onChange={(e) => setOgType(e.target.value)}
                className="input-field"
              >
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="product">product</option>
                <option value="profile">profile</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">OG Description</label>
            <input
              type="text"
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              className="input-field"
              placeholder="Falls back to meta description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-semibold mb-1">OG Image URL</label>
              <input
                type="url"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">OG URL</label>
              <input
                type="url"
                value={ogUrl}
                onChange={(e) => setOgUrl(e.target.value)}
                className="input-field"
                placeholder="Falls back to canonical URL"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">OG Site Name</label>
            <input
              type="text"
              value={ogSiteName}
              onChange={(e) => setOgSiteName(e.target.value)}
              className="input-field"
              placeholder="Your Site Name"
            />
          </div>
        </div>

        {/* Google SERP Preview */}
        <div className="result-card mb-6">
          <h3 className="font-semibold mb-3">Google SERP Preview</h3>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-green-700 truncate">{serpUrl}</p>
            <h4 className="text-xl text-blue-700 hover:underline cursor-pointer truncate leading-tight mt-1">
              {serpTitle}
            </h4>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{serpDesc}</p>
          </div>
        </div>

        {/* Generated HTML */}
        {generatedHTML && (
          <div className="result-card mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Generated Meta Tags</h3>
              <button onClick={handleCopy} className="btn-secondary text-sm">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)] overflow-x-auto">
              {generatedHTML}
            </pre>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is a Meta Tag Generator?</h2>
          <p>
            A Meta Tag Generator creates the HTML meta tags needed for SEO optimization. These tags tell
            search engines and social media platforms about your page's content, helping improve visibility
            and click-through rates.
          </p>

          <h2>Tags Generated</h2>
          <ul>
            <li><strong>Title Tag:</strong> The clickable headline shown in search results (max 60 characters)</li>
            <li><strong>Meta Description:</strong> Summary text below the title in search results (max 160 characters)</li>
            <li><strong>Keywords:</strong> Relevant terms that describe your page content</li>
            <li><strong>Robots:</strong> Instructions for search engine crawlers</li>
            <li><strong>Open Graph:</strong> Controls how your page appears when shared on social media</li>
            <li><strong>Twitter Cards:</strong> Optimizes appearance in Twitter/X shares</li>
          </ul>

          <h2>Who Uses Meta Tag Generators?</h2>
          <ul>
            <li><strong>Web Developers:</strong> Quickly generate correct meta tag markup</li>
            <li><strong>SEO Specialists:</strong> Optimize pages for search engine visibility</li>
            <li><strong>Content Creators:</strong> Ensure content appears well on social media</li>
            <li><strong>Business Owners:</strong> Improve website discoverability</li>
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
            name: "Meta Tag Generator",
            description: META.description,
            url: `${SITE_URL}/tools/meta-tag-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
