import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, User, Mail, Lock, ArrowRight, Phone, MapPin, Calendar, Fuel } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const accountSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AccountFormData = z.infer<typeof accountSchema>;

interface QuoteData {
  supplierName: string;
  price: string;
  volume: number;
  location: string;
  postcode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export default function ThankYouPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/thank-you/:quoteId");
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const { toast } = useToast();

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""
    }
  });

  useEffect(() => {
    // Get quote data from localStorage or URL params
    const storedQuoteData = localStorage.getItem('lastQuote');
    if (storedQuoteData) {
      setQuoteData(JSON.parse(storedQuoteData));
    }
  }, []);

  const createAccountMutation = useMutation({
    mutationFn: async (data: AccountFormData) => {
      const response = await apiRequest("POST", "/api/register", {
        username: data.email,
        password: data.password,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        savedQuote: quoteData
      });
      return response.json();
    },
    onSuccess: () => {
      setAccountCreated(true);
      toast({
        title: "Account Created Successfully!",
        description: "You can now log in to track your quotes and get personalized recommendations.",
      });
      // Clear the stored quote data
      localStorage.removeItem('lastQuote');
    },
    onError: (error: Error) => {
      toast({
        title: "Account Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateAccount = (data: AccountFormData) => {
    createAccountMutation.mutate(data);
  };

  if (!quoteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">No quote data found. Redirecting to home...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quote Request Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600">
            We've sent your quote request to <strong>{quoteData.supplierName}</strong>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Quote Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Fuel className="h-5 w-5 mr-2 text-blue-600" />
                Your Quote Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-blue-900">Total Price</span>
                  <span className="text-2xl font-bold text-blue-600">{quoteData.price}</span>
                </div>
                <div className="text-sm text-blue-700">
                  For {quoteData.volume}L heating oil
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Supplier
                  </span>
                  <span className="font-medium">{quoteData.supplierName}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Location
                  </span>
                  <span className="font-medium">{quoteData.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Delivery Area
                  </span>
                  <span className="font-medium">{quoteData.postcode}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Quote Date
                  </span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Badge variant="outline" className="w-full justify-center py-2">
                  Quote valid for 7 days
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Account Creation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-orange-600" />
                Save Your Quote & Create Account
              </CardTitle>
              <p className="text-sm text-gray-600">
                Create an account to track your quotes, compare prices, and get personalized recommendations.
              </p>
            </CardHeader>
            <CardContent>
              {!accountCreated ? (
                !showAccountForm ? (
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg space-y-3">
                      <h3 className="font-semibold text-orange-900">Benefits of creating an account:</h3>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>• Track your quote history</li>
                        <li>• Get price alerts when better deals are available</li>
                        <li>• Save your delivery preferences</li>
                        <li>• Access exclusive supplier offers</li>
                        <li>• Set up automatic reminders for reorders</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={() => setShowAccountForm(true)}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Create Account & Save Quote
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => setLocation('/')}
                        className="w-full"
                      >
                        Continue Without Account
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={form.handleSubmit(handleCreateAccount)} className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        defaultValue={quoteData.customerName}
                        {...form.register("fullName")}
                      />
                      {form.formState.errors.fullName && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        defaultValue={quoteData.customerEmail}
                        {...form.register("email")}
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        defaultValue={quoteData.customerPhone}
                        {...form.register("phone")}
                      />
                      {form.formState.errors.phone && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        {...form.register("password")}
                      />
                      {form.formState.errors.password && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        {...form.register("confirmPassword")}
                      />
                      {form.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Button 
                        type="submit"
                        disabled={createAccountMutation.isPending}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        {createAccountMutation.isPending ? "Creating Account..." : "Create Account"}
                      </Button>
                      
                      <Button 
                        type="button"
                        variant="ghost"
                        onClick={() => setShowAccountForm(false)}
                        className="w-full"
                      >
                        Back
                      </Button>
                    </div>
                  </form>
                )
              ) : (
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-green-900">Account Created Successfully!</h3>
                  <p className="text-sm text-green-700">
                    Your quote has been saved to your account. You can now log in to track your quotes and access exclusive features.
                  </p>
                  <Button 
                    onClick={() => setLocation('/auth')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Sign In to Your Account
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Supplier Contact</h3>
                <p className="text-sm text-gray-600">
                  {quoteData.supplierName} will contact you within 24 hours to confirm pricing and arrange delivery.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                  <span className="text-orange-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Delivery Arranged</h3>
                <p className="text-sm text-gray-600">
                  Schedule a convenient delivery time that works for you. Most deliveries happen within 1-3 days.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Stay Warm</h3>
                <p className="text-sm text-gray-600">
                  Enjoy reliable heating with quality oil delivered right to your tank. Set up reminders for your next order.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-gray-600">
            Need help or have questions? Contact us at{" "}
            <a href="tel:02828766816" className="text-blue-600 hover:underline">
              028 2876 6816
            </a>
          </p>
          
          <div className="space-x-4">
            <Button variant="outline" onClick={() => setLocation('/')}>
              Back to Home
            </Button>
            <Button onClick={() => setLocation('/prices')}>
              Compare More Prices
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}