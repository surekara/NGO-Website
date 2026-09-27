import { useMemo, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps, type Variants } from "framer-motion";
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
