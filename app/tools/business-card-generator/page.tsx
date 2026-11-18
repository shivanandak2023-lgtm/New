"use client";

import { useState, useRef, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import LogoUploader from "@/components/LogoUploader";

const META = {
  title: "Free Business Card Generator - Design & Download Cards",
  description:
    "Free online business card designer. Create professional business cards with 8 templates, live preview, and download as PNG. No signup required.",
  keywords:
    "business card generator, business card maker, free business card, card designer, visiting card maker, business card template",
};

type Template =
  | "corporate-blue"
  | "modern-dark"
  | "creative-gradient"
  | "minimal-white"
  | "nature-green"
  | "bold-red"
  | "tech-circuit"
  | "luxury-gold";

type FontStyle = "sans" | "serif" | "mono" | "display";

const TEMPLATES: { id: Template; name: string; accent: string }[] = [
  { id: "corporate-blue", name: "Corporate Blue", accent: "#1e40af" },
  { id: "modern-dark", name: "Modern Dark", accent: "#6366f1" },
  { id: "creative-gradient", name: "Creative Gradient", accent: "#7c3aed" },
  { id: "minimal-white", name: "Minimal White", accent: "#6b7280" },
  { id: "nature-green", name: "Nature Green", accent: "#15803d" },
  { id: "bold-red", name: "Bold Red", accent: "#dc2626" },
  { id: "tech-circuit", name: "Tech Circuit", accent: "#06b6d4" },
  { id: "luxury-gold", name: "Luxury Gold", accent: "#D4AF37" },
];

const FONT_MAP: Record<FontStyle, string> = {
  sans: "'Segoe UI', system-ui, -apple-system, sans-serif",
  serif: "'Georgia', 'Times New Roman', serif",
  mono: "'SF Mono', 'Consolas', 'Monaco', monospace",
  display: "'Trebuchet MS', 'Lucida Grande', sans-serif",
};

export default function BusinessCardGeneratorPage() {
  const [cardName, setCardName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [cardEmail, setCardEmail] = useState("");
  const [cardPhone, setCardPhone] = useState("");
  const [cardWebsite, setCardWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [tagline, setTagline] = useState("");

  const [logoImage, setLogoImage] = useState<string | null>(null);

  const [template, setTemplate] = useState<Template>("corporate-blue");
  const [customColor, setCustomColor] = useState("#1e40af");
  const [fontStyle, setFontStyle] = useState<FontStyle>("sans");
  const [showBack, setShowBack] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  function selectTemplate(t: Template) {
    setTemplate(t);
    const found = TEMPLATES.find((x) => x.id === t);
    if (found) setCustomColor(found.accent);
  }

  const renderCard = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, isFront: boolean, onReady?: () => void) => {
      const font = FONT_MAP[fontStyle];
      const name = cardName || "Your Name";
      const jobTitle = title || "Job Title";
      const comp = company || "Company Name";
      const accent = customColor;

      ctx.clearRect(0, 0, w, h);

      if (!isFront) {
        renderBack(ctx, w, h, font, comp, cardWebsite, tagline, accent, template);
        onReady?.();
        return;
      }

      const drawLogo = (callback: () => void) => {
        if (logoImage && isFront) {
          const img = new Image();
          img.onload = () => {
            // Draw logo in top-right area
            const logoW = Math.min(img.width, 140);
            const logoH = Math.min(img.height, 70);
            const ratio = Math.min(logoW / img.width, logoH / img.height);
            const dw = img.width * ratio;
            const dh = img.height * ratio;
            ctx.drawImage(img, w - dw - 40, 40, dw, dh);
            callback();
          };
          img.onerror = () => callback();
          img.src = logoImage;
        } else {
          callback();
        }
      };

      switch (template) {
        case "corporate-blue":
          renderCorporateBlue(ctx, w, h, font, name, jobTitle, comp, cardEmail, cardPhone, cardWebsite, address, accent);
          break;
        case "modern-dark":
          renderModernDark(ctx, w, h, font, name, jobTitle, comp, cardEmail, cardPhone, cardWebsite, address, accent);
          break;
        case "creative-gradient":
          renderCreativeGradient(ctx, w, h, font, name, jobTitle, comp, cardEmail, cardPhone, cardWebsite, address, accent);
          break;
        case "minimal-white":
          renderMinimalWhite(ctx, w, h, font, name, jobTitle, comp, cardEmail, cardPhone, cardWebsite, address, accent);
          break;
        case "nature-green":
          renderNatureGreen(ctx, w, h, font, name, jobTitle, comp, cardEmail, cardPhone, cardWebsite, address, accent);
          break;
        case "bold-red":
          renderBoldRed(ctx, w, h, font, name, jobTitle, comp, cardEmail, cardPhone, cardWebsite, address, accent);
          break;
        case "tech-circuit":
          renderTechCircuit(ctx, w, h, font, name, jobTitle, comp, cardEmail, cardPhone, cardWebsite, address, accent);
          break;
        case "luxury-gold":
          renderLuxuryGold(ctx, w, h, font, name, jobTitle, comp, cardEmail, cardPhone, cardWebsite, address, accent);
          break;
      }

      drawLogo(() => onReady?.());
    },
    [cardName, title, company, cardEmail, cardPhone, cardWebsite, address, tagline, template, customColor, fontStyle, logoImage]
  );

  function downloadCard() {
    const canvas = document.createElement("canvas");
    canvas.width = 1050;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderCard(ctx, 1050, 600, !showBack, () => {
      const link = document.createElement("a");
      link.download = `business-card-${showBack ? "back" : "front"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  }

  function handlePrint() {
    const canvas = document.createElement("canvas");
    canvas.width = 1050;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderCard(ctx, 1050, 600, !showBack, () => {
      const win = window.open("", "_blank");
      if (!win) return;
      win.document.write(`<html><title>Business Card</title><style>*{margin:0;padding:0}body{display:flex;justify-content:center;align-items:center;min-height:100vh}img{max-width:100%}@media print{body{padding:0}}</style><body><img src="${canvas.toDataURL("image/png")}" /></body></html>`);
      win.document.close();
      setTimeout(() => win.print(), 300);
    });
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/business-card-generator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/business-card-generator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Business Card Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Design professional business cards with 8 templates. Customize, preview live, and download print-ready PNG.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Form + Templates */}
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
                  <label className="block text-sm font-medium mb-1">Company Name</label>
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
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="input-field" placeholder="123 Main St, New York" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tagline / Slogan</label>
                  <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="input-field" placeholder="Innovation at scale" />
                </div>
                <div className="sm:col-span-2">
                  <LogoUploader onLogoChange={setLogoImage} recommendedSize="200×100px (landscape)" shape="rectangle" maxWidth={200} maxHeight={100} />
                </div>
              </div>
            </div>

            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Choose Template</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => selectTemplate(t.id)}
                    className={`px-2 py-2 rounded text-xs font-medium border-2 transition-all cursor-pointer ${
                      template === t.id
                        ? "border-[var(--primary)] bg-[var(--primary)]/10 shadow"
                        : "border-[var(--border)] hover:border-[var(--muted)]"
                    }`}
                  >
                    <div className="w-full h-3 rounded-sm mb-1" style={{ background: t.accent }} />
                    {t.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="w-8 h-8 cursor-pointer border-0 rounded" />
                    <span className="text-xs text-[var(--muted)]">{customColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Font</label>
                  <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value as FontStyle)} className="input-field">
                    <option value="sans">Sans-serif</option>
                    <option value="serif">Serif</option>
                    <option value="mono">Monospace</option>
                    <option value="display">Display</option>
                  </select>
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

            <div className="flex justify-center mb-4">
              <CardPreview
                name={cardName}
                title={title}
                company={company}
                email={cardEmail}
                phone={cardPhone}
                website={cardWebsite}
                address={address}
                tagline={tagline}
                template={template}
                accent={customColor}
                fontStyle={fontStyle}
                showBack={showBack}
                logoImage={logoImage}
              />
            </div>

            <canvas ref={canvasRef} width={525} height={300} className="hidden" />

            <div className="flex gap-3 justify-center">
              <button onClick={downloadCard} className="btn-primary px-6 py-2">Download as PNG</button>
              <button onClick={handlePrint} className="btn-secondary px-6 py-2">Print</button>
            </div>
            <p className="text-xs text-[var(--muted)] mt-2 text-center">1050&times;600px print-ready output</p>
          </div>
        </div>

        <div className="ad-placeholder my-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Free Business Card Generator</h2>
          <p>
            Design and download professional business cards without any design software. Choose from 8 unique
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
            <li><strong>Tagline:</strong> A memorable slogan or value proposition</li>
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

/* ============================================================
   CANVAS RENDER FUNCTIONS — Back side
   ============================================================ */

function renderBack(
  ctx: CanvasRenderingContext2D, w: number, h: number, font: string,
  company: string, website: string, tagline: string, accent: string, template: Template
) {
  const comp = company || "Company Name";

  if (template === "modern-dark" || template === "luxury-gold") {
    ctx.fillStyle = template === "luxury-gold" ? "#0a0a0a" : "#1a1a2e";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = template === "luxury-gold" ? "#D4AF37" : "#ffffff";
  } else if (template === "tech-circuit") {
    ctx.fillStyle = "#1e1e2a";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#06b6d4";
    // Dotted border
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, w - 40, h - 40);
    ctx.setLineDash([]);
    ctx.fillStyle = "#06b6d4";
  } else {
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
  }

  ctx.font = `bold 48px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(comp, w / 2, h / 2 - 20);

  if (tagline) {
    ctx.font = `italic 22px ${font}`;
    ctx.globalAlpha = 0.8;
    ctx.fillText(tagline, w / 2, h / 2 + 25);
    ctx.globalAlpha = 1;
  } else if (website) {
    ctx.font = `20px ${font}`;
    ctx.globalAlpha = 0.8;
    ctx.fillText(website, w / 2, h / 2 + 25);
    ctx.globalAlpha = 1;
  }
}

/* ============================================================
   CANVAS RENDER FUNCTIONS — 8 Front Templates
   ============================================================ */

function drawContactLines(
  ctx: CanvasRenderingContext2D, x: number, startY: number, font: string,
  email: string, phone: string, website: string, address: string,
  color: string, size: number, align: CanvasTextAlign
) {
  ctx.fillStyle = color;
  ctx.font = `${size}px ${font}`;
  ctx.textAlign = align;
  let y = startY;
  if (email) { ctx.fillText(email, x, y); y += size + 6; }
  if (phone) { ctx.fillText(phone, x, y); y += size + 6; }
  if (website) { ctx.fillText(website, x, y); y += size + 6; }
  if (address) { ctx.fillText(address, x, y); }
}

// 1. Corporate Blue — Blue gradient top bar, white body
function renderCorporateBlue(
  ctx: CanvasRenderingContext2D, w: number, h: number, font: string,
  name: string, jobTitle: string, comp: string, email: string, phone: string, website: string, address: string, accent: string
) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, accent);
  grad.addColorStop(1, "#3b82f6");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, 180);

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 40px ${font}`;
  ctx.fillText(name, 50, 90);
  ctx.font = `22px ${font}`;
  ctx.fillText(jobTitle, 50, 125);
  ctx.font = `16px ${font}`;
  ctx.globalAlpha = 0.85;
  ctx.fillText(comp, 50, 158);
  ctx.globalAlpha = 1;

  drawContactLines(ctx, 50, 220, font, email, phone, website, address, "#374151", 16, "left");
}

// 2. Modern Dark — Dark background, white text, minimal
function renderModernDark(
  ctx: CanvasRenderingContext2D, w: number, h: number, font: string,
  name: string, jobTitle: string, comp: string, email: string, phone: string, website: string, address: string, accent: string
) {
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, w, h);

  // Subtle accent line at bottom
  ctx.fillStyle = accent;
  ctx.fillRect(0, h - 6, w, 6);

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 42px ${font}`;
  ctx.fillText(name, 50, 180);
  ctx.fillStyle = accent;
  ctx.font = `22px ${font}`;
  ctx.fillText(jobTitle, 50, 220);
  ctx.fillStyle = "#94a3b8";
  ctx.font = `17px ${font}`;
  ctx.fillText(comp, 50, 252);

  drawContactLines(ctx, 50, 310, font, email, phone, website, address, "#cbd5e1", 15, "left");
}

// 3. Creative Gradient — Purple-to-blue, bold white text
function renderCreativeGradient(
  ctx: CanvasRenderingContext2D, w: number, h: number, font: string,
  name: string, jobTitle: string, comp: string, email: string, phone: string, website: string, address: string, accent: string
) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, accent);
  grad.addColorStop(1, "#2563eb");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Large circle decoration
  ctx.beginPath();
  ctx.arc(w - 100, h - 80, 200, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fill();

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 46px ${font}`;
  ctx.fillText(name, 50, 170);
  ctx.font = `24px ${font}`;
  ctx.globalAlpha = 0.9;
  ctx.fillText(jobTitle, 50, 215);
  ctx.font = `18px ${font}`;
  ctx.globalAlpha = 0.75;
  ctx.fillText(comp, 50, 250);
  ctx.globalAlpha = 1;

  drawContactLines(ctx, 50, 320, font, email, phone, website, address, "rgba(255,255,255,0.85)", 15, "left");
}

// 4. Minimal White — All white, thin gray borders, elegant
function renderMinimalWhite(
  ctx: CanvasRenderingContext2D, w: number, h: number, font: string,
  name: string, jobTitle: string, comp: string, email: string, phone: string, website: string, address: string, accent: string
) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#d1d5db";
  ctx.lineWidth = 1;
  ctx.strokeRect(30, 30, w - 60, h - 60);

  ctx.textAlign = "center";
  ctx.fillStyle = "#111827";
  ctx.font = `300 38px ${font}`;
  ctx.fillText(name, w / 2, 190);

  ctx.fillStyle = accent;
  ctx.font = `18px ${font}`;
  ctx.fillText(jobTitle + (comp ? "  |  " + comp : ""), w / 2, 230);

  // Thin accent line
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w * 0.3, 260);
  ctx.lineTo(w * 0.7, 260);
  ctx.stroke();

  const contacts = [email, phone, website, address].filter(Boolean);
  ctx.fillStyle = "#6b7280";
  ctx.font = `14px ${font}`;
  ctx.fillText(contacts.join("   |   "), w / 2, 300);
}

// 5. Nature Green — Green accents, leaf-like shapes
function renderNatureGreen(
  ctx: CanvasRenderingContext2D, w: number, h: number, font: string,
  name: string, jobTitle: string, comp: string, email: string, phone: string, website: string, address: string, accent: string
) {
  ctx.fillStyle = "#f0fdf4";
  ctx.fillRect(0, 0, w, h);

  // Leaf-like corner shapes via CSS borders (triangles)
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(120, 0);
  ctx.lineTo(0, 120);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(w, h);
  ctx.lineTo(w - 120, h);
  ctx.lineTo(w, h - 120);
  ctx.closePath();
  ctx.fill();

  // Bottom accent bar
  ctx.fillStyle = accent;
  ctx.fillRect(0, h - 8, w, 8);

  ctx.textAlign = "left";
  ctx.fillStyle = "#14532d";
  ctx.font = `bold 40px ${font}`;
  ctx.fillText(name, 50, 180);
  ctx.fillStyle = accent;
  ctx.font = `22px ${font}`;
  ctx.fillText(jobTitle, 50, 218);
  ctx.fillStyle = "#166534";
  ctx.font = `16px ${font}`;
  ctx.fillText(comp, 50, 250);

  drawContactLines(ctx, 50, 310, font, email, phone, website, address, "#374151", 15, "left");
}

// 6. Bold Red — Red accent bar on left, strong typography
function renderBoldRed(
  ctx: CanvasRenderingContext2D, w: number, h: number, font: string,
  name: string, jobTitle: string, comp: string, email: string, phone: string, website: string, address: string, accent: string
) {
  ctx.fillStyle = "#fafafa";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 14, h);

  // Red stripe at top
  ctx.fillStyle = accent;
  ctx.fillRect(14, 0, w - 14, 6);

  ctx.textAlign = "left";
  ctx.fillStyle = "#111827";
  ctx.font = `bold 44px ${font}`;
  ctx.fillText(name, 50, 160);
  ctx.fillStyle = accent;
  ctx.font = `bold 22px ${font}`;
  ctx.fillText(jobTitle, 50, 200);
  ctx.fillStyle = "#4b5563";
  ctx.font = `17px ${font}`;
  ctx.fillText(comp, 50, 232);

  // Accent divider
  ctx.fillStyle = accent;
  ctx.fillRect(50, 260, 100, 3);

  drawContactLines(ctx, 50, 290, font, email, phone, website, address, "#374151", 15, "left");
}

// 7. Tech Circuit — Dark gray, cyan accents, dotted borders
function renderTechCircuit(
  ctx: CanvasRenderingContext2D, w: number, h: number, font: string,
  name: string, jobTitle: string, comp: string, email: string, phone: string, website: string, address: string, accent: string
) {
  const monoFont = "'SF Mono', 'Consolas', 'Monaco', monospace";
  ctx.fillStyle = "#1e1e2a";
  ctx.fillRect(0, 0, w, h);

  // Dotted border
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, w - 32, h - 32);
  ctx.setLineDash([]);

  // Circuit-like decoration dots
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(w - 60, 80 + i * 30, 3, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
  }
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w - 60, 80);
  ctx.lineTo(w - 60, 80 + 4 * 30);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 38px ${monoFont}`;
  ctx.fillText(name, 45, 160);
  ctx.fillStyle = accent;
  ctx.font = `20px ${monoFont}`;
  ctx.fillText(`> ${jobTitle}`, 45, 198);
  ctx.fillStyle = "#64748b";
  ctx.font = `16px ${monoFont}`;
  ctx.fillText(`// ${comp}`, 45, 230);

  drawContactLines(ctx, 45, 290, monoFont, email, phone, website, address, "#94a3b8", 14, "left");
}

