import { useState, useEffect, useMemo, FormEvent } from "react";
import { useSearch, useLocation } from "wouter";
import SEOHead from "@/components/seo-head";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PageShell,
  PageHero,
  OverlapSection,
  SurfaceCard,
  PriceRow,
  PriceRowData,
  PostcodeSearchBar,
} from "@/components/brand-ui";

interface Supplier {
  id: number;
  name: string;
  location: string;
  phone: string;
  website: string;
  coverageAreas: string;
  rating: string;
  reviewCount: number;
}

interface PriceResult {
  id: number;
  supplierId: number;
  volume: number;
  price: string;
  pricePerLitre: string;
  includesVat: number;
  supplier: Supplier;
}

type SortOption = "price" | "name";

export default function Results() {
  const search = useSearch();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(search);
  const initialPostcode = params.get("postcode") || "";
  const initialVolume = parseInt(params.get("volume") || "500");

  const [results, setResults] = useState<PriceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postcode, setPostcode] = useState(initialPostcode);
  const [volume, setVolume] = useState(initialVolume);
  const [sortBy, setSortBy] = useState<SortOption>("price");

  const pageTitle = `Heating Oil Prices Near ${initialPostcode.toUpperCase()} | NIHeatingoil.com`;
  const pageDescription = `Compare heating oil prices near ${initialPostcode.toUpperCase()} for ${initialVolume}L delivery. Find the cheapest supplier in your area.`;

  useEffect(() => {
    if (!initialPostcode) return;
    setLoading(true);
    setError(null);
    fetch(`/api/prices?postcode=${encodeURIComponent(initialPostcode)}&volume=${initialVolume}&sort=price`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch prices");
        return res.json();
      })
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [initialPostcode, initialVolume]);

  const sortedResults = useMemo(() => {
    const sorted = [...results];
    if (sortBy === "name") sorted.sort((a, b) => a.supplier.name.localeCompare(b.supplier.name));
    else sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    return sorted;
  }, [results, sortBy]);

  const structuredData = useMemo(() => {
    if (!results.length) return undefined;
    return [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `Heating oil prices near ${initialPostcode.toUpperCase()}`,
        "numberOfItems": results.length,
        "itemListElement": [...results]
          .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
          .map((item, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
              "@type": "Offer",
              "name": `${item.supplier.name} \u2014 ${initialVolume}L heating oil`,
              "price": item.price,
              "priceCurrency": "GBP",
              "seller": {
                "@type": "LocalBusiness",
                "name": item.supplier.name,
                "telephone": item.supplier.phone || undefined,
                "url": item.supplier.website || undefined,
              },
            },
          })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://niheatingoil.com" },
          { "@type": "ListItem", "position": 2, "name": `Prices near ${initialPostcode.toUpperCase()}` },
        ],
      },
    ];
  }, [results, initialPostcode, initialVolume]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const pc = postcode.trim().toUpperCase();
    if (!pc) return;
    navigate(`/results?postcode=${encodeURIComponent(pc)}&volume=${volume}`);
  };

  if (!initialPostcode) {
    navigate("/");
    return null;
  }

  const average = results.length
    ? results.reduce((s, r) => s + parseFloat(r.price), 0) / results.length
    : 0;

  const toRow = (item: PriceResult): PriceRowData => ({
    id: item.id,
    name: item.supplier.name,
    serves: item.supplier.coverageAreas,
    price: parseFloat(item.price),
    pricePerLitre: parseFloat(item.pricePerLitre),
    phone: item.supplier.phone,
    website: item.supplier.website,
    profileHref: `/suppliers/${item.supplierId}`,
  });

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={`heating oil ${initialPostcode}, cheapest heating oil ${initialPostcode}, oil delivery ${initialPostcode}, Northern Ireland heating oil`}
        canonicalUrl={`https://niheatingoil.com/heating-oil-prices/${initialPostcode.toLowerCase()}/`}
        structuredData={structuredData}
        noindex={true}
      />
      <PageShell>
        <PageHero
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Prices", href: "/heating-oil-prices" },
            { label: initialPostcode.toUpperCase() },
          ]}
          title="Heating oil prices near "
          accent={initialPostcode.toUpperCase()}
          intro={
            !loading && results.length > 0
              ? `${results.length} supplier${results.length !== 1 ? "s" : ""} deliver${results.length === 1 ? "s" : ""} ${initialVolume}L to your area. Prices include VAT, cheapest first.`
              : undefined
          }
          overlap
        >
          <PostcodeSearchBar
            postcode={postcode}
            setPostcode={setPostcode}
            volume={volume}
            setVolume={setVolume}
            onSubmit={handleSubmit}
          />
        </PageHero>

        <OverlapSection>
          <div className="flex flex-wrap gap-7 items-start pb-16">
            {/* Main results column */}
            <div className="flex-[2_1_560px] min-w-0">

              {/* Sort/count bar */}
              {!loading && !error && results.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 rounded-[20px] border-2 border-brand-forest bg-brand-butter px-5 py-4">
                  <div className="flex items-center gap-2.5 text-[15px] text-[#2C3A1F]">
                    <span
                      className="inline-block w-[9px] h-[9px] rounded-full bg-[#0E8A3E] animate-pulse motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="text-brand-forest">
                        {results.length} supplier{results.length !== 1 ? "s" : ""}
                      </strong>
                      {" \u00b7 "}{initialVolume}L
                    </span>
                  </div>
                  <div
                    role="group"
                    aria-label="Sort suppliers"
                    className="flex gap-1 p-1 rounded-[14px] bg-brand-paper border-[1.5px] border-brand-forest"
                  >
                    {(["price", "name"] as SortOption[]).map((opt) => (
                      <button
                        key={opt}
                        aria-pressed={sortBy === opt}
                        onClick={() => setSortBy(opt)}
                        className={`h-11 px-4 rounded-[10px] text-[15px] font-semibold border-0 transition-colors ${
                          sortBy === opt
                            ? "bg-brand-forest text-brand-cream"
                            : "bg-transparent text-brand-forest hover:bg-brand-mint"
                        }`}
                      >
                        {opt === "price" ? "Cheapest first" : "A\u2013Z"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading skeletons */}
              {loading && (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-brand-line bg-brand-paper p-6 animate-pulse"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-2.5">
                          <div className="h-5 w-40 bg-brand-line rounded-full" />
                          <div className="h-3.5 w-28 bg-brand-line/60 rounded-full" />
                        </div>
                        <div className="text-right space-y-2.5">
                          <div className="h-7 w-24 bg-brand-line rounded-full" />
                          <div className="h-3.5 w-20 bg-brand-line/60 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <SurfaceCard tone="paper" className="p-8 text-center">
                  <p className="font-semibold text-brand-ink">Something went wrong</p>
                  <p className="text-brand-muted text-sm mt-1">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Try again
                  </Button>
                </SurfaceCard>
              )}

              {/* Empty */}
              {!loading && !error && results.length === 0 && (
                <SurfaceCard tone="paper" className="p-10 text-center">
                  <p className="font-semibold text-brand-ink text-lg">
                    No suppliers found for {initialPostcode.toUpperCase()}
                  </p>
                  <p className="text-brand-muted text-sm mt-1.5">
                    Try a nearby BT area or a different volume.
                  </p>
                </SurfaceCard>
              )}

              {/* Price rows */}
              {!loading && !error && sortedResults.length > 0 && (
                <ul className="flex flex-col gap-3">
                  {sortedResults.map((item, index) => (
                    <PriceRow
                      key={item.id}
                      row={toRow(item)}
                      isCheapest={sortBy === "price" && index === 0}
                      average={average}
                    />
                  ))}
                </ul>
              )}

              {!loading && results.length > 0 && (
                <p className="mt-5 text-sm leading-relaxed text-brand-muted">
                  Prices include VAT and standard delivery. Always confirm with the supplier before ordering.
                </p>
              )}
            </div>

            {/* Aside */}
            <aside className="flex-[1_1_300px] min-w-0 flex flex-col gap-4">
              <SurfaceCard tone="butter" className="p-6">
                <span
                  aria-hidden="true"
                  className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-[3px] border-brand-forest bg-brand-lime"
                >
                  <Bell className="h-6 w-6 text-brand-forest" strokeWidth={2} />
                </span>
                <h2 className="mt-4 font-display font-extrabold text-[25px] leading-tight tracking-[-0.02em] text-brand-forest">
                  Watch {initialPostcode.toUpperCase()} prices
                </h2>
                <p className="mt-2.5 text-[15px] leading-relaxed text-[#2C3A1F]">
                  Get an email when prices near you fall. Free to set up.
                </p>
                <Button asChild className="mt-5 w-full h-[52px] text-base">
                  <a href="/alerts">Set a price alert</a>
                </Button>
              </SurfaceCard>

              <SurfaceCard tone="mint" className="p-6">
                <h2 className="font-display font-extrabold text-[22px] leading-snug tracking-[-0.02em] text-brand-forest">
                  Help with heating costs
                </h2>
                <p className="mt-2.5 text-[15px] leading-relaxed text-brand-forest">
                  You may be eligible for heating oil support.
                </p>
                <a
                  href="https://www.nidirect.gov.uk/articles/affordable-warmth-scheme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center min-h-[44px] font-bold text-[15px] text-brand-forest underline underline-offset-[3px]"
                >
                  Check if you qualify
                </a>
              </SurfaceCard>

              <SurfaceCard tone="paper" className="p-6">
                <h2 className="font-display font-extrabold text-[22px] leading-snug tracking-[-0.02em] text-brand-forest">
                  Not sure what size to order?
                </h2>
                <a
                  href="/blog/heating-oil-tank-sizes"
                  className="mt-2 inline-flex items-center min-h-[44px] font-semibold text-[15px] text-brand-forest underline underline-offset-[3px]"
                >
                  Read the tank size guide
                </a>
              </SurfaceCard>
            </aside>
          </div>
        </OverlapSection>
      </PageShell>
    </>
  );
}
