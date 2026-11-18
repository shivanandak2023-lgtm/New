import { TOOLS } from "@/lib/constants";

interface RelatedToolsProps {
  currentSlug: string;
  category: string;
}

export default function RelatedTools({ currentSlug, category }: RelatedToolsProps) {
  const sameCategoryTools = TOOLS.filter(
    (t) => t.category === category && t.slug !== currentSlug
  );

  const popularSlugs = [
    "emi-calculator",
    "gst-calculator",
    "qr-code-generator",
    "image-compressor",
    "percentage-calculator",
    "bmi-calculator",
    "sip-calculator",
    "password-generator",
  ];

  const popularTools = TOOLS.filter(
    (t) => popularSlugs.includes(t.slug) && t.slug !== currentSlug && t.category !== category
  );

  let related = sameCategoryTools.slice(0, 5);
  if (related.length < 4) {
    const needed = 5 - related.length;
    const filler = popularTools.filter(
      (t) => !related.some((r) => r.slug === t.slug)
    );
    related = [...related, ...filler.slice(0, needed)];
  }

  related = related.slice(0, 5);

  if (related.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-6">Related Tools You Might Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map((tool) => (
          <a
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="tool-card flex flex-col gap-2 no-underline text-inherit"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{tool.icon}</span>
              <h3 className="font-semibold text-base">{tool.name}</h3>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              {tool.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
