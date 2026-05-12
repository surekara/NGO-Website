import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const useCounter = (target: number, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

const HeroSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [countersStarted, setCountersStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });

  const livesCount     = useCounter(50000, 2200, countersStarted);
  const volunteerCount = useCounter(100,   1800, countersStarted);
  const programCount   = useCounter(25,    1500, countersStarted);

  const openVideo  = () => setIsVideoOpen(true);
  const closeVideo = () => setIsVideoOpen(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCountersStarted(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isVideoOpen) closeVideo(); };
    if (isVideoOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.removeEventListener('keydown', handleEscape); document.body.style.overflow = 'unset'; };
  }, [isVideoOpen]);

  const fmt = (n: number, suffix: string) =>
    n >= 1000 ? `${(n / 1000).toFixed(0)}K+` : `${n}${suffix}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section ref={heroRef} className="relative py-24 md:py-36 bg-black text-white overflow-hidden">
      {/* Background image with parallax-like effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20, ease: "easeOut" }}
      >
        <img src="/prachetas-hero-bg.png" className="w-full h-full object-contain opacity-20" alt="" />
      </motion.div>

      {/* Particle background */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0,
            }}
            animate={{
              y: [null, -Math.random() * 500 - 200],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Enhanced glowing orbs with animation */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/15 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-yellow-300/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Content */}
      <motion.div
        className="container mx-auto px-4 relative z-20"
        variants={containerVariants}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
      >
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 hover:bg-yellow-400/20 transition-colors cursor-default">
            <motion.span
              className="w-2 h-2 bg-yellow-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Registered Charitable Trust · MAHA/953/2022
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-4 leading-tight tracking-tight">
            <span className="text-white">PRACHETAS</span><br />
            <motion.span
              className="text-prachetas-yellow bg-gradient-to-r from-prachetas-yellow via-yellow-300 to-prachetas-yellow bg-clip-text text-transparent animate-gradient-x"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              FOUNDATION
            </motion.span>
          </motion.h1>
          <motion.h2 variants={itemVariants} className="text-xl md:text-3xl text-yellow-300/80 font-semibold mb-6 tracking-widest uppercase">
            Upscaling the World
          </motion.h2>

          <motion.blockquote variants={itemVariants} className="border-l-4 border-prachetas-yellow pl-6 mb-8 max-w-2xl mx-auto text-left">
            <p className="text-lg md:text-xl text-gray-200 italic font-medium leading-relaxed">
              "Together, let's create a society that thrives on compassion, wisdom, and action."
            </p>
          </motion.blockquote>

          <motion.p variants={itemVariants} className="text-gray-300 mb-10 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            A charitable trust committed to uplifting lives through food security, value-based education, and holistic wellness —
            <span className="text-yellow-400 font-medium"> empowering people to rise with dignity, purpose, and community support.</span>
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center mb-12">
            <Button asChild size="lg"
              className="bg-prachetas-yellow text-black hover:bg-yellow-300 transition-all px-8 py-6 text-lg font-bold shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:scale-105 transform">
              <Link to="/donate">
                Donate Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button onClick={openVideo} size="lg" variant="outline"
              className="border-2 border-prachetas-yellow text-prachetas-yellow hover:bg-prachetas-yellow hover:text-black transition-all px-8 py-6 text-lg font-semibold hover:scale-105 transform">
              <Play className="mr-2 h-5 w-5" /> Watch Our Story
            </Button>
          </motion.div>

          {/* Animated stats */}
          <motion.div
            ref={statsRef}
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {[
              { value: fmt(livesCount, '+'), label: 'Lives Impacted' },
              { value: `${volunteerCount}+`, label: 'Active Volunteers' },
              { value: `${programCount}+`, label: 'Programs Running' },
            ].map(({ value, label }, idx) => (
              <motion.div
                key={label}
                className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/50 px-6 py-5 rounded-xl transition-all hover:bg-white/10 hover:scale-105 cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl md:text-4xl font-extrabold text-prachetas-yellow tabular-nums">{value}</div>
                <div className="text-xs uppercase tracking-widest text-gray-400 mt-1">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Video Modal with animation */}
      {isVideoOpen && (
        <motion.div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <button onClick={closeVideo}
              className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors hover:scale-110 transform"
              aria-label="Close video">
              <X className="h-6 w-6" />
            </button>
            <video src="/prachetas_intro.mp4" controls autoPlay className="w-full h-full object-contain" onEnded={closeVideo}>
              <track kind="captions" src="" label="English" default />
            </video>
          </motion.div>
          <button className="absolute inset-0 -z-10 w-full h-full bg-transparent cursor-pointer"
            onClick={closeVideo} aria-label="Close" tabIndex={-1} />
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;
