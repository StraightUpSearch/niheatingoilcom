import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Search, ShieldCheck, Clock, ArrowRight, MapPin, X } from "lucide-react";
import { Link } from "wouter";

const townLinks = [
  { name: "Belfast", postcode: "BT1" },
  { name: "Bangor", postcode: "BT20" },
  { name: "Londonderry", postcode: "BT48" },
  { name: "Newry", postcode: "BT34" },
  { name: "Lisburn", postcode: "BT28" },
  { name: "Newtownabbey", postcode: "BT36" },
  { name: "Armagh", postcode: "BT61" },
  { name: "Ballymena", postcode: "BT43" },
  { name: "Coleraine", postcode: "BT52" },
  { name: "Omagh", postcode: "BT78" },
];

export default function Landing() {
  usePageTitle("Compare Heating Oil Prices in Northern Ireland | NIHeatingoil.com");
  const [, setLocation] = useLocation();

  const [postcode, setPostcode] = useState("");
  const [volume, setVolume] = useState(500);
  const [showGovBanner, setShowGovBanner] = useState(() => {
    try { return sessionStorage.getItem("hideGovBanner") !== "1"; } catch { return true; }
  });

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
      },
      "publisher": {
        "@type": "Organization",
        "name": "NI Heating Oil",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "14a Victoria Street",
          "addressLocality": "Ballymoney",
          "addressRegion": "Northern Ireland",
          "postalCode": "BT53 6DW",
          "addressCountry": "GB"
        }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pc = postcode.trim().toUpperCase();
    if (!pc) return;
    setLocation(`/results?postcode=${encodeURIComponent(pc)}&volume=${volume}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Compare Heating Oil Prices in Northern Ireland | NIHeatingoil.com"
        description="Compare home heating oil prices across Northern Ireland. Find the cheapest supplier in your area. Enter your BT postcode to get live quotes from local distributors."
        keywords="heating oil prices, Northern Ireland, cheapest heating oil NI, oil suppliers, Belfast heating oil, fuel comparison, oil delivery, home heating oil"
        canonicalUrl="https://niheatingoil.com"
        structuredData={structuredData}
      />
      <Navigation />

      {/* Government support banner */}
      {showGovBanner && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-sm text-amber-900">
              <span className="font-medium">You may be eligible for heating oil support.</span>{" "}
              <a
                href="https://www.nidirect.gov.uk/articles/affordable-warmth-scheme"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-700"
              >
                Check if you qualify &rarr;
              </a>
            </p>
            <button
              onClick={() => { setShowGovBanner(false); try { sessionStorage.setItem("hideGovBanner", "1"); } catch {} }}
              className="flex-shrink-0 p-1 text-amber-600 hover:text-amber-800 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="pt-28 pb-20 sm:pt-36 sm:pb-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Compare Heating Oil Prices Across Northern Ireland
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
            Enter your BT postcode to get live quotes from local distributors, ranked cheapest first. Free to use, no sign-up required.
          </p>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="mt-10 max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="Your BT postcode"
                className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
              <select
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
              >
                <option value={300}>300L</option>
                <option value={500}>500L</option>
                <option value={900}>900L</option>
                <option value={1000}>1000L</option>
              </select>
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                Compare prices
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
          {/* Town quick-links */}
          <div className="mt-8">
            <p className="text-xs text-gray-400 mb-2">Or pick your area</p>
            <div className="flex flex-wrap justify-center gap-2">
              {townLinks.map((town) => (
                <Link
                  key={town.postcode}
                  href={`/results?postcode=${town.postcode}&volume=500`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <MapPin className="w-3 h-3" />
                  {town.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <Search className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">10+ local suppliers</p>
              <p className="text-xs text-gray-500 mt-0.5">Covering every BT postcode</p>
            </div>
            <div>
              <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Prices updated regularly</p>
              <p className="text-xs text-gray-500 mt-0.5">Sourced from verified suppliers</p>
            </div>
            <div>
              <ShieldCheck className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Free to use</p>
              <p className="text-xs text-gray-500 mt-0.5">No sign-up, no hidden fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold mx-auto mb-3">1</div>
              <h3 className="font-semibold text-gray-900">Enter your postcode</h3>
              <p className="text-sm text-gray-500 mt-1">Type any BT postcode and pick your tank size.</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold mx-auto mb-3">2</div>
              <h3 className="font-semibold text-gray-900">See live prices</h3>
              <p className="text-sm text-gray-500 mt-1">Results ranked cheapest first with total cost and per-litre price.</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold mx-auto mb-3">3</div>
              <h3 className="font-semibold text-gray-900">Contact the supplier</h3>
              <p className="text-sm text-gray-500 mt-1">Call or visit their website directly to place your order.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest from the blog */}
      <section className="py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">From the blog</h2>
            <Link href="/blog" className="text-sm text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { slug: "best-time-buy-heating-oil-northern-ireland", title: "Best Time to Buy Heating Oil in NI", category: "Money Saving" },
              { slug: "heating-oil-tank-sizes", title: "Comparing 300L, 500L, and 900L Tank Sizes", category: "Equipment Guide" },
              { slug: "how-to-save-money-heating-oil", title: "How to Save Money on Heating Oil", category: "Money Saving" },
            ].map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <span className="text-xs font-medium text-gray-500">{post.category}</span>
                <h3 className="mt-1 text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors leading-snug">
                  {post.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-12 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            Covering all BT postcodes across Belfast, Derry, Antrim, Down, Armagh, Tyrone, and Fermanagh.
            As featured in{" "}
            <a
              href="https://www.bbc.co.uk/news/articles/cdxn5zn26xeo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              BBC News NI
            </a>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
