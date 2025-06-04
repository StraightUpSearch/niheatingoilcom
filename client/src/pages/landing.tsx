import { useState } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import EnhancedPricingTable from "@/components/enhanced-pricing-table";
import PriceTrends from "@/components/price-trends";
import MobilePriceTrends from "@/components/mobile-price-trends";
import AnimatedPriceTrend from "@/components/animated-price-trend";
import PriceAlertsForm from "@/components/price-alerts-form";
import FeaturedSuppliers from "@/components/featured-suppliers";
import SuppliersShowcase from "@/components/suppliers-showcase";
import OilTankShowcase from "@/components/oil-tank-showcase";
import TrustSection from "@/components/trust-section";
import NorthernIrelandIdentity from "@/components/northern-ireland-identity";
import Footer from "@/components/footer";
import SocialProofNotifications from "@/components/social-proof-notifications";
import TrustBadges from "@/components/trust-badges";
import BlogCarousel from "@/components/blog-carousel";
import { MediaNewsTile } from "@/components/media-news-tile";
import { CharityBanner } from "@/components/charity-banner";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, TrendingDown, Bell, MapPin } from "lucide-react";
import SEOHead from "@/components/seo-head";

export default function Landing() {
  usePageTitle("NI Heating Oil - Compare Heating Oil Prices in Northern Ireland");
  
  const [searchParams, setSearchParams] = useState<{ postcode?: string; volume?: number } | null>(null);

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
      <SEOHead 
        title="NI Heating Oil - Compare Heating Oil Prices in Northern Ireland"
        description="Compare heating oil prices across Northern Ireland. Get instant quotes from trusted local suppliers in Belfast, Derry, Antrim, Down, Armagh, Tyrone & Fermanagh. Save money on your heating oil delivery today."
        keywords="heating oil prices, Northern Ireland, oil suppliers, Belfast heating oil, Derry heating oil, fuel comparison, home heating, oil delivery, NI heating costs"
        canonicalUrl="https://niheatingoil.com"
        structuredData={structuredData}
      />
      <Navigation />
      <HeroSection onSearch={handleSearch} />
      
      {/* Charity Banner - Simon Community NI Pledge */}
      <CharityBanner />
      
      {/* Mobile Price Trends - Show on mobile devices */}
      <MobilePriceTrends />
      
      {/* Search Results Section - Only show after search */}
      {searchParams && (
        <section id="search-results" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                At's us nai! Heating Oil Prices for {searchParams.postcode}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Here's the craic - showing prices for {searchParams.volume}L delivery. All prices include VAT and standard delivery to your door.
              </p>
            </div>
            <EnhancedPricingTable searchParams={searchParams} />
          </div>
        </section>
      )}
      
      {/* Animated Price Trends Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Live Market Trends</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Real-time price movements and market insights from across Northern Ireland</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AnimatedPriceTrend volume={300} className="lg:col-span-1" />
            <AnimatedPriceTrend volume={500} className="lg:col-span-1" />
            <AnimatedPriceTrend volume={900} className="lg:col-span-1" />
          </div>
        </div>
      </section>

      {/* General Prices Section - Only show when no search has been performed */}
      {!searchParams && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Oil Prices Across Northern Ireland</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Dead-on pricing data from verified suppliers across all six counties. No messing about - these prices include VAT and delivery to your door.</p>
            </div>
            <EnhancedPricingTable />
          </div>
        </section>
      )}

      {/* Media News Tile - Prominent BBC Coverage */}
      <MediaNewsTile />

      {/* Promotional Video Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Did you see us online and on TV?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Check out our latest advert that's been running across Northern Ireland on TV and social media!
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl bg-gray-900">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/x1Vz6WXyA2E?si=I6PhJdInkwiZF4j7" 
                  title="NI Heating Oil - TV Advertisement" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="absolute inset-0"
                />
              </div>
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                  Now live on television and social media across Northern Ireland
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                    BT postcode mappings verified through{" "}
                    <a 
                      href="https://en.wikipedia.org/wiki/BT_postcode_area" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Wikipedia research
                    </a>
                    {" "}— because we do our homework for ye! At's us nai with proper County mapping.
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
      
      <NorthernIrelandIdentity />
      <TrustBadges />
      <BlogCarousel />
      <PriceTrends />
      <SuppliersShowcase />
      <PriceAlertsForm />
      <FeaturedSuppliers />
      <TrustSection />
      <Footer />
      
      {/* Social Proof Notifications */}
      <SocialProofNotifications />
    </div>
  );
}
