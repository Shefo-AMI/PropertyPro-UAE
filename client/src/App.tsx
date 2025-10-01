import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Properties from "@/pages/properties";
import Units from "@/pages/units";
import Tenants from "@/pages/tenants";
import Maintenance from "@/pages/maintenance";
import Calendar from "@/pages/calendar";
import Signup from "@/pages/signup";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/signup" component={Signup} />
          <Route path="/properties" component={Properties} />
          <Route path="/units" component={Units} />
          <Route path="/tenants" component={Tenants} />
          <Route path="/maintenance" component={Maintenance} />
          <Route path="/calendar" component={Calendar} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
