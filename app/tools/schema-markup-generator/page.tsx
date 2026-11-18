"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Schema Markup Generator - Generate JSON-LD Free",
  description:
    "Free Schema Markup Generator. Create structured data JSON-LD for Article, FAQ, Product, LocalBusiness, Organization, Recipe, and Event types. Copy and paste into your site.",
  keywords:
    "schema markup generator, json-ld generator, structured data, rich snippets, schema.org, seo markup generator",
};

const SCHEMA_TYPES = [
  "Article",
  "FAQ",
  "Product",
  "LocalBusiness",
  "Organization",
  "Recipe",
  "Event",
] as const;
type SchemaType = (typeof SCHEMA_TYPES)[number];

interface FAQItem {
  question: string;
  answer: string;
}

export default function SchemaMarkupGeneratorPage() {
  const [schemaType, setSchemaType] = useState<SchemaType>("Article");
  const [copied, setCopied] = useState(false);

  // Article
  const [articleTitle, setArticleTitle] = useState("");
  const [articleAuthor, setArticleAuthor] = useState("");
  const [articlePublished, setArticlePublished] = useState("");
  const [articleModified, setArticleModified] = useState("");
  const [articleImage, setArticleImage] = useState("");
  const [articleDescription, setArticleDescription] = useState("");
  const [articlePublisher, setArticlePublisher] = useState("");

  // FAQ
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    { question: "", answer: "" },
  ]);

  // Product
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCurrency, setProductCurrency] = useState("USD");
  const [productAvailability, setProductAvailability] = useState("InStock");
  const [productBrand, setProductBrand] = useState("");

  // LocalBusiness
  const [bizName, setBizName] = useState("");
  const [bizType, setBizType] = useState("LocalBusiness");
  const [bizStreet, setBizStreet] = useState("");
  const [bizCity, setBizCity] = useState("");
  const [bizState, setBizState] = useState("");
  const [bizZip, setBizZip] = useState("");
  const [bizCountry, setBizCountry] = useState("");
  const [bizPhone, setBizPhone] = useState("");
  const [bizUrl, setBizUrl] = useState("");

  // Organization
  const [orgName, setOrgName] = useState("");
  const [orgUrl, setOrgUrl] = useState("");
  const [orgLogo, setOrgLogo] = useState("");
  const [orgDescription, setOrgDescription] = useState("");

  // Recipe
  const [recipeName, setRecipeName] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");
  const [recipeImage, setRecipeImage] = useState("");
  const [recipePrepTime, setRecipePrepTime] = useState("");
  const [recipeCookTime, setRecipeCookTime] = useState("");
  const [recipeServings, setRecipeServings] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeInstructions, setRecipeInstructions] = useState("");

  // Event
  const [eventName, setEventName] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventUrl, setEventUrl] = useState("");
  const [eventImage, setEventImage] = useState("");

  function generateSchema(): string {
    let schema: Record<string, unknown> = {};

    switch (schemaType) {
      case "Article":
        schema = {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: articleTitle || "Article Title",
          author: { "@type": "Person", name: articleAuthor || "Author Name" },
          ...(articlePublished && { datePublished: articlePublished }),
          ...(articleModified && { dateModified: articleModified }),
          ...(articleImage && { image: articleImage }),
          ...(articleDescription && { description: articleDescription }),
          ...(articlePublisher && {
            publisher: {
              "@type": "Organization",
              name: articlePublisher,
            },
          }),
        };
        break;

      case "FAQ":
        schema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems
            .filter((f) => f.question.trim() && f.answer.trim())
            .map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.answer,
              },
            })),
        };
        break;

      case "Product":
        schema = {
          "@context": "https://schema.org",
          "@type": "Product",
          name: productName || "Product Name",
          ...(productDescription && { description: productDescription }),
          ...(productImage && { image: productImage }),
          ...(productBrand && { brand: { "@type": "Brand", name: productBrand } }),
          offers: {
            "@type": "Offer",
            price: productPrice || "0",
            priceCurrency: productCurrency,
            availability: `https://schema.org/${productAvailability}`,
          },
        };
        break;

      case "LocalBusiness":
        schema = {
          "@context": "https://schema.org",
          "@type": bizType || "LocalBusiness",
          name: bizName || "Business Name",
          ...(bizPhone && { telephone: bizPhone }),
          ...(bizUrl && { url: bizUrl }),
          address: {
            "@type": "PostalAddress",
            ...(bizStreet && { streetAddress: bizStreet }),
            ...(bizCity && { addressLocality: bizCity }),
            ...(bizState && { addressRegion: bizState }),
            ...(bizZip && { postalCode: bizZip }),
            ...(bizCountry && { addressCountry: bizCountry }),
          },
        };
        break;

      case "Organization":
        schema = {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: orgName || "Organization Name",
          ...(orgUrl && { url: orgUrl }),
          ...(orgLogo && { logo: orgLogo }),
          ...(orgDescription && { description: orgDescription }),
        };
        break;

      case "Recipe":
        schema = {
          "@context": "https://schema.org",
          "@type": "Recipe",
          name: recipeName || "Recipe Name",
          ...(recipeDescription && { description: recipeDescription }),
          ...(recipeImage && { image: recipeImage }),
          ...(recipePrepTime && { prepTime: `PT${recipePrepTime}M` }),
          ...(recipeCookTime && { cookTime: `PT${recipeCookTime}M` }),
          ...(recipeServings && { recipeYield: recipeServings }),
          ...(recipeIngredients && {
            recipeIngredient: recipeIngredients
              .split("\n")
              .map((i) => i.trim())
              .filter(Boolean),
          }),
          ...(recipeInstructions && {
            recipeInstructions: recipeInstructions
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((text) => ({ "@type": "HowToStep", text })),
          }),
        };
        break;

      case "Event":
        schema = {
          "@context": "https://schema.org",
          "@type": "Event",
          name: eventName || "Event Name",
          ...(eventStart && { startDate: eventStart }),
          ...(eventEnd && { endDate: eventEnd }),
          ...(eventDescription && { description: eventDescription }),
          ...(eventUrl && { url: eventUrl }),
          ...(eventImage && { image: eventImage }),
          ...(eventLocation && {
            location: {
              "@type": "Place",
              name: eventLocation,
            },
          }),
        };
        break;
    }

    return JSON.stringify(schema, null, 2);
  }

  const output = generateSchema();

  const handleCopy = () => {
    const wrapped = `<script type="application/ld+json">\n${output}\n</script>`;
    navigator.clipboard.writeText(wrapped).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const addFaqItem = () => {
    setFaqItems([...faqItems, { question: "", answer: "" }]);
  };

  const removeFaqItem = (index: number) => {
    if (faqItems.length <= 1) return;
    setFaqItems(faqItems.filter((_, i) => i !== index));
  };

  const updateFaqItem = (index: number, field: "question" | "answer", value: string) => {
    setFaqItems(faqItems.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/schema-markup-generator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Schema Markup Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Generate structured data JSON-LD markup for rich snippets in search results.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <label className="block text-sm font-semibold mb-2">Schema Type</label>
          <select
            value={schemaType}
            onChange={(e) => setSchemaType(e.target.value as SchemaType)}
            className="input-field mb-4"
          >
            {SCHEMA_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Article fields */}
          {schemaType === "Article" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Headline</label>
                <input type="text" value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)} className="input-field" placeholder="Article title" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Author</label>
                  <input type="text" value={articleAuthor} onChange={(e) => setArticleAuthor(e.target.value)} className="input-field" placeholder="Author name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Publisher</label>
                  <input type="text" value={articlePublisher} onChange={(e) => setArticlePublisher(e.target.value)} className="input-field" placeholder="Publisher name" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Date Published</label>
                  <input type="date" value={articlePublished} onChange={(e) => setArticlePublished(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Date Modified</label>
                  <input type="date" value={articleModified} onChange={(e) => setArticleModified(e.target.value)} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Image URL</label>
                <input type="url" value={articleImage} onChange={(e) => setArticleImage(e.target.value)} className="input-field" placeholder="https://example.com/image.jpg" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea value={articleDescription} onChange={(e) => setArticleDescription(e.target.value)} className="input-field min-h-[80px] resize-y" placeholder="Article description" />
              </div>
            </div>
          )}

          {/* FAQ fields */}
          {schemaType === "FAQ" && (
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <div key={i} className="border border-[var(--border)] rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">Question {i + 1}</span>
                    {faqItems.length > 1 && (
                      <button onClick={() => removeFaqItem(i)} className="text-red-500 text-sm hover:underline">Remove</button>
                    )}
                  </div>
                  <input type="text" value={item.question} onChange={(e) => updateFaqItem(i, "question", e.target.value)} className="input-field mb-2" placeholder="Question" />
                  <textarea value={item.answer} onChange={(e) => updateFaqItem(i, "answer", e.target.value)} className="input-field min-h-[60px] resize-y" placeholder="Answer" />
                </div>
              ))}
              <button onClick={addFaqItem} className="btn-secondary text-sm">+ Add Question</button>
            </div>
          )}

          {/* Product fields */}
          {schemaType === "Product" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Product Name</label>
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="input-field" placeholder="Product name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Brand</label>
                  <input type="text" value={productBrand} onChange={(e) => setProductBrand(e.target.value)} className="input-field" placeholder="Brand name" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="input-field min-h-[60px] resize-y" placeholder="Product description" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Image URL</label>
                <input type="url" value={productImage} onChange={(e) => setProductImage(e.target.value)} className="input-field" placeholder="https://example.com/product.jpg" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Price</label>
                  <input type="text" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="input-field" placeholder="29.99" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Currency</label>
                  <select value={productCurrency} onChange={(e) => setProductCurrency(e.target.value)} className="input-field">
                    <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="INR">INR</option><option value="CAD">CAD</option><option value="AUD">AUD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Availability</label>
                  <select value={productAvailability} onChange={(e) => setProductAvailability(e.target.value)} className="input-field">
                    <option value="InStock">In Stock</option><option value="OutOfStock">Out of Stock</option><option value="PreOrder">Pre-Order</option><option value="Discontinued">Discontinued</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* LocalBusiness fields */}
          {schemaType === "LocalBusiness" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Business Name</label>
                  <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} className="input-field" placeholder="Business name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Business Type</label>
                  <select value={bizType} onChange={(e) => setBizType(e.target.value)} className="input-field">
                    <option value="LocalBusiness">LocalBusiness</option><option value="Restaurant">Restaurant</option><option value="Store">Store</option><option value="MedicalBusiness">MedicalBusiness</option><option value="LegalService">LegalService</option><option value="FinancialService">FinancialService</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Street Address</label>
                <input type="text" value={bizStreet} onChange={(e) => setBizStreet(e.target.value)} className="input-field" placeholder="123 Main St" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">City</label>
                  <input type="text" value={bizCity} onChange={(e) => setBizCity(e.target.value)} className="input-field" placeholder="City" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">State</label>
                  <input type="text" value={bizState} onChange={(e) => setBizState(e.target.value)} className="input-field" placeholder="State" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">ZIP</label>
                  <input type="text" value={bizZip} onChange={(e) => setBizZip(e.target.value)} className="input-field" placeholder="ZIP" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Country</label>
                  <input type="text" value={bizCountry} onChange={(e) => setBizCountry(e.target.value)} className="input-field" placeholder="US" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Phone</label>
                  <input type="tel" value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} className="input-field" placeholder="+1-555-123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Website URL</label>
                  <input type="url" value={bizUrl} onChange={(e) => setBizUrl(e.target.value)} className="input-field" placeholder="https://example.com" />
                </div>
              </div>
            </div>
          )}

          {/* Organization fields */}
          {schemaType === "Organization" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Organization Name</label>
                <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="input-field" placeholder="Organization name" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Website URL</label>
                  <input type="url" value={orgUrl} onChange={(e) => setOrgUrl(e.target.value)} className="input-field" placeholder="https://example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Logo URL</label>
                  <input type="url" value={orgLogo} onChange={(e) => setOrgLogo(e.target.value)} className="input-field" placeholder="https://example.com/logo.png" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea value={orgDescription} onChange={(e) => setOrgDescription(e.target.value)} className="input-field min-h-[80px] resize-y" placeholder="Organization description" />
              </div>
            </div>
          )}

          {/* Recipe fields */}
          {schemaType === "Recipe" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Recipe Name</label>
                <input type="text" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} className="input-field" placeholder="Recipe name" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea value={recipeDescription} onChange={(e) => setRecipeDescription(e.target.value)} className="input-field min-h-[60px] resize-y" placeholder="Recipe description" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Image URL</label>
                <input type="url" value={recipeImage} onChange={(e) => setRecipeImage(e.target.value)} className="input-field" placeholder="https://example.com/recipe.jpg" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Prep Time (minutes)</label>
                  <input type="number" value={recipePrepTime} onChange={(e) => setRecipePrepTime(e.target.value)} className="input-field" placeholder="15" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Cook Time (minutes)</label>
                  <input type="number" value={recipeCookTime} onChange={(e) => setRecipeCookTime(e.target.value)} className="input-field" placeholder="30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Servings</label>
                  <input type="text" value={recipeServings} onChange={(e) => setRecipeServings(e.target.value)} className="input-field" placeholder="4 servings" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ingredients (one per line)</label>
                <textarea value={recipeIngredients} onChange={(e) => setRecipeIngredients(e.target.value)} className="input-field min-h-[100px] resize-y font-mono text-sm" placeholder="2 cups flour&#10;1 cup sugar&#10;3 eggs" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Instructions (one step per line)</label>
                <textarea value={recipeInstructions} onChange={(e) => setRecipeInstructions(e.target.value)} className="input-field min-h-[100px] resize-y font-mono text-sm" placeholder="Preheat oven to 350F&#10;Mix dry ingredients&#10;Add wet ingredients" />
              </div>
            </div>
          )}

          {/* Event fields */}
          {schemaType === "Event" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Event Name</label>
                <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} className="input-field" placeholder="Event name" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Start Date</label>
                  <input type="datetime-local" value={eventStart} onChange={(e) => setEventStart(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">End Date</label>
                  <input type="datetime-local" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Location</label>
                <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} className="input-field" placeholder="Venue name or address" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} className="input-field min-h-[60px] resize-y" placeholder="Event description" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Event URL</label>
                  <input type="url" value={eventUrl} onChange={(e) => setEventUrl(e.target.value)} className="input-field" placeholder="https://example.com/event" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Image URL</label>
                  <input type="url" value={eventImage} onChange={(e) => setEventImage(e.target.value)} className="input-field" placeholder="https://example.com/event.jpg" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="result-card mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Generated JSON-LD</h3>
            <button onClick={handleCopy} className="btn-secondary text-sm">
              {copied ? "Copied!" : "Copy (with script tag)"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)] overflow-x-auto">
            {`<script type="application/ld+json">\n${output}\n</script>`}
          </pre>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is Schema Markup?</h2>
          <p>
            Schema Markup is structured data you add to your HTML to help search engines understand your
            content better. It uses the schema.org vocabulary in JSON-LD format to generate rich snippets
            in search results, improving visibility and click-through rates.
          </p>

          <h2>Supported Schema Types</h2>
          <ul>
            <li><strong>Article:</strong> Blog posts, news articles, and editorial content</li>
            <li><strong>FAQ:</strong> Frequently asked questions with expandable answers in search results</li>
            <li><strong>Product:</strong> Products with price, availability, and brand information</li>
            <li><strong>LocalBusiness:</strong> Physical businesses with address and contact details</li>
            <li><strong>Organization:</strong> Companies and organizations with logo and description</li>
            <li><strong>Recipe:</strong> Cooking recipes with ingredients, instructions, and timing</li>
            <li><strong>Event:</strong> Events with date, location, and description</li>
          </ul>

          <h2>Who Uses Schema Markup Generators?</h2>
          <ul>
            <li><strong>SEO Specialists:</strong> Implement structured data for rich snippets</li>
            <li><strong>Web Developers:</strong> Add schema markup to websites quickly</li>
            <li><strong>Content Managers:</strong> Optimize content for search engine visibility</li>
            <li><strong>Business Owners:</strong> Improve local search presence</li>
          </ul>
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Schema Markup Generator",
            description: META.description,
            url: `${SITE_URL}/tools/schema-markup-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
