import { Button } from "../components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppQuoteReminderProps {
  ticket: {
    ticket_id: string;
    status: string;
    postcode: string;
    volume: number;
    created_at: string;
  };
}

export default function WhatsAppQuoteReminder({ ticket }: WhatsAppQuoteReminderProps) {
  const handleWhatsAppShare = () => {
    const date = new Date(ticket.created_at).toLocaleDateString('en-GB');
    const time = new Date(ticket.created_at).toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const message = `🛢️ *Heating Oil Quote Reminder*

📋 *Quote ID:* ${ticket.ticket_id}
📍 *Location:* ${ticket.postcode}
⛽ *Volume:* ${ticket.volume}L
📅 *Requested:* ${date} at ${time}
🔄 *Status:* ${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}

💡 *Reminder:* This is your heating oil quote request from NI Heating Oil. Keep this handy for your records!

🌐 *Get more quotes:* https://niheatingoil.com

---
*NI Heating Oil - Northern Ireland's heating oil price comparison service*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleWhatsAppShare}
      className="text-green-600 border-green-200 hover:bg-green-50"
    >
      <MessageCircle className="h-4 w-4 mr-1" />
      Send to WhatsApp
    </Button>
  );
}