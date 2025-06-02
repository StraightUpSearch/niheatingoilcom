import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Globe, Star, MessageSquare, ExternalLink } from "lucide-react";

export default function SuppliersPage() {
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['/api/suppliers'],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-centre mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Heating Oil Suppliers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover trusted heating oil suppliers across Northern Ireland. All suppliers are verified 
            and regularly monitored for competitive pricing and reliable service.
          </p>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            suppliers?.map((supplier: any) => (
              <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {supplier.name}
                      </CardTitle>
                      <div className="flex items-centre text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{supplier.location}</span>
                      </div>
                    </div>
                    <div className="flex items-centre">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">
                        {supplier.rating || '4.5'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Contact Information */}
                    <div className="space-y-2">
                      {supplier.phone && (
                        <div className="flex items-centre text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <span className="text-sm">{supplier.phone}</span>
                        </div>
                      )}
                      {supplier.website && (
                        <div className="flex items-centre text-gray-600">
                          <Globe className="h-4 w-4 mr-2" />
                          <a 
                            href={supplier.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Service Areas */}
                    {supplier.serviceAreas && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Service Areas</h4>
                        <div className="flex flex-wrap gap-1">
                          {supplier.serviceAreas.split(',').slice(0, 3).map((area: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {area.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Free Delivery</Badge>
                        <Badge variant="outline" className="text-xs">Same Day</Badge>
                        <Badge variant="outline" className="text-xs">VAT Included</Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Link href={`/suppliers/${supplier.id}`}>
                        <Button className="w-full" variant="default">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </Link>
                      <Button className="w-full" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Get Quote
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Why Choose Our Verified Suppliers?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-centre">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-centre justify-centre">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verified Quality</h3>
              <p className="text-gray-600 text-sm">
                All suppliers are vetted for reliability, competitive pricing, and excellent customer service.
              </p>
            </div>
            <div className="text-centre">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-centre justify-centre">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Local Coverage</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive coverage across Northern Ireland with local knowledge and fast delivery.
              </p>
            </div>
            <div className="text-centre">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-centre justify-centre">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Direct Contact</h3>
              <p className="text-gray-600 text-sm">
                Connect directly with suppliers for personalised quotes and delivery arrangements.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}