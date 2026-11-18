"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Dog Age Calculator - Convert Dog Years to Human Years",
  description:
    "Free dog age calculator. Convert your dog's age to human years using updated science-based formula. Accounts for breed size with life stage and lifespan info.",
  keywords:
    "dog age calculator, dog years to human years, how old is my dog in human years, dog age chart, dog year calculator, puppy age calculator, dog lifespan calculator, pet age calculator",
};

const SIZE_CATEGORIES: { key: string; label: string; description: string; yearlyRate: number; avgLifespan: number }[] = [
  { key: "small", label: "Small", description: "Under 20 lbs (Chihuahua, Pomeranian, Yorkie)", yearlyRate: 4, avgLifespan: 14 },
  { key: "medium", label: "Medium", description: "20-50 lbs (Beagle, Cocker Spaniel, Bulldog)", yearlyRate: 5, avgLifespan: 12 },
  { key: "large", label: "Large", description: "50-90 lbs (Lab, Golden Retriever, German Shepherd)", yearlyRate: 6, avgLifespan: 10 },
  { key: "giant", label: "Giant", description: "90+ lbs (Great Dane, Mastiff, Saint Bernard)", yearlyRate: 7, avgLifespan: 8 },
];

function getLifeStage(humanAge: number): { stage: string; color: string } {
  if (humanAge < 15) return { stage: "Puppy", color: "text-blue-600" };
  if (humanAge < 24) return { stage: "Junior", color: "text-green-600" };
  if (humanAge < 50) return { stage: "Adult", color: "text-yellow-700" };
  if (humanAge < 75) return { stage: "Senior", color: "text-orange-600" };
  return { stage: "Geriatric", color: "text-red-600" };
}

function calcHumanAge(dogYears: number, dogMonths: number, sizeKey: string): number {
  const size = SIZE_CATEGORIES.find((s) => s.key === sizeKey) || SIZE_CATEGORIES[1];
  const totalDogYears = dogYears + dogMonths / 12;

  if (totalDogYears <= 0) return 0;
  if (totalDogYears <= 1) return totalDogYears * 15;
  if (totalDogYears <= 2) return 15 + (totalDogYears - 1) * 9;
  return 15 + 9 + (totalDogYears - 2) * size.yearlyRate;
}

const FUN_FACTS = [
  "A dog's first year equals roughly 15 human years — they grow up fast!",
  "Small dogs tend to live longer than large dogs, though scientists aren't entirely sure why.",
  "The oldest verified dog ever was an Australian Cattle Dog named Bluey who lived 29 years and 5 months.",
  "Dogs age at different rates depending on their size — giant breeds age the fastest.",
  "A 2-year-old dog is roughly equivalent to a 24-year-old human, not 14 as the old '7x' myth suggests.",
  "Large breed puppies take longer to mature physically but age faster after their second year.",
];

