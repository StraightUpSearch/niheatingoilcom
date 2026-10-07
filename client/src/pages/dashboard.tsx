import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Clock, 
  CheckCircle, 
  Bell, 
  TrendingDown, 
  MapPin, 
  Droplet,
  Plus,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import WhatsAppQuoteReminder from "@/components/whatsapp-quote-reminder";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { usePageTitle } from "@/hooks/usePageTitle";

interface DashboardData {
  tickets: Array<{
    ticket_id: string;
    status: string;
    postcode: string;
    volume: number;
    created_at: string;
  }>;
  alerts: Array<{
    id?: number;
    postcode: string;
    threshold: number;
  }>;
  total_savings: number;
}

interface SavedQuote {
  id: number;
  supplierName: string;
  price: string;
  volume: number;
  postcode: string;
  location: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [newAlert, setNewAlert] = useState({ postcode: "", threshold: "" });

  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    enabled: isAuthenticated,
  });

  const { data: savedQuotes } = useQuery<SavedQuote[]>({
    queryKey: ["saved-quotes"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/saved-quotes");
      return res.json();
    }
  });

  const createAlertMutation = useMutation({
    mutationFn: async (alertData: { postcode: string; threshold_price: number }) => {
      const response = await apiRequest("POST", "/api/alert", alertData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setNewAlert({ postcode: "", threshold: "" });
    }
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest("DELETE", `/api/alerts/${alertId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    }
  });

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();

    const threshold = parseFloat(newAlert.threshold);
    if (!newAlert.postcode || isNaN(threshold)) {
      return;
    }

    createAlertMutation.mutate({
      postcode: newAlert.postcode.toUpperCase(),
      threshold_price: threshold
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-brand-mint text-brand-forest';
      case 'in progress': return 'bg-brand-butter text-yellow-800';
      case 'quoted': return 'bg-brand-mint text-[#0B6A30]';
      case 'closed': return 'bg-muted text-brand-ink';
      default: return 'bg-muted text-brand-ink';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Access Required</h2>
              <p className="text-brand-muted mb-6">
                Please sign in to view your dashboard and track your heating oil enquiries.
              </p>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="w-full"
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-cream p-6">
        <div className="max-w-6xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              Failed to load dashboard data. Please refresh the page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  usePageTitle("Dashboard - NI Heating Oil");

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navigation />
      <div className="min-h-screen bg-brand-cream p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-brand-ink">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-brand-muted">
              Track your heating oil enquiries and manage price alerts
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Enquiries</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.tickets?.filter(t => t.status !== 'closed').length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pending quotes and follow-ups
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Price Alerts</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.alerts?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active monitoring areas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£{dashboardData?.total_savings?.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-muted-foreground">
                  Compared to average prices
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Enquiries */}
          <Card>
            <CardHeader>
              <CardTitle>Your Enquiries</CardTitle>
              <p className="text-sm text-brand-muted">
                Track your heating oil quote requests and send reminders to your WhatsApp
              </p>
            </CardHeader>
            <CardContent>
              {dashboardData?.tickets?.length ? (
                <div className="space-y-4">
                  {dashboardData.tickets.map((ticket) => (
                    <div 
                      key={ticket.ticket_id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-3 sm:space-y-0"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-brand-forest" />
                          <span className="font-medium">{ticket.ticket_id}</span>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-sm text-brand-muted">
                            <MapPin className="h-3 w-3" />
                            <span>{ticket.postcode}</span>
                          </div>

                          <div className="flex items-center space-x-1 text-sm text-brand-muted">
                            <Droplet className="h-3 w-3" />
                            <span>{ticket.volume}L</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                          <span className="text-sm text-brand-muted">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <WhatsAppQuoteReminder ticket={ticket} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-brand-muted mb-4">No enquiries yet</p>
                  <Button onClick={() => window.location.href = "/compare"}>
                    Submit Your First Enquiry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Price Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Alerts */}
              {dashboardData?.alerts?.length ? (
                <div className="space-y-3">
                  {dashboardData.alerts.map((alert, index) => (
                    <div 
                      key={alert.id || index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Bell className="h-4 w-4 text-brand-forest" />
                        <span className="font-medium">{alert.postcode}</span>
                        <span className="text-sm text-brand-muted">
                          Alert when ≤ £{alert.threshold?.toFixed(3) || '0.000'}/litre
                        </span>
                      </div>

                      {alert.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAlertMutation.mutate(alert.id!)}
                          disabled={deleteAlertMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-brand-muted text-center py-4">
                  No price alerts set up yet
                </p>
              )}

              {/* Add New Alert */}
              <form onSubmit={handleCreateAlert} className="border-t pt-4">
                <h4 className="font-medium mb-3">Set New Price Alert</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="alert-postcode">Postcode</Label>
                    <Input
                      id="alert-postcode"
                      value={newAlert.postcode}
                      onChange={(e) => setNewAlert(prev => ({ 
                        ...prev, 
                        postcode: e.target.value.toUpperCase() 
                      }))}
                      placeholder="BT1 1AA"
                      disabled={createAlertMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="alert-threshold">Price Threshold (£/litre)</Label>
                    <Input
                      id="alert-threshold"
                      type="number"
                      step="0.001"
                      value={newAlert.threshold}
                      onChange={(e) => setNewAlert(prev => ({ 
                        ...prev, 
                        threshold: e.target.value 
                      }))}
                      placeholder="0.500"
                      disabled={createAlertMutation.isPending}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button 
                      type="submit"
                      disabled={createAlertMutation.isPending || !newAlert.postcode || !newAlert.threshold}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Alert
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

        {/* Saved Quotes */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Quotes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {savedQuotes && savedQuotes.length > 0 ? (
              <div className="space-y-3">
                {savedQuotes.map((q) => (
                  <div key={q.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between">
                      <span>{q.supplierName}</span>
                      <span>{q.price}</span>
                    </div>
                    <div className="text-sm text-brand-muted">
                      {q.volume}L - {q.postcode}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-brand-muted">No saved quotes yet.</p>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
