import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index.";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AnalyzeResume from "./pages/AnalyzeResume";
import InterviewPage from "./pages/InterviewPage";
import ScrollToTop from "@/components/ScrollToTop";


const queryClient = new QueryClient();

const App = () => (
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
);

export default App;