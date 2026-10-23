# Portfolio redesign: Studio File canvas with Dev Mode

Date: 2026-10-23 · Status: design approved, ready for an implementation plan

## Goal

Replace the current portfolio design (Vue-green palette, stock photos, particle background) with a
"design file" experience. On desktop, the site is one canvas. Home, Projects, Experience, About and
Contact are frames that the camera flies between, and a Dev Mode toggle shows the real code and
measurements behind any element. On phones, and for search engines, it is a fast, fully readable
page. Content is rebuilt from the 2026 CV.

Everything ships in one pull request from the `redesign/canvas` branch.

## Decisions on record

- Direction: C1 "Studio File" from the round-4 prototype, with C3 "Dev Mode" as a toggle.
- Content source of truth: the 2026 CV. Anything not on it is listed below with its decision.
- Client work never shows client names, product names, links or screenshots, anywhere in the repo:
  code, alt text, image file names, commit messages and these docs. The repo is public.
- Side projects show their names and links.
- The owner's name, `contact@artiomleo.com`, and the employer names in the Experience timeline
  (Amdaris, BinarCode) stay as they are today.
- Google Analytics stays exactly as it is now: same GA4 snippet, no consent prompt, no replacement.
- The CV download stays a Google Drive link. The owner swaps in the 2026 PDF; the URL in code only
  changes if the owner provides a new one.
- No automated test suites in this PR. Verification is lint, type check, build, a manual browser
  checklist and Lighthouse in Chrome (see Verification).
- Stay on React 18, Vite 5, Tailwind 3 and react-router 6. No framework upgrades.

## Content

### Positioning

- Name: Artiom Leontiev
- Title: Senior Frontend Engineer · AI-powered applications
- Headline (the home `h1`): "Artiom Leontiev builds web products, *and the AI behind them.*"
- Lede: "7+ years of Vue and React, and since 2025 the AI layer behind them: LLM integrations, RAG,
  agents and MCP servers. Based in Cluj-Napoca, Romania."
- Experience length: "7+ years" (the current site says 6+).
- Hero actions: "See projects" (to `/projects`) and "Get in touch" (to `/contact`).

### Experience

1. **Senior Frontend Engineer · Amdaris · Cluj-Napoca · 2022 to present**, with three nested
   engagements:
   - *AI products and internal AI tooling, 2025 to present.*
     - Took an AI case-study generator to production. Case studies went from days of manual writing
       to minutes, and the tool is used by Sales and Marketing. Built the React app and co-built the
       RAG service (Azure OpenAI).
     - Built and self-hosted an MCP server that gives Claude Code and GitHub Copilot access to the
       company's agent-skill library. Load-tested it to 100 concurrent users at about 70 ms median
       latency.
     - Wrote reusable Claude Code and Copilot agent skills, including a code-review skill that must
       cite evidence for every finding.
     - Built frontend features for an AI-assisted software-delivery platform, including
       human-in-the-loop approval of changes that AI agents propose.
   - *Frontend lead, sustainability-compliance SaaS, 2025 to 2026.*
     - Designed a React 19 micro-frontend architecture (Module Federation) with a shared design
       system, role-based access and a typed API client.
     - Brought AI-assisted delivery to the team: Claude Code commands for end-to-end testing and
       code review, and an agent-driven story and QA workflow (BMAD).
   - *Frontend lead, occupational-health platform, 2023 to 2025.*
     - Designed a Vue 3 and Vite micro-frontend architecture with a configurable dynamic-form
       engine. The platform passed a WCAG 2.1 AA audit.
     - Managed and mentored 4 developers, and ran code reviews, trainings and hiring interviews.
2. **Full-Stack Engineer · BinarCode · Cluj-Napoca · 2019 to 2022.** The four CV bullets: the
   fertility-clinic platform, the job-board builder, the copywriting tool, and Vue, Laravel and
   MySQL apps for clients in the USA, UK and the Netherlands.
