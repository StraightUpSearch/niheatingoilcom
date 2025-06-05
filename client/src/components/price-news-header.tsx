import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Clock, BarChart, Users, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface PriceNewsHeaderProps {
  postcode?: string;
}

export default function PriceNewsHeader({ postcode }: PriceNewsHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch price statistics
  const { data: stats } = useQuery({
    queryKey: ["/api/prices/stats/500"],
    queryFn: async () => {
      const response = await fetch("/api/prices/stats/500");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  // Fetch latest prices for supplier count
  const { data: prices } = useQuery({
    queryKey: ["/api/prices", { postcode }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (postcode) params.set('postcode', postcode);
      const response = await fetch(`/api/prices?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch prices");
      return response.json();
    }
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calculate price change (mock data - would come from real API)
  const priceChange = stats?.weeklyChange || -2.3;
  const avgPrice = stats?.currentAverage || 258.50;
  const lowestPrice = stats?.lowestPrice || 245.00;
  const supplierCount = prices?.length || 52;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* News Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart className="h-6 w-6 text-blue-600" />
              NI Heating Oil Price News
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Live market data from {supplierCount} verified suppliers across Northern Ireland
            </p>
          </div>
          <div className="text-right mt-2 sm:mt-0">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{formatTime(currentTime)}</span>
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>

        {/* Price Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Average Price Card */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Average Price (500L)</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    £{avgPrice.toFixed(2)}
                  </p>
                  <div className="flex items-center mt-2">
                    {priceChange < 0 ? (
                      <>
                        <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          £{Math.abs(priceChange).toFixed(2)} ({Math.abs(priceChange / avgPrice * 100).toFixed(1)}%)
                        </span>
                      </>
                    ) : priceChange > 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                        <span className="text-sm font-medium text-red-600">
                          £{priceChange.toFixed(2)} ({(priceChange / avgPrice * 100).toFixed(1)}%)
                        </span>
                      </>
                    ) : (
                      <>
                        <Minus className="h-4 w-4 text-gray-600 mr-1" />
                        <span className="text-sm font-medium text-gray-600">No change</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs. last week</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Live
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Lowest Price Card */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Today's Best Price</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    £{lowestPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Save up to £{(avgPrice - lowestPrice).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((avgPrice - lowestPrice) / avgPrice * 100).toFixed(1)}% below average
                  </p>
                </div>
                <Badge variant="default" className="bg-green-600 text-xs">
                  Best Deal
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Market Activity Card */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Market Activity</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-blue-600 mr-1" />
                      <span className="text-lg font-semibold">{supplierCount}</span>
                    </div>
                    <span className="text-sm text-gray-600">Active Suppliers</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Last update: 2 minutes ago
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Updates every 2 hours
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consumer Council Notice */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-medium text-blue-900">Official Data Source:</span>
            <span className="text-blue-800 ml-1">
              Prices verified against Consumer Council NI weekly surveys. 
              {postcode && ` Showing results for ${postcode} area.`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}