import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { ApiError, useResourceSearch, useTaxonomy, useTopic } from "../api";
import { Container, DDLayout, EmptyState, ErrorState, ResourceCard, ResourceGrid, SectionHeader, TextLink, TopicIcon, FORMAT_META } from "../ui";
import { ContributorCTA, Reveal } from "../blocks";
import { useSeo } from "../seo";

const TopicPage = ({ type }: { type: "category" | "activity" }) => {
  const params = useParams();
  const slug = type === "activity" ? params.slug : params.topic;
  const { data, isLoading, isError, error, refetch } = useTopic(type, slug);
  const { data: tax } = useTaxonomy();
  const [format, setFormat] = useState<string>("");
  const filters = { [type]: slug, ...(format ? { format } : {}) };
  const list = useResourceSearch(filters, 9);
  const items = list.data?.pages.flatMap((p) => p.items) || [];
  const total = list.data?.pages[0]?.total ?? 0;
  const topic = data?.topic;
  const color = topic?.color || "#F59E0B";
  const description = topic?.intro || topic?.description;

  useSeo({
    title: topic ? (type === "activity" ? `${topic.name} — ${topic.tagline} | Digital Daan` : `${topic.name} — Free Learning Resources | Digital Daan`) : "Digital Daan — Prachetas Foundation",
    description,
    path: type === "activity" ? `/digital-daan/activities/${slug}` : `/digital-daan/${slug}`,
    noindex: isError,
  });

  if (isError && (error as ApiError)?.status === 404) {
    return (
      <DDLayout>
        <Container className="py-24"><EmptyState title="Topic not found" description="Try exploring the full library instead." action={<TextLink to="/digital-daan/explore">Explore Digital Daan</TextLink>} /></Container>
      </DDLayout>
    );
  }

  const featuredSlugs = new Set((data?.featured || []).filter((r) => r.featured).map((r) => r.slug));
  const featured = (data?.featured || []).filter((r) => featuredSlugs.has(r.slug));
  const exploreLink = `/digital-daan/explore?${type}=${slug}${format ? `&format=${format}` : ""}`;

  return (
    <DDLayout>
      <header className="relative overflow-hidden bg-neutral-950 text-white">
        <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(60% 120% at 90% 0%, ${color}40 0%, transparent 60%)` }} />
        <Container className="relative py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-white/50">
            <Link to="/digital-daan" className="hover:text-white">Digital Daan</Link>
            <span aria-hidden> / </span>
            <span>{type === "activity" ? "Activities" : "Topics"}</span>
          </nav>
          {isLoading || !topic ? (
            isError ? <div className="mt-6"><ErrorState onRetry={() => refetch()} /></div> : <div className="mt-6 h-24 max-w-lg rounded-2xl bg-white/5 animate-pulse" />
          ) : (
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl" style={{ background: `${color}33`, color }}>
                <TopicIcon name={topic.icon} className="h-8 w-8" />
              </span>
              <div className="max-w-3xl">
                {type === "activity" && <p className="font-mono text-sm text-white/40">Activity 0{topic.number}</p>}
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{topic.name}</h1>
                {topic.tagline && <p className="mt-3 text-xl font-semibold" style={{ color }}>{topic.tagline}</p>}
                {description && <p className="mt-4 text-lg text-white/70">{description}</p>}
                {type === "activity" && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {[...(topic.formats || []), ...(topic.topics || [])].slice(0, 10).map((t) => (
                      <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Container>
      </header>

      {featured.length > 0 && (
        <section className="py-14" aria-labelledby="dd-topic-featured">
          <Container>
            <SectionHeader id="dd-topic-featured" eyebrow="Start here" title={`Featured in ${topic?.name}`} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((r, i) => <Reveal key={r.slug} delay={i * 0.06}><ResourceCard resource={r} /></Reveal>)}
            </div>
          </Container>
        </section>
      )}

      <section className={`${featured.length ? "pb-16" : "py-14"}`} aria-labelledby="dd-topic-all">
        <Container>
          <SectionHeader id="dd-topic-all" eyebrow="Library" title={`All ${topic?.name || ""} resources`} description={list.isLoading ? undefined : `${total} resource${total === 1 ? "" : "s"}`} action={<TextLink to={exploreLink}>Open with more filters</TextLink>} />
          <div className="-mx-4 mb-6 overflow-x-auto px-4 no-scrollbar">
            <div className="flex gap-2" role="group" aria-label="Filter by format">
              {[{ slug: "", label: "All formats" }, ...(tax?.formats || [])].map((f) => (
                <button
                  key={f.slug}
                  onClick={() => setFormat(f.slug)}
                  aria-pressed={format === f.slug}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${format === f.slug ? "bg-neutral-900 text-white dark:bg-white dark:text-black" : "border border-neutral-200 text-neutral-700 hover:border-neutral-400 dark:border-white/10 dark:text-neutral-300"}`}
                >
                  {f.slug && FORMAT_META[f.slug] ? FORMAT_META[f.slug].label : f.label}
                </button>
              ))}
            </div>
          </div>
          {list.isError ? (
            <ErrorState onRetry={() => list.refetch()} />
          ) : !list.isLoading && !items.length ? (
            <EmptyState title="Nothing here yet" description="Resources in this area are on their way. Have something to share?" action={<TextLink to="/digital-daan/contribute">Become a contributor</TextLink>} />
          ) : (
            <ResourceGrid items={items} loading={list.isLoading} />
          )}
          {list.hasNextPage && (
            <div className="mt-10 text-center">
              <button onClick={() => list.fetchNextPage()} disabled={list.isFetchingNextPage} className="inline-flex h-12 items-center gap-2 rounded-full border border-neutral-300 px-8 text-sm font-semibold hover:bg-neutral-50 dark:border-white/15 dark:hover:bg-white/5">
                {list.isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />} Load more
              </button>
            </div>
          )}
        </Container>
      </section>

      {!!data?.related.length && (
        <section className="border-t border-neutral-200 bg-neutral-50 py-14 dark:border-white/10 dark:bg-neutral-900/40" aria-labelledby="dd-topic-related">
          <Container>
            <SectionHeader id="dd-topic-related" title={type === "activity" ? "Explore by topic" : "Related topics"} />
            <div className="flex flex-wrap gap-3">
              {data.related.map((c) => (
                <Link key={c.slug} to={`/digital-daan/${c.slug}`} className="group inline-flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white py-2 pl-2 pr-4 text-sm font-medium transition hover:shadow-md dark:border-white/10 dark:bg-neutral-900">
                  <span className="grid h-8 w-8 place-items-center rounded-full" style={{ background: `${c.color}1a`, color: c.color }}><TopicIcon name={c.icon} className="h-4 w-4" /></span>
                  {c.name}
                  <span className="text-xs text-neutral-400">{c.resource_count}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-400 transition group-hover:translate-x-0.5" aria-hidden />
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <ContributorCTA />
    </DDLayout>
  );
};

export default TopicPage;
