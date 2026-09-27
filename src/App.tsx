import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProgressBar from "./components/ProgressBar";
import BackToTop from "./components/BackToTop";
import StickyCTA from "./components/StickyCTA";
import WhatsAppFloat from "./components/WhatsAppFloat";
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
import Collaborations from "./pages/Collaborations";
import CollaborationDetail from "./pages/CollaborationDetail";

const queryClient = new QueryClient();

const curtainEase = [0.76, 0, 0.24, 1] as const;

const Curtain = () => (
  <>
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[200] bg-prachetas-yellow pointer-events-none"
      initial={{ y: "0%" }}
      animate={{ y: "-100%", transition: { duration: 0.7, ease: curtainEase, delay: 0.18 } }}
      exit={{ y: ["100%", "0%"], transition: { duration: 0.5, ease: curtainEase } }}
    />
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[201] bg-black pointer-events-none flex items-center justify-center"
      initial={{ y: "0%" }}
      animate={{ y: "-100%", transition: { duration: 0.7, ease: curtainEase, delay: 0.05 } }}
      exit={{ y: ["100%", "0%"], transition: { duration: 0.5, ease: curtainEase, delay: 0.08 } }}
    >
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
        exit={{ opacity: [0, 1], scale: [0.9, 1], transition: { duration: 0.35, delay: 0.3 } }}
      >
        <img src="/New_Logo_Whole-White.png" alt="" className="h-14 w-auto" />
        <span className="text-white text-3xl font-bold italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>PRACHETAS</span>
      </motion.div>
    </motion.div>
  </>
);

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <>
    <Curtain />
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 } }}
      exit={{ opacity: 1, transition: { duration: 0.6 } }}
    >
      {children}
    </motion.div>
  </>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <Routes location={location} key={location.pathname}>
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
        <Route path="/collaborations" element={<PageTransition><Collaborations /></PageTransition>} />
        <Route path="/collaborations/:slug" element={<PageTransition><CollaborationDetail /></PageTransition>} />
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
        <BackToTop />
        <StickyCTA />
        <WhatsAppFloat />
        {/* <CustomCursor /> */}
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
