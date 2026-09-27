import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, MotionConfig, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, CalendarDays, Camera, Handshake, Leaf, MapPin, Play, Sparkles } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { collaborations, type Collaboration } from "@/data/collaborations";
import {
  FallingLeaves, Marquee, RevealImage, ScrollCue, Shine, SplitWords, Tilt, ease, fadeUp, rise, stagger,
} from "@/components/collaborations/motion";

const serif = { fontFamily: "'Cormorant Garamond', serif" };

const sorted = [...collaborations].sort((a, b) => b.date.localeCompare(a.date));

const DateBadge = ({ date }: { date: string }) => {
  const d = new Date(date);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.6 }}
      className="bg-white/95 backdrop-blur rounded-2xl px-4 py-3 text-center shadow-xl"
    >
      <div className="text-3xl font-bold leading-none text-emerald-900" style={serif}>{d.getDate()}</div>
      <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-emerald-700 mt-1">
        {d.toLocaleString("en-US", { month: "short" })} {d.getFullYear()}
      </div>
    </motion.div>
  );
};

const MediaCount = ({ c }: { c: Collaboration }) => {
  const photos = c.media.filter((m) => m.type === "image").length;
  const videos = c.media.length - photos;
  const chip = "flex items-center gap-1.5 bg-black/50 backdrop-blur text-white text-xs font-medium px-3 py-1.5 rounded-full";
  return (
    <motion.div className="flex gap-2" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger(0.12, 0.8)}>
      {photos > 0 && <motion.span variants={rise} className={chip}><Camera size={13} /> {photos} Photos</motion.span>}
      {videos > 0 && <motion.span variants={rise} className={chip}><Play size={13} /> {videos} Videos</motion.span>}
    </motion.div>
  );
};

const FeaturedCard = ({ c }: { c: Collaboration }) => (
  <Tilt
    max={3}
    initial={{ opacity: 0, y: 80 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 1, ease }}
    className="group relative grid lg:grid-cols-5 rounded-[2rem] overflow-hidden bg-white dark:bg-neutral-900 shadow-2xl shadow-emerald-950/15 ring-1 ring-black/5 dark:ring-white/10 hover:shadow-emerald-950/30 transition-shadow duration-500"
  >
    <Link to={`/collaborations/${c.slug}`} className="relative lg:col-span-3 min-h-[360px] lg:min-h-[540px] overflow-hidden block">
      <RevealImage
        src={c.coverImage}
        alt={c.title}
        className="absolute inset-0"
        imgClassName="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
      <Shine />
      <div className="absolute top-5 left-5"><DateBadge date={c.date} /></div>
      <motion.div
        className="absolute top-5 right-5"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.6, ease }}
      >
        <span className="relative flex items-center gap-1.5 bg-prachetas-yellow text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          <span className="absolute inset-0 rounded-full bg-prachetas-yellow animate-ping opacity-40" />
          <motion.span animate={{ rotate: [0, 20, -10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 2.2, repeat: Infinity }}>
            <Sparkles size={13} />
          </motion.span>
          <span className="relative">Latest</span>
        </span>
      </motion.div>
      <div className="absolute bottom-5 left-5"><MediaCount c={c} /></div>
    </Link>

    <motion.div
      className="lg:col-span-2 p-8 md:p-10 lg:p-12 flex flex-col justify-center"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={stagger(0.1, 0.4)}
    >
      <motion.span variants={rise} className="inline-flex w-fit items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full">
        <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 4, repeat: Infinity }}><Leaf size={13} /></motion.span>
        {c.category}
      </motion.span>
      <motion.h3 variants={rise} className="mt-5 text-3xl md:text-4xl font-bold leading-tight text-neutral-900 dark:text-white" style={serif}>
        {c.title}
      </motion.h3>
      <motion.div variants={rise} className="mt-5 flex flex-wrap items-center gap-2 text-sm font-semibold">
        <span className="text-neutral-800 dark:text-neutral-200">{c.organisedBy}</span>
        <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <Handshake size={16} className="text-amber-500" />
        </motion.span>
        <span className="text-amber-600 dark:text-prachetas-yellow">{c.partner}</span>
      </motion.div>
      <motion.div variants={rise} className="mt-3 space-y-1.5 text-sm text-neutral-500 dark:text-neutral-400">
        <p className="flex items-start gap-2"><CalendarDays size={15} className="mt-0.5 shrink-0" /> {c.dateLabel}</p>
        <p className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" /> {c.venue}</p>
      </motion.div>
      <motion.p variants={rise} className="mt-6 text-neutral-600 dark:text-neutral-300 leading-relaxed">{c.summary}</motion.p>
      <motion.div variants={rise} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="mt-8 w-fit">
        <Link
          to={`/collaborations/${c.slug}`}
          className="group/btn relative overflow-hidden inline-flex items-center gap-2 bg-neutral-900 dark:bg-prachetas-yellow text-white dark:text-black font-semibold px-6 py-3.5 rounded-full shadow-lg"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald-700 to-emerald-500 transition-transform duration-500 group-hover/btn:translate-x-0" />
          <span className="relative">Read the full story</span>
          <ArrowRight size={18} className="relative transition-transform duration-300 group-hover/btn:translate-x-1.5" />
        </Link>
      </motion.div>
    </motion.div>
  </Tilt>
);

const CompactCard = ({ c, i }: { c: Collaboration; i: number }) => (
  <Tilt
    max={8}
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.9, ease, delay: i * 0.12 }}
    className="group relative rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-xl shadow-emerald-950/5 ring-1 ring-black/5 dark:ring-white/10"
  >
    <Link to={`/collaborations/${c.slug}`} className="block">
      <div className="relative h-72 overflow-hidden">
        <RevealImage src={c.coverImage} alt={c.title} className="h-full" imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <Shine />
        <div className="absolute top-4 left-4"><DateBadge date={c.date} /></div>
        <div className="absolute bottom-4 left-4"><MediaCount c={c} /></div>
      </div>
      <div className="p-7">
        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-emerald-700 dark:text-emerald-400">{c.category}</span>
        <h3 className="mt-2 text-2xl font-bold leading-snug text-neutral-900 dark:text-white" style={serif}>{c.title}</h3>
        <p className="mt-2 text-sm font-medium text-amber-600 dark:text-prachetas-yellow">with {c.organisedBy}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white group-hover:gap-3 transition-all">
          Read story <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  </Tilt>
);

const Hero = ({ cover }: { cover?: string }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const glowX = useSpring(useTransform(mx, (v) => `${v * 100}%`), { stiffness: 60, damping: 20 });
  const glowY = useSpring(useTransform(my, (v) => `${v * 100}%`), { stiffness: 60, damping: 20 });
  const blobX = useSpring(useTransform(mx, [0, 1], [-40, 40]), { stiffness: 50, damping: 20 });
  const blobY = useSpring(useTransform(my, [0, 1], [-30, 30]), { stiffness: 50, damping: 20 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#06120c] text-white"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
    >
      <motion.img
        src={cover}
        alt=""
        aria-hidden
        style={{ y: bgY }}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 0.28 }}
        transition={{ duration: 2.4, ease }}
        className="absolute inset-0 w-full h-full object-cover blur-[2px]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#06120c]/70 via-[#06120c]/85 to-[#06120c]" />
      <motion.div
        className="pointer-events-none absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-prachetas-yellow/10 blur-3xl"
        style={{ left: glowX, top: glowY }}
      />
      <motion.div style={{ x: blobX, y: blobY }} className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-amber-400/10 blur-3xl" />
      <motion.div style={{ x: blobY, y: blobX }} className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-emerald-500/15 blur-3xl" />
      <FallingLeaves count={16} />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative container mx-auto px-4 pt-24 pb-40 md:pt-36 md:pb-52 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease }}
          className="relative inline-flex items-center gap-2 overflow-hidden border border-prachetas-yellow/30 bg-prachetas-yellow/10 text-prachetas-yellow text-xs font-semibold tracking-[0.25em] uppercase px-4 py-2 rounded-full"
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-prachetas-yellow/25 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
          />
          <motion.span animate={{ rotate: [0, -12, 12, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}>
            <Handshake size={14} />
          </motion.span>
          <span className="relative">Stronger Together</span>
        </motion.span>

        <h1 className="mt-7 text-5xl sm:text-6xl md:text-8xl font-bold leading-[1]" style={serif}>
          <SplitWords text="Our" delay={0.2} />{" "}
          <SplitWords
            text="Collaborations"
            delay={0.35}
            wordClassName="italic pr-2 bg-gradient-to-r from-prachetas-yellow via-amber-200 to-prachetas-golden bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x"
          />
        </h1>

        <motion.div
          className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-prachetas-yellow to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.9, duration: 1.2, ease }}
        />

        <motion.p
          initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-7 max-w-2xl mx-auto text-lg md:text-xl text-white/70 leading-relaxed"
        >
          Meaningful change is never a solo journey. Here we celebrate the societies, institutions and changemakers who walk
          alongside Prachetas Foundation — one shared initiative at a time.
        </motion.p>

        <ScrollCue className="mt-14" />
      </motion.div>

      <svg className="absolute bottom-0 left-0 w-full h-16 md:h-24 text-[#f7f4ec] dark:text-neutral-950" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden>
        <motion.path
          fill="currentColor"
          animate={{
            d: [
              "M0,64 C240,10 480,10 720,40 C960,70 1200,90 1440,40 L1440,90 L0,90 Z",
              "M0,40 C240,80 480,80 720,50 C960,20 1200,10 1440,60 L1440,90 L0,90 Z",
              "M0,64 C240,10 480,10 720,40 C960,70 1200,90 1440,40 L1440,90 L0,90 Z",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </section>
  );
};

const Collaborations = () => {
  const [featured, ...rest] = sorted;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#f7f4ec] dark:bg-neutral-950 overflow-x-hidden">
        <Header />
        <Hero cover={featured?.coverImage} />

        {/* Values ribbon */}
        <div className="relative -rotate-1 my-6 bg-emerald-900 py-4 text-emerald-50 text-xl md:text-2xl font-semibold italic shadow-xl" style={serif}>
          <Marquee items={["Stronger Together", "Nature", "Community", "Service", "Sustainability", "Compassion", "Awareness", "Action"]} />
        </div>

        {/* Collaborations list */}
        <section className="relative container mx-auto px-4 pt-16 pb-24">
          <div className="text-center mb-14">
            <motion.p {...fadeUp} className="text-xs font-semibold tracking-[0.3em] uppercase text-emerald-700 dark:text-emerald-400">
              Journeys we've shared
            </motion.p>
            <h2 className="mt-3 text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white" style={serif}>
              <SplitWords text="Latest Collaborations" inView gap={0.12} />
            </h2>
            <div className="mt-5 mx-auto flex items-center justify-center gap-3 text-amber-500">
              <motion.span className="h-px w-12 bg-amber-400/60 origin-right" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease, delay: 0.3 }} />
              <motion.span initial={{ rotate: -180, scale: 0 }} whileInView={{ rotate: 0, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 160, damping: 12, delay: 0.2 }}>
                <Leaf size={18} />
              </motion.span>
              <motion.span className="h-px w-12 bg-amber-400/60 origin-left" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease, delay: 0.3 }} />
            </div>
          </div>

          <div className="max-w-6xl mx-auto space-y-10">
            {featured && <FeaturedCard c={featured} />}
            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((c, i) => <CompactCard key={c.slug} c={c} i={i} />)}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[#06120c] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.14),transparent_60%)]" />
          <FallingLeaves count={8} className="text-prachetas-yellow/15" />
          <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
            <motion.div
              className="relative mx-auto w-20 h-20 flex items-center justify-center"
              initial={{ scale: 0, rotate: -90 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 140, damping: 12 }}
            >
              <span className="absolute inset-0 rounded-full border border-prachetas-yellow/40 animate-ping" />
              <span className="absolute inset-2 rounded-full bg-prachetas-yellow/10" />
              <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
                <Handshake size={36} className="text-prachetas-yellow" />
              </motion.span>
            </motion.div>
            <h2 className="mt-6 text-4xl md:text-6xl font-bold" style={serif}>
              <SplitWords text="Let's create" inView />{" "}
              <SplitWords text="impact" inView delay={0.2} wordClassName="italic text-prachetas-yellow pr-1" />{" "}
              <SplitWords text="together" inView delay={0.3} />
            </h2>
            <motion.p {...fadeUp} className="mt-5 max-w-xl mx-auto text-white/70 text-lg">
              Are you a society, school, college or organisation that shares our values? We'd love to collaborate with you.
            </motion.p>
            <motion.div className="mt-9 flex flex-wrap justify-center gap-4" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger(0.15, 0.3)}>
              <motion.div variants={rise} whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.95 }}>
                <Link to="/partner" className="group relative overflow-hidden inline-flex items-center gap-2 bg-prachetas-yellow text-black font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-yellow-400/30">
                  <Shine />
                  <span className="relative">Partner With Us</span>
                  <ArrowRight size={18} className="relative transition-transform group-hover:translate-x-1.5" />
                </Link>
              </motion.div>
              <motion.div variants={rise} whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.95 }}>
                <Link to="/contact" className="inline-flex items-center gap-2 border border-white/25 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 hover:border-white/50 transition-all">
                  Get in Touch
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </MotionConfig>
  );
};

export default Collaborations;