3. **Education:** BEng, Automation and Computer Science, Technical University of Cluj-Napoca,
   2015 to 2019. It is shown in the About frame, and listed in the version history.

The 2018–2019 freelance entry is removed, because the CV starts in 2019.

### Projects

**Side projects.** These are named and linked, with real screenshots captured from the live sites.

| Project | Years | Role | Links | Stack tags |
| --- | --- | --- | --- | --- |
| Klipsy: AI social content studio | 2026 to present | Lead engineer | theklipsy.com | Vue 3, TypeScript, OpenAI, Gemini, MCP, OAuth 2 |
| Council: AI journaling app for iOS | 2026 | Founder and sole developer | council.artiomleo.com, apps.apple.com/app/id6781214823 | Flutter, Swift, Gemini, Mistral |
| AskManu: AI coding assistant | 2024 to 2025 | Sole frontend developer, two-person team | askmanu.co | Vue 3, CodeMirror, streaming AI chat |

Descriptions follow the CV bullets.
- **Klipsy:** the brand-brief pipeline that drives per-platform writer agents, which halved repetitive
  posts; a 45-tool MCP server secured with OAuth 2 and protections against prompt injection and SSRF;
  and per-model LLM cost tracking that corrected a 37× overstatement.
- **Council:** a multi-persona LLM panel, a Gemini-to-Mistral failover gateway, an AI-safety layer
  that detects crisis content, 8 languages, and a Lighthouse 95+ marketing site.
- **AskManu:** streaming chat, a CodeMirror editor, GitHub repository connection and an embeddable
  chat widget.

**Client work.** No names, no links, no screenshots. Each card has a drawn wireframe thumbnail that
does not reproduce the real UI.

| Card title | Years | Stack tags | Key point |
| --- | --- | --- | --- |
| AI case-study generator | 2025 | React, TypeScript, RAG, Azure OpenAI | Days of writing down to minutes |
| Agent-skill MCP server | 2026 | Node.js, MCP, Docker | 100 concurrent users at about 70 ms median, plus agent skills for Claude Code and Copilot |
| AI-assisted software-delivery platform | 2025 to 2026 | React, TypeScript | Human-in-the-loop approval of agent-proposed changes |
| Sustainability-compliance SaaS | 2025 to 2026 | React 19, Module Federation, design system | Micro-frontends, role-based access, typed API client |
| PDF digital-signing library | 2026 | .NET, Docker, Azure Key Vault | PAdES B, T, LT and LTA levels under eIDAS, verified with pdfsig; multiple signatures; Key Vault as the certificate source; NuGet and Docker packaging |
| Occupational-health platform | 2023 to 2025 | Vue 3, Vite, micro-frontends, Pinia | Dynamic-form engine, passed a WCAG 2.1 AA audit, led 4 developers |
| Fertility-clinic platform | 2019 to 2022 | Vue 3, Laravel, Inertia.js, MySQL, AWS | Kit-processing and shipping automated: 50% less paperwork, 20% better retention |
| Multi-site job-board builder | 2019 to 2022 | Nuxt, Vue, Tailwind, multi-tenancy | Per-site DNS mapping; SSR and SEO work raised the SEO score by 30% |
| Copywriting tool | 2019 to 2022 | Content-generation APIs, Stripe | Led a 2-developer team |
| License-management platform | 2019 to 2022 | Vue.js, Tailwind, WebSockets | A suite of apps that helps enterprises cut licensing costs |

Removed from the current site: One More Plate (no live link); the occupational-health, fertility-clinic
and license-management client links; and the old fertility-clinic project title. Also left out: a receipt-scanning
side project, a real-estate tracker with no commits under the owner's name, and any repo with fewer
than 20 of the owner's commits.

### About

- A short bio from the CV summary, and the portrait (`public/images/portrait.jpg`, re-encoded).
- Skills in the five CV groups: Core, AI engineering, AI-assisted development, Testing, Working
  knowledge.
