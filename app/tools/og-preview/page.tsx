"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Open Graph Preview - Preview Social Media Cards Free",
  description:
    "Free Open Graph Preview tool. See how your page looks when shared on Facebook, Twitter, and LinkedIn. Live preview of og:title, og:description, og:image cards.",
  keywords:
    "og preview, open graph preview, social media card preview, facebook share preview, twitter card preview, linkedin share preview",
};

export default function OgPreviewPage() {
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [ogSiteName, setOgSiteName] = useState("");
  const [ogUrl, setOgUrl] = useState("");

  const displayTitle = ogTitle || "Your Page Title";
  const displayDesc = ogDescription || "Your page description will appear here. Add a compelling description to see how it looks on social media platforms.";
  const displaySite = ogSiteName || "example.com";
  const displayUrl = ogUrl || "https://example.com";

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/og-preview`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Open Graph Preview</h1>
        <p className="text-[var(--muted)] mb-8">
          Preview how your page looks when shared on Facebook, Twitter, and LinkedIn.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <label className="block text-sm font-semibold mb-2">og:title</label>
          <input
            type="text"
            value={ogTitle}
            onChange={(e) => setOgTitle(e.target.value)}
            className="input-field"
            placeholder="Your page title"
          />

          <div className="mt-3">
            <label className="block text-sm font-semibold mb-2">og:description</label>
            <textarea
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              className="input-field min-h-[80px] resize-y"
              placeholder="Your page description"
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-semibold mb-2">og:image (URL)</label>
            <input
              type="url"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              className="input-field"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm font-semibold mb-2">og:site_name</label>
              <input
                type="text"
                value={ogSiteName}
                onChange={(e) => setOgSiteName(e.target.value)}
                className="input-field"
                placeholder="Your Site Name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">og:url</label>
              <input
                type="url"
                value={ogUrl}
                onChange={(e) => setOgUrl(e.target.value)}
                className="input-field"
                placeholder="https://example.com/page"
              />
            </div>
          </div>
        </div>

        {/* Facebook Preview */}
        <div className="result-card mb-6">
          <h3 className="font-semibold mb-3">Facebook Preview</h3>
          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden max-w-[524px]">
            {ogImage ? (
              <div className="w-full h-[274px] bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={ogImage}
                  alt="OG Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-[274px] bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image provided</span>
              </div>
            )}
            <div className="p-3 bg-[#f2f3f5] border-t border-gray-300">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{displaySite}</p>
              <h4 className="text-[16px] font-semibold text-[#1d2129] leading-tight mt-1 line-clamp-2">
                {displayTitle}
              </h4>
              <p className="text-sm text-gray-500 mt-1 line-clamp-1">{displayDesc}</p>
            </div>
          </div>
        </div>

        {/* Twitter Preview */}
        <div className="result-card mb-6">
          <h3 className="font-semibold mb-3">Twitter / X Preview</h3>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden max-w-[524px]">
            {ogImage ? (
              <div className="w-full h-[260px] bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={ogImage}
                  alt="Twitter Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-[260px] bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image provided</span>
              </div>
            )}
            <div className="p-3 border-t border-gray-200">
              <h4 className="text-[15px] font-bold text-[#0f1419] leading-tight line-clamp-2">
                {displayTitle}
              </h4>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{displayDesc}</p>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932a4.946 4.946 0 01-.962-2.957c0-.675.132-1.325.393-1.932a4.91 4.91 0 011.092-1.636A5.028 5.028 0 0111.12 5.4c.607-.26 1.257-.393 1.932-.393.322 0 .64.03.954.09l.04-.02c.088-.044.18-.074.275-.09a.506.506 0 01.558.312c.06.15.04.32-.052.45L12.76 8.75h3.738c.188 0 .358.107.44.276a.497.497 0 01-.052.518l-4.5 5.97a.508.508 0 01-.402.196l-.024-.765z" /></svg>
                {new URL(displayUrl).hostname.replace("www.", "")}
              </p>
            </div>
          </div>
        </div>

        {/* LinkedIn Preview */}
        <div className="result-card mb-6">
          <h3 className="font-semibold mb-3">LinkedIn Preview</h3>
          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden max-w-[524px]">
            {ogImage ? (
              <div className="w-full h-[274px] bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={ogImage}
                  alt="LinkedIn Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-[274px] bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image provided</span>
              </div>
            )}
            <div className="p-3 bg-white border-t border-gray-200">
              <h4 className="text-[14px] font-semibold text-[#000000e6] leading-tight line-clamp-2">
                {displayTitle}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {new URL(displayUrl).hostname.replace("www.", "")}
              </p>
            </div>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is an Open Graph Preview?</h2>
          <p>
            An Open Graph Preview tool shows you exactly how your webpage will appear when shared on social
            media platforms like Facebook, Twitter/X, and LinkedIn. This helps you optimize your og tags for
            maximum engagement.
          </p>

          <h2>Open Graph Tags Explained</h2>
          <ul>
            <li><strong>og:title:</strong> The title displayed on the social media card</li>
            <li><strong>og:description:</strong> A brief summary of the page content</li>
            <li><strong>og:image:</strong> The preview image shown on the card (recommended: 1200x630px)</li>
            <li><strong>og:site_name:</strong> The name of your website</li>
            <li><strong>og:url:</strong> The canonical URL of the page</li>
          </ul>

          <h2>Who Uses OG Preview Tools?</h2>
          <ul>
            <li><strong>Social Media Managers:</strong> Ensure links look great when shared</li>
            <li><strong>Web Developers:</strong> Test Open Graph tag implementations</li>
            <li><strong>SEO Specialists:</strong> Optimize content for social sharing</li>
            <li><strong>Content Creators:</strong> Preview posts before publishing</li>
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
            name: "Open Graph Preview",
            description: META.description,
            url: `${SITE_URL}/tools/og-preview`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
