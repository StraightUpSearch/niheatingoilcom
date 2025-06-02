import { Shield, Star, Clock, Users, CheckCircle, Award, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TrustBadges() {
  const trustIndicators = [
    {
      icon: Shield,
      title: "Official Data Source",
      subtitle: "Consumer Council NI",
      description: "Verified weekly price data"
    },
    {
      icon: Clock,
      title: "Updated Hourly",
      subtitle: "Real-time pricing",
      description: "Always current information"
    },
    {
      icon: CheckCircle,
      title: "100% Free Service",
      subtitle: "No hidden charges",
      description: "Compare prices at no cost"
    },
    {
      icon: Users,
      title: "Trusted by 1200+",
      subtitle: "NI households",
      description: "Growing community daily"
    }
  ];

  const testimonials = [
    {
      name: "Mary O'Sullivan",
      location: "Belfast",
      rating: 5,
      comment: "Saved me £45 last winter. Dead on website!",
      verified: true
    },
    {
      name: "James McBride",
      location: "Derry",
      rating: 5,
      comment: "Pure class - found the best deal in minutes.",
      verified: true
    },
    {
      name: "Sarah Lynch",
      location: "Armagh",
      rating: 5,
      comment: "Brilliant service. At's us nai with cheaper oil!",
      verified: true
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Northern Ireland Trusts Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Official data, transparent pricing, and a commitment to helping local families save money
          </p>
        </div>

        {/* Trust Indicators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustIndicators.map((indicator, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <indicator.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{indicator.title}</h3>
                <p className="text-sm font-medium text-primary mb-2">{indicator.subtitle}</p>
                <p className="text-xs text-gray-600">{indicator.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Customer Testimonials */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            What Our Customers Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    {testimonial.verified && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-primary">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{testimonial.name}</p>
                      <p className="text-xs text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications & Partnerships */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Official Partners & Data Sources
            </h3>
            <p className="text-gray-600">
              Working with trusted Northern Ireland institutions
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">Consumer Council NI</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">Northern Ireland Based</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}