- Certifications: NVIDIA Deep Learning Institute, *Building RAG Agents with LLMs* (2025). Anthropic
  Academy, *Claude with the Anthropic API*, *Claude Code in Action*, *Introduction to Model Context
  Protocol* and *Introduction to Agent Skills* (2026).
- Languages: English (advanced) and Romanian (native).
- A "Download CV" link to the Google Drive file.

### Contact

- The Formspree form, with the existing form ID, and the name, email and message fields. It posts
  to Formspree's JSON endpoint with `fetch`, which replaces `@formspree/react`.
- Links to email (`contact@artiomleo.com`), LinkedIn and GitHub. The `mailto:hello@example.com`
  placeholder is removed.

### Canvas annotations

Sticky notes and comment pins only carry facts that also appear in a frame: the WCAG 2.1 AA audit,
4 developers mentored, the MCP server at 100 users and about 70 ms, case studies cut from days to
minutes, the 37× cost fix, and Council in 8 languages. They are decorative duplicates and are hidden
from assistive technology.

## Experience design

### Two layouts

The prerendered HTML ships with `<html data-layout="page">`. A small synchronous boot script in
`<head>` switches it to `canvas` before the first paint, when canvas applies.
- **page**: the viewport is under 1024px wide, or the primary pointer is coarse, or the visitor chose
  Page view (stored in `localStorage`), or JavaScript is off.
- **canvas**: every other case.

The same script sets `data-theme="light|dark"`: the stored choice first, then the system preference.

### Canvas layout (desktop)

**Chrome**, all server-rendered except the version history, minimap and demo cursors:
- Top bar: the file name "artiom-leontiev / portfolio" and an avatar stack of the demo cursors, whose
  tooltip reads "Demo cursor". It also has toggles for Dev Mode, Page view and theme, and a primary
  "Contact" button.
- Left panel with two stacked sections:
  - Frames: the five frames, as the site navigation.
  - Version history: the Experience entries and education as versions; clicking one flies to it.
- Bottom left: a minimap that you click to jump. Bottom right: zoom controls (−, percentage, +, Fit),
  with the zoom announced politely to screen readers once it settles.
- No third-party product names or logos.

**World:**
- The five frames sit on a dot-grid canvas in three columns:
  - Home above Experience
  - Projects, which is tall
  - About above Contact
- Frame widths are fixed: Home 960, Projects 1040, Experience 880, About 880, Contact 640. These
  keep the text close to 100% zoom on laptop screens.
- Heights are measured, and the gaps are 160px.
- Each frame has a label above its top-left corner, like a design-tool frame name.
- Home, Projects, Experience and About each have one sticky pinned over the frame's top-right corner,
  and one comment target that the PM cursor pins a comment on. Contact has neither.

**Camera:**
- Focusing a frame fits its width into the space between the panels, never zooms above 100%, and
  aligns to the frame's top.
- A two-finger scroll or the mouse wheel pans, which is how long frames are read.
- Ctrl/⌘ with the wheel, or a pinch, zooms at the pointer, between 10% and 200%.
- Drag pans. Fit (the `0` key) shows all frames.
- Flights between frames take about 1 second, with log-scale zoom and a slight zoom-out dip, as in
  the prototype's `CanvasKit`.
- At rest, translations are rounded to whole pixels and `will-change` is removed, so text stays
  crisp.

**Routing:**
- Navigation changes the URL and flies the camera. Panning never changes the URL.
- On first load, the camera starts on the route's frame without a flight.

**Demo cursors:**
- Three scripted cursors loop every 14 seconds on the frame the route points at:
  - "Designer" selects the frame title.
  - "PM" pins that frame's comment.
  - "Artiom" drags that frame's sticky.
- They pause while the visitor is interacting and resume after 6 idle seconds.
- They also pause when the tab is hidden.
- Under reduced motion and while Dev Mode is on, the cursors are hidden and the current frame's
  comment pin is shown without motion.
- Cursor colours: `#D92D72`, `#6A4DF5` and `#FFAA00`. The amber cursor uses dark label text.

