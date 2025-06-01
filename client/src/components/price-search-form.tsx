import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useLocation } from "wouter";

interface PriceSearchFormProps {
  onSearch?: (params: { postcode?: string; volume?: number }) => void;
}

export default function PriceSearchForm({ onSearch }: PriceSearchFormProps) {
  const [postcode, setPostcode] = useState("");
  const [volume, setVolume] = useState("300");
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = {
      postcode: postcode.trim() || undefined,
      volume: parseInt(volume),
    };

    if (onSearch) {
      onSearch(params);
    } else {
      // Navigate to comparison page with params
      const searchParams = new URLSearchParams();
      if (params.postcode) searchParams.set('postcode', params.postcode);
      if (params.volume) searchParams.set('volume', params.volume.toString());
      setLocation(`/compare?${searchParams.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-2">
            Your Postcode
          </Label>
          <Input
            id="postcode"
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="e.g. BT1 5GS"
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-2">
            Oil Volume (Litres)
          </Label>
          <Select value={volume} onValueChange={setVolume}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="300">300L</SelectItem>
              <SelectItem value="500">500L</SelectItem>
              <SelectItem value="900">900L</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full md:w-auto bg-accent text-white hover:bg-orange-600">
            <Search className="h-4 w-4 mr-2" />
            Compare Prices
          </Button>
        </div>
      </div>
    </form>
  );
}
