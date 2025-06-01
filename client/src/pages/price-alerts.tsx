import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import PriceAlertsForm from "@/components/price-alerts-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Trash2, Bell, BellOff } from "lucide-react";

export default function PriceAlerts() {
  usePageTitle("Heating Oil Price Alerts - Northern Ireland | NI Heating Oil");
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/alerts"],
    enabled: isAuthenticated,
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest("DELETE", `/api/alerts/${alertId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Success",
        description: "Price alert deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
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
        description: "Failed to delete price alert",
        variant: "destructive",
      });
    },
  });

  const toggleAlertMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      await apiRequest("PUT", `/api/alerts/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Success",
        description: "Price alert updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
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
        description: "Failed to update price alert",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated && !isLoading) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Price Alerts</h1>
            <p className="text-gray-600">
              Set up price alerts to get notified when heating oil prices drop in your area
            </p>
          </div>
        </div>
      </section>

      {/* Create New Alert */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Create New Price Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceAlertsForm />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Existing Alerts */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Active Alerts</h2>
          
          {alertsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : alerts?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Price Alerts</h3>
                <p className="text-gray-600">Create your first price alert to get notified when prices drop.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {alerts?.map((alert: any) => (
                <Card key={alert.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {alert.postcode} - {alert.volume}L
                          </h3>
                          <Badge variant={alert.isActive ? "default" : "secondary"}>
                            {alert.isActive ? "Active" : "Paused"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Email: {alert.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          Alert threshold: {alert.thresholdType === 'any' ? 'Any price drop' : 
                            alert.thresholdType === '2percent' ? 'Price drops 2%+' : 'Price drops 5%+'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          {alert.emailAlerts && <span>📧 Email alerts</span>}
                          {alert.smsAlerts && <span>📱 SMS alerts</span>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAlertMutation.mutate({
                            id: alert.id,
                            isActive: !alert.isActive
                          })}
                          disabled={toggleAlertMutation.isPending}
                        >
                          {alert.isActive ? (
                            <>
                              <BellOff className="h-4 w-4 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Bell className="h-4 w-4 mr-1" />
                              Resume
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteAlertMutation.mutate(alert.id)}
                          disabled={deleteAlertMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
