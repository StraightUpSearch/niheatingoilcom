import PriceSearchForm from "@/components/price-search-form";
import { Check, Clock, Shield, Truck } from "lucide-react";
import HeatingOilLogo from "@/components/heating-oil-logo";
import heroImage from "@assets/v2-vnxed-nzz6i.jpg";

interface HeroSectionProps {
  onSearch?: (params: { postcode?: string; volume?: number }) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary to-blue-700 text-white py-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="Northern Ireland home with heating oil tank - price comparison interface" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-blue-700/90"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Compare Heating Oil Prices Across Northern Ireland
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Built by locals, for locals. Compare official Consumer Council prices across all six counties and save on your heating oil deliveries.
          </p>
          
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-2xl mx-auto mb-8">
            <PriceSearchForm onSearch={onSearch} />
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
