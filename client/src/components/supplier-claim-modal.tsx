import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Building2, Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SupplierClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierName?: string;
}

interface SupplierClaimForm {
  supplierName: string;
  contactName: string;
  email: string;
  phone: string;
  businessAddress: string;
  coverageAreas: string;
  currentPricing: string;
  message: string;
}

export default function SupplierClaimModal({ isOpen, onClose, supplierName = "" }: SupplierClaimModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<SupplierClaimForm>({
    supplierName: supplierName,
    contactName: "",
    email: "",
    phone: "",
    businessAddress: "",
    coverageAreas: "",
    currentPricing: "",
    message: ""
  });

  const claimMutation = useMutation({
    mutationFn: async (data: SupplierClaimForm) => {
      return await apiRequest("/api/supplier-claims", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Claim Request Submitted",
        description: "We'll review your claim and contact you within 24 hours.",
      });
      onClose();
      setFormData({
        supplierName: "",
        contactName: "",
        email: "",
        phone: "",
        businessAddress: "",
        coverageAreas: "",
        currentPricing: "",
        message: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/supplier-claims"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit claim request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    claimMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof SupplierClaimForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Claim Your Supplier Listing
          </DialogTitle>
          <DialogDescription>
            Are you a heating oil supplier? Claim your listing to manage your pricing and get more customers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplierName">
                <Building2 className="inline h-4 w-4 mr-1" />
                Supplier/Business Name *
              </Label>
              <Input
                id="supplierName"
                value={formData.supplierName}
                onChange={(e) => handleInputChange("supplierName", e.target.value)}
                placeholder="e.g. North Coast Heating"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="contactName">Contact Person Name *</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleInputChange("contactName", e.target.value)}
                placeholder="Your full name"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">
                <Mail className="inline h-4 w-4 mr-1" />
                Business Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="contact@yourcompany.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">
                <Phone className="inline h-4 w-4 mr-1" />
                Business Phone *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="028 1234 5678"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="businessAddress">
              <MapPin className="inline h-4 w-4 mr-1" />
              Business Address *
            </Label>
            <Input
              id="businessAddress"
              value={formData.businessAddress}
              onChange={(e) => handleInputChange("businessAddress", e.target.value)}
              placeholder="Full business address including postcode"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="coverageAreas">Coverage Areas *</Label>
            <Input
              id="coverageAreas"
              value={formData.coverageAreas}
              onChange={(e) => handleInputChange("coverageAreas", e.target.value)}
              placeholder="e.g. BT51 to BT57, Coleraine, Ballymena, Portrush"
              required
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              List the postcode areas and towns you deliver to
            </p>
          </div>

          <div>
            <Label htmlFor="currentPricing">Current Pricing Information</Label>
            <Textarea
              id="currentPricing"
              value={formData.currentPricing}
              onChange={(e) => handleInputChange("currentPricing", e.target.value)}
              placeholder="e.g. 300L: £155, 500L: £240, 900L: £430 (include any minimum orders or delivery charges)"
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="message">Additional Information</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Tell us about your business, years in operation, special services, etc."
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={claimMutation.isPending}
              className="flex-1 bg-primary text-white hover:bg-primary/90"
            >
              {claimMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting Claim...
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4 mr-2" />
                  Submit Claim Request
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• We'll verify your business details within 24 hours</li>
            <li>• You'll receive login credentials to manage your listing</li>
            <li>• Update your prices anytime to stay competitive</li>
            <li>• Get more customers through our platform</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}