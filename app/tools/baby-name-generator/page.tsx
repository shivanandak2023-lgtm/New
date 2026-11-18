"use client";

import { useState, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Baby Name Generator - Find the Perfect Name with Meanings",
  description:
    "Free Baby Name Generator with 200+ names. Filter by gender, starting letter, and origin. Find beautiful baby names with meanings from American, Indian, Arabic, Spanish, Japanese, European, and African origins.",
  keywords: "baby name generator, baby names, boy names, girl names, baby name meanings, unique baby names, name generator",
};

interface BabyName {
  name: string;
  gender: "boy" | "girl";
  origin: string;
  meaning: string;
}

const BABY_NAMES: BabyName[] = [
  // American
  { name: "Liam", gender: "boy", origin: "American", meaning: "Strong-willed warrior" },
  { name: "Noah", gender: "boy", origin: "American", meaning: "Rest, comfort" },
  { name: "Oliver", gender: "boy", origin: "American", meaning: "Olive tree, peace" },
  { name: "James", gender: "boy", origin: "American", meaning: "Supplanter" },
  { name: "Ethan", gender: "boy", origin: "American", meaning: "Strong, firm" },
  { name: "Lucas", gender: "boy", origin: "American", meaning: "Bringer of light" },
  { name: "Mason", gender: "boy", origin: "American", meaning: "Worker in stone" },
  { name: "Logan", gender: "boy", origin: "American", meaning: "Little hollow" },
  { name: "Aiden", gender: "boy", origin: "American", meaning: "Little fire" },
  { name: "Jackson", gender: "boy", origin: "American", meaning: "Son of Jack" },
  { name: "Emma", gender: "girl", origin: "American", meaning: "Whole, universal" },
  { name: "Olivia", gender: "girl", origin: "American", meaning: "Olive tree" },
  { name: "Ava", gender: "girl", origin: "American", meaning: "Life, bird" },
  { name: "Sophia", gender: "girl", origin: "American", meaning: "Wisdom" },
  { name: "Isabella", gender: "girl", origin: "American", meaning: "Devoted to God" },
  { name: "Mia", gender: "girl", origin: "American", meaning: "Mine, beloved" },
  { name: "Charlotte", gender: "girl", origin: "American", meaning: "Free woman" },
  { name: "Harper", gender: "girl", origin: "American", meaning: "Harp player" },
  { name: "Evelyn", gender: "girl", origin: "American", meaning: "Desired, wished for" },
  { name: "Luna", gender: "girl", origin: "American", meaning: "Moon" },
  { name: "Wyatt", gender: "boy", origin: "American", meaning: "Brave in war" },
  { name: "Scarlett", gender: "girl", origin: "American", meaning: "Red, bright" },
  { name: "Chloe", gender: "girl", origin: "American", meaning: "Blooming, green shoot" },
  { name: "Asher", gender: "boy", origin: "American", meaning: "Happy, blessed" },
  { name: "Riley", gender: "girl", origin: "American", meaning: "Courageous" },
  // Indian
  { name: "Arjun", gender: "boy", origin: "Indian", meaning: "Bright, shining" },
  { name: "Vivaan", gender: "boy", origin: "Indian", meaning: "Full of life" },
  { name: "Aarav", gender: "boy", origin: "Indian", meaning: "Peaceful, wise" },
  { name: "Reyansh", gender: "boy", origin: "Indian", meaning: "Ray of light" },
  { name: "Advait", gender: "boy", origin: "Indian", meaning: "Unique, one of a kind" },
  { name: "Kabir", gender: "boy", origin: "Indian", meaning: "Great, powerful" },
  { name: "Dhruv", gender: "boy", origin: "Indian", meaning: "Pole star, constant" },
  { name: "Vihaan", gender: "boy", origin: "Indian", meaning: "Dawn, morning" },
  { name: "Rohan", gender: "boy", origin: "Indian", meaning: "Ascending" },
  { name: "Ishaan", gender: "boy", origin: "Indian", meaning: "Sun, ruler" },
  { name: "Ananya", gender: "girl", origin: "Indian", meaning: "Unique, matchless" },
  { name: "Saanvi", gender: "girl", origin: "Indian", meaning: "Goddess Lakshmi" },
  { name: "Aanya", gender: "girl", origin: "Indian", meaning: "Graceful" },
  { name: "Diya", gender: "girl", origin: "Indian", meaning: "Lamp, light" },
  { name: "Myra", gender: "girl", origin: "Indian", meaning: "Sweet, admirable" },
  { name: "Prisha", gender: "girl", origin: "Indian", meaning: "God's gift" },
  { name: "Kiara", gender: "girl", origin: "Indian", meaning: "Dark-haired, graceful" },
  { name: "Aadhya", gender: "girl", origin: "Indian", meaning: "First power" },
  { name: "Riya", gender: "girl", origin: "Indian", meaning: "Singer, graceful" },
  { name: "Kavya", gender: "girl", origin: "Indian", meaning: "Poetry, art" },
  { name: "Arnav", gender: "boy", origin: "Indian", meaning: "Ocean, sea" },
  { name: "Sai", gender: "boy", origin: "Indian", meaning: "Divine, saintly" },
  { name: "Meera", gender: "girl", origin: "Indian", meaning: "Devotee, ocean" },
  { name: "Nisha", gender: "girl", origin: "Indian", meaning: "Night, dream" },
  // Arabic
  { name: "Adam", gender: "boy", origin: "Arabic", meaning: "Man, earth" },
  { name: "Zain", gender: "boy", origin: "Arabic", meaning: "Beauty, grace" },
  { name: "Omar", gender: "boy", origin: "Arabic", meaning: "Flourishing, long-lived" },
  { name: "Yusuf", gender: "boy", origin: "Arabic", meaning: "God increases" },
  { name: "Ali", gender: "boy", origin: "Arabic", meaning: "Exalted, noble" },
  { name: "Hassan", gender: "boy", origin: "Arabic", meaning: "Handsome, good" },
  { name: "Khalid", gender: "boy", origin: "Arabic", meaning: "Eternal, immortal" },
  { name: "Tariq", gender: "boy", origin: "Arabic", meaning: "Morning star" },
  { name: "Amir", gender: "boy", origin: "Arabic", meaning: "Prince, commander" },
  { name: "Idris", gender: "boy", origin: "Arabic", meaning: "Interpreter, studious" },
  { name: "Amira", gender: "girl", origin: "Arabic", meaning: "Princess, leader" },
  { name: "Fatima", gender: "girl", origin: "Arabic", meaning: "Captivating, abstinent" },
  { name: "Layla", gender: "girl", origin: "Arabic", meaning: "Night, dark beauty" },
  { name: "Zara", gender: "girl", origin: "Arabic", meaning: "Flower, blooming" },
  { name: "Yasmin", gender: "girl", origin: "Arabic", meaning: "Jasmine flower" },
  { name: "Mariam", gender: "girl", origin: "Arabic", meaning: "Beloved, sea of sorrow" },
  { name: "Noor", gender: "girl", origin: "Arabic", meaning: "Light, radiance" },
  { name: "Hana", gender: "girl", origin: "Arabic", meaning: "Happiness, bliss" },
  { name: "Safiya", gender: "girl", origin: "Arabic", meaning: "Pure, best friend" },
  { name: "Aaliyah", gender: "girl", origin: "Arabic", meaning: "Exalted, sublime" },
  { name: "Rayyan", gender: "boy", origin: "Arabic", meaning: "Gates of heaven" },
  { name: "Samira", gender: "girl", origin: "Arabic", meaning: "Companion in evening talk" },
  { name: "Rashid", gender: "boy", origin: "Arabic", meaning: "Rightly guided" },
  // Spanish
  { name: "Mateo", gender: "boy", origin: "Spanish", meaning: "Gift of God" },
  { name: "Santiago", gender: "boy", origin: "Spanish", meaning: "Saint James" },
  { name: "Sebastian", gender: "boy", origin: "Spanish", meaning: "Venerable, revered" },
  { name: "Diego", gender: "boy", origin: "Spanish", meaning: "Supplanter" },
  { name: "Alejandro", gender: "boy", origin: "Spanish", meaning: "Defender of mankind" },
  { name: "Carlos", gender: "boy", origin: "Spanish", meaning: "Free man" },
  { name: "Rafael", gender: "boy", origin: "Spanish", meaning: "God has healed" },
  { name: "Emilio", gender: "boy", origin: "Spanish", meaning: "Rival, eager" },
  { name: "Marco", gender: "boy", origin: "Spanish", meaning: "Warlike" },
  { name: "Andres", gender: "boy", origin: "Spanish", meaning: "Manly, brave" },
  { name: "Valentina", gender: "girl", origin: "Spanish", meaning: "Strong, healthy" },
  { name: "Camila", gender: "girl", origin: "Spanish", meaning: "Young ceremonial attendant" },
  { name: "Sofia", gender: "girl", origin: "Spanish", meaning: "Wisdom" },
  { name: "Lucia", gender: "girl", origin: "Spanish", meaning: "Light" },
  { name: "Elena", gender: "girl", origin: "Spanish", meaning: "Bright, shining light" },
  { name: "Gabriela", gender: "girl", origin: "Spanish", meaning: "God is my strength" },
  { name: "Isabel", gender: "girl", origin: "Spanish", meaning: "Pledged to God" },
  { name: "Daniela", gender: "girl", origin: "Spanish", meaning: "God is my judge" },
  { name: "Mariana", gender: "girl", origin: "Spanish", meaning: "Grace, beloved" },
  { name: "Rosa", gender: "girl", origin: "Spanish", meaning: "Rose" },
  { name: "Pablo", gender: "boy", origin: "Spanish", meaning: "Small, humble" },
  { name: "Carmen", gender: "girl", origin: "Spanish", meaning: "Garden, song" },
  // Japanese
  { name: "Haruto", gender: "boy", origin: "Japanese", meaning: "Sun, flying" },
  { name: "Yuto", gender: "boy", origin: "Japanese", meaning: "Gentle, superior" },
  { name: "Sota", gender: "boy", origin: "Japanese", meaning: "Smooth, big" },
  { name: "Riku", gender: "boy", origin: "Japanese", meaning: "Land, continent" },
  { name: "Kaito", gender: "boy", origin: "Japanese", meaning: "Ocean, soaring" },
  { name: "Ren", gender: "boy", origin: "Japanese", meaning: "Lotus, love" },
  { name: "Haru", gender: "boy", origin: "Japanese", meaning: "Spring, sunshine" },
  { name: "Akira", gender: "boy", origin: "Japanese", meaning: "Bright, clear" },
  { name: "Takeshi", gender: "boy", origin: "Japanese", meaning: "Fierce warrior" },
  { name: "Kenji", gender: "boy", origin: "Japanese", meaning: "Intelligent second son" },
  { name: "Sakura", gender: "girl", origin: "Japanese", meaning: "Cherry blossom" },
  { name: "Yui", gender: "girl", origin: "Japanese", meaning: "Bind, gentle" },
  { name: "Hina", gender: "girl", origin: "Japanese", meaning: "Sunlight, vegetables" },
  { name: "Aoi", gender: "girl", origin: "Japanese", meaning: "Blue, hollyhock" },
  { name: "Mei", gender: "girl", origin: "Japanese", meaning: "Sprout, beautiful" },
  { name: "Yuki", gender: "girl", origin: "Japanese", meaning: "Snow, happiness" },
  { name: "Emi", gender: "girl", origin: "Japanese", meaning: "Beautiful blessing" },
  { name: "Mana", gender: "girl", origin: "Japanese", meaning: "Love, affection" },
  { name: "Kohana", gender: "girl", origin: "Japanese", meaning: "Little flower" },
  { name: "Ayumi", gender: "girl", origin: "Japanese", meaning: "Walk, progress" },
  { name: "Naoki", gender: "boy", origin: "Japanese", meaning: "Honest timber tree" },
  { name: "Sora", gender: "girl", origin: "Japanese", meaning: "Sky" },
  { name: "Mio", gender: "girl", origin: "Japanese", meaning: "Beautiful cherry blossom" },
  // European
  { name: "Alexander", gender: "boy", origin: "European", meaning: "Defender of the people" },
  { name: "Felix", gender: "boy", origin: "European", meaning: "Happy, fortunate" },
  { name: "Hugo", gender: "boy", origin: "European", meaning: "Mind, intellect" },
  { name: "Oscar", gender: "boy", origin: "European", meaning: "God's spear" },
  { name: "Leo", gender: "boy", origin: "European", meaning: "Lion" },
  { name: "Arthur", gender: "boy", origin: "European", meaning: "Bear, noble" },
  { name: "Maximilian", gender: "boy", origin: "European", meaning: "Greatest" },
  { name: "Henrik", gender: "boy", origin: "European", meaning: "Ruler of the home" },
  { name: "Nikolai", gender: "boy", origin: "European", meaning: "Victory of the people" },
  { name: "Stefan", gender: "boy", origin: "European", meaning: "Crown, garland" },
  { name: "Amelie", gender: "girl", origin: "European", meaning: "Hardworking, industrious" },
  { name: "Freya", gender: "girl", origin: "European", meaning: "Noble woman, goddess" },
  { name: "Elise", gender: "girl", origin: "European", meaning: "God is my oath" },
  { name: "Ingrid", gender: "girl", origin: "European", meaning: "Beautiful, fair" },
  { name: "Astrid", gender: "girl", origin: "European", meaning: "Divinely beautiful" },
  { name: "Clara", gender: "girl", origin: "European", meaning: "Bright, clear" },
  { name: "Greta", gender: "girl", origin: "European", meaning: "Pearl" },
  { name: "Lena", gender: "girl", origin: "European", meaning: "Light, bright" },
  { name: "Matilda", gender: "girl", origin: "European", meaning: "Battle-mighty" },
  { name: "Annika", gender: "girl", origin: "European", meaning: "Grace, favor" },
  { name: "Lukas", gender: "boy", origin: "European", meaning: "Light-giving" },
  { name: "Elsa", gender: "girl", origin: "European", meaning: "Noble, pledged to God" },
  { name: "Dante", gender: "boy", origin: "European", meaning: "Enduring, steadfast" },
  { name: "Aurora", gender: "girl", origin: "European", meaning: "Dawn" },
  // African
  { name: "Amari", gender: "boy", origin: "African", meaning: "Strength, builder" },
  { name: "Kofi", gender: "boy", origin: "African", meaning: "Born on Friday" },
  { name: "Jabari", gender: "boy", origin: "African", meaning: "Brave one" },
  { name: "Kwame", gender: "boy", origin: "African", meaning: "Born on Saturday" },
  { name: "Zuri", gender: "girl", origin: "African", meaning: "Beautiful" },
  { name: "Nia", gender: "girl", origin: "African", meaning: "Purpose, intention" },
  { name: "Amina", gender: "girl", origin: "African", meaning: "Trustworthy, faithful" },
  { name: "Imani", gender: "girl", origin: "African", meaning: "Faith, belief" },
  { name: "Tendai", gender: "boy", origin: "African", meaning: "Be thankful" },
  { name: "Chinwe", gender: "girl", origin: "African", meaning: "God owns" },
  { name: "Obinna", gender: "boy", origin: "African", meaning: "Father's heart" },
  { name: "Adaeze", gender: "girl", origin: "African", meaning: "Princess, first daughter" },
  { name: "Sekou", gender: "boy", origin: "African", meaning: "Learned, wise" },
  { name: "Ayanna", gender: "girl", origin: "African", meaning: "Beautiful flower" },
  { name: "Kato", gender: "boy", origin: "African", meaning: "Second of twins" },
  { name: "Ife", gender: "girl", origin: "African", meaning: "Love" },
  { name: "Chidi", gender: "boy", origin: "African", meaning: "God exists" },
  { name: "Folami", gender: "girl", origin: "African", meaning: "Respect and honor me" },
  { name: "Emeka", gender: "boy", origin: "African", meaning: "Great deeds" },
  { name: "Makena", gender: "girl", origin: "African", meaning: "Happy one" },
  { name: "Dayo", gender: "boy", origin: "African", meaning: "Joy arrives" },
  { name: "Afia", gender: "girl", origin: "African", meaning: "Born on Friday" },
  { name: "Tau", gender: "boy", origin: "African", meaning: "Lion" },
  { name: "Sanaa", gender: "girl", origin: "African", meaning: "Work of art" },
  { name: "Jelani", gender: "boy", origin: "African", meaning: "Mighty" },
];

