import { useEffect, useRef, useState } from "react";
import { UtensilsCrossed, BookOpen, HeartPulse, Leaf, Users, Repeat, Trophy } from "lucide-react";

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

const PillarCard = ({ pillar, started }: { pillar: typeof pillars[0]; started: boolean }) => {
  const count = useCounter(pillar.stat, 2000, started);
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}K${pillar.suffix}` : `${n}${pillar.suffix}`;
  return (
    <div className={`bg-gradient-to-br ${pillar.bg} border-2 ${pillar.border} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${pillar.iconBg} group-hover:scale-110 transition-transform`}>
        <pillar.icon size={22} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{pillar.title}</h3>
      <p className="text-gray-500 text-sm mb-5 leading-relaxed">{pillar.desc}</p>
      <div className={`bg-gradient-to-r ${pillar.gradient} rounded-xl px-4 py-3 text-white`}>
        <div className="text-2xl font-extrabold tabular-nums">{fmt(count)}</div>
        <div className="text-xs uppercase tracking-wider opacity-80">{pillar.statLabel}</div>
      </div>
    </div>
  );
};

const ImpactSection = () => {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const totals = [
    { icon: Users,   value: useCounter(50000, 2000, started), suffix: "K+", label: "Lives Impacted",   div: 1000 },
    { icon: Repeat,  value: useCounter(100,   1800, started), suffix: "+",  label: "Volunteers",       div: 1    },
    { icon: Trophy,  value: useCounter(25,    1600, started), suffix: "+",  label: "Programs Running", div: 1    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-950 transition-colors" ref={ref}>
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-400/10 border border-yellow-200 dark:border-yellow-400/30 text-yellow-700 dark:text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            ✨ Real-World Change
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Our Impact</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Through compassion and collective action, we've created meaningful change across communities
          </p>
        </div>

        {/* Summary stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14 max-w-4xl mx-auto">
          {totals.map(({ icon: Icon, value, suffix, label, div }) => (
            <div key={label} className="bg-gray-900 rounded-2xl px-5 py-4 text-center text-white">
              <Icon size={18} className="text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-yellow-400 tabular-nums">
                {div > 1 ? `${Math.floor(value / div)}${suffix}` : `${value}${suffix}`}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* 4 Pillars */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map(p => <PillarCard key={p.title} pillar={p} started={started} />)}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
