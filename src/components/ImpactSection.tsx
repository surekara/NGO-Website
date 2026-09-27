import { useEffect, useRef, useState } from "react";
import { UtensilsCrossed, BookOpen, HeartPulse, Leaf } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { DrawLine, Shimmer, Shine, SplitWords, Tilt } from "@/components/motion";

const useCounter = (target: number, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

const pillars = [
  {
    icon: UtensilsCrossed,
    title: "Food Distribution",
    desc: "Wholesome meals provided to families facing food insecurity across Pune.",
    stat: 18000,
    statLabel: "Meals Served",
    suffix: "+",
    gradient: "from-orange-500 to-red-500",
    bg: "from-orange-50 to-red-50",
    border: "border-orange-200 hover:border-orange-400",
    iconBg: "bg-orange-100 text-orange-600",
  },
  {
    icon: BookOpen,
    title: "Education",
    desc: "Value-based education rooted in Vedic wisdom empowering the next generation.",
    stat: 3000,
    statLabel: "Students Reached",
    suffix: "+",
    gradient: "from-blue-500 to-indigo-500",
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-200 hover:border-blue-400",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    icon: HeartPulse,
    title: "Wellness",
    desc: "Free yoga sessions, health camps, and holistic wellness programs for all.",
    stat: 50,
    statLabel: "Camps Conducted",
    suffix: "+",
    gradient: "from-pink-500 to-rose-500",
    bg: "from-pink-50 to-rose-50",
    border: "border-pink-200 hover:border-pink-400",
    iconBg: "bg-pink-100 text-pink-600",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    desc: "Green initiatives and environmental programs for a healthier planet.",
    stat: 10000,
    statLabel: "Saplings Planted",
    suffix: "+",
    gradient: "from-green-500 to-emerald-500",
    bg: "from-green-50 to-emerald-50",
    border: "border-green-200 hover:border-green-400",
    iconBg: "bg-green-100 text-green-600",
  },
];

const PillarCard = ({ pillar, started, idx }: { pillar: typeof pillars[0]; started: boolean; idx: number }) => {
  const count = useCounter(pillar.stat, 2000, started);
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}K${pillar.suffix}` : `${n}${pillar.suffix}`;
  return (
    <Tilt
      max={10}
      className={`relative overflow-hidden bg-gradient-to-br ${pillar.bg} border-2 ${pillar.border} rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-[box-shadow,border-color] duration-300 group`}
      initial={{ opacity: 0, y: 70, rotateZ: idx % 2 ? 3 : -3 }}
      whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: idx * 0.15, type: "spring", stiffness: 90, damping: 14 }}
    >
      <Shine />
      <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full bg-gradient-to-br ${pillar.gradient} opacity-10 group-hover:opacity-25 group-hover:scale-150 transition-all duration-700`} />
      <motion.div
        className={`relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${pillar.iconBg}`}
        animate={{ rotate: [0, -8, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: idx * 0.6 }}
        whileHover={{ rotate: 360, scale: 1.2, transition: { duration: 0.6 } }}
      >
        <pillar.icon size={22} />
      </motion.div>
      <h3 className="relative text-xl font-bold text-gray-900 mb-2">{pillar.title}</h3>
      <p className="relative text-gray-500 text-sm mb-5 leading-relaxed">{pillar.desc}</p>
      <motion.div
        className={`relative bg-gradient-to-r ${pillar.gradient} rounded-xl px-4 py-3 text-white`}
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-2xl font-extrabold tabular-nums">{fmt(count)}</div>
        <div className="text-xs uppercase tracking-wider opacity-80">{pillar.statLabel}</div>
      </motion.div>
    </Tilt>
  );
};

const ImpactSection = () => {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) setStarted(true);
  }, [isInView]);

  return (
    <section className="py-20 bg-white dark:bg-gray-950 transition-colors" ref={ref}>
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="relative overflow-hidden inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-400/10 border border-yellow-200 dark:border-yellow-400/30 text-yellow-700 dark:text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Shimmer color="via-yellow-400/30" />
            ✨ Real-World Change
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
            <SplitWords text="Our" inView />{" "}
            <SplitWords text="Impact" inView delay={0.12} wordClassName="text-gradient-yellow" />
          </h2>
          <DrawLine className="mx-auto mb-5 h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Through compassion and collective action, we've created meaningful change across communities
          </p>
        </motion.div>

        {/* 4 Pillars */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => <PillarCard key={p.title} pillar={p} started={started} idx={idx} />)}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
