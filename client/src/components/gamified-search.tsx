import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, TrendingDown, Clock, Star, Zap, MapPin } from "lucide-react";

interface GamifiedSearchProps {
  onSearch?: (params: { postcode?: string; volume?: number }) => void;
}

// Northern Ireland postcode database
const btPostcodes = [
  { code: "1 1AA", area: "Belfast City Centre" },
  { code: "1 1AB", area: "Belfast City Centre" },
  { code: "1 1AD", area: "Belfast City Centre" },
  { code: "1 2AA", area: "Belfast City Centre" },
  { code: "1 3AA", area: "Belfast City Centre" },
  { code: "1 4AA", area: "Belfast City Centre" },
  { code: "1 5AA", area: "Belfast City Centre" },
  { code: "1 5GS", area: "Belfast City Centre" },
  { code: "1 6AA", area: "Belfast City Centre" },
  { code: "2 3AA", area: "Belfast East" },
  { code: "2 4AA", area: "Belfast East" },
  { code: "2 5AA", area: "Belfast East" },
  { code: "2 6AA", area: "Belfast East" },
  { code: "2 7AA", area: "Belfast East" },
  { code: "3 1AA", area: "Belfast South" },
  { code: "3 2AA", area: "Belfast South" },
  { code: "3 3AA", area: "Belfast South" },
  { code: "3 4AA", area: "Belfast South" },
  { code: "3 5AA", area: "Belfast South" },
  { code: "4 1AA", area: "Belfast West" },
  { code: "4 2AA", area: "Belfast West" },
  { code: "4 3AA", area: "Belfast West" },
  { code: "5 1AA", area: "Belfast North" },
  { code: "5 2AA", area: "Belfast North" },
  { code: "5 3AA", area: "Belfast North" },
  { code: "6 0AA", area: "Newtownabbey" },
  { code: "6 1AA", area: "Newtownabbey" },
  { code: "6 2AA", area: "Newtownabbey" },
  { code: "7 1AA", area: "Lisburn" },
  { code: "7 2AA", area: "Lisburn" },
  { code: "7 3AA", area: "Lisburn" },
  { code: "8 1AA", area: "Carryduff" },
  { code: "8 2AA", area: "Carryduff" },
  { code: "8 3AA", area: "Carryduff" },
  { code: "9 5AA", area: "Belfast South" },
  { code: "9 6AA", area: "Belfast South" },
  { code: "9 7AA", area: "Belfast South" },
  { code: "10 0AA", area: "Finaghy" },
  { code: "11 9AA", area: "Belfast West" },
  { code: "12 4AA", area: "Belfast West" },
  { code: "13 1AA", area: "Belfast North" },
  { code: "13 2AA", area: "Belfast North" },
  { code: "14 6AA", area: "Belfast East" },
  { code: "15 1AA", area: "Belfast East" },
  { code: "16 1AA", area: "Belfast East" },
  { code: "17 0AA", area: "Belfast South" },
  { code: "17 9AA", area: "Belfast South" },
  { code: "18 9AA", area: "Belfast East" },
  { code: "19 1AA", area: "Belfast North" },
  { code: "20 3AA", area: "Belfast" },
  { code: "21 0AA", area: "Antrim" },
  { code: "22 1AA", area: "Randalstown" },
  { code: "23 4AA", area: "Ballyclare" },
  { code: "24 0AA", area: "Ballycastle" },
  { code: "25 1AA", area: "Ballymena" },
  { code: "26 6AA", area: "Ballymoney" },
  { code: "27 4AA", area: "Bushmills" },
  { code: "28 1AA", area: "Ballymena" },
  { code: "29 4AA", area: "Crumlin" },
  { code: "30 6AA", area: "Bushmills" },
  { code: "31 9AA", area: "Antrim" },
  { code: "32 3AA", area: "Cushendall" },
  { code: "33 0AA", area: "Carnlough" },
  { code: "34 4AA", area: "Armagh" },
  { code: "35 6AA", area: "Armagh" },
  { code: "36 5AA", area: "Armagh" },
  { code: "37 0AA", area: "Tandragee" },
  { code: "38 8AA", area: "Lisburn" },
  { code: "39 0AA", area: "Hillsborough" },
  { code: "40 1AA", area: "Craigavon" },
  { code: "41 2AA", area: "Lurgan" },
  { code: "42 1AA", area: "Banbridge" },
  { code: "43 5AA", area: "Banbridge" },
  { code: "44 0AA", area: "Ballynahinch" },
  { code: "45 8AA", area: "Comber" },
  { code: "46 5AA", area: "Donaghadee" },
  { code: "47 1AA", area: "Downpatrick" },
  { code: "48 0AA", area: "Kilkeel" },
  { code: "49 0AA", area: "Newry" },
  { code: "60 1AA", area: "Holywood" },
  { code: "61 1AA", area: "Newtownards" },
  { code: "62 1AA", area: "Bangor" },
  { code: "63 5AA", area: "Bangor" },
  { code: "66 6AA", area: "Whitehead" },
  { code: "67 9AA", area: "Ballyclare" },
  { code: "70 1AA", area: "Derry" },
  { code: "71 1AA", area: "Derry" },
  { code: "72 1AA", area: "Coleraine" },
  { code: "73 1AA", area: "Coleraine" },
  { code: "74 1AA", area: "Enniskillen" },
  { code: "75 0AA", area: "Fivemiletown" },
  { code: "76 5AA", area: "Irvinestown" },
  { code: "77 0AA", area: "Kesh" },
  { code: "78 1AA", area: "Omagh" },
  { code: "79 0AA", area: "Cookstown" },
  { code: "80 8AA", area: "Dungannon" },
  { code: "81 7AA", area: "Coalisland" },
  { code: "82 1AA", area: "Magherafelt" },
  { code: "92 1AA", area: "Craigavon" },
  { code: "93 4AA", area: "Craigavon" },
  { code: "94 2AA", area: "Enniskillen" }
];

