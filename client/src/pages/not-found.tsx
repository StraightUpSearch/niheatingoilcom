import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PageShell, PageHero, OverlapSection } from "@/components/brand-ui";

export default function NotFound() {
  usePageTitle("Page Not Found | NI Heating Oil");

  return (
    <PageShell>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }]}
        title="That page is "
        accent="not here"
        overlap
      />
      <OverlapSection>
        <div className="pb-20 text-center max-w-md mx-auto">
          <h1 className="text-7xl font-display font-extrabold text-brand-line mb-4">404</h1>
          <p className="text-brand-muted mb-8">
            Sorry, we couldn't find the page you're looking for. It may have been moved or no longer exists.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
                Compare Prices
              </Button>
            </Link>
          </div>
        </div>
      </OverlapSection>
    </PageShell>
  );
}
