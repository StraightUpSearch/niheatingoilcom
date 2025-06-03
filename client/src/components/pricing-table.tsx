import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpDown, Star, MessageSquare, MapPin, Clock } from "lucide-react";
import LeadCaptureModal from "./lead-capture-modal";
import QuoteShareButton from "./whatsapp-share-button";

interface PricingTableProps {
  searchParams?: {
    postcode?: string;
    volume?: number;
  };
}

type SortField = 'price' | 'supplier' | 'rating';

export default function PricingTable({ searchParams }: PricingTableProps) {
  const [selectedVolume, setSelectedVolume] = useState(searchParams?.volume || 300);
  const [sortField, setSortField] = useState<SortField>('price');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);

  const { data: prices, isLoading, error } = useQuery({
    queryKey: ["/api/prices", { volume: selectedVolume, postcode: searchParams?.postcode }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('volume', selectedVolume.toString());
      if (searchParams?.postcode) {
        params.set('postcode', searchParams.postcode);
      }
      params.set('sort', sortField);
      
      const response = await fetch(`/api/prices?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }
      return response.json();
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatPrice = (price: string) => {
    // Apply 20% safety margin to all supplier prices for profitability buffer
    const basePrice = parseFloat(price);
    const priceWithMargin = basePrice * 1.20;
    return `£${priceWithMargin.toFixed(2)}`;
  };

  const formatPricePerLitre = (price: string) => {
    // Apply 20% safety margin to price per litre calculation
    const basePricePerLitre = parseFloat(price);
    const pricePerLitreWithMargin = basePricePerLitre * 1.20;
    return `${pricePerLitreWithMargin.toFixed(1)}p`;
  };

  const calculateSavings = (currentPrice: number, allPrices: any[]) => {
    if (!allPrices || allPrices.length === 0) return 0;
    const maxPrice = Math.max(...allPrices.map(p => parseFloat(p.price)));
    return maxPrice - currentPrice;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  const renderStars = (rating: string | null) => {
    if (!rating) return null;
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        <div className="flex text-yellow-400">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
          {hasHalfStar && <Star className="h-4 w-4 fill-current opacity-50" />}
          {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-gray-300" />
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-600">{numRating.toFixed(1)}</span>
      </div>
    );
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600">Failed to load prices. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {/* Volume Filter */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          {[300, 500, 900].map((volume) => (
            <Button
              key={volume}
              variant={selectedVolume === volume ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedVolume(volume)}
              className={selectedVolume === volume ? "bg-primary text-white" : ""}
            >
              {volume}L
            </Button>
          ))}
        </div>
      </div>

      {/* Pricing Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('supplier')}
                    className="flex items-center space-x-1 hover:text-gray-700 p-0 h-auto"
                  >
                    <span>Supplier</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coverage Area
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('price')}
                    className="flex items-center space-x-1 hover:text-gray-700 p-0 h-auto"
                  >
                    <span>Price ({selectedVolume}L)</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price per Litre
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('rating')}
                    className="flex items-center space-x-1 hover:text-gray-700 p-0 h-auto"
                  >
                    <span>Rating</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </td>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : prices?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No prices found for the selected criteria.
                  </td>
                </tr>
              ) : (
                prices?.map((item: any) => (
                  <tr key={`${item.supplierId}-${item.volume}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {item.supplier.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.supplier.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.supplier.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        {item.supplier.coverageAreas ? 
                          JSON.parse(item.supplier.coverageAreas).slice(0, 3).join(", ") :
                          "Northern Ireland"
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatPrice(item.price)}
                      </div>
                      {item.includesVat && (
                        <Badge variant="secondary" className="text-xs">
                          Inc. VAT
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPricePerLitre(item.pricePerLitre)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {getTimeAgo(item.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStars(item.supplier.rating)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col space-y-2 min-w-[140px]">
                        <Button
                          size="sm"
                          className="bg-green-600 text-white hover:bg-green-700 w-full"
                          onClick={() => {
                            setSelectedSupplier({
                              name: item.supplier.name,
                              price: formatPrice(item.price),
                              volume: selectedVolume,
                              location: item.supplier.location
                            });
                            setShowLeadModal(true);
                          }}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Get Quote
                        </Button>
                        <div className="w-full">
                          <QuoteShareButton
                            postcode={searchParams?.postcode || "Northern Ireland"}
                            supplier={item.supplier.name}
                            pricePerLitre={parseFloat(item.pricePerLitre)}
                            totalCost={parseFloat(item.price)}
                            saving={calculateSavings(parseFloat(item.price), prices || [])}
                            volume={selectedVolume}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {prices?.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {prices.length} suppliers for {selectedVolume}L
                {searchParams?.postcode && ` in ${searchParams.postcode} area`}
              </p>
              <p className="text-xs text-gray-400">
                Prices include VAT and standard delivery charges
              </p>
            </div>
          </div>
        )}
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
