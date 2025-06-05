import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingDown } from "lucide-react";

interface NotificationData {
  name: string;
  location: string;
  savings: number;
  phrase: string;
  action: string;
}

const northernIrishNames = [
  "Sarah", "Emma", "Claire", "Mary", "Lisa", "Jane", "Amy", "Ruth", "Anna", "Grace",
  "Liam", "Mark", "Tom", "Joe", "James", "David", "John", "Michael", "Paul", "Sean",
  "Aoife", "Niamh", "Ciara", "Sinead", "Orlaith", "Caoimhe", "Siobhan", "Mairead",
  "Connor", "Eoin", "Cian", "Oisin", "Ruairi", "Paddy", "Brendan", "Declan"
];

const northernIrishLocations = [
  "Belfast", "Derry", "Lisburn", "Armagh", "Enniskillen", "Newry", "Bangor", 
  "Newtownabbey", "Craigavon", "Carrickfergus", "Ballymena", "Omagh", "Larne",
  "Antrim", "Coleraine", "Dungannon", "Lurgan", "Portadown", "Downpatrick",
  "Magherafelt", "Cookstown", "Strabane", "Limavady", "Ballycastle", "Newcastle",
  "Comber", "Holywood", "Carryduff", "Jordanstown", "Greenisland"
];

const northernIrishPhrases = [
  "dead on!", "fair play to them!", "chuffed to bits!", "over the moon!",
  "That's some quare deal!", "That's a belter of a bargain!", "Happy days!",
  "Class act!", "Brilliant so it is!", "Pure dead brilliant!", "Sound as a pound!",
  "That's the bee's knees!", "At's a geg!", "Right pleased!", "Made up!", "Buzzing!",
  "That's cracking!", "What a steal!", "Delighted!", "Proper chuffed!",
  "Oh mummy, what a deal!", "At's us nai with the savings!", "Pure class!",
  "Scundered... with how much they saved!", "Bout ye? Just saved a fortune!",
  "That's some craic!", "Fair dinkum deal!", "Can't bate it!"
];

const actionPhrases = [
  "just saved", "nabbed a cracking deal and saved", "found a belter and saved",
  "compared prices and saved", "got a brilliant deal, saving", "struck gold, saving",
  "hit the jackpot with", "bagged a bargain worth", "discovered savings of",
  "uncovered a deal saving", "landed a steal worth", "scored big with"
];

const generateNotification = (): NotificationData => {
  const name = northernIrishNames[Math.floor(Math.random() * northernIrishNames.length)];
  const location = northernIrishLocations[Math.floor(Math.random() * northernIrishLocations.length)];
  const savings = Math.floor(Math.random() * 45) + 10; // £10-£55 savings
  const phrase = northernIrishPhrases[Math.floor(Math.random() * northernIrishPhrases.length)];
  const action = actionPhrases[Math.floor(Math.random() * actionPhrases.length)];

  return { name, location, savings, phrase, action };
};

export default function SocialProofNotifications() {
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [sessionEngagement, setSessionEngagement] = useState({
    timeOnPage: 0,
    interactions: 0,
    scrollEvents: 0
  });
  const [hasShownInitial, setHasShownInitial] = useState(false);

  // Track scroll depth and user interactions
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = Math.round((scrollTop / docHeight) * 100);
      
      setScrollDepth(depth);
      setSessionEngagement(prev => ({
        ...prev,
        scrollEvents: prev.scrollEvents + 1
      }));
    };

    const handleInteraction = () => {
      setSessionEngagement(prev => ({
        ...prev,
        interactions: prev.interactions + 1
      }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  // Track time on page
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionEngagement(prev => ({
        ...prev,
        timeOnPage: prev.timeOnPage + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDismissed) return;

    const showNotification = () => {
      const notification = generateNotification();
      setCurrentNotification(notification);
      setIsVisible(true);

      // Auto-dismiss after 6 seconds
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setCurrentNotification(null), 500);
      }, 6000);
    };

    // Check if user is engaged (lower thresholds for better UX)
    const isEngaged = sessionEngagement.timeOnPage > 8 || 
                     sessionEngagement.interactions > 1 || 
                     sessionEngagement.scrollEvents > 3;

    // Show first notification when user is engaged AND has scrolled 30%+
    if (!hasShownInitial && isEngaged && scrollDepth > 30) {
      const timer = setTimeout(() => {
        showNotification();
        setHasShownInitial(true);
      }, 45000); // Wait 45 seconds
      return () => clearTimeout(timer);
    }

    // Show subsequent notifications for engaged users (very infrequent)
    if (hasShownInitial && isEngaged && sessionEngagement.timeOnPage > 180) {
      const interval = setInterval(() => {
        // Only show if user is active, has scrolled, and not currently visible
        if (!isVisible && scrollDepth > 50) {
          // 5% probability every 5 minutes for engaged users
          if (Math.random() < 0.05) {
            showNotification();
          }
        }
      }, 300000); // Check every 5 minutes

      return () => clearInterval(interval);
    }
  }, [scrollDepth, sessionEngagement, hasShownInitial, isVisible, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    setTimeout(() => setCurrentNotification(null), 500);
  };

  if (!currentNotification || isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, x: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 left-4 z-50 max-w-sm"
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 relative">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start space-x-3 pr-6">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-green-600" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-900">
                  <span className="font-medium">{currentNotification.name}</span>
                  <span className="text-gray-600"> from </span>
                  <span className="font-medium">{currentNotification.location}</span>
                  <span className="text-gray-600"> {currentNotification.action} </span>
                  <span className="font-semibold text-green-600">£{currentNotification.savings}</span>
                  <span className="text-gray-600"> on heating oil – </span>
                  <span className="text-accent font-medium">{currentNotification.phrase}</span>
                </div>
                
                <div className="mt-1 text-xs text-gray-500">
                  💡 Recent customer example - Join thousands saving money!
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}