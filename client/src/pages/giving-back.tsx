import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Heart, ShoppingCart, Coins, Home, ExternalLink, Thermometer } from "lucide-react";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import { usePageTitle } from "../hooks/usePageTitle";

interface ImpactData {
  totalGrants: number;
  totalAmount: number;
  currentYear: number;
  isWinterSeason: boolean;
  message: string;
}

export default function GivingBack() {
  usePageTitle("Our 5% Pledge to Simon Community NI - NI Heating Oil");
  
  const [impactData, setImpactData] = useState<ImpactData | null>(null);

  useEffect(() => {
    fetch('/api/impact')
      .then(res => res.json())
      .then(data => setImpactData(data))
      .catch(error => console.error('Failed to fetch impact data:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-red-300 fill-current mr-4" />
            <h1 className="text-4xl font-bold">Our 5% Pledge to Simon Community NI</h1>
          </div>
          <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
            Every order through our platform contributes to emergency heating grants for vulnerable people across Northern Ireland.
          </p>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Impact</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Real support for real people facing fuel poverty in Northern Ireland
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="text-center p-8">
              <CardContent>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Thermometer className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {impactData?.totalGrants || 0}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Heating grants funded since January {impactData?.currentYear || new Date().getFullYear()}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  £{impactData?.totalAmount || 0}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Total contributed to emergency heating support
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Why It Matters</h2>
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
            <p className="text-center text-xl leading-relaxed">
              Fuel poverty affects thousands of households across Northern Ireland. When families can't afford heating, 
              Simon Community NI steps in with emergency grants that provide immediate warmth and dignity. 
              Every purchase you make through our platform directly funds these life-changing interventions.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. You Order</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every heating oil order placed through our platform
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coins className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. We Contribute</h3>
              <p className="text-gray-600 dark:text-gray-400">
                5% of our profits automatically go to Simon Community NI
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. Grants Fund Warmth</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Emergency heating grants reach families in need
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Winter Call-Out */}
      {impactData?.isWinterSeason && (
        <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Winter Support Campaign</h3>
            <p className="text-lg mb-6">
              During the coldest months, heating needs are most critical. Help support the Winter Wish List campaign.
            </p>
            <a 
              href="https://www.simoncommunity.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Learn More About Winter Support
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>
      )}

      {/* About Simon Community NI */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">About Simon Community NI</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              Simon Community NI provides vital support to people experiencing homelessness and those at risk across Northern Ireland. 
              Their emergency heating grant program ensures that vulnerable families don't have to choose between heating and eating during the coldest months.
            </p>
            <div className="text-center">
              <a 
                href="https://www.simoncommunity.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
              >
                Visit Simon Community NI
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}