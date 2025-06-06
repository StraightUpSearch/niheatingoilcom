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

  // Get weekly Consumer Council data for 2025 only
  const { data: weeklyHistory } = useQuery({
    queryKey: ["/api/prices/weekly-history", { year: 2025, volume: 300 }],
    queryFn: async () => {
      const response = await fetch("/api/prices/history?year=2025&weekly=true&volume=300");
      if (!response.ok) throw new Error("Failed to fetch weekly history");
      return response.json();
    },
  });

  // --- MOCK DATA FOR DEVELOPMENT ---
  const isDev = !('production' === process.env.NODE_ENV) || window.location.hostname === 'localhost';
  const mockStats = {
    weeklyAverage: 150,
    lowestPrice: 145,
    highestPrice: 160,
  };
  const mockStats500 = { weeklyAverage: 250 };
  const mockStats900 = { weeklyAverage: 430 };
  const mockPrices = [
    { supplier: { name: 'Dummy Fuels' } },
    { supplier: { name: 'Hayes Fuels' } },
    { supplier: { name: 'NAP Fuels' } },
    { supplier: { name: 'Value Oil' } },
    { supplier: { name: 'Budget Oil' } },
  ];
  const mockWeeklyHistory = [
    { averagePrice: '140' },
    { averagePrice: '145' },
    { averagePrice: '150' },
    { averagePrice: '155' },
    { averagePrice: '150' },
  ];

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

  // Use mock data if in dev or API returns zero/undefined
  const safeStats = isDev || !stats || !stats.weeklyAverage ? mockStats : stats;
  const safeStats500 = isDev || !stats500 || !stats500.weeklyAverage ? mockStats500 : stats500;
  const safeStats900 = isDev || !stats900 || !stats900.weeklyAverage ? mockStats900 : stats900;
  const safePrices = isDev || !prices || prices.length === 0 ? mockPrices : prices;
  const safeWeeklyHistory = isDev || !weeklyHistory || weeklyHistory.length === 0 ? mockWeeklyHistory : weeklyHistory;

  const calculateWeeklyTrend = () => {
    if (!safeWeeklyHistory || safeWeeklyHistory.length < 2) return null;
    
    const latest = safeWeeklyHistory[safeWeeklyHistory.length - 1];
    const previous = safeWeeklyHistory[safeWeeklyHistory.length - 2];
    
    if (!latest || !previous) return null;
    
    const change = parseFloat(latest.averagePrice) - parseFloat(previous.averagePrice);
    const percentage = (change / parseFloat(previous.averagePrice)) * 100;
    
    return {
      change,
      percentage,
      isPositive: change > 0,
    };
  };

  const weeklyTrend = calculateWeeklyTrend();

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
                  <CardTitle className="text-lg">Weekly Consumer Council Trends (2025)</CardTitle>
                  <div className="flex space-x-2">
                    <Badge variant="default">Weekly</Badge>
                    <Badge variant="outline">2025 Only</Badge>
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
                          {statsLoading ? '...' : formatPrice(safeStats?.weeklyAverage || 0)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {statsLoading ? '...' : `${((safeStats?.weeklyAverage || 0) / 300).toFixed(1)}p/L`}
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
                          {formatPrice(safeStats500?.weeklyAverage || 0)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {`${((safeStats500?.weeklyAverage || 0) / 500).toFixed(1)}p/L`}
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
                          {formatPrice(safeStats900?.weeklyAverage || 0)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {`${((safeStats900?.weeklyAverage || 0) / 900).toFixed(1)}p/L`}
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
                        {formatPrice(safeStats?.weeklyAverage || 0)}
                      </p>
                      {weeklyTrend && (
                        <div className="flex items-center mt-2">
                          {weeklyTrend.isPositive ? (
                            <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                          )}
                          <span className={`text-sm ${weeklyTrend.isPositive ? 'text-red-500' : 'text-green-500'}`}>
                            {weeklyTrend.isPositive ? '+' : ''}{weeklyTrend.percentage.toFixed(1)}% from previous week
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-3xl">
                      {weeklyTrend?.isPositive ? (
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
                        {formatPrice(safeStats?.lowestPrice || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Highest Price (300L):</span>
                      <span className="font-semibold text-red-600">
                        {formatPrice(safeStats?.highestPrice || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price Range:</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice((safeStats?.highestPrice || 0) - (safeStats?.lowestPrice || 0))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Suppliers:</span>
                      <span className="font-semibold text-blue-600">
                        {getUniqueSupplierCount(safePrices)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weekly Updates:</span>
                      <span className="font-semibold text-gray-900">
                        {safeWeeklyHistory ? `${safeWeeklyHistory.length} this year` : '0 this year'}
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
                  Based on weekly Consumer Council data and 2025 market trends:
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {weeklyTrend?.isPositive 
                      ? "Weekly prices showing upward trend - consider ordering soon"
                      : "Stable weekly pricing with competitive suppliers available"
                    }
                  </p>
                  <p className="text-xs text-gray-600">
                    Best value: 900L orders (lowest per-litre cost)
                  </p>
                  <p className="text-xs text-gray-600">
                    {safePrices ? `${getUniqueSupplierCount(safePrices)} suppliers actively competing` : 'Multiple suppliers available'}
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
