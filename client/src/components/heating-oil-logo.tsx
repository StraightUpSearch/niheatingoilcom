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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 38 38"
      role="img"
      aria-label="NI Heating Oil"
      className={`${sizeClasses[size]} ${className}`}
    >
      <rect width="38" height="38" rx="11" fill="#11381F" />
      <path d="M19 7.5C19 7.5 11.2 16 11.2 21.6a7.8 7.8 0 0 0 15.6 0C26.8 16 19 7.5 19 7.5Z" fill="#FFC83D" />
      <path d="M15.6 22.4a3.5 3.5 0 0 0 3.4 3.4" fill="none" stroke="#11381F" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
