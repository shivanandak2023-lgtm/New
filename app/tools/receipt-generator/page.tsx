"use client";

import { useState, useRef, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, CURRENCIES, getCurrencyFromStorage } from "@/lib/currency";

const META = {
  title: "Free Receipt Generator - Create & Download Receipts",
  description:
    "Free online receipt generator. Create realistic receipts with 6 templates, itemized billing, tax, tip, and discount. Download as PNG or print. No signup required.",
  keywords:
    "receipt generator, receipt maker, free receipt, bill generator, receipt template, thermal receipt, store receipt, invoice receipt",
};

type ReceiptTemplate = "thermal" | "modern" | "minimal" | "invoice" | "retail" | "restaurant";

const RECEIPT_TEMPLATES: { id: ReceiptTemplate; name: string }[] = [
  { id: "thermal", name: "Thermal" },
  { id: "modern", name: "Modern" },
  { id: "minimal", name: "Minimal" },
  { id: "invoice", name: "Invoice Style" },
  { id: "retail", name: "Retail" },
  { id: "restaurant", name: "Restaurant" },
];

interface ReceiptItem {
  id: number;
  description: string;
  qty: string;
  unitPrice: string;
}

let nextItemId = 1;
function makeItem(): ReceiptItem {
  return { id: nextItemId++, description: "", qty: "1", unitPrice: "" };
}

function genReceiptNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let r = "RCP-";
  for (let i = 0; i < 6; i++) r += chars.charAt(Math.floor(Math.random() * chars.length));
  return r;
}

