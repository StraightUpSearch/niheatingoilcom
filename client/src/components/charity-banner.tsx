import { Heart } from "lucide-react";
import { Link } from "wouter";

export function CharityBanner() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-b border-green-100 dark:border-green-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          <span className="text-gray-700 dark:text-gray-300">
            5% of our profits fund{" "}
            <Link 
              to="/giving-back" 
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium underline decoration-green-300 hover:decoration-green-500 transition-colors"
            >
              Simon Community NI's heating grants
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}