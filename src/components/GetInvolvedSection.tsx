import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Handshake, Heart, Users, ArrowRight } from "lucide-react";

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

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            🤝 Get Involved
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Join Our <span className="text-gradient-yellow">Impact Story</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Be part of our journey to create a better world through various ways of engagement
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="relative bg-white/5 border border-white/10 hover:border-yellow-400/40 rounded-2xl p-7 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-400/5"
            >
              {/* Number tag */}
              <span className="absolute top-5 right-5 text-xs font-bold text-white/20 group-hover:text-yellow-400/40 transition-colors font-mono">{opt.num}</span>

              {/* Icon */}
              <div>
                <div className={`w-12 h-12 rounded-xl ${opt.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <opt.icon size={22} className={opt.iconColor} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{opt.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-7">{opt.description}</p>
              </div>

              <Button asChild
                className={opt.primary
                  ? "w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl btn-glow"
                  : "w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 font-semibold rounded-xl"
                }
              >
                <Link to={opt.link} className="flex items-center justify-center gap-2">
                  {opt.buttonText} <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetInvolvedSection;
