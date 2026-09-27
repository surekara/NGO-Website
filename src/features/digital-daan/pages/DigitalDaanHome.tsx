import { Link, Navigate, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import { ease } from "@/components/motion";
import { useHome, useTaxonomy, type ResourceCard as Resource } from "../api";
import {
  Avatar, CardSkeleton, Container, ContributorLine, DDLayout, DemoBadge, ErrorState, MetaLine, ResourceCover,
  ResourceGrid, SectionHeader, TextLink, TopicIcon, formatMeta,
} from "../ui";
import { ActivityCard, ContributionSeen, ContributorCTA, Reveal, SearchBox, StatsBand } from "../blocks";
import { useSeo } from "../seo";

const FILTER_KEYS = ["q", "category", "activity", "format", "audience", "language", "campaign", "collection", "tag"];

const campaignDates = (start: string | null, end: string | null) => {
  if (!start) return null;
  const s = new Date(`${start}T00:00:00`);
  const e = end ? new Date(`${end}T00:00:00`) : null;
  return e && s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()
    ? s.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : [s, e].filter(Boolean).map((d) => d!.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })).join(" – ");
};

const Hero = () => {
  const { data: tax } = useTaxonomy();
  const { data: home } = useHome();
  const reduce = useReducedMotion();
  const topics = (tax?.categories || []).filter((c) => c.resource_count).slice(0, 6);
  const campaign = home?.campaign;
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      <div aria-hidden className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div aria-hidden className="absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-prachetas-yellow/15 blur-[120px]" />
      <div aria-hidden className="absolute -bottom-48 -left-24 h-[420px] w-[420px] rounded-full bg-amber-700/15 blur-[120px]" />
      <Container className="relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
        <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-prachetas-yellow" /> A Prachetas Foundation learning initiative
          </p>
          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">Digital Daan</h1>
          <p className="mt-4 text-xl sm:text-2xl font-semibold text-prachetas-yellow">Give a Skill. Create an Opportunity.</p>
          <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-white/70">
            A growing collection of practical knowledge, skills and experiences shared by volunteers to help students and communities learn, grow and navigate the digital world.
          </p>
          <div className="mt-8 max-w-xl">
            <SearchBox />
          </div>
          {topics.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Popular topics">
              <span className="text-xs text-white/40 mr-1">Popular:</span>
              {topics.map((c) => (
                <Link key={c.slug} to={`/digital-daan/${c.slug}`} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/80 transition hover:border-prachetas-yellow/50 hover:text-prachetas-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prachetas-yellow">
                  {c.name}
                </Link>
              ))}
            </div>
          )}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/digital-daan/explore" className="inline-flex items-center justify-center gap-2 rounded-full bg-prachetas-yellow px-7 py-3.5 font-semibold text-black transition hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Explore Learning <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/digital-daan/contribute" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Become a Contributor
            </Link>
          </div>
          {campaign && (
            <Link to={`/digital-daan/campaigns/${campaign.slug}`} className="group mt-8 inline-flex items-center gap-3 text-sm text-white/60 hover:text-white">
              <CalendarDays className="h-4 w-4 text-prachetas-yellow" aria-hidden />
              <span>
                {campaign.phase === "completed" ? "Launched with" : "Launching with"}{" "}
                <span className="font-semibold text-white">Prachetas{campaign.partner ? ` × ${campaign.partner}` : ""}</span> · {campaignDates(campaign.start_date, campaign.end_date)}
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </motion.div>

        <div aria-label="The five Digital Daan activity areas" className="relative">
          <div className="grid gap-2.5">
            {(tax?.activities || Array.from({ length: 5 })).map((a, i) => (
              <motion.div
                key={a ? a.slug : i}
                initial={reduce ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.25 + i * 0.08, ease }}
                style={{ marginLeft: `${[0, 6, 12, 6, 0][i] ?? 0}%` }}
              >
                {a ? (
                  <Link
                    to={`/digital-daan/activities/${a.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 pr-5 backdrop-blur transition hover:border-white/25 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prachetas-yellow"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: `${a.color}26`, color: a.color }}>
                      <TopicIcon name={a.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-mono text-white/40">0{a.number}</span>
                      <span className="block font-semibold leading-tight">{a.name}</span>
                      <span className="block truncate text-xs text-white/50">{a.tagline}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white" aria-hidden />
                  </Link>
                ) : (
                  <div className="h-[74px] rounded-2xl bg-white/5 animate-pulse" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

const FeaturedLarge = ({ r }: { r: Resource }) => (
  <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-neutral-950 text-white focus-within:ring-2 focus-within:ring-amber-500">
    <div className="relative aspect-[16/10] lg:aspect-auto lg:flex-1 lg:min-h-[340px] overflow-hidden">
      <ResourceCover resource={r} large decor={false} />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
      <div className="absolute left-5 top-5 flex gap-2">
        <span className="rounded-full bg-prachetas-yellow px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-black">Featured</span>
        {r.is_demo && <DemoBadge />}
      </div>
    </div>
    <div className="relative -mt-24 p-6 sm:p-8">
      {r.category && <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: r.category.color }}>{r.category.name}</p>}
      <h3 className="mt-2 text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
        <Link to={`/digital-daan/resources/${r.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">{r.title}</Link>
      </h3>
      {r.short_description && <p className="mt-3 max-w-xl text-white/70">{r.short_description}</p>}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="[&_p]:!text-white/80 [&_p+p]:!text-white/50"><ContributorLine person={r.contributor} size={34} /></div>
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition group-hover:bg-prachetas-yellow">
          {formatMeta(r.content_type).verb} <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  </article>
);

const FeaturedSmall = ({ r }: { r: Resource }) => (
  <article className="group relative flex gap-4 rounded-2xl border border-neutral-200 bg-white p-3 transition hover:shadow-[0_12px_30px_-18px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-neutral-900 focus-within:ring-2 focus-within:ring-amber-500">
    <div className="relative aspect-[4/3] w-32 sm:w-40 shrink-0 overflow-hidden rounded-xl">
      <ResourceCover resource={r} />
    </div>
    <div className="min-w-0 py-1 pr-2">
      {r.category && <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: r.category.color }}>{r.category.name}</p>}
      <h3 className="mt-1 font-semibold leading-snug line-clamp-2">
        <Link to={`/digital-daan/resources/${r.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">{r.title}</Link>
      </h3>
      <MetaLine resource={r} className="mt-2" />
    </div>
  </article>
);

const DigitalDaanHome = () => {
  const { search } = useLocation();
  const { data, isLoading, isError, refetch } = useHome();
  const { data: tax } = useTaxonomy();
  useSeo({
    title: "Digital Daan — Give a Skill. Create an Opportunity. | Prachetas Foundation",
    description: "Free, practical learning resources on AI, cyber safety, careers and digital skills — shared by volunteers through Prachetas Foundation's Digital Daan.",
    path: "/digital-daan",
  });

  // Filter URLs like /digital-daan?category=ai open the library directly.
  const params = new URLSearchParams(search);
  if (FILTER_KEYS.some((k) => params.has(k))) return <Navigate to={`/digital-daan/explore${search}`} replace />;

  const [lead, ...rest] = data?.featured || [];
  const categories = (tax?.categories || []).filter((c) => c.slug !== "other");

  return (
    <DDLayout>
      <Hero />

      <section className="py-16 sm:py-20" aria-labelledby="dd-topics">
        <Container>
          <SectionHeader id="dd-topics" eyebrow="Learn by topic" title="What would you like to learn?" description="Start with a subject you care about. Every resource is free." action={<TextLink to="/digital-daan/explore">Browse the full library</TextLink>} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {(categories.length ? categories : Array.from<undefined>({ length: 8 })).map((c, i) =>
              c ? (
                <Reveal key={c.slug} delay={Math.min(i, 8) * 0.03}>
                  <Link
                    to={`/digital-daan/${c.slug}`}
                    className="group flex h-full items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_12px_30px_-18px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition group-hover:scale-110" style={{ background: `${c.color}1a`, color: c.color }}>
                      <TopicIcon name={c.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold leading-tight">{c.name}</span>
                      <span className="block text-xs text-neutral-500">{c.resource_count ? `${c.resource_count} resource${c.resource_count === 1 ? "" : "s"}` : "Coming soon"}</span>
                    </span>
                  </Link>
                </Reveal>
              ) : (
                <div key={i} className="h-[74px] rounded-2xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
              ),
            )}
          </div>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20" aria-labelledby="dd-featured">
        <Container>
          <SectionHeader id="dd-featured" eyebrow="Handpicked" title="Featured Learning" description="Resources our team recommends starting with." />
          {isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : isLoading || !lead ? (
            <div className="grid gap-5 lg:grid-cols-2"><CardSkeleton /><div className="grid gap-4">{[0, 1, 2].map((i) => <div key={i} className="h-28 rounded-2xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />)}</div></div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
              <Reveal className="h-full"><FeaturedLarge r={lead} /></Reveal>
              <div className="grid content-start gap-4">
                {rest.slice(0, 4).map((r, i) => <Reveal key={r.slug} delay={i * 0.06}><FeaturedSmall r={r} /></Reveal>)}
              </div>
            </div>
          )}
        </Container>
      </section>

      <section className="py-16 sm:py-20 bg-neutral-50 dark:bg-neutral-900/40" aria-labelledby="dd-activities">
        <Container>
          <SectionHeader id="dd-activities" eyebrow="How knowledge is shared" title="Five ways volunteers give Digital Daan" description="Every resource is created through one of five flagship activities. Explore by the way it was made." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(tax?.activities || []).map((a, i) => <ActivityCard key={a.slug} activity={a} index={i} />)}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="dd-recent">
        <Container>
          <SectionHeader id="dd-recent" eyebrow="Fresh" title="Recently Added" description="The newest contributions to the library." action={<TextLink to="/digital-daan/explore?sort=latest">See all</TextLink>} />
          {isError ? <ErrorState onRetry={() => refetch()} /> : <ResourceGrid items={data?.recent.slice(0, 6)} loading={isLoading} />}
        </Container>
      </section>

      {!!data?.collections.length && (
        <section className="pb-16 sm:pb-20" aria-labelledby="dd-collections">
          <Container>
            <SectionHeader id="dd-collections" eyebrow="Collections" title="Curated learning paths" description="Short sets of resources that work well together." />
            <div className="grid gap-5 md:grid-cols-2">
              {data.collections.map((c, i) => (
                <Reveal key={c.slug} delay={i * 0.05}>
                  <div className="h-full rounded-2xl border border-neutral-200 p-6 dark:border-white/10">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight">{c.name}</h3>
                        {c.description && <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{c.description}</p>}
                      </div>
                      <Link to={`/digital-daan/explore?collection=${c.slug}`} className="shrink-0 text-sm font-semibold text-amber-700 hover:underline dark:text-prachetas-yellow">View all</Link>
                    </div>
                    <ol className="mt-5 divide-y divide-neutral-100 dark:divide-white/5">
                      {c.resources?.map((r, j) => (
                        <li key={r.slug}>
                          <Link to={`/digital-daan/resources/${r.slug}`} className="group flex items-center gap-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg">
                            <span className="font-mono text-xs text-neutral-400 w-5">{String(j + 1).padStart(2, "0")}</span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium group-hover:text-amber-700 dark:group-hover:text-prachetas-yellow">{r.title}</span>
                              <MetaLine resource={r} className="mt-0.5" />
                            </span>
                            <ArrowRight className="h-4 w-4 shrink-0 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-700" aria-hidden />
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {!!data?.stats.length && (
        <section className="py-16 sm:py-20 bg-neutral-950 text-white" aria-labelledby="dd-impact">
          <Container>
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-prachetas-yellow mb-2">Impact so far</p>
              <h2 id="dd-impact" className="text-3xl font-bold tracking-tight">Knowledge that keeps giving</h2>
            </div>
            <StatsBand stats={data.stats} dark />
          </Container>
        </section>
      )}

      {!!data?.contributors.length && (
        <section className="py-16 sm:py-20" aria-labelledby="dd-people">
          <Container>
            <SectionHeader id="dd-people" eyebrow="The people behind it" title="Meet the Contributors" description="Professionals and volunteers who chose to share what they know." action={<TextLink to="/digital-daan/contributors">All contributors</TextLink>} />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {data.contributors.map((c, i) => (
                <Reveal key={c.slug} delay={i * 0.04}>
                  <Link to={`/digital-daan/contributors/${c.slug}`} className="group flex flex-col items-center rounded-2xl p-3 text-center transition hover:bg-neutral-50 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                    <span className="rounded-full ring-2 ring-transparent transition group-hover:ring-amber-400"><Avatar person={c} size={64} /></span>
                    <span className="mt-3 text-sm font-semibold leading-tight">{c.name}</span>
                    {c.designation && <span className="mt-0.5 text-xs text-neutral-500 line-clamp-2">{c.designation}</span>}
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <ContributionSeen />
      <ContributorCTA />
    </DDLayout>
  );
};

export default DigitalDaanHome;
