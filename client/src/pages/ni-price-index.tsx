import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import SEOHead from "@/components/seo-head";
import { PageShell, PageHero, OverlapSection } from "@/components/brand-ui";
import { usePageTitle } from "@/hooks/usePageTitle";
import { TrendingDown, MapPin, Calendar, ArrowRight, BarChart2, Info } from "lucide-react";

const COUNTY_AREAS = [
  { county: "Antrim", cities: [{ name: "Belfast", slug: "belfast" }, { name: "Ballymena", slug: "ballymena" }, { name: "Antrim", slug: "antrim" }, { name: "Larne", slug: "larne" }] },
  { county: "Down", cities: [{ name: "Bangor", slug: "bangor" }, { name: "Newry", slug: "newry" }, { name: "Downpatrick", slug: "downpatrick" }, { name: "Ballynahinch", slug: "ballynahinch" }] },
  { county: "Derry", cities: [{ name: "Derry / Londonderry", slug: "derry" }, { name: "Coleraine", slug: "coleraine" }, { name: "Magherafelt", slug: "magherafelt" }, { name: "Limavady", slug: "limavady" }] },
  { county: "Tyrone", cities: [{ name: "Omagh", slug: "omagh" }, { name: "Dungannon", slug: "dungannon" }, { name: "Cookstown", slug: "cookstown" }, { name: "Strabane", slug: "strabane" }] },
  { county: "Armagh", cities: [{ name: "Armagh", slug: "armagh" }, { name: "Portadown", slug: "portadown" }, { name: "Lurgan", slug: "lurgan" }] },
  { county: "Fermanagh", cities: [{ name: "Enniskillen", slug: "enniskillen" }] },
];

const SEASONAL_TIPS = [
  { month: "July–August", tip: "Historically cheapest. Demand is low, suppliers compete for off-peak business. Fill up if your tank allows.", signal: "Buy" },
  { month: "September–October", tip: "Prices start rising as households top up before winter. Buy early in September if possible.", signal: "Buy soon" },
  { month: "November–January", tip: "Peak demand drives prices to seasonal highs. Avoid large fills unless essential.", signal: "Caution" },
  { month: "February–April", tip: "Prices ease as heating demand drops. A good window to replenish at mid-range prices.", signal: "Neutral" },
  { month: "May–June", tip: "Prices continue softening. Good time to buy a partial fill to benefit from summer price falls.", signal: "Watch" },
];