export default function ReceiptGeneratorPage() {
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(CURRENCIES[0]);
  const [bizName, setBizName] = useState("");
  const [logoText, setLogoText] = useState("");
  const [bizAddress, setBizAddress] = useState("");
  const [bizPhone, setBizPhone] = useState("");
  const [bizEmail, setBizEmail] = useState("");
  const [bizWebsite, setBizWebsite] = useState("");

  const [receiptNo, setReceiptNo] = useState("");
  const [receiptDate, setReceiptDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [items, setItems] = useState<ReceiptItem[]>([makeItem()]);
  const [taxLabel, setTaxLabel] = useState("GST");
  const [taxRate, setTaxRate] = useState("0");
  const [discountType, setDiscountType] = useState<"amount" | "percent">("amount");
  const [discountValue, setDiscountValue] = useState("0");
  const [tipAmount, setTipAmount] = useState("0");
  const [footerText, setFooterText] = useState("Thank you for your purchase!");

  const [receiptTemplate, setReceiptTemplate] = useState<ReceiptTemplate>("thermal");

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReceiptNo(genReceiptNumber());
    setReceiptDate(new Date().toISOString().split("T")[0]);
    setDisplayCurrency(getCurrencyFromStorage());
  }, []);

  const sym = displayCurrency.symbol;

  function updateItem(id: number, field: keyof ReceiptItem, val: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: val } : it)));
  }
  function addItem() { setItems((prev) => [...prev, makeItem()]); }
  function removeItem(id: number) { if (items.length <= 1) return; setItems((prev) => prev.filter((it) => it.id !== id)); }

  function lineTotal(item: ReceiptItem) {
    return (parseFloat(item.qty) || 0) * (parseFloat(item.unitPrice) || 0);
  }

  const subtotal = items.reduce((s, it) => s + lineTotal(it), 0);
  const discountAmt = discountType === "percent"
    ? subtotal * (parseFloat(discountValue) || 0) / 100
    : parseFloat(discountValue) || 0;
  const afterDiscount = Math.max(0, subtotal - discountAmt);
  const taxAmt = afterDiscount * (parseFloat(taxRate) || 0) / 100;
  const tip = parseFloat(tipAmount) || 0;
  const grandTotal = afterDiscount + taxAmt + tip;

  function fmt(n: number) { return n.toFixed(2); }

  /* ============================================================
     Download PNG via Canvas
     ============================================================ */
  function handleDownloadPNG() {
    const canvas = document.createElement("canvas");
    const w = 480;
    const lineH = 22;
    const fnt = "15px 'Courier New', Courier, monospace";
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;
    ctx.font = fnt;

    let totalLines = 0;
    totalLines += 4; // header
    totalLines += 3; // receipt info
    totalLines += 1; // divider
    totalLines += 1; // col header
    totalLines += items.length;
    totalLines += 1; // divider
    totalLines += 1; // subtotal
    if (discountAmt > 0) totalLines += 1;
    totalLines += 1; // tax
    if (tip > 0) totalLines += 1;
    totalLines += 1; // divider
    totalLines += 1; // total
    totalLines += 1; // payment
    totalLines += 3; // footer + padding

    const h = (totalLines + 4) * lineH + 50;
    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = "#fefefe";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#1a1a1a";
    ctx.textBaseline = "top";

    let y = 20;
    function center(text: string, bold = false) {
      ctx.font = bold ? `bold ${fnt}` : fnt;
      const tw = ctx.measureText(text).width;
      ctx.fillText(text, (w - tw) / 2, y);
      y += lineH;
    }
    function left(text: string) { ctx.font = fnt; ctx.fillText(text, 24, y); y += lineH; }
    function dashed() {
      ctx.font = fnt;
      const d = "-".repeat(44);
      const tw = ctx.measureText(d).width;
      ctx.fillText(d, (w - tw) / 2, y);
      y += lineH;
    }
    function row(label: string, value: string, bold = false) {
      ctx.font = bold ? `bold ${fnt}` : fnt;
      ctx.fillText(label, 24, y);
      const vw = ctx.measureText(value).width;
      ctx.fillText(value, w - 24 - vw, y);
      y += lineH;
    }

    center(bizName || "BUSINESS NAME", true);
    if (bizAddress) center(bizAddress);
    if (bizPhone) center(bizPhone);
    if (bizEmail) center(bizEmail);
    dashed();
    left(`Receipt #: ${receiptNo}`);
    left(`Date: ${receiptDate}`);
    left(`Payment: ${paymentMethod}`);
    dashed();

    items.forEach((it) => {
      const desc = it.description || "Item";
      const q = it.qty || "1";
      const t = fmt(lineTotal(it));
      row(`${desc} x${q}`, `${sym}${t}`);
    });

    dashed();
    row("Subtotal:", `${sym}${fmt(subtotal)}`);
    if (discountAmt > 0) row("Discount:", `-${sym}${fmt(discountAmt)}`);
    row(`${taxLabel} (${taxRate}%):`, `${sym}${fmt(taxAmt)}`);
    if (tip > 0) row("Tip:", `${sym}${fmt(tip)}`);
    dashed();
    row("TOTAL:", `${sym}${fmt(grandTotal)}`, true);
    y += lineH;
    center(footerText);

    const link = document.createElement("a");
    link.download = `receipt-${receiptNo}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  /* ============================================================
     Print
     ============================================================ */
  function handlePrint() {
    const win = window.open("", "_blank");
    if (!win) return;
    const store = bizName || "BUSINESS NAME";
    win.document.write(`<html><title>Receipt ${receiptNo}</title><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Courier New',monospace;color:#1a1a1a;display:flex;justify-content:center;padding:20px}
.r{width:320px;padding:20px 10px}.c{text-align:center}.b{font-weight:bold}
.d{border-top:2px dashed #1a1a1a;margin:8px 0}
.row{display:flex;justify-content:space-between;font-size:13px;padding:2px 0}
.sn{font-size:18px;font-weight:bold}.total{font-size:16px;font-weight:bold}
.f{text-align:center;margin-top:16px;font-size:12px;color:#666}
@media print{body{padding:0}}
</style><body><div class="r">
<div class="c sn">${store}</div>
${bizAddress ? `<div class="c" style="font-size:11px">${bizAddress}</div>` : ""}
${bizPhone ? `<div class="c" style="font-size:11px">${bizPhone}</div>` : ""}
<div class="d"></div>
<div class="row"><span>Receipt #: ${receiptNo}</span></div>
<div class="row"><span>Date: ${receiptDate}</span></div>
<div class="row"><span>Payment: ${paymentMethod}</span></div>
<div class="d"></div>
${items.map((it) => `<div class="row"><span>${it.description || "Item"} x${it.qty || "1"}</span><span>${sym}${fmt(lineTotal(it))}</span></div>`).join("")}
<div class="d"></div>
<div class="row"><span>Subtotal</span><span>${sym}${fmt(subtotal)}</span></div>
${discountAmt > 0 ? `<div class="row"><span>Discount</span><span>-${sym}${fmt(discountAmt)}</span></div>` : ""}
<div class="row"><span>${taxLabel} (${taxRate}%)</span><span>${sym}${fmt(taxAmt)}</span></div>
${tip > 0 ? `<div class="row"><span>Tip</span><span>${sym}${fmt(tip)}</span></div>` : ""}
<div class="d"></div>
<div class="row total"><span>TOTAL</span><span>${sym}${fmt(grandTotal)}</span></div>
<div class="f">${footerText}</div>
</div></body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 300);
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/receipt-generator`} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Receipt Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Create realistic receipts with 6 templates. Add items, tax, discount, tip. Download PNG or print.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <CurrencySelector onChange={setDisplayCurrency} className="mb-0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Form */}
          <div className="space-y-6">
            {/* Business Info */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Business Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Business Name</label>
                  <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} className="input-field" placeholder="My Store" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Logo Text (Initials)</label>
                  <input type="text" value={logoText} onChange={(e) => setLogoText(e.target.value)} className="input-field" placeholder="MS" maxLength={4} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input type="text" value={bizAddress} onChange={(e) => setBizAddress(e.target.value)} className="input-field" placeholder="123 Main St, City, State" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} className="input-field" placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={bizEmail} onChange={(e) => setBizEmail(e.target.value)} className="input-field" placeholder="store@email.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <input type="text" value={bizWebsite} onChange={(e) => setBizWebsite(e.target.value)} className="input-field" placeholder="www.mystore.com" />
                </div>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Receipt Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Receipt #</label>
                  <input type="text" value={receiptNo} onChange={(e) => setReceiptNo(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input-field">
                    <option>Cash</option>
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>UPI</option>
                    <option>Online</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Template Selector */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Receipt Template</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {RECEIPT_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setReceiptTemplate(t.id)}
                    className={`px-2 py-2 rounded text-xs font-medium border-2 transition-all cursor-pointer ${
                      receiptTemplate === t.id
                        ? "border-[var(--primary)] bg-[var(--primary)]/10 shadow"
                        : "border-[var(--border)] hover:border-[var(--muted)]"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Items</h2>
              <div className="hidden sm:grid sm:grid-cols-[1fr_70px_90px_90px_32px] gap-3 mb-2 text-sm font-medium text-[var(--muted)]">
                <span>Description</span><span>Qty</span><span>Unit Price</span><span>Total</span><span></span>
              </div>
              {items.map((it) => (
                <div key={it.id} className="grid grid-cols-1 sm:grid-cols-[1fr_70px_90px_90px_32px] gap-3 mb-3 items-center">
                  <input type="text" value={it.description} onChange={(e) => updateItem(it.id, "description", e.target.value)} className="input-field" placeholder="Item name" />
                  <input type="number" value={it.qty} onChange={(e) => updateItem(it.id, "qty", e.target.value)} className="input-field text-center" placeholder="Qty" min="0" />
                  <input type="number" value={it.unitPrice} onChange={(e) => updateItem(it.id, "unitPrice", e.target.value)} className="input-field" placeholder="Price" min="0" step="0.01" />
                  <div className="input-field bg-[var(--muted-bg)] text-center font-medium">{sym}{fmt(lineTotal(it))}</div>
                  <button onClick={() => removeItem(it.id)} className="text-red-500 hover:text-red-700 text-xl font-bold cursor-pointer" title="Remove">&times;</button>
                </div>
              ))}
              <button onClick={addItem} className="btn-secondary text-sm mt-2">+ Add Item</button>
            </div>

            {/* Tax, Discount, Tip */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Tax, Discount &amp; Tip</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tax Label</label>
                  <select value={taxLabel} onChange={(e) => setTaxLabel(e.target.value)} className="input-field">
                    <option>GST</option>
                    <option>VAT</option>
                    <option>Sales Tax</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
                  <input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="input-field" min="0" max="100" step="0.1" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount</label>
                  <div className="flex gap-2">
                    <input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="input-field flex-1" min="0" step="0.01" />
                    <select value={discountType} onChange={(e) => setDiscountType(e.target.value as "amount" | "percent")} className="input-field w-20">
                      <option value="amount">{sym}</option>
                      <option value="percent">%</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tip ({sym})</label>
                  <input type="number" value={tipAmount} onChange={(e) => setTipAmount(e.target.value)} className="input-field" min="0" step="0.01" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="tool-card">
              <label className="block text-sm font-medium mb-1">Notes / Footer Text</label>
              <input type="text" value={footerText} onChange={(e) => setFooterText(e.target.value)} className="input-field" placeholder="Thank you for your purchase!" />
            </div>
          </div>

          {/* RIGHT: Live Preview */}
          <div className="tool-card sticky top-4 self-start">
            <h2 className="font-bold text-lg mb-4">Receipt Preview</h2>
            <div ref={printRef} className="flex justify-center">
              <ReceiptPreview
                template={receiptTemplate}
                bizName={bizName}
                logoText={logoText}
                bizAddress={bizAddress}
                bizPhone={bizPhone}
                bizEmail={bizEmail}
                bizWebsite={bizWebsite}
                receiptNo={receiptNo}
                receiptDate={receiptDate}
                paymentMethod={paymentMethod}
                items={items}
                taxLabel={taxLabel}
                taxRate={taxRate}
                subtotal={subtotal}
                discountAmt={discountAmt}
                taxAmt={taxAmt}
                tip={tip}
                grandTotal={grandTotal}
                sym={sym}
                footerText={footerText}
                lineTotal={lineTotal}
              />
            </div>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={handleDownloadPNG} className="btn-primary px-6 py-2">Download PNG</button>
              <button onClick={handlePrint} className="btn-secondary px-6 py-2">Print</button>
            </div>
          </div>
        </div>

        <div className="ad-placeholder my-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Free Receipt Generator</h2>
          <p>
            Create realistic-looking receipts in seconds without signing up. Choose from 6 professional templates
            including thermal, modern, invoice, retail, and restaurant styles. Add items, tax, discounts, tip, and
            download as PNG or print directly.
          </p>
          <h2>What to Include on a Receipt</h2>
          <ul>
            <li><strong>Business name and address:</strong> Business identification and location</li>
            <li><strong>Receipt number:</strong> A unique identifier for tracking</li>
            <li><strong>Date:</strong> When the transaction took place</li>
            <li><strong>Line items:</strong> Descriptions, quantities, and unit prices</li>
            <li><strong>Tax:</strong> Applicable GST, VAT, or sales tax amount</li>
            <li><strong>Total:</strong> Final amount including tax, discount, and tip</li>
          </ul>
          <h2>Receipt Generation Tips</h2>
          <ul>
            <li>Always include a unique receipt number for record keeping</li>
            <li>Double-check item prices and quantities before generating</li>
            <li>Include the tax rate appropriate for your jurisdiction</li>
            <li>Save receipts as PNG for digital records or print for physical copies</li>
            <li>Use the currency selector to match your local currency</li>
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
            name: "Receipt Generator",
            description: META.description,
            url: `${SITE_URL}/tools/receipt-generator`,
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
   RECEIPT PREVIEW COMPONENT — 6 Templates
   ============================================================ */

function ReceiptPreview({
  template, bizName, logoText, bizAddress, bizPhone, bizEmail, bizWebsite,
  receiptNo, receiptDate, paymentMethod, items, taxLabel, taxRate,
  subtotal, discountAmt, taxAmt, tip, grandTotal, sym, footerText, lineTotal,
}: {
  template: ReceiptTemplate;
  bizName: string; logoText: string; bizAddress: string; bizPhone: string;
  bizEmail: string; bizWebsite: string; receiptNo: string; receiptDate: string;
  paymentMethod: string; items: ReceiptItem[]; taxLabel: string; taxRate: string;
  subtotal: number; discountAmt: number; taxAmt: number; tip: number;
  grandTotal: number; sym: string; footerText: string;
  lineTotal: (item: ReceiptItem) => number;
}) {
  const store = bizName || "BUSINESS NAME";
  const initials = logoText || store.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const f = (n: number) => n.toFixed(2);

  // 1. Thermal
  if (template === "thermal") {
    const mono: React.CSSProperties = { fontFamily: "'Courier New', monospace" };
    return (
      <div style={{ ...mono, width: 280, background: "#fefefe", padding: "20px 14px", border: "1px solid #e5e5e5", borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", fontSize: 12, color: "#1a1a1a" }}>
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{store}</div>
          {bizAddress && <div style={{ fontSize: 10 }}>{bizAddress}</div>}
          {bizPhone && <div style={{ fontSize: 10 }}>{bizPhone}</div>}
        </div>
        <div style={{ borderTop: "2px dashed #1a1a1a", margin: "6px 0" }} />
        <div style={{ fontSize: 10, marginBottom: 1 }}>Date: {receiptDate}</div>
        <div style={{ fontSize: 10, marginBottom: 1 }}>Receipt #: {receiptNo}</div>
        <div style={{ fontSize: 10, marginBottom: 4 }}>Payment: {paymentMethod}</div>
        <div style={{ borderTop: "2px dashed #1a1a1a", margin: "6px 0" }} />
        {items.map((it) => (
          <div key={it.id} style={{ display: "flex", justifyContent: "space-between", padding: "1px 0", fontSize: 11 }}>
            <span>{it.description || "Item"} x{it.qty || "1"}</span>
            <span>{sym}{f(lineTotal(it))}</span>
          </div>
        ))}
        <div style={{ borderTop: "2px dashed #1a1a1a", margin: "6px 0" }} />
        <Row l="Subtotal" r={`${sym}${f(subtotal)}`} />
        {discountAmt > 0 && <Row l="Discount" r={`-${sym}${f(discountAmt)}`} />}
        {parseFloat(taxRate) > 0 && <Row l={`${taxLabel} (${taxRate}%)`} r={`${sym}${f(taxAmt)}`} />}
        {tip > 0 && <Row l="Tip" r={`${sym}${f(tip)}`} />}
        <div style={{ borderTop: "2px dashed #1a1a1a", margin: "6px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14, padding: "2px 0" }}>
          <span>TOTAL</span><span>{sym}{f(grandTotal)}</span>
        </div>
        <div style={{ textAlign: "center", fontSize: 10, marginTop: 12, color: "#666" }}>{footerText}</div>
      </div>
    );
  }

  // 2. Modern — Clean wide, colored header bar
  if (template === "modern") {
    return (
      <div style={{ width: 320, background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", fontFamily: "'Segoe UI', system-ui, sans-serif", fontSize: 12, color: "#1f2937" }}>
        <div style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", padding: "16px 20px", color: "#fff" }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{store}</div>
          {bizAddress && <div style={{ fontSize: 10, opacity: 0.85, marginTop: 2 }}>{bizAddress}</div>}
          {bizPhone && <div style={{ fontSize: 10, opacity: 0.85 }}>{bizPhone}</div>}
        </div>
        <div style={{ padding: "14px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#6b7280", marginBottom: 10 }}>
            <span>#{receiptNo}</span><span>{receiptDate}</span><span>{paymentMethod}</span>
          </div>
          <div style={{ borderTop: "1px solid #e5e7eb", margin: "8px 0" }} />
          {items.map((it) => (
            <div key={it.id} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 12 }}>
              <span>{it.description || "Item"} <span style={{ color: "#9ca3af" }}>x{it.qty || "1"}</span></span>
              <span style={{ fontWeight: 600 }}>{sym}{f(lineTotal(it))}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #e5e7eb", margin: "10px 0" }} />
          <Row l="Subtotal" r={`${sym}${f(subtotal)}`} />
          {discountAmt > 0 && <Row l="Discount" r={`-${sym}${f(discountAmt)}`} color="#16a34a" />}
          {parseFloat(taxRate) > 0 && <Row l={`${taxLabel} (${taxRate}%)`} r={`${sym}${f(taxAmt)}`} />}
          {tip > 0 && <Row l="Tip" r={`${sym}${f(tip)}`} />}
          <div style={{ borderTop: "2px solid #2563eb", margin: "8px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16 }}>
            <span>Total</span><span>{sym}{f(grandTotal)}</span>
          </div>
          <div style={{ textAlign: "center", fontSize: 10, marginTop: 14, color: "#9ca3af" }}>{footerText}</div>
        </div>
      </div>
    );
  }

  // 3. Minimal — Simple, thin borders
  if (template === "minimal") {
    return (
      <div style={{ width: 300, background: "#fff", padding: "24px 20px", border: "1px solid #e5e7eb", borderRadius: 4, fontFamily: "'Segoe UI', system-ui, sans-serif", fontSize: 12, color: "#374151" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: 1 }}>{store}</div>
          <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 4 }}>{[bizAddress, bizPhone].filter(Boolean).join(" | ")}</div>
        </div>
        <div style={{ borderTop: "1px solid #d1d5db", margin: "10px 0" }} />
        <div style={{ fontSize: 10, color: "#6b7280", display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span>{receiptNo}</span><span>{receiptDate}</span>
        </div>
        {items.map((it) => (
          <div key={it.id} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: 11 }}>
            <span>{it.description || "Item"} x{it.qty || "1"}</span>
            <span>{sym}{f(lineTotal(it))}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #d1d5db", margin: "10px 0" }} />
        <Row l="Subtotal" r={`${sym}${f(subtotal)}`} />
        {discountAmt > 0 && <Row l="Discount" r={`-${sym}${f(discountAmt)}`} />}
        {parseFloat(taxRate) > 0 && <Row l={`${taxLabel} (${taxRate}%)`} r={`${sym}${f(taxAmt)}`} />}
        {tip > 0 && <Row l="Tip" r={`${sym}${f(tip)}`} />}
        <div style={{ borderTop: "1px solid #d1d5db", margin: "8px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14 }}>
          <span>Total</span><span>{sym}{f(grandTotal)}</span>
        </div>
        <div style={{ textAlign: "center", fontSize: 9, marginTop: 14, color: "#9ca3af" }}>{footerText}</div>
      </div>
    );
  }

  // 4. Invoice Style — Formal with table borders
  if (template === "invoice") {
    return (
      <div style={{ width: 340, background: "#fff", padding: "20px", border: "1px solid #d1d5db", borderRadius: 4, fontFamily: "'Segoe UI', system-ui, sans-serif", fontSize: 12, color: "#1f2937" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{store}</div>
            {bizAddress && <div style={{ fontSize: 9, color: "#6b7280" }}>{bizAddress}</div>}
            {bizPhone && <div style={{ fontSize: 9, color: "#6b7280" }}>{bizPhone}</div>}
            {bizEmail && <div style={{ fontSize: 9, color: "#6b7280" }}>{bizEmail}</div>}
          </div>
          <div style={{ textAlign: "right", fontSize: 10, color: "#6b7280" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>RECEIPT</div>
            <div>#{receiptNo}</div>
            <div>{receiptDate}</div>
          </div>
        </div>
        <div style={{ borderTop: "2px solid #111827", margin: "8px 0 4px" }} />
        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={{ textAlign: "left", padding: "4px 6px", borderBottom: "1px solid #d1d5db" }}>Item</th>
              <th style={{ textAlign: "center", padding: "4px 6px", borderBottom: "1px solid #d1d5db", width: 32 }}>Qty</th>
              <th style={{ textAlign: "right", padding: "4px 6px", borderBottom: "1px solid #d1d5db", width: 60 }}>Price</th>
              <th style={{ textAlign: "right", padding: "4px 6px", borderBottom: "1px solid #d1d5db", width: 60 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td style={{ padding: "3px 6px", borderBottom: "1px solid #e5e7eb" }}>{it.description || "Item"}</td>
                <td style={{ textAlign: "center", padding: "3px 6px", borderBottom: "1px solid #e5e7eb" }}>{it.qty || "1"}</td>
                <td style={{ textAlign: "right", padding: "3px 6px", borderBottom: "1px solid #e5e7eb" }}>{sym}{f(parseFloat(it.unitPrice) || 0)}</td>
                <td style={{ textAlign: "right", padding: "3px 6px", borderBottom: "1px solid #e5e7eb" }}>{sym}{f(lineTotal(it))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", alignItems: "flex-end", fontSize: 11 }}>
          <Row l="Subtotal" r={`${sym}${f(subtotal)}`} />
          {discountAmt > 0 && <Row l="Discount" r={`-${sym}${f(discountAmt)}`} />}
          {parseFloat(taxRate) > 0 && <Row l={`${taxLabel} (${taxRate}%)`} r={`${sym}${f(taxAmt)}`} />}
          {tip > 0 && <Row l="Tip" r={`${sym}${f(tip)}`} />}
          <div style={{ borderTop: "2px solid #111827", width: "100%", margin: "6px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontWeight: 700, fontSize: 14 }}>
            <span>Total Due</span><span>{sym}{f(grandTotal)}</span>
          </div>
        </div>
        <div style={{ fontSize: 10, color: "#6b7280", marginTop: 10 }}>Payment: {paymentMethod}</div>
        <div style={{ textAlign: "center", fontSize: 9, marginTop: 10, color: "#9ca3af" }}>{footerText}</div>
      </div>
    );
  }

  // 5. Retail — Large logo area, barcode-like footer
  if (template === "retail") {
    return (
      <div style={{ width: 310, background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", fontFamily: "'Segoe UI', system-ui, sans-serif", fontSize: 12, color: "#1f2937" }}>
        {/* Logo area */}
        <div style={{ background: "#1e293b", padding: "18px 20px", textAlign: "center", color: "#fff" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", border: "2px solid #fff", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            {initials}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{store}</div>
          {bizAddress && <div style={{ fontSize: 9, opacity: 0.8 }}>{bizAddress}</div>}
        </div>
        <div style={{ padding: "14px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#6b7280", marginBottom: 8 }}>
            <span>#{receiptNo}</span><span>{receiptDate}</span>
          </div>
          {items.map((it) => (
            <div key={it.id} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: 12 }}>
              <span>{it.description || "Item"} x{it.qty || "1"}</span>
              <span>{sym}{f(lineTotal(it))}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #e5e7eb", margin: "8px 0" }} />
          <Row l="Subtotal" r={`${sym}${f(subtotal)}`} />
          {discountAmt > 0 && <Row l="Discount" r={`-${sym}${f(discountAmt)}`} />}
          {parseFloat(taxRate) > 0 && <Row l={`${taxLabel} (${taxRate}%)`} r={`${sym}${f(taxAmt)}`} />}
          {tip > 0 && <Row l="Tip" r={`${sym}${f(tip)}`} />}
          <div style={{ borderTop: "1px solid #e5e7eb", margin: "8px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15 }}>
            <span>TOTAL</span><span>{sym}{f(grandTotal)}</span>
          </div>
          <div style={{ fontSize: 10, color: "#6b7280", marginTop: 6 }}>Paid via {paymentMethod}</div>
        </div>
        {/* Barcode-like footer */}
        <div style={{ padding: "10px 18px 14px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 1, marginBottom: 4 }}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} style={{ width: i % 3 === 0 ? 2 : 1, height: 20, background: "#1a1a1a" }} />
            ))}
          </div>
          <div style={{ fontSize: 8, color: "#9ca3af", fontFamily: "monospace" }}>{receiptNo}</div>
          <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 4 }}>{footerText}</div>
        </div>
      </div>
    );
  }

  // 6. Restaurant — Tip line, table number style
  return (
    <div style={{ width: 300, background: "#fffbf0", padding: "20px 16px", borderRadius: 6, border: "1px solid #e5d9c3", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", fontFamily: "'Georgia', serif", fontSize: 12, color: "#44403c" }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 1, color: "#292524" }}>{store}</div>
        {bizAddress && <div style={{ fontSize: 9, fontStyle: "italic" }}>{bizAddress}</div>}
        {bizPhone && <div style={{ fontSize: 9 }}>{bizPhone}</div>}
      </div>
      <div style={{ borderTop: "1px double #a8a29e", margin: "8px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#78716c", marginBottom: 6 }}>
        <span>{receiptDate}</span><span>#{receiptNo}</span>
      </div>
      <div style={{ borderTop: "1px solid #d6d3d1", margin: "6px 0" }} />
      {items.map((it) => (
        <div key={it.id} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: 12 }}>
          <span>{it.description || "Dish"} <span style={{ color: "#a8a29e" }}>x{it.qty || "1"}</span></span>
          <span>{sym}{f(lineTotal(it))}</span>
        </div>
      ))}
      <div style={{ borderTop: "1px solid #d6d3d1", margin: "8px 0" }} />
      <Row l="Subtotal" r={`${sym}${f(subtotal)}`} />
      {discountAmt > 0 && <Row l="Discount" r={`-${sym}${f(discountAmt)}`} />}
      {parseFloat(taxRate) > 0 && <Row l={`${taxLabel} (${taxRate}%)`} r={`${sym}${f(taxAmt)}`} />}
      {/* Tip line */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 12 }}>
        <span>Tip</span>
        <span>{tip > 0 ? `${sym}${f(tip)}` : "________"}</span>
      </div>
      <div style={{ borderTop: "1px double #a8a29e", margin: "8px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15, color: "#292524" }}>
        <span>Total</span><span>{sym}{f(grandTotal)}</span>
      </div>
      <div style={{ fontSize: 10, color: "#78716c", marginTop: 6 }}>Payment: {paymentMethod}</div>
      <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 10, marginTop: 12, color: "#a8a29e" }}>{footerText}</div>
    </div>
  );
}

/* Shared helper row */
function Row({ l, r, color }: { l: string; r: string; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: 11, width: "100%", color }}>
      <span>{l}</span><span>{r}</span>
    </div>
  );
}
