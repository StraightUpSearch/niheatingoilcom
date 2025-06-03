import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import tank300L from "@assets/tank_300L.png";
import tank500L from "@assets/tank_500L.png";
import tank900L from "@assets/tank_900L.png";

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
  const getTankImage = () => {
    switch(volume) {
      case '300': return tank300L;
      case '500': return tank500L;
      case '900': return tank900L;
      default: return tank500L;
    }
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
      <img
        src={getTankImage()}
        alt={`${volume}L oil tank`}
        width={width}
        height={height}
        className={cn(
          "transition-all duration-300 filter",
          isSelected ? "brightness-100 drop-shadow-lg" : "brightness-90 hover:brightness-100"
        )}
      />
    </div>
  );
};

export default function TankSelector({ selectedVolume, onVolumeChange, className }: TankSelectorProps) {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleCustomToggle = () => {
    if (isCustomMode) {
      // Switch back to standard mode
      setIsCustomMode(false);
      onVolumeChange("300"); // Default to 300L
    } else {
      // Switch to custom mode
      setIsCustomMode(true);
      setCustomValue(selectedVolume);
    }
  };

  const handleCustomChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue && parseInt(numericValue) > 0 && parseInt(numericValue) <= 10000) {
      setCustomValue(numericValue);
      onVolumeChange(numericValue);
    } else if (numericValue === '') {
      setCustomValue('');
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
              className="pr-8"
              maxLength={5}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              L
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Enter any amount between 100L and 10,000L for a personalized quote
          </p>
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