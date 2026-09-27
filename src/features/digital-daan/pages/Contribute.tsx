import { FormEvent, ReactNode, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, Lightbulb, Upload, ShieldCheck } from "lucide-react";
import { request, useTaxonomy } from "../api";
import { Container, DDLayout } from "../ui";
import { useSeo } from "../seo";

const input = "w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base sm:text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 dark:border-white/15 dark:bg-neutral-900";

const Field = ({ label, hint, required, children, htmlFor }: { label: string; hint?: string; required?: boolean; children: ReactNode; htmlFor: string }) => (
  <div>
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
      {label} {required ? <span className="text-red-500" aria-hidden>*</span> : <span className="font-normal text-neutral-400">(optional)</span>}
    </label>
    {children}
    {hint && <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>}
  </div>
);

const Section = ({ n, title, description, children }: { n: number; title: string; description?: string; children: ReactNode }) => (
  <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-neutral-900/60" aria-labelledby={`sec-${n}`}>
    <div className="mb-6 flex items-start gap-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-900 text-sm font-bold text-white dark:bg-prachetas-yellow dark:text-black">{n}</span>
      <div>
        <h2 id={`sec-${n}`} className="text-xl font-bold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>}
      </div>
    </div>
    <div className="grid gap-5 sm:grid-cols-2">{children}</div>
  </section>
);

const Check = ({ checked, onChange, children, required }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; required?: boolean }) => (
  <label className="flex cursor-pointer items-start gap-3 rounded-xl p-2 -m-2 hover:bg-neutral-50 dark:hover:bg-white/5">
    <input type="checkbox" checked={checked} required={required} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 rounded accent-amber-500" />
    <span className="text-sm leading-relaxed">{children}</span>
  </label>
);

const PUBLIC_FIELDS = [
  ["name", "Name"], ["photo", "Profile photo"], ["designation", "Designation & expertise"], ["organisation", "Organisation"], ["linkedin", "LinkedIn"], ["bio", "Short biography"],
] as const;

const initial = {
  name: "", email: "", organisation: "", designation: "", expertise: "", linkedin_url: "", photo_url: "", bio: "",
  activity: "", category: "", topic: "", content_type: "", title: "", short_description: "", detailed_description: "",
  language: "en", audiences: [] as string[], duration_minutes: "", tags: "",
  drive_url: "", youtube_url: "", external_url: "", website: "",
};

