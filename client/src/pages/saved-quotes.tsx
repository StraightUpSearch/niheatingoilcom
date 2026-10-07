import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PageShell, PageHero, OverlapSection, SurfaceCard } from "@/components/brand-ui";

interface SavedQuote {
  id: number;
  supplierName: string;
  price: string;
  volume: number;
  postcode: string;
  location: string;
  createdAt: string;
}

export default function SavedQuotesPage() {
  const { user, isAuthenticated } = useAuth();
  usePageTitle("Saved Quotes - NI Heating Oil");

  const { data, isLoading, error } = useQuery<SavedQuote[]>({
    queryKey: ["saved-quotes"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/saved-quotes");
      return res.json();
    }
  });

  if (!isAuthenticated) {
    return (
      <PageShell>
        <div className="flex-1 flex items-center justify-center p-6">
          <SurfaceCard tone="paper" className="max-w-sm w-full text-center space-y-4">
            <p>Please sign in to view your saved quotes.</p>
            <Button onClick={() => (window.location.href = "/api/login")}>Sign In</Button>
          </SurfaceCard>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Saved Quotes" }]}
        title="Saved "
        accent="Quotes"
        overlap
      />
      <OverlapSection>
        <div className="pb-16 max-w-4xl mx-auto space-y-4">
          {isLoading && <p className="text-brand-muted">Loading...</p>}
          {error && (
            <Alert>
              <AlertDescription>Failed to load saved quotes.</AlertDescription>
            </Alert>
          )}
          {data && data.length === 0 && <p className="text-brand-muted">No saved quotes yet.</p>}
          {data && data.length > 0 && (
            <div className="space-y-3">
              {data.map((quote) => (
                <SurfaceCard key={quote.id} tone="paper" radius="row" className="p-5">
                  <p className="font-semibold text-brand-ink">{quote.supplierName}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-sm text-brand-muted">
                    <span>Price: {quote.price}</span>
                    <span>Volume: {quote.volume}L</span>
                    <span>Postcode: {quote.postcode}</span>
                    <span className="text-xs">Saved {new Date(quote.createdAt).toLocaleDateString()}</span>
                  </div>
                </SurfaceCard>
              ))}
            </div>
          )}
        </div>
      </OverlapSection>
    </PageShell>
  );
}
