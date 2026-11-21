"use client";

import { useState, useCallback, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "MD5 & SHA Hash Generator - Generate Hashes Online Free",
  description:
    "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes online for free. Hash text or files using the Web Crypto API. Copy any hash instantly.",
  keywords: "md5 hash generator, sha256 generator, hash generator online, sha1 hash, sha512, file hash, checksum generator",
};

// Inline MD5 implementation (Web Crypto API does not support MD5)
function md5(input: string): string {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  function bitRotateLeft(num: number, cnt: number) {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function binlMD5(x: number[], len: number) {
    x[len >> 5] |= 0x80 << len % 32;
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (let i = 0; i < x.length; i += 16) {
      const olda = a, oldb = b, oldc = c, oldd = d;
      a = md5ff(a, b, c, d, x[i], 7, -680876936); d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819); b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897); d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341); b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416); d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063); b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682); d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290); b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510); d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713); b = md5gg(b, c, d, a, x[i], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691); d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335); b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438); d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961); b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467); d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473); b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = md5hh(a, b, c, d, x[i + 5], 4, -378558); d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562); b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060); d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632); b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174); d = md5hh(d, a, b, c, x[i + 0], 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979); b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487); d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520); b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = md5ii(a, b, c, d, x[i], 6, -198630844); d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905); b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571); d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523); b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359); d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380); b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070); d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259); b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = safeAdd(a, olda); b = safeAdd(b, oldb); c = safeAdd(c, oldc); d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }

  function str2binl(str: string) {
    const bin: number[] = [];
    const mask = (1 << 8) - 1;
    for (let i = 0; i < str.length * 8; i += 8) {
      bin[i >> 5] |= (str.charCodeAt(i / 8) & mask) << i % 32;
    }
    return bin;
  }

  function binl2hex(binarray: number[]) {
    const hexTab = "0123456789abcdef";
    let str = "";
    for (let i = 0; i < binarray.length * 4; i++) {
      str += hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xf) +
        hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xf);
    }
    return str;
  }

  // Encode string to UTF-8 for consistent hashing
  const utf8Str = unescape(encodeURIComponent(input));
  return binl2hex(binlMD5(str2binl(utf8Str), utf8Str.length * 8));
}

