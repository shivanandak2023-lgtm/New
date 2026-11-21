"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "YouTube Thumbnail Downloader - Download YT Thumbnails All Sizes",
  description:
    "Free YouTube Thumbnail Downloader. Download YouTube video thumbnails in all sizes — default, medium, high, standard, and max resolution. Just paste the URL.",
  keywords: "youtube thumbnail downloader, download youtube thumbnail, yt thumbnail, youtube thumbnail grabber, save youtube thumbnail",
};

function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  // Plain video ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    // youtube.com/watch?v=ID
    if (url.hostname.includes("youtube.com") && url.searchParams.has("v")) {
      return url.searchParams.get("v");
    }
    // youtube.com/shorts/ID or youtube.com/embed/ID
    const pathMatch = url.pathname.match(/\/(shorts|embed)\/([a-zA-Z0-9_-]{11})/);
    if (pathMatch) return pathMatch[2];
    // youtu.be/ID
    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
  } catch {
    // not a URL
  }
  // Try regex fallback
  const regex = /(?:v=|youtu\.be\/|shorts\/|embed\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regex);
  return match ? match[1] : null;
}

const THUMBNAIL_SIZES = [
  { label: "Default", key: "default", filename: "default.jpg", width: 120, height: 90 },
  { label: "Medium", key: "mqdefault", filename: "mqdefault.jpg", width: 320, height: 180 },
  { label: "High", key: "hqdefault", filename: "hqdefault.jpg", width: 480, height: 360 },
  { label: "Standard", key: "sddefault", filename: "sddefault.jpg", width: 640, height: 480 },
  { label: "Max Resolution", key: "maxresdefault", filename: "maxresdefault.jpg", width: 1280, height: 720 },
];

export default function YouTubeThumbnailDownloaderPage() {
  const [input, setInput] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function handleFetch() {
    setError("");
    const id = extractVideoId(input);
    if (!id) {
      setError("Invalid YouTube URL or video ID. Please enter a valid link.");
      setVideoId(null);
      return;
    }
    setVideoId(id);
  }

  async function handleDownload(url: string, filename: string) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch {
      // fallback: open in new tab
      window.open(url, "_blank");
    }
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/youtube-thumbnail-downloader`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/youtube-thumbnail-downloader`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">YouTube Thumbnail Downloader</h1>
        <p className="text-[var(--muted)] mb-8">
          Download YouTube video thumbnails in all available sizes. Just paste the video URL or ID.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <label className="block text-sm font-medium mb-1">YouTube URL or Video ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="flex-1 p-2 border rounded-lg bg-[var(--muted-bg)]"
            />
            <button onClick={handleFetch} className="btn-primary shrink-0">
              Get Thumbnails
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <p className="text-xs text-[var(--muted)] mt-2">
            Supports youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, or just the 11-character video ID.
          </p>
        </div>

        {videoId && (
          <div className="space-y-6 mb-8">
            {THUMBNAIL_SIZES.map((size) => {
              const url = `https://img.youtube.com/vi/${videoId}/${size.filename}`;
              return (
                <div key={size.key} className="result-card">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{size.label}</h3>
                      <p className="text-sm text-[var(--muted)]">{size.width} x {size.height}</p>
                    </div>
                    <button
                      onClick={() => handleDownload(url, `thumbnail-${videoId}-${size.key}.jpg`)}
                      className="btn-primary text-sm"
                    >
                      Download
                    </button>
                  </div>
                  <img
                    src={url}
                    alt={`YouTube thumbnail ${size.label} (${size.width}x${size.height})`}
                    className="w-full rounded-lg border"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the YouTube Thumbnail Downloader</h2>
          <p>
            Our free YouTube Thumbnail Downloader lets you save any YouTube video thumbnail in all available
            resolutions. Whether you need a thumbnail for a blog post, presentation, social media, or design
            project, this tool makes it easy to grab the exact image you need. Simply paste a YouTube video URL
            or video ID and instantly see all available thumbnail sizes.
          </p>

          <h2>How to Download YouTube Thumbnails</h2>
          <p>
            Downloading YouTube thumbnails is straightforward with our tool. YouTube automatically generates
            multiple thumbnail versions for every uploaded video. These images are publicly accessible via a
            predictable URL pattern on YouTube&apos;s image servers. Our tool parses the video ID from any
            YouTube link format and constructs the correct URLs for every available size.
          </p>
          <ol>
            <li>Copy the YouTube video URL from your browser address bar or the share button</li>
            <li>Paste it into the input field above</li>
            <li>Click &quot;Get Thumbnails&quot; to see all available sizes</li>
            <li>Click the &quot;Download&quot; button on the size you want</li>
          </ol>

          <h2>Available Thumbnail Sizes</h2>
          <p>
            YouTube generates five standard thumbnail sizes for each video. The Default thumbnail is the
            smallest at 120x90 pixels, suitable for tiny previews and embedded lists. The Medium Quality
            thumbnail at 320x180 offers a good balance of size and quality for social media posts. The High
            Quality version at 480x360 is widely used for blog posts and web pages. The Standard Definition
            thumbnail at 640x480 provides higher detail. Finally, the Maximum Resolution thumbnail at 1280x720
            is the highest quality available, ideal for print or high-resolution displays.
          </p>

          <h2>Supported URL Formats</h2>
          <p>
            This YouTube thumbnail grabber supports all common YouTube URL formats. You can use the standard
            watch page URL (youtube.com/watch?v=), shortened URLs (youtu.be/), YouTube Shorts links
            (youtube.com/shorts/), embed URLs, and even just the raw 11-character video ID. The parser
            handles edge cases gracefully, so you can paste any YouTube link with confidence.
          </p>

          <h2>Why Download YouTube Thumbnails?</h2>
          <p>
            Content creators, designers, and marketers frequently need YouTube thumbnails for reference,
            competitive analysis, or creative projects. Bloggers embed them in articles when discussing videos.
            Social media managers use them in promotional posts. Designers study successful thumbnails to improve
            click-through rates. Educators include them in presentations and course materials. Whatever your
            reason, our YT thumbnail downloader gives you instant access to every size without any sign-up or
            software installation. The download happens directly in your browser — your data never leaves your
            device.
          </p>

          <h2>Tips for Using YouTube Thumbnails</h2>
          <ul>
            <li>Use the Max Resolution (1280x720) for the highest quality in presentations and print</li>
            <li>The Medium Quality (320x180) is perfect for social media cards and previews</li>
            <li>Not all videos have a Max Resolution thumbnail — if the image appears broken, try Standard or High</li>
            <li>Custom thumbnails uploaded by creators are available at all five standard sizes</li>
            <li>Always respect copyright when using thumbnails — credit the original creator</li>
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
            name: "YouTube Thumbnail Downloader",
            description: META.description,
            url: `${SITE_URL}/tools/youtube-thumbnail-downloader`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
