import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop";
import ProgressBar from "./components/ProgressBar";
import BackToTop from "./components/BackToTop";
import StickyCTA from "./components/StickyCTA";
import CustomCursor from "./components/CustomCursor";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Donate from "./pages/Donate";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Impact from "./pages/Impact";
import GetInvolved from "./pages/GetInvolved";
import Contact from "./pages/Contact";
import Volunteer from "./pages/Volunteer";
import Partner from "./pages/Partner";
import EducationProgram from "./pages/EducationProgram";
import FoodDistributionProgram from "./pages/FoodDistributionProgram";
import WellnessProgram from "./pages/WellnessProgram";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import FundraiserPage from "./pages/FundraiserPage";
import CreateFundraiserLink from "./pages/CreateFundraiserLink";

const queryClient = new QueryClient();

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ProgressBar />
        <ScrollToTop />
        <BackToTop />
        <StickyCTA />
        <CustomCursor />
        <Routes>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/programs" element={<PageTransition><Programs /></PageTransition>} />
          <Route path="/programs/education" element={<PageTransition><EducationProgram /></PageTransition>} />
          <Route path="/programs/food-distribution" element={<PageTransition><FoodDistributionProgram /></PageTransition>} />
          <Route path="/programs/wellness" element={<PageTransition><WellnessProgram /></PageTransition>} />
          <Route path="/terms-of-service" element={<PageTransition><TermsOfService /></PageTransition>} />
          <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          <Route path="/refund-policy" element={<PageTransition><RefundPolicy /></PageTransition>} />
          <Route path="/impact" element={<PageTransition><Impact /></PageTransition>} />
          <Route path="/get-involved" element={<PageTransition><GetInvolved /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/donate" element={<PageTransition><Donate /></PageTransition>} />
          <Route path="/volunteer" element={<PageTransition><Volunteer /></PageTransition>} />
          <Route path="/partner" element={<PageTransition><Partner /></PageTransition>} />
          <Route path="/programs/tech-education" element={<PageTransition><EducationProgram /></PageTransition>} />
          <Route path="/programs/green-cloud" element={<PageTransition><WellnessProgram /></PageTransition>} />
          <Route path="/programs/training" element={<PageTransition><EducationProgram /></PageTransition>} />
          <Route path="/fundraise/:slug" element={<PageTransition><FundraiserPage /></PageTransition>} />
          <Route path="/create-fundraiser" element={<PageTransition><CreateFundraiserLink /></PageTransition>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
