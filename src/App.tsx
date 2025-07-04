
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Founders from "./pages/Founders";
import Validator from "./pages/Validator";
import ServiceGig from "./pages/ServiceGig";
import PPTGenerator from "./pages/PPTGenerator";
import ResumeBuilder from "./pages/ResumeBuilder";
import ReportGenerator from "./pages/ReportGenerator";
import LeadGenerator from "./pages/LeadGenerator";
import MailMerger from "./pages/MailMerger";
import PromptGuide from "./pages/PromptGuide";
import LearningGuide from "./pages/LearningGuide";
import WebsiteBuilder from "./pages/WebsiteBuilder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/founders" element={<Founders />} />
          <Route path="/validator" element={<Validator />} />
          <Route path="/ppt-generator" element={<PPTGenerator />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/report-generator" element={<ReportGenerator />} />
          <Route path="/lead-generator" element={<LeadGenerator />} />
          <Route path="/mail-merger" element={<MailMerger />} />
          <Route path="/prompt-guide" element={<PromptGuide />} />
          <Route path="/learning-guide" element={<LearningGuide />} />
          <Route path="/website-builder" element={<WebsiteBuilder />} />
          <Route path="/services/:service" element={<ServiceGig />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
