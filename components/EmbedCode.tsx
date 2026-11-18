"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/constants";

interface EmbedCodeProps {
  toolSlug: string;
  toolName: string;
}

export default function EmbedCode({ toolSlug, toolName }: EmbedCodeProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const embedUrl = `${SITE_URL}/tools/${toolSlug}`;
  const embedCode = `<iframe src="${embedUrl}" width="100%" height="500" frameborder="0" title="${toolName}" style="border:none;border-radius:8px;"></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = embedCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="my-8">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline cursor-pointer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        {open ? "Hide embed code" : "Embed this tool on your website"}
        <span
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          &#9662;
        </span>
      </button>

      {open && (
        <div className="mt-4 p-4 bg-[var(--muted-bg)] rounded-lg border border-[var(--card-border)]">
          <p className="text-sm text-[var(--muted)] mb-3">
            Copy the code below to embed <strong>{toolName}</strong> on your
            website or blog.
          </p>

          <div className="relative">
            <pre className="bg-[var(--card)] p-3 rounded-md text-xs overflow-x-auto border border-[var(--card-border)] text-[var(--foreground)]">
              <code>{embedCode}</code>
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 px-3 py-1 text-xs font-medium rounded-md bg-[var(--primary)] text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <p className="text-xs text-[var(--muted)] mt-3 flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            Free to embed with attribution. The tool will automatically match
            your site&apos;s width.
          </p>
        </div>
      )}
    </section>
  );
}
