import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, request } from "../api";

const KEY = "dd-admin-token";

export const getToken = () => sessionStorage.getItem(KEY);
export const setToken = (t: string | null) => (t ? sessionStorage.setItem(KEY, t) : sessionStorage.removeItem(KEY));

export const adminCall = async <T,>(action: string, payload: Record<string, unknown> = {}): Promise<T> => {
  try {
    return await request<T>("dd-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken() || ""}` },
      body: JSON.stringify({ action, payload }),
    });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      setToken(null);
      window.dispatchEvent(new Event("dd-admin-logout"));
    }
    throw e;
  }
};

export const login = async (password: string) => {
  const res = await request<{ token: string }>("dd-admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "login", password }) });
  setToken(res.token);
};

export const useAdmin = <T,>(action: string, payload: Record<string, unknown> = {}, enabled = true) =>
  useQuery({ queryKey: ["dd-admin", action, payload], queryFn: () => adminCall<T>(action, payload), enabled, retry: false });

export const useAdminMutation = <T,>(action: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => adminCall<T>(action, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dd-admin"] });
      qc.invalidateQueries({ queryKey: ["dd"] });
    },
  });
};

export type Opt = { id: number; slug?: string; name: string };
export type AdminOptions = {
  categories: (Opt & { is_active: boolean })[];
  activities: (Opt & { number: number })[];
  campaigns: (Opt & { short_name: string | null; status: string })[];
  collections: Opt[];
  contributors: (Opt & { email: string | null; status: string })[];
  storage: { key: string; label: string; drive_url: string | null }[];
  formats: { slug: string; label: string }[];
  audiences: { slug: string; label: string }[];
  languages: { slug: string; label: string }[];
  statuses: string[];
};

export type AdminResourceRow = {
  id: number; slug: string; title: string; status: string; featured: boolean; content_type: string; language: string; is_demo: boolean;
  updated_at: string; published_at: string | null; created_at: string; submission_kind: string | null;
  category_name: string | null; activity_name: string | null; contributor_name: string | null;
};

export const STATUS_STYLE: Record<string, string> = {
  draft: "bg-neutral-100 text-neutral-700 dark:bg-white/10 dark:text-neutral-300",
  under_review: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  archived: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

export const STATUS_LABEL: Record<string, string> = { draft: "Draft", under_review: "Under review", published: "Published", archived: "Archived", rejected: "Rejected" };