export default function GamifiedSearch({ onSearch }: GamifiedSearchProps) {
  const [postcodeInput, setPostcodeInput] = useState("");
  const [volume, setVolume] = useState<number | undefined>();
  const [searchCount, setSearchCount] = useState(3); // User's search count today
  const [isSearching, setIsSearching] = useState(false);
  const [lastSavings, setLastSavings] = useState(47.20); // Last search savings
  const [postcodeError, setPostcodeError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredPostcodes, setFilteredPostcodes] = useState(btPostcodes);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);

  // Validate Northern Ireland postcode format
  const validatePostcode = (input: string): boolean => {
    const fullPostcode = `BT${input}`.replace(/\s+/g, ' ').trim();
    // Northern Ireland postcode pattern: BT followed by 1-2 digits, space, then 1 digit and 2 letters
    const postcodeRegex = /^BT\d{1,2}\s?\d[A-Z]{2}$/i;
    return postcodeRegex.test(fullPostcode);
  };

  const handlePostcodeChange = (value: string) => {
    // Handle both "BT1 5GS" and "1 5GS" formats
    let cleanInput = value.trim();
    if (cleanInput.toUpperCase().startsWith('BT')) {
      cleanInput = cleanInput.substring(2).trim();
    }
    
    setPostcodeInput(cleanInput);
    setPostcodeError("");
    
    // Filter postcodes based on input
    if (cleanInput.length > 0) {
      // Don't show suggestions if user has a complete postcode
      const hasFullPostcode = /^\d{1,2}\s?\d[A-Z]{2}$/i.test(cleanInput);
      if (hasFullPostcode) {
        setShowSuggestions(false);
        return;
      }
      
      const filtered = btPostcodes.filter(postcode => 
        postcode.code.toLowerCase().includes(cleanInput.toLowerCase()) ||
        postcode.area.toLowerCase().includes(cleanInput.toLowerCase())
      ).slice(0, 8); // Limit to 8 suggestions
      setFilteredPostcodes(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    
    // Validate if input is complete enough
    if (cleanInput.length >= 3) {
      const fullPostcode = `BT${cleanInput}`;
      if (!validatePostcode(cleanInput)) {
        setPostcodeError("Please enter a valid Northern Ireland postcode");
      }
    }
  };

  const handlePostcodeSelect = (postcode: string) => {
    // If user already has a complete postcode, don't replace it
    const currentInput = postcodeInput.trim();
    const hasFullPostcode = /^\d{1,2}\s?\d[A-Z]{2}$/i.test(currentInput);
    
    if (hasFullPostcode) {
      // Keep the existing full postcode
      setShowSuggestions(false);
      return;
    }
    
    // Only replace if the current input is incomplete or matches the start
    if (currentInput.length === 0 || postcode.startsWith(currentInput.split(' ')[0])) {
      setPostcodeInput(postcode);
    }
    
    setShowSuggestions(false);
    setPostcodeError("");
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                Enter Your Northern Ireland Postcode
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg sm:text-xl text-gray-600 font-semibold pointer-events-none z-10">
                  BT
                </div>
                <input
                  ref={inputRef}
                  id="postcode-input"
                  type="text"
                  placeholder="Type: 1 5GS or BT1 5GS"
                  value={postcodeInput}
                  onChange={(e) => handlePostcodeChange(e.target.value.toUpperCase())}
                  onFocus={() => postcodeInput && setShowSuggestions(true)}
                  className="w-full text-lg sm:text-xl p-4 sm:p-5 pl-12 sm:pl-14 h-14 sm:h-16 border-2 border-blue-300 focus:border-blue-500 rounded-lg touch-manipulation bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  style={{ 
                    fontSize: '18px', 
                    color: '#000000', 
                    backgroundColor: '#ffffff',
                    border: '2px solid #3b82f6'
                  }}
                  autoComplete="postal-code"
                  inputMode="text"
                  aria-describedby="postcode-help postcode-error"
                  aria-invalid={!!postcodeError}
                />
                
                {/* Autocomplete dropdown */}
                {showSuggestions && filteredPostcodes.length > 0 && (
                  <div 
                    ref={suggestionBoxRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-blue-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto"
                  >
                    {filteredPostcodes.map((postcode, index) => (
                      <button
                        key={index}
                        onClick={() => handlePostcodeSelect(postcode.code)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0 touch-manipulation"
                      >
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                          <div>
                            <div className="text-lg font-semibold text-gray-900">
                              BT{postcode.code}
                            </div>
                            <div className="text-sm text-gray-600">
                              {postcode.area}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {postcodeError && (
                <p id="postcode-error" className="text-sm text-red-600 mt-2" role="alert">
                  {postcodeError}
                </p>
              )}
              <p id="postcode-help" className="text-sm sm:text-base text-gray-600 mt-2">
                <strong>You can type either way:</strong> "1 5GS" or the full "BT1 5GS" - both work perfectly fine!
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