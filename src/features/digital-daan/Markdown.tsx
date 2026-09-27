import { Fragment, ReactNode } from "react";

// A deliberately small Markdown subset rendered to React elements (never raw HTML), so
// contributor-supplied text can't inject markup. Supports: ## / ### headings, paragraphs,
// - and 1. lists, > quotes, **bold** and [links](https://...).

const inline = (text: string, key: string): ReactNode[] => {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={`${key}-${i++}`} className="font-semibold text-neutral-900 dark:text-white">{m[1]}</strong>);
    else out.push(<a key={`${key}-${i++}`} href={m[3]} target="_blank" rel="noopener noreferrer nofollow" className="font-medium text-amber-700 underline underline-offset-4 hover:text-amber-600 dark:text-prachetas-yellow">{m[2]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
};

type Block = { type: "h2" | "h3" | "p" | "ul" | "ol" | "quote"; lines: string[] };

const parse = (src: string): Block[] => {
  const blocks: Block[] = [];
  let cur: Block | null = null;
  const push = (type: Block["type"], line: string) => {
    if (cur && cur.type === type && type !== "h2" && type !== "h3") cur.lines.push(line);
    else blocks.push((cur = { type, lines: [line] }));
  };
  for (const raw of src.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    if (!line) { cur = null; continue; }
    if (line.startsWith("### ")) push("h3", line.slice(4));
    else if (line.startsWith("## ")) push("h2", line.slice(3));
    else if (line.startsWith("# ")) push("h2", line.slice(2));
    else if (/^[-*] /.test(line)) push("ul", line.slice(2));
    else if (/^\d+[.)] /.test(line)) push("ol", line.replace(/^\d+[.)] /, ""));
    else if (line.startsWith("> ")) push("quote", line.slice(2));
    else if (cur?.type === "p") cur.lines.push(line);
    else push("p", line);
  }
  return blocks;
};

export const headingId = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");

export const extractHeadings = (src: string) => parse(src).filter((b) => b.type === "h2").map((b) => ({ id: headingId(b.lines[0]), text: b.lines[0] }));

const Markdown = ({ source, className = "" }: { source: string; className?: string }) => (
  <div className={`text-[17px] leading-8 text-neutral-700 dark:text-neutral-300 ${className}`}>
    {parse(source).map((b, i) => {
      const k = `b${i}`;
      switch (b.type) {
        case "h2":
          return <h2 key={k} id={headingId(b.lines[0])} className="scroll-mt-28 mt-10 first:mt-0 mb-4 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{inline(b.lines[0], k)}</h2>;
        case "h3":
          return <h3 key={k} className="mt-8 mb-2 text-lg font-semibold text-neutral-900 dark:text-white">{inline(b.lines[0], k)}</h3>;
        case "ul":
          return (
            <ul key={k} className="my-5 space-y-2.5">
              {b.lines.map((l, j) => (
                <li key={j} className="relative pl-6 before:absolute before:left-1 before:top-[0.8em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-amber-500">{inline(l, `${k}-${j}`)}</li>
              ))}
            </ul>
          );
        case "ol":
          return (
            <ol key={k} className="my-5 space-y-3">
              {b.lines.map((l, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-100 text-xs font-bold text-amber-800 dark:bg-prachetas-yellow/15 dark:text-prachetas-yellow">{j + 1}</span>
                  <span>{inline(l, `${k}-${j}`)}</span>
                </li>
              ))}
            </ol>
          );
        case "quote":
          return (
            <blockquote key={k} className="my-8 border-l-4 border-amber-400 bg-amber-50/60 dark:bg-prachetas-yellow/5 rounded-r-xl px-6 py-4 text-lg font-medium text-neutral-800 dark:text-neutral-200">
              {b.lines.map((l, j) => <Fragment key={j}>{inline(l, `${k}-${j}`)}{j < b.lines.length - 1 && " "}</Fragment>)}
            </blockquote>
          );
        default:
          return <p key={k} className="my-5">{inline(b.lines.join(" "), k)}</p>;
      }
    })}
  </div>
);

export default Markdown;
