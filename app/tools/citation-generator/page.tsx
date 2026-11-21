"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Citation Generator - APA, MLA, Chicago Format Free",
  description:
    "Generate citations in APA 7th, MLA 9th, and Chicago 17th edition formats. Supports websites, books, journal articles, newspapers, and magazines. Build bibliographies.",
  keywords: "citation generator, apa citation generator, mla citation, chicago citation, bibliography maker, cite sources, reference generator",
};

type SourceType = "website" | "book" | "journal" | "newspaper" | "magazine";

interface Source {
  id: string;
  type: SourceType;
  authors: string;
  title: string;
  year: string;
  publisher: string;
  url: string;
  accessDate: string;
  journalName: string;
  volume: string;
  issue: string;
  pages: string;
  edition: string;
  city: string;
  websiteName: string;
  articleDate: string;
}

let srcId = 0;
function createEmptySource(): Source {
  return {
    id: "src" + (srcId++),
    type: "website",
    authors: "",
    title: "",
    year: "",
    publisher: "",
    url: "",
    accessDate: "",
    journalName: "",
    volume: "",
    issue: "",
    pages: "",
    edition: "",
    city: "",
    websiteName: "",
    articleDate: "",
  };
}

function parseAuthors(str: string): string[] {
  return str
    .split(/[,;&]/)
    .map((a) => a.trim())
    .filter(Boolean);
}

function lastFirst(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const last = parts[parts.length - 1];
  const first = parts.slice(0, -1).join(" ");
  return `${last}, ${first}`;
}

function lastInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const last = parts[parts.length - 1];
  const initials = parts
    .slice(0, -1)
    .map((p) => p.charAt(0).toUpperCase() + ".")
    .join(" ");
  return `${last}, ${initials}`;
}

function generateAPA(src: Source): string {
  const authors = parseAuthors(src.authors);
  let authorStr = "";
  if (authors.length === 1) {
    authorStr = lastInitials(authors[0]);
  } else if (authors.length === 2) {
    authorStr = `${lastInitials(authors[0])}, & ${lastInitials(authors[1])}`;
  } else if (authors.length > 2) {
    authorStr = authors
      .slice(0, -1)
      .map((a) => lastInitials(a))
      .join(", ") + `, & ${lastInitials(authors[authors.length - 1])}`;
  }

  const year = src.year ? `(${src.year})` : "(n.d.)";

  switch (src.type) {
    case "website":
      return `${authorStr}. ${year}. ${src.title}. ${src.websiteName ? `${src.websiteName}.` : ""}${src.url ? ` ${src.url}` : ""}`;
    case "book":
      return `${authorStr}. ${year}. *${src.title}*${src.edition ? ` (${src.edition} ed.)` : ""}. ${src.publisher}.`;
    case "journal":
      return `${authorStr}. ${year}. ${src.title}. *${src.journalName}*${src.volume ? `, *${src.volume}*` : ""}${src.issue ? `(${src.issue})` : ""}${src.pages ? `, ${src.pages}` : ""}.${src.url ? ` ${src.url}` : ""}`;
    case "newspaper":
      return `${authorStr}. ${year}${src.articleDate ? `, ${src.articleDate}` : ""}. ${src.title}. *${src.journalName}*${src.pages ? `, ${src.pages}` : ""}.${src.url ? ` ${src.url}` : ""}`;
    case "magazine":
      return `${authorStr}. ${year}${src.articleDate ? `, ${src.articleDate}` : ""}. ${src.title}. *${src.journalName}*${src.volume ? `, *${src.volume}*` : ""}${src.issue ? `(${src.issue})` : ""}${src.pages ? `, ${src.pages}` : ""}.${src.url ? ` ${src.url}` : ""}`;
    default:
      return "";
  }
}

