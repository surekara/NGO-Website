import { useInfiniteQuery, useQuery, keepPreviousData } from "@tanstack/react-query";

export type Named = { slug: string; name: string };
export type CategoryRef = Named & { color: string; icon: string };
export type ActivityRef = Named & { number: number; color: string };

export type Contributor = {
  slug: string | null;
  name: string;
  photo_url: string | null;
  designation: string | null;
  expertise: string | null;
  organisation: string | null;
  linkedin_url: string | null;
  bio: string | null;
  has_profile: boolean;
  is_demo: boolean;
  resource_count?: number;
  categories?: string[];
};

export type ResourceCard = {
  slug: string;
  title: string;
  short_description: string | null;
  content_type: string;
  audiences: string[];
  language: string;
  duration_minutes: number | null;
  thumbnail_url: string | null;
  tags: string[];
  featured: boolean;
  published_at: string | null;
  is_demo: boolean;
  category: CategoryRef | null;
  activity: ActivityRef | null;
  contributor: Contributor | null;
};

export type QuizQuestion = { q: string; options: string[]; answer: number; explain?: string | null };

export type ResourceDetail = ResourceCard & {
  detailed_description: string | null;
  body: string | null;
  quiz: QuizQuestion[] | null;
  transcript: string | null;
  media: { youtube_id: string | null; drive_preview_url: string | null; external_url: string | null };
  campaigns: { slug: string; name: string; short_name: string | null; partner: string | null; phase: string }[];
};

export type Category = Named & { description: string | null; intro: string | null; icon: string; color: string; resource_count?: number };
export type Activity = Named & {
  number: number; tagline: string; description: string; formats: string[]; topics: string[]; icon: string; color: string; resource_count?: number;
};
export type Campaign = Named & {
  short_name: string | null; tagline: string | null; description: string | null; partner: string | null;
  start_date: string | null; end_date: string | null; featured: boolean; hero_image_url: string | null; phase: "upcoming" | "active" | "completed";
};
export type Option = { slug: string; label: string; verb?: string; native?: string; resource_count?: number };
export type Stat = { key: string; label: string; value: number; suffix: string };
export type Collection = Named & { description: string | null; resource_count?: number; resources?: ResourceCard[] };

export type Taxonomy = {
  categories: Category[];
  activities: Activity[];
  campaigns: Campaign[];
  collections: Collection[];
  formats: Option[];
  audiences: Option[];
  languages: Option[];
};

export type SearchResult = { items: ResourceCard[]; total: number; page: number; pageSize: number; hasMore: boolean; sort: string };

export type Filters = {
  q?: string; category?: string; activity?: string; format?: string; audience?: string; language?: string;
  campaign?: string; collection?: string; contributor?: string; tag?: string; sort?: string;
};

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

const BASE = "/api";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/${path}`, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || "Something went wrong", res.status);
  return data as T;
}

const qs = (params: Record<string, string | number | undefined>) =>
  new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== "") as [string, string][]).toString();

const pub = <T,>(params: Record<string, string | number | undefined>) => request<T>(`dd-public?${qs(params)}`);

const retry = (count: number, err: unknown) => !(err instanceof ApiError && err.status === 404) && count < 2;

export const useTaxonomy = () =>
  useQuery({ queryKey: ["dd", "taxonomy"], queryFn: () => pub<Taxonomy>({ action: "taxonomy" }), staleTime: 10 * 60_000 });

export const useHome = () =>
  useQuery({
    queryKey: ["dd", "home"],
    queryFn: () => pub<{ featured: ResourceCard[]; recent: ResourceCard[]; stats: Stat[]; contributors: Contributor[]; campaign: Campaign | null; collections: Collection[] }>({ action: "home" }),
    staleTime: 60_000,
  });

export const useResourceSearch = (filters: Filters, pageSize = 12) =>
  useInfiniteQuery({
    queryKey: ["dd", "resources", filters, pageSize],
    queryFn: ({ pageParam }) => pub<SearchResult>({ action: "resources", ...filters, page: pageParam, limit: pageSize }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

export const useResource = (slug?: string) =>
  useQuery({
    queryKey: ["dd", "resource", slug],
    queryFn: () => pub<{ resource: ResourceDetail; related: ResourceCard[] }>({ action: "resource", slug }),
    enabled: !!slug,
    retry,
  });

export const useContributors = () =>
  useQuery({ queryKey: ["dd", "contributors"], queryFn: () => pub<{ contributors: Contributor[] }>({ action: "contributors" }), staleTime: 60_000 });

export const useContributor = (slug?: string) =>
  useQuery({
    queryKey: ["dd", "contributor", slug],
    queryFn: () => pub<{ contributor: Contributor; resources: ResourceCard[] }>({ action: "contributor", slug }),
    enabled: !!slug,
    retry,
  });

export const useCampaign = (slug?: string) =>
  useQuery({
    queryKey: ["dd", "campaign", slug],
    queryFn: () => pub<{ campaign: Campaign; featured: ResourceCard[]; recent: ResourceCard[]; total: number; stats: Stat[]; contributors: Contributor[] }>({ action: "campaign", slug }),
    enabled: !!slug,
    retry,
  });

export const useTopic = (type: "category" | "activity", slug?: string) =>
  useQuery({
    queryKey: ["dd", "topic", type, slug],
    queryFn: () =>
      pub<{ type: string; topic: Category & Partial<Activity>; featured: ResourceCard[]; related: (CategoryRef & { resource_count: number })[] }>({ action: "topic", type, slug }),
    enabled: !!slug,
    retry,
  });

// Fire-and-forget analytics. Never blocks the UI and never sends personal data.
export const track = (type: "view" | "video_open" | "download" | "share" | "search" | "quiz_complete", data: Record<string, unknown> = {}) => {
  try {
    const body = JSON.stringify({ type, ...data });
    if (navigator.sendBeacon) navigator.sendBeacon(`${BASE}/dd-track`, new Blob([body], { type: "application/json" }));
    else fetch(`${BASE}/dd-track`, { method: "POST", body, keepalive: true }).catch(() => {});
  } catch {
    /* analytics must never break the page */
  }
};
