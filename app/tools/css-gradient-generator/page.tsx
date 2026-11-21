"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "CSS Gradient Generator - Create Beautiful Gradients Free",
  description:
    "Free CSS gradient generator. Create linear, radial, and conic gradients with color stops, angle control, and 20 beautiful presets. Copy CSS code instantly.",
  keywords:
    "css gradient generator, gradient maker, background gradient css, linear gradient, radial gradient, conic gradient",
};

type GradientType = "linear" | "radial" | "conic";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

const PRESETS: { name: string; type: GradientType; angle: number; stops: { color: string; position: number }[] }[] = [
  { name: "Sunset", type: "linear", angle: 135, stops: [{ color: "#FF512F", position: 0 }, { color: "#F09819", position: 100 }] },
  { name: "Ocean Blue", type: "linear", angle: 135, stops: [{ color: "#2193b0", position: 0 }, { color: "#6dd5ed", position: 100 }] },
  { name: "Purple Love", type: "linear", angle: 135, stops: [{ color: "#cc2b5e", position: 0 }, { color: "#753a88", position: 100 }] },
  { name: "Lush", type: "linear", angle: 135, stops: [{ color: "#56ab2f", position: 0 }, { color: "#a8e063", position: 100 }] },
  { name: "Neon", type: "linear", angle: 90, stops: [{ color: "#00f260", position: 0 }, { color: "#0575e6", position: 100 }] },
  { name: "Warm Flame", type: "linear", angle: 45, stops: [{ color: "#ff9a9e", position: 0 }, { color: "#fad0c4", position: 100 }] },
  { name: "Night Sky", type: "linear", angle: 180, stops: [{ color: "#0F2027", position: 0 }, { color: "#203A43", position: 50 }, { color: "#2C5364", position: 100 }] },
  { name: "Citrus", type: "linear", angle: 90, stops: [{ color: "#FDC830", position: 0 }, { color: "#F37335", position: 100 }] },
  { name: "Royal", type: "linear", angle: 135, stops: [{ color: "#141E30", position: 0 }, { color: "#243B55", position: 100 }] },
  { name: "Peach", type: "linear", angle: 90, stops: [{ color: "#ffecd2", position: 0 }, { color: "#fcb69f", position: 100 }] },
  { name: "Frozen", type: "linear", angle: 180, stops: [{ color: "#403b4a", position: 0 }, { color: "#e7e9bb", position: 100 }] },
  { name: "Emerald", type: "linear", angle: 135, stops: [{ color: "#348F50", position: 0 }, { color: "#56B4D3", position: 100 }] },
  { name: "Raspberry", type: "linear", angle: 90, stops: [{ color: "#a71d5d", position: 0 }, { color: "#3949AB", position: 100 }] },
  { name: "Candy", type: "linear", angle: 45, stops: [{ color: "#D585FF", position: 0 }, { color: "#00FFEE", position: 100 }] },
  { name: "Fire", type: "linear", angle: 90, stops: [{ color: "#f12711", position: 0 }, { color: "#f5af19", position: 100 }] },
  { name: "Sky", type: "radial", angle: 0, stops: [{ color: "#e0eafc", position: 0 }, { color: "#cfdef3", position: 100 }] },
  { name: "Aurora", type: "linear", angle: 135, stops: [{ color: "#00c6ff", position: 0 }, { color: "#0072ff", position: 50 }, { color: "#7c3aed", position: 100 }] },
  { name: "Lavender", type: "linear", angle: 90, stops: [{ color: "#C9D6FF", position: 0 }, { color: "#E2E2E2", position: 100 }] },
  { name: "Rainbow", type: "conic", angle: 0, stops: [{ color: "#ff0000", position: 0 }, { color: "#ff8800", position: 17 }, { color: "#ffff00", position: 33 }, { color: "#00ff00", position: 50 }, { color: "#0088ff", position: 67 }, { color: "#8800ff", position: 83 }, { color: "#ff0000", position: 100 }] },
  { name: "Grayscale", type: "linear", angle: 180, stops: [{ color: "#bdc3c7", position: 0 }, { color: "#2c3e50", position: 100 }] },
];

let uidCounter = 0;
function uid(): string {
  return "s" + (uidCounter++);
}