**Cursor chat:**
- Pressing `/` opens a "Guest" bubble at the visitor's pointer.
- Enter flies to Contact and pre-fills the message field. Esc closes the bubble.

**First paint:**
- In canvas layout, the prerendered route frame is styled so it sits exactly where the camera will
  land.
- After hydration, the other frames, the minimap and the cursors mount and the layout is measured.
  The route frame does not move. Stickies are part of each frame's markup: page layout hides them,
  and the canvas shows them from the first paint, so nothing pops in.
- The layout is measured and the camera placed in a layout effect, before the browser paints.

### Page layout (phones, tablets, Page view, no JavaScript)

- One frame per URL, in normal document flow, with a sticky frame bar (Home · Projects · Experience ·
  About · Contact) made of real links.
- Each frame ends with a "Next: <frame>" link.
- No pan or zoom, demo cursors, stickies or cursor chat.
- The design language stays: frame labels, the dot-grid page background and the selection colour.

### Dev Mode

**Toggle:** the top-bar switch or the `D` key. Esc exits Dev Mode.

**Inspecting layers:**
- While Dev Mode is on, hovering a registered layer outlines it in the selection colour with a name
  tag. Clicking selects it.
- Inside frames, clicks select layers instead of following links. Chrome links and buttons, such as
  the frames panel and version history, keep working and also select their layer.

**Inspect panel**, on the right in canvas layout and as a bottom sheet in page layout:
- The layer name, such as "Button / Primary", and its source file path.
- Size: width × height measured from the live layout and divided by the zoom.
- Typography: family, size and line height, weight.
- Padding.
- Colour tokens: computed colours mapped back to their token names.
- Code: the real component source, imported at build time with Vite `?raw` and cut to a
  `// #region layer:<id>` … `// #endregion` block, so it cannot drift from what renders. It is
  highlighted with `sugar-high`.

**Registered layers:**
- Navigation, frame label, hero title, hero lede, primary button, project card, stack tag
- Experience entry, version-history item, contact field, sticky, comment pin

**Accent demo:**
- Runs in canvas layout when Dev Mode is on and the visitor has been idle for 4 seconds.
- The "Artiom" cursor retypes the `--accent` token through four swatches, then back to violet, and
  the site recolours live.
- Visitors can apply the same four swatches. Their choice is not saved.
- Each swatch has a light-theme and a dark-theme value. Each value passes 4.5:1 both as text on
  `site-bg` and as a button fill with its button text colour: white in light, `#141414` in dark.

| Swatch | Light (white text) | Dark (`#141414` text) |
| --- | --- | --- |
| Violet (default) | #6A4DF5 (5.26:1) | #A08CFF (6.75:1) |
| Pink | #D92D72 (4.60:1) | #F06A9B (6.35:1) |
| Blue | #0A74D1 (4.74:1) | #4DA3FF (7.02:1) |
| Orange | #C2410C (5.18:1) | #F5894A (7.51:1) |

**Auto-select:**
- In canvas layout, when the visitor is idle in Dev Mode, the "Designer" cursor selects a new
  layer every 3.6 seconds.
- The 14-second canvas loop pauses while Dev Mode is on. Only the accent demo and auto-select run.

**Loading:** the inspector, the highlighter and the raw sources load as a lazy chunk the first time
Dev Mode is switched on. The `data-layer` attributes are always in the markup.

### Motion and accessibility

- `prefers-reduced-motion`:
  - Camera flights become jumps.
  - Demo cursors, the accent demo and auto-select are off.
  - Hover transitions are instant.
- Keyboard:
  - A skip link goes to the main content.
  - Landmarks: header (top bar), nav (frames panel or frame bar), main (world), aside (inspector).
  - Each frame is a `<section aria-labelledby>`. On the canvas, Home's title is the only `h1`.
    In page layout, where each URL shows one frame, that frame's title is the `h1`. Headings
    below it shift to match.
  - In canvas layout, focusing an element outside the visible area moves the camera to it.
