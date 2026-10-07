import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

// Latest blog articles data
const latestBlogArticles = [
  {
    id: "heating-oil-tank-sizes",
    title: "Heating Oil Tank Sizes in Northern Ireland: Comparing 300L, 500L, and 900L Options",
    description: "Choosing between a 300L, 500L, or 900L tank comes down to what your household actually needs, how much space you've got, and how often you want to deal with refills.",
    category: "Equipment Guide",
    date: "2025-06-03",
    readTime: "12 min read",
    slug: "heating-oil-tank-sizes",
    featuredImage: "https://koala.sh/api/image/v2-vnxed-nzz6i.jpg?width=400&height=250",
    featured: true
  },
  {
    id: "how-to-dispose-home-heating-oil",
    title: "How to Properly Dispose of Home Heating Oil in N. Ireland",
    description: "Safe and legal methods for households to dispose of old or leftover heating oil. Learn about professional removal services and environmental regulations.",
    category: "Safety Guide",
    date: "2025-06-03",
    readTime: "15 min read",
    slug: "how-to-dispose-home-heating-oil",
    featuredImage: "https://koala.sh/api/image/v2-vr1r0-4n63v.jpg?width=400&height=250",
    featured: true
  },
  {
    id: "best-time-to-buy-heating-oil-ni",
    title: "Best Time to Buy Heating Oil NI: Key Tips for Saving Money",
    description: "Most of us in Northern Ireland depend on heating oil to stay warm, but timing our orders can make a real difference to our wallets.",
    category: "Money Saving",
    date: "2025-06-03",
    readTime: "14 min read",
    slug: "best-time-to-buy-heating-oil-ni",
    featuredImage: "https://koala.sh/api/image/v2-vr2jh-wnqxi.jpg?width=400&height=250",
    featured: true
  }
];

export default function BlogCarousel() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-brand-forest mr-3" />
            <h2 className="text-3xl font-bold text-brand-ink">
              Latest Heating Oil Guides
            </h2>
          </div>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto">
            Expert advice and comprehensive guides to help Northern Ireland homeowners make informed heating oil decisions
          </p>
        </div>

        {/* Blog Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {latestBlogArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-xl transition-all duration-300 bg-white border-brand-line group hover:-translate-y-1 overflow-hidden">
              {/* Featured Image */}
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="bg-brand-mint text-brand-forest font-medium">
                    {article.category}
                  </Badge>
                  <div className="flex items-center text-sm text-brand-muted">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readTime}
                  </div>
                </div>
                <CardTitle className="text-xl leading-tight group-hover:text-brand-forest transition-colors">
                  <Link href={`/blog/${article.slug}`} className="block">
                    {article.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-brand-muted leading-relaxed">
                  {article.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-brand-muted">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(article.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <Link 
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center text-brand-forest hover:text-brand-forest font-medium transition-colors group"
                  >
                    Read Guide
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Placeholder cards for when we have more articles */}
          {latestBlogArticles.length < 3 && (
            <>
              <Card className="border-2 border-dashed border-brand-line bg-brand-cream hover:border-brand-line hover:bg-brand-mint transition-colors">
                <CardHeader className="text-center py-12">
                  <div className="flex items-center justify-center mb-4">
                    <BookOpen className="h-12 w-12 text-brand-muted" />
                  </div>
                  <CardTitle className="text-brand-muted">More Guides Coming Soon</CardTitle>
                  <CardDescription className="text-brand-muted">
                    We're working on comprehensive guides about heating oil prices, seasonal buying tips, and tank maintenance.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-2 border-dashed border-brand-line bg-brand-cream hover:border-brand-line hover:bg-brand-mint transition-colors">
                <CardHeader className="text-center py-12">
                  <div className="flex items-center justify-center mb-4">
                    <BookOpen className="h-12 w-12 text-brand-muted" />
                  </div>
                  <CardTitle className="text-brand-muted">Expert Tips & Advice</CardTitle>
                  <CardDescription className="text-brand-muted">
                    Local insights for Northern Ireland homeowners on getting the best heating oil deals and maintaining your system.
                  </CardDescription>
                </CardHeader>
              </Card>
            </>
          )}
        </div>

        {/* View All Blog Link */}
        <div className="text-center mt-12">
          <Link 
            href="/blog"
            className="inline-flex items-center px-8 py-3 bg-brand-forest text-white font-medium rounded-lg hover:bg-brand-forest-soft transition-colors shadow-md hover:shadow-lg"
          >
            View All Guides
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}