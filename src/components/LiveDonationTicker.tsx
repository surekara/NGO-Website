import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, TrendingUp } from "lucide-react";

interface Donation { name: string; amount: number; time: string }

const fmt = (n: number) => `₹${n >= 1000 ? (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K' : n}`;

const timeAgo = (iso: string) => {
  const diff = Math.floor((Date.now() - new Date(iso + (iso.endsWith('Z') ? '' : 'Z')).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const LiveDonationTicker = () => {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    fetch("https://prachetasfoundation.com/.netlify/functions/recent-donations")
      .then(r => r.json())
      .then(d => { if (d.success) setDonations(d.donations) })
      .catch(() => {});
  }, []);

  if (donations.length === 0) return null;

  const items = [...donations, ...donations];

  return (
    <div className="bg-gradient-to-r from-yellow-950/80 via-yellow-900/40 to-yellow-950/80 border-y border-yellow-400/20 py-3 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-yellow-950/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-yellow-950/80 to-transparent z-10 pointer-events-none" />

      {/* Label */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 bg-yellow-400 text-black text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-yellow-400/30">
        <motion.div
          className="w-1.5 h-1.5 bg-black rounded-full"
          animate={{ scale: [1, 1.6, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        LIVE
      </div>

      <motion.div
        className="flex gap-8 items-center pl-24"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: donations.length * 4, repeat: Infinity, ease: "linear" }}
        style={{ width: "max-content" }}
      >
        {items.map((d, i) => (
          <div key={i} className="flex items-center gap-2.5 shrink-0">
            <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center">
              <Heart size={11} className="text-yellow-400 fill-yellow-400" />
            </div>
            <span className="text-white/90 text-sm font-medium">
              <span className="text-yellow-400 font-bold">{d.name.split(' ').slice(0, 2).join(' ')}</span>
              {" donated "}
              <span className="text-yellow-300 font-bold">{fmt(d.amount)}</span>
            </span>
            <span className="text-white/30 text-xs">{timeAgo(d.time)}</span>
            <span className="text-yellow-400/20 ml-2">❤</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default LiveDonationTicker;
