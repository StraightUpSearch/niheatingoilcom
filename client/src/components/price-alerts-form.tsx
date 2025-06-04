import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { apiRequest } from "../lib/queryClient";
import { isUnauthorizedError } from "../lib/authUtils";
import { Bell } from "lucide-react";

export default function PriceAlertsForm() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    email: user?.email || "",
    postcode: "",
    volume: "300",
    thresholdType: "any",
    emailAlerts: true,
    smsAlerts: false,
  });

  const createAlertMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!isAuthenticated) {
        // For non-authenticated users, just show a message
        throw new Error("Please sign in to create price alerts");
      }
      
      await apiRequest("POST", "/api/alerts", {
        email: data.email,
        postcode: data.postcode.toUpperCase(),
        volume: parseInt(data.volume),
        thresholdType: data.thresholdType,
        emailAlerts: data.emailAlerts,
        smsAlerts: data.smsAlerts,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Price alert created successfully. You'll be notified when prices drop.",
      });
      
      // Reset form
      setFormData({
        email: user?.email || "",
        postcode: "",
        volume: "300",
        thresholdType: "any",
        emailAlerts: true,
        smsAlerts: false,
      });
      
      // Refresh alerts if on authenticated page
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      }
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please Sign In",
          description: "Sign in to create price alerts and track your savings.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 2000);
        return;
      }
      
      toast({
        title: "Error",
        description: error.message || "Failed to create price alert. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.postcode) {
      toast({
        title: "Missing Information",
        description: "Please fill in your email and postcode.",
        variant: "destructive",
      });
      return;
    }
    
    createAlertMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // If on landing page and not authenticated, show the full section
  if (!isAuthenticated) {
    return (
      <section className="py-16 bg-gradient-to-r from-primary to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-4">Never Miss a Great Deal</h2>
            <p className="text-xl text-blue-100 mb-8">
              Get instant alerts when prices drop in your area or when your preferred supplier offers a better deal.
            </p>
            
            <div className="bg-white rounded-xl p-8 text-gray-900 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-6">Set Up Price Alerts</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Your email address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postcode">Your postcode</Label>
                    <Input
                      id="postcode"
                      type="text"
                      value={formData.postcode}
                      onChange={(e) => handleInputChange('postcode', e.target.value)}
                      placeholder="BT1 5GS"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="volume">Volume</Label>
                    <Select value={formData.volume} onValueChange={(value) => handleInputChange('volume', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">300L</SelectItem>
                        <SelectItem value="500">500L</SelectItem>
                        <SelectItem value="900">900L</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="threshold">Alert threshold</Label>
                    <Select value={formData.thresholdType} onValueChange={(value) => handleInputChange('thresholdType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Alert me for any price drop</SelectItem>
                        <SelectItem value="2percent">Alert when prices drop 2%+</SelectItem>
                        <SelectItem value="5percent">Alert when prices drop 5%+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emailAlerts"
                      checked={formData.emailAlerts}
                      onCheckedChange={(checked) => handleInputChange('emailAlerts', checked)}
                    />
                    <Label htmlFor="emailAlerts">Email alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smsAlerts"
                      checked={formData.smsAlerts}
                      onCheckedChange={(checked) => handleInputChange('smsAlerts', checked)}
                    />
                    <Label htmlFor="smsAlerts">SMS alerts</Label>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-accent text-white hover:bg-orange-600"
                  disabled={createAlertMutation.isPending}
                >
                  {createAlertMutation.isPending ? "Creating Alert..." : "Start Saving with Price Alerts"}
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-4">
                We'll never spam you. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // For authenticated users, show a simple form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            type="text"
            value={formData.postcode}
            onChange={(e) => handleInputChange('postcode', e.target.value)}
            placeholder="BT1 5GS"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="volume">Volume</Label>
          <Select value={formData.volume} onValueChange={(value) => handleInputChange('volume', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="300">300L</SelectItem>
              <SelectItem value="500">500L</SelectItem>
              <SelectItem value="900">900L</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="threshold">Alert threshold</Label>
          <Select value={formData.thresholdType} onValueChange={(value) => handleInputChange('thresholdType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Alert me for any price drop</SelectItem>
              <SelectItem value="2percent">Alert when prices drop 2%+</SelectItem>
              <SelectItem value="5percent">Alert when prices drop 5%+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="emailAlerts"
            checked={formData.emailAlerts}
            onCheckedChange={(checked) => handleInputChange('emailAlerts', checked)}
          />
          <Label htmlFor="emailAlerts">Email alerts</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="smsAlerts"
            checked={formData.smsAlerts}
            onCheckedChange={(checked) => handleInputChange('smsAlerts', checked)}
          />
          <Label htmlFor="smsAlerts">SMS alerts</Label>
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-primary text-white hover:bg-blue-700"
        disabled={createAlertMutation.isPending}
      >
        <Bell className="h-4 w-4 mr-2" />
        {createAlertMutation.isPending ? "Creating Alert..." : "Create Price Alert"}
      </Button>
    </form>
  );
}
