import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

import Index from "./pages/Index.";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import AnalyzeResume from "./pages/AnalyzeResume";
import InterviewPage from "./pages/InterviewPage";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";
import useLogoutOnClose from "@/hooks/useLogoutOnClose";

// ✅ Separate inner component to use hook
const AppRoutes = () => {
  useLogoutOnClose(); // This hook will now work properly

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Index />} />
        <Route path="/analyze-resume" element={<AnalyzeResume />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>}/>
        <Route path="/interview" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <GoogleOAuthProvider clientId="88929798729-vrm6civj7erlf8di1h3lq9tgsggc6ull.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRoutes />
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
