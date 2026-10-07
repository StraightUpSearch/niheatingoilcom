import { useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpDown,
  BarChart3,
  Bell,
  Clock,
  Droplet,
  Heart,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import SEOHead from "@/components/seo-head";
import { PageShell } from "@/components/brand-ui";
import { usePageTitle } from "@/hooks/usePageTitle";
import { trackPriceSearch } from "@/lib/gtm";

/* ------------------------------------------------------------------ */
/* Static content (kept from the current landing.tsx so SEO is unchanged) */
/* ------------------------------------------------------------------ */

const TOWNS = [
  { name: "Belfast", slug: "belfast" },
  { name: "Bangor", slug: "bangor" },
  { name: "Londonderry", slug: "londonderry" },
  { name: "Newry", slug: "newry" },
  { name: "Lisburn", slug: "lisburn" },
  { name: "Newtownabbey", slug: "newtownabbey" },
  { name: "Armagh", slug: "armagh" },
  { name: "Ballymena", slug: "ballymena" },
  { name: "Coleraine", slug: "coleraine" },
  { name: "Omagh", slug: "omagh" },
];
const HERO_CHIPS = TOWNS.slice(0, 6);

const GUIDES = [
  { slug: "best-time-buy-heating-oil-northern-ireland", title: "Best time to buy heating oil in NI", category: "Money saving" },
  { slug: "heating-oil-tank-sizes", title: "Comparing 300L, 500L and 900L tank sizes", category: "Equipment guide" },
  { slug: "how-to-save-money-heating-oil", title: "How to save money on heating oil", category: "Money saving" },
];

// Must stay identical to the current production title to protect rankings. The separator is an em dash,
// written as an escape so the source file stays dash free.
const PAGE_TITLE = `Heating Oil Prices NI \u2014 Compare Suppliers by BT Postcode | NI Heating Oil`;

const SUPPORT_URL = "https://www.nidirect.gov.uk/articles/affordable-warmth-scheme";
const BBC_URL = "https://www.bbc.co.uk/news/articles/cdxn5zn26xeo";
const VOLUMES = [300, 500, 900, 1000] as const;

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type NiSummary = Record<number, { cheapest: number; average: number; count: number; updatedAt?: string }>;

interface PriceRow {
  id: number;
  supplierId: number;
  volume: number;
  price: string;
  pricePerLitre: string;
  createdAt: string;
  supplier: { id: number; name: string; coverageAreas: string; phone: string; website: string };
}

const gbp = (n: number) => `£${n.toFixed(2)}`;
const display = "font-display font-extrabold";

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function Landing() {
  usePageTitle(PAGE_TITLE);
  const [, setLocation] = useLocation();
  const postcodeRef = useRef<HTMLInputElement>(null);

  const [postcode, setPostcode] = useState("");
  const [volume, setVolume] = useState<number>(500);

  const { data: summary } = useQuery<NiSummary>({
    queryKey: ["/api/prices/ni-summary"],
    staleTime: 1000 * 60 * 30,
  });
  const { data: prices } = useQuery<PriceRow[]>({
    queryKey: ["/api/prices?volume=500&sort=price"],
    staleTime: 1000 * 60 * 30,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const pc = postcode.trim().toUpperCase();
    if (!pc) {
      postcodeRef.current?.focus();
      return;
    }
    trackPriceSearch(pc, volume);
    setLocation(`/results?postcode=${encodeURIComponent(pc)}&volume=${volume}`);
  };

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "NI Heating Oil",
      "description": "Compare home heating oil prices across Northern Ireland. Find the cheapest supplier in your area.",
      "url": "https://niheatingoil.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://niheatingoil.com/results?postcode={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "NI Heating Oil",
      "url": "https://niheatingoil.com",
      "telephone": "028 96005259",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "14a Victoria Street",
        "addressLocality": "Ballymoney",
        "addressRegion": "Northern Ireland",
        "postalCode": "BT53 6DW",
        "addressCountry": "GB"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://niheatingoil.com" }
      ]
    }
  ];

  return (
    <PageShell>
      <SEOHead
        title={PAGE_TITLE}
        description="Compare live heating oil prices from NI suppliers by BT postcode. 300L, 500L and 900L quotes updated daily."
        keywords="heating oil prices, Northern Ireland, cheapest heating oil NI, oil suppliers, Belfast heating oil, fuel comparison, oil delivery, home heating oil"
        canonicalUrl="https://niheatingoil.com"
        structuredData={structuredData}
      />

      <Hero
        postcode={postcode}
        setPostcode={setPostcode}
        volume={volume}
        setVolume={setVolume}
        onSubmit={submit}
        postcodeRef={postcodeRef}
        summary={summary}
      />
      <QuickTiles />
      <TrustRow supplierCount={summary?.[500]?.count} />
      <CheapestList prices={prices} average500={summary?.[500]?.average} />
      <HowItWorks />
      <AlertsCta />
      <AreaLinks />
      <Guides />
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/* Hero + price board                                                 */
/* ------------------------------------------------------------------ */

function Hero(props: {
  postcode: string;
  setPostcode: (v: string) => void;
  volume: number;
  setVolume: (v: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  postcodeRef: React.RefObject<HTMLInputElement>;
  summary?: NiSummary;
}) {
  const { postcode, setPostcode, volume, setVolume, onSubmit, postcodeRef, summary } = props;
  return (
    <section className="bg-brand-forest text-brand-cream">
      <div className="mx-auto max-w-[1200px] px-4 pb-28 pt-9 sm:px-8 sm:pt-[72px] lg:pb-[140px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-[72px]">
          {/* Left: headline and search */}
          <div className="min-w-0 lg:flex-[1.25]">
            <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-lime">
              Northern Ireland's independent price comparison
            </p>
            {/* H1 wording is decided (D1): Home Heating Oil Prices Comparison in NI */}
            <h1 className={`${display} text-[clamp(44px,6.4vw,80px)] leading-[0.98] tracking-[-0.04em] [text-wrap:balance]`}>
              Home <span className="text-brand-lime">Heating Oil</span> Prices Comparison in NI
            </h1>
            <p className="mt-6 max-w-[520px] text-[clamp(17px,1.6vw,20px)] leading-normal text-[#CFE3D3] [text-wrap:pretty]">
              Enter your BT postcode and tank size. We rank local suppliers by what you would actually pay, cheapest first.
            </p>

            <form id="search" onSubmit={onSubmit} className="mt-9 flex max-w-[580px] flex-col gap-5 rounded-[28px] bg-brand-card p-5 text-brand-ink sm:p-7">
              <div className="flex flex-col gap-2">
                <label htmlFor="postcode" className="text-sm font-semibold">
                  Your BT postcode
                </label>
                <input
                  id="postcode"
                  ref={postcodeRef}
                  type="text"
                  autoComplete="postal-code"
                  placeholder="e.g. BT48 or BT93 1AB"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className="h-[60px] w-full rounded-[14px] border-[1.5px] border-brand-line bg-white px-5 text-lg font-medium outline-none focus-visible:ring-2 focus-visible:ring-brand-forest focus-visible:ring-offset-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span id="tank-label" className="text-sm font-semibold">
                  Tank size
                </span>
                <div role="group" aria-labelledby="tank-label" className="grid grid-cols-4 gap-2">
                  {VOLUMES.map((v) => {
                    const on = volume === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setVolume(v)}
                        className={`h-14 rounded-[14px] border-[1.5px] font-price text-base font-semibold transition-colors ${
                          on ? "border-brand-forest bg-brand-forest text-brand-cream" : "border-brand-line bg-white text-brand-ink hover:border-brand-forest"
                        }`}
                      >
                        {v}L
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="flex h-[62px] items-center justify-center gap-2.5 rounded-[14px] bg-brand-gold text-lg font-bold text-brand-ink transition hover:brightness-95 active:translate-y-px"
              >
                Compare prices <ArrowRight className="h-5 w-5" />
              </button>
              <p className="text-sm text-brand-muted">Free to use. No sign-up. You order direct from the supplier.</p>
            </form>

            <div className="mt-7 flex flex-col gap-3">
              <span className="text-sm font-semibold text-[#A9C7B1]">Or start with your area</span>
              <div className="flex flex-wrap gap-2">
                {HERO_CHIPS.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/heating-oil-prices/${t.slug}/`}
                    className="inline-flex h-11 items-center gap-1.5 rounded-full border-[1.5px] border-[#3E7A55] px-4 text-[15px] font-medium transition-colors hover:bg-[#1D4F31]"
                  >
                    <MapPin className="h-4 w-4" />
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: live price board */}
          <PriceBoard summary={summary} volume={volume} setVolume={setVolume} />
        </div>
      </div>
    </section>
  );
}

function PriceBoard({ summary, volume, setVolume }: { summary?: NiSummary; volume: number; setVolume: (v: number) => void }) {
  const row = summary?.[volume];
  const ready = !!row && row.count > 0;
  const updated = row?.updatedAt
    ? new Date(row.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <div className="relative mt-9 min-w-0 rounded-[32px] border-2 border-brand-cream bg-brand-butter px-5 pb-6 pt-12 text-brand-ink sm:px-9 sm:pb-9 lg:mt-[34px] lg:flex-1">
      <div aria-hidden="true" className="absolute -top-[34px] left-7 flex h-[68px] w-[68px] items-center justify-center rounded-full border-[3px] border-brand-forest bg-brand-lime">
        <Droplet className="h-8 w-8 fill-brand-forest text-brand-forest" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 font-price text-xs font-semibold uppercase tracking-[0.14em] text-brand-forest">
          <span className="h-[9px] w-[9px] animate-pulse rounded-full bg-[#0E8A3E] motion-reduce:animate-none" />
          Live price board
        </div>
        {updated && <span className="text-[13px] text-[#44502A]">Updated {updated}</span>}
      </div>

      <p className="mb-3.5 mt-6 text-base font-medium text-[#2C3A1F]">Cheapest in Northern Ireland today</p>
      <div role="group" aria-label="Board tank size" className="flex flex-wrap gap-2">
        {[300, 500, 900].map((v) => {
          const on = volume === v;
          return (
            <button
              key={v}
              type="button"
              aria-pressed={on}
              onClick={() => setVolume(v)}
              className={`h-11 rounded-full border-2 border-brand-forest px-[18px] font-price text-sm font-semibold ${
                on ? "bg-brand-forest text-brand-butter" : "bg-transparent text-brand-forest"
              }`}
            >
              {v}L
            </button>
          );
        })}
      </div>

      {ready && row ? (
        <>
          <div className="mt-7">
            <div className="font-price text-[clamp(52px,7vw,80px)] font-semibold leading-none tracking-[-0.03em] text-brand-forest">
              {gbp(row.cheapest)}
            </div>
            <div className="mt-3 text-[15px] text-[#2C3A1F]">{((row.cheapest / volume) * 100).toFixed(1)}p per litre, including VAT</div>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-10 gap-y-5 border-t-[1.5px] border-brand-forest/30 pt-6">
            <div>
              <div className="text-[13px] text-[#44502A]">NI average</div>
              <div className="mt-1.5 font-price text-[22px] font-semibold">{gbp(row.average)}</div>
            </div>
            <div>
              <div className="text-[13px] text-[#44502A]">You could save up to</div>
              <div className="mt-1.5 font-price text-[22px] font-semibold text-[#0B6A30]">{gbp(Math.max(0, row.average - row.cheapest))}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-7 flex min-h-[196px] flex-col justify-center gap-2.5">
          <div className={`${display} text-[28px] leading-tight tracking-[-0.02em]`}>{volume}L prices are local.</div>
          <div className="text-base leading-normal text-[#2C3A1F]">Enter your postcode and we will show the suppliers who deliver to you.</div>
        </div>
      )}
      <p className="mt-7 text-[13px] leading-normal text-[#44502A]">Northern Ireland wide figures. Enter your postcode for a local quote.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Quick start tiles (overlap the hero edge)                          */
/* ------------------------------------------------------------------ */

function QuickTiles() {
  const base = "tile flex min-h-[200px] flex-col gap-3.5 rounded-[28px] border-2 border-brand-forest p-6 transition-transform hover:-translate-y-[3px] motion-reduce:transition-none";
  const badge = "flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-brand-forest";
  const title = `${display} text-[25px] tracking-[-0.02em] text-brand-forest`;
  return (
    <section className="relative mx-auto -mt-16 max-w-[1200px] px-4 sm:px-8 lg:-mt-20">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a href="#search" className={`${base} bg-brand-butter`}>
          <span aria-hidden="true" className={`${badge} bg-brand-lime`}><BarChart3 className="h-[26px] w-[26px] text-brand-forest" /></span>
          <span className={title}>Compare oil prices</span>
          <span className="text-[15px] leading-snug text-[#2C3A1F]">Rank local suppliers by what you would pay.</span>
        </a>
        <Link href="/alerts" className={`${base} bg-brand-paper`}>
          <span aria-hidden="true" className={`${badge} bg-brand-butter`}><Bell className="h-[26px] w-[26px] text-brand-forest" /></span>
          <span className={title}>Price alerts</span>
          <span className="text-[15px] leading-snug text-[#3E4A44]">An email when prices near you fall.</span>
        </Link>
        <Link href="/compare-heating" className={`${base} bg-brand-paper`}>
          <span aria-hidden="true" className={`${badge} bg-brand-butter`}><ArrowUpDown className="h-[26px] w-[26px] text-brand-forest" /></span>
          <span className={title}>Compare fuels</span>
          {/* Copy is a placeholder: confirm against what /compare-heating actually does */}
          <span className="text-[15px] leading-snug text-[#3E4A44]">See how oil compares with other heating fuels.</span>
        </Link>
        <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className={`${base} bg-brand-paper`}>
          <span aria-hidden="true" className={`${badge} bg-brand-butter`}><Heart className="h-[26px] w-[26px] text-brand-forest" /></span>
          <span className={title}>Heating oil support</span>
          <span className="text-[15px] leading-snug text-[#3E4A44]">Check if you may qualify for help with costs.</span>
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Trust row                                                          */
/* ------------------------------------------------------------------ */

function TrustRow({ supplierCount }: { supplierCount?: number }) {
  const supplierLabel = supplierCount && supplierCount > 1 ? `${supplierCount} verified suppliers` : "Verified supplier prices";
  const items = [
    { icon: ShieldCheck, title: supplierLabel, body: "Prices include VAT" },
    { icon: MapPin, title: "Every BT postcode", body: "All six counties covered" },
    { icon: Clock, title: "Free, no sign-up", body: "No hidden fees. You order direct." },
    { icon: Heart, title: "Gives back", body: "5% of profits fund emergency heating grants" },
  ];
  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-8 sm:px-8 sm:pt-14">
      <div className="grid gap-3 border-y-[1.5px] border-brand-forest py-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-start gap-3.5 p-1 py-2">
            <Icon className="mt-0.5 h-[26px] w-[26px] flex-none text-brand-forest" strokeWidth={1.8} />
            <div>
              <div className="text-base font-semibold">{title}</div>
              <div className="mt-1 text-sm leading-snug text-brand-muted">{body}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-brand-muted">
        As featured in{" "}
        <a href={BBC_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
          BBC News NI
        </a>
        .
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Today's cheapest 500L list                                         */
/* ------------------------------------------------------------------ */

function CheapestList({ prices, average500 }: { prices?: PriceRow[]; average500?: number }) {
  const [sort, setSort] = useState<"price" | "name">("price");

  const rows = useMemo(() => {
    // /api/prices can return several historical rows per supplier. Keep the newest row for each.
    const newest = new Map<number, PriceRow>();
    (prices ?? []).forEach((p) => {
      const cur = newest.get(p.supplierId);
      if (!cur || new Date(p.createdAt) > new Date(cur.createdAt)) newest.set(p.supplierId, p);
    });
    const cheapest5 = Array.from(newest.values())
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      .slice(0, 5);
    return sort === "name" ? [...cheapest5].sort((a, b) => a.supplier.name.localeCompare(b.supplier.name)) : cheapest5;
  }, [prices, sort]);

  const cheapestId = useMemo(() => {
    if (!rows.length) return null;
    return rows.reduce((m, r) => (parseFloat(r.price) < parseFloat(m.price) ? r : m)).id;
  }, [rows]);

  if (!rows.length) return null;

  return (
    <section id="today" className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-8 sm:pt-24">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-[280px] flex-1">
          <h2 className={`${display} text-[clamp(32px,4.2vw,52px)] leading-none tracking-[-0.035em] text-brand-forest [text-wrap:balance]`}>
            Today's cheapest 500L deliveries
          </h2>
          <p className="mt-3.5 max-w-[560px] text-[17px] leading-normal text-brand-muted">
            Northern Ireland wide, prices include VAT. Your postcode narrows this to suppliers who deliver to you.
          </p>
        </div>
        <div role="group" aria-label="Sort suppliers" className="flex gap-1 rounded-[14px] bg-[#EFE6D3] p-1">
          {([["price", "Cheapest first"], ["name", "A to Z"]] as const).map(([key, label]) => (
            <button
              key={key}
              aria-pressed={sort === key}
              onClick={() => setSort(key)}
              className={`h-11 rounded-[10px] px-[18px] text-[15px] font-semibold ${sort === key ? "bg-brand-paper" : "bg-transparent"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-8 flex flex-col gap-3">
        {rows.map((r) => {
          const price = parseFloat(r.price);
          const diff = average500 ? average500 - price : 0;
          const isCheapest = r.id === cheapestId;
          return (
            <li
              key={r.id}
              className={`flex flex-wrap items-center gap-x-6 gap-y-4 rounded-3xl border-2 px-6 py-5 ${
                isCheapest ? "border-brand-forest bg-brand-butter" : "border-brand-line bg-brand-paper"
              }`}
            >
              <div className="flex min-w-[240px] flex-1 items-center gap-4">
                <div aria-hidden="true" className={`flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand-forest text-xl text-brand-lime ${display}`}>
                  {r.supplier.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className={`${display} text-[21px] tracking-[-0.015em]`}>{r.supplier.name}</span>
                    {isCheapest && (
                      <span className="rounded-full bg-brand-forest px-2.5 py-1 text-xs font-bold uppercase tracking-[0.05em] text-brand-lime">Cheapest</span>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[#44502A]">
                    <MapPin className="h-[15px] w-[15px] flex-none" />
                    <span>Serves {r.supplier.coverageAreas}</span>
                  </div>
                </div>
              </div>

              <div className="text-right sm:w-[200px]">
                <div className="font-price text-[30px] font-semibold tracking-[-0.02em] text-brand-forest">{gbp(price)}</div>
                <div className="mt-1 text-[13px] text-[#44502A]">{(parseFloat(r.pricePerLitre) * 100).toFixed(1)}p per litre</div>
                {average500 ? (
                  <div className={`mt-0.5 text-[13px] font-semibold ${diff > 0.005 ? "text-[#0B6A30]" : "text-brand-muted"}`}>
                    {diff > 0.005 ? `${gbp(diff)} under average` : "At the NI average"}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-none gap-2">
                {r.supplier.phone && (
                  <a
                    href={`tel:${r.supplier.phone.replace(/\s/g, "")}`}
                    className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-forest px-5 text-[15px] font-semibold text-brand-cream hover:brightness-95"
                  >
                    <Phone className="h-4 w-4" /> Call
                  </a>
                )}
                {r.supplier.website && (
                  <a
                    href={r.supplier.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-brand-forest px-5 text-[15px] font-semibold text-brand-forest hover:bg-white"
                  >
                    Website
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-sm leading-normal text-brand-muted">Prices include VAT and standard delivery. Always confirm with the supplier before ordering.</p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                       */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const steps = [
    { n: "01", title: "Enter your postcode", body: "Type any BT postcode and pick your tank size." },
    { n: "02", title: "See live prices", body: "Results ranked cheapest first, with total cost and price per litre." },
    { n: "03", title: "Order from the supplier", body: "Call them or visit their website to place your order directly." },
  ];
  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-8 sm:pt-24">
      <h2 className={`${display} text-[clamp(32px,4.2vw,52px)] leading-none tracking-[-0.035em] text-brand-forest`}>How it works</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="border-t-[3px] border-brand-forest pt-6">
            <div className="font-price text-sm font-semibold text-brand-muted">{s.n}</div>
            <h3 className={`${display} mb-2 mt-3 text-[25px] tracking-[-0.02em] text-brand-forest`}>{s.title}</h3>
            <p className="text-[17px] leading-normal text-[#3E4A44]">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Alerts call to action                                              */
/* ------------------------------------------------------------------ */
/* PHASE 1 variant. POST /api/alerts requires a signed in user, so the design's inline  */
/* email + postcode form cannot work yet. This sends people to the existing /alerts flow. */
/* See HANDOVER.md decision D3 for the Phase 2 inline form.                              */

function AlertsCta() {
  return (
    <section className="mx-auto mt-12 max-w-[1200px] px-4 sm:mt-24 sm:px-8">
      <div className="flex flex-col gap-8 rounded-[36px] bg-brand-forest p-7 text-brand-cream sm:p-16 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="min-w-0 lg:flex-1">
          <h2 className={`${display} text-[clamp(32px,4.2vw,52px)] leading-none tracking-[-0.035em] [text-wrap:balance]`}>
            Get an email when prices near you <span className="text-brand-lime">fall.</span>
          </h2>
          <p className="mt-4 max-w-[460px] text-[17px] leading-normal text-[#CFE3D3]">
            Set your postcode once. Fill your tank when the price suits you, not when it runs low.
          </p>
        </div>
        <div className="lg:flex-none">
          <Link
            href="/alerts"
            className="inline-flex h-[58px] w-full items-center justify-center gap-2.5 rounded-[14px] bg-brand-gold px-8 text-[17px] font-bold text-brand-ink hover:brightness-95 lg:w-auto"
          >
            Set up a price alert <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-3 text-[13px] text-[#A9C7B1]">Free. Unsubscribe any time.</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Areas and guides                                                   */
/* ------------------------------------------------------------------ */

function AreaLinks() {
  return (
    <section id="areas" className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-8 sm:pt-24">
      <h2 className={`${display} text-[clamp(32px,4.2vw,52px)] leading-none tracking-[-0.035em] text-brand-forest`}>Heating oil prices by area</h2>
      <p className="mt-3.5 max-w-[560px] text-[17px] leading-normal text-brand-muted">
        Covering Belfast, Derry, Antrim, Down, Armagh, Tyrone and Fermanagh.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {TOWNS.map((t) => (
          <Link
            key={t.slug}
            href={`/heating-oil-prices/${t.slug}/`}
            className="flex min-h-16 items-center justify-between gap-3 rounded-[18px] border-[1.5px] border-brand-line bg-brand-paper px-5 text-[17px] font-semibold transition-colors hover:border-brand-forest hover:bg-white"
          >
            <span>{t.name}</span>
            <ArrowRight className="h-[18px] w-[18px] flex-none" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function Guides() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-14 pt-12 sm:px-8 sm:pb-24 sm:pt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className={`${display} text-[clamp(32px,4.2vw,52px)] leading-none tracking-[-0.035em] text-brand-forest`}>Guides for oil buyers</h2>
        <Link href="/blog" className="inline-flex min-h-11 items-center text-base font-semibold underline underline-offset-4">
          View all guides
        </Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/blog/${g.slug}`}
            className="flex min-h-[220px] flex-col justify-between gap-12 rounded-[28px] border-[1.5px] border-brand-line bg-brand-paper p-7 transition-colors hover:border-brand-forest hover:bg-white"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-brand-muted">{g.category}</div>
              <div className={`${display} mt-3.5 text-[27px] leading-[1.1] tracking-[-0.025em] text-brand-forest`}>{g.title}</div>
            </div>
            <span className="text-[15px] font-semibold">Read the guide</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
