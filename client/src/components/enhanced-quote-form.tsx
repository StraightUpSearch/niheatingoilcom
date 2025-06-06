import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Loader2, Lock, TrendingDown, Clock, Users } from "lucide-react";
import SmartPostcodeInput from "@/components/smart-postcode-input";
import TrustpilotWidget from "@/components/trust-pilot-widget";
import { useQuery } from "@tanstack/react-query";

interface EnhancedQuoteFormProps {
  onSearch?: (params: { postcode?: string; volume?: number }) => void;
  className?: string;
}

const VOLUME_OPTIONS = [
  { litres: 300, estimatedPrice: "£165-185", popular: false },
  { litres: 500, estimatedPrice: "£275-295", popular: true },
  { litres: 900, estimatedPrice: "£495-515", popular: false },
];

export default function EnhancedQuoteForm({ onSearch, className = "" }: EnhancedQuoteFormProps) {
  const [postcode, setPostcode] = useState("");
  const [selectedVolume, setSelectedVolume] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [socialProofMessage, setSocialProofMessage] = useState("");
  
  // Fetch live stats for social proof
  const { data: stats } = useQuery({
    queryKey: ["/api/stats/recent-savings"],
    refetchInterval: 30000, // Update every 30 seconds
  });

  // Rotate social proof messages
  useEffect(() => {
    const messages = [
      `23 people in County Down saved £487 this week`,
      `Average savings: £${stats?.averageSavings || 156} per order`,
      `${stats?.recentOrders || 47} orders placed today`,
      `Prices updated ${stats?.lastUpdate || "2 hours"} ago`,
    ];
    
    let index = 0;
    setSocialProofMessage(messages[0]);
    
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setSocialProofMessage(messages[index]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [stats]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) return;
    
    setIsLoading(true);
    
    // Simulate processing for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (onSearch) {
      onSearch({ 
        postcode: postcode.trim(), 
        volume: selectedVolume 
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <Card className="border-0 shadow-2xl rounded-2xl bg-gradient-to-br from-white via-blue-50 to-blue-100">
        <CardContent className="p-6 md:p-10">
          <form onSubmit={handleSubmit}>
            {/* Header with Trust Signal */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-sm">
                Get Your Heating Oil Quote in 10 Seconds
              </h2>
              <p className="text-lg text-blue-700 mb-4 font-medium">
                Northern Ireland's most trusted heating oil comparison site
              </p>
              <TrustpilotWidget variant="compact" className="justify-center" />
            </div>

            {/* Postcode Input */}
            <div className="mb-8">
              <label className="block text-base font-semibold text-gray-800 mb-2">
                <MapPin className="inline h-5 w-5 mr-2 text-blue-600 align-text-bottom" />
                Your Postcode
              </label>
              <SmartPostcodeInput
                value={postcode}
                onChange={setPostcode}
                placeholder="e.g. BT1 5GS"
                disabled={isLoading}
                className="text-lg px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all w-full bg-white shadow-sm"
                autoFocus
              />
            </div>

            {/* Volume Selection Cards */}
            <div className="mb-8">
              <label className="block text-base font-semibold text-gray-800 mb-3">
                🛢️ How Much Oil?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {VOLUME_OPTIONS.map((option) => (
                  <button
                    key={option.litres}
                    type="button"
                    onClick={() => setSelectedVolume(option.litres)}
                    className={`
                      relative p-5 rounded-xl border-2 font-semibold flex flex-col items-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300
                      ${selectedVolume === option.litres 
                        ? 'border-blue-600 bg-blue-50 shadow-lg scale-105 ring-2 ring-blue-200' 
                        : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md'
                      }
                    `}
                    disabled={isLoading}
                  >
                    {option.popular && (
                      <span className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow-md font-bold uppercase tracking-wide">
                        Popular
                      </span>
                    )}
                    <div className="font-extrabold text-2xl text-blue-900 drop-shadow-sm">{option.litres}L</div>
                    <div className="text-sm text-blue-700 mt-1 font-medium">
                      {option.estimatedPrice}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                *Estimated price for your area
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading || !postcode.trim()}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                  Finding the best prices...
                </>
              ) : (
                <>
                  🔥 GET INSTANT PRICES →
                </>
              )}
            </Button>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-base text-blue-900 font-medium">
              <span className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-500" />
                No registration required
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Prices updated hourly
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                50+ suppliers
              </span>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Social Proof Banner */}
      <div className="mt-6 bg-blue-100 rounded-xl p-5 flex items-center justify-center gap-3 shadow animate-pulse border border-blue-200">
        <TrendingDown className="h-6 w-6 text-blue-700" />
        <span className="text-blue-900 font-semibold text-lg">
          {socialProofMessage}
        </span>
      </div>

      {/* Progress Indicator */}
      {isLoading && (
        <div className="mt-6">
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full animate-progress" />
          </div>
          <p className="text-base text-blue-700 mt-3 text-center animate-pulse">
            Analyzing prices across Northern Ireland...
          </p>
        </div>
      )}
    </div>
  );
}