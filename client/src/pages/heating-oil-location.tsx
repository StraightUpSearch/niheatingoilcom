import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/seo-head";
import { PageShell, PageHero, OverlapSection, SurfaceCard, PriceRow, PriceRowData } from "@/components/brand-ui";
import { Phone, Globe, MapPin, ArrowRight, Clock, ChevronRight, Bell } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// BT postcode → area metadata
const BT_POSTCODES: Record<string, { area: string; towns: string[]; county: string }> = {
  bt1:  { area: "Belfast City Centre", towns: ["Belfast"], county: "Antrim" },
  bt2:  { area: "Belfast City", towns: ["Belfast"], county: "Antrim" },
  bt3:  { area: "Belfast Docks", towns: ["Belfast"], county: "Antrim" },
  bt4:  { area: "East Belfast", towns: ["Stormont", "Knock"], county: "Antrim" },
  bt5:  { area: "East Belfast", towns: ["Castlereagh", "Dundonald"], county: "Antrim" },
  bt6:  { area: "South-East Belfast", towns: ["Castlereagh"], county: "Antrim" },
  bt7:  { area: "South Belfast", towns: ["Botanic", "Stranmillis"], county: "Antrim" },
  bt8:  { area: "South Belfast", towns: ["Saintfield Road", "Carryduff"], county: "Antrim" },
  bt9:  { area: "South-West Belfast", towns: ["Malone", "Balmoral"], county: "Antrim" },
  bt10: { area: "West Belfast", towns: ["Finaghy", "Dunmurry"], county: "Antrim" },
  bt11: { area: "West Belfast", towns: ["Andersonstown"], county: "Antrim" },
  bt12: { area: "West Belfast", towns: ["Falls Road", "Shankill"], county: "Antrim" },
  bt13: { area: "West Belfast", towns: ["Shankill", "Springfield"], county: "Antrim" },
  bt14: { area: "North Belfast", towns: ["North Belfast"], county: "Antrim" },
  bt15: { area: "North Belfast", towns: ["Shore Road", "Greencastle"], county: "Antrim" },
  bt16: { area: "East Belfast", towns: ["Dundonald"], county: "Down" },
  bt17: { area: "West Belfast", towns: ["Dunmurry", "Poleglass"], county: "Antrim" },
  bt18: { area: "Holywood", towns: ["Holywood"], county: "Down" },
  bt19: { area: "Bangor West", towns: ["Bangor", "Groomsport"], county: "Down" },
  bt20: { area: "Bangor", towns: ["Bangor"], county: "Down" },
  bt21: { area: "Bangor East", towns: ["Bangor"], county: "Down" },
  bt22: { area: "Newtownards Peninsula", towns: ["Newtownards", "Portaferry"], county: "Down" },
  bt23: { area: "Newtownards", towns: ["Newtownards", "Comber"], county: "Down" },
  bt24: { area: "Ballynahinch", towns: ["Ballynahinch", "Saintfield"], county: "Down" },
  bt25: { area: "Dromore", towns: ["Dromore"], county: "Down" },
  bt26: { area: "Hillsborough", towns: ["Hillsborough", "Moira"], county: "Down" },
  bt27: { area: "Lisburn East", towns: ["Lisburn"], county: "Antrim" },
  bt28: { area: "Lisburn", towns: ["Lisburn"], county: "Antrim" },
  bt29: { area: "Crumlin", towns: ["Crumlin", "Nutts Corner"], county: "Antrim" },
  bt30: { area: "Downpatrick", towns: ["Downpatrick"], county: "Down" },
  bt31: { area: "Castlewellan", towns: ["Castlewellan", "Rathfriland"], county: "Down" },
  bt32: { area: "Banbridge", towns: ["Banbridge"], county: "Down" },
  bt33: { area: "Newcastle", towns: ["Newcastle"], county: "Down" },
  bt34: { area: "Newry", towns: ["Newry", "Warrenpoint"], county: "Down" },
  bt35: { area: "Newry South", towns: ["Newry", "Crossmaglen"], county: "Armagh" },
  bt36: { area: "Newtownabbey", towns: ["Newtownabbey", "Glengormley"], county: "Antrim" },
  bt37: { area: "Newtownabbey", towns: ["Jordanstown", "Whiteabbey"], county: "Antrim" },
  bt38: { area: "Carrickfergus", towns: ["Carrickfergus"], county: "Antrim" },
  bt39: { area: "Ballyclare", towns: ["Ballyclare", "Doagh"], county: "Antrim" },
  bt40: { area: "Larne", towns: ["Larne", "Carnlough"], county: "Antrim" },
  bt41: { area: "Antrim", towns: ["Antrim", "Randalstown"], county: "Antrim" },
  bt42: { area: "Ballymena South", towns: ["Ballymena", "Ahoghill"], county: "Antrim" },
  bt43: { area: "Ballymena", towns: ["Ballymena"], county: "Antrim" },
  bt44: { area: "Ballymoney Area", towns: ["Ballymoney", "Cushendall"], county: "Antrim" },
  bt45: { area: "Magherafelt", towns: ["Magherafelt", "Moneymore"], county: "Derry" },
  bt46: { area: "Maghera", towns: ["Maghera", "Draperstown"], county: "Derry" },
  bt47: { area: "Londonderry South", towns: ["Waterside", "Claudy"], county: "Derry" },
  bt48: { area: "Londonderry", towns: ["Derry / Londonderry"], county: "Derry" },
  bt49: { area: "Limavady", towns: ["Limavady"], county: "Derry" },
  bt51: { area: "Coleraine East", towns: ["Coleraine", "Garvagh"], county: "Derry" },
  bt52: { area: "Coleraine", towns: ["Coleraine", "Portstewart"], county: "Derry" },
  bt53: { area: "Ballymoney", towns: ["Ballymoney"], county: "Antrim" },
  bt54: { area: "Ballycastle", towns: ["Ballycastle", "Cushendun"], county: "Antrim" },
  bt55: { area: "Portstewart", towns: ["Portstewart"], county: "Derry" },
  bt56: { area: "Portrush", towns: ["Portrush"], county: "Antrim" },
  bt57: { area: "Bushmills", towns: ["Bushmills", "Giant's Causeway"], county: "Antrim" },
  bt60: { area: "Armagh North", towns: ["Armagh", "Tandragee"], county: "Armagh" },
  bt61: { area: "Armagh", towns: ["Armagh"], county: "Armagh" },
  bt62: { area: "Portadown", towns: ["Portadown"], county: "Armagh" },
  bt63: { area: "Lurgan", towns: ["Lurgan", "Craigavon"], county: "Armagh" },
  bt64: { area: "Craigavon", towns: ["Craigavon"], county: "Armagh" },
  bt65: { area: "Craigavon South", towns: ["Lurgan"], county: "Armagh" },
  bt66: { area: "Craigavon West", towns: ["Lurgan", "Moira"], county: "Armagh" },
  bt67: { area: "Moira", towns: ["Moira", "Aghalee"], county: "Antrim" },
  bt68: { area: "Caledon", towns: ["Caledon", "Aughnacloy"], county: "Tyrone" },
  bt69: { area: "Aughnacloy", towns: ["Aughnacloy"], county: "Tyrone" },
  bt70: { area: "Dungannon East", towns: ["Dungannon"], county: "Tyrone" },
  bt71: { area: "Dungannon", towns: ["Dungannon", "Coalisland"], county: "Tyrone" },
  bt74: { area: "Enniskillen", towns: ["Enniskillen"], county: "Fermanagh" },
  bt75: { area: "Fivemiletown", towns: ["Fivemiletown", "Clogher"], county: "Tyrone" },
  bt76: { area: "Clogher", towns: ["Clogher"], county: "Tyrone" },
  bt77: { area: "Augher", towns: ["Augher", "Ballygawley"], county: "Tyrone" },
  bt78: { area: "Omagh", towns: ["Omagh"], county: "Tyrone" },
  bt79: { area: "Omagh East", towns: ["Omagh", "Cookstown"], county: "Tyrone" },
  bt80: { area: "Cookstown", towns: ["Cookstown"], county: "Tyrone" },
  bt81: { area: "Castlederg", towns: ["Castlederg"], county: "Tyrone" },
  bt82: { area: "Strabane", towns: ["Strabane"], county: "Tyrone" },
};

