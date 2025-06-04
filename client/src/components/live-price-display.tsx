
import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";

export default function LivePriceDisplay() {
  const [currentPrice, setCurrentPrice] = useState<number>(48.06);

  useEffect(() => {
    // Simulate live price updates
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 2; // ±1p variance
        return Math.max(45, Math.min(55, prev + change));
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
      <CardContent className="p-6 text-center">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">Our live average price:</p>
          <div className="text-4xl font-bold text-green-600">
            {Math.floor(currentPrice)}
            <sub className="text-2xl">.{String(Math.round((currentPrice % 1) * 100)).padStart(2, '0')}</sub>
          </div>
          <p className="text-sm text-gray-600">Pence / Litre</p>
          <p className="text-xs text-green-600 font-medium cursor-pointer hover:underline">
            ✓ No hidden fees • Price you see is what you pay
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
