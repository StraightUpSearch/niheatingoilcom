
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Shield, CheckCircle } from "lucide-react";

export default function PriceGuaranteeModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-green-600 hover:text-green-700 text-sm font-medium">
          <Shield className="h-4 w-4 mr-1" />
          The NI Heating Oil Price Promise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-green-600">
            We're 100% Honest!
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-700">
              We have no sneaky service charges or hidden fees added throughout our ordering process!
            </p>
            <p className="text-gray-700">
              Unlike other suppliers who sneak fees in at the last minute, at NI Heating Oil - 
              <strong> the price you see is the price you pay!</strong>
            </p>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                ✓ No hidden fees<br/>
                ✓ Transparent pricing<br/>
                ✓ What you see is what you pay
              </p>
            </div>
          </div>
          
          <Button onClick={() => setOpen(false)} className="w-full bg-green-600 hover:bg-green-700">
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
