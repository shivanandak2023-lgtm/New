"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Free Signature Generator - Create Digital Signatures Online",
  description:
    "Free online signature generator. Type your name and see it in 10+ cursive signature fonts. Draw your own signature. Download as PNG.",
  keywords:
    "signature generator, digital signature, signature maker, cursive signature, online signature, e-signature, sign name",
};

const FONTS = [
  { name: "Dancing Script", family: "'Dancing Script', cursive" },
  { name: "Great Vibes", family: "'Great Vibes', cursive" },
  { name: "Sacramento", family: "'Sacramento', cursive" },
  { name: "Pacifico", family: "'Pacifico', cursive" },
  { name: "Allura", family: "'Allura', cursive" },
  { name: "Alex Brush", family: "'Alex Brush', cursive" },
  { name: "Satisfy", family: "'Satisfy', cursive" },
  { name: "Kaushan Script", family: "'Kaushan Script', cursive" },
  { name: "Marck Script", family: "'Marck Script', cursive" },
  { name: "Tangerine", family: "'Tangerine', cursive" },
];

const FONT_IMPORT_URL =
  "https://fonts.googleapis.com/css2?family=Dancing+Script&family=Great+Vibes&family=Sacramento&family=Pacifico&family=Allura&family=Alex+Brush&family=Satisfy&family=Kaushan+Script&family=Marck+Script&family=Tangerine&display=swap";

const PRESET_COLORS = [
  { label: "Black", value: "#000000" },
  { label: "Blue", value: "#1e40af" },
  { label: "Red", value: "#dc2626" },
];

