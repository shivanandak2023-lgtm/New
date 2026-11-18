"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Image Cropper - Crop Images Online Free",
  description:
    "Free online image cropper. Upload an image, select a crop area with preset aspect ratios, and download the cropped result. No upload to server.",
  keywords: "image cropper, crop image, crop photo online, image crop tool, photo cropper",
};

type Rect = { x: number; y: number; w: number; h: number };
type AspectRatio = { label: string; value: number | null };

const RATIOS: AspectRatio[] = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:2", value: 3 / 2 },
  { label: "9:16", value: 9 / 16 },
  { label: "2:3", value: 2 / 3 },
];

export default function ImageCropperPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState<Rect>({ x: 50, y: 50, w: 200, h: 200 });
  const [ratio, setRatio] = useState<number | null>(null);
  const [croppedUrl, setCroppedUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cx: 0, cy: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!f.type.startsWith("image/")) return;
    setOriginalFile(f);
    setCroppedUrl("");
    const url = URL.createObjectURL(f);
    setImgUrl(url);

    const img = new Image();
    img.onload = () => {
      setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
      const initialSize = Math.min(200, img.naturalWidth / 2, img.naturalHeight / 2);
      setCrop({
        x: (img.naturalWidth - initialSize) / 2,
        y: (img.naturalHeight - initialSize) / 2,
        w: initialSize,
        h: ratio ? initialSize / ratio : initialSize,
      });
    };
    img.src = url;
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  function getScale() {
    if (!imgRef.current || imgSize.w === 0) return 1;
    return imgRef.current.clientWidth / imgSize.w;
  }

  const onMouseDown = useCallback(
    (e: React.MouseEvent, type: "move" | "resize") => {
      e.preventDefault();
      e.stopPropagation();
      const scale = getScale();
      if (type === "move") {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY, cx: crop.x * scale, cy: crop.y * scale });
      } else {
        setIsResizing(true);
        setDragStart({ x: e.clientX, y: e.clientY, cx: crop.w * scale, cy: crop.h * scale });
      }
    },
    [crop]
  );

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const scale = getScale();
      if (scale === 0) return;

      if (isDragging) {
        const dx = (e.clientX - dragStart.x);
        const dy = (e.clientY - dragStart.y);
        let nx = (dragStart.cx + dx) / scale;
        let ny = (dragStart.cy + dy) / scale;
        nx = Math.max(0, Math.min(nx, imgSize.w - crop.w));
        ny = Math.max(0, Math.min(ny, imgSize.h - crop.h));
        setCrop((prev) => ({ ...prev, x: nx, y: ny }));
      }

      if (isResizing) {
        const dx = (e.clientX - dragStart.x);
        const dy = (e.clientY - dragStart.y);
        let nw = (dragStart.cx + dx) / scale;
        let nh = (dragStart.cy + dy) / scale;
        nw = Math.max(20, Math.min(nw, imgSize.w - crop.x));
        if (ratio) {
          nh = nw / ratio;
        } else {
          nh = Math.max(20, Math.min(nh, imgSize.h - crop.y));
        }
        if (crop.y + nh > imgSize.h) {
          nh = imgSize.h - crop.y;
          if (ratio) nw = nh * ratio;
        }
        setCrop((prev) => ({ ...prev, w: nw, h: nh }));
      }
    }

    function onMouseUp() {
      setIsDragging(false);
      setIsResizing(false);
    }

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, crop, imgSize, ratio]);

  function applyRatio(r: number | null) {
    setRatio(r);
    if (r) {
      setCrop((prev) => {
        const nh = prev.w / r;
        return { ...prev, h: Math.min(nh, imgSize.h - prev.y) };
      });
    }
  }

  function cropImage() {
    if (!originalFile || imgSize.w === 0) return;

    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(crop.w);
      canvas.height = Math.round(crop.h);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        img,
        Math.round(crop.x),
        Math.round(crop.y),
        Math.round(crop.w),
        Math.round(crop.h),
        0,
        0,
        Math.round(crop.w),
        Math.round(crop.h)
      );
      setCroppedUrl(canvas.toDataURL("image/png"));
    };
  }

  function download() {
    if (!croppedUrl || !originalFile) return;
    const a = document.createElement("a");
    a.href = croppedUrl;
    a.download = `cropped-${originalFile.name.replace(/\.[^.]+$/, "")}.png`;
    a.click();
  }

  const scale = imgRef.current && imgSize.w ? imgRef.current.clientWidth / imgSize.w : 1;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/image-cropper`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Image Cropper</h1>
        <p className="text-[var(--muted)] mb-8">
          Upload an image, drag to position the crop area, and download the cropped result. Supports preset aspect ratios.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          {!originalFile && (
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
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
              <svg className="mx-auto mb-3 text-[var(--muted)]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-[var(--muted)]">Drag & drop an image or click to browse</p>
            </div>
          )}

          {originalFile && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {RATIOS.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => applyRatio(r.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      (ratio === null && r.value === null) || ratio === r.value
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--card-bg)] border border-[var(--card-border)]"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <div
                ref={containerRef}
                className="relative inline-block w-full overflow-hidden rounded-lg bg-gray-100 select-none"
              >
                <img
                  ref={imgRef}
                  src={imgUrl}
                  alt="Source"
                  className="w-full block"
                  draggable={false}
                />
                {/* Overlay */}
                <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.4)" }}>
                  {/* Clear crop area */}
                  <div
                    className="absolute border-2 border-white cursor-move"
                    style={{
                      left: crop.x * scale,
                      top: crop.y * scale,
                      width: crop.w * scale,
                      height: crop.h * scale,
                      background: "transparent",
                      boxShadow: `0 0 0 9999px rgba(0,0,0,0.4)`,
                    }}
                    onMouseDown={(e) => onMouseDown(e, "move")}
                  >
                    {/* Resize handle */}
                    <div
                      className="absolute -bottom-2 -right-2 w-5 h-5 bg-white border-2 border-[var(--primary)] rounded-full cursor-se-resize"
                      onMouseDown={(e) => onMouseDown(e, "resize")}
                    />
                    {/* Grid lines */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/40" />
                      <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/40" />
                      <div className="absolute top-1/3 left-0 right-0 h-px bg-white/40" />
                      <div className="absolute top-2/3 left-0 right-0 h-px bg-white/40" />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[var(--muted)] mt-2">
                Crop: {Math.round(crop.w)} x {Math.round(crop.h)} px
              </p>

              <div className="flex gap-3 mt-4">
                <button onClick={cropImage} className="btn-primary flex-1">Crop Image</button>
                <button
                  onClick={() => { setOriginalFile(null); setImgUrl(""); setCroppedUrl(""); }}
                  className="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-sm"
                >
                  Reset
                </button>
              </div>
            </>
          )}
        </div>

        {croppedUrl && (
          <div className="result-card mb-8">
            <h2 className="text-lg font-bold mb-4">Cropped Image</h2>
            <div style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' width='10' height='10' fill='%23fff'/%3E%3Crect y='10' width='10' height='10' fill='%23fff'/%3E%3C/svg%3E\")" }} className="rounded-lg overflow-hidden mb-4">
              <img src={croppedUrl} alt="Cropped" className="max-w-full" />
            </div>
            <button onClick={download} className="btn-primary w-full">Download Cropped Image</button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does Image Cropping Work?</h2>
          <p>
            This tool lets you visually select a rectangular area of your image. Drag to move the crop box
            and use the corner handle to resize it. The cropped area is extracted using HTML5 Canvas and
            saved as a PNG.
          </p>

          <h2>Preset Aspect Ratios</h2>
          <ul>
            <li><strong>1:1</strong> — Square, perfect for profile pictures and Instagram posts</li>
            <li><strong>4:3</strong> — Standard photo ratio, great for prints</li>
            <li><strong>16:9</strong> — Widescreen, YouTube thumbnails and presentations</li>
            <li><strong>3:2</strong> — DSLR photo ratio</li>
            <li><strong>9:16</strong> — Portrait/Story format for Instagram and TikTok</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            Your images are processed entirely in your browser. No files are uploaded to any server.
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
            name: "Image Cropper",
            description: META.description,
            url: `${SITE_URL}/tools/image-cropper`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
