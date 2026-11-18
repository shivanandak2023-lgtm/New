"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Handwriting Generator - Create Handwritten Text Online",
  description:
    "Generate handwriting-style text with 10+ Google Fonts. Download as PNG with notebook paper backgrounds. Create handwritten notes, letters, and assignments.",
  keywords: "handwriting generator, handwriting font, handwritten text, fake handwriting, handwriting style text, notebook paper generator",
};

interface FontOption {
  name: string;
  family: string;
  style: string;
}

const FONTS: FontOption[] = [
  { name: "Caveat", family: "Caveat", style: "cursive" },
  { name: "Indie Flower", family: "Indie Flower", style: "cursive" },
  { name: "Patrick Hand", family: "Patrick Hand", style: "cursive" },
  { name: "Shadows Into Light", family: "Shadows Into Light", style: "cursive" },
  { name: "Architects Daughter", family: "Architects Daughter", style: "cursive" },
  { name: "Reenie Beanie", family: "Reenie Beanie", style: "cursive" },
  { name: "Coming Soon", family: "Coming Soon", style: "cursive" },
  { name: "Gloria Hallelujah", family: "Gloria Hallelujah", style: "cursive" },
  { name: "Kalam", family: "Kalam", style: "cursive" },
  { name: "Handlee", family: "Handlee", style: "cursive" },
];

type PaperStyle = "lined" | "grid" | "blank" | "vintage";
type PenColor = "#1a3c8f" | "#000000" | "#cc0000";

const PEN_COLORS: { label: string; value: PenColor }[] = [
  { label: "Blue Pen", value: "#1a3c8f" },
  { label: "Black Pen", value: "#000000" },
  { label: "Red Pen", value: "#cc0000" },
];

const PAPER_STYLES: { label: string; value: PaperStyle }[] = [
  { label: "Lined", value: "lined" },
  { label: "Grid", value: "grid" },
  { label: "Blank", value: "blank" },
  { label: "Vintage", value: "vintage" },
];

function getFontUrl(fonts: FontOption[]) {
  const families = fonts.map((f) => f.family.replace(/\s+/g, "+")).join("&family=");
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
}

