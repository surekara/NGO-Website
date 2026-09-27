import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AnimatePresence, motion, MotionConfig, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Bird, CalendarDays, ChevronLeft, ChevronRight, Flower2, Footprints,
  Handshake, Heart, Leaf, MapPin, Palette, Play, Quote, Sprout, Trees, Users, X,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCollaboration, type CollaborationMedia, type MediaLayout } from "@/data/collaborations";
import {
  FallingLeaves, Marquee, RevealImage, ScrollCue, Shine, SplitWords, Tilt, ease, fadeUp, rise, stagger,
} from "@/components/motion";

const serif = { fontFamily: "'Cormorant Garamond', serif" };

const activityIcons = [Footprints, Trees, Bird, Flower2, Sprout, Heart, Palette, Users];

const tileSpan: Record<MediaLayout | "default", string> = {
  full: "col-span-2 lg:col-span-3",
  wide: "col-span-2",
  tall: "col-span-2 lg:col-span-1 lg:row-span-2",
  default: "",
};

const tileSize: Record<MediaLayout | "default", string> = {
  full: "aspect-[4/3] md:aspect-[16/9]",
  wide: "aspect-[4/3] lg:aspect-auto lg:h-full",
  tall: "h-[420px] lg:h-full",
  default: "aspect-[3/4]",
};

const Highlighted = ({ text }: { text: string }) => (
  <>
    {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") ? (
        <motion.mark
          key={i}
          className="bg-transparent bg-no-repeat font-semibold text-emerald-900 dark:text-emerald-300 px-0.5"
          style={{ backgroundImage: "linear-gradient(rgba(255,215,0,0.5), rgba(255,215,0,0.5))", backgroundPosition: "0 90%" }}
          initial={{ backgroundSize: "0% 38%" }}
          whileInView={{ backgroundSize: "100% 38%" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.2, ease, delay: 0.4 }}
        >
          {part.slice(2, -2)}
        </motion.mark>
      ) : (
        part
      ),
    )}
  </>
);

const Lightbox = ({ media, index, dir, onClose, onNav }: {
  media: CollaborationMedia[];
  index: number;
  dir: number;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}) => {
  const item = media[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onNav]);

  const navBtn = "absolute z-10 p-3 rounded-full bg-white/10 hover:bg-prachetas-yellow hover:text-black text-white transition-colors";

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.button whileHover={{ rotate: 90, scale: 1.1 }} onClick={onClose} aria-label="Close" className={`${navBtn} top-5 right-5`}>
        <X size={22} />
      </motion.button>
      {media.length > 1 && (
        <>
          <motion.button whileHover={{ scale: 1.15, x: -3 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); onNav(-1); }} aria-label="Previous" className={`${navBtn} left-3 md:left-8`}>
            <ChevronLeft size={26} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.15, x: 3 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); onNav(1); }} aria-label="Next" className={`${navBtn} right-3 md:right-8`}>
            <ChevronRight size={26} />
          </motion.button>
        </>
      )}

      <AnimatePresence mode="wait" custom={dir}>
        <motion.figure
          key={index}
          custom={dir}
          initial={{ opacity: 0, x: dir * 120, scale: 0.92, rotate: dir * 2 }}
          animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, x: dir * -120, scale: 0.92, rotate: dir * -2 }}
          transition={{ duration: 0.45, ease }}
          className="flex flex-col items-center px-16"
          onClick={(e) => e.stopPropagation()}
        >
          {item.type === "image" ? (
            <img src={item.src} alt={item.caption} className="max-h-[82vh] max-w-full rounded-xl shadow-2xl object-contain" />
          ) : (
            <video src={item.src} poster={item.poster} controls autoPlay playsInline className="max-h-[82vh] max-w-full rounded-xl shadow-2xl bg-black" />
          )}
          <figcaption className="mt-4 text-center text-white/80 text-sm md:text-base">
            {item.caption}
            <span className="ml-3 text-white/40">{index + 1} / {media.length}</span>
          </figcaption>
        </motion.figure>
      </AnimatePresence>
    </motion.div>
  );
};

const SectionEyebrow = ({ children, className = "" }: { children: string; className?: string }) => (
  <motion.p
    initial={{ opacity: 0, letterSpacing: "0.6em" }}
    whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
    viewport={{ once: true }}
    transition={{ duration: 1.1, ease }}
    className={`text-xs font-semibold uppercase ${className}`}
  >
    {children}
  </motion.p>
);

