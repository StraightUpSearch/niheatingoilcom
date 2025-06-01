interface HeatingOilLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function HeatingOilLogo({ className = "", size = 'md' }: HeatingOilLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Truck cab */}
        <path
          d="M8 32V26C8 24.8954 8.89543 24 10 24H18C19.1046 24 20 24.8954 20 26V32"
          fill="currentColor"
          className="text-blue-600"
        />
        
        {/* Truck front */}
        <path
          d="M6 26V30C6 31.1046 6.89543 32 8 32V26C8 24.8954 8.89543 24 10 24H8C6.89543 24 6 24.8954 6 26Z"
          fill="currentColor"
          className="text-blue-700"
        />
        
        {/* Oil tanker body */}
        <ellipse
          cx="32"
          cy="28"
          rx="14"
          ry="6"
          fill="currentColor"
          className="text-blue-500"
        />
        
        {/* Tanker details/ridges */}
        <path
          d="M22 26H42M22 28H42M22 30H42"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-blue-700"
        />
        
        {/* Front wheel */}
        <circle
          cx="12"
          cy="34"
          r="3"
          fill="currentColor"
          className="text-gray-700"
        />
        
        {/* Back wheel */}
        <circle
          cx="36"
          cy="34"
          r="3"
          fill="currentColor"
          className="text-gray-700"
        />
        
        {/* Wheel rims */}
        <circle
          cx="12"
          cy="34"
          r="1.5"
          fill="currentColor"
          className="text-gray-400"
        />
        <circle
          cx="36"
          cy="34"
          r="1.5"
          fill="currentColor"
          className="text-gray-400"
        />
        
        {/* Oil droplet accent */}
        <path
          d="M38 20C38 18.5 39 17 40 17C41 17 42 18.5 42 20C42 21.1046 41.1046 22 40 22C38.8954 22 38 21.1046 38 20Z"
          fill="currentColor"
          className="text-orange-500"
        />
        
        {/* Connecting hose */}
        <path
          d="M20 28L22 28"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-600"
        />
      </svg>
    </div>
  );
}