import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '../lib/gtm';

export const useGTMPageTracking = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);
  
  useEffect(() => {
    if (location !== prevLocationRef.current) {
      trackPageView(window.location.href, document.title);
      prevLocationRef.current = location;
    }
  }, [location]);
};