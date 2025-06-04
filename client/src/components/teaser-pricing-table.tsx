import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpDown, 
  Star, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Lock,
  Eye,
  Users,
  Zap
} from "lucide-react";
import { useLocation } from "wouter";

interface TeaserPricingTableProps {
  searchParams?: {
    postcode?: string;
    volume?: number;
  };
}

export default function TeaserPricingTable({ searchParams }: TeaserPricingTableProps) {
  const [, setLocation] = useLocation();

  const { data: pricesData, isLoading } = useQuery({
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

  // Show only limited data - first 3 suppliers
  const limitedPrices = pricesData?.slice(0, 3) || [];
  const totalSuppliers = pricesData?.length || 0;
  const hiddenCount = Math.max(0, totalSuppliers - 3);

  const calculateVolumePrice = (basePrice: number, baseVolume: number, targetVolume: number) => {
    const pricePerLitre = basePrice / baseVolume;
    return pricePerLitre * targetVolume * 1.20; // 20% safety margin
  };

  const formatPrice = (price: number) => {
    return `£${price.toFixed(2)}`;
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-primary">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-lg font-medium">Loading price data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header showing limited view */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Preview: Showing 3 of {totalSuppliers} suppliers</span>
              {searchParams?.postcode && (
                <span className="ml-2">• {searchParams.postcode} area</span>
              )}
            </div>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              <Eye className="h-3 w-3 mr-1" />
              Limited View
            </Badge>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden space-y-4 p-4">
          {limitedPrices.map((item: any, index: number) => {
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
                      {item.supplier.location}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {renderStars(Number(item.supplier.rating) || 4)}
                    <span className="ml-1 text-sm text-gray-500">
                      {(Number(item.supplier.rating) || 4).toFixed(1)}
                    </span>
                  </div>
                </div>
                
                {/* Only show 500L price to create intrigue */}
                <div className="bg-gray-50 rounded p-3 mb-3">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">500L Price</div>
                    <div className="font-bold text-lg text-gray-900">{formatPrice(price500)}</div>
                    <div className="text-xs text-gray-500">50.2p per litre</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Updated recently
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs px-3 py-1"
                    disabled
                  >
                    <Lock className="h-3 w-3 mr-1" />
                    Quote
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Supplier
                    <ArrowUpDown className="ml-1 h-3 w-3 text-gray-300" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  500 Litres
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {limitedPrices.map((item: any, index: number) => {
                const price500 = calculateVolumePrice(item.price, item.volume, 500);
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{item.supplier.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {item.supplier.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="font-bold text-lg text-gray-900">{formatPrice(price500)}</div>
                      <div className="text-xs text-gray-500">50.2p per litre</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        {renderStars(Number(item.supplier.rating) || 4)}
                        <span className="ml-1 text-sm text-gray-500">
                          {(Number(item.supplier.rating) || 4).toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        className="text-xs"
                      >
                        <Lock className="h-3 w-3 mr-1" />
                        Get Quote
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paywall Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-200 p-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-3 shadow-sm">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {hiddenCount > 0 && `${hiddenCount} More Suppliers Available`}
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Create a free account to see all supplier prices, compare 300L and 900L options, 
              and get instant quotes from verified heating oil suppliers.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-700">All {totalSuppliers} suppliers</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-700">Instant quotes</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-700">Price alerts</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8"
                onClick={() => setLocation('/register')}
              >
                View All Prices - Create Free Account
              </Button>
              <div className="text-xs text-gray-500">
                Already have an account?{" "}
                <button 
                  onClick={() => setLocation('/login')}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Sign in here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}