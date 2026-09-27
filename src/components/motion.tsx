import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform, type HTMLMotionProps, type Variants,
} from "framer-motion";
import { Leaf } from "lucide-react";

export const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  initial: { opacity: 0, y: 40, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease },
} as const;

export const stagger = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

export const rise: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

/** Reveals text word by word, each word sliding up from behind a mask. */
export const SplitWords = ({
  text, className, wordClassName = "", delay = 0, gap = 0.07, inView = false,
}: { text: string; className?: string; wordClassName?: string; delay?: number; gap?: number; inView?: boolean }) => {
  const words = text.split(" ");
  const trigger = inView ? { whileInView: "show", viewport: { once: true, margin: "-60px" } } : { animate: "show" };
  return (
    <motion.span className={className} initial="hidden" {...trigger} variants={stagger(gap, delay)} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden>
          <span className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
            <motion.span
              className={`inline-block ${wordClassName}`}
              variants={{
                hidden: { y: "115%", rotate: 8, opacity: 0 },
                show: { y: "0%", rotate: 0, opacity: 1, transition: { duration: 0.9, ease } },
              }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </motion.span>
  );
};

/** Reveals a single word letter by letter, each flipping down in 3D. */
export const SplitLetters = ({ text, className, letterClassName = "", delay = 0, gap = 0.05 }: {
  text: string; className?: string; letterClassName?: string; delay?: number; gap?: number;
}) => (
  <motion.span className={`inline-block ${className ?? ""}`} initial="hidden" animate="show" variants={stagger(gap, delay)} aria-label={text} style={{ perspective: 800 }}>
    {text.split("").map((ch, i) => (
      <motion.span
        key={i}
        aria-hidden
        className={`inline-block ${letterClassName}`}
        style={{ transformOrigin: "50% 100%" }}
        variants={{
          hidden: { opacity: 0, y: "-60%", rotateX: 90, filter: "blur(8px)" },
          show: { opacity: 1, y: "0%", rotateX: 0, filter: "blur(0px)", transition: { duration: 0.9, ease } },
        }}
      >
        {ch === " " ? "\u00a0" : ch}
      </motion.span>
    ))}
  </motion.span>
);

/** Card that tilts in 3D following the cursor. */
export const Tilt = ({ children, max = 6, className, ...rest }: HTMLMotionProps<"div"> & { max?: number; children: ReactNode }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 160, damping: 18 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), spring);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), spring);
  return (
    <motion.div
      {...rest}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1200, ...rest.style }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
};

/** Image that is unveiled with a wipe and a slow zoom-out as it scrolls into view. */
export const RevealImage = ({ src, alt, className = "", imgClassName = "", delay = 0 }: {
  src: string; alt: string; className?: string; imgClassName?: string; delay?: number;
}) => (
  <motion.div
    className={`overflow-hidden ${className}`}
    initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
    whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 1.2, ease, delay }}
  >
    <motion.div
      className="w-full h-full"
      initial={{ scale: 1.35 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.8, ease, delay }}
    >
      <img src={src} alt={alt} loading="lazy" className={imgClassName} />
    </motion.div>
  </motion.div>
);

/** Leaves drifting down across a section. Parent must be `relative overflow-hidden`. */
export const FallingLeaves = ({ count = 14, className = "text-emerald-400/25" }: { count?: number; className?: string }) => {
  const leaves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
        return { left: r(1) * 100, size: 14 + r(2) * 22, duration: 12 + r(3) * 14, delay: -r(4) * 20, sway: 30 + r(5) * 60 };
      }),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {leaves.map((l, i) => (
        <motion.div
          key={i}
          className={`absolute -top-10 ${className}`}
          style={{ left: `${l.left}%` }}
          animate={{ y: ["0vh", "115vh"], x: [0, l.sway, -l.sway / 2, l.sway / 3], rotate: [0, 180, 300, 420] }}
          transition={{ duration: l.duration, delay: l.delay, repeat: Infinity, ease: "linear" }}
        >
          <Leaf size={l.size} />
        </motion.div>
      ))}
    </div>
  );
};

