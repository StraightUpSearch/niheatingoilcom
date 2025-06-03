import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Fuel, BarChart3 } from "lucide-react";

export default function MobilePriceTrends() {
  const { data: stats300, isLoading: loading300 } = useQuery({
    queryKey: ["/api/prices/stats/300"],
    queryFn: async () => {
      const response = await fetch("/api/prices/stats/300");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const { data: stats500, isLoading: loading500 } = useQuery({
    queryKey: ["/api/prices/stats/500"],
    queryFn: async () => {
      const response = await fetch("/api/prices/stats/500");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const { data: stats900, isLoading: loading900 } = useQuery({
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

  const formatPrice = (price: number | string | null) => {
    if (price === null || price === undefined) return '£0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `£${numPrice.toFixed(2)}`;
  };

  const formatPricePerLitre = (totalPrice: number | string | null, volume: number) => {
    if (totalPrice === null || totalPrice === undefined) return '0.0p/L';
    const numPrice = typeof totalPrice === 'string' ? parseFloat(totalPrice) : totalPrice;
    const pricePerLitre = (numPrice / volume) * 100; // Convert to pence per litre
    return `${pricePerLitre.toFixed(1)}p/L`;
  };

  const getUniqueSupplierCount = (priceData: any[] | undefined) => {
    if (!priceData) return 0;
    const supplierNames = priceData.map((p: any) => p.supplier.name);
    const uniqueNames = supplierNames.filter((name: string, index: number) => 
      supplierNames.indexOf(name) === index
    );
    return uniqueNames.length;
  };

  // Calculate trend based on current vs lowest price
  const calculateSimpleTrend = (current: number, lowest: number) => {
    if (!current || !lowest) return null;
    const difference = current - lowest;
    const percentageFromLowest = (difference / lowest) * 100;
    return {
      isGood: percentageFromLowest < 10, // Within 10% of lowest is "good"
      percentage: percentageFromLowest,
    };
  };

  return (
    <div className="block lg:hidden px-4 py-6 bg-gray-50">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Price Check</h3>
        <p className="text-sm text-gray-600">Current heating oil prices in Northern Ireland</p>
      </div>

      {/* Price Mini-Cards Grid */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        {/* 300L Card */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Fuel className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">300 LITRES</div>
                  <div className="text-lg font-bold text-gray-900">
                    {loading300 ? '...' : formatPrice(stats300?.weeklyAverage || 0)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">per litre</div>
                <div className="text-sm font-semibold text-blue-600">
                  {loading300 ? '...' : formatPricePerLitre(stats300?.weeklyAverage || 0, 300)}
                </div>
                {stats300 && calculateSimpleTrend(stats300.weeklyAverage, stats300.lowestPrice) && (
                  <div className="flex items-center justify-end mt-1">
                    {calculateSimpleTrend(stats300.weeklyAverage, stats300.lowestPrice)?.isGood ? (
                      <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingUp className="h-3 w-3 text-orange-500 mr-1" />
                    )}
                    <span className="text-xs text-gray-500">
                      {calculateSimpleTrend(stats300.weeklyAverage, stats300.lowestPrice)?.isGood ? 'Good' : 'High'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 500L Card */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Fuel className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">500 LITRES</div>
                  <div className="text-lg font-bold text-gray-900">
                    {loading500 ? '...' : formatPrice(stats500?.weeklyAverage || 0)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">per litre</div>
                <div className="text-sm font-semibold text-green-600">
                  {loading500 ? '...' : formatPricePerLitre(stats500?.weeklyAverage || 0, 500)}
                </div>
                {stats500 && calculateSimpleTrend(stats500.weeklyAverage, stats500.lowestPrice) && (
                  <div className="flex items-center justify-end mt-1">
                    {calculateSimpleTrend(stats500.weeklyAverage, stats500.lowestPrice)?.isGood ? (
                      <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingUp className="h-3 w-3 text-orange-500 mr-1" />
                    )}
                    <span className="text-xs text-gray-500">
                      {calculateSimpleTrend(stats500.weeklyAverage, stats500.lowestPrice)?.isGood ? 'Good' : 'High'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 900L Card */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Fuel className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">900 LITRES</div>
                  <div className="text-lg font-bold text-gray-900">
                    {loading900 ? '...' : formatPrice(stats900?.weeklyAverage || 0)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">per litre</div>
                <div className="text-sm font-semibold text-purple-600">
                  {loading900 ? '...' : formatPricePerLitre(stats900?.weeklyAverage || 0, 900)}
                </div>
                {stats900 && calculateSimpleTrend(stats900.weeklyAverage, stats900.lowestPrice) && (
                  <div className="flex items-center justify-end mt-1">
                    {calculateSimpleTrend(stats900.weeklyAverage, stats900.lowestPrice)?.isGood ? (
                      <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingUp className="h-3 w-3 text-orange-500 mr-1" />
                    )}
                    <span className="text-xs text-gray-500">
                      {calculateSimpleTrend(stats900.weeklyAverage, stats900.lowestPrice)?.isGood ? 'Good' : 'High'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 text-sm">Market Summary</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-500 mb-1">Active Suppliers</div>
              <div className="font-semibold text-gray-900">
                {getUniqueSupplierCount(prices)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Best Value</div>
              <div className="font-semibold text-purple-600">900L orders</div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="text-xs text-gray-600">
              <span className="font-medium">Tip:</span> Larger orders typically offer better per-litre pricing. 
              Compare suppliers to save on your next delivery.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}