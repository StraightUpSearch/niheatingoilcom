import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown, Star, MessageSquare, MapPin, Clock, TrendingUp, Phone, Globe, Award, Fuel } from "lucide-react";
import LeadCaptureModal from "./lead-capture-modal";
<<<<<<< HEAD
// Import centralized pricing utilities
import { calculateVolumePrice, formatPrice, formatPricePerLitre } from "@shared/pricing";
// Import loading skeletons
import { PriceTableSkeleton, PriceCardSkeleton } from "@/components/loading-skeletons";
=======
>>>>>>> cursor/analyze-competitor-ux-for-improvements-6c0f
import PriceLockFeature from "./price-lock-feature";

interface EnhancedPricingTableProps {
  searchParams?: {
    postcode?: string;
    volume?: number;
  };
}

type SortField = 'supplier' | 'price300' | 'price500' | 'price900' | 'rating';

// --- MOCK DATA FOR DEVELOPMENT ---
const mockSuppliers = [
  {
    id: 1,
    supplier: {
      id: 1,
      name: "Dummy Fuels",
      location: "Belfast",
      rating: 4.7,
    },
    price: 149,
    volume: 500,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    supplier: {
      id: 2,
      name: "Hayes Fuels",
      location: "Craigavon, Co. Armagh",
      rating: 4.5,
    },
    price: 152,
    volume: 500,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    supplier: {
      id: 3,
      name: "NAP Fuels",
      location: "Omagh, Co. Tyrone",
      rating: 4.2,
    },
    price: 155,
    volume: 500,
    createdAt: new Date().toISOString(),
  },
];

const mockConsumerCouncilAverages = {
  300: 0.52, // £0.52 per litre
  500: 0.50, // £0.50 per litre
  900: 0.48, // £0.48 per litre
  best: 0.48,
  suppliers: 5,
  lastUpdated: new Date().toLocaleDateString(),
};
// --- END MOCK DATA ---

