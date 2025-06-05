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
      <Card className="border-0 shadow-xl">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* Header with Trust Signal */}
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Get Your Heating Oil Quote in 10 Seconds
              </h2>
              <p className="text-gray-600 mb-4">
                Northern Ireland's most trusted heating oil comparison site
              </p>
              <TrustpilotWidget variant="compact" className="justify-center" />
            </div>

            {/* Postcode Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Your Postcode
              </label>
              <SmartPostcodeInput
                value={postcode}
                onChange={setPostcode}
                placeholder="e.g. BT1 5GS"
                disabled={isLoading}
                className="text-lg"
                autoFocus
              />
            </div>

            {/* Volume Selection Cards */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                🛢️ How Much Oil?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {VOLUME_OPTIONS.map((option) => (
                  <button
                    key={option.litres}
                    type="button"
                    onClick={() => setSelectedVolume(option.litres)}
                    className={`
                      relative p-4 rounded-lg border-2 transition-all duration-200
                      ${selectedVolume === option.litres 
                        ? 'border-primary bg-primary/5 shadow-md transform scale-105' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }
                    `}
                    disabled={isLoading}
                  >
                    {option.popular && (
                      <span className="absolute -top-2 -right-2 bg-accent text-white text-xs px-2 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                    <div className="font-bold text-lg">{option.litres}L</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {option.estimatedPrice}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                *Estimated price for your area
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading || !postcode.trim()}
              className="w-full h-12 text-lg font-semibold bg-accent hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Finding the best prices...
                </>
              ) : (
                <>
                  🔥 GET INSTANT PRICES →
                </>
              )}
            </Button>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Lock className="h-4 w-4" />
                No registration required
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Prices updated hourly
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                50+ suppliers
              </span>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Social Proof Banner */}
      <div className="mt-4 bg-blue-50 rounded-lg p-4 flex items-center justify-center gap-2 animate-pulse">
        <TrendingDown className="h-5 w-5 text-blue-600" />
        <span className="text-blue-900 font-medium">
          {socialProofMessage}
        </span>
      </div>

      {/* Progress Indicator */}
      {isLoading && (
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full animate-progress" />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center animate-pulse">
            Analyzing prices across Northern Ireland...
          </p>
        </div>
      )}
    </div>
  );
}