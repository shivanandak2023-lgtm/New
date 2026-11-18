"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "WiFi QR Code Generator - Share WiFi with QR Code",
  description:
    "Generate a QR code for your WiFi network. Guests can scan to connect instantly. Supports WPA, WPA2, WEP, and open networks.",
  keywords: "wifi qr code, wifi qr generator, share wifi, wifi qr code generator, connect wifi qr, wifi password qr",
};

type Encryption = "WPA" | "WEP" | "nopass";

function buildWifiString(ssid: string, password: string, encryption: Encryption, hidden: boolean) {
  const escaped = (s: string) => s.replace(/([\\;,:"'])/g, "\\$1");
  const t = encryption === "nopass" ? "nopass" : encryption;
  const p = encryption === "nopass" ? "" : escaped(password);
  return `WIFI:T:${t};S:${escaped(ssid)};P:${p};H:${hidden};;`;
}

export default function WifiQrGeneratorPage() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState<Encryption>("WPA");
  const [hidden, setHidden] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [wifiString, setWifiString] = useState("");
  const [error, setError] = useState("");
  const [size, setSize] = useState(400);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [showPassword, setShowPassword] = useState(false);

  async function generate() {
    if (!ssid.trim()) {
      setError("Please enter a network name (SSID)");
      setQrDataUrl("");
      return;
    }
    if (encryption !== "nopass" && !password.trim()) {
      setError("Please enter a password for the selected encryption type");
      setQrDataUrl("");
      return;
    }
    setError("");
    const str = buildWifiString(ssid, password, encryption, hidden);
    setWifiString(str);
    try {
      const url = await QRCode.toDataURL(str, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: "M",
      });
      setQrDataUrl(url);
    } catch {
      setError("Failed to generate QR code. Please try again.");
    }
  }

  function download() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `wifi-${ssid.replace(/\s+/g, "-")}-qr.png`;
    a.click();
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/wifi-qr-generator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/wifi-qr-generator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">WiFi QR Code Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Generate a QR code for your WiFi network. Guests can scan it with their phone camera to connect instantly.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="tool-card">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Network Name (SSID)</label>
              <input
                type="text"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                className="input-field"
                placeholder="e.g. MyHomeWiFi"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Encryption Type</label>
              <select
                value={encryption}
                onChange={(e) => setEncryption(e.target.value as Encryption)}
                className="input-field"
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>

            {encryption !== "nopass" && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-16"
                    placeholder="Enter WiFi password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--primary)] hover:underline"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}

            <div className="mb-4 flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hidden}
                  onChange={(e) => setHidden(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[var(--muted-bg)] peer-focus:outline-none rounded-full peer peer-checked:bg-[var(--primary)] border border-[var(--card-border)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-[var(--card-border)] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              </label>
              <span className="text-sm">Hidden Network</span>
            </div>

            <div className="border-t border-[var(--card-border)] pt-4 mt-4">
              <h3 className="text-sm font-semibold mb-3">Customize QR Code</h3>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Size: {size}px</label>
                <input
                  type="range"
                  min="200"
                  max="800"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">QR Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-[var(--card-border)]"
                    />
                    <span className="text-xs text-[var(--muted)]">{fgColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-[var(--card-border)]"
                    />
                    <span className="text-xs text-[var(--muted)]">{bgColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

            <button onClick={generate} className="btn-primary w-full mt-4">
              Generate WiFi QR Code
            </button>
          </div>

          <div className="tool-card flex flex-col items-center justify-center min-h-[400px]">
            {qrDataUrl ? (
              <>
                <img src={qrDataUrl} alt="WiFi QR Code" className="max-w-full border rounded-lg" />
                <p className="text-sm text-[var(--muted)] mt-3 text-center">
                  Scan this QR code with your phone camera to connect to WiFi
                </p>
                <button onClick={download} className="btn-primary mt-4">
                  Download PNG
                </button>

                {wifiString && (
                  <div className="mt-4 w-full">
                    <label className="block text-xs font-medium mb-1">WiFi String (for manual entry)</label>
                    <div className="bg-[var(--muted-bg)] p-2 rounded text-xs font-mono break-all border border-[var(--card-border)]">
                      {wifiString}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center">
                <p className="text-4xl mb-3">📶</p>
                <p className="text-[var(--muted)]">Your WiFi QR code will appear here</p>
              </div>
            )}
          </div>
        </div>

        <div className="ad-placeholder my-8">Advertisement</div>

        <div className="result-card mb-8">
          <h3 className="font-semibold mb-3">How to Use</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-2xl mb-2">1</p>
              <p className="font-medium">Enter Details</p>
              <p className="text-[var(--muted)]">Type your WiFi name and password</p>
            </div>
            <div className="text-center">
              <p className="text-2xl mb-2">2</p>
              <p className="font-medium">Generate QR</p>
              <p className="text-[var(--muted)]">Click generate and download the QR code</p>
            </div>
            <div className="text-center">
              <p className="text-2xl mb-2">3</p>
              <p className="font-medium">Scan &amp; Connect</p>
              <p className="text-[var(--muted)]">Guests scan with their phone camera</p>
            </div>
          </div>
        </div>

        <div className="seo-content tool-card">
          <h2>What is a WiFi QR Code?</h2>
          <p>
            A WiFi QR code encodes your wireless network credentials in a standard format. When someone scans the QR
            code with their smartphone camera, it automatically connects them to your WiFi network without needing to
            type the password manually.
          </p>

          <h2>How Does WiFi QR Code Work?</h2>
          <p>
            The QR code contains a specially formatted string that includes your network name (SSID), password, and
            encryption type. Modern smartphones (iOS 11+ and Android 10+) can read this format natively through the
            camera app.
          </p>

          <h2>WiFi QR Code Format</h2>
          <p>
            The standard WiFi QR code format is: <code>WIFI:T:WPA;S:networkname;P:password;H:false;;</code> where T is
            the encryption type, S is the SSID, P is the password, and H indicates if the network is hidden.
          </p>

          <h2>Supported Encryption Types</h2>
          <ul>
            <li><strong>WPA/WPA2/WPA3:</strong> Most common and secure option for home and business networks</li>
            <li><strong>WEP:</strong> Older encryption standard, less secure but still supported</li>
            <li><strong>None:</strong> Open networks without password protection</li>
          </ul>

          <h2>Use Cases for WiFi QR Codes</h2>
          <ul>
            <li>Print and display at home for guests</li>
            <li>Place in hotel rooms or Airbnb listings</li>
            <li>Display in cafes, restaurants, and offices</li>
            <li>Share WiFi at events and conferences</li>
            <li>Include in welcome packets or instructions</li>
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
            name: "WiFi QR Code Generator",
            description: META.description,
            url: `${SITE_URL}/tools/wifi-qr-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
