"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Meme Generator - Create Memes Online Free",
  description:
    "Free online meme generator. Upload an image, add top and bottom text with Impact font. Customize font size, position, and style. Download as PNG.",
  keywords: "meme generator, meme maker, create meme, meme creator, impact font meme, meme template",
};

const TEMPLATES = [
  { label: "Drake", color: "#FF6B6B", desc: "Two panel yes/no" },
  { label: "Distracted BF", color: "#4ECDC4", desc: "Looking away meme" },
  { label: "Change My Mind", color: "#45B7D1", desc: "Prove me wrong" },
  { label: "Expanding Brain", color: "#96CEB4", desc: "Levels of thinking" },
  { label: "This Is Fine", color: "#FFEAA7", desc: "Everything is fine" },
  { label: "Stonks", color: "#DDA0DD", desc: "Stonks go up" },
];

export default function MemeGeneratorPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontSize, setFontSize] = useState(48);
  const [textPos, setTextPos] = useState<"top" | "center" | "bottom">("top");
  const [dragActive, setDragActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function handleFile(f: File) {
    if (!f.type.startsWith("image/")) return;
    const url = URL.createObjectURL(f);
    setImageUrl(url);
    const img = new Image();
    img.onload = () => { imgRef.current = img; };
    img.src = url;
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  function selectTemplate(t: typeof TEMPLATES[0]) {
    setImageUrl("");
    imgRef.current = null;
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = t.color;
    ctx.fillRect(0, 0, 600, 600);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(t.label, 300, 310);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      const img = new Image();
      img.onload = () => { imgRef.current = img; };
      img.src = url;
    });
  }

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const w = img.naturalWidth || 600;
    const h = img.naturalHeight || 600;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(img, 0, 0, w, h);

    ctx.font = `bold ${fontSize}px Impact, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = Math.max(2, fontSize / 12);
    ctx.lineJoin = "round";

    const drawText = (text: string, y: number) => {
      const maxWidth = w - 40;
      const words = text.split(" ");
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const test = line ? line + " " + word : word;
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);

      for (let i = 0; i < lines.length; i++) {
        const ly = y + i * (fontSize + 4);
        ctx.strokeText(lines[i], w / 2, ly);
        ctx.fillText(lines[i], w / 2, ly);
      }
    };

    if (topText) {
      const topY = textPos === "center" ? h / 2 - fontSize : fontSize + 10;
      drawText(topText.toUpperCase(), topY);
    }

    if (bottomText) {
      const botY = textPos === "center" ? h / 2 + fontSize : h - 20;
      drawText(bottomText.toUpperCase(), botY);
    }
  }, [topText, bottomText, fontSize, textPos]);

  useEffect(() => {
    if (imgRef.current) drawCanvas();
  }, [drawCanvas, imageUrl]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "meme.png";
    a.click();
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/meme-generator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Meme Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Create memes with custom text. Upload your image or pick a template. Download as PNG.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <p className="text-sm font-medium mb-3">Meme Templates (or upload your own image below)</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                onClick={() => selectTemplate(t)}
                className="rounded-lg p-3 text-center border border-[var(--card-border)] hover:border-[var(--primary)] transition-colors"
                style={{ backgroundColor: t.color + "33" }}
              >
                <div className="w-full aspect-square rounded mb-1 flex items-center justify-center" style={{ backgroundColor: t.color }}>
                  <span className="text-white text-xs font-bold">{t.label}</span>
                </div>
                <p className="text-xs text-[var(--muted)]">{t.desc}</p>
              </button>
            ))}
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors mb-6 ${
              dragActive ? "border-[var(--primary)] bg-blue-50" : "border-[var(--card-border)] hover:border-[var(--primary)]"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <p className="text-sm text-[var(--muted)]">Upload your own image (drag & drop or click)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Top Text</label>
              <input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="TOP TEXT"
                className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bottom Text</label>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="BOTTOM TEXT"
                className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Font Size: {fontSize}px</label>
              <input
                type="range"
                min={16}
                max={120}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Text Position</label>
              <div className="flex gap-2">
                {(["top", "center", "bottom"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setTextPos(p)}
                    className={`flex-1 px-2 py-1 rounded-lg text-sm capitalize transition-colors ${
                      textPos === p ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={drawCanvas} disabled={!imageUrl} className="btn-primary w-full">
            Generate Meme
          </button>
        </div>

        {imageUrl && (
          <div className="result-card mb-8">
            <canvas ref={canvasRef} className="w-full rounded-lg mb-4" />
            <button onClick={download} className="btn-primary w-full">
              Download Meme
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Create a Meme</h2>
          <p>
            Upload an image or select a template, add your top and bottom text, adjust the
            font size, and download your meme as a PNG. The classic meme style uses white
            Impact font with a black outline.
          </p>

          <h2>Meme Text Tips</h2>
          <ul>
            <li>Keep text short and punchy</li>
            <li>Use ALL CAPS for the classic meme look</li>
            <li>Contrast between top and bottom text creates humor</li>
            <li>The tool automatically wraps long text</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            All meme creation happens in your browser using the Canvas API. No images are
            uploaded to any server.
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
            name: "Meme Generator",
            description: META.description,
            url: `${SITE_URL}/tools/meme-generator`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
