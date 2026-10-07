import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import { MapPin, ChevronRight, TrendingDown } from "lucide-react";

interface NISummary {
  [volume: number]: { cheapest: number; average: number; count: number; updatedAt: string };
}

const CITY_AREAS = [
  { slug: "belfast",      name: "Belfast",           postcodes: ["BT1", "BT2", "BT4", "BT5", "BT7", "BT8", "BT9", "BT10", "BT11", "BT12", "BT13", "BT14", "BT15", "BT17"] },
  { slug: "londonderry",  name: "Londonderry / Derry", postcodes: ["BT47", "BT48"] },
  { slug: "lisburn",      name: "Lisburn",            postcodes: ["BT27", "BT28"] },
  { slug: "newtownabbey", name: "Newtownabbey",       postcodes: ["BT36", "BT37"] },
  { slug: "bangor",       name: "Bangor",             postcodes: ["BT19", "BT20", "BT21"] },
  { slug: "ballymena",    name: "Ballymena",          postcodes: ["BT42", "BT43"] },
  { slug: "ballymoney",   name: "Ballymoney",         postcodes: ["BT53"] },
  { slug: "coleraine",    name: "Coleraine",          postcodes: ["BT51", "BT52"] },
  { slug: "armagh",       name: "Armagh",             postcodes: ["BT60", "BT61"] },
  { slug: "omagh",        name: "Omagh",              postcodes: ["BT78", "BT79"] },
  { slug: "antrim",       name: "Antrim",             postcodes: ["BT41"] },
  { slug: "magherafelt",  name: "Magherafelt",        postcodes: ["BT45"] },
  { slug: "strabane",     name: "Strabane",           postcodes: ["BT82"] },
  { slug: "dungannon",    name: "Dungannon",          postcodes: ["BT70", "BT71"] },
  { slug: "enniskillen",  name: "Enniskillen",        postcodes: ["BT74"] },
  { slug: "larne",        name: "Larne",              postcodes: ["BT40"] },
  { slug: "carrickfergus",name: "Carrickfergus",      postcodes: ["BT38"] },
  { slug: "limavady",     name: "Limavady",           postcodes: ["BT49"] },
  { slug: "newry",        name: "Newry",              postcodes: ["BT34", "BT35"] },
  { slug: "downpatrick",  name: "Downpatrick",        postcodes: ["BT30"] },
  { slug: "portadown",    name: "Portadown",          postcodes: ["BT62"] },
  { slug: "lurgan",       name: "Lurgan",             postcodes: ["BT63", "BT66"] },
];

const POSTCODE_GROUPS = [
  { group: "Belfast area",   postcodes: ["bt1","bt2","bt3","bt4","bt5","bt6","bt7","bt8","bt9","bt10","bt11","bt12","bt13","bt14","bt15","bt16","bt17"] },
  { group: "North Down",     postcodes: ["bt18","bt19","bt20","bt21","bt22","bt23"] },
  { group: "County Down",    postcodes: ["bt24","bt25","bt26","bt30","bt31","bt32","bt33","bt34","bt35"] },
  { group: "Antrim & Lisburn",postcodes: ["bt27","bt28","bt29","bt36","bt37","bt38","bt39","bt40","bt41"] },
  { group: "Mid Antrim",     postcodes: ["bt42","bt43","bt44","bt54","bt56","bt57"] },
  { group: "Derry / Tyrone", postcodes: ["bt45","bt46","bt47","bt48","bt49","bt51","bt52","bt53","bt55","bt82"] },
  { group: "Armagh & Craigavon", postcodes: ["bt60","bt61","bt62","bt63","bt64","bt65","bt66","bt67"] },
  { group: "Tyrone & Fermanagh", postcodes: ["bt68","bt69","bt70","bt71","bt74","bt75","bt76","bt77","bt78","bt79","bt80","bt81"] },
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://niheatingoil.com" },
      { "@type": "ListItem", "position": 2, "name": "Heating Oil Prices by Area", "item": "https://niheatingoil.com/heating-oil-prices/" },
    ],
  },
];

export default function HeatingOilPricesIndex() {
  const { data: niSummary } = useQuery<NISummary>({
    queryKey: ["/api/prices/ni-summary"],
    staleTime: 1000 * 60 * 30,
  });

  return (
    <div className="min-h-screen bg-brand-cream">
      <SEOHead
        title="Heating Oil Prices by Area — All NI Postcodes | NI Heating Oil"
        description="Find current heating oil prices for every BT postcode in Northern Ireland. Compare suppliers by area — Belfast, Derry, Antrim, Down, Armagh, Tyrone and Fermanagh."
        canonicalUrl="https://niheatingoil.com/heating-oil-prices/"
        keywords="heating oil prices Northern Ireland, BT postcode heating oil, NI oil prices by area"
        structuredData={structuredData}
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-brand-muted mb-6">
          <Link href="/" className="hover:text-brand-muted">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brand-ink font-medium">Heating Oil Prices by Area</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-ink tracking-tight">
            Heating Oil Prices by Area — Northern Ireland
          </h1>
          <p className="mt-3 text-brand-muted max-w-2xl">
            Select your town or BT postcode to see current heating oil prices from suppliers in your area. Prices updated daily from verified Northern Ireland suppliers.
          </p>
        </div>

        {/* NI Summary */}
        {niSummary && (
          <div className="bg-white border border-brand-line rounded-lg mb-8">
            <div className="flex items-center justify-between px-4 py-3 border-b border-brand-line">
              <div>
                <p className="text-sm font-semibold text-brand-ink">Today's NI-wide prices</p>
                <p className="text-xs text-brand-muted mt-0.5">Enter your postcode for a local quote</p>
              </div>
              <TrendingDown className="w-4 h-4 text-brand-muted" />
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-cream">
                  <th className="text-left px-4 py-2 text-xs font-medium text-brand-muted uppercase">Volume</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-brand-muted uppercase">Cheapest</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-brand-muted uppercase hidden sm:table-cell">NI Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[300, 500, 900].map(vol => {
                  const row = niSummary[vol];
                  if (!row || row.count === 0) return null;
                  return (
                    <tr key={vol} className="hover:bg-white">
                      <td className="px-4 py-2.5 font-medium text-brand-ink">{vol}L</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-[#0B6A30]">£{row.cheapest.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-right text-brand-muted hidden sm:table-cell">£{row.average.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Cities */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-brand-ink mb-4">By town or city</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CITY_AREAS.map(city => (
              <Link
                key={city.slug}
                href={`/heating-oil-prices/${city.slug}/`}
                className="flex items-center justify-between px-3 py-2.5 bg-white border border-brand-line rounded-lg hover:border-orange-300 hover:bg-brand-butter transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-muted group-hover:text-[#8A3B12] flex-shrink-0" />
                  <span className="text-sm font-medium text-brand-ink group-hover:text-[#8A3B12]">{city.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-brand-line group-hover:text-orange-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Postcodes grouped */}
        <div>
          <h2 className="text-lg font-bold text-brand-ink mb-4">By BT postcode</h2>
          <div className="space-y-6">
            {POSTCODE_GROUPS.map(group => (
              <div key={group.group}>
                <h3 className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">{group.group}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.postcodes.map(pc => (
                    <Link
                      key={pc}
                      href={`/heating-oil-prices/${pc}/`}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-brand-ink bg-white border border-brand-line rounded-md hover:border-orange-300 hover:bg-brand-butter hover:text-[#8A3B12] transition-colors"
                    >
                      {pc.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
