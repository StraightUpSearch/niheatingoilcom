import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { TrendingDown, Clock, MapPin, Sparkles, Timer, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function DealDiscovery() {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [flashDeals] = useState([
    {
      supplier: "BoilerJuice",
      volume: 500,
      normalPrice: 415.00,
      dealPrice: 387.50,
      savings: 27.50,
      area: "Belfast Area",
      timeLeft: 2847, // seconds
      limited: true
    },
    {
      supplier: "Value Oils",
      volume: 900,
      normalPrice: 742.00,
      dealPrice: 698.20,
      savings: 43.80,
      area: "Greater Belfast",
      timeLeft: 5234,
      limited: false
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateSavingsPercentage = (normal: number, deal: number) => {
    return Math.round(((normal - deal) / normal) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Flash Deals Header */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-800">
            <Sparkles className="h-5 w-5 mr-2 text-red-600" />
            Live Deals - Updated Now
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-red-700">Exclusive deals expire soon - act fast!</p>
            <div className="flex items-center text-red-700 font-mono">
              <Timer className="h-4 w-4 mr-1" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flashDeals.map((deal, index) => (
          <Card key={index} className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden">
            {deal.limited && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-red-500 text-white animate-pulse">
                  LIMITED TIME
                </Badge>
              </div>
            )}
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{deal.supplier}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {deal.area}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    £{deal.dealPrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    £{deal.normalPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-800 font-semibold">
                    Save £{deal.savings.toFixed(2)}
                  </span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {calculateSavingsPercentage(deal.normalPrice, deal.dealPrice)}% OFF
                </Badge>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">{deal.volume}L volume</span>
                <div className="flex items-center text-sm text-orange-600">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(deal.timeLeft)} left
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                View This Deal
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Deal Alert */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Deal Alert Active</h4>
              <p className="text-sm text-yellow-700">
                We're monitoring prices in your area. You'll be notified instantly when better deals become available.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Discoveries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Price Discoveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">Cheaper Oil NI</div>
                <div className="text-sm text-gray-600">300L - BT19 area</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-blue-600">£247.30</div>
                <div className="text-xs text-gray-500">2 mins ago</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">Home Fuels Direct</div>
                <div className="text-sm text-gray-600">900L - BT7 area</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">£698.50</div>
                <div className="text-xs text-gray-500">5 mins ago</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}