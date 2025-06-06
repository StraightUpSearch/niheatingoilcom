import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import LocationConsentModal from "@/components/location-consent-modal";

// Northern Ireland postcode areas with common towns/areas
const NI_POSTCODE_DATA = {
  "BT1": ["Belfast City Centre", "Cathedral Quarter", "Titanic Quarter"],
  "BT2": ["Belfast South", "Botanic", "University Area"],
  "BT3": ["Belfast East", "Sydenham", "Titanic Quarter"],
  "BT4": ["Belfast East", "Ballyhackamore", "Stormont"],
  "BT5": ["Belfast East", "Castlereagh", "Dundonald"],
  "BT6": ["Belfast East", "Castlereagh", "Knock"],
  "BT7": ["Belfast South", "Botanic", "Ormeau"],
  "BT8": ["Belfast South", "Carryduff", "Forestside"],
  "BT9": ["Belfast South", "Malone", "Stranmillis"],
  "BT10": ["Belfast West", "Finaghy", "Upper Malone"],
  "BT11": ["Belfast West", "Andersonstown", "Twinbrook"],
  "BT12": ["Belfast West", "Sandy Row", "Village"],
  "BT13": ["Belfast North", "Shankill", "Woodvale"],
  "BT14": ["Belfast North", "Ballysillan", "Upper Ballysillan"],
  "BT15": ["Belfast North", "Ballymacarrett", "Shore Road"],
  "BT16": ["Dundonald", "Newtownbreda", "Carryduff"],
  "BT17": ["Dunmurry", "Finaghy", "Derriaghy"],
  "BT18": ["Holywood", "Cultra", "Helen's Bay"],
  "BT19": ["Bangor", "Groomsport", "Crawfordsburn"],
  "BT20": ["Bangor", "Conlig", "Clandeboye"],
  "BT21": ["Comber", "Killyleagh", "Saintfield"],
  "BT22": ["Newtownards", "Greyabbey", "Kircubbin"],
  "BT23": ["Newtownards", "Scrabo", "Movilla"],
  "BT24": ["Ballynahinch", "Saintfield", "Crossgar"],
  "BT25": ["Dromore", "Banbridge", "Gilford"],
  "BT26": ["Hillsborough", "Moira", "Dromore"],
  "BT27": ["Lisburn", "Hillsborough", "Moira"],
  "BT28": ["Lisburn", "Dunmurry", "Lagmore"],
  "BT29": ["Crumlin", "Glenavy", "Aldergrove"],
  "BT30": ["Downpatrick", "Strangford", "Ardglass"],
  "BT31": ["Ballynahinch", "Crossgar", "Spa"],
  "BT32": ["Banbridge", "Rathfriland", "Katesbridge"],
  "BT33": ["Newcastle", "Annalong", "Kilkeel"],
  "BT34": ["Newry", "Warrenpoint", "Rostrevor"],
  "BT35": ["Newry", "Bessbrook", "Camlough"],
  "BT36": ["Newtownabbey", "Jordanstown", "Whiteabbey"],
  "BT37": ["Newtownabbey", "Ballyclare", "Doagh"],
  "BT38": ["Carrickfergus", "Whitehead", "Islandmagee"],
  "BT39": ["Ballyclare", "Templepatrick", "Doagh"],
  "BT40": ["Larne", "Carnlough", "Glenarm"],
  "BT41": ["Antrim", "Randalstown", "Toomebridge"],
  "BT42": ["Ballymena", "Broughshane", "Kells"],
  "BT43": ["Ballymena", "Ahoghill", "Cullybackey"],
  "BT44": ["Ballymoney", "Rasharkin", "Dunloy"],
  "BT45": ["Magherafelt", "Maghera", "Swatragh"],
  "BT46": ["Maghera", "Swatragh", "Upperlands"],
  "BT47": ["Londonderry", "Derry", "Waterside"],
  "BT48": ["Londonderry", "Derry", "Cityside"],
  "BT49": ["Limavady", "Dungiven", "Feeny"],
  "BT51": ["Garvagh", "Coleraine", "Kilrea"],
  "BT52": ["Coleraine", "Portstewart", "Castlerock"],
  "BT53": ["Ballymoney", "Ballycastle", "Bushmills"],
  "BT54": ["Ballycastle", "Cushendall", "Cushendun"],
  "BT55": ["Portrush", "Bushmills", "Giant's Causeway"],
  "BT56": ["Coleraine", "Articlave", "Castlerock"],
  "BT57": ["Coleraine", "Macosquin", "Aghadowey"],
  "BT60": ["Armagh", "Markethill", "Keady"],
  "BT61": ["Armagh", "Tandragee", "Portadown"],
  "BT62": ["Craigavon", "Portadown", "Lurgan"],
  "BT63": ["Craigavon", "Lurgan", "Moira"],
  "BT64": ["Craigavon", "Aghalee", "Dollingstown"],
  "BT65": ["Craigavon", "Brownlow", "Waringstown"],
  "BT66": ["Lurgan", "Gilford", "Banbridge"],
  "BT67": ["Lurgan", "Magheralin", "Dollingstown"],
  "BT70": ["Dungannon", "Coalisland", "Stewartstown"],
  "BT71": ["Dungannon", "Moy", "Charlemont"],
  "BT74": ["Enniskillen", "Lisnaskea", "Irvinestown"],
  "BT75": ["Fivemiletown", "Clogher", "Augher"],
  "BT76": ["Omagh", "Drumquin", "Trillick"],
  "BT77": ["Augher", "Clogher", "Fivemiletown"],
  "BT78": ["Omagh", "Newtownstewart", "Sion Mills"],
  "BT79": ["Omagh", "Dromore", "Trillick"],
  "BT80": ["Cookstown", "Moneymore", "Coagh"],
  "BT81": ["Castledawson", "Bellaghy", "Magherafelt"],
  "BT82": ["Omagh", "Beragh", "Sixmilecross"],
  "BT92": ["Enniskillen", "Belleek", "Kesh"],
  "BT93": ["Enniskillen", "Belcoo", "Garrison"],
  "BT94": ["Enniskillen", "Tempo", "Brookeborough"]
};