// City slug → postcode cluster (for internal linking on city pages)
const CITY_POSTCODE_CLUSTERS: Record<string, string[]> = {
  belfast:        ["bt1","bt2","bt3","bt4","bt5","bt6","bt7","bt8","bt9","bt10","bt11","bt12","bt13","bt14","bt15","bt16","bt17"],
  bangor:         ["bt19","bt20","bt21"],
  lisburn:        ["bt27","bt28"],
  londonderry:    ["bt47","bt48"],
  derry:          ["bt47","bt48"],
  newry:          ["bt34","bt35"],
  newtownabbey:   ["bt36","bt37"],
  armagh:         ["bt60","bt61"],
  ballymena:      ["bt42","bt43"],
  coleraine:      ["bt51","bt52"],
  omagh:          ["bt78","bt79"],
  dungannon:      ["bt70","bt71"],
  magherafelt:    ["bt45","bt46"],
  strabane:       ["bt82"],
  antrim:         ["bt41"],
  ballymoney:     ["bt44","bt53"],
  portadown:      ["bt62","bt63"],
  lurgan:         ["bt65","bt66"],
  enniskillen:    ["bt74"],
  cookstown:      ["bt80"],
  downpatrick:    ["bt30"],
  carrickfergus:  ["bt38"],
  larne:          ["bt40"],
  limavady:       ["bt49"],
  ballynahinch:   ["bt24"],
};

