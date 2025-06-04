import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Settings } from "lucide-react";
// Tank images replaced with SVG icons for build compatibility

interface TankSelectorProps {
  selectedVolume: string;
  onVolumeChange: (volume: string) => void;
  className?: string;
}

interface TankOption {
  volume: string;
  label: string;
  description: string;
  size: 'small' | 'medium' | 'large';
}

const tankOptions: TankOption[] = [
  {
    volume: "300",
    label: "300L",
    description: "Small Tank",
    size: 'small'
  },
  {
    volume: "500", 
    label: "500L",
    description: "Medium Tank",
    size: 'medium'
  },
  {
    volume: "900",
    label: "900L", 
    description: "Large Tank",
    size: 'large'
  }
];



const TankGraphic = ({ volume, isSelected, size }: { volume: string; isSelected: boolean; size: 'small' | 'medium' | 'large' }) => {
  const getTankSvg = () => {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full text-blue-600" fill="currentColor">
        <rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="12" cy="14" r="2" fill="currentColor"/>
        <text x="12" y="6" textAnchor="middle" fontSize="6" fill="currentColor">{volume}L</text>
      </svg>
    );
  };

  const getSize = () => {
    switch(size) {
      case 'small': return { width: 80, height: 80 };
      case 'medium': return { width: 100, height: 100 };
      case 'large': return { width: 120, height: 120 };
      default: return { width: 100, height: 100 };
    }
  };

  const { width, height } = getSize();

  return (
    <div className={cn(
      "transition-all duration-300 flex items-center justify-center",
      isSelected ? "scale-110 opacity-100" : "opacity-70 hover:opacity-100 hover:scale-105"
    )}>
      <div 
        style={{ width, height }}
        className={cn(
          "transition-all duration-300 filter",
          isSelected ? "brightness-100 drop-shadow-lg" : "brightness-90 hover:brightness-100"
        )}
      >
        {getTankSvg()}
      </div>
    </div>
  );
};

export default function TankSelector({ selectedVolume, onVolumeChange, className }: TankSelectorProps) {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");
  
  // Initialize custom mode if selectedVolume is not a standard size
  useEffect(() => {
    const isStandard = tankOptions.some(option => option.volume === selectedVolume);
    if (!isStandard && selectedVolume !== "300" && selectedVolume !== "500" && selectedVolume !== "900") {
      setIsCustomMode(true);
      setCustomValue(selectedVolume);
    }
  }, [selectedVolume]);

  const handleCustomToggle = () => {
    if (isCustomMode) {
      // Switch back to standard mode
      setIsCustomMode(false);
      setCustomValue("");
      onVolumeChange("300"); // Default to 300L
    } else {
      // Switch to custom mode
      setIsCustomMode(true);
      const currentValue = isStandardSize ? selectedVolume : "750";
      setCustomValue(currentValue);
      onVolumeChange(currentValue);
    }
  };

  const handleCustomChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue === '') {
      setCustomValue('');
      return;
    }
    
    const parsed = parseInt(numericValue);
    if (parsed >= 100 && parsed <= 10000) {
      setCustomValue(numericValue);
      onVolumeChange(numericValue);
    } else if (parsed > 0 && parsed < 100) {
      // Allow typing but don't update parent until valid
      setCustomValue(numericValue);
    } else if (parsed > 10000) {
      // Cap at maximum
      setCustomValue('10000');
      onVolumeChange('10000');
    }
  };

  const isStandardSize = tankOptions.some(option => option.volume === selectedVolume);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Choose Your Tank Size
        </label>
        <button
          type="button"
          onClick={handleCustomToggle}
          className={cn(
            "flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all",
            isCustomMode
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          <Settings className="h-3 w-3" />
          <span>{isCustomMode ? "Standard" : "Custom"}</span>
        </button>
      </div>

      {isCustomMode ? (
        <div className="space-y-3">
          <div className="relative">
            <Input
              type="text"
              value={customValue}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="Enter tank size (e.g. 750)"
              className={cn(
                "pr-8",
                customValue && parseInt(customValue) < 100 ? "border-amber-400 focus:ring-amber-400" : "",
                customValue && parseInt(customValue) > 10000 ? "border-red-400 focus:ring-red-400" : ""
              )}
              maxLength={5}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              L
            </span>
          </div>
          {customValue && parseInt(customValue) < 100 && (
            <p className="text-xs text-amber-600 flex items-center space-x-1">
              <span>⚠️</span>
              <span>Minimum order is 100L - most suppliers don't deliver smaller amounts</span>
            </p>
          )}
          {customValue && parseInt(customValue) > 10000 && (
            <p className="text-xs text-red-600 flex items-center space-x-1">
              <span>❌</span>
              <span>Maximum order is 10,000L - larger orders require special arrangements</span>
            </p>
          )}
          {(!customValue || (parseInt(customValue) >= 100 && parseInt(customValue) <= 10000)) && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500">
                Enter any amount between 100L and 10,000L for a personalized quote
              </p>
              {customValue && parseInt(customValue) >= 100 && parseInt(customValue) <= 10000 && (
                <p className="text-xs text-green-600 flex items-center space-x-1">
                  <span>✓</span>
                  <span>Calculating prices for {customValue}L...</span>
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {tankOptions.map((tank) => (
            <button
              key={tank.volume}
              type="button"
              onClick={() => onVolumeChange(tank.volume)}
              className={cn(
                "flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md",
                selectedVolume === tank.volume
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-gray-200 hover:border-primary/50"
              )}
            >
              <TankGraphic 
                volume={tank.volume}
                isSelected={selectedVolume === tank.volume}
                size={tank.size}
              />
              <div className="mt-2 text-center">
                <div className={cn(
                  "font-semibold text-sm",
                  selectedVolume === tank.volume ? "text-primary" : "text-gray-700"
                )}>
                  {tank.label}
                </div>
                <div className="text-xs text-gray-500">
                  {tank.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!isStandardSize && !isCustomMode && (
        <div className="mt-3 text-center p-2 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs text-blue-700">
            <span className="font-medium">{selectedVolume}L</span> - Custom size selected
          </p>
        </div>
      )}
    </div>
  );
}