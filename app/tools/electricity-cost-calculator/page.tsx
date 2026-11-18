"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CurrencySelector from "@/components/CurrencySelector";
import { type Currency, getCurrencyFromStorage, formatCurrency } from "@/lib/currency";

const META = {
  title: "Electricity Cost Calculator - Calculate Appliance Energy Costs",
  description:
    "Free electricity cost calculator to estimate daily, monthly, and annual energy costs for any appliance. Includes preset wattages for common appliances.",
  keywords:
    "electricity cost calculator, electric bill calculator, power consumption calculator, kwh calculator, energy cost calculator, appliance wattage calculator",
};

interface Appliance {
  id: number;
  name: string;
  wattage: string;
  hoursPerDay: string;
  dailyKwh: number;
  monthlyKwh: number;
  annualKwh: number;
  dailyCost: number;
  monthlyCost: number;
  annualCost: number;
}

const PRESETS: { name: string; wattage: number }[] = [
  { name: "Central Air Conditioner", wattage: 3500 },
  { name: "Window AC Unit", wattage: 1500 },
  { name: "Space Heater", wattage: 1500 },
  { name: "Refrigerator", wattage: 150 },
  { name: "Freezer", wattage: 200 },
  { name: "LED TV (55\")", wattage: 100 },
  { name: "Desktop Computer", wattage: 300 },
  { name: "Laptop", wattage: 65 },
  { name: "Washing Machine", wattage: 500 },
  { name: "Dryer", wattage: 3000 },
  { name: "Dishwasher", wattage: 1800 },
  { name: "Microwave", wattage: 1200 },
  { name: "Coffee Maker", wattage: 900 },
  { name: "Hair Dryer", wattage: 1500 },
  { name: "LED Light Bulb", wattage: 10 },
  { name: "Ceiling Fan", wattage: 75 },
  { name: "Electric Oven", wattage: 2500 },
  { name: "Pool Pump", wattage: 1500 },
  { name: "EV Charger (Level 2)", wattage: 7200 },
  { name: "Custom", wattage: 0 },
];

function createAppliance(id: number): Appliance {
  return {
    id,
    name: "Central Air Conditioner",
    wattage: "3500",
    hoursPerDay: "8",
    dailyKwh: 0, monthlyKwh: 0, annualKwh: 0,
    dailyCost: 0, monthlyCost: 0, annualCost: 0,
  };
}

