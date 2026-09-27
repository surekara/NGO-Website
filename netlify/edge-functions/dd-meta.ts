// Injects page-specific SEO + Open Graph tags into the SPA shell for Digital Daan URLs,
// so search engines and link previews (WhatsApp, LinkedIn, X, Facebook) see real titles,
// descriptions, images and structured data. Falls back to the untouched page on any error.
import type { Config, Context } from "@netlify/edge-functions";

type Meta = { title: string; description: string; image: string; type: string; site: string; jsonld?: unknown; noindex?: boolean };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const setTag = (html: string, attr: "name" | "property", key: string, value: string) => {
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
  const re = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`, "i");
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `  ${tag}\n</head>`);
};

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const response = await context.next();
  if (!(response.headers.get("content-type") || "").includes("text/html") || /\.[a-z0-9]+$/i.test(url.pathname)) return response;

  let html = await response.text();
  const path = url.pathname.replace(/\/+$/, "") || "/digital-daan";

  if (path.startsWith("/digital-daan/admin")) {
    html = setTag(html, "name", "robots", "noindex, nofollow");
    return new Response(html, response);
  }

  try {
    const api = new URL(`/.netlify/functions/dd-public?action=meta&path=${encodeURIComponent(path)}`, url.origin);
    const res = await fetch(api, { headers: { accept: "application/json" } });
    const { meta } = (await res.json()) as { meta: Meta | null };
    if (!meta) return new Response(html, response);

    const canonical = `${meta.site}${path}`;
    const desc = (meta.description || "").slice(0, 300);
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(meta.title)}</title>`);
    html = setTag(html, "name", "description", desc);
    html = setTag(html, "property", "og:title", meta.title);
    html = setTag(html, "property", "og:description", desc);
    html = setTag(html, "property", "og:image", meta.image);
    html = setTag(html, "property", "og:url", canonical);
    html = setTag(html, "property", "og:type", meta.type);
    html = setTag(html, "property", "og:site_name", "Prachetas Foundation — Digital Daan");
    html = setTag(html, "name", "twitter:card", "summary_large_image");
    html = setTag(html, "name", "twitter:title", meta.title);
    html = setTag(html, "name", "twitter:description", desc);
    html = setTag(html, "name", "twitter:image", meta.image);
    if (meta.noindex) html = setTag(html, "name", "robots", "noindex, follow");
    const extra = [`<link rel="canonical" href="${esc(canonical)}" />`];
    if (meta.jsonld) extra.push(`<script type="application/ld+json">${JSON.stringify(meta.jsonld).replace(/</g, "\\u003c")}</script>`);
    html = html.replace("</head>", `  ${extra.join("\n  ")}\n</head>`);

    const headers = new Headers(response.headers);
    headers.delete("content-length");
    return new Response(html, { status: response.status, headers });
  } catch {
    return new Response(html, response);
  }
};

export const config: Config = { path: ["/digital-daan", "/digital-daan/*"], excludedPath: ["/digital-daan/sitemap.xml"] };
