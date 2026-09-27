import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Search, Share2, ShieldCheck, Send, CheckCircle2, Globe2, Megaphone, UserCheck } from "lucide-react";
import { useTaxonomy } from "../api";
import { Container, DDLayout, EmptyState, SectionHeader } from "../ui";
import { ActivityCard, ContributorCTA, Reveal } from "../blocks";
import { useSeo } from "../seo";

const LEARNER_FLOW = [
  { icon: Search, title: "Choose what to learn", text: "Browse by topic, search, or filter by language and audience." },
  { icon: BookOpen, title: "Learn", text: "Watch, read, follow a guide or take a quiz — all free." },
  { icon: Share2, title: "Share", text: "Pass it on to someone who needs it on WhatsApp or LinkedIn." },
];

const CONTRIBUTOR_FLOW = [
  { icon: Send, title: "Submit", text: "Share a link to your content and tell us about it." },
  { icon: ShieldCheck, title: "Review", text: "Our team reviews every contribution before it goes live." },
  { icon: CheckCircle2, title: "Publish", text: "Approved resources join the permanent library." },
  { icon: UserCheck, title: "Credit", text: "You're credited — showing only the details you allowed." },
  { icon: Globe2, title: "Discover", text: "Learners find it through search, topics and collections." },
  { icon: Megaphone, title: "Amplify", text: "Selected contributions may be promoted on our channels." },
];

export const AboutPage = () => {
  const { data: tax } = useTaxonomy();
  useSeo({ title: "About Digital Daan | Prachetas Foundation", description: "Digital Daan is Prachetas Foundation's long-term learning platform where volunteers share practical digital knowledge with students and communities.", path: "/digital-daan/about" });
  return (
    <DDLayout>
      <header className="bg-neutral-950 text-white">
        <Container className="py-16 sm:py-24 max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-prachetas-yellow">About Digital Daan</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Learn something useful. Discover something new. Share something valuable.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            <em>Daan</em> means giving. Digital Daan is Prachetas Foundation's permanent learning platform, where people give the most useful thing they have — what they know — so students, parents, educators and communities can navigate the digital world with confidence.
          </p>
        </Container>
      </header>

      <section className="py-16 sm:py-20" aria-labelledby="dd-learner-flow">
        <Container>
          <SectionHeader id="dd-learner-flow" eyebrow="For learners" title="Simple, free and made for everyone" />
          <ol className="grid gap-5 md:grid-cols-3">
            {LEARNER_FLOW.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <li className="h-full rounded-2xl border border-neutral-200 p-6 dark:border-white/10">
                  <span className="font-mono text-sm text-neutral-400">0{i + 1}</span>
                  <s.icon className="mt-3 h-7 w-7 text-amber-600 dark:text-prachetas-yellow" aria-hidden />
                  <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                  <p className="mt-1 text-neutral-600 dark:text-neutral-400">{s.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <Link to="/digital-daan/explore" className="mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-prachetas-yellow dark:text-black">Start exploring <ArrowRight className="h-4 w-4" /></Link>
        </Container>
      </section>

      <section className="py-16 sm:py-20 bg-neutral-50 dark:bg-neutral-900/40" aria-labelledby="dd-contrib-flow">
        <Container>
          <SectionHeader id="dd-contrib-flow" eyebrow="For contributors" title="From your knowledge to someone's opportunity" description="Nothing is published automatically. Every contribution is reviewed, and you decide what appears on your public profile." />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONTRIBUTOR_FLOW.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <li className="flex h-full gap-4 rounded-2xl bg-white p-5 dark:bg-neutral-900">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800 dark:bg-prachetas-yellow/15 dark:text-prachetas-yellow"><s.icon className="h-5 w-5" aria-hidden /></span>
                  <div><h3 className="font-bold">{i + 1}. {s.title}</h3><p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">{s.text}</p></div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="dd-about-acts">
        <Container>
          <SectionHeader id="dd-about-acts" eyebrow="Five flagship activities" title="How volunteers give" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{tax?.activities.map((a, i) => <ActivityCard key={a.slug} activity={a} index={i} />)}</div>
        </Container>
      </section>

      {!!tax?.campaigns.length && (
        <section className="pb-4" aria-labelledby="dd-about-camps">
          <Container>
            <SectionHeader id="dd-about-camps" eyebrow="Campaigns" title="Campaigns and partners" description="Campaigns bring new volunteers and partners together for a period of time. Everything they create stays in the library." />
            <CampaignList />
          </Container>
        </section>
      )}
      <ContributorCTA />
    </DDLayout>
  );
};

const CampaignList = () => {
  const { data: tax } = useTaxonomy();
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tax?.campaigns.map((c) => (
        <Link key={c.slug} to={`/digital-daan/campaigns/${c.slug}`} className="group flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 p-6 transition hover:shadow-md dark:border-white/10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{c.phase === "active" ? "Live now" : c.phase === "upcoming" ? "Upcoming" : "Completed"}{c.partner ? ` · with ${c.partner}` : ""}</p>
            <p className="mt-1 text-lg font-bold">{c.name}</p>
            {c.tagline && <p className="text-sm text-neutral-600 dark:text-neutral-400">{c.tagline}</p>}
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-neutral-400 transition group-hover:translate-x-1 group-hover:text-neutral-900 dark:group-hover:text-white" aria-hidden />
        </Link>
      ))}
    </div>
  );
};

export const CampaignsIndex = () => {
  const { data: tax, isLoading } = useTaxonomy();
  useSeo({ title: "Digital Daan Campaigns | Prachetas Foundation", description: "Campaigns and partnerships that grow the Digital Daan learning library.", path: "/digital-daan/campaigns" });
  return (
    <DDLayout>
      <Container className="py-14">
        <SectionHeader eyebrow="Digital Daan" title="Campaigns" description="Campaigns bring volunteers and partners together. Everything they create stays in the permanent library." />
        {isLoading ? <div className="h-32 rounded-2xl bg-neutral-100 animate-pulse dark:bg-neutral-900" /> : tax?.campaigns.length ? <CampaignList /> : <EmptyState title="No campaigns yet" />}
      </Container>
    </DDLayout>
  );
};
