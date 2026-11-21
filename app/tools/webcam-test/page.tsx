"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Webcam Test - Test Your Camera Online Free",
  description:
    "Free online Webcam Test tool. Check if your camera works, see resolution, FPS, and device info. Take screenshots, toggle mirror, switch cameras, and go fullscreen.",
  keywords: "webcam test, test my camera online, camera test, webcam checker, test webcam, online camera test",
};

export default function WebcamTestPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);

  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const [mirrored, setMirrored] = useState(true);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [resolution, setResolution] = useState({ w: 0, h: 0 });
  const [fps, setFps] = useState(0);
  const [deviceName, setDeviceName] = useState("");

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
  }, []);

  const startCamera = useCallback(async (deviceId?: string) => {
    setError("");
    stopStream();
    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
          : { width: { ideal: 1920 }, height: { ideal: 1080 } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();
      setResolution({ w: settings.width || 0, h: settings.height || 0 });
      setDeviceName(track.label || "Unknown Camera");

      // Enumerate devices after permission granted
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
      setDevices(videoDevices);
      if (!deviceId && videoDevices.length > 0) {
        setSelectedDevice(track.getSettings().deviceId || videoDevices[0].deviceId);
      }

      // FPS counter
      let frameCount = 0;
      let lastTime = performance.now();
      const countFps = () => {
        frameCount++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
          setFps(frameCount);
          frameCount = 0;
          lastTime = now;
        }
        animFrameRef.current = requestAnimationFrame(countFps);
      };
      animFrameRef.current = requestAnimationFrame(countFps);

      setStarted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not access camera";
      setError(msg);
    }
  }, [stopStream]);

  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  function handleDeviceChange(id: string) {
    setSelectedDevice(id);
    startCamera(id);
  }

  function takeScreenshot() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    if (mirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    const link = document.createElement("a");
    link.download = "webcam-screenshot.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function toggleFullscreen() {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/webcam-test`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/webcam-test`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Webcam Test</h1>
        <p className="text-[var(--muted)] mb-8">
          Test your webcam, check resolution and FPS, take screenshots, and switch between cameras.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          {!started && (
            <div className="text-center py-12">
              <p className="text-[var(--muted)] mb-4">Click the button below to start your camera test.</p>
              <button onClick={() => startCamera()} className="btn-primary px-8 py-3 text-lg">
                Start Camera
              </button>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center py-4">
              <p className="font-medium">Camera Error</p>
              <p className="text-sm">{error}</p>
              <p className="text-sm mt-2 text-[var(--muted)]">
                Make sure you have granted camera permission in your browser settings.
              </p>
            </div>
          )}

          {started && (
            <div>
              <div className="relative mb-4 bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg"
                  style={{ transform: mirrored ? "scaleX(-1)" : "none" }}
                />
              </div>

              <div className="result-card mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-[var(--muted)]">Resolution</p>
                    <p className="font-bold text-[var(--primary)]">{resolution.w} x {resolution.h}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)]">FPS</p>
                    <p className="font-bold text-[var(--primary)]">{fps}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)]">Camera</p>
                    <p className="font-bold text-sm truncate">{deviceName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)]">Mirrored</p>
                    <p className="font-bold">{mirrored ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>

              {devices.length > 1 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Select Camera</label>
                  <select
                    value={selectedDevice}
                    onChange={(e) => handleDeviceChange(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-[var(--muted-bg)]"
                  >
                    {devices.map((d) => (
                      <option key={d.deviceId} value={d.deviceId}>
                        {d.label || `Camera ${devices.indexOf(d) + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button onClick={() => setMirrored(!mirrored)} className="btn-primary text-sm">
                  {mirrored ? "Unmirror" : "Mirror"}
                </button>
                <button onClick={takeScreenshot} className="btn-primary text-sm">
                  Screenshot
                </button>
                <button onClick={toggleFullscreen} className="btn-primary text-sm">
                  Fullscreen
                </button>
                <button
                  onClick={() => { stopStream(); setStarted(false); setFps(0); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  Stop Camera
                </button>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Webcam Test Tool</h2>
          <p>
            Our free online Webcam Test lets you quickly check if your camera is working properly. Whether
            you are preparing for a video call on Zoom, Google Meet, Microsoft Teams, or any other platform,
            testing your webcam beforehand saves you from awkward technical difficulties. This tool runs
            entirely in your browser — no software to install and no data is uploaded to any server.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Live Video Preview:</strong> See your webcam feed in real-time with a large preview window</li>
            <li><strong>Resolution Detection:</strong> Displays the actual resolution your camera is streaming at</li>
            <li><strong>FPS Counter:</strong> Shows real-time frames per second so you can verify smooth video</li>
            <li><strong>Camera Selector:</strong> Switch between multiple cameras if you have an external webcam connected</li>
            <li><strong>Mirror Toggle:</strong> Flip the video horizontally — useful for checking your appearance as others see you</li>
            <li><strong>Screenshot Capture:</strong> Take a snapshot from your webcam and download it as a PNG file</li>
            <li><strong>Fullscreen Mode:</strong> View your camera feed in fullscreen for detailed inspection</li>
          </ul>

          <h2>How to Test Your Webcam</h2>
          <ol>
            <li>Click the &quot;Start Camera&quot; button above</li>
            <li>Allow camera access when your browser asks for permission</li>
            <li>Your camera feed will appear in the preview area</li>
            <li>Check the resolution, FPS, and device information displayed below the video</li>
            <li>Use the controls to mirror the image, take screenshots, or switch cameras</li>
          </ol>

          <h2>Troubleshooting Camera Issues</h2>
          <p>
            If your webcam is not detected, check that it is properly connected and that no other
            application is currently using it. Make sure your browser has permission to access the camera
            in your system privacy settings. On Windows, go to Settings &gt; Privacy &gt; Camera. On macOS,
            check System Preferences &gt; Privacy &amp; Security &gt; Camera. If you recently installed a new
            webcam, you may need to restart your browser. Try using a different browser if the issue persists —
            Chrome, Firefox, and Edge all support webcam access through the standard Web API.
          </p>

          <h2>Privacy and Security</h2>
          <p>
            Your privacy is completely protected when using this webcam test tool. The camera feed stays
            entirely within your browser — no video data is sent to any server. Screenshots are generated
            locally using the HTML5 Canvas API and downloaded directly to your device. We do not record,
            store, or transmit any video or image data. The tool uses the standard Web API
            (navigator.mediaDevices.getUserMedia) which requires explicit browser permission before
            accessing your camera.
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
            name: "Webcam Test",
            description: META.description,
            url: `${SITE_URL}/tools/webcam-test`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
