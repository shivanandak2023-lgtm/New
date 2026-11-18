import type { MetadataRoute } from "next";
import { SITE_URL, TOOLS } from "@/lib/constants";

const FINANCE_CATEGORY = "finance";

const BLOG_POSTS = [
  "how-to-calculate-emi",
  "compound-interest-formula",
  "how-to-calculate-percentage",
  "bmi-chart-men-women",
  "mortgage-rates-guide",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPagesCanonical = TOOLS.map((tool) => ({
    url: `${SITE_URL}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: tool.category === FINANCE_CATEGORY ? 0.9 : 0.8,
  }));

  const toolPagesRoot = TOOLS.map((tool) => ({
    url: `${SITE_URL}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: tool.category === FINANCE_CATEGORY ? 0.9 : 0.8,
  }));

  const blogPages = BLOG_POSTS.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...toolPagesCanonical,
    ...toolPagesRoot,
    ...blogPages,
  ];
}
