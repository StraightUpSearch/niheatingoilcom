import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import SEOHead from "@/components/seo-head";
import { PageShell, PageHero, OverlapSection } from "@/components/brand-ui";
import { MapPin, ArrowRight, BarChart2, BookOpen, Users, Info, Flame } from "lucide-react";

// BT postcodes grouped by county
const BT_BY_COUNTY: Record<string, { code: string; area: string }[]> = {
  Antrim: [
    { code: "bt1",  area: "Belfast City Centre" },
    { code: "bt2",  area: "Belfast City" },
    { code: "bt3",  area: "Belfast Docks" },
    { code: "bt4",  area: "East Belfast" },
    { code: "bt5",  area: "East Belfast" },
    { code: "bt6",  area: "South-East Belfast" },
    { code: "bt7",  area: "South Belfast" },
    { code: "bt8",  area: "South Belfast" },
    { code: "bt9",  area: "South-West Belfast" },
    { code: "bt10", area: "West Belfast" },
    { code: "bt11", area: "West Belfast" },
    { code: "bt12", area: "West Belfast" },
    { code: "bt13", area: "West Belfast" },
    { code: "bt14", area: "North Belfast" },
    { code: "bt15", area: "North Belfast" },
    { code: "bt17", area: "West Belfast" },
    { code: "bt27", area: "Lisburn East" },
    { code: "bt28", area: "Lisburn" },
    { code: "bt29", area: "Crumlin" },
    { code: "bt36", area: "Newtownabbey" },
    { code: "bt37", area: "Newtownabbey" },
    { code: "bt38", area: "Carrickfergus" },
    { code: "bt39", area: "Ballyclare" },
    { code: "bt40", area: "Larne" },
    { code: "bt41", area: "Antrim" },
    { code: "bt42", area: "Ballymena South" },
    { code: "bt43", area: "Ballymena" },
    { code: "bt44", area: "Ballymoney Area" },
    { code: "bt53", area: "Ballymoney" },
    { code: "bt54", area: "Ballycastle" },
    { code: "bt56", area: "Portrush" },
    { code: "bt57", area: "Bushmills" },
    { code: "bt67", area: "Moira" },
  ],
  Down: [
    { code: "bt16", area: "East Belfast" },
    { code: "bt18", area: "Holywood" },
    { code: "bt19", area: "Bangor West" },
    { code: "bt20", area: "Bangor" },
    { code: "bt21", area: "Bangor East" },
    { code: "bt22", area: "Newtownards Peninsula" },
    { code: "bt23", area: "Newtownards" },
    { code: "bt24", area: "Ballynahinch" },
    { code: "bt25", area: "Dromore" },
    { code: "bt26", area: "Hillsborough" },
    { code: "bt30", area: "Downpatrick" },
    { code: "bt31", area: "Castlewellan" },
    { code: "bt32", area: "Banbridge" },
    { code: "bt33", area: "Newcastle" },
    { code: "bt34", area: "Newry" },
  ],
  Derry: [
    { code: "bt45", area: "Magherafelt" },
    { code: "bt46", area: "Maghera" },
    { code: "bt47", area: "Londonderry South" },
    { code: "bt48", area: "Londonderry" },
    { code: "bt49", area: "Limavady" },
    { code: "bt51", area: "Coleraine East" },
    { code: "bt52", area: "Coleraine" },
    { code: "bt55", area: "Portstewart" },
  ],
  Armagh: [
    { code: "bt35", area: "Newry South" },
    { code: "bt60", area: "Armagh North" },
    { code: "bt61", area: "Armagh" },
    { code: "bt62", area: "Portadown" },
    { code: "bt63", area: "Lurgan" },
    { code: "bt64", area: "Craigavon" },
    { code: "bt65", area: "Craigavon South" },
    { code: "bt66", area: "Craigavon West" },
  ],
  Tyrone: [
    { code: "bt68", area: "Caledon" },
    { code: "bt69", area: "Aughnacloy" },
    { code: "bt70", area: "Dungannon East" },
    { code: "bt71", area: "Dungannon" },
    { code: "bt75", area: "Fivemiletown" },
    { code: "bt76", area: "Clogher" },
    { code: "bt77", area: "Augher" },
    { code: "bt78", area: "Omagh" },
    { code: "bt79", area: "Omagh East" },
    { code: "bt80", area: "Cookstown" },
    { code: "bt81", area: "Castlederg" },
    { code: "bt82", area: "Strabane" },
  ],
  Fermanagh: [
    { code: "bt74", area: "Enniskillen" },
  ],
};

