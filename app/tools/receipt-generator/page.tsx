"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import LogoUploader from "@/components/LogoUploader";
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
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoText, setLogoText] = useState("");
  const [bizAddress, setBizAddress] = useState("");
  const [bizPhone, setBizPhone] = useState("");
  const [bizEmail, setBizEmail] = useState("");
  const [bizWebsite, setBizWebsite] = useState("");

  const [receiptNo, setReceiptNo] = useState("");
  const [receiptDate, setReceiptDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [items, setItems] = useState<ReceiptItem[]>([makeItem()]);

  // Multiple tax/charge rows
  const [taxes, setTaxes] = useState<{ id: number; label: string; rate: string; type: "percent" | "amount" }[]>([
    { id: 1, label: "CGST", rate: "9", type: "percent" },
    { id: 2, label: "SGST", rate: "9", type: "percent" },
  ]);
  const nextTaxIdRef = useRef(3);
  const addTax = useCallback(() => {
    setTaxes(prev => [...prev, { id: nextTaxIdRef.current++, label: "", rate: "0", type: "percent" }]);
  }, []);
  const removeTax = useCallback((id: number) => { setTaxes(prev => prev.filter(t => t.id !== id)); }, []);
  const updateTax = useCallback((id: number, field: string, val: string) => {
    setTaxes(prev => prev.map(t => t.id === id ? { ...t, [field]: val } : t));
  }, []);

  // Tax presets
  const applyTaxPreset = useCallback((preset: "gst18" | "cgst_sgst" | "vat20" | "sales_tax" | "no_tax") => {
    switch (preset) {
      case "gst18":
        setTaxes([{ id: nextTaxIdRef.current++, label: "GST", rate: "18", type: "percent" }]);
        break;
      case "cgst_sgst":
        setTaxes([
          { id: nextTaxIdRef.current++, label: "CGST", rate: "9", type: "percent" },
          { id: nextTaxIdRef.current++, label: "SGST", rate: "9", type: "percent" },
        ]);
        break;
      case "vat20":
        setTaxes([{ id: nextTaxIdRef.current++, label: "VAT", rate: "20", type: "percent" }]);
        break;
      case "sales_tax":
        setTaxes([{ id: nextTaxIdRef.current++, label: "Sales Tax", rate: "8.25", type: "percent" }]);
        break;
      case "no_tax":
        setTaxes([]);
        break;
    }
  }, []);

  // Custom extra charges (service charge, delivery, packaging etc)
  const [extraCharges, setExtraCharges] = useState<{ id: number; label: string; amount: string }[]>([]);
  const nextChargeIdRef = useRef(1);
  const addCharge = useCallback(() => {
    setExtraCharges(prev => [...prev, { id: nextChargeIdRef.current++, label: "", amount: "0" }]);
  }, []);
  const removeCharge = useCallback((id: number) => { setExtraCharges(prev => prev.filter(c => c.id !== id)); }, []);
  const updateCharge = useCallback((id: number, field: string, val: string) => {
    setExtraCharges(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
  }, []);

  // Extra charge presets
  const addChargePreset = useCallback((preset: "service" | "delivery" | "packaging" | "convenience") => {
    const presets: Record<string, { label: string; amount: string }> = {
      service: { label: "Service Charge", amount: "0" },
      delivery: { label: "Delivery Fee", amount: "0" },
      packaging: { label: "Packaging", amount: "0" },
      convenience: { label: "Convenience Fee", amount: "0" },
    };
    const p = presets[preset];
    setExtraCharges(prev => [...prev, { id: nextChargeIdRef.current++, ...p }]);
  }, []);

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

  // Calculate each tax
  const taxAmounts = taxes.map(t => ({
    label: t.label || "Tax",
    amount: t.type === "percent"
      ? afterDiscount * (parseFloat(t.rate) || 0) / 100
      : parseFloat(t.rate) || 0,
    rate: t.rate,
    type: t.type,
  }));
  const totalTax = taxAmounts.reduce((s, t) => s + t.amount, 0);

  // Extra charges
  const totalExtraCharges = extraCharges.reduce((s, c) => s + (parseFloat(c.amount) || 0), 0);

  const tip = parseFloat(tipAmount) || 0;
  const grandTotal = afterDiscount + totalTax + totalExtraCharges + tip;

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
    totalLines += taxAmounts.filter(t => t.amount > 0).length; // taxes
    totalLines += extraCharges.filter(c => parseFloat(c.amount) > 0).length; // extra charges
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
    taxAmounts.forEach((t) => {
      if (t.amount > 0) {
        const lbl = t.type === "percent" ? `${t.label} (${t.rate}%):` : `${t.label}:`;
        row(lbl, `${sym}${fmt(t.amount)}`);
      }
    });
    extraCharges.forEach((c) => {
      const amt = parseFloat(c.amount) || 0;
      if (amt > 0) row(`${c.label || "Charge"}:`, `${sym}${fmt(amt)}`);
    });
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
${taxAmounts.filter(t => t.amount > 0).map(t => `<div class="row"><span>${t.label}${t.type === "percent" ? ` (${t.rate}%)` : ""}</span><span>${sym}${fmt(t.amount)}</span></div>`).join("")}
${extraCharges.filter(c => (parseFloat(c.amount) || 0) > 0).map(c => `<div class="row"><span>${c.label || "Charge"}</span><span>${sym}${fmt(parseFloat(c.amount) || 0)}</span></div>`).join("")}
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
                <div className="sm:col-span-2">
                  <LogoUploader onLogoChange={setLogoImage} recommendedSize="150×150px" shape="square" maxWidth={150} maxHeight={150} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">OR Logo Text (Initials)</label>
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

            {/* Taxes & Charges */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Taxes &amp; Charges</h2>

              {/* Tax presets */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-[var(--muted)]">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => applyTaxPreset("gst18")} className="text-xs px-2.5 py-1 rounded border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all cursor-pointer">GST 18%</button>
                  <button onClick={() => applyTaxPreset("cgst_sgst")} className="text-xs px-2.5 py-1 rounded border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all cursor-pointer">CGST+SGST</button>
                  <button onClick={() => applyTaxPreset("vat20")} className="text-xs px-2.5 py-1 rounded border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all cursor-pointer">VAT 20%</button>
                  <button onClick={() => applyTaxPreset("sales_tax")} className="text-xs px-2.5 py-1 rounded border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all cursor-pointer">Sales Tax 8.25%</button>
                  <button onClick={() => applyTaxPreset("no_tax")} className="text-xs px-2.5 py-1 rounded border border-red-300 hover:border-red-500 hover:bg-red-50 text-red-600 transition-all cursor-pointer">No Tax</button>
                </div>
              </div>

              {/* Tax rows */}
              {taxes.length > 0 && (
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-2">Tax Rows</label>
                  {taxes.map((t) => (
                    <div key={t.id} className="flex gap-2 mb-2 items-center">
                      <input type="text" value={t.label} onChange={(e) => updateTax(t.id, "label", e.target.value)} className="input-field flex-1" placeholder="Tax label" />
                      <input type="number" value={t.rate} onChange={(e) => updateTax(t.id, "rate", e.target.value)} className="input-field w-20" placeholder="Rate" min="0" step="0.01" />
                      <button
                        onClick={() => updateTax(t.id, "type", t.type === "percent" ? "amount" : "percent")}
                        className="text-xs px-2 py-1.5 rounded border border-[var(--border)] hover:bg-[var(--muted-bg)] font-medium min-w-[32px] text-center cursor-pointer"
                        title={t.type === "percent" ? "Percentage — click to switch to fixed amount" : "Fixed amount — click to switch to percentage"}
                      >
                        {t.type === "percent" ? "%" : sym}
                      </button>
                      <button onClick={() => removeTax(t.id)} className="text-red-500 hover:text-red-700 text-xl font-bold cursor-pointer" title="Remove">&times;</button>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={addTax} className="btn-secondary text-sm mb-4">+ Add Tax</button>

              {/* Extra charges */}
              <div className="border-t border-[var(--border)] pt-4 mt-2">
                <label className="block text-sm font-medium mb-1 text-[var(--muted)]">Extra Charge Presets</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button onClick={() => addChargePreset("service")} className="text-xs px-2.5 py-1 rounded border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all cursor-pointer">+ Service Charge</button>
                  <button onClick={() => addChargePreset("delivery")} className="text-xs px-2.5 py-1 rounded border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all cursor-pointer">+ Delivery Fee</button>
                  <button onClick={() => addChargePreset("packaging")} className="text-xs px-2.5 py-1 rounded border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all cursor-pointer">+ Packaging</button>
                  <button onClick={() => addChargePreset("convenience")} className="text-xs px-2.5 py-1 rounded border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all cursor-pointer">+ Convenience Fee</button>
                </div>
                {extraCharges.length > 0 && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">Extra Charges</label>
                    {extraCharges.map((c) => (
                      <div key={c.id} className="flex gap-2 mb-2 items-center">
                        <input type="text" value={c.label} onChange={(e) => updateCharge(c.id, "label", e.target.value)} className="input-field flex-1" placeholder="Charge label" />
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-[var(--muted)]">{sym}</span>
                          <input type="number" value={c.amount} onChange={(e) => updateCharge(c.id, "amount", e.target.value)} className="input-field w-24" placeholder="Amount" min="0" step="0.01" />
                        </div>
                        <button onClick={() => removeCharge(c.id)} className="text-red-500 hover:text-red-700 text-xl font-bold cursor-pointer" title="Remove">&times;</button>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={addCharge} className="btn-secondary text-sm">+ Add Extra Charge</button>
              </div>
            </div>

            {/* Discount & Tip */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Discount &amp; Tip</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                logoImage={logoImage}
                bizAddress={bizAddress}
                bizPhone={bizPhone}
                bizEmail={bizEmail}
                bizWebsite={bizWebsite}
                receiptNo={receiptNo}
                receiptDate={receiptDate}
                paymentMethod={paymentMethod}
                items={items}
                taxAmounts={taxAmounts}
                extraCharges={extraCharges}
                subtotal={subtotal}
                discountAmt={discountAmt}
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
  template, bizName, logoText, logoImage, bizAddress, bizPhone, bizEmail, bizWebsite,
  receiptNo, receiptDate, paymentMethod, items, taxAmounts, extraCharges,
  subtotal, discountAmt, tip, grandTotal, sym, footerText, lineTotal,
}: {
  template: ReceiptTemplate;
  bizName: string; logoText: string; logoImage: string | null; bizAddress: string; bizPhone: string;
  bizEmail: string; bizWebsite: string; receiptNo: string; receiptDate: string;
  paymentMethod: string; items: ReceiptItem[];
  taxAmounts: { label: string; amount: number; rate: string; type: string }[];
  extraCharges: { id: number; label: string; amount: string }[];
  subtotal: number; discountAmt: number; tip: number;
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
          {logoImage && <img src={logoImage} alt="Logo" style={{ width: 50, height: 50, margin: "0 auto 8px", borderRadius: 4, objectFit: "contain" }} />}
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
        {taxAmounts.map((t, i) => t.amount > 0 && <Row key={i} l={t.type === "percent" ? `${t.label} (${t.rate}%)` : t.label} r={`${sym}${f(t.amount)}`} />)}
        {extraCharges.map((c, i) => (parseFloat(c.amount) || 0) > 0 && <Row key={`ec${i}`} l={c.label || "Charge"} r={`${sym}${f(parseFloat(c.amount) || 0)}`} />)}
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
          {logoImage && <img src={logoImage} alt="Logo" style={{ width: 44, height: 44, marginBottom: 6, borderRadius: 4, objectFit: "contain", background: "rgba(255,255,255,0.15)" }} />}
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
          {taxAmounts.map((t, i) => t.amount > 0 && <Row key={i} l={t.type === "percent" ? `${t.label} (${t.rate}%)` : t.label} r={`${sym}${f(t.amount)}`} />)}
          {extraCharges.map((c, i) => (parseFloat(c.amount) || 0) > 0 && <Row key={`ec${i}`} l={c.label || "Charge"} r={`${sym}${f(parseFloat(c.amount) || 0)}`} />)}
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
          {logoImage && <img src={logoImage} alt="Logo" style={{ width: 44, height: 44, margin: "0 auto 8px", borderRadius: 4, objectFit: "contain" }} />}
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
        {taxAmounts.map((t, i) => t.amount > 0 && <Row key={i} l={t.type === "percent" ? `${t.label} (${t.rate}%)` : t.label} r={`${sym}${f(t.amount)}`} />)}
        {extraCharges.map((c, i) => (parseFloat(c.amount) || 0) > 0 && <Row key={`ec${i}`} l={c.label || "Charge"} r={`${sym}${f(parseFloat(c.amount) || 0)}`} />)}
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
            {logoImage && <img src={logoImage} alt="Logo" style={{ width: 44, height: 44, marginBottom: 6, borderRadius: 4, objectFit: "contain" }} />}
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
          {taxAmounts.map((t, i) => t.amount > 0 && <Row key={i} l={t.type === "percent" ? `${t.label} (${t.rate}%)` : t.label} r={`${sym}${f(t.amount)}`} />)}
          {extraCharges.map((c, i) => (parseFloat(c.amount) || 0) > 0 && <Row key={`ec${i}`} l={c.label || "Charge"} r={`${sym}${f(parseFloat(c.amount) || 0)}`} />)}
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
          {logoImage ? (
            <img src={logoImage} alt="Logo" style={{ width: 44, height: 44, margin: "0 auto 4px", borderRadius: 4, objectFit: "contain", background: "rgba(255,255,255,0.1)" }} />
          ) : (
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", border: "2px solid #fff", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              {initials}
            </div>
          )}
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
          {taxAmounts.map((t, i) => t.amount > 0 && <Row key={i} l={t.type === "percent" ? `${t.label} (${t.rate}%)` : t.label} r={`${sym}${f(t.amount)}`} />)}
          {extraCharges.map((c, i) => (parseFloat(c.amount) || 0) > 0 && <Row key={`ec${i}`} l={c.label || "Charge"} r={`${sym}${f(parseFloat(c.amount) || 0)}`} />)}
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
        {logoImage && <img src={logoImage} alt="Logo" style={{ width: 44, height: 44, margin: "0 auto 6px", borderRadius: 4, objectFit: "contain" }} />}
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
      {taxAmounts.map((t, i) => t.amount > 0 && <Row key={i} l={t.type === "percent" ? `${t.label} (${t.rate}%)` : t.label} r={`${sym}${f(t.amount)}`} />)}
      {extraCharges.map((c, i) => (parseFloat(c.amount) || 0) > 0 && <Row key={`ec${i}`} l={c.label || "Charge"} r={`${sym}${f(parseFloat(c.amount) || 0)}`} />)}
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
