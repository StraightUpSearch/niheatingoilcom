import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  Send, 
  Loader2, 
  ThermometerSnowflake,
  TrendingDown,
  Users,
  Mic,
  Settings,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

interface WeeHelperChatbotProps {
  postcode?: string;
  currentPrice?: string;
  onQuoteRequest?: () => void;
}

type PersonalityMode = 'full_craic' | 'professional' | 'minimal';

const GREETING_MESSAGES = {
  full_craic: [
    "Bout ye! 👋 What's the craic? Looking for some heating oil?",
    "Well hello there! Baltic out there today, isn't it? Time to top up the tank?",
    "Ah, great to see you! Let's get you sorted with some oil before you're foundered!"
  ],
  professional: [
    "Hello! Welcome to NI Heating Oil. How can I help you today?",
    "Good day! I'm here to help you find the best heating oil prices.",
    "Welcome! Let me assist you with your heating oil needs."
  ],
  minimal: [
    "Hi. Need oil?",
    "Hello. How can I help?",
    "Welcome. Check prices?"
  ]
};

const QUICK_SUGGESTIONS = [
  "Check today's prices",
  "When should I order?",
  "Join a group buy",
  "Track my usage"
];

export default function WeeHelperChatbot({ 
  postcode, 
  currentPrice,
  onQuoteRequest 
}: WeeHelperChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [personalityMode, setPersonalityMode] = useState<PersonalityMode>('full_craic');
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetings = GREETING_MESSAGES[personalityMode];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      
      setMessages([{
        id: '1',
        text: randomGreeting,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: QUICK_SUGGESTIONS
      }]);
    }
  }, [isOpen, personalityMode]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateResponse(input, personalityMode, postcode, currentPrice);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (
    userInput: string, 
    mode: PersonalityMode, 
    postcode?: string,
    price?: string
  ): Message => {
    const input = userInput.toLowerCase();
    let response = "";
    let suggestions: string[] = [];

    // Price check
    if (input.includes("price") || input.includes("cost") || input.includes("how much")) {
      if (mode === 'full_craic') {
        response = price 
          ? `Right, so prices in your area are sitting at ${price}/L just now. Not too bad! Though I've seen them drop a wee bit on Tuesdays. Want me to set up a price alert for you? Could save you a few bob! 💰`
          : "I'll need your postcode to check the prices in your area. What's your postcode there?";
        suggestions = ["Set price alert", "Show price history", "Predict best time"];
      } else if (mode === 'professional') {
        response = price
          ? `Current price in your area: ${price}/L. Would you like to see historical trends?`
          : "Please provide your postcode for accurate pricing.";
        suggestions = ["View trends", "Set alert", "Get quote"];
      } else {
        response = price ? `${price}/L` : "Postcode?";
        suggestions = ["Order", "History", "Alert"];
      }
    }
    
    // Weather-based
    else if (input.includes("cold") || input.includes("baltic") || input.includes("weather")) {
      if (mode === 'full_craic') {
        response = "Ach, I know! It's Baltic out there! ❄️ The forecast shows it getting worse next week too. Your tank's probably working overtime - might be worth checking your levels. Will I have a look at prices for a top-up?";
        suggestions = ["Check prices now", "Estimate usage", "Weather forecast"];
      } else {
        response = "Cold weather increases oil consumption. Shall I check current prices?";
        suggestions = ["Check prices", "Calculate usage", "View forecast"];
      }
    }
    
    // Group buying
    else if (input.includes("group") || input.includes("neighbor") || input.includes("neighbour")) {
      if (mode === 'full_craic') {
        response = "Brilliant idea! 🏘️ There's actually 3 other households in your area looking to order this week. If you all go in together, you could save about 5% - that's nearly £15 on a 500L order! Want me to see about getting you all connected?";
        suggestions = ["Join group buy", "Share with neighbors", "See savings"];
      } else {
        response = "Group buying available. 3 neighbors interested. 5% potential savings.";
        suggestions = ["Join group", "View details", "Calculate savings"];
      }
    }
    
    // Best time to order
    else if (input.includes("when") || input.includes("best time")) {
      if (mode === 'full_craic') {
        response = "Good question! 🎯 Based on the last few years, prices usually dip a wee bit just after the school holidays. But with this cold snap coming, I'd say order by Wednesday - prices might jump 3-4p by the weekend. Want me to lock in today's price for 24 hours?";
        suggestions = ["Lock price now", "Set reminder", "See predictions"];
      } else {
        response = "Optimal ordering: Within 3 days. Price increase expected due to weather.";
        suggestions = ["Lock price", "View forecast", "Order now"];
      }
    }
    
    // Default
    else {
      if (mode === 'full_craic') {
        response = "I'm not quite sure what you're after there! But I can help you check prices, find the best time to order, or even set up a group buy with your neighbors. What would you like to do?";
      } else if (mode === 'professional') {
        response = "I can help with prices, ordering, and savings. What would you like to know?";
      } else {
        response = "Options: Prices, Order, Save.";
      }
      suggestions = QUICK_SUGGESTIONS;
    }

    return {
      id: Date.now().toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSend();
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak now - I'll understand your accent!",
      });
      
      // Simulate voice recognition
      setTimeout(() => {
        setInput("What's the price today?");
        setIsListening(false);
        handleSend();
      }, 3000);
    }
  };

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-96 h-[600px] shadow-xl z-50">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ThermometerSnowflake className="h-5 w-5" />
                <CardTitle className="text-lg">Wee Helper</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => {
                    const modes: PersonalityMode[] = ['full_craic', 'professional', 'minimal'];
                    const currentIndex = modes.indexOf(personalityMode);
                    const nextMode = modes[(currentIndex + 1) % modes.length];
                    setPersonalityMode(nextMode);
                    toast({
                      title: "Personality changed!",
                      description: `Switched to ${nextMode.replace('_', ' ')} mode`,
                    });
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm opacity-90 mt-1">
              {personalityMode === 'full_craic' && "Your friendly oil advisor!"}
              {personalityMode === 'professional' && "Professional assistance"}
              {personalityMode === 'minimal' && "Quick help"}
            </p>
          </CardHeader>

          <CardContent className="p-0 h-[calc(100%-140px)]">
            <ScrollArea className="h-full p-4" ref={scrollRef}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-[80%] ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                  
                  {message.suggestions && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Wee Helper is typing...</span>
                </div>
              )}
            </ScrollArea>
          </CardContent>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={
                  personalityMode === 'full_craic' 
                    ? "What's the craic?" 
                    : "Type your message..."
                }
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleVoiceInput}
                className={isListening ? 'bg-red-100' : ''}
              >
                <Mic className={`h-4 w-4 ${isListening ? 'text-red-500' : ''}`} />
              </Button>
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}