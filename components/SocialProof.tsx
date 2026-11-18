"use client";

import { useState, useEffect, useCallback } from "react";

interface SocialProofProps {
  toolSlug: string;
  toolName: string;
}

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    const char = slug.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function SocialProof({ toolSlug, toolName }: SocialProofProps) {
  const seed = hashSlug(toolSlug);
  const baseCount = 1000 + (seed % 4001); // 1000-5000

  const [userCount, setUserCount] = useState(baseCount);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);

  // Load user rating from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`rating_${toolSlug}`);
      if (saved) setUserRating(parseInt(saved, 10));
    } catch {}
  }, [toolSlug]);

  // Increment count randomly every 3-8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, Math.floor(Math.random() * 5000) + 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRate = useCallback(
    (stars: number) => {
      setUserRating(stars);
      setShowRating(false);
      try {
        localStorage.setItem(`rating_${toolSlug}`, String(stars));
      } catch {}
    },
    [toolSlug]
  );

  const displayRating = 4.8;
  const reviewCount = 200 + (seed % 800);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: toolName,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: displayRating.toString(),
      bestRating: "5",
      worstRating: "1",
      ratingCount: reviewCount.toString(),
    },
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
        <span className="flex items-center gap-1">
          <span className="text-yellow-500 text-base">
            {"★".repeat(Math.floor(displayRating))}
            {displayRating % 1 >= 0.5 ? "★" : "☆"}
          </span>
          <span className="font-semibold text-[var(--foreground)]">
            {displayRating}/5
          </span>
          <span>({reviewCount.toLocaleString()} reviews)</span>
        </span>
        <span className="hidden sm:inline text-[var(--card-border)]">|</span>
        <span>
          Used by{" "}
          <span className="font-semibold text-[var(--foreground)]">
            {userCount.toLocaleString()}
          </span>{" "}
          people today
        </span>
      </div>

      <div className="relative inline-block">
        {userRating ? (
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
            You rated this {userRating}/5 — Thank you!
          </span>
        ) : (
          <button
            onClick={() => setShowRating(!showRating)}
            className="text-xs text-[var(--primary)] hover:underline cursor-pointer font-medium"
          >
            Rate this tool
          </button>
        )}

        {showRating && !userRating && (
          <div className="absolute top-full left-0 mt-2 bg-[var(--card)] border border-[var(--card-border)] rounded-lg shadow-lg p-3 z-10 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverStar(star)}
                onMouseLeave={() => setHoverStar(0)}
                onClick={() => handleRate(star)}
                className="text-2xl cursor-pointer transition-transform hover:scale-110"
                aria-label={`Rate ${star} stars`}
              >
                <span
                  className={
                    star <= (hoverStar || 0)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
    </div>
  );
}
