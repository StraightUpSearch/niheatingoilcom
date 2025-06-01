import { MapPin, Users, Shield, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function NorthernIrelandIdentity() {
  const counties = [
    { name: "Antrim", postcodes: "BT1-BT57" },
    { name: "Armagh", postcodes: "BT60-BT67" },
    { name: "Down", postcodes: "BT21-BT35" },
    { name: "Fermanagh", postcodes: "BT74-BT94" },
    { name: "Londonderry", postcodes: "BT45-BT82" },
    { name: "Tyrone", postcodes: "BT70-BT82" }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Proudly Northern Irish
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Built by a Belfast-based team who understand the unique heating challenges in Northern Ireland. 
            We serve all six counties with local expertise and official Consumer Council for Northern Ireland data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Local Team Features */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Local NI Team</h3>
                <p className="text-gray-600">
                  Created by Northern Ireland residents who understand local heating oil suppliers, 
                  delivery areas, and seasonal pricing patterns across all six counties.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Official Government Data</h3>
                <p className="text-gray-600">
                  Powered by Consumer Council for Northern Ireland's official weekly price surveys, 
                  ensuring accurate and trustworthy pricing information for all NI residents.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Weekly Updates</h3>
                <p className="text-gray-600">
                  Prices updated every Monday following the Consumer Council's official survey, 
                  giving you the most current heating oil prices across Northern Ireland.
                </p>
              </div>
            </div>
          </div>

          {/* County Coverage */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Complete NI Coverage</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Serving all six counties of Northern Ireland with comprehensive heating oil price data
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {counties.map((county) => (
                    <div key={county.name} className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-900">{county.name}</div>
                      <div className="text-sm text-gray-600">{county.postcodes}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    🇬🇧 Exclusively for Northern Ireland residents
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Supporting local communities across Ulster
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-primary mb-2">100%</div>
              <div className="text-gray-600">Northern Ireland Focus</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-primary mb-2">6</div>
              <div className="text-gray-600">Counties Covered</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-primary mb-2">Official</div>
              <div className="text-gray-600">Consumer Council Data</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}