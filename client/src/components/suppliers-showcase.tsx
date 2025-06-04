import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Building2, MapPin, Phone, Globe, Star, Truck } from "lucide-react";
// Using placeholder images - assets removed for build compatibility
import { useQuery } from "@tanstack/react-query";

export default function SuppliersShowcase() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted Local Suppliers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We connect you with established Northern Ireland heating oil suppliers who deliver across all six counties
          </p>
        </div>

        {/* Visual showcase of delivery trucks */}
        <div className="mb-12">
          <div className="w-full h-64 md:h-80 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
            <div className="text-center text-blue-800 z-10">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold mb-2">Northern Ireland</h3>
              <p className="text-lg">Heating Oil Suppliers</p>
              <div className="flex justify-center mt-4 space-x-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">B</span>
                </div>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            Local suppliers serving communities across Northern Ireland
          </p>
        </div>

        {/* Individual supplier showcase */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent"></div>
              <div className="text-center text-orange-800 z-10">
                <Truck className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <h4 className="text-lg font-bold mb-1">Professional Delivery</h4>
                <p className="text-sm">Fast & Reliable Service</p>
                <div className="mt-3 flex justify-center">
                  <div className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full">
                    Next Day Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Professional Local Delivery
            </h3>
            <p className="text-gray-600 mb-4">
              Our partner suppliers provide reliable heating oil delivery services with professional drivers who know the local area and understand Northern Ireland's unique heating needs.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-700">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span>Licensed and insured suppliers</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>Coverage across all six counties</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>Local customer service teams</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Independent Price Comparison
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We don't take commissions from suppliers. Our comparison service is completely free and independent, 
            ensuring you get unbiased price information to make the best decision for your heating oil needs.
          </p>
        </div>
      </div>
    </section>
  );
}