"use client";

import { useState, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Binary, Decimal, Hex & Octal Converter",
  description:
    "Free online converter between Binary, Decimal, Hexadecimal, and Octal number systems. Live conversion as you type with instant results.",
  keywords:
    "binary to decimal, hex to decimal, binary converter, hexadecimal converter, octal converter, number base converter",
};

type Base = "binary" | "decimal" | "hexadecimal" | "octal";

const BASES: { key: Base; label: string; prefix: string; radix: number; pattern: RegExp }[] = [
  { key: "binary", label: "Binary", prefix: "0b", radix: 2, pattern: /^[01]*$/ },
  { key: "decimal", label: "Decimal", prefix: "", radix: 10, pattern: /^[0-9]*$/ },
  { key: "hexadecimal", label: "Hexadecimal", prefix: "0x", radix: 16, pattern: /^[0-9a-fA-F]*$/ },
  { key: "octal", label: "Octal", prefix: "0o", radix: 8, pattern: /^[0-7]*$/ },
];

export default function BinaryHexConverterPage() {
  const [inputBase, setInputBase] = useState<Base>("decimal");
  const [inputValue, setInputValue] = useState("255");
  const [error, setError] = useState("");

  const currentBase = BASES.find((b) => b.key === inputBase)!;

  const getConversions = useCallback(() => {
    if (!inputValue.trim()) return null;

    if (!currentBase.pattern.test(inputValue)) {
      return null;
    }

    const decimal = parseInt(inputValue, currentBase.radix);
    if (isNaN(decimal) || decimal < 0) return null;

    return {
      binary: decimal.toString(2),
      decimal: decimal.toString(10),
      hexadecimal: decimal.toString(16).toUpperCase(),
      octal: decimal.toString(8),
    };
  }, [inputValue, currentBase]);

  const conversions = getConversions();

  function handleInputChange(val: string) {
    setError("");
    if (val === "" || currentBase.pattern.test(val)) {
      setInputValue(val);
    } else {
      setError(`Invalid character for ${currentBase.label}`);
    }
  }

  function handleBaseChange(base: Base) {
    // Convert current value to new base's representation
    if (conversions) {
      setInputValue(conversions[base].toLowerCase() === conversions[base] ? conversions[base] : conversions[base]);
      // Keep the decimal value but switch input to the new base representation
      const decimal = parseInt(inputValue, currentBase.radix);
      if (!isNaN(decimal)) {
        const newBase = BASES.find((b) => b.key === base)!;
        const converted = decimal.toString(newBase.radix);
        setInputValue(base === "hexadecimal" ? converted.toUpperCase() : converted);
      }
    }
    setInputBase(base);
    setError("");
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/binary-hex-converter`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">
            &larr; All Tools
          </a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Binary, Decimal, Hex &amp; Octal Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Convert between number systems instantly. Type a value and see live results in all bases.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <h2 className="font-bold text-lg mb-4">Input</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {BASES.map((b) => (
              <button
                key={b.key}
                onClick={() => handleBaseChange(b.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  inputBase === b.key
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-gray-200"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-2">
            {currentBase.prefix && (
              <span className="text-lg font-mono font-bold text-[var(--muted)]">{currentBase.prefix}</span>
            )}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="input-field font-mono text-lg"
              placeholder={`Enter ${currentBase.label} value`}
            />
          </div>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>

        {conversions && (
          <div className="tool-card mb-8">
            <h2 className="font-bold text-lg mb-4">Results</h2>
            <div className="space-y-4">
              {BASES.map((b) => (
                <div
                  key={b.key}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    b.key === inputBase ? "bg-[var(--primary-light)] border border-blue-200" : "bg-[var(--muted-bg)]"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--muted)] mb-1">{b.label}</p>
                    <p className="font-mono text-lg font-bold break-all">
                      {b.prefix && <span className="text-[var(--muted)]">{b.prefix}</span>}
                      {conversions[b.key]}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(conversions[b.key])}
                    className="btn-secondary text-xs ml-4 shrink-0"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick reference */}
        <div className="tool-card mb-8">
          <h2 className="font-bold text-lg mb-4">Quick Reference Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Decimal</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Binary</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Hex</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Octal</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 4, 8, 10, 15, 16, 32, 64, 100, 128, 255, 256, 512, 1024].map((n) => (
                  <tr key={n}>
                    <td className="border border-[var(--card-border)] px-3 py-1">{n}</td>
                    <td className="border border-[var(--card-border)] px-3 py-1">{n.toString(2)}</td>
                    <td className="border border-[var(--card-border)] px-3 py-1">{n.toString(16).toUpperCase()}</td>
                    <td className="border border-[var(--card-border)] px-3 py-1">{n.toString(8)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Number Base Conversion Explained</h2>
          <p>
            Number base conversion is the process of changing a number from one numeral system to another. The most
            common bases in computing are binary (base 2), decimal (base 10), hexadecimal (base 16), and octal (base 8).
          </p>

          <h2>Why Different Number Systems?</h2>
          <ul>
            <li><strong>Binary (Base 2):</strong> The fundamental language of computers, using only 0 and 1</li>
            <li><strong>Decimal (Base 10):</strong> The everyday number system used by humans</li>
            <li><strong>Hexadecimal (Base 16):</strong> Compact representation of binary data, widely used in programming for colors, memory addresses, and more</li>
            <li><strong>Octal (Base 8):</strong> Used in Unix/Linux file permissions and some legacy systems</li>
          </ul>

          <h2>How to Convert Manually</h2>
          <p>
            To convert from any base to decimal, multiply each digit by the base raised to its positional power and sum
            the results. To convert from decimal to another base, repeatedly divide by the target base and collect remainders.
          </p>

          <h2>Common Use Cases</h2>
          <ul>
            <li>Web development: Converting hex color codes (#FF5733)</li>
            <li>Networking: Understanding IP addresses and subnet masks in binary</li>
            <li>Programming: Debugging memory addresses in hexadecimal</li>
            <li>Linux: Setting file permissions using octal notation (chmod 755)</li>
          </ul>
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Binary, Decimal, Hex & Octal Converter",
            description: META.description,
            url: `${SITE_URL}/tools/binary-hex-converter`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
