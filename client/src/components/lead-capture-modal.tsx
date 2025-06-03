import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Mail, Clock, CheckCircle, UserPlus, User } from "lucide-react";
import { Link } from "wouter";

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
  const [showAccountOptions, setShowAccountOptions] = useState(false);

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
      
      // Show account options after 2 seconds
      setTimeout(() => {
        setShowAccountOptions(true);
      }, 2000);
    } catch (error) {
      console.error('Error submitting lead:', error);
      setIsSubmitting(false);
      // TODO: Show error toast
    }
  };

  const handleContinueAsGuest = () => {
    onClose();
    setIsSubmitted(false);
    setShowAccountOptions(false);
    setFormData({
      name: "", email: "", phone: "", postcode: "", 
      volume: "", urgency: "", notes: ""
    });
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
            
            {!showAccountOptions ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  We're working to secure the best deals for your order. 
                  You'll receive quotes via email and SMS.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Want to save even more?</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Create a free account to get personalized price alerts, save favorite suppliers, and never miss the best deals in Northern Ireland.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link href="/auth" className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Free Account
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={handleContinueAsGuest}
                      className="flex-1"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Continue as Guest
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Account benefits: Price alerts • Favorite suppliers • Order history • Exclusive deals
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
                    <div className="font-bold text-green-800 text-sm sm:text-base">{supplier.price}</div>
                    <div className="text-xs text-green-600">{supplier.volume}L</div>
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
            </div>
            <div>
              <Label htmlFor="postcode" className="text-sm">Postcode *</Label>
              <Input
                id="postcode"
                value={formData.postcode}
                onChange={(e) => setFormData({...formData, postcode: e.target.value.toUpperCase()})}
                placeholder="BT1 5GS"
                className="text-sm sm:text-base"
                required
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
              disabled={isSubmitting || !formData.name || !formData.email || !formData.phone}
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