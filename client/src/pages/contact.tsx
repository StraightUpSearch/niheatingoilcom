import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { MapPin, Phone, Mail, Clock, CheckCircle, MessageSquare, Building, Navigation } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "../hooks/use-toast";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  enquiryType: string;
}

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    enquiryType: ""
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        enquiryType: ""
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Have questions about heating oil prices or need help with our service? 
              Our Northern Ireland team is here to help you save money on your heating costs.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <span>Our Office</span>
                </CardTitle>
                <CardDescription>
                  Visit us at our Ballymoney headquarters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">NI Heating Oil</p>
                    <p className="text-gray-600">14a Victoria Street</p>
                    <p className="text-gray-600">Ballymoney, BT53 6DW</p>
                    <p className="text-gray-600">Northern Ireland</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">028 2766 8000</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">hello@niheatingoil.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Service Hours</p>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:30 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                    <p className="text-sm text-blue-600 mt-1">Online service available 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Options */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common requests and services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/compare">
                    <Navigation className="h-4 w-4 mr-2" />
                    Compare Prices Now
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/suppliers">
                    <Building className="h-4 w-4 mr-2" />
                    View All Suppliers
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/price-alerts">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Set Price Alerts
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span>Send us a Message</span>
                </CardTitle>
                <CardDescription>
                  We typically respond within 24 hours during business days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="028 xxxx xxxx"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="enquiryType">Enquiry Type *</Label>
                      <Select 
                        value={formData.enquiryType}
                        onValueChange={(value) => handleChange("enquiryType", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select enquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Enquiry</SelectItem>
                          <SelectItem value="pricing">Pricing Information</SelectItem>
                          <SelectItem value="supplier">Supplier Listing</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="partnership">Business Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      placeholder="Brief description of your enquiry"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Please provide details about your enquiry..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    We respect your privacy and will never share your information with third parties.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Find Our Office</span>
              </CardTitle>
              <CardDescription>
                Located in the heart of Ballymoney, County Antrim
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=14a%20Victoria%20Street,%20Ballymoney,%20BT53%206DW+(NI%20Heating%20Oil)&amp;t=&amp;z=16&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                  title="NI Heating Oil Office Location"
                />
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Central Location</h3>
                  <p className="text-sm text-gray-600">
                    Easy access from all major NI towns
                  </p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Navigation className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Free Parking</h3>
                  <p className="text-sm text-gray-600">
                    Convenient parking available nearby
                  </p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Flexible Hours</h3>
                  <p className="text-sm text-gray-600">
                    Appointments available outside office hours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">How often are prices updated?</h3>
                    <p className="text-sm text-gray-600">
                      Our system updates prices every 2 hours from verified suppliers across Northern Ireland.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Is your service really free?</h3>
                    <p className="text-sm text-gray-600">
                      Yes, completely free for consumers. We're funded by supplier partnerships and advertising.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">How do I claim my supplier listing?</h3>
                    <p className="text-sm text-gray-600">
                      Visit any supplier page and click "Claim This Listing" or contact us directly.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Do you cover all of Northern Ireland?</h3>
                    <p className="text-sm text-gray-600">
                      Yes, we cover all six counties with suppliers delivering to every BT postcode area.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Can I get a bulk discount quote?</h3>
                    <p className="text-sm text-gray-600">
                      Absolutely! Use our enquiry form specifying your volume requirements for competitive quotes.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">What if I have a complaint?</h3>
                    <p className="text-sm text-gray-600">
                      Contact us immediately. We take all feedback seriously and respond within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}