// City slug → primary BT postcode + metadata
const CITY_SLUGS: Record<string, { postcode: string; name: string; description: string }> = {
  belfast:        { postcode: "BT1",  name: "Belfast",              description: "Northern Ireland's capital city" },
  bangor:         { postcode: "BT20", name: "Bangor",               description: "coastal town in County Down" },
  lisburn:        { postcode: "BT28", name: "Lisburn",              description: "city in County Antrim and County Down" },
  londonderry:    { postcode: "BT48", name: "Londonderry",          description: "city on the River Foyle" },
  derry:          { postcode: "BT48", name: "Derry / Londonderry",  description: "city on the River Foyle" },
  newry:          { postcode: "BT34", name: "Newry",                description: "city in County Down and County Armagh" },
  newtownabbey:   { postcode: "BT36", name: "Newtownabbey",         description: "large town north of Belfast" },
  armagh:         { postcode: "BT61", name: "Armagh",               description: "city of ecclesiastical capital of Ireland" },
  ballymena:      { postcode: "BT43", name: "Ballymena",            description: "town in County Antrim" },
  coleraine:      { postcode: "BT52", name: "Coleraine",            description: "town on the River Bann" },
  omagh:          { postcode: "BT78", name: "Omagh",                description: "county town of Tyrone" },
  dungannon:      { postcode: "BT71", name: "Dungannon",            description: "town in County Tyrone" },
  enniskillen:    { postcode: "BT74", name: "Enniskillen",          description: "county town of Fermanagh" },
  cookstown:      { postcode: "BT80", name: "Cookstown",            description: "town in County Tyrone" },
  downpatrick:    { postcode: "BT30", name: "Downpatrick",          description: "county town of Down" },
  portadown:      { postcode: "BT62", name: "Portadown",            description: "town in County Armagh" },
  lurgan:         { postcode: "BT66", name: "Lurgan",               description: "town in County Armagh" },
  antrim:         { postcode: "BT41", name: "Antrim",               description: "town on the shores of Lough Neagh" },
  carrickfergus:  { postcode: "BT38", name: "Carrickfergus",        description: "historic town in County Antrim" },
  larne:          { postcode: "BT40", name: "Larne",                description: "port town in County Antrim" },
  magherafelt:    { postcode: "BT45", name: "Magherafelt",          description: "town in County Derry" },
  strabane:       { postcode: "BT82", name: "Strabane",             description: "town on the River Mourne" },
  limavady:       { postcode: "BT49", name: "Limavady",             description: "town in County Derry" },
  ballymoney:     { postcode: "BT53", name: "Ballymoney",           description: "market town in County Antrim" },
  ballynahinch:   { postcode: "BT24", name: "Ballynahinch",         description: "town in County Down" },
};

