import { ReactNode } from "react";

export const inputCls = "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-white/15 dark:bg-neutral-900";

export const Lbl = ({ label, hint, children, className = "" }: { label: string; hint?: string; children: ReactNode; className?: string }) => (
  <label className={`block ${className}`}>
    <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-[11px] text-neutral-500">{hint}</span>}
  </label>
);

export const Btn = ({ children, variant = "primary", className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "success" | "ghost" }) => {
  const v = {
    primary: "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-prachetas-yellow dark:text-black dark:hover:bg-yellow-300",
    secondary: "border border-neutral-300 hover:bg-neutral-50 dark:border-white/15 dark:hover:bg-white/5",
    danger: "bg-red-600 text-white hover:bg-red-500",
    success: "bg-emerald-600 text-white hover:bg-emerald-500",
    ghost: "hover:bg-neutral-100 dark:hover:bg-white/10",
  }[variant];
  return (
    <button {...rest} className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold transition disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${v} ${className}`}>
      {children}
    </button>
  );
};

export const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-amber-500" />
    {label}
  </label>
);

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-900 ${className}`}>{children}</div>
);
