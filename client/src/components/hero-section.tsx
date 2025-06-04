import PriceSearchForm from "../components/price-search-form";
import { Check, Clock, Shield, Truck, TrendingDown, Users, MapPin } from "lucide-react";
import HeatingOilLogo from "../components/heating-oil-logo";
// Hero image placeholder - using CSS gradient instead
import { useState, useEffect } from "react";

interface HeroSectionProps {
  onSearch?: (params: { postcode?: string; volume?: number }) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [animatedStats, setAnimatedStats] = useState({ suppliers: 0, savings: 0, users: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate counters
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedStats({
        suppliers: Math.floor(progress * 60),
        savings: Math.floor(progress * 150),
        users: Math.floor(progress * 1200)
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-primary to-blue-700 text-white overflow-hidden">
      {/* Simplified Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
      </div>

      {/* Background Video */}
      <div className="absolute inset-0 opacity-20">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
          src="/niheatingoilcomad.mp4"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%232563eb;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231e40af;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Ctext x='400' y='280' text-anchor='middle' fill='white' font-size='48' font-weight='bold'%3ENI Heating Oil%3C/text%3E%3Ctext x='400' y='340' text-anchor='middle' fill='white' font-size='24'%3EPrice Comparison%3C/text%3E%3C/svg%3E"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-blue-700/95"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center space-y-8 lg:space-y-12">
          
          {/* Main Heading */}
          <div className={`space-y-4 lg:space-y-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Compare Heating Oil Prices 
              <span className="block text-yellow-300">Across Northern Ireland</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Built by locals, for locals. No messing about - we'll show you the craic with heating oil prices across all six counties.
            </p>
          </div>
          
          {/* Stats Grid */}
          <div className={`grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8 max-w-2xl mx-auto transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-300">{animatedStats.suppliers}+</div>
              <div className="text-sm sm:text-base text-blue-100 mt-1">Oil Suppliers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-300">£{animatedStats.savings}+</div>
              <div className="text-sm sm:text-base text-blue-100 mt-1">Average Savings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-300">{animatedStats.users}+</div>
              <div className="text-sm sm:text-base text-blue-100 mt-1">Happy Users</div>
            </div>
          </div>
          
          {/* Search Form */}
          <div className={`bg-white rounded-2xl p-6 lg:p-8 shadow-2xl max-w-3xl mx-auto transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'} hover:shadow-3xl transition-shadow`}>
            <PriceSearchForm onSearch={onSearch} />
          </div>
          
          {/* Trust Badges */}
          <div className={`flex flex-wrap items-center justify-center gap-4 lg:gap-6 max-w-4xl mx-auto transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
              <Check className="h-5 w-5 text-green-300" />
              <span className="text-white font-medium text-sm sm:text-base">Official Consumer Council Data</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
              <Clock className="h-5 w-5 text-blue-300" />
              <span className="text-white font-medium text-sm sm:text-base">Updated Daily</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
              <Shield className="h-5 w-5 text-yellow-300" />
              <span className="text-white font-medium text-sm sm:text-base">100% Free</span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
