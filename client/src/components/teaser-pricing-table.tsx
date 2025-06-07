import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingDown, MapPin, Phone, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface TeaserPricingTableProps {
  searchParams?: {
    postcode?: string;
    volume?: number;
  };
}

export default function TeaserPricingTable({ searchParams }: TeaserPricingTableProps) {
  const [selectedVolume, setSelectedVolume] = useState<number>(searchParams?.volume || 500);

  // Calculate prices for different volumes based on base price with 20% safety margin
  const calculateVolumePrice = (basePrice: number, baseVolume: number, targetVolume: number) => {
    const pricePerLitre = basePrice / baseVolume;
    const baseCalculatedPrice = pricePerLitre * targetVolume;
    // Add 20% safety margin to all supplier prices for profitability buffer
    return baseCalculatedPrice * 1.20;
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

  const { data: statsData } = useQuery({
    queryKey: [`/api/prices/stats/${selectedVolume}`],
  });

  // --- MOCK DATA FOR DEVELOPMENT ---
  const isDev = process.env.NODE_ENV !== 'production' || window.location.hostname === 'localhost';
  const mockStatsData = { weeklyAverage: 250, lowestPrice: 220, supplierCount: 3 };
  const mockSuppliers = [
    { id: 1, name: 'Hayes Fuels', location: 'Craigavon', displayPrice: 288, phone: '028 3834 2222' },
    { id: 2, name: 'NAP Fuels', location: 'Belfast', displayPrice: 300, phone: '028 9066 1234' },
    { id: 3, name: 'Finney Bros', location: 'Omagh', displayPrice: 312, phone: '028 8224 5678' },
  ];
  // ... existing code ...

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading current prices...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="py-16">
          <div className="text-center">
            <p className="text-red-600 mb-4">Unable to load pricing data</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const prices = pricesData || [];
  
  // Group prices by supplier and get best price for each
  const supplierPrices = new Map();
  
  prices.forEach((price: any) => {
    const supplierId = price.supplier?.id;
    if (!supplierId) return;
    
    const currentPrice = parseFloat(price.price);
    const priceVolume = price.volume;
    
    // Calculate display price for selected volume
    const displayPrice = calculateVolumePrice(currentPrice, priceVolume, selectedVolume);
    
    if (!supplierPrices.has(supplierId) || displayPrice < supplierPrices.get(supplierId).displayPrice) {
      supplierPrices.set(supplierId, {
        ...price.supplier,
        displayPrice,
        originalPrice: currentPrice,
        originalVolume: priceVolume,
        postcode: price.postcode
      });
    }
  });
  
  // Get top 6 suppliers with best prices for teaser display
  const teaserSuppliers = Array.from(supplierPrices.values())
    .sort((a: any, b: any) => a.displayPrice - b.displayPrice)
    .slice(0, 6);

  // Use mock data if in dev or API returns zero/undefined
  const safeStatsData = isDev || !statsData || !statsData.weeklyAverage ? mockStatsData : statsData;
  const safeTeaserSuppliers = isDev || !teaserSuppliers || teaserSuppliers.length === 0 ? mockSuppliers : teaserSuppliers;

  return (
    <div className="w-full space-y-6">
      {/* Volume Selector */}
      <div className="flex justify-center">
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          {[300, 500, 900].map((volume) => (
            <button
              key={volume}
              onClick={() => setSelectedVolume(volume)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedVolume === volume
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {volume}L
            </button>
          ))}
        </div>
      </div>

      {/* Market Stats */}
      {safeStatsData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                £{(parseFloat(safeStatsData.weeklyAverage || '0') / 100).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">Average Price</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                £{(parseFloat(safeStatsData.lowestPrice || '0') / 100).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">Best Price</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {safeStatsData.supplierCount || 0}
              </div>
              <p className="text-sm text-gray-600">Suppliers</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Teaser Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeTeaserSuppliers.length > 0 ? (
          safeTeaserSuppliers.map((supplier: any) => (
            <Card key={supplier.id} className="relative hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{supplier.location}</span>
                    </div>
                  </div>
                  {supplier.isVerified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      £{(supplier.displayPrice / 100).toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-600">for {selectedVolume}L delivery</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {supplier.phone && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{supplier.phone}</span>
                      </div>
                    )}
                    {supplier.serviceAreas && (
                      <p className="text-xs text-gray-500">
                        Serves: {supplier.serviceAreas}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      Get Quote
                    </Button>
                    {supplier.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={supplier.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 mb-4">No suppliers available for your area.</p>
            <Link href="/suppliers">
              <Button variant="outline">View All Suppliers</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Call to Action */}
      {safeTeaserSuppliers.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            See all {supplierPrices.size} suppliers and compare detailed pricing
          </p>
          <Link href="/compare">
            <Button size="lg" className="bg-primary hover:bg-blue-700">
              Compare All Prices
              <TrendingDown className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}