export default function SignatureGeneratorPage() {
  const [name, setName] = useState("");
  const [selectedFont, setSelectedFont] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#000000");
  const [bgTransparent, setBgTransparent] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [tab, setTab] = useState<"type" | "draw">("type");
  const downloadCanvasRef = useRef<HTMLCanvasElement>(null);

  // Drawing state
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState("#000000");
  const [drawLineWidth, setDrawLineWidth] = useState(3);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_IMPORT_URL;
    document.head.appendChild(link);
    link.onload = () => {
      setTimeout(() => setFontsLoaded(true), 500);
    };
    return () => { document.head.removeChild(link); };
  }, []);

  // Drawing functions
  function getCanvasPoint(e: React.MouseEvent | React.TouchEvent) {
    const canvas = drawCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pt = getCanvasPoint(e);
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawLineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setIsDrawing(true);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pt = getCanvasPoint(e);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
  }

  function endDraw() {
    setIsDrawing(false);
  }

  function clearDrawing() {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function downloadDrawing() {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "signature-drawn.png";
    if (!bgTransparent) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const ctx = tempCanvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      ctx.drawImage(canvas, 0, 0);
      link.href = tempCanvas.toDataURL("image/png");
    } else {
      link.href = canvas.toDataURL("image/png");
    }
    link.click();
  }

  function downloadSignature() {
    if (selectedFont === null || !name) return;
    const font = FONTS[selectedFont];
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.font = `${fontSize * 2}px ${font.family}`;
    const metrics = ctx.measureText(name);
    const width = Math.ceil(metrics.width) + 60;
    const height = fontSize * 3;
    canvas.width = width;
    canvas.height = height;

    if (!bgTransparent) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }

    ctx.font = `${fontSize * 2}px ${font.family}`;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.fillText(name, 30, height / 2);

    const link = document.createElement("a");
    link.download = `signature-${font.name.toLowerCase().replace(/\s/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/signature-generator`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">
            &larr; All Tools
          </a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Signature Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Create a digital signature by typing your name or drawing freehand. Download as PNG.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("type")} className={`px-4 py-2 rounded-lg font-medium text-sm cursor-pointer transition-colors ${tab === "type" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)] text-[var(--foreground)]"}`}>
            Type Signature
          </button>
          <button onClick={() => setTab("draw")} className={`px-4 py-2 rounded-lg font-medium text-sm cursor-pointer transition-colors ${tab === "draw" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)] text-[var(--foreground)]"}`}>
            Draw Signature
          </button>
        </div>

        {tab === "type" && (
          <>
            {/* Input */}
            <div className="tool-card mb-6">
              <h2 className="font-bold text-lg mb-4">Your Name</h2>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field text-lg"
                placeholder="Type your name here..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Font Size: {fontSize}px</label>
                  <input type="range" min="24" max="72" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <div className="flex gap-2 items-center">
                    {PRESET_COLORS.map((pc) => (
                      <button
                        key={pc.value}
                        onClick={() => setColor(pc.value)}
                        className="w-7 h-7 rounded-full border-2 cursor-pointer"
                        style={{ backgroundColor: pc.value, borderColor: color === pc.value ? "#6366f1" : "#d1d5db" }}
                        title={pc.label}
                      />
                    ))}
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-7 h-7 cursor-pointer border-0" title="Custom color" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Background</label>
                  <div className="flex gap-2">
                    <button onClick={() => setBgTransparent(false)} className={`px-3 py-1 rounded text-sm cursor-pointer ${!bgTransparent ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}>White</button>
                    <button onClick={() => setBgTransparent(true)} className={`px-3 py-1 rounded text-sm cursor-pointer ${bgTransparent ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}>Transparent</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {FONTS.map((font, i) => (
                <div
                  key={font.name}
                  onClick={() => setSelectedFont(i)}
                  className={`tool-card cursor-pointer transition-all hover:shadow-md ${selectedFont === i ? "ring-2 ring-[var(--primary)]" : ""}`}
                  style={{ background: bgTransparent ? "repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50%/16px 16px" : "#fff" }}
                >
                  <div
                    style={{
                      fontFamily: font.family,
                      fontSize: `${fontSize}px`,
                      color,
                      padding: "16px 8px",
                      minHeight: "80px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {name || "Your Name"}
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-1">{font.name}</p>
                </div>
              ))}
            </div>

            {/* Selected Preview */}
            {selectedFont !== null && (
              <div className="result-card mb-6">
                <h2 className="font-bold text-lg mb-4">Selected Signature</h2>
                <div
                  className="rounded-lg p-8 mb-4 flex items-center justify-center"
                  style={{
                    background: bgTransparent ? "repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50%/16px 16px" : "#fff",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ fontFamily: FONTS[selectedFont].family, fontSize: `${Math.min(fontSize * 1.5, 72)}px`, color }}>
                    {name || "Your Name"}
                  </div>
                </div>
                <button onClick={downloadSignature} className="btn-primary px-6 py-2" disabled={!name}>
                  Download as PNG
                </button>
              </div>
            )}
          </>
        )}

        {tab === "draw" && (
          <div className="tool-card mb-6">
            <h2 className="font-bold text-lg mb-4">Draw Your Signature</h2>
            <div className="flex gap-4 mb-4 flex-wrap items-center">
              <div>
                <label className="block text-xs font-medium mb-1">Pen Color</label>
                <div className="flex gap-2 items-center">
                  {PRESET_COLORS.map((pc) => (
                    <button
                      key={pc.value}
                      onClick={() => setDrawColor(pc.value)}
                      className="w-6 h-6 rounded-full border-2 cursor-pointer"
                      style={{ backgroundColor: pc.value, borderColor: drawColor === pc.value ? "#6366f1" : "#d1d5db" }}
                      title={pc.label}
                    />
                  ))}
                  <input type="color" value={drawColor} onChange={(e) => setDrawColor(e.target.value)} className="w-6 h-6 cursor-pointer border-0" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Line Width: {drawLineWidth}px</label>
                <input type="range" min="1" max="8" value={drawLineWidth} onChange={(e) => setDrawLineWidth(Number(e.target.value))} className="w-24" />
              </div>
              <div className="flex items-end gap-2">
                <button onClick={clearDrawing} className="btn-secondary text-sm">Clear</button>
                <button onClick={downloadDrawing} className="btn-primary text-sm">Download PNG</button>
              </div>
            </div>
            <div
              className="border-2 border-dashed border-[var(--card-border)] rounded-lg overflow-hidden"
              style={{ background: bgTransparent ? "repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50%/16px 16px" : "#fff", touchAction: "none" }}
            >
              <canvas
                ref={drawCanvasRef}
                width={800}
                height={300}
                className="w-full cursor-crosshair"
                style={{ display: "block" }}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />
            </div>
            <p className="text-xs text-[var(--muted)] mt-2">Use your mouse or finger to draw your signature</p>
          </div>
        )}

        <canvas ref={downloadCanvasRef} className="hidden" />

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Free Digital Signature Generator</h2>
          <p>
            Create a professional-looking digital signature instantly. Type your name and choose from 10+ beautiful
            cursive and handwriting fonts, or draw your own signature freehand. Download as a transparent PNG for
            use in documents, emails, and digital contracts.
          </p>

          <h2>How to Use This Signature Generator</h2>
          <ul>
            <li><strong>Type your name:</strong> Enter your name and browse 10+ signature fonts</li>
            <li><strong>Customize:</strong> Adjust font size, color, and background transparency</li>
            <li><strong>Select a style:</strong> Click on any signature card to select it</li>
            <li><strong>Download:</strong> Click &quot;Download as PNG&quot; to save your signature</li>
            <li><strong>Draw:</strong> Switch to the Draw tab to create a freehand signature with mouse or touch</li>
          </ul>

          <h2>Use Cases for Digital Signatures</h2>
          <ul>
            <li>Email signatures and business correspondence</li>
            <li>PDF documents and contracts</li>
            <li>Personal branding and letterheads</li>
            <li>Social media and blog posts</li>
            <li>Certificates and digital artwork</li>
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
            name: "Signature Generator",
            description: META.description,
            url: `${SITE_URL}/tools/signature-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
