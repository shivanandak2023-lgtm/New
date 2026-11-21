"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Fancy Text Generator - Cool Fonts Copy and Paste",
  description:
    "Free Fancy Text Generator with 12+ Unicode font styles. Convert text to bold, italic, script, fraktur, monospace, circled, squared, small caps, strikethrough, underline, upside down, and backwards. Copy and paste anywhere.",
  keywords: "fancy text generator, cool fonts, text fonts copy paste, font generator, unicode text, fancy letters, instagram fonts",
};

// Character maps for Unicode styles
const LOWER_A = 97; // 'a'
const UPPER_A = 65; // 'A'
const DIGIT_0 = 48; // '0'

function buildMap(lowerStart: number, upperStart: number, digitStart?: number): Record<string, string> {
  const map: Record<string, string> = {};
  for (let i = 0; i < 26; i++) {
    map[String.fromCharCode(LOWER_A + i)] = String.fromCodePoint(lowerStart + i);
    map[String.fromCharCode(UPPER_A + i)] = String.fromCodePoint(upperStart + i);
  }
  if (digitStart !== undefined) {
    for (let i = 0; i < 10; i++) {
      map[String.fromCharCode(DIGIT_0 + i)] = String.fromCodePoint(digitStart + i);
    }
  }
  return map;
}

// Mathematical Bold: U+1D400 (A) U+1D41A (a) U+1D7CE (0)
const BOLD_MAP = buildMap(0x1D41A, 0x1D400, 0x1D7CE);
// Mathematical Italic: U+1D434 (A) U+1D44E (a) — no digits
const ITALIC_MAP = buildMap(0x1D44E, 0x1D434);
// Monospace: U+1D670 (A) U+1D68A (a) U+1D7F6 (0)
const MONO_MAP = buildMap(0x1D68A, 0x1D670, 0x1D7F6);
// Script (Bold): U+1D4D0 (A) U+1D4EA (a)
const SCRIPT_MAP = buildMap(0x1D4EA, 0x1D4D0);
// Fraktur: U+1D504 (A) U+1D51E (a) — some exceptions
const FRAKTUR_MAP = buildMap(0x1D51E, 0x1D504);
// Fix Fraktur exceptions: C H I R Z
FRAKTUR_MAP["C"] = "\u212D";
FRAKTUR_MAP["H"] = "\u210C";
FRAKTUR_MAP["I"] = "\u2111";
FRAKTUR_MAP["R"] = "\u211C";
FRAKTUR_MAP["Z"] = "\u2128";

// Circled letters: U+24B6 (A) U+24D0 (a) U+2460 (1) — 0 is U+24EA
const CIRCLED_MAP: Record<string, string> = {};
for (let i = 0; i < 26; i++) {
  CIRCLED_MAP[String.fromCharCode(LOWER_A + i)] = String.fromCodePoint(0x24D0 + i);
  CIRCLED_MAP[String.fromCharCode(UPPER_A + i)] = String.fromCodePoint(0x24B6 + i);
}
for (let i = 1; i <= 9; i++) {
  CIRCLED_MAP[String(i)] = String.fromCodePoint(0x2460 + i - 1);
}
CIRCLED_MAP["0"] = "\u24EA";

// Squared (Negative Squared): U+1F170 (A)
const SQUARED_MAP: Record<string, string> = {};
for (let i = 0; i < 26; i++) {
  SQUARED_MAP[String.fromCharCode(UPPER_A + i)] = String.fromCodePoint(0x1F170 + i);
  SQUARED_MAP[String.fromCharCode(LOWER_A + i)] = String.fromCodePoint(0x1F170 + i);
}

// Small Caps
const SMALL_CAPS_STR = "abcdefghijklmnopqrstuvwxyz";
const SMALL_CAPS_VALS = "\u1D00\u0299\u1D04\u1D05\u1D07\u0493\u0262\u029C\u026A\u1D0A\u1D0B\u029F\u1D0D\u0274\u1D0F\u1D18\u01EB\u0280\u0455\u1D1B\u1D1C\u1D20\u1D21x\u028F\u1D22";
const SMALL_CAPS_MAP: Record<string, string> = {};
for (let i = 0; i < 26; i++) {
  SMALL_CAPS_MAP[SMALL_CAPS_STR[i]] = SMALL_CAPS_VALS[i];
  SMALL_CAPS_MAP[SMALL_CAPS_STR[i].toUpperCase()] = SMALL_CAPS_VALS[i].toUpperCase !== undefined ? SMALL_CAPS_VALS[i] : SMALL_CAPS_VALS[i];
}

