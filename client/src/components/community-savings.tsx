import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingDown, Clock, MessageCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import WhatsAppShareButton from "@/components/whatsapp-share-button";
import { useQuery } from "@tanstack/react-query";

interface CommunitySavingsProps {
  postcode: string;
  volume: number;
  currentPrice: string;
}

export default function CommunitySavings({ 
  postcode, 
  volume, 
  currentPrice 
}: CommunitySavingsProps) {
  const [timeUntilWeekend, setTimeUntilWeekend] = useState("");
  const [isWeekend, setIsWeekend] = useState(false);

  // Fetch community data
  const { data: communityData } = useQuery({
    queryKey: ["/api/community-savings", postcode, volume],
    enabled: !!postcode,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Calculate time until weekend
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      
      // Check if it's weekend (Friday 6pm - Sunday 11:59pm)
      const isFriday = dayOfWeek === 5 && now.getHours() >= 18;
      const isSaturday = dayOfWeek === 6;
      const isSunday = dayOfWeek === 0;
      
      setIsWeekend(isFriday || isSaturday || isSunday);
      
      if (isFriday || isSaturday || isSunday) {
        // Calculate time until Sunday midnight
        const endOfWeekend = new Date(now);
        endOfWeekend.setDate(now.getDate() + (7 - dayOfWeek));
        endOfWeekend.setHours(23, 59, 59, 999);
        
        const diff = endOfWeekend.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeUntilWeekend(`${hours}h ${minutes}m remaining`);
      } else {
        // Calculate time until Friday 6pm
        const nextFriday = new Date(now);
        const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
        nextFriday.setDate(now.getDate() + daysUntilFriday);
        nextFriday.setHours(18, 0, 0, 0);
        
        const diff = nextFriday.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        setTimeUntilWeekend(`${days}d ${hours}h until weekend savings`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const activeOrders = communityData?.activeOrders || 3;
  const ordersNeeded = communityData?.ordersNeeded || 5;
  const potentialDiscount = communityData?.potentialDiscount || "£12";
  const progress = (activeOrders / ordersNeeded) * 100;

  return (
    <Card className={`${isWeekend ? 'border-accent shadow-lg' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            NI Community Savings
          </CardTitle>
          {isWeekend && (
            <span className="bg-accent text-white text-xs px-2 py-1 rounded-full animate-pulse">
              Weekend Active!
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weekend Timer */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">
              {isWeekend ? '🎉 Buying Weekend Active!' : '📅 Next Buying Weekend'}
            </span>
            <div className="flex items-center gap-1 text-sm text-blue-700">
              <Clock className="h-3 w-3" />
              {timeUntilWeekend}
            </div>
          </div>
          {isWeekend && (
            <p className="text-xs text-blue-600">
              Orders placed now have a higher chance of group savings!
            </p>
          )}
        </div>

        {/* Group Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">
              {activeOrders} orders in {postcode} area
            </span>
            <span className="font-medium text-green-600">
              Save {potentialDiscount}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-gray-500 mt-1">
            {ordersNeeded - activeOrders} more orders needed for group discount
          </p>
        </div>

        {/* Call to Action */}
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-800">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">
                Join {activeOrders} neighbors ordering today!
              </span>
            </div>
          </div>

          {/* Share Button */}
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-600 text-center">
              Invite neighbors to unlock group savings
            </p>
            <WhatsAppShareButton 
              text={`Hey! ${activeOrders} of us in ${postcode} are ordering heating oil together to get a group discount. Join us and save ${potentialDiscount}! Check prices at`}
              url="https://niheatingoil.com"
              className="w-full justify-center"
            />
          </div>
        </div>

        {/* How it Works */}
        <div className="border-t pt-3">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              How group savings work
            </summary>
            <div className="mt-2 text-xs text-gray-600 space-y-1">
              <p>• Orders in the same postcode area are grouped together</p>
              <p>• Suppliers offer better rates for bulk deliveries</p>
              <p>• Savings are automatically applied to all group members</p>
              <p>• Weekend orders have the best chance of grouping</p>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}