"use client";

import { useState, useRef, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Free Business Card Generator - Design & Download Cards",
  description:
    "Free online business card designer. Create professional business cards with live preview, multiple layouts, and download as PNG. No signup required.",
  keywords:
    "business card generator, business card maker, free business card, card designer, visiting card maker, business card template",
};

type Layout = "classic" | "modern" | "bold" | "minimal";
type FontStyle = "sans" | "serif" | "mono";

const FONT_MAP: Record<FontStyle, string> = {
  sans: "'Segoe UI', system-ui, -apple-system, sans-serif",
  serif: "'Georgia', 'Times New Roman', serif",
  mono: "'SF Mono', 'Consolas', 'Monaco', monospace",
};

export default function BusinessCardGeneratorPage() {
  const [cardName, setCardName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [cardEmail, setCardEmail] = useState("");
  const [cardPhone, setCardPhone] = useState("");
  const [cardWebsite, setCardWebsite] = useState("");
  const [address, setAddress] = useState("");

  const [layout, setLayout] = useState<Layout>("classic");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#1e293b");
  const [accentColor, setAccentColor] = useState("#2563eb");
  const [fontStyle, setFontStyle] = useState<FontStyle>("sans");
  const [showBack, setShowBack] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCard = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, isFront: boolean) => {
      const font = FONT_MAP[fontStyle];
      const name = cardName || "Your Name";
      const jobTitle = title || "Job Title";
      const comp = company || "Company Name";

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      if (!isFront) {
        // Back of card
        ctx.fillStyle = accentColor;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold 48px ${font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(comp, w / 2, h / 2 - 16);
        if (cardWebsite) {
          ctx.font = `20px ${font}`;
          ctx.fillText(cardWebsite, w / 2, h / 2 + 30);
        }
        return;
      }

      if (layout === "classic") {
        // Centered layout
        ctx.textAlign = "center";
        ctx.fillStyle = textColor;
        ctx.font = `bold 36px ${font}`;
        ctx.fillText(name, w / 2, 160);
        ctx.fillStyle = accentColor;
        ctx.font = `22px ${font}`;
        ctx.fillText(jobTitle, w / 2, 200);
        ctx.fillStyle = textColor;
        ctx.font = `18px ${font}`;
        ctx.fillText(comp, w / 2, 235);

        // Divider
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.25, 270);
        ctx.lineTo(w * 0.75, 270);
        ctx.stroke();

        ctx.fillStyle = textColor + "cc";
        ctx.font = `16px ${font}`;
        let contactY = 300;
        if (cardEmail) { ctx.fillText(cardEmail, w / 2, contactY); contactY += 24; }
        if (cardPhone) { ctx.fillText(cardPhone, w / 2, contactY); contactY += 24; }
        if (cardWebsite) { ctx.fillText(cardWebsite, w / 2, contactY); contactY += 24; }
        if (address) { ctx.fillText(address, w / 2, contactY); }
      } else if (layout === "modern") {
        // Left-aligned with accent bar
        ctx.fillStyle = accentColor;
        ctx.fillRect(0, 0, 8, h);

        ctx.textAlign = "left";
        const lx = 40;
        ctx.fillStyle = textColor;
        ctx.font = `bold 36px ${font}`;
        ctx.fillText(name, lx, 150);
        ctx.fillStyle = accentColor;
        ctx.font = `22px ${font}`;
        ctx.fillText(jobTitle, lx, 190);
        ctx.fillStyle = textColor;
        ctx.font = `18px ${font}`;
        ctx.fillText(comp, lx, 225);

        ctx.fillStyle = textColor + "cc";
        ctx.font = `15px ${font}`;
        let cy = 280;
        if (cardEmail) { ctx.fillText(cardEmail, lx, cy); cy += 22; }
        if (cardPhone) { ctx.fillText(cardPhone, lx, cy); cy += 22; }
        if (cardWebsite) { ctx.fillText(cardWebsite, lx, cy); cy += 22; }
        if (address) { ctx.fillText(address, lx, cy); }
      } else if (layout === "bold") {
        // Large name with accent background strip
        ctx.fillStyle = accentColor;
        ctx.fillRect(0, 0, w, 220);

        ctx.textAlign = "left";
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold 44px ${font}`;
        ctx.fillText(name, 40, 120);
        ctx.font = `22px ${font}`;
        ctx.fillText(jobTitle, 40, 165);
        ctx.font = `16px ${font}`;
        ctx.fillText(comp, 40, 200);

        ctx.fillStyle = textColor + "cc";
        ctx.font = `15px ${font}`;
        let by = 260;
        if (cardEmail) { ctx.fillText(cardEmail, 40, by); by += 22; }
        if (cardPhone) { ctx.fillText(cardPhone, 40, by); by += 22; }
        if (cardWebsite) { ctx.fillText(cardWebsite, 40, by); by += 22; }
        if (address) { ctx.fillText(address, 40, by); }
      } else {
        // Minimal
        ctx.textAlign = "left";
        ctx.fillStyle = textColor;
        ctx.font = `bold 32px ${font}`;
        ctx.fillText(name, 50, 170);
        ctx.fillStyle = textColor + "88";
        ctx.font = `18px ${font}`;
        ctx.fillText(`${jobTitle}${comp ? " | " + comp : ""}`, 50, 210);

        ctx.fillStyle = textColor + "aa";
        ctx.font = `14px ${font}`;
        const contactParts = [cardEmail, cardPhone, cardWebsite, address].filter(Boolean);
        ctx.fillText(contactParts.join("  |  "), 50, h - 60);

        // Subtle accent line
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(50, 230);
        ctx.lineTo(w - 50, 230);
        ctx.stroke();
      }
    },
    [cardName, title, company, cardEmail, cardPhone, cardWebsite, address, layout, bgColor, textColor, accentColor, fontStyle]
  );

  function downloadCard() {
    const canvas = document.createElement("canvas");
    canvas.width = 1050;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderCard(ctx, 1050, 600, !showBack);
    const link = document.createElement("a");
    link.download = `business-card-${showBack ? "back" : "front"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  // Inline preview rendering
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  function drawPreview() {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderCard(ctx, canvas.width, canvas.height, !showBack);
  }

  // Re-render preview when anything changes
  useState(() => {
    setTimeout(drawPreview, 100);
  });

  // We use a useEffect-like approach via key prop
  // Simple: just call drawPreview after render
  const prevKey = `${cardName}-${title}-${company}-${cardEmail}-${cardPhone}-${cardWebsite}-${address}-${layout}-${bgColor}-${textColor}-${accentColor}-${fontStyle}-${showBack}`;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/business-card-generator`} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">
            &larr; All Tools
          </a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Business Card Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Design professional business cards for free. Customize layout, colors, and fonts. Download as print-ready PNG.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Form */}
          <div className="space-y-6">
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Card Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} className="input-field" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Job Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Software Engineer" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="input-field" placeholder="Acme Inc." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={cardEmail} onChange={(e) => setCardEmail(e.target.value)} className="input-field" placeholder="john@acme.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" value={cardPhone} onChange={(e) => setCardPhone(e.target.value)} className="input-field" placeholder="+1 234 567 890" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <input type="text" value={cardWebsite} onChange={(e) => setCardWebsite(e.target.value)} className="input-field" placeholder="www.acme.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="input-field" placeholder="123 Main St, New York, NY 10001" />
                </div>
              </div>
            </div>

            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Design Options</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Layout</label>
                  <select value={layout} onChange={(e) => setLayout(e.target.value as Layout)} className="input-field">
                    <option value="classic">Classic (Centered)</option>
                    <option value="modern">Modern (Left-aligned)</option>
                    <option value="bold">Bold (Large name)</option>
                    <option value="minimal">Minimal (Clean)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Font</label>
                  <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value as FontStyle)} className="input-field">
                    <option value="sans">Sans-serif</option>
                    <option value="serif">Serif</option>
                    <option value="mono">Modern</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Background</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 cursor-pointer border-0 rounded" />
                    <span className="text-xs text-[var(--muted)]">{bgColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Text</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 cursor-pointer border-0 rounded" />
                    <span className="text-xs text-[var(--muted)]">{textColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Accent</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-8 h-8 cursor-pointer border-0 rounded" />
                    <span className="text-xs text-[var(--muted)]">{accentColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Preview */}
          <div className="tool-card sticky top-4 self-start">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Card Preview</h2>
              <div className="flex gap-2">
                <button onClick={() => setShowBack(false)} className={`px-3 py-1 rounded text-sm cursor-pointer ${!showBack ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}>Front</button>
                <button onClick={() => setShowBack(true)} className={`px-3 py-1 rounded text-sm cursor-pointer ${showBack ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"}`}>Back</button>
              </div>
            </div>

            <p className="text-xs text-[var(--muted)] mb-3">3.5&quot; &times; 2&quot; standard size</p>

            {/* CSS Preview (always up to date) */}
            <div className="flex justify-center mb-4">
              <CardPreview
                key={prevKey}
                name={cardName}
                title={title}
                company={company}
                email={cardEmail}
                phone={cardPhone}
                website={cardWebsite}
                address={address}
                layout={layout}
                bgColor={bgColor}
                textColor={textColor}
                accentColor={accentColor}
                fontStyle={fontStyle}
                showBack={showBack}
              />
            </div>

            <canvas ref={previewCanvasRef} width={525} height={300} className="hidden" />

            <div className="text-center">
              <button onClick={downloadCard} className="btn-primary px-6 py-2">
                Download as PNG
              </button>
              <p className="text-xs text-[var(--muted)] mt-2">1050&times;600px print-ready output</p>
            </div>
          </div>
        </div>

        <div className="ad-placeholder my-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Free Business Card Generator</h2>
          <p>
            Design and download professional business cards without any design software. Choose from 4 layout
            templates, customize colors and fonts, and download print-ready PNG files. Perfect for entrepreneurs,
            freelancers, and professionals.
          </p>

          <h2>What to Include on a Business Card</h2>
          <ul>
            <li><strong>Name:</strong> Your full name prominently displayed</li>
            <li><strong>Job title:</strong> Your role or professional title</li>
            <li><strong>Company name:</strong> The organization you represent</li>
            <li><strong>Contact info:</strong> Email, phone number, and website</li>
            <li><strong>Address:</strong> Physical location if relevant to your business</li>
          </ul>

          <h2>Business Card Design Tips</h2>
          <ul>
            <li>Keep the design clean and uncluttered</li>
            <li>Use readable fonts at appropriate sizes</li>
            <li>Ensure good contrast between text and background</li>
            <li>Standard size is 3.5&quot; &times; 2&quot; (89mm &times; 51mm)</li>
            <li>Include only essential contact information</li>
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
            name: "Business Card Generator",
            description: META.description,
            url: `${SITE_URL}/tools/business-card-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}

/* CSS-based card preview component for real-time updates */
function CardPreview({
  name, title, company, email, phone, website, address,
  layout, bgColor, textColor, accentColor, fontStyle, showBack,
}: {
  name: string; title: string; company: string; email: string; phone: string;
  website: string; address: string; layout: Layout; bgColor: string;
  textColor: string; accentColor: string; fontStyle: FontStyle; showBack: boolean;
}) {
  const font = FONT_MAP[fontStyle];
  const displayName = name || "Your Name";
  const displayTitle = title || "Job Title";
  const displayCompany = company || "Company Name";
  const contactParts = [email, phone, website, address].filter(Boolean);

  const cardStyle: React.CSSProperties = {
    width: "350px",
    height: "200px",
    borderRadius: "8px",
    fontFamily: font,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    position: "relative",
  };

  if (showBack) {
    return (
      <div style={{ ...cardStyle, backgroundColor: accentColor, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <div style={{ fontSize: "18px", fontWeight: 700 }}>{displayCompany}</div>
        {website && <div style={{ fontSize: "10px", marginTop: "6px", opacity: 0.8 }}>{website}</div>}
      </div>
    );
  }

  if (layout === "classic") {
    return (
      <div style={{ ...cardStyle, backgroundColor: bgColor, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", textAlign: "center" }}>
        <div style={{ fontSize: "16px", fontWeight: 700, color: textColor }}>{displayName}</div>
        <div style={{ fontSize: "10px", color: accentColor, marginTop: "2px" }}>{displayTitle}</div>
        <div style={{ fontSize: "9px", color: textColor, marginTop: "2px" }}>{displayCompany}</div>
        <div style={{ width: "50%", height: "1px", backgroundColor: accentColor, margin: "8px 0" }} />
        <div style={{ fontSize: "8px", color: textColor + "cc", lineHeight: 1.6 }}>
          {contactParts.map((p, i) => <div key={i}>{p}</div>)}
        </div>
      </div>
    );
  }

  if (layout === "modern") {
    return (
      <div style={{ ...cardStyle, backgroundColor: bgColor, display: "flex", padding: "16px 16px 16px 24px" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", backgroundColor: accentColor }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: "16px", fontWeight: 700, color: textColor }}>{displayName}</div>
          <div style={{ fontSize: "10px", color: accentColor, marginTop: "2px" }}>{displayTitle}</div>
          <div style={{ fontSize: "9px", color: textColor, marginTop: "2px" }}>{displayCompany}</div>
          <div style={{ marginTop: "12px", fontSize: "8px", color: textColor + "cc", lineHeight: 1.6 }}>
            {contactParts.map((p, i) => <div key={i}>{p}</div>)}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "bold") {
    return (
      <div style={{ ...cardStyle, backgroundColor: bgColor }}>
        <div style={{ backgroundColor: accentColor, padding: "14px 16px", color: "#fff" }}>
          <div style={{ fontSize: "17px", fontWeight: 700 }}>{displayName}</div>
          <div style={{ fontSize: "10px", marginTop: "2px" }}>{displayTitle}</div>
          <div style={{ fontSize: "8px", marginTop: "2px", opacity: 0.9 }}>{displayCompany}</div>
        </div>
        <div style={{ padding: "10px 16px", fontSize: "8px", color: textColor + "cc", lineHeight: 1.6 }}>
          {contactParts.map((p, i) => <div key={i}>{p}</div>)}
        </div>
      </div>
    );
  }

  // Minimal
  return (
    <div style={{ ...cardStyle, backgroundColor: bgColor, display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px" }}>
      <div style={{ fontSize: "15px", fontWeight: 700, color: textColor }}>{displayName}</div>
      <div style={{ fontSize: "9px", color: textColor + "88", marginTop: "2px" }}>
        {displayTitle}{displayCompany ? ` | ${displayCompany}` : ""}
      </div>
      <div style={{ width: "calc(100% - 10px)", height: "1px", backgroundColor: accentColor, margin: "10px 0", opacity: 0.5 }} />
      <div style={{ fontSize: "7px", color: textColor + "aa" }}>
        {contactParts.join("  |  ")}
      </div>
    </div>
  );
}