// 8. Luxury Gold — Black background, gold text and borders
function renderLuxuryGold(
  ctx: CanvasRenderingContext2D, w: number, h: number, font: string,
  name: string, jobTitle: string, comp: string, email: string, phone: string, website: string, address: string, accent: string
) {
  const gold = accent;
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, w, h);

  // Double gold border
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, w - 40, h - 40);
  ctx.strokeRect(28, 28, w - 56, h - 56);

  ctx.textAlign = "center";
  ctx.fillStyle = gold;
  ctx.font = `bold 42px ${font}`;
  ctx.fillText(name, w / 2, 180);
  ctx.font = `20px ${font}`;
  ctx.fillText(jobTitle, w / 2, 220);
  ctx.fillStyle = "#a89860";
  ctx.font = `16px ${font}`;
  ctx.fillText(comp, w / 2, 252);

  // Gold divider
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w * 0.3, 278);
  ctx.lineTo(w * 0.7, 278);
  ctx.stroke();

  // Small diamond in center of divider
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.moveTo(w / 2, 272);
  ctx.lineTo(w / 2 + 6, 278);
  ctx.lineTo(w / 2, 284);
  ctx.lineTo(w / 2 - 6, 278);
  ctx.closePath();
  ctx.fill();

  drawContactLines(ctx, w / 2, 310, font, email, phone, website, address, "#c9b97a", 14, "center");
}