function generateMLA(src: Source): string {
  const authors = parseAuthors(src.authors);
  let authorStr = "";
  if (authors.length === 1) {
    authorStr = lastFirst(authors[0]);
  } else if (authors.length === 2) {
    authorStr = `${lastFirst(authors[0])}, and ${authors[1]}`;
  } else if (authors.length > 2) {
    authorStr = `${lastFirst(authors[0])}, et al.`;
  }

  switch (src.type) {
    case "website":
      return `${authorStr}. "${src.title}." *${src.websiteName || ""}*${src.articleDate ? `, ${src.articleDate}` : src.year ? `, ${src.year}` : ""}.${src.url ? ` ${src.url}` : ""}${src.accessDate ? `. Accessed ${src.accessDate}` : ""}.`;
    case "book":
      return `${authorStr}. *${src.title}*.${src.edition ? ` ${src.edition} ed.,` : ""} ${src.publisher}${src.year ? `, ${src.year}` : ""}.`;
    case "journal":
      return `${authorStr}. "${src.title}." *${src.journalName}*${src.volume ? `, vol. ${src.volume}` : ""}${src.issue ? `, no. ${src.issue}` : ""}${src.year ? `, ${src.year}` : ""}${src.pages ? `, pp. ${src.pages}` : ""}.${src.url ? ` ${src.url}` : ""}`;
    case "newspaper":
      return `${authorStr}. "${src.title}." *${src.journalName}*${src.articleDate ? `, ${src.articleDate}` : src.year ? `, ${src.year}` : ""}${src.pages ? `, pp. ${src.pages}` : ""}.${src.url ? ` ${src.url}` : ""}`;
    case "magazine":
      return `${authorStr}. "${src.title}." *${src.journalName}*${src.articleDate ? `, ${src.articleDate}` : src.year ? `, ${src.year}` : ""}${src.pages ? `, pp. ${src.pages}` : ""}.${src.url ? ` ${src.url}` : ""}`;
    default:
      return "";
  }
}

function generateChicago(src: Source): string {
  const authors = parseAuthors(src.authors);
  let authorStr = "";
  if (authors.length === 1) {
    authorStr = lastFirst(authors[0]);
  } else if (authors.length === 2) {
    authorStr = `${lastFirst(authors[0])}, and ${authors[1]}`;
  } else if (authors.length > 2) {
    authorStr = `${lastFirst(authors[0])}, ${authors.slice(1, -1).join(", ")}, and ${authors[authors.length - 1]}`;
  }

  switch (src.type) {
    case "website":
      return `${authorStr}. "${src.title}." ${src.websiteName ? `${src.websiteName}.` : ""}${src.articleDate ? ` ${src.articleDate}.` : src.year ? ` ${src.year}.` : ""}${src.url ? ` ${src.url}` : ""}.`;
    case "book":
      return `${authorStr}. *${src.title}*.${src.edition ? ` ${src.edition} ed.` : ""} ${src.city ? `${src.city}: ` : ""}${src.publisher}${src.year ? `, ${src.year}` : ""}.`;
    case "journal":
      return `${authorStr}. "${src.title}." *${src.journalName}* ${src.volume || ""}${src.issue ? `, no. ${src.issue}` : ""} (${src.year || ""})${src.pages ? `: ${src.pages}` : ""}.${src.url ? ` ${src.url}` : ""}`;
    case "newspaper":
      return `${authorStr}. "${src.title}." *${src.journalName}*${src.articleDate ? `, ${src.articleDate}` : src.year ? `, ${src.year}` : ""}.${src.url ? ` ${src.url}` : ""}`;
    case "magazine":
      return `${authorStr}. "${src.title}." *${src.journalName}*${src.articleDate ? `, ${src.articleDate}` : src.year ? `, ${src.year}` : ""}.${src.url ? ` ${src.url}` : ""}`;
    default:
      return "";
  }
}

