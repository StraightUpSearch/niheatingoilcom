import newLogo from "../assets/ChatGPT Image Jun 1, 2025, 09_16_52 PM.png";

interface HeatingOilLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function HeatingOilLogo({ className = "", size = 'md' }: HeatingOilLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img 
        src={newLogo} 
        alt="NI Heating Oil - Northern Ireland heating oil price comparison with delivery truck"
        className="w-full h-full object-contain"
      />
    </div>
  );
}