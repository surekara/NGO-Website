import { ReactNode, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Sparkles, Shield, Briefcase, Smartphone, Zap, GraduationCap, Cpu, Scale, Wallet, Lock, MessageCircle, Layers, Radio,
  Clapperboard, Compass, ShieldCheck, Brain, PlayCircle, Film, FileText, ListChecks, FileDown, CircleHelp, Presentation,
  MessageSquareQuote, Link2, Clock, Globe, ArrowRight, SearchX, AlertTriangle, type LucideIcon,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Contributor, ResourceCard as Resource, Taxonomy } from "./api";

export const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles, shield: Shield, briefcase: Briefcase, smartphone: Smartphone, zap: Zap, "graduation-cap": GraduationCap,
  cpu: Cpu, scale: Scale, wallet: Wallet, lock: Lock, "message-circle": MessageCircle, layers: Layers, radio: Radio,
  clapperboard: Clapperboard, compass: Compass, "shield-check": ShieldCheck, brain: Brain,
};

export const TopicIcon = ({ name, className }: { name?: string | null; className?: string }) => {
  const Icon = (name && ICONS[name]) || Layers;
  return <Icon className={className} aria-hidden />;
};

export const FORMAT_META: Record<string, { label: string; verb: string; icon: LucideIcon }> = {
  video: { label: "Video", verb: "Watch video", icon: PlayCircle },
  reel: { label: "Short Video", verb: "Watch", icon: Film },
  article: { label: "Article", verb: "Read article", icon: FileText },
  guide: { label: "Guide", verb: "Follow guide", icon: ListChecks },
  pdf: { label: "PDF", verb: "Open PDF", icon: FileDown },
  quiz: { label: "Quiz", verb: "Take the quiz", icon: CircleHelp },
  session: { label: "Session", verb: "Watch session", icon: Presentation },
  "mentor-story": { label: "Mentor Story", verb: "Read story", icon: MessageSquareQuote },
  resource: { label: "Resource", verb: "Open resource", icon: Link2 },
};

export const formatMeta = (slug: string) => FORMAT_META[slug] || FORMAT_META.resource;

export const LANGUAGE_NATIVE: Record<string, string> = {
  en: "English", hi: "हिन्दी", mr: "मराठी", gu: "ગુજરાતી", bn: "বাংলা", ta: "தமிழ்", te: "తెలుగు", kn: "ಕನ್ನಡ", ml: "മലയാളം", pa: "ਪੰਜਾਬੀ", other: "Other",
};

export const optionLabel = (tax: Taxonomy | undefined, key: "formats" | "audiences" | "languages", slug: string) =>
  tax?.[key].find((o) => o.slug === slug)?.label || (key === "formats" ? formatMeta(slug).label : key === "languages" ? LANGUAGE_NATIVE[slug] : slug.replace(/-/g, " "));

