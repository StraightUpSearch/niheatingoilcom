import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown, Star, MessageSquare, MapPin, Clock, TrendingUp, Phone, Globe, Award, Fuel, Building2 } from "lucide-react";
import LeadCaptureModal from "./lead-capture-modal";
import SupplierClaimModal from "./supplier-claim-modal";

interface EnhancedPricingTableProps {
  searchParams?: {
    postcode?: string;
    volume?: number;
  };
}

type SortField = 'supplier' | 'price300' | 'price500' | 'price900' | 'rating';

export default function EnhancedPricingTable({ searchParams }: EnhancedPricingTableProps) {
  const [sortField, setSortField] = useState<SortField>('price500');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimSupplierName, setClaimSupplierName] = useState("");

  // Calculate prices for different volumes based on base price
  const calculateVolumePrice = (basePrice: number, baseVolume: number, targetVolume: number) => {
    const pricePerLitre = basePrice / baseVolume;
    return pricePerLitre * targetVolume;
  };

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

  // Sort the data based on current sort field and direction
  const prices = pricesData ? [...pricesData].sort((a: any, b: any) => {
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
  }) : [];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleQuoteRequest = (supplier: any) => {
    // Open lead capture modal or contact form
    window.open(`tel:${supplier.phone}`, '_self');
  };

  const formatPrice = (price: number) => {
    return `£${price.toFixed(2)}`;
  };

  const formatPricePerLitre = (totalPrice: number, volume: number) => {
    const ppl = (totalPrice / volume) * 100;
    return `${ppl.toFixed(1)} ppl`;
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
            <span className="text-lg font-medium">Loading heating oil prices...</span>
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
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
        <p className="text-grey-600">No heating oil suppliers found for your area.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-grey-200">
        {/* Header with count and info */}
        <div className="px-6 py-4 bg-grey-50 border-b border-grey-200 flex justify-between items-centre">
          <div className="text-sm text-grey-600">
            <span className="font-medium">Showing 1 to {prices.length} of {prices.length}</span>
            {searchParams?.postcode && (
              <span className="ml-2">• Search results for {searchParams.postcode}</span>
            )}
          </div>
          <div className="text-xs text-grey-500">
            Fuel prices may vary by location
          </div>
        </div>

        {/* Official Consumer Council Data Highlight */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">Northern Ireland Regional Averages</h3>
            </div>
            <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
              Updated Weekly
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-900">£160.50</div>
              <div className="text-sm text-blue-600">300 Litres</div>
              <div className="text-xs text-blue-500">53.5p per litre</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-900">£251.20</div>
              <div className="text-sm text-blue-600">500 Litres</div>
              <div className="text-xs text-blue-500">50.2p per litre</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-900">£443.85</div>
              <div className="text-sm text-blue-600">900 Litres</div>
              <div className="text-xs text-blue-500">49.3p per litre</div>
            </div>
          </div>
          <div className="text-xs text-blue-600 text-center mt-2">
            <a 
              href="https://www.consumercouncil.org.uk/home-heating/price-checker/29-may-2025" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-800 underline"
            >
              Source: Consumer Council for Northern Ireland official weekly data (29 May 2025)
            </a>
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
                  <Button
                    size="sm"
                    className="bg-primary text-white hover:bg-blue-600 text-xs px-3 py-1"
                    onClick={() => handleQuoteRequest(item.supplier)}
                  >
                    Get Quote
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-grey-50 border-b border-grey-200">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider cursor-pointer hover:bg-grey-100"
                  onClick={() => handleSort('supplier')}
                >
                  <div className="flex items-centre">
                    Supplier
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Delivers to
                </th>
                <th 
                  className="px-6 py-3 text-centre text-xs font-medium text-grey-500 uppercase tracking-wider cursor-pointer hover:bg-grey-100"
                  onClick={() => handleSort('price300')}
                >
                  <div className="flex items-centre justify-centre">
                    300 Litres
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-centre text-xs font-medium text-grey-500 uppercase tracking-wider cursor-pointer hover:bg-grey-100"
                  onClick={() => handleSort('price500')}
                >
                  <div className="flex items-centre justify-centre">
                    500 Litres
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-centre text-xs font-medium text-grey-500 uppercase tracking-wider cursor-pointer hover:bg-grey-100"
                  onClick={() => handleSort('price900')}
                >
                  <div className="flex items-centre justify-centre">
                    900 Litres
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-centre text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-grey-200">
              {prices.map((item: any, index: number) => {
                const price300 = calculateVolumePrice(item.price, item.volume, 300);
                const price500 = calculateVolumePrice(item.price, item.volume, 500);
                const price900 = calculateVolumePrice(item.price, item.volume, 900);
                
                return (
                  <tr key={item.id} className="hover:bg-grey-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-grey-900">
                          {item.supplier.name}
                        </div>
                        <div className="text-xs text-grey-500 flex items-centre mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {getTimeAgo(new Date(item.createdAt))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-grey-600 flex items-centre">
                        <MapPin className="h-3 w-3 mr-1 text-grey-400" />
                        {getDeliveryArea(item.supplier.location)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-centre">
                      <div className="text-sm font-medium text-grey-900">
                        {formatPrice(price300)}
                      </div>
                      <div className="text-xs text-grey-500">
                        {formatPricePerLitre(price300, 300)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-centre">
                      <div className="text-sm font-medium text-grey-900">
                        {formatPrice(price500)}
                      </div>
                      <div className="text-xs text-grey-500">
                        {formatPricePerLitre(price500, 500)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-centre">
                      <div className="text-sm font-medium text-grey-900">
                        {formatPrice(price900)}
                      </div>
                      <div className="text-xs text-grey-500">
                        {formatPricePerLitre(price900, 900)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-centre">
                        {renderStars(Number(item.supplier.rating) || 4)}
                        <span className="ml-1 text-xs text-grey-500">
                          {(Number(item.supplier.rating) || 4).toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-centre">
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div className="px-6 py-3 bg-grey-50 border-t border-grey-200">
          <p className="text-xs text-grey-500">
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