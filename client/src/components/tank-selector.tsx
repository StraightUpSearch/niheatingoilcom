import { useState } from "react";
import { cn } from "@/lib/utils";
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
  return (
    <div className={cn("w-full", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Choose Your Tank Size
      </label>
      
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
    </div>
  );
}