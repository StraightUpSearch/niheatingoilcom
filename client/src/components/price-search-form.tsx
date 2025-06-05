import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Droplets, Loader2, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import TankSelector from "./tank-selector";
import SmartPostcodeInput from "./smart-postcode-input";
import LivePriceDisplay from "./live-price-display";
import PriceGuaranteeModal from "./price-guarantee-modal";

interface PriceSearchFormProps {
  onSearch?: (params: { postcode?: string; volume?: number }) => void;
}

export default function PriceSearchForm({ onSearch }: PriceSearchFormProps) {
  const [postcode, setPostcode] = useState("");
  const [volume, setVolume] = useState("300");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const validateNIPostcode = (postcode: string): boolean => {
    // Northern Ireland postcodes start with BT followed by 1-2 digits, then space and 3 characters
    const niPostcodeRegex = /^BT\d{1,2}\s?\d[A-Z]{2}$/i;
    return niPostcodeRegex.test(postcode.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const trimmedPostcode = postcode.trim();
    
    // Smart postcode input handles validation, but double-check for safety
    if (trimmedPostcode && !validateNIPostcode(trimmedPostcode)) {
      setIsLoading(false);
      return;
    }
    
    const params = {
      postcode: trimmedPostcode || undefined,
      volume: parseInt(volume),
    };

    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    if (onSearch) {
      onSearch(params);
    } else {
      // Navigate to comparison page with params
      const searchParams = new URLSearchParams();
      if (params.postcode) searchParams.set('postcode', params.postcode);
      if (params.volume) searchParams.set('volume', params.volume.toString());
      setLocation(`/compare?${searchParams.toString()}`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fuel Type Selection */}
          <div className="lg:col-span-1 space-y-4">
            <div className="space-y-3">
              <Label className="text-gray-900 font-semibold">Fuel Type</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input id="kerosene" type="radio" name="fuelType" value="kerosene" defaultChecked className="text-primary" />
                  <label htmlFor="kerosene" className="text-sm font-medium text-gray-800">Heating Oil (Kerosene)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input id="premium" type="radio" name="fuelType" value="premium" className="text-primary" />
                  <label htmlFor="premium" className="text-sm font-medium text-gray-800">Premium Heating Oil</label>
                </div>
              </div>
            </div>
          </div>

          {/* Postcode Input with Quick Tips */}
          <div className="lg:col-span-1 space-y-4">
            <div className="group">
              <SmartPostcodeInput
                id="postcode"
                value={postcode}
                onChange={setPostcode}
                placeholder="e.g. BT1 5GS"
                disabled={isLoading}
                label="Your Postcode"
              />
            </div>

            {/* Quick Tips */}
            <LivePriceDisplay />
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Quick Tips</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Enter any NI postcode (BT1-BT94)</li>
                <li>• Prices updated from Consumer Council</li>
                <li>• Compare up to 25+ local suppliers</li>
                <li>• 100% free comparison service</li>
              </ul>
              <div className="mt-3 text-center">
                <PriceGuaranteeModal />
              </div>
            </div>


          </div>

          {/* Tank Selector */}
          <div className="lg:col-span-2">
            <TankSelector 
              selectedVolume={volume}
              onVolumeChange={setVolume}
              className="mb-4"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <Button 
            type="submit" 
            disabled={isLoading || !postcode.trim()}
            className="w-full sm:w-auto bg-accent text-white hover:bg-orange-600 h-12 px-8 text-base font-medium transform transition-all duration-300 hover:scale-105 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Finding the best craic for ye...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Compare Oil Prices
              </>
            )}
          </Button>
        </div>
      </form>
      
      {/* Progress indicator */}
      {isLoading && (
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center animate-pulse">
            Finding the best heating oil prices in Northern Ireland...
          </p>
        </div>
      )}
    </div>
  );
}
