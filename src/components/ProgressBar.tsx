import { motion, useScroll, useSpring } from "framer-motion";

const ProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 origin-left bg-gradient-to-r from-prachetas-yellow via-yellow-200 to-prachetas-golden z-[60] shadow-[0_0_12px_rgba(255,215,0,0.7)]"
      style={{ scaleX }}
    />
  );
};

export default ProgressBar;
