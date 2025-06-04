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
    <div className={`${sizeClasses[size]} ${className} flex-shrink-0`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#1e40af" stroke="#1e40af" strokeWidth="1" />
        <text x="50" y="35" textAnchor="middle" fontSize="12" fill="#ffffff" fontWeight="bold" fontFamily="Arial, sans-serif">NI</text>
        <text x="50" y="50" textAnchor="middle" fontSize="8" fill="#ffffff" fontFamily="Arial, sans-serif">HEATING</text>
        <text x="50" y="65" textAnchor="middle" fontSize="8" fill="#ffffff" fontFamily="Arial, sans-serif">OIL</text>
      </svg>
    </div>
  );
}