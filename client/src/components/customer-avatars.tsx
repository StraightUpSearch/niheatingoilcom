import { useState, useEffect } from "react";

interface CustomerAvatar {
  id: number;
  name: string;
  location: string;
  savings: number;
  avatar: string;
}

// Pixel art style avatars representing Northern Ireland customers
const customerTestimonials: CustomerAvatar[] = [
  {
    id: 1,
    name: "Margaret",
    location: "Bangor",
    savings: 180,
    avatar: "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' fill='%23F3F4F6'/%3E%3Crect x='8' y='8' width='16' height='16' fill='%23FBBF24'/%3E%3Crect x='10' y='12' width='2' height='2' fill='%23374151'/%3E%3Crect x='20' y='12' width='2' height='2' fill='%23374151'/%3E%3Crect x='12' y='16' width='8' height='2' fill='%23374151'/%3E%3Crect x='6' y='6' width='20' height='4' fill='%238B5CF6'/%3E%3C/svg%3E"
  },
  {
    id: 2,
    name: "James",
    location: "Lisburn",
    savings: 245,
    avatar: "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' fill='%23F3F4F6'/%3E%3Crect x='8' y='8' width='16' height='16' fill='%23FCA5A5'/%3E%3Crect x='10' y='12' width='2' height='2' fill='%23374151'/%3E%3Crect x='20' y='12' width='2' height='2' fill='%23374151'/%3E%3Crect x='14' y='16' width='4' height='2' fill='%23374151'/%3E%3Crect x='6' y='6' width='20' height='4' fill='%23EF4444'/%3E%3C/svg%3E"
  },
  {
    id: 3,
    name: "Sarah",
    location: "Ballymena",
    savings: 320,
    avatar: "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' fill='%23F3F4F6'/%3E%3Crect x='8' y='8' width='16' height='16' fill='%23FDE68A'/%3E%3Crect x='10' y='12' width='2' height='2' fill='%23374151'/%3E%3Crect x='20' y='12' width='2' height='2' fill='%23374151'/%3E%3Crect x='12' y='16' width='8' height='2' fill='%23374151'/%3E%3Crect x='6' y='4' width='20' height='8' fill='%23F59E0B'/%3E%3C/svg%3E"
  },
  {
    id: 4,
    name: "David",
    location: "Newtownards",
    savings: 195,
    avatar: "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' fill='%23F3F4F6'/%3E%3Crect x='8' y='8' width='16' height='16' fill='%23A7F3D0'/%3E%3Crect x='10' y='12' width='2' height='2' fill='%23374151'/%3E%3Crect x='20' y='12' width='2' height='2' fill='%23374151'/%3E%3Crect x='14' y='16' width='4' height='2' fill='%23374151'/%3E%3Crect x='8' y='6' width='16' height='2' fill='%23065F46'/%3E%3C/svg%3E"
  },
  {
    id: 5,
    name: "Linda",
    location: "Portadown",
    savings: 275,
    avatar: "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' fill='%23F3F4F6'/%3E%3Crect x='8' y='8' width='16' height='16' fill='%23DDD6FE'/%3E%3Crect x='10' y='12' width='2' height='2' fill='%23374151'/%3E%3Crect x='20' y='12' width='2' height='2' fill='%23374151'/%3E%3Crect x='12' y='16' width='8' height='2' fill='%23374151'/%3E%3Crect x='6' y='4' width='20' height='6' fill='%237C3AED'/%3E%3C/svg%3E"
  },
  {
    id: 6,
    name: "Robert",
    location: "Armagh",
    savings: 210,
    avatar: "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' fill='%23F3F4F6'/%3E%3Crect x='8' y='8' width='16' height='16' fill='%23FED7AA'/%3E%3Crect x='10' y='12' width='2' height='2' fill='%23374151'/%3E%3Crect x='20' y='12' width='2' height='2' fill='%23374151'/%3E%3Crect x='14' y='16' width='4' height='2' fill='%23374151'/%3E%3Crect x='10' y='6' width='12' height='2' fill='%23D97706'/%3E%3C/svg%3E"
  }
];

interface CustomerAvatarsProps {
  showSavings?: boolean;
  maxAvatars?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function CustomerAvatars({ 
  showSavings = false, 
  maxAvatars = 5,
  size = 'md'
}: CustomerAvatarsProps) {
  const [displayedCustomers, setDisplayedCustomers] = useState<CustomerAvatar[]>([]);

  useEffect(() => {
    // Randomly select customers to show
    const shuffled = [...customerTestimonials].sort(() => 0.5 - Math.random());
    setDisplayedCustomers(shuffled.slice(0, maxAvatars));
  }, [maxAvatars]);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const totalSavings = displayedCustomers.reduce((sum, customer) => sum + customer.savings, 0);

  return (
    <div className="flex items-centre space-x-3">
      <div className="flex -space-x-2">
        {displayedCustomers.map((customer, index) => (
          <div
            key={customer.id}
            className={`${sizeClasses[size]} rounded-full border-2 border-white bg-white shadow-sm overflow-hidden relative z-${10 - index}`}
            title={`${customer.name} from ${customer.location} saved £${customer.savings}`}
          >
            <img 
              src={customer.avatar} 
              alt={`${customer.name} from ${customer.location}`}
              className="w-full h-full object-cover pixelated"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        ))}
      </div>
      
      <div className="text-sm">
        <div className="flex items-centre text-amber-500">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-grey-600 font-medium">
          Trusted by {displayedCustomers.length}+ homeowners
          {showSavings && (
            <span className="block text-xs text-green-600">
              Average savings: £{Math.round(totalSavings / displayedCustomers.length)}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

// Enhanced version with floating animation for hero sections
export function AnimatedCustomerAvatars() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % customerTestimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = customerTestimonials[currentTestimonial];

  return (
    <div className="text-centre py-8">
      <div className="flex justify-centre items-centre space-x-4 mb-4">
        <div className="flex -space-x-3">
          {customerTestimonials.slice(0, 5).map((customer, index) => (
            <div
              key={customer.id}
              className={`w-12 h-12 rounded-full border-3 border-white bg-white shadow-lg overflow-hidden transition-all duration-300 ${
                index === currentTestimonial ? 'scale-110 z-10' : 'scale-100'
              }`}
            >
              <img 
                src={customer.avatar} 
                alt={`${customer.name} from ${customer.location}`}
                className="w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          ))}
        </div>
        
        <div className="flex items-centre text-amber-500">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      <div className="transition-all duration-500 ease-in-out">
        <p className="text-lg font-semibold text-grey-900">
          "{current.name} from {current.location} saved £{current.savings}"
        </p>
        <p className="text-sm text-grey-600 mt-1">
          Trusted by homeowners across Northern Ireland
        </p>
      </div>
    </div>
  );
}