- Shortcuts:
  - `1`–`5` jump to frames, `0` fits all, `+`/`−` zoom, `D` toggles Dev Mode, `/` opens cursor
    chat, `?` lists the shortcuts, `Esc` exits.
  - Arrow keys move the canvas, Page Up/Page Down and Space move by a screen, and Home/End go to the
    top or bottom of the current frame.
  - Inside the Dev Mode panel, arrow, Page, Home, End and Space keys scroll the panel instead.
  - All are ignored while focus is in an input, textarea or contenteditable element.
- Focus rings use the selection colour (`#0A74D1` light, `#3D9BFF` dark) at 2px with an offset.
- Demo cursors, stickies, comment pins and the minimap are `aria-hidden`.
- All text meets 4.5:1 contrast (see Tokens).

## Visual tokens

These replace the current Tailwind palette, defined as CSS variables on `:root` and `[data-theme=dark]`.
Tailwind supplies only its preflight reset; no utility classes are generated, so none can clash with the
site's own class names.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| site-bg | #FFFFFF | #141414 | Frame background |
| site-text | #141414 | #F4F4F4 | Body text |
| site-muted | #5F5F5F (6.39:1) | #A8A8A8 (7.75:1) | Secondary text |
| accent | #6A4DF5 (5.26:1) | #A08CFF (6.75:1) | Links, primary buttons |
| site-line | #D6D6D6 | #3A3A3A | Rules, card borders |
| site-soft | #F1EEFF | #231F33 | Tag and highlight fills |
| tool-bg | #F5F5F5 | #1E1E1E | Canvas |
| tool-dot | #D2D2D2 | #3A3A3A | Dot grid |
| tool-ui | #FFFFFF | #2C2C2C | Panels and top bar |
| tool-text | #1E1E1E | #F5F5F5 | Panel text |
| tool-muted | #6B6B6B (4.89:1) | #A3A3A3 (6.61:1) | Panel secondary text |
| tool-line | #E2E2E2 | #3B3B3B | Panel borders |
| select | #0A74D1 | #3D9BFF | Selection, focus |
| sticky | #FFE27A | #F2D46A | Sticky notes (dark text, 13:1) |

On dark, primary buttons use `#141414` text on `#A08CFF`. Type:
- **Instrument Serif** (regular and italic) for display headings.
- **Onest** (variable) for body and UI text.
- **JetBrains Mono** (variable) for code, specs and frame labels.

All fonts are self-hosted through Fontsource, split by `unicode-range` so only the Latin and Latin
Extended files download for this content, with `font-display: swap`. The hero display face is preloaded
(its italic too, on Home and Projects), and the prerender step inlines the main stylesheet into each page.

## Architecture

### Rendering

- The client build is unchanged: `vite build`.
- Then an SSR build of `src/entry-server.tsx` runs. It exports `render(url)`, which uses
  `renderToString` with `StaticRouter`.
- Then `scripts/prerender.mjs` runs. For each route in `src/seo/routes.ts`, it:
  - renders the app;
  - injects the HTML and the route's head tags into `dist/index.html`;
  - writes `dist/<route>.html`, so Netlify serves `/projects` without a trailing-slash redirect;
  - writes `dist/404.html` from the not-found route;
  - generates `sitemap.xml` and the CSP header file (see Netlify).
- No new rendering dependencies.
- `src/main.tsx` hydrates when the root has prerendered children, and mounts normally in `vite dev`.
- Server and first client render are identical: chrome plus the route's frame. Canvas-only parts
  mount after hydration, which avoids mismatches.

### Units

