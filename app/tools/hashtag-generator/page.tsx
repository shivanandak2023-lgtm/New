"use client";

import { useState, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Hashtag Generator - Generate Trending Hashtags for Social Media",
  description:
    "Free Hashtag Generator for Instagram, TikTok, Twitter & more. Get popular and niche hashtags by topic. Copy all hashtags with one click.",
  keywords: "hashtag generator, instagram hashtags, tiktok hashtags, trending hashtags, social media hashtags",
};

const HASHTAG_MAP: Record<string, { popular: string[]; niche: string[] }> = {
  travel: {
    popular: ["#travel", "#travelgram", "#traveling", "#wanderlust", "#vacation", "#instatravel", "#travelphotography", "#explore", "#trip", "#adventure", "#tourism", "#travelling", "#traveler", "#traveltheworld", "#holiday"],
    niche: ["#solotravel", "#backpacking", "#digitalnomad", "#travelcouple", "#budgettravel", "#offthebeatenpath", "#slowtravel", "#sustainabletravel", "#vanlife", "#roadtrip", "#hiddengems", "#traveldiaries", "#globetrotter", "#passportready", "#nextstop"],
  },
  food: {
    popular: ["#food", "#foodie", "#foodporn", "#yummy", "#instafood", "#foodphotography", "#foodstagram", "#delicious", "#homemade", "#foodlover", "#cooking", "#tasty", "#dinner", "#lunch", "#recipe"],
    niche: ["#foodblogger", "#streetfood", "#comfortfood", "#mealprep", "#plantbased", "#veganfood", "#healthyfood", "#baking", "#brunch", "#farmtotable", "#foodartistry", "#cheflife", "#eeeeeats", "#foodgasm", "#forkyeah"],
  },
  fitness: {
    popular: ["#fitness", "#gym", "#workout", "#fit", "#motivation", "#bodybuilding", "#training", "#health", "#fitnessmotivation", "#exercise", "#muscle", "#fitfam", "#healthy", "#lifestyle", "#sport"],
    niche: ["#homeworkout", "#crossfit", "#powerlifting", "#yogalife", "#calisthenics", "#hiit", "#personaltrainer", "#strengthtraining", "#fitnessjourney", "#legday", "#gymlife", "#fitover40", "#marathontraining", "#functionalfitness", "#gainz"],
  },
  fashion: {
    popular: ["#fashion", "#style", "#ootd", "#fashionblogger", "#instafashion", "#outfit", "#fashionista", "#streetstyle", "#beauty", "#model", "#clothes", "#shopping", "#fashionstyle", "#trendy", "#lookoftheday"],
    niche: ["#sustainablefashion", "#thrifted", "#capsulewardrobe", "#slowfashion", "#vintageestyle", "#streetwear", "#minimalistfashion", "#fashioninspo", "#styleinspo", "#mensfashion", "#plussize", "#handmade", "#ethicalfashion", "#fashiondiaries", "#outfitideas"],
  },
  tech: {
    popular: ["#tech", "#technology", "#innovation", "#coding", "#programming", "#developer", "#software", "#startup", "#ai", "#gadgets", "#computer", "#digital", "#apple", "#android", "#webapp"],
    niche: ["#machinelearning", "#blockchain", "#cybersecurity", "#webdev", "#frontend", "#python", "#javascript", "#devlife", "#opensourcce", "#saas", "#techstartup", "#iot", "#cloudcomputing", "#datascience", "#100daysofcode"],
  },
  business: {
    popular: ["#business", "#entrepreneur", "#marketing", "#success", "#money", "#startup", "#smallbusiness", "#motivation", "#branding", "#digitalmarketing", "#hustle", "#leadership", "#goals", "#ceo", "#growth"],
    niche: ["#sidehustle", "#solopreneur", "#ecommerce", "#contentmarketing", "#seo", "#businesstips", "#womeninbusiness", "#b2b", "#saas", "#passiveincome", "#freelancer", "#remotework", "#businessowner", "#growthhacking", "#personalbranding"],
  },
  photography: {
    popular: ["#photography", "#photo", "#photooftheday", "#photographer", "#naturephotography", "#picoftheday", "#portrait", "#landscape", "#instagood", "#canon", "#nikon", "#camera", "#photos", "#ig", "#art"],
    niche: ["#streetphotography", "#goldenhour", "#longexposure", "#dronephotography", "#blackandwhitephotography", "#minimalphotography", "#filmisnotdead", "#35mm", "#lightroom", "#nightphotography", "#astrophotography", "#macrophotography", "#mobilephotography", "#raw", "#shotoniphone"],
  },
  nature: {
    popular: ["#nature", "#naturephotography", "#landscape", "#wildlife", "#sunset", "#mountains", "#ocean", "#forest", "#sky", "#earth", "#flowers", "#beach", "#outdoors", "#river", "#green"],
    niche: ["#earthfocus", "#naturelovers", "#wildlifephotography", "#hikingadventures", "#mountainlife", "#getoutside", "#optoutside", "#rewilding", "#forestbathing", "#birdwatching", "#conservation", "#biodiversity", "#ecofriendly", "#natgeo", "#planetearth"],
  },
  music: {
    popular: ["#music", "#musician", "#singer", "#song", "#hiphop", "#rap", "#guitar", "#dj", "#producer", "#band", "#artist", "#rock", "#pop", "#concert", "#live"],
    niche: ["#newmusic", "#independentartist", "#beatmaker", "#musicproduction", "#singersongwriter", "#acousticmusic", "#indiemusic", "#lofi", "#vinylcollection", "#musicislife", "#studiolife", "#originalmusic", "#unsigned", "#undergroundmusic", "#musicvideo"],
  },
  art: {
    popular: ["#art", "#artist", "#artwork", "#drawing", "#painting", "#illustration", "#design", "#sketch", "#digitalart", "#creative", "#artistsoninstagram", "#artoftheday", "#instaart", "#contemporaryart", "#abstract"],
    niche: ["#procreate", "#watercolor", "#oilpainting", "#characterdesign", "#conceptart", "#sketchbook", "#fanart", "#surrealism", "#mixedmedia", "#artcommission", "#pleinair", "#artprocess", "#popart", "#generativeart", "#traditionalart"],
  },
};