interface SmartPostcodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  id?: string;
}

export default function SmartPostcodeInput({
  value,
  onChange,
  onBlur,
  placeholder = "BT1 1AA",
  disabled = false,
  error,
  label = "Northern Ireland Postcode",
  id = "postcode"
}: SmartPostcodeInputProps) {
  const [suggestions, setSuggestions] = useState<Array<{area: string, towns: string[]}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geoLocation, setGeoLocation] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get user's specific location and auto-fill postcode
  const getGeolocationHint = async () => {
    if (!navigator.geolocation) return;
    
    setGeoLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Detailed coordinate mapping to specific NI postcodes
          if (latitude >= 54.4 && latitude <= 55.3 && longitude >= -8.2 && longitude <= -5.4) {
            let suggestedPostcode = "";
            
            // Belfast area (detailed mapping)
            if (latitude >= 54.55 && latitude <= 54.65 && longitude >= -6.0 && longitude <= -5.85) {
              if (latitude > 54.605 && longitude > -5.95) suggestedPostcode = "BT4";
              else if (latitude > 54.595 && longitude < -5.93) suggestedPostcode = "BT9";
              else if (latitude > 54.58 && longitude > -5.92) suggestedPostcode = "BT7";
              else if (longitude < -5.93) suggestedPostcode = "BT12";
              else suggestedPostcode = "BT1";
            }
            // North Coast
            else if (latitude > 55.15) {
              if (longitude < -6.5) suggestedPostcode = "BT53";
              else if (longitude < -6.2) suggestedPostcode = "BT52";
              else suggestedPostcode = "BT40";
            }
            // West NI
            else if (longitude < -7.0) {
              if (latitude > 54.7) suggestedPostcode = "BT78";
              else if (latitude > 54.5) suggestedPostcode = "BT74";
              else suggestedPostcode = "BT70";
            }
            // East Coast
            else if (longitude > -5.6) {
              if (latitude > 54.7) suggestedPostcode = "BT19";
              else if (latitude > 54.45) suggestedPostcode = "BT22";
              else suggestedPostcode = "BT30";
            }
            // Central/South areas
            else if (latitude < 54.5) {
              if (longitude < -6.2) suggestedPostcode = "BT34";
              else suggestedPostcode = "BT32";
            }
            // Default fallback for other NI areas
            else {
              suggestedPostcode = "BT41";
            }
            
            if (suggestedPostcode) {
              setGeoLocation(`Detected: ${suggestedPostcode} area`);
              // Auto-fill if input is empty
              if (!value.trim()) {
                onChange(suggestedPostcode + " ");
              }
            }
          }
        } catch (error) {
          console.log("Could not determine location");
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        setGeoLoading(false);
        console.log("Location access denied or unavailable");
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 300000 }
    );
  };

  // Generate suggestions based on input
  const generateSuggestions = (input: string) => {
    if (!input || input.length < 2) {
      setSuggestions([]);
      return;
    }

    // Don't show suggestions if user has a complete postcode
    const hasFullPostcode = /^BT\d{1,2}\s?\d[A-Z]{2}$/i.test(input.trim());
    if (hasFullPostcode) {
      setSuggestions([]);
      return;
    }

    const searchTerm = input.toUpperCase().replace(/\s/g, '');
    const matches: Array<{area: string, towns: string[]}> = [];

    // Search by postcode area
    Object.entries(NI_POSTCODE_DATA).forEach(([area, towns]) => {
      if (area.startsWith(searchTerm) || searchTerm.startsWith(area)) {
        matches.push({ area, towns });
      }
    });

    // Search by town/area name
    if (matches.length === 0 && searchTerm.length >= 3) {
      Object.entries(NI_POSTCODE_DATA).forEach(([area, towns]) => {
        const hasMatchingTown = towns.some(town => 
          town.toUpperCase().replace(/\s/g, '').includes(searchTerm)
        );
        if (hasMatchingTown) {
          matches.push({ area, towns });
        }
      });
    }

    setSuggestions(matches.slice(0, 6)); // Limit to 6 suggestions
  };

  // Sanitize postcode input to prevent duplication
  const sanitizePostcodeInput = (input: string): string => {
    let cleaned = input.toUpperCase();
    
    // Remove obvious duplication patterns like "BT53 8PXBT53"
    const fullPostcodePattern = /^(BT\d{1,2}\s?\d[A-Z]{2})/i;
    const match = cleaned.match(fullPostcodePattern);
    if (match) {
      // If we found a complete postcode at the start, use only that
      cleaned = match[1];
      // Ensure proper spacing
      cleaned = cleaned.replace(/^(BT\d{1,2})(\d[A-Z]{2})$/, '$1 $2');
    }
    
    return cleaned;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = sanitizePostcodeInput(e.target.value);
    
    onChange(inputValue);
    generateSuggestions(inputValue);
    setShowSuggestions(true);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (area: string) => {
    // If user already has a complete postcode, don't replace it
    const currentInput = value.trim();
    const hasFullPostcode = /^BT\d{1,2}\s?\d[A-Z]{2}$/i.test(currentInput);
    
    if (hasFullPostcode) {
      // Keep the existing full postcode
      setShowSuggestions(false);
      return;
    }
    
    // Only replace if the current input is incomplete
    const inputWithoutBT = currentInput.replace(/^BT/i, '').trim();
    if (inputWithoutBT.length === 0 || area.startsWith(inputWithoutBT.split(' ')[0])) {
      onChange(area + " ");
    }
    
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle input focus
  const handleFocus = () => {
    if (value) {
      generateSuggestions(value);
    }
    setShowSuggestions(true);
  };

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Don't auto-request location on mount - let users choose

  return (
    <div className="space-y-2 relative">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-gray-900 font-semibold">{label}</Label>
        <div className="flex items-center gap-2">
          {geoLocation && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              {geoLocation}
            </span>
          )}
          {!geoLocation && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowConsentModal(true)}
              disabled={geoLoading}
              className="text-xs h-6 px-2"
            >
              {geoLoading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Finding...
                </>
              ) : (
                <>
                  <Navigation className="w-3 h-3 mr-1" />
                  Use My Location
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      <div className="relative">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            id={id}
            name="address-search-postcode"
            value={value}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={(e) => {
              // Delay blur to allow suggestion clicks
              setTimeout(() => {
                setShowSuggestions(false);
                onBlur?.();
              }, 200);
            }}
            placeholder={placeholder}
            className="pl-10 pr-12 text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            style={{ 
              textTransform: 'uppercase',
              color: '#111827',
              backgroundColor: '#ffffff',
              fontSize: '16px' // Prevents zoom on iOS
            }}
            disabled={disabled}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            data-lpignore="true"
            data-form-type="other"
          />
          
          {geoLoading && (
            <Loader2 className="absolute right-3 top-3 h-4 w-4 text-gray-400 animate-spin" />
          )}
          
          {!geoLoading && geoLocation && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={getGeolocationHint}
              title="Refresh location hint"
            >
              <Navigation className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <Card 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto shadow-lg"
          >
            <div className="p-2">
              {suggestions.map(({ area, towns }) => (
                <div
                  key={area}
                  className="cursor-pointer hover:bg-gray-50 p-2 rounded border-b last:border-b-0"
                  onClick={() => handleSuggestionClick(area)}
                >
                  <div className="font-medium text-sm">{area}</div>
                  <div className="text-xs text-gray-600">
                    {towns.slice(0, 3).join(", ")}
                    {towns.length > 3 && "..."}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}


      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <LocationConsentModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onAllow={getGeolocationHint}
        onDeny={() => {
          // User declined - do nothing
          console.log("User declined location access");
        }}
      />
    </div>
  );
}