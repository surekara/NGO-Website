# Prachetas Foundation website — agent notes

## Stack & deploy
- Vite + React + TypeScript + Tailwind + shadcn/ui + framer-motion.
- Deploys to Netlify automatically on push to `main` (live at https://prachetasfoundation.com).

## Verification
- Type check: `npx tsc -p tsconfig.app.json --noEmit` (should report 0 errors).
- Build: `npx vite build` (the `npm run build` script also installs Netlify function deps).
- Dev server: `npx vite --port 5173`.
- ESLint currently crashes due to a plugin version mismatch (pre-existing); don't rely on it.

## Conventions
- Shared animation toolkit: `src/components/motion.tsx` (SplitWords, SplitLetters, Tilt, RevealImage, SpotlightCard, Stagger/StaggerItem, CountUp, Magnetic, Parallax, Sparkles, Marquee, Shine, Shimmer, DrawLine, ScrollCue, FallingLeaves).
- Shared page building blocks: `src/components/PageFx.tsx` (PageHero, SectionTitle, CTASection, GlowBorder).
- Program pages (education/food/wellness) all render `src/components/ProgramDetail.tsx`.
- Route transitions (black/gold curtain) live in `src/App.tsx` (`AnimatedRoutes`); add new routes there.
- Use `overflow-x-clip` (not `overflow-x-hidden`) on page wrappers — `hidden` breaks the sticky header.
- Don't use dynamically built Tailwind class names (e.g. `md:justify-${x}`); write full class strings.

## Digital Daan (`/digital-daan`)
- Learning platform: Postgres (Netlify DB / Neon, `NETLIFY_DATABASE_URL`) + Netlify Functions + React pages.
- Backend lib: `netlify/lib/digital-daan/` (schema auto-creates `dd_*` tables + seeds on first request; `serialize.cjs` is the ONLY place rows become public JSON — keep private fields out).
- Functions: `dd-public` (read API, cached), `dd-submit` (submissions → always `under_review`), `dd-admin` (password + HMAC session), `dd-track` (analytics events), `dd-sitemap`.
- Edge function `netlify/edge-functions/dd-meta.ts` injects SEO/OG tags for `/digital-daan/*`.
- Frontend: `src/features/digital-daan/` (api.ts hooks, ui.tsx cards/layout, pages/, admin/). Routes are lazy-loaded in `src/App.tsx`.
- Env vars: `DIGITAL_DAAN_ADMIN_PASSWORD`, `DIGITAL_DAAN_SESSION_SECRET` (16+ chars), optional `DIGITAL_DAAN_NOTIFY_EMAIL` (+ existing SMTP_*).
- Local testing without Netlify CLI: run functions against embedded Postgres by calling `setQueryImpl()` from `netlify/lib/digital-daan/db.cjs` with a `pg` Pool, serve on :8888 (Vite proxies `/api`).
- Header nav collapses to the mobile menu below `xl` (1280px) — keep it that way when adding items.

## Collaborations
- Events are data-driven: add an entry to `src/data/collaborations.ts` and put media in `public/collaborations/<slug>/`.
- Video posters can be generated on macOS with `qlmanage -t -s 900 -o . video.mp4` (ffmpeg is not installed).
