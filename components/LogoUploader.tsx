"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface LogoUploaderProps {
  onLogoChange: (logoDataUrl: string | null) => void;
  recommendedSize?: string;
  shape?: "square" | "circle" | "rectangle";
  maxWidth?: number;
  maxHeight?: number;
}

export default function LogoUploader({
  onLogoChange,
  recommendedSize = "200×200px",
  shape = "square",
  maxWidth = 200,
  maxHeight = 200,
}: LogoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(100);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = useCallback(() => {
    if (!originalImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = maxWidth;
    canvas.height = maxHeight;

    // Clear
    ctx.clearRect(0, 0, maxWidth, maxHeight);

    // Circle clip if needed
    if (shape === "circle") {
      ctx.beginPath();
      ctx.arc(maxWidth / 2, maxHeight / 2, Math.min(maxWidth, maxHeight) / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
    }

    // Calculate scaled dimensions
    const s = scale / 100;
    const drawW = originalImage.width * s;
    const drawH = originalImage.height * s;

    // Center + offset
    const x = (maxWidth - drawW) / 2 + offsetX;
    const y = (maxHeight - drawH) / 2 + offsetY;

    ctx.drawImage(originalImage, x, y, drawW, drawH);

    const dataUrl = canvas.toDataURL("image/png");
    setPreview(dataUrl);
    onLogoChange(dataUrl);
  }, [originalImage, scale, offsetX, offsetY, maxWidth, maxHeight, shape, onLogoChange]);

  useEffect(() => {
    if (originalImage) processImage();
  }, [originalImage, scale, offsetX, offsetY, processImage]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Max 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        // Auto-scale to fit
        const fitScale = Math.min(maxWidth / img.width, maxHeight / img.height) * 100;
        setScale(Math.min(150, Math.max(10, Math.round(fitScale))));
        setOffsetX(0);
        setOffsetY(0);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setOriginalImage(null);
    setScale(100);
    setOffsetX(0);
    setOffsetY(0);
    onLogoChange(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
        Logo / Image
      </label>
      <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>
        Recommended: {recommendedSize} • PNG or JPG • Max 5MB •
        {shape === "circle" ? " Circular crop" : shape === "rectangle" ? " Rectangular crop" : " Square crop"}
      </p>

      {!originalImage ? (
        <div
          className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors hover:border-[var(--primary)]"
          style={{ borderColor: "var(--card-border)" }}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--primary)"; }}
          onDragLeave={(e) => { e.currentTarget.style.borderColor = "var(--card-border)"; }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.style.borderColor = "var(--card-border)";
            if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
          }}
        >
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
          />
          <p className="text-2xl mb-1">📷</p>
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Click or drag to upload logo</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>PNG, JPG, WebP, SVG</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Preview */}
          <div className="flex items-start gap-4">
            <div
              className="border overflow-hidden shrink-0 flex items-center justify-center"
              style={{
                borderColor: "var(--card-border)",
                width: `${Math.min(maxWidth, 120)}px`,
                height: `${Math.min(maxHeight, 120)}px`,
                borderRadius: shape === "circle" ? "50%" : "8px",
                background: "var(--muted-bg)",
              }}
            >
              {preview && (
                <img
                  src={preview}
                  alt="Logo"
                  style={{
                    width: `${Math.min(maxWidth, 120)}px`,
                    height: `${Math.min(maxHeight, 120)}px`,
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
            <div className="flex-1 space-y-2">
              {/* Scale */}
              <div>
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  Zoom: {scale}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={scale}
                  onChange={(e) => setScale(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              {/* Position X */}
              <div>
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  X Position: {offsetX}px
                </label>
                <input
                  type="range"
                  min={-maxWidth}
                  max={maxWidth}
                  value={offsetX}
                  onChange={(e) => setOffsetX(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              {/* Position Y */}
              <div>
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  Y Position: {offsetY}px
                </label>
                <input
                  type="range"
                  min={-maxHeight}
                  max={maxHeight}
                  value={offsetY}
                  onChange={(e) => setOffsetY(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={() => fileRef.current?.click()} className="btn-secondary text-xs py-1.5 px-3">
              Change Image
            </button>
            <button onClick={handleRemove} className="text-red-500 hover:text-red-700 text-xs font-medium cursor-pointer">
              Remove
            </button>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
            />
          </div>
        </div>
      )}

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
