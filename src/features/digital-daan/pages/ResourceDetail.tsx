import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Globe, Users, Linkedin, Tag, ExternalLink } from "lucide-react";
import { ApiError, track, useResource, useTaxonomy, type Contributor, type ResourceDetail as Detail } from "../api";
import {
  Avatar, Container, DDLayout, DemoBadge, EmptyState, ErrorState, ResourceGrid, SectionHeader, formatDate, formatDuration, formatMeta, optionLabel,
} from "../ui";
import { Reveal } from "../blocks";
import Markdown, { extractHeadings } from "../Markdown";
import { DocumentViewer, QuizPlayer, VideoPlayer } from "../Media";
import { ShareButtons } from "../Share";
import { SITE_URL, useSeo } from "../seo";

const VIDEO_TYPES = ["video", "reel", "session"];
const DOC_TYPES = ["pdf", "resource"];

const ContributorPanel = ({ person }: { person: Contributor }) => (
  <section aria-labelledby="dd-created-by" className="rounded-2xl border border-neutral-200 p-6 dark:border-white/10">
    <h2 id="dd-created-by" className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Created by</h2>
    <div className="mt-4 flex items-start gap-4">
      <Avatar person={person} size={56} />
      <div className="min-w-0">
        <p className="text-lg font-bold leading-tight">{person.name}</p>
        {(person.designation || person.organisation) && <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">{[person.designation, person.organisation].filter(Boolean).join(" · ")}</p>}
        {person.expertise && <p className="mt-1 text-xs text-neutral-500">Expertise: {person.expertise}</p>}
      </div>
    </div>
    {person.bio && <p className="mt-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{person.bio}</p>}
    <div className="mt-5 flex flex-wrap gap-3">
      {person.has_profile && person.slug && (
        <Link to={`/digital-daan/contributors/${person.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:underline dark:text-prachetas-yellow">
          View profile <ArrowRight className="h-4 w-4" />
        </Link>
      )}
      {person.linkedin_url && (
        <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-[#0A66C2] dark:text-neutral-400">
          <Linkedin className="h-4 w-4" /> LinkedIn
        </a>
      )}
    </div>
  </section>
);

export const MainContent = ({ r }: { r: Detail }) => {
  const isVideo = VIDEO_TYPES.includes(r.content_type);
  const headings = useMemo(() => (r.content_type === "guide" && r.body ? extractHeadings(r.body) : []), [r]);
  return (
    <div className="space-y-10">
      {isVideo && <VideoPlayer resource={r} />}
      {DOC_TYPES.includes(r.content_type) && (r.media.drive_preview_url || r.media.external_url) && <DocumentViewer resource={r} />}

      {r.detailed_description && (
        <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">{r.detailed_description}</p>
      )}

      {headings.length > 2 && (
        <nav aria-label="In this guide" className="rounded-2xl bg-neutral-50 p-5 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">In this guide</p>
          <ol className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {headings.map((h, i) => (
              <li key={h.id}>
                <a href={`#${h.id}`} className="flex gap-2 text-sm font-medium text-neutral-700 hover:text-amber-700 dark:text-neutral-300 dark:hover:text-prachetas-yellow">
                  <span className="font-mono text-neutral-400">{String(i + 1).padStart(2, "0")}</span>{h.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {r.content_type === "quiz" && r.quiz?.length ? <QuizPlayer questions={r.quiz} slug={r.slug} /> : null}

      {r.body && (
        <div>
          {isVideo && <h2 className="mb-4 text-xl font-bold">Key points</h2>}
          <Markdown source={r.body} />
        </div>
      )}

      {r.media.external_url && !DOC_TYPES.includes(r.content_type) && (
        <a href={r.media.external_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold hover:bg-neutral-50 dark:border-white/15 dark:hover:bg-white/5">
          <ExternalLink className="h-4 w-4" /> Open the original resource
        </a>
      )}

      {r.transcript && (
        <details className="group rounded-2xl border border-neutral-200 p-5 dark:border-white/10">
          <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
            Transcript <span className="text-sm text-neutral-400 group-open:hidden">Show</span><span className="hidden text-sm text-neutral-400 group-open:inline">Hide</span>
          </summary>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-neutral-700 dark:text-neutral-300">{r.transcript}</p>
        </details>
      )}
    </div>
  );
};

const ResourceDetail = () => {
  const { slug } = useParams();
  const { data, isLoading, isError, error, refetch } = useResource(slug);
  const { data: tax } = useTaxonomy();
  const r = data?.resource;
  const url = `${SITE_URL}/digital-daan/resources/${slug}`;

  useEffect(() => {
    if (r) track("view", { slug: r.slug });
  }, [r?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useSeo({
    title: r ? `${r.title} | Digital Daan — Prachetas Foundation` : "Digital Daan — Prachetas Foundation",
    description: r?.short_description,
    image: r?.thumbnail_url,
    path: `/digital-daan/resources/${slug}`,
    type: "article",
    noindex: !!r?.is_demo || isError,
  });

  if (isError && (error as ApiError)?.status === 404) {
    return (
      <DDLayout>
        <Container className="py-24">
          <EmptyState title="This resource isn't available" description="It may have been moved, or it hasn't been published yet." action={<Link to="/digital-daan/explore" className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-black">Explore the library</Link>} />
        </Container>
      </DDLayout>
    );
  }

  const f = r ? formatMeta(r.content_type) : null;

  return (
    <DDLayout>
      <header className="border-b border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900/40">
        <Container className="py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link to="/digital-daan" className="hover:text-neutral-900 dark:hover:text-white">Digital Daan</Link></li>
              {r?.category && <><li aria-hidden>/</li><li><Link to={`/digital-daan/${r.category.slug}`} className="hover:text-neutral-900 dark:hover:text-white">{r.category.name}</Link></li></>}
            </ol>
          </nav>
          {isLoading || !r ? (
            isError ? <div className="mt-6"><ErrorState onRetry={() => refetch()} /></div> : (
              <div className="mt-6 space-y-4" aria-hidden>
                <div className="h-4 w-40 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                <div className="h-10 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                <div className="h-5 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              </div>
            )
          ) : (
            <div className="mt-5 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                {r.category && (
                  <Link to={`/digital-daan/${r.category.slug}`} className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ background: `${r.category.color}1a`, color: r.category.color }}>
                    {r.category.name}
                  </Link>
                )}
                {r.activity && (
                  <Link to={`/digital-daan/activities/${r.activity.slug}`} className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold text-neutral-700 hover:border-neutral-500 dark:border-white/15 dark:text-neutral-300">
                    {r.activity.name}
                  </Link>
                )}
                {r.is_demo && <DemoBadge />}
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">{r.title}</h1>
              {r.short_description && <p className="mt-4 text-lg sm:text-xl text-neutral-600 dark:text-neutral-400">{r.short_description}</p>}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                {r.contributor && (
                  <span className="flex items-center gap-2">
                    <Avatar person={r.contributor} size={28} />
                    <span>By <span className="font-semibold text-neutral-900 dark:text-white">{r.contributor.name}</span></span>
                  </span>
                )}
                {f && <span className="inline-flex items-center gap-1.5"><f.icon className="h-4 w-4" aria-hidden />{f.label}</span>}
                {r.duration_minutes && <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden />{formatDuration(r.duration_minutes)}</span>}
                <span className="inline-flex items-center gap-1.5"><Globe className="h-4 w-4" aria-hidden />{optionLabel(tax, "languages", r.language)}</span>
                {r.published_at && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" aria-hidden /><time dateTime={r.published_at}>{formatDate(r.published_at)}</time></span>}
              </div>
            </div>
          )}
        </Container>
      </header>

      {r && (
        <Container className="py-10 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            <article className="min-w-0 max-w-3xl">
              <MainContent r={r} />
              <div className="mt-12 border-t border-neutral-200 pt-8 dark:border-white/10">
                <p className="mb-3 text-sm font-semibold">Found this useful? Share it with someone who needs it.</p>
                <ShareButtons url={url} title={r.title} slug={r.slug} />
              </div>
            </article>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <section aria-labelledby="dd-about-res" className="rounded-2xl bg-neutral-50 p-6 dark:bg-white/5">
                <h2 id="dd-about-res" className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">About this resource</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  {f && <div className="flex justify-between gap-4"><dt className="text-neutral-500">Format</dt><dd className="font-medium">{f.label}</dd></div>}
                  {r.duration_minutes && <div className="flex justify-between gap-4"><dt className="text-neutral-500">Time</dt><dd className="font-medium">{formatDuration(r.duration_minutes)}</dd></div>}
                  <div className="flex justify-between gap-4"><dt className="text-neutral-500">Language</dt><dd className="font-medium">{optionLabel(tax, "languages", r.language)}</dd></div>
                  {r.audiences.length > 0 && (
                    <div>
                      <dt className="flex items-center gap-1.5 text-neutral-500"><Users className="h-4 w-4" aria-hidden /> Best for</dt>
                      <dd className="mt-2 flex flex-wrap gap-1.5">
                        {r.audiences.map((a) => (
                          <Link key={a} to={`/digital-daan/explore?audience=${a}`} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium shadow-sm hover:text-amber-700 dark:bg-neutral-800">{optionLabel(tax, "audiences", a)}</Link>
                        ))}
                      </dd>
                    </div>
                  )}
                  {r.campaigns.length > 0 && (
                    <div>
                      <dt className="text-neutral-500">Part of</dt>
                      <dd className="mt-1 space-y-1">
                        {r.campaigns.map((c) => (
                          <Link key={c.slug} to={`/digital-daan/campaigns/${c.slug}`} className="block font-medium hover:text-amber-700 dark:hover:text-prachetas-yellow">
                            Digital Daan{c.short_name ? ` · ${c.short_name}` : ""}{c.partner ? ` (with ${c.partner})` : ""}
                          </Link>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
                {r.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-neutral-200 pt-4 dark:border-white/10">
                    <Tag className="h-4 w-4 text-neutral-400" aria-hidden />
                    {r.tags.map((t) => (
                      <Link key={t} to={`/digital-daan/explore?tag=${encodeURIComponent(t)}`} className="text-xs text-neutral-600 hover:text-amber-700 dark:text-neutral-400">#{t}</Link>
                    ))}
                  </div>
                )}
              </section>
              {r.contributor && <ContributorPanel person={r.contributor} />}
            </aside>
          </div>
        </Container>
      )}

      {!!data?.related.length && (
        <section className="border-t border-neutral-200 bg-neutral-50 py-16 dark:border-white/10 dark:bg-neutral-900/40" aria-labelledby="dd-related">
          <Container>
            <SectionHeader id="dd-related" title="You may also find useful" action={<Link to="/digital-daan/explore" className="inline-flex items-center gap-1.5 text-sm font-semibold"><ArrowLeft className="h-4 w-4" /> Back to library</Link>} />
            <Reveal><ResourceGrid items={data.related} /></Reveal>
          </Container>
        </section>
      )}
    </DDLayout>
  );
};

export default ResourceDetail;
