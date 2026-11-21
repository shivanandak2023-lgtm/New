"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Hex to RGB / RGB to Hex Converter - Color Code Converter Free",
  description:
    "Free hex to RGB and RGB to hex converter. Also shows HSL and CMYK values with live preview and copy buttons. Runs in your browser.",
  keywords:
    "hex to rgb, rgb to hex, color code converter, hex color converter, rgb converter, hsl converter, cmyk converter",
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.replace("#", "").match(/^([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/);
  if (!match) return null;
  let h = match[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  return {
    c: Math.round(((1 - rr - k) / (1 - k)) * 100),
    m: Math.round(((1 - gg - k) / (1 - k)) * 100),
    y: Math.round(((1 - bb - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

const COMMON_COLORS: { name: string; hex: string }[] = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Gray", hex: "#808080" },
  { name: "Black", hex: "#000000" },
  { name: "Red", hex: "#FF0000" },
  { name: "Maroon", hex: "#800000" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Olive", hex: "#808000" },
  { name: "Lime", hex: "#00FF00" },
  { name: "Green", hex: "#008000" },
  { name: "Aqua", hex: "#00FFFF" },
  { name: "Teal", hex: "#008080" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Navy", hex: "#000080" },
  { name: "Fuchsia", hex: "#FF00FF" },
  { name: "Purple", hex: "#800080" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Tomato", hex: "#FF6347" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Sky Blue", hex: "#87CEEB" },
  { name: "Indigo", hex: "#4B0082" },
  { name: "Violet", hex: "#EE82EE" },
  { name: "Pink", hex: "#FFC0CB" },
];

export default function HexToRgbPage() {
  const [mode, setMode] = useState<"hex-to-rgb" | "rgb-to-hex">("hex-to-rgb");
  const [hexInput, setHexInput] = useState("#4A90D9");
  const [rInput, setRInput] = useState(74);
  const [gInput, setGInput] = useState(144);
  const [bInput, setBInput] = useState(217);
  const [copied, setCopied] = useState<string>("");

  function getColorFromHex(): { r: number; g: number; b: number } | null {
    return hexToRgb(hexInput);
  }

  function getCurrentRgb(): { r: number; g: number; b: number } | null {
    if (mode === "hex-to-rgb") return getColorFromHex();
    return { r: rInput, g: gInput, b: bInput };
  }

  function getCurrentHex(): string {
    if (mode === "hex-to-rgb") {
      const clean = hexInput.replace("#", "");
      if (/^[0-9a-fA-F]{3}$/.test(clean)) return `#${clean[0]}${clean[0]}${clean[1]}${clean[1]}${clean[2]}${clean[2]}`;
      if (/^[0-9a-fA-F]{6}$/.test(clean)) return `#${clean}`;
      return "";
    }
    return rgbToHex(rInput, gInput, bInput);
  }

  const rgb = getCurrentRgb();
  const hex = getCurrentHex();
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null;

  function copyValue(label: string, value: string) {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  }

  function loadColor(colorHex: string) {
    setHexInput(colorHex);
    const c = hexToRgb(colorHex);
    if (c) { setRInput(c.r); setGInput(c.g); setBInput(c.b); }
    setMode("hex-to-rgb");
  }

  const formats = rgb && hex && hsl && cmyk ? [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "CMYK", value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ] : [];

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/hex-to-rgb`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/hex-to-rgb`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Hex to RGB Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert between Hex, RGB, HSL, and CMYK color formats with live preview. All conversions happen instantly in your browser.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          {/* Mode toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("hex-to-rgb")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "hex-to-rgb"
                  ? "bg-[var(--primary)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              HEX &rarr; RGB
            </button>
            <button
              onClick={() => setMode("rgb-to-hex")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "rgb-to-hex"
                  ? "bg-[var(--primary)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              RGB &rarr; HEX
            </button>
          </div>

          {/* Input */}
          {mode === "hex-to-rgb" ? (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Hex Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={hex || "#000000"}
                  onChange={(e) => {
                    setHexInput(e.target.value);
                    const c = hexToRgb(e.target.value);
                    if (c) { setRInput(c.r); setGInput(c.g); setBInput(c.b); }
                  }}
                  className="w-12 h-12 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => {
                    setHexInput(e.target.value);
                    const c = hexToRgb(e.target.value);
                    if (c) { setRInput(c.r); setGInput(c.g); setBInput(c.b); }
                  }}
                  placeholder="#4A90D9"
                  className="border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono flex-1"
                />
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">RGB Values</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-[var(--muted)]">R (0-255)</label>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rInput}
                    onChange={(e) => {
                      const v = Math.max(0, Math.min(255, Number(e.target.value)));
                      setRInput(v);
                      setHexInput(rgbToHex(v, gInput, bInput));
                    }}
                    className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)]">G (0-255)</label>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={gInput}
                    onChange={(e) => {
                      const v = Math.max(0, Math.min(255, Number(e.target.value)));
                      setGInput(v);
                      setHexInput(rgbToHex(rInput, v, bInput));
                    }}
                    className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)]">B (0-255)</label>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={bInput}
                    onChange={(e) => {
                      const v = Math.max(0, Math.min(255, Number(e.target.value)));
                      setBInput(v);
                      setHexInput(rgbToHex(rInput, gInput, v));
                    }}
                    className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Color preview */}
          {hex && (
            <div
              className="w-full h-24 rounded-xl mb-6 border border-[var(--card-border)]"
              style={{ backgroundColor: hex }}
            />
          )}

          {/* Results */}
          {formats.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formats.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-[var(--card-border)]"
                >
                  <div>
                    <p className="text-xs text-[var(--muted)]">{f.label}</p>
                    <p className="text-sm font-mono font-medium">{f.value}</p>
                  </div>
                  <button
                    onClick={() => copyValue(f.label, f.value)}
                    className="text-xs px-3 py-1 rounded bg-[var(--primary)] text-white hover:opacity-90"
                  >
                    {copied === f.label ? "Copied!" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Common colors */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Common Colors Reference</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {COMMON_COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => loadColor(c.hex)}
                className="flex items-center gap-2 p-2 rounded-lg border border-[var(--card-border)] hover:border-[var(--primary)] transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-sm flex-shrink-0 border border-gray-200" style={{ backgroundColor: c.hex }} />
                <div>
                  <p className="text-xs font-medium">{c.name}</p>
                  <p className="text-[10px] text-[var(--muted)] font-mono">{c.hex}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Free Hex to RGB and RGB to Hex Converter</h2>
          <p>
            Color codes are the foundation of digital design, but working with different formats can be confusing. Web designers typically use hex codes like #FF5733, while CSS also supports rgb() notation like rgb(255, 87, 51). Graphic designers often need HSL values for color adjustments, and print designers require CMYK values for accurate color reproduction. This free color code converter handles all four formats in real time, letting you convert between hex, RGB, HSL, and CMYK with instant visual feedback. Everything runs in your browser with no server uploads or external dependencies.
          </p>

          <h2>How Color Code Conversion Works</h2>
          <p>
            Hex color codes represent colors using hexadecimal (base-16) notation, where two digits each encode the red, green, and blue channels. For example, #4A90D9 means red=74, green=144, blue=217 in decimal. RGB notation uses the same three-channel model but with decimal numbers from 0 to 255. HSL (Hue, Saturation, Lightness) is a more intuitive model where hue is a degree on the color wheel (0-360), saturation is a percentage, and lightness is a percentage. CMYK (Cyan, Magenta, Yellow, Key/Black) is the standard for print color and represents how much of each ink is needed.
          </p>

          <h2>When to Use Each Color Format</h2>
          <ul>
            <li><strong>HEX</strong> — most common in web development, HTML, and CSS; compact 6-character format</li>
            <li><strong>RGB</strong> — used in CSS, JavaScript canvas operations, and digital imaging software</li>
            <li><strong>HSL</strong> — ideal for adjusting colors programmatically (changing brightness or saturation)</li>
            <li><strong>CMYK</strong> — essential for print design, packaging, and physical media production</li>
          </ul>

          <h2>Features of This Converter</h2>
          <p>
            This tool offers bidirectional conversion between hex and RGB as the primary mode, with automatic calculation of HSL and CMYK values for every color. As you type a hex code or adjust RGB sliders, all other values update instantly. A large color preview swatch shows the exact color you are working with. Each output format has a one-click copy button for quick use. The common colors reference table includes 24 standard web colors that you can click to load instantly. The color picker input lets you visually browse and select any color.
          </p>

          <h3>Tips for Working with Color Codes</h3>
          <p>
            When converting colors between screen and print, remember that CMYK has a smaller color gamut than RGB, so some vivid digital colors cannot be exactly reproduced in print. Always test print colors with physical proofs. For web accessibility, use sufficient contrast ratios between text and background colors — the WCAG guidelines recommend at least 4.5:1 for normal text. When working with CSS, hex codes and rgb() are interchangeable in all modern browsers, so choose whichever format is more readable for your team. Shorthand hex codes like #FFF expand to #FFFFFF and can save space in stylesheets.
          </p>

          <h3>Common Color Reference</h3>
          <p>
            The reference table below the converter includes the 24 most commonly used web colors, from basic colors like red, green, and blue to popular named colors like coral, tomato, gold, and indigo. Click any color to instantly load it into the converter and see its hex, RGB, HSL, and CMYK values. This reference is especially helpful when you need quick access to standard color codes without looking them up externally.
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
            name: "Hex to RGB Converter",
            description: META.description,
            url: `${SITE_URL}/tools/hex-to-rgb`,
            applicationCategory: "DesignApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
