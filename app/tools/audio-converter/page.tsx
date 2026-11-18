"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Audio Converter - Convert Audio Files Online Free",
  description:
    "Free audio converter. Upload MP3, WAV, OGG, or M4A files. View audio details and convert to WebM/WAV format using Web Audio API. No server upload.",
  keywords: "audio converter, convert audio, mp3 to wav, audio file converter, online audio converter",
};

function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

type OutputFormat = "wav" | "webm";

export default function AudioConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioInfo, setAudioInfo] = useState<{
    duration: number;
    sampleRate: number;
    channels: number;
    format: string;
  } | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("wav");
  const [converting, setConverting] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function getFormatLabel(type: string): string {
    if (type.includes("mp3") || type.includes("mpeg")) return "MP3";
    if (type.includes("wav")) return "WAV";
    if (type.includes("ogg")) return "OGG";
    if (type.includes("m4a") || type.includes("mp4")) return "M4A/AAC";
    if (type.includes("webm")) return "WebM";
    if (type.includes("flac")) return "FLAC";
    return type || "Unknown";
  }

  async function handleFile(f: File) {
    if (!f.type.startsWith("audio/")) {
      setError("Please upload an audio file (MP3, WAV, OGG, M4A, etc.)");
      return;
    }
    setFile(f);
    setError("");
    setResultUrl("");
    setResultSize(0);
    const url = URL.createObjectURL(f);
    setAudioUrl(url);

    // Decode audio to get details
    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await f.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      setAudioInfo({
        duration: audioBuffer.duration,
        sampleRate: audioBuffer.sampleRate,
        channels: audioBuffer.numberOfChannels,
        format: getFormatLabel(f.type),
      });
      await audioContext.close();
    } catch {
      setAudioInfo(null);
      setError("Could not decode audio file. The format may not be supported by your browser.");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  async function convertAudio() {
    if (!file) return;
    setConverting(true);
    setError("");

    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      if (outputFormat === "wav") {
        // Convert to WAV
        const wavBlob = audioBufferToWav(audioBuffer);
        setResultUrl(URL.createObjectURL(wavBlob));
        setResultSize(wavBlob.size);
      } else {
        // Convert to WebM using MediaRecorder
        const dest = audioContext.createMediaStreamDestination();
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(dest);

        const chunks: Blob[] = [];
        const recorder = new MediaRecorder(dest.stream, {
          mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
            ? "audio/webm;codecs=opus"
            : "audio/webm",
        });

        const done = new Promise<void>((resolve) => {
          recorder.onstop = () => resolve();
        });

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.start();
        source.start();

        source.onended = () => {
          setTimeout(() => recorder.stop(), 100);
        };

        await done;
        const blob = new Blob(chunks, { type: "audio/webm" });
        setResultUrl(URL.createObjectURL(blob));
        setResultSize(blob.size);
      }

      await audioContext.close();
    } catch {
      setError("Conversion failed. The audio format may not be supported by your browser.");
    } finally {
      setConverting(false);
    }
  }

  function audioBufferToWav(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const dataLength = buffer.length * blockAlign;
    const headerLength = 44;
    const totalLength = headerLength + dataLength;

    const arrayBuffer = new ArrayBuffer(totalLength);
    const view = new DataView(arrayBuffer);

    function writeString(offset: number, str: string) {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    }

    writeString(0, "RIFF");
    view.setUint32(4, totalLength - 8, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, "data");
    view.setUint32(40, dataLength, true);

    const channels: Float32Array[] = [];
    for (let ch = 0; ch < numChannels; ch++) {
      channels.push(buffer.getChannelData(ch));
    }

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        const sample = Math.max(-1, Math.min(1, channels[ch][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  }

  function download() {
    if (!resultUrl || !file) return;
    const ext = outputFormat === "wav" ? "wav" : "webm";
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${file.name.replace(/\.[^.]+$/, "")}.${ext}`;
    a.click();
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/audio-converter`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/audio-converter`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Audio Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Upload an audio file, view its details, and convert to WAV or WebM format. All processing happens in your browser using the Web Audio API.
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
              accept="audio/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <svg className="mx-auto mb-3 text-[var(--muted)]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <p className="text-[var(--muted)]">
              {file ? file.name : "Drag & drop an audio file or click to browse"}
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">Supports MP3, WAV, OGG, M4A, WebM, FLAC</p>
          </div>

          {file && audioInfo && (
            <div className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="tool-card text-center">
                  <p className="text-xs text-[var(--muted)]">Format</p>
                  <p className="text-lg font-bold">{audioInfo.format}</p>
                </div>
                <div className="tool-card text-center">
                  <p className="text-xs text-[var(--muted)]">Duration</p>
                  <p className="text-lg font-bold">{formatDuration(audioInfo.duration)}</p>
                </div>
                <div className="tool-card text-center">
                  <p className="text-xs text-[var(--muted)]">Sample Rate</p>
                  <p className="text-lg font-bold">{(audioInfo.sampleRate / 1000).toFixed(1)} kHz</p>
                </div>
                <div className="tool-card text-center">
                  <p className="text-xs text-[var(--muted)]">Size</p>
                  <p className="text-lg font-bold">{formatBytes(file.size)}</p>
                </div>
              </div>

              <audio src={audioUrl} controls className="w-full mb-6" />

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Convert to:</label>
                <div className="flex gap-3">
                  {([
                    { value: "wav" as OutputFormat, label: "WAV (Lossless)", desc: "Uncompressed PCM audio" },
                    { value: "webm" as OutputFormat, label: "WebM (Opus)", desc: "Compressed, smaller file" },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setOutputFormat(opt.value)}
                      className={`flex-1 p-3 rounded-lg text-left transition-colors ${
                        outputFormat === opt.value
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--card-bg)] border border-[var(--card-border)]"
                      }`}
                    >
                      <p className="font-medium text-sm">{opt.label}</p>
                      <p className={`text-xs mt-0.5 ${outputFormat === opt.value ? "text-white/70" : "text-[var(--muted)]"}`}>
                        {opt.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={convertAudio} disabled={converting} className="btn-primary w-full">
                {converting ? "Converting..." : `Convert to ${outputFormat.toUpperCase()}`}
              </button>
            </div>
          )}

          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </div>

        {resultUrl && (
          <div className="result-card mb-8">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-green-700">Conversion Complete!</h2>
              <p className="text-sm text-[var(--muted)] mt-1">
                Output: {outputFormat.toUpperCase()} — {formatBytes(resultSize)}
              </p>
            </div>

            <audio src={resultUrl} controls className="w-full mb-4" />

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="tool-card text-center">
                <p className="text-xs text-[var(--muted)]">Original</p>
                <p className="font-bold">{formatBytes(file?.size || 0)}</p>
              </div>
              <div className="tool-card text-center">
                <p className="text-xs text-[var(--muted)]">Converted</p>
                <p className="font-bold text-[var(--primary)]">{formatBytes(resultSize)}</p>
              </div>
            </div>

            <button onClick={download} className="btn-primary w-full">
              Download {outputFormat.toUpperCase()} File
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does Audio Conversion Work?</h2>
          <p>
            This tool uses the Web Audio API to decode your audio file in the browser. For WAV output,
            it creates an uncompressed PCM WAV file. For WebM output, it uses the MediaRecorder API
            with the Opus codec for efficient compression.
          </p>

          <h2>Supported Formats</h2>
          <ul>
            <li><strong>Input:</strong> MP3, WAV, OGG, M4A/AAC, WebM, FLAC (browser-dependent)</li>
            <li><strong>Output:</strong> WAV (lossless PCM), WebM (Opus compressed)</li>
          </ul>

          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
            Note: Browser-based audio conversion has limited format support. Input format support
            depends on your browser. Chrome supports the widest range of formats. For MP3 output,
            a server-side tool is required.
          </p>

          <h2>Privacy</h2>
          <p>
            Your audio files are processed entirely in your browser. No files are uploaded to any server.
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
            name: "Audio Converter",
            description: META.description,
            url: `${SITE_URL}/tools/audio-converter`,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
