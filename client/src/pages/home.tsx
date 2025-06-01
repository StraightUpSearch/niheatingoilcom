import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import PricingTable from "@/components/pricing-table";
import PriceTrends from "@/components/price-trends";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { user } = useAuth();
  
  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Welcome Section */}
      <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
            </h1>
            <p className="text-xl text-blue-100">
              Track your heating oil savings and stay updated with the latest prices
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Cards */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Price Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {alerts?.length || 0}
                </div>
                <p className="text-gray-600 text-sm">Monitoring your area</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Best Current Deal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">
                  £237.60
                </div>
                <p className="text-gray-600 text-sm">300L from Bangor Fuels</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Potential Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  £24.80
                </div>
                <p className="text-gray-600 text-sm">vs. average price</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Prices */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Prices</h2>
          <PricingTable />
        </div>
      </section>

      <PriceTrends />
      <Footer />
    </div>
  );
}
