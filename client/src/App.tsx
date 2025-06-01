import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import PriceComparison from "@/pages/price-comparison";
import PriceAlerts from "@/pages/price-alerts";
import Suppliers from "@/pages/suppliers";
import Login from "@/pages/login";
import Register from "@/pages/register";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/compare" component={PriceComparison} />
          <Route path="/suppliers" component={Suppliers} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/compare" component={PriceComparison} />
          <Route path="/alerts" component={PriceAlerts} />
          <Route path="/suppliers" component={Suppliers} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