| Path | Responsibility |
| --- | --- |
| `src/content/` | Typed content: profile, experience, projects, skills, certifications, education, languages, annotations, version history. The only place copy lives. `ClientProject` has no name, URL or image fields, so client details cannot be added by mistake. |
| `src/canvas/camera.ts` | Pure camera math: fit a frame or rectangle, interpolate flights, zoom at a point, screen and world conversions. |
| `src/canvas/` | `CanvasRoot` (layout, camera, route sync, focus-follow, canvas API), `controller.ts`, `input.ts`, `useCanvasShortcuts`, `ZoomControls`, `Minimap`, `DemoCursors` with `timeline.ts`, `CursorChat`. The camera writes transforms straight to the DOM in `requestAnimationFrame`, not through React state. |
| `src/frames/` | `Frame` (wrapper, label, sticky, heading levels), `Home`, `Projects`, `Experience`, `About`, `Contact` (with `contact/` form logic and a lazily loaded zod schema), `NotFound`. Each renders in both layouts. |
| `src/shell/` | `Shell`, `TopBar`, `FramesNav`, `VersionHistory`, `ThemeToggle`, `ShortcutsDialog`, `Mark`. |
| `src/devmode/` | `DevModeProvider` and swatches (always loaded); `layers.ts`, `Inspector`, `CodeView`, measurement, sources and the demo hooks (lazy chunk). |
| `src/seo/` | `routes.ts` (path, frame, title, description, OG image), head-tag builder, JSON-LD builders, `useRouteMeta` for client-side navigation. |
| `src/layout/` | `LayoutProvider`: mounted, canvas capability, Page view, theme and reduced motion. The boot script lives inline in `index.html`. |

### Routes

| Path | Frame |
| --- | --- |
| `/` | Home |
| `/projects` | Projects |
| `/experience` | Experience |
| `/about` | About |
| `/contact` | Contact |
| `*` | NotFound ("Frame not found", with links to the five frames) |

`/home` gets a 301 redirect to `/`.

## SEO and metadata

**Head tags** for each route, in the prerendered HTML and updated on client navigation:
- title, meta description, canonical URL
- `og:title`, `og:description`, `og:url`, `og:image` (absolute https), `og:type`
- `twitter:card=summary_large_image`

| Route | Title | Description |
| --- | --- | --- |
| `/` | Artiom Leontiev · Senior Frontend Engineer, AI-powered apps | Senior frontend engineer in Cluj-Napoca building AI-powered web apps with React and Vue: LLM integrations, RAG, agents and MCP servers. |
| `/projects` | Projects · Artiom Leontiev | Side projects including Klipsy and Council, plus client work in AI tooling, micro-frontends and accessible healthcare platforms. |
| `/experience` | Experience · Artiom Leontiev | 7+ years at Amdaris and BinarCode: AI products, frontend leadership on micro-frontend platforms, and full-stack Vue and Laravel work. |
| `/about` | About · Artiom Leontiev | Skills, certifications and background: Vue, React, TypeScript, AI engineering with Claude and OpenAI, accessibility and web performance. |
| `/contact` | Contact · Artiom Leontiev | Get in touch with Artiom Leontiev about frontend architecture, React and Vue work, or AI product engineering. Based in Cluj-Napoca, Romania. |

**OG images:** five static 1200×630 PNGs in `public/og/`. Each shows the name, the frame title and the
amber "Artiom" demo cursor, in the site style.

**JSON-LD:**
- `Person`: name, URL, image (portrait), jobTitle "Senior Frontend Engineer", `knowsAbout`,
  `alumniOf` (Technical University of Cluj-Napoca), `address` (Cluj-Napoca, RO), and `sameAs` GitHub
  and LinkedIn. Twitter is removed.
- `WebSite` and `ProfilePage` on `/`.

**Crawling:**
- `sitemap.xml` is generated at build with the five URLs and `lastmod`.
- `robots.txt` becomes `User-agent: *` / `Allow: /` / `Sitemap:`.
- `_redirects` drops the `/* /index.html 200` catch-all. Unknown paths get Netlify's `404.html` with
  a real 404 status. `/home` gets a 301 to `/`.

**Other head tags and assets:**
- `<meta name="theme-color">` for light (`#F5F5F5`) and dark (`#1E1E1E`), and `color-scheme`.
- Images use AVIF with a WebP fallback, explicit width and height, and lazy loading below the fold.
- The stock photos and the devicon CDN are removed. Stack tags are text.

