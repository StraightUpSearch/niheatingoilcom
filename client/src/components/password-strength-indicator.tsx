
import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export default function PasswordStrengthIndicator({ password, className = "" }: PasswordStrengthProps) {
  const requirements = useMemo(() => {
    return [
      {
        label: "At least 8 characters",
        met: password.length >= 8
      },
      {
        label: "One uppercase letter",
        met: /[A-Z]/.test(password)
      },
      {
        label: "One lowercase letter",
        met: /[a-z]/.test(password)
      },
      {
        label: "One number",
        met: /\d/.test(password)
      },
      {
        label: "One special character",
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      }
    ];
  }, [password]);

  const strength = requirements.filter(req => req.met).length;
  const strengthPercentage = (strength / requirements.length) * 100;
  
  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-brand-gold";
    return "bg-brand-forest";
  };

  const getStrengthLabel = () => {
    if (strength <= 2) return "Weak";
    if (strength <= 4) return "Medium";
    return "Strong";
  };

  if (!password) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Password strength</span>
          <span className={`font-medium ${
            strength <= 2 ? 'text-red-600' : 
            strength <= 4 ? 'text-yellow-600' : 
            'text-[#0B6A30]'
          }`}>
            {getStrengthLabel()}
          </span>
        </div>
        <Progress value={strengthPercentage} className="h-2">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </Progress>
      </div>
      
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center text-xs">
            {req.met ? (
              <Check className="h-3 w-3 text-[#0B6A30] mr-2" />
            ) : (
              <X className="h-3 w-3 text-brand-muted mr-2" />
            )}
            <span className={req.met ? 'text-[#0B6A30]' : 'text-brand-muted'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
