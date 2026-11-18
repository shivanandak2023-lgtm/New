"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Animation Maker - Create Slideshow from Images Free",
  description:
    "Free animation maker. Upload multiple images, set frame delay, preview the animation, and record as WebM video. No server upload.",
  keywords: "gif maker, animation maker, slideshow maker, image to gif, create animation online",
};

export default function GifMakerPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [frameUrls, setFrameUrls] = useState<string[]>([]);
  const [delay, setDelay] = useState(500);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  function handleFiles(newFiles: FileList | File[]) {
    const images = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return;
    const updated = [...files, ...images];
    setFiles(updated);
    const urls = updated.map((f) => URL.createObjectURL(f));
    setFrameUrls(urls);
    setVideoUrl("");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }

  function removeFrame(idx: number) {
    const newFiles = files.filter((_, i) => i !== idx);
    setFiles(newFiles);
    setFrameUrls(newFiles.map((f) => URL.createObjectURL(f)));
    if (currentFrame >= newFiles.length) setCurrentFrame(Math.max(0, newFiles.length - 1));
    setVideoUrl("");
  }

  function moveFrame(from: number, to: number) {
    if (to < 0 || to >= files.length) return;
    const newFiles = [...files];
    const [moved] = newFiles.splice(from, 1);
    newFiles.splice(to, 0, moved);
    setFiles(newFiles);
    setFrameUrls(newFiles.map((f) => URL.createObjectURL(f)));
    setCurrentFrame(to);
  }

  const drawFrame = useCallback(
    (idx: number) => {
      if (!canvasRef.current || frameUrls.length === 0) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      const img = new Image();
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = frameUrls[idx];
    },
    [frameUrls]
  );

  useEffect(() => {
    if (frameUrls.length > 0) {
      drawFrame(currentFrame);
    }
  }, [currentFrame, frameUrls, drawFrame]);

  function togglePlay() {
    if (playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      let frame = currentFrame;
      intervalRef.current = setInterval(() => {
        frame = (frame + 1) % frameUrls.length;
        setCurrentFrame(frame);
      }, delay);
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Restart interval when delay changes during playback
  useEffect(() => {
    if (playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      let frame = currentFrame;
      intervalRef.current = setInterval(() => {
        frame = (frame + 1) % frameUrls.length;
        setCurrentFrame(frame);
      }, delay);
    }
  }, [delay]);

  async function recordVideo() {
    if (!canvasRef.current || frameUrls.length < 2) return;
    setRecording(true);

    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30);
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm",
    });
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setVideoUrl(URL.createObjectURL(blob));
      setRecording(false);
    };

    recorder.start();

    // Play through all frames twice
    const totalFrames = frameUrls.length * 2;
    for (let i = 0; i < totalFrames; i++) {
      const idx = i % frameUrls.length;
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const ctx = canvas.getContext("2d")!;
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          setCurrentFrame(idx);
          setTimeout(resolve, delay);
        };
        img.src = frameUrls[idx];
      });
    }

    recorder.stop();
  }

  function downloadVideo() {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = "animation.webm";
    a.click();
  }

  function downloadFrames() {
    frameUrls.forEach((url, i) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = `frame-${String(i + 1).padStart(3, "0")}.png`;
      a.click();
    });
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/gif-maker`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/gif-maker`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Animation / Slideshow Maker</h1>
        <p className="text-[var(--muted)] mb-8">
          Upload multiple images, set frame delay, preview the animation, and export as WebM video. Everything runs in your browser.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
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
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
            <svg className="mx-auto mb-3 text-[var(--muted)]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-[var(--muted)]">
              {files.length > 0
                ? `${files.length} image(s) added — click to add more`
                : "Drag & drop images or click to browse (select multiple)"}
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Frames ({files.length})</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {frameUrls.map((url, i) => (
                  <div
                    key={i}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer ${
                      currentFrame === i ? "border-[var(--primary)]" : "border-[var(--card-border)]"
                    }`}
                    onClick={() => { setCurrentFrame(i); if (!playing) drawFrame(i); }}
                  >
                    <img src={url} alt={`Frame ${i + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-0.5">
                      {i + 1}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFrame(i); }}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-bl"
                    >
                      x
                    </button>
                    <div className="absolute top-0 left-0 flex flex-col">
                      {i > 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); moveFrame(i, i - 1); }}
                          className="bg-black/60 text-white text-xs px-1"
                        >
                          &larr;
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Frame Delay: {delay}ms</label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
                <div className="flex justify-between text-xs text-[var(--muted)]">
                  <span>Fast (100ms)</span>
                  <span>Slow (2000ms)</span>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 mb-4 flex justify-center">
                <canvas ref={canvasRef} className="max-w-full max-h-80 rounded" />
              </div>

              <div className="flex gap-3 mb-4">
                <button
                  onClick={togglePlay}
                  disabled={frameUrls.length < 2}
                  className="btn-primary flex-1"
                >
                  {playing ? "Pause" : "Play Animation"}
                </button>
                <button
                  onClick={recordVideo}
                  disabled={recording || frameUrls.length < 2}
                  className="btn-primary flex-1"
                >
                  {recording ? "Recording..." : "Record as WebM"}
                </button>
              </div>

              <button onClick={downloadFrames} className="w-full text-sm text-[var(--primary)] hover:underline mb-2">
                Download All Frames as PNGs
              </button>
            </div>
          )}
        </div>

        {videoUrl && (
          <div className="result-card mb-8">
            <h2 className="text-lg font-bold mb-4">Recorded Video</h2>
            <video src={videoUrl} controls loop className="w-full rounded-lg mb-4" />
            <button onClick={downloadVideo} className="btn-primary w-full">
              Download WebM Video
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does the Animation Maker Work?</h2>
          <p>
            Upload multiple images and this tool displays them in sequence as an animation. You control
            the frame delay (speed). The frames are drawn on an HTML5 Canvas, and you can record the
            animation as a WebM video using the MediaRecorder API.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Upload unlimited images as animation frames</li>
            <li>Reorder and remove frames easily</li>
            <li>Adjustable frame delay from 100ms to 2000ms</li>
            <li>Live preview of the animation</li>
            <li>Record and download as WebM video</li>
            <li>Download individual frames as PNG files</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            All images and video processing happens in your browser. No files are uploaded to any server.
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
            name: "Animation Maker",
            description: META.description,
            url: `${SITE_URL}/tools/gif-maker`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
