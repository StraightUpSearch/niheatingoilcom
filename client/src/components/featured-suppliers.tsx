import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Star, Truck, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function FeaturedSuppliers() {
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ["/api/suppliers"],
    queryFn: async () => {
      const response = await fetch("/api/suppliers");
      if (!response.ok) throw new Error("Failed to fetch suppliers");
      const data = await response.json();
      return Array.isArray(data) ? data.slice(0, 3) : []; // Only show 3 featured suppliers
    },
  });

  const renderStars = (rating: string | null) => {
    if (!rating) return null;
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    
    return (
      <div className="flex items-center">
        <div className="flex text-yellow-400">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-current" />
          ))}
          {[...Array(5 - fullStars)].map((_, i) => (
            <Star key={i} className="h-3 w-3 text-brand-line" />
          ))}
        </div>
        <span className="ml-1 text-xs text-brand-muted">{numRating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <section className="py-12 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-brand-ink mb-2">Featured Suppliers</h2>
          <p className="text-brand-muted">
            Trusted heating oil suppliers across Northern Ireland
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <Card key={i} className="border border-brand-line">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                  <div className="mt-3 pt-3 border-t border-brand-line">
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            suppliers?.map((supplier: any) => (
              <Card key={supplier.id} className="border border-brand-line hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-ink text-sm">{supplier.name}</h3>
                      <p className="text-xs text-brand-muted">{supplier.location}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-brand-muted flex-shrink-0" />
                      <span className="text-brand-muted truncate">Northern Ireland</span>
                    </div>
                    
                    {supplier.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-brand-muted flex-shrink-0" />
                        <span className="text-brand-muted">{supplier.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      {renderStars(supplier.rating)}
                      <span className="text-xs text-[#0B6A30] font-medium">Active</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-brand-line">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-brand-muted">Updated recently</span>
                      {supplier.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs"
                          onClick={() => window.open(`tel:${supplier.phone}`, '_self')}
                        >
                          Call
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center">
          <Link href="/suppliers">
            <Button variant="outline" className="group">
              View All Suppliers
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}