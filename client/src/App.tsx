import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth";
import DashboardPage from "@/pages/dashboard";
import MissionsPage from "@/pages/missions";
import CharacterPage from "@/pages/character";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import { UserData } from "@/lib/types";
import { LocalStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

function Router() {
  const [user, setUser] = useState<UserData | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        LocalStorage.setUser(data.user);
      } else {
        // Check localStorage for offline mode
        const storedUser = LocalStorage.getUser();
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Fallback to localStorage
      const storedUser = LocalStorage.getUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    LocalStorage.setUser(userData);
    toast({
      title: "Login realizado com sucesso!",
      description: `Bem-vindo de volta, ${userData.username}!`,
    });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }

    setUser(null);
    LocalStorage.clearAll();
    toast({
      title: "Logout realizado",
      description: "Até mais, Hunter!",
    });
  };

  const updateUser = (updatedUser: UserData) => {
    setUser(updatedUser);
    LocalStorage.setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="system-panel rounded-xl p-8 animate-pulse">
          <div className="font-orbitron text-xl font-bold text-primary glow-text">
            SystemOS
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Carregando sistema...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
      
      <main className="p-4 space-y-6">
        {currentTab === 'dashboard' && (
          <DashboardPage user={user} updateUser={updateUser} />
        )}
        {currentTab === 'missions' && (
          <MissionsPage user={user} updateUser={updateUser} />
        )}
        {currentTab === 'character' && (
          <CharacterPage user={user} updateUser={updateUser} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Switch>
          <Route path="/" component={Router} />
          <Route component={NotFound} />
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
