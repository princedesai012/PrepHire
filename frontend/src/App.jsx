import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import AnalyzeResume from "./pages/AnalyzeResume";
import InterviewPage from "./pages/InterviewPage"; // 👈 This should point to your InterviewSetup UI
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";
import useLogoutOnClose from "@/hooks/useLogoutOnClose";
import InterviewSetup from "./pages/InterviewSetup";
import ForgotPassword from "./pages/ForgotPassword"; // Import the new component

// ✅ Internal route wrapper to use hook
const AppRoutes = () => {
  // useLogoutOnClose(); // Handles auto logout on tab close

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Index />} />
        <Route path="/analyze-resume" element={<AnalyzeResume />} />

        {/* ✅ Protected routes */}
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/interview" element={<InterviewPage />} />
      <Route path="/interview-choice" element={<InterviewSetup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* You will also need a route for the actual password reset page */}
        {/* <Route path="/reset-password" element={<ResetPassword />} />  */}
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
