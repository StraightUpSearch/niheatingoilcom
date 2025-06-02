import PriceSearchForm from "@/components/price-search-form";
import { Check, Clock, Shield, Truck, TrendingDown, Users, MapPin } from "lucide-react";
import HeatingOilLogo from "@/components/heating-oil-logo";
import heroImage from "@assets/v2-vnxed-nzz6i.jpg";
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
        suppliers: Math.floor(progress * 25),
        savings: Math.floor(progress * 150),
        users: Math.floor(progress * 1200)
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-primary to-blue-700 text-white py-16 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        </div>
      </div>

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
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Compare Heating Oil Prices 
              <span className="block text-yellow-300 animate-pulse">Across Northern Ireland</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-blue-100 max-w-3xl mx-auto px-6 sm:px-4 md:px-0 leading-relaxed">
              <span className="block text-center sm:inline">Built by locals, for locals.</span>
              <span className="block text-center sm:inline"> No messing about - we'll show you the craic with heating oil prices across all six counties. Save your pennies and keep your house toasty!</span>
            </p>
          </div>
          
          {/* Animated Stats Bar */}
          <div className={`grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8 px-4 sm:px-0 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-white/20">
              <div className="text-lg sm:text-2xl font-bold text-yellow-300">{animatedStats.suppliers}+</div>
              <div className="text-xs sm:text-sm text-blue-100">Oil Suppliers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-white/20">
              <div className="text-lg sm:text-2xl font-bold text-green-300">£{animatedStats.savings}+</div>
              <div className="text-xs sm:text-sm text-blue-100">Average Savings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-white/20">
              <div className="text-lg sm:text-2xl font-bold text-blue-300">{animatedStats.users}+</div>
              <div className="text-xs sm:text-sm text-blue-100">Happy Users</div>
            </div>
          </div>
          
          <div className={`bg-white rounded-xl p-4 sm:p-6 shadow-2xl max-w-2xl mx-auto mb-6 sm:mb-8 mx-4 sm:mx-auto transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'} hover:shadow-3xl hover:scale-105 transition-transform`}>
            <PriceSearchForm onSearch={onSearch} />
          </div>
          
          <div className={`flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-blue-100 px-4 sm:px-0 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center space-x-2 hover:text-white transition-colors group">
              <Check className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Official Consumer Council Data</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-white transition-colors group">
              <Clock className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Updated Every Hour</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-white transition-colors group">
              <Shield className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>100% Free to Use</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
