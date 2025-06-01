import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Star, Truck } from "lucide-react";

interface SupplierDirectoryProps {
  showHeader?: boolean;
}

export default function SupplierDirectory({ showHeader = true }: SupplierDirectoryProps) {
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ["/api/suppliers"],
    queryFn: async () => {
      const response = await fetch("/api/suppliers");
      if (!response.ok) throw new Error("Failed to fetch suppliers");
      return response.json();
    },
  });

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
        <span className="ml-2 text-sm text-gray-600">{numRating.toFixed(1)}/5</span>
      </div>
    );
  };

  const getCoverageAreas = (coverageAreas: string | null) => {
    if (!coverageAreas) return "Northern Ireland";
    try {
      const areas = JSON.parse(coverageAreas);
      return areas.slice(0, 3).join(", ");
    } catch {
      return "Northern Ireland";
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Verified Supplier Directory</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our comprehensive directory of heating oil suppliers across Northern Ireland.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            suppliers?.map((supplier: any) => (
              <Card key={supplier.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Truck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                      <p className="text-sm text-gray-500">{supplier.location}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 truncate">
                        {getCoverageAreas(supplier.coverageAreas)}
                      </span>
                    </div>
                    
                    {supplier.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">{supplier.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      {renderStars(supplier.rating)}
                      {supplier.reviewCount > 0 && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{supplier.reviewCount} reviews</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Updated {supplier.lastScraped ? 
                          new Date(supplier.lastScraped).toLocaleDateString() : 
                          'recently'
                        }
                      </span>
                      <div className="flex space-x-2">
                        {supplier.phone && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`tel:${supplier.phone}`, '_self')}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        )}
                        {supplier.website && (
                          <Button
                            size="sm"
                            onClick={() => window.open(supplier.website, '_blank')}
                          >
                            Visit
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {suppliers?.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Showing {suppliers.length} verified suppliers across Northern Ireland
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
