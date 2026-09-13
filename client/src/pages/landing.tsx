import { useState } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import TeaserPricingTable from "@/components/teaser-pricing-table";
import FeaturedSuppliers from "@/components/featured-suppliers";
import TrustSection from "@/components/trust-section";
import Footer from "@/components/footer";
import LeadCaptureModal from "@/components/lead-capture-modal";
import PriceAlertBar from "@/components/price-alert-bar";
import StickySignup from "@/components/sticky-signup";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, TrendingDown, Bell, MapPin } from "lucide-react";
import SEOHead from "@/components/seo-head";

export default function Landing() {
  usePageTitle("NI Heating Oil - Compare Heating Oil Prices in Northern Ireland");

  const [searchParams, setSearchParams] = useState<{ postcode?: string; volume?: number } | null>(null);
  const [quoteSupplier, setQuoteSupplier] = useState<{ name: string; price: string; volume: number; location: string } | null>(null);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NI Heating Oil",
    "description": "Compare heating oil prices across Northern Ireland suppliers. Real-time pricing, local delivery, trusted suppliers.",
    "url": "https://niheatingoil.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://niheatingoil.com/?postcode={search_term_string}",
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
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+44-28-96005259",
        "areaServed": "Northern Ireland",
        "availableLanguage": "English"
      }
    },
    "about": {
      "@type": "Service",
      "name": "Heating Oil Price Comparison",
      "serviceType": "Price Comparison Service",
      "areaServed": {
        "@type": "Country",
        "name": "Northern Ireland"
      }
    }
  };

  const handleSearch = (params: { postcode?: string; volume?: number }) => {
    setSearchParams(params);
    // Scroll to results section
    setTimeout(() => {
      const resultsSection = document.getElementById('search-results');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LeadCaptureModal
        isOpen={!!quoteSupplier}
        onClose={() => setQuoteSupplier(null)}
        supplier={quoteSupplier || undefined}
      />
      <StickySignup />
      <SEOHead
        title="NI Heating Oil - Compare Heating Oil Prices in Northern Ireland"
        description="Compare heating oil prices across Northern Ireland. Get instant quotes from trusted local suppliers in Belfast, Derry, Antrim, Down, Armagh, Tyrone & Fermanagh. Save money on your heating oil delivery today."
        keywords="heating oil prices, Northern Ireland, oil suppliers, Belfast heating oil, Derry heating oil, fuel comparison, home heating, oil delivery, NI heating costs"
        canonicalUrl="https://niheatingoil.com"
        structuredData={structuredData}
      />
      <Navigation />
      <HeroSection onSearch={handleSearch} />

      {/* Search Results Section - Only show after search */}
      {searchParams && (
        <section id="search-results" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Heating Oil Prices for {searchParams.postcode}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Showing prices for {searchParams.volume}L delivery. All prices include VAT and standard delivery.
              </p>
            </div>
            <TeaserPricingTable
              searchParams={searchParams}
              onGetQuote={setQuoteSupplier}
            />
            <div className="mt-8 max-w-xl mx-auto">
              <PriceAlertBar postcode={searchParams.postcode} volume={searchParams.volume} />
            </div>
          </div>
        </section>
      )}

      

      {/* General Prices Section - Only show when no search has been performed */}
      {!searchParams && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Oil Prices Across Northern Ireland</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Pricing data from verified suppliers across all six counties. Prices include VAT and delivery.</p>
            </div>
            <TeaserPricingTable onGetQuote={setQuoteSupplier} />
          </div>
        </section>
      )}

      {/* SEO Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Northern Ireland's Leading Heating Oil Price Comparison Platform
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Save money on heating oil with our comprehensive price comparison service covering all of Northern Ireland. 
                We monitor prices from major suppliers including BoilerJuice, Cheaper Oil NI, Value Oils, and many more 
                across Belfast, Derry, Armagh, Down, Antrim, Tyrone, and Fermanagh.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calculator className="h-6 w-6 text-primary" />
                  <span className="text-gray-700">300L, 500L, 900L volumes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingDown className="h-6 w-6 text-primary" />
                  <span className="text-gray-700">Real-time price tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Bell className="h-6 w-6 text-primary" />
                  <span className="text-gray-700">Price drop alerts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <span className="text-gray-700">All BT postcodes covered</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Coverage Areas</h3>
                  <p className="text-gray-600">
                    <strong>Belfast Area:</strong> BT1-BT18<br/>
                    <strong>County Antrim:</strong> BT19-BT44<br/>
                    <strong>County Down:</strong> BT19-BT35<br/>
                    <strong>County Armagh:</strong> BT60-BT67<br/>
                    <strong>County Tyrone:</strong> BT70-BT82<br/>
                    <strong>County Fermanagh:</strong> BT74, BT92-BT94<br/>
                    <strong>County Derry:</strong> BT45-BT56
                  </p>
                  <p className="text-xs text-gray-500 mt-3">
                    All BT postcodes across Northern Ireland are covered.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    As featured in{" "}
                    <a 
                      href="https://www.bbc.co.uk/news/articles/cdxn5zn26xeo" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      BBC News NI coverage
                    </a>
                    {" "}about heating oil price trends in Northern Ireland.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <FeaturedSuppliers />
      <TrustSection />
      <Footer />

    </div>
  );
}