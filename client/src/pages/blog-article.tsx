import { useRoute } from "wouter";
import Navigation from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// This will hold your HTML articles
const articles = {
  "heating-oil-tips-winter-2024": {
    title: "Essential Heating Oil Tips for Winter 2024",
    category: "Heating Tips",
    date: "2024-12-15",
    readTime: "5 min read",
    content: `
      <p>Your HTML content will go here...</p>
      <h2>Winter Heating Tips</h2>
      <p>More content...</p>
    `
  },
  "understanding-oil-prices-ni": {
    title: "Understanding Heating Oil Prices in Northern Ireland",
    category: "Price Updates", 
    date: "2024-12-10",
    readTime: "7 min read",
    content: `
      <p>Your HTML content will go here...</p>
      <h2>Price Factors</h2>
      <p>More content...</p>
    `
  },
  "tank-maintenance-guide": {
    title: "Complete Tank Maintenance Guide",
    category: "Maintenance",
    date: "2024-12-05", 
    readTime: "6 min read",
    content: `
      <p>Your HTML content will go here...</p>
      <h2>Maintenance Schedule</h2>
      <p>More content...</p>
    `
  }
};

export default function BlogArticle() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  
  if (!slug || !articles[slug as keyof typeof articles]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const article = articles[slug as keyof typeof articles];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {/* Article */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {article.category}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(article.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long', 
                    year: 'numeric'
                  })}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.readTime}
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Call to Action */}
            <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white text-center">
              <h3 className="text-xl font-bold mb-2">Need a Heating Oil Quote?</h3>
              <p className="mb-4 opacity-90">Compare prices from 25+ local suppliers in Northern Ireland</p>
              <Link href="/">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Get Your Quote
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}