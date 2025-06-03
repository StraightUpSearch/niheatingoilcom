import React from 'react';
import { MessageCircle } from 'lucide-react';

interface QuoteShareButtonProps {
  postcode: string;
  supplier: string;
  pricePerLitre: number;
  totalCost: number;
  saving: number;
  volume: number;
}

function QuoteShareButton({ 
  postcode, 
  supplier, 
  pricePerLitre, 
  totalCost, 
  saving, 
  volume 
}: QuoteShareButtonProps) {
  // Build the dynamic message
  const rawMessage = `Hi! I just compared heating oil prices for ${postcode} and got a quote from ${supplier}: £${pricePerLitre.toFixed(2)}/L (${volume}L = £${totalCost.toFixed(2)} total), saving me £${saving.toFixed(2)}. Check your own quote here: https://niheatingoil.com#${postcode.replace(/\s+/g, '')}`;
  
  const encodedMessage = encodeURIComponent(rawMessage);

  // Determine WhatsApp URL based on device
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const shareLink = isMobile
    ? `whatsapp://send?text=${encodedMessage}`
    : `https://web.whatsapp.com/send?text=${encodedMessage}`;

  const handleShareClick = () => {
    // Track the share event for analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', 'share_whatsapp', {
        method: 'WhatsApp',
        content_type: 'quote',
        item_id: postcode
      });
    }
  };

  return (
    <a
      href={shareLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleShareClick}
      className="inline-flex items-center justify-center bg-[#25D366] hover:bg-[#1ebe57] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
      aria-label="Share this quote on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 mr-2" aria-hidden="true" />
      Share on WhatsApp
    </a>
  );
}

export default QuoteShareButton;