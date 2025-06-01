import PriceSearchForm from "@/components/price-search-form";
import { Check, Clock, Shield, Truck } from "lucide-react";
import HeatingOilLogo from "@/components/heating-oil-logo";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Northern Ireland's Own Heating Oil Price Platform
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Built by locals, for locals. Compare official Consumer Council prices across all six counties and save on your heating oil deliveries.
          </p>
          
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-2xl mx-auto mb-8">
            <PriceSearchForm />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-blue-100">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5" />
              <span>Official Consumer Council Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Updated Every Hour</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>100% Free to Use</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
