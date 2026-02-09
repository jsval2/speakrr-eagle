import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LiveCalls from "./pages/LiveCalls";
import CallHistory from "./pages/CallHistory";
import Calendar from "./pages/Calendar";
import Customers from "./pages/Customers";
import AIConfiguration from "./pages/AIConfiguration";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import OutboundCalls from "./pages/OutboundCalls";
import NotFound from "./pages/NotFound";
// Auth pages kept for future use
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main dashboard routes */}
          <Route path="/" element={<Index />} />
          <Route path="/live-calls" element={<LiveCalls />} />
          <Route path="/outbound-calls" element={<OutboundCalls />} />
          <Route path="/call-history" element={<CallHistory />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/ai-config" element={<AIConfiguration />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />

          {/* Auth pages (not active, kept for future use) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
