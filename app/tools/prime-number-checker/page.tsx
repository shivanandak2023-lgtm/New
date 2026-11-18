"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Prime Number Checker - Test, List & Visualize Primes",
  description:
    "Check if a number is prime, find all its factors, generate primes up to N, find the Nth prime, and visualize the Sieve of Eratosthenes.",
  keywords:
    "prime number checker, is it prime, prime number list, prime factorization, sieve of eratosthenes, nth prime number, prime number generator",
};

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function getFactors(n: number): number[] {
  if (n < 1) return [];
  const factors: number[] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      factors.push(i);
      if (i !== n / i) factors.push(n / i);
    }
  }
  return factors.sort((a, b) => a - b);
}

function primesUpTo(max: number): number[] {
  if (max < 2) return [];
  const sieve = new Array(max + 1).fill(true);
  sieve[0] = sieve[1] = false;
  for (let i = 2; i * i <= max; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= max; j += i) sieve[j] = false;
    }
  }
  return sieve.reduce<number[]>((acc, val, idx) => (val ? [...acc, idx] : acc), []);
}

function nthPrime(n: number): number {
  if (n < 1) return 0;
  let count = 0;
  let num = 1;
  while (count < n) {
    num++;
    if (isPrime(num)) count++;
  }
  return num;
}

type Tab = "check" | "list" | "nth" | "sieve";

