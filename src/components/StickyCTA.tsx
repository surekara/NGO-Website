import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const dismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-8 z-50"
        >
          <div className="bg-gradient-to-r from-prachetas-yellow to-yellow-300 text-black p-4 rounded-2xl shadow-2xl shadow-yellow-400/30 flex items-center gap-4 max-w-sm">
            <div className="flex-1">
              <p className="font-bold text-sm">Make a Difference Today</p>
              <p className="text-xs opacity-80">Your donation helps those in need</p>
            </div>
            <Button asChild size="sm" className="bg-black text-white hover:bg-gray-900">
              <Link to="/donate">Donate</Link>
            </Button>
            <button
              onClick={dismiss}
              className="p-1 hover:bg-black/10 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCTA;
