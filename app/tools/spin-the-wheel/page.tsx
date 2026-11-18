"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Spin the Wheel - Random Picker Wheel with Custom Options",
  description:
    "Free Spin the Wheel tool! Add your own items, spin the wheel, and let fate decide. Beautiful canvas-based wheel with smooth deceleration animation and confetti celebration.",
  keywords: "spin the wheel, random wheel, picker wheel, wheel spinner, random selector, decision wheel, wheel of fortune",
};

const PRESETS: Record<string, string[]> = {
  "Yes / No": ["Yes", "No"],
  "1-10": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  "Days of Week": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  Colors: ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Cyan"],
};

const SEGMENT_COLORS = [
  "#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#06b6d4",
  "#84cc16", "#e11d48", "#8b5cf6", "#10b981", "#f43f5e",
  "#0ea5e9", "#d946ef", "#eab308", "#64748b", "#2dd4bf",
];

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export default function SpinTheWheelPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [items, setItems] = useState<string[]>(["Pizza", "Burger", "Sushi", "Tacos", "Pasta", "Salad"]);
  const [inputText, setInputText] = useState("Pizza\nBurger\nSushi\nTacos\nPasta\nSalad");
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<ConfettiParticle[]>([]);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiAnimRef = useRef<number>(0);
  const rotationRef = useRef(0);

  // Draw wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;
    const sliceAngle = (2 * Math.PI) / items.length;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((rotation * Math.PI) / 180);

    items.forEach((item, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "white";
      ctx.font = `bold ${Math.min(16, 180 / items.length)}px sans-serif`;
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 2;
      const maxLen = 12;
      const text = item.length > maxLen ? item.slice(0, maxLen) + "..." : item;
      ctx.fillText(text, radius - 15, 5);
      ctx.restore();
    });

    ctx.restore();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(center, center, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 3;
    ctx.stroke();

  }, [items, rotation]);

  // Confetti animation
  useEffect(() => {
    if (!showConfetti) return;
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Generate particles
    const particles: ConfettiParticle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 5,
        color: SEGMENT_COLORS[Math.floor(Math.random() * SEGMENT_COLORS.length)],
        size: 4 + Math.random() * 6,
        life: 1,
      });
    }
    confettiRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      confettiRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life -= 0.015;
        if (p.life > 0) {
          alive = true;
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      });
      ctx.globalAlpha = 1;
      if (alive) {
        confettiAnimRef.current = requestAnimationFrame(animate);
      } else {
        setShowConfetti(false);
      }
    };
    confettiAnimRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(confettiAnimRef.current);
  }, [showConfetti]);

  const spin = useCallback(() => {
    if (isSpinning || items.length < 2) return;
    setIsSpinning(true);
    setWinner(null);
    setShowConfetti(false);

    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const extraSpins = 5 + (arr[0] % 5); // 5-9 full rotations
    const randomAngle = (arr[0] % 360);
    const totalRotation = extraSpins * 360 + randomAngle;
    const startRotation = rotationRef.current;
    const targetRotation = startRotation + totalRotation;
    const duration = 4000;
    const startTime = performance.now();

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRot = startRotation + totalRotation * eased;

      rotationRef.current = currentRot;
      setRotation(currentRot);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animateSpin);
      } else {
        // Determine winner
        const normalizedAngle = ((targetRotation % 360) + 360) % 360;
        // Pointer is at top (270 degrees in standard, but we need to account for drawing)
        const sliceAngle = 360 / items.length;
        // The pointer points up, wheel rotates clockwise
        // Winning index = which slice is at the top (0 deg = right, so top = 270 from right = -90)
        const pointerAngle = (360 - normalizedAngle + 270) % 360;
        const winnerIndex = Math.floor(pointerAngle / sliceAngle) % items.length;

        setWinner(items[winnerIndex]);
        setIsSpinning(false);
        setShowConfetti(true);
      }
    };

    animRef.current = requestAnimationFrame(animateSpin);
  }, [isSpinning, items]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animRef.current);
      cancelAnimationFrame(confettiAnimRef.current);
    };
  }, []);

  const updateItems = (text: string) => {
    setInputText(text);
    const newItems = text.split("\n").map((s) => s.trim()).filter(Boolean);
    if (newItems.length > 0) {
      setItems(newItems.slice(0, 20));
    }
  };

  const applyPreset = (key: string) => {
    const preset = PRESETS[key];
    setItems(preset);
    setInputText(preset.join("\n"));
    setWinner(null);
  };

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/spin-the-wheel`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/spin-the-wheel`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Spin the Wheel</h1>
        <p className="text-[var(--muted)] mb-8">
          Add your options, spin the wheel, and let fate decide! Perfect for random decisions and fun games.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Wheel */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {/* Pointer */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
                >
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "12px solid transparent",
                      borderRight: "12px solid transparent",
                      borderTop: "24px solid #ef4444",
                    }}
                  />
                </div>

                {/* Confetti Canvas */}
                {showConfetti && (
                  <canvas
                    ref={confettiCanvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none z-20"
                    style={{ width: "100%", height: "100%" }}
                  />
                )}

                <canvas
                  ref={canvasRef}
                  width={320}
                  height={320}
                  className="rounded-full"
                  style={{
                    boxShadow: "0 8px 30px rgba(0,0,0,0.15), 0 0 0 4px #e5e7eb",
                    maxWidth: "100%",
                  }}
                />
              </div>

              <button
                onClick={spin}
                disabled={isSpinning || items.length < 2}
                className="w-full py-4 rounded-xl text-xl font-black text-white transition-all duration-300 disabled:opacity-50 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #ef4444, #f59e0b, #22c55e, #3b82f6, #a855f7)",
                  backgroundSize: "300% 300%",
                  animation: "gradientShift 3s ease infinite",
                  boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                }}
              >
                {isSpinning ? "Spinning..." : "🎯 SPIN!"}
              </button>

              {/* Winner Display */}
              {winner && !isSpinning && (
                <div
                  className="mt-4 w-full text-center p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300"
                  style={{ animation: "bounceIn 0.5s ease-out" }}
                >
                  <p className="text-sm text-[var(--muted)] mb-1">Winner!</p>
                  <p className="text-2xl font-black text-amber-600">🎉 {winner} 🎉</p>
                </div>
              )}
            </div>

            {/* Options Panel */}
            <div>
              {/* Presets */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(PRESETS).map((key) => (
                    <button
                      key={key}
                      onClick={() => applyPreset(key)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--muted-bg)] hover:bg-gray-200 transition-colors"
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Your Options <span className="text-[var(--muted)]">(one per line, max 20)</span>
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => updateItems(e.target.value)}
                  rows={10}
                  className="w-full p-3 border rounded-lg bg-[var(--muted-bg)] font-mono text-sm resize-none"
                  placeholder={"Option 1\nOption 2\nOption 3"}
                  disabled={isSpinning}
                />
              </div>

              <p className="text-sm text-[var(--muted)]">
                {items.length} item{items.length !== 1 ? "s" : ""} on the wheel
                {items.length < 2 && (
                  <span className="text-red-500 ml-1">(need at least 2)</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Spin the Wheel Tool</h2>
          <p>
            Our Spin the Wheel tool is a fun, interactive random picker that helps you make decisions. Whether
            you&apos;re choosing what to eat, picking a game to play, or settling a debate, the wheel makes it
            exciting and fair.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Custom Options:</strong> Add up to 20 of your own items to the wheel</li>
            <li><strong>Quick Presets:</strong> Load popular wheel configurations with one click</li>
            <li><strong>Smooth Animation:</strong> Canvas-based wheel with realistic deceleration physics</li>
            <li><strong>Confetti Celebration:</strong> Fun particle effects when a winner is selected</li>
            <li><strong>Color Coded:</strong> Each segment gets a unique, vibrant color</li>
          </ul>

          <h2>Popular Uses</h2>
          <ul>
            <li>Choosing a restaurant or meal for dinner</li>
            <li>Picking a random student in class</li>
            <li>Deciding who does a chore or task</li>
            <li>Game night random selection</li>
            <li>Giveaway and raffle winners</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Spin the Wheel",
            description: META.description,
            url: `${SITE_URL}/tools/spin-the-wheel`,
            applicationCategory: "EntertainmentApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
