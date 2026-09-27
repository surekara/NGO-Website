import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { DrawLine, Shimmer, SplitWords, Sparkles } from "@/components/motion";

const testimonials = [
  {
    id: 1,
    quote: "The educational support from Prachetas Foundation has transformed our village school. The children now have access to quality learning materials and dedicated teachers.",
    name: "Priya Sharma",
    title: "School Principal",
    occupation: "Education Administrator, Pune",
    avatar: "/Copy of WhatsApp Image 2025-02-26 at 15.41.35 (1).jpeg",
    rating: 5,
  },
  {
    id: 2,
    quote: "The healthcare camp organized by Prachetas Foundation provided essential medical care to over 500 people in our community who otherwise wouldn't have access to these services.",
    name: "Dr. Rajesh Kumar",
    title: "Medical Volunteer",
    occupation: "Community Health Specialist",
    avatar: "/Copy of WhatsApp Image 2025-02-27 at 16.10.09 (1).jpeg",
    rating: 5,
  },
  {
    id: 3,
    quote: "Thanks to the vocational training program by Prachetas Foundation, I was able to learn tailoring skills and now support my family with a steady income from my small business.",
    name: "Lakshmi Devi",
    title: "Program Beneficiary",
    occupation: "Small Business Owner & Tailor",
    avatar: "/Copy of WhatsApp Image 2025-02-26 at 15.50.55 (1).jpeg",
    rating: 5,
  },
  {
    id: 4,
    quote: "Volunteering with Prachetas Foundation has been a life-changing experience. The direct impact we make in communities gives me purpose and hope for a better future for all.",
    name: "Vikram Mehta",
    title: "Regular Volunteer",
    occupation: "IT Professional & Social Worker",
    avatar: "/Copy of WhatsApp Image 2025-02-27 at 16.15.54.jpeg",
    rating: 5,
  }
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setActive((next + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(active + 1, 1), 5000);
    return () => clearInterval(t);
  }, [active, paused, go]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  const t = testimonials[active];
  const prev = testimonials[(active - 1 + testimonials.length) % testimonials.length];
  const next = testimonials[(active + 1) % testimonials.length];

  return (
    <section className="py-20 bg-gray-950 relative overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-52 bg-yellow-400/10 blur-3xl rounded-full pointer-events-none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <Sparkles count={16} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="relative overflow-hidden inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            <Shimmer />
            💬 Stories That Matter
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            <SplitWords text="Making A" inView />{" "}
            <SplitWords text="Difference" inView delay={0.2} wordClassName="text-yellow-400 italic pr-1" />
          </h2>
          <DrawLine className="mx-auto mb-5 h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
          <p className="text-gray-400 text-lg">Hear from communities we serve and those who help us fulfill our mission</p>
        </div>

        {/* Main testimonial */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 min-h-[280px] overflow-hidden hover:border-yellow-400/30 transition-colors"
          >
            {/* Decorative quote */}
            <motion.div
              className="absolute top-2 right-8 text-[10rem] text-yellow-400/10 font-serif leading-none select-none"
              animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >"</motion.div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative z-10"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 300, damping: 12 }}
                    >
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    </motion.span>
                  ))}
                </div>

                <blockquote className="text-white text-lg md:text-xl leading-relaxed mb-8 font-medium">
                  <SplitWords text={`"${t.quote}"`} gap={0.018} delay={0.2} />
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#FFD700,transparent_40%,#FFB300,transparent_80%,#FFD700)]"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    <img src={t.avatar} alt={t.name} className="relative w-14 h-14 rounded-full object-cover ring-2 ring-gray-950 shadow-lg" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-yellow-400 text-sm font-medium">{t.title}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{t.occupation}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            {/* Dot indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => go(i, i > active ? 1 : -1)} aria-label={`Show testimonial ${i + 1}`}
                  className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 ${i === active ? 'w-10 bg-white/20' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                >
                  {i === active && (
                    <motion.span
                      key={`${active}-${paused}`}
                      className="absolute inset-y-0 left-0 bg-yellow-400 rounded-full"
                      initial={{ width: paused ? "100%" : "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: paused ? 0 : 5, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Arrow buttons */}
            <div className="flex gap-2">
              <button onClick={() => go(active - 1, -1)}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-yellow-400 hover:text-black text-white flex items-center justify-center transition-all">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => go(active + 1, 1)}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-yellow-400 hover:text-black text-white flex items-center justify-center transition-all">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Side previews */}
        <div className="hidden lg:flex gap-4 max-w-5xl mx-auto mt-6 justify-center">
          {[prev, next].map((item, idx) => (
            <button key={idx}
              onClick={() => go(idx === 0 ? active - 1 : active + 1, idx === 0 ? -1 : 1)}
              className="flex-1 max-w-xs bg-white/3 hover:bg-white/8 border border-white/8 hover:border-yellow-400/30 rounded-2xl p-4 text-left transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="text-white/50 text-xs font-semibold group-hover:text-yellow-400 transition-colors">{item.name}</span>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 group-hover:text-gray-400 transition-colors">"{item.quote}"</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
