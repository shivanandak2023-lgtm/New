"use client";

import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Home Improvement Calculators - Free Construction & Remodeling Tools",
  description:
    "Free home improvement calculators for every project. Estimate materials and costs for mulch, gravel, tile, paint, fencing, decking, drywall, roofing, and more.",
  keywords:
    "home improvement calculator, home project calculators, construction calculators free, remodeling calculator, home renovation cost estimator, building material calculator, DIY project calculator, home repair calculator",
};

const TOOLS = [
  { slug: "mulch-calculator", name: "Mulch Calculator", icon: "🌿", description: "Calculate mulch needed in cubic yards and bags for garden beds and landscaping." },
  { slug: "gravel-calculator", name: "Gravel Calculator", icon: "🪨", description: "Estimate gravel tonnage and cost for driveways, paths, and landscaping projects." },
  { slug: "tile-calculator", name: "Tile Calculator", icon: "🔲", description: "Calculate tile quantity, grout, and waste for floors, walls, and backsplashes." },
  { slug: "paint-calculator", name: "Paint Calculator", icon: "🎨", description: "Estimate gallons of paint needed for interior and exterior walls and ceilings." },
  { slug: "fencing-calculator", name: "Fencing Calculator", icon: "🏗️", description: "Calculate fencing materials — posts, rails, and pickets for your property line." },
  { slug: "decking-calculator", name: "Decking Calculator", icon: "🪵", description: "Estimate deck boards, screws, and joists needed for your deck build." },
  { slug: "wallpaper-calculator", name: "Wallpaper Calculator", icon: "🖼️", description: "Calculate wallpaper rolls needed based on wall dimensions and pattern repeat." },
  { slug: "soil-calculator", name: "Soil Calculator", icon: "🌱", description: "Estimate topsoil and garden soil in cubic yards for raised beds and lawns." },
  { slug: "drywall-calculator", name: "Drywall Calculator", icon: "🧱", description: "Calculate drywall sheets, joint compound, and tape for walls and ceilings." },
  { slug: "flooring-calculator", name: "Flooring Calculator", icon: "🏠", description: "Estimate flooring materials for hardwood, laminate, vinyl, and carpet." },
  { slug: "pool-volume-calculator", name: "Pool Volume Calculator", icon: "🏊", description: "Calculate pool water volume in gallons for chemical dosing and filling." },
  { slug: "roof-calculator", name: "Roof Calculator", icon: "🏘️", description: "Estimate roofing materials — shingles, underlayment, and ridge caps." },
  { slug: "stair-calculator", name: "Stair Calculator", icon: "🪜", description: "Calculate stair rise, run, and number of steps per building codes." },
  { slug: "concrete-calculator", name: "Concrete Calculator", icon: "🧱", description: "Estimate concrete in cubic yards and bags for slabs, footings, and columns." },
  { slug: "square-footage-calculator", name: "Square Footage Calculator", icon: "📐", description: "Calculate square footage of rooms, land, and irregularly shaped areas." },
];

export default function HomeImprovementPage() {
  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/home-improvement`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/home-improvement`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Home Improvement Calculators</h1>
        <p className="text-[var(--muted)] mb-8">
          Free online calculators for every home improvement project. Estimate materials, quantities, and costs for landscaping, flooring, painting, fencing, roofing, and more.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {TOOLS.map((tool) => (
            <a
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="tool-card flex flex-col hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{tool.icon}</span>
                <h2 className="text-lg font-bold group-hover:text-[var(--primary)] transition-colors">{tool.name}</h2>
              </div>
              <p className="text-sm text-[var(--muted)] flex-1">{tool.description}</p>
              <p className="text-sm font-medium text-[var(--primary)] mt-3">
                Calculate &rarr;
              </p>
            </a>
          ))}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Home Improvement Calculators: Plan Every Project with Confidence</h2>
          <p>
            Whether you are a seasoned DIY enthusiast or tackling your first home renovation, accurate material estimates are
            essential for staying on budget and avoiding multiple trips to the hardware store. Our collection of free home
            improvement calculators covers everything from landscaping materials like mulch, gravel, and soil to major projects
            like roofing, decking, and drywall installation. Each calculator is designed to give you precise quantity estimates
            so you buy exactly what you need.
          </p>

          <h2>Why Use a Construction Calculator?</h2>
          <p>
            Estimating construction materials by hand is time-consuming and error-prone. Over-ordering wastes money, while
            under-ordering causes project delays. Our building material calculators use standard industry formulas to account for
            waste, coverage rates, and package sizes. For example, our paint calculator considers wall area minus windows and
            doors, the mulch calculator factors in depth and bed dimensions, and the concrete calculator converts cubic feet
            to yards and bags automatically. These tools save you time and money on every project.
          </p>

          <h2>Popular Home Improvement Projects</h2>
          <p>
            The most common home renovation projects in the United States include kitchen and bathroom remodels, flooring
            replacement, interior and exterior painting, deck construction, fencing, and landscaping. According to the Joint
            Center for Housing Studies, US homeowners spend over $400 billion annually on home improvements and repairs.
            Having accurate material estimates before you start ensures your project stays on budget and on schedule.
          </p>

          <h2>Landscaping Calculators</h2>
          <p>
            For outdoor projects, our mulch, gravel, and soil calculators help you determine exactly how many cubic yards of
            material to order based on your coverage area and desired depth. The mulch calculator also converts to bags, the
            gravel calculator includes weight estimates in tons, and the soil calculator covers both topsoil and garden soil
            mixes. Getting the right amount of landscaping material saves you delivery costs and prevents waste.
          </p>

          <h2>Interior Renovation Calculators</h2>
          <p>
            Planning an interior renovation? Our paint calculator tells you how many gallons to buy based on room dimensions,
            ceiling height, and number of coats. The tile calculator estimates tile quantity with a configurable waste percentage.
            The drywall calculator determines how many sheets of drywall you need plus joint compound and tape. The flooring
            calculator supports hardwood, laminate, vinyl plank, and carpet with waste factors built in. Each tool is designed
            for US-standard material sizes.
          </p>

          <h2>Structural and Exterior Calculators</h2>
          <p>
            For larger projects, our roof calculator estimates shingles, underlayment, and ridge caps based on roof dimensions
            and pitch. The concrete calculator handles slabs, footings, columns, and stairs, giving results in cubic yards and
            standard bag counts. The fencing calculator determines posts, rails, and picket quantities. The decking calculator
            covers composite and wood deck boards, joists, and hardware. And the stair calculator ensures your stairs meet
            building code requirements for rise, run, and headroom.
          </p>

          <h3>Tips for Accurate Material Estimates</h3>
          <p>
            Always add 5% to 10% waste to any material estimate to account for cuts, breakage, and mistakes. Measure twice
            and calculate once. For irregularly shaped areas, break them into smaller rectangles and triangles. When ordering
            bulk materials like gravel or soil, round up to the nearest half yard since suppliers typically sell in half-yard
            increments. Save your calculations so you can reference them when re-ordering or planning future projects.
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
            name: "Home Improvement Calculators",
            description: META.description,
            url: `${SITE_URL}/tools/home-improvement`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
