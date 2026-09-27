import { useEffect } from "react";

export const SITE_URL = "https://prachetasfoundation.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/digital-daan-og.png`;

type Seo = { title: string; description?: string | null; image?: string | null; path?: string; type?: string; noindex?: boolean; jsonld?: object | null };

const setMeta = (attr: "name" | "property", key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.dataset.dd = "1";
    document.head.appendChild(el);
  }
  el.content = value;
};

// Client-side counterpart of the `dd-meta` edge function: keeps title/meta/canonical in sync
// during in-app navigation (the edge function handles first loads and social crawlers).
export const useSeo = ({ title, description, image, path, type = "website", noindex, jsonld }: Seo) => {
  useEffect(() => {
    const prevTitle = document.title;
    const url = `${SITE_URL}${path ?? window.location.pathname}`;
    const desc = (description || "Digital Daan by Prachetas Foundation — free, practical learning resources shared by volunteers.").slice(0, 300);
    document.title = title;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:image", image || DEFAULT_OG_IMAGE);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", type);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", image || DEFAULT_OG_IMAGE);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    let script: HTMLScriptElement | null = null;
    if (jsonld) {
      document.head.querySelectorAll('script[data-dd-jsonld]').forEach((s) => s.remove());
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.ddJsonld = "1";
      script.textContent = JSON.stringify(jsonld);
      document.head.appendChild(script);
    }
    return () => {
      document.title = prevTitle;
      script?.remove();
      setMeta("name", "robots", "index, follow");
    };
  }, [title, description, image, path, type, noindex, jsonld]);
};
