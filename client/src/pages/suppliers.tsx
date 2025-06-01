import Navigation from "@/components/navigation";
import SupplierDirectory from "@/components/supplier-directory";
import Footer from "@/components/footer";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Suppliers() {
  usePageTitle("Heating Oil Suppliers Directory - Northern Ireland | NI Heating Oil");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Heating Oil Suppliers</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our comprehensive directory of verified heating oil suppliers across Northern Ireland
            </p>
          </div>
        </div>
      </section>

      <SupplierDirectory showHeader={false} />
      <Footer />
    </div>
  );
}