export default function EnhancedPricingTable({ searchParams }: EnhancedPricingTableProps) {
  const [sortField, setSortField] = useState<SortField>('price500');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const { data: pricesData, isLoading, error } = useQuery({
    queryKey: ["/api/prices", { postcode: searchParams?.postcode }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchParams?.postcode) {
        params.set('postcode', searchParams.postcode);
      }
      
      const response = await fetch(`/api/prices?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }
      return response.json();
    },
  });

  // Use mock data if in development and no real data is loaded
  const isDev = !pricesData || process.env.NODE_ENV === 'development';
  const prices = isDev ? mockSuppliers : (pricesData ? [...pricesData].sort((a: any, b: any) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'supplier':
        aValue = a.supplier.name.toLowerCase();
        bValue = b.supplier.name.toLowerCase();
        break;
      case 'price300':
        aValue = calculateVolumePrice(a.price, a.volume, 300);
        bValue = calculateVolumePrice(b.price, b.volume, 300);
        break;
      case 'price500':
        aValue = calculateVolumePrice(a.price, a.volume, 500);
        bValue = calculateVolumePrice(b.price, b.volume, 500);
        break;
      case 'price900':
        aValue = calculateVolumePrice(a.price, a.volume, 900);
        bValue = calculateVolumePrice(b.price, b.volume, 900);
        break;
      case 'rating':
        aValue = Number(a.supplier.rating) || 4;
        bValue = Number(b.supplier.rating) || 4;
        break;
      default:
        return 0;
    }
    
    if (sortField === 'supplier') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortDirection === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }
  }) : []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleQuoteRequest = (supplier: any, volume: number = 500) => {
    // Find the appropriate price based on volume
    let basePrice = 0;
    let baseVolume = 500;
    
    if (volume === 300 && supplier.price300) {
      basePrice = parseFloat(supplier.price300);
      baseVolume = 300;
    } else if (volume === 500 && supplier.price500) {
      basePrice = parseFloat(supplier.price500);
      baseVolume = 500;
    } else if (volume === 900 && supplier.price900) {
      basePrice = parseFloat(supplier.price900);
      baseVolume = 900;
    } else {
      // Default to 500L price and calculate proportionally
      basePrice = parseFloat(supplier.price500 || supplier.price300 || supplier.price900 || '0');
      baseVolume = supplier.price500 ? 500 : (supplier.price300 ? 300 : 900);
    }
    
    const calculatedPrice = calculateVolumePrice(basePrice, baseVolume, volume);
    
    setSelectedSupplier({
      name: supplier.name,
      price: formatPrice(calculatedPrice),
      volume: volume,
      location: supplier.location
    });
    setShowLeadModal(true);
  };

  const handleSaveQuote = async (supplier: any, volume: number = 500) => {
    if (!isAuthenticated) {
      setSelectedSupplier({
        name: supplier.name,
        price: formatPrice(calculateVolumePrice(parseFloat(supplier.price500), 500, volume)),
        volume,
        location: supplier.location
      });
      setShowLeadModal(true);
      return;
    }

    await fetch('/api/saved-quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supplierName: supplier.name,
        price: formatPrice(calculateVolumePrice(parseFloat(supplier.price500), 500, volume)),
        volume,
        postcode: searchParams?.postcode || '',
        location: supplier.location
      })
    });
  };

  const getDeliveryArea = (location: string) => {
    // Map supplier locations to delivery postcodes based on real NI data
    const deliveryAreas: { [key: string]: string } = {
      "Craigavon, Co. Armagh": "BT25, BT26, BT27, BT28, BT63 to BT67",
      "Bangor, Co. Down": "BT1 to BT30, BT36 to BT41",
      "Enniskillen, Co. Fermanagh": "BT74, BT75, BT92 to BT94",
      "Newry, Co. Down": "BT28 to BT35",
      "Omagh, Co. Tyrone": "BT78, BT79, BT80 to BT82",
      "Belfast": "BT1 to BT18, BT36 to BT39"
    };
    
    return deliveryAreas[location] || "Check with supplier";
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Updated just now";
    if (diffInMinutes < 60) return `Updated ${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `Updated ${Math.floor(diffInMinutes / 60)} hours ago`;
    return `Updated ${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-primary">
            <Fuel className="h-6 w-6 animate-bounce" />
            <span className="text-lg font-medium">Getting the latest prices for ye...</span>
          </div>
        </div>
        {/* Use proper loading skeletons */}
        <div className="hidden md:block">
          <PriceTableSkeleton rows={5} />
        </div>
        <div className="block md:hidden">
          <PriceCardSkeleton cards={5} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-centre py-8">
        <p className="text-red-600">Failed to load price data. Please try again.</p>
      </div>
    );
  }

  if (!prices?.length) {
    return (
      <div className="text-centre py-8">
        <p className="text-gray-600">No heating oil suppliers found for your area just yet. Give us a wee while to gather more prices!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
<<<<<<< HEAD
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
=======
      {/* Consumer Council Averages Top Bar */}
      <div className="flex flex-wrap justify-center gap-4 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">300L Avg</span>
          <span className="font-bold text-blue-700 text-lg">£{mockConsumerCouncilAverages[300].toFixed(2)}/L</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">500L Avg</span>
          <span className="font-bold text-blue-700 text-lg">£{mockConsumerCouncilAverages[500].toFixed(2)}/L</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">900L Avg</span>
          <span className="font-bold text-blue-700 text-lg">£{mockConsumerCouncilAverages[900].toFixed(2)}/L</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Best Price</span>
          <span className="font-bold text-green-700 text-lg">£{mockConsumerCouncilAverages.best.toFixed(2)}/L</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Suppliers</span>
          <span className="font-bold text-gray-700 text-lg">{mockConsumerCouncilAverages.suppliers}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Last Updated</span>
          <span className="text-gray-600 text-sm">{mockConsumerCouncilAverages.lastUpdated}</span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-grey-200">
>>>>>>> cursor/analyze-competitor-ux-for-improvements-6c0f
        {/* Header with count and info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-centre">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Showing 1 to {prices.length} of {prices.length}</span>
            {searchParams?.postcode && (
              <span className="ml-2">• Search results for {searchParams.postcode}</span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Fuel prices may vary by location
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden space-y-4">
          {prices.map((item: any) => {
            const price300 = calculateVolumePrice(item.price, item.volume, 300);
            const price500 = calculateVolumePrice(item.price, item.volume, 500);
            const price900 = calculateVolumePrice(item.price, item.volume, 900);
            
            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.supplier.name}</h3>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {getDeliveryArea(item.supplier.location)}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {renderStars(Number(item.supplier.rating) || 4)}
                    <span className="ml-1 text-sm text-gray-500">
                      {(Number(item.supplier.rating) || 4).toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 mb-1">300L</div>
                    <div className="font-medium text-gray-900 text-sm">{formatPrice(price300)}</div>
                    <div className="text-xs text-gray-500">{formatPricePerLitre(price300, 300)}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 mb-1">500L</div>
                    <div className="font-medium text-gray-900 text-sm">{formatPrice(price500)}</div>
                    <div className="text-xs text-gray-500">{formatPricePerLitre(price500, 500)}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 mb-1">900L</div>
                    <div className="font-medium text-gray-900 text-sm">{formatPrice(price900)}</div>
                    <div className="text-xs text-gray-500">{formatPricePerLitre(price900, 900)}</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {getTimeAgo(new Date(item.createdAt))}
                  </div>
                  <div className="flex gap-2">
                    <PriceLockFeature
                      supplierId={item.supplier.id}
                      price={formatPrice(price500).replace('£', '')}
                      volume={500}
                      postcode={searchParams?.postcode || ''}
                      supplierName={item.supplier.name}
                    />
                    <Button
                      size="sm"
                      className="bg-primary text-white hover:bg-blue-600 text-xs px-3 py-1"
                      onClick={() => handleQuoteRequest(item.supplier)}
                    >
                      Get Quote
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSaveQuote(item.supplier)}
                    >
                      Save Quote
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full">
<<<<<<< HEAD
            <thead className="bg-gray-50 border-b border-gray-200">
=======
            <thead className="bg-grey-50 border-b border-grey-200 sticky top-0 z-10">
>>>>>>> cursor/analyze-competitor-ux-for-improvements-6c0f
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('supplier')}
                >
                  <div className="flex items-centre">
                    Supplier
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivers to
                </th>
                <th 
                  className="px-6 py-3 text-centre text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('price300')}
                >
                  <div className="flex items-centre justify-centre">
                    300 Litres
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-centre text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('price500')}
                >
                  <div className="flex items-centre justify-centre">
                    500 Litres
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-centre text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('price900')}
                >
                  <div className="flex items-centre justify-centre">
                    900 Litres
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-centre text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prices.map((item: any, index: number) => {
                const price300 = calculateVolumePrice(item.price, item.volume, 300);
                const price500 = calculateVolumePrice(item.price, item.volume, 500);
                const price900 = calculateVolumePrice(item.price, item.volume, 900);
                // Zebra striping: even rows get bg-grey-50
                const rowClass = index % 2 === 0 ? "bg-grey-50" : "bg-white";
                return (
<<<<<<< HEAD
                  <tr key={item.id} className="hover:bg-gray-50">
=======
                  <tr key={item.id} className={`${rowClass} hover:bg-blue-50 transition-colors`}>
>>>>>>> cursor/analyze-competitor-ux-for-improvements-6c0f
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.supplier.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-centre mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {getTimeAgo(new Date(item.createdAt))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-600 flex items-centre">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        {getDeliveryArea(item.supplier.location)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-centre">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(price300)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatPricePerLitre(price300, 300)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-centre">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(price500)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatPricePerLitre(price500, 500)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-centre">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(price900)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatPricePerLitre(price900, 900)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-centre">
                        {renderStars(Number(item.supplier.rating) || 4)}
                        <span className="ml-1 text-xs text-gray-500">
                          {(Number(item.supplier.rating) || 4).toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-centre">
                      <div className="flex items-center gap-2">
                        <PriceLockFeature
                          supplierId={item.supplier.id}
                          price={formatPrice(price500).replace('£', '')}
                          volume={500}
                          postcode={searchParams?.postcode || ''}
                          supplierName={item.supplier.name}
                        />
                        <Button
                          size="sm"
                          className="bg-green-600 text-white hover:bg-green-700"
                          onClick={() => {
                            setSelectedSupplier({
                              name: item.supplier.name,
                              price: formatPrice(price500),
                              volume: 500,
                              location: item.supplier.location
                            });
                            setShowLeadModal(true);
                          }}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Get Quote
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSaveQuote(item.supplier)}
                        >
                          Save Quote
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            * Prices shown include VAT and standard delivery charges. Final prices may vary depending on exact delivery location and current availability.
          </p>
        </div>
      </div>

      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => {
          setShowLeadModal(false);
          setSelectedSupplier(null);
        }}
        supplier={selectedSupplier}
      />
    </div>
  );
}
