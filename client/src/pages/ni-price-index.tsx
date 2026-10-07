import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
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
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Northern Ireland Heating Oil Price Index | NIHeatingoil.com"
        description={`Live NI heating oil prices — cheapest and average for 300L, 500L and 900L across all BT postcode areas. Updated ${today}. Compare prices in your area.`}
        keywords="heating oil prices Northern Ireland, NI oil price index, heating oil cost NI, cheapest heating oil Northern Ireland, BT postcode heating oil"
        canonicalUrl="https://niheatingoil.com/ni-heating-oil-price-index"
        structuredData={structuredData}
      />
      <Navigation />

      {/* Page header */}
      <section className="pt-20 sm:pt-24 pb-12 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <span>/</span>
            <span className="text-gray-600">NI Price Index</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Northern Ireland Heating Oil Price Index
          </h1>
          <p className="mt-3 text-base text-gray-500 max-w-2xl">
            Live market prices from verified NI distributors — cheapest and average delivery costs for 300L, 500L and 900L across all BT postcode areas.
          </p>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Updated {today}</span>
            <span className="flex items-center gap-1"><BarChart2 className="w-3.5 h-3.5" /> {niSummary?.[500]?.count ?? "—"} verified suppliers</span>
          </div>
        </div>
      </section>

      {/* Live price table */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Today's NI Market Prices</h2>
          <p className="text-sm text-gray-500 mb-4">All prices include VAT. Cheapest available from any NI supplier.</p>

          {isLoading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-200 rounded" />)}
            </div>
          ) : niSummary ? (
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Volume</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Cheapest</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">NI Average</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Per Litre (cheapest)</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Suppliers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[300, 500, 900].map((vol) => {
                    const row = niSummary[vol];
                    if (!row || row.count === 0) return null;
                    const ppl = (row.cheapest / vol * 100).toFixed(2);
                    return (
                      <tr key={vol} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-900">{vol}L</td>
                        <td className="px-4 py-3 text-right font-semibold text-green-700">£{row.cheapest.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-gray-600">£{row.average.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-gray-500">{ppl}p</td>
                        <td className="px-4 py-3 text-right text-gray-400 hidden sm:table-cell">{row.count}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Price data unavailable — check back shortly.</p>
          )}

          {savings500 && parseFloat(savings500) > 0 && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-green-50 border border-green-100 rounded-lg">
              <TrendingDown className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-green-800">
                Households ordering 500L could save <strong>£{savings500}</strong> by choosing the cheapest supplier over the NI average.{" "}
                <Link href="/results?postcode=BT1&volume=500" className="underline hover:text-green-700">Compare by your postcode →</Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Seasonal buying guide */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Seasonal Buying Guide</h2>
          <p className="text-sm text-gray-500 mb-5">Heating oil prices follow a predictable seasonal pattern in Northern Ireland. Here's when to buy and when to hold off.</p>
          <div className="space-y-3">
            {SEASONAL_TIPS.map(({ month, tip, signal }) => {
              const color = signal === "Buy" ? "bg-green-50 border-green-100 text-green-700"
                : signal === "Buy soon" ? "bg-blue-50 border-blue-100 text-blue-700"
                : signal === "Caution" ? "bg-red-50 border-red-100 text-red-700"
                : "bg-gray-50 border-gray-100 text-gray-600";
              return (
                <div key={month} className={`flex items-start gap-3 p-3 border rounded-lg ${color.split(" ").slice(0, 2).join(" ")}`}>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${color.split(" ").slice(2).join(" ")} whitespace-nowrap`}>{signal}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{month}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{tip}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coverage by county */}
      <section className="py-10 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Prices by County</h2>
          <p className="text-sm text-gray-500 mb-5">Click a town to see live prices and supplier rankings for that area.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COUNTY_AREAS.map(({ county, cities }) => (
              <div key={county} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">County {county}</h3>
                <ul className="space-y-1">
                  {cities.map(({ name, slug }) => (
                    <li key={slug}>
                      <Link
                        href={`/heating-oil-prices/${slug}/`}
                        className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-orange-600 transition-colors"
                      >
                        <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        {name}
                        <ArrowRight className="w-3 h-3 ml-auto text-gray-300" />
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
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Methodology</h2>
          <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600 space-y-2">
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
      <section className="py-12 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Get a quote for your postcode</h2>
          <p className="text-sm text-gray-500 mb-5">The index shows NI-wide averages. Enter your BT postcode to see which suppliers cover your area and rank them cheapest first.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Compare prices in your area
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
