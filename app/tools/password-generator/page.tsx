"use client";

import { useState, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Password Generator - Generate Strong Passwords Online",
  description:
    "Free Password Generator to create strong, secure random passwords. Customize length and character types. Copy to clipboard instantly.",
  keywords: "password generator, random password, strong password generator, secure password, password maker",
};

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState<number>(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let charset = "";
    if (options.uppercase) charset += CHARSETS.uppercase;
    if (options.lowercase) charset += CHARSETS.lowercase;
    if (options.numbers) charset += CHARSETS.numbers;
    if (options.symbols) charset += CHARSETS.symbols;

    if (!charset) {
      setPassword("");
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    setPassword(result);
    setCopied(false);
  }, [length, options]);

  function copyToClipboard() {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function getStrength(): { label: string; color: string; percent: number } {
    if (!password) return { label: "", color: "#e2e8f0", percent: 0 };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { label: "Weak", color: "#ef4444", percent: 25 };
    if (score <= 4) return { label: "Fair", color: "#f59e0b", percent: 50 };
    if (score <= 5) return { label: "Good", color: "#3b82f6", percent: 75 };
    return { label: "Strong", color: "#22c55e", percent: 100 };
  }

  const strength = getStrength();

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/password-generator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Password Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Generate strong, secure random passwords with custom length and character options.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          {password && (
            <div className="mb-6">
              <div className="flex items-center gap-2 p-4 bg-[var(--muted-bg)] rounded-lg font-mono text-lg break-all">
                <span className="flex-1 select-all">{password}</span>
                <button onClick={copyToClipboard} className="btn-primary text-sm shrink-0">
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              {strength.label && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--muted)]">Strength</span>
                    <span className="font-medium" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${strength.percent}%`, background: strength.color }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Password Length: <span className="text-[var(--primary)] font-bold">{length}</span>
            </label>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
            <div className="flex justify-between text-xs text-[var(--muted)] mt-1">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {(Object.keys(CHARSETS) as (keyof typeof CHARSETS)[]).map((key) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                  className="accent-[var(--primary)] w-4 h-4"
                />
                <span className="text-sm capitalize">{key}</span>
                <span className="text-xs text-[var(--muted)]">
                  ({key === "symbols" ? "!@#$..." : CHARSETS[key].slice(0, 5)}...)
                </span>
              </label>
            ))}
          </div>

          <button onClick={generate} className="btn-primary w-full">
            Generate Password
          </button>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Why Use a Password Generator?</h2>
          <p>
            A strong, unique password is your first line of defense against hackers. Using a random password generator
            ensures your passwords are unpredictable and secure, unlike passwords you might create yourself.
          </p>

          <h2>What Makes a Strong Password?</h2>
          <ul>
            <li>At least 12-16 characters long</li>
            <li>Mix of uppercase and lowercase letters</li>
            <li>Includes numbers and special symbols</li>
            <li>Does not contain personal information</li>
            <li>Unique for each account</li>
          </ul>

          <h2>Password Security Tips</h2>
          <ul>
            <li>Never reuse passwords across different accounts</li>
            <li>Use a password manager to store your passwords</li>
            <li>Enable two-factor authentication (2FA) wherever possible</li>
            <li>Change passwords periodically for sensitive accounts</li>
            <li>Never share passwords via email or messaging</li>
          </ul>

          <h3>Is This Generator Secure?</h3>
          <p>
            Yes. All passwords are generated entirely in your browser using the Web Crypto API. No passwords are stored,
            transmitted, or logged anywhere. Your generated password never leaves your device.
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
            name: "Password Generator",
            description: META.description,
            url: `${SITE_URL}/tools/password-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
