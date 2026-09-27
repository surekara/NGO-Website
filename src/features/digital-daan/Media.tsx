import { useState } from "react";
import { Play, ExternalLink, FileDown, Film, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { track, type QuizQuestion, type ResourceDetail } from "./api";
import { ResourceCover } from "./ui";

// Click-to-load player: nothing heavy (YouTube/Drive iframes) loads until the learner presses play.
export const VideoPlayer = ({ resource }: { resource: ResourceDetail }) => {
  const [playing, setPlaying] = useState(false);
  const { youtube_id, drive_preview_url } = resource.media;
  const vertical = resource.content_type === "reel";
  const src = youtube_id
    ? `https://www.youtube-nocookie.com/embed/${youtube_id}?autoplay=1&rel=0&modestbranding=1`
    : drive_preview_url;
  const frame = `relative overflow-hidden rounded-2xl bg-neutral-900 ${vertical ? "mx-auto aspect-[9/16] w-full max-w-sm" : "aspect-video w-full"}`;

  if (!src) {
    return (
      <div className={`${frame} group`}>
        <ResourceCover resource={resource} large />
        <div className="absolute inset-0 grid place-items-center bg-black/50 text-center text-white">
          <div>
            <Film className="mx-auto h-10 w-10 opacity-80" aria-hidden />
            <p className="mt-3 font-semibold">Video coming soon</p>
            <p className="text-sm text-white/60">The key points are available below.</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={frame}>
      {playing ? (
        <iframe
          src={src}
          title={resource.title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          onClick={() => { setPlaying(true); track("video_open", { slug: resource.slug }); }}
          className="group absolute inset-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
          aria-label={`Play video: ${resource.title}`}
        >
          <ResourceCover resource={resource} large />
          <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
          <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-black shadow-2xl transition-transform group-hover:scale-110">
            <Play className="h-8 w-8 translate-x-0.5 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
};

export const DocumentViewer = ({ resource }: { resource: ResourceDetail }) => {
  const [open, setOpen] = useState(false);
  const { drive_preview_url, external_url } = resource.media;
  const openUrl = drive_preview_url ? drive_preview_url.replace(/\/preview$/, "/view") : external_url;
  return (
    <div className="space-y-4">
      {drive_preview_url && (
        open ? (
          <iframe src={drive_preview_url} title={resource.title} className="h-[70vh] w-full rounded-2xl border border-neutral-200 dark:border-white/10" loading="lazy" />
        ) : (
          <button onClick={() => setOpen(true)} className="group relative block aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500">
            <ResourceCover resource={resource} large />
            <span className="absolute inset-0 grid place-items-center bg-black/40">
              <span className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-xl">Preview document</span>
            </span>
          </button>
        )
      )}
      {openUrl && (
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("download", { slug: resource.slug })}
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-prachetas-yellow dark:text-black"
        >
          {resource.content_type === "pdf" ? <FileDown className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
          {resource.content_type === "pdf" ? "Open / download PDF" : "Open resource"}
        </a>
      )}
    </div>
  );
};

export const QuizPlayer = ({ questions, slug }: { questions: QuizQuestion[]; slug: string }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const done = answers.every((a) => a !== null);
  const score = answers.filter((a, i) => a === questions[i].answer).length;
  const choose = (qi: number, oi: number) => {
    if (answers[qi] !== null) return;
    const next = answers.map((a, i) => (i === qi ? oi : a));
    setAnswers(next);
    if (next.every((a) => a !== null)) track("quiz_complete", { slug, score: next.filter((a, i) => a === questions[i].answer).length });
  };
  return (
    <div className="space-y-6">
      {questions.map((q, qi) => {
        const picked = answers[qi];
        return (
          <fieldset key={qi} className="rounded-2xl border border-neutral-200 p-5 sm:p-6 dark:border-white/10">
            <legend className="sr-only">Question {qi + 1}</legend>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Question {qi + 1} of {questions.length}</p>
            <p className="mt-2 text-lg font-semibold leading-snug">{q.q}</p>
            <div className="mt-4 grid gap-2">
              {q.options.map((o, oi) => {
                const correct = oi === q.answer;
                const state = picked === null ? "idle" : correct ? "correct" : picked === oi ? "wrong" : "muted";
                return (
                  <button
                    key={oi}
                    onClick={() => choose(qi, oi)}
                    disabled={picked !== null}
                    aria-pressed={picked === oi}
                    className={`flex min-h-[48px] items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                      state === "idle" ? "border-neutral-200 hover:border-amber-400 hover:bg-amber-50/50 dark:border-white/10 dark:hover:bg-white/5"
                      : state === "correct" ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200"
                      : state === "wrong" ? "border-red-400 bg-red-50 text-red-900 dark:bg-red-500/10 dark:text-red-200"
                      : "border-neutral-200 opacity-60 dark:border-white/10"
                    }`}
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-bold">{String.fromCharCode(65 + oi)}</span>
                    <span className="flex-1">{o}</span>
                    {state === "correct" && <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-label="Correct answer" />}
                    {state === "wrong" && <XCircle className="h-5 w-5 text-red-500" aria-label="Your answer (incorrect)" />}
                  </button>
                );
              })}
            </div>
            {picked !== null && q.explain && (
              <p className="mt-4 rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-700 dark:bg-white/5 dark:text-neutral-300" role="status">
                <span className="font-semibold">{picked === q.answer ? "Correct! " : "Not quite. "}</span>{q.explain}
              </p>
            )}
          </fieldset>
        );
      })}
      {done && (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-neutral-950 px-6 py-8 text-center text-white sm:flex-row sm:text-left" role="status">
          <div className="text-5xl font-bold text-prachetas-yellow tabular-nums">{score}/{questions.length}</div>
          <div className="flex-1">
            <p className="text-lg font-semibold">{score === questions.length ? "Perfect score — brilliant!" : score >= questions.length / 2 ? "Well done! You're on the right track." : "Good start — every question is a lesson."}</p>
            <p className="text-sm text-white/60">Share this quiz with someone who should take it too.</p>
          </div>
          <button onClick={() => setAnswers(questions.map(() => null))} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
        </div>
      )}
    </div>
  );
};
