"use client";

import { useState, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Online Clipboard - Share Text & Files Between Devices with Code",
  description: "Share text, code, PDFs, images between devices instantly with a 4-digit code. No signup, no app. Works on any device. Free online clipboard.",
  keywords: "online clipboard, share text between devices, share pdf between devices, clipboard share, file sharing, cross device clipboard, send file with code",
};

const MAX_TEXT = 500000;
const MAX_FILE_MB = 4;

export default function ClipboardSharePage() {
  const [activeTab, setActiveTab] = useState<"send" | "receive">("send");
  const [sendMode, setSendMode] = useState<"text" | "file">("text");

  // Send state
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState("");
  const [sendError, setSendError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Receive state
  const [inputCode, setInputCode] = useState("");
  const [receiving, setReceiving] = useState(false);
  const [receivedText, setReceivedText] = useState("");
  const [receivedFile, setReceivedFile] = useState<{ name: string; type: string; data: string; size: number } | null>(null);
  const [receiveError, setReceiveError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSendText = async () => {
    if (!text.trim()) return;
    setSending(true);
    setSendError("");
    setCode("");
    try {
      const res = await fetch("/api/clipboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "text", text: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setSendError(data.error); return; }
      setCode(data.code);
    } catch { setSendError("Network error."); }
    finally { setSending(false); }
  };

  const handleSendFile = async () => {
    if (!file) return;
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setSendError(`File too large. Max: ${MAX_FILE_MB}MB`);
      return;
    }
    setSending(true);
    setSendError("");
    setCode("");
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]); // remove data:...;base64, prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/clipboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "file",
          fileName: file.name,
          fileType: file.type,
          fileData: base64,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setSendError(data.error); return; }
      setCode(data.code);
    } catch { setSendError("Failed to upload file."); }
    finally { setSending(false); }
  };

  const handleReceive = async () => {
    if (inputCode.length !== 4) return;
    setReceiving(true);
    setReceiveError("");
    setReceivedText("");
    setReceivedFile(null);
    try {
      const res = await fetch(`/api/clipboard?code=${inputCode}`);
      const data = await res.json();
      if (!res.ok) { setReceiveError(data.error); return; }
      if (data.type === "file") {
        setReceivedFile({ name: data.fileName, type: data.fileType, data: data.fileData, size: data.fileSize });
      } else {
        setReceivedText(data.text);
      }
    } catch { setReceiveError("Network error."); }
    finally { setReceiving(false); }
  };

  const downloadReceivedFile = () => {
    if (!receivedFile) return;
    const byteChars = atob(receivedFile.data);
    const byteNums = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
    const blob = new Blob([new Uint8Array(byteNums)], { type: receivedFile.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = receivedFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyText = (txt: string) => {
    const el = document.createElement("textarea");
    el.value = txt;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/clipboard-share`} />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <a href="/" className="text-[var(--primary)] hover:underline text-sm mb-4 inline-block">← All Tools</a>

        <h1 className="text-3xl font-extrabold mb-2" style={{ color: "var(--foreground)" }}>
          Online Clipboard — Share Text & Files
        </h1>
        <p style={{ color: "var(--muted)" }} className="mb-2">
          Share text, PDFs, images, documents between devices with a 4-digit code. No signup needed.
        </p>
        <div className="flex gap-3 text-xs mb-6" style={{ color: "var(--muted)" }}>
          <span>📝 Text: up to 500K chars</span>
          <span>📁 Files: up to {MAX_FILE_MB}MB</span>
          <span>⏱️ Expires: 10 min</span>
        </div>

        <div className="ad-placeholder mb-6">Ad Space</div>

        {/* Main Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("send")}
            className={`flex-1 py-3.5 rounded-xl font-semibold transition-all ${
              activeTab === "send" ? "bg-[var(--primary)] text-white shadow-lg" : "bg-[var(--muted-bg)]"
            }`}
            style={activeTab !== "send" ? { color: "var(--foreground)" } : {}}
          >
            📤 Send
          </button>
          <button
            onClick={() => setActiveTab("receive")}
            className={`flex-1 py-3.5 rounded-xl font-semibold transition-all ${
              activeTab === "receive" ? "bg-[var(--primary)] text-white shadow-lg" : "bg-[var(--muted-bg)]"
            }`}
            style={activeTab !== "receive" ? { color: "var(--foreground)" } : {}}
          >
            📥 Receive
          </button>
        </div>

        {/* SEND Tab */}
        {activeTab === "send" && (
          <div className="tool-card">
            {/* Text / File toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSendMode("text")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  sendMode === "text" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "border-[var(--card-border)]"
                }`}
                style={sendMode !== "text" ? { color: "var(--foreground)" } : {}}
              >
                📝 Text
              </button>
              <button
                onClick={() => setSendMode("file")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  sendMode === "file" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "border-[var(--card-border)]"
                }`}
                style={sendMode !== "file" ? { color: "var(--foreground)" } : {}}
              >
                📁 File (PDF, Image, Doc)
              </button>
            </div>

            {sendMode === "text" ? (
              <>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  className="input-field mb-2 resize-y"
                  placeholder="Paste text, code, links, or notes..."
                  maxLength={MAX_TEXT}
                  style={{ background: "var(--card)", color: "var(--foreground)", borderColor: "var(--card-border)" }}
                />
                <div className="flex justify-between text-xs mb-3" style={{ color: "var(--muted)" }}>
                  <span>{text.length.toLocaleString()} / {MAX_TEXT.toLocaleString()} characters</span>
                  <span>{text.length > MAX_TEXT * 0.9 ? "⚠️ Near limit" : ""}</span>
                </div>
                <button onClick={handleSendText} disabled={!text.trim() || sending} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                  {sending ? "Sending..." : "📤 Send & Get Code"}
                </button>
              </>
            ) : (
              <>
                <div
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-[var(--primary)]"
                  style={{ borderColor: "var(--card-border)" }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--primary)"; }}
                  onDragLeave={(e) => { e.currentTarget.style.borderColor = "var(--card-border)"; }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = "var(--card-border)";
                    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.webp,.svg,.zip,.csv,.xlsx,.pptx,.mp3,.mp4"
                    onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }}
                  />
                  {file ? (
                    <div>
                      <p className="text-3xl mb-2">{file.type.includes("pdf") ? "📄" : file.type.includes("image") ? "🖼️" : "📁"}</p>
                      <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{file.name}</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>{formatSize(file.size)}</p>
                      {file.size > MAX_FILE_MB * 1024 * 1024 && (
                        <p className="text-red-500 text-xs mt-1">⚠️ File exceeds {MAX_FILE_MB}MB limit</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-4xl mb-2">📂</p>
                      <p className="font-medium text-sm" style={{ color: "var(--foreground)" }}>Click or drag & drop a file</p>
                      <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>PDF, Images, Docs, ZIP — max {MAX_FILE_MB}MB</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSendFile}
                  disabled={!file || sending || (file && file.size > MAX_FILE_MB * 1024 * 1024)}
                  className="btn-primary w-full py-3 mt-3 flex items-center justify-center gap-2"
                >
                  {sending ? "Uploading..." : "📤 Upload & Get Code"}
                </button>
              </>
            )}

            {sendError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm mt-3">{sendError}</div>
            )}

            {/* Code Display */}
            {code && (
              <div className="text-center p-6 rounded-2xl mt-4" style={{ background: "var(--primary-light)", border: "2px solid var(--primary)" }}>
                <p className="text-sm font-medium mb-2" style={{ color: "var(--muted)" }}>Your 4-digit code:</p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  {code.split("").map((digit, i) => (
                    <span key={i} className="text-4xl font-mono font-black w-16 h-16 flex items-center justify-center rounded-xl"
                      style={{ background: "var(--card)", color: "var(--primary)", border: "2px solid var(--card-border)" }}>
                      {digit}
                    </span>
                  ))}
                </div>
                <button onClick={() => copyText(code)} className="btn-primary text-sm">
                  {copied ? "✅ Copied!" : "📋 Copy Code"}
                </button>
                <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>Share this code. Expires in 10 minutes.</p>
              </div>
            )}
          </div>
        )}

        {/* RECEIVE Tab */}
        {activeTab === "receive" && (
          <div className="tool-card">
            <h2 className="font-bold text-lg mb-4" style={{ color: "var(--foreground)" }}>Enter 4-digit code</h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={inputCode[i] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    const arr = inputCode.split("");
                    arr[i] = val;
                    setInputCode(arr.join("").slice(0, 4));
                    if (val && i < 3) {
                      const next = e.target.parentElement?.children[i + 1] as HTMLInputElement;
                      next?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !inputCode[i] && i > 0) {
                      const prev = (e.target as HTMLElement).parentElement?.children[i - 1] as HTMLInputElement;
                      prev?.focus();
                    }
                    if (e.key === "Enter" && inputCode.length === 4) handleReceive();
                  }}
                  className="w-16 h-16 text-center text-3xl font-mono font-bold rounded-xl border-2 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all"
                  style={{ background: "var(--card)", color: "var(--foreground)", borderColor: "var(--card-border)" }}
                />
              ))}
            </div>

            <button onClick={handleReceive} disabled={inputCode.length !== 4 || receiving}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {receiving ? "Retrieving..." : "📥 Retrieve"}
            </button>

            {receiveError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm mt-4">{receiveError}</div>
            )}

            {/* Received Text */}
            {receivedText && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>📝 Retrieved Text:</h3>
                  <button onClick={() => copyText(receivedText)} className="btn-primary text-sm py-1 px-3">
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="p-4 rounded-xl text-sm font-mono whitespace-pre-wrap break-all max-h-80 overflow-y-auto"
                  style={{ background: "var(--muted-bg)", color: "var(--foreground)", border: "1px solid var(--card-border)" }}>
                  {receivedText}
                </div>
              </div>
            )}

            {/* Received File */}
            {receivedFile && (
              <div className="mt-4 p-5 rounded-xl text-center" style={{ background: "var(--primary-light)", border: "1px solid var(--card-border)" }}>
                <p className="text-4xl mb-2">
                  {receivedFile.type.includes("pdf") ? "📄" : receivedFile.type.includes("image") ? "🖼️" : "📁"}
                </p>
                <p className="font-bold" style={{ color: "var(--foreground)" }}>{receivedFile.name}</p>
                <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>{formatSize(receivedFile.size)}</p>

                {/* Preview for images */}
                {receivedFile.type.startsWith("image/") && (
                  <img
                    src={`data:${receivedFile.type};base64,${receivedFile.data}`}
                    alt={receivedFile.name}
                    className="max-w-full max-h-60 mx-auto rounded-lg mb-3 border"
                    style={{ borderColor: "var(--card-border)" }}
                  />
                )}

                <button onClick={downloadReceivedFile} className="btn-primary py-2.5 px-6">
                  ⬇️ Download {receivedFile.name}
                </button>
              </div>
            )}
          </div>
        )}

        {/* How It Works */}
        <div className="tool-card mt-6">
          <h2 className="font-bold text-lg mb-4" style={{ color: "var(--foreground)" }}>How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl mb-2">📝</div>
              <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>1. Paste or Upload</h3>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Text, PDF, images, docs — anything up to {MAX_FILE_MB}MB</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔢</div>
              <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>2. Get 4-Digit Code</h3>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Share the code with anyone</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>3. Retrieve & Download</h3>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Enter code on any device to get it</p>
            </div>
          </div>
        </div>

        {/* Limits Info */}
        <div className="tool-card mt-4">
          <h3 className="font-bold mb-3" style={{ color: "var(--foreground)" }}>Limits</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--muted-bg)" }}>
                  <th className="text-left px-3 py-2 font-semibold" style={{ borderColor: "var(--card-border)", borderBottom: "1px solid" }}>Feature</th>
                  <th className="text-left px-3 py-2 font-semibold" style={{ borderColor: "var(--card-border)", borderBottom: "1px solid" }}>Limit</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                <tr><td className="px-3 py-2 border-b" style={{ borderColor: "var(--card-border)" }}>Text</td><td className="px-3 py-2 border-b" style={{ borderColor: "var(--card-border)" }}>500,000 characters (~500KB)</td></tr>
                <tr><td className="px-3 py-2 border-b" style={{ borderColor: "var(--card-border)" }}>Files</td><td className="px-3 py-2 border-b" style={{ borderColor: "var(--card-border)" }}>{MAX_FILE_MB}MB per file</td></tr>
                <tr><td className="px-3 py-2 border-b" style={{ borderColor: "var(--card-border)" }}>Supported Files</td><td className="px-3 py-2 border-b" style={{ borderColor: "var(--card-border)" }}>PDF, PNG, JPG, DOC, XLSX, ZIP, MP3, etc.</td></tr>
                <tr><td className="px-3 py-2 border-b" style={{ borderColor: "var(--card-border)" }}>Expiry</td><td className="px-3 py-2 border-b" style={{ borderColor: "var(--card-border)" }}>10 minutes (auto-deleted)</td></tr>
                <tr><td className="px-3 py-2">Codes</td><td className="px-3 py-2">4-digit number (1000-9999)</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder my-6">Ad Space</div>

        <div className="seo-content tool-card">
          <h2>Free Online Clipboard — Share Text & Files Between Devices</h2>
          <p>
            Need to quickly send a file or text from your phone to your laptop? Our Online Clipboard tool
            lets you share anything between devices using a simple 4-digit code. No app, no signup, no email needed.
          </p>
          <h3>What Can You Share?</h3>
          <ul>
            <li><strong>Text</strong> — code snippets, URLs, passwords, notes (up to 500K characters)</li>
            <li><strong>PDF Documents</strong> — share PDFs instantly between phone and computer</li>
            <li><strong>Images</strong> — PNG, JPG, WebP, GIF (up to {MAX_FILE_MB}MB)</li>
            <li><strong>Documents</strong> — Word, Excel, PowerPoint files</li>
            <li><strong>Other Files</strong> — ZIP, CSV, TXT, MP3 and more</li>
          </ul>
          <h3>Privacy & Security</h3>
          <p>
            All shared content is stored temporarily in memory and automatically deleted after 10 minutes.
            Nothing is saved to disk or logged. For sensitive files, we recommend encrypted transfer services.
          </p>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "WebApplication",
          name: META.title, description: META.description,
          url: `${SITE_URL}/tools/clipboard-share`,
          applicationCategory: "UtilityApplication", operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }) }} />
      </div>
    </>
  );
}
