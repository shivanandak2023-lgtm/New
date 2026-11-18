interface FAQ {
  question: string;
  answer: string;
}

interface ToolFAQProps {
  faqs: FAQ[];
}

export default function ToolFAQ({ faqs }: ToolFAQProps) {
  if (faqs.length === 0) return null;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="my-10">
      <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <details key={index} className="tool-card group">
            <summary className="cursor-pointer font-semibold text-[var(--foreground)] list-none flex items-center justify-between">
              {faq.question}
              <span className="text-[var(--muted)] text-xl group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <p className="mt-3 text-[var(--muted)] leading-relaxed">{faq.answer}</p>
          </details>
        ))}
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
    </section>
  );
}
