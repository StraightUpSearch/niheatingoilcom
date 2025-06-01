import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import oilTank1 from "@assets/v2-vnxjs-vtqkl.jpg";
import oilTank2 from "@assets/v2-vnxjs-awp7f.jpg";
import oilTank3 from "@assets/v2-vnxjs-658vc.jpg";

interface OilTankShowcaseProps {
  onVolumeSelect?: (volume: number) => void;
}

export default function OilTankShowcase({ onVolumeSelect }: OilTankShowcaseProps) {
  const tankSizes = [
    {
      volume: 300,
      image: oilTank1,
      title: "Small Tank (300 Litres)",
      description: "Perfect for smaller homes, apartments, or seasonal heating needs",
      avgPrice: "£162.65",
      countryside: "County Down countryside"
    },
    {
      volume: 500,
      image: oilTank2,
      title: "Medium Tank (500 Litres)",
      description: "Ideal for most family homes with standard heating requirements",
      avgPrice: "£253.71", 
      countryside: "County Antrim countryside"
    },
    {
      volume: 900,
      image: oilTank3,
      title: "Large Tank (900 Litres)",
      description: "Best for larger homes, farmhouses, or commercial properties",
      avgPrice: "£445.82",
      countryside: "County Fermanagh countryside"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Tank Size
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the heating oil volume that matches your tank capacity for accurate pricing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tankSizes.map((tank) => (
            <Card key={tank.volume} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={tank.image} 
                  alt={`${tank.title} - heating oil tank in beautiful ${tank.countryside}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {tank.avgPrice}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {tank.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {tank.description}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Average price across Northern Ireland
                </p>
                <Button 
                  onClick={() => onVolumeSelect?.(tank.volume)}
                  className="w-full"
                  variant="outline"
                >
                  Compare {tank.volume}L Prices
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Prices shown are regional averages from the latest Consumer Council for Northern Ireland data. 
            Individual supplier prices may vary based on location and delivery requirements.
          </p>
        </div>
      </div>
    </section>
  );
}