import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, TrendingUp, Activity, Lightbulb } from "lucide-react";

export default function PriceTrends() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/prices/stats/300"],
    queryFn: async () => {
      const response = await fetch("/api/prices/stats/300");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const { data: history } = useQuery({
    queryKey: ["/api/prices/history", { days: 30, volume: 300 }],
    queryFn: async () => {
      const response = await fetch("/api/prices/history?days=30&volume=300");
      if (!response.ok) throw new Error("Failed to fetch history");
      return response.json();
    },
  });

  const formatPrice = (price: number) => {
    return `£${price.toFixed(2)}`;
  };

  const calculateTrend = () => {
    if (!history || history.length < 2) return null;
    
    const latest = history[history.length - 1];
    const previous = history[history.length - 2];
    
    if (!latest || !previous) return null;
    
    const change = parseFloat(latest.averagePrice) - parseFloat(previous.averagePrice);
    const percentage = (change / parseFloat(previous.averagePrice)) * 100;
    
    return {
      change,
      percentage,
      isPositive: change > 0,
    };
  };

  const trend = calculateTrend();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Price Trends & Analytics</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track heating oil price movements over time and get insights into market trends.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Price Chart Placeholder */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Price History (Last 30 Days)</CardTitle>
                  <div className="flex space-x-2">
                    <Badge variant="default">30D</Badge>
                    <Badge variant="outline">90D</Badge>
                    <Badge variant="outline">1Y</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="font-medium">Interactive Price Chart</p>
                    <p className="text-sm">Showing 300L price trends for Northern Ireland</p>
                    {history && (
                      <p className="text-xs mt-2">
                        {history.length} data points over 30 days
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Stats */}
          <div className="space-y-6">
            {/* Weekly Average */}
            <Card>
              <CardContent className="p-6">
                {statsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Average This Week</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(stats?.weeklyAverage || 0)}
                      </p>
                      {trend && (
                        <div className="flex items-center mt-2">
                          {trend.isPositive ? (
                            <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                          )}
                          <span className={`text-sm ${trend.isPositive ? 'text-red-500' : 'text-green-500'}`}>
                            {trend.isPositive ? '+' : ''}{trend.percentage.toFixed(1)}% from last week
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-3xl">
                      {trend?.isPositive ? (
                        <TrendingUp className="h-8 w-8 text-red-500" />
                      ) : (
                        <TrendingDown className="h-8 w-8 text-green-500" />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {statsLoading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lowest Price:</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(stats?.lowestPrice || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Highest Price:</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(stats?.highestPrice || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price Range:</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice((stats?.highestPrice || 0) - (stats?.lowestPrice || 0))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Suppliers:</span>
                      <span className="font-semibold text-secondary">50+ active</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Price Prediction */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-gray-900">Market Insight</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Based on current market trends and seasonal patterns:
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {trend?.isPositive 
                    ? "Prices showing upward trend - consider ordering soon"
                    : "Prices dropping - good time to secure your next delivery"
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
