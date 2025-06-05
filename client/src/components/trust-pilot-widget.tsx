import { Star, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface TrustpilotWidgetProps {
  variant?: "inline" | "floating" | "compact";
  className?: string;
}

export default function TrustpilotWidget({ variant = "inline", className = "" }: TrustpilotWidgetProps) {
  const [rating, setRating] = useState(4.8);
  const [reviewCount, setReviewCount] = useState(2847);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In production, this would fetch real Trustpilot data
    // For now, we'll simulate the data
    setTimeout(() => {
      setIsLoading(false);
      // Simulate increasing review count
      const interval = setInterval(() => {
        setReviewCount(prev => prev + Math.floor(Math.random() * 3));
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }, 1000);
  }, []);

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < fullStars 
                ? "fill-green-500 text-green-500" 
                : hasHalfStar && i === fullStars
                ? "fill-green-500/50 text-green-500"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {renderStars()}
        <span className="text-sm font-medium text-gray-700">
          {rating}/5 ({reviewCount.toLocaleString()} reviews)
        </span>
      </div>
    );
  }

  if (variant === "floating") {
    return (
      <div className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-50 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-900">Excellent</span>
          <img src="/trustpilot-logo.svg" alt="Trustpilot" className="h-5" />
        </div>
        {renderStars()}
        <p className="text-sm text-gray-600 mt-1">
          Based on {reviewCount.toLocaleString()} reviews
        </p>
        <a
          href="https://www.trustpilot.com/review/niheatingoil.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2"
        >
          See all reviews <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 text-white px-3 py-1 rounded font-bold text-lg">
            {rating}
          </div>
          <div>
            <div className="font-semibold text-gray-900">Excellent</div>
            {renderStars()}
          </div>
        </div>
        <img src="/trustpilot-logo.svg" alt="Trustpilot" className="h-6" />
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        Based on {reviewCount.toLocaleString()} reviews
      </p>
      
      {!isLoading && (
        <div className="space-y-2">
          <div className="text-xs text-gray-500">
            <div className="flex justify-between mb-1">
              <span>5 star</span>
              <span>80%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }} />
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <div className="flex justify-between mb-1">
              <span>4 star</span>
              <span>15%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full" style={{ width: "15%" }} />
            </div>
          </div>
        </div>
      )}
      
      <a
        href="https://www.trustpilot.com/review/niheatingoil.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-3"
      >
        Read our reviews <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}