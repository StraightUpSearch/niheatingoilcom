import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Globe, Star, MessageSquare, ExternalLink, Lock, Eye, Users } from "lucide-react";

export default function SuppliersPage() {
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['/api/suppliers'],
  });

  // Show only first 3 suppliers as teaser
  const suppliersArray = Array.isArray(suppliers) ? suppliers : [];
  const teaserSuppliers = suppliersArray.slice(0, 3);
  const totalSuppliers = suppliersArray.length || 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Verified Heating Oil Suppliers Directory
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with {totalSuppliers}+ trusted heating oil suppliers across Northern Ireland. 
            See full contact details, ratings, and get instant quotes.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">{totalSuppliers}+</span>
              </div>
              <p className="text-gray-600">Verified Suppliers</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">4.7</span>
              </div>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">All 6</span>
              </div>
              <p className="text-gray-600">Counties Covered</p>
            </div>
          </div>
        </div>

        {/* Teaser Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
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
            teaserSuppliers.map((supplier: any) => (
              <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {supplier.name}
                      </CardTitle>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{supplier.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">
                        {supplier.rating || '4.5'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Limited Contact Information */}
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-400">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">Contact details available</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Globe className="h-4 w-4 mr-2" />
                        <span className="text-sm">Website link available</span>
                      </div>
                    </div>

                    {/* Service Areas - Limited */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Service Areas</h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {supplier.location}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-gray-400">
                          +{Math.floor(Math.random() * 5) + 2} more areas
                        </Badge>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Free Delivery</Badge>
                        <Badge variant="outline" className="text-xs">Licensed</Badge>
                        <Badge variant="outline" className="text-xs text-gray-400">+3 more</Badge>
                      </div>
                    </div>

                    {/* Locked Action Buttons */}
                    <div className="space-y-2">
                      <Button className="w-full" variant="outline" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        View Full Profile
                      </Button>
                      <Button className="w-full" variant="outline" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        Get Direct Quote
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Unlock Full Directory CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-center text-white mb-8">
          <Lock className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">
            Unlock {totalSuppliers > 3 ? totalSuppliers - 3 : 47}+ More Verified Suppliers
          </h2>
          <p className="text-blue-100 text-lg mb-6 max-w-3xl mx-auto">
            Get instant access to full contact details, customer reviews, service areas, and direct quote forms 
            for all verified heating oil suppliers across Northern Ireland.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
            <div className="flex items-center justify-center">
              <Eye className="h-4 w-4 mr-2" />
              <span>Full Contact Details</span>
            </div>
            <div className="flex items-center justify-center">
              <Star className="h-4 w-4 mr-2" />
              <span>Customer Reviews</span>
            </div>
            <div className="flex items-center justify-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>Direct Quote Forms</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8">
                Create Free Account
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Sign In
              </Button>
            </Link>
          </div>
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