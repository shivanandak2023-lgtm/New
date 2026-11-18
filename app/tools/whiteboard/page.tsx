"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Online Whiteboard - Free Drawing Tool",
  description:
    "Free online whiteboard with pen, eraser, line, rectangle, and circle tools. Color picker, stroke width, undo/redo, and download as PNG. Touch support for mobile.",
  keywords: "online whiteboard, drawing tool, canvas drawing, whiteboard app, free whiteboard, sketch online",
};

type Tool = "pen" | "eraser" | "line" | "rect" | "circle";

interface DrawAction {
  imageData: ImageData;
}

export default function WhiteboardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [undoStack, setUndoStack] = useState<DrawAction[]>([]);
  const [redoStack, setRedoStack] = useState<DrawAction[]>([]);
  const snapshotRef = useRef<ImageData | null>(null);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.clientWidth;
    canvas.height = 500;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  function saveState() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack((prev) => [...prev, { imageData }]);
    setRedoStack([]);
  }

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  function handleStart(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    saveState();
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setIsDrawing(true);

    const pos = getPos(e);
    setStartPos(pos);

    if (tool === "pen" || tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  }

  function handleMove(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e);

    if (tool === "pen") {
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.globalCompositeOperation = "source-over";
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === "eraser") {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = strokeWidth * 3;
      ctx.globalCompositeOperation = "source-over";
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (snapshotRef.current) {
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();
      if (tool === "line") {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
      } else if (tool === "rect") {
        ctx.rect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === "circle") {
        const rx = Math.abs(pos.x - startPos.x) / 2;
        const ry = Math.abs(pos.y - startPos.y) / 2;
        const cx = startPos.x + (pos.x - startPos.x) / 2;
        const cy = startPos.y + (pos.y - startPos.y) / 2;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      }
      ctx.stroke();
    }
  }

  function handleEnd(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    setIsDrawing(false);
    snapshotRef.current = null;
  }

  function undo() {
    const canvas = canvasRef.current;
    if (!canvas || undoStack.length === 0) return;
    const ctx = canvas.getContext("2d")!;
    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setRedoStack((prev) => [...prev, { imageData: current }]);

    const prev = undoStack[undoStack.length - 1];
    ctx.putImageData(prev.imageData, 0, 0);
    setUndoStack((s) => s.slice(0, -1));
  }

  function redo() {
    const canvas = canvasRef.current;
    if (!canvas || redoStack.length === 0) return;
    const ctx = canvas.getContext("2d")!;
    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack((prev) => [...prev, { imageData: current }]);

    const next = redoStack[redoStack.length - 1];
    ctx.putImageData(next.imageData, 0, 0);
    setRedoStack((s) => s.slice(0, -1));
  }

  function clearAll() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    saveState();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "whiteboard.png";
    a.click();
  }

  const tools: { id: Tool; label: string; icon: string }[] = [
    { id: "pen", label: "Pen", icon: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" },
    { id: "eraser", label: "Eraser", icon: "M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.01 4.01 0 01-2.83 1.17H4v-2h5.17c.53 0 1.04-.21 1.41-.59l2.83-2.83-4.95-4.95 5.66-5.66a2.01 2.01 0 012.12-.11z" },
    { id: "line", label: "Line", icon: "M4 20L20 4" },
    { id: "rect", label: "Rectangle", icon: "M3 3h18v18H3z" },
    { id: "circle", label: "Circle", icon: "M12 2a10 10 0 100 20 10 10 0 000-20z" },
  ];

  const COLORS = ["#000000", "#FF0000", "#FF6B00", "#FFD600", "#00C853", "#2979FF", "#AA00FF", "#ffffff"];

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/whiteboard`} />
      

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Online Whiteboard</h1>
        <p className="text-[var(--muted)] mb-8">
          Draw, sketch, and create with a simple canvas-based drawing tool.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tool === t.id ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
                title={t.label}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={t.icon} />
                </svg>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}

            <div className="w-px h-8 bg-[var(--card-border)] mx-1" />

            <div className="flex items-center gap-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    color === c ? "border-[var(--primary)] scale-110" : "border-[var(--card-border)]"
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-7 h-7 cursor-pointer rounded"
                title="Custom color"
              />
            </div>

            <div className="w-px h-8 bg-[var(--card-border)] mx-1" />

            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted)]">Size:</span>
              <input
                type="range"
                min={1}
                max={20}
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-20 accent-[var(--primary)]"
              />
              <span className="text-xs">{strokeWidth}px</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={undo} disabled={undoStack.length === 0} className="px-3 py-1 text-sm border border-[var(--card-border)] rounded-lg hover:border-[var(--primary)] disabled:opacity-40">
              Undo
            </button>
            <button onClick={redo} disabled={redoStack.length === 0} className="px-3 py-1 text-sm border border-[var(--card-border)] rounded-lg hover:border-[var(--primary)] disabled:opacity-40">
              Redo
            </button>
            <button onClick={clearAll} className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
              Clear All
            </button>
            <button onClick={download} className="px-3 py-1 text-sm border border-[var(--card-border)] rounded-lg hover:border-[var(--primary)]">
              Download PNG
            </button>
          </div>

          <div className="border border-[var(--card-border)] rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              className="w-full cursor-crosshair touch-none"
              style={{ height: 500 }}
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
            />
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Online Whiteboard Features</h2>
          <p>
            A simple yet powerful canvas-based drawing tool that runs entirely in your browser.
            Draw freehand, create shapes, erase, and download your work as a PNG image.
          </p>

          <h2>Available Tools</h2>
          <ul>
            <li><strong>Pen</strong> — Freehand drawing with customizable color and size</li>
            <li><strong>Eraser</strong> — Erase parts of your drawing</li>
            <li><strong>Line</strong> — Draw straight lines between two points</li>
            <li><strong>Rectangle</strong> — Draw rectangles and squares</li>
            <li><strong>Circle</strong> — Draw circles and ellipses</li>
          </ul>

          <h2>Touch Support</h2>
          <p>
            The whiteboard fully supports touch input, making it usable on tablets and smartphones.
            Draw with your finger or a stylus.
          </p>

          <h2>Privacy</h2>
          <p>
            All drawing happens locally in your browser. Nothing is uploaded to any server.
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
            name: "Online Whiteboard",
            description: META.description,
            url: `${SITE_URL}/tools/whiteboard`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