const CATEGORIES = Object.keys(HASHTAG_MAP);

export default function HashtagGeneratorPage() {
  const [keyword, setKeyword] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [generatedPopular, setGeneratedPopular] = useState<string[]>([]);
  const [generatedNiche, setGeneratedNiche] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const input = keyword.toLowerCase().trim();
    let matchedCategory = selectedCategory;

    if (!matchedCategory && input) {
      for (const cat of CATEGORIES) {
        if (input.includes(cat) || cat.includes(input)) {
          matchedCategory = cat;
          break;
        }
      }
    }

    if (!matchedCategory) {
      // Default to a mix when no category matches
      const allPopular: string[] = [];
      const allNiche: string[] = [];
      for (const cat of CATEGORIES) {
        allPopular.push(...HASHTAG_MAP[cat].popular.slice(0, 3));
        allNiche.push(...HASHTAG_MAP[cat].niche.slice(0, 3));
      }
      // Add custom hashtag from keyword
      if (input) {
        const customTag = `#${input.replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")}`;
        if (customTag.length > 1) allPopular.unshift(customTag);
      }
      setGeneratedPopular(allPopular.slice(0, 15));
      setGeneratedNiche(allNiche.slice(0, 15));
    } else {
      const data = HASHTAG_MAP[matchedCategory];
      const popular = [...data.popular];
      const niche = [...data.niche];
      // Prepend custom tag if keyword provided
      if (input) {
        const customTag = `#${input.replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")}`;
        if (customTag.length > 1 && !popular.includes(customTag)) {
          popular.unshift(customTag);
        }
      }
      setGeneratedPopular(popular);
      setGeneratedNiche(niche);
    }
    setCopied(false);
  }, [keyword, selectedCategory]);

  function copyAll() {
    const all = [...generatedPopular, ...generatedNiche].join(" ");
    navigator.clipboard.writeText(all).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function copySet(tags: string[]) {
    navigator.clipboard.writeText(tags.join(" "));
  }

  const totalTags = generatedPopular.length + generatedNiche.length;

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/hashtag-generator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/hashtag-generator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Hashtag Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Generate relevant popular and niche hashtags for your social media posts.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Enter a topic or keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. food, travel, fitness..."
              className="w-full p-3 border rounded-lg bg-[var(--muted-bg)]"
              onKeyDown={(e) => e.key === "Enter" && generate()}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Or select a category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                    selectedCategory === cat
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--muted-bg)] hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generate} className="btn-primary w-full">
            Generate Hashtags
          </button>
        </div>

        {totalTags > 0 && (
          <div className="tool-card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{totalTags} Hashtags Generated</h2>
              <button onClick={copyAll} className="btn-primary text-sm">
                {copied ? "Copied All!" : "Copy All"}
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[var(--muted)]">Popular Hashtags</h3>
                <button onClick={() => copySet(generatedPopular)} className="text-xs text-[var(--primary)] hover:underline">
                  Copy
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {generatedPopular.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm cursor-pointer hover:bg-blue-100"
                    onClick={() => navigator.clipboard.writeText(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[var(--muted)]">Niche Hashtags</h3>
                <button onClick={() => copySet(generatedNiche)} className="text-xs text-[var(--primary)] hover:underline">
                  Copy
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {generatedNiche.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-sm cursor-pointer hover:bg-purple-100"
                    onClick={() => navigator.clipboard.writeText(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Why Use a Hashtag Generator?</h2>
          <p>
            Hashtags are essential for reaching a wider audience on social media platforms like Instagram,
            TikTok, Twitter, and LinkedIn. Using the right mix of popular and niche hashtags increases
            your content&apos;s discoverability and engagement.
          </p>

          <h2>How to Use Hashtags Effectively</h2>
          <ul>
            <li>Use a mix of popular (high-volume) and niche (targeted) hashtags</li>
            <li>Instagram allows up to 30 hashtags per post &mdash; use 20-25 for best results</li>
            <li>On Twitter, 1-3 hashtags per tweet is optimal</li>
            <li>Research trending hashtags in your niche regularly</li>
            <li>Avoid banned or spammy hashtags that can hurt your reach</li>
          </ul>

          <h2>Supported Categories</h2>
          <ul>
            <li><strong>Travel:</strong> Wanderlust, vacation, and adventure hashtags</li>
            <li><strong>Food:</strong> Foodie, recipe, and cooking hashtags</li>
            <li><strong>Fitness:</strong> Workout, gym, and health hashtags</li>
            <li><strong>Fashion:</strong> Style, outfit, and trend hashtags</li>
            <li><strong>Tech:</strong> Technology, coding, and startup hashtags</li>
            <li><strong>Business:</strong> Entrepreneur, marketing, and growth hashtags</li>
            <li><strong>Photography:</strong> Camera, portrait, and landscape hashtags</li>
            <li><strong>Nature:</strong> Wildlife, outdoors, and earth hashtags</li>
            <li><strong>Music:</strong> Musician, producer, and genre hashtags</li>
            <li><strong>Art:</strong> Digital art, painting, and creative hashtags</li>
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
            name: "Hashtag Generator",
            description: META.description,
            url: `${SITE_URL}/tools/hashtag-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