const CITY_PAGES: { name: string; slug: string; county: string }[] = [
  { name: "Belfast",          slug: "belfast",        county: "Antrim"    },
  { name: "Ballymena",        slug: "ballymena",      county: "Antrim"    },
  { name: "Antrim",           slug: "antrim",         county: "Antrim"    },
  { name: "Larne",            slug: "larne",          county: "Antrim"    },
  { name: "Lisburn",          slug: "lisburn",        county: "Antrim"    },
  { name: "Carrickfergus",    slug: "carrickfergus",  county: "Antrim"    },
  { name: "Newtownabbey",     slug: "newtownabbey",   county: "Antrim"    },
  { name: "Ballymoney",       slug: "ballymoney",     county: "Antrim"    },
  { name: "Bangor",           slug: "bangor",         county: "Down"      },
  { name: "Newry",            slug: "newry",          county: "Down"      },
  { name: "Downpatrick",      slug: "downpatrick",    county: "Down"      },
  { name: "Ballynahinch",     slug: "ballynahinch",   county: "Down"      },
  { name: "Derry / Londonderry", slug: "derry",       county: "Derry"     },
  { name: "Coleraine",        slug: "coleraine",      county: "Derry"     },
  { name: "Magherafelt",      slug: "magherafelt",    county: "Derry"     },
  { name: "Limavady",         slug: "limavady",       county: "Derry"     },
  { name: "Omagh",            slug: "omagh",          county: "Tyrone"    },
  { name: "Dungannon",        slug: "dungannon",      county: "Tyrone"    },
  { name: "Cookstown",        slug: "cookstown",      county: "Tyrone"    },
  { name: "Strabane",         slug: "strabane",       county: "Tyrone"    },
  { name: "Armagh",           slug: "armagh",         county: "Armagh"    },
  { name: "Portadown",        slug: "portadown",      county: "Armagh"    },
  { name: "Lurgan",           slug: "lurgan",         county: "Armagh"    },
  { name: "Enniskillen",      slug: "enniskillen",    county: "Fermanagh" },
];

const BLOG_ARTICLES = [
  { title: "When Is the Cheapest Time to Buy Heating Oil in Northern Ireland?",              slug: "cheapest-time-buy-heating-oil-northern-ireland" },
  { title: "How to Find the Best Heating Oil Prices in Northern Ireland",                    slug: "find-best-heating-oil-prices-northern-ireland" },
  { title: "Heating Oil Tank Sizes in Northern Ireland: 300L, 500L and 900L",               slug: "heating-oil-tank-sizes" },
  { title: "Best Time to Buy Heating Oil in NI: Key Tips for Saving Money",                 slug: "best-time-buy-heating-oil-northern-ireland" },
  { title: "How to Properly Dispose of Home Heating Oil in Northern Ireland",                slug: "how-to-dispose-heating-oil-northern-ireland" },
  { title: "Heating Oil Tank Maintenance Guide for Northern Ireland Homes",                  slug: "heating-oil-tank-maintenance-guide" },
  { title: "How to Save Money on Heating Oil: Expert Tips for NI Homeowners",               slug: "how-to-save-money-heating-oil" },
];

const COUNTIES = ["Antrim", "Down", "Derry", "Tyrone", "Armagh", "Fermanagh"] as const;

const toSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function SectionHeader({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-brand-forest flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-brand-cream">{icon}</span>
      </div>
      <div>
        <h2 className="text-base font-bold text-brand-ink leading-tight">{title}</h2>
        <p className="text-xs text-brand-muted mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function LinkItem({ href, label, external }: { href: string; label: string; external?: boolean }) {
  if (external) {
    return (
      <a
        href={href}
        className="flex items-center gap-1.5 text-sm text-brand-ink hover:text-brand-forest transition-colors group"
      >
        <ArrowRight className="w-3 h-3 text-brand-line group-hover:text-brand-forest flex-shrink-0" />
        {label}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-sm text-brand-ink hover:text-brand-forest transition-colors group"
    >
      <ArrowRight className="w-3 h-3 text-brand-line group-hover:text-brand-forest flex-shrink-0" />
      {label}
    </Link>
  );
}

export default function Sitemap() {
  const { data: suppliers } = useQuery<any[]>({
    queryKey: ["/api/suppliers"],
    staleTime: 1000 * 60 * 30,
  });

  const suppliersArray = Array.isArray(suppliers) ? suppliers : [];

  // Group city pages by county
  const citiesByCounty = COUNTIES.reduce<Record<string, typeof CITY_PAGES>>((acc, county) => {
    acc[county] = CITY_PAGES.filter((c) => c.county === county);
    return acc;
  }, {} as Record<string, typeof CITY_PAGES>);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Site Map — NI Heating Oil",
    "url": "https://niheatingoil.com/sitemap",
    "description": "Complete directory of all pages on NIHeatingOil.com — price comparison, location pages, supplier profiles, blog, and company information.",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://niheatingoil.com" },
        { "@type": "ListItem", "position": 2, "name": "Site Map", "item": "https://niheatingoil.com/sitemap" },
      ],
    },
  };

  return (
    <PageShell>
      <SEOHead
        title="Site Map | NIHeatingOil.com"
        description="Complete directory of all pages on NIHeatingOil.com — heating oil price comparison, location pages, supplier profiles, blog guides, and company information."
        keywords="site map, NIHeatingOil, heating oil Northern Ireland, all pages"
        canonicalUrl="https://niheatingoil.com/sitemap"
        structuredData={structuredData}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Site Map" }]}
        title="Site "
        accent="Map"
        intro="Every page on NIHeatingOil.com — price comparison, location pages, supplier profiles, guides, and company information."
        overlap
      />
      <OverlapSection>
        <div className="pb-16 max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Price Comparison */}
            <div className="bg-white border border-brand-line rounded-xl p-5">
              <SectionHeader
                icon={<BarChart2 className="w-4 h-4" />}
                title="Price Comparison"
                description="Main price tools and data"
              />
              <div className="space-y-2">
                <LinkItem href="/"                                label="Compare Prices — Home" />
                <LinkItem href="/ni-heating-oil-price-index"     label="NI Heating Oil Price Index" />
                <LinkItem href="/heating-oil-prices"             label="All Location Price Pages" />
                <LinkItem href="/alerts"                         label="Price Alerts" />
                <LinkItem href="/compare-heating"                label="Compare Heating Fuels" />
              </div>
            </div>

            {/* Company */}
            <div className="bg-white border border-brand-line rounded-xl p-5">
              <SectionHeader
                icon={<Info className="w-4 h-4" />}
                title="Company"
                description="About us, contact, and our mission"
              />
              <div className="space-y-2">
                <LinkItem href="/about"       label="About Us" />
                <LinkItem href="/contact"     label="Contact" />
                <LinkItem href="/giving-back" label="Giving Back — Simon Community NI" />
                <LinkItem href="/blog"        label="Blog & Guides" />
                <LinkItem href="/auth"        label="Sign In / Register" />
              </div>
            </div>

            {/* Suppliers */}
            <div className="bg-white border border-brand-line rounded-xl p-5 md:col-span-2">
              <SectionHeader
                icon={<Users className="w-4 h-4" />}
                title="Heating Oil Suppliers"
                description="Directory of verified NI heating oil distributors"
              />
              <div className="mb-3">
                <LinkItem href="/suppliers" label="Supplier Directory" />
              </div>
              {suppliersArray.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1.5 pt-3 border-t border-brand-line">
                  {suppliersArray.map((s: any) => (
                    <Link
                      key={s.id}
                      href={`/suppliers/${toSlug(s.name)}`}
                      className="flex items-center gap-1 text-xs text-brand-muted hover:text-brand-forest transition-colors group truncate"
                    >
                      <ArrowRight className="w-2.5 h-2.5 flex-shrink-0 text-brand-line group-hover:text-brand-forest" />
                      <span className="truncate">{s.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Blog */}
            <div className="bg-white border border-brand-line rounded-xl p-5 md:col-span-2">
              <SectionHeader
                icon={<BookOpen className="w-4 h-4" />}
                title="Blog & Guides"
                description="Advice, buying guides, and money-saving tips"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                {BLOG_ARTICLES.map(({ title, slug }) => (
                  <Link
                    key={slug}
                    href={`/blog/${slug}`}
                    className="flex items-start gap-1.5 text-sm text-brand-ink hover:text-brand-forest transition-colors group"
                  >
                    <ArrowRight className="w-3 h-3 text-brand-line group-hover:text-brand-forest flex-shrink-0 mt-0.5" />
                    {title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Prices by Town */}
            <div className="bg-white border border-brand-line rounded-xl p-5 md:col-span-2">
              <SectionHeader
                icon={<MapPin className="w-4 h-4" />}
                title="Heating Oil Prices by Town"
                description="Live prices for 24 towns and cities across Northern Ireland"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {COUNTIES.map((county) => (
                  <div key={county}>
                    <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest mb-2">
                      Co. {county}
                    </p>
                    <ul className="space-y-1.5">
                      {citiesByCounty[county].map(({ name, slug }) => (
                        <li key={slug}>
                          <Link
                            href={`/heating-oil-prices/${slug}/`}
                            className="flex items-center gap-1 text-sm text-brand-ink hover:text-brand-forest transition-colors group"
                          >
                            <MapPin className="w-2.5 h-2.5 text-brand-line group-hover:text-brand-forest flex-shrink-0" />
                            {name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Prices by BT Postcode */}
            <div className="bg-white border border-brand-line rounded-xl p-5 md:col-span-2">
              <SectionHeader
                icon={<Flame className="w-4 h-4" />}
                title="Heating Oil Prices by BT Postcode"
                description="All 71 BT postcode districts across Northern Ireland"
              />
              <div className="space-y-5">
                {COUNTIES.map((county) => (
                  <div key={county}>
                    <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest mb-2 pb-1.5 border-b border-brand-line">
                      County {county}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-1.5">
                      {BT_BY_COUNTY[county].map(({ code, area }) => (
                        <Link
                          key={code}
                          href={`/heating-oil-prices/${code}/`}
                          className="flex items-center gap-1 text-xs text-brand-muted hover:text-brand-forest transition-colors group"
                        >
                          <ArrowRight className="w-2.5 h-2.5 text-brand-line group-hover:text-brand-forest flex-shrink-0" />
                          <span className="font-medium uppercase text-brand-ink">{code}</span>
                          <span className="truncate hidden sm:block">— {area}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </OverlapSection>
    </PageShell>
  );
}
