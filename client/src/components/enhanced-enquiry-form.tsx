import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, User, Mail, Droplet } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import SmartPostcodeInput from "@/components/smart-postcode-input";

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  postcode: z.string()
    .min(3, "Please enter your postcode")
    .regex(/^BT\d{1,2}\s?\d[A-Z]{2}$/i, "Please enter a valid Northern Ireland postcode (e.g., BT1 1AA)"),
  litres: z.number()
    .min(100, "Minimum order is 100 litres")
    .max(2000, "Maximum order is 2000 litres")
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

interface EnquiryResponse {
  ticketId: string;
  message: string;
  leadId: number;
}

export default function EnhancedEnquiryForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketInfo, setTicketInfo] = useState<EnquiryResponse | null>(null);

  const form = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      email: "",
      postcode: "",
      litres: 500
    }
  });

  const enquiryMutation = useMutation({
    mutationFn: async (data: EnquiryFormData) => {
      const response = await apiRequest("POST", "/api/enquiry", data);
      return await response.json() as EnquiryResponse;
    },
    onSuccess: (data) => {
      setTicketInfo(data);
      setShowSuccess(true);
      form.reset();
    },
    onError: (error: Error) => {
      console.error("Enquiry submission failed:", error);
    }
  });

  const onSubmit = (data: EnquiryFormData) => {
    enquiryMutation.mutate(data);
  };

  if (showSuccess && ticketInfo) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-xl text-green-700">Enquiry Received!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              {ticketInfo.message}
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Your Reference: {ticketInfo.ticketId}</h3>
            <p className="text-sm text-gray-600 mb-3">
              A specialist will review and reply within 2 hours with your personalized quote.
            </p>
            
            <div className="space-y-2 text-sm">
              <p><strong>What happens next:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>We'll check the best rates from local suppliers</li>
                <li>Calculate your potential savings</li>
                <li>Email you a detailed quote</li>
                <li>No hidden fees or obligations</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Create a free account to:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Track enquiry status</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Set price alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>View savings history</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Get priority quotes</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Free Account
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowSuccess(false);
                  setTicketInfo(null);
                }}
              >
                Submit Another Enquiry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-center">Get Your Best Heating Oil Quote</CardTitle>
        <p className="text-center text-gray-600">
          Compare prices from verified Northern Ireland suppliers
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="John Smith"
                  className="pl-10"
                  disabled={enquiryMutation.isPending}
                />
              </div>
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="john@example.com"
                  className="pl-10"
                  disabled={enquiryMutation.isPending}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postcode">Northern Ireland Postcode</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="postcode"
                  {...form.register("postcode")}
                  placeholder="BT1 1AA"
                  className="pl-10"
                  disabled={enquiryMutation.isPending}
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              {form.formState.errors.postcode && (
                <p className="text-sm text-red-600">{form.formState.errors.postcode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="litres">Litres Required</Label>
              <div className="relative">
                <Droplet className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="litres"
                  type="number"
                  {...form.register("litres")}
                  placeholder="500"
                  min="100"
                  max="2000"
                  className="pl-10"
                  disabled={enquiryMutation.isPending}
                />
              </div>
              {form.formState.errors.litres && (
                <p className="text-sm text-red-600">{form.formState.errors.litres.message}</p>
              )}
            </div>
          </div>

          {enquiryMutation.isError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {enquiryMutation.error?.message || "Failed to submit enquiry. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Why choose us?</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
              <div>✓ Best rates guaranteed</div>
              <div>✓ Local suppliers only</div>
              <div>✓ Free price comparison</div>
              <div>✓ Fast delivery service</div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
            disabled={enquiryMutation.isPending}
          >
            {enquiryMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Enquiry...
              </>
            ) : (
              "Get My Quote"
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            By submitting this form, you agree to receive pricing information via email. 
            No spam, unsubscribe anytime.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}