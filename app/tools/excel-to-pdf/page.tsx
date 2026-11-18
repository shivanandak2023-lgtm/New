"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Table to PDF - Convert Tables to PDF Online Free",
  description:
    "Free Table to PDF converter. Paste CSV data or build a table manually, then download as a styled PDF. No upload to server.",
  keywords: "table to pdf, csv to pdf, excel to pdf, spreadsheet to pdf, convert table pdf",
};

export default function ExcelToPdfPage() {
  const [mode, setMode] = useState<"csv" | "manual">("csv");
  const [csvText, setCsvText] = useState("");
  const [rows, setRows] = useState<string[][]>([["", "", ""], ["", "", ""], ["", "", ""]]);
  const [hasHeader, setHasHeader] = useState(true);
  const [tableTitle, setTableTitle] = useState("");
  const [generated, setGenerated] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  function parseCsv(text: string): string[][] {
    return text
      .trim()
      .split("\n")
      .map((line) =>
        line.split(/[,\t]/).map((cell) => cell.trim().replace(/^"|"$/g, ""))
      )
      .filter((row) => row.some((c) => c.length > 0));
  }

  function getTableData(): string[][] {
    if (mode === "csv") return parseCsv(csvText);
    return rows.filter((row) => row.some((c) => c.trim().length > 0));
  }

  function addRow() {
    setRows([...rows, new Array(rows[0]?.length || 3).fill("")]);
  }

  function addColumn() {
    setRows(rows.map((row) => [...row, ""]));
  }

  function removeRow(idx: number) {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== idx));
  }

  function removeColumn(idx: number) {
    if ((rows[0]?.length || 0) <= 1) return;
    setRows(rows.map((row) => row.filter((_, i) => i !== idx)));
  }

  function updateCell(rowIdx: number, colIdx: number, value: string) {
    const newRows = rows.map((row) => [...row]);
    newRows[rowIdx][colIdx] = value;
    setRows(newRows);
  }

  function generateTable() {
    const data = getTableData();
    if (data.length === 0) return;
    setGenerated(true);
  }

  function downloadPdf() {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !tableRef.current) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${tableTitle || "Table"}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { font-size: 18px; text-align: center; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #333; padding: 8px 12px; text-align: left; font-size: 13px; }
          th { background: #2563eb; color: #fff; font-weight: 600; }
          tr:nth-child(even) td { background: #f3f4f6; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        ${tableTitle ? `<h1>${tableTitle}</h1>` : ""}
        ${tableRef.current.innerHTML}
        <script>window.onload=function(){window.print();window.close();}<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  const tableData = getTableData();

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/excel-to-pdf`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Table to PDF Converter</h1>
        <p className="text-[var(--muted)] mb-8">
          Paste CSV data or build a table manually, then download as a clean PDF. Everything runs in your browser.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode("csv")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === "csv" ? "bg-[var(--primary)] text-white" : "bg-[var(--card-bg)] border border-[var(--card-border)]"
              }`}
            >
              Paste CSV / TSV
            </button>
            <button
              onClick={() => setMode("manual")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === "manual" ? "bg-[var(--primary)] text-white" : "bg-[var(--card-bg)] border border-[var(--card-border)]"
              }`}
            >
              Manual Table
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Table Title (optional)</label>
            <input
              type="text"
              value={tableTitle}
              onChange={(e) => setTableTitle(e.target.value)}
              placeholder="e.g. Sales Report Q4 2026"
              className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2 mb-4 text-sm">
            <input
              type="checkbox"
              checked={hasHeader}
              onChange={(e) => setHasHeader(e.target.checked)}
              className="accent-[var(--primary)]"
            />
            First row is header
          </label>

          {mode === "csv" ? (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Paste your CSV or TSV data</label>
              <textarea
                value={csvText}
                onChange={(e) => { setCsvText(e.target.value); setGenerated(false); }}
                placeholder={"Name, Age, City\nAlice, 30, New York\nBob, 25, London\nCharlie, 35, Tokyo"}
                className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 font-mono text-sm h-40 resize-y"
              />
            </div>
          ) : (
            <div className="mb-4 overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="p-1">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => { updateCell(ri, ci, e.target.value); setGenerated(false); }}
                            className="w-full border border-[var(--card-border)] rounded px-2 py-1 text-sm"
                            placeholder={hasHeader && ri === 0 ? `Header ${ci + 1}` : ""}
                          />
                        </td>
                      ))}
                      <td className="p-1">
                        <button onClick={() => removeRow(ri)} className="text-red-500 hover:text-red-700 text-xs px-2">x</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex gap-2 mt-2">
                <button onClick={addRow} className="text-sm text-[var(--primary)] hover:underline">+ Add Row</button>
                <button onClick={addColumn} className="text-sm text-[var(--primary)] hover:underline">+ Add Column</button>
                {(rows[0]?.length || 0) > 1 && (
                  <button onClick={() => removeColumn((rows[0]?.length || 1) - 1)} className="text-sm text-red-500 hover:underline">- Remove Last Column</button>
                )}
              </div>
            </div>
          )}

          <button
            onClick={generateTable}
            disabled={mode === "csv" ? csvText.trim().length === 0 : !rows.some((r) => r.some((c) => c.trim()))}
            className="btn-primary w-full"
          >
            Generate Table Preview
          </button>
        </div>

        {generated && tableData.length > 0 && (
          <div className="result-card mb-8">
            <h2 className="text-lg font-bold mb-4">Table Preview</h2>
            <div ref={tableRef} className="overflow-x-auto mb-4">
              <table className="w-full border-collapse text-sm">
                {hasHeader && (
                  <thead>
                    <tr>
                      {tableData[0].map((cell, i) => (
                        <th key={i} className="border border-gray-300 px-3 py-2 bg-blue-600 text-white font-semibold text-left">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {tableData.slice(hasHeader ? 1 : 0).map((row, ri) => (
                    <tr key={ri} className={ri % 2 === 0 ? "" : "bg-gray-50"}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="border border-gray-300 px-3 py-2">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">
              {tableData.length} rows, {tableData[0]?.length || 0} columns
            </p>
            <button onClick={downloadPdf} className="btn-primary w-full">
              Download as PDF (Print)
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How Does Table to PDF Work?</h2>
          <p>
            This tool lets you paste CSV or TSV data (or build a table manually) and generates a
            styled HTML table. When you click download, the table opens in a print-friendly window
            so you can save it as a PDF using your browser&apos;s built-in print dialog.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Paste CSV or tab-separated data from Excel, Google Sheets, or any spreadsheet</li>
            <li>Manual table builder for custom data entry</li>
            <li>Clean, professional table styling with alternating row colors</li>
            <li>Header row detection and bold formatting</li>
            <li>Optional table title</li>
            <li>100% client-side — no data leaves your browser</li>
          </ul>

          <h2>Tips for Best Results</h2>
          <p>
            Copy data from Excel or Google Sheets and paste it directly — tab-separated values are
            automatically detected. For CSV files, open them in a text editor, copy the contents,
            and paste here.
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
            name: "Table to PDF Converter",
            description: META.description,
            url: `${SITE_URL}/tools/excel-to-pdf`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