export default function PrimeNumberCheckerPage() {
  const [tab, setTab] = useState<Tab>("check");
  const [checkInput, setCheckInput] = useState("97");
  const [listInput, setListInput] = useState("100");
  const [nthInput, setNthInput] = useState("25");
  const [sieveInput, setSieveInput] = useState("100");

  const checkNum = parseInt(checkInput) || 0;
  const listMax = Math.min(parseInt(listInput) || 0, 10000);
  const nthVal = Math.min(parseInt(nthInput) || 0, 1000);
  const sieveMax = Math.min(parseInt(sieveInput) || 0, 200);

  const checkResult = useMemo(() => {
    if (checkNum < 1) return null;
    const prime = isPrime(checkNum);
    const factors = getFactors(checkNum);
    return { prime, factors };
  }, [checkNum]);

  const primeList = useMemo(() => (listMax >= 2 ? primesUpTo(listMax) : []), [listMax]);
  const nthPrimeResult = useMemo(() => (nthVal >= 1 ? nthPrime(nthVal) : 0), [nthVal]);

  const sieveData = useMemo(() => {
    if (sieveMax < 2) return [];
    const sieve = new Array(sieveMax + 1).fill(true);
    sieve[0] = sieve[1] = false;
    for (let i = 2; i * i <= sieveMax; i++) {
      if (sieve[i]) {
        for (let j = i * i; j <= sieveMax; j += i) sieve[j] = false;
      }
    }
    return sieve;
  }, [sieveMax]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "check", label: "Check Prime" },
    { key: "list", label: "Prime List" },
    { key: "nth", label: "Nth Prime" },
    { key: "sieve", label: "Sieve" },
  ];

  const primeFacts = [
    "2 is the only even prime number.",
    "There are infinitely many prime numbers (proved by Euclid ~300 BC).",
    "The largest known prime (as of 2024) has over 41 million digits.",
    "1 is not considered a prime number.",
    "Every integer greater than 1 can be uniquely expressed as a product of primes.",
    "Twin primes are pairs like (11, 13) that differ by 2.",
  ];

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/prime-number-checker`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Prime Number Checker</h1>
        <p className="text-[var(--muted)] mb-8">
          Check if a number is prime, generate prime lists, find the Nth prime, and visualize the Sieve of Eratosthenes.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                  tab === t.key
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "check" && (
            <div>
              <label className="block text-sm font-medium mb-1">Enter a Number</label>
              <input
                type="number"
                value={checkInput}
                onChange={(e) => setCheckInput(e.target.value)}
                className="input-field text-lg"
                placeholder="e.g. 97"
              />
            </div>
          )}

          {tab === "list" && (
            <div>
              <label className="block text-sm font-medium mb-1">Generate primes up to (max 10,000)</label>
              <input
                type="number"
                value={listInput}
                onChange={(e) => setListInput(e.target.value)}
                className="input-field"
                max="10000"
                placeholder="e.g. 100"
              />
            </div>
          )}

          {tab === "nth" && (
            <div>
              <label className="block text-sm font-medium mb-1">Find the Nth prime (max 1,000)</label>
              <input
                type="number"
                value={nthInput}
                onChange={(e) => setNthInput(e.target.value)}
                className="input-field"
                max="1000"
                placeholder="e.g. 25"
              />
            </div>
          )}

          {tab === "sieve" && (
            <div>
              <label className="block text-sm font-medium mb-1">Sieve up to (max 200)</label>
              <input
                type="number"
                value={sieveInput}
                onChange={(e) => setSieveInput(e.target.value)}
                className="input-field"
                max="200"
                placeholder="e.g. 100"
              />
            </div>
          )}
        </div>

        {tab === "check" && checkResult && checkNum >= 2 && (
          <div className="mb-8">
            <div className="result-card text-center mb-4">
              <p className="text-4xl font-bold mb-2" style={{ color: checkResult.prime ? "#16a34a" : "#dc2626" }}>
                {checkNum.toLocaleString()}
              </p>
              <p className="text-lg font-semibold" style={{ color: checkResult.prime ? "#16a34a" : "#dc2626" }}>
                {checkResult.prime ? "is a Prime Number" : "is NOT a Prime Number"}
              </p>
            </div>
            {!checkResult.prime && (
              <div className="tool-card">
                <h3 className="text-sm font-bold mb-2">Factors of {checkNum}</h3>
                <p className="text-sm text-[var(--muted)]">{checkResult.factors.join(", ")}</p>
              </div>
            )}
          </div>
        )}

        {tab === "check" && checkNum === 1 && (
          <div className="result-card text-center mb-8">
            <p className="text-lg font-semibold text-amber-600">1 is neither prime nor composite by definition.</p>
          </div>
        )}

        {tab === "list" && primeList.length > 0 && (
          <div className="mb-8">
            <div className="result-card">
              <p className="text-sm text-[var(--muted)] mb-2">
                Found {primeList.length} primes up to {listMax.toLocaleString()}
              </p>
              <div className="flex flex-wrap gap-2">
                {primeList.map((p) => (
                  <span key={p} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm font-mono">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "nth" && nthVal >= 1 && (
          <div className="mb-8">
            <div className="result-card text-center">
              <p className="text-sm text-[var(--muted)] mb-1">The {nthVal}{nthVal === 1 ? "st" : nthVal === 2 ? "nd" : nthVal === 3 ? "rd" : "th"} prime number is</p>
              <p className="text-4xl font-bold text-[var(--primary)]">{nthPrimeResult.toLocaleString()}</p>
            </div>
          </div>
        )}

        {tab === "sieve" && sieveData.length > 0 && (
          <div className="mb-8">
            <div className="result-card">
              <p className="text-sm text-[var(--muted)] mb-4">Sieve of Eratosthenes (2 to {sieveMax})</p>
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(sieveMax <= 50 ? 10 : 15, 15)}, minmax(0, 1fr))` }}>
                {sieveData.map((isPrimeVal, idx) => {
                  if (idx < 2) return (
                    <div key={idx} className="w-full aspect-square flex items-center justify-center rounded text-xs font-mono bg-gray-100 text-gray-400">
                      {idx}
                    </div>
                  );
                  return (
                    <div
                      key={idx}
                      className={`w-full aspect-square flex items-center justify-center rounded text-xs font-mono font-bold ${
                        isPrimeVal
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {idx}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-3 text-xs text-[var(--muted)]">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded inline-block"></span> Prime</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-100 rounded inline-block border"></span> Composite</span>
              </div>
            </div>
          </div>
        )}

        {/* Fun facts */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Fun Prime Facts</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-[var(--muted)]">
            {primeFacts.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is a Prime Number?</h2>
          <p>
            A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. The first few primes are 2, 3, 5, 7, 11, 13, 17, 19, 23, and 29. Prime numbers are the building blocks of all natural numbers.
          </p>

          <h2>The Sieve of Eratosthenes</h2>
          <p>
            The Sieve of Eratosthenes is an ancient algorithm for finding all primes up to a given limit. It works by iteratively marking the multiples of each prime as composite, starting from 2. It was described by the Greek mathematician Eratosthenes around 240 BC and remains one of the most efficient ways to find small primes.
          </p>

          <h3>How to Check if a Number is Prime</h3>
          <p>
            To check if n is prime, test divisibility by all integers from 2 up to the square root of n. If none divide evenly, the number is prime. This works because if n has a factor larger than its square root, the corresponding co-factor must be smaller.
          </p>

          <h3>Applications of Prime Numbers</h3>
          <p>
            Prime numbers are fundamental in cryptography (RSA encryption), hash functions, random number generation, and error-correcting codes. They also play a key role in number theory and abstract algebra.
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
            name: "Prime Number Checker",
            description: META.description,
            url: `${SITE_URL}/tools/prime-number-checker`,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
