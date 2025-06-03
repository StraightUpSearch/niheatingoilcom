// Google Tag Manager integration
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const GTM_ID = import.meta.env.VITE_GTM_ID;

// Initialize Google Tag Manager
export const initGTM = () => {
  if (!GTM_ID) {
    console.warn('Missing GTM ID: VITE_GTM_ID');
    return;
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // Add GTM script to head
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);

  // Initialize GTM
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !window.dataLayer) return;
  
  window.dataLayer.push({
    event: 'page_view',
    page_location: url,
    page_title: title || document.title
  });
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.dataLayer) return;
  
  window.dataLayer.push({
    event: eventName,
    ...parameters
  });
};

// Track price searches
export const trackPriceSearch = (postcode: string, volume: number) => {
  trackEvent('price_search', {
    search_term: postcode,
    volume: volume,
    timestamp: new Date().toISOString()
  });
};

// Track quote requests
export const trackQuoteRequest = (supplier: string, volume: number, postcode: string) => {
  trackEvent('quote_request', {
    supplier_name: supplier,
    volume: volume,
    postcode: postcode,
    timestamp: new Date().toISOString()
  });
};

// Track WhatsApp shares
export const trackWhatsAppShare = (supplier: string, postcode: string) => {
  trackEvent('whatsapp_share', {
    supplier_name: supplier,
    postcode: postcode,
    share_method: 'whatsapp',
    timestamp: new Date().toISOString()
  });
};

// Track blog article views
export const trackBlogView = (articleTitle: string, articleSlug: string) => {
  trackEvent('blog_view', {
    article_title: articleTitle,
    article_slug: articleSlug,
    content_type: 'blog_article',
    timestamp: new Date().toISOString()
  });
};

// Track lead submissions
export const trackLeadSubmission = (supplier: string, volume: number, urgency: string) => {
  trackEvent('lead_submission', {
    supplier_name: supplier,
    volume: volume,
    urgency: urgency,
    form_type: 'quote_request',
    timestamp: new Date().toISOString()
  });
};