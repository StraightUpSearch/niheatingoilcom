import { useState, useRef, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { MapPin, Navigation, Loader2, Home, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

interface AddressSuggestion {
  formatted_address: string;
  postcode?: string;
  thoroughfare?: string; // Road name
  premise?: string; // House number/name
  locality?: string; // Town/City
  administrative_area?: string; // County
}

interface Props {
  onAddressSelect?: (address: {
    fullAddress: string;
    postcode: string;
    roadName: string;
    houseNumber: string;
    town: string;
    county: string;
  }) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function EnhancedAddressInput({
  onAddressSelect,
  placeholder = "Enter your postcode or start typing address...",
  label = "Your Address",
  disabled = false,
  className = "",
}: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Partial<AddressSuggestion> | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [houseNumbers, setHouseNumbers] = useState<string[]>([]);
  
  // Manual input fields
  const [manualAddress, setManualAddress] = useState({
    houseNumber: "",
    roadName: "",
    town: "",
    postcode: "",
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Northern Ireland postcodes validation
  const isValidNIPostcode = (postcode: string): boolean => {
    const niPattern = /^BT\d{1,2}\s?\d{1}[A-Z]{2}$/i;
    return niPattern.test(postcode.replace(/\s/g, ''));
  };

  // Fetch address suggestions using GetAddress.io API
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/address/search?q=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const data = await response.json();
        const suggestions: AddressSuggestion[] = data.addresses || [];
        setAddressSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } else {
        console.error("Address search failed:", response.statusText);
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setAddressSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch house numbers for a specific road
  const fetchHouseNumbers = async (roadName: string, postcode: string) => {
    setLoading(true);
    try {
      // This would call an API to get all house numbers for the road
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Mock house numbers
      const mockNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "15", "17", "19"];
      setHouseNumbers(mockNumbers);
    } catch (error) {
      console.error("Error fetching house numbers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (value.length >= 3) {
      fetchAddressSuggestions(value);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = async (suggestion: AddressSuggestion) => {
    setSelectedAddress(suggestion);
    setSearchValue(suggestion.formatted_address);
    setShowSuggestions(false);
    
    // Fetch available house numbers for this road
    await fetchHouseNumbers(suggestion.thoroughfare || "", suggestion.postcode || "");
    
    // Call the callback with the selected address
    onAddressSelect?.({
      fullAddress: suggestion.formatted_address,
      postcode: suggestion.postcode || "",
      roadName: suggestion.thoroughfare || "",
      houseNumber: suggestion.premise || "",
      town: suggestion.locality || "",
      county: suggestion.administrative_area || "",
    });
  };

  const handleHouseNumberChange = (houseNumber: string) => {
    if (selectedAddress) {
      const updatedAddress = {
        ...selectedAddress,
        premise: houseNumber,
        formatted_address: `${houseNumber} ${selectedAddress.thoroughfare}, ${selectedAddress.locality}, ${selectedAddress.postcode}`
      };
      
      onAddressSelect?.({
        fullAddress: updatedAddress.formatted_address,
        postcode: selectedAddress.postcode || "",
        roadName: selectedAddress.thoroughfare || "",
        houseNumber: houseNumber,
        town: selectedAddress.locality || "",
        county: selectedAddress.administrative_area || "",
      });
    }
  };

  const handleManualSubmit = () => {
    if (!isValidNIPostcode(manualAddress.postcode)) {
      alert("Please enter a valid Northern Ireland postcode (starting with BT)");
      return;
    }
    
    const fullAddress = `${manualAddress.houseNumber} ${manualAddress.roadName}, ${manualAddress.town}, ${manualAddress.postcode}`;
    
    onAddressSelect?.({
      fullAddress,
      postcode: manualAddress.postcode,
      roadName: manualAddress.roadName,
      houseNumber: manualAddress.houseNumber,
      town: manualAddress.town,
      county: "Northern Ireland",
    });
  };

  const toggleManualMode = () => {
    setManualMode(!manualMode);
    setSearchValue("");
    setSelectedAddress(null);
    setHouseNumbers([]);
    setManualAddress({
      houseNumber: "",
      roadName: "",
      town: "",
      postcode: "",
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Honeypot traps to confuse autofill */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none', height: 0, overflow: 'hidden' }}>
        <input type="text" name="username" autoComplete="username" tabIndex={-1} />
        <input type="password" name="password" autoComplete="current-password" tabIndex={-1} />
        <input type="email" name="email" autoComplete="email" tabIndex={-1} />
        <input type="text" name="address" autoComplete="street-address" tabIndex={-1} />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="address-input" className="text-sm font-medium text-gray-700">
          {label}
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleManualMode}
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          {manualMode ? "Use Address Lookup" : "Enter Manually"}
        </Button>
      </div>

      {!manualMode ? (
        <>
          {/* Address Search Input */}
          <div className="relative">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                ref={inputRef}
                id="address-input"
                name="niheatingoil-address-search"
                value={searchValue}
                onChange={handleInputChange}
                onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder={placeholder}
                className="pl-10 pr-12"
                disabled={disabled}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                data-form-type="other"
                data-no-autofill="true"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
                style={{ 
                  fontSize: '16px' // Prevents zoom on iOS
                }}
              />
              
              {loading && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 text-gray-400 animate-spin" />
              )}
            </div>

            {/* Address Suggestions */}
            {showSuggestions && addressSuggestions.length > 0 && (
              <Card 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto shadow-lg"
              >
                <div className="p-2">
                  {addressSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="cursor-pointer hover:bg-gray-50 p-3 rounded border-b last:border-b-0"
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <div className="font-medium text-sm">{suggestion.formatted_address}</div>
                      <div className="text-xs text-gray-600">{suggestion.administrative_area}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* House Number Selection - Currently disabled for simplicity */}
          {false && selectedAddress && houseNumbers.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Select House Number for {selectedAddress.thoroughfare}
              </Label>
              <Select onValueChange={handleHouseNumberChange} defaultValue={selectedAddress.premise}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose house number..." />
                </SelectTrigger>
                <SelectContent>
                  {houseNumbers.map((number) => (
                    <SelectItem key={number} value={number}>
                      {number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </>
      ) : (
        /* Manual Address Entry */
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="house-number" className="text-sm text-gray-600">House Number</Label>
              <Input
                id="house-number"
                value={manualAddress.houseNumber}
                onChange={(e) => setManualAddress({...manualAddress, houseNumber: e.target.value})}
                placeholder="e.g. 15"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="postcode-manual" className="text-sm text-gray-600">Postcode</Label>
              <Input
                id="postcode-manual"
                value={manualAddress.postcode}
                onChange={(e) => setManualAddress({...manualAddress, postcode: e.target.value.toUpperCase()})}
                placeholder="e.g. BT1 1AA"
                className="mt-1"
                style={{ textTransform: 'uppercase' }}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="road-name" className="text-sm text-gray-600">Road Name</Label>
            <Input
              id="road-name"
              value={manualAddress.roadName}
              onChange={(e) => setManualAddress({...manualAddress, roadName: e.target.value})}
              placeholder="e.g. Main Street"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="town-manual" className="text-sm text-gray-600">Town/City</Label>
            <Input
              id="town-manual"
              value={manualAddress.town}
              onChange={(e) => setManualAddress({...manualAddress, town: e.target.value})}
              placeholder="e.g. Belfast"
              className="mt-1"
            />
          </div>
          
          <Button 
            onClick={handleManualSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!manualAddress.houseNumber || !manualAddress.roadName || !manualAddress.town || !manualAddress.postcode}
          >
            <Home className="w-4 h-4 mr-2" />
            Use This Address
          </Button>
        </div>
      )}
    </div>
  );
}