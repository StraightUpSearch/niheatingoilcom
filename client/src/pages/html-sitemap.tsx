import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function HtmlSitemap() {
  usePageTitle("HTML Sitemap - NI Heating Oil");

  const sitemapLinks = {
    "Main Pages": [
      { name: "Home", href: "/" },
      { name: "Compare Prices", href: "/compare" },
      { name: "All Suppliers", href: "/suppliers" },
      { name: "Blog", href: "/blog" },
      { name: "Sign In", href: "/auth" },
      { name: "HTML Sitemap", href: "/pages/html-sitemap" }
    ],
    "Blog Articles": [
      { name: "Heating Oil Tips for Winter 2024", href: "/blog/heating-oil-tips-winter-2024" },
      { name: "Understanding Oil Prices in NI", href: "/blog/understanding-oil-prices-ni" },
      { name: "Tank Maintenance Guide", href: "/blog/tank-maintenance-guide" }
    ],
    "Regional Coverage": [
      { name: "Belfast Heating Oil", href: "/compare?area=belfast" },
      { name: "Derry Heating Oil", href: "/compare?area=derry" },
      { name: "Armagh Heating Oil", href: "/compare?area=armagh" },
      { name: "Down Heating Oil", href: "/compare?area=down" },
      { name: "Antrim Heating Oil", href: "/compare?area=antrim" },
      { name: "Tyrone Heating Oil", href: "/compare?area=tyrone" },
      { name: "Fermanagh Heating Oil", href: "/compare?area=fermanagh" }
    ],
    "Popular Locations": [
      { name: "Belfast BT1-BT17 Oil Prices", href: "/compare?postcode=BT1" },
      { name: "Derry BT47-BT49 Oil Prices", href: "/compare?postcode=BT47" },
      { name: "Armagh BT60-BT67 Oil Prices", href: "/compare?postcode=BT60" },
      { name: "Newry BT34-BT35 Oil Prices", href: "/compare?postcode=BT34" },
      { name: "Antrim BT28-BT44 Oil Prices", href: "/compare?postcode=BT28" },
      { name: "Omagh BT78-BT82 Oil Prices", href: "/compare?postcode=BT78" },
      { name: "Enniskillen BT74-BT94 Oil Prices", href: "/compare?postcode=BT74" }
    ],
    "Services & Features": [
      { name: "Price Alerts", href: "/alerts" },
      { name: "User Dashboard", href: "/dashboard" },
      { name: "Price Comparison Tool", href: "/compare" },
      { name: "Supplier Directory", href: "/suppliers" }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Site Map
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive directory of all pages on NI Heating Oil for easy navigation and search engine indexing.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(sitemapLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  {category}
                </h2>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                About This Sitemap
              </h2>
              <p className="text-gray-600 max-w-4xl mx-auto">
                This HTML sitemap provides a complete overview of all pages available on NI Heating Oil. 
                Our platform serves Northern Ireland residents with comprehensive heating oil price comparisons, 
                real-time market data, and local supplier information across all six counties. Every link above 
                represents a page designed to help you find the best heating oil deals in your area.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-500">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Coverage Areas</h3>
                <p>All BT postcodes (BT1-BT94) across Belfast, Derry, Armagh, Down, Antrim, Tyrone, and Fermanagh</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Last Updated</h3>
                <p>This sitemap is automatically maintained and reflects our current site structure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}