// Upside down map
const FLIP_MAP: Record<string, string> = {
  a: "\u0250", b: "q", c: "\u0254", d: "p", e: "\u01DD", f: "\u025F",
  g: "\u0183", h: "\u0265", i: "\u1D09", j: "\u027E", k: "\u029E", l: "\u05DF",
  m: "\u026F", n: "u", o: "o", p: "d", q: "b", r: "\u0279",
  s: "s", t: "\u0287", u: "n", v: "\u028C", w: "\u028D", x: "x",
  y: "z", z: "z",
  A: "\u0250", B: "Q", C: "\u0254", D: "p", E: "\u018E", F: "\u025F",
  G: "\u05E4", H: "H", I: "I", J: "\u027E", K: "\u029E", L: "\u05DF",
  M: "\u026F", N: "N", O: "O", P: "\u0500", Q: "Q", R: "\u0279",
  S: "S", T: "\u27D8", U: "\u2229", V: "\u039B", W: "\u028D", X: "X",
  Y: "\u2144", Z: "Z",
  "0": "0", "1": "\u0196", "2": "\u1105", "3": "\u0190", "4": "\u07C8",
  "5": "9", "6": "L", "7": "8", "8": "\u0036", "9": "\u02D9",
  ".": "\u02D9", ",": "'", "!": "\u00A1", "?": "\u00BF",
  "'": ",", '"': "\u201E", "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{",
};

function applyMap(text: string, map: Record<string, string>): string {
  return [...text].map((ch) => map[ch] || ch).join("");
}

function applyStrikethrough(text: string): string {
  return [...text].map((ch) => ch + "\u0336").join("");
}

function applyUnderline(text: string): string {
  return [...text].map((ch) => ch + "\u0332").join("");
}

function applyFlip(text: string): string {
  return [...text].reverse().map((ch) => FLIP_MAP[ch] || ch).join("");
}

function applyBackwards(text: string): string {
  return [...text].reverse().join("");
}

interface Style {
  name: string;
  transform: (text: string) => string;
}

const STYLES: Style[] = [
  { name: "\uD835\uDDD5\uD835\uDDFC\uD835\uDDF9\uD835\uDDF1 (Bold)", transform: (t) => applyMap(t, BOLD_MAP) },
  { name: "\uD835\uDE10\uD835\uDE35\uD835\uDE22\uD835\uDE2D\uD835\uDE2A\uD835\uDE24 (Italic)", transform: (t) => applyMap(t, ITALIC_MAP) },
  { name: "\uD835\uDE7C\uD835\uDE98\uD835\uDE97\uD835\uDE98\uD835\uDE9C\uD835\uDE99\uD835\uDE8A\uD835\uDE8C\uD835\uDE8E (Monospace)", transform: (t) => applyMap(t, MONO_MAP) },
  { name: "\uD835\uDCE2\uD835\uDCEC\uD835\uDCFB\uD835\uDCF2\uD835\uDCF9\uD835\uDCFD (Script)", transform: (t) => applyMap(t, SCRIPT_MAP) },
  { name: "\uD835\uDD09\uD835\uDD2F\uD835\uDD1E\uD835\uDD28\uD835\uDD2D\uD835\uDD32\uD835\uDD2F (Fraktur)", transform: (t) => applyMap(t, FRAKTUR_MAP) },
  { name: "\u24B8\u24D8\u24E1\u24D2\u24DB\u24D4\u24D3 (Circled)", transform: (t) => applyMap(t, CIRCLED_MAP) },
  { name: "\uD83C\uDD71\uD83C\uDD7B\uD83C\uDD7E\uD83C\uDD72\uD83C\uDD7A (Squared)", transform: (t) => applyMap(t, SQUARED_MAP) },
  { name: "\u0455\u1D0D\u1D00\u029F\u029F \u1D04\u1D00\u1D18\u0455 (Small Caps)", transform: (t) => applyMap(t, SMALL_CAPS_MAP) },
  { name: "s\u0336t\u0336r\u0336i\u0336k\u0336e\u0336t\u0336h\u0336r\u0336o\u0336u\u0336g\u0336h\u0336 (Strikethrough)", transform: applyStrikethrough },
  { name: "u\u0332n\u0332d\u0332e\u0332r\u0332l\u0332i\u0332n\u0332e\u0332 (Underline)", transform: applyUnderline },
  { name: "u\u028Dop \u01DDp\u1D09sd\u0548 (Upside Down)", transform: applyFlip },
  { name: "sdrawkcab (Backwards)", transform: applyBackwards },
];

