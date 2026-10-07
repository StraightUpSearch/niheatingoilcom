import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Globe, Star, ExternalLink, Users, ArrowRight } from "lucide-react";

const toSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function SuppliersPage() {
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['/api/suppliers'],
  });

  const suppliersArray = Array.isArray(suppliers) ? suppliers : [];

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-ink mb-4">
            Heating Oil Suppliers
          </h1>
          <p className="text-xl text-brand-muted max-w-3xl mx-auto">
            Browse verified heating oil suppliers delivering across Northern Ireland.
            Contact them directly for quotes.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-brand-forest mr-2" />
                <span className="text-2xl font-bold text-brand-ink">{suppliersArray.length}</span>
              </div>
              <p className="text-brand-muted">Suppliers Listed</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold text-brand-ink">Verified</span>
              </div>
              <p className="text-brand-muted">Local Businesses</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-[#0B6A30] mr-2" />
                <span className="text-2xl font-bold text-brand-ink">All 6</span>
              </div>
              <p className="text-brand-muted">Counties Covered</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            suppliersArray.map((supplier: any) => (
              <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold text-brand-ink">
                        {supplier.name}
                      </CardTitle>
                      <div className="flex items-center text-brand-muted mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{supplier.location}</span>
                      </div>
                    </div>
                    {supplier.rating && supplier.reviewCount > 0 && renderStars(supplier.rating)}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {supplier.phone && (
                      <div className="flex items-center text-brand-ink">
                        <Phone className="h-4 w-4 mr-2 text-brand-muted" />
                        <a href={`tel:${supplier.phone}`} className="text-sm hover:text-primary">
                          {supplier.phone}
                        </a>
                      </div>
                    )}

                    {supplier.website && (
                      <div className="flex items-center text-brand-ink">
                        <Globe className="h-4 w-4 mr-2 text-brand-muted" />
                        <a
                          href={supplier.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline truncate"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}

                    {supplier.serviceAreas && (
                      <div>
                        <h4 className="text-sm font-medium text-brand-ink mb-1">Service Areas</h4>
                        <p className="text-xs text-brand-muted">{supplier.serviceAreas}</p>
                      </div>
                    )}

                    {supplier.isVerified && (
                      <Badge variant="secondary" className="text-xs">Verified Supplier</Badge>
                    )}

                    <div className="flex gap-2 pt-2">
                      {supplier.phone && (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => window.open(`tel:${supplier.phone}`, '_self')}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      )}
                      {supplier.website && (
                        <Button size="sm" variant="outline" className="flex-1" asChild>
                          <a href={supplier.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Website
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="flex-1" asChild>
                        <Link href={`/suppliers/${toSlug(supplier.name)}`}>
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center">
          <Link href="/compare">
            <Button size="lg" className="bg-primary hover:bg-brand-forest-soft">
              Compare All Prices
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}