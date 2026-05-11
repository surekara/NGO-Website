import { Link } from "react-router-dom";
import { Link2, Share2, Heart, ArrowRight } from "lucide-react";

const steps = [
  { icon: Link2,   title: "Create Your Link",  desc: "Enter your name — get a unique donation URL in seconds." },
  { icon: Share2,  title: "Share Anywhere",     desc: "Send it on WhatsApp, Instagram, email, or in person." },
  { icon: Heart,   title: "Donations Tracked",  desc: "Every donation via your link is attributed to you." },
];

const FundraiserStrip = () => (
  <section className="py-20 bg-black text-white overflow-hidden relative">
    {/* Subtle glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-400/5 pointer-events-none" />

    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            🔗 Fundraiser Links — New Feature
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Fundraise for <span className="text-yellow-400">Prachetas</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Create your personal donation link and share it with your network. Help us reach more people — every donation via your link is tracked under your name.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="bg-white/5 border border-white/10 hover:border-yellow-400/40 rounded-2xl p-6 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-yellow-400/10 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
                  <Icon size={17} className="text-yellow-400" />
                </div>
                <span className="text-xs text-yellow-400/60 font-bold uppercase tracking-widest">Step {i + 1}</span>
              </div>
              <h3 className="font-bold text-white mb-1.5">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/create-fundraiser"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40"
          >
            Create My Fundraiser Link <ArrowRight size={18} />
          </Link>
          <p className="text-gray-500 text-sm mt-3">No account needed · Takes 10 seconds</p>
        </div>
      </div>
    </div>
  </section>
);

export default FundraiserStrip;
