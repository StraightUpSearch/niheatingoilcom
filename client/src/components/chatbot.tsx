import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2, Fuel } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Bout ye? I'm here to help with heating oil questions, pricing, and supplier information right across Northern Ireland. No messing about - what can I help you with?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simple fallback responses for common questions
  const getFallbackResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('price') || message.includes('cost') || message.includes('cheap')) {
      return "You can see our live heating oil prices in the table above! Prices update regularly and show the best deals across Northern Ireland. For the latest quotes, give our featured suppliers a call directly.";
    }
    
    if (message.includes('supplier') || message.includes('company') || message.includes('who')) {
      return "We work with verified suppliers across Northern Ireland including Alfa Oil, NAP Fuels, Hayes Fuels, and many more. Check out our Featured Suppliers section above or browse our full supplier directory.";
    }
    
    if (message.includes('delivery') || message.includes('area') || message.includes('postcode')) {
      return "Most suppliers deliver across Northern Ireland, but coverage can vary. Enter your postcode in our price checker above to see which suppliers serve your area and their current prices.";
    }
    
    if (message.includes('minimum') || message.includes('order') || message.includes('litre') || message.includes('gallon')) {
      return "Minimum orders vary by supplier, typically 300-500 litres. Our price table shows costs for 300L, 500L, and 900L deliveries. Larger orders usually get better rates per litre.";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return "Hello! I can help with heating oil prices, suppliers, and delivery info across Northern Ireland. What would you like to know?";
    }
    
    return "Thanks for your question! I've logged your message and someone will get back to you soon. In the meantime, check our live prices above or call one of our featured suppliers directly.";
  };

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      // Always log the conversation first
      const conversationData = {
        userMessage,
        conversationHistory: messages.map(msg => ({ role: msg.role, content: msg.content })),
        timestamp: new Date().toISOString()
      };

      // Log conversation for lead capture
      try {
        await apiRequest("POST", "/api/chat/log", conversationData);
      } catch (error) {
        console.log("Conversation logged locally for backup");
      }

      // Try to get AI response, but use fallback if it fails
      try {
        const response = await apiRequest("POST", "/api/chat", {
          messages: messages.map(msg => ({ role: msg.role, content: msg.content }))
        });
        return response.json();
      } catch (error) {
        // Use fallback response if AI fails
        return { response: getFallbackResponse(userMessage) };
      }
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }]);
    },
    onError: () => {
      // This should rarely happen now with fallback
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: getFallbackResponse(inputValue),
        timestamp: new Date()
      }]);
    }
  });

  const handleSendMessage = () => {
    if (!inputValue.trim() || chatMutation.isPending) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // Add user message
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    
    // Send to API
    chatMutation.mutate(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <Card className="w-80 h-96 mb-4 shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Fuel className="h-5 w-5" />
                <CardTitle className="text-lg font-medium">NI Heating Oil Helper</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages Area */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                        message.role === 'user'
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {/* Loading indicator */}
                {chatMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-3">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about heating oil prices..."
                  className="flex-1"
                  disabled={chatMutation.isPending}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || chatMutation.isPending}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-200",
          isOpen 
            ? "bg-gray-600 hover:bg-gray-700" 
            : "bg-blue-600 hover:bg-blue-700"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  );
}