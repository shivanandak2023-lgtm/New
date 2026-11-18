"use client";

import { useState, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Color Picker - Pick Colors & Get HEX, RGB, HSL",
  description:
    "Free Color Picker tool to pick any color and get HEX, RGB, and HSL values. Copy color codes with one click.",
  keywords: "color picker, hex color, rgb to hex, color code picker, color converter, hsl color",
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return null;
  return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPickerPage() {
  const [hex, setHex] = useState<string>("#2563eb");
  const [copied, setCopied] = useState<string>("");

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const handleHexInput = useCallback((val: string) => {
    let clean = val.startsWith("#") ? val : "#" + val;
    if (clean.length <= 7) setHex(clean);
  }, []);

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
    });
  }

  const colorValues = rgb && hsl
    ? [
        { label: "HEX", value: hex.toUpperCase() },
        { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
        { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
      ]
    : [];

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/color-picker`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Color Picker</h1>
        <p className="text-[var(--muted)] mb-8">
          Pick any color and get its HEX, RGB, and HSL values. Copy color codes with one click.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="tool-card">
            <label className="block text-sm font-medium mb-3">Pick a Color</label>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="w-20 h-20 rounded-lg cursor-pointer border-0 p-0"
              />
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">HEX Code</label>
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => handleHexInput(e.target.value)}
                  className="input-field font-mono"
                  placeholder="#2563eb"
                  maxLength={7}
                />
              </div>
            </div>

            <div
              className="w-full h-32 rounded-xl border border-[var(--card-border)]"
              style={{ background: hex }}
            />
          </div>

          <div className="tool-card">
            <h3 className="font-bold mb-4">Color Values</h3>
            <div className="space-y-4">
              {colorValues.map((item) => (
                <div key={item.label}>
                  <label className="block text-sm font-medium mb-1">{item.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={item.value}
                      className="input-field font-mono flex-1"
                    />
                    <button
                      onClick={() => copy(item.value, item.label)}
                      className="btn-primary text-sm"
                    >
                      {copied === item.label ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {rgb && (
              <div className="mt-6">
                <h4 className="font-medium text-sm mb-2">Individual RGB Values</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg" style={{ background: `rgb(${rgb.r},0,0)`, color: "#fff" }}>
                    <p className="text-xs">R</p>
                    <p className="font-bold">{rgb.r}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg" style={{ background: `rgb(0,${rgb.g},0)`, color: "#fff" }}>
                    <p className="text-xs">G</p>
                    <p className="font-bold">{rgb.g}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg" style={{ background: `rgb(0,0,${rgb.b})`, color: "#fff" }}>
                    <p className="text-xs">B</p>
                    <p className="font-bold">{rgb.b}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is a Color Picker?</h2>
          <p>
            A Color Picker is a tool that lets you select any color visually and converts it into different color
            code formats like HEX, RGB, and HSL. These color codes are used in web development, graphic design,
            and digital art.
          </p>

          <h2>Color Formats Explained</h2>
          <ul>
            <li>
              <strong>HEX:</strong> A 6-character code preceded by #. Each pair represents Red, Green, and Blue
              values in hexadecimal (e.g., #2563EB).
            </li>
            <li>
              <strong>RGB:</strong> Specifies Red, Green, and Blue values from 0-255 (e.g., rgb(37, 99, 235)).
            </li>
            <li>
              <strong>HSL:</strong> Defines color using Hue (0-360), Saturation (0-100%), and Lightness (0-100%)
              (e.g., hsl(221, 83%, 53%)).
            </li>
          </ul>

          <h2>Common Use Cases</h2>
          <ul>
            <li>Web development — CSS color codes</li>
            <li>Graphic design — matching brand colors</li>
            <li>UI/UX design — creating color palettes</li>
            <li>Digital art — selecting and mixing colors</li>
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
            name: "Color Picker",
            description: META.description,
            url: `${SITE_URL}/tools/color-picker`,
            applicationCategory: "DesignApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
