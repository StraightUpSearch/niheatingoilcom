
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, MapPin, TrendingUp, Shield, Zap } from "lucide-react";
import SEOHead from "@/components/seo-head";
import { PageShell, PageHero, OverlapSection, CtaBand } from "@/components/brand-ui";

export default function AboutUs() {
  return (
    <PageShell>
      <SEOHead
        title="About Us - NI Heating Oil"
        description="Learn about NI Heating Oil's mission to help Northern Ireland residents find the best heating oil prices while supporting local charities."
        keywords="about ni heating oil, northern ireland heating oil, company story, charity partnership"
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        title="About NI "
        accent="Heating Oil"
        intro="Northern Ireland's first AI-powered heating oil comparison platform — built by locals, for locals."
        overlap
      />
      <OverlapSection>
      <main className="pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Story */}
        <div className="prose prose-lg max-w-none mb-12">
          <Card className="border-2 border-brand-line bg-brand-mint/30">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-brand-mint p-3 rounded-full">
                  <Users className="h-6 w-6 text-brand-forest" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-brand-ink mb-4">Our Story</h2>
                  <p className="text-brand-ink mb-4">
                    I'm a Northern Irish SEO enthusiast who spent countless hours hunting down the best heating oil prices online. It occurred to me: why should everyone else have to do the same? So I decided to build a simple, AI‐powered platform just for our corner of the world.
                  </p>
                  <p className="text-brand-ink mb-4">
                    My entire family still lives in Northern Ireland, which meant that creating this site gave me a perfect excuse to reconnect with them. Dad, who's volunteered with Simon Community NI for years, immediately saw the potential. Over cups of tea, he asked, "Is there a way we can use AI to tackle a truly NI-specific problem?" My SEO brain sprang into action: "Oil prices. Let's compare them, automatically, for every BT postcode!" And just like that, NIHeatingOil.com was born.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why We Do It */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-brand-ink text-center mb-8">Why We Do It</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border border-brand-line hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Heart className="h-8 w-8 text-red-500" />
                  <CardTitle className="text-xl">Community First</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-brand-muted">
                  Dad's work with Simon Community NI inspired us to include a 5% pledge toward heating grants for families in need. Every litre you order helps someone stay snug this winter.
                </p>
                <Badge variant="secondary" className="mt-3">
                  5% Pledge Active
                </Badge>
              </CardContent>
            </Card>

            <Card className="border border-brand-line hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-brand-forest" />
                  <CardTitle className="text-xl">Real Savings</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-brand-muted">
                  We believe everyone deserves transparent, fair pricing for heating oil. Our AI-powered platform checks prices across 50+ suppliers every 2 hours to ensure you get the best deal.
                </p>
                <Badge variant="secondary" className="mt-3">
                  Live Price Updates
                </Badge>
              </CardContent>
            </Card>

            <Card className="border border-brand-line hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-8 w-8 text-brand-forest" />
                  <CardTitle className="text-xl">Local Focus</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-brand-muted">
                  Built by Northern Ireland locals, for Northern Ireland residents. We understand BT postcodes, local suppliers, and the unique challenges of heating oil delivery across our six counties.
                </p>
                <Badge variant="secondary" className="mt-3">
                  100% Local
                </Badge>
              </CardContent>
            </Card>

            <Card className="border border-brand-line hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Zap className="h-8 w-8 text-[#8A3B12]" />
                  <CardTitle className="text-xl">Modern Technology</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-brand-muted">
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
        <Card className="bg-brand-mint/20 border-brand-line">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-brand-ink">Our Values</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <Shield className="h-12 w-12 text-[#0B6A30] mb-3" />
                <h3 className="font-semibold text-brand-ink mb-2">Transparency</h3>
                <p className="text-brand-muted text-sm">
                  No hidden fees, no markup. What you see is what you pay.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Heart className="h-12 w-12 text-red-600 mb-3" />
                <h3 className="font-semibold text-brand-ink mb-2">Community</h3>
                <p className="text-brand-muted text-sm">
                  Supporting local families and charities through every transaction.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="h-12 w-12 text-brand-forest mb-3" />
                <h3 className="font-semibold text-brand-ink mb-2">Innovation</h3>
                <p className="text-brand-muted text-sm">
                  Using modern technology to solve traditional problems.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
      </OverlapSection>
      <CtaBand
        title="Ready to Save on "
        accent="Heating Oil?"
        text="Join thousands of Northern Ireland residents who are already saving money while supporting local charities."
        href="/"
        label="Compare Prices Now"
      />
    </PageShell>
  );
}
