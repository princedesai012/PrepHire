// import { Toaster } from "@/components/ui/toaster";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google'; // Add this import

import Index from "./pages/Index.";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import AnalyzeResume from "./pages/AnalyzeResume";
import InterviewPage from "./pages/InterviewPage";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster richColors position="top-center" />
      {/* <Sonner /> */}
      <BrowserRouter>
      <ScrollToTop /> 
        <Routes>
          {/* <Route path="/" element={<Index />} /> */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />   
          <Route path="/analyze-resume" element={<AnalyzeResume />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  <GoogleOAuthProvider clientId="88929798729-vrm6civj7erlf8di1h3lq9tgsggc6ull.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* <Toaster />
        <Sonner /> */}
        <BrowserRouter>
          <ScrollToTop /> 
          <Routes>
            {/* <Route path="/" element={<Index />} /> */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/home" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />   
            <Route path="/analyze-resume" element={<AnalyzeResume />} />
            <Route path="/interview" element={<InterviewPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;