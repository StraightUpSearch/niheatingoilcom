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

  const validateNIPostcode = (postcode: string): boolean => {
    // Northern Ireland postcodes start with BT followed by 1-2 digits, then space and 3 characters
    const niPostcodeRegex = /^BT\d{1,2}\s?\d[A-Z]{2}$/i;
    return niPostcodeRegex.test(postcode.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const trimmedPostcode = postcode.trim();
    
    // Validate Northern Ireland postcode if provided
    if (trimmedPostcode && !validateNIPostcode(trimmedPostcode)) {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm mx-auto shadow-xl">
          <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Northern Ireland Only</h3>
            <p class="text-gray-600 mb-4">Please enter a valid NI postcode (e.g., BT1 5GS). Our service covers all six counties of Northern Ireland.</p>
            <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Got it
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector('button')?.addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
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
          {/* Postcode Input with Quick Tips */}
          <div className="lg:col-span-1 space-y-4">
            <div className="group">
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

            {/* Quick Tips */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Quick Tips</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Enter any NI postcode (BT1-BT94)</li>
                <li>• Prices updated from Consumer Council</li>
                <li>• Compare up to 25+ local suppliers</li>
                <li>• 100% free comparison service</li>
              </ul>
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