export default function CssGradientGeneratorPage() {
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: "s0", color: "#4A90D9", position: 0 },
    { id: "s1", color: "#9B59B6", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  function getCssString(): string {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ");

    switch (gradientType) {
      case "linear":
        return `linear-gradient(${angle}deg, ${stopsStr})`;
      case "radial":
        return `radial-gradient(circle, ${stopsStr})`;
      case "conic":
        return `conic-gradient(from ${angle}deg, ${stopsStr})`;
    }
  }

  function getFullCss(): string {
    return `background: ${getCssString()};`;
  }

  function addStop() {
    const mid = stops.length > 0 ? Math.round(stops.reduce((a, s) => a + s.position, 0) / stops.length) : 50;
    setStops((prev) => [...prev, { id: uid(), color: "#888888", position: mid }]);
  }

  function removeStop(id: string) {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((s) => s.id !== id));
  }

  function updateStop(id: string, field: "color" | "position", value: string | number) {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  function loadPreset(preset: typeof PRESETS[0]) {
    setGradientType(preset.type);
    setAngle(preset.angle);
    setStops(preset.stops.map((s) => ({ id: uid(), ...s })));
  }

  function copyCss() {
    navigator.clipboard.writeText(getFullCss());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/css-gradient-generator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/css-gradient-generator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">CSS Gradient Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Create beautiful CSS gradients visually. Choose type, colors, and angle, then copy the code. Runs in your browser.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          {/* Preview */}
          <div
            className="w-full rounded-xl mb-6"
            style={{ background: getCssString(), height: "200px" }}
          />

          {/* Type selector */}
          <div className="flex gap-2 mb-4">
            {(["linear", "radial", "conic"] as GradientType[]).map((t) => (
              <button
                key={t}
                onClick={() => setGradientType(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  gradientType === t
                    ? "bg-[var(--primary)] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Angle */}
          {(gradientType === "linear" || gradientType === "conic") && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Angle: {angle}&deg;</label>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
              <div className="flex justify-between text-xs text-[var(--muted)]">
                <span>0&deg;</span>
                <span>360&deg;</span>
              </div>
            </div>
          )}

          {/* Color stops */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Color Stops</label>
              <button onClick={addStop} className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">
                + Add Stop
              </button>
            </div>
            <div className="space-y-2">
              {stops.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={s.color}
                    onChange={(e) => updateStop(s.id, "color", e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={s.color}
                    onChange={(e) => updateStop(s.id, "color", e.target.value)}
                    className="border border-[var(--card-border)] rounded px-2 py-1 text-xs font-mono w-24"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={s.position}
                    onChange={(e) => updateStop(s.id, "position", Number(e.target.value))}
                    className="flex-1 accent-[var(--primary)]"
                  />
                  <span className="text-xs w-10 text-right">{s.position}%</span>
                  <button
                    onClick={() => removeStop(s.id)}
                    disabled={stops.length <= 2}
                    className="text-red-500 hover:text-red-700 disabled:opacity-30 text-sm px-1"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CSS output */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <pre className="text-xs font-mono break-all whitespace-pre-wrap">{getFullCss()}</pre>
          </div>
          <button onClick={copyCss} className="btn-primary w-full">
            {copied ? "Copied!" : "Copy CSS"}
          </button>
        </div>

        {/* Presets */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Gradient Presets</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESETS.map((p) => {
              const sortedStops = [...p.stops].sort((a, b) => a.position - b.position);
              const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ");
              let bg: string;
              switch (p.type) {
                case "linear": bg = `linear-gradient(${p.angle}deg, ${stopsStr})`; break;
                case "radial": bg = `radial-gradient(circle, ${stopsStr})`; break;
                case "conic": bg = `conic-gradient(from ${p.angle}deg, ${stopsStr})`; break;
              }
              return (
                <button
                  key={p.name}
                  onClick={() => loadPreset(p)}
                  className="rounded-lg overflow-hidden border border-[var(--card-border)] hover:border-[var(--primary)] transition-colors"
                >
                  <div className="h-16" style={{ background: bg }} />
                  <p className="text-xs font-medium text-center py-1.5">{p.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Free CSS Gradient Generator</h2>
          <p>
            CSS gradients are one of the most versatile and visually impactful tools in modern web design. They allow you to create smooth transitions between two or more colors without using images, which means faster loading times and infinitely scalable backgrounds. This free CSS gradient generator lets you visually design linear, radial, and conic gradients with full control over color stops, positions, and angles. The tool generates clean, production-ready CSS code that you can copy and paste directly into your stylesheets. No sign-up, no downloads, and no server uploads needed.
          </p>

          <h2>Types of CSS Gradients</h2>
          <p>
            CSS supports three types of gradients. <strong>Linear gradients</strong> transition along a straight line defined by an angle. They are the most commonly used gradient type for backgrounds, buttons, and headers. <strong>Radial gradients</strong> radiate outward from a central point in a circular or elliptical pattern, creating spotlight or vignette effects. <strong>Conic gradients</strong> rotate colors around a center point like a color wheel, useful for pie charts, loading spinners, and artistic effects. This tool supports all three types with intuitive controls.
          </p>

          <h2>How to Use This Gradient Maker</h2>
          <ul>
            <li>Select a gradient type: linear, radial, or conic</li>
            <li>Adjust the angle for linear and conic gradients using the slider</li>
            <li>Add, remove, or modify color stops with the color picker and position slider</li>
            <li>See a live preview of your gradient as you make changes</li>
            <li>Copy the generated CSS code with one click</li>
            <li>Browse 20 beautiful presets for instant inspiration</li>
          </ul>

          <h2>Gradient Design Tips</h2>
          <p>
            For the most appealing gradients, use colors that are close on the color wheel for smooth, natural transitions. Avoid combining colors that are both highly saturated and of very different hues, as this can create a muddy middle zone. Add a third color stop in the middle to create more complex, layered gradients. When using gradients as backgrounds, ensure text placed on top has sufficient contrast for readability. Subtle gradients with low contrast between stops often look more professional than dramatic color shifts, especially for business websites and applications.
          </p>

          <h3>Beautiful Gradient Presets</h3>
          <p>
            Need inspiration? This tool includes 20 hand-picked gradient presets covering a wide range of styles from warm sunsets and cool ocean themes to dramatic neon effects and elegant neutrals. Click any preset to load it instantly, then customize the colors, angle, and stops to make it your own. Each preset has been designed to look great as a full-page background, card header, or button gradient. The Rainbow preset uses a conic gradient for a full spectrum color wheel effect.
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
            name: "CSS Gradient Generator",
            description: META.description,
            url: `${SITE_URL}/tools/css-gradient-generator`,
            applicationCategory: "DesignApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
