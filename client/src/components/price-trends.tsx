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

  const { data: stats500 } = useQuery({
    queryKey: ["/api/prices/stats/500"],
    queryFn: async () => {
      const response = await fetch("/api/prices/stats/500");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const { data: stats900 } = useQuery({
    queryKey: ["/api/prices/stats/900"],
    queryFn: async () => {
      const response = await fetch("/api/prices/stats/900");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const { data: prices } = useQuery({
    queryKey: ["/api/prices"],
    queryFn: async () => {
      const response = await fetch("/api/prices");
      if (!response.ok) throw new Error("Failed to fetch prices");
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

  const formatPrice = (price: number | string | null) => {
    if (price === null || price === undefined) return '£0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `£${numPrice.toFixed(2)}`;
  };

  const getUniqueSupplierCount = (priceData: any[] | undefined) => {
    if (!priceData) return 0;
    const supplierNames = priceData.map((p: any) => p.supplier.name);
    const uniqueNames = supplierNames.filter((name: string, index: number) => 
      supplierNames.indexOf(name) === index
    );
    return uniqueNames.length;
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
                <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
                  <div className="grid grid-cols-3 gap-4 h-full">
                    {/* 300L Column */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-2">300 Litres</div>
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {statsLoading ? '...' : formatPrice(stats?.weeklyAverage || 0)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {statsLoading ? '...' : `${((stats?.weeklyAverage || 0) / 300).toFixed(1)}p/L`}
                        </div>
                        <div className="mt-3 h-16 bg-blue-100 rounded flex items-end justify-center">
                          <div className="w-4 bg-blue-500 rounded-t" style={{height: '60%'}}></div>
                        </div>
                      </div>
                    </div>

                    {/* 500L Column */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-2">500 Litres</div>
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {formatPrice(stats500?.weeklyAverage || 0)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {`${((stats500?.weeklyAverage || 0) / 500).toFixed(1)}p/L`}
                        </div>
                        <div className="mt-3 h-16 bg-green-100 rounded flex items-end justify-center">
                          <div className="w-4 bg-green-500 rounded-t" style={{height: '80%'}}></div>
                        </div>
                      </div>
                    </div>

                    {/* 900L Column */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-2">900 Litres</div>
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {formatPrice(stats900?.weeklyAverage || 0)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {`${((stats900?.weeklyAverage || 0) / 900).toFixed(1)}p/L`}
                        </div>
                        <div className="mt-3 h-16 bg-purple-100 rounded flex items-end justify-center">
                          <div className="w-4 bg-purple-500 rounded-t" style={{height: '100%'}}></div>
                        </div>
                      </div>
                    </div>
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
                      <span className="text-gray-600">Lowest Price (300L):</span>
                      <span className="font-semibold text-green-600">
                        {formatPrice(stats?.lowestPrice || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Highest Price (300L):</span>
                      <span className="font-semibold text-red-600">
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
                      <span className="text-gray-600">Active Suppliers:</span>
                      <span className="font-semibold text-blue-600">
                        {getUniqueSupplierCount(prices)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price Updates:</span>
                      <span className="font-semibold text-gray-900">
                        {prices ? `${prices.length} today` : '0 today'}
                      </span>
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
                  Based on current Northern Ireland market data and supplier analysis:
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {trend?.isPositive 
                      ? "Prices showing upward trend - consider ordering soon"
                      : "Stable pricing with competitive suppliers available"
                    }
                  </p>
                  <p className="text-xs text-gray-600">
                    Best value: 900L orders (lowest per-litre cost)
                  </p>
                  <p className="text-xs text-gray-600">
                    {prices ? `${getUniqueSupplierCount(prices)} suppliers actively competing` : 'Multiple suppliers available'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
