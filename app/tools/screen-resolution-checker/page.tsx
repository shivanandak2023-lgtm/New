"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Screen Resolution Checker - Detect Your Display Size & DPI",
  description:
    "Free Screen Resolution Checker. Auto-detect your screen resolution, viewport size, pixel ratio, color depth, orientation, and aspect ratio. Compare with common resolutions.",
  keywords: "screen resolution checker, display size, screen size, pixel ratio, viewport size, monitor resolution",
};

const COMMON_RESOLUTIONS = [
  { name: "HD (720p)", width: 1280, height: 720 },
  { name: "Full HD (1080p)", width: 1920, height: 1080 },
  { name: "QHD (1440p)", width: 2560, height: 1440 },
  { name: "4K UHD", width: 3840, height: 2160 },
  { name: "5K", width: 5120, height: 2880 },
  { name: "8K UHD", width: 7680, height: 4320 },
  { name: "iPad", width: 1024, height: 768 },
  { name: "MacBook Air 13\"", width: 2560, height: 1600 },
  { name: "iPhone 15", width: 1179, height: 2556 },
];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

interface ScreenInfo {
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  pixelRatio: number;
  colorDepth: number;
  orientation: string;
  aspectRatio: string;
}

export default function ScreenResolutionCheckerPage() {
  const [info, setInfo] = useState<ScreenInfo | null>(null);

  useEffect(() => {
    function detect() {
      const sw = screen.width;
      const sh = screen.height;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pr = window.devicePixelRatio || 1;
      const cd = screen.colorDepth;
      const orient = sw > sh ? "Landscape" : sw < sh ? "Portrait" : "Square";
      const d = gcd(sw, sh);
      const ar = `${sw / d}:${sh / d}`;

      setInfo({
        screenWidth: sw,
        screenHeight: sh,
        viewportWidth: vw,
        viewportHeight: vh,
        pixelRatio: pr,
        colorDepth: cd,
        orientation: orient,
        aspectRatio: ar,
      });
    }

    detect();
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/screen-resolution-checker`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/screen-resolution-checker`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Screen Resolution Checker</h1>
        <p className="text-[var(--muted)] mb-8">
          Auto-detect your screen resolution, viewport size, pixel ratio, and more.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {info ? (
          <>
            <div className="tool-card mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="result-card text-center">
                  <p className="text-3xl font-bold text-[var(--primary)]">
                    {info.screenWidth} x {info.screenHeight}
                  </p>
                  <p className="text-sm text-[var(--muted)] mt-1">Screen Resolution</p>
                </div>
                <div className="result-card text-center">
                  <p className="text-3xl font-bold text-[var(--primary)]">
                    {info.viewportWidth} x {info.viewportHeight}
                  </p>
                  <p className="text-sm text-[var(--muted)] mt-1">Viewport Size</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="result-card text-center">
                  <p className="text-xl font-bold">{info.pixelRatio}x</p>
                  <p className="text-xs text-[var(--muted)] mt-1">Device Pixel Ratio</p>
                </div>
                <div className="result-card text-center">
                  <p className="text-xl font-bold">{info.colorDepth}-bit</p>
                  <p className="text-xs text-[var(--muted)] mt-1">Color Depth</p>
                </div>
                <div className="result-card text-center">
                  <p className="text-xl font-bold">{info.orientation}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">Orientation</p>
                </div>
                <div className="result-card text-center">
                  <p className="text-xl font-bold">{info.aspectRatio}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">Aspect Ratio</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[var(--muted-bg)] rounded-lg">
                <p className="text-sm text-[var(--muted)]">
                  <strong>Physical Resolution:</strong> {Math.round(info.screenWidth * info.pixelRatio)} x {Math.round(info.screenHeight * info.pixelRatio)} pixels
                  (CSS pixels x device pixel ratio)
                </p>
              </div>
            </div>

            <div className="tool-card mb-8">
              <h2 className="text-lg font-bold mb-4">Compare with Common Resolutions</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Resolution</th>
                      <th className="text-left py-2 px-3">Size</th>
                      <th className="text-left py-2 px-3">Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMMON_RESOLUTIONS.map((res) => {
                      const isMatch = info.screenWidth === res.width && info.screenHeight === res.height;
                      const isClose =
                        !isMatch &&
                        Math.abs(info.screenWidth - res.width) < 100 &&
                        Math.abs(info.screenHeight - res.height) < 100;
                      return (
                        <tr key={res.name} className={`border-b ${isMatch ? "bg-green-50" : ""}`}>
                          <td className="py-2 px-3 font-medium">{res.name}</td>
                          <td className="py-2 px-3">{res.width} x {res.height}</td>
                          <td className="py-2 px-3">
                            {isMatch ? (
                              <span className="text-green-600 font-bold">Your display</span>
                            ) : isClose ? (
                              <span className="text-amber-600">Close match</span>
                            ) : (
                              <span className="text-[var(--muted)]">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="tool-card mb-8 text-center py-12">
            <p className="text-[var(--muted)]">Detecting your screen information...</p>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Screen Resolution Checker</h2>
          <p>
            This tool automatically detects your display properties without any input required.
            It reads your screen resolution, browser viewport dimensions, device pixel ratio,
            color depth, orientation, and aspect ratio in real time.
          </p>

          <h2>What Do These Numbers Mean?</h2>
          <ul>
            <li><strong>Screen Resolution:</strong> The total pixel dimensions of your display</li>
            <li><strong>Viewport Size:</strong> The visible area of your browser window</li>
            <li><strong>Device Pixel Ratio:</strong> How many physical pixels map to one CSS pixel (Retina displays have 2x or 3x)</li>
            <li><strong>Color Depth:</strong> Number of bits used to represent the color of a single pixel (24-bit = 16.7M colors)</li>
            <li><strong>Orientation:</strong> Whether your screen is in landscape or portrait mode</li>
            <li><strong>Aspect Ratio:</strong> The proportional relationship between width and height</li>
          </ul>

          <h2>Common Display Resolutions</h2>
          <ul>
            <li><strong>HD (720p):</strong> 1280x720 &mdash; Budget laptops and older monitors</li>
            <li><strong>Full HD (1080p):</strong> 1920x1080 &mdash; Most popular resolution</li>
            <li><strong>QHD (1440p):</strong> 2560x1440 &mdash; Gaming monitors and high-end laptops</li>
            <li><strong>4K UHD:</strong> 3840x2160 &mdash; Premium displays and TVs</li>
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
            name: "Screen Resolution Checker",
            description: META.description,
            url: `${SITE_URL}/tools/screen-resolution-checker`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
