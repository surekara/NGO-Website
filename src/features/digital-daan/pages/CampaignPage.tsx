import { Link, useParams } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";
import { ApiError, useCampaign, useTaxonomy } from "../api";
import { Avatar, Container, DDLayout, EmptyState, ErrorState, ResourceGrid, SectionHeader, TextLink } from "../ui";
import { ActivityCard, ContributionSeen, ContributorCTA, Reveal, StatsBand } from "../blocks";
import { useSeo } from "../seo";

const fmt = (d: string | null) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : null);

const PHASE: Record<string, { label: string; cls: string }> = {
  upcoming: { label: "Upcoming", cls: "bg-sky-400/15 text-sky-300" },
  active: { label: "Live now", cls: "bg-emerald-400/15 text-emerald-300" },
  completed: { label: "Completed", cls: "bg-white/10 text-white/70" },
};

const CampaignPage = () => {
  const { slug } = useParams();
  const { data, isLoading, isError, error, refetch } = useCampaign(slug);
  const { data: tax } = useTaxonomy();
  const c = data?.campaign;
  useSeo({
    title: c ? `${c.name} | Prachetas Foundation` : "Digital Daan Campaign | Prachetas Foundation",
    description: c ? [c.tagline, c.description].filter(Boolean).join(" ") : undefined,
    image: c?.hero_image_url,
    path: `/digital-daan/campaigns/${slug}`,
    noindex: isError,
  });
  if (isError && (error as ApiError)?.status === 404) {
    return <DDLayout><Container className="py-24"><EmptyState title="Campaign not found" action={<TextLink to="/digital-daan">Go to Digital Daan</TextLink>} /></Container></DDLayout>;
  }
  const phase = c ? PHASE[c.phase] : null;
  return (
    <DDLayout>
      <header className="relative overflow-hidden bg-neutral-950 text-white">
        {c?.hero_image_url && <img src={c.hero_image_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />}
        <div aria-hidden className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div aria-hidden className="absolute -top-40 left-1/2 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-prachetas-yellow/15 blur-[120px]" />
        <Container className="relative py-16 sm:py-24 text-center">
          {isError ? <ErrorState onRetry={() => refetch()} /> : isLoading || !c ? <div className="mx-auto h-40 max-w-xl rounded-2xl bg-white/5 animate-pulse" /> : (
            <Reveal>
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">Prachetas{c.partner ? <> <span className="text-prachetas-yellow">×</span> {c.partner}</> : null}</p>
                {phase && <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${phase.cls}`}>{phase.label}</span>}
              </div>
              <h1 className="mt-5 text-4xl sm:text-6xl font-bold tracking-tight">Digital Daan{c.short_name ? <> <span className="text-white/40">|</span> {c.short_name}</> : null}</h1>
              {c.tagline && <p className="mt-4 text-xl sm:text-2xl font-semibold text-prachetas-yellow">{c.tagline}</p>}
              {c.start_date && (
                <p className="mt-5 inline-flex items-center gap-2 text-sm text-white/60"><CalendarDays className="h-4 w-4" aria-hidden />{fmt(c.start_date)}{c.end_date ? ` – ${fmt(c.end_date)}` : ""}</p>
              )}
              {c.description && <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">{c.description}</p>}
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to={`/digital-daan/explore?campaign=${c.slug}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-prachetas-yellow px-7 py-3.5 font-semibold text-black hover:bg-yellow-300">Explore campaign resources <ArrowRight className="h-4 w-4" /></Link>
                {c.phase !== "completed" && <Link to="/digital-daan/contribute" className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 font-semibold hover:bg-white/10">Participate as a volunteer</Link>}
              </div>
              <p className="mt-8 text-xs text-white/40">Part of <Link to="/digital-daan" className="underline hover:text-white">Prachetas Digital Daan</Link> — a permanent, growing learning library.</p>
            </Reveal>
          )}
        </Container>
      </header>

      {!!data?.stats.length && (
        <Container className="-mt-px py-12"><StatsBand stats={data.stats} /></Container>
      )}

      <section className="py-12 sm:py-16" aria-labelledby="dd-camp-acts">
        <Container>
          <SectionHeader id="dd-camp-acts" eyebrow="Five ways to give" title="The flagship activities" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{tax?.activities.map((a, i) => <ActivityCard key={a.slug} activity={a} index={i} />)}</div>
        </Container>
      </section>

      {!!data?.featured.length && (
        <section className="py-12 sm:py-16 bg-neutral-50 dark:bg-neutral-900/40" aria-labelledby="dd-camp-feat">
          <Container>
            <SectionHeader id="dd-camp-feat" eyebrow="From this campaign" title="Featured resources" action={data.total > 4 ? <TextLink to={`/digital-daan/explore?campaign=${slug}`}>All {data.total} resources</TextLink> : undefined} />
            <ResourceGrid items={data.featured.slice(0, 3)} />
          </Container>
        </section>
      )}

      {!!data?.contributors.length && (
        <section className="py-12 sm:py-16" aria-labelledby="dd-camp-people">
          <Container>
            <SectionHeader id="dd-camp-people" eyebrow="Contributor highlights" title="The volunteers behind this campaign" />
            <div className="flex flex-wrap gap-3">
              {data.contributors.map((p) => (
                <Link key={p.slug} to={`/digital-daan/contributors/${p.slug}`} className="inline-flex items-center gap-3 rounded-full border border-neutral-200 py-1.5 pl-1.5 pr-5 transition hover:shadow-md dark:border-white/10">
                  <Avatar person={p} size={40} />
                  <span className="text-sm"><span className="block font-semibold leading-tight">{p.name}</span>{p.designation && <span className="block text-xs text-neutral-500">{p.designation}</span>}</span>
                </Link>
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

export default CampaignPage;
