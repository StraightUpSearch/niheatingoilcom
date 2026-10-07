
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle } from "lucide-react";

export default function PriceGuaranteeModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-[#0B6A30] hover:text-[#0B6A30] text-sm font-medium">
          <Shield className="h-4 w-4 mr-1" />
          The NI Heating Oil Price Promise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-[#0B6A30]">
            We're 100% Honest!
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-brand-mint rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-[#0B6A30]" />
          </div>
          
          <div className="space-y-3">
            <p className="text-brand-ink">
              We have no sneaky service charges or hidden fees added throughout our ordering process!
            </p>
            <p className="text-brand-ink">
              Unlike other suppliers who sneak fees in at the last minute, at NI Heating Oil - 
              <strong> the price you see is the price you pay!</strong>
            </p>
            
            <div className="bg-brand-mint p-3 rounded-lg">
              <p className="text-sm text-[#0B6A30] font-medium">
                ✓ No hidden fees<br/>
                ✓ Transparent pricing<br/>
                ✓ What you see is what you pay
              </p>
            </div>
          </div>
          
          <Button onClick={() => setOpen(false)} className="w-full bg-brand-forest hover:bg-brand-forest-soft">
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
