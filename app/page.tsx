"use client";

import { useState } from "react";
import { TOOLS, CATEGORIES, SITE_NAME } from "@/lib/constants";

export default function HomePage() {
  const [search, setSearch] = useState("");

  const filteredTools = search.trim()
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()))
      )
    : TOOLS;

  return (
    <>
      <section className="bg-gradient-to-b from-[var(--primary-light)] to-[var(--background)] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--foreground)] mb-4 leading-tight">
            Free Online Calculators &amp; Tools
          </h1>
          <p className="text-lg text-[var(--muted)] mb-8 max-w-2xl mx-auto">
            EMI Calculator, GST Calculator, QR Code Generator, Image Compressor, and 110+ free tools. No signup needed.
          </p>
          <div className="max-w-xl mx-auto relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search tools... (e.g., EMI, GST, QR Code)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-2 border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)] px-4 py-4 pl-14 text-base shadow-md outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all placeholder:text-[var(--muted)]"
              aria-label="Search tools"
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="ad-placeholder mb-8">Advertisement</div>
      </section>

      {!search.trim() && (
        <section className="max-w-6xl mx-auto px-4 pb-8">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all hover:shadow ${cat.color}`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 pb-12">
        {search.trim() ? (
          <>
            <h2 className="text-xl font-bold mb-4">
              {filteredTools.length} result{filteredTools.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
            {filteredTools.length === 0 && (
              <p className="text-center text-[var(--muted)] py-12">
                No tools found. Try a different search term.
              </p>
            )}
          </>
        ) : (
          CATEGORIES.map((cat) => {
            const catTools = TOOLS.filter((t) => t.category === cat.slug);
            if (catTools.length === 0) return null;
            return (
              <div key={cat.slug} id={cat.slug} className="mb-10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>{cat.icon}</span> {cat.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {catTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="ad-placeholder mb-8">Advertisement</div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: `Is ${SITE_NAME} free to use?`,
              a: `Yes! All tools on ${SITE_NAME} are completely free to use. No signup, no credit card, no hidden fees.`,
            },
            {
              q: "Is my data safe?",
              a: "Absolutely. All calculations and processing happen directly in your browser. We never send your data to any server.",
            },
            {
              q: "Do I need to create an account?",
              a: "No. You can use any tool immediately without creating an account or signing up.",
            },
            {
              q: "What tools are available?",
              a: `${SITE_NAME} offers ${TOOLS.length}+ free tools including EMI Calculator, GST Calculator, SIP Calculator, QR Code Generator, Image Compressor, JSON Formatter, Unit Converter, and more.`,
            },
            {
              q: "Can I use these tools on my phone?",
              a: "Yes, all tools are fully responsive and work great on mobile phones, tablets, and desktops.",
            },
          ].map((faq, i) => (
            <details key={i} className="tool-card group">
              <summary className="cursor-pointer font-semibold text-[var(--foreground)] list-none flex items-center justify-between">
                {faq.q}
                <span className="text-[var(--muted)] text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-[var(--muted)] leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: "https://calctools.vercel.app",
            description: "Free online calculators and tools for finance, math, health, development, and more.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://calctools.vercel.app/?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `Is ${SITE_NAME} free to use?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Yes! All tools on ${SITE_NAME} are completely free to use.`,
                },
              },
              {
                "@type": "Question",
                name: "Is my data safe?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "All calculations happen in your browser. We never send your data to any server.",
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}

function ToolCard({ tool }: { tool: (typeof TOOLS)[number] }) {
  return (
    <a href={`/tools/${tool.slug}`} className="tool-card flex flex-col gap-2 no-underline text-inherit">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{tool.icon}</span>
        <h3 className="font-semibold text-base">{tool.name}</h3>
      </div>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{tool.description}</p>
    </a>
  );
}
