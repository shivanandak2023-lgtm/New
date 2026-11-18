"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "What Is My IP Address - Check Your Public IP & Browser Info",
  description:
    "Find your public IP address instantly. See your IPv4 address, browser info, operating system, screen resolution, and language settings. Free IP checker tool.",
  keywords: "what is my ip, my ip address, check ip address, public ip, ip checker, find my ip",
};

interface BrowserInfo {
  browser: string;
  os: string;
  screenSize: string;
  language: string;
  languages: string;
  cookiesEnabled: boolean;
  doNotTrack: boolean;
  online: boolean;
  platform: string;
  colorDepth: number;
  pixelRatio: number;
  timezone: string;
}

export default function WhatIsMyIPPage() {
  const [ip, setIp] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);

  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        if (!res.ok) throw new Error("Failed to fetch IP");
        const data = await res.json();
        setIp(data.ip);
      } catch {
        setError("Could not detect your IP address. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    function detectBrowser(): BrowserInfo {
      const ua = navigator.userAgent;
      let browser = "Unknown";
      if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("Edg/")) browser = "Microsoft Edge";
      else if (ua.includes("Chrome")) browser = "Google Chrome";
      else if (ua.includes("Safari")) browser = "Safari";
      else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";

      let os = "Unknown";
      if (ua.includes("Windows NT 10")) os = "Windows 10/11";
      else if (ua.includes("Windows")) os = "Windows";
      else if (ua.includes("Mac OS X")) os = "macOS";
      else if (ua.includes("Linux")) os = "Linux";
      else if (ua.includes("Android")) os = "Android";
      else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

      return {
        browser,
        os,
        screenSize: `${screen.width} x ${screen.height}`,
        language: navigator.language,
        languages: navigator.languages?.join(", ") || navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack === "1",
        online: navigator.onLine,
        platform: navigator.platform || "Unknown",
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    }

    fetchIP();
    setBrowserInfo(detectBrowser());
  }, []);

  function copyIP() {
    if (!ip) return;
    navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/what-is-my-ip`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/what-is-my-ip`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">What Is My IP Address</h1>
        <p className="text-[var(--muted)] mb-8">
          Instantly detect your public IP address and browser information.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* IP Address */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Your Public IP Address</h2>

          {loading ? (
            <div className="text-center py-8">
              <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-[var(--primary)]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-[var(--muted)]">Detecting your IP address...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {error}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-5xl font-bold font-mono mb-4">{ip}</p>
              <p className="text-sm text-[var(--muted)] mb-4">IPv4 Address</p>
              <button
                onClick={copyIP}
                className="btn-primary"
              >
                {copied ? "Copied!" : "Copy IP Address"}
              </button>
            </div>
          )}
        </div>

        {/* Browser Info */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Your Browser & Device Info</h2>

          {browserInfo ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Browser", value: browserInfo.browser },
                { label: "Operating System", value: browserInfo.os },
                { label: "Screen Size", value: browserInfo.screenSize },
                { label: "Language", value: browserInfo.language },
                { label: "Platform", value: browserInfo.platform },
                { label: "Timezone", value: browserInfo.timezone },
                { label: "Color Depth", value: `${browserInfo.colorDepth}-bit` },
                { label: "Pixel Ratio", value: `${browserInfo.pixelRatio}x` },
                { label: "Online", value: browserInfo.online ? "Yes" : "No" },
                { label: "Cookies", value: browserInfo.cookiesEnabled ? "Enabled" : "Disabled" },
                { label: "Do Not Track", value: browserInfo.doNotTrack ? "Enabled" : "Disabled" },
                { label: "All Languages", value: browserInfo.languages },
              ].map((item) => (
                <div key={item.label} className="result-card text-center">
                  <p className="text-sm font-bold truncate" title={item.value}>{item.value}</p>
                  <p className="text-xs text-[var(--muted)]">{item.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--muted)]">Detecting browser info...</p>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the IP Address Checker</h2>
          <p>
            Your IP (Internet Protocol) address is a unique identifier assigned to your device by your
            Internet Service Provider. This tool detects your public IPv4 address using a secure API call,
            along with detailed browser and device information from your navigator object.
          </p>

          <h2>What Can Someone Do with Your IP?</h2>
          <p>
            Your IP address reveals your approximate location (city/region), ISP, and can be used
            for targeted advertising. However, it does not reveal your exact address or personal
            identity. Using a VPN can mask your real IP address for enhanced privacy.
          </p>

          <h2>IPv4 vs IPv6</h2>
          <ul>
            <li><strong>IPv4:</strong> 32-bit address (e.g., 192.168.1.1) with ~4.3 billion possible addresses</li>
            <li><strong>IPv6:</strong> 128-bit address (e.g., 2001:0db8::1) with virtually unlimited addresses</li>
            <li><strong>Public IP:</strong> Your external address visible to websites</li>
            <li><strong>Private IP:</strong> Your local network address (e.g., 192.168.x.x)</li>
          </ul>

          <h3>Browser Information Explained</h3>
          <ul>
            <li><strong>User Agent:</strong> Identifies your browser and OS to websites</li>
            <li><strong>Screen Resolution:</strong> Your display dimensions in pixels</li>
            <li><strong>Pixel Ratio:</strong> 1x is standard, 2x is Retina/HiDPI displays</li>
            <li><strong>Do Not Track:</strong> Browser setting requesting sites not to track you</li>
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
            name: "What Is My IP Address",
            description: META.description,
            url: `${SITE_URL}/tools/what-is-my-ip`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