function md5Bytes(bytes: Uint8Array): string {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  function bitRotateLeft(num: number, cnt: number) {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & c) | (~b & d), a, b, x, s, t); }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t); }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(c ^ (b | ~d), a, b, x, s, t); }

  function binlMD5(x: number[], len: number) {
    x[len >> 5] |= 0x80 << len % 32;
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (let i = 0; i < x.length; i += 16) {
      const olda = a, oldb = b, oldc = c, oldd = d;
      a = md5ff(a,b,c,d,x[i],7,-680876936);d = md5ff(d,a,b,c,x[i+1],12,-389564586);c = md5ff(c,d,a,b,x[i+2],17,606105819);b = md5ff(b,c,d,a,x[i+3],22,-1044525330);
      a = md5ff(a,b,c,d,x[i+4],7,-176418897);d = md5ff(d,a,b,c,x[i+5],12,1200080426);c = md5ff(c,d,a,b,x[i+6],17,-1473231341);b = md5ff(b,c,d,a,x[i+7],22,-45705983);
      a = md5ff(a,b,c,d,x[i+8],7,1770035416);d = md5ff(d,a,b,c,x[i+9],12,-1958414417);c = md5ff(c,d,a,b,x[i+10],17,-42063);b = md5ff(b,c,d,a,x[i+11],22,-1990404162);
      a = md5ff(a,b,c,d,x[i+12],7,1804603682);d = md5ff(d,a,b,c,x[i+13],12,-40341101);c = md5ff(c,d,a,b,x[i+14],17,-1502002290);b = md5ff(b,c,d,a,x[i+15],22,1236535329);
      a = md5gg(a,b,c,d,x[i+1],5,-165796510);d = md5gg(d,a,b,c,x[i+6],9,-1069501632);c = md5gg(c,d,a,b,x[i+11],14,643717713);b = md5gg(b,c,d,a,x[i],20,-373897302);
      a = md5gg(a,b,c,d,x[i+5],5,-701558691);d = md5gg(d,a,b,c,x[i+10],9,38016083);c = md5gg(c,d,a,b,x[i+15],14,-660478335);b = md5gg(b,c,d,a,x[i+4],20,-405537848);
      a = md5gg(a,b,c,d,x[i+9],5,568446438);d = md5gg(d,a,b,c,x[i+14],9,-1019803690);c = md5gg(c,d,a,b,x[i+3],14,-187363961);b = md5gg(b,c,d,a,x[i+8],20,1163531501);
      a = md5gg(a,b,c,d,x[i+13],5,-1444681467);d = md5gg(d,a,b,c,x[i+2],9,-51403784);c = md5gg(c,d,a,b,x[i+7],14,1735328473);b = md5gg(b,c,d,a,x[i+12],20,-1926607734);
      a = md5hh(a,b,c,d,x[i+5],4,-378558);d = md5hh(d,a,b,c,x[i+8],11,-2022574463);c = md5hh(c,d,a,b,x[i+11],16,1839030562);b = md5hh(b,c,d,a,x[i+14],23,-35309556);
      a = md5hh(a,b,c,d,x[i+1],4,-1530992060);d = md5hh(d,a,b,c,x[i+4],11,1272893353);c = md5hh(c,d,a,b,x[i+7],16,-155497632);b = md5hh(b,c,d,a,x[i+10],23,-1094730640);
      a = md5hh(a,b,c,d,x[i+13],4,681279174);d = md5hh(d,a,b,c,x[i],11,-358537222);c = md5hh(c,d,a,b,x[i+3],16,-722521979);b = md5hh(b,c,d,a,x[i+6],23,76029189);
      a = md5hh(a,b,c,d,x[i+9],4,-640364487);d = md5hh(d,a,b,c,x[i+12],11,-421815835);c = md5hh(c,d,a,b,x[i+15],16,530742520);b = md5hh(b,c,d,a,x[i+2],23,-995338651);
      a = md5ii(a,b,c,d,x[i],6,-198630844);d = md5ii(d,a,b,c,x[i+7],10,1126891415);c = md5ii(c,d,a,b,x[i+14],15,-1416354905);b = md5ii(b,c,d,a,x[i+5],21,-57434055);
      a = md5ii(a,b,c,d,x[i+12],6,1700485571);d = md5ii(d,a,b,c,x[i+3],10,-1894986606);c = md5ii(c,d,a,b,x[i+10],15,-1051523);b = md5ii(b,c,d,a,x[i+1],21,-2054922799);
      a = md5ii(a,b,c,d,x[i+8],6,1873313359);d = md5ii(d,a,b,c,x[i+15],10,-30611744);c = md5ii(c,d,a,b,x[i+6],15,-1560198380);b = md5ii(b,c,d,a,x[i+13],21,1309151649);
      a = md5ii(a,b,c,d,x[i+4],6,-145523070);d = md5ii(d,a,b,c,x[i+11],10,-1120210379);c = md5ii(c,d,a,b,x[i+2],15,718787259);b = md5ii(b,c,d,a,x[i+9],21,-343485551);
      a = safeAdd(a,olda);b = safeAdd(b,oldb);c = safeAdd(c,oldc);d = safeAdd(d,oldd);
    }
    return [a, b, c, d];
  }

  const bin: number[] = [];
  for (let i = 0; i < bytes.length * 8; i += 8) {
    bin[i >> 5] |= (bytes[i / 8] & 0xff) << i % 32;
  }
  const result = binlMD5(bin, bytes.length * 8);
  const hexTab = "0123456789abcdef";
  let str = "";
  for (let i = 0; i < result.length * 4; i++) {
    str += hexTab.charAt((result[i >> 2] >> ((i % 4) * 8 + 4)) & 0xf) +
      hexTab.charAt((result[i >> 2] >> ((i % 4) * 8)) & 0xf);
  }
  return str;
}

