import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { track, useResourceSearch, useTaxonomy, type Filters } from "../api";
import { Container, DDLayout, EmptyState, ErrorState, ResourceGrid } from "../ui";
import { SearchBox } from "../blocks";
import { FILTER_GROUPS, FilterPanel, groupOptions, type FilterKey } from "../FilterPanel";
import { useSeo } from "../seo";

const SORTS = [
  { slug: "relevance", label: "Most relevant", needsQuery: true },
  { slug: "latest", label: "Newest" },
  { slug: "popular", label: "Most viewed" },
  { slug: "shortest", label: "Shortest first" },
];

const EXTRA_KEYS = ["campaign", "collection", "contributor", "tag"] as const;

const Explore = () => {
  const [params, setParams] = useSearchParams();
  const { data: tax } = useTaxonomy();
  const [sheetOpen, setSheetOpen] = useState(false);

  const q = params.get("q") || "";
  const values = useMemo(
    () => Object.fromEntries(FILTER_GROUPS.map((g) => [g.key, (params.get(g.key) || "").split(",").filter(Boolean)])) as Record<FilterKey, string[]>,
    [params],
  );
  const filters: Filters = useMemo(() => {
    const f: Filters = {};
    params.forEach((v, k) => { if (v && k !== "page") (f as Record<string, string>)[k] = v; });
    return f;
  }, [params]);

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useResourceSearch(filters);
  const items = data?.pages.flatMap((p) => p.items) || [];
  const total = data?.pages[0]?.total ?? 0;
  const sort = params.get("sort") || (q ? "relevance" : "latest");

  useEffect(() => {
    if (q) track("search", { term: q });
  }, [q]);

  const update = (mut: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params);
    mut(next);
    setParams(next, { replace: false });
  };
  const toggle = (key: FilterKey, slug: string) =>
    update((p) => {
      const cur = new Set((p.get(key) || "").split(",").filter(Boolean));
      if (cur.has(slug)) cur.delete(slug); else cur.add(slug);
      if (cur.size) p.set(key, [...cur].join(",")); else p.delete(key);
    });
  const setQuery = (term: string) => update((p) => { if (term) p.set("q", term); else p.delete("q"); p.delete("sort"); });
  const clearAll = () => setParams(new URLSearchParams());

  const chips = [
    ...FILTER_GROUPS.flatMap((g) => values[g.key].map((slug) => ({ key: g.key, slug, label: groupOptions(tax, g.key).find((o) => o.slug === slug)?.label || slug }))),
    ...EXTRA_KEYS.filter((k) => params.get(k)).map((k) => {
      const v = params.get(k)!;
      const label = k === "campaign" ? tax?.campaigns.find((c) => c.slug === v)?.short_name || v
        : k === "collection" ? tax?.collections.find((c) => c.slug === v)?.name || v
        : k === "tag" ? `#${v}` : v.replace(/-/g, " ");
      return { key: k, slug: v, label };
    }),
  ];
  const activeCount = chips.length;
  const collection = tax?.collections.find((c) => c.slug === params.get("collection"));

  useSeo({
    title: q ? `“${q}” — Search Digital Daan | Prachetas Foundation` : "Explore Digital Daan — Free Learning Library | Prachetas Foundation",
    description: "Discover practical knowledge created by people who chose to share what they know — videos, guides, articles, quizzes and sessions.",
    path: "/digital-daan/explore",
    noindex: activeCount > 0 || !!q,
  });

  const panel = <FilterPanel tax={tax} values={values} onToggle={toggle} />;

  return (
    <DDLayout>
      <header className="border-b border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900/40">
        <Container className="py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-prachetas-yellow">Learning library</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">{collection ? collection.name : "Explore Digital Daan"}</h1>
          <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
            {collection?.description || "Discover practical knowledge created by people who chose to share what they know."}
          </p>
          <div className="mt-6 max-w-2xl">
            <SearchBox size="md" initial={q} onSearch={setQuery} />
          </div>
        </Container>
      </header>

      <Container className="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-24">
              <div className="flex items-center justify-between">
                <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-neutral-500">Filters</h2>
                {activeCount > 0 && <button onClick={clearAll} className="text-xs font-semibold text-amber-700 hover:underline dark:text-prachetas-yellow">Clear all</button>}
              </div>
              {panel}
            </div>
          </aside>

          <section aria-labelledby="dd-results">
            <div className="flex flex-wrap items-center gap-3">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <button className="lg:hidden inline-flex h-10 items-center gap-2 rounded-full border border-neutral-300 px-4 text-sm font-semibold dark:border-white/15">
                    <SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && <span className="rounded-full bg-neutral-900 px-1.5 text-xs text-white dark:bg-white dark:text-black">{activeCount}</span>}
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
                  <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                  {panel}
                  <div className="sticky bottom-0 -mx-6 mt-4 flex gap-3 border-t bg-background px-6 py-4">
                    <button onClick={clearAll} className="h-11 flex-1 rounded-full border text-sm font-semibold">Clear</button>
                    <button onClick={() => setSheetOpen(false)} className="h-11 flex-[2] rounded-full bg-neutral-900 text-sm font-semibold text-white dark:bg-prachetas-yellow dark:text-black">
                      Show {total} result{total === 1 ? "" : "s"}
                    </button>
                  </div>
                </SheetContent>
              </Sheet>

              <p id="dd-results" className="text-sm text-neutral-600 dark:text-neutral-400" aria-live="polite">
                {isLoading ? "Loading…" : <><span className="font-semibold text-neutral-900 dark:text-white">{total}</span> resource{total === 1 ? "" : "s"}{q && <> for “{q}”</>}</>}
                {isFetching && !isLoading && !isFetchingNextPage && <Loader2 className="ml-2 inline h-3.5 w-3.5 animate-spin" aria-hidden />}
              </p>

              <label className="ml-auto flex items-center gap-2 text-sm">
                <span className="text-neutral-500">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => update((p) => p.set("sort", e.target.value))}
                  className="h-10 rounded-full border border-neutral-300 bg-white px-3 text-sm font-medium dark:border-white/15 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {SORTS.filter((s) => !s.needsQuery || q).map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}
                </select>
              </label>
            </div>

            {chips.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
                {chips.map((c) => (
                  <li key={`${c.key}-${c.slug}`}>
                    <button
                      onClick={() => (FILTER_GROUPS.some((g) => g.key === c.key) ? toggle(c.key as FilterKey, c.slug) : update((p) => p.delete(c.key)))}
                      className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 py-1.5 pl-3 pr-2 text-xs font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-black"
                      aria-label={`Remove filter ${c.label}`}
                    >
                      {c.label} <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
                <li><button onClick={clearAll} className="px-2 py-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white">Clear all</button></li>
              </ul>
            )}

            <div className={`mt-6 transition-opacity ${isFetching && !isFetchingNextPage && !isLoading ? "opacity-60" : ""}`}>
              {isError ? (
                <ErrorState onRetry={() => refetch()} />
              ) : !isLoading && items.length === 0 ? (
                <EmptyState
                  title={q ? `No results for “${q}”` : "No resources match these filters"}
                  description="Try fewer filters or a different word. New resources are added regularly."
                  action={<button onClick={clearAll} className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-black">Clear search and filters</button>}
                />
              ) : (
                <ResourceGrid items={items} loading={isLoading} skeletons={9} className="lg:grid-cols-2 xl:grid-cols-3" />
              )}
            </div>

            {hasNextPage && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-neutral-300 px-8 text-sm font-semibold transition hover:bg-neutral-50 disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/5"
                >
                  {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />} Load more
                </button>
                <p className="mt-2 text-xs text-neutral-500">Showing {items.length} of {total}</p>
              </div>
            )}
          </section>
        </div>
      </Container>
    </DDLayout>
  );
};

export default Explore;
