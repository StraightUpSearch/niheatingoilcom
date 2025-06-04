import { useParams } from "wouter";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function BlogArticle() {
  const params = useParams();
  const slug = params.slug;

  usePageTitle("Blog Article | NI Heating Oil");

  // Mock article data - replace with real data fetching
  const article = {
    title: "How to Save Money on Heating Oil in Northern Ireland",
    content: `
      <h2>Introduction</h2>
      <p>Heating oil is a significant expense for many Northern Ireland households. With the right strategies, you can reduce your heating oil costs significantly.</p>

      <h2>Best Times to Buy</h2>
      <p>The best time to buy heating oil is typically during the summer months when demand is lower. Monitor prices regularly and buy when you spot a good deal.</p>

      <h2>Improve Your Home's Efficiency</h2>
      <p>Simple improvements like better insulation, upgraded heating systems, and regular boiler maintenance can dramatically reduce your heating oil consumption.</p>

      <h2>Join a Buying Group</h2>
      <p>Many areas in Northern Ireland have heating oil buying groups where neighbors pool their orders to get better bulk prices.</p>
    `,
    author: "NI Heating Oil Team",
    publishDate: "2024-01-15",
    readTime: "8 min read",
    category: "Money Saving"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-6">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                {article.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              <div className="flex items-center text-gray-600 text-sm space-x-6">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {article.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(article.publishDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {article.readTime}
                </div>
              </div>
            </div>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}