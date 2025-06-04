import { Link } from "wouter";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";

const blogArticles = [
  {
    id: "heating-oil-tank-sizes",
    title: "Heating Oil Tank Sizes in Northern Ireland: Comparing 300L, 500L, and 900L Options",
    description: "Choosing between a 300L, 500L, or 900L tank comes down to what your household actually needs, how much space you've got, and how often you want to deal with refills.",
    category: "Equipment Guide",
    date: "2025-06-03",
    readTime: "12 min read",
    slug: "heating-oil-tank-sizes",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center"
  },
  {
    id: "best-time-buy-heating-oil-northern-ireland",
    title: "Best Time to Buy Heating Oil in NI: Key Tips for Saving Money",
    description: "Most of us in Northern Ireland know the drill - heating oil prices go up and down like a yo-yo. But here's the thing: if you time it right, you can save yourself a fair whack of money.",
    category: "Money Saving",
    date: "2025-06-02",
    readTime: "8 min read",
    slug: "best-time-buy-heating-oil-northern-ireland",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&crop=center"
  },
  {
    id: "how-to-dispose-heating-oil-northern-ireland",
    title: "How to Properly Dispose of Home Heating Oil in N.Ireland: Safe and Legal Methods",
    description: "Got some old heating oil that needs disposing of? Here's everything you need to know about getting rid of it safely and legally in Northern Ireland.",
    category: "Safety Guide",
    date: "2025-06-01",
    readTime: "10 min read",
    slug: "how-to-dispose-heating-oil-northern-ireland",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=600&fit=crop&crop=center"
  },
  {
    id: "heating-oil-tank-maintenance-guide",
    title: "Heating Oil Tank Maintenance Guide for Northern Ireland Homes",
    description: "Keep your heating oil tank in top condition with this comprehensive maintenance guide. Learn essential checks, cleaning tips, and when to call professionals.",
    category: "Maintenance",
    date: "2025-05-30",
    readTime: "15 min read",
    slug: "heating-oil-tank-maintenance-guide",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop&crop=center"
  },
  {
    id: "how-to-save-money-heating-oil",
    title: "How to Save Money on Heating Oil: Expert Tips for Northern Ireland Homeowners",
    description: "Discover proven strategies to reduce your heating oil costs. From timing your purchases to improving efficiency, learn how to keep your bills down.",
    category: "Money Saving",
    date: "2025-05-28",
    readTime: "11 min read",
    slug: "how-to-save-money-heating-oil",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&h=600&fit=crop&crop=center"
  }
];

export default function Blog() {
  usePageTitle("Heating Oil Blog & Tips - NI Heating Oil");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Heating Oil Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert advice, industry updates, and money-saving tips for Northern Ireland homeowners
          </p>
        </div>

        {/* Blog Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {blogArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300 bg-white border-gray-200 overflow-hidden">
              {/* Featured Image */}
              <div className="aspect-video overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {article.category}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readTime}
                  </div>
                </div>
                <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${article.slug}`} className="block">
                    {article.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {article.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(article.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <Link 
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Get Free Price Alerts & Save Money
              </h2>
              <p className="mb-6 opacity-90">
                Create your free account to receive personalized price alerts, save your favorite suppliers, and never miss the best heating oil deals in Northern Ireland
              </p>
              <Link href="/auth" className="inline-block">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Create Free Account
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}