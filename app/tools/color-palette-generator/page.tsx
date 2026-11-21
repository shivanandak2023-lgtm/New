"use client";

import { useState, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Color Palette Generator - Create Beautiful Color Schemes Free",
  description:
    "Free color palette generator. Create harmonious color schemes using complementary, analogous, triadic, and more methods. Export as CSS or Tailwind config.",
  keywords:
    "color palette generator, color scheme generator, color combinations, palette maker, color harmony, complementary colors",
};

type Method = "complementary" | "analogous" | "triadic" | "split" | "monochromatic" | "random";

interface PaletteColor {
  hex: string;
  rgb: string;
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
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
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function generatePalette(baseHex: string, method: Method): PaletteColor[] {
  const [h, s, l] = hexToHsl(baseHex);

  let hues: number[];
  let sats: number[];
  let lights: number[];

  switch (method) {
    case "complementary":
      hues = [h, (h + 180) % 360, (h + 30) % 360, (h + 210) % 360, (h + 60) % 360];
      sats = [s, s, s - 10, s - 10, s + 5];
      lights = [l, l, l + 15, l + 15, l - 10];
      break;
    case "analogous":
      hues = [h, (h + 30) % 360, (h + 60) % 360, (h - 30 + 360) % 360, (h - 60 + 360) % 360];
      sats = [s, s, s - 5, s, s - 5];
      lights = [l, l + 10, l + 20, l - 10, l - 20];
      break;
    case "triadic":
      hues = [h, (h + 120) % 360, (h + 240) % 360, (h + 60) % 360, (h + 180) % 360];
      sats = [s, s, s, s - 15, s - 15];
      lights = [l, l, l, l + 20, l + 10];
      break;
    case "split":
      hues = [h, (h + 150) % 360, (h + 210) % 360, (h + 30) % 360, (h + 330) % 360];
      sats = [s, s, s, s - 10, s - 10];
      lights = [l, l, l, l + 15, l + 15];
      break;
    case "monochromatic":
      hues = [h, h, h, h, h];
      sats = [s, s - 10, s - 20, s + 10, s + 5];
      lights = [l, l + 20, l + 40, l - 15, l - 30];
      break;
    case "random":
    default:
      hues = Array.from({ length: 5 }, () => Math.floor(Math.random() * 360));
      sats = Array.from({ length: 5 }, () => 50 + Math.floor(Math.random() * 40));
      lights = Array.from({ length: 5 }, () => 35 + Math.floor(Math.random() * 35));
      break;
  }

  return hues.map((hue, i) => {
    const hex = hslToHex(hue, sats[i], lights[i]);
    return { hex, rgb: hexToRgb(hex) };
  });
}

const POPULAR_PALETTES: { name: string; colors: string[] }[] = [
  { name: "Sunset", colors: ["#FF6B6B", "#FFA07A", "#FFD93D", "#6BCB77", "#4D96FF"] },
  { name: "Ocean", colors: ["#0F4C75", "#3282B8", "#BBE1FA", "#1B262C", "#00B4D8"] },
  { name: "Forest", colors: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#B7E4C7"] },
  { name: "Berry", colors: ["#7B2D8E", "#9B59B6", "#C39BD3", "#E8DAEF", "#F4ECF7"] },
  { name: "Minimal", colors: ["#2C3E50", "#34495E", "#7F8C8D", "#BDC3C7", "#ECF0F1"] },
  { name: "Warm Earth", colors: ["#8B4513", "#CD853F", "#DEB887", "#F5DEB3", "#FAEBD7"] },
  { name: "Neon", colors: ["#FF0080", "#FF8C00", "#FFE600", "#00FF41", "#0080FF"] },
  { name: "Pastel", colors: ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"] },
  { name: "Retro", colors: ["#E63946", "#F1FAEE", "#A8DADC", "#457B9D", "#1D3557"] },
  { name: "Candy", colors: ["#FF6F91", "#FF9671", "#FFC75F", "#F9F871", "#D65DB1"] },
];

export default function ColorPaletteGeneratorPage() {
  const [baseColor, setBaseColor] = useState("#4A90D9");
  const [method, setMethod] = useState<Method>("complementary");
  const [palette, setPalette] = useState<PaletteColor[]>(() => generatePalette("#4A90D9", "complementary"));
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [exportMode, setExportMode] = useState<"css" | "tailwind">("css");

  const generate = useCallback(() => {
    setPalette(generatePalette(baseColor, method));
  }, [baseColor, method]);

  function handleMethodChange(m: Method) {
    setMethod(m);
    setPalette(generatePalette(baseColor, m));
  }

  function handleBaseColorChange(c: string) {
    setBaseColor(c);
    setPalette(generatePalette(c, method));
  }

  function copyColor(hex: string, idx: number) {
    navigator.clipboard.writeText(hex);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  function loadPopularPalette(colors: string[]) {
    setPalette(colors.map((hex) => ({ hex, rgb: hexToRgb(hex) })));
  }

  function getExportCode(): string {
    if (exportMode === "css") {
      return `:root {\n${palette.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join("\n")}\n}`;
    }
    return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${palette
      .map((c, i) => `        'palette-${i + 1}': '${c.hex}',`)
      .join("\n")}\n      }\n    }\n  }\n}`;
  }

  const [exportCopied, setExportCopied] = useState(false);
  function copyExport() {
    navigator.clipboard.writeText(getExportCode());
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 2000);
  }

  const methods: { key: Method; label: string }[] = [
    { key: "complementary", label: "Complementary" },
    { key: "analogous", label: "Analogous" },
    { key: "triadic", label: "Triadic" },
    { key: "split", label: "Split-Complementary" },
    { key: "monochromatic", label: "Monochromatic" },
    { key: "random", label: "Random" },
  ];

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/color-palette-generator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/color-palette-generator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Color Palette Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Generate harmonious color palettes from any base color. Choose a harmony method and export as CSS or Tailwind.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="flex flex-wrap items-end gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Base Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => handleBaseColorChange(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => {
                    if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) handleBaseColorChange(e.target.value);
                    else setBaseColor(e.target.value);
                  }}
                  className="border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm w-28 font-mono"
                />
              </div>
            </div>
            <button onClick={generate} className="btn-primary">
              Generate
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {methods.map((m) => (
              <button
                key={m.key}
                onClick={() => handleMethodChange(m.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  method === m.key
                    ? "bg-[var(--primary)] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-0 rounded-xl overflow-hidden mb-6" style={{ height: "160px" }}>
            {palette.map((c, i) => (
              <button
                key={i}
                onClick={() => copyColor(c.hex, i)}
                className="relative group cursor-pointer transition-transform hover:scale-105 hover:z-10"
                style={{ backgroundColor: c.hex }}
                title={`Click to copy ${c.hex}`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 text-white text-xs font-mono">
                  <span className="font-bold">{copiedIdx === i ? "Copied!" : c.hex}</span>
                  <span className="mt-1 text-[10px]">{c.rgb}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-2 mb-6">
            {palette.map((c, i) => (
              <div key={i} className="text-center">
                <div className="w-full h-8 rounded" style={{ backgroundColor: c.hex }} />
                <p className="text-xs font-mono mt-1">{c.hex}</p>
                <p className="text-[10px] text-[var(--muted)]">{c.rgb}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--card-border)] pt-4">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium">Export as:</label>
              <button
                onClick={() => setExportMode("css")}
                className={`px-3 py-1 rounded text-xs ${exportMode === "css" ? "bg-[var(--primary)] text-white" : "bg-gray-100"}`}
              >
                CSS
              </button>
              <button
                onClick={() => setExportMode("tailwind")}
                className={`px-3 py-1 rounded text-xs ${exportMode === "tailwind" ? "bg-[var(--primary)] text-white" : "bg-gray-100"}`}
              >
                Tailwind
              </button>
            </div>
            <pre className="bg-gray-50 rounded-lg p-3 text-xs font-mono overflow-x-auto">{getExportCode()}</pre>
            <button onClick={copyExport} className="btn-primary mt-2 text-sm">
              {exportCopied ? "Copied!" : "Copy Code"}
            </button>
          </div>
        </div>

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Popular Palettes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {POPULAR_PALETTES.map((p) => (
              <button
                key={p.name}
                onClick={() => loadPopularPalette(p.colors)}
                className="flex items-center gap-3 p-3 rounded-lg border border-[var(--card-border)] hover:border-[var(--primary)] transition-colors text-left"
              >
                <div className="flex gap-0.5 flex-shrink-0">
                  {p.colors.map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="text-sm font-medium">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Free Color Palette Generator</h2>
          <p>
            Choosing the right color palette is one of the most important decisions in any design project. Whether you are designing a website, creating a brand identity, illustrating a poster, or decorating a room, harmonious colors make the difference between amateur and professional results. This free color palette generator helps you create beautiful, balanced color schemes in seconds. Pick a base color, choose a harmony method, and instantly see five coordinated colors with their hex and RGB values. Everything runs in your browser with no sign-up required.
          </p>

          <h2>Color Harmony Methods Explained</h2>
          <p>
            Color harmony is the theory behind which colors look good together. This tool offers six proven methods for generating harmonious palettes. <strong>Complementary</strong> colors sit opposite each other on the color wheel and create high contrast, eye-catching combinations. <strong>Analogous</strong> colors are neighbors on the color wheel, producing calm, comfortable palettes. <strong>Triadic</strong> colors are evenly spaced around the wheel, giving vibrant, balanced results. <strong>Split-complementary</strong> uses a base color and the two colors adjacent to its complement for contrast with less tension. <strong>Monochromatic</strong> uses different shades and tints of a single hue for elegant, unified designs. <strong>Random</strong> generates five unrelated colors for creative experimentation.
          </p>

          <h2>How to Use Color Palettes in Design</h2>
          <ul>
            <li>Use the dominant color for backgrounds and large areas</li>
            <li>Apply secondary colors for headers, buttons, and accents</li>
            <li>Reserve the brightest color for call-to-action elements</li>
            <li>Keep text colors high-contrast against their backgrounds</li>
            <li>Test your palette for color blindness accessibility</li>
          </ul>

          <h2>Export Options</h2>
          <p>
            Once you have a palette you love, export it as CSS custom properties (variables) for easy integration into any web project, or as a Tailwind CSS configuration snippet for Tailwind-based projects. The CSS export creates root-level variables like --color-1 through --color-5 that you can reference throughout your stylesheets. The Tailwind export extends the color theme with named palette colors that work with all Tailwind utility classes. Click to copy any individual color code or the entire export block.
          </p>

          <h3>Popular Pre-Made Palettes</h3>
          <p>
            Need instant inspiration? Browse our collection of ten curated color palettes covering popular themes like Sunset, Ocean, Forest, Neon, Pastel, and more. Each pre-made palette has been carefully selected for visual harmony and versatility. Click any palette to load it instantly, then export the colors in your preferred format. These palettes are great starting points that you can further customize by adjusting the base color or switching harmony methods.
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
            name: "Color Palette Generator",
            description: META.description,
            url: `${SITE_URL}/tools/color-palette-generator`,
            applicationCategory: "DesignApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
