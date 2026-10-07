import { useState, useEffect, useMemo } from "react";
import { useSearch, useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import { Phone, Globe, ChevronDown, ChevronUp, MapPin, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

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

type SortOption = "price" | "price-desc" | "supplier";

export default function Results() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(search);
  const postcode = params.get("postcode") || "";
  const volume = parseInt(params.get("volume") || "500");

  const [results, setResults] = useState<PriceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editPostcode, setEditPostcode] = useState(postcode);
  const [editVolume, setEditVolume] = useState(volume);
  const [sortBy, setSortBy] = useState<SortOption>("price");

  const pageTitle = `Heating Oil Prices Near ${postcode.toUpperCase()} | NIHeatingoil.com`;
  const pageDescription = `Compare heating oil prices near ${postcode.toUpperCase()} for ${volume}L delivery. Find the cheapest supplier in your area.`;

  useEffect(() => {
    if (!postcode) return;
    setLoading(true);
    setError(null);

    fetch(`/api/prices?postcode=${encodeURIComponent(postcode)}&volume=${volume}&sort=price`)
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
  }, [postcode, volume]);

  const sortedResults = useMemo(() => {
    const sorted = [...results];
    switch (sortBy) {
      case "price":
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "supplier":
        sorted.sort((a, b) => a.supplier.name.localeCompare(b.supplier.name));
        break;
    }
    return sorted;
  }, [results, sortBy]);

  const structuredData = useMemo(() => {
    if (!results.length) return undefined;
    return [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `Heating oil prices near ${postcode.toUpperCase()}`,
        "numberOfItems": results.length,
        "itemListElement": results
          .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
          .map((item, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
              "@type": "Offer",
              "name": `${item.supplier.name} — ${volume}L heating oil`,
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
          { "@type": "ListItem", "position": 2, "name": `Prices near ${postcode.toUpperCase()}` },
        ],
      },
    ];
  }, [results, postcode, volume]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pc = editPostcode.trim().toUpperCase();
    if (!pc) return;
    setEditOpen(false);
    setLocation(`/results?postcode=${encodeURIComponent(pc)}&volume=${editVolume}`);
  };

  if (!postcode) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={`heating oil ${postcode}, cheapest heating oil ${postcode}, oil delivery ${postcode}, Northern Ireland heating oil`}
        canonicalUrl={`https://niheatingoil.com/heating-oil-prices/${postcode.toLowerCase()}/`}
        structuredData={structuredData}
        noindex={true}
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Heating oil prices near {postcode.toUpperCase()}
            <span className="text-gray-500 font-normal"> — {volume}L delivery</span>
          </h1>
          <button
            onClick={() => setEditOpen(!editOpen)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
          >
            Change search
            {editOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {editOpen && (
            <form onSubmit={handleEditSubmit} className="mt-3 flex flex-wrap items-end gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Postcode</label>
                <input
                  type="text"
                  value={editPostcode}
                  onChange={(e) => setEditPostcode(e.target.value)}
                  className="w-28 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="BT1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Volume</label>
                <select
                  value={editVolume}
                  onChange={(e) => setEditVolume(parseInt(e.target.value))}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value={300}>300L</option>
                  <option value={500}>500L</option>
                  <option value={900}>900L</option>
                  <option value={1000}>1000L</option>
                </select>
              </div>
              <Button type="submit" size="sm">
                Update
              </Button>
            </form>
          )}
        </div>

        {/* Sort + count bar */}
        {!loading && !error && results.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {results.length} supplier{results.length !== 1 ? "s" : ""} found
            </p>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="price">Cheapest first</option>
                <option value="price-desc">Most expensive first</option>
                <option value="supplier">Supplier name A–Z</option>
              </select>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-40 bg-gray-200 rounded" />
                    <div className="h-3 w-28 bg-gray-100 rounded" />
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-6 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium">Something went wrong</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && results.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-900 font-medium">No suppliers found for {postcode.toUpperCase()}</p>
            <p className="text-gray-500 text-sm mt-1">Try a nearby BT area or a different volume.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setEditOpen(true)}
            >
              Change search
            </Button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && sortedResults.length > 0 && (
          <div className="space-y-3">
            {sortedResults.map((item, index) => {
              const totalPrice = parseFloat(item.price);
              const ppl = parseFloat(item.pricePerLitre) * 100;
              const isCheapest = sortBy === "price" && index === 0;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg border ${isCheapest ? "border-green-300 ring-1 ring-green-100" : "border-gray-200"} p-5 transition-shadow hover:shadow-sm`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Supplier info */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {item.supplier.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{item.supplier.name}</h3>
                          {isCheapest && (
                            <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                              Cheapest
                            </span>
                          )}
                        </div>
                        {item.supplier.coverageAreas && (
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Serves {item.supplier.coverageAreas}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          Price includes VAT
                        </p>
                      </div>
                    </div>

                    {/* Price + actions */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          £{totalPrice.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {ppl.toFixed(1)}p/litre for {volume}L
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {item.supplier.phone && (
                          <a
                            href={`tel:${item.supplier.phone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Call</span>
                          </a>
                        )}
                        {item.supplier.website && (
                          <a
                            href={item.supplier.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Website</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Trust footer */}
        {!loading && results.length > 0 && (
          <p className="text-xs text-gray-400 text-center mt-6">
            Prices shown include VAT and standard delivery. Always confirm directly with the supplier before ordering.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
