import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Handshake, Heart, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { DrawLine, Shimmer, Shine, SplitWords, Sparkles, SpotlightCard, Stagger } from "@/components/motion";

const options = [
  {
    id: 1,
    num: "01",
    title: "Donate",
    description: "Your financial support drives our mission and helps create lasting change in communities.",
    icon: Heart,
    buttonText: "Donate Now",
    link: "/donate",
    accent: "from-yellow-500 to-amber-400",
    iconBg: "bg-yellow-400/10",
    iconColor: "text-yellow-400",
    primary: true,
  },
  {
    id: 2,
    num: "02",
    title: "Volunteer",
    description: "Join our community of dedicated volunteers making a hands-on difference in various programs.",
    icon: Handshake,
    buttonText: "Join Us",
    link: "/volunteer",
    accent: "from-blue-500 to-indigo-400",
    iconBg: "bg-blue-400/10",
    iconColor: "text-blue-400",
    primary: false,
  },
  {
    id: 3,
    num: "03",
    title: "Partner With Us",
    description: "Collaborate with us through corporate partnerships, institutional support or joint programs.",
    icon: Users,
    buttonText: "Learn More",
    link: "/partner",
    accent: "from-emerald-500 to-teal-400",
    iconBg: "bg-emerald-400/10",
    iconColor: "text-emerald-400",
    primary: false,
  },
];

const GetInvolvedSection = () => {
  return (
    <section className="py-20 bg-black dot-grid-dark relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/3 via-transparent to-transparent pointer-events-none" />
      <Sparkles count={20} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="relative overflow-hidden inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            <Shimmer />
            🤝 Get Involved
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            <SplitWords text="Join Our" inView />{" "}
            <SplitWords text="Impact Story" inView delay={0.2} wordClassName="text-gradient-yellow" />
          </h2>
          <DrawLine className="mx-auto mb-5 h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
          <p className="text-gray-400 text-lg">
            Be part of our journey to create a better world through various ways of engagement
          </p>
        </div>

        <Stagger className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto" gap={0.15}>
          {options.map((opt, i) => (
            <SpotlightCard
              key={opt.id}
              className="bg-white/5 border border-white/10 hover:border-yellow-400/40 rounded-2xl p-7 flex flex-col justify-between transition-colors duration-300 hover:shadow-2xl hover:shadow-yellow-400/10"
            >
              {/* Number tag */}
              <span className="absolute top-3 right-5 text-5xl font-black text-white/5 group-hover:text-yellow-400/20 group-hover:scale-125 transition-all duration-500 font-mono">{opt.num}</span>
              <span className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${opt.accent} group-hover:w-full transition-all duration-500`} />

              {/* Icon */}
              <div className="relative">
                <motion.div
                  className={`w-12 h-12 rounded-xl ${opt.iconBg} flex items-center justify-center mb-5 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500`}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                >
                  <opt.icon size={22} className={opt.iconColor} />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-3">{opt.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-7">{opt.description}</p>
              </div>

              <Button asChild
                className={opt.primary
                  ? "relative overflow-hidden w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl btn-glow"
                  : "relative overflow-hidden w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 font-semibold rounded-xl"
                }
              >
                <Link to={opt.link} className="flex items-center justify-center gap-2">
                  <Shine />
                  <span className="relative">{opt.buttonText}</span>
                  <ArrowRight size={15} className="relative transition-transform group-hover:translate-x-1.5" />
                </Link>
              </Button>
            </SpotlightCard>
          ))}
        </Stagger>
      </div>
    </section>
  );
};

export default GetInvolvedSection;
