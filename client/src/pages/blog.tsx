import { Link } from "wouter";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

// Placeholder for blog articles - you can add your HTML articles here
const blogArticles = [
  {
    id: "heating-oil-tank-sizes",
    title: "Heating Oil Tank Sizes in Northern Ireland: Comparing 300L, 500L, and 900L Options",
    description: "Choosing between a 300L, 500L, or 900L tank comes down to what your household actually needs, how much space you've got, and how often you want to deal with refills.",
    category: "Equipment Guide",
    date: "2025-06-03",
    readTime: "12 min read",
    slug: "heating-oil-tank-sizes"
  },
  {
    id: "heating-oil-tips-winter-2024",
    title: "Essential Heating Oil Tips for Winter 2024",
    description: "Stay warm and save money with these expert heating oil tips for the colder months.",
    category: "Heating Tips",
    date: "2024-12-15",
    readTime: "5 min read",
    slug: "heating-oil-tips-winter-2024"
  },
  {
    id: "understanding-oil-prices-ni",
    title: "Understanding Heating Oil Prices in Northern Ireland",
    description: "A comprehensive guide to factors affecting heating oil prices across NI regions.",
    category: "Price Updates",
    date: "2024-12-10", 
    readTime: "7 min read",
    slug: "understanding-oil-prices-ni"
  },
  {
    id: "tank-maintenance-guide",
    title: "Complete Tank Maintenance Guide",
    description: "Keep your heating oil tank in perfect condition with this detailed maintenance guide.",
    category: "Maintenance",
    date: "2024-12-05",
    readTime: "6 min read", 
    slug: "tank-maintenance-guide"
  }
];

export default function Blog() {
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
            <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300 bg-white border-gray-200">
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
                Need a Heating Oil Quote?
              </h2>
              <p className="mb-6 opacity-90">
                Compare prices from 25+ local suppliers and save money on your next oil delivery
              </p>
              <Link href="/" className="inline-block">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Compare Prices Now
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}