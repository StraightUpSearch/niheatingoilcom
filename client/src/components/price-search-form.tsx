import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Droplets, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import TankSelector from "./tank-selector";

interface PriceSearchFormProps {
  onSearch?: (params: { postcode?: string; volume?: number }) => void;
}

export default function PriceSearchForm({ onSearch }: PriceSearchFormProps) {
  const [postcode, setPostcode] = useState("");
  const [volume, setVolume] = useState("300");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const params = {
      postcode: postcode.trim() || undefined,
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
          {/* Postcode Input */}
          <div className="lg:col-span-1 group">
            <Label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-primary transition-colors">
              <MapPin className="inline h-4 w-4 mr-1" />
              Your Postcode
            </Label>
            <div className="relative">
              <Input
                id="postcode"
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="e.g. BT1 5GS"
                className="w-full h-11 text-base sm:text-sm bg-white text-gray-900 border-gray-300 pl-10 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                disabled={isLoading}
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                Searching for Best Prices...
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
