"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "World Clock - Current Time in Major Cities Worldwide",
  description:
    "Free World Clock showing current time in 20+ major cities worldwide. Live updating, grouped by continent, search and filter cities, add favorites.",
  keywords: "world clock, current time, time zones, international clock, world time, city time",
};

interface CityInfo {
  city: string;
  timezone: string;
  continent: string;
}

const CITIES: CityInfo[] = [
  // Americas
  { city: "New York", timezone: "America/New_York", continent: "Americas" },
  { city: "Los Angeles", timezone: "America/Los_Angeles", continent: "Americas" },
  { city: "Chicago", timezone: "America/Chicago", continent: "Americas" },
  { city: "Toronto", timezone: "America/Toronto", continent: "Americas" },
  { city: "Mexico City", timezone: "America/Mexico_City", continent: "Americas" },
  { city: "Sao Paulo", timezone: "America/Sao_Paulo", continent: "Americas" },
  { city: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires", continent: "Americas" },
  // Europe
  { city: "London", timezone: "Europe/London", continent: "Europe" },
  { city: "Paris", timezone: "Europe/Paris", continent: "Europe" },
  { city: "Berlin", timezone: "Europe/Berlin", continent: "Europe" },
  { city: "Moscow", timezone: "Europe/Moscow", continent: "Europe" },
  { city: "Istanbul", timezone: "Europe/Istanbul", continent: "Europe" },
  { city: "Madrid", timezone: "Europe/Madrid", continent: "Europe" },
  // Asia
  { city: "Dubai", timezone: "Asia/Dubai", continent: "Asia" },
  { city: "Mumbai", timezone: "Asia/Kolkata", continent: "Asia" },
  { city: "Singapore", timezone: "Asia/Singapore", continent: "Asia" },
  { city: "Hong Kong", timezone: "Asia/Hong_Kong", continent: "Asia" },
  { city: "Shanghai", timezone: "Asia/Shanghai", continent: "Asia" },
  { city: "Tokyo", timezone: "Asia/Tokyo", continent: "Asia" },
  { city: "Seoul", timezone: "Asia/Seoul", continent: "Asia" },
  { city: "Bangkok", timezone: "Asia/Bangkok", continent: "Asia" },
  // Oceania & Africa
  { city: "Sydney", timezone: "Australia/Sydney", continent: "Oceania" },
  { city: "Auckland", timezone: "Pacific/Auckland", continent: "Oceania" },
  { city: "Cairo", timezone: "Africa/Cairo", continent: "Africa" },
  { city: "Lagos", timezone: "Africa/Lagos", continent: "Africa" },
  { city: "Johannesburg", timezone: "Africa/Johannesburg", continent: "Africa" },
];

const CONTINENTS = ["Americas", "Europe", "Asia", "Oceania", "Africa"];

function getTimeForTimezone(date: Date, timezone: string) {
  try {
    return date.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return "--:--:--";
  }
}

function getDateForTimezone(date: Date, timezone: string) {
  try {
    return date.toLocaleDateString("en-US", {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function WorldClockPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("worldclock-favorites");
      if (saved) setFavorites(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleFavorite = (city: string) => {
    setFavorites((prev) => {
      const next = prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city];
      try { localStorage.setItem("worldclock-favorites", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const filteredCities = CITIES.filter((c) =>
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.continent.toLowerCase().includes(search.toLowerCase())
  );

  const favoriteCities = CITIES.filter((c) => favorites.includes(c.city));

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/world-clock`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/world-clock`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">World Clock</h1>
        <p className="text-[var(--muted)] mb-8">
          Current time in 26 major cities worldwide. Live updating every second.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field text-sm"
            placeholder="Search cities or continents..."
          />
        </div>

        {favoriteCities.length > 0 && !search && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3">Favorites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {favoriteCities.map((c) => (
                <div key={c.city} className="tool-card py-3 px-4 flex items-center justify-between border-l-4 border-[var(--primary)]">
                  <div>
                    <p className="font-semibold text-sm">{c.city}</p>
                    <p className="text-xl font-bold font-mono text-[var(--primary)]">
                      {now ? getTimeForTimezone(now, c.timezone) : "--:--:--"}
                    </p>
                    <p className="text-xs text-[var(--muted)]">{now ? getDateForTimezone(now, c.timezone) : ""}</p>
                  </div>
                  <button onClick={() => toggleFavorite(c.city)} className="text-yellow-500 text-lg" title="Remove from favorites">
                    &#9733;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {search ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {filteredCities.map((c) => (
              <div key={c.city} className="tool-card py-3 px-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{c.city}</p>
                  <p className="text-xl font-bold font-mono text-[var(--primary)]">
                    {now ? getTimeForTimezone(now, c.timezone) : "--:--:--"}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{now ? getDateForTimezone(now, c.timezone) : ""}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(c.city)}
                  className={`text-lg ${favorites.includes(c.city) ? "text-yellow-500" : "text-gray-300"}`}
                  title={favorites.includes(c.city) ? "Remove from favorites" : "Add to favorites"}
                >
                  {favorites.includes(c.city) ? "\u2605" : "\u2606"}
                </button>
              </div>
            ))}
            {filteredCities.length === 0 && (
              <p className="text-sm text-[var(--muted)] col-span-full text-center py-4">No cities found.</p>
            )}
          </div>
        ) : (
          CONTINENTS.map((continent) => {
            const cities = CITIES.filter((c) => c.continent === continent);
            return (
              <div key={continent} className="mb-6">
                <h2 className="text-lg font-bold mb-3">{continent}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {cities.map((c) => (
                    <div key={c.city} className="tool-card py-3 px-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{c.city}</p>
                        <p className="text-xl font-bold font-mono text-[var(--primary)]">
                          {now ? getTimeForTimezone(now, c.timezone) : "--:--:--"}
                        </p>
                        <p className="text-xs text-[var(--muted)]">{now ? getDateForTimezone(now, c.timezone) : ""}</p>
                      </div>
                      <button
                        onClick={() => toggleFavorite(c.city)}
                        className={`text-lg ${favorites.includes(c.city) ? "text-yellow-500" : "text-gray-300"}`}
                        title={favorites.includes(c.city) ? "Remove from favorites" : "Add to favorites"}
                      >
                        {favorites.includes(c.city) ? "\u2605" : "\u2606"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>World Clock Tool</h2>
          <p>
            See the current time in over 26 major cities across all continents. The clock updates every second
            with accurate time zone data from your browser.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Live Updating:</strong> Time refreshes every second</li>
            <li><strong>26+ Cities:</strong> Major cities across Americas, Europe, Asia, Oceania, and Africa</li>
            <li><strong>Search:</strong> Quickly find any city or continent</li>
            <li><strong>Favorites:</strong> Star your most-used cities for quick access (saved to browser)</li>
            <li><strong>Date Display:</strong> Shows the current date alongside the time for each city</li>
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
            name: "World Clock",
            description: META.description,
            url: `${SITE_URL}/tools/world-clock`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