export default function ElectricityCostCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>(getCurrencyFromStorage);
  const [appliances, setAppliances] = useState<Appliance[]>([createAppliance(1)]);
  const [electricityRate, setElectricityRate] = useState<string>("0.16");
  const [calculated, setCalculated] = useState(false);

  function calculate() {
    const rate = parseFloat(electricityRate) || 0.16;
    const updated = appliances.map((a) => {
      const watts = parseFloat(a.wattage) || 0;
      const hours = parseFloat(a.hoursPerDay) || 0;
      const dailyKwh = (watts * hours) / 1000;
      const monthlyKwh = dailyKwh * 30;
      const annualKwh = dailyKwh * 365;
      return {
        ...a,
        dailyKwh,
        monthlyKwh,
        annualKwh,
        dailyCost: dailyKwh * rate,
        monthlyCost: monthlyKwh * rate,
        annualCost: annualKwh * rate,
      };
    });
    setAppliances(updated);
    setCalculated(true);
  }

  function updateAppliance(id: number, field: string, value: string) {
    setAppliances(appliances.map((a) => a.id === id ? { ...a, [field]: value } : a));
  }

  function selectPreset(id: number, presetName: string) {
    const preset = PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setAppliances(appliances.map((a) =>
        a.id === id ? { ...a, name: preset.name, wattage: preset.wattage > 0 ? String(preset.wattage) : a.wattage } : a
      ));
    }
  }

  function addAppliance() {
    setAppliances([...appliances, createAppliance(appliances.length + 1)]);
  }

  function removeAppliance(id: number) {
    if (appliances.length > 1) {
      setAppliances(appliances.filter((a) => a.id !== id));
    }
  }

  const totalDaily = appliances.reduce((s, a) => s + a.dailyCost, 0);
  const totalMonthly = appliances.reduce((s, a) => s + a.monthlyCost, 0);
  const totalAnnual = appliances.reduce((s, a) => s + a.annualCost, 0);
  const totalDailyKwh = appliances.reduce((s, a) => s + a.dailyKwh, 0);
  const totalMonthlyKwh = appliances.reduce((s, a) => s + a.monthlyKwh, 0);
  const totalAnnualKwh = appliances.reduce((s, a) => s + a.annualKwh, 0);

  useEffect(() => { setCurrency(getCurrencyFromStorage()); }, []);
  const fmtExact = (n: number) => formatCurrency(n, currency);

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/electricity-cost-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/electricity-cost-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Electricity Cost Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate how much electricity your appliances use and what they cost to run. Add multiple appliances to estimate your total energy bill.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <CurrencySelector onChange={setCurrency} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Electricity Rate ({currency.symbol}/kWh)</label>
              <input
                type="number"
                value={electricityRate}
                onChange={(e) => setElectricityRate(e.target.value)}
                className="input-field"
                placeholder="e.g., 0.16"
                step="0.01"
              />
              <p className="text-xs text-[var(--muted)] mt-1">US average: ~$0.16/kWh (check your electric bill)</p>
            </div>
          </div>
        </div>

        {appliances.map((appliance) => (
          <div key={appliance.id} className="tool-card mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold">Appliance {appliance.id}</span>
              {appliances.length > 1 && (
                <button onClick={() => removeAppliance(appliance.id)} className="text-red-500 text-sm hover:underline">
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Appliance Preset</label>
                <select
                  value={appliance.name}
                  onChange={(e) => selectPreset(appliance.id, e.target.value)}
                  className="input-field"
                >
                  {PRESETS.map((p) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Wattage (W)</label>
                <input
                  type="number"
                  value={appliance.wattage}
                  onChange={(e) => updateAppliance(appliance.id, "wattage", e.target.value)}
                  className="input-field"
                  placeholder="e.g., 1500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hours Used per Day</label>
                <input
                  type="number"
                  value={appliance.hoursPerDay}
                  onChange={(e) => updateAppliance(appliance.id, "hoursPerDay", e.target.value)}
                  className="input-field"
                  placeholder="e.g., 8"
                  step="0.5"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-4 mb-6">
          <button onClick={addAppliance} className="text-sm text-[var(--primary)] hover:underline">
            + Add Another Appliance
          </button>
        </div>

        <div className="tool-card mb-8">
          <button onClick={calculate} className="btn-primary">
            Calculate Electricity Cost
          </button>
        </div>

        {calculated && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Daily Cost</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmtExact(totalDaily)}</p>
                <p className="text-xs text-[var(--muted)]">{totalDailyKwh.toFixed(2)} kWh</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Monthly Cost</p>
                <p className="text-2xl font-bold text-green-700">{fmtExact(totalMonthly)}</p>
                <p className="text-xs text-[var(--muted)]">{totalMonthlyKwh.toFixed(1)} kWh</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Annual Cost</p>
                <p className="text-2xl font-bold">{fmtExact(totalAnnual)}</p>
                <p className="text-xs text-[var(--muted)]">{totalAnnualKwh.toFixed(0)} kWh</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Appliance Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Appliance</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Watts</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Hrs/Day</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Daily</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Monthly</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appliances.map((a) => (
                      <tr key={a.id} className="hover:bg-[var(--muted-bg)]">
                        <td className="border border-[var(--card-border)] px-3 py-2">{a.name}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{a.wattage}W</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{a.hoursPerDay}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(a.dailyCost)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(a.monthlyCost)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmtExact(a.annualCost)}</td>
                      </tr>
                    ))}
                    {appliances.length > 1 && (
                      <tr className="bg-blue-50">
                        <td className="border border-[var(--card-border)] px-3 py-2 font-bold" colSpan={3}>Total</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold">{fmtExact(totalDaily)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold">{fmtExact(totalMonthly)}</td>
                        <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(totalAnnual)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Calculate Electricity Cost</h2>
          <p>
            To calculate how much an appliance costs to run, you need three pieces of information: the appliance&apos;s
            wattage, how many hours per day you use it, and your electricity rate in dollars per kilowatt-hour (kWh).
          </p>

          <h2>The Formula</h2>
          <p><strong>Daily Cost = (Wattage x Hours Used) / 1000 x Rate per kWh</strong></p>
          <p>For example, a 1,500W space heater running 8 hours at $0.16/kWh costs $1.92/day or ~$57.60/month.</p>

          <h2>Understanding Your Electric Bill</h2>
          <p>
            The average US household uses about 886 kWh per month. Your electricity rate can be found on your utility
            bill, typically listed as a $/kWh charge. The national average is approximately $0.16/kWh, but rates vary
            significantly by state.
          </p>

          <h3>Biggest Energy Users in Your Home</h3>
          <ul>
            <li><strong>HVAC (Heating/Cooling):</strong> 40-50% of electricity bill</li>
            <li><strong>Water Heater:</strong> 12-15% of electricity bill</li>
            <li><strong>Washer &amp; Dryer:</strong> 5-10% of electricity bill</li>
            <li><strong>Lighting:</strong> 5-10% of electricity bill</li>
            <li><strong>Refrigerator:</strong> 3-5% of electricity bill</li>
          </ul>

          <h3>Tips to Reduce Your Electric Bill</h3>
          <ul>
            <li>Switch to LED light bulbs (use 75% less energy than incandescent)</li>
            <li>Use a programmable thermostat</li>
            <li>Unplug electronics when not in use (vampire power)</li>
            <li>Run full loads in washer/dryer and dishwasher</li>
            <li>Use ceiling fans to supplement AC</li>
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
            name: "Electricity Cost Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/electricity-cost-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
