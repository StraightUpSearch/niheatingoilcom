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
          <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Northern Ireland Heating Oil Suppliers</p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            Local suppliers serving communities across Northern Ireland
          </p>
        </div>

        {/* Individual supplier showcase */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <div className="w-full h-48 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Truck className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Delivery Truck</p>
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