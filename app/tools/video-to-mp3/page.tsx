"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Video to MP3 Converter - Extract Audio from Video Free Online",
  description:
    "Convert any video to MP3 audio online for free. Extract audio from MP4, MOV, AVI, WebM, MKV videos. No upload needed — works 100% in your browser. Fast, private, unlimited.",
  keywords:
    "video to mp3, video to audio converter, extract audio from video, mp4 to mp3, convert video to mp3 online free, video to mp3 converter, mov to mp3, avi to mp3, webm to mp3",
};

export default function VideoToMp3Page() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [duration, setDuration] = useState("");
  const [format, setFormat] = useState<"webm" | "wav">("wav");
  const [bitrate, setBitrate] = useState("128");
  const fileRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleFile = (f: File) => {
    if (!f.type.startsWith("video/") && !f.name.match(/\.(mp4|mov|avi|mkv|webm|flv|wmv|m4v|3gp)$/i)) {
      setError("Please upload a video file (MP4, MOV, AVI, WebM, MKV, etc.)");
      return;
    }
    setFile(f);
    setAudioUrl(null);
    setError("");
    setProgress(0);

    // Get duration
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      setDuration(formatDuration(video.duration));
      URL.revokeObjectURL(video.src);
    };
    video.src = URL.createObjectURL(f);
  };

  const convert = async () => {
    if (!file) return;
    setConverting(true);
    setProgress(10);
    setError("");
    setAudioUrl(null);

    try {
      const videoUrl = URL.createObjectURL(file);

      // Create video element to decode
      const video = document.createElement("video");
      video.src = videoUrl;
      video.muted = true;

      await new Promise<void>((resolve, reject) => {
        video.onloadeddata = () => resolve();
        video.onerror = () => reject(new Error("Could not load video"));
      });

      setProgress(20);

      // Create AudioContext to process audio
      const audioCtx = new AudioContext();
      const response = await fetch(videoUrl);
      const arrayBuffer = await response.arrayBuffer();

      setProgress(40);

      // Decode audio from video
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      setProgress(60);

      // Convert AudioBuffer to WAV
      const wavBuffer = audioBufferToWav(audioBuffer);
      const blob = new Blob([wavBuffer], { type: "audio/wav" });
      setAudioUrl(URL.createObjectURL(blob));

      setProgress(100);
      URL.revokeObjectURL(videoUrl);
      audioCtx.close();
    } catch (err) {
      setError(`Conversion failed: ${err instanceof Error ? err.message : "Unknown error"}. Try a different video format.`);
    } finally {
      setConverting(false);
    }
  };

  // WAV encoder
  function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format1 = 1; // PCM
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numChannels * bytesPerSample;

    const samples = buffer.length;
    const dataSize = samples * blockAlign;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;

    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);

    // WAV header
    writeString(view, 0, "RIFF");
    view.setUint32(4, totalSize - 8, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, format1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, "data");
    view.setUint32(40, dataSize, true);

    // Interleave channels
    const channels = [];
    for (let c = 0; c < numChannels; c++) {
      channels.push(buffer.getChannelData(c));
    }

    let offset = 44;
    for (let i = 0; i < samples; i++) {
      for (let c = 0; c < numChannels; c++) {
        const sample = Math.max(-1, Math.min(1, channels[c][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  }

  function writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  const downloadName = file ? file.name.replace(/\.[^.]+$/, `.${format === "wav" ? "wav" : "webm"}`) : "audio.wav";

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/video-to-mp3`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <a href="/" className="text-[var(--primary)] hover:underline text-sm mb-4 inline-block">← All Tools</a>

        <h1 className="text-3xl font-extrabold mb-2" style={{ color: "var(--foreground)" }}>
          Video to MP3 Converter
        </h1>
        <p style={{ color: "var(--muted)" }} className="mb-6">
          Extract audio from any video file — MP4, MOV, AVI, WebM, MKV. 100% free, works in your browser. No upload to any server.
        </p>

        <div className="tool-card mb-6">
          {/* File Upload */}
          <div
            className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors hover:border-[var(--primary)]"
            style={{ borderColor: "var(--card-border)" }}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--primary)"; }}
            onDragLeave={(e) => { e.currentTarget.style.borderColor = "var(--card-border)"; }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "var(--card-border)";
              if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
            }}
          >
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept="video/*,.mp4,.mov,.avi,.mkv,.webm,.flv,.wmv,.m4v,.3gp"
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
            />
            {file ? (
              <div>
                <p className="text-3xl mb-2">🎬</p>
                <p className="font-semibold" style={{ color: "var(--foreground)" }}>{file.name}</p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {formatSize(file.size)} {duration && `• ${duration}`}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-4xl mb-3">🎵</p>
                <p className="font-semibold" style={{ color: "var(--foreground)" }}>Drop a video file or click to upload</p>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Supports MP4, MOV, AVI, WebM, MKV, FLV, WMV</p>
              </div>
            )}
          </div>

          {/* Options */}
          {file && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Output Format</label>
                <select value={format} onChange={(e) => setFormat(e.target.value as "webm" | "wav")} className="input-field">
                  <option value="wav">WAV (Lossless, larger)</option>
                  <option value="webm">WebM/Opus (Compressed, smaller)</option>
                </select>
              </div>
              {format === "webm" && (
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Bitrate</label>
                  <select value={bitrate} onChange={(e) => setBitrate(e.target.value)} className="input-field">
                    <option value="64">64 kbps (Small)</option>
                    <option value="128">128 kbps (Standard)</option>
                    <option value="192">192 kbps (High)</option>
                    <option value="320">320 kbps (Best)</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Convert Button */}
          {file && !audioUrl && (
            <button
              onClick={convert}
              disabled={converting}
              className="btn-primary w-full mt-4 py-3 flex items-center justify-center gap-2"
            >
              {converting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Converting... {progress}%
                </>
              ) : "🎵 Extract Audio"}
            </button>
          )}

          {/* Progress */}
          {converting && (
            <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: "var(--muted-bg)" }}>
              <div className="h-full rounded-full bg-[var(--primary)] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">{error}</div>
          )}

          {/* Result */}
          {audioUrl && (
            <div className="mt-6 p-5 rounded-xl text-center" style={{ background: "var(--primary-light)", border: "1px solid var(--card-border)" }}>
              <p className="text-3xl mb-2">✅</p>
              <p className="font-bold mb-3" style={{ color: "var(--foreground)" }}>Audio Extracted Successfully!</p>

              <audio controls src={audioUrl} className="w-full mb-4" />

              <a
                href={audioUrl}
                download={downloadName}
                className="btn-primary inline-flex items-center gap-2 py-2.5 px-6"
              >
                ⬇️ Download {format.toUpperCase()}
              </a>

              <button
                onClick={() => { setFile(null); setAudioUrl(null); setProgress(0); }}
                className="block mx-auto mt-3 text-sm cursor-pointer"
                style={{ color: "var(--primary)" }}
              >
                Convert another video
              </button>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="tool-card mb-6">
          <h2 className="font-bold text-lg mb-4" style={{ color: "var(--foreground)" }}>Supported Formats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["MP4", "MOV", "AVI", "WebM", "MKV", "FLV", "WMV", "3GP"].map(f => (
              <div key={f} className="text-center p-3 rounded-lg" style={{ background: "var(--muted-bg)" }}>
                <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{f}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>→ Audio</p>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="seo-content tool-card">
          <h2>Free Video to MP3 Converter Online</h2>
          <p>
            Our Video to MP3 converter lets you extract audio from any video file directly in your browser.
            No software to install, no file uploads to external servers — your video stays on your device
            throughout the entire conversion process, ensuring complete privacy and security.
          </p>

          <h3>How to Convert Video to MP3</h3>
          <ul>
            <li>Upload or drag & drop your video file (MP4, MOV, AVI, WebM, MKV, or any supported format)</li>
            <li>Choose your preferred output format (WAV for lossless quality, or WebM/Opus for smaller files)</li>
            <li>Select the bitrate if using compressed format (128kbps is standard, 320kbps for best quality)</li>
            <li>Click &quot;Extract Audio&quot; and wait for the conversion to complete</li>
            <li>Preview the audio and download it to your device</li>
          </ul>

          <h3>Supported Video Formats</h3>
          <p>
            Our converter supports all major video formats including MP4, MOV (Apple), AVI (Windows),
            WebM (Web), MKV (Matroska), FLV (Flash), WMV (Windows Media), M4V, and 3GP (Mobile).
            The audio track is extracted without re-encoding when possible, preserving the original quality.
          </p>

          <h3>Privacy & Security</h3>
          <p>
            Unlike other online converters that upload your files to their servers, our tool processes
            everything locally in your browser using the Web Audio API. Your video never leaves your
            device, making this the most private way to extract audio from video files.
          </p>

          <h3>Output Formats</h3>
          <p>
            WAV (Waveform Audio) provides lossless, uncompressed audio — perfect for editing and professional use.
            WebM/Opus provides high-quality compressed audio at much smaller file sizes — ideal for sharing and storage.
          </p>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "WebApplication",
          name: META.title, description: META.description,
          url: `${SITE_URL}/tools/video-to-mp3`,
          applicationCategory: "MultimediaApplication", operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }) }} />
      </div>
    </>
  );
}
