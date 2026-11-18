"use client";

import { useState, useRef, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "HTML Preview - Live HTML & CSS Editor Online Free",
  description:
    "Free live HTML and CSS preview tool. Write HTML code and see instant results in a live preview. Includes starter templates for landing pages, cards, forms, and navbars.",
  keywords: "html preview, live html editor, html css editor, code preview, html playground, html renderer online",
};

const TEMPLATES: { label: string; code: string }[] = [
  {
    label: "Landing Page",
    code: `<!DOCTYPE html>
<html>

<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, sans-serif; }
  .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center; }
  .hero h1 { font-size: 48px; margin-bottom: 16px; }
  .hero p { font-size: 20px; opacity: 0.9; margin-bottom: 32px; }
  .btn { display: inline-block; padding: 14px 32px; background: white; color: #667eea; border-radius: 8px; font-size: 16px; font-weight: bold; text-decoration: none; }
  .features { padding: 60px 20px; max-width: 800px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; text-align: center; }
  .feature { padding: 24px; }
  .feature h3 { margin: 12px 0 8px; }
  .feature p { color: #666; font-size: 14px; }
</style>

<body>
  <div class="hero">
    <h1>Welcome to MyApp</h1>
    <p>Build something amazing with our platform</p>
    <a href="#" class="btn">Get Started</a>
  </div>
  <div class="features">
    <div class="feature">
      <div style="font-size:36px">&#9889;</div>
      <h3>Fast</h3>
      <p>Lightning fast performance</p>
    </div>
    <div class="feature">
      <div style="font-size:36px">&#128274;</div>
      <h3>Secure</h3>
      <p>Enterprise-grade security</p>
    </div>
    <div class="feature">
      <div style="font-size:36px">&#128640;</div>
      <h3>Scalable</h3>
      <p>Grows with your needs</p>
    </div>
  </div>
</body>
</html>`,
  },
  {
    label: "Card",
    code: `<!DOCTYPE html>
<html>

<style>
  body { font-family: -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f5f5; margin: 0; }
  .card { background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.1); max-width: 360px; overflow: hidden; }
  .card-img { width: 100%; height: 200px; background: linear-gradient(135deg, #f093fb, #f5576c); }
  .card-body { padding: 24px; }
  .card-body h2 { margin: 0 0 8px; font-size: 22px; }
  .card-body p { color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 16px; }
  .card-btn { display: inline-block; padding: 10px 24px; background: #f5576c; color: white; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; }
</style>

<body>
  <div class="card">
    <div class="card-img"></div>
    <div class="card-body">
      <h2>Beautiful Card</h2>
      <p>This is a card component with a gradient header, body text, and a call-to-action button.</p>
      <a href="#" class="card-btn">Learn More</a>
    </div>
  </div>
</body>
</html>`,
  },
  {
    label: "Form",
    code: `<!DOCTYPE html>
<html>

<style>
  body { font-family: -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f2f5; margin: 0; }
  .form { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 2px 16px rgba(0,0,0,0.08); width: 400px; }
  .form h2 { margin: 0 0 8px; }
  .form p { color: #888; font-size: 14px; margin: 0 0 24px; }
  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; }
  .field input, .field select { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
  .field input:focus { outline: none; border-color: #667eea; }
  .btn { width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
  .btn:hover { background: #5a6fd6; }
</style>

<body>
  <form class="form" onsubmit="return false">
    <h2>Create Account</h2>
    <p>Fill in your details to get started</p>
    <div class="field">
      <label>Full Name</label>
      <input type="text" placeholder="John Doe" />
    </div>
    <div class="field">
      <label>Email</label>
      <input type="email" placeholder="john@example.com" />
    </div>
    <div class="field">
      <label>Password</label>
      <input type="password" placeholder="Min 8 characters" />
    </div>
    <button class="btn">Sign Up</button>
  </form>
</body>
</html>`,
  },
  {
    label: "Navbar",
    code: `<!DOCTYPE html>
<html>

<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, sans-serif; }
  nav { display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .logo { font-size: 22px; font-weight: 800; color: #333; }
  .logo span { color: #667eea; }
  .nav-links { display: flex; gap: 24px; list-style: none; }
  .nav-links a { color: #555; text-decoration: none; font-size: 15px; font-weight: 500; }
  .nav-links a:hover { color: #667eea; }
  .nav-btn { padding: 8px 20px; background: #667eea; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; }
  .content { padding: 60px 32px; text-align: center; }
  .content h1 { font-size: 36px; margin-bottom: 12px; }
  .content p { color: #666; font-size: 18px; }
</style>

<body>
  <nav>
    <div class="logo">My<span>App</span></div>
    <ul class="nav-links">
      <li><a href="#">Home</a></li>
      <li><a href="#">Features</a></li>
      <li><a href="#">Pricing</a></li>
      <li><a href="#">About</a></li>
    </ul>
    <button class="nav-btn">Sign Up</button>
  </nav>
  <div class="content">
    <h1>Page Content Here</h1>
    <p>This is a responsive navbar component</p>
  </div>
</body>
</html>`,
  },
];

export default function ScreenshotToCodePage() {
  const [code, setCode] = useState(TEMPLATES[0].code);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(code);
    doc.close();
  }, [code]);

  function copyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/screenshot-to-code`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/screenshot-to-code`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">HTML Preview</h1>
        <p className="text-[var(--muted)] mb-8">
          Write HTML and CSS code with a live preview. Pick a starter template or code from scratch.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <p className="text-sm font-medium mb-3">Starter Templates</p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                onClick={() => setCode(t.code)}
                className="px-3 py-1 text-xs rounded-full border border-[var(--card-border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="tool-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">HTML + CSS Code</p>
              <button onClick={copyCode} className="text-xs text-[var(--primary)]">
                {copied ? "Copied!" : "Copy HTML"}
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={24}
              className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-xs font-mono resize-none"
              spellCheck={false}
            />
          </div>

          <div className="tool-card">
            <p className="text-sm font-medium mb-2">Live Preview</p>
            <div className="border border-[var(--card-border)] rounded-lg overflow-hidden bg-white" style={{ height: "calc(24 * 1.5rem + 16px)" }}>
              <iframe
                ref={iframeRef}
                title="Preview"
                sandbox="allow-scripts"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>HTML Preview Tool</h2>
          <p>
            Write HTML and CSS code in the editor and see a live preview instantly. This tool is
            perfect for prototyping UI components, testing CSS styles, and learning web development.
          </p>

          <h2>Starter Templates</h2>
          <ul>
            <li><strong>Landing Page</strong> — Hero section with features grid</li>
            <li><strong>Card</strong> — Card component with image, text, and button</li>
            <li><strong>Form</strong> — Sign-up form with styled inputs</li>
            <li><strong>Navbar</strong> — Responsive navigation bar</li>
          </ul>

          <h2>Features</h2>
          <ul>
            <li>Live preview updates as you type</li>
            <li>Full HTML and CSS support</li>
            <li>Sandboxed iframe for safe rendering</li>
            <li>Copy HTML code with one click</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            All code runs locally in a sandboxed iframe. Nothing is sent to any server.
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
            name: "HTML Preview",
            description: META.description,
            url: `${SITE_URL}/tools/screenshot-to-code`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
