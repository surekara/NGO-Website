import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Taxonomy } from "./api";

export const FILTER_GROUPS = [
  { key: "activity", title: "Digital Daan Activity" },
  { key: "category", title: "Topic" },
  { key: "format", title: "Format" },
  { key: "audience", title: "Audience" },
  { key: "language", title: "Language" },
] as const;

export type FilterKey = (typeof FILTER_GROUPS)[number]["key"];

export const groupOptions = (tax: Taxonomy | undefined, key: FilterKey) => {
  if (!tax) return [];
  switch (key) {
    case "activity": return tax.activities.map((a) => ({ slug: a.slug, label: a.name, count: a.resource_count }));
    case "category": return tax.categories.map((c) => ({ slug: c.slug, label: c.name, count: c.resource_count }));
    case "format": return tax.formats.map((f) => ({ slug: f.slug, label: f.label, count: undefined }));
    case "audience": return tax.audiences.map((a) => ({ slug: a.slug, label: a.label, count: undefined }));
    case "language": return tax.languages.filter((l) => l.resource_count || ["en", "hi", "mr"].includes(l.slug)).map((l) => ({ slug: l.slug, label: l.native && l.native !== l.label ? `${l.label} · ${l.native}` : l.label, count: l.resource_count }));
  }
};

const Group = ({ title, options, selected, onToggle, defaultOpen }: {
  title: string; options: { slug: string; label: string; count?: number }[]; selected: string[]; onToggle: (slug: string) => void; defaultOpen: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen || selected.length > 0);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? options : options.slice(0, 7);
  return (
    <fieldset className="border-b border-neutral-200 dark:border-white/10 py-4">
      <legend className="w-full">
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded">
          <span>{title}{selected.length > 0 && <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800 dark:bg-prachetas-yellow/20 dark:text-prachetas-yellow">{selected.length}</span>}</span>
          <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
      </legend>
      {open && (
        <div className="mt-3 space-y-0.5">
          {visible.map((o) => {
            const checked = selected.includes(o.slug);
            return (
              <label key={o.slug} className="flex min-h-[40px] cursor-pointer items-center gap-3 rounded-lg px-2 text-sm hover:bg-neutral-50 dark:hover:bg-white/5">
                <input type="checkbox" checked={checked} onChange={() => onToggle(o.slug)} className="h-4 w-4 rounded border-neutral-300 accent-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500" />
                <span className={`flex-1 ${checked ? "font-semibold" : "text-neutral-700 dark:text-neutral-300"}`}>{o.label}</span>
                {o.count !== undefined && <span className="text-xs tabular-nums text-neutral-400">{o.count}</span>}
              </label>
            );
          })}
          {options.length > 7 && (
            <button type="button" onClick={() => setShowAll(!showAll)} className="mt-1 px-2 text-xs font-semibold text-amber-700 hover:underline dark:text-prachetas-yellow">
              {showAll ? "Show less" : `Show all ${options.length}`}
            </button>
          )}
        </div>
      )}
    </fieldset>
  );
};

export const FilterPanel = ({ tax, values, onToggle }: { tax?: Taxonomy; values: Record<FilterKey, string[]>; onToggle: (key: FilterKey, slug: string) => void }) => (
  <div>
    {FILTER_GROUPS.map((g, i) => (
      <Group key={g.key} title={g.title} options={groupOptions(tax, g.key)} selected={values[g.key]} onToggle={(s) => onToggle(g.key, s)} defaultOpen={i < 3} />
    ))}
  </div>
);
