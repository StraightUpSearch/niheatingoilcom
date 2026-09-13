import PriceSearchForm from "@/components/price-search-form";
import { Check, Clock, Shield } from "lucide-react";
import heroImage from "@assets/v2-vnxed-nzz6i.jpg";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  onSearch?: (params: { postcode?: string; volume?: number }) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-primary to-blue-700 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img
          src={heroImage}
          alt="Heating oil delivery"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-blue-700/95"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center space-y-8 lg:space-y-12">

          <div className={`space-y-4 lg:space-y-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Compare Heating Oil Prices
              <span className="block text-yellow-300">Across Northern Ireland</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Enter your postcode to compare prices from local suppliers across all six counties. Free, independent, and updated regularly.
            </p>
          </div>

          <div className={`bg-white rounded-2xl p-6 lg:p-8 shadow-2xl max-w-3xl mx-auto transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
            <PriceSearchForm onSearch={onSearch} />
          </div>

          <div className={`flex flex-wrap items-center justify-center gap-4 lg:gap-6 max-w-4xl mx-auto transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20">
              <Check className="h-5 w-5 text-green-300" />
              <span className="text-white font-medium text-sm sm:text-base">Independent Comparison</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20">
              <Clock className="h-5 w-5 text-blue-300" />
              <span className="text-white font-medium text-sm sm:text-base">Updated Regularly</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20">
              <Shield className="h-5 w-5 text-yellow-300" />
              <span className="text-white font-medium text-sm sm:text-base">100% Free</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