export const formatDuration = (m: number | null | undefined) => (!m ? null : m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60 ? `${m % 60} min` : ""}`.trim());

export const formatDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

export const Container = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const SUBNAV = [
  { to: "/digital-daan", label: "Home", end: true },
  { to: "/digital-daan/explore", label: "Explore" },
  { to: "/digital-daan/contributors", label: "Contributors" },
  { to: "/digital-daan/campaigns/october-2026", label: "October 2026" },
  { to: "/digital-daan/about", label: "About" },
];

export const DDLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 overflow-x-clip">
    <Header />
    <nav aria-label="Digital Daan" className="bg-neutral-950 border-b border-white/10">
      <Container className="flex items-center gap-4 h-12">
        <Link to="/digital-daan" className="shrink-0 flex items-center gap-2 text-white font-semibold text-sm">
          <span className="grid place-items-center h-6 w-6 rounded-md bg-prachetas-yellow text-black text-[11px] font-bold">DD</span>
          <span className="hidden sm:inline">Digital Daan</span>
        </Link>
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <ul className="flex items-center gap-1 text-sm whitespace-nowrap">
            {SUBNAV.map((i) => (
              <li key={i.to}>
                <NavLink
                  to={i.to}
                  end={i.end}
                  className={({ isActive }) =>
                    `block rounded-full px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prachetas-yellow ${isActive ? "bg-white/10 text-prachetas-yellow" : "text-white/70 hover:text-white"}`
                  }
                >
                  {i.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <Link
          to="/digital-daan/contribute"
          className="shrink-0 hidden sm:inline-flex items-center gap-1.5 rounded-full bg-prachetas-yellow px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-yellow-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Contribute <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Container>
    </nav>
    <main id="main">{children}</main>
    <Footer />
  </div>
);

export const SectionHeader = ({ eyebrow, title, description, action, id }: { eyebrow?: string; title: string; description?: string; action?: ReactNode; id?: string }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
    <div className="max-w-2xl">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-prachetas-yellow mb-2">{eyebrow}</p>}
      <h2 id={id} className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
      {description && <p className="mt-2 text-neutral-600 dark:text-neutral-400">{description}</p>}
    </div>
    {action}
  </div>
);

export const TextLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 dark:text-white hover:text-amber-600 dark:hover:text-prachetas-yellow transition-colors">
    {children} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
  </Link>
);

export const DemoBadge = ({ className = "" }: { className?: string }) => (
  <span title="Sample content — will be replaced by real contributions" className={`inline-flex items-center rounded-full bg-neutral-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur ${className}`}>
    Sample
  </span>
);

export const Avatar = ({ person, size = 36 }: { person: Pick<Contributor, "name" | "photo_url">; size?: number }) => {
  const [broken, setBroken] = useState(false);
  const initials = person.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return person.photo_url && !broken ? (
    <img src={person.photo_url} alt="" width={size} height={size} loading="lazy" onError={() => setBroken(true)} className="rounded-full object-cover shrink-0 bg-neutral-200" style={{ width: size, height: size }} />
  ) : (
    <span aria-hidden className="grid place-items-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-black font-bold shrink-0" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {initials || "DD"}
    </span>
  );
};

// A designed cover used when a resource has no thumbnail (or its thumbnail fails to load).
export const ResourceCover = ({ resource, large = false, decor = true }: { resource: Pick<Resource, "title" | "thumbnail_url" | "category" | "content_type">; large?: boolean; decor?: boolean }) => {
  const [broken, setBroken] = useState(false);
  const color = resource.category?.color || "#F59E0B";
  const Format = formatMeta(resource.content_type).icon;
  if (resource.thumbnail_url && !broken) {
    return (
      <img
        src={resource.thumbnail_url}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setBroken(true)}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    );
  }
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-neutral-900">
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]" style={{ background: `radial-gradient(120% 90% at 85% 10%, ${color}55 0%, transparent 55%), radial-gradient(90% 80% at 0% 100%, ${color}33 0%, transparent 60%)` }} />
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
      <TopicIcon name={resource.category?.icon} className={`absolute text-white/10 ${large ? "-right-8 -bottom-8 h-64 w-64" : "-right-4 -bottom-5 h-32 w-32"}`} />
      {decor && (
        <>
          <div className={`absolute ${large ? "left-8 top-8" : "left-4 top-4"} flex items-center gap-2`}>
            <span className="grid place-items-center rounded-xl" style={{ background: `${color}33`, width: large ? 52 : 36, height: large ? 52 : 36 }}>
              <TopicIcon name={resource.category?.icon} className={large ? "h-6 w-6 text-white" : "h-4 w-4 text-white"} />
            </span>
          </div>
          <Format className={`absolute text-white/80 ${large ? "left-8 bottom-8 h-10 w-10" : "left-4 bottom-4 h-6 w-6"}`} />
        </>
      )}
    </div>
  );
};

export const MetaLine = ({ resource, className = "" }: { resource: Resource; className?: string }) => {
  const f = formatMeta(resource.content_type);
  const d = formatDuration(resource.duration_minutes);
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400 ${className}`}>
      <span className="inline-flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-300"><f.icon className="h-3.5 w-3.5" aria-hidden />{f.label}</span>
      {d && <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden />{d}</span>}
      {resource.language !== "en" && <span className="inline-flex items-center gap-1"><Globe className="h-3.5 w-3.5" aria-hidden />{LANGUAGE_NATIVE[resource.language] || resource.language}</span>}
    </div>
  );
};

