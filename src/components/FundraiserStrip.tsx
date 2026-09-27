import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Link2, Share2, Heart, ArrowRight } from "lucide-react";
import { Magnetic, Shimmer, Shine, SplitWords, Sparkles, Stagger, StaggerItem } from "@/components/motion";

const steps = [
  { icon: Link2,   title: "Create Your Link",  desc: "Enter your name — get a unique donation URL in seconds." },
  { icon: Share2,  title: "Share Anywhere",     desc: "Send it on WhatsApp, Instagram, email, or in person." },
  { icon: Heart,   title: "Donations Tracked",  desc: "Every donation via your link is attributed to you." },
];

const FundraiserStrip = () => (
  <section className="py-20 bg-black text-white overflow-hidden relative">
    {/* Subtle glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-400/5 pointer-events-none" />
    <Sparkles count={18} />

    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative overflow-hidden inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5"
          >
            <Shimmer />
            🔗 Fundraiser Links — New Feature
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <SplitWords text="Fundraise for" inView />{" "}
            <SplitWords text="Prachetas" inView delay={0.2} wordClassName="text-yellow-400 italic pr-1" />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Create your personal donation link and share it with your network. Help us reach more people — every donation via your link is tracked under your name.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative mb-10">
          <motion.div
            className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-px bg-gradient-to-r from-yellow-400/0 via-yellow-400/60 to-yellow-400/0 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.4 }}
          />
          <Stagger className="relative grid md:grid-cols-3 gap-6" gap={0.18}>
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <StaggerItem
                key={title}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden bg-neutral-950 border border-white/10 hover:border-yellow-400/50 rounded-2xl p-6 transition-colors hover:shadow-[0_20px_50px_-15px_rgba(255,215,0,0.3)]"
              >
                <Shine />
                <div className="relative flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-9 h-9 rounded-xl bg-yellow-400/10 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-black text-yellow-400 transition-colors"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <Icon size={17} />
                  </motion.div>
                  <span className="text-xs text-yellow-400/60 font-bold uppercase tracking-widest">Step {i + 1}</span>
                </div>
                <h3 className="relative font-bold text-white mb-1.5">{title}</h3>
                <p className="relative text-gray-400 text-sm leading-relaxed">{desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Magnetic>
            <Link
              to="/create-fundraiser"
              className="group relative overflow-hidden inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/50"
            >
              <Shine />
              <span className="relative">Create My Fundraiser Link</span>
              <ArrowRight size={18} className="relative transition-transform group-hover:translate-x-1.5" />
            </Link>
          </Magnetic>
          <p className="text-gray-500 text-sm mt-3">No account needed · Takes 10 seconds</p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default FundraiserStrip;
