import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, LogOut, Plus, Search, Star, Lock, ExternalLink } from "lucide-react";
import { useSeo } from "../seo";
import { login, getToken, setToken, useAdmin, useAdminMutation, STATUS_LABEL, STATUS_STYLE, type AdminResourceRow, type AdminOptions } from "./adminApi";
import { Btn, Card, Lbl, Toggle, inputCls } from "./controls";
import { ResourceEditor } from "./ResourceEditor";

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const TABS = [
  ["overview", "Overview"], ["review", "Review queue"], ["resources", "Resources"], ["contributors", "Contributors"], ["campaigns", "Campaigns"],
  ["collections", "Collections"], ["categories", "Categories"], ["metrics", "Impact metrics"], ["storage", "Drive folders"],
] as const;
type Tab = (typeof TABS)[number][0];

const Login = ({ onDone }: { onDone: () => void }) => {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try { await login(pw); onDone(); } catch (x) { setErr(x instanceof Error ? x.message : "Sign in failed"); } finally { setBusy(false); }
  };
  return (
    <div className="grid min-h-screen place-items-center bg-neutral-950 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl dark:bg-neutral-900">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-prachetas-yellow font-bold text-black">DD</span><div><p className="font-bold">Digital Daan</p><p className="text-xs text-neutral-500">Admin console</p></div></div>
        <Lbl label="Admin password" className="mt-8"><input type="password" autoFocus autoComplete="current-password" className={inputCls} value={pw} onChange={(e) => setPw(e.target.value)} /></Lbl>
        {err && <p role="alert" className="mt-3 text-sm text-red-600">{err}</p>}
        <Btn type="submit" className="mt-6 w-full h-11" disabled={busy || !pw}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Sign in</Btn>
        <Link to="/digital-daan" className="mt-4 block text-center text-xs text-neutral-500 hover:underline">Back to Digital Daan</Link>
      </form>
    </div>
  );
};

