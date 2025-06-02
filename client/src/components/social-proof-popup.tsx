import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { X, CheckCircle, TrendingDown, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SocialProofMessage {
  id: string;
  type: 'order' | 'savings' | 'quote';
  name: string;
  location: string;
  amount?: number;
  volume?: number;
  timeAgo: string;
  savings?: number;
}

// Realistic Northern Ireland names and locations for social proof
const NI_NAMES = [
  "Sarah", "John", "Mary", "David", "Emma", "Michael", "Lisa", "James", 
  "Claire", "Ryan", "Aoife", "Ciaran", "Niamh", "Connor", "Siobhan", "Liam",
  "Caoimhe", "Sean", "Orla", "Paddy", "Mairead", "Declan", "Aine", "Rory"
];

const NI_LOCATIONS = [
  "Belfast", "Bangor", "Lisburn", "Newtownards", "Carrickfergus", "Antrim",
  "Ballymena", "Coleraine", "Derry", "Omagh", "Enniskillen", "Newry",
  "Armagh", "Downpatrick", "Ballyclare", "Larne", "Magherafelt", "Cookstown",
  "Dungannon", "Craigavon", "Portadown", "Lurgan", "Banbridge", "Newcastle"
];

const TIME_PHRASES = [
  "2 minutes ago", "5 minutes ago", "8 minutes ago", "12 minutes ago",
  "just now", "3 minutes ago", "7 minutes ago", "10 minutes ago", "15 minutes ago"
];

export default function SocialProofPopup() {
  const [currentMessage, setCurrentMessage] = useState<SocialProofMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const generateMessage = (): SocialProofMessage => {
    const types: ('order' | 'savings' | 'quote')[] = ['order', 'savings', 'quote'];
    const type = types[Math.floor(Math.random() * types.length)];
    const name = NI_NAMES[Math.floor(Math.random() * NI_NAMES.length)];
    const location = NI_LOCATIONS[Math.floor(Math.random() * NI_LOCATIONS.length)];
    const timeAgo = TIME_PHRASES[Math.floor(Math.random() * TIME_PHRASES.length)];

    const volumes = [300, 500, 900, 1000];
    const volume = volumes[Math.floor(Math.random() * volumes.length)];
    
    // Generate realistic savings (£15-£85)
    const savings = Math.floor(Math.random() * 70) + 15;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name,
      location,
      volume,
      timeAgo,
      savings,
    };
  };

  const showNotification = () => {
    const message = generateMessage();
    setCurrentMessage(message);
    setIsVisible(true);

    // Auto-hide after 6 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 6000);

    // Clear message after animation
    setTimeout(() => {
      setCurrentMessage(null);
    }, 6500);
  };

  useEffect(() => {
    // Show first notification after 10 seconds
    const initialTimer = setTimeout(() => {
      showNotification();
    }, 10000);

    // Then show notifications every 25-45 seconds
    const intervalTimer = setInterval(() => {
      if (!isVisible) {
        const randomDelay = Math.random() * 20000 + 25000; // 25-45 seconds
        setTimeout(() => {
          showNotification();
        }, randomDelay);
      }
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [isVisible]);

  const getMessageContent = (message: SocialProofMessage) => {
    switch (message.type) {
      case 'order':
        return {
          text: `${message.name} from ${message.location} just ordered ${message.volume}L`,
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          color: "border-green-200 bg-green-50"
        };
      case 'savings':
        return {
          text: `${message.name} from ${message.location} saved £${message.savings} on heating oil`,
          icon: <TrendingDown className="w-4 h-4 text-blue-500" />,
          color: "border-blue-200 bg-blue-50"
        };
      case 'quote':
        return {
          text: `${message.name} from ${message.location} just received a quote`,
          icon: <Clock className="w-4 h-4 text-orange-500" />,
          color: "border-orange-200 bg-orange-50"
        };
      default:
        return {
          text: `${message.name} from ${message.location} is comparing prices`,
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          color: "border-green-200 bg-green-50"
        };
    }
  };

  if (!currentMessage) return null;

  const messageContent = getMessageContent(currentMessage);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 left-4 z-50 max-w-xs sm:max-w-sm"
        >
          <Card className={`p-3 shadow-lg border-l-4 ${messageContent.color}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1">
                {messageContent.icon}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 leading-tight">
                    {messageContent.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentMessage.timeAgo}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setIsVisible(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 -m-1"
                aria-label="Close notification"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to control social proof display
export function useSocialProofTrigger() {
  const [triggerCount, setTriggerCount] = useState(0);

  const triggerSocialProof = () => {
    setTriggerCount(prev => prev + 1);
  };

  return { triggerSocialProof, triggerCount };
}