export default function FancyTextGeneratorPage() {
  const [text, setText] = useState("Hello World");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const results = useMemo(() => {
    return STYLES.map((style) => ({
      name: style.name,
      result: style.transform(text),
    }));
  }, [text]);

  function copyText(value: string, idx: number) {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/fancy-text-generator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/fancy-text-generator`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Fancy Text Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Type your text and instantly convert it to 12+ cool Unicode font styles. Copy and paste anywhere — social media, bios, messages.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <label className="block text-sm font-medium mb-1">Enter Your Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full p-3 border rounded-lg bg-[var(--muted-bg)] text-lg"
            placeholder="Type something..."
          />
        </div>

        {text.trim() && (
          <div className="space-y-4 mb-8">
            {results.map((r, i) => (
              <div key={i} className="result-card">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-sm font-medium text-[var(--muted)]">{r.name}</span>
                  <button
                    onClick={() => copyText(r.result, i)}
                    className="btn-primary text-sm shrink-0"
                  >
                    {copiedIdx === i ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-lg break-all leading-relaxed">{r.result}</p>
              </div>
            ))}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Fancy Text Generator</h2>
          <p>
            Our free Fancy Text Generator converts your regular text into beautiful Unicode font styles
            that you can copy and paste anywhere. Unlike regular fonts that only work in specific apps,
            Unicode characters are supported across all platforms — Instagram, Twitter, Facebook, TikTok,
            Discord, WhatsApp, and more. These are not actual fonts but special Unicode characters that
            look like different typefaces.
          </p>

          <h2>Available Font Styles</h2>
          <ul>
            <li><strong>Bold:</strong> Mathematical Bold characters that appear bolder than regular text, great for emphasis in social media bios and posts</li>
            <li><strong>Italic:</strong> Mathematical Italic characters for elegant, slanted text styling</li>
            <li><strong>Monospace:</strong> Fixed-width characters resembling code or typewriter text</li>
            <li><strong>Script:</strong> Fancy cursive handwriting-style characters for an elegant look</li>
            <li><strong>Fraktur:</strong> Gothic blackletter style reminiscent of medieval manuscripts</li>
            <li><strong>Circled:</strong> Letters enclosed in circles for a unique bubble effect</li>
            <li><strong>Squared:</strong> Negative squared letters for bold, blocky text</li>
            <li><strong>Small Caps:</strong> Uppercase-looking characters at lowercase size for a refined appearance</li>
            <li><strong>Strikethrough:</strong> Text with a line through the middle using combining characters</li>
            <li><strong>Underline:</strong> Text with a continuous underline using combining characters</li>
            <li><strong>Upside Down:</strong> Flipped characters that appear rotated 180 degrees</li>
            <li><strong>Backwards:</strong> Reversed text that reads right-to-left</li>
          </ul>

          <h2>How It Works</h2>
          <p>
            This font generator uses Unicode, the universal character encoding standard. Unicode includes
            thousands of special characters in various mathematical and decorative blocks. When you type
            regular text, our tool maps each letter to its corresponding Unicode equivalent in the selected
            style. Because these are real Unicode characters (not images or custom fonts), they work
            everywhere text is supported — from social media posts to email signatures.
          </p>

          <h2>Popular Use Cases for Fancy Fonts</h2>
          <ul>
            <li>Instagram bios and captions with stylish text</li>
            <li>Twitter and Facebook posts that stand out</li>
            <li>Discord server names and messages</li>
            <li>WhatsApp and Telegram status updates</li>
            <li>TikTok video captions and profile bios</li>
            <li>YouTube channel descriptions and comments</li>
            <li>Email subject lines for creative campaigns</li>
            <li>Gaming usernames and profiles</li>
          </ul>

          <h2>Tips for Using Fancy Text</h2>
          <p>
            While fancy Unicode text works in most places, some platforms may not render every character
            perfectly. We recommend testing your converted text before publishing. Keep in mind that
            screen readers may have difficulty with some Unicode styles, so use them sparingly for
            accessibility. The Bold, Italic, and Small Caps styles tend to have the widest compatibility
            across devices and platforms. For maximum impact, combine fancy text with regular text rather
            than converting entire paragraphs.
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
            name: "Fancy Text Generator",
            description: META.description,
            url: `${SITE_URL}/tools/fancy-text-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
