"use client";

import { useState, useRef, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Video to GIF - Convert Video to Animated Frames Free",
  description:
    "Free video to GIF converter. Upload a video, capture frames at custom intervals, preview the animation, and download as WebM or PNG frames.",
  keywords: "video to gif, convert video to gif, video frames, video to animation, gif converter",
};

export default function VideoToGifPage() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [frames, setFrames] = useState<string[]>([]);
  const [capturing, setCapturing] = useState(false);
  const [interval, setIntervalMs] = useState(200);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(5);
  const [duration, setDuration] = useState(0);
  const [width, setWidth] = useState(480);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [previewFrame, setPreviewFrame] = useState(0);
  const [resultUrl, setResultUrl] = useState("");
  const [recording, setRecording] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  function handleFile(f: File) {
    if (!f.type.startsWith("video/")) return;
    setFile(f);
    setFrames([]);
    setResultUrl("");
    const url = URL.createObjectURL(f);
    setVideoUrl(url);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  function onVideoLoaded() {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      setEndTime(Math.min(5, dur));
    }
  }

  const captureFrames = useCallback(async () => {
    if (!videoRef.current) return;
    setCapturing(true);
    setFrames([]);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const aspect = video.videoHeight / video.videoWidth;
    canvas.width = width;
    canvas.height = Math.round(width * aspect);
    const ctx = canvas.getContext("2d")!;

    const capturedFrames: string[] = [];
    const start = startTime;
    const end = Math.min(endTime, duration);
    const step = interval / 1000;

    for (let t = start; t < end; t += step) {
      video.currentTime = t;
      await new Promise<void>((resolve) => {
        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          capturedFrames.push(canvas.toDataURL("image/png"));
          resolve();
        };
      });
    }

    setFrames(capturedFrames);
    setCapturing(false);
  }, [videoUrl, startTime, endTime, interval, width, duration]);

  function togglePreview() {
    if (previewPlaying) {
      if (previewInterval.current) clearInterval(previewInterval.current);
      setPreviewPlaying(false);
    } else {
      setPreviewPlaying(true);
      let idx = 0;
      previewInterval.current = setInterval(() => {
        idx = (idx + 1) % frames.length;
        setPreviewFrame(idx);
      }, interval);
    }
  }

  async function recordWebm() {
    if (!canvasRef.current || frames.length < 2) return;
    setRecording(true);

    const canvas = canvasRef.current;
    const firstImg = new Image();
    firstImg.src = frames[0];
    await new Promise<void>((r) => { firstImg.onload = () => r(); });
    canvas.width = firstImg.naturalWidth;
    canvas.height = firstImg.naturalHeight;

    const stream = canvas.captureStream(30);
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm",
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setResultUrl(URL.createObjectURL(blob));
      setRecording(false);
    };

    recorder.start();
    const ctx = canvas.getContext("2d")!;

    // Play through frames twice
    for (let loop = 0; loop < 2; loop++) {
      for (let i = 0; i < frames.length; i++) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            setPreviewFrame(i);
            setTimeout(resolve, interval);
          };
          img.src = frames[i];
        });
      }
    }

    recorder.stop();
  }

  function downloadFrames() {
    frames.forEach((dataUrl, i) => {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `frame-${String(i + 1).padStart(3, "0")}.png`;
      a.click();
    });
  }

  function downloadWebm() {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${file?.name.replace(/\.[^.]+$/, "") || "video"}-animation.webm`;
    a.click();
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/video-to-gif`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/video-to-gif`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Video to GIF / Animation</h1>
        <p className="text-[var(--muted)] mb-8">
          Upload a video, extract frames at custom intervals, preview the animation, and download as WebM or PNG sequence.
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
              accept="video/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <svg className="mx-auto mb-3 text-[var(--muted)]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-[var(--muted)]">
              {file ? file.name : "Drag & drop a video or click to browse"}
            </p>
          </div>

          {videoUrl && (
            <div className="mt-6">
              <video
                ref={videoRef}
                src={videoUrl}
                onLoadedMetadata={onVideoLoaded}
                controls
                className="w-full rounded-lg mb-4"
              />

              {duration > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start (s)</label>
                      <input
                        type="number"
                        min={0}
                        max={endTime}
                        step={0.1}
                        value={startTime}
                        onChange={(e) => setStartTime(Number(e.target.value))}
                        className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End (s)</label>
                      <input
                        type="number"
                        min={startTime}
                        max={duration}
                        step={0.1}
                        value={endTime}
                        onChange={(e) => setEndTime(Number(e.target.value))}
                        className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Interval (ms)</label>
                      <input
                        type="number"
                        min={50}
                        max={2000}
                        step={50}
                        value={interval}
                        onChange={(e) => setIntervalMs(Number(e.target.value))}
                        className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Width (px)</label>
                      <input
                        type="number"
                        min={100}
                        max={1920}
                        step={10}
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-[var(--muted)]">
                    Estimated frames: ~{Math.ceil(((endTime - startTime) * 1000) / interval)}
                  </p>

                  <button onClick={captureFrames} disabled={capturing} className="btn-primary w-full">
                    {capturing ? "Capturing Frames..." : "Capture Frames"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {frames.length > 0 && (
          <div className="result-card mb-8">
            <h2 className="text-lg font-bold mb-4">Captured Frames ({frames.length})</h2>

            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {frames.map((url, i) => (
                <div
                  key={i}
                  className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden cursor-pointer ${
                    previewFrame === i ? "border-[var(--primary)]" : "border-transparent"
                  }`}
                  onClick={() => setPreviewFrame(i)}
                >
                  <img src={url} alt={`Frame ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mb-4 flex justify-center">
              <img src={frames[previewFrame]} alt="Preview" className="max-h-64 rounded" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button onClick={togglePreview} className="btn-primary">
                {previewPlaying ? "Stop Preview" : "Play Preview"}
              </button>
              <button onClick={recordWebm} disabled={recording} className="btn-primary">
                {recording ? "Recording..." : "Export WebM"}
              </button>
              <button onClick={downloadFrames} className="btn-primary">
                Download Frames (PNG)
              </button>
            </div>
          </div>
        )}

        {resultUrl && (
          <div className="result-card mb-8">
            <h2 className="text-lg font-bold mb-4">Exported Video</h2>
            <video src={resultUrl} controls loop className="w-full rounded-lg mb-4" />
            <button onClick={downloadWebm} className="btn-primary w-full">
              Download WebM Video
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does Video to GIF Work?</h2>
          <p>
            This tool uses HTML5 Video and Canvas to extract frames from your video at specified intervals.
            You can preview the frames as an animation and export them as a WebM video using the
            MediaRecorder API, or download individual frames as PNG files.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Custom start and end times for frame extraction</li>
            <li>Adjustable frame interval (50ms to 2000ms)</li>
            <li>Custom output width with automatic aspect ratio</li>
            <li>Animated preview of captured frames</li>
            <li>Export as WebM video or download PNG frames</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            Your video is processed entirely in your browser. No files are uploaded to any server.
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
            name: "Video to GIF",
            description: META.description,
            url: `${SITE_URL}/tools/video-to-gif`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
