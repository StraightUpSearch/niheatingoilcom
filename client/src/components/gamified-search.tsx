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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Compare Heating Oil Prices</h2>
          <p className="text-lg text-gray-700">Find the cheapest heating oil suppliers in your area</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Enter Your Postcode
              </label>
              <Input
                type="text"
                placeholder="Type your postcode here (e.g. BT1 5GS)"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                className="w-full text-xl p-4 h-14 border-2 border-blue-300 focus:border-blue-500 rounded-lg"
                style={{ fontSize: '20px' }}
              />
              <p className="text-sm text-gray-600 mt-2">
                Enter your Northern Ireland postcode to find suppliers in your area
              </p>
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                How Much Oil Do You Need?
              </label>
              <Select onValueChange={(value) => setVolume(parseInt(value))}>
                <SelectTrigger className="w-full text-xl p-4 h-14 border-2 border-blue-300 focus:border-blue-500 rounded-lg">
                  <SelectValue placeholder="Choose the amount of oil you need" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300" className="text-lg p-3">300 Litres (Small tank fill)</SelectItem>
                  <SelectItem value="500" className="text-lg p-3">500 Litres (Medium tank fill)</SelectItem>
                  <SelectItem value="900" className="text-lg p-3">900 Litres (Large tank fill)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600 mt-2">
                Select the amount that matches your oil tank size
              </p>
            </div>
          </div>

          <Button 
            onClick={handleSearch}
            disabled={!postcode || !volume || isSearching}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-6 text-xl h-16 rounded-lg border-2 border-blue-700 shadow-lg hover:shadow-xl transition-all"
          >
            {isSearching ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                <span className="text-xl">Finding Your Best Prices...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Search className="h-6 w-6 mr-3" />
                <span className="text-xl">Compare Heating Oil Prices</span>
              </div>
            )}
          </Button>

          {/* Simple instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-center">
              <p className="text-lg text-blue-800 font-medium">
                Get instant price comparisons from verified Northern Ireland heating oil suppliers
              </p>
              <p className="text-blue-700 mt-2">
                It's completely free and takes less than 30 seconds
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}