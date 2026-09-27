import { useEffect, useState } from "react";
import { ExternalLink, Eye, Loader2, Plus, Trash2, X, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { QuizQuestion, ResourceDetail } from "../api";
import { ResourceCard } from "../ui";
import { MainContent } from "../pages/ResourceDetail";
import { adminCall, useAdmin, useAdminMutation, STATUS_LABEL, STATUS_STYLE, type AdminOptions } from "./adminApi";
import { Btn, Card, Lbl, Toggle, inputCls } from "./controls";

type Res = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const EMPTY: Res = {
  title: "", slug: "", short_description: "", detailed_description: "", body: "", transcript: "", quiz: null, category_id: "", activity_id: "",
  content_type: "article", audiences: [], language: "en", duration_minutes: "", thumbnail_url: "", drive_url: "", youtube_url: "", external_url: "",
  storage_folder: "", contributor_id: "", tags: [], status: "draft", featured: false, featured_rank: 100, campaign_ids: [], collection_ids: [], review_notes: "",
};

const youtubeId = (u: string) => {
  const m = (u || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([A-Za-z0-9_-]{6,20})/);
  return m ? m[1] : null;
};
const driveId = (u: string) => (u || "").match(/\/d\/([A-Za-z0-9_-]{10,})/)?.[1] || null;

const toPreview = (r: Res, opts?: AdminOptions, contributor?: Res | null): ResourceDetail => {
  const cat = opts?.categories.find((c) => c.id === Number(r.category_id));
  const act = opts?.activities.find((a) => a.id === Number(r.activity_id));
  const pf = contributor?.public_fields || {};
  const yt = youtubeId(r.youtube_url);
  const dr = driveId(r.drive_url);
  return {
    slug: r.slug || "preview", title: r.title || "Untitled", short_description: r.short_description, content_type: r.content_type, audiences: r.audiences || [],
    language: r.language, duration_minutes: Number(r.duration_minutes) || null,
    thumbnail_url: r.thumbnail_url || (yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : dr ? `https://drive.google.com/thumbnail?id=${dr}&sz=w1200` : null),
    tags: r.tags || [], featured: r.featured, published_at: r.published_at || new Date().toISOString(), is_demo: r.is_demo,
    category: cat ? { slug: cat.slug || "", name: cat.name, color: "#F59E0B", icon: "layers" } : null,
    activity: act ? { slug: act.slug || "", name: act.name, number: act.number, color: "#F59E0B" } : null,
    contributor: contributor ? {
      slug: null, name: pf.name ? contributor.name : "Digital Daan Volunteer", photo_url: pf.photo ? contributor.photo_url : null,
      designation: pf.designation ? contributor.designation : null, expertise: null, organisation: pf.organisation ? contributor.organisation : null,
      linkedin_url: null, bio: pf.bio ? contributor.bio : null, has_profile: false, is_demo: false,
    } : null,
    detailed_description: r.detailed_description, body: r.body, quiz: r.quiz, transcript: r.transcript,
    media: { youtube_id: yt, drive_preview_url: dr ? `https://drive.google.com/file/d/${dr}/preview` : null, external_url: r.external_url || null },
    campaigns: [],
  };
};

const QuizBuilder = ({ value, onChange }: { value: QuizQuestion[] | null; onChange: (v: QuizQuestion[]) => void }) => {
  const qs = value || [];
  const update = (i: number, patch: Partial<QuizQuestion>) => onChange(qs.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  return (
    <div className="space-y-4">
      {qs.map((q, i) => (
        <div key={i} className="rounded-lg border border-neutral-200 p-4 dark:border-white/10">
          <div className="flex items-start gap-2">
            <span className="mt-2 text-xs font-bold text-neutral-400">Q{i + 1}</span>
            <textarea className={inputCls} rows={2} value={q.q} onChange={(e) => update(i, { q: e.target.value })} placeholder="Question" />
            <Btn type="button" variant="ghost" onClick={() => onChange(qs.filter((_, j) => j !== i))} aria-label="Remove question"><Trash2 className="h-4 w-4" /></Btn>
          </div>
          <div className="mt-3 space-y-2 pl-7">
            {q.options.map((o, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <input type="radio" name={`ans-${i}`} checked={q.answer === oi} onChange={() => update(i, { answer: oi })} className="accent-emerald-600" aria-label="Correct answer" />
                <input className={inputCls} value={o} onChange={(e) => update(i, { options: q.options.map((x, k) => (k === oi ? e.target.value : x)) })} placeholder={`Option ${oi + 1}`} />
                {q.options.length > 2 && <button type="button" onClick={() => update(i, { options: q.options.filter((_, k) => k !== oi), answer: q.answer >= oi && q.answer > 0 ? q.answer - 1 : q.answer })} className="text-neutral-400 hover:text-red-500" aria-label="Remove option"><X className="h-4 w-4" /></button>}
              </div>
            ))}
            {q.options.length < 6 && <button type="button" onClick={() => update(i, { options: [...q.options, ""] })} className="text-xs font-semibold text-amber-700">+ Add option</button>}
            <input className={inputCls} value={q.explain || ""} onChange={(e) => update(i, { explain: e.target.value })} placeholder="Explanation shown after answering (optional)" />
          </div>
        </div>
      ))}
      <Btn type="button" variant="secondary" onClick={() => onChange([...qs, { q: "", options: ["", ""], answer: 0, explain: "" }])}><Plus className="h-4 w-4" /> Add question</Btn>
    </div>
  );
};

const SubmissionInfo = ({ resource, contributor }: { resource: Res; contributor: Res | null }) => {
  const s = resource.submission;
  if (!s) return null;
  const pf = s.public_fields || {};
  return (
    <Card className="border-amber-300 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-500/5">
      <p className="flex items-center gap-2 text-sm font-bold"><ShieldAlert className="h-4 w-4 text-amber-600" /> Contributor submission {s.kind === "idea" && <span className="rounded bg-amber-200 px-1.5 text-[11px]">IDEA</span>}</p>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div><dt className="text-xs text-neutral-500">Submitted by</dt><dd className="font-medium">{s.profile?.name} {contributor?.email && <a href={`mailto:${contributor.email}`} className="text-amber-700 underline">{contributor.email}</a>}</dd></div>
        <div><dt className="text-xs text-neutral-500">Submitted</dt><dd>{s.submitted_at ? new Date(s.submitted_at).toLocaleString("en-IN") : "—"}</dd></div>
        {s.topic && <div><dt className="text-xs text-neutral-500">Topic</dt><dd>{s.topic}</dd></div>}
        <div><dt className="text-xs text-neutral-500">Consent</dt><dd>Share ✓ · Publish ✓ · Promote {s.consent?.promote ? "✓" : "✗ (do not promote on social channels)"}</dd></div>
        <div className="sm:col-span-2"><dt className="text-xs text-neutral-500">May be shown publicly</dt><dd>{Object.entries(pf).filter(([, v]) => v).map(([k]) => k).join(", ") || "Nothing — credit as “Digital Daan Volunteer”"}</dd></div>
        {contributor && contributor.status !== "pending" && s.profile && <div className="sm:col-span-2 text-xs text-neutral-500">This person already has a contributor profile; details submitted here were not applied automatically. Edit them in Contributors if needed.</div>}
      </dl>
    </Card>
  );
};

export const ResourceEditor = ({ id, onClose }: { id: number | "new"; onClose: () => void }) => {
  const { data: opts } = useAdmin<AdminOptions>("options");
  const [form, setForm] = useState<Res>(EMPTY);
  const [contributor, setContributor] = useState<Res | null>(null);
  const [loading, setLoading] = useState(id !== "new");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const save = useAdminMutation<{ resource: Res; contributor: Res | null }>("saveResource");
  const del = useAdminMutation("deleteResource");

  useEffect(() => {
    if (id === "new") return;
    adminCall<{ resource: Res; contributor: Res | null }>("getResource", { id })
      .then((d) => { setForm({ ...EMPTY, ...d.resource }); setContributor(d.contributor); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const bind = (k: string) => ({ value: form[k] ?? "", onChange: (e: { target: { value: string } }) => set(k, e.target.value) });
  const toggleIn = (k: string, v: string | number) => set(k, (form[k] || []).includes(v) ? form[k].filter((x: unknown) => x !== v) : [...(form[k] || []), v]);

  useEffect(() => {
    if (form.contributor_id && Number(form.contributor_id) !== contributor?.id) {
      adminCall<{ contributor: Res }>("getContributor", { id: form.contributor_id }).then((d) => setContributor(d.contributor)).catch(() => {});
    }
  }, [form.contributor_id]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (status?: string) => {
    setError(null);
    try {
      const payload = { ...form, ...(status ? { status } : {}), tags: Array.isArray(form.tags) ? form.tags : String(form.tags).split(",") };
      const res = await save.mutateAsync(payload);
      setForm({ ...EMPTY, ...res.resource });
      if (status || id === "new") onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    }
  };

  if (loading) return <div className="grid place-items-center py-24"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  const isVideo = ["video", "reel", "session"].includes(form.content_type);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">{id === "new" ? "New resource" : "Edit resource"}</h2>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[form.status]}`}>{STATUS_LABEL[form.status]}</span>
          {form.is_demo && <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-bold uppercase text-white">Sample</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn variant="secondary" onClick={() => setPreview(true)}><Eye className="h-4 w-4" /> Preview</Btn>
          {form.status === "published" && form.slug && <a href={`/digital-daan/resources/${form.slug}`} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-300 px-3.5 text-sm font-semibold dark:border-white/15"><ExternalLink className="h-4 w-4" /> View live</a>}
          <Btn variant="ghost" onClick={onClose}>Close</Btn>
        </div>
      </div>

      {form.submission && <SubmissionInfo resource={form} contributor={contributor} />}

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <Card className="space-y-4">
            <Lbl label="Title *"><input className={inputCls} {...bind("title")} maxLength={200} /></Lbl>
            <Lbl label="URL slug" hint={`/digital-daan/resources/${form.slug || "auto-generated-from-title"}`}><input className={inputCls} {...bind("slug")} /></Lbl>
            <Lbl label="Short description (card & SEO) *"><textarea className={inputCls} rows={2} maxLength={400} {...bind("short_description")} /></Lbl>
            <Lbl label="Detailed description"><textarea className={inputCls} rows={4} {...bind("detailed_description")} /></Lbl>
            <Lbl label={isVideo ? "Key points (shown below the video)" : "Article / guide body"} hint="Formatting: ## Heading, ### Sub-heading, - bullet, 1. numbered, > quote, **bold**, [link](https://…)">
              <textarea className={`${inputCls} font-mono text-[13px]`} rows={14} {...bind("body")} />
            </Lbl>
            {isVideo && <Lbl label="Transcript / captions text" hint="Improves accessibility and search."><textarea className={inputCls} rows={4} {...bind("transcript")} /></Lbl>}
          </Card>

          {form.content_type === "quiz" && (
            <Card><p className="mb-3 text-sm font-bold">Quiz questions</p><QuizBuilder value={form.quiz} onChange={(v) => set("quiz", v)} /></Card>
          )}

          <Card className="space-y-4">
            <p className="text-sm font-bold">Content source</p>
            <p className="text-xs text-neutral-500">Drive files must be shared as “Anyone with the link can view”, otherwise learners will see an access error. Only the individual file is ever shown publicly.</p>
            <Lbl label="Google Drive file URL"><input className={inputCls} {...bind("drive_url")} placeholder="https://drive.google.com/file/d/…/view" /></Lbl>
            <Lbl label="YouTube URL"><input className={inputCls} {...bind("youtube_url")} placeholder="https://youtu.be/…" /></Lbl>
            <Lbl label="External URL"><input className={inputCls} {...bind("external_url")} placeholder="https://…" /></Lbl>
            <Lbl label="Thumbnail image URL" hint="Optional. YouTube and Drive thumbnails are used automatically; otherwise a designed cover is shown."><input className={inputCls} {...bind("thumbnail_url")} /></Lbl>
            <Lbl label="Storage folder (internal only)">
              <select className={inputCls} {...bind("storage_folder")}>
                <option value="">—</option>
                {opts?.storage.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </Lbl>
            {form.storage_folder && opts?.storage.find((s) => s.key === form.storage_folder)?.drive_url && (
              <a className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700" href={opts.storage.find((s) => s.key === form.storage_folder)!.drive_url!} target="_blank" rel="noreferrer">Open this Drive folder <ExternalLink className="h-3 w-3" /></a>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="space-y-4">
            <Lbl label="Status">
              <select className={inputCls} {...bind("status")}>
                {opts?.statuses.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </Lbl>
            <Toggle checked={!!form.featured} onChange={(v) => set("featured", v)} label="Featured on Digital Daan" />
            {form.featured && <Lbl label="Featured order" hint="Lower numbers appear first. 1 = the large featured spot."><input type="number" className={inputCls} {...bind("featured_rank")} /></Lbl>}
            <Lbl label="Review notes (internal)"><textarea className={inputCls} rows={2} {...bind("review_notes")} /></Lbl>
          </Card>
          <Card className="space-y-4">
            <Lbl label="Category (what to learn) *">
              <select className={inputCls} {...bind("category_id")}><option value="">—</option>{opts?.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            </Lbl>
            <Lbl label="Digital Daan activity (how it was made)">
              <select className={inputCls} {...bind("activity_id")}><option value="">—</option>{opts?.activities.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
            </Lbl>
            <div className="grid grid-cols-2 gap-3">
              <Lbl label="Format"><select className={inputCls} {...bind("content_type")}>{opts?.formats.map((f) => <option key={f.slug} value={f.slug}>{f.label}</option>)}</select></Lbl>
              <Lbl label="Language"><select className={inputCls} {...bind("language")}>{opts?.languages.map((l) => <option key={l.slug} value={l.slug}>{l.label}</option>)}</select></Lbl>
            </div>
            <Lbl label="Duration (minutes)"><input type="number" min={0} className={inputCls} {...bind("duration_minutes")} /></Lbl>
            <div>
              <p className="mb-1 text-xs font-semibold text-neutral-600 dark:text-neutral-400">Audience</p>
              <div className="flex flex-wrap gap-1.5">
                {opts?.audiences.map((a) => (
                  <button key={a.slug} type="button" onClick={() => toggleIn("audiences", a.slug)} className={`rounded-full px-2.5 py-1 text-xs font-medium ${form.audiences?.includes(a.slug) ? "bg-neutral-900 text-white dark:bg-prachetas-yellow dark:text-black" : "border border-neutral-300 dark:border-white/15"}`}>{a.label}</button>
                ))}
              </div>
            </div>
            <Lbl label="Tags" hint="Comma separated"><input className={inputCls} value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags} onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} /></Lbl>
          </Card>
          <Card className="space-y-4">
            <Lbl label="Contributor">
              <select className={inputCls} {...bind("contributor_id")}><option value="">—</option>{opts?.contributors.map((c) => <option key={c.id} value={c.id}>{c.name}{c.email ? ` (${c.email})` : ""}</option>)}</select>
            </Lbl>
            <div>
              <p className="mb-1 text-xs font-semibold text-neutral-600 dark:text-neutral-400">Campaigns</p>
              {opts?.campaigns.map((c) => <div key={c.id}><Toggle checked={form.campaign_ids?.includes(c.id)} onChange={() => toggleIn("campaign_ids", c.id)} label={c.short_name || c.name} /></div>)}
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-neutral-600 dark:text-neutral-400">Collections</p>
              {opts?.collections.map((c) => <div key={c.id}><Toggle checked={form.collection_ids?.includes(c.id)} onChange={() => toggleIn("collection_ids", c.id)} label={c.name} /></div>)}
            </div>
          </Card>
        </div>
      </div>

      {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</p>}

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-end gap-2 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-neutral-950/95">
        {id !== "new" && form.status !== "published" && (
          <Btn variant="ghost" className="mr-auto text-red-600" onClick={async () => { if (confirm("Delete this resource permanently? This cannot be undone.")) { await del.mutateAsync({ id }); onClose(); } }}><Trash2 className="h-4 w-4" /> Delete</Btn>
        )}
        {form.status === "under_review" && <Btn variant="secondary" onClick={() => submit("rejected")}>Reject</Btn>}
        <Btn variant="secondary" disabled={save.isPending} onClick={() => submit()}>{save.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save</Btn>
        {form.status === "published" ? (
          <Btn variant="secondary" onClick={() => submit("draft")}>Unpublish</Btn>
        ) : (
          <Btn variant="success" disabled={save.isPending} onClick={() => submit("published")}>Approve & publish</Btn>
        )}
        {form.status === "published" && <Btn variant="secondary" onClick={() => submit("archived")}>Archive</Btn>}
      </div>

      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogTitle>Preview</DialogTitle>
          <div className="grid gap-8 md:grid-cols-[300px_1fr]">
            <div><p className="mb-2 text-xs font-semibold text-neutral-500">Card</p><ResourceCard resource={toPreview(form, opts, contributor)} /></div>
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold text-neutral-500">Page content</p>
              <h1 className="mb-2 text-3xl font-bold">{form.title || "Untitled"}</h1>
              <p className="mb-6 text-neutral-600">{form.short_description}</p>
              <MainContent r={toPreview(form, opts, contributor)} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
