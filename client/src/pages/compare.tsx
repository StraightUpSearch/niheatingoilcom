import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import EnhancedPricingTable from "../components/enhanced-pricing-table";
import GamifiedSearch from "../components/gamified-search";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TrendingUp, MapPin, Clock } from "lucide-react";

export default function ComparePage() {
  const [searchParams, setSearchParams] = useState<{
    postcode?: string;
    volume?: number;
  }>({});

  const { data: stats } = useQuery({
    queryKey: ['/api/prices/stats', searchParams.volume || 300],
  });

  const handleSearch = (params: { postcode?: string; volume?: number }) => {
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compare Heating Oil Prices
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the best heating oil deals across Northern Ireland. Compare prices from verified suppliers 
            and save on your next order.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <GamifiedSearch onSearch={handleSearch} />
        </div>

        {/* Market Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-centre space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                <TrendingUp className="h-4 w-4 ml-auto text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  £{(parseFloat(stats.weeklyAverage) / 100).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">per litre</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-centre space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lowest Today</CardTitle>
                <MapPin className="h-4 w-4 ml-auto text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  £{(parseFloat(stats.lowestPrice) / 100).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">per litre</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-centre space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market High</CardTitle>
                <Clock className="h-4 w-4 ml-auto text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  £{(parseFloat(stats.highestPrice) / 100).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">per litre</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pricing Table */}
        <div className="mb-8">
          <EnhancedPricingTable searchParams={searchParams} />
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            About Our Price Comparison Service
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Real-Time Data</h3>
              <p className="text-gray-600">
                Our pricing data is updated regularly from verified Northern Ireland heating oil suppliers. 
                All prices include VAT and standard delivery charges.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Local Expertise</h3>
              <p className="text-gray-600">
                Built by locals for locals, we understand the Northern Ireland heating oil market 
                and help you find the best deals in your area.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}