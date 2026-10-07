import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import Chatbot from "@/components/chatbot";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import AuthPage from "@/pages/auth-page";
import Results from "@/pages/results";
import Suppliers from "@/pages/suppliers";
import SupplierProfile from "@/pages/supplier-profile";
import Blog from "@/pages/blog";
import BlogArticle from "@/pages/blog-article";
import Dashboard from "@/pages/dashboard";
import SavedQuotesPage from "@/pages/saved-quotes";

import Contact from "@/pages/contact";
import GivingBack from "@/pages/giving-back";
import ThankYouPage from "@/pages/thank-you-page";
import AboutUs from "@/pages/about-us";
import ErrorBoundary from "@/components/error-boundary";
import CookieConsent from "@/components/cookie-consent";
import { useEffect } from "react";
import { initGTM } from "@/lib/gtm";
import { useGTMPageTracking } from "@/hooks/use-gtm";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location]);
  return null;
}
import Alerts from "@/pages/alerts";
import ForgotPasswordPage from "./pages/forgot-password";
import ResetPasswordPage from "./pages/reset-password";
import HeatingOilLocation from "@/pages/heating-oil-location";
import HeatingOilPricesIndex from "@/pages/heating-oil-prices-index";
import NIPriceIndex from "@/pages/ni-price-index";
import CompareHeating from "@/pages/compare-heating";
import Sitemap from "@/pages/sitemap";

function Router() {
  // Track page views when routes change
  useGTMPageTracking();

  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/login" component={() => <Redirect to="/auth" />} />
      <Route path="/register" component={() => <Redirect to="/auth" />} />
      <Route path="/results" component={Results} />
      <Route path="/compare" component={() => <Redirect to="/results" />} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/suppliers" component={Suppliers} />
      <Route path="/suppliers/:supplierId" component={SupplierProfile} />
      <Route path="/supplier/:supplierId" component={SupplierProfile} />
      <Route path="/heating-oil-prices" component={HeatingOilPricesIndex} />
      <Route path="/heating-oil-prices/" component={HeatingOilPricesIndex} />
      <Route path="/heating-oil-prices/:location" component={HeatingOilLocation} />
      <Route path="/ni-heating-oil-price-index" component={NIPriceIndex} />
      <Route path="/heating-oil-price-index" component={NIPriceIndex} />
      <Route path="/heating-oil-price-index/" component={NIPriceIndex} />
      <Route path="/compare-heating" component={CompareHeating} />
      <Route path="/sitemap" component={Sitemap} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={AboutUs} />
      <Route path="/giving-back" component={GivingBack} />
      <Route path="/thank-you" component={ThankYouPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/saved-quotes" component={SavedQuotesPage} />

      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

function App() {
  // Initialize Google Tag Manager when app loads (optional)
  useEffect(() => {
    if (import.meta.env.VITE_GTM_ID) {
      initGTM();
    }
    // Note: GTM is optional - site works fine without it
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <Chatbot />
            <CookieConsent />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