/* ============================================================
   CSS PREVIEW COMPONENT — Live updates
   ============================================================ */

function CardPreview({
  name, title, company, email, phone, website, address, tagline,
  template, accent, fontStyle, showBack, logoImage,
}: {
  name: string; title: string; company: string; email: string; phone: string;
  website: string; address: string; tagline: string; template: Template;
  accent: string; fontStyle: FontStyle; showBack: boolean; logoImage: string | null;
}) {
  const font = FONT_MAP[fontStyle];
  const monoFont = "'SF Mono', 'Consolas', 'Monaco', monospace";
  const dn = name || "Your Name";
  const dt = title || "Job Title";
  const dc = company || "Company Name";
  const contacts = [email, phone, website, address].filter(Boolean);

  const baseStyle: React.CSSProperties = {
    width: "364px",
    height: "208px",
    borderRadius: "8px",
    fontFamily: font,
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
    position: "relative",
  };

  if (showBack) {
    const isDark = template === "modern-dark" || template === "luxury-gold" || template === "tech-circuit";
    const bg = template === "luxury-gold" ? "#0a0a0a" : template === "modern-dark" ? "#1a1a2e" : template === "tech-circuit" ? "#1e1e2a" : accent;
    const fg = template === "luxury-gold" ? "#D4AF37" : template === "tech-circuit" ? "#06b6d4" : isDark ? "#fff" : "#fff";
    return (
      <div style={{ ...baseStyle, background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: fg }}>
        {template === "tech-circuit" && (
          <div style={{ position: "absolute", inset: 6, border: "2px dashed #06b6d4", borderRadius: 4 }} />
        )}
        <div style={{ fontSize: "18px", fontWeight: 700, zIndex: 1 }}>{dc}</div>
        {tagline && <div style={{ fontSize: "10px", marginTop: 4, opacity: 0.75, fontStyle: "italic", zIndex: 1 }}>{tagline}</div>}
        {!tagline && website && <div style={{ fontSize: "9px", marginTop: 4, opacity: 0.75, zIndex: 1 }}>{website}</div>}
      </div>
    );
  }

  // Logo element for front of card
  const logoEl = logoImage ? (
    <img src={logoImage} alt="Logo" style={{ position: "absolute", top: 10, right: 12, width: 48, height: 24, objectFit: "contain", borderRadius: 2 }} />
  ) : null;

  // 1. Corporate Blue
  if (template === "corporate-blue") {
    return (
      <div style={{ ...baseStyle, background: "#fff" }}>
        <div style={{ background: `linear-gradient(90deg, ${accent}, #3b82f6)`, padding: "14px 16px", color: "#fff", position: "relative" }}>
          {logoEl}
          <div style={{ fontSize: "16px", fontWeight: 700 }}>{dn}</div>
          <div style={{ fontSize: "10px", marginTop: 2 }}>{dt}</div>
          <div style={{ fontSize: "8px", marginTop: 2, opacity: 0.85 }}>{dc}</div>
        </div>
        <div style={{ padding: "10px 16px", fontSize: "7.5px", color: "#374151", lineHeight: 1.7 }}>
          {contacts.map((c, i) => <div key={i}>{c}</div>)}
        </div>
      </div>
    );
  }

  // 2. Modern Dark
  if (template === "modern-dark") {
    return (
      <div style={{ ...baseStyle, background: "#1a1a2e", color: "#fff" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: accent }} />
        {logoEl}
        <div style={{ padding: "24px 16px 10px", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
          <div style={{ fontSize: "16px", fontWeight: 700 }}>{dn}</div>
          <div style={{ fontSize: "10px", color: accent, marginTop: 2 }}>{dt}</div>
          <div style={{ fontSize: "8px", color: "#94a3b8", marginTop: 2 }}>{dc}</div>
          <div style={{ marginTop: 12, fontSize: "7px", color: "#cbd5e1", lineHeight: 1.7 }}>
            {contacts.map((c, i) => <div key={i}>{c}</div>)}
          </div>
        </div>
      </div>
    );
  }

  // 3. Creative Gradient
  if (template === "creative-gradient") {
    return (
      <div style={{ ...baseStyle, background: `linear-gradient(135deg, ${accent}, #2563eb)`, color: "#fff", position: "relative" }}>
        <div style={{ position: "absolute", right: -30, bottom: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        {logoEl}
        <div style={{ padding: "22px 16px", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "17px", fontWeight: 700 }}>{dn}</div>
          <div style={{ fontSize: "10px", marginTop: 2, opacity: 0.9 }}>{dt}</div>
          <div style={{ fontSize: "8px", marginTop: 2, opacity: 0.75 }}>{dc}</div>
          <div style={{ marginTop: 14, fontSize: "7px", opacity: 0.85, lineHeight: 1.7 }}>
            {contacts.map((c, i) => <div key={i}>{c}</div>)}
          </div>
        </div>
      </div>
    );
  }

  // 4. Minimal White
  if (template === "minimal-white") {
    return (
      <div style={{ ...baseStyle, background: "#fff" }}>
        <div style={{ position: "absolute", inset: 10, border: "1px solid #d1d5db", borderRadius: 4 }} />
        {logoEl}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 16, textAlign: "center", position: "relative" }}>
          <div style={{ fontSize: "15px", fontWeight: 300, color: "#111827" }}>{dn}</div>
          <div style={{ fontSize: "8px", color: accent, marginTop: 3 }}>{dt}{dc ? ` | ${dc}` : ""}</div>
          <div style={{ width: "40%", height: 1, background: accent, margin: "8px 0" }} />
          <div style={{ fontSize: "7px", color: "#6b7280" }}>{contacts.join("  |  ")}</div>
        </div>
      </div>
    );
  }

  // 5. Nature Green
  if (template === "nature-green") {
    return (
      <div style={{ ...baseStyle, background: "#f0fdf4", position: "relative" }}>
        {/* Leaf corners */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, borderLeft: `40px solid ${accent}`, borderBottom: "40px solid transparent" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: 0, height: 0, borderRight: `40px solid ${accent}`, borderTop: "40px solid transparent" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: accent }} />
        {logoEl}
        <div style={{ padding: "22px 16px", position: "relative" }}>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#14532d" }}>{dn}</div>
          <div style={{ fontSize: "10px", color: accent, marginTop: 2 }}>{dt}</div>
          <div style={{ fontSize: "8px", color: "#166534", marginTop: 2 }}>{dc}</div>
          <div style={{ marginTop: 14, fontSize: "7px", color: "#374151", lineHeight: 1.7 }}>
            {contacts.map((c, i) => <div key={i}>{c}</div>)}
          </div>
        </div>
      </div>
    );
  }

  // 6. Bold Red
  if (template === "bold-red") {
    return (
      <div style={{ ...baseStyle, background: "#fafafa", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: accent }} />
        <div style={{ position: "absolute", left: 5, top: 0, right: 0, height: 2, background: accent }} />
        {logoEl}
        <div style={{ padding: "20px 16px 10px 20px" }}>
          <div style={{ fontSize: "17px", fontWeight: 700, color: "#111827" }}>{dn}</div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: accent, marginTop: 2 }}>{dt}</div>
          <div style={{ fontSize: "8px", color: "#4b5563", marginTop: 2 }}>{dc}</div>
          <div style={{ width: 40, height: 2, background: accent, margin: "10px 0" }} />
          <div style={{ fontSize: "7px", color: "#374151", lineHeight: 1.7 }}>
            {contacts.map((c, i) => <div key={i}>{c}</div>)}
          </div>
        </div>
      </div>
    );
  }

  // 7. Tech Circuit
  if (template === "tech-circuit") {
    return (
      <div style={{ ...baseStyle, background: "#1e1e2a", fontFamily: monoFont }}>
        <div style={{ position: "absolute", inset: 6, border: "2px dashed #06b6d4", borderRadius: 4 }} />
        {logoEl}
        {/* Dots */}
        <div style={{ position: "absolute", right: 20, top: 30 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: accent, marginBottom: 8 }} />
          ))}
        </div>
        <div style={{ padding: "24px 16px", position: "relative" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>{dn}</div>
          <div style={{ fontSize: "9px", color: accent, marginTop: 3 }}>&gt; {dt}</div>
          <div style={{ fontSize: "7px", color: "#64748b", marginTop: 2 }}>// {dc}</div>
          <div style={{ marginTop: 14, fontSize: "7px", color: "#94a3b8", lineHeight: 1.7 }}>
            {contacts.map((c, i) => <div key={i}>{c}</div>)}
          </div>
        </div>
      </div>
    );
  }

  // 8. Luxury Gold
  return (
    <div style={{ ...baseStyle, background: "#0a0a0a" }}>
      <div style={{ position: "absolute", inset: 7, border: `1px solid ${accent}`, borderRadius: 2 }} />
      <div style={{ position: "absolute", inset: 10, border: `1px solid ${accent}`, borderRadius: 2 }} />
      {logoEl}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 16, textAlign: "center", position: "relative" }}>
        <div style={{ fontSize: "16px", fontWeight: 700, color: accent }}>{dn}</div>
        <div style={{ fontSize: "9px", color: accent, marginTop: 3 }}>{dt}</div>
        <div style={{ fontSize: "8px", color: "#a89860", marginTop: 2 }}>{dc}</div>
        <div style={{ width: "40%", height: 1, background: accent, margin: "8px 0", position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: -3, transform: "translateX(-50%) rotate(45deg)", width: 6, height: 6, background: accent }} />
        </div>
        <div style={{ fontSize: "7px", color: "#c9b97a", lineHeight: 1.6 }}>
          {contacts.map((c, i) => <div key={i}>{c}</div>)}
        </div>
      </div>
    </div>
  );
}
