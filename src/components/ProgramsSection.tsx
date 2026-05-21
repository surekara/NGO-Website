import { Link } from "react-router-dom";
import { BookOpen, HeartPulse, UtensilsCrossed, ArrowRight, ExternalLink } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const programs = [
  {
    id: 1,
    title: "Education",
    tagline: "Shaping Tomorrow's Leaders",
    description: "Value-based education rooted in Vedic wisdom — empowering youth with life skills, purpose, and character.",
    icon: BookOpen,
    link: "/programs/education",
    image: "/Copy of IMG-20250610-WA0013.jpg",
    stat: "3,000+",
    statLabel: "Students Reached",
    accent: "from-blue-600/80 to-indigo-900/90",
  },
  {
    id: 2,
    title: "Food Distribution",
    tagline: "No One Sleeps Hungry",
    description: "Wholesome meals for families facing food insecurity. Because nourishment is a right, not a privilege.",
    icon: UtensilsCrossed,
    link: "/programs/food-distribution",
    image: "/fooddistribution.png",
    stat: "18,000+",
    statLabel: "Meals Served",
    accent: "from-orange-600/80 to-red-900/90",
  },
  {
    id: 3,
    title: "Wellness",
    tagline: "Body, Mind & Spirit",
    description: "Free yoga sessions, health camps, and holistic wellness programmes grounded in ancient wisdom.",
    icon: HeartPulse,
    link: "/programs/wellness",
    image: "/Copy of WhatsApp Image 2025-02-27 at 16.10.09 (1).jpeg",
    stat: "50+",
    statLabel: "Camps Conducted",
    accent: "from-pink-600/80 to-rose-900/90",
  },
];

const ProgramsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section ref={sectionRef} className="py-20 bg-gray-950 overflow-hidden" id="programs">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            🌱 Our Programs
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Changing Lives Through <span className="text-yellow-400">Action</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Three pillars of impact — education, nourishment, and wellness — woven into every community we serve.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-6xl mx-auto">

          {/* Large card — left, 7 cols */}
          {(() => { const HeroIcon = programs[0].icon; return (
          <motion.div
            className="md:col-span-7 relative rounded-3xl overflow-hidden group cursor-pointer h-[420px]"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Link to={programs[0].link} className="block w-full h-full">
              <img src={programs[0].image} alt={programs[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-gradient-to-t ${programs[0].accent} opacity-80`} />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <HeroIcon size={16} className="text-white" />
                  </div>
                  <span className="text-white/70 text-xs font-bold uppercase tracking-widest">{programs[0].title}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">{programs[0].tagline}</h3>
                <p className="text-white/80 text-sm mb-5 leading-relaxed max-w-sm">{programs[0].description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-extrabold text-yellow-300">{programs[0].stat}</div>
                    <div className="text-white/60 text-xs uppercase tracking-wider">{programs[0].statLabel}</div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all group-hover:bg-yellow-400 group-hover:text-black">
                    Explore <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
          ); })()}

          {/* Right column — 5 cols, two stacked cards */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {programs.slice(1).map((p, i) => {
              const CardIcon = p.icon;
              return (
              <motion.div
                key={p.id}
                className="relative rounded-3xl overflow-hidden group cursor-pointer flex-1 h-[200px]"
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
              >
                <Link to={p.link} className="block w-full h-full">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className={`absolute inset-0 bg-gradient-to-r ${p.accent} opacity-80`} />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                        <CardIcon size={14} className="text-white" />
                      </div>
                      <span className="text-white/70 text-xs font-bold uppercase tracking-widest">{p.title}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white mb-1">{p.tagline}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-300 font-bold text-base">{p.stat} <span className="text-white/60 text-xs font-normal">{p.statLabel}</span></span>
                      <div className="flex items-center gap-1.5 text-white/70 text-xs group-hover:text-yellow-300 transition-colors">
                        Learn more <ExternalLink size={11} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 border border-yellow-400/40 hover:border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 font-semibold px-8 py-3 rounded-xl transition-all text-sm"
          >
            View All Programs <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramsSection;
