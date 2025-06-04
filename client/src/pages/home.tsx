import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import PricingTable from "@/components/pricing-table";
import PriceTrends from "@/components/price-trends";
import UserProgress from "@/components/user-progress";
import Footer from "@/components/footer";
import BlogCarousel from "@/components/blog-carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { user } = useAuth();
  
  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts"],
  });

  const { data: prices } = useQuery({
    queryKey: ["/api/prices"],
  });

  const { data: suppliers } = useQuery({
    queryKey: ["/api/suppliers"],
  });

  // Find the best current deal from actual data
  const bestDeal = prices?.reduce((best: any, current: any) => {
    const currentPrice = parseFloat(current.price);
    const bestPrice = best ? parseFloat(best.price) : Infinity;
    return currentPrice < bestPrice ? current : best;
  }, null);

  // Calculate potential savings vs average
  const averagePrice = prices?.length > 0 
    ? prices.reduce((sum: number, price: any) => sum + parseFloat(price.price), 0) / prices.length
    : 0;
  
  const potentialSavings = bestDeal && averagePrice 
    ? (averagePrice - parseFloat(bestDeal.price)).toFixed(2)
    : "0.00";

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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    {bestDeal ? `£${parseFloat(bestDeal.price).toFixed(2)}` : "Loading..."}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {bestDeal ? `${bestDeal.volume}L from ${suppliers?.find((s: any) => s.id === bestDeal.supplierId)?.name || 'Supplier'}` : 'Checking prices...'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Potential Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">
                    £{potentialSavings}
                  </div>
                  <p className="text-gray-600 text-sm">vs. average price</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Progress Panel */}
            <div className="lg:col-span-1">
              <UserProgress />
            </div>
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

      <BlogCarousel />
      <PriceTrends />
      <Footer />
    </div>
  );
}
