// Logo image replaced with SVG for build compatibility

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
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
        <circle cx="50" cy="50" r="45" fill="#1e40af" />
        <text x="50" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">NI</text>
        <text x="50" y="50" textAnchor="middle" fontSize="8" fill="white">HEATING</text>
        <text x="50" y="65" textAnchor="middle" fontSize="8" fill="white">OIL</text>
      </svg>
    </div>
  );
}