export const ContributorLine = ({ person, size = 28 }: { person: Contributor | null; size?: number }) =>
  person ? (
    <div className="flex items-center gap-2.5 min-w-0">
      <Avatar person={person} size={size} />
      <div className="min-w-0 text-xs leading-tight">
        <p className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">{person.name}</p>
        {(person.designation || person.organisation) && (
          <p className="text-neutral-500 dark:text-neutral-400 truncate">{[person.designation, person.organisation].filter(Boolean).join(" · ")}</p>
        )}
      </div>
    </div>
  ) : null;

export const ResourceCard = ({ resource, priority = false }: { resource: Resource; priority?: boolean }) => (
  <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)] hover:border-neutral-300 dark:border-white/10 dark:bg-neutral-900 dark:hover:border-white/20 focus-within:ring-2 focus-within:ring-amber-500">
    <div className="relative aspect-[16/9] overflow-hidden">
      <ResourceCover resource={resource} large={priority} />
      {resource.is_demo && <DemoBadge className="absolute right-3 top-3" />}
    </div>
    <div className="flex flex-1 flex-col p-5">
      {resource.category && (
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: resource.category.color }}>
          {resource.category.name}
        </p>
      )}
      <h3 className="text-base font-semibold leading-snug tracking-tight line-clamp-2">
        <Link to={`/digital-daan/resources/${resource.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
          {resource.title}
        </Link>
      </h3>
      {resource.short_description && <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">{resource.short_description}</p>}
      <MetaLine resource={resource} className="mt-4" />
      <div className="mt-auto pt-4">
        <div className="border-t border-neutral-100 dark:border-white/5 pt-4 flex items-center justify-between gap-3">
          <ContributorLine person={resource.contributor} />
          <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-prachetas-yellow">
            {formatMeta(resource.content_type).verb.split(" ")[0]} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  </article>
);

export const CardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10" aria-hidden>
    <div className="aspect-[16/9] animate-pulse bg-neutral-200 dark:bg-neutral-800" />
    <div className="space-y-3 p-5">
      <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      <div className="h-4 w-11/12 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      <div className="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-800/60 animate-pulse" />
    </div>
  </div>
);

export const ResourceGrid = ({ items, loading, skeletons = 6, className = "" }: { items?: Resource[]; loading?: boolean; skeletons?: number; className?: string }) => (
  <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
    {loading && !items?.length ? Array.from({ length: skeletons }, (_, i) => <CardSkeleton key={i} />) : items?.map((r) => <ResourceCard key={r.slug} resource={r} />)}
  </div>
);

export const EmptyState = ({ title, description, action }: { title: string; description?: string; action?: ReactNode }) => (
  <div className="rounded-2xl border border-dashed border-neutral-300 dark:border-white/15 px-6 py-14 text-center">
    <SearchX className="mx-auto h-10 w-10 text-neutral-400" aria-hidden />
    <h3 className="mt-4 text-lg font-semibold">{title}</h3>
    {description && <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export const ErrorState = ({ onRetry }: { onRetry?: () => void }) => (
  <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10 px-6 py-10 text-center">
    <AlertTriangle className="mx-auto h-8 w-8 text-red-500" aria-hidden />
    <p className="mt-3 font-semibold">We couldn't load this right now.</p>
    <p className="text-sm text-neutral-600 dark:text-neutral-400">Please check your connection and try again.</p>
    {onRetry && (
      <button onClick={onRetry} className="mt-5 rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-black">
        Try again
      </button>
    )}
  </div>
);

export const Pill = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-white/10 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 ${className}`}>{children}</span>
);
