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

## Collaborations
- Events are data-driven: add an entry to `src/data/collaborations.ts` and put media in `public/collaborations/<slug>/`.
- Video posters can be generated on macOS with `qlmanage -t -s 900 -o . video.mp4` (ffmpeg is not installed).