const ORIGINS = ["Any", "American", "Indian", "Arabic", "Spanish", "Japanese", "European", "African"];
const LETTERS = ["Any", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

export default function BabyNameGeneratorPage() {
  const [gender, setGender] = useState<"boy" | "girl" | "either">("either");
  const [startLetter, setStartLetter] = useState("Any");
  const [origin, setOrigin] = useState("Any");
  const [results, setResults] = useState<BabyName[]>([]);
  const [favorites, setFavorites] = useState<BabyName[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const generateNames = useCallback(() => {
    setIsShuffling(true);
    setTimeout(() => {
      let filtered = BABY_NAMES.filter((n) => {
        if (gender !== "either" && n.gender !== gender) return false;
        if (startLetter !== "Any" && !n.name.startsWith(startLetter)) return false;
        if (origin !== "Any" && n.origin !== origin) return false;
        return true;
      });

      // Shuffle using crypto
      const arr = new Uint32Array(filtered.length);
      crypto.getRandomValues(arr);
      filtered = filtered
        .map((item, i) => ({ item, sort: arr[i] }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);

      setResults(filtered.slice(0, 10));
      setIsShuffling(false);
    }, 500);
  }, [gender, startLetter, origin]);

  const toggleFavorite = (name: BabyName) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.name === name.name && f.origin === name.origin);
      if (exists) return prev.filter((f) => !(f.name === name.name && f.origin === name.origin));
      return [...prev, name];
    });
  };

  const isFavorite = (name: BabyName) =>
    favorites.some((f) => f.name === name.name && f.origin === name.origin);

  const genderColor = (g: "boy" | "girl") =>
    g === "boy" ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-pink-100 text-pink-700 border-pink-300";

  const originColors: Record<string, string> = {
    American: "bg-red-50 text-red-600",
    Indian: "bg-orange-50 text-orange-600",
    Arabic: "bg-emerald-50 text-emerald-600",
    Spanish: "bg-yellow-50 text-yellow-600",
    Japanese: "bg-purple-50 text-purple-600",
    European: "bg-cyan-50 text-cyan-600",
    African: "bg-amber-50 text-amber-600",
  };

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/baby-name-generator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/baby-name-generator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Baby Name Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Discover the perfect name for your baby with meanings from cultures around the world.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          {/* Gender Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Gender</label>
            <div className="flex gap-2 flex-wrap">
              {(["boy", "girl", "either"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${
                    gender === g
                      ? g === "boy"
                        ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-200 scale-105"
                        : g === "girl"
                        ? "bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-200 scale-105"
                        : "bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-200 scale-105"
                      : "bg-[var(--muted-bg)] border-transparent hover:border-gray-300"
                  }`}
                >
                  {g === "boy" ? "👦 Boy" : g === "girl" ? "👧 Girl" : "✨ Either"}
                </button>
              ))}
            </div>
          </div>

          {/* Starting Letter */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Starting Letter</label>
            <div className="flex flex-wrap gap-1.5">
              {LETTERS.map((l) => (
                <button
                  key={l}
                  onClick={() => setStartLetter(l)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all duration-200 ${
                    startLetter === l
                      ? "bg-[var(--primary)] text-white shadow-md scale-110"
                      : "bg-[var(--muted-bg)] hover:bg-gray-200"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Origin */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Origin</label>
            <div className="flex gap-2 flex-wrap">
              {ORIGINS.map((o) => (
                <button
                  key={o}
                  onClick={() => setOrigin(o)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    origin === o
                      ? "bg-[var(--primary)] text-white shadow-md"
                      : "bg-[var(--muted-bg)] hover:bg-gray-200"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateNames}
            disabled={isShuffling}
            className="btn-primary w-full text-lg py-3 relative overflow-hidden"
          >
            {isShuffling ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block animate-spin">✨</span> Finding Names...
              </span>
            ) : results.length > 0 ? (
              "🔄 Generate More Names"
            ) : (
              "✨ Generate Baby Names"
            )}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="result-card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                {isShuffling ? "Shuffling..." : `Found ${results.length} Names`}
              </h2>
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className="text-sm font-medium text-[var(--primary)] hover:underline"
              >
                ❤️ Favorites ({favorites.length})
              </button>
            </div>

            <div className={`grid gap-3 ${isShuffling ? "opacity-50" : ""}`} style={{ transition: "opacity 0.3s" }}>
              {results.map((name, i) => (
                <div
                  key={`${name.name}-${name.origin}-${i}`}
                  className="flex items-center justify-between p-4 rounded-xl border-2 border-transparent hover:border-[var(--primary)] bg-[var(--muted-bg)] transition-all duration-300"
                  style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 0.05}s both` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold">{name.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${genderColor(name.gender)}`}>
                        {name.gender === "boy" ? "👦" : "👧"} {name.gender}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${originColors[name.origin] || ""}`}>
                        {name.origin}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted)]">{name.meaning}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(name)}
                    className="text-2xl transition-transform duration-300 hover:scale-125 ml-3"
                    title={isFavorite(name) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite(name) ? "❤️" : "🤍"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Panel */}
        {showFavorites && (
          <div className="tool-card mb-8 border-2 border-pink-200">
            <h2 className="text-lg font-bold mb-4">❤️ Your Favorite Names</h2>
            {favorites.length === 0 ? (
              <p className="text-[var(--muted)] text-center py-4">
                No favorites yet! Click the heart icon to save names you love.
              </p>
            ) : (
              <div className="grid gap-2">
                {favorites.map((name, i) => (
                  <div
                    key={`fav-${name.name}-${name.origin}-${i}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-pink-50"
                  >
                    <div>
                      <span className="font-bold">{name.name}</span>
                      <span className="text-sm text-[var(--muted)] ml-2">— {name.meaning}</span>
                    </div>
                    <button
                      onClick={() => toggleFavorite(name)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Baby Name Generator</h2>
          <p>
            Finding the perfect baby name is one of the most exciting parts of expecting a child. Our Baby Name
            Generator helps you discover beautiful names from cultures around the world, each with its unique
            meaning and origin.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Gender Filter:</strong> Search for boy names, girl names, or browse both</li>
            <li><strong>Starting Letter:</strong> Filter names by their first letter from A to Z</li>
            <li><strong>Cultural Origins:</strong> Explore names from American, Indian, Arabic, Spanish, Japanese, European, and African traditions</li>
            <li><strong>Name Meanings:</strong> Every name comes with its beautiful meaning</li>
            <li><strong>Favorites List:</strong> Save the names you love for easy comparison</li>
          </ul>

          <h2>Tips for Choosing a Baby Name</h2>
          <ul>
            <li>Consider how the name sounds with your last name</li>
            <li>Think about potential nicknames</li>
            <li>Check the meaning and cultural significance</li>
            <li>Say it out loud to hear how it flows</li>
            <li>Consider how easy it is to spell and pronounce</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Baby Name Generator",
            description: META.description,
            url: `${SITE_URL}/tools/baby-name-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
