import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Loader2, Award, Building, Mail, Phone, FileText } from "lucide-react";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { Supplier } from "@shared/schema";

interface ClaimListingDialogProps {
  supplier: Supplier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClaimListingDialog({ supplier, open, onOpenChange }: ClaimListingDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    contactName: "",
    businessEmail: "",
    businessPhone: "",
    jobTitle: "",
    relationship: "",
    verificationDocuments: "",
    additionalInfo: "",
  });

  const claimMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/supplier-claims", {
        supplierId: supplier.id,
        ...data,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Claim Submitted Successfully!",
        description: "We'll review your claim and get back to you within 2-3 business days.",
      });
      onOpenChange(false);
      setFormData({
        contactName: "",
        businessEmail: "",
        businessPhone: "",
        jobTitle: "",
        relationship: "",
        verificationDocuments: "",
        additionalInfo: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Claim Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    claimMutation.mutate(formData);
  };

  const isValid = formData.contactName && formData.businessEmail && formData.relationship;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Award className="h-5 w-5 text-yellow-500" />
            Claim Your Business Listing
          </DialogTitle>
          <DialogDescription className="text-base">
            Claiming your listing for <strong>{supplier.name}</strong> allows you to manage your business information, 
            update pricing, and respond to customer inquiries directly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Building className="h-5 w-5" />
              Contact Information
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Full Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="e.g., Owner, Manager, Director"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessEmail">Business Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="businessEmail"
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                    placeholder="your.business@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessPhone">Business Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="businessPhone"
                    type="tel"
                    value={formData.businessPhone}
                    onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                    placeholder="028 XXXX XXXX"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Relationship */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <FileText className="h-5 w-5" />
              Business Verification
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship to Business *</Label>
              <Select value={formData.relationship} onValueChange={(value) => setFormData({ ...formData, relationship: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your relationship to this business" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                  <SelectItem value="authorized-representative">Authorized Representative</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationDocuments">Verification Documents</Label>
              <Textarea
                id="verificationDocuments"
                value={formData.verificationDocuments}
                onChange={(e) => setFormData({ ...formData, verificationDocuments: e.target.value })}
                placeholder="List any documents you can provide for verification (e.g., business registration, VAT number, company website admin access, etc.)"
                rows={3}
              />
              <p className="text-sm text-gray-500">
                Help us verify your claim by listing available documentation
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                placeholder="Any additional information that would help us verify your claim or improve your listing"
                rows={3}
              />
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• We'll review your claim within 2-3 business days</li>
              <li>• You may be contacted for additional verification</li>
              <li>• Once approved, you'll receive login credentials to manage your listing</li>
              <li>• You'll be able to update prices, contact information, and business details</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={!isValid || claimMutation.isPending}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
            >
              {claimMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting Claim...
                </>
              ) : (
                <>
                  <Award className="h-4 w-4 mr-2" />
                  Submit Claim
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={claimMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}