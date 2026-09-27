import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DrawLine, Magnetic, ScrollCue, Shimmer, Shine, SplitWords, Sparkles, ease, fadeUp } from "@/components/motion";

/** Grand dark page hero with parallax background, cursor glow, sparkles and word-by-word title. */
export const PageHero = ({ eyebrow, title, highlight, subtitle, image, children, wave = "text-gray-50" }: {
  eyebrow: string; title: string; highlight?: string; subtitle?: ReactNode; image?: string; children?: ReactNode; wave?: string;
}) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glowX = useSpring(useTransform(mx, (v) => `${v}%`), { stiffness: 60, damping: 20 });
  const glowY = useSpring(useTransform(my, (v) => `${v}%`), { stiffness: 60, damping: 20 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-black text-white"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
    >
      {image && (
        <motion.img
          src={image}
          alt=""
          aria-hidden
          style={{ y: bgY }}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 0.3 }}
          transition={{ duration: 2.4, ease }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/75 to-black" />
      <motion.div
        className="pointer-events-none absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-prachetas-yellow/10 blur-3xl"
        style={{ left: glowX, top: glowY }}
      />
      <motion.div
        className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full bg-amber-400/10 blur-3xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <Sparkles count={26} />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative container mx-auto px-4 pt-24 pb-32 md:pt-32 md:pb-40 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
          className="relative overflow-hidden inline-flex items-center gap-2 border border-prachetas-yellow/30 bg-prachetas-yellow/10 text-prachetas-yellow text-xs md:text-sm font-semibold tracking-[0.2em] uppercase px-4 py-2 rounded-full"
        >
          <Shimmer />
          <span className="relative">{eyebrow}</span>
        </motion.span>
        <h1 className="mt-7 text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05]">
          <SplitWords text={title} delay={0.5} />
          {highlight && (
            <>
              {" "}
              <SplitWords
                text={highlight}
                delay={0.5 + title.split(" ").length * 0.07}
                wordClassName="pr-1 bg-gradient-to-r from-prachetas-yellow via-yellow-200 to-prachetas-golden bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x"
              />
            </>
          )}
        </h1>
        <motion.div
          className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-prachetas-yellow to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 1.2, ease }}
        />
        {subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 1.05 }}
            className="mt-7 max-w-3xl mx-auto text-lg md:text-xl text-white/70 leading-relaxed"
          >
            {subtitle}
          </motion.div>
        )}
        {children && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.7 }} className="mt-10">
            {children}
          </motion.div>
        )}
        <ScrollCue className="mt-14" />
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none" aria-hidden>
        <motion.svg
          className={`block w-[200%] h-12 md:h-20 ${wave}`}
          viewBox="0 0 2880 90"
          preserveAspectRatio="none"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          <path fill="currentColor" d="M0,50 C360,0 1080,100 1440,50 C1800,0 2520,100 2880,50 L2880,90 L0,90 Z" />
        </motion.svg>
      </div>
    </section>
  );
};

/** Centered animated section heading. */
export const SectionTitle = ({ eyebrow, title, highlight, subtitle, dark = false, className = "mb-14" }: {
  eyebrow?: string; title: string; highlight?: string; subtitle?: ReactNode; dark?: boolean; className?: string;
}) => (
  <div className={`max-w-3xl mx-auto text-center ${className}`}>
    {eyebrow && (
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className={`relative overflow-hidden inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-5 border ${dark ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-400" : "bg-yellow-50 border-yellow-200 text-yellow-700"}`}
      >
        <Shimmer color={dark ? "via-yellow-300/30" : "via-yellow-400/30"} />
        <span className="relative">{eyebrow}</span>
      </motion.div>
    )}
    <h2 className={`text-4xl md:text-5xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
      <SplitWords text={title} inView />
      {highlight && (
        <>
          {" "}
          <SplitWords text={highlight} inView delay={title.split(" ").length * 0.07} wordClassName={`pr-1 ${dark ? "text-prachetas-yellow italic" : "text-gradient-yellow"}`} />
        </>
      )}
    </h2>
    <DrawLine className="mx-auto mt-5 h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
    {subtitle && (
      <motion.div {...fadeUp} className={`mt-5 text-lg leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>
        {subtitle}
      </motion.div>
    )}
  </div>
);

/** Container with a slowly rotating golden edge; used around forms. */
export const GlowBorder = ({ children, className = "", innerClassName = "" }: { children: ReactNode; className?: string; innerClassName?: string }) => (
  <motion.div
    {...fadeUp}
    className={`relative rounded-2xl p-[2px] overflow-hidden shadow-2xl shadow-yellow-400/10 ${className}`}
  >
    <motion.div
      aria-hidden
      className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0%,#FFD700_12%,transparent_25%,transparent_50%,#FFB300_62%,transparent_75%)]"
      animate={{ rotate: 360 }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    />
    <div className={`relative rounded-[14px] ${innerClassName}`}>{children}</div>
  </motion.div>
);

type CTA = { to: string; label: string };

const secondaryCls = "inline-flex items-center gap-2 border border-prachetas-yellow/60 text-prachetas-yellow font-semibold px-8 py-4 rounded-full hover:bg-prachetas-yellow hover:text-black transition-all";

/** Grand dark call-to-action band. */
export const CTASection = ({ title, highlight, text, primary, secondary, icon }: {
  title: string; highlight?: string; text: ReactNode; primary: CTA; secondary?: CTA; icon?: ReactNode;
}) => (
  <section className="relative overflow-hidden bg-black text-white">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.14),transparent_60%)]" />
    <Sparkles count={22} />
    <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
      {icon && (
        <motion.div
          className="relative mx-auto mb-6 w-20 h-20 flex items-center justify-center text-prachetas-yellow"
          initial={{ scale: 0, rotate: -90 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 140, damping: 12 }}
        >
          <span className="absolute inset-0 rounded-full border border-prachetas-yellow/40 animate-ping" />
          <span className="absolute inset-2 rounded-full bg-prachetas-yellow/10" />
          <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>{icon}</motion.span>
        </motion.div>
      )}
      <h2 className="text-4xl md:text-6xl font-bold">
        <SplitWords text={title} inView />
        {highlight && (
          <>
            {" "}
            <SplitWords text={highlight} inView delay={title.split(" ").length * 0.07} wordClassName="italic text-prachetas-yellow pr-1" />
          </>
        )}
      </h2>
      <motion.div {...fadeUp} className="mt-6 max-w-2xl mx-auto text-white/70 text-lg md:text-xl">{text}</motion.div>
      <motion.div {...fadeUp} className="mt-10 flex flex-wrap justify-center gap-4">
        <Magnetic>
          <Link to={primary.to} className="group relative overflow-hidden inline-flex items-center gap-2 bg-prachetas-yellow text-black font-semibold px-8 py-4 rounded-full hover:bg-prachetas-bright-yellow transition-colors shadow-lg shadow-yellow-400/30">
            <Shine />
            <span className="relative">{primary.label}</span>
            <ArrowRight size={18} className="relative transition-transform group-hover:translate-x-1.5" />
          </Link>
        </Magnetic>
        {secondary && (
          <Magnetic>
            {/^(mailto:|tel:|https?:)/.test(secondary.to) ? (
              <a href={secondary.to} className={secondaryCls}>{secondary.label}</a>
            ) : (
              <Link to={secondary.to} className={secondaryCls}>{secondary.label}</Link>
            )}
          </Magnetic>
        )}
      </motion.div>
    </div>
  </section>
);
