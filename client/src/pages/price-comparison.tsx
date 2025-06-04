import Navigation from "../components/navigation";
import PriceSearchForm from "../components/price-search-form";
import PricingTable from "../components/pricing-table";
import MobilePriceTrends from "../components/mobile-price-trends";
import Footer from "../components/footer";
import { usePageTitle } from "../hooks/usePageTitle";
import { useState } from "react";

export default function PriceComparison() {
  usePageTitle("Compare Heating Oil Prices - Northern Ireland | NI Heating Oil");

  const [searchParams, setSearchParams] = useState<{
    postcode?: string;
    volume?: number;
  }>({});

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Compare Heating Oil Prices</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the best heating oil prices in your area from verified Northern Ireland suppliers
            </p>
          </div>

          <PriceSearchForm onSearch={setSearchParams} />
        </div>
      </section>

      {/* Mobile Price Trends */}
      <MobilePriceTrends />

      {/* Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PricingTable searchParams={searchParams} />
        </div>
      </section>

      <Footer />
    </div>
  );
}