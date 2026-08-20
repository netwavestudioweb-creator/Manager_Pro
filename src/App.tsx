import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PreferencesProvider } from "./contexts/PreferencesContext";
import "./i18n";
import LoadingScreen from "./components/LoadingScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import Maintenance from "./pages/Maintenance";
import Breakdowns from "./pages/Breakdowns";
import Reservations from "./pages/Reservations";
import Fuel from "./pages/Fuel";
import Drivers from "./pages/Drivers";
import Alerts from "./pages/Alerts";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PreferencesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
            <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
              <BrowserRouter>
                <Routes>
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/vehicles" element={<Vehicles />} />
                            <Route path="/maintenance" element={<Maintenance />} />
                            <Route path="/breakdowns" element={<Breakdowns />} />
                            <Route path="/reservations" element={<Reservations />} />
                            <Route path="/fuel" element={<Fuel />} />
                            <Route path="/drivers" element={<Drivers />} />
                            <Route path="/alerts" element={<Alerts />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </PreferencesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
