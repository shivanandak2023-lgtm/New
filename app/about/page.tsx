"use client";

import { SITE_NAME, SITE_URL, TOOLS, CATEGORIES } from "@/lib/constants";

export default function AboutPage() {
  return (
    <>
      <head>
        <title>About {SITE_NAME} - Free Online Calculators & Tools</title>
        <meta
          name="description"
          content={`Learn about ${SITE_NAME}, a free collection of ${TOOLS.length}+ online calculators and tools for finance, math, health, and development.`}
        />
        <link rel="canonical" href={`${SITE_URL}/about`} />
      </head>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold mb-4">About {SITE_NAME}</h1>

        <div className="tool-card mb-8">
          <p className="text-[var(--muted)] leading-relaxed mb-4">
            {SITE_NAME} is a free, open collection of {TOOLS.length}+ online calculators and utility tools designed to
            help you with everyday tasks. From calculating your loan EMI and GST to generating QR codes and compressing
            images, we have a tool for everything.
          </p>

          <p className="text-[var(--muted)] leading-relaxed mb-4">
            All tools run entirely in your browser. We do not store, process, or transmit any of your data to
            external servers. Your privacy and security are our top priorities.
          </p>

          <p className="text-[var(--muted)] leading-relaxed">
            {SITE_NAME} is free to use and requires no signup or account creation. Just open a tool and start using it
            immediately on any device.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-4">Our Tools</h2>
        <div className="tool-card mb-8">
          <p className="text-[var(--muted)] leading-relaxed mb-4">
            We offer tools across {CATEGORIES.length} categories:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const catTools = TOOLS.filter((t) => t.category === cat.slug);
              return (
                <div key={cat.slug} className="p-3 rounded-lg bg-[var(--muted-bg)]">
                  <h3 className="font-semibold flex items-center gap-2 mb-1">
                    <span>{cat.icon}</span> {cat.name}
                  </h3>
                  <p className="text-sm text-[var(--muted)]">
                    {catTools.map((t) => t.name).join(", ")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Why {SITE_NAME}?</h2>
        <div className="tool-card mb-8">
          <ul className="space-y-3">
            {[
              { title: "100% Free", desc: "All tools are free to use, forever. No hidden charges." },
              { title: "No Signup Required", desc: "Just open a tool and start using it. No account needed." },
              { title: "Privacy First", desc: "All processing happens in your browser. We never collect your data." },
              { title: "Mobile Friendly", desc: "All tools are responsive and work great on phones and tablets." },
              { title: "Fast & Lightweight", desc: "Built with modern web technology for instant results." },
              { title: "Accurate Results", desc: "Our tools use verified formulas and algorithms for reliable calculations." },
            ].map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="text-[var(--primary)] mt-0.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p className="text-sm text-[var(--muted)]">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">Contact</h2>
        <div className="tool-card">
          <p className="text-[var(--muted)] leading-relaxed">
            Have a suggestion, found a bug, or want to request a new tool? We would love to hear from you. Reach out to
            us and we will get back to you as soon as possible.
          </p>
        </div>
      </div>
    </>
  );
}
