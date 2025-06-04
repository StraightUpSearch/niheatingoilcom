import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { MapPin, Shield, Clock, Target } from "lucide-react";

interface LocationConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
  onDeny: () => void;
}

export default function LocationConsentModal({
  isOpen,
  onClose,
  onAllow,
  onDeny
}: LocationConsentModalProps) {
  const [isAllowing, setIsAllowing] = useState(false);

  const handleAllow = async () => {
    setIsAllowing(true);
    try {
      await onAllow();
    } finally {
      setIsAllowing(false);
      onClose();
    }
  };

  const handleDeny = () => {
    onDeny();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Share Your Location
          </DialogTitle>
          <DialogDescription className="text-left space-y-3">
            <p>
              We'd like to use your location to provide you with the best heating oil prices in your area.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Accurate Local Pricing</h4>
              <p className="text-sm text-gray-600">
                Get heating oil prices from suppliers closest to your home
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Faster Search</h4>
              <p className="text-sm text-gray-600">
                Auto-fill your postcode area to skip manual typing
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Privacy Protected</h4>
              <p className="text-sm text-gray-600">
                Your location is only used to suggest your postcode area and is never stored
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>How it works:</strong> We'll detect your Northern Ireland postcode area (like BT1, BT9, etc.) 
            and automatically fill it in for you. Your exact location is never saved.
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDeny}
            className="w-full sm:w-auto"
          >
            No Thanks
          </Button>
          <Button
            onClick={handleAllow}
            disabled={isAllowing}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            {isAllowing ? "Getting Location..." : "Allow Location Access"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}