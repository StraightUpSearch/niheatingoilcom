import { Switch, Route } from "wouter";
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
import HtmlSitemap from "@/pages/html-sitemap";
import Contact from "@/pages/contact";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/compare" component={Compare} />
      <Route path="/suppliers" component={Suppliers} />
      <Route path="/suppliers/:supplierId" component={SupplierProfile} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path="/contact" component={Contact} />
      <Route path="/pages/html-sitemap" component={HtmlSitemap} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
