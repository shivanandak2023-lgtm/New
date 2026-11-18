import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";
import Script from "next/script";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Free Online Calculators & Tools`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: `${SITE_NAME} — Free Online Calculators & Tools`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Free Online Calculators & Tools`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "y57G6nLBo9ZChVHs-RlsLKvB_bssXH2tzuazZ5fs7Lw",
  },
};

const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
const showAdsense = adsenseId && !adsenseId.includes("XXXX");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {showAdsense && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
        <header className="bg-[var(--card)] border-b border-[var(--card-border)] sticky top-0 z-50">
          <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" rx="6" fill="#2563eb" />
                <text x="14" y="20" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Inter, sans-serif">C</text>
              </svg>
              {SITE_NAME}
            </a>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="/" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                Home
              </a>
              <a href="/blog" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                Blog
              </a>
              <a href="/about" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                About
              </a>
              <a href="/privacy-policy" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                Privacy Policy
              </a>
              <ThemeToggle />
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <details className="relative">
                <summary className="list-none cursor-pointer p-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </summary>
                <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--card)] rounded-lg shadow-lg border border-[var(--card-border)] py-2 z-50">
                  <a href="/" className="block px-4 py-2 text-sm hover:bg-[var(--muted-bg)]">
                    Home
                  </a>
                  <a href="/blog" className="block px-4 py-2 text-sm hover:bg-[var(--muted-bg)]">
                    Blog
                  </a>
                  <a href="/about" className="block px-4 py-2 text-sm hover:bg-[var(--muted-bg)]">
                    About
                  </a>
                  <a href="/privacy-policy" className="block px-4 py-2 text-sm hover:bg-[var(--muted-bg)]">
                    Privacy Policy
                  </a>
                </div>
              </details>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-[var(--card)] border-t border-[var(--card-border)] mt-16">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-3">{SITE_NAME}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Free online calculators and tools for finance, math, health, development, and more. No signup required.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider mb-3 text-[var(--muted)]">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/" className="text-[var(--muted)] hover:text-[var(--primary)]">Home</a></li>
                  <li><a href="/blog" className="text-[var(--muted)] hover:text-[var(--primary)]">Blog</a></li>
                  <li><a href="/about" className="text-[var(--muted)] hover:text-[var(--primary)]">About</a></li>
                  <li><a href="/privacy-policy" className="text-[var(--muted)] hover:text-[var(--primary)]">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider mb-3 text-[var(--muted)]">Popular Tools</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/tools/emi-calculator" className="text-[var(--muted)] hover:text-[var(--primary)]">EMI Calculator</a></li>
                  <li><a href="/tools/gst-calculator" className="text-[var(--muted)] hover:text-[var(--primary)]">GST Calculator</a></li>
                  <li><a href="/tools/qr-code-generator" className="text-[var(--muted)] hover:text-[var(--primary)]">QR Code Generator</a></li>
                  <li><a href="/tools/image-compressor" className="text-[var(--muted)] hover:text-[var(--primary)]">Image Compressor</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-[var(--card-border)] mt-8 pt-6 text-center text-sm text-[var(--muted)]">
              &copy; 2026 {SITE_NAME}. All rights reserved.
            </div>
          </div>
        </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