async function sha(algo: string, data: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface Hashes {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

export default function MD5HashGeneratorPage() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Hashes | null>(null);
  const [mode, setMode] = useState<"text" | "file">("text");
  const [fileName, setFileName] = useState("");
  const [computing, setComputing] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const hashText = useCallback(async () => {
    if (!input.trim()) return;
    setComputing(true);
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const [sha1, sha256, sha512] = await Promise.all([
        sha("SHA-1", data.buffer as ArrayBuffer),
        sha("SHA-256", data.buffer as ArrayBuffer),
        sha("SHA-512", data.buffer as ArrayBuffer),
      ]);
      setHashes({ md5: md5(input), sha1, sha256, sha512 });
    } finally {
      setComputing(false);
    }
  }, [input]);

  async function hashFile(file: File) {
    setComputing(true);
    setFileName(file.name);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const [sha1, sha256, sha512] = await Promise.all([
        sha("SHA-1", buffer),
        sha("SHA-256", buffer),
        sha("SHA-512", buffer),
      ]);
      setHashes({ md5: md5Bytes(bytes), sha1, sha256, sha512 });
    } finally {
      setComputing(false);
    }
  }

  function copyHash(name: string, value: string) {
    navigator.clipboard.writeText(value);
    setCopiedHash(name);
    setTimeout(() => setCopiedHash(null), 2000);
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/md5-hash-generator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="/tools/md5-hash-generator" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">MD5 &amp; SHA Hash Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files. All hashing happens in your browser.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode("text"); setHashes(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "text" ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
            }`}
          >
            Text Input
          </button>
          <button
            onClick={() => { setMode("file"); setHashes(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "file" ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
            }`}
          >
            File Input
          </button>
        </div>

        <div className="tool-card mb-8">
          {mode === "text" ? (
            <>
              <label className="block text-sm font-medium mb-2">Text to Hash</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to generate hashes..."
                rows={6}
                className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono mb-4"
              />
              <button onClick={hashText} disabled={computing} className="btn-primary w-full">
                {computing ? "Computing..." : "Generate Hashes"}
              </button>
            </>
          ) : (
            <>
              <label className="block text-sm font-medium mb-2">Upload File</label>
              <div
                className="border-2 border-dashed border-[var(--card-border)] rounded-lg p-8 text-center cursor-pointer hover:border-[var(--primary)] transition-colors mb-4"
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) hashFile(file);
                  }}
                />
                <p className="text-sm text-[var(--muted)]">
                  {fileName ? `Selected: ${fileName}` : "Click to select a file or drag & drop"}
                </p>
              </div>
            </>
          )}
        </div>

        {hashes && (
          <div className="result-card mb-8">
            <h3 className="text-sm font-semibold mb-4">Hash Results</h3>
            <div className="space-y-4">
              {(["md5", "sha1", "sha256", "sha512"] as const).map((algo) => (
                <div key={algo}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[var(--muted)]">
                      {algo === "md5" ? "MD5" : algo === "sha1" ? "SHA-1" : algo === "sha256" ? "SHA-256" : "SHA-512"}
                    </span>
                    <button
                      onClick={() => copyHash(algo, hashes[algo])}
                      className="text-xs text-[var(--primary)]"
                    >
                      {copiedHash === algo ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="bg-gray-50 border border-[var(--card-border)] rounded-lg px-3 py-2 text-xs font-mono break-all">
                    {hashes[algo]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is a Hash Function?</h2>
          <p>
            A cryptographic hash function takes an input (text, file, or data) and produces a
            fixed-size string of characters called a hash, digest, or checksum. Hash functions are
            one-way operations — it is computationally infeasible to reverse a hash back to the
            original input. Even a tiny change in the input produces a completely different hash
            (the avalanche effect). Hash functions are fundamental to data integrity verification,
            password storage, digital signatures, and blockchain technology.
          </p>

          <h2>Hash Algorithms Explained</h2>
          <p>
            <strong>MD5</strong> (Message Digest 5) produces a 128-bit (32-character hex) hash. While
            MD5 is no longer considered secure for cryptographic purposes due to known collision
            vulnerabilities, it remains widely used for checksums and non-security data integrity
            verification. MD5 is fast and produces compact hashes.
          </p>
          <p>
            <strong>SHA-1</strong> (Secure Hash Algorithm 1) produces a 160-bit (40-character hex) hash.
            SHA-1 was widely used in SSL certificates and Git version control. Like MD5, it has known
            collision attacks and is being phased out for security-sensitive applications, but remains
            useful for non-cryptographic integrity checks.
          </p>
          <p>
            <strong>SHA-256</strong> is part of the SHA-2 family and produces a 256-bit (64-character hex)
            hash. It is currently the gold standard for secure hashing, used in TLS/SSL, Bitcoin
            mining, file integrity verification, and digital certificates. SHA-256 has no known
            practical attacks and is recommended for security-sensitive applications.
          </p>
          <p>
            <strong>SHA-512</strong> produces a 512-bit (128-character hex) hash. It offers a larger
            output size than SHA-256 and can be faster on 64-bit systems. SHA-512 is used when
            maximum security margin is desired, such as in government and military applications.
          </p>

          <h2>Text vs File Hashing</h2>
          <p>
            Text mode encodes the input as UTF-8 before hashing, which is the standard encoding for
            web applications. File mode reads the raw binary data of the file and computes hashes
            directly on the bytes. File hashing is commonly used to verify download integrity — you
            can compare the hash of a downloaded file against the publisher&apos;s checksum to ensure
            the file was not corrupted or tampered with during transfer.
          </p>

          <h2>Common Use Cases</h2>
          <ul>
            <li>Verify file download integrity with checksums</li>
            <li>Compare files to detect changes or duplicates</li>
            <li>Generate hash values for password storage implementations</li>
            <li>Create content-based identifiers for caching systems</li>
            <li>Verify data integrity in backup and transfer operations</li>
            <li>Digital forensics and evidence verification</li>
          </ul>

          <h2>Privacy and Security</h2>
          <p>
            All hashing is performed locally in your browser. SHA-1, SHA-256, and SHA-512 use the
            Web Crypto API (<code>crypto.subtle.digest</code>), while MD5 uses a client-side
            JavaScript implementation. No data — text or files — is ever sent to any server. Your
            input remains completely private.
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
            name: "MD5 & SHA Hash Generator",
            description: META.description,
            url: `${SITE_URL}/tools/md5-hash-generator`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
