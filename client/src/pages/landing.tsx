import { useState } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import EnhancedPricingTable from "@/components/enhanced-pricing-table";
import PriceTrends from "@/components/price-trends";
import AnimatedPriceTrend from "@/components/animated-price-trend";
import PriceAlertsForm from "@/components/price-alerts-form";
import SupplierDirectory from "@/components/supplier-directory";
import SuppliersShowcase from "@/components/suppliers-showcase";
import OilTankShowcase from "@/components/oil-tank-showcase";
import TrustSection from "@/components/trust-section";
import NorthernIrelandIdentity from "@/components/northern-ireland-identity";
import Footer from "@/components/footer";
import SocialProofNotifications from "@/components/social-proof-notifications";
import TrustBadges from "@/components/trust-badges";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, TrendingDown, Bell, MapPin } from "lucide-react";

export default function Landing() {
  usePageTitle("NI Heating Oil - Compare Heating Oil Prices in Northern Ireland");
  
  const [searchParams, setSearchParams] = useState<{ postcode?: string; volume?: number } | null>(null);

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
                Showing prices for {searchParams.volume}L delivery. Prices include VAT and standard delivery.
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Oil Prices in Northern Ireland</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Live pricing data from verified suppliers across all counties. Prices include VAT and delivery within standard areas.</p>
            </div>
            <EnhancedPricingTable />
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      <NorthernIrelandIdentity />
      <TrustBadges />
      <PriceTrends />
      <SuppliersShowcase />
      <PriceAlertsForm />
      <SupplierDirectory />
      <TrustSection />
      <Footer />
      
      {/* Social Proof Notifications */}
      <SocialProofNotifications />
    </div>
  );
}
