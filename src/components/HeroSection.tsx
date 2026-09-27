import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, type Variants, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { Magnetic, ScrollCue, Shine, SplitLetters, Sparkles } from "@/components/motion";

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
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const mx = useMotionValue(50);
  const my = useMotionValue(40);
  const glowX = useSpring(useTransform(mx, (v) => `${v}%`), { stiffness: 60, damping: 20 });
  const glowY = useSpring(useTransform(my, (v) => `${v}%`), { stiffness: 60, damping: 20 });

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

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={heroRef}
      className="relative py-24 md:py-36 bg-black text-white overflow-hidden"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
    >
      {/* Background image with parallax-like effect */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20, ease: "easeOut" }}
      >
        <img src="/prachetas-hero-bg.png" className="w-full h-full object-contain opacity-20" alt="" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute z-[11] w-[640px] h-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-3xl"
        style={{ left: glowX, top: glowY }}
      />
      <div className="absolute inset-0 z-[11]"><Sparkles count={28} /></div>

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

      {/* Floating decorative icons */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-400/10"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`,
              fontSize: `${20 + (i % 3) * 10}px`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            ✦
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="container mx-auto px-4 relative z-20"
        style={{ y: contentY, opacity: contentOpacity }}
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

          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight tracking-tight">
            <SplitLetters text="PRACHETAS" delay={0.5} className="text-white" />
            <br />
            <SplitLetters
              text="FOUNDATION"
              delay={0.95}
              gap={0.045}
              letterClassName="bg-gradient-to-r from-prachetas-yellow via-yellow-200 to-prachetas-golden bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x"
            />
          </h1>
          <motion.h2
            className="text-xl md:text-3xl text-yellow-300/80 font-semibold mb-6 uppercase"
            initial={{ opacity: 0, letterSpacing: "0.8em", filter: "blur(6px)" }}
            animate={{ opacity: 1, letterSpacing: "0.1em", filter: "blur(0px)" }}
            transition={{ delay: 1.5, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            Upscaling the World
          </motion.h2>

          <motion.blockquote variants={itemVariants} className="relative pl-6 mb-8 max-w-2xl mx-auto text-left">
            <motion.span
              className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-prachetas-yellow to-prachetas-golden origin-top"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
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
            <Magnetic>
              <Button asChild size="lg"
                className="group relative overflow-hidden bg-prachetas-yellow text-black hover:bg-yellow-300 transition-all px-8 py-6 text-lg font-bold shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/60">
                <Link to="/donate">
                  <Shine />
                  <span className="relative">Donate Now</span>
                  <ArrowRight className="relative ml-2 h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                </Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button onClick={openVideo} size="lg" variant="outline"
                className="group relative border-2 border-prachetas-yellow bg-transparent text-prachetas-yellow hover:bg-prachetas-yellow hover:text-black transition-all px-8 py-6 text-lg font-semibold">
                <span className="relative mr-2 flex h-6 w-6 items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-prachetas-yellow/40 animate-ping" />
                  <Play className="relative h-5 w-5" fill="currentColor" />
                </span>
                Watch Our Story
              </Button>
            </Magnetic>
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
                className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/60 px-6 py-5 rounded-xl transition-colors hover:bg-white/10 cursor-default hover:shadow-[0_0_30px_-5px_rgba(255,215,0,0.4)]"
                initial={{ opacity: 0, y: 30, rotateX: -40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 2 + idx * 0.15, type: "spring", stiffness: 120, damping: 14 }}
                whileHover={{ y: -8, scale: 1.05 }}
                style={{ transformPerspective: 600 }}
              >
                <Shine />
                <div className="text-3xl md:text-4xl font-extrabold text-prachetas-yellow tabular-nums">{value}</div>
                <div className="text-xs uppercase tracking-widest text-gray-400 mt-1">{label}</div>
              </motion.div>
            ))}
          </motion.div>
          <ScrollCue className="mt-14" />
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