/** Endless horizontally scrolling ribbon of words. */
export const Marquee = ({ items, className = "", duration = 35, reverse = false }: {
  items: string[]; className?: string; duration?: number; reverse?: boolean;
}) => (
  <div className={`overflow-hidden whitespace-nowrap ${className}`}>
    <motion.div
      className="flex w-max"
      animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {[...items, ...items].map((t, i) => (
        <span key={i} className="flex items-center gap-8 pr-8">
          {t}
          <Leaf size={18} className="opacity-60" />
        </span>
      ))}
    </motion.div>
  </div>
);

/** Glossy light sweep shown on hover. Parent needs `group relative overflow-hidden`. */
export const Shine = () => (
  <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
);

/** Light sweep that loops across a pill/badge. Parent needs `relative overflow-hidden`. */
export const Shimmer = ({ color = "via-yellow-300/30" }: { color?: string }) => (
  <motion.span
    aria-hidden
    className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent ${color} to-transparent`}
    animate={{ x: ["-120%", "120%"] }}
    transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
  />
);

/** Animated gold rule that draws itself in when scrolled into view. */
export const DrawLine = ({ className = "mx-auto mt-5 h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-prachetas-yellow to-transparent", delay = 0.3 }: { className?: string; delay?: number }) => (
  <motion.div
    className={className}
    initial={{ scaleX: 0, opacity: 0 }}
    whileInView={{ scaleX: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1.1, ease, delay }}
  />
);

/** Number that counts up from zero the first time it scrolls into view. */
export const CountUp = ({ to, format = (n: number) => n.toLocaleString("en-IN"), duration = 2.2, className }: {
  to: number; format?: (n: number) => string; duration?: number; className?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to, duration]);
  return <span ref={ref} className={className}>{format(value)}</span>;
};

/** Element that is gently pulled toward the cursor while hovered. */
export const Magnetic = ({ children, strength = 0.35, className = "inline-block" }: { children: ReactNode; strength?: number; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  return (
    <motion.div
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
};

/** Moves its content at a different speed from the page scroll. */
export const Parallax = ({ children, offset = 60, className }: { children: ReactNode; offset?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
};

/** Gold motes of light rising through a section. Parent must be `relative overflow-hidden`. */
export const Sparkles = ({ count = 24, className = "bg-prachetas-yellow" }: { count?: number; className?: string }) => {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((Math.sin(i * 91.17 + n * 12.3) * 24634.63) % 1 + 1) % 1;
        return { left: r(1) * 100, top: 40 + r(2) * 60, size: 2 + r(3) * 3, duration: 6 + r(4) * 8, delay: -r(5) * 10 };
      }),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className={`absolute rounded-full ${className}`}
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size, boxShadow: "0 0 8px 2px rgba(255,215,0,0.5)" }}
          animate={{ y: [0, -260], opacity: [0, 0.9, 0] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

/** Card with a soft light that follows the cursor; cascades in when inside <Stagger>. */
export const SpotlightCard = ({ children, className = "", color = "rgba(255,215,0,0.15)", ...rest }: HTMLMotionProps<"div"> & { children: ReactNode; color?: string }) => {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const background = useTransform([x, y], ([lx, ly]) => `radial-gradient(420px circle at ${lx}px ${ly}px, ${color}, transparent 70%)`);
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease } },
      }}
      whileHover={{ y: -8 }}
      {...rest}
      className={`group relative overflow-hidden ${className}`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onMouseLeave={() => { x.set(-500); y.set(-500); }}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background }} />
      {children}
    </motion.div>
  );
};

/** Grid/list wrapper whose children (wrapped in <StaggerItem>) cascade in on scroll. */
export const Stagger = ({ children, className, gap = 0.12, delay = 0 }: { children: ReactNode; className?: string; gap?: number; delay?: number }) => (
  <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={stagger(gap, delay)}>
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className, ...rest }: HTMLMotionProps<"div"> & { children: ReactNode }) => (
  <motion.div
    {...rest}
    className={className}
    variants={{
      hidden: { opacity: 0, y: 50, scale: 0.95, filter: "blur(6px)" },
      show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.8, ease } },
    }}
  >
    {children}
  </motion.div>
);

export const ScrollCue = ({ className = "" }: { className?: string }) => (
  <motion.div
    className={`flex flex-col items-center gap-2 text-white/60 ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.6 }}
  >
    <div className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2">
      <motion.span
        className="w-1 h-2 rounded-full bg-prachetas-yellow"
        animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
    <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
  </motion.div>
);