export default function NIPriceIndex() {
  usePageTitle("Northern Ireland Heating Oil Price Index | NIHeatingoil.com");

  const { data: niSummary, isLoading } = useQuery<Record<number, { cheapest: number; average: number; count: number; updatedAt: string }>>({
    queryKey: ["/api/prices/ni-summary"],
    staleTime: 1000 * 60 * 30,
  });

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "name": "Northern Ireland Heating Oil Price Index",
      "description": "Live heating oil prices across Northern Ireland, updated from verified local distributors. Covers 300L, 500L and 900L delivery volumes.",
      "url": "https://niheatingoil.com/ni-heating-oil-price-index",
      "publisher": {
        "@type": "Organization",
        "name": "NI Heating Oil",
        "url": "https://niheatingoil.com"
      },
      "spatialCoverage": {
        "@type": "Place",
        "name": "Northern Ireland",
        "addressCountry": "GB"
      },
      "variableMeasured": [
        { "@type": "PropertyValue", "name": "300L heating oil price (GBP, inc VAT)" },
        { "@type": "PropertyValue", "name": "500L heating oil price (GBP, inc VAT)" },
        { "@type": "PropertyValue", "name": "900L heating oil price (GBP, inc VAT)" }
      ],
      "temporalCoverage": new Date().toISOString().split("T")[0],
      "license": "https://creativecommons.org/licenses/by/4.0/"
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Northern Ireland Heating Oil Price Index",
      "url": "https://niheatingoil.com/ni-heating-oil-price-index",
      "description": "NI-wide heating oil price data — cheapest and average prices for 300L, 500L and 900L across all BT postcode areas.",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://niheatingoil.com" },
          { "@type": "ListItem", "position": 2, "name": "NI Price Index", "item": "https://niheatingoil.com/ni-heating-oil-price-index" }
        ]
      }
    }
  ];

  const savings500 = niSummary?.[500]
    ? (niSummary[500].average - niSummary[500].cheapest).toFixed(2)
    : null;

  return (
    <PageShell>
      <SEOHead
        title="Northern Ireland Heating Oil Price Index | NIHeatingoil.com"
        description={`Live NI heating oil prices — cheapest and average for 300L, 500L and 900L across all BT postcode areas. Updated ${today}. Compare prices in your area.`}
        keywords="heating oil prices Northern Ireland, NI oil price index, heating oil cost NI, cheapest heating oil Northern Ireland, BT postcode heating oil"
        canonicalUrl="https://niheatingoil.com/ni-heating-oil-price-index"
        structuredData={structuredData}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "NI Price Index" }]}
        title="Northern Ireland Heating Oil "
        accent="Price Index"
        intro={`Live market prices from verified NI distributors — cheapest and average delivery costs for 300L, 500L and 900L. Updated ${today}.`}
        overlap
      />
      <OverlapSection>

      {/* Live price table */}
      <section className="pb-10">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-lg font-bold text-brand-ink mb-1">Today's NI Market Prices</h2>
          <p className="text-sm text-brand-muted mb-4">All prices include VAT. Cheapest available from any NI supplier.</p>

          {isLoading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-brand-line rounded" />)}
            </div>
          ) : niSummary ? (
            <div className="overflow-hidden border border-brand-line rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-cream border-b border-brand-line">
                    <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wide">Volume</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wide">Cheapest</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wide">NI Average</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wide">Per Litre (cheapest)</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wide hidden sm:table-cell">Suppliers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[300, 500, 900].map((vol) => {
                    const row = niSummary[vol];
                    if (!row || row.count === 0) return null;
                    const ppl = (row.cheapest / vol * 100).toFixed(2);
                    return (
                      <tr key={vol} className="hover:bg-white">
                        <td className="px-4 py-3 font-semibold text-brand-ink">{vol}L</td>
                        <td className="px-4 py-3 text-right font-semibold text-[#0B6A30]">£{row.cheapest.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-brand-muted">£{row.average.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-brand-muted">{ppl}p</td>
                        <td className="px-4 py-3 text-right text-brand-muted hidden sm:table-cell">{row.count}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-brand-muted">Price data unavailable — check back shortly.</p>
          )}

          {savings500 && parseFloat(savings500) > 0 && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-brand-mint border border-green-100 rounded-lg">
              <TrendingDown className="w-4 h-4 text-[#0B6A30] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#0B6A30]">
                Households ordering 500L could save <strong>£{savings500}</strong> by choosing the cheapest supplier over the NI average.{" "}
                <Link href="/results?postcode=BT1&volume=500" className="underline hover:text-[#0B6A30]">Compare by your postcode →</Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Seasonal buying guide */}
      <section className="py-10 bg-brand-paper border-t border-brand-line">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-lg font-bold text-brand-ink mb-1">Seasonal Buying Guide</h2>
          <p className="text-sm text-brand-muted mb-5">Heating oil prices follow a predictable seasonal pattern in Northern Ireland. Here's when to buy and when to hold off.</p>
          <div className="space-y-3">
            {SEASONAL_TIPS.map(({ month, tip, signal }) => {
              const color = signal === "Buy" ? "bg-brand-mint border-green-100 text-[#0B6A30]"
                : signal === "Buy soon" ? "bg-brand-mint border-brand-line text-brand-forest"
                : signal === "Caution" ? "bg-red-50 border-red-100 text-red-700"
                : "bg-brand-cream border-brand-line text-brand-muted";
              return (
                <div key={month} className={`flex items-start gap-3 p-3 border rounded-lg ${color.split(" ").slice(0, 2).join(" ")}`}>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${color.split(" ").slice(2).join(" ")} whitespace-nowrap`}>{signal}</span>
                  <div>
                    <p className="text-xs font-semibold text-brand-ink">{month}</p>
                    <p className="text-xs text-brand-muted mt-0.5">{tip}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coverage by county */}
      <section className="py-10 border-t border-brand-line">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-lg font-bold text-brand-ink mb-1">Prices by County</h2>
          <p className="text-sm text-brand-muted mb-5">Click a town to see live prices and supplier rankings for that area.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COUNTY_AREAS.map(({ county, cities }) => (
              <div key={county} className="bg-white border border-brand-line rounded-lg p-4">
                <h3 className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">County {county}</h3>
                <ul className="space-y-1">
                  {cities.map(({ name, slug }) => (
                    <li key={slug}>
                      <Link
                        href={`/heating-oil-prices/${slug}/`}
                        className="flex items-center gap-1.5 text-sm text-brand-ink hover:text-[#8A3B12] transition-colors"
                      >
                        <MapPin className="w-3 h-3 text-brand-muted flex-shrink-0" />
                        {name}
                        <ArrowRight className="w-3 h-3 ml-auto text-brand-line" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-10 bg-brand-paper border-t border-brand-line">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-lg font-bold text-brand-ink mb-3">Methodology</h2>
          <div className="flex items-start gap-3 p-4 bg-brand-cream border border-brand-line rounded-lg">
            <Info className="w-4 h-4 text-brand-muted flex-shrink-0 mt-0.5" />
            <div className="text-sm text-brand-muted space-y-2">
              <p>
                Prices are sourced directly from verified Northern Ireland heating oil distributors. Data covers standard kerosene (28-second heating oil) delivery prices including 5% VAT.
              </p>
              <p>
                <strong>Coverage:</strong> All 82 BT postcode districts across Antrim, Down, Derry/Londonderry, Tyrone, Armagh, and Fermanagh.
              </p>
              <p>
                <strong>Volumes:</strong> 300L (small top-up), 500L (standard fill), and 900L (large fill / bulk order).
              </p>
              <p>
                <strong>Update frequency:</strong> Prices are updated regularly from our network of verified suppliers. For the most accurate local quote, enter your postcode above.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 border-t border-brand-line">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-brand-ink mb-2">Get a quote for your postcode</h2>
          <p className="text-sm text-brand-muted mb-5">The index shows NI-wide averages. Enter your BT postcode to see which suppliers cover your area and rank them cheapest first.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold hover:brightness-95 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Compare prices in your area
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      </OverlapSection>
    </PageShell>
  );
}
