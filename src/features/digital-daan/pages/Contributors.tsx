import { Link, useParams } from "react-router-dom";
import { Linkedin, ArrowLeft } from "lucide-react";
import { ApiError, useContributor, useContributors } from "../api";
import { Avatar, Container, DDLayout, DemoBadge, EmptyState, ErrorState, ResourceGrid, SectionHeader, TextLink } from "../ui";
import { ContributorCTA, Reveal } from "../blocks";
import { useSeo } from "../seo";

export const ContributorsPage = () => {
  const { data, isLoading, isError, refetch } = useContributors();
  useSeo({ title: "Meet the Contributors | Digital Daan — Prachetas Foundation", description: "The professionals and volunteers sharing practical knowledge through Prachetas Digital Daan.", path: "/digital-daan/contributors" });
  return (
    <DDLayout>
      <header className="border-b border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900/40">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-prachetas-yellow">The people behind Digital Daan</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Meet the Contributors</h1>
          <p className="mt-3 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">Professionals and volunteers who chose to share what they know — so that someone else can learn, grow and stay safe.</p>
        </Container>
      </header>
      <Container className="py-12">
        {isError ? <ErrorState onRetry={() => refetch()} /> : isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-44 rounded-2xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />)}</div>
        ) : !data?.contributors.length ? (
          <EmptyState title="Our first contributors are on their way" description="Be one of the first to share your knowledge." action={<TextLink to="/digital-daan/contribute">Become a contributor</TextLink>} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.contributors.map((c, i) => (
              <Reveal key={c.slug} delay={Math.min(i, 9) * 0.04}>
                <Link to={`/digital-daan/contributors/${c.slug}`} className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.4)] dark:border-white/10 dark:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                  <div className="flex items-center gap-4">
                    <Avatar person={c} size={60} />
                    <div className="min-w-0">
                      <p className="text-lg font-bold leading-tight group-hover:text-amber-700 dark:group-hover:text-prachetas-yellow">{c.name}</p>
                      {(c.designation || c.organisation) && <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">{[c.designation, c.organisation].filter(Boolean).join(" · ")}</p>}
                    </div>
                  </div>
                  {c.bio && <p className="mt-4 text-sm text-neutral-600 line-clamp-3 dark:text-neutral-400">{c.bio}</p>}
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-prachetas-yellow/15 dark:text-prachetas-yellow">{c.resource_count} resource{c.resource_count === 1 ? "" : "s"}</span>
                    {c.categories?.slice(0, 2).map((cat) => <span key={cat} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-white/5 dark:text-neutral-400">{cat}</span>)}
                    {c.is_demo && <DemoBadge />}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
      <ContributorCTA />
    </DDLayout>
  );
};

export const ContributorProfile = () => {
  const { slug } = useParams();
  const { data, isLoading, isError, error, refetch } = useContributor(slug);
  const c = data?.contributor;
  useSeo({
    title: c ? `${c.name} — Digital Daan Contributor | Prachetas Foundation` : "Digital Daan Contributor | Prachetas Foundation",
    description: c?.bio || (c ? `Learning resources shared by ${c.name} on Prachetas Digital Daan.` : undefined),
    image: c?.photo_url,
    path: `/digital-daan/contributors/${slug}`,
    type: "profile",
    noindex: !!c?.is_demo || isError,
  });
  if (isError && (error as ApiError)?.status === 404) {
    return <DDLayout><Container className="py-24"><EmptyState title="Profile not found" description="This contributor profile isn't public." action={<TextLink to="/digital-daan/contributors">See all contributors</TextLink>} /></Container></DDLayout>;
  }
  return (
    <DDLayout>
      <header className="relative overflow-hidden bg-neutral-950 text-white">
        <div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-prachetas-yellow/15 blur-3xl" />
        <Container className="relative py-12 sm:py-16">
          <Link to="/digital-daan/contributors" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white"><ArrowLeft className="h-4 w-4" /> All contributors</Link>
          {isError ? <div className="mt-6"><ErrorState onRetry={() => refetch()} /></div> : isLoading || !c ? <div className="mt-8 h-28 max-w-lg rounded-2xl bg-white/5 animate-pulse" /> : (
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className="rounded-full ring-4 ring-prachetas-yellow/30"><Avatar person={c} size={112} /></span>
              <div className="max-w-2xl">
                <div className="flex items-center gap-3"><h1 className="text-4xl font-bold tracking-tight">{c.name}</h1>{c.is_demo && <DemoBadge />}</div>
                {(c.designation || c.organisation) && <p className="mt-2 text-lg text-white/70">{[c.designation, c.organisation].filter(Boolean).join(" · ")}</p>}
                {c.expertise && <p className="mt-1 text-sm text-white/50">Expertise: {c.expertise}</p>}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-prachetas-yellow px-3 py-1 text-xs font-bold text-black">{c.resource_count} resource{c.resource_count === 1 ? "" : "s"}</span>
                  {c.categories?.map((cat) => <span key={cat} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">{cat}</span>)}
                  {c.linkedin_url && (
                    <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-xs text-white/80 hover:bg-[#0A66C2] hover:border-transparent">
                      <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </Container>
      </header>
      {c?.bio && (
        <Container className="pt-12">
          <p className="max-w-3xl text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">{c.bio}</p>
        </Container>
      )}
      <section className="py-12 sm:py-16" aria-labelledby="dd-contribs">
        <Container>
          <SectionHeader id="dd-contribs" title="Contributions" description={c ? `Learning resources shared by ${c.name.split(" ")[0]}.` : undefined} />
          <ResourceGrid items={data?.resources} loading={isLoading} />
        </Container>
      </section>
    </DDLayout>
  );
};