const CollaborationDetail = () => {
  const { slug = "" } = useParams();
  const c = getCollaboration(slug);
  const [active, setActive] = useState<number | null>(null);
  const [dir, setDir] = useState(1);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const heroImgScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
  const heroContentY = useTransform(heroProgress, [0, 1], ["0%", "50%"]);
  const heroContentOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);

  const storyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: storyProgress } = useScroll({ target: storyRef, offset: ["start 70%", "end 60%"] });
  const storyLine = useSpring(storyProgress, { stiffness: 80, damping: 20 });
  const storyDotTop = useTransform(storyLine, (v) => `${v * 100}%`);

  const close = useCallback(() => setActive(null), []);
  const nav = useCallback(
    (d: 1 | -1) => {
      setDir(d);
      setActive((i) => (i === null || !c ? i : (i + d + c.media.length) % c.media.length));
    },
    [c],
  );

  if (!c) return <Navigate to="/collaborations" replace />;

  const facts = [
    { icon: Users, label: "Organised by", value: c.organisedBy },
    { icon: Handshake, label: "In partnership with", value: c.partner },
    { icon: CalendarDays, label: "Date", value: c.dateLabel },
    { icon: MapPin, label: "Venue", value: c.venue },
  ];

  const [lead, ...paragraphs] = c.story;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#f7f4ec] dark:bg-neutral-950 overflow-x-clip">
        <Header />

        {/* Hero */}
        <section ref={heroRef} className="relative min-h-[85vh] flex items-end overflow-hidden bg-[#06120c]">
          <motion.div className="absolute inset-0" style={{ y: heroImgY, scale: heroImgScale }}>
            <motion.img
              src={c.coverImage}
              alt={c.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.25, filter: "blur(10px)" }}
              animate={{ scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 2.4, ease }}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#06120c] via-[#06120c]/70 to-[#06120c]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06120c]/75 to-transparent" />
          <FallingLeaves count={14} className="text-emerald-300/30" />

          <motion.div style={{ y: heroContentY, opacity: heroContentOpacity }} className="relative w-full container mx-auto px-4 pb-36 md:pb-44 pt-32 text-white">
            <motion.nav initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="flex items-center gap-2 text-sm text-white/60">
              <Link to="/collaborations" className="hover:text-prachetas-yellow transition-colors">Collaborations</Link>
              <ChevronRight size={14} />
              <span className="text-white/90 truncate">{c.title}</span>
            </motion.nav>

            <motion.span
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 15 }}
              className="mt-6 inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-[0.2em] uppercase px-4 py-2 rounded-full backdrop-blur"
            >
              <motion.span animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 3, repeat: Infinity }}><Leaf size={14} /></motion.span>
              {c.category}
            </motion.span>

            <h1 className="mt-5 max-w-5xl text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05]" style={serif}>
              <SplitWords text={c.title} delay={0.5} gap={0.08} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 1.2, duration: 0.9 }}
              className="mt-5 max-w-2xl text-lg md:text-2xl text-white/75 italic"
              style={serif}
            >
              {c.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.7 }}
              className="mt-8 flex flex-wrap items-end justify-between gap-8"
            >
              <div className="group relative overflow-hidden inline-flex flex-wrap items-center gap-3 rounded-full bg-white/10 border border-white/15 backdrop-blur px-5 py-2.5 text-sm font-semibold">
                <Shine />
                <span className="relative">{c.organisedBy}</span>
                <motion.span className="relative text-prachetas-yellow" animate={{ rotate: [0, 90, 180] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>×</motion.span>
                <span className="relative text-prachetas-yellow">{c.partner}</span>
              </div>
              <ScrollCue className="hidden md:flex" />
            </motion.div>
          </motion.div>
        </section>

        {/* Key facts */}
        <section className="relative z-10 container mx-auto px-4 -mt-20 md:-mt-24">
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-6xl mx-auto" initial="hidden" animate="show" variants={stagger(0.12, 1.3)}>
            {facts.map((f) => (
              <motion.div
                key={f.label}
                variants={{
                  hidden: { opacity: 0, y: 60, rotateX: -30 },
                  show: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
                }}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                style={{ transformPerspective: 800 }}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-xl shadow-emerald-950/10 ring-1 ring-black/5 dark:ring-white/10 hover:shadow-2xl hover:ring-emerald-500/30 transition-shadow"
              >
                <span className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors duration-500" />
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-md transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-110">
                  <f.icon size={20} />
                </div>
                <p className="relative mt-4 text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-400">{f.label}</p>
                <p className="relative mt-1 font-semibold text-neutral-900 dark:text-white leading-snug">{f.value}</p>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-500 to-prachetas-yellow group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Crossing ribbons */}
        <div className="relative h-40 md:h-48 mt-10" style={serif}>
          <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[3deg] bg-prachetas-yellow text-black py-3 text-xl md:text-2xl font-bold italic shadow-lg">
            <Marquee items={["Observe", "Learn", "Connect", "Take Responsibility"]} duration={28} />
          </div>
          <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 -rotate-[3deg] bg-emerald-900 text-emerald-50 py-3 text-xl md:text-2xl font-bold italic shadow-2xl">
            <Marquee items={["Ramnadi", "Mula River", "Biodiversity", "Riparian Ecosystem", "Pune"]} duration={32} reverse />
          </div>
        </div>

        {/* Story */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16">
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <SectionEyebrow className="text-emerald-700 dark:text-emerald-400">The Story</SectionEyebrow>
                <h2 className="mt-3 text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white leading-tight" style={serif}>
                  <SplitWords text="A walk along the" inView />{" "}
                  <SplitWords text="living river" inView delay={0.3} wordClassName="italic text-emerald-700 dark:text-emerald-400 pr-1" />
                </h2>
                <div className="mt-5 flex items-center gap-3 text-amber-500">
                  <motion.span className="h-px w-10 bg-amber-400/60 origin-left" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} />
                  <motion.span animate={{ rotate: [0, 25, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity }}><Leaf size={16} /></motion.span>
                </div>
                {c.media[0]?.type === "image" && (
                  <Tilt max={8} className="mt-8 hidden lg:block">
                    <button onClick={() => { setDir(1); setActive(0); }} className="group relative w-full rounded-3xl overflow-hidden shadow-2xl">
                      <RevealImage src={c.media[0].src} alt={c.media[0].caption} className="h-80" imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Shine />
                      <p className="absolute bottom-4 left-5 right-5 text-left text-sm text-white/90">{c.media[0].caption}</p>
                    </button>
                  </Tilt>
                )}
              </div>
            </aside>

            <div ref={storyRef} className="relative lg:col-span-8 lg:pl-10">
              <div className="hidden lg:block absolute left-0 top-2 bottom-2 w-px bg-emerald-900/10 dark:bg-white/10">
                <motion.div className="absolute inset-0 origin-top bg-gradient-to-b from-emerald-500 via-emerald-600 to-prachetas-yellow" style={{ scaleY: storyLine }} />
                <motion.div
                  className="absolute -left-[5px] w-[11px] h-[11px] rounded-full bg-prachetas-yellow shadow-[0_0_12px_rgba(255,215,0,0.8)]"
                  style={{ top: storyDotTop }}
                />
              </div>
              <div className="space-y-7 text-lg leading-[1.85] text-neutral-700 dark:text-neutral-300">
                <motion.p
                  {...fadeUp}
                  className="text-xl md:text-2xl leading-relaxed text-neutral-800 dark:text-neutral-100 first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:leading-[0.85] first-letter:font-bold first-letter:text-emerald-700 dark:first-letter:text-emerald-400"
                  style={serif}
                >
                  <Highlighted text={lead} />
                </motion.p>
                {paragraphs.map((p, i) => (
                  <motion.p key={i} {...fadeUp} initial={{ opacity: 0, y: 40, x: i % 2 ? 20 : -20, filter: "blur(6px)" }} whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}>
                    <Highlighted text={p} />
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Activities */}
        {c.activities && (
          <section className="container mx-auto px-4 pb-20 md:pb-28">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 60 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease }}
              className="relative max-w-6xl mx-auto overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-900 via-emerald-950 to-[#06120c] p-8 md:p-14 text-white shadow-2xl"
            >
              <motion.div
                className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-prachetas-yellow/15 blur-3xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-6 -right-6 text-white/5"
                animate={{ rotate: [0, 4, -4, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "bottom center" }}
              >
                <Trees size={240} />
              </motion.div>
              <FallingLeaves count={6} className="text-prachetas-yellow/15" />
              <div className="relative">
                <SectionEyebrow className="text-emerald-300">Community on the river</SectionEyebrow>
                <h3 className="mt-3 text-3xl md:text-5xl font-bold" style={serif}>
                  <SplitWords text={c.activities.title} inView gap={0.06} />
                </h3>
                <motion.div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger(0.08, 0.3)}>
                  {c.activities.items.map((a, i) => {
                    const Icon = activityIcons[i % activityIcons.length];
                    return (
                      <motion.div
                        key={a}
                        variants={{
                          hidden: { opacity: 0, scale: 0.5, y: 30 },
                          show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 180, damping: 14 } },
                        }}
                        whileHover={{ y: -6, scale: 1.04 }}
                        className="group relative overflow-hidden flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-4 hover:bg-white/10 hover:border-prachetas-yellow/50 transition-colors"
                      >
                        <Shine />
                        <motion.span
                          className="relative w-10 h-10 shrink-0 rounded-xl bg-prachetas-yellow/15 text-prachetas-yellow flex items-center justify-center group-hover:bg-prachetas-yellow group-hover:text-emerald-950 transition-colors"
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                        >
                          <Icon size={19} className="transition-transform duration-500 group-hover:rotate-[20deg] group-hover:scale-110" />
                        </motion.span>
                        <span className="relative text-sm md:text-base font-medium">{a}</span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          </section>
        )}

        {/* Quote */}
        <section className="relative container mx-auto px-4 pb-20 md:pb-28">
          <blockquote className="relative max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
            >
              <Quote size={52} className="mx-auto text-prachetas-golden" />
            </motion.div>
            <p className="mt-6 text-3xl md:text-5xl font-semibold italic leading-snug text-neutral-900 dark:text-white" style={serif}>
              <SplitWords text={c.closingQuote} inView gap={0.05} delay={0.2} />
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 text-emerald-700 dark:text-emerald-400">
              <motion.span className="h-px w-16 bg-current opacity-40 origin-right" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.8, ease }} />
              <motion.span
                initial={{ scale: 0, y: 20 }}
                whileInView={{ scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 1 }}
              >
                <Sprout size={22} />
              </motion.span>
              <motion.span className="h-px w-16 bg-current opacity-40 origin-left" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.8, ease }} />
            </div>
          </blockquote>
        </section>

        {/* Gallery */}
        <section className="relative overflow-hidden bg-[#06120c] py-20 md:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_60%)]" />
          <div className="relative container mx-auto px-4">
            <div className="text-center mb-14">
              <SectionEyebrow className="text-emerald-300">Photos & Videos</SectionEyebrow>
              <h2 className="mt-3 text-4xl md:text-6xl font-bold text-white" style={serif}>
                <SplitWords text="Moments from the" inView />{" "}
                <SplitWords text="day" inView delay={0.3} wordClassName="italic text-prachetas-yellow pr-1" />
              </h2>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-3 grid-flow-row-dense gap-3 md:gap-5">
              {c.media.map((m, i) => (
                <Tilt
                  key={m.src}
                  max={7}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: (i % 3) * 0.12, duration: 0.8, ease }}
                  className={tileSpan[m.layout ?? "default"]}
                >
                  <button
                    onClick={() => { setDir(1); setActive(i); }}
                    className="group relative w-full h-full block overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-900 ring-1 ring-white/10 hover:ring-prachetas-yellow/50 transition-shadow hover:shadow-[0_20px_60px_-15px_rgba(255,215,0,0.35)]"
                  >
                    <RevealImage
                      src={m.type === "image" ? m.src : m.poster}
                      alt={m.caption}
                      delay={(i % 3) * 0.12}
                      className={tileSize[m.layout ?? "default"]}
                      imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/0 to-black/0 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <Shine />
                    {m.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white group-hover:scale-125 group-hover:bg-prachetas-yellow group-hover:text-black transition-all duration-500">
                          <span className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping opacity-50" />
                          <span className="absolute -inset-3 rounded-full border border-white/20 animate-pulse" />
                          <Play size={26} className="ml-1" fill="currentColor" />
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-left translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-prachetas-yellow">{m.type === "video" ? "Video" : "Photo"}</span>
                      <p className="mt-1 text-sm md:text-base font-medium text-white leading-snug">{m.caption}</p>
                    </div>
                  </button>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

        {/* Footer nav */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-white dark:bg-neutral-900 p-8 md:p-10 shadow-xl shadow-emerald-950/5 ring-1 ring-black/5 dark:ring-white/10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger(0.12)}
          >
            <motion.div variants={rise} whileHover={{ x: -6 }}>
              <Link to="/collaborations" className="group inline-flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /> All collaborations
              </Link>
            </motion.div>
            <motion.p variants={rise} className="text-center text-neutral-600 dark:text-neutral-400">Want to collaborate with Prachetas Foundation?</motion.p>
            <motion.div variants={rise} whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link to="/partner" className="group relative overflow-hidden inline-flex items-center gap-2 bg-prachetas-yellow text-black font-semibold px-6 py-3 rounded-full shadow-lg shadow-yellow-400/30">
                <Shine />
                <span className="relative">Partner With Us</span>
                <ArrowRight size={18} className="relative transition-transform group-hover:translate-x-1.5" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <Footer />

        <AnimatePresence>
          {active !== null && <Lightbox media={c.media} index={active} dir={dir} onClose={close} onNav={nav} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};

export default CollaborationDetail;
