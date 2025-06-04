import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, TrendingUp, Activity } from "lucide-react";

export default function MobilePriceTrends() {
  const { data: stats300, isLoading: loading300 } = useQuery({
    queryKey: ["/api/prices/stats/300"],
  });

  const { data: stats500, isLoading: loading500 } = useQuery({
    queryKey: ["/api/prices/stats/500"],
  });

  const { data: stats900, isLoading: loading900 } = useQuery({
    queryKey: ["/api/prices/stats/900"],
  });

  const formatPrice = (price: number | string | null) => {
    if (price === null || price === undefined) return '£0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `£${(numPrice / 100).toFixed(2)}`;
  };

  const volumes = [
    { 
      size: 300, 
      data: stats300, 
      isLoading: loading300,
      color: 'blue'
    },
    { 
      size: 500, 
      data: stats500, 
      isLoading: loading500,
      color: 'green'
    },
    { 
      size: 900, 
      data: stats900, 
      isLoading: loading900,
      color: 'purple'
    }
  ];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Market Prices</h2>
          <p className="text-gray-600 text-sm">
            Real-time pricing across Northern Ireland suppliers
          </p>
        </div>

        <div className="space-y-4">
          {volumes.map((volume) => (
            <Card key={volume.size} className="bg-white border-l-4" 
                  style={{ borderLeftColor: 
                    volume.color === 'blue' ? '#3B82F6' : 
                    volume.color === 'green' ? '#10B981' : '#8B5CF6' 
                  }}>
              <CardContent className="p-4">
                {volume.isLoading ? (
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        {volume.size}L Tank Delivery
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {formatPrice((volume.data as any)?.weeklyAverage || 0)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {((parseFloat((volume.data as any)?.weeklyAverage || '0') / 100) / volume.size * 100).toFixed(1)}p per litre
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">
                        Range
                      </div>
                      <div className="text-sm">
                        <span className="text-green-600 font-medium">
                          {formatPrice((volume.data as any)?.lowestPrice || 0)}
                        </span>
                        <span className="text-gray-400 mx-1">-</span>
                        <span className="text-red-600 font-medium">
                          {formatPrice((volume.data as any)?.highestPrice || 0)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {(volume.data as any)?.supplierCount || 0} suppliers
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="text-xs text-gray-500">
            Prices updated daily • VAT included • Standard delivery
          </div>
        </div>
      </div>
    </section>
  );
}