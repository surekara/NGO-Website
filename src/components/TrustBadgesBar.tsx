import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, Lock, Star, Heart, Leaf } from "lucide-react";

const badges = [
  { icon: BadgeCheck, text: "80G Tax Exemption Eligible" },
  { icon: ShieldCheck, text: "Registered Trust · MAHA/953/2022" },
  { icon: Lock,        text: "SSL Secured Payments" },
  { icon: Star,        text: "Razorpay Verified Merchant" },
  { icon: Heart,       text: "50,000+ Lives Impacted" },
  { icon: Leaf,        text: "Non-profit Since 2022" },
  { icon: BadgeCheck,  text: "Donations 100% Traceable" },
  { icon: ShieldCheck, text: "Transparent Fund Utilisation" },
];

const TrustBadgesBar = () => (
  <div className="bg-black border-b border-yellow-400/15 py-2.5 overflow-hidden relative">
    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

    <motion.div
      className="flex gap-10 items-center"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      style={{ width: "max-content" }}
    >
      {[...badges, ...badges].map(({ icon: Icon, text }, i) => (
        <div
          key={i}
          className="flex items-center gap-2 text-yellow-400/75 text-xs font-medium shrink-0 hover:text-yellow-400 transition-colors"
        >
          <Icon size={13} className="shrink-0" />
          <span className="tracking-wide">{text}</span>
          <span className="text-yellow-400/25 ml-4">✦</span>
        </div>
      ))}
    </motion.div>
  </div>
);

export default TrustBadgesBar;
