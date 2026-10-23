# artiomleo.com

Personal portfolio. On desktop it's a design file: Home, Projects, Experience, About and Contact are frames on a canvas you can pan, zoom and fly between, and Dev Mode shows the real code and measurements behind any element. On phones and for search engines it's a normal, prerendered page per route.

## Stack

React 18, Vite 5, react-router 6, plain CSS with design tokens (Tailwind supplies the reset), Fontsource fonts, sugar-high, zod. Hosted on Netlify.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server on http://localhost:8080, or the next free port (client-rendered) |
| `pnpm build` | Client build, server build, then `scripts/prerender.mjs` writes one HTML file per route (with the main CSS inlined and the hero fonts preloaded), `404.html`, `sitemap.xml` and `_headers` |
| `pnpm preview` | Serves `dist/` on http://localhost:3000 (or the next free port) with clean URLs and the 404 page |
| `pnpm typecheck` / `pnpm lint` | TypeScript and ESLint |

## Where things live

- `src/content/` holds all copy. Client work uses the `ClientProject` type, which has no name, link or image fields. Keep client and product names out of the whole repo.
- `src/frames/` holds the five frames and the 404 page. Each renders in both layouts.
- `src/canvas/` holds the camera (pure math in `camera.ts`), input, frame layout, minimap, demo cursors and cursor chat.
- `src/devmode/` holds the inspector, loaded lazily. Code shown in Dev Mode comes from `#region layer:<id>` blocks in the real source files.
- `src/seo/` holds per-route titles, descriptions, share images and JSON-LD.
- `src/shell/` holds the top bar, frames panel, version history, theme toggle and shortcuts dialog.
- `src/layout/LayoutProvider.tsx` decides canvas or page layout, theme and reduced motion.
- `src/styles/` holds the design tokens and per-area CSS.
- `index.html` has the boot script that picks canvas or page layout before first paint. Its frame widths and paddings mirror `src/frames/registry.ts`, `--panel-w` in `src/styles/tokens.css` and `src/canvas/constants.ts`.

## Assets

- Icons: edit `scripts/brand/*.svg`, then run `scripts/brand/render.sh` (needs ImageMagick 7).
- Social images: run `pnpm dev`, then capture `scripts/og/og.html?frame=<id>` at 1200×630 with headless Chrome (see `docs/superpowers/plans/2026-10-23-canvas-redesign.md`, Task 18).
- Screenshots: side projects only, 1200×750, AVIF plus WebP in `public/images/projects/`.

## Environment

| Variable | Used by |
| --- | --- |
| `VITE_FORM_ID` | Formspree form ID for the contact form |
| `SLACK_WEBHOOK_URL` | `netlify/functions/report-error.mjs`, which reports failed form submissions. The old name `VITE_SLACK_WEBHOOK_URL` still works until it's renamed in Netlify. |
