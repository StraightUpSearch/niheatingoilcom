import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Users, Lock } from "lucide-react";

export default function TrustSection() {
  const features = [
    {
      icon: Shield,
      title: "Verified Data",
      description: "All prices scraped directly from supplier websites and verified in real-time.",
      color: "bg-primary",
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Price data updated weekly to ensure you get current and reliable information.",
      color: "bg-secondary",
    },
    {
      icon: Users,
      title: "50+ Suppliers",
      description: "Comprehensive coverage of heating oil suppliers across all of Northern Ireland.",
      color: "bg-accent",
    },
    {
      icon: Lock,
      title: "GDPR Compliant",
      description: "Your data is protected and handled in accordance with UK data protection laws.",
      color: "bg-warning",
    },
  ];

  const legalPoints = [
    {
      title: "Data Sources",
      description: "All pricing data is collected from publicly available supplier websites with respect for terms of service.",
    },
    {
      title: "Price Accuracy",
      description: "While we strive for accuracy, prices are subject to change. Always confirm final pricing with suppliers.",
    },
    {
      title: "No Commission",
      description: "We don't take commissions from suppliers. Our service is completely free and independent.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Trust NI Heating Oil?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing accurate, transparent, and up-to-date heating oil price information for Northern Ireland consumers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