const Contribute = () => {
  const [params, setParams] = useSearchParams();
  const isIdea = params.get("type") === "idea";
  const { data: tax } = useTaxonomy();
  const [form, setForm] = useState(initial);
  const [publicFields, setPublicFields] = useState<Record<string, boolean>>({ name: true, photo: true, designation: true, organisation: true, linkedin: true, bio: true });
  const [consent, setConsent] = useState({ permission: false, publish: false, promote: false });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  useSeo({ title: "Become a Contributor | Digital Daan — Prachetas Foundation", description: "Share a skill, a guide, a video or your career experience with students and communities through Prachetas Digital Daan.", path: "/digital-daan/contribute" });

  const set = (k: keyof typeof initial) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggleAudience = (slug: string) => setForm((f) => ({ ...f, audiences: f.audiences.includes(slug) ? f.audiences.filter((a) => a !== slug) : [...f.audiences, slug] }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isIdea && !form.drive_url && !form.youtube_url && !form.external_url) return setError("Please add at least one link to your content (Google Drive, YouTube or another link).");
    setStatus("sending");
    try {
      await request("dd-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: isIdea ? "idea" : "content",
          website: form.website,
          contributor: { name: form.name, email: form.email, organisation: form.organisation, designation: form.designation, expertise: form.expertise, linkedin_url: form.linkedin_url, photo_url: form.photo_url, bio: form.bio },
          public_fields: publicFields,
          contribution: {
            activity: form.activity, category: form.category, topic: form.topic, content_type: form.content_type || (isIdea ? "resource" : ""), title: form.title,
            short_description: form.short_description, detailed_description: form.detailed_description, language: form.language, audiences: form.audiences,
            duration_minutes: form.duration_minutes, tags: form.tags,
          },
          source: { drive_url: form.drive_url, youtube_url: form.youtube_url, external_url: form.external_url },
          consent,
        }),
      });
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "done") {
    return (
      <DDLayout>
        <Container className="py-20 max-w-2xl text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" aria-hidden />
          <h1 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight">Thank you for your Digital Daan!</h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">Your {isIdea ? "idea" : "contribution"} has been received and is now <strong>under review</strong>.</p>
          <ol className="mx-auto mt-10 max-w-md space-y-4 text-left">
            {["Our team reviews your submission — usually within a few days.", "If approved, it's published in the Digital Daan library and credited to you (showing only the details you allowed).", "Selected contributions may also be featured on Prachetas' digital channels."].map((t, i) => (
              <li key={i} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">{i + 1}</span><span className="pt-0.5 text-neutral-700 dark:text-neutral-300">{t}</span></li>
            ))}
          </ol>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/digital-daan/explore" className="rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white dark:bg-prachetas-yellow dark:text-black">Explore the library</Link>
            <button onClick={() => { setForm((f) => ({ ...initial, name: f.name, email: f.email, organisation: f.organisation, designation: f.designation, linkedin_url: f.linkedin_url, photo_url: f.photo_url, bio: f.bio, expertise: f.expertise })); setConsent({ permission: false, publish: false, promote: false }); setStatus("idle"); }} className="rounded-full border border-neutral-300 px-6 py-3 font-semibold dark:border-white/15">Submit another</button>
          </div>
        </Container>
      </DDLayout>
    );
  }

  return (
    <DDLayout>
      <header className="bg-neutral-950 text-white">
        <Container className="py-14 sm:py-20 max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-prachetas-yellow">{isIdea ? "Share an idea" : "Become a contributor"}</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">{isIdea ? "Have an idea worth sharing?" : "Give a skill. Create an opportunity."}</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            {isIdea ? "Tell us about a session, video or guide you'd like to create — we'll help you shape it." : "Teach it, create it, explain it or mentor someone with it. Every contribution is reviewed before it's published, and you choose what appears on your public profile."}
          </p>
          <div className="mt-8 inline-flex rounded-full border border-white/15 p-1 text-sm" role="tablist" aria-label="Submission type">
            <button role="tab" aria-selected={!isIdea} onClick={() => setParams({})} className={`rounded-full px-4 py-2 font-semibold transition ${!isIdea ? "bg-white text-black" : "text-white/70 hover:text-white"}`}><Upload className="mr-1.5 inline h-4 w-4" />Submit content</button>
            <button role="tab" aria-selected={isIdea} onClick={() => setParams({ type: "idea" })} className={`rounded-full px-4 py-2 font-semibold transition ${isIdea ? "bg-white text-black" : "text-white/70 hover:text-white"}`}><Lightbulb className="mr-1.5 inline h-4 w-4" />Share an idea</button>
          </div>
        </Container>
      </header>

      <Container className="py-12 max-w-4xl">
        <form onSubmit={submit} className="space-y-6" noValidate={false}>
          <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-0 w-0 opacity-0" />

          <Section n={1} title="About you" description="Your email is never shown publicly. It's used only to contact you about your contribution.">
            <Field label="Full name" required htmlFor="f-name"><input id="f-name" required className={input} value={form.name} onChange={set("name")} autoComplete="name" /></Field>
            <Field label="Email" required htmlFor="f-email"><input id="f-email" type="email" required className={input} value={form.email} onChange={set("email")} autoComplete="email" /></Field>
            <Field label="Organisation / company" htmlFor="f-org"><input id="f-org" className={input} value={form.organisation} onChange={set("organisation")} autoComplete="organization" /></Field>
            <Field label="Designation" htmlFor="f-des"><input id="f-des" className={input} value={form.designation} onChange={set("designation")} autoComplete="organization-title" /></Field>
            <Field label="Area of expertise" htmlFor="f-exp"><input id="f-exp" className={input} value={form.expertise} onChange={set("expertise")} placeholder="e.g. Cloud security, career coaching" /></Field>
            <Field label="LinkedIn profile" htmlFor="f-li"><input id="f-li" type="url" className={input} value={form.linkedin_url} onChange={set("linkedin_url")} placeholder="https://www.linkedin.com/in/…" /></Field>
            <div className="sm:col-span-2"><Field label="Profile photo link" htmlFor="f-photo" hint="A public https:// link to a square photo (for example, a Google Drive image shared with “Anyone with the link”)."><input id="f-photo" type="url" className={input} value={form.photo_url} onChange={set("photo_url")} placeholder="https://…" /></Field></div>
            <div className="sm:col-span-2"><Field label="Short bio" htmlFor="f-bio" hint="2–3 sentences about you and why you're sharing."><textarea id="f-bio" rows={3} maxLength={1200} className={input} value={form.bio} onChange={set("bio")} /></Field></div>
          </Section>

          <Section n={2} title={isIdea ? "Your idea" : "Your contribution"}>
            <Field label="Digital Daan activity" required htmlFor="f-act">
              <select id="f-act" required className={input} value={form.activity} onChange={set("activity")}>
                <option value="">Choose an activity</option>
                {tax?.activities.map((a) => <option key={a.slug} value={a.slug}>{a.name} — {a.tagline}</option>)}
              </select>
            </Field>
            <Field label="Topic category" required htmlFor="f-cat">
              <select id="f-cat" required className={input} value={form.category} onChange={set("category")}>
                <option value="">Choose a category</option>
                {tax?.categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Specific topic" htmlFor="f-topic"><input id="f-topic" className={input} value={form.topic} onChange={set("topic")} placeholder="e.g. UPI safety for senior citizens" /></Field>
            {!isIdea && (
              <Field label="Content type" required htmlFor="f-type">
                <select id="f-type" required className={input} value={form.content_type} onChange={set("content_type")}>
                  <option value="">Choose a format</option>
                  {tax?.formats.map((f) => <option key={f.slug} value={f.slug}>{f.label}</option>)}
                </select>
              </Field>
            )}
            <div className="sm:col-span-2"><Field label="Title" required htmlFor="f-title" hint="Clear and learner-focused, e.g. “How to Spot a Fake Job Offer”."><input id="f-title" required maxLength={200} className={input} value={form.title} onChange={set("title")} /></Field></div>
            <div className="sm:col-span-2"><Field label="Short description" required htmlFor="f-short" hint="One or two sentences shown on the resource card."><textarea id="f-short" required rows={2} maxLength={400} className={input} value={form.short_description} onChange={set("short_description")} /></Field></div>
            <div className="sm:col-span-2"><Field label="Detailed description" htmlFor="f-long" hint="What will learners get from it? Any key points?"><textarea id="f-long" rows={5} maxLength={5000} className={input} value={form.detailed_description} onChange={set("detailed_description")} /></Field></div>
            <Field label="Language" required htmlFor="f-lang">
              <select id="f-lang" required className={input} value={form.language} onChange={set("language")}>
                {tax?.languages.map((l) => <option key={l.slug} value={l.slug}>{l.label}{l.native && l.native !== l.label ? ` · ${l.native}` : ""}</option>)}
              </select>
            </Field>
            <Field label="Estimated duration (minutes)" htmlFor="f-dur"><input id="f-dur" type="number" min={0} max={600} inputMode="numeric" className={input} value={form.duration_minutes} onChange={set("duration_minutes")} /></Field>
            <fieldset className="sm:col-span-2">
              <legend className="mb-2 text-sm font-semibold">Intended audience <span className="font-normal text-neutral-400">(choose any)</span></legend>
              <div className="flex flex-wrap gap-2">
                {tax?.audiences.map((a) => {
                  const on = form.audiences.includes(a.slug);
                  return (
                    <button type="button" key={a.slug} onClick={() => toggleAudience(a.slug)} aria-pressed={on} className={`rounded-full px-4 py-2 text-sm font-medium transition ${on ? "bg-neutral-900 text-white dark:bg-prachetas-yellow dark:text-black" : "border border-neutral-300 hover:border-neutral-500 dark:border-white/15"}`}>
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div className="sm:col-span-2"><Field label="Keywords / tags" htmlFor="f-tags" hint="Comma separated, e.g. upi, scams, payments"><input id="f-tags" className={input} value={form.tags} onChange={set("tags")} /></Field></div>
          </Section>

          <Section n={3} title="Content source" description={isIdea ? "Optional — share anything that helps us understand your idea." : "Add at least one link. For Google Drive, set sharing to “Anyone with the link can view”."}>
            <div className="sm:col-span-2"><Field label="Google Drive link" htmlFor="f-drive"><input id="f-drive" type="url" className={input} value={form.drive_url} onChange={set("drive_url")} placeholder="https://drive.google.com/file/d/…" /></Field></div>
            <Field label="YouTube link" htmlFor="f-yt"><input id="f-yt" type="url" className={input} value={form.youtube_url} onChange={set("youtube_url")} placeholder="https://youtu.be/…" /></Field>
            <Field label="Other link" htmlFor="f-ext"><input id="f-ext" type="url" className={input} value={form.external_url} onChange={set("external_url")} placeholder="https://…" /></Field>
          </Section>

          <Section n={4} title="Permissions" description="You're always in control of what's shown publicly.">
            <fieldset className="sm:col-span-2">
              <legend className="mb-3 text-sm font-semibold">Publicly display my:</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {PUBLIC_FIELDS.map(([k, label]) => (
                  <Check key={k} checked={!!publicFields[k]} onChange={(v) => setPublicFields((p) => ({ ...p, [k]: v }))}>{label}</Check>
                ))}
              </div>
              {!publicFields.name && <p className="mt-3 text-xs text-neutral-500">Your contribution will be credited to “Digital Daan Volunteer”, and no public profile will be created.</p>}
            </fieldset>
            <div className="sm:col-span-2 space-y-4 border-t border-neutral-200 pt-5 dark:border-white/10">
              <Check required checked={consent.permission} onChange={(v) => setConsent((c) => ({ ...c, permission: v }))}>I confirm that I have permission to share this content with Prachetas Foundation. <span className="text-red-500" aria-hidden>*</span></Check>
              <Check required checked={consent.publish} onChange={(v) => setConsent((c) => ({ ...c, publish: v }))}>I agree that Prachetas Foundation may publish this contribution on the Digital Daan platform. <span className="text-red-500" aria-hidden>*</span></Check>
              <Check checked={consent.promote} onChange={(v) => setConsent((c) => ({ ...c, promote: v }))}>I understand that selected content may be promoted through Prachetas digital channels (YouTube, Instagram, LinkedIn).</Check>
            </div>
          </Section>

          {error && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">{error}</p>}

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="flex items-center gap-2 text-sm text-neutral-500"><ShieldCheck className="h-4 w-4" aria-hidden /> Reviewed by the Prachetas team before publishing.</p>
            <button type="submit" disabled={status === "sending"} className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-10 text-base font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-60 sm:w-auto dark:bg-prachetas-yellow dark:text-black dark:hover:bg-yellow-300">
              {status === "sending" && <Loader2 className="h-5 w-5 animate-spin" />} {isIdea ? "Share my idea" : "Submit for review"}
            </button>
          </div>
        </form>
      </Container>
    </DDLayout>
  );
};

export default Contribute;
