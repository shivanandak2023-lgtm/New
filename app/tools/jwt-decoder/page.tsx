"use client";

import { useState, useEffect, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "JWT Decoder - Decode JWT Tokens Online Free",
  description:
    "Decode JWT (JSON Web Tokens) online for free. View header, payload, and signature. Check expiry status, issued-at time, issuer, and subject claims.",
  keywords: "jwt decoder, jwt token decoder, decode jwt online, json web token, jwt parser, jwt viewer, jwt debugger",
};

interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

function decodeJWT(token: string): { decoded: DecodedJWT | null; error: string } {
  try {
    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      return { decoded: null, error: "Invalid JWT: must have exactly 3 parts separated by dots." };
    }

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2];

    return { decoded: { header, payload, signature }, error: "" };
  } catch {
    return { decoded: null, error: "Failed to decode JWT. Check that the token is valid." };
  }
}

function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleString();
}

function timeRemaining(expUnix: number, nowMs: number): string {
  const diff = expUnix * 1000 - nowMs;
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h remaining`;
  }
  return `${hours}h ${minutes}m ${seconds}s remaining`;
}

export default function JWTDecoderPage() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [error, setError] = useState("");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const decode = useCallback(() => {
    if (!input.trim()) return;
    const result = decodeJWT(input);
    setDecoded(result.decoded);
    setError(result.error);
  }, [input]);

  function copySection(label: string, content: string) {
    navigator.clipboard.writeText(content);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  }

  const exp = decoded?.payload?.exp as number | undefined;
  const iat = decoded?.payload?.iat as number | undefined;
  const iss = decoded?.payload?.iss as string | undefined;
  const sub = decoded?.payload?.sub as string | undefined;
  const isExpired = exp && now > 0 ? exp * 1000 < now : false;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/jwt-decoder`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="/tools/jwt-decoder" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">JWT Decoder</h1>
        <p className="text-[var(--muted)] mb-8">
          Paste a JSON Web Token to decode and inspect its header, payload, and signature.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <label className="block text-sm font-medium mb-2">JWT Token</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            rows={5}
            className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm font-mono mb-4"
          />
          <button onClick={decode} className="btn-primary w-full">
            Decode JWT
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {decoded && (
          <>
            {/* Claims summary */}
            <div className="result-card mb-6">
              <h3 className="text-sm font-semibold mb-3">Token Claims</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {iss !== undefined && (
                  <div>
                    <span className="text-[var(--muted)]">Issuer (iss):</span>{" "}
                    <span className="font-mono">{iss}</span>
                  </div>
                )}
                {sub !== undefined && (
                  <div>
                    <span className="text-[var(--muted)]">Subject (sub):</span>{" "}
                    <span className="font-mono">{sub}</span>
                  </div>
                )}
                {iat !== undefined && (
                  <div>
                    <span className="text-[var(--muted)]">Issued At (iat):</span>{" "}
                    <span className="font-mono">{formatTimestamp(iat)}</span>
                  </div>
                )}
                {exp !== undefined && now > 0 && (
                  <div>
                    <span className="text-[var(--muted)]">Expires (exp):</span>{" "}
                    <span className="font-mono">{formatTimestamp(exp)}</span>
                  </div>
                )}
              </div>
              {exp !== undefined && now > 0 && (
                <div className={`mt-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isExpired
                    ? "bg-red-50 border border-red-200 text-red-700"
                    : "bg-green-50 border border-green-200 text-green-700"
                }`}>
                  {isExpired ? "Token is EXPIRED" : `Token is VALID — ${timeRemaining(exp, now)}`}
                </div>
              )}
            </div>

            {/* Header */}
            <div className="result-card mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">Header</h3>
                <button
                  onClick={() => copySection("header", JSON.stringify(decoded.header, null, 2))}
                  className="text-xs text-[var(--primary)]"
                >
                  {copiedSection === "header" ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="bg-gray-50 border border-[var(--card-border)] rounded-lg p-3 text-xs font-mono overflow-x-auto whitespace-pre">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="result-card mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">Payload</h3>
                <button
                  onClick={() => copySection("payload", JSON.stringify(decoded.payload, null, 2))}
                  className="text-xs text-[var(--primary)]"
                >
                  {copiedSection === "payload" ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="bg-gray-50 border border-[var(--card-border)] rounded-lg p-3 text-xs font-mono overflow-x-auto whitespace-pre">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>

            {/* Signature */}
            <div className="result-card mb-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">Signature</h3>
                <button
                  onClick={() => copySection("signature", decoded.signature)}
                  className="text-xs text-[var(--primary)]"
                >
                  {copiedSection === "signature" ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="bg-gray-50 border border-[var(--card-border)] rounded-lg p-3 text-xs font-mono overflow-x-auto whitespace-pre break-all">
                {decoded.signature}
              </pre>
            </div>
          </>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is a JWT (JSON Web Token)?</h2>
          <p>
            A JSON Web Token (JWT) is a compact, URL-safe token format defined by RFC 7519. JWTs are
            widely used for authentication and authorization in modern web applications. A JWT consists
            of three Base64Url-encoded parts separated by dots: the <strong>header</strong>, the
            <strong>payload</strong>, and the <strong>signature</strong>. The header typically contains
            the signing algorithm (e.g., HS256, RS256) and the token type. The payload contains claims
            — statements about the user and additional metadata. The signature ensures the token has
            not been tampered with.
          </p>

          <h2>How JWT Decoding Works</h2>
          <p>
            This tool splits the JWT at the dot separators and Base64Url-decodes the header and payload
            portions. The decoded JSON is then formatted for readability. Note that decoding is different
            from <em>verifying</em> — anyone can decode a JWT to read its contents, but only the party
            holding the secret key or private key can verify the signature. This tool performs decoding
            only; it does not verify signatures.
          </p>

          <h2>Standard JWT Claims</h2>
          <p>
            JWTs support several registered claims defined in the specification: <code>iss</code> (issuer)
            identifies who created the token, <code>sub</code> (subject) identifies the principal,
            <code>aud</code> (audience) identifies the recipients, <code>exp</code> (expiration time)
            sets when the token expires, <code>nbf</code> (not before) sets when the token becomes valid,
            <code>iat</code> (issued at) records when the token was created, and <code>jti</code> (JWT ID)
            provides a unique identifier. This decoder automatically extracts and displays these claims
            with human-readable timestamps.
          </p>

          <h2>Expiry Status and Time Remaining</h2>
          <p>
            When a JWT contains an <code>exp</code> claim, this tool shows whether the token is currently
            valid or expired, along with a live countdown of the time remaining. This is especially useful
            for debugging authentication issues — you can quickly determine whether a 401 error is caused
            by an expired token. The expiry check updates every second in your browser.
          </p>

          <h2>Common Use Cases for JWT Decoding</h2>
          <ul>
            <li>Debug authentication failures by inspecting token claims</li>
            <li>Verify that tokens contain the expected user information</li>
            <li>Check token expiration during development and testing</li>
            <li>Inspect issuer and audience claims for OAuth/OIDC flows</li>
            <li>Analyze tokens from API responses during integration work</li>
          </ul>

          <h2>Security Considerations</h2>
          <p>
            JWTs should never contain sensitive information like passwords or credit card numbers, since
            the payload is only Base64-encoded and not encrypted. Always use HTTPS when transmitting JWTs.
            For sensitive data, consider using JWE (JSON Web Encryption) instead of plain JWTs. This
            decoder runs entirely in your browser — no tokens are sent to any server, ensuring your
            authentication tokens remain private.
          </p>

          <h2>Privacy</h2>
          <p>
            All decoding happens locally in your browser. Your JWT tokens are never sent to any server,
            stored, or logged. This tool is safe for inspecting production tokens during debugging.
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
            name: "JWT Decoder",
            description: META.description,
            url: `${SITE_URL}/tools/jwt-decoder`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
