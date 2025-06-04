
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, MapPin, TrendingUp, Shield, Zap } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="About Us - NI Heating Oil"
        description="Learn about NI Heating Oil's mission to help Northern Ireland residents find the best heating oil prices while supporting local charities."
        keywords="about ni heating oil, northern ireland heating oil, company story, charity partnership"
      />
      
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About NI Heating Oil
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Where we take one less chore off your list (and have a chuckle along the way).
          </p>
        </div>

        {/* Main Story */}
        <div className="prose prose-lg max-w-none mb-12">
          <Card className="border-2 border-blue-100 bg-blue-50/30">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
                  <p className="text-gray-700 mb-4">
                    I'm a Northern Irish SEO enthusiast who spent countless hours hunting down the best heating oil prices online. It occurred to me: why should everyone else have to do the same? So I decided to build a simple, AI‐powered platform just for our corner of the world.
                  </p>
                  <p className="text-gray-700 mb-4">
                    My entire family still lives in Northern Ireland, which meant that creating this site gave me a perfect excuse to reconnect with them. Dad, who's volunteered with Simon Community NI for years, immediately saw the potential. Over cups of tea, he asked, "Is there a way we can use AI to tackle a truly NI-specific problem?" My SEO brain sprang into action: "Oil prices. Let's compare them, automatically, for every BT postcode!" And just like that, NIHeatingOil.com was born.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why We Do It */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why We Do It</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Heart className="h-8 w-8 text-red-500" />
                  <CardTitle className="text-xl">Community First</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Dad's work with Simon Community NI inspired us to include a 5% pledge toward heating grants for families in need. Every litre you order helps someone stay snug this winter.
                </p>
                <Badge variant="secondary" className="mt-3">
                  5% Pledge Active
                </Badge>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                  <CardTitle className="text-xl">Real Savings</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We believe everyone deserves transparent, fair pricing for heating oil. Our AI-powered platform checks prices across 50+ suppliers every 2 hours to ensure you get the best deal.
                </p>
                <Badge variant="secondary" className="mt-3">
                  Live Price Updates
                </Badge>
              </CardContent>
            </Card>

            <Card className="border border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-8 w-8 text-purple-500" />
                  <CardTitle className="text-xl">Local Focus</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built by Northern Ireland locals, for Northern Ireland residents. We understand BT postcodes, local suppliers, and the unique challenges of heating oil delivery across our six counties.
                </p>
                <Badge variant="secondary" className="mt-3">
                  100% Local
                </Badge>
              </CardContent>
            </Card>

            <Card className="border border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Zap className="h-8 w-8 text-orange-500" />
                  <CardTitle className="text-xl">Modern Technology</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our platform uses modern AI and automation to make heating oil comparison simple, fast, and reliable. No more calling around or hunting through websites.
                </p>
                <Badge variant="secondary" className="mt-3">
                  AI-Powered
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values Section */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">Our Values</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <Shield className="h-12 w-12 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
                <p className="text-gray-600 text-sm">
                  No hidden fees, no markup. What you see is what you pay.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Heart className="h-12 w-12 text-red-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600 text-sm">
                  Supporting local families and charities through every transaction.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="h-12 w-12 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600 text-sm">
                  Using modern technology to solve traditional problems.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-primary text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Save on Heating Oil?</h2>
              <p className="text-blue-100 mb-6">
                Join thousands of Northern Ireland residents who are already saving money while supporting local charities.
              </p>
              <a
                href="/compare"
                className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Compare Prices Now
              </a>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
