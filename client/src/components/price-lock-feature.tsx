import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceLockFeatureProps {
  supplierId: number;
  price: string;
  volume: number;
  postcode: string;
  supplierName: string;
}

export default function PriceLockFeature({ 
  supplierId, 
  price, 
  volume, 
  postcode, 
  supplierName 
}: PriceLockFeatureProps) {
  const [isLocked, setIsLocked] = useState(false);
  const [lockExpiry, setLockExpiry] = useState<Date | null>(null);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const { toast } = useToast();

  // Check for existing price locks on mount
  useEffect(() => {
    const savedLocks = localStorage.getItem("priceLocks");
    if (savedLocks) {
      const locks = JSON.parse(savedLocks);
      const currentLock = locks.find((lock: any) => 
        lock.supplierId === supplierId && 
        lock.volume === volume && 
        lock.postcode === postcode
      );
      
      if (currentLock && new Date(currentLock.expiry) > new Date()) {
        setIsLocked(true);
        setLockExpiry(new Date(currentLock.expiry));
        setEmail(currentLock.email);
      }
    }
  }, [supplierId, volume, postcode]);

  // Update time remaining
  useEffect(() => {
    if (!lockExpiry) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = lockExpiry.getTime() - now.getTime();
      
      if (diff <= 0) {
        setIsLocked(false);
        setLockExpiry(null);
        setTimeRemaining("");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lockExpiry]);

  const handleLockPrice = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email to lock this price",
        variant: "destructive",
      });
      return;
    }

    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);

    // Save to localStorage
    const savedLocks = localStorage.getItem("priceLocks") || "[]";
    const locks = JSON.parse(savedLocks);
    locks.push({
      supplierId,
      price,
      volume,
      postcode,
      supplierName,
      email,
      expiry: expiry.toISOString(),
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("priceLocks", JSON.stringify(locks));

    // Send to backend
    try {
      await fetch("/api/price-locks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId,
          price,
          volume,
          postcode,
          email,
          expiryHours: 24,
        }),
      });
    } catch (error) {
      console.error("Failed to save price lock:", error);
    }

    setIsLocked(true);
    setLockExpiry(expiry);
    setShowLockDialog(false);

    toast({
      title: "Price locked successfully! 🔒",
      description: `This price is now guaranteed for 24 hours. We'll send a reminder to ${email}`,
    });
  };

  if (isLocked) {
    return (
      <div className="flex items-center gap-2 bg-green-50 text-green-800 px-3 py-2 rounded-lg border border-green-200">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">
          Price locked for {timeRemaining}
        </span>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowLockDialog(true)}
        className="gap-1"
      >
        <Lock className="h-3 w-3" />
        Lock price for 24hrs
      </Button>

      <Dialog open={showLockDialog} onOpenChange={setShowLockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lock This Price for 24 Hours</DialogTitle>
            <DialogDescription>
              Guarantee this price while you arrange payment or compare other options
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Supplier:</span>
                  <span className="font-medium">{supplierName}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Volume:</span>
                  <span className="font-medium">{volume}L</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-xl font-bold text-blue-900">£{price}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                We'll send you a reminder before the price lock expires
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">How price lock works:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>This price is guaranteed for 24 hours</li>
                    <li>You can complete your order anytime within 24 hours</li>
                    <li>We'll email you 2 hours before it expires</li>
                    <li>No payment required now</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleLockPrice} 
              className="w-full"
              disabled={!email.trim()}
            >
              <Lock className="h-4 w-4 mr-2" />
              Lock Price for 24 Hours
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}