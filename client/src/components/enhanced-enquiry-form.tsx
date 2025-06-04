import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Loader2, CheckCircle, User, Mail, Droplet } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import SmartPostcodeInput from "../components/smart-postcode-input";

import LeadCaptureModal from "./lead-capture-modal";

export default function EnhancedEnquiryForm() {
  const [showLeadModal, setShowLeadModal] = useState(false);

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-center">Get Your Best Heating Oil Quote</CardTitle>
          <p className="text-center text-gray-600">
            Compare prices from verified Northern Ireland suppliers
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <h4 className="font-medium text-blue-900 mb-3">Why choose us?</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-800 mb-4">
              <div>✓ Best rates guaranteed</div>
              <div>✓ Local suppliers only</div>
              <div>✓ Free price comparison</div>
              <div>✓ Fast delivery service</div>
            </div>
            
            <Button 
              onClick={() => setShowLeadModal(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
            >
              Get My Quote Now
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            By requesting a quote, you agree to receive pricing information via email. 
            No spam, unsubscribe anytime.
          </p>
        </CardContent>
      </Card>

      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        supplier={undefined}
      />
    </>
  );
}