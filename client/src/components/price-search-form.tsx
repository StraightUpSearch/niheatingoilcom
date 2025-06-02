import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Droplets, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

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
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 min-w-0 group">
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
          <div className="flex-1 min-w-0 group">
            <Label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-primary transition-colors">
              <Droplets className="inline h-4 w-4 mr-1" />
              Oil Volume (Litres)
            </Label>
            <Select value={volume} onValueChange={setVolume} disabled={isLoading}>
              <SelectTrigger className="bg-white text-gray-900 border-gray-300 h-11 text-base sm:text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50">
                <div className="flex items-center">
                  <Droplets className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue className="text-gray-900" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem value="300" className="text-gray-900 hover:bg-gray-100 py-3 text-base sm:text-sm cursor-pointer">
                  300L - Small Tank
                </SelectItem>
                <SelectItem value="500" className="text-gray-900 hover:bg-gray-100 py-3 text-base sm:text-sm cursor-pointer">
                  500L - Medium Tank
                </SelectItem>
                <SelectItem value="900" className="text-gray-900 hover:bg-gray-100 py-3 text-base sm:text-sm cursor-pointer">
                  900L - Large Tank
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button 
              type="submit" 
              disabled={isLoading || !postcode.trim()}
              className="w-full sm:w-auto bg-accent text-white hover:bg-orange-600 h-11 px-6 text-base sm:text-sm font-medium transform transition-all duration-300 hover:scale-105 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Compare Prices
                </>
              )}
            </Button>
          </div>
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
