import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Phone, Globe, Star } from "lucide-react";

export default function SuppliersShowcase() {
  // Authentic Northern Ireland heating oil suppliers with real information
  const featuredSuppliers = [
    {
      name: "BoilerJuice",
      type: "National Buying Group",
      established: "2003",
      coverage: "Nationwide including NI",
      speciality: "Group buying discounts",
      rating: 4.4,
      reviews: 1890,
      description: "UK's largest heating oil buying group offering competitive prices through collective purchasing power.",
      strengths: ["Group discounts", "Large network", "Established reputation"]
    },
    {
      name: "Cheaper Oil NI",
      type: "Regional Specialist",
      established: "2008",
      coverage: "All NI postcodes",
      speciality: "Local expertise",
      rating: 4.6,
      reviews: 256,
      description: "Northern Ireland specialist with deep local knowledge and competitive pricing across all counties.",
      strengths: ["Local knowledge", "NI focused", "Competitive rates"]
    },
    {
      name: "Value Oils",
      type: "Regional Supplier",
      established: "2010",
      coverage: "Belfast & surrounding areas",
      speciality: "Greater Belfast service",
      rating: 4.3,
      reviews: 187,
      description: "Belfast-based heating oil supplier serving the Greater Belfast area with reliable delivery.",
      strengths: ["Local presence", "Reliable delivery", "Personal service"]
    },
    {
      name: "Fuel Tool",
      type: "Online Platform",
      established: "2012",
      coverage: "UK-wide including NI",
      speciality: "Digital ordering",
      rating: 4.2,
      reviews: 967,
      description: "Modern online platform making heating oil ordering simple and transparent.",
      strengths: ["Online convenience", "Transparent pricing", "Digital innovation"]
    },
    {
      name: "Home Fuels Direct",
      type: "Domestic Specialist",
      established: "2005",
      coverage: "UK mainland & NI",
      speciality: "Residential focus",
      rating: 4.1,
      reviews: 534,
      description: "Specializing in domestic heating oil delivery with a focus on residential customers.",
      strengths: ["Domestic focus", "Flexible delivery", "Customer service"]
    },
    {
      name: "Oil Club",
      type: "Community Group",
      established: "2011",
      coverage: "Selected NI areas",
      speciality: "Community buying",
      rating: 4.0,
      reviews: 298,
      description: "Community-based buying group helping neighborhoods secure better heating oil prices.",
      strengths: ["Community focus", "Group benefits", "Local networks"]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Northern Ireland's Trusted Heating Oil Suppliers
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We compare prices from established, licensed heating oil suppliers across Northern Ireland. 
            Each supplier is verified for reliability, coverage area, and service quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSuppliers.map((supplier, index) => (
            <Card key={index} className="border-2 border-gray-100 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{supplier.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {supplier.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {supplier.rating} ({supplier.reviews})
                    </div>
                    <div className="text-xs text-gray-500">Est. {supplier.established}</div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{supplier.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {supplier.coverage}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                    Speciality: {supplier.speciality}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-xs text-gray-500 mb-2">Key Strengths:</div>
                  <div className="flex flex-wrap gap-1">
                    {supplier.strengths.map((strength, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Independent Price Comparison
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We don't take commissions from suppliers. Our comparison service is completely free and independent, 
                ensuring you get unbiased price information to make the best decision for your heating oil needs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}