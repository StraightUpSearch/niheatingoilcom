import { Card, CardContent } from "../components/ui/card";
import { ExternalLink, TrendingDown, Calendar } from "lucide-react";

export function MediaNewsTile() {
  return (
    <div className="py-12 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            In The News
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Latest media coverage on Northern Ireland heating oil market
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                {/* BBC Logo/Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    BBC
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-semibold px-3 py-1 rounded-full">
                      BBC News NI
                    </span>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      Recent Coverage
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                    "Best Time to Buy Heating Oil NI: Key Tips for Saving Money"
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    BBC News Northern Ireland highlights current market conditions as favorable for heating oil purchases, 
                    with expert analysis on price trends and consumer savings strategies across the region.
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <TrendingDown className="w-5 h-5" />
                      <span className="font-medium text-sm">Favorable buying conditions reported</span>
                    </div>
                    
                    <a 
                      href="https://www.bbc.co.uk/news/articles/cdxn5zn26xeo" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 shadow-md hover:shadow-lg ml-auto"
                    >
                      Read Full Article
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom highlight */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="font-medium">
                    Media validation: Independent journalism confirms market opportunities for NI consumers
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}