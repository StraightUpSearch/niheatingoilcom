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

  const calculateWeeklyTrend = () => {
    if (!weeklyHistory || weeklyHistory.length < 2) return null;
    
    const latest = weeklyHistory[weeklyHistory.length - 1];
    const previous = weeklyHistory[weeklyHistory.length - 2];
    
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
          <h2 className="text-3xl font-bold text-brand-ink mb-4">Price Trends & Analytics</h2>
          <p className="text-brand-muted max-w-2xl mx-auto">
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
                <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-brand-line p-6">
                  <div className="grid grid-cols-3 gap-4 h-full">
                    {/* 300L Column */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-center">
                        <div className="text-xs text-brand-muted mb-2">300 Litres</div>
                        <div className="text-2xl font-bold text-brand-forest mb-1">
                          {statsLoading ? '...' : formatPrice(stats?.weeklyAverage || 0)}
                        </div>
                        <div className="text-xs text-brand-muted">
                          {statsLoading ? '...' : `${((stats?.weeklyAverage || 0) / 300).toFixed(1)}p/L`}
                        </div>
                        <div className="mt-3 h-16 bg-brand-mint rounded flex items-end justify-center">
                          <div className="w-4 bg-brand-forest-soft rounded-t" style={{height: '60%'}}></div>
                        </div>
                      </div>
                    </div>

                    {/* 500L Column */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-center">
                        <div className="text-xs text-brand-muted mb-2">500 Litres</div>
                        <div className="text-2xl font-bold text-[#0B6A30] mb-1">
                          {formatPrice(stats500?.weeklyAverage || 0)}
                        </div>
                        <div className="text-xs text-brand-muted">
                          {`${((stats500?.weeklyAverage || 0) / 500).toFixed(1)}p/L`}
                        </div>
                        <div className="mt-3 h-16 bg-brand-mint rounded flex items-end justify-center">
                          <div className="w-4 bg-brand-forest rounded-t" style={{height: '80%'}}></div>
                        </div>
                      </div>
                    </div>

                    {/* 900L Column */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-center">
                        <div className="text-xs text-brand-muted mb-2">900 Litres</div>
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {formatPrice(stats900?.weeklyAverage || 0)}
                        </div>
                        <div className="text-xs text-brand-muted">
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
                      <p className="text-sm text-brand-muted mb-1">Average This Week</p>
                      <p className="text-2xl font-bold text-brand-ink">
                        {formatPrice(stats?.weeklyAverage || 0)}
                      </p>
                      {weeklyTrend && (
                        <div className="flex items-center mt-2">
                          {weeklyTrend.isPositive ? (
                            <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-[#0B6A30] mr-1" />
                          )}
                          <span className={`text-sm ${weeklyTrend.isPositive ? 'text-red-500' : 'text-[#0B6A30]'}`}>
                            {weeklyTrend.isPositive ? '+' : ''}{weeklyTrend.percentage.toFixed(1)}% from previous week
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-3xl">
                      {weeklyTrend?.isPositive ? (
                        <TrendingUp className="h-8 w-8 text-red-500" />
                      ) : (
                        <TrendingDown className="h-8 w-8 text-[#0B6A30]" />
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
                      <span className="text-brand-muted">Lowest Price (300L):</span>
                      <span className="font-semibold text-[#0B6A30]">
                        {formatPrice(stats?.lowestPrice || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Highest Price (300L):</span>
                      <span className="font-semibold text-red-600">
                        {formatPrice(stats?.highestPrice || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Price Range:</span>
                      <span className="font-semibold text-brand-ink">
                        {formatPrice((stats?.highestPrice || 0) - (stats?.lowestPrice || 0))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Active Suppliers:</span>
                      <span className="font-semibold text-brand-forest">
                        {getUniqueSupplierCount(prices)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Weekly Updates:</span>
                      <span className="font-semibold text-brand-ink">
                        {weeklyHistory ? `${weeklyHistory.length} this year` : '0 this year'}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Price Prediction */}
            <Card className="bg-brand-mint border-brand-line">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-brand-ink">Market Insight</h4>
                </div>
                <p className="text-sm text-brand-muted mb-3">
                  Based on weekly Consumer Council data and 2025 market trends:
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-brand-ink">
                    {weeklyTrend?.isPositive 
                      ? "Weekly prices showing upward trend - consider ordering soon"
                      : "Stable weekly pricing with competitive suppliers available"
                    }
                  </p>
                  <p className="text-xs text-brand-muted">
                    Best value: 900L orders (lowest per-litre cost)
                  </p>
                  <p className="text-xs text-brand-muted">
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
