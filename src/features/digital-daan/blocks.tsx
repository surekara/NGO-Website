import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Search, Youtube, Instagram, Linkedin, Library, Lightbulb } from "lucide-react";
import { CountUp, ease } from "@/components/motion";
import type { Activity, Stat } from "./api";
import { Container, TopicIcon } from "./ui";

// Gentle, once-only reveal on scroll. Respects reduced-motion preferences.
export const Reveal = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease }}
    >
      {children}
    </motion.div>
  );
};

export const SearchBox = ({ initial = "", size = "lg", onSearch, autoFocus = false }: { initial?: string; size?: "lg" | "md"; onSearch?: (q: string) => void; autoFocus?: boolean }) => {
  const [q, setQ] = useState(initial);
  const navigate = useNavigate();
  useEffect(() => setQ(initial), [initial]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (onSearch) onSearch(term);
    else navigate(term ? `/digital-daan/explore?q=${encodeURIComponent(term)}` : "/digital-daan/explore");
  };
  const lg = size === "lg";
  return (
    <form role="search" onSubmit={submit} className="relative w-full">
      <label htmlFor={`dd-search-${size}`} className="sr-only">What would you like to learn?</label>
      <Search className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-neutral-400 ${lg ? "left-5 h-5 w-5" : "left-4 h-4 w-4"}`} aria-hidden />
      <input
        id={`dd-search-${size}`}
        type="search"
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        placeholder="What would you like to learn?"
        enterKeyHint="search"
        className={`w-full rounded-full border bg-white text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none transition focus:ring-4 dark:bg-neutral-900 dark:text-white ${
          lg ? "h-14 sm:h-16 pl-14 pr-32 text-base sm:text-lg border-transparent focus:ring-prachetas-yellow/40" : "h-12 pl-11 pr-28 text-sm border-neutral-200 dark:border-white/10 focus:ring-amber-500/20 focus:border-amber-500"
        }`}
      />
      <button
        type="submit"
        className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-neutral-900 font-semibold text-white transition hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:bg-prachetas-yellow dark:text-black dark:hover:bg-yellow-300 ${
          lg ? "right-2 h-10 sm:h-12 px-5 sm:px-6 text-sm" : "right-1.5 h-9 px-4 text-sm"
        }`}
      >
        Search
      </button>
    </form>
  );
};

export const StatsBand = ({ stats, dark = false }: { stats: Stat[]; dark?: boolean }) => (
  <dl className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-3 ${stats.length >= 6 ? "lg:grid-cols-6" : stats.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5"} ${dark ? "bg-white/10" : "bg-neutral-200 dark:bg-white/10"}`}>
    {stats.map((s) => (
      <div key={s.key} className={`px-5 py-6 ${dark ? "bg-neutral-950" : "bg-white dark:bg-neutral-950"}`}>
        <dt className={`text-xs font-medium uppercase tracking-wider ${dark ? "text-white/50" : "text-neutral-500"}`}>{s.label}</dt>
        <dd className={`mt-2 text-3xl font-bold tabular-nums tracking-tight ${dark ? "text-white" : ""}`}>
          <CountUp to={s.value} duration={1.6} />
          <span className="text-amber-500">{s.suffix}</span>
        </dd>
      </div>
    ))}
  </dl>
);

export const ActivityCard = ({ activity, index = 0 }: { activity: Activity; index?: number }) => {
  const points = (activity.topics.length ? activity.topics : activity.formats).slice(0, 5);
  return (
    <Reveal delay={index * 0.06} className="h-full">
      <Link
        to={`/digital-daan/activities/${activity.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.4)] dark:border-white/10 dark:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: activity.color }} />
        <div className="flex items-center justify-between">
          <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `${activity.color}1f`, color: activity.color }}>
            <TopicIcon name={activity.icon} className="h-5 w-5" />
          </span>
          <span className="font-mono text-sm font-semibold text-neutral-300 dark:text-neutral-600">{String(activity.number).padStart(2, "0")}</span>
        </div>
        <h3 className="mt-5 text-lg font-bold tracking-tight">{activity.name}</h3>
        <p className="mt-1 text-sm font-medium" style={{ color: activity.color }}>{activity.tagline}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {points.map((p) => (
            <li key={p} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-white/5 dark:text-neutral-400">{p}</li>
          ))}
        </ul>
        <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 dark:text-white">
          {activity.resource_count ? `${activity.resource_count} resource${activity.resource_count === 1 ? "" : "s"}` : "Explore"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </Reveal>
  );
};

const CHANNELS = [
  { icon: Library, name: "Digital Daan Hub", text: "A permanent, searchable learning resource." },
  { icon: Youtube, name: "YouTube", text: "Educational videos and recorded sessions." },
  { icon: Instagram, name: "Instagram", text: "Short-form educational content." },
  { icon: Linkedin, name: "LinkedIn", text: "Volunteer stories and impact highlights." },
];

export const ContributionSeen = () => (
  <section className="py-20 sm:py-24 bg-neutral-50 dark:bg-neutral-900/40" aria-labelledby="dd-seen">
    <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-prachetas-yellow mb-3">Your contribution should be seen</p>
        <h2 id="dd-seen" className="text-3xl sm:text-4xl font-bold tracking-tight">Great volunteer work shouldn't disappear after the activity.</h2>
        <p className="mt-5 text-lg text-neutral-600 dark:text-neutral-400">
          With the contributor's permission, selected resources can become part of the Prachetas Digital Daan learning library and may also be promoted through Prachetas' digital channels.
        </p>
        <p className="mt-3 text-sm text-neutral-500">Every contribution is reviewed first. Contributors choose exactly which profile details are shown publicly.</p>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2">
        {CHANNELS.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.06}>
            <div className="h-full rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
              <c.icon className="h-6 w-6 text-amber-600 dark:text-prachetas-yellow" aria-hidden />
              <h3 className="mt-4 font-semibold">{c.name}</h3>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{c.text}</p>
              {i > 0 && <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-neutral-400">Selected contributions may be featured</p>}
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  </section>
);

export const ContributorCTA = () => (
  <section className="py-20 sm:py-24" aria-labelledby="dd-cta">
    <Container>
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-neutral-950 px-6 py-14 sm:px-14 sm:py-16 text-white">
          <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-prachetas-yellow/20 blur-3xl" />
          <div aria-hidden className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-amber-600/10 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 id="dd-cta" className="text-3xl sm:text-4xl font-bold tracking-tight">Have something useful to share?</h2>
              <p className="mt-4 text-lg text-white/70 max-w-xl">Teach it. Create it. Explain it. Mentor someone with it.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/digital-daan/contribute" className="inline-flex items-center justify-center gap-2 rounded-full bg-prachetas-yellow px-6 py-3.5 font-semibold text-black transition hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Become a Contributor <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/digital-daan/contribute?type=idea" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <Lightbulb className="h-4 w-4" /> Share an Idea
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </Container>
  </section>
);