export default function DogAgeCalculatorPage() {
  const [dogYears, setDogYears] = useState("5");
  const [dogMonths, setDogMonths] = useState("0");
  const [breedSize, setBreedSize] = useState("medium");

  const years = Math.max(0, parseInt(dogYears) || 0);
  const months = Math.max(0, Math.min(11, parseInt(dogMonths) || 0));
  const humanAge = calcHumanAge(years, months, breedSize);
  const lifeStage = getLifeStage(humanAge);
  const size = SIZE_CATEGORIES.find((s) => s.key === breedSize)!;

  // Build comparison table
  const comparisonAges = [1, 2, 3, 5, 7, 10, 13, 15];

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/dog-age-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/dog-age-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Dog Age Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Find out how old your dog is in human years using the updated formula that accounts for breed size. The old &quot;multiply by 7&quot; rule is a myth!
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Dog&apos;s Age (Years)</label>
              <input type="number" value={dogYears} onChange={(e) => setDogYears(e.target.value)} className="input-field" min="0" max="30" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Months</label>
              <input type="number" value={dogMonths} onChange={(e) => setDogMonths(e.target.value)} className="input-field" min="0" max="11" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Breed Size</label>
              <select value={breedSize} onChange={(e) => setBreedSize(e.target.value)} className="input-field">
                {SIZE_CATEGORIES.map((s) => (
                  <option key={s.key} value={s.key}>{s.label} — {s.description}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {(years > 0 || months > 0) && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Human Equivalent Age</p>
                <p className="text-3xl font-bold text-green-700">{humanAge.toFixed(1)} years</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Life Stage</p>
                <p className={`text-2xl font-bold ${lifeStage.color}`}>{lifeStage.stage}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Breed Avg Lifespan</p>
                <p className="text-2xl font-bold text-amber-700">{size.avgLifespan} years</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Dog-to-Human Age Comparison by Size</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Dog Age</th>
                      {SIZE_CATEGORIES.map((s) => (
                        <th key={s.key} className={`border border-[var(--card-border)] px-3 py-2 text-right ${s.key === breedSize ? "bg-blue-50 font-bold" : ""}`}>
                          {s.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonAges.map((age) => (
                      <tr key={age} className={`hover:bg-[var(--muted-bg)] ${age === years ? "bg-green-50 font-semibold" : ""}`}>
                        <td className="border border-[var(--card-border)] px-3 py-2">{age} year{age !== 1 ? "s" : ""}</td>
                        {SIZE_CATEGORIES.map((s) => (
                          <td key={s.key} className={`border border-[var(--card-border)] px-3 py-2 text-right ${s.key === breedSize ? "bg-blue-50" : ""}`}>
                            {calcHumanAge(age, 0, s.key).toFixed(0)} human yrs
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Life Stages</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { stage: "Puppy", range: "0-15 human yrs", color: "bg-blue-50 border-blue-200" },
                  { stage: "Junior", range: "15-24 human yrs", color: "bg-green-50 border-green-200" },
                  { stage: "Adult", range: "24-50 human yrs", color: "bg-yellow-50 border-yellow-200" },
                  { stage: "Senior", range: "50-75 human yrs", color: "bg-orange-50 border-orange-200" },
                  { stage: "Geriatric", range: "75+ human yrs", color: "bg-red-50 border-red-200" },
                ].map((s) => (
                  <div key={s.stage} className={`p-3 rounded-lg border ${s.color} text-center ${lifeStage.stage === s.stage ? "ring-2 ring-[var(--primary)]" : ""}`}>
                    <p className="font-bold text-sm">{s.stage}</p>
                    <p className="text-xs text-[var(--muted)]">{s.range}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="result-card mb-6" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
              <h3 className="font-bold mb-2">Fun Facts About Dog Aging</h3>
              <ul className="text-sm space-y-2">
                {FUN_FACTS.map((fact, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-blue-500 font-bold">&bull;</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Dog Age Calculator: The Truth About Dog Years</h2>
          <p>
            For decades, people have used the simple &quot;multiply by 7&quot; rule to convert dog years to human years.
            However, veterinary science has shown that this method is inaccurate. Dogs mature much faster in their first two
            years of life and then age at different rates depending on their breed size. This dog age calculator uses the
            updated, scientifically-backed formula to give you a more accurate conversion from dog years to human years.
          </p>

          <h2>How the Updated Dog Age Formula Works</h2>
          <p>
            The modern approach to calculating a dog&apos;s age in human years recognizes three phases of aging. The first year
            of a dog&apos;s life is equivalent to approximately 15 human years — a one-year-old dog is essentially a teenager.
            The second year adds about 9 more human years, making a two-year-old dog roughly 24 in human terms. After age
            two, each additional year varies by breed size: small dogs age about 4 human years per dog year, medium dogs age
            about 5, large dogs about 6, and giant breeds about 7.
          </p>

          <h2>Why Breed Size Matters</h2>
          <p>
            Smaller dogs tend to live significantly longer than larger dogs. A Chihuahua or toy poodle may live 14 to 18 years,
            while a Great Dane typically lives only 7 to 10 years. Scientists believe this is because larger dogs grow more
            rapidly, putting greater stress on their bodies and potentially accelerating age-related diseases. Giant breed dogs
            reach their senior years much earlier, which is why their yearly aging rate in human years is higher.
          </p>

          <h2>Dog Life Stages Explained</h2>
          <p>
            Understanding your dog&apos;s life stage helps you provide appropriate care. Puppies (up to 15 human years
            equivalent) need frequent meals, socialization, and training. Junior dogs (15 to 24 human years) are still
            energetic but reaching physical maturity. Adult dogs (24 to 50 human years) are in their prime and need regular
            exercise and preventive care. Senior dogs (50 to 75 human years) may slow down and need more veterinary checkups.
            Geriatric dogs (75+ human years) require special attention to comfort, mobility, and age-related conditions.
          </p>

          <h2>Average Lifespan by Breed Size</h2>
          <p>
            Small breeds (under 20 pounds) typically live 12 to 16 years. Medium breeds (20 to 50 pounds) average 10 to 14
            years. Large breeds (50 to 90 pounds) usually live 8 to 12 years. Giant breeds (over 90 pounds) have the shortest
            lifespans, averaging 6 to 10 years. Mixed breed dogs often live slightly longer than purebreds of similar size
            due to greater genetic diversity, a phenomenon known as hybrid vigor.
          </p>

          <h3>Tips for Helping Your Dog Age Well</h3>
          <p>
            Regular veterinary checkups, a balanced diet appropriate for your dog&apos;s size and age, daily exercise, dental
            care, and mental stimulation can all help your dog live a longer, healthier life. Senior dogs benefit from
            joint supplements, orthopedic beds, and shorter but more frequent walks. Maintaining a healthy weight is one of
            the most important things you can do — studies show that lean dogs live an average of two years longer than
            overweight dogs.
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
            name: "Dog Age Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/dog-age-calculator`,
            applicationCategory: "LifestyleApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
