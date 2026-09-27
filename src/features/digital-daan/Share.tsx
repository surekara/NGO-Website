import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { track } from "./api";

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden><path d={d} /></svg>
);

const WA = "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36A9.43 9.43 0 1 1 12.05 21.5M20.08 3.9A11.25 11.25 0 0 0 12.05.6C5.8.6.7 5.7.7 11.95c0 2 .52 3.95 1.52 5.67L.6 23.4l5.9-1.55a11.3 11.3 0 0 0 5.54 1.41h.01c6.25 0 11.35-5.1 11.35-11.35 0-3.03-1.18-5.88-3.32-8.02";
const LI = "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28M5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.56V9h3.56v11.45M22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0";
const FB = "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07";
const X = "M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93Zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41Z";

export const ShareButtons = ({ url, title, slug, compact = false }: { url: string; title: string; slug?: string; compact?: boolean }) => {
  const [copied, setCopied] = useState(false);
  const e = encodeURIComponent;
  const links = [
    { label: "WhatsApp", d: WA, href: `https://wa.me/?text=${e(`${title} — ${url}`)}`, cls: "hover:bg-[#25D366] hover:text-white" },
    { label: "LinkedIn", d: LI, href: `https://www.linkedin.com/sharing/share-offsite/?url=${e(url)}`, cls: "hover:bg-[#0A66C2] hover:text-white" },
    { label: "Facebook", d: FB, href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}`, cls: "hover:bg-[#1877F2] hover:text-white" },
    { label: "X", d: X, href: `https://twitter.com/intent/tweet?url=${e(url)}&text=${e(title)}`, cls: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black" },
  ];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      track("share", { slug, channel: "copy" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  };
  const native = async () => {
    try {
      await navigator.share({ title, url });
      track("share", { slug, channel: "native" });
    } catch {
      /* user cancelled */
    }
  };
  const btn = "grid h-10 w-10 place-items-center rounded-full border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500";
  return (
    <div className="flex flex-wrap items-center gap-2">
      {typeof navigator !== "undefined" && "share" in navigator && (
        <button onClick={native} className={`${btn} hover:bg-neutral-900 hover:text-white sm:hidden`} aria-label="Share">
          <Share2 className="h-4 w-4" />
        </button>
      )}
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${l.label}`} title={`Share on ${l.label}`} onClick={() => track("share", { slug, channel: l.label.toLowerCase() })} className={`${btn} ${l.cls}`}>
          <Icon d={l.d} />
        </a>
      ))}
      <button onClick={copy} className={`${compact ? btn : `${btn} w-auto px-4 gap-2 text-sm font-medium`} hover:bg-neutral-100 dark:hover:bg-white/10 inline-flex items-center`} aria-label="Copy link">
        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Link2 className="h-4 w-4" />}
        {!compact && <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>}
      </button>
    </div>
  );
};
