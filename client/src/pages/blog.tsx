import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

const blogArticles = [
  {
    id: "cheapest-time-buy-heating-oil-northern-ireland",
    title: "When Is the Cheapest Time to Buy Heating Oil in Northern Ireland?",
    description: "Heating oil prices in NI follow seasonal patterns. Here's how to time your purchase to pay the lowest price possible.",
    category: "Buying Guide",
    date: "2026-09-14",
    readTime: "7 min read",
    slug: "cheapest-time-buy-heating-oil-northern-ireland",
    image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop&crop=center"
  },
  {
    id: "find-best-heating-oil-prices-northern-ireland",
    title: "How to Find the Best Heating Oil Prices in Northern Ireland",
    description: "A practical guide to comparing heating oil prices across NI suppliers and getting the cheapest deal every time you order.",
    category: "Comparison Guide",
    date: "2026-09-14",
    readTime: "6 min read",
    slug: "find-best-heating-oil-prices-northern-ireland",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center"
  },
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "NI Heating Oil Blog",
    "description": "Expert advice and money-saving tips for Northern Ireland heating oil consumers.",
    "url": "https://niheatingoil.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "NI Heating Oil"
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <SEOHead
        title="Heating Oil Blog & Tips - NI Heating Oil"
        description="Expert advice, industry updates, and money-saving tips for Northern Ireland heating oil consumers."
        keywords="heating oil tips, Northern Ireland, oil tank maintenance, save money heating oil, heating oil guide"
        canonicalUrl="https://niheatingoil.com/blog"
        structuredData={structuredData}
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-ink tracking-tight">
            Heating Oil Blog
          </h1>
          <p className="mt-2 text-brand-muted max-w-xl">
            Expert advice and money-saving tips for Northern Ireland homeowners.
          </p>
        </div>

        <div className="space-y-6">
          {blogArticles.map((article, index) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="block group">
              <article className={`bg-white rounded-lg border border-brand-line overflow-hidden transition-shadow hover:shadow-sm ${index === 0 ? "sm:flex" : ""}`}>
                <div className={`aspect-video overflow-hidden ${index === 0 ? "sm:w-2/5 sm:aspect-auto sm:min-h-full" : ""}`}>
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
                <div className={`p-5 ${index === 0 ? "sm:w-3/5 sm:p-6" : ""}`}>
                  <div className="flex items-center gap-3 text-xs text-brand-muted mb-2">
                    <span className="font-medium text-brand-ink bg-muted px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h2 className={`font-semibold text-brand-ink group-hover:text-[#8A3B12] transition-colors ${index === 0 ? "text-xl sm:text-2xl" : "text-lg"}`}>
                    {article.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-brand-muted line-clamp-2">
                    {article.description}
                  </p>
                  <span className="mt-3 inline-flex items-center text-sm font-medium text-[#8A3B12] group-hover:text-[#8A3B12] transition-colors">
                    Read article
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white border border-brand-line rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-brand-ink">
            Find the cheapest heating oil near you
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            Compare prices from suppliers across Northern Ireland in seconds.
          </p>
          <Link href="/">
            <button className="mt-4 px-5 py-2.5 bg-brand-gold hover:brightness-95 text-white font-medium rounded-lg transition-colors text-sm">
              Compare prices
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}