import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Mail, Clock, CheckCircle, UserPlus, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import BotProtection from "@/components/bot-protection";
import EnhancedAddressInput from "@/components/enhanced-address-input";
import { useToast } from "@/hooks/use-toast";

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
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fullAddress: "",
    postcode: "",
    roadName: "",
    houseNumber: "",
    town: "",
    county: "",
    volume: supplier?.volume?.toString() || "",
    urgency: "",
    notes: ""
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    postcode: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBotProtectionValid, setIsBotProtectionValid] = useState(false);
  const [submissionStartTime] = useState(Date.now());

  const handleAddressSelect = (address: {
    fullAddress: string;
    postcode: string;
    roadName: string;
    houseNumber: string;
    town: string;
    county: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      fullAddress: address.fullAddress,
      postcode: address.postcode,
      roadName: address.roadName,
      houseNumber: address.houseNumber,
      town: address.town,
      county: address.county,
    }));
  };

  // Calculate dynamic price based on selected volume with 20% safety margin
  const calculateDynamicPrice = () => {
    if (!supplier || !formData.volume) return supplier?.price || "Contact for quote";

    const selectedVolume = parseInt(formData.volume);
    const originalVolume = supplier.volume;
    const originalPrice = parseFloat(supplier.price.replace('£', ''));

    if (isNaN(originalPrice) || isNaN(selectedVolume)) return supplier.price;

    // Calculate price per litre and multiply by new volume, then add 20% safety margin
    const pricePerLitre = originalPrice / originalVolume;
    const basePrice = pricePerLitre * selectedVolume;
    const priceWithMargin = basePrice * 1.20;

    return `£${priceWithMargin.toFixed(2)}`;
  };

  const getSelectedVolume = () => {
    return formData.volume || supplier?.volume?.toString() || "500";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation - can be expanded
    let errors: any = {};
    if (!formData.name) errors.name = "Full Name is required";
    if (!formData.email) errors.email = "Email Address is required";
    if (!formData.phone) errors.phone = "Phone Number is required";
    if (!formData.postcode) errors.postcode = "Postcode is required";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return; // Stop submission if there are errors
    }


    setIsSubmitting(true);

    try {
      // Check bot protection before submission
      if (!isBotProtectionValid) {
        setIsSubmitting(false);
        return;
      }

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
        status: "new",
        submissionTime: submissionStartTime
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

      // Store quote data in localStorage for the thank you page
      const quoteData = {
        supplierName: supplier?.name || "Heating Oil Supplier",
        price: calculateDynamicPrice(),
        volume: parseInt(formData.volume),
        location: supplier?.location || "Northern Ireland",
        postcode: formData.postcode,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone
      };

      localStorage.setItem('lastQuote', JSON.stringify(quoteData));

      // Close modal and redirect to thank you page
      onClose();
      setLocation('/thank-you');
    } catch (error) {
      console.error('Error submitting lead:', error);
      setIsSubmitting(false);
      toast({
        title: 'Something went wrong',
        description: 'We could not save your details. Please try again.',
        variant: 'destructive'
      });
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg sm:text-xl">
            <Mail className="h-5 w-5 mr-2 text-blue-600" />
            Get Your Best Quote
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {supplier ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-green-800 text-sm sm:text-base">{supplier.name}</span>
                    <div className="text-xs sm:text-sm text-green-600">{supplier.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-800 text-sm sm:text-base">{calculateDynamicPrice()}</div>
                    <div className="text-xs text-green-600">{getSelectedVolume()}L</div>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="mt-2 text-xs sm:text-sm">
              💡 <strong>Save time & money:</strong> We'll get quotes from multiple suppliers and find you the best deal. Takes just 30 seconds!
            </div>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="name" className="text-sm">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Smith"
                className="text-sm sm:text-base"
                required
              />
              {formErrors.name && <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <EnhancedAddressInput
                onAddressSelect={handleAddressSelect}
                placeholder="Start typing your address..."
                label="Delivery Address *"
                className="text-sm sm:text-base"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-sm">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="john@example.com"
              className="text-sm sm:text-base"
              required
            />
            {formErrors.email && <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="028 9000 0000"
              className="text-sm sm:text-base"
              required
            />
            {formErrors.phone && <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

          <BotProtection onValidation={setIsBotProtectionValid} />

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <strong>Why use our service:</strong>
                <ul className="mt-1 space-y-1 text-xs sm:text-sm">
                  <li>• We contact multiple suppliers to get you the best price</li>
                  <li>• Save time - no need to call around yourself</li>
                  <li>• Often secure discounts not available directly</li>
                  <li>• 100% free service with no obligation</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:flex-1 text-sm sm:text-base"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-sm sm:text-base py-3 sm:py-2"
              disabled={isSubmitting || !formData.name || !formData.email || !formData.phone || !formData.postcode || !isBotProtectionValid}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="text-sm sm:text-base">Submitting...</span>
                </div>
              ) : (
                <span className="font-semibold">Get My Best Quote Now</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}