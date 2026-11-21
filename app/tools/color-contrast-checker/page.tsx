"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Color Contrast Checker - WCAG AA & AAA Accessibility Tool",
  description:
    "Free Color Contrast Checker for WCAG 2.1 compliance. Check contrast ratio between text and background colors. Verify AA and AAA accessibility levels for normal and large text.",
  keywords: "color contrast checker, wcag contrast checker, accessibility contrast, contrast ratio calculator, wcag aa, wcag aaa, color accessibility",
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function relativeLuminance(r: number, g: number, b: number): number {
  const srgb = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrastRatio(fg: { r: number; g: number; b: number }, bg: { r: number; g: number; b: number }): number {
  const l1 = relativeLuminance(fg.r, fg.g, fg.b);
  const l2 = relativeLuminance(bg.r, bg.g, bg.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function findNearestAccessible(
  fgRgb: { r: number; g: number; b: number },
  bgRgb: { r: number; g: number; b: number },
  targetRatio: number
): string {
  // Adjust foreground color to meet target ratio
  const bgLum = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  // Try making text darker first, then lighter
  let best = { ...fgRgb };
  let bestDiff = Infinity;

  for (let factor = 0; factor <= 200; factor++) {
    // Try darker
    const dark = {
      r: Math.round(fgRgb.r * (1 - factor / 200)),
      g: Math.round(fgRgb.g * (1 - factor / 200)),
      b: Math.round(fgRgb.b * (1 - factor / 200)),
    };
    const darkLum = relativeLuminance(dark.r, dark.g, dark.b);
    const darkRatio = (Math.max(darkLum, bgLum) + 0.05) / (Math.min(darkLum, bgLum) + 0.05);
    if (darkRatio >= targetRatio) {
      const diff = Math.abs(darkRatio - targetRatio);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = dark;
      }
      break;
    }

    // Try lighter
    const light = {
      r: Math.min(255, Math.round(fgRgb.r + (255 - fgRgb.r) * (factor / 200))),
      g: Math.min(255, Math.round(fgRgb.g + (255 - fgRgb.g) * (factor / 200))),
      b: Math.min(255, Math.round(fgRgb.b + (255 - fgRgb.b) * (factor / 200))),
    };
    const lightLum = relativeLuminance(light.r, light.g, light.b);
    const lightRatio = (Math.max(lightLum, bgLum) + 0.05) / (Math.min(lightLum, bgLum) + 0.05);
    if (lightRatio >= targetRatio) {
      const diff = Math.abs(lightRatio - targetRatio);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = light;
      }
      break;
    }
  }

  return rgbToHex(best.r, best.g, best.b);
}

export default function ColorContrastCheckerPage() {
  const [fgColor, setFgColor] = useState("#1a1a2e");
  const [bgColor, setBgColor] = useState("#e0e0e0");

  const analysis = useMemo(() => {
    const fg = hexToRgb(fgColor);
    const bg = hexToRgb(bgColor);
    if (!fg || !bg) return null;

    const ratio = contrastRatio(fg, bg);
    const aaNormal = ratio >= 4.5;
    const aaLarge = ratio >= 3;
    const aaaNormal = ratio >= 7;
    const aaaLarge = ratio >= 4.5;

    const suggestion = !aaNormal ? findNearestAccessible(fg, bg, 4.5) : null;

    return { ratio, aaNormal, aaLarge, aaaNormal, aaaLarge, suggestion };
  }, [fgColor, bgColor]);

  function swapColors() {
    const tmp = fgColor;
    setFgColor(bgColor);
    setBgColor(tmp);
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/color-contrast-checker`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/color-contrast-checker`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Color Contrast Checker</h1>
        <p className="text-[var(--muted)] mb-8">
          Check if your text and background colors meet WCAG 2.1 accessibility standards for contrast.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Text Color (Foreground)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer border"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 p-2 border rounded-lg bg-[var(--muted-bg)] font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Background Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer border"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 p-2 border rounded-lg bg-[var(--muted-bg)] font-mono"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button onClick={swapColors} className="btn-primary text-sm">
              Swap Colors
            </button>
          </div>

          {/* Live Preview */}
          <div
            className="rounded-lg p-8 mb-6 border"
            style={{ backgroundColor: bgColor }}
          >
            <p style={{ color: fgColor, fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>
              Large Text Preview (24px Bold)
            </p>
            <p style={{ color: fgColor, fontSize: "16px", marginBottom: "8px" }}>
              Normal text preview (16px). The quick brown fox jumps over the lazy dog.
            </p>
            <p style={{ color: fgColor, fontSize: "14px" }}>
              Small text preview (14px). WCAG requires sufficient contrast between text and background for readability.
            </p>
          </div>

          {/* Results */}
          {analysis && (
            <div>
              <div className="result-card mb-4 text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Contrast Ratio</p>
                <p className="text-4xl font-extrabold text-[var(--primary)]">
                  {analysis.ratio.toFixed(2)}:1
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="result-card text-center">
                  <p className="text-sm font-medium mb-2">WCAG AA</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Normal Text (4.5:1)</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${analysis.aaNormal ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {analysis.aaNormal ? "PASS" : "FAIL"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Large Text (3:1)</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${analysis.aaLarge ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {analysis.aaLarge ? "PASS" : "FAIL"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="result-card text-center">
                  <p className="text-sm font-medium mb-2">WCAG AAA</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Normal Text (7:1)</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${analysis.aaaNormal ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {analysis.aaaNormal ? "PASS" : "FAIL"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Large Text (4.5:1)</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${analysis.aaaLarge ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {analysis.aaaLarge ? "PASS" : "FAIL"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {analysis.suggestion && (
                <div className="result-card">
                  <p className="text-sm font-medium text-[var(--muted)] mb-2">Suggestion for WCAG AA Compliance</p>
                  <p className="text-sm mb-2">
                    Your current contrast ratio does not meet WCAG AA for normal text. Try this adjusted text color:
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: analysis.suggestion }}
                    />
                    <code className="font-mono font-bold text-[var(--primary)]">{analysis.suggestion}</code>
                    <button
                      onClick={() => setFgColor(analysis.suggestion!)}
                      className="btn-primary text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Color Contrast Checker</h2>
          <p>
            Our free Color Contrast Checker helps designers, developers, and content creators ensure their
            text is readable against its background. The tool calculates the contrast ratio between any two
            colors according to the Web Content Accessibility Guidelines (WCAG) 2.1 standard. Proper color
            contrast is a fundamental aspect of web accessibility, ensuring that people with low vision or
            color vision deficiencies can read your content comfortably.
          </p>

          <h2>Understanding WCAG Contrast Requirements</h2>
          <p>
            WCAG defines two levels of contrast compliance. Level AA is the minimum recommended standard
            for most websites and requires a contrast ratio of at least 4.5:1 for normal text (under 18pt
            or 14pt bold) and 3:1 for large text (18pt and above, or 14pt bold and above). Level AAA is
            the enhanced standard requiring 7:1 for normal text and 4.5:1 for large text. While AAA
            compliance is not required for most websites, it provides the best readability experience for
            the widest range of users.
          </p>

          <h2>How the Contrast Ratio Is Calculated</h2>
          <p>
            The contrast ratio is calculated using the WCAG relative luminance formula. First, each color
            channel (red, green, blue) is converted from sRGB to linear RGB. Then the relative luminance
            is computed using the formula: L = 0.2126R + 0.7152G + 0.0722B. The contrast ratio between
            two colors is (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter color and L2 is the darker
            color. This produces a ratio between 1:1 (no contrast, identical colors) and 21:1 (maximum
            contrast, black on white).
          </p>

          <h2>Features of This Tool</h2>
          <ul>
            <li><strong>Live Color Preview:</strong> See exactly how your text looks on the chosen background in real time</li>
            <li><strong>Dual Input Method:</strong> Use the color picker or type hex codes manually for precise control</li>
            <li><strong>WCAG AA &amp; AAA Results:</strong> Instant pass/fail results for both normal and large text at both compliance levels</li>
            <li><strong>Swap Colors:</strong> Quickly reverse foreground and background to test inverted schemes</li>
            <li><strong>Color Suggestions:</strong> When your colors fail AA, the tool suggests the nearest accessible alternative</li>
          </ul>

          <h2>Why Color Contrast Matters</h2>
          <p>
            Approximately 1 in 12 men and 1 in 200 women have some form of color vision deficiency. Beyond
            that, environmental factors like screen glare, low brightness settings, and aging can all reduce
            contrast perception. Poor contrast leads to eye strain, slower reading speed, and content that is
            effectively invisible to some users. Many countries now require websites to meet WCAG AA standards
            by law, including the ADA in the United States, the European Accessibility Act, and similar
            regulations worldwide. Meeting contrast standards is not just good design — it is a legal
            requirement for many organizations.
          </p>

          <h2>Tips for Accessible Color Design</h2>
          <ul>
            <li>Always test your primary text colors against your background before finalizing a design</li>
            <li>Avoid using color alone to convey information — add icons, text, or patterns as well</li>
            <li>Consider testing in both light and dark modes if your site supports them</li>
            <li>Use larger or bolder text when you need to use a lower contrast ratio</li>
            <li>Test with real users who have color vision deficiencies when possible</li>
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
            name: "Color Contrast Checker",
            description: META.description,
            url: `${SITE_URL}/tools/color-contrast-checker`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
