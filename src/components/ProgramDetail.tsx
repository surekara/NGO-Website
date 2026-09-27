import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { Marquee, RevealImage, Shine, SplitLetters, Sparkles, Tilt, ease } from "@/components/motion";
import { CTASection, SectionTitle } from "@/components/PageFx";

export interface ProgramDetailProps {
  title: string;
  heroImage: string;
  description: string;
  gallery: { src: string; caption: string }[];
  ribbon: string[];
}

const ProgramDetail = ({ title, heroImage, description, gallery, ribbon }: ProgramDetailProps) => {
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);
  const nav = useCallback((d: number) => setActive((i) => (i === null ? i : (i + d + gallery.length) % gallery.length)), [gallery.length]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") nav(1);
      if (e.key === "ArrowLeft") nav(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, nav]);

  const label = title.charAt(0) + title.slice(1).toLowerCase();

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-prachetas-yellow py-20 md:py-28">
        <motion.div
          className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-white/30 blur-3xl"
          animate={{ scale: [1, 1.25, 1], x: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full bg-amber-500/30 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Hexagonal Image */}
            <motion.div
              className="relative w-64 h-64 md:w-72 md:h-72 flex-shrink-0"
              initial={{ scale: 0, rotate: -120, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 80, damping: 14 }}
            >
              {[
                { inset: "-inset-6", dash: "3 3", opacity: 0.3, duration: 40, dir: 1 },
                { inset: "-inset-12", dash: "0", opacity: 0.12, duration: 60, dir: -1 },
              ].map((r) => (
                <motion.div
                  key={r.inset}
                  className={`absolute ${r.inset}`}
                  animate={{ rotate: 360 * r.dir }}
                  transition={{ duration: r.duration, repeat: Infinity, ease: "linear" }}
                  aria-hidden
                >
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" fill="none" stroke="black" strokeOpacity={r.opacity} strokeWidth="1.5" strokeDasharray={r.dash} vectorEffect="non-scaling-stroke" />
                  </svg>
                </motion.div>
              ))}
              <motion.div className="w-full h-full" animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                <div className="hexagon w-full h-full bg-white p-2 shadow-2xl">
                  <img src={heroImage} alt={`${label} Program`} className="hexagon w-full h-full object-cover" />
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm font-bold tracking-[0.3em] uppercase text-black/60 mb-3"
              >
                Prachetas Program
              </motion.p>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-prachetas-black leading-none">
                <SplitLetters text={title} delay={0.6} gap={0.04} />
              </h1>
              <motion.div
                className="h-1 w-24 bg-black rounded-full mb-6 origin-left mx-auto md:mx-0"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8, ease }}
              />
              <motion.p
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 1.3, duration: 1 }}
                className="text-xl text-prachetas-black leading-relaxed"
              >
                {description}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-black text-prachetas-yellow py-4 text-xl md:text-2xl font-bold italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        <Marquee items={ribbon} duration={30} />
      </div>

      {/* Gallery Section */}
      <section className="relative overflow-hidden bg-prachetas-black py-20 md:py-28">
        <Sparkles count={20} />
        <div className="relative container mx-auto px-4">
          <SectionTitle dark eyebrow="📸 In Action" title="Moments of" highlight="Impact" />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {gallery.map((image, index) => (
              <Tilt
                key={image.src}
                max={8}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (index % 3) * 0.12, duration: 0.8, ease }}
                className="text-center"
              >
                <button
                  onClick={() => setActive(index)}
                  className="group relative block w-full bg-white p-3 rounded-2xl shadow-lg hover:shadow-[0_25px_60px_-15px_rgba(255,215,0,0.45)] transition-shadow duration-500"
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <RevealImage
                      src={image.src}
                      alt={image.caption || `${label} ${index + 1}`}
                      delay={(index % 3) * 0.12}
                      className="h-64"
                      imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Shine />
                  </div>
                </button>
                {image.caption && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (index % 3) * 0.12 }}
                    className="mt-4 text-white text-lg font-semibold italic"
                  >
                    {image.caption}
                  </motion.p>
                )}
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Support Our"
        highlight={`${label} Program`}
        icon={<Heart className="h-9 w-9" fill="currentColor" />}
        text={<p>Every contribution helps us reach more people with care, dignity and compassion.</p>}
        primary={{ to: "/donate", label: "Donate Now" }}
        secondary={{ to: "/volunteer", label: "Volunteer With Us" }}
      />

      <Footer />

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button onClick={close} aria-label="Close" className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-prachetas-yellow hover:text-black text-white transition-colors"><X size={22} /></button>
            <button onClick={(e) => { e.stopPropagation(); nav(-1); }} aria-label="Previous" className="absolute left-3 md:left-8 p-3 rounded-full bg-white/10 hover:bg-prachetas-yellow hover:text-black text-white transition-colors"><ChevronLeft size={26} /></button>
            <button onClick={(e) => { e.stopPropagation(); nav(1); }} aria-label="Next" className="absolute right-3 md:right-8 p-3 rounded-full bg-white/10 hover:bg-prachetas-yellow hover:text-black text-white transition-colors"><ChevronRight size={26} /></button>
            <AnimatePresence mode="wait">
              <motion.figure
                key={active}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease }}
                className="px-16 flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={gallery[active].src} alt={gallery[active].caption} className="max-h-[82vh] max-w-full rounded-xl shadow-2xl object-contain" />
                <figcaption className="mt-4 text-white/80">
                  {gallery[active].caption}
                  <span className="ml-3 text-white/40">{active + 1} / {gallery.length}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`.hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }`}</style>
    </div>
  );
};

export default ProgramDetail;
