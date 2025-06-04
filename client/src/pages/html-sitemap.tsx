import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ExternalLink, MapPin, Building2, Users, FileText } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function HtmlSitemap() {
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ["/api/suppliers"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Site Map</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete directory of all pages on NI Heating Oil
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Main Pages */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Main Pages</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Homepage
                  </Link>
                  <p className="text-sm text-gray-500">Latest prices and quick comparison</p>
                </li>
                <li>
                  <Link href="/compare" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Compare Prices
                  </Link>
                  <p className="text-sm text-gray-500">Real-time price comparison tool</p>
                </li>
                <li>
                  <Link href="/suppliers" className="text-blue-600 hover:text-blue-800 transition-colors">
                    All Suppliers
                  </Link>
                  <p className="text-sm text-gray-500">Complete supplier directory</p>
                </li>
                <li>
                  <Link href="/blog" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Blog & Tips
                  </Link>
                  <p className="text-sm text-gray-500">Money-saving advice and guides</p>
                </li>
                <li>
                  <Link href="/contact" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Contact Us
                  </Link>
                  <p className="text-sm text-gray-500">Get in touch with our team</p>
                </li>
              </ul>
            </div>

            {/* County Coverage */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Counties</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/county/antrim" className="text-blue-600 hover:text-blue-800 transition-colors">
                    County Antrim
                  </Link>
                  <p className="text-sm text-gray-500">Belfast, Lisburn, Carrickfergus</p>
                </li>
                <li>
                  <Link href="/county/down" className="text-blue-600 hover:text-blue-800 transition-colors">
                    County Down
                  </Link>
                  <p className="text-sm text-gray-500">Bangor, Newry, Downpatrick</p>
                </li>
                <li>
                  <Link href="/county/armagh" className="text-blue-600 hover:text-blue-800 transition-colors">
                    County Armagh
                  </Link>
                  <p className="text-sm text-gray-500">Armagh, Craigavon, Portadown</p>
                </li>
                <li>
                  <Link href="/county/tyrone" className="text-blue-600 hover:text-blue-800 transition-colors">
                    County Tyrone
                  </Link>
                  <p className="text-sm text-gray-500">Omagh, Dungannon, Cookstown</p>
                </li>
                <li>
                  <Link href="/county/fermanagh" className="text-blue-600 hover:text-blue-800 transition-colors">
                    County Fermanagh
                  </Link>
                  <p className="text-sm text-gray-500">Enniskillen, Lisnaskea</p>
                </li>
                <li>
                  <Link href="/county/derry" className="text-blue-600 hover:text-blue-800 transition-colors">
                    County Derry
                  </Link>
                  <p className="text-sm text-gray-500">Derry/Londonderry, Coleraine</p>
                </li>
              </ul>
            </div>

            {/* Blog Articles */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-900">Blog Articles</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/blog/heating-oil-tank-sizes" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Heating Oil Tank Sizes in Northern Ireland
                  </Link>
                  <p className="text-sm text-gray-500">Comparing 300L, 500L, and 900L options for your home</p>
                </li>
                <li>
                  <Link href="/blog/best-time-buy-heating-oil-northern-ireland" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Best Time to Buy Heating Oil in NI
                  </Link>
                  <p className="text-sm text-gray-500">Key tips for saving money on heating oil purchases</p>
                </li>
                <li>
                  <Link href="/blog/how-to-dispose-heating-oil-northern-ireland" className="text-blue-600 hover:text-blue-800 transition-colors">
                    How to Properly Dispose of Home Heating Oil
                  </Link>
                  <p className="text-sm text-gray-500">Safe and legal methods for households in NI</p>
                </li>
                <li>
                  <Link href="/blog/heating-oil-tank-maintenance-guide" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Heating Oil Tank Maintenance Guide
                  </Link>
                  <p className="text-sm text-gray-500">Keep your tank in perfect condition year-round</p>
                </li>
                <li>
                  <Link href="/blog/how-to-save-money-heating-oil" className="text-blue-600 hover:text-blue-800 transition-colors">
                    How to Save Money on Heating Oil
                  </Link>
                  <p className="text-sm text-gray-500">Expert tips for reducing your heating bills</p>
                </li>
              </ul>
            </div>

            {/* Major Cities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Major Cities</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/city/belfast" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Belfast
                  </Link>
                  <p className="text-sm text-gray-500">Capital city - best local rates</p>
                </li>
                <li>
                  <Link href="/city/derry" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Derry/Londonderry
                  </Link>
                  <p className="text-sm text-gray-500">Northwest region suppliers</p>
                </li>
                <li>
                  <Link href="/city/lisburn" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Lisburn
                  </Link>
                  <p className="text-sm text-gray-500">Greater Belfast area</p>
                </li>
                <li>
                  <Link href="/city/bangor" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Bangor
                  </Link>
                  <p className="text-sm text-gray-500">North Down coastal region</p>
                </li>
                <li>
                  <Link href="/city/armagh" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Armagh
                  </Link>
                  <p className="text-sm text-gray-500">County town suppliers</p>
                </li>
                <li>
                  <Link href="/city/newry" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Newry
                  </Link>
                  <p className="text-sm text-gray-500">Border region coverage</p>
                </li>
              </ul>
            </div>

            {/* Helpful Guides */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-900">Helpful Guides</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/blog/heating-oil-tank-sizes" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Heating Oil Tank Sizes in Northern Ireland
                  </Link>
                  <p className="text-sm text-gray-500">Comparing 300L, 500L, and 900L tank options</p>
                </li>
                <li>
                  <Link href="/blog/how-to-save-money-heating-oil" className="text-blue-600 hover:text-blue-800 transition-colors">
                    How to Save Money on Heating Oil
                  </Link>
                  <p className="text-sm text-gray-500">Expert tips for reducing costs</p>
                </li>
                <li>
                  <Link href="/blog/best-time-buy-heating-oil-northern-ireland" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Best Time to Buy Heating Oil
                  </Link>
                  <p className="text-sm text-gray-500">Seasonal pricing patterns</p>
                </li>
                <li>
                  <Link href="/blog/heating-oil-tank-maintenance-guide" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Tank Maintenance Guide
                  </Link>
                  <p className="text-sm text-gray-500">Keep your system running efficiently</p>
                </li>
                <li>
                  <Link href="/blog/understanding-heating-oil-prices-ni" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Understanding Oil Prices
                  </Link>
                  <p className="text-sm text-gray-500">Market factors and trends</p>
                </li>
                <li>
                  <Link href="/blog/consumer-council-heating-oil-data-explained" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Consumer Council Data Explained
                  </Link>
                  <p className="text-sm text-gray-500">Official regional price reports</p>
                </li>
              </ul>
            </div>

            {/* Suppliers Directory */}
            <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Heating Oil Suppliers</h2>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
                  <p className="text-gray-500 mt-2">Loading supplier directory...</p>
                </div>
              ) : suppliers && Array.isArray(suppliers) && suppliers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suppliers.map((supplier: any) => {
                    const supplierSlug = supplier.name.toLowerCase()
                      .replace(/[^a-z0-9\s]/g, '')
                      .replace(/\s+/g, '-');

                    return (
                      <div key={supplier.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <Link
                          href={`/supplier/${supplierSlug}`}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          {supplier.name}
                        </Link>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>{supplier.location}</p>
                          {supplier.serviceAreas && (
                            <p className="text-xs">Serves: {supplier.serviceAreas}</p>
                          )}
                        </div>
                        {supplier.website && (
                          <a
                            href={supplier.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-xs text-blue-500 hover:text-blue-700 mt-2"
                          >
                            <span>Website</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No suppliers found in directory. Supplier directory is being updated. Please check back soon.
                </p>
              )}
            </div>

            {/* External Resources */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <ExternalLink className="h-5 w-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">External Resources</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://www.consumercouncil.org.uk/home-heating/price-checker"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center space-x-1"
                  >
                    <span>Consumer Council NI</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <p className="text-sm text-gray-500">Official price monitoring data</p>
                </li>
                <li>
                  <a
                    href="https://en.wikipedia.org/wiki/Postcodes_in_the_United_Kingdom#Northern_Ireland"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center space-x-1"
                  >
                    <span>NI Postcode Guide</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <p className="text-sm text-gray-500">Understanding Northern Ireland postcodes</p>
                </li>
              </ul>
            </div>

          </div>

          {/* Site Information */}
          <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">About NI Heating Oil</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div>
                  <h4 className="font-medium text-gray-900">Coverage</h4>
                  <p className="text-gray-600">All six counties of Northern Ireland with comprehensive supplier network</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Data Sources</h4>
                  <p className="text-gray-600">Official Consumer Council data and verified supplier information</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Updates</h4>
                  <p className="text-gray-600">Daily price refreshes, real-time comparison</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}