import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Coins, Home, ExternalLink, Thermometer } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PageShell, PageHero, OverlapSection } from "@/components/brand-ui";

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
    <PageShell>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Giving Back" }]}
        title="Our 5% Pledge to "
        accent="Simon Community NI"
        intro="Every order through our platform contributes to emergency heating grants for vulnerable people across Northern Ireland."
        overlap
      />

      <OverlapSection>
      {/* Impact Statistics */}
      <section className="py-16 bg-brand-paper border-b border-brand-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-ink mb-4">Our Impact</h2>
            <p className="text-brand-muted max-w-2xl mx-auto">
              Real support for real people facing fuel poverty in Northern Ireland
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="text-center p-8">
              <CardContent>
                <div className="w-16 h-16 bg-brand-mint rounded-full flex items-center justify-center mx-auto mb-4">
                  <Thermometer className="w-8 h-8 text-[#0B6A30]" />
                </div>
                <h3 className="text-3xl font-bold text-[#0B6A30] mb-2">
                  {impactData?.totalGrants || 0}
                </h3>
                <p className="text-brand-muted">
                  Heating grants funded since January {impactData?.currentYear || new Date().getFullYear()}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent>
                <div className="w-16 h-16 bg-brand-mint rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-brand-forest" />
                </div>
                <h3 className="text-3xl font-bold text-brand-forest mb-2">
                  £{impactData?.totalAmount || 0}
                </h3>
                <p className="text-brand-muted">
                  Total contributed to emergency heating support
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 bg-brand-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-ink mb-8 text-center">Why It Matters</h2>
          <div className="prose prose-lg max-w-none text-brand-muted">
            <p className="text-center text-xl leading-relaxed">
              Fuel poverty affects thousands of households across Northern Ireland. When families can't afford heating, 
              Simon Community NI steps in with emergency grants that provide immediate warmth and dignity. 
              Every purchase you make through our platform directly funds these life-changing interventions.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-brand-paper border-b border-brand-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-ink mb-12 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-mint rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-brand-forest" />
              </div>
              <h3 className="text-xl font-semibold text-brand-ink mb-4">1. You Order</h3>
              <p className="text-brand-muted">
                Every heating oil order placed through our platform
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-brand-mint rounded-full flex items-center justify-center mx-auto mb-6">
                <Coins className="w-10 h-10 text-[#0B6A30]" />
              </div>
              <h3 className="text-xl font-semibold text-brand-ink mb-4">2. We Contribute</h3>
              <p className="text-brand-muted">
                5% of our profits automatically go to Simon Community NI
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-brand-ink mb-4">3. Grants Fund Warmth</h3>
              <p className="text-brand-muted">
                Emergency heating grants reach families in need
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Winter Call-Out */}
      {impactData?.isWinterSeason && (
        <section className="py-12 bg-brand-forest text-brand-cream">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Winter Support Campaign</h3>
            <p className="text-lg mb-6">
              During the coldest months, heating needs are most critical. Help support the Winter Wish List campaign.
            </p>
            <a 
              href="https://www.simoncommunity.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-brand-forest px-6 py-3 rounded-lg font-medium hover:bg-white transition-colors"
            >
              Learn More About Winter Support
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>
      )}

      {/* About Simon Community NI */}
      <section className="py-16 bg-brand-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-ink mb-8 text-center">About Simon Community NI</h2>
          <div className="bg-brand-paper rounded-lg p-8 shadow-sm border border-brand-line">
            <p className="text-brand-muted text-lg leading-relaxed mb-6">
              Simon Community NI provides vital support to people experiencing homelessness and those at risk across Northern Ireland. 
              Their emergency heating grant program ensures that vulnerable families don't have to choose between heating and eating during the coldest months.
            </p>
            <div className="text-center">
              <a 
                href="https://www.simoncommunity.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#0B6A30] hover:text-[#0B6A30] font-medium"
              >
                Visit Simon Community NI
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      </OverlapSection>
    </PageShell>
  );
}