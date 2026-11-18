"use client";

import { useState, useRef, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Free Receipt Generator - Create & Download Receipts",
  description:
    "Free online receipt generator. Create realistic thermal-style receipts with itemized billing, tax, and tip. Download as PNG or print. No signup required.",
  keywords:
    "receipt generator, receipt maker, free receipt, bill generator, receipt template, thermal receipt, store receipt",
};

interface ReceiptItem {
  id: number;
  name: string;
  quantity: string;
  price: string;
}

let nextItemId = 1;

function makeItem(): ReceiptItem {
  return { id: nextItemId++, name: "", quantity: "1", price: "" };
}

function generateReceiptNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "RCP-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function ReceiptGeneratorPage() {
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [receiptDate, setReceiptDate] = useState("");
  const [items, setItems] = useState<ReceiptItem[]>([makeItem()]);
  const [taxRate, setTaxRate] = useState("0");
  const [tipAmount, setTipAmount] = useState("0");
  const [currency, setCurrency] = useState("$");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReceiptNumber(generateReceiptNumber());
    setReceiptDate(new Date().toISOString().split("T")[0]);
    setDisplayCurrency(getCurrencyFromStorage());
  }, []);

  function updateItem(id: number, field: keyof ReceiptItem, value: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function addItem() {
    setItems((prev) => [...prev, makeItem()]);
  }

  function removeItem(id: number) {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function getItemTotal(item: ReceiptItem) {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    return qty * price;
  }

  const subtotal = items.reduce((sum, item) => sum + getItemTotal(item), 0);
  const tax = subtotal * (parseFloat(taxRate) || 0) / 100;
  const tip = parseFloat(tipAmount) || 0;
  const total = subtotal + tax + tip;

  function padRight(str: string, len: number) {
    return str.length >= len ? str.substring(0, len) : str + " ".repeat(len - str.length);
  }

  function padLeft(str: string, len: number) {
    return str.length >= len ? str : " ".repeat(len - str.length) + str;
  }

  function handleDownloadPNG() {
    const receiptEl = printRef.current;
    if (!receiptEl) return;

    const canvas = document.createElement("canvas");
    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    const ctx = maybeCtx;

    const w = 400;
    const lineH = 22;
    const font = "16px 'Courier New', Courier, monospace";
    const smallFont = "13px 'Courier New', Courier, monospace";
    ctx.font = font;

    // Calculate height
    let lines = 0;
    lines += 3; // store header
    lines += 2; // divider + date/receipt
    lines += 2; // date, receipt#
    lines += 1; // divider
    lines += 1; // header row
    lines += items.length; // items
    lines += 1; // divider
    lines += 1; // subtotal
    if (parseFloat(taxRate) > 0) lines += 1;
    if (tip > 0) lines += 1;
    lines += 1; // divider
    lines += 1; // total
    lines += 2; // footer
    lines += 2; // padding

    const h = (lines + 4) * lineH + 40;
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = "#fefefe";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#1a1a1a";
    ctx.textBaseline = "top";
    let y = 20;

    function drawLine(text: string, align: "center" | "left" = "left", bold = false) {
      ctx.font = bold ? `bold ${font}` : font;
      if (align === "center") {
        const tw = ctx.measureText(text).width;
        ctx.fillText(text, (w - tw) / 2, y);
      } else {
        ctx.fillText(text, 20, y);
      }
      y += lineH;
    }

    function drawDashedLine() {
      ctx.font = font;
      const dash = "-".repeat(38);
      const tw = ctx.measureText(dash).width;
      ctx.fillText(dash, (w - tw) / 2, y);
      y += lineH;
    }

    // Header
    drawLine(storeName || "STORE NAME", "center", true);
    if (storeAddress) drawLine(storeAddress, "center");
    if (storePhone) drawLine(storePhone, "center");
    drawDashedLine();

    // Date & receipt number
    drawLine(`Date: ${receiptDate}`);
    drawLine(`Receipt #: ${receiptNumber}`);
    drawDashedLine();

    // Items header
    ctx.font = `bold ${font}`;
    const hdr = padRight("Item", 18) + padLeft("Qty", 4) + padLeft("Price", 8) + padLeft("Total", 8);
    const hdrW = ctx.measureText(hdr).width;
    ctx.fillText(hdr, (w - hdrW) / 2, y);
    y += lineH;

    ctx.font = font;
    items.forEach((item) => {
      const iName = padRight(item.name || "Item", 18);
      const iQty = padLeft(item.quantity || "1", 4);
      const iPrice = padLeft((parseFloat(item.price || "0")).toFixed(2), 8);
      const iTotal = padLeft(getItemTotal(item).toFixed(2), 8);
      const row = iName + iQty + iPrice + iTotal;
      const rw = ctx.measureText(row).width;
      ctx.fillText(row, (w - rw) / 2, y);
      y += lineH;
    });

    drawDashedLine();

    // Totals
    function drawTotalLine(label: string, amount: string) {
      const text = padRight(label, 26) + padLeft(currency + amount, 12);
      const tw = ctx.measureText(text).width;
      ctx.fillText(text, (w - tw) / 2, y);
      y += lineH;
    }

    drawTotalLine("Subtotal:", subtotal.toFixed(2));
    if (parseFloat(taxRate) > 0) {
      drawTotalLine(`Tax (${taxRate}%):`, tax.toFixed(2));
    }
    if (tip > 0) {
      drawTotalLine("Tip:", tip.toFixed(2));
    }
    drawDashedLine();

    ctx.font = `bold ${font}`;
    const totalText = padRight("TOTAL:", 26) + padLeft(currency + total.toFixed(2), 12);
    const ttw = ctx.measureText(totalText).width;
    ctx.fillText(totalText, (w - ttw) / 2, y);
    y += lineH * 2;

    ctx.font = smallFont;
    const thankYou = "Thank you for your purchase!";
    const tyw = ctx.measureText(thankYou).width;
    ctx.fillText(thankYou, (w - tyw) / 2, y);

    // Download
    const link = document.createElement("a");
    link.download = `receipt-${receiptNumber}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <title>Receipt ${receiptNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', Courier, monospace; color: #1a1a1a; display: flex; justify-content: center; padding: 20px; }
          .receipt { width: 300px; padding: 20px 10px; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .dashed { border-top: 2px dashed #1a1a1a; margin: 8px 0; }
          .row { display: flex; justify-content: space-between; font-size: 13px; padding: 2px 0; }
          .store-name { font-size: 18px; font-weight: bold; }
          .total-row { font-size: 16px; font-weight: bold; }
          .thank-you { text-align: center; margin-top: 16px; font-size: 12px; }
          @media print { body { padding: 0; } }
        </style>
        <body>
          <div class="receipt">
            <div class="center store-name">${storeName || "STORE NAME"}</div>
            ${storeAddress ? `<div class="center" style="font-size:12px">${storeAddress}</div>` : ""}
            ${storePhone ? `<div class="center" style="font-size:12px">${storePhone}</div>` : ""}
            <div class="dashed"></div>
            <div class="row"><span>Date: ${receiptDate}</span></div>
            <div class="row"><span>Receipt #: ${receiptNumber}</span></div>
            <div class="dashed"></div>
            ${items.map((item) => `
              <div class="row">
                <span>${item.name || "Item"} x${item.quantity || "1"}</span>
                <span>${currency}${getItemTotal(item).toFixed(2)}</span>
              </div>
            `).join("")}
            <div class="dashed"></div>
            <div class="row"><span>Subtotal</span><span>${currency}${subtotal.toFixed(2)}</span></div>
            ${parseFloat(taxRate) > 0 ? `<div class="row"><span>Tax (${taxRate}%)</span><span>${currency}${tax.toFixed(2)}</span></div>` : ""}
            ${tip > 0 ? `<div class="row"><span>Tip</span><span>${currency}${tip.toFixed(2)}</span></div>` : ""}
            <div class="dashed"></div>
            <div class="row total-row"><span>TOTAL</span><span>${currency}${total.toFixed(2)}</span></div>
            <div class="thank-you">Thank you for your purchase!</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 250);
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/receipt-generator`} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">
            &larr; All Tools
          </a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Receipt Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Create realistic receipts for free. Add items, tax, tip, and download as PNG or print.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <CurrencySelector onChange={setDisplayCurrency} className="mb-0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Form */}
          <div className="space-y-6">
            {/* Store Info */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Store / Business Info</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Store Name</label>
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="input-field" placeholder="My Store" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input type="text" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} className="input-field" placeholder="123 Main St, City, State" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} className="input-field" placeholder="(555) 123-4567" />
                </div>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Receipt Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Receipt #</label>
                  <input type="text" value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input-field">
                    <option value="$">$ (USD)</option>
                    <option value="€">&#8364; (EUR)</option>
                    <option value="£">&#163; (GBP)</option>
                    <option value="₹">&#8377; (INR)</option>
                    <option value="¥">&#165; (JPY)</option>
                    <option value="A$">A$ (AUD)</option>
                    <option value="C$">C$ (CAD)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Items</h2>

              <div className="hidden sm:grid sm:grid-cols-[1fr_70px_90px_90px_32px] gap-3 mb-2 text-sm font-medium text-[var(--muted)]">
                <span>Item</span>
                <span>Qty</span>
                <span>Price</span>
                <span>Total</span>
                <span></span>
              </div>

              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[1fr_70px_90px_90px_32px] gap-3 mb-3 items-center">
                  <input type="text" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} className="input-field" placeholder="Item name" />
                  <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", e.target.value)} className="input-field text-center" placeholder="Qty" min="0" />
                  <input type="number" value={item.price} onChange={(e) => updateItem(item.id, "price", e.target.value)} className="input-field" placeholder="Price" min="0" step="0.01" />
                  <div className="input-field bg-[var(--muted-bg)] text-center font-medium">
                    {currency}{getItemTotal(item).toFixed(2)}
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-xl font-bold cursor-pointer" title="Remove item">
                    &times;
                  </button>
                </div>
              ))}

              <button onClick={addItem} className="btn-secondary text-sm mt-2">+ Add Item</button>
            </div>

            {/* Tax & Tip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="tool-card">
                <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
                <input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="input-field w-32" min="0" max="100" step="0.1" />
              </div>
              <div className="tool-card">
                <label className="block text-sm font-medium mb-1">Tip Amount ({currency})</label>
                <input type="number" value={tipAmount} onChange={(e) => setTipAmount(e.target.value)} className="input-field w-32" min="0" step="0.01" />
              </div>
            </div>
          </div>

          {/* RIGHT: Live Receipt Preview */}
          <div className="tool-card sticky top-4 self-start">
            <h2 className="font-bold text-lg mb-4">Receipt Preview</h2>
            <div ref={printRef} className="flex justify-center">
              <div
                style={{
                  width: "300px",
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: "13px",
                  color: "#1a1a1a",
                  background: "#fefefe",
                  padding: "24px 16px",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid #e5e5e5",
                }}
              >
                {/* Store Header */}
                <div style={{ textAlign: "center", marginBottom: "8px" }}>
                  <div style={{ fontSize: "18px", fontWeight: 700 }}>{storeName || "STORE NAME"}</div>
                  {storeAddress && <div style={{ fontSize: "11px" }}>{storeAddress}</div>}
                  {storePhone && <div style={{ fontSize: "11px" }}>{storePhone}</div>}
                </div>

                <div style={{ borderTop: "2px dashed #1a1a1a", margin: "8px 0" }} />

                <div style={{ fontSize: "11px", marginBottom: "2px" }}>Date: {receiptDate}</div>
                <div style={{ fontSize: "11px", marginBottom: "4px" }}>Receipt #: {receiptNumber}</div>

                <div style={{ borderTop: "2px dashed #1a1a1a", margin: "8px 0" }} />

                {/* Items */}
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: "12px" }}>
                    <span>{item.name || "Item"} x{item.quantity || "1"}</span>
                    <span>{currency}{getItemTotal(item).toFixed(2)}</span>
                  </div>
                ))}

                <div style={{ borderTop: "2px dashed #1a1a1a", margin: "8px 0" }} />

                {/* Totals */}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: "12px" }}>
                  <span>Subtotal</span>
                  <span>{currency}{subtotal.toFixed(2)}</span>
                </div>
                {parseFloat(taxRate) > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: "12px" }}>
                    <span>Tax ({taxRate}%)</span>
                    <span>{currency}{tax.toFixed(2)}</span>
                  </div>
                )}
                {tip > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: "12px" }}>
                    <span>Tip</span>
                    <span>{currency}{tip.toFixed(2)}</span>
                  </div>
                )}

                <div style={{ borderTop: "2px dashed #1a1a1a", margin: "8px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 700, padding: "2px 0" }}>
                  <span>TOTAL</span>
                  <span>{currency}{total.toFixed(2)}</span>
                </div>

                <div style={{ textAlign: "center", fontSize: "11px", marginTop: "16px", color: "#666" }}>
                  Thank you for your purchase!
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center mt-6">
              <button onClick={handleDownloadPNG} className="btn-primary px-6 py-2">
                Download PNG
              </button>
              <button onClick={handlePrint} className="btn-secondary px-6 py-2">
                Print
              </button>
            </div>
          </div>
        </div>

        <div className="ad-placeholder my-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Free Receipt Generator</h2>
          <p>
            Create realistic-looking receipts in seconds without signing up. This free receipt generator lets you
            add store details, line items with quantities and prices, calculate tax and tips, and download as PNG
            or print directly. Perfect for record keeping, expense tracking, and documentation.
          </p>

          <h2>What to Include on a Receipt</h2>
          <ul>
            <li><strong>Store name and address:</strong> Business identification and location</li>
            <li><strong>Receipt number:</strong> A unique identifier for tracking purposes</li>
            <li><strong>Date:</strong> When the transaction took place</li>
            <li><strong>Line items:</strong> Item names, quantities, and unit prices</li>
            <li><strong>Tax:</strong> Applicable sales tax or VAT amount</li>
            <li><strong>Total:</strong> The final amount including tax and tip</li>
          </ul>

          <h2>Receipt Generation Tips</h2>
          <ul>
            <li>Always include a unique receipt number for record keeping</li>
            <li>Double check item prices and quantities before generating</li>
            <li>Include tax rate appropriate for your jurisdiction</li>
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
