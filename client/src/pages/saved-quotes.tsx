import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { usePageTitle } from "@/hooks/usePageTitle";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <p>Please sign in to view your saved quotes.</p>
            <Button onClick={() => (window.location.href = "/api/login")}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Saved Quotes</h1>
        {isLoading && <p>Loading...</p>}
        {error && (
          <Alert>
            <AlertDescription>Failed to load saved quotes.</AlertDescription>
          </Alert>
        )}
        {data && data.length === 0 && <p>No saved quotes yet.</p>}
        {data && data.length > 0 && (
          <div className="space-y-4">
            {data.map((quote) => (
              <Card key={quote.id}>
                <CardHeader>
                  <CardTitle>{quote.supplierName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-sm">Price: {quote.price}</p>
                  <p className="text-sm">Volume: {quote.volume}L</p>
                  <p className="text-sm">Postcode: {quote.postcode}</p>
                  <p className="text-xs text-gray-500">Saved {new Date(quote.createdAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