interface PriceResult {
  id: number;
  supplierId: number;
  volume: number;
  price: string;
  pricePerLitre: string;
  includesVat: number;
  supplier: {
    id: number;
    name: string;
    location: string;
    phone: string;
    website: string;
    coverageAreas: string;
  };
}

interface NISummary {
  [volume: number]: { cheapest: number; average: number; count: number; updatedAt: string };
}

export default function HeatingOilLocation() {
  const { location } = useParams<{ location: string }>();
  const slug = (location || "").toLowerCase().replace(/\s+/g, "-");

  // Resolve to postcode + display name
  let postcode = "";
  let displayName = "";
  let isPostcode = false;
  let postcodeData: typeof BT_POSTCODES[string] | null = null;
  let cityData: typeof CITY_SLUGS[string] | null = null;

  if (slug.startsWith("bt")) {
    isPostcode = true;
    postcode = slug.toUpperCase();
    postcodeData = BT_POSTCODES[slug] || null;
    displayName = postcodeData ? `${postcode} — ${postcodeData.area}` : postcode;
  } else {
    cityData = CITY_SLUGS[slug] || null;
    if (cityData) {
      postcode = cityData.postcode;
      displayName = cityData.name;
    }
  }

  const isValid = !!postcode;

  const { data: prices500, isLoading: loading500 } = useQuery<PriceResult[]>({
    queryKey: ["/api/prices", { postcode, volume: 500 }],
    queryFn: () =>
      fetch(`/api/prices?postcode=${encodeURIComponent(postcode)}&volume=500&sort=price`).then(r => r.json()),
    enabled: isValid,
  });

  const { data: prices300 } = useQuery<PriceResult[]>({
    queryKey: ["/api/prices", { postcode, volume: 300 }],
    queryFn: () =>
      fetch(`/api/prices?postcode=${encodeURIComponent(postcode)}&volume=300&sort=price`).then(r => r.json()),
    enabled: isValid,
  });

  const { data: prices900 } = useQuery<PriceResult[]>({
    queryKey: ["/api/prices", { postcode, volume: 900 }],
    queryFn: () =>
      fetch(`/api/prices?postcode=${encodeURIComponent(postcode)}&volume=900&sort=price`).then(r => r.json()),
    enabled: isValid,
  });

  const { data: prices1000 } = useQuery<PriceResult[]>({
    queryKey: ["/api/prices", { postcode, volume: 1000 }],
    queryFn: () =>
      fetch(`/api/prices?postcode=${encodeURIComponent(postcode)}&volume=1000&sort=price`).then(r => r.json()),
    enabled: isValid,
  });

  const { data: niSummary } = useQuery<NISummary>({
    queryKey: ["/api/prices/ni-summary"],
    queryFn: () => fetch("/api/prices/ni-summary").then(r => r.json()),
  });

  interface HistoryRecord { supplierId: number; volume: number; averagePrice: string; lowestPrice: string; highestPrice: string; date: string }
  const { data: priceHistoryRaw } = useQuery<HistoryRecord[]>({
    queryKey: ["/api/prices/history", { volume: 500 }],
    queryFn: () => fetch("/api/prices/history?days=30&volume=500").then(r => r.json()),
    enabled: isValid,
  });

  if (!isValid) {
    return (
      <PageShell>
        <div className="mx-auto max-w-[1200px] px-4 py-24 text-center sm:px-8">
          <h1 className="font-display font-extrabold text-[32px] text-brand-ink mb-3">Location Not Found</h1>
          <p className="text-brand-muted mb-6">We don't have data for "{location}". Try a BT postcode or a major NI town.</p>
          <Link href="/">
            <button className="px-5 py-2.5 bg-brand-gold hover:brightness-95 text-brand-ink rounded-xl text-sm font-bold transition-[filter]">
              Compare prices by postcode
            </button>
          </Link>
        </div>
      </PageShell>
    );
  }

  const cheapest500 = prices500?.[0];
  const cheapest300 = prices300?.[0];
  const cheapest900 = prices900?.[0];
  const cheapest1000 = prices1000?.[0];
  const supplierCount = prices500?.length ?? 0;
  const now = new Date();
  const updatedAt = now.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const updatedDate = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const pageTitle = isPostcode
    ? `Heating Oil Prices in ${postcode} — Updated ${updatedDate} | NI Heating Oil`
    : `Heating Oil Prices in ${displayName} — Updated ${updatedDate} | NI Heating Oil`;
  const pageDescription = isPostcode
    ? `Compare current heating oil prices in ${postcode} (${postcodeData?.area || postcode}). Find the cheapest supplier for 300L, 500L and 900L delivery. ${supplierCount} suppliers available.`
    : `Compare current heating oil prices in ${displayName}, Northern Ireland. Find the cheapest supplier for 300L, 500L and 900L delivery. Updated ${updatedAt}.`;
  const canonicalUrl = `https://niheatingoil.com/heating-oil-prices/${slug}/`;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://niheatingoil.com" },
        { "@type": "ListItem", "position": 2, "name": "Heating Oil Prices", "item": "https://niheatingoil.com/heating-oil-prices/" },
        { "@type": "ListItem", "position": 3, "name": displayName },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": pageTitle,
      "description": pageDescription,
      "url": canonicalUrl,
      "dateModified": now.toISOString(),
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://niheatingoil.com" },
          { "@type": "ListItem", "position": 2, "name": `Prices in ${displayName}` },
        ],
      },
    },
  ];

  // Aggregate history: group by day, take min lowestPrice
  const chartData = (() => {
    if (!priceHistoryRaw || priceHistoryRaw.length === 0) return [];
    const byDay: Record<string, number[]> = {};
    priceHistoryRaw.forEach(r => {
      const day = r.date.slice(0, 10);
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(parseFloat(r.lowestPrice));
    });
    return Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, prices]) => ({
        date: new Date(day).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        price: Math.min(...prices),
      }));
  })();

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={`heating oil ${postcode}, heating oil ${displayName}, cheapest heating oil ${isPostcode ? postcode : displayName}, oil delivery ${displayName} Northern Ireland`}
        canonicalUrl={canonicalUrl}
        structuredData={structuredData}
      />
      <PageShell>
        <PageHero
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Heating Oil Prices", href: "/heating-oil-prices" },
            { label: isPostcode ? postcode : displayName },
          ]}
          title="Heating oil prices in "
          accent={isPostcode ? postcode : displayName}
          intro={
            postcodeData
              ? `${postcodeData.area}, County ${postcodeData.county}${supplierCount > 0 ? ` · ${supplierCount} supplier${supplierCount !== 1 ? "s" : ""}` : ""}`
              : cityData
                ? `${supplierCount > 0 ? `${supplierCount} supplier${supplierCount !== 1 ? "s" : ""} delivering to ${displayName}` : displayName + ", Northern Ireland"}`
                : undefined
          }
          overlap
        />
        <OverlapSection>
          <div className="pb-16">

        {/* Price Summary Table */}
        {loading500 ? (
          <SurfaceCard tone="paper" className="mb-8 animate-pulse">
            {[300, 500, 900, 1000].map(v => (
              <div key={v} className="flex gap-4 px-4 py-3 border-b border-brand-line">
                <div className="h-4 w-12 bg-brand-line rounded" />
                <div className="h-4 w-20 bg-brand-line rounded ml-auto" />
                <div className="h-4 w-20 bg-brand-line rounded" />
              </div>
            ))}
          </SurfaceCard>
        ) : (
          <SurfaceCard tone="butter" className="overflow-hidden mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-cream border-b border-brand-line">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-brand-muted uppercase tracking-wide">Volume</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-brand-muted uppercase tracking-wide">Cheapest</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-brand-muted uppercase tracking-wide hidden sm:table-cell">p/litre</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-brand-muted uppercase tracking-wide hidden sm:table-cell">NI Average</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-brand-muted uppercase tracking-wide hidden md:table-cell">Saving</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { volume: 300, data: cheapest300 },
                  { volume: 500, data: cheapest500 },
                  { volume: 900, data: cheapest900 },
                  { volume: 1000, data: cheapest1000 },
                ].map(({ volume, data }) => {
                  const niAvg = niSummary?.[volume]?.average;
                  const price = data ? parseFloat(data.price) : null;
                  const saving = price && niAvg && niAvg > 0 ? niAvg - price : null;
                  const ppl = data ? (parseFloat(data.pricePerLitre) * 100).toFixed(1) : null;
                  return (
                    <tr key={volume} className="hover:bg-white transition-colors">
                      <td className="px-4 py-3 font-medium text-brand-ink">{volume}L</td>
                      <td className="px-4 py-3 text-right">
                        {price !== null
                          ? <span className="font-semibold text-[#0B6A30]">£{price.toFixed(2)}</span>
                          : <span className="text-brand-muted">—</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-right text-brand-muted hidden sm:table-cell">
                        {ppl ? `${ppl}p` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-brand-muted hidden sm:table-cell">
                        {niAvg && niAvg > 0 ? `£${niAvg.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        {saving !== null && saving > 0
                          ? <span className="text-[#0B6A30] font-medium">£{saving.toFixed(2)}</span>
                          : saving !== null && saving <= 0
                            ? <span className="text-brand-muted">—</span>
                            : <span className="text-brand-muted">—</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-xs text-brand-muted px-4 py-2 border-t border-brand-line">Prices include VAT. Updated from verified supplier data.</p>
          </SurfaceCard>
        )}

        {/* 30-day price history chart */}
        {chartData.length > 1 && (
          <SurfaceCard tone="paper" className="p-5 mb-8">
            <h2 className="text-sm font-semibold text-brand-ink mb-4">NI heating oil price trend — 500L (30 days)</h2>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CFC6B3" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={v => `£${v.toFixed(0)}`} domain={["auto", "auto"]} />
                <Tooltip formatter={(v: number) => [`£${v.toFixed(2)}`, "Cheapest 500L"]} labelStyle={{ fontSize: 11 }} contentStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="price" stroke="#11381F" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </SurfaceCard>
        )}

        {/* Supplier Comparison Table */}
        {!loading500 && prices500 && prices500.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-brand-ink mb-3">
              Heating oil suppliers serving {isPostcode ? postcode : displayName}
            </h2>
            <ul className="flex flex-col gap-3">
              {prices500.map((item, index) => (
                <PriceRow
                  key={item.id}
                  row={{
                    id: item.id,
                    name: item.supplier.name,
                    serves: item.supplier.coverageAreas,
                    price: parseFloat(item.price),
                    pricePerLitre: parseFloat(item.pricePerLitre),
                    phone: item.supplier.phone,
                    website: item.supplier.website,
                    profileHref: `/suppliers/${item.supplierId}`,
                  }}
                  isCheapest={index === 0}
                  average={niSummary?.[500]?.average}
                />
              ))}
            </ul>
            <p className="text-xs text-brand-muted text-center mt-4">
              Prices include VAT and standard delivery. Confirm with supplier before ordering.
            </p>
          </div>
        )}

        {!loading500 && prices500?.length === 0 && (
          <SurfaceCard tone="paper" className="p-8 text-center mb-8">
            <p className="text-brand-ink font-medium">No suppliers found for {isPostcode ? postcode : displayName}</p>
            <p className="text-brand-muted text-sm mt-1">
              Try a neighbouring postcode or search by your full postcode below.
            </p>
          </SurfaceCard>
        )}

        {/* CTA */}
        <SurfaceCard tone="paper" className="p-6 mb-8">
          <h2 className="text-base font-semibold text-brand-ink mb-1">
            Get your exact price for {isPostcode ? postcode : displayName}
          </h2>
          <p className="text-sm text-brand-muted mb-4">
            Enter your full postcode to see all suppliers serving your area with live pricing.
          </p>
          <Link href={`/results?postcode=${encodeURIComponent(postcode)}&volume=500`}>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-gold hover:brightness-95 text-white font-medium rounded-lg transition-colors text-sm">
              Compare all suppliers
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </SurfaceCard>

        {/* Price alert CTA */}
        <SurfaceCard tone="mint" className="p-6 mb-8">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-brand-forest mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-base font-semibold text-brand-ink mb-1">
                Get notified when prices drop in {isPostcode ? postcode : displayName}
              </h2>
              <p className="text-sm text-brand-muted mb-4">
                Set a price alert for {isPostcode ? postcode : displayName} and we'll email you when 500L drops below your target price. Free to set up — no commitment.
              </p>
              <Link href={`/alerts`}>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-brand-forest hover:bg-brand-forest-soft text-white font-medium rounded-lg transition-colors text-sm">
                  <Bell className="w-3.5 h-3.5" />
                  Set a price alert for {isPostcode ? postcode : displayName}
                </button>
              </Link>
            </div>
          </div>
        </SurfaceCard>

        {/* Quick info */}
        <div className="prose prose-sm prose-gray max-w-none">
          <h2 className="text-lg font-semibold text-brand-ink not-prose mb-3">
            About heating oil delivery in {isPostcode ? `${postcode} — ${postcodeData?.area || ""}` : displayName}
          </h2>
          <p className="text-sm text-brand-muted">
            {isPostcode
              ? `The ${postcode} postcode area covers ${postcodeData?.towns.join(" and ")} in County ${postcodeData?.county}, Northern Ireland. ${supplierCount > 0 ? `We currently list ${supplierCount} supplier${supplierCount !== 1 ? "s" : ""} delivering heating oil to this area.` : ""} Prices shown are for standard home heating oil (kerosene/28-second oil) including VAT.`
              : `${displayName} is a ${cityData?.description}. Heating oil is the primary home heating fuel for most households in this area. ${supplierCount > 0 ? `We list ${supplierCount} supplier${supplierCount !== 1 ? "s" : ""} currently delivering to the ${cityData?.postcode} area.` : ""} Prices are for kerosene (28-second oil) including VAT and delivery.`
            }
          </p>
          <p className="text-sm text-brand-muted mt-2">
            Prices vary by delivery volume — larger orders typically cost less per litre.
            The 500L delivery is the most common household order. Always ring ahead to confirm
            availability and any minimum order requirements before booking.
          </p>
        </div>

        {/* Nearby postcodes (postcode pages only) */}
        {isPostcode && postcodeData && (() => {
          const match = slug.match(/^(bt)(\d+)$/);
          if (!match) return null;
          const prefix = match[1];
          const num = parseInt(match[2]);
          const nearby = [num - 2, num - 1, num + 1, num + 2]
            .filter(n => n > 0 && n !== num)
            .map(n => `${prefix}${n}`)
            .filter(pc => BT_POSTCODES[pc]);
          if (nearby.length === 0) return null;
          return (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-brand-ink mb-3">Nearby postcode areas</h2>
              <div className="flex flex-wrap gap-2">
                {nearby.map(pc => (
                  <Link
                    key={pc}
                    href={`/heating-oil-prices/${pc}/`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-brand-muted bg-muted hover:bg-brand-line rounded-full transition-colors"
                  >
                    <MapPin className="w-3 h-3" />
                    {pc.toUpperCase()} — {BT_POSTCODES[pc].area}
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Postcode cluster links (city pages only) */}
        {!isPostcode && cityData && (() => {
          const cluster = CITY_POSTCODE_CLUSTERS[slug] || [];
          const validCluster = cluster.filter(pc => BT_POSTCODES[pc]);
          if (validCluster.length === 0) return null;
          return (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-brand-ink mb-3">Heating oil prices by postcode in {displayName}</h2>
              <div className="flex flex-wrap gap-2">
                {validCluster.map(pc => (
                  <Link
                    key={pc}
                    href={`/heating-oil-prices/${pc}/`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-brand-muted bg-muted hover:bg-brand-line rounded-full transition-colors"
                  >
                    <MapPin className="w-3 h-3" />
                    {pc.toUpperCase()} — {BT_POSTCODES[pc].area}
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Supplier pages */}
        {prices500 && prices500.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-brand-ink mb-3">Suppliers serving this area</h2>
            <div className="flex flex-wrap gap-2">
              {prices500.map(item => {
                const supplierSlug = item.supplier.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                return (
                  <Link
                    key={item.supplierId}
                    href={`/supplier/${supplierSlug}/`}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-brand-muted bg-muted hover:bg-brand-line rounded-full transition-colors"
                  >
                    {item.supplier.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

          </div>
        </OverlapSection>
      </PageShell>
    </>
  );
}
