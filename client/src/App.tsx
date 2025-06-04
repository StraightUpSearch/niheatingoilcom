import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import Chatbot from "@/components/chatbot";
import SocialProofPopup from "@/components/social-proof-popup";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import AuthPage from "@/pages/auth-page";
import Compare from "@/pages/compare";
import Suppliers from "@/pages/suppliers";
import SupplierProfile from "@/pages/supplier-profile";
import Blog from "@/pages/blog";
import BlogArticle from "@/pages/blog-article";

import Contact from "@/pages/contact";
import GivingBack from "@/pages/giving-back";
import ThankYouPage from "@/pages/thank-you-page";
import AboutUs from "@/pages/about-us";
import { useEffect } from "react";
import { initGTM } from "@/lib/gtm";
import { useGTMPageTracking } from "@/hooks/use-gtm";
import Alerts from "@/pages/alerts";
import ForgotPasswordPage from "./pages/forgot-password";
import ResetPasswordPage from "./pages/reset-password";

function Router() {
  // Track page views when routes change
  useGTMPageTracking();

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/login" component={() => <Redirect to="/auth" />} />
      <Route path="/register" component={() => <Redirect to="/auth" />} />
      <Route path="/compare" component={Compare} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/suppliers" component={Suppliers} />
      <Route path="/suppliers/:supplierId" component={SupplierProfile} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={AboutUs} />
      <Route path="/giving-back" component={GivingBack} />
      <Route path="/thank-you" component={ThankYouPage} />

      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize Google Tag Manager when app loads
  useEffect(() => {
    if (!import.meta.env.VITE_GTM_ID) {
      console.warn('Missing required Google Tag Manager ID: VITE_GTM_ID');
    } else {
      initGTM();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <Chatbot />
          <SocialProofPopup />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;