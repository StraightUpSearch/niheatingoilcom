import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Mail, Clock, CheckCircle } from "lucide-react";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: {
    name: string;
    price: string;
    volume: number;
    location: string;
  };
}

export default function LeadCaptureModal({ isOpen, onClose, supplier }: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    volume: supplier?.volume?.toString() || "",
    urgency: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const leadData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        postcode: formData.postcode,
        volume: parseInt(formData.volume),
        urgency: formData.urgency || null,
        notes: formData.notes || null,
        supplierName: supplier?.name || null,
        supplierPrice: supplier?.price || null,
        status: "new"
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit lead');
      }
      
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Auto-close after showing success
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setFormData({
          name: "", email: "", phone: "", postcode: "", 
          volume: "", urgency: "", notes: ""
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting lead:', error);
      setIsSubmitting(false);
      // TODO: Show error toast
    }
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Submitted!</h3>
            <p className="text-gray-600 mb-4">
              Our heating oil specialist will contact you within 2 hours with personalized quotes and pricing.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                We're working to secure the best deals for your order. 
                You'll receive quotes via email and SMS.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-600" />
            Get Personalized Quote
          </DialogTitle>
          <DialogDescription>
            {supplier ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-green-800">{supplier.name}</span>
                    <div className="text-sm text-green-600">{supplier.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-800">£{supplier.price}</div>
                    <div className="text-xs text-green-600">{supplier.volume}L</div>
                  </div>
                </div>
              </div>
            ) : null}
            We'll connect you with verified suppliers and negotiate better prices on your behalf.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Smith"
                required
              />
            </div>
            <div>
              <Label htmlFor="postcode">Postcode *</Label>
              <Input
                id="postcode"
                value={formData.postcode}
                onChange={(e) => setFormData({...formData, postcode: e.target.value.toUpperCase()})}
                placeholder="BT1 5GS"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="028 9000 0000"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="volume">Required Volume *</Label>
              <Select value={formData.volume} onValueChange={(value) => setFormData({...formData, volume: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">300 Litres</SelectItem>
                  <SelectItem value="500">500 Litres</SelectItem>
                  <SelectItem value="900">900 Litres</SelectItem>
                  <SelectItem value="custom">Custom Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="urgency">When do you need it?</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP (Emergency)</SelectItem>
                  <SelectItem value="week">Within 1 week</SelectItem>
                  <SelectItem value="month">Within 1 month</SelectItem>
                  <SelectItem value="flexible">Flexible timing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any special requirements, access instructions, or questions..."
              rows={3}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start">
              <Clock className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>What happens next:</strong>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Our specialist contacts you within 2 hours</li>
                  <li>We negotiate with suppliers on your behalf</li>
                  <li>You receive personalized quotes via email/SMS</li>
                  <li>No obligation - free service</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isSubmitting || !formData.name || !formData.email || !formData.phone}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                "Get My Quote"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}