import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield } from "lucide-react";

interface BotProtectionProps {
  onValidation: (isValid: boolean) => void;
}

export default function BotProtection({ onValidation }: BotProtectionProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // Simple bot protection: require checkbox to be checked and some time to pass
    const timeElapsed = Date.now() - startTime;
    const isValid = isChecked && timeElapsed > 3000; // At least 3 seconds
    onValidation(isValid);
  }, [isChecked, startTime, onValidation]);

  return (
    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
      <Checkbox
        id="bot-protection"
        checked={isChecked}
        onCheckedChange={(checked) => setIsChecked(!!checked)}
      />
      <div className="flex items-center space-x-2">
        <Shield className="h-4 w-4 text-gray-600" />
        <label
          htmlFor="bot-protection"
          className="text-sm text-gray-700 cursor-pointer"
        >
          I confirm I am not a robot and agree to receive pricing information
        </label>
      </div>
    </div>
  );
}