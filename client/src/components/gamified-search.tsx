import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, TrendingDown, Clock, Star, Zap } from "lucide-react";

interface GamifiedSearchProps {
  onSearch?: (params: { postcode?: string; volume?: number }) => void;
}

export default function GamifiedSearch({ onSearch }: GamifiedSearchProps) {
  const [postcodeInput, setPostcodeInput] = useState("");
  const [volume, setVolume] = useState<number | undefined>();
  const [searchCount, setSearchCount] = useState(3); // User's search count today
  const [isSearching, setIsSearching] = useState(false);
  const [lastSavings, setLastSavings] = useState(47.20); // Last search savings
  const [postcodeError, setPostcodeError] = useState("");

  // Validate Northern Ireland postcode format
  const validatePostcode = (input: string): boolean => {
    const fullPostcode = `BT${input}`.replace(/\s+/g, ' ').trim();
    // Northern Ireland postcode pattern: BT followed by 1-2 digits, space, then 1 digit and 2 letters
    const postcodeRegex = /^BT\d{1,2}\s?\d[A-Z]{2}$/i;
    return postcodeRegex.test(fullPostcode);
  };

  const handlePostcodeChange = (value: string) => {
    // Remove any "BT" prefix if user tries to type it
    const cleanInput = value.replace(/^BT/i, '').trim();
    setPostcodeInput(cleanInput);
    setPostcodeError("");
    
    // Validate if input is complete enough
    if (cleanInput.length >= 3) {
      const fullPostcode = `BT${cleanInput}`;
      if (!validatePostcode(cleanInput)) {
        setPostcodeError("Please enter a valid Northern Ireland postcode (e.g. BT1 5GS)");
      }
    }
  };

  const handleSearch = () => {
    const fullPostcode = `BT${postcodeInput}`.replace(/\s+/g, ' ').trim();
    
    if (!postcodeInput || !volume) return;
    
    if (!validatePostcode(postcodeInput)) {
      setPostcodeError("Please enter a valid Northern Ireland postcode");
      return;
    }
    
    setIsSearching(true);
    setSearchCount(prev => prev + 1);
    setPostcodeError("");
    
    // Simulate search delay for dramatic effect
    setTimeout(() => {
      setIsSearching(false);
      onSearch?.({ postcode: fullPostcode, volume });
      
      // Simulate new savings amount
      setLastSavings(Math.random() * 50 + 20);
    }, 1500);
  };

  const searchRewards = [
    { threshold: 1, reward: "First Search", icon: Search, color: "bg-green-500" },
    { threshold: 5, reward: "Explorer", icon: TrendingDown, color: "bg-blue-500" },
    { threshold: 10, reward: "Deal Hunter", icon: Star, color: "bg-purple-500" },
    { threshold: 25, reward: "Savings Master", icon: Zap, color: "bg-yellow-500" }
  ];

  const nextReward = searchRewards.find(reward => searchCount < reward.threshold);
  const earnedRewards = searchRewards.filter(reward => searchCount >= reward.threshold);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Compare Heating Oil Prices</h2>
          <p className="text-base sm:text-lg text-gray-700">Find the cheapest heating oil suppliers in your area</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="postcode-input" className="block text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                Enter Your Postcode
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg sm:text-xl text-gray-600 font-semibold pointer-events-none">
                  BT
                </div>
                <Input
                  id="postcode-input"
                  type="text"
                  placeholder="1 5GS"
                  value={postcodeInput}
                  onChange={(e) => handlePostcodeChange(e.target.value.toUpperCase())}
                  className={`w-full text-lg sm:text-xl p-4 sm:p-5 pl-12 sm:pl-14 h-14 sm:h-16 border-2 ${postcodeError ? 'border-red-300 focus:border-red-500' : 'border-blue-300 focus:border-blue-500'} rounded-lg touch-manipulation`}
                  style={{ fontSize: '18px' }}
                  autoComplete="postal-code"
                  inputMode="text"
                  aria-describedby="postcode-help postcode-error"
                  aria-invalid={!!postcodeError}
                />
              </div>
              {postcodeError && (
                <p id="postcode-error" className="text-sm text-red-600 mt-2" role="alert">
                  {postcodeError}
                </p>
              )}
              <p id="postcode-help" className="text-sm sm:text-base text-gray-600 mt-2">
                Enter your Northern Ireland postcode (e.g. 1 5GS for BT1 5GS)
              </p>
            </div>
            <div>
              <label className="block text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                How Much Oil Do You Need?
              </label>
              <Select onValueChange={(value) => setVolume(parseInt(value))}>
                <SelectTrigger className="w-full text-lg sm:text-xl p-4 sm:p-5 h-14 sm:h-16 border-2 border-blue-300 focus:border-blue-500 rounded-lg touch-manipulation">
                  <SelectValue placeholder="Choose the amount of oil you need" />
                </SelectTrigger>
                <SelectContent className="text-base sm:text-lg">
                  <SelectItem value="300" className="text-base sm:text-lg p-3 sm:p-4 min-h-[48px] touch-manipulation">300 Litres (Small tank fill)</SelectItem>
                  <SelectItem value="500" className="text-base sm:text-lg p-3 sm:p-4 min-h-[48px] touch-manipulation">500 Litres (Medium tank fill)</SelectItem>
                  <SelectItem value="900" className="text-base sm:text-lg p-3 sm:p-4 min-h-[48px] touch-manipulation">900 Litres (Large tank fill)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Select the amount that matches your oil tank size
              </p>
            </div>
          </div>

          <Button 
            onClick={handleSearch}
            disabled={!postcodeInput || !volume || isSearching || !!postcodeError}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 sm:py-6 text-lg sm:text-xl h-14 sm:h-16 rounded-lg border-2 border-blue-700 shadow-lg hover:shadow-xl transition-all touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-2 sm:mr-3"></div>
                <span className="text-lg sm:text-xl">Finding Your Best Prices...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                <span className="text-lg sm:text-xl">Compare Heating Oil Prices</span>
              </div>
            )}
          </Button>

          {/* Simple instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="text-center">
              <p className="text-base sm:text-lg text-blue-800 font-medium">
                Get instant price comparisons from verified Northern Ireland heating oil suppliers
              </p>
              <p className="text-sm sm:text-base text-blue-700 mt-2">
                It's completely free and takes less than 30 seconds
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}