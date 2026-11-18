"use client";

import { useState, useRef, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Morse Code Translator - Text to Morse & Morse to Text",
  description:
    "Free Morse Code Translator. Convert text to Morse code and Morse code to text with live preview, audio playback, and a complete reference chart.",
  keywords: "morse code translator, morse code converter, text to morse, morse to text, morse code audio, morse code chart",
};

const MORSE_MAP: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.",
  "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-",
  "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-",
  "+": ".-.-.", "-": "-....-", "_": "..--.-", '"': ".-..-.",
  "$": "...-..-", "@": ".--.-.",
};

const REVERSE_MORSE: Record<string, string> = {};
for (const [k, v] of Object.entries(MORSE_MAP)) {
  REVERSE_MORSE[v] = k;
}

function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((ch) => {
      if (ch === " ") return "/";
      return MORSE_MAP[ch] || "";
    })
    .filter(Boolean)
    .join(" ");
}

function morseToText(morse: string): string {
  return morse
    .split(" / ")
    .map((word) =>
      word
        .split(" ")
        .map((code) => REVERSE_MORSE[code] || "")
        .join("")
    )
    .join(" ");
}

export default function MorseCodeTranslatorPage() {
  const [mode, setMode] = useState<"text-to-morse" | "morse-to-text">("text-to-morse");
  const [input, setInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef(false);

  const output = mode === "text-to-morse" ? textToMorse(input) : morseToText(input);

  const playMorse = useCallback(async () => {
    const morseStr = mode === "text-to-morse" ? output : textToMorse(morseToText(input));
    if (!morseStr) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    setIsPlaying(true);
    stopRef.current = false;

    const dot = 0.08;
    const dash = dot * 3;
    const gap = dot;
    const letterGap = dot * 3;
    const wordGap = dot * 7;

    for (const symbol of morseStr) {
      if (stopRef.current) break;

      if (symbol === ".") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 600;
        gain.gain.value = 0.3;
        osc.start();
        await new Promise((r) => setTimeout(r, dot * 1000));
        osc.stop();
        await new Promise((r) => setTimeout(r, gap * 1000));
      } else if (symbol === "-") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 600;
        gain.gain.value = 0.3;
        osc.start();
        await new Promise((r) => setTimeout(r, dash * 1000));
        osc.stop();
        await new Promise((r) => setTimeout(r, gap * 1000));
      } else if (symbol === " ") {
        await new Promise((r) => setTimeout(r, letterGap * 1000));
      } else if (symbol === "/") {
        await new Promise((r) => setTimeout(r, wordGap * 1000));
      }
    }

    setIsPlaying(false);
  }, [mode, output, input]);

  const stopMorse = () => {
    stopRef.current = true;
    setIsPlaying(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const chartEntries = Object.entries(MORSE_MAP).slice(0, 36);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/morse-code-translator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/morse-code-translator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Morse Code Translator</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert text to Morse code and Morse code to text. Listen to the audio and see visual dot/dash display.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setMode("text-to-morse"); setInput(""); }}
              className={mode === "text-to-morse" ? "btn-primary text-sm" : "btn-secondary text-sm"}
            >
              Text to Morse
            </button>
            <button
              onClick={() => { setMode("morse-to-text"); setInput(""); }}
              className={mode === "morse-to-text" ? "btn-primary text-sm" : "btn-secondary text-sm"}
            >
              Morse to Text
            </button>
          </div>

          <label className="block text-sm font-medium mb-2">
            {mode === "text-to-morse" ? "Enter Text" : "Enter Morse Code (use . and -, spaces between letters, / between words)"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field min-h-[100px] resize-y font-mono text-sm"
            placeholder={mode === "text-to-morse" ? "Type text here..." : ".- -... -.-. / -.. . ..-."}
          />
        </div>

        {output && (
          <div className="tool-card mb-6">
            <label className="block text-sm font-medium mb-2">
              {mode === "text-to-morse" ? "Morse Code Output" : "Text Output"}
            </label>
            <div className="result-card p-4 font-mono text-lg break-all leading-relaxed">
              {mode === "text-to-morse" ? (
                <span>
                  {output.split("").map((ch, i) => (
                    <span
                      key={i}
                      className={
                        ch === "." ? "text-[var(--primary)] font-bold" :
                        ch === "-" ? "text-orange-500 font-bold" :
                        ch === "/" ? "text-[var(--muted)]" : ""
                      }
                    >
                      {ch}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="text-2xl font-bold">{output}</span>
              )}
            </div>

            {mode === "text-to-morse" && (
              <div className="mt-3 p-3 bg-[var(--bg-secondary)] rounded text-center">
                {output.split(" ").map((code, i) => (
                  <span key={i} className="inline-flex items-center gap-0.5 mx-2 mb-1">
                    {code === "/" ? (
                      <span className="text-[var(--muted)] mx-2">|</span>
                    ) : (
                      code.split("").map((ch, j) => (
                        <span
                          key={j}
                          className={`inline-block rounded-full ${
                            ch === "." ? "w-2 h-2 bg-[var(--primary)]" : "w-6 h-2 bg-orange-500"
                          }`}
                        />
                      ))
                    )}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              {!isPlaying ? (
                <button onClick={playMorse} className="btn-primary text-sm">Play Audio</button>
              ) : (
                <button onClick={stopMorse} className="btn-secondary text-sm">Stop</button>
              )}
              <button onClick={handleCopy} className="btn-secondary text-sm">
                {copied ? "Copied!" : "Copy Output"}
              </button>
              <button onClick={() => setInput("")} className="btn-secondary text-sm">Clear</button>
            </div>
          </div>
        )}

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Morse Code Reference Chart</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {chartEntries.map(([char, code]) => (
              <div key={char} className="bg-[var(--bg-secondary)] p-2 rounded text-center">
                <p className="text-lg font-bold">{char}</p>
                <p className="text-sm font-mono text-[var(--primary)]">{code}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is Morse Code?</h2>
          <p>
            Morse code is a method of encoding text characters as sequences of dots (short signals) and
            dashes (long signals). It was invented by Samuel Morse in the 1830s for use with the telegraph.
          </p>

          <h2>How to Use</h2>
          <ul>
            <li><strong>Text to Morse:</strong> Type any text and see the Morse code translation instantly</li>
            <li><strong>Morse to Text:</strong> Enter dots (.) and dashes (-), spaces between letters, slashes (/) between words</li>
            <li><strong>Audio:</strong> Click Play Audio to hear the Morse code as beeps</li>
            <li><strong>Visual:</strong> See dots and dashes displayed as colored shapes</li>
          </ul>

          <h2>SOS in Morse Code</h2>
          <p>
            The most famous Morse code signal is SOS: <strong>... --- ...</strong> (three dots, three dashes, three dots).
            It was chosen as the international distress signal because it is easy to recognize.
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
            name: "Morse Code Translator",
            description: META.description,
            url: `${SITE_URL}/tools/morse-code-translator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
