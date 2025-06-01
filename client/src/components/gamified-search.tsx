import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, TrendingDown, Clock, Star, Zap } from "lucide-react";

interface GamifiedSearchProps {
  onSearch?: (params: { postcode?: string; volume?: number }) => void;
}

export default function GamifiedSearch({ onSearch }: GamifiedSearchProps) {
  const [postcode, setPostcode] = useState("");
  const [volume, setVolume] = useState<number | undefined>();
  const [searchCount, setSearchCount] = useState(3); // User's search count today
  const [isSearching, setIsSearching] = useState(false);
  const [lastSavings, setLastSavings] = useState(47.20); // Last search savings

  const handleSearch = () => {
    if (!postcode || !volume) return;
    
    setIsSearching(true);
    setSearchCount(prev => prev + 1);
    
    // Simulate search delay for dramatic effect
    setTimeout(() => {
      setIsSearching(false);
      onSearch?.({ postcode, volume });
      
      // Simulate new savings amount
      setLastSavings(Math.random() * 50 + 20);
    }, 1500);
  };

  const searchRewards = [
    { threshold: 1, reward: "First Search", icon: Search, color: "bg-green-500" },
    { threshold: 5, reward: "Explorer", icon: TrendingDown, color: "bg-blue-500" },
    { threshold: 10, reward: "Deal Hunter", icon: Star, color: "bg-purple-500" },
    { threshold: 25, reward: "Savings Master", icon: Zap, color: "bg-yellow-500" }
  ];

  const nextReward = searchRewards.find(reward => searchCount < reward.threshold);
  const earnedRewards = searchRewards.filter(reward => searchCount >= reward.threshold);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Find Your Best Deal</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {searchCount} searches today
            </Badge>
            {earnedRewards.length > 0 && (
              <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                <Star className="h-3 w-3 mr-1" />
                {earnedRewards[earnedRewards.length - 1].reward}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Postcode
              </label>
              <Input
                type="text"
                placeholder="e.g. BT1 5GS"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Oil Volume
              </label>
              <Select onValueChange={(value) => setVolume(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">300 Litres</SelectItem>
                  <SelectItem value="500">500 Litres</SelectItem>
                  <SelectItem value="900">900 Litres</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleSearch}
            disabled={!postcode || !volume || isSearching}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3"
          >
            {isSearching ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Hunting for deals...
              </div>
            ) : (
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Find My Best Prices
              </div>
            )}
          </Button>

          {/* Progress to next reward */}
          {nextReward && (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Next Reward: {nextReward.reward}
                </span>
                <span className="text-xs text-gray-500">
                  {nextReward.threshold - searchCount} searches to go
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(searchCount / nextReward.threshold) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Last search result tease */}
          {searchCount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <TrendingDown className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-green-800">
                  Your last search could have saved you <strong>£{lastSavings.toFixed(2)}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}