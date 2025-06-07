import { useParams } from "wouter";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { blogArticles } from "@/lib/blogArticles";

export default function BlogArticle() {
  const params = useParams();
  const slug = params.slug;

  usePageTitle("Blog Article | NI Heating Oil");

  const article = blogArticles.find(a => a.slug === slug);

  if (!article) {
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
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
              <p className="text-gray-600">Sorry, we couldn't find the blog post you're looking for.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                  {new Date(article.date).toLocaleDateString()}
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