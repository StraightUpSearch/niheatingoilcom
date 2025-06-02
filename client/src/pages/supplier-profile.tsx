import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Phone, Globe, Clock, TrendingUp, Award, Shield } from "lucide-react";
import { Supplier, OilPrice } from "@shared/schema";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useState } from "react";
import { ClaimListingDialog } from "@/components/claim-listing-dialog";

interface SupplierWithPrices extends Supplier {
  prices: OilPrice[];
  averageRating?: number;
  totalReviews?: number;
  lastUpdated?: string;
}

export default function SupplierProfile() {
  const { supplierId } = useParams<{ supplierId: string }>();
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  
  const { data: supplier, isLoading, error } = useQuery<SupplierWithPrices>({
    queryKey: ["/api/suppliers", supplierId],
    enabled: !!supplierId,
  });

  usePageTitle(supplier ? `${supplier.name} - Oil Supplier | NI Heating Oil` : "Supplier Profile | NI Heating Oil");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading supplier information...</p>
        </div>
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Supplier Not Found</h1>
          <p className="text-gray-600 mb-4">The supplier you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const currentPrices = supplier.prices?.filter(price => {
    const priceDate = new Date(price.createdAt || new Date());
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return priceDate > weekAgo;
  }) || [];

  const volumes = [300, 500, 900];
  const pricesByVolume = volumes.reduce((acc, volume) => {
    const price = currentPrices.find(p => p.volume === volume);
    acc[volume] = price ? parseFloat(price.price).toFixed(2) : 'N/A';
    return acc;
  }, {} as Record<number, string>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold">{supplier.name}</h1>
                {supplier.verified && (
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{supplier.location}</span>
                </div>
                {supplier.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{supplier.phone}</span>
                  </div>
                )}
                {supplier.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <a href={supplier.website} target="_blank" rel="noopener noreferrer" 
                       className="hover:text-white underline">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              {supplier.averageRating && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(supplier.averageRating!) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm">
                    {supplier.averageRating.toFixed(1)} ({supplier.totalReviews} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setShowClaimDialog(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              >
                <Award className="h-4 w-4 mr-2" />
                Claim This Listing
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-800">
                Contact Supplier
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Current Prices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Current Heating Oil Prices
                </CardTitle>
                <CardDescription>
                  Latest prices from {supplier.name} • Updated {supplier.lastUpdated || 'recently'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {volumes.map((volume) => (
                    <div key={volume} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {pricesByVolume[volume] === 'N/A' ? 'N/A' : `£${pricesByVolume[volume]}`}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {volume}L delivery
                      </div>
                      {pricesByVolume[volume] !== 'N/A' && (
                        <div className="text-xs text-gray-500 mt-1">
                          {(parseFloat(pricesByVolume[volume]) / volume * 100).toFixed(1)}p per litre
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {currentPrices.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium mb-1">No Recent Prices Available</p>
                    <p className="text-sm">We haven't received updated pricing from this supplier recently.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Supplier Information */}
            <Card>
              <CardHeader>
                <CardTitle>About {supplier.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Service Areas</h4>
                    <p className="text-gray-600">{supplier.location} and surrounding areas</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Volumes</h4>
                    <div className="flex flex-wrap gap-1">
                      {volumes.map((volume) => (
                        <Badge key={volume} variant="secondary">
                          {volume}L
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Business Information</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {supplier.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{supplier.phone}</span>
                      </div>
                    )}
                    {supplier.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <a href={supplier.website} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline">
                          {supplier.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Serving {supplier.location}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call for Quote
                </Button>
                <Button className="w-full" variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
                <Button 
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                  onClick={() => setShowClaimDialog(true)}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Claim Listing
                </Button>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trust & Safety</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-gray-600">Consumer Council Listed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600">NI Heating Oil Network</span>
                </div>
                {supplier.verified && (
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">Verified Supplier</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Claim Listing Dialog */}
      <ClaimListingDialog 
        supplier={supplier}
        open={showClaimDialog}
        onOpenChange={setShowClaimDialog}
      />
    </div>
  );
}