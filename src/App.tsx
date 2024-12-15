import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import Track from "./pages/Track";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/sign-in" element={<AppLayout><SignIn /></AppLayout>} />
          <Route path="/sign-up" element={<AppLayout><SignUp /></AppLayout>} />
          <Route path="/onboarding" element={<AppLayout><Onboarding /></AppLayout>} />
          <Route path="/track" element={<AppLayout><Track /></AppLayout>} />
          <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;