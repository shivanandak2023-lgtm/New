"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Fuel Cost Calculator - Trip Gas & Petrol Cost Estimator",
  description:
    "Free fuel cost calculator to estimate gas or petrol expenses for any trip. Supports miles/gallons (US) and kilometers/liters (metric). Calculate fuel needed and total cost.",
  keywords:
    "fuel cost calculator, gas cost calculator, trip fuel calculator, petrol cost calculator, fuel expense calculator, gas trip calculator, fuel consumption calculator",
};

type UnitSystem = "us" | "metric";

export default function FuelCostCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("us");
  const [distance, setDistance] = useState<string>("300");
  const [efficiency, setEfficiency] = useState<string>("25");
  const [fuelPrice, setFuelPrice] = useState<string>("3.50");
  const [result, setResult] = useState<{
    fuelNeeded: number;
    totalCost: number;
    costPerMile: number;
  } | null>(null);

  function calculate() {
    const dist = parseFloat(distance);
    const eff = parseFloat(efficiency);
    const price = parseFloat(fuelPrice);

    if (!dist || !eff || !price || dist <= 0 || eff <= 0 || price <= 0) return;

    const fuelNeeded = dist / eff;
    const totalCost = fuelNeeded * price;
    const costPerUnit = totalCost / dist;

    setResult({
      fuelNeeded: Math.round(fuelNeeded * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      costPerMile: Math.round(costPerUnit * 100) / 100,
    });
  }

  const distLabel = unitSystem === "us" ? "miles" : "km";
  const effLabel = unitSystem === "us" ? "MPG (miles per gallon)" : "km/L (kilometers per liter)";
  const fuelUnit = unitSystem === "us" ? "gallons" : "liters";
  const priceLabel = unitSystem === "us" ? `${currency.symbol}/gallon` : `${currency.symbol}/liter`;
  const perDistLabel = unitSystem === "us" ? "per mile" : "per km";

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmt = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/fuel-cost-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Fuel Cost Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Estimate how much fuel you need and what it will cost for your trip. Supports both US (miles/gallons) and metric (kilometers/liters) units.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Unit System</label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setUnitSystem("us");
                  setDistance("300");
                  setEfficiency("25");
                  setFuelPrice("3.50");
                  setResult(null);
                }}
                className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                  unitSystem === "us"
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
              >
                US (miles / gallons)
              </button>
              <button
                onClick={() => {
                  setUnitSystem("metric");
                  setDistance("500");
                  setEfficiency("12");
                  setFuelPrice("1.50");
                  setResult(null);
                }}
                className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                  unitSystem === "metric"
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-[var(--foreground)] border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
              >
                Metric (km / liters)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Distance ({distLabel})</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="input-field"
                placeholder={unitSystem === "us" ? "e.g., 300" : "e.g., 500"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fuel Efficiency ({effLabel})</label>
              <input
                type="number"
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
                className="input-field"
                step="0.1"
                placeholder={unitSystem === "us" ? "e.g., 25" : "e.g., 12"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fuel Price ({priceLabel})</label>
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                className="input-field"
                step="0.01"
                placeholder={unitSystem === "us" ? "e.g., 3.50" : "e.g., 1.50"}
              />
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Fuel Cost
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Fuel Needed</p>
                <p className="text-2xl font-bold text-[var(--primary)]">
                  {result.fuelNeeded.toFixed(2)} {fuelUnit}
                </p>
              </div>
              <div className="result-card text-center" style={{ background: "#fefce8", borderColor: "#fef08a" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Total Cost</p>
                <p className="text-2xl font-bold text-amber-700">{fmt(result.totalCost)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Cost {perDistLabel}</p>
                <p className="text-2xl font-bold text-green-700">{fmt(result.costPerMile)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick comparison table */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Fuel Cost at Different Distances</h2>
          {parseFloat(efficiency) > 0 && parseFloat(fuelPrice) > 0 ? (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Distance</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Fuel Needed</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Estimated Cost</th>
                </tr>
              </thead>
              <tbody>
                {(unitSystem === "us"
                  ? [50, 100, 200, 300, 500, 750, 1000]
                  : [50, 100, 200, 500, 750, 1000, 1500]
                ).map((d) => {
                  const eff = parseFloat(efficiency);
                  const price = parseFloat(fuelPrice);
                  const fuel = d / eff;
                  const cost = fuel * price;
                  return (
                    <tr key={d} className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">
                        {d} {distLabel}
                      </td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">
                        {fuel.toFixed(1)} {fuelUnit}
                      </td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">
                        {fmt(cost)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-[var(--muted)]">Enter fuel efficiency and price to see the comparison table.</p>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Fuel Cost for a Trip</h2>
          <p>
            The fuel cost for any trip can be calculated with a simple formula:
          </p>
          <p><strong>Fuel Cost = (Distance / Fuel Efficiency) x Fuel Price</strong></p>
          <p>
            For example, if you are driving 300 miles with a car that gets 25 MPG and gas costs $3.50 per gallon:
            (300 / 25) x $3.50 = 12 gallons x $3.50 = $42.00.
          </p>

          <h2>Average Fuel Efficiency by Vehicle Type</h2>
          <ul>
            <li><strong>Compact Car:</strong> 30-35 MPG (12-15 km/L)</li>
            <li><strong>Sedan:</strong> 25-30 MPG (10-13 km/L)</li>
            <li><strong>SUV:</strong> 20-25 MPG (8.5-10.5 km/L)</li>
            <li><strong>Truck:</strong> 15-20 MPG (6.5-8.5 km/L)</li>
            <li><strong>Hybrid:</strong> 45-55 MPG (19-23 km/L)</li>
          </ul>

          <h2>Tips to Reduce Fuel Costs</h2>
          <ul>
            <li>Maintain steady speeds and avoid rapid acceleration</li>
            <li>Keep tires properly inflated for optimal fuel efficiency</li>
            <li>Remove unnecessary weight from your vehicle</li>
            <li>Use cruise control on highways</li>
            <li>Plan your route to avoid traffic and minimize distance</li>
            <li>Keep your engine well-maintained with regular oil changes</li>
          </ul>

          <h3>US vs Metric Units</h3>
          <p>
            In the United States, fuel efficiency is measured in miles per gallon (MPG) and fuel is priced per gallon.
            Most other countries use kilometers per liter (km/L) and price fuel per liter. This calculator supports
            both systems for your convenience.
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
            name: "Fuel Cost Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/fuel-cost-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
