"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "UK Inheritance Tax (IHT) Calculator 2024-25",
  description:
    "Free UK inheritance tax calculator for 2024-25. Calculate IHT on your estate with nil-rate band, residence nil-rate band, taper relief on gifts, and effective tax rate.",
  keywords:
    "inheritance tax calculator UK, IHT calculator, how much inheritance tax, inheritance tax nil rate band, residence nil rate band, inheritance tax on gifts, IHT taper relief",
};

interface GiftEntry {
  id: number;
  amount: string;
  yearsAgo: string;
}

interface IHTResult {
  estateValue: number;
  nilRateBand: number;
  residenceNilRateBand: number;
  totalNilRateBand: number;
  giftsTaxable: number;
  giftsTaperRelief: number;
  giftsIHT: number;
  taxableEstate: number;
  ihtPayable: number;
  effectiveRate: number;
}

export default function UKInheritanceTaxPage() {
  const [estateValue, setEstateValue] = useState<string>("500000");
  const [mainResidenceValue, setMainResidenceValue] = useState<string>("250000");
  const [directDescendants, setDirectDescendants] = useState<boolean>(true);
  const [nilRateBandUsed, setNilRateBandUsed] = useState<string>("0");
  const [gifts, setGifts] = useState<GiftEntry[]>([
    { id: 1, amount: "", yearsAgo: "1" },
  ]);
  const [result, setResult] = useState<IHTResult | null>(null);

  const NRB = 325000;
  const RNRB = 175000;
  const IHT_RATE = 0.4;

  const TAPER_RELIEF: Record<string, number> = {
    "0-3": 0,
    "3-4": 0.2,
    "4-5": 0.4,
    "5-6": 0.6,
    "6-7": 0.8,
  };

  function getTaperBand(years: number): string {
    if (years < 3) return "0-3";
    if (years < 4) return "3-4";
    if (years < 5) return "4-5";
    if (years < 6) return "5-6";
    if (years < 7) return "6-7";
    return "7+";
  }

  function getTaperRate(years: number): number {
    if (years < 3) return 0.4;
    if (years < 4) return 0.32;
    if (years < 5) return 0.24;
    if (years < 6) return 0.16;
    if (years < 7) return 0.08;
    return 0;
  }

  function addGift() {
    setGifts([...gifts, { id: Date.now(), amount: "", yearsAgo: "1" }]);
  }

  function removeGift(id: number) {
    if (gifts.length > 1) {
      setGifts(gifts.filter((g) => g.id !== id));
    }
  }

  function updateGift(id: number, field: "amount" | "yearsAgo", value: string) {
    setGifts(gifts.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
  }

  function calculate() {
    const estate = parseFloat(estateValue) || 0;
    const residence = parseFloat(mainResidenceValue) || 0;
    const nrbUsed = parseFloat(nilRateBandUsed) || 0;

    if (estate <= 0) return;

    // Calculate nil-rate band
    const availableNRB = Math.max(0, NRB - nrbUsed);

    // Residence nil-rate band only applies if main home passed to direct descendants
    let rnrb = 0;
    if (directDescendants && residence > 0) {
      rnrb = Math.min(RNRB, residence);
      // RNRB tapers for estates over £2m — reduced by £1 for every £2 over £2m
      if (estate > 2000000) {
        const taper = (estate - 2000000) / 2;
        rnrb = Math.max(0, rnrb - taper);
      }
    }

    const totalNilRateBand = availableNRB + rnrb;

    // Calculate gifts IHT with taper relief
    let totalGiftsTaxable = 0;
    let totalGiftsTaperRelief = 0;
    let totalGiftsIHT = 0;
    let remainingNRBForGifts = availableNRB;

    const validGifts = gifts
      .filter((g) => parseFloat(g.amount) > 0)
      .sort((a, b) => parseFloat(b.yearsAgo) - parseFloat(a.yearsAgo));

    for (const gift of validGifts) {
      const giftAmount = parseFloat(gift.amount) || 0;
      const years = parseFloat(gift.yearsAgo) || 0;

      if (years >= 7) continue; // No tax on gifts over 7 years

      // Gifts use up NRB first
      const coveredByNRB = Math.min(giftAmount, remainingNRBForGifts);
      remainingNRBForGifts -= coveredByNRB;
      const taxableGift = giftAmount - coveredByNRB;

      if (taxableGift > 0) {
        const taperRate = getTaperRate(years);
        const giftTax = taxableGift * taperRate;
        const fullTax = taxableGift * IHT_RATE;
        totalGiftsTaxable += taxableGift;
        totalGiftsTaperRelief += fullTax - giftTax;
        totalGiftsIHT += giftTax;
      }
    }

    // NRB remaining after gifts applied to estate
    const nrbForEstate = remainingNRBForGifts + rnrb;
    const taxableEstate = Math.max(0, estate - nrbForEstate);
    const estateIHT = taxableEstate * IHT_RATE;
    const totalIHT = estateIHT + totalGiftsIHT;
    const effectiveRate = estate > 0 ? (totalIHT / estate) * 100 : 0;

    setResult({
      estateValue: estate,
      nilRateBand: availableNRB,
      residenceNilRateBand: rnrb,
      totalNilRateBand: nrbForEstate,
      giftsTaxable: totalGiftsTaxable,
      giftsTaperRelief: totalGiftsTaperRelief,
      giftsIHT: totalGiftsIHT,
      taxableEstate,
      ihtPayable: totalIHT,
      effectiveRate,
    });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const fmtExact = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/uk-inheritance-tax`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/uk-inheritance-tax`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">UK Inheritance Tax (IHT) Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Calculate Inheritance Tax on your estate using 2024-25 HMRC rates. Includes nil-rate band, residence nil-rate band, taper relief on gifts, and effective tax rate.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Total Estate Value (&pound;)</label>
              <input
                type="number"
                value={estateValue}
                onChange={(e) => setEstateValue(e.target.value)}
                className="input-field"
                placeholder="e.g., 500000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Main Residence Value (&pound;)</label>
              <input
                type="number"
                value={mainResidenceValue}
                onChange={(e) => setMainResidenceValue(e.target.value)}
                className="input-field"
                placeholder="e.g., 250000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nil-Rate Band Already Used (&pound;)</label>
              <input
                type="number"
                value={nilRateBandUsed}
                onChange={(e) => setNilRateBandUsed(e.target.value)}
                className="input-field"
                placeholder="e.g., 0"
                min="0"
                max="325000"
              />
            </div>

            <div className="flex items-center gap-3 pt-5">
              <input
                type="checkbox"
                id="directDescendants"
                checked={directDescendants}
                onChange={(e) => setDirectDescendants(e.target.checked)}
                className="w-5 h-5 accent-[var(--primary)]"
              />
              <label htmlFor="directDescendants" className="text-sm font-medium">
                Passing main home to direct descendants (children/grandchildren)
              </label>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium">Gifts Made in Last 7 Years</label>
              <button onClick={addGift} className="text-sm text-[var(--primary)] hover:underline">
                + Add Gift
              </button>
            </div>
            {gifts.map((gift) => (
              <div key={gift.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 mb-3">
                <div>
                  <input
                    type="number"
                    value={gift.amount}
                    onChange={(e) => updateGift(gift.id, "amount", e.target.value)}
                    className="input-field"
                    placeholder="Gift amount (£)"
                    min="0"
                  />
                </div>
                <div>
                  <select
                    value={gift.yearsAgo}
                    onChange={(e) => updateGift(gift.id, "yearsAgo", e.target.value)}
                    className="input-field"
                  >
                    <option value="1">0-3 years ago (40% tax)</option>
                    <option value="3.5">3-4 years ago (32% tax)</option>
                    <option value="4.5">4-5 years ago (24% tax)</option>
                    <option value="5.5">5-6 years ago (16% tax)</option>
                    <option value="6.5">6-7 years ago (8% tax)</option>
                  </select>
                </div>
                <button
                  onClick={() => removeGift(gift.id)}
                  className="text-red-500 hover:text-red-700 text-sm px-2"
                  title="Remove gift"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Inheritance Tax
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Total Nil-Rate Band</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{fmt(result.totalNilRateBand)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Taxable Estate</p>
                <p className="text-2xl font-bold">{fmt(result.taxableEstate)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">IHT Payable</p>
                <p className="text-2xl font-bold text-red-600">{fmtExact(result.ihtPayable)}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Effective Rate</p>
                <p className="text-2xl font-bold text-green-700">{result.effectiveRate.toFixed(2)}%</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">IHT Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Component</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Estate Value</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.estateValue)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Nil-Rate Band (NRB)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">-{fmt(result.nilRateBand)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Residence Nil-Rate Band (RNRB)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">-{fmt(result.residenceNilRateBand)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">Taxable Estate</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{fmt(result.taxableEstate)}</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">IHT on Estate (40%)</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.taxableEstate * 0.4)}</td>
                    </tr>
                    {result.giftsIHT > 0 && (
                      <>
                        <tr className="hover:bg-[var(--muted-bg)]">
                          <td className="border border-[var(--card-border)] px-3 py-2">Taxable Gifts</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmt(result.giftsTaxable)}</td>
                        </tr>
                        <tr className="hover:bg-[var(--muted-bg)]">
                          <td className="border border-[var(--card-border)] px-3 py-2">Taper Relief on Gifts</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right text-green-700">-{fmtExact(result.giftsTaperRelief)}</td>
                        </tr>
                        <tr className="hover:bg-[var(--muted-bg)]">
                          <td className="border border-[var(--card-border)] px-3 py-2">IHT on Gifts (after taper)</td>
                          <td className="border border-[var(--card-border)] px-3 py-2 text-right">{fmtExact(result.giftsIHT)}</td>
                        </tr>
                      </>
                    )}
                    <tr className="bg-blue-50">
                      <td className="border border-[var(--card-border)] px-3 py-2 font-bold">Total IHT Payable</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right font-bold text-[var(--primary)]">{fmtExact(result.ihtPayable)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Taper Relief Rates on Gifts</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted-bg)]">
                      <th className="border border-[var(--card-border)] px-3 py-2 text-left">Years Before Death</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Tax Rate</th>
                      <th className="border border-[var(--card-border)] px-3 py-2 text-right">Taper Relief</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">0 - 3 years</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">40%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">0%</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">3 - 4 years</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">32%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">20%</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">4 - 5 years</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">24%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">40%</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">5 - 6 years</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">16%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">60%</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">6 - 7 years</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">8%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">80%</td>
                    </tr>
                    <tr className="hover:bg-[var(--muted-bg)]">
                      <td className="border border-[var(--card-border)] px-3 py-2">7+ years</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">0%</td>
                      <td className="border border-[var(--card-border)] px-3 py-2 text-right">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is Inheritance Tax (IHT)?</h2>
          <p>
            Inheritance Tax (IHT) is a tax on the estate (property, money, and possessions) of someone who has died. In the UK, IHT is charged at 40% on the value of an estate above the nil-rate band threshold. This inheritance tax calculator UK tool helps you estimate how much IHT may be due on an estate using the latest 2024-25 HMRC rules and allowances.
          </p>

          <h2>Nil-Rate Band (NRB) &mdash; &pound;325,000</h2>
          <p>
            The nil-rate band is the threshold below which no inheritance tax is payable. For the 2024-25 tax year, the nil-rate band is &pound;325,000. This means the first &pound;325,000 of an estate is tax-free. If the deceased was married or in a civil partnership, any unused nil-rate band from the first partner to die can be transferred to the surviving partner, potentially doubling it to &pound;650,000. Use this IHT calculator to see how the nil-rate band applies to your specific situation.
          </p>

          <h2>Residence Nil-Rate Band (RNRB) &mdash; &pound;175,000</h2>
          <p>
            The residence nil-rate band provides an additional &pound;175,000 allowance when a main residence is passed to direct descendants such as children or grandchildren. Combined with the standard nil-rate band, this can give a total tax-free threshold of &pound;500,000. For married couples or civil partners, the combined allowance can reach up to &pound;1,000,000. However, the RNRB starts to taper for estates worth more than &pound;2 million, reducing by &pound;1 for every &pound;2 above that threshold.
          </p>

          <h2>Taper Relief on Gifts</h2>
          <p>
            If you give away assets before you die, they are known as potentially exempt transfers (PETs). If you survive for seven years after making a gift, it falls outside your estate entirely and no IHT is due. However, if you die within seven years of making a gift, taper relief can reduce the amount of IHT payable. Gifts made 0-3 years before death are taxed at the full 40% rate, while gifts made 3-4 years before death are taxed at 32%, 4-5 years at 24%, 5-6 years at 16%, and 6-7 years at just 8%.
          </p>

          <h2>How Is Inheritance Tax Calculated?</h2>
          <p>
            The IHT calculation follows a specific order. First, any available nil-rate band is applied against gifts made in the seven years before death, starting with the earliest gifts. Any remaining nil-rate band, plus the residence nil-rate band if applicable, is then applied to the estate. The 40% IHT rate applies to any amount above these combined allowances. The effective inheritance tax rate is typically much lower than 40% because of the generous nil-rate bands available.
          </p>

          <h2>How to Reduce Inheritance Tax</h2>
          <p>
            There are several legitimate ways to reduce your IHT liability. Making gifts during your lifetime is one of the most common strategies &mdash; each individual can give away up to &pound;3,000 per year tax-free under the annual exemption. Gifts to spouses, civil partners, charities, and political parties are entirely exempt from IHT. Leaving at least 10% of the net estate to charity can reduce the IHT rate from 40% to 36%. Business Property Relief and Agricultural Property Relief can also reduce or eliminate IHT on qualifying assets. Proper estate planning can significantly reduce the amount of inheritance tax your beneficiaries will need to pay.
          </p>

          <h2>Who Pays Inheritance Tax?</h2>
          <p>
            Inheritance tax is usually paid from the estate of the deceased before assets are distributed to beneficiaries. The executor or personal representative is responsible for calculating and paying IHT to HMRC, typically within six months of the death. For gifts made within seven years of death where taper relief applies, the recipient of the gift may be liable for the IHT due on that gift if the estate cannot cover it.
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
            name: "UK Inheritance Tax (IHT) Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/uk-inheritance-tax`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          }),
        }}
      />
    </>
  );
}
