"use client";

import { useState, useRef, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Free Invoice Generator - Create & Download PDF Invoices",
  description:
    "Free online invoice generator. Create professional invoices with itemized billing, tax calculation, and download as PDF. No signup required.",
  keywords:
    "invoice generator, free invoice maker, create invoice online, invoice template, bill generator, pdf invoice",
};

interface InvoiceItem {
  id: number;
  description: string;
  quantity: string;
  rate: string;
}

let nextItemId = 1;

function makeItem(): InvoiceItem {
  return { id: nextItemId++, description: "", quantity: "1", rate: "" };
}

export default function InvoiceGeneratorPage() {
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    setInvoiceDate(new Date().toISOString().split("T")[0]);
    setDisplayCurrency(getCurrencyFromStorage());
  }, []);
  const [items, setItems] = useState<InvoiceItem[]>([makeItem()]);
  const [taxRate, setTaxRate] = useState("0");
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState("$");
  const printRef = useRef<HTMLDivElement>(null);

  function updateItem(id: number, field: keyof InvoiceItem, value: string) {
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

  function getItemTotal(item: InvoiceItem) {
    const qty = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    return qty * rate;
  }

  const subtotal = items.reduce((sum, item) => sum + getItemTotal(item), 0);
  const tax = subtotal * (parseFloat(taxRate) || 0) / 100;
  const total = subtotal + tax;

  function handlePrint() {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        
          <title>Invoice ${invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1e293b; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .header h1 { font-size: 28px; color: #2563eb; }
            .header .info { text-align: right; }
            .header .info p { margin-bottom: 4px; font-size: 14px; color: #64748b; }
            .header .info strong { color: #1e293b; }
            .parties { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .parties .party { width: 45%; }
            .parties .party h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px; }
            .parties .party p { font-size: 14px; margin-bottom: 2px; }
            .parties .party .name { font-weight: 600; font-size: 16px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            thead { background: #f1f5f9; }
            th { text-align: left; padding: 10px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; border-bottom: 2px solid #e2e8f0; }
            td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
            .amount { text-align: right; }
            .totals { display: flex; justify-content: flex-end; margin-bottom: 30px; }
            .totals table { width: 280px; }
            .totals td { border: none; padding: 6px 12px; }
            .totals .total-row { font-size: 18px; font-weight: 700; color: #2563eb; border-top: 2px solid #e2e8f0; }
            .notes { background: #f8fafc; padding: 16px; border-radius: 8px; font-size: 13px; color: #64748b; }
            .notes h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; color: #64748b; }
            @media print { body { padding: 20px; } }
          </style>
        
        <body>
          <div class="header">
            <div>
              <h1>INVOICE</h1>
              <p style="color:#64748b;margin-top:4px">${businessName || "Your Business Name"}</p>
              <p style="color:#64748b;font-size:13px;white-space:pre-line">${businessAddress}</p>
            </div>
            <div class="info">
              <p>Invoice # <strong>${invoiceNumber}</strong></p>
              <p>Date: <strong>${invoiceDate}</strong></p>
              ${dueDate ? `<p>Due: <strong>${dueDate}</strong></p>` : ""}
            </div>
          </div>
          <div class="parties">
            <div class="party">
              <h3>Bill To</h3>
              <p class="name">${clientName || "Client Name"}</p>
              <p style="white-space:pre-line;font-size:13px;color:#64748b">${clientAddress}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="amount">Qty</th>
                <th class="amount">Rate</th>
                <th class="amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                <tr>
                  <td>${item.description || "—"}</td>
                  <td class="amount">${item.quantity}</td>
                  <td class="amount">${currency}${parseFloat(item.rate || "0").toFixed(2)}</td>
                  <td class="amount">${currency}${getItemTotal(item).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <div class="totals">
            <table>
              <tr><td>Subtotal</td><td class="amount">${currency}${subtotal.toFixed(2)}</td></tr>
              ${parseFloat(taxRate) > 0 ? `<tr><td>Tax (${taxRate}%)</td><td class="amount">${currency}${tax.toFixed(2)}</td></tr>` : ""}
              <tr class="total-row"><td>Total</td><td class="amount">${currency}${total.toFixed(2)}</td></tr>
            </table>
          </div>
          ${notes ? `<div class="notes"><h4>Notes</h4><p>${notes}</p></div>` : ""}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/invoice-generator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/invoice-generator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">
            &larr; All Tools
          </a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Invoice Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Create professional invoices for free. Fill in the details, preview your invoice, and download as PDF.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <CurrencySelector onChange={setDisplayCurrency} className="mb-0" />
        </div>

        {/* Business & Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="tool-card">
            <h2 className="font-bold text-lg mb-4">Your Business</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="input-field"
                  placeholder="Your Business Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="input-field resize-none"
                  placeholder="Street, City, State, ZIP"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="tool-card">
            <h2 className="font-bold text-lg mb-4">Bill To</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="input-field"
                  placeholder="Client or Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Client Address</label>
                <textarea
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="input-field resize-none"
                  placeholder="Street, City, State, ZIP"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="tool-card mb-6">
          <h2 className="font-bold text-lg mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Invoice #</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-field"
              >
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
        <div className="tool-card mb-6">
          <h2 className="font-bold text-lg mb-4">Items</h2>

          <div className="hidden sm:grid sm:grid-cols-[1fr_80px_100px_100px_40px] gap-3 mb-2 text-sm font-medium text-[var(--muted)]">
            <span>Description</span>
            <span>Qty</span>
            <span>Rate</span>
            <span>Amount</span>
            <span></span>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 sm:grid-cols-[1fr_80px_100px_100px_40px] gap-3 mb-3 items-center"
            >
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                className="input-field"
                placeholder="Item description"
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                className="input-field text-center"
                placeholder="Qty"
                min="0"
              />
              <input
                type="number"
                value={item.rate}
                onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                className="input-field"
                placeholder="Rate"
                min="0"
                step="0.01"
              />
              <div className="input-field bg-[var(--muted-bg)] text-center font-medium">
                {currency}{getItemTotal(item).toFixed(2)}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 text-xl font-bold cursor-pointer"
                title="Remove item"
              >
                &times;
              </button>
            </div>
          ))}

          <button onClick={addItem} className="btn-secondary text-sm mt-2">
            + Add Item
          </button>
        </div>

        {/* Tax & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="tool-card">
            <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className="input-field w-32"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <div className="tool-card">
            <label className="block text-sm font-medium mb-1">Notes / Payment Terms</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field resize-none"
              rows={2}
              placeholder="e.g., Payment due within 30 days. Bank details..."
            />
          </div>
        </div>

        {/* Totals */}
        <div className="tool-card mb-8">
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Subtotal</span>
                <span className="font-medium">{currency}{subtotal.toFixed(2)}</span>
              </div>
              {parseFloat(taxRate) > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Tax ({taxRate}%)</span>
                  <span className="font-medium">{currency}{tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-[var(--card-border)] text-xl font-bold text-[var(--primary)]">
                <span>Total</span>
                <span>{currency}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <button onClick={handlePrint} className="btn-primary px-8 py-3 text-lg">
              Download as PDF
            </button>
            <p className="text-xs text-[var(--muted)] mt-2">Opens a print dialog — choose &quot;Save as PDF&quot;</p>
          </div>
        </div>

        <div ref={printRef} className="hidden" />

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Free Invoice Generator</h2>
          <p>
            Create professional-looking invoices in minutes without signing up for expensive software. This free invoice
            generator lets you fill in your business details, add line items, calculate taxes, and download a clean PDF invoice.
          </p>

          <h2>What to Include in an Invoice</h2>
          <ul>
            <li><strong>Invoice number:</strong> A unique identifier for tracking and record-keeping</li>
            <li><strong>Date and due date:</strong> When the invoice was issued and when payment is expected</li>
            <li><strong>Business details:</strong> Your company name and address for identification</li>
            <li><strong>Client details:</strong> The recipient&apos;s name and address</li>
            <li><strong>Line items:</strong> Description, quantity, and rate for each product or service</li>
            <li><strong>Tax:</strong> Applicable tax rates and calculated amounts</li>
            <li><strong>Total:</strong> The final amount due including all taxes</li>
            <li><strong>Payment terms:</strong> How and when to pay, bank details, or accepted methods</li>
          </ul>

          <h2>Tips for Getting Paid Faster</h2>
          <ul>
            <li>Send invoices promptly after completing work</li>
            <li>Include clear payment terms and due dates</li>
            <li>Provide multiple payment options</li>
            <li>Follow up on overdue invoices professionally</li>
            <li>Consider offering early payment discounts</li>
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
            name: "Invoice Generator",
            description: META.description,
            url: `${SITE_URL}/tools/invoice-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
