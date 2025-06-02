import { useState } from "react";
import { cn } from "@/lib/utils";

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

// Placeholder SVG tank components - will be replaced with actual graphics
const TankGraphic = ({ volume, isSelected, size }: { volume: string; isSelected: boolean; size: 'small' | 'medium' | 'large' }) => {
  const getHeight = () => {
    switch(size) {
      case 'small': return 80;
      case 'medium': return 100;
      case 'large': return 120;
      default: return 100;
    }
  };

  const getWidth = () => {
    switch(size) {
      case 'small': return 60;
      case 'medium': return 75;
      case 'large': return 90;
      default: return 75;
    }
  };

  return (
    <svg 
      width={getWidth()} 
      height={getHeight()} 
      viewBox={`0 0 ${getWidth()} ${getHeight()}`}
      className={cn(
        "transition-all duration-300",
        isSelected ? "text-primary scale-110" : "text-gray-400 hover:text-primary"
      )}
    >
      {/* Simple tank representation - will be replaced with actual SVG graphics */}
      <rect
        x="10"
        y="10"
        width={getWidth() - 20}
        height={getHeight() - 20}
        rx="8"
        fill="currentColor"
        fillOpacity={isSelected ? "0.8" : "0.4"}
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="15"
        y="15"
        width={getWidth() - 30}
        height={(getHeight() - 30) * 0.7}
        rx="4"
        fill="#1976D2"
        fillOpacity={isSelected ? "0.9" : "0.3"}
        className="transition-all duration-500"
      />
      <text
        x={getWidth() / 2}
        y={getHeight() - 5}
        textAnchor="middle"
        className="text-xs font-semibold fill-current"
      >
        {volume}L
      </text>
    </svg>
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