import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, X, Link2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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

  return (
    <section className="relative py-24 md:py-36 bg-black text-white overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src="/prachetas-hero-bg.png" className="w-full h-full object-contain opacity-20" alt="" />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-300/5 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Registered Charitable Trust · MAHA/953/2022
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight tracking-tight">
            <span className="text-white">PRACHETAS</span><br />
            <span className="text-prachetas-yellow">FOUNDATION</span>
          </h1>
          <h2 className="text-xl md:text-3xl text-yellow-300/80 font-semibold mb-6 tracking-widest uppercase">
            Upscaling the World
          </h2>

          <blockquote className="border-l-4 border-prachetas-yellow pl-6 mb-8 max-w-2xl mx-auto text-left">
            <p className="text-lg md:text-xl text-gray-200 italic font-medium leading-relaxed">
              "Together, let's create a society that thrives on compassion, wisdom, and action."
            </p>
          </blockquote>

          <p className="text-gray-300 mb-10 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            A charitable trust committed to uplifting lives through food security, value-based education, and holistic wellness —
            <span className="text-yellow-400 font-medium"> empowering people to rise with dignity, purpose, and community support.</span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button asChild size="lg"
              className="bg-prachetas-yellow text-black hover:bg-yellow-300 transition-all px-8 py-6 text-lg font-bold shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40">
              <Link to="/donate">
                Donate Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button onClick={openVideo} size="lg" variant="outline"
              className="border-2 border-white/30 text-white hover:border-prachetas-yellow hover:text-prachetas-yellow transition-all px-8 py-6 text-lg font-semibold backdrop-blur-sm">
              <Play className="mr-2 h-5 w-5" /> Watch Our Story
            </Button>
            <Link to="/create-fundraiser"
              className="inline-flex items-center gap-2 border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 transition-all px-6 py-3 rounded-lg text-sm font-semibold">
              <Link2 size={16} /> Create Fundraiser Link
            </Link>
          </div>

          {/* Animated stats */}
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { value: fmt(livesCount, '+'), label: 'Lives Impacted' },
              { value: `${volunteerCount}+`, label: 'Active Volunteers' },
              { value: `${programCount}+`, label: 'Programs Running' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/5 backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/50 px-6 py-5 rounded-xl transition-all">
                <div className="text-3xl md:text-4xl font-extrabold text-prachetas-yellow tabular-nums">{value}</div>
                <div className="text-xs uppercase tracking-widest text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button onClick={closeVideo}
              className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
              aria-label="Close video">
              <X className="h-6 w-6" />
            </button>
            <video src="/prachetas_intro.mp4" controls autoPlay className="w-full h-full object-contain" onEnded={closeVideo}>
              <track kind="captions" src="" label="English" default />
            </video>
          </div>
          <button className="absolute inset-0 -z-10 w-full h-full bg-transparent cursor-pointer"
            onClick={closeVideo} aria-label="Close" tabIndex={-1} />
        </div>
      )}
    </section>
  );
};

export default HeroSection;
