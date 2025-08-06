import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { AppProvider } from "@/contexts/AppContext";
import { Layout } from "@/components/Layout";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Favors from "@/pages/Favors";
import Groups from "@/pages/Groups";
import Notifications from "@/pages/Notifications";
import NotFound from "@/pages/not-found";

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/favors" component={Favors} />
        <Route path="/groups" component={Groups} />
        <Route path="/notifications" component={Notifications} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <AppContent />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
