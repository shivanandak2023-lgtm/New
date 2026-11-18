"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Miles Per Gallon Calculator - MPG & Fuel Cost Calculator",
  description:
    "Free MPG calculator to measure your vehicle's fuel efficiency. Calculate miles per gallon, cost per mile, and trip fuel costs.",
  keywords:
    "mpg calculator, miles per gallon, fuel efficiency calculator, gas mileage calculator, fuel economy, cost per mile, trip fuel cost",
};

export default function MilesPerGallonCalculatorPage() {
  const [milesDriven, setMilesDriven] = useState<string>("300");
  const [gallonsUsed, setGallonsUsed] = useState<string>("10");
  const [gasPrice, setGasPrice] = useState<string>("3.50");
  const [tripDistance, setTripDistance] = useState<string>("500");
  const [tripMpg, setTripMpg] = useState<string>("30");
  const [tripGasPrice, setTripGasPrice] = useState<string>("3.50");

  const [result, setResult] = useState<{
    mpg: number;
    costPerMile: number;
    gallonsPer100: number;
    kml: number;
  } | null>(null);

  const [tripResult, setTripResult] = useState<{
    gallonsNeeded: number;
    tripCost: number;
  } | null>(null);

  function calculateMpg() {
    const miles = parseFloat(milesDriven);
    const gallons = parseFloat(gallonsUsed);
    const price = parseFloat(gasPrice) || 0;

    if (!miles || !gallons || miles <= 0 || gallons <= 0) return;

    const mpg = miles / gallons;
    setResult({
      mpg,
      costPerMile: price > 0 ? price / mpg : 0,
      gallonsPer100: (100 / mpg),
      kml: mpg * 0.425144,
    });
  }

  function calculateTrip() {
    const dist = parseFloat(tripDistance);
    const mpg = parseFloat(tripMpg);
    const price = parseFloat(tripGasPrice);

    if (!dist || !mpg || !price || dist <= 0 || mpg <= 0 || price <= 0) return;

    const gallonsNeeded = dist / mpg;
    setTripResult({
      gallonsNeeded,
      tripCost: gallonsNeeded * price,
    });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/miles-per-gallon-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/miles-per-gallon-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Miles Per Gallon Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate your vehicle&apos;s fuel efficiency in MPG, cost per mile, and estimate fuel costs for any trip.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">MPG Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Miles Driven</label>
              <input
                type="number"
                value={milesDriven}
                onChange={(e) => setMilesDriven(e.target.value)}
                className="input-field"
                placeholder="e.g., 300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gallons Used</label>
              <input
                type="number"
                value={gallonsUsed}
                onChange={(e) => setGallonsUsed(e.target.value)}
                className="input-field"
                placeholder="e.g., 10"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gas Price ($/gallon)</label>
              <input
                type="number"
                value={gasPrice}
                onChange={(e) => setGasPrice(e.target.value)}
                className="input-field"
                placeholder="e.g., 3.50"
                step="0.01"
              />
            </div>
          </div>

          <button onClick={calculateMpg} className="btn-primary mt-6">
            Calculate MPG
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">MPG</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{result.mpg.toFixed(1)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Cost per Mile</p>
                <p className="text-2xl font-bold text-green-700">{result.costPerMile > 0 ? fmtExact(result.costPerMile) : "N/A"}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Gal / 100 mi</p>
                <p className="text-2xl font-bold">{result.gallonsPer100.toFixed(2)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">km/L</p>
                <p className="text-2xl font-bold">{result.kml.toFixed(1)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Trip Cost Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Trip Distance (miles)</label>
              <input
                type="number"
                value={tripDistance}
                onChange={(e) => setTripDistance(e.target.value)}
                className="input-field"
                placeholder="e.g., 500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Vehicle MPG</label>
              <input
                type="number"
                value={tripMpg}
                onChange={(e) => setTripMpg(e.target.value)}
                className="input-field"
                placeholder="e.g., 30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gas Price ($/gallon)</label>
              <input
                type="number"
                value={tripGasPrice}
                onChange={(e) => setTripGasPrice(e.target.value)}
                className="input-field"
                placeholder="e.g., 3.50"
                step="0.01"
              />
            </div>
          </div>

          <button onClick={calculateTrip} className="btn-primary mt-6">
            Calculate Trip Cost
          </button>
        </div>

        {tripResult && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Gallons Needed</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{tripResult.gallonsNeeded.toFixed(1)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Estimated Trip Cost</p>
                <p className="text-2xl font-bold text-green-700">{fmtExact(tripResult.tripCost)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Average MPG by Vehicle Type</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--muted-bg)]">
                <th className="border border-[var(--card-border)] px-3 py-2 text-left">Vehicle Type</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-right">City MPG</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-right">Highway MPG</th>
                <th className="border border-[var(--card-border)] px-3 py-2 text-right">Combined MPG</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: "Compact Car", city: 30, hwy: 38, combined: 33 },
                { type: "Midsize Sedan", city: 28, hwy: 36, combined: 31 },
                { type: "SUV", city: 22, hwy: 28, combined: 24 },
                { type: "Pickup Truck", city: 18, hwy: 24, combined: 20 },
                { type: "Minivan", city: 20, hwy: 28, combined: 23 },
                { type: "Hybrid", city: 50, hwy: 45, combined: 48 },
              ].map((v) => (
                <tr key={v.type} className="hover:bg-[var(--muted-bg)]">
                  <td className="border border-[var(--card-border)] px-3 py-2">{v.type}</td>
                  <td className="border border-[var(--card-border)] px-3 py-2 text-right">{v.city}</td>
                  <td className="border border-[var(--card-border)] px-3 py-2 text-right">{v.hwy}</td>
                  <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{v.combined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Miles Per Gallon</h2>
          <p>
            MPG (Miles Per Gallon) measures how far your vehicle can travel on one gallon of fuel. To calculate MPG,
            fill up your tank, reset your trip odometer, drive normally, then fill up again and note the miles driven
            and gallons used.
          </p>

          <h2>The MPG Formula</h2>
          <p><strong>MPG = Miles Driven / Gallons Used</strong></p>
          <p>For example, 300 miles / 10 gallons = 30 MPG</p>

          <h2>How to Calculate Cost Per Mile</h2>
          <p><strong>Cost Per Mile = Gas Price / MPG</strong></p>
          <p>For example, $3.50 / 30 MPG = $0.117 per mile</p>

          <h3>Tips to Improve Your MPG</h3>
          <ul>
            <li>Keep tires properly inflated to the recommended pressure</li>
            <li>Avoid aggressive acceleration and hard braking</li>
            <li>Use cruise control on the highway</li>
            <li>Remove excess weight and roof racks when not in use</li>
            <li>Keep up with regular maintenance (oil changes, air filters)</li>
          </ul>

          <h3>City vs Highway MPG</h3>
          <p>
            Highway driving typically yields better fuel economy than city driving because you maintain a constant speed
            with fewer stops and starts. Most vehicles get 20-30% better MPG on the highway.
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
            name: "Miles Per Gallon Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/miles-per-gallon-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
