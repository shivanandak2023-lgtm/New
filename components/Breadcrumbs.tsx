import { SITE_URL } from "@/lib/constants";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaItems = items.map((item, index) => ({
    "@type": "ListItem" as const,
    position: index + 1,
    name: item.label,
    ...(item.href ? { item: item.href.startsWith("http") ? item.href : `${SITE_URL}${item.href}` } : {}),
  }));

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-1 text-sm text-[var(--muted)]">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
              {item.href ? (
                <a
                  href={item.href}
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-[var(--foreground)] font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: schemaItems,
          }),
        }}
      />
    </>
  );
}