**Search-engine behaviour:** in page layout, each URL holds only its own frame, so every URL has
distinct content. Google renders with a mobile viewport, so it sees the page layout.

## Favicons and mark

The mark is a violet canvas cursor. It replaces the green "AL" square.

| File | Content |
| --- | --- |
| `favicon.svg` | White cursor on a `#6A4DF5` rounded square; `#A08CFF` square under `prefers-color-scheme: dark` |
| `favicon.ico` | Same mark at 16, 32 and 48px |
| `apple-touch-icon.png` | 180px, cursor with an "AL" name tag, opaque background |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Manifest icons; the maskable one keeps the mark inside the safe zone |
| `site.webmanifest` | Name "Artiom Leontiev", short name "Artiom", theme and background colours |

`logo.svg` is removed.

## Netlify and security

**`netlify.toml`:** build command `pnpm build`, publish directory `dist`, and Node 22.

**Headers**, all written by the prerender script into `dist/_headers`, so that one file holds the CSP
hashes:
- HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a
  `Permissions-Policy` that disables unused features.
- Long-lived immutable caching for `/assets/*`. HTML keeps Netlify's default of no caching.

**Content security policy:**
- `script-src`: `'self'`, Google Tag Manager, and sha256 hashes of the two inline scripts (the boot
  script and the unchanged GA snippet).
- `connect-src`: `'self'`, Formspree and Google Analytics.
- `img-src`: `'self'`, `data:` and Google Analytics.
- `font-src`: `'self'` and `data:` (Vite inlines font subsets under 4 KB).
- `style-src`: `'self' 'unsafe-inline'`.
- `frame-ancestors`: `'none'`.

**`netlify/functions/report-error.mjs`:**
- Accepts POST only, with a JSON body under 4 KB in the expected shape.
- Rejects requests whose Origin is not artiomleo.com or a Netlify deploy preview.
- Reads `SLACK_WEBHOOK_URL`, falling back to `VITE_SLACK_WEBHOOK_URL` until the owner renames the
  variable in Netlify.

**Contact form:**
- zod validation with clear field errors and a hidden honeypot field.
- Explicit sending, sent and failed states. Failures are still reported through the function.

## Cleanup

- Remove the dependencies the new code does not import: the unused shadcn/Radix packages, recharts,
  embla, react-query, vaul, cmdk, date-fns, input-otp and the rest. Keep only the `src/components/ui`
  files that are used.
- Remove `ParticleBackground`, `CustomCursor`, `ScrollProgress`, `RevealOnScroll`, `App.css`,
  `Index.tsx`, the Outfit fonts, the stock images and `logo.svg`.
- Keep pnpm as the package manager and delete `bun.lockb`. `pnpm-lock.yaml` is the lockfile that has
  been kept up to date.
- `Navbar`, `Footer`, `Layout`, `ThemeProvider`, `ThemeToggle` and `src/pages/*` are replaced by
  the new modules.
- Rewrite `README.md` for the new architecture and scripts.

## Verification

There are no automated test suites. Before the PR is opened:

1. `pnpm lint`, `tsc --noEmit` and `pnpm build` pass.
2. Checks on the built HTML: each route's `dist/<route>.html` contains its frame's content and
   head tags, `404.html` exists, and `sitemap.xml` lists five URLs.
3. Manual browser checks on `pnpm preview`:
   - The canvas: flights, URL sync, focus following, Dev Mode values and code, cursor chat to
     Contact.
   - The page layout at 390px with no horizontal scroll.
   - Reduced motion.
   - Both themes.
   - JavaScript disabled.
4. Lighthouse in Chrome DevTools on `/` and `/projects`, mobile and desktop. Targets: Performance 95
   or higher, and 100 for Accessibility, Best Practices and SEO. Results go in the PR description.
5. A final search of the diff for client names, client domains and personal email addresses, which
   must return nothing.

## Out of scope

- Real multiplayer. The cursors are scripted.
- Separate case-study pages for projects.
- Rewriting git history to remove the client links in old commits.
- Upgrading React, Vite, Tailwind or react-router.
