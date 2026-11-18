"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "UTM Link Builder - Generate UTM Tagged URLs Free",
  description:
    "Free UTM Link Builder tool. Add UTM parameters to any URL for campaign tracking in Google Analytics. Presets for common platforms. 100% client-side.",
  keywords:
    "utm link builder, utm generator, utm parameters, campaign url builder, google analytics utm, utm tag generator",
};

const PRESETS = [
  {
    label: "Google Ads",
    source: "google",
    medium: "cpc",
    campaign: "",
  },
  {
    label: "Facebook Ads",
    source: "facebook",
    medium: "paid_social",
    campaign: "",
  },
  {
    label: "Instagram Post",
    source: "instagram",
    medium: "social",
    campaign: "",
  },
  {
    label: "Twitter/X Post",
    source: "twitter",
    medium: "social",
    campaign: "",
  },
  {
    label: "LinkedIn Post",
    source: "linkedin",
    medium: "social",
    campaign: "",
  },
  {
    label: "Email Newsletter",
    source: "newsletter",
    medium: "email",
    campaign: "",
  },
  {
    label: "YouTube Video",
    source: "youtube",
    medium: "video",
    campaign: "",
  },
  {
    label: "TikTok",
    source: "tiktok",
    medium: "social",
    campaign: "",
  },
];

export default function UtmLinkBuilderPage() {
  const [baseUrl, setBaseUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const generatedUrl = useMemo(() => {
    const url = baseUrl.trim();
    if (!url) return "";

    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      if (source.trim()) urlObj.searchParams.set("utm_source", source.trim());
      if (medium.trim()) urlObj.searchParams.set("utm_medium", medium.trim());
      if (campaign.trim()) urlObj.searchParams.set("utm_campaign", campaign.trim());
      if (term.trim()) urlObj.searchParams.set("utm_term", term.trim());
      if (content.trim()) urlObj.searchParams.set("utm_content", content.trim());
      return urlObj.toString();
    } catch {
      return "";
    }
  }, [baseUrl, source, medium, campaign, term, content]);

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setSource(preset.source);
    setMedium(preset.medium);
    if (preset.campaign) setCampaign(preset.campaign);
  };

  const handleClear = () => {
    setBaseUrl("");
    setSource("");
    setMedium("");
    setCampaign("");
    setTerm("");
    setContent("");
  };

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/utm-link-builder`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/utm-link-builder`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">UTM Link Builder</h1>
        <p className="text-[var(--muted)] mb-8">
          Add UTM parameters to your URLs for campaign tracking in Google Analytics.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <h3 className="font-semibold mb-3">Quick Presets</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset)}
                className="btn-secondary text-sm"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Website URL *</label>
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="input-field"
              placeholder="https://example.com/landing-page"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-2">utm_source *</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="input-field"
                placeholder="e.g. google, facebook, newsletter"
              />
              <p className="text-xs text-[var(--muted)] mt-1">Identifies which site sent the traffic</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">utm_medium *</label>
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="input-field"
                placeholder="e.g. cpc, email, social"
              />
              <p className="text-xs text-[var(--muted)] mt-1">Marketing medium or channel type</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">utm_campaign *</label>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              className="input-field"
              placeholder="e.g. spring_sale, product_launch"
            />
            <p className="text-xs text-[var(--muted)] mt-1">Name of the marketing campaign</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-2">utm_term (optional)</label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="input-field"
                placeholder="e.g. running+shoes"
              />
              <p className="text-xs text-[var(--muted)] mt-1">Paid search keywords</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">utm_content (optional)</label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field"
                placeholder="e.g. banner_ad, text_link"
              />
              <p className="text-xs text-[var(--muted)] mt-1">Differentiate ads or links to the same URL</p>
            </div>
          </div>

          <button onClick={handleClear} className="btn-secondary text-sm">
            Clear All
          </button>
        </div>

        {generatedUrl && (
          <div className="result-card mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Generated URL</h3>
              <button onClick={handleCopy} className="btn-secondary text-sm">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)] break-all">
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--primary)] hover:underline font-mono"
              >
                {generatedUrl}
              </a>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {source && (
                <div className="tool-card py-2 px-3">
                  <p className="text-xs text-[var(--muted)]">Source</p>
                  <p className="text-sm font-semibold">{source}</p>
                </div>
              )}
              {medium && (
                <div className="tool-card py-2 px-3">
                  <p className="text-xs text-[var(--muted)]">Medium</p>
                  <p className="text-sm font-semibold">{medium}</p>
                </div>
              )}
              {campaign && (
                <div className="tool-card py-2 px-3">
                  <p className="text-xs text-[var(--muted)]">Campaign</p>
                  <p className="text-sm font-semibold">{campaign}</p>
                </div>
              )}
              {term && (
                <div className="tool-card py-2 px-3">
                  <p className="text-xs text-[var(--muted)]">Term</p>
                  <p className="text-sm font-semibold">{term}</p>
                </div>
              )}
              {content && (
                <div className="tool-card py-2 px-3">
                  <p className="text-xs text-[var(--muted)]">Content</p>
                  <p className="text-sm font-semibold">{content}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is a UTM Link Builder?</h2>
          <p>
            A UTM Link Builder adds tracking parameters (UTM tags) to your URLs so you can track the
            effectiveness of marketing campaigns in Google Analytics and other analytics platforms. UTM
            stands for Urchin Tracking Module.
          </p>

          <h2>UTM Parameters Explained</h2>
          <ul>
            <li><strong>utm_source:</strong> The platform or website sending traffic (e.g., google, facebook)</li>
            <li><strong>utm_medium:</strong> The marketing channel type (e.g., cpc, email, social)</li>
            <li><strong>utm_campaign:</strong> The specific campaign name (e.g., spring_sale)</li>
            <li><strong>utm_term:</strong> Paid search keywords (optional)</li>
            <li><strong>utm_content:</strong> Differentiates similar content or links (optional)</li>
          </ul>

          <h2>Who Uses UTM Link Builders?</h2>
          <ul>
            <li><strong>Digital Marketers:</strong> Track campaign performance across channels</li>
            <li><strong>Social Media Managers:</strong> Measure traffic from different platforms</li>
            <li><strong>Email Marketers:</strong> Track clicks from newsletter campaigns</li>
            <li><strong>PPC Specialists:</strong> Monitor paid advertising ROI</li>
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
            name: "UTM Link Builder",
            description: META.description,
            url: `${SITE_URL}/tools/utm-link-builder`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
