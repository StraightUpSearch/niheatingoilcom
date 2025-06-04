import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Plus, Trash2, MapPin } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function AlertsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newAlert, setNewAlert] = useState({
    postcode: "",
    volume: 300,
    targetPrice: "",
    alertType: "below"
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorised",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['/api/alerts'],
    enabled: isAuthenticated,
    retry: false,
  });

  const createAlertMutation = useMutation({
    mutationFn: async (alertData: any) => {
      await apiRequest('/api/alerts', {
        method: 'POST',
        body: JSON.stringify(alertData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      setNewAlert({ postcode: "", volume: 300, targetPrice: "", alertType: "below" });
      toast({
        title: "Price Alert Created",
        description: "You'll be notified when prices meet your criteria.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorised",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create price alert. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest(`/api/alerts/${alertId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: "Alert Deleted",
        description: "Price alert has been removed.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorised",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete alert. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlert.postcode || !newAlert.targetPrice) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createAlertMutation.mutate({
      postcode: newAlert.postcode.toUpperCase(),
      volume: newAlert.volume,
      targetPrice: parseFloat(newAlert.targetPrice) * 100, // Convert to pence
      alertType: newAlert.alertType,
      isActive: true
    });
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-centre mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Price Alerts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Set up personalised price alerts and never miss a great heating oil deal. 
            We'll notify you when prices drop below your target.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <Plus className="h-5 w-5 mr-2" />
                Create New Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAlert} className="space-y-4">
                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    placeholder="e.g. BT1 1AA"
                    value={newAlert.postcode}
                    onChange={(e) => setNewAlert({ ...newAlert, postcode: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="volume">Volume (Litres)</Label>
                  <Select
                    value={newAlert.volume.toString()}
                    onValueChange={(value) => setNewAlert({ ...newAlert, volume: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">300 Litres</SelectItem>
                      <SelectItem value="500">500 Litres</SelectItem>
                      <SelectItem value="900">900 Litres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="targetPrice">Target Price (£ per litre)</Label>
                  <Input
                    id="targetPrice"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 1.45"
                    value={newAlert.targetPrice}
                    onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="alertType">Alert When Price</Label>
                  <Select
                    value={newAlert.alertType}
                    onValueChange={(value) => setNewAlert({ ...newAlert, alertType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below">Falls Below Target</SelectItem>
                      <SelectItem value="above">Rises Above Target</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createAlertMutation.isPending}
                >
                  {createAlertMutation.isPending ? "Creating..." : "Create Alert"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <Bell className="h-5 w-5 mr-2" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : alerts?.length === 0 ? (
                <div className="text-centre py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No active alerts yet.</p>
                  <p className="text-sm text-gray-500">Create your first alert to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts?.map((alert: any) => (
                    <div key={alert.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-centre gap-2 mb-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{alert.postcode}</span>
                            <Badge variant={alert.isActive ? "default" : "secondary"}>
                              {alert.isActive ? "Active" : "Paused"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {alert.volume}L - Alert when price {alert.alertType} £
                            {(alert.targetPrice / 100).toFixed(2)} per litre
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAlertMutation.mutate(alert.id)}
                          disabled={deleteAlertMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How Price Alerts Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-centre">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-centre justify-centre">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Set Your Target</h3>
              <p className="text-gray-600 text-sm">
                Choose your postcode, volume, and target price. We'll monitor the market for you.
              </p>
            </div>
            <div className="text-centre">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-centre justify-centre">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">We Monitor Prices</h3>
              <p className="text-gray-600 text-sm">
                Our system continuously tracks prices from verified suppliers in your area.
              </p>
            </div>
            <div className="text-centre">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-centre justify-centre">
                <Plus className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Instant Notification</h3>
              <p className="text-gray-600 text-sm">
                Get email alerts the moment prices meet your criteria, so you never miss a deal.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}