const Overview = ({ go, openResource }: { go: (t: Tab) => void; openResource: (id: number) => void }) => {
  const { data, isLoading } = useAdmin<Row>("overview");
  const removeDemo = useAdminMutation("removeDemo");
  if (isLoading || !data) return <Loader2 className="h-5 w-5 animate-spin" />;
  const c = data.counts || {};
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-5">
        {["under_review", "published", "draft", "archived", "rejected"].map((s) => (
          <button key={s} onClick={() => go(s === "under_review" ? "review" : "resources")} className="rounded-xl border border-neutral-200 bg-white p-4 text-left hover:shadow-md dark:border-white/10 dark:bg-neutral-900">
            <p className="text-xs text-neutral-500">{STATUS_LABEL[s]}</p><p className="mt-1 text-3xl font-bold">{c[s] || 0}</p>
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <p className="font-bold">Waiting for review</p>
          {data.recentSubmissions.length ? (
            <ul className="mt-3 divide-y divide-neutral-100 dark:divide-white/5">
              {data.recentSubmissions.map((r: Row) => (
                <li key={r.id}><button onClick={() => openResource(r.id)} className="flex w-full justify-between gap-3 py-2.5 text-left text-sm hover:text-amber-700"><span className="font-medium">{r.title}</span><span className="shrink-0 text-xs text-neutral-500">{r.contributor_name}</span></button></li>
              ))}
            </ul>
          ) : <p className="mt-3 text-sm text-neutral-500">Nothing waiting. 🎉</p>}
        </Card>
        <Card>
          <p className="font-bold">Last 30 days</p>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            {[["views", "Views"], ["video_opens", "Video plays"], ["shares", "Shares"], ["searches", "Searches"]].map(([k, l]) => (
              <div key={k}><p className="text-2xl font-bold">{data.activity?.[k] || 0}</p><p className="text-[11px] text-neutral-500">{l}</p></div>
            ))}
          </div>
          {!!data.topSearches.length && <p className="mt-4 text-xs text-neutral-500">Top searches: {data.topSearches.map((t: Row) => `${t.term} (${t.n})`).join(", ")}</p>}
          {!!data.topResources.length && <p className="mt-2 text-xs text-neutral-500">Most viewed: {data.topResources.slice(0, 3).map((t: Row) => `${t.title} (${t.view_count})`).join(" · ")}</p>}
        </Card>
      </div>
      {data.demoCount > 0 && (
        <Card className="flex flex-wrap items-center justify-between gap-4 border-dashed">
          <div><p className="font-bold">Sample content: {data.demoCount} resources</p><p className="text-sm text-neutral-500">Remove the demo resources and demo contributors once real contributions are published. Campaigns, categories and collections are kept.</p></div>
          <Btn variant="danger" disabled={removeDemo.isPending} onClick={() => confirm("Remove all sample resources and sample contributors? This cannot be undone.") && removeDemo.mutate({})}>Remove sample content</Btn>
        </Card>
      )}
    </div>
  );
};

const ResourceList = ({ status, openResource }: { status?: string; openResource: (id: number | "new") => void }) => {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState(status || "");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdmin<{ items: AdminResourceRow[]; total: number; hasMore: boolean }>("listResources", { status: filter, q, page });
  const setStatus = useAdminMutation("setStatus");
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input className={`${inputCls} pl-9`} placeholder="Search title, contributor or email" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} /></div>
        {!status && (
          <select className={`${inputCls} w-auto`} value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
            <option value="">All statuses</option>{Object.entries(STATUS_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        )}
        <Btn onClick={() => openResource("new")}><Plus className="h-4 w-4" /> New resource</Btn>
      </div>
      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500 dark:bg-white/5">
            <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 hidden md:table-cell">Category</th><th className="px-4 py-3 hidden md:table-cell">Contributor</th><th className="px-4 py-3 hidden lg:table-cell">Updated</th><th className="px-4 py-3" /></tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
            {isLoading ? <tr><td className="px-4 py-6" colSpan={6}><Loader2 className="h-4 w-4 animate-spin" /></td></tr> : data?.items.length ? data.items.map((r) => (
              <tr key={r.id} className="hover:bg-neutral-50 dark:hover:bg-white/5">
                <td className="px-4 py-3">
                  <button onClick={() => openResource(r.id)} className="text-left font-medium hover:text-amber-700">{r.title}</button>
                  <div className="mt-0.5 flex gap-1.5 text-[11px] text-neutral-500">{r.featured && <span className="inline-flex items-center gap-0.5 text-amber-600"><Star className="h-3 w-3 fill-current" />Featured</span>}{r.is_demo && <span>Sample</span>}{r.submission_kind === "idea" && <span className="font-semibold text-amber-700">Idea</span>}<span>{r.content_type} · {r.language}</span></div>
                </td>
                <td className="px-4 py-3"><span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</span></td>
                <td className="px-4 py-3 hidden md:table-cell text-neutral-600 dark:text-neutral-400">{r.category_name || "—"}</td>
                <td className="px-4 py-3 hidden md:table-cell text-neutral-600 dark:text-neutral-400">{r.contributor_name || "—"}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-neutral-500">{new Date(r.updated_at).toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  {r.status === "under_review" && <Btn variant="success" className="h-8 mr-1" onClick={() => setStatus.mutate({ id: r.id, status: "published" })}>Publish</Btn>}
                  <Btn variant="secondary" className="h-8" onClick={() => openResource(r.id)}>{r.status === "under_review" ? "Review" : "Edit"}</Btn>
                </td>
              </tr>
            )) : <tr><td className="px-4 py-10 text-center text-neutral-500" colSpan={6}>{status === "under_review" ? "No submissions waiting for review." : "No resources found."}</td></tr>}
          </tbody>
        </table>
      </div>
      {setStatus.error && <p className="text-sm text-red-600">{(setStatus.error as Error).message}</p>}
      {(page > 1 || data?.hasMore) && (
        <div className="flex items-center justify-between text-sm"><Btn variant="secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Btn><span className="text-neutral-500">Page {page} · {data?.total} total</span><Btn variant="secondary" disabled={!data?.hasMore} onClick={() => setPage(page + 1)}>Next</Btn></div>
      )}
    </div>
  );
};

// Generic list + inline editor used for contributors, campaigns, collections and categories.
function EntityTab<T extends Row>({ listAction, saveAction, empty, columns, Editor, title }: {
  listAction: string; saveAction: string; empty: T; title: string;
  columns: { label: string; render: (r: T) => React.ReactNode }[];
  Editor: (p: { value: T; set: (k: string, v: unknown) => void }) => JSX.Element;
}) {
  const { data, isLoading } = useAdmin<{ items: T[] }>(listAction);
  const save = useAdminMutation(saveAction);
  const [editing, setEditing] = useState<T | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const submit = async () => {
    setErr(null);
    try { await save.mutateAsync(editing as Row); setEditing(null); } catch (e) { setErr(e instanceof Error ? e.message : "Could not save"); }
  };
  if (editing) {
    return (
      <Card className="space-y-4">
        <p className="text-lg font-bold">{editing.id ? `Edit ${title}` : `New ${title}`}</p>
        <Editor value={editing} set={(k, v) => setEditing((e) => ({ ...(e as T), [k]: v }))} />
        {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
        <div className="flex justify-end gap-2"><Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn><Btn disabled={save.isPending} onClick={submit}>{save.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save</Btn></div>
      </Card>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Btn onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4" /> New {title}</Btn></div>
      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500 dark:bg-white/5"><tr>{columns.map((c) => <th key={c.label} className="px-4 py-3">{c.label}</th>)}<th /></tr></thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
            {isLoading ? <tr><td className="px-4 py-6"><Loader2 className="h-4 w-4 animate-spin" /></td></tr> : data?.items.map((r) => (
              <tr key={r.id || r.key} className="hover:bg-neutral-50 dark:hover:bg-white/5">
                {columns.map((c) => <td key={c.label} className="px-4 py-3">{c.render(r)}</td>)}
                <td className="px-4 py-3 text-right"><Btn variant="secondary" className="h-8" onClick={() => setEditing(r)}>Edit</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const bindTo = (value: Row, set: (k: string, v: unknown) => void) => (k: string) => ({ value: value[k] ?? "", onChange: (e: { target: { value: string } }) => set(k, e.target.value) });

const PF = [["name", "Name"], ["photo", "Photo"], ["designation", "Designation & expertise"], ["organisation", "Organisation"], ["linkedin", "LinkedIn"], ["bio", "Bio"]];

const ContributorEditor = ({ value, set }: { value: Row; set: (k: string, v: unknown) => void }) => {
  const b = bindTo(value, set);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Lbl label="Name *"><input className={inputCls} {...b("name")} /></Lbl>
      <Lbl label="Email (private)"><input className={inputCls} {...b("email")} /></Lbl>
      <Lbl label="Designation"><input className={inputCls} {...b("designation")} /></Lbl>
      <Lbl label="Organisation"><input className={inputCls} {...b("organisation")} /></Lbl>
      <Lbl label="Expertise"><input className={inputCls} {...b("expertise")} /></Lbl>
      <Lbl label="LinkedIn URL"><input className={inputCls} {...b("linkedin_url")} /></Lbl>
      <Lbl label="Photo URL" className="sm:col-span-2"><input className={inputCls} {...b("photo_url")} /></Lbl>
      <Lbl label="Bio" className="sm:col-span-2"><textarea rows={3} className={inputCls} {...b("bio")} /></Lbl>
      <Lbl label="Profile URL slug"><input className={inputCls} {...b("slug")} /></Lbl>
      <Lbl label="Status" hint="Only approved contributors with a public name get a profile page."><select className={inputCls} {...b("status")}><option value="approved">Approved</option><option value="pending">Pending</option><option value="hidden">Hidden</option></select></Lbl>
      <div className="sm:col-span-2 rounded-lg bg-neutral-50 p-4 dark:bg-white/5">
        <p className="mb-2 text-xs font-semibold">Publicly displayed (only change with the contributor's permission)</p>
        <div className="grid gap-2 sm:grid-cols-3">{PF.map(([k, l]) => <Toggle key={k} label={l} checked={!!value.public_fields?.[k]} onChange={(v) => set("public_fields", { ...(value.public_fields || {}), [k]: v })} />)}</div>
      </div>
    </div>
  );
};

const CampaignEditor = ({ value, set }: { value: Row; set: (k: string, v: unknown) => void }) => {
  const b = bindTo(value, set);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Lbl label="Full name *" className="sm:col-span-2"><input className={inputCls} {...b("name")} placeholder="Prachetas × Partner — Digital Daan | Month Year" /></Lbl>
      <Lbl label="Short name" hint="e.g. October 2026"><input className={inputCls} {...b("short_name")} /></Lbl>
      <Lbl label="URL slug" hint={`/digital-daan/campaigns/${value.slug || "…"}`}><input className={inputCls} {...b("slug")} /></Lbl>
      <Lbl label="Partner"><input className={inputCls} {...b("partner")} /></Lbl>
      <Lbl label="Tagline"><input className={inputCls} {...b("tagline")} /></Lbl>
      <Lbl label="Start date"><input type="date" className={inputCls} {...b("start_date")} /></Lbl>
      <Lbl label="End date"><input type="date" className={inputCls} {...b("end_date")} /></Lbl>
      <Lbl label="Description" className="sm:col-span-2"><textarea rows={4} className={inputCls} {...b("description")} /></Lbl>
      <Lbl label="Hero image URL" className="sm:col-span-2"><input className={inputCls} {...b("hero_image_url")} /></Lbl>
      <Lbl label="Visibility"><select className={inputCls} {...b("status")}><option value="draft">Draft (hidden)</option><option value="published">Published</option></select></Lbl>
      <div className="self-end pb-2"><Toggle label="Feature on Digital Daan home" checked={!!value.featured} onChange={(v) => set("featured", v)} /></div>
    </div>
  );
};

const CollectionEditor = ({ value, set }: { value: Row; set: (k: string, v: unknown) => void }) => {
  const b = bindTo(value, set);
  const { data } = useAdmin<{ items: AdminResourceRow[] }>("listResources", { status: "published" });
  const ids: number[] = value.resource_ids || [];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Lbl label="Name *"><input className={inputCls} {...b("name")} /></Lbl>
      <Lbl label="Order"><input type="number" className={inputCls} {...b("sort_order")} /></Lbl>
      <Lbl label="Description" className="sm:col-span-2"><input className={inputCls} {...b("description")} /></Lbl>
      <div className="sm:col-span-2"><Toggle label="Active" checked={value.is_active !== false} onChange={(v) => set("is_active", v)} /></div>
      <div className="sm:col-span-2">
        <p className="mb-2 text-xs font-semibold">Resources (in order selected) — also editable from each resource</p>
        <div className="max-h-72 space-y-1 overflow-y-auto rounded-lg border border-neutral-200 p-3 dark:border-white/10">
          {data?.items.map((r) => (
            <label key={r.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-amber-500" checked={ids.includes(r.id)} onChange={() => set("resource_ids", ids.includes(r.id) ? ids.filter((x) => x !== r.id) : [...ids, r.id])} />
              {ids.includes(r.id) && <span className="text-xs font-bold text-amber-700">{ids.indexOf(r.id) + 1}.</span>}{r.title}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryEditor = ({ value, set }: { value: Row; set: (k: string, v: unknown) => void }) => {
  const b = bindTo(value, set);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Lbl label="Name *"><input className={inputCls} {...b("name")} /></Lbl>
      <Lbl label="URL slug" hint={`/digital-daan/${value.slug || "…"}`}><input className={inputCls} {...b("slug")} /></Lbl>
      <Lbl label="Short description" className="sm:col-span-2"><input className={inputCls} {...b("description")} /></Lbl>
      <Lbl label="Topic page introduction" className="sm:col-span-2" hint="Shown at the top of the topic page and used for SEO."><textarea rows={3} className={inputCls} {...b("intro")} /></Lbl>
      <Lbl label="Icon" hint="sparkles, shield, briefcase, smartphone, zap, graduation-cap, cpu, scale, wallet, lock, message-circle, layers"><input className={inputCls} {...b("icon")} /></Lbl>
      <Lbl label="Colour"><input type="color" className="h-10 w-20 rounded border" {...b("color")} /></Lbl>
      <Lbl label="Order"><input type="number" className={inputCls} {...b("sort_order")} /></Lbl>
      <div className="self-end pb-2"><Toggle label="Active" checked={value.is_active !== false} onChange={(v) => set("is_active", v)} /></div>
    </div>
  );
};

const Metrics = () => {
  const { data } = useAdmin<{ metrics: Row[] }>("listMetrics");
  const save = useAdminMutation("saveMetrics");
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { if (data) setRows(data.metrics); }, [data]);
  const upd = (i: number, k: string, v: unknown) => setRows((r) => r.map((m, j) => (j === i ? { ...m, [k]: v } : m)));
  return (
    <Card className="space-y-4">
      <p className="text-sm text-neutral-600 dark:text-neutral-400"><strong>Automatic</strong> metrics are calculated from published resources. Switch to <strong>Manual</strong> to enter a value yourself (e.g. learners reached at live sessions).</p>
      <div className="space-y-2">
        {rows.map((m, i) => (
          <div key={m.key} className="grid items-center gap-2 sm:grid-cols-[1fr_120px_120px_70px_auto]">
            <input className={inputCls} value={m.label} onChange={(e) => upd(i, "label", e.target.value)} />
            <select className={inputCls} value={m.mode} onChange={(e) => upd(i, "mode", e.target.value)}><option value="auto" disabled={!["resources", "contributors", "learning_hours", "languages"].includes(m.key)}>Automatic</option><option value="manual">Manual</option></select>
            <input type="number" className={inputCls} disabled={m.mode === "auto"} value={m.value} onChange={(e) => upd(i, "value", e.target.value)} />
            <input className={inputCls} value={m.suffix} onChange={(e) => upd(i, "suffix", e.target.value)} placeholder="+" />
            <Toggle label="Show" checked={m.is_visible} onChange={(v) => upd(i, "is_visible", v)} />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Btn variant="secondary" onClick={() => setRows((r) => [...r, { key: `metric_${r.length + 1}`, label: "New metric", mode: "manual", value: 0, suffix: "", is_visible: true, sort_order: (r.length + 1) * 10 }])}><Plus className="h-4 w-4" /> Add metric</Btn>
        <Btn disabled={save.isPending} onClick={() => save.mutate({ metrics: rows.map((m, i) => ({ ...m, sort_order: i + 1 })) })}>Save metrics</Btn>
      </div>
      {save.isSuccess && <p className="text-sm text-emerald-600">Saved.</p>}
    </Card>
  );
};

const Storage = () => {
  const { data } = useAdmin<{ folders: Row[] }>("listStorage");
  const save = useAdminMutation("saveStorage");
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { if (data) setRows(data.folders); }, [data]);
  const upd = (i: number, k: string, v: unknown) => setRows((r) => r.map((m, j) => (j === i ? { ...m, [k]: v } : m)));
  return (
    <Card className="space-y-4">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Google Drive is the <strong>storage layer</strong> only. These folder links are private to admins and never shown on the public site — they're shortcuts for organising files. Public pages only ever show individual files that you attach to a published resource.
      </p>
      <div className="space-y-3">
        {rows.map((f, i) => (
          <div key={f.key} className="grid gap-2 sm:grid-cols-[200px_1fr_auto]">
            <input className={inputCls} value={f.label} onChange={(e) => upd(i, "label", e.target.value)} />
            <input className={inputCls} value={f.drive_url || ""} onChange={(e) => upd(i, "drive_url", e.target.value)} placeholder="https://drive.google.com/drive/folders/…" />
            {f.drive_url ? <a href={f.drive_url} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1 rounded-lg border border-neutral-300 px-3 text-sm dark:border-white/15"><ExternalLink className="h-4 w-4" /> Open</a> : <span />}
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Btn variant="secondary" onClick={() => { const label = prompt("Folder name"); if (label) setRows((r) => [...r, { key: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label, drive_url: "", sort_order: (r.length + 1) * 10 }]); }}><Plus className="h-4 w-4" /> Add folder</Btn>
        <Btn disabled={save.isPending} onClick={() => save.mutate({ folders: rows.map((f, i) => ({ ...f, sort_order: i + 1 })) })}>Save folders</Btn>
      </div>
      {save.error && <p className="text-sm text-red-600">{(save.error as Error).message}</p>}
      {save.isSuccess && <p className="text-sm text-emerald-600">Saved.</p>}
    </Card>
  );
};

const Admin = () => {
  const [authed, setAuthed] = useState(!!getToken());
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const { data: overview } = useAdmin<Row>("overview", {}, authed);
  useAdmin<AdminOptions>("options", {}, authed);
  useSeo({ title: "Digital Daan Admin", noindex: true, path: "/digital-daan/admin" });

  useEffect(() => {
    const onLogout = () => setAuthed(false);
    window.addEventListener("dd-admin-logout", onLogout);
    return () => window.removeEventListener("dd-admin-logout", onLogout);
  }, []);

  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  const pending = overview?.counts?.under_review || 0;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-neutral-950/95">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-prachetas-yellow text-xs font-bold text-black">DD</span>
          <p className="font-bold">Digital Daan Admin</p>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/digital-daan" target="_blank" className="hidden text-sm text-neutral-500 hover:text-neutral-900 sm:inline dark:hover:text-white">View site ↗</Link>
            <Btn variant="ghost" onClick={() => { setToken(null); setAuthed(false); }}><LogOut className="h-4 w-4" /> Sign out</Btn>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 no-scrollbar" aria-label="Admin sections">
          {TABS.map(([k, l]) => (
            <button key={k} onClick={() => { setTab(k); setEditing(null); }} className={`relative shrink-0 px-3 py-2.5 text-sm font-medium ${tab === k && editing === null ? "text-neutral-900 dark:text-white" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}>
              {l}{k === "review" && pending > 0 && <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 text-[11px] font-bold text-white">{pending}</span>}
              {tab === k && editing === null && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-amber-500" />}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        {editing !== null ? (
          <ResourceEditor key={String(editing)} id={editing} onClose={() => setEditing(null)} />
        ) : tab === "overview" ? (
          <Overview go={setTab} openResource={setEditing} />
        ) : tab === "review" ? (
          <ResourceList status="under_review" openResource={setEditing} />
        ) : tab === "resources" ? (
          <ResourceList openResource={setEditing} />
        ) : tab === "contributors" ? (
          <EntityTab
            title="contributor" listAction="listContributors" saveAction="saveContributor" Editor={ContributorEditor}
            empty={{ name: "", status: "approved", public_fields: { name: true, designation: true, organisation: true, photo: true, linkedin: true, bio: true } }}
            columns={[
              { label: "Name", render: (r) => <><p className="font-medium">{r.name}</p><p className="text-xs text-neutral-500">{r.email}</p></> },
              { label: "Status", render: (r) => <span className="text-xs">{r.status}{r.is_demo ? " · sample" : ""}{!r.public_fields?.name ? " · anonymous" : ""}</span> },
              { label: "Resources", render: (r) => `${r.published_count} published / ${r.resource_count}` },
            ]}
          />
        ) : tab === "campaigns" ? (
          <EntityTab
            title="campaign" listAction="listCampaigns" saveAction="saveCampaign" Editor={CampaignEditor} empty={{ name: "", status: "draft", featured: false }}
            columns={[
              { label: "Campaign", render: (r) => <><p className="font-medium">{r.name}</p><p className="text-xs text-neutral-500">/digital-daan/campaigns/{r.slug}</p></> },
              { label: "Dates", render: (r) => <span className="text-xs">{r.start_date || "—"} → {r.end_date || "—"}</span> },
              { label: "Status", render: (r) => <span className="text-xs">{r.status}{r.featured ? " · featured" : ""} · {r.resource_count} resources</span> },
            ]}
          />
        ) : tab === "collections" ? (
          <EntityTab
            title="collection" listAction="listCollections" saveAction="saveCollection" Editor={CollectionEditor} empty={{ name: "", is_active: true, sort_order: 100, resource_ids: [] }}
            columns={[{ label: "Collection", render: (r) => <><p className="font-medium">{r.name}</p><p className="text-xs text-neutral-500">{r.description}</p></> }, { label: "Resources", render: (r) => r.resource_ids?.length || 0 }]}
          />
        ) : tab === "categories" ? (
          <EntityTab
            title="category" listAction="listCategories" saveAction="saveCategory" Editor={CategoryEditor} empty={{ name: "", color: "#64748B", icon: "layers", sort_order: 200, is_active: true }}
            columns={[
              { label: "Category", render: (r) => <span className="inline-flex items-center gap-2 font-medium"><span className="h-3 w-3 rounded-full" style={{ background: r.color }} />{r.name}</span> },
              { label: "Page", render: (r) => <span className="text-xs text-neutral-500">/digital-daan/{r.slug}</span> },
              { label: "Resources", render: (r) => `${r.resource_count}${r.is_active ? "" : " · inactive"}` },
            ]}
          />
        ) : tab === "metrics" ? <Metrics /> : <Storage />}
      </main>
    </div>
  );
};

export default Admin;
