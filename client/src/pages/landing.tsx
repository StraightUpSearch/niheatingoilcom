import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import PricingTable from "@/components/pricing-table";
import PriceTrends from "@/components/price-trends";
import PriceAlertsForm from "@/components/price-alerts-form";
import SupplierDirectory from "@/components/supplier-directory";
import TrustSection from "@/components/trust-section";
import Footer from "@/components/footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      
      {/* Current Prices Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Oil Prices in Northern Ireland</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Live pricing data from verified suppliers across all counties. Prices include VAT and delivery within standard areas.</p>
          </div>
          <PricingTable />
        </div>
      </section>
      
      <PriceTrends />
      <PriceAlertsForm />
      <SupplierDirectory />
      <TrustSection />
      <Footer />
    </div>
  );
}