function renderCitation(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function CitationGeneratorPage() {
  const [sources, setSources] = useState<Source[]>([createEmptySource()]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [generated, setGenerated] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const current = sources[activeIndex];

  function updateSource(field: keyof Source, value: string) {
    const updated = [...sources];
    updated[activeIndex] = { ...updated[activeIndex], [field]: value };
    setSources(updated);
    setGenerated(false);
  }

  function addSource() {
    const newSrc = createEmptySource();
    setSources([...sources, newSrc]);
    setActiveIndex(sources.length);
    setGenerated(false);
  }

  function removeSource(idx: number) {
    if (sources.length === 1) return;
    const updated = sources.filter((_, i) => i !== idx);
    setSources(updated);
    setActiveIndex(Math.min(activeIndex, updated.length - 1));
    setGenerated(false);
  }

  function generate() {
    setGenerated(true);
  }

  function copyCitation(key: string, text: string) {
    const plain = text.replace(/\*/g, "");
    navigator.clipboard.writeText(plain);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  const sourceTypeLabels: Record<SourceType, string> = {
    website: "Website",
    book: "Book",
    journal: "Journal Article",
    newspaper: "Newspaper Article",
    magazine: "Magazine Article",
  };

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/citation-generator`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="/tools/citation-generator" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Citation Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Generate citations in APA 7th, MLA 9th, and Chicago 17th edition formats. Add multiple sources for a full bibliography.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Source tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {sources.map((src, i) => (
            <button
              key={src.id}
              onClick={() => setActiveIndex(i)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                activeIndex === i ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)]"
              }`}
            >
              Source {i + 1}
              {sources.length > 1 && (
                <span
                  onClick={(e) => { e.stopPropagation(); removeSource(i); }}
                  className="ml-2 opacity-50 hover:opacity-100"
                >
                  &times;
                </span>
              )}
            </button>
          ))}
          <button
            onClick={addSource}
            className="px-3 py-1 rounded-lg text-sm font-medium border border-dashed border-[var(--card-border)] hover:bg-gray-50 transition-colors"
          >
            + Add Source
          </button>
        </div>

        <div className="tool-card mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Source Type</label>
            <select
              value={current.type}
              onChange={(e) => updateSource("type", e.target.value)}
              className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
            >
              {Object.entries(sourceTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Author(s)</label>
              <input
                type="text"
                value={current.authors}
                onChange={(e) => updateSource("authors", e.target.value)}
                placeholder="John Smith, Jane Doe"
                className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
              />
              <p className="text-xs text-[var(--muted)] mt-1">Separate multiple authors with commas</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={current.title}
                onChange={(e) => updateSource("title", e.target.value)}
                placeholder="Article or Book Title"
                className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <input
                type="text"
                value={current.year}
                onChange={(e) => updateSource("year", e.target.value)}
                placeholder="2024"
                className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {(current.type === "website") && (
              <div>
                <label className="block text-sm font-medium mb-1">Website Name</label>
                <input
                  type="text"
                  value={current.websiteName}
                  onChange={(e) => updateSource("websiteName", e.target.value)}
                  placeholder="BBC News"
                  className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                />
              </div>
            )}

            {(current.type === "book") && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Publisher</label>
                  <input
                    type="text"
                    value={current.publisher}
                    onChange={(e) => updateSource("publisher", e.target.value)}
                    placeholder="Oxford University Press"
                    className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Edition (optional)</label>
                  <input
                    type="text"
                    value={current.edition}
                    onChange={(e) => updateSource("edition", e.target.value)}
                    placeholder="2nd"
                    className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City (Chicago only)</label>
                  <input
                    type="text"
                    value={current.city}
                    onChange={(e) => updateSource("city", e.target.value)}
                    placeholder="New York"
                    className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </>
            )}

            {(current.type === "journal" || current.type === "newspaper" || current.type === "magazine") && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {current.type === "journal" ? "Journal Name" : current.type === "newspaper" ? "Newspaper Name" : "Magazine Name"}
                  </label>
                  <input
                    type="text"
                    value={current.journalName}
                    onChange={(e) => updateSource("journalName", e.target.value)}
                    placeholder={current.type === "journal" ? "Nature" : "The New York Times"}
                    className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {(current.type === "journal" || current.type === "magazine") && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Volume</label>
                      <input
                        type="text"
                        value={current.volume}
                        onChange={(e) => updateSource("volume", e.target.value)}
                        placeholder="12"
                        className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Issue</label>
                      <input
                        type="text"
                        value={current.issue}
                        onChange={(e) => updateSource("issue", e.target.value)}
                        placeholder="3"
                        className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Pages</label>
                  <input
                    type="text"
                    value={current.pages}
                    onChange={(e) => updateSource("pages", e.target.value)}
                    placeholder="45-67"
                    className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </>
            )}

            {(current.type === "newspaper" || current.type === "magazine" || current.type === "website") && (
              <div>
                <label className="block text-sm font-medium mb-1">Article Date</label>
                <input
                  type="text"
                  value={current.articleDate}
                  onChange={(e) => updateSource("articleDate", e.target.value)}
                  placeholder="January 15, 2024"
                  className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">URL (optional)</label>
              <input
                type="text"
                value={current.url}
                onChange={(e) => updateSource("url", e.target.value)}
                placeholder="https://example.com/article"
                className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {current.type === "website" && (
              <div>
                <label className="block text-sm font-medium mb-1">Access Date (MLA)</label>
                <input
                  type="text"
                  value={current.accessDate}
                  onChange={(e) => updateSource("accessDate", e.target.value)}
                  placeholder="November 20, 2024"
                  className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>

          <button onClick={generate} className="btn-primary w-full">
            Generate Citations
          </button>
        </div>

        {generated && sources.map((src, si) => {
          const apa = generateAPA(src);
          const mla = generateMLA(src);
          const chicago = generateChicago(src);

          return (
            <div key={src.id} className="result-card mb-6">
              <h3 className="text-sm font-semibold mb-4">
                Source {si + 1}: {src.title || "Untitled"} ({sourceTypeLabels[src.type]})
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[var(--muted)]">APA 7th Edition</span>
                    <button
                      onClick={() => copyCitation(`apa-${si}`, apa)}
                      className="text-xs text-[var(--primary)]"
                    >
                      {copiedKey === `apa-${si}` ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="bg-gray-50 border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm leading-relaxed">
                    {renderCitation(apa)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[var(--muted)]">MLA 9th Edition</span>
                    <button
                      onClick={() => copyCitation(`mla-${si}`, mla)}
                      className="text-xs text-[var(--primary)]"
                    >
                      {copiedKey === `mla-${si}` ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="bg-gray-50 border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm leading-relaxed">
                    {renderCitation(mla)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[var(--muted)]">Chicago 17th Edition</span>
                    <button
                      onClick={() => copyCitation(`chi-${si}`, chicago)}
                      className="text-xs text-[var(--primary)]"
                    >
                      {copiedKey === `chi-${si}` ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="bg-gray-50 border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm leading-relaxed">
                    {renderCitation(chicago)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is a Citation Generator?</h2>
          <p>
            A citation generator is a tool that automatically formats source references according
            to academic style guides. Proper citations give credit to original authors, allow readers
            to find source material, and prevent plagiarism. This tool supports three major citation
            styles used in academic writing, research papers, and professional publications: APA,
            MLA, and Chicago.
          </p>

          <h2>APA 7th Edition Format</h2>
          <p>
            The American Psychological Association (APA) style is primarily used in social sciences,
            education, and psychology. APA 7th edition features author last name with initials, year
            in parentheses, italicized titles for books and journals, and DOI or URL at the end. The
            general format is: Author, A. A. (Year). Title of work. Publisher. For journal articles,
            the journal name, volume, and issue number are included with specific formatting rules.
          </p>

          <h2>MLA 9th Edition Format</h2>
          <p>
            The Modern Language Association (MLA) style is used in humanities, literature, and liberal
            arts. MLA 9th edition uses author last name first with full first name, titles in quotation
            marks for articles and italics for books, and focuses on the container concept (the larger
            work that contains the source). MLA citations end with the URL or DOI and do not include
            the access date unless the source may change over time.
          </p>

          <h2>Chicago 17th Edition Format</h2>
          <p>
            The Chicago Manual of Style is used in history, fine arts, and many general publications.
            This generator uses the Notes-Bibliography style (not Author-Date), which features full
            author names, quoted article titles, italicized book and journal titles, and publication
            city with publisher for books. Chicago style is known for its thoroughness and flexibility
            across source types.
          </p>

          <h2>Supported Source Types</h2>
          <ul>
            <li><strong>Website</strong> — Online articles, blog posts, and web pages with URL and access date</li>
            <li><strong>Book</strong> — Print or digital books with publisher, edition, and city</li>
            <li><strong>Journal Article</strong> — Academic papers with volume, issue, and page numbers</li>
            <li><strong>Newspaper</strong> — Print and online newspaper articles with publication date</li>
            <li><strong>Magazine</strong> — Print and online magazine articles with volume and issue</li>
          </ul>

          <h2>Building a Bibliography</h2>
          <p>
            Use the &quot;Add Source&quot; button to add multiple sources and generate a complete
            bibliography. Each source gets its own citation in all three formats. You can copy
            individual citations or build your complete reference list by copying citations one
            at a time. Sources can be removed by clicking the &times; button on their tab.
          </p>

          <h2>Privacy</h2>
          <p>
            All citation generation happens locally in your browser. No source data is sent to any
            server, stored, or logged. Your research sources remain completely private.
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
            name: "Citation Generator",
            description: META.description,
            url: `${SITE_URL}/tools/citation-generator`,
            applicationCategory: "ReferenceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