function drawPaper(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  style: PaperStyle,
  lineSpacing: number
) {
  if (style === "vintage") {
    ctx.fillStyle = "#f5e6c8";
  } else {
    ctx.fillStyle = "#ffffff";
  }
  ctx.fillRect(0, 0, w, h);

  if (style === "vintage") {
    ctx.fillStyle = "rgba(139, 90, 43, 0.03)";
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const s = Math.random() * 3 + 1;
      ctx.fillRect(x, y, s, s);
    }
  }

  if (style === "lined" || style === "vintage") {
    // Red margin line
    ctx.strokeStyle = style === "vintage" ? "rgba(180, 60, 60, 0.4)" : "#e88e8e";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 0);
    ctx.lineTo(80, h);
    ctx.stroke();

    // Blue horizontal lines
    ctx.strokeStyle = style === "vintage" ? "rgba(100, 130, 180, 0.3)" : "#c8d8f0";
    ctx.lineWidth = 0.5;
    for (let y = lineSpacing + 40; y < h; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  if (style === "grid") {
    ctx.strokeStyle = "#d8e4f0";
    ctx.lineWidth = 0.5;
    const gridSize = 20;
    for (let x = gridSize; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = gridSize; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }
}

export default function HandwritingGeneratorPage() {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog.");
  const [selectedFont, setSelectedFont] = useState(0);
  const [fontSize, setFontSize] = useState(28);
  const [lineSpacing, setLineSpacing] = useState(36);
  const [penColor, setPenColor] = useState<PenColor>("#1a3c8f");
  const [paperStyle, setPaperStyle] = useState<PaperStyle>("lined");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = getFontUrl(FONTS);
    link.onload = () => {
      setTimeout(() => setFontsLoaded(true), 500);
    };
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 800;
    const lines = text.split("\n");
    const marginLeft = paperStyle === "lined" || paperStyle === "vintage" ? 95 : 40;
    const marginTop = 50;
    const maxWidth = w - marginLeft - 40;

    // Pre-calculate wrapped lines
    const font = FONTS[selectedFont];
    ctx.font = `${fontSize}px "${font.family}", ${font.style}`;

    const wrappedLines: string[] = [];
    for (const line of lines) {
      if (!line.trim()) {
        wrappedLines.push("");
        continue;
      }
      const words = line.split(" ");
      let currentLine = "";
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          wrappedLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) wrappedLines.push(currentLine);
    }

    const h = Math.max(600, marginTop + wrappedLines.length * lineSpacing + 60);
    canvas.width = w;
    canvas.height = h;

    drawPaper(ctx, w, h, paperStyle, lineSpacing);

    ctx.font = `${fontSize}px "${font.family}", ${font.style}`;
    ctx.fillStyle = penColor;
    ctx.textBaseline = "top";

    for (let i = 0; i < wrappedLines.length; i++) {
      const y = marginTop + i * lineSpacing;
      ctx.fillText(wrappedLines[i], marginLeft, y);
    }
  }, [text, selectedFont, fontSize, lineSpacing, penColor, paperStyle]);

  useEffect(() => {
    if (fontsLoaded) renderCanvas();
  }, [fontsLoaded, renderCanvas]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderCanvas();
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "handwriting.png";
    a.click();
  }

  const paperBg: Record<PaperStyle, string> = {
    lined: "#ffffff",
    grid: "#ffffff",
    blank: "#ffffff",
    vintage: "#f5e6c8",
  };

  const paperCss = (style: PaperStyle): React.CSSProperties => {
    const base: React.CSSProperties = {
      background: paperBg[style],
      minHeight: "300px",
      padding: "30px 20px 30px 60px",
      position: "relative",
      fontFamily: `"${FONTS[selectedFont].family}", ${FONTS[selectedFont].style}`,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineSpacing}px`,
      color: penColor,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    };

    if (style === "lined" || style === "vintage") {
      base.backgroundImage = `repeating-linear-gradient(transparent, transparent ${lineSpacing - 1}px, ${style === "vintage" ? "rgba(100,130,180,0.3)" : "#c8d8f0"} ${lineSpacing - 1}px, ${style === "vintage" ? "rgba(100,130,180,0.3)" : "#c8d8f0"} ${lineSpacing}px)`;
      base.backgroundPosition = "0 29px";
      base.borderLeft = `1px solid ${style === "vintage" ? "rgba(180,60,60,0.4)" : "#e88e8e"}`;
      base.marginLeft = "20px";
      base.paddingLeft = "15px";
    }

    if (style === "grid") {
      base.backgroundImage =
        "linear-gradient(to right, #d8e4f0 1px, transparent 1px), linear-gradient(to bottom, #d8e4f0 1px, transparent 1px)";
      base.backgroundSize = "20px 20px";
    }

    return base;
  };

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/handwriting-generator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Handwriting Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Create handwriting-style text with beautiful fonts. Download as PNG with notebook paper backgrounds.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <label className="block text-sm font-medium mb-1">Enter Your Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-field min-h-[120px] resize-y"
            placeholder="Type your text here..."
          />
        </div>

        <div className="tool-card mb-6">
          <h3 className="text-sm font-semibold mb-3">Choose a Handwriting Font</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FONTS.map((font, i) => (
              <button
                key={font.name}
                onClick={() => setSelectedFont(i)}
                className={`p-3 rounded-lg text-left transition-all border ${
                  selectedFont === i
                    ? "border-[var(--primary)] bg-[var(--primary-light)] shadow-sm"
                    : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--primary)]"
                }`}
              >
                <span className="text-xs text-[var(--muted)] block mb-1">{font.name}</span>
                <span
                  style={{
                    fontFamily: `"${font.family}", ${font.style}`,
                    fontSize: "20px",
                  }}
                >
                  {text.slice(0, 30) || "The quick brown fox"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="tool-card mb-6">
          <h3 className="text-sm font-semibold mb-3">Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Font Size: {fontSize}px</label>
              <input
                type="range"
                min="16"
                max="48"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Line Spacing: {lineSpacing}px</label>
              <input
                type="range"
                min="20"
                max="60"
                value={lineSpacing}
                onChange={(e) => setLineSpacing(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Pen Color</label>
            <div className="flex gap-2">
              {PEN_COLORS.map((pc) => (
                <button
                  key={pc.value}
                  onClick={() => setPenColor(pc.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all border ${
                    penColor === pc.value
                      ? "border-[var(--primary)] bg-[var(--primary-light)]"
                      : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--primary)]"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: pc.value }}
                  />
                  {pc.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Paper Style</label>
            <div className="flex flex-wrap gap-2">
              {PAPER_STYLES.map((ps) => (
                <button
                  key={ps.value}
                  onClick={() => setPaperStyle(ps.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${
                    paperStyle === ps.value
                      ? "border-[var(--primary)] bg-[var(--primary-light)]"
                      : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--primary)]"
                  }`}
                >
                  {ps.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="tool-card mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Preview</h3>
            <button onClick={download} className="btn-primary text-sm" disabled={!fontsLoaded}>
              Download as PNG
            </button>
          </div>

          <div className="border border-[var(--card-border)] rounded-lg overflow-hidden shadow-inner">
            <div style={paperCss(paperStyle)}>
              {text || "Start typing to see your handwriting preview..."}
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div className="ad-placeholder my-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is the Handwriting Generator?</h2>
          <p>
            The Handwriting Generator converts your typed text into beautiful handwriting-style text using real
            handwriting fonts from Google Fonts. You can choose from 10+ different handwriting styles, customize the pen
            color, adjust font size and spacing, and select from various paper backgrounds including lined notebook
            paper, grid paper, blank paper, and vintage-style paper.
          </p>

          <h2>How to Use</h2>
          <ul>
            <li>Type or paste your text in the text area</li>
            <li>Choose a handwriting font from the preview cards</li>
            <li>Customize pen color (blue, black, or red)</li>
            <li>Select a paper style (lined, grid, blank, or vintage)</li>
            <li>Adjust font size and line spacing to your preference</li>
            <li>Click &ldquo;Download as PNG&rdquo; to save your handwritten text</li>
          </ul>

          <h2>Use Cases</h2>
          <ul>
            <li>Create handwritten-looking notes and letters</li>
            <li>Design invitations with a personal touch</li>
            <li>Make handwriting-style social media posts</li>
            <li>Generate realistic notebook-style content</li>
            <li>Create unique greeting cards</li>
            <li>Add a personal feel to digital documents</li>
          </ul>

          <h2>Available Fonts</h2>
          <p>
            This tool includes 10 carefully selected Google Fonts that mimic real handwriting: Caveat, Indie Flower,
            Patrick Hand, Shadows Into Light, Architects Daughter, Reenie Beanie, Coming Soon, Gloria Hallelujah, Kalam,
            and Handlee. Each font has its own unique character and style.
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
            name: "Handwriting Generator",
            description: META.description,
            url: `${SITE_URL}/tools/handwriting-generator`,
            applicationCategory: "DesignApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
