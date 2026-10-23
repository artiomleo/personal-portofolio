# Canvas Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a "design file" canvas on desktop (frames you fly between, plus a Dev Mode inspector) and a fast, prerendered page layout on phones and for crawlers, with new content, SEO, icons and Netlify config, all in one PR.

**Architecture:** Vite + React 18 SPA, prerendered at build time by our own script (`vite build --ssr` plus `scripts/prerender.mjs`), so every route ships its own HTML. The markup is identical in both layouts. A synchronous boot script in `index.html` picks `data-layout="canvas|page"` before first paint, and canvas-only parts mount after hydration. Content lives in typed data under `src/content/`. The camera math is pure functions; a small controller class writes transforms straight to the DOM.

**Tech Stack:** React 18, react-router-dom 6, Vite 5, Tailwind 3 (preflight only), plain CSS with design tokens, Fontsource (Onest, Instrument Serif, JetBrains Mono), sugar-high, zod, lucide-react, Netlify (static hosting plus one function), ImageMagick and headless Chrome for assets.

**Spec:** `docs/superpowers/specs/2026-10-23-canvas-redesign-design.md`

**Owner decisions that change the usual process:**
- No automated test suites. Every task ends with `pnpm typecheck`, `pnpm lint` and, where noted, `pnpm build`, plus a browser check with the expected result.
- Google Analytics stays as it is now.
- Client work never carries client names, product names, links or screenshots. That covers code, alt text, file names, commit messages and these docs.
- No AI attribution in commits or the PR.

**Conventions:**
- Run every command from the repo root.
- `pnpm dev` serves on http://localhost:8080.
- After Task 12, `pnpm preview` serves the built site on http://localhost:3000.
- Commit after each task with the message given. Never add a `Co-Authored-By` trailer.

---

## File map

| Path | Responsibility |
| --- | --- |
| `index.html` | Template: boot script, head placeholders, icons, GA snippet |
| `vite.config.ts` | Alias, dev server, SSR bundling of lucide-react |
| `netlify.toml` | Build command, publish dir, Node version |
| `public/_redirects`, `public/robots.txt` | `/home` 301; crawl rules |
| `public/favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-*.png`, `site.webmanifest` | Icons |
| `public/og/*.png` | Social preview images |
| `public/images/portrait.{avif,webp}`, `public/images/projects/*.{avif,webp}` | Photos and screenshots |
| `scripts/prerender.mjs` | Writes per-route HTML, `404.html`, `sitemap.xml`, `_headers` |
| `scripts/brand/*` | Icon SVG sources and `render.sh` |
| `scripts/og/og.html` | Social image template (dev server only) |
| `netlify/functions/report-error.mjs` | Hardened Slack reporter |
| `src/main.tsx`, `src/entry-server.tsx`, `src/App.tsx` | Client entry (hydrate), server entry, providers |
| `src/index.css`, `src/styles/*.css` | Tokens, base, per-area styles |
| `src/content/*` | All copy and data |
| `src/frames/*` | Frame wrapper, the five frames, 404, shared UI, wireframes, contact form hook |
| `src/shell/*` | Top bar, frames nav, version history, theme toggle, shortcuts dialog, mark, Shell |
| `src/layout/LayoutProvider.tsx` | Mounted, canCanvas, Page view, theme, reduced motion |
| `src/canvas/*` | Constants, camera math, controller, input, layout, CanvasRoot, zoom, minimap, shortcuts, demo cursors, cursor chat |
| `src/devmode/*` | Provider, swatches, layer registry, inspector, measurement, sources, code view, demos |
| `src/seo/*` | Routes meta, head tags, JSON-LD, client meta updates |
| `src/lib/*` | `cx`, storage, keys, isomorphic layout effect |

---

### Task 1: Remove the old UI and unused dependencies

**Files:**
- Delete: `src/components/` (all), `src/hooks/`, `src/pages/`, `src/Layout.tsx`, `src/App.css`, `src/lib/utils.ts`, `components.json`, `bun.lockb`
- Delete: `public/images/code-display.webp`, `public/images/medical-worker-workstation.webp`, `public/images/open-macbook-code.webp`, `public/images/silver-laptop-charts.webp`, `public/images/silver-laptop-dark-background.webp`, `public/images/workstation-green-background.webp`
- Modify: `package.json` (dependencies and scripts)
- Replace: `src/App.tsx`

- [ ] **Step 1: Delete the old UI and stock images**

```bash
git rm -r -q src/components src/hooks src/pages src/Layout.tsx src/App.css src/lib/utils.ts components.json bun.lockb
git rm -q public/images/code-display.webp public/images/medical-worker-workstation.webp public/images/open-macbook-code.webp public/images/silver-laptop-charts.webp public/images/silver-laptop-dark-background.webp public/images/workstation-green-background.webp
```

- [ ] **Step 2: Write a temporary `src/App.tsx`** (Task 11 replaces it)

```tsx
export default function App() {
  return (
    <main id="main">
      <p>Rebuilding.</p>
    </main>
  );
}
```

- [ ] **Step 3: Install, then remove unused packages and add the new ones**

```bash
pnpm install
pnpm remove @formspree/react @hookform/resolvers @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip @tanstack/react-query class-variance-authority clsx cmdk date-fns embla-carousel-react input-otp next-themes react-day-picker react-hook-form react-resizable-panels recharts sonner tailwind-merge tailwindcss-animate vaul @tailwindcss/typography
pnpm add @fontsource-variable/onest @fontsource/instrument-serif @fontsource-variable/jetbrains-mono sugar-high
```

Expected: both commands finish without errors. `package.json` dependencies are now exactly: `@fontsource-variable/jetbrains-mono`, `@fontsource-variable/onest`, `@fontsource/instrument-serif`, `lucide-react`, `react`, `react-dom`, `react-router-dom`, `sugar-high`, `zod`.

- [ ] **Step 4: Replace the `scripts` block in `package.json`**

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit -p tsconfig.app.json",
    "preview": "pnpm dlx serve@14 dist"
  },
```

Also change `"version": "0.0.1"` to `"version": "1.0.0"`.

- [ ] **Step 5: Verify**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all three pass. `dist/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove the old UI and unused dependencies"
```

---

### Task 2: Design tokens, fonts and base styles

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`
- Replace: `src/index.css`, `tailwind.config.ts`, `src/main.tsx`, `src/vite-env.d.ts`
- Delete: `public/fonts/`

- [ ] **Step 1: Create `src/styles/tokens.css`**

```css
/* Design tokens. Light is the default; dark applies through data-theme on <html>. */
:root {
  --site-bg: #FFFFFF;
  --site-text: #141414;
  --site-muted: #5F5F5F;
  --site-line: #D6D6D6;
  --site-soft: #F1EEFF;
  --accent: #6A4DF5;
  --on-accent: #FFFFFF;

  --tool-bg: #F5F5F5;
  --tool-dot: #D2D2D2;
  --tool-ui: #FFFFFF;
  --tool-ui-2: #F4F4F6;
  --tool-text: #1E1E1E;
  --tool-muted: #6B6B6B;
  --tool-line: #E2E2E2;
  --select: #0A74D1;
  --on-select: #FFFFFF;
  --sticky: #FFE27A;
  --sticky-text: #2A2410;
  --field-line: #8A8A8A;
  --danger: #B42318;

  --cursor-designer: #D92D72;
  --cursor-pm: #6A4DF5;
  --cursor-artiom: #FFAA00;

  --tk-keyword: #C2185B;
  --tk-string: #8A5A00;
  --tk-property: #0B63B6;
  --tk-value: #B54708;
  --tk-comment: #646977;

  --font-display: "Instrument Serif", Georgia, serif;
  --font-ui: "Onest Variable", system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, Menlo, monospace;

  --bar-h: 48px;
  --panel-w: 232px;
  --radius: 8px;

  color-scheme: light;
}

[data-theme="dark"] {
  --site-bg: #141414;
  --site-text: #F4F4F4;
  --site-muted: #A8A8A8;
  --site-line: #3A3A3A;
  --site-soft: #231F33;
  --accent: #A08CFF;
  --on-accent: #141414;

  --tool-bg: #1E1E1E;
  --tool-dot: #3A3A3A;
  --tool-ui: #2C2C2C;
  --tool-ui-2: #232327;
  --tool-text: #F5F5F5;
  --tool-muted: #A3A3A3;
  --tool-line: #3B3B3B;
  --select: #3D9BFF;
  --on-select: #0B1220;
  --sticky: #F2D46A;
  --field-line: #767676;
  --danger: #FF8A80;

  --cursor-artiom: #FFB524;

  --tk-keyword: #FF7AB2;
  --tk-string: #FFD27A;
  --tk-property: #7CC4FF;
  --tk-value: #FFB86B;
  --tk-comment: #8E929E;

  color-scheme: dark;
}

/* Dev Mode accent swatches. Each value keeps 4.5:1 with its button text and as text on site-bg. */
[data-accent="pink"] { --accent: #D92D72; }
[data-accent="blue"] { --accent: #0A74D1; }
[data-accent="orange"] { --accent: #C2410C; }
[data-theme="dark"][data-accent="pink"] { --accent: #F06A9B; }
[data-theme="dark"][data-accent="blue"] { --accent: #4DA3FF; }
[data-theme="dark"][data-accent="orange"] { --accent: #F5894A; }
```

- [ ] **Step 2: Create `src/styles/base.css`**

```css
html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  font-family: var(--font-ui);
  font-size: 16px;
  line-height: 1.5;
  color: var(--site-text);
  background: var(--tool-bg);
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; }
button { font: inherit; color: inherit; }
img { max-width: 100%; height: auto; }
kbd { font-family: var(--font-mono); font-size: 0.85em; }

:focus-visible {
  outline: 2px solid var(--select);
  outline-offset: 2px;
  border-radius: 2px;
}

.skip-link {
  position: fixed;
  left: 12px;
  top: 8px;
  z-index: 100;
  padding: 8px 14px;
  border-radius: var(--radius);
  background: var(--select);
  color: var(--on-select);
  font-weight: 600;
  text-decoration: none;
  transform: translateY(-160%);
}
.skip-link:focus { transform: none; }

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Replace `src/index.css`**

```css
@import "tailwindcss/base";
@import "./styles/tokens.css";
@import "./styles/base.css";
@import "tailwindcss/utilities";
```

- [ ] **Step 4: Replace `tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";

// Tailwind supplies the preflight reset; components use the plain CSS in src/styles.
export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        site: {
          bg: "var(--site-bg)",
          text: "var(--site-text)",
          muted: "var(--site-muted)",
          line: "var(--site-line)",
          soft: "var(--site-soft)",
        },
        accent: { DEFAULT: "var(--accent)", on: "var(--on-accent)" },
        tool: {
          bg: "var(--tool-bg)",
          ui: "var(--tool-ui)",
          text: "var(--tool-text)",
          muted: "var(--tool-muted)",
          line: "var(--tool-line)",
        },
        select: "var(--select)",
      },
      fontFamily: {
        display: "var(--font-display)",
        ui: "var(--font-ui)",
        mono: "var(--font-mono)",
      },
    },
  },
} satisfies Config;
```

- [ ] **Step 5: Replace `src/main.tsx`** (Task 11 adds the router and hydration)

```tsx
import { createRoot } from "react-dom/client";
import "@fontsource-variable/onest/wght.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

- [ ] **Step 6: Replace `src/vite-env.d.ts`**

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- [ ] **Step 7: Delete the Outfit fonts and check the hero font file name**

```bash
git rm -r -q public/fonts
ls node_modules/@fontsource/instrument-serif/files | grep latin-400-normal
```

Expected: the list includes `instrument-serif-latin-400-normal.woff2`. Task 12 preloads this file.

- [ ] **Step 8: Verify**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all pass. `ls dist/assets | grep woff2` lists the Onest, Instrument Serif and JetBrains Mono files.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add design tokens, self-hosted fonts and base styles"
```

---

### Task 3: Content model

**Files:**
- Create: `src/content/types.ts`, `src/content/profile.ts`, `src/content/experience.ts`, `src/content/about.ts`, `src/content/projects.ts`, `src/content/history.ts`

`src/content/annotations.ts` comes in Task 4, because it needs the `FrameId` type.

- [ ] **Step 1: Create `src/content/types.ts`**

```ts
export type ExternalLink = { label: string; href: string };

export type Picture = { avif: string; webp: string; width: number; height: number; alt: string };

export type SideProject = {
  slug: string;
  name: string;
  tagline: string;
  years: string;
  role: string;
  summary: string;
  points: string[];
  stack: string[];
  links: ExternalLink[];
  image: Picture;
};

export type WireframeKind = "chat" | "dashboard" | "form" | "document" | "list" | "editor";

/**
 * Client work is described generically. There is deliberately no name, link or image field,
 * so a client name, product name or screenshot cannot be added by mistake.
 */
export type ClientProject = {
  slug: string;
  title: string;
  years: string;
  summary: string;
  stack: string[];
  wireframe: WireframeKind;
};

export type Engagement = { id: string; title: string; years: string; points: string[] };

export type Role = {
  id: string;
  title: string;
  company: string;
  location: string;
  years: string;
  engagements: Engagement[];
  points: string[];
};

export type SkillGroup = { name: string; items: string[] };
export type Certification = { issuer: string; courses: string[]; year: string };
export type Education = { id: string; degree: string; short: string; school: string; years: string };
export type Language = { name: string; level: string };
```

- [ ] **Step 2: Create `src/content/profile.ts`**

```ts
export const profile = {
  name: "Artiom Leontiev",
  title: "Senior Frontend Engineer",
  focus: "AI-powered applications",
  location: "Cluj-Napoca, Romania",
  email: "contact@artiomleo.com",
  github: "https://github.com/artiomleo",
  linkedin: "https://www.linkedin.com/in/artiomleo/",
  cvUrl: "https://drive.google.com/file/d/1mfCKTsZ6tDHk7Td8VvAKuy1Ct9NsHG6t/view?usp=sharing",
  headline: { lead: "builds web products,", accent: "and the AI behind them." },
  lede: "7+ years of Vue and React, and since 2025 the AI layer behind them: LLM integrations, RAG, agents and MCP servers. Based in Cluj-Napoca, Romania.",
  currently: ["AI products and internal AI tooling at Amdaris", "Building Klipsy on the side"],
  bio: [
    "I'm a senior frontend engineer with 7+ years of building web products in Vue and React. Since 2025 I've focused on AI-powered applications: LLM integrations, RAG, AI agents, and MCP servers for Claude and ChatGPT.",
    "I lead frontend architecture, including micro-frontends, design systems and accessibility, and I work AI-first every day with Claude Code and agent workflows. Frontend is my core, and I build the AI and API layers a product needs, with working knowledge of backend frameworks.",
  ],
  portrait: {
    avif: "/images/portrait.avif",
    webp: "/images/portrait.webp",
    width: 640,
    height: 683,
    alt: "Portrait of Artiom Leontiev",
  },
} as const;
```

- [ ] **Step 3: Create `src/content/experience.ts`**

```ts
import type { Role } from "./types";

export const roles: Role[] = [
  {
    id: "amdaris",
    title: "Senior Frontend Engineer",
    company: "Amdaris",
    location: "Cluj-Napoca, Romania",
    years: "2022 – present",
    engagements: [
      {
        id: "ai-tooling",
        title: "AI products and internal AI tooling",
        years: "2025 – present",
        points: [
          "Took an AI case-study generator to production, cutting case studies from days of manual writing to minutes. Used by Sales and Marketing. Built the React app and co-built the RAG service (Azure OpenAI).",
          "Built and self-hosted an MCP server that gives Claude Code and GitHub Copilot access to the company's agent-skill library. Load-tested it to 100 concurrent users at about 70 ms median latency.",
          "Wrote reusable Claude Code and Copilot agent skills for engineering teams, including a code-review skill that has to cite evidence for every finding.",
          "Contributed frontend features to an AI-assisted software-delivery platform, including human-in-the-loop approval of changes proposed by AI agents (React, TypeScript).",
        ],
      },
      {
        id: "compliance",
        title: "Frontend lead, sustainability-compliance SaaS",
        years: "2025 – 2026",
        points: [
          "Designed a React 19 micro-frontend architecture (Module Federation) with a shared design system, role-based access and a typed API client, and built the core compliance workflows.",
          "Introduced AI-assisted delivery to the team: Claude Code custom commands for end-to-end testing and code review, plus an agent-driven story and QA workflow (BMAD).",
        ],
      },
      {
        id: "occupational-health",
        title: "Frontend lead, occupational-health platform",
        years: "2023 – 2025",
        points: [
          "Designed a Vue 3 + Vite micro-frontend architecture from the ground up, with a configurable dynamic-form engine. The platform passed a WCAG 2.1 AA accessibility audit.",
          "Managed and mentored 4 developers, and ran code reviews, internal trainings and hiring interviews.",
        ],
      },
    ],
    points: [],
  },
  {
    id: "binarcode",
    title: "Full-Stack Engineer",
    company: "BinarCode",
    location: "Cluj-Napoca, Romania",
    years: "2019 – 2022",
    engagements: [],
    points: [
      "Rebuilt a fertility-clinic platform's client app in Vue 3 and automated its kit-processing and shipping workflows, cutting manual paperwork by 50% and improving client retention by 20%.",
      "Built a multi-site Nuxt job-board builder with per-site DNS mapping, whose server-side rendering and SEO work raised the SEO score by 30%.",
      "Led a 2-developer team building a copywriting tool that generated articles through content-generation APIs, with Stripe payments.",
      "Delivered web applications (Vue.js, Laravel, MySQL) for corporate clients in the USA, UK and the Netherlands.",
    ],
  },
];
```

- [ ] **Step 4: Create `src/content/about.ts`**

```ts
import type { Certification, Education, Language, SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  {
    name: "Core",
    items: ["Vue 3", "React", "TypeScript", "JavaScript", "Nuxt", "Vite", "Micro-frontends (Module Federation, single-spa)", "Pinia", "Tailwind CSS", "shadcn/Radix", "Vuetify", "Accessibility (WCAG)", "Web performance", "SEO"],
  },
  {
    name: "AI engineering",
    items: ["LLM APIs (Anthropic Claude, OpenAI, Azure OpenAI, Gemini, Mistral)", "Prompt engineering", "RAG (embeddings, vector search)", "AI agents", "Human-in-the-loop", "Model Context Protocol (MCP)", "Structured output", "Model failover"],
  },
  {
    name: "AI-assisted development",
    items: ["Claude Code (custom commands, agent skills, MCP)", "GitHub Copilot", "Spec-driven agent workflows (BMAD)"],
  },
  { name: "Testing", items: ["Vitest", "Jest", "Playwright", "MSW", "Testing Library"] },
  {
    name: "Working knowledge",
    items: ["Node.js", "Laravel/PHP", "Python/FastAPI", ".NET", "SQL", "Docker", "Kubernetes", "Azure", "CI/CD (GitHub Actions, Azure DevOps)", "Flutter"],
  },
];

export const certifications: Certification[] = [
  { issuer: "NVIDIA Deep Learning Institute", courses: ["Building RAG Agents with LLMs"], year: "2025" },
  {
    issuer: "Anthropic Academy",
    courses: ["Claude with the Anthropic API", "Claude Code in Action", "Introduction to Model Context Protocol", "Introduction to Agent Skills"],
    year: "2026",
  },
];

export const education: Education[] = [
  {
    id: "education",
    degree: "Bachelor of Engineering, Automation and Computer Science",
    short: "BEng, Technical University of Cluj-Napoca",
    school: "Technical University of Cluj-Napoca, Romania",
    years: "2015 – 2019",
  },
];

export const languages: Language[] = [
  { name: "English", level: "Advanced" },
  { name: "Romanian", level: "Native" },
];
```

- [ ] **Step 5: Create `src/content/projects.ts`**

```ts
import type { ClientProject, SideProject } from "./types";

export const sideProjects: SideProject[] = [
  {
    slug: "klipsy",
    name: "Klipsy",
    tagline: "AI social content studio",
    years: "2026 – present",
    role: "Lead engineer",
    summary: "A SaaS that uses AI to generate faceless videos, image posts and text posts, then publishes them to TikTok, YouTube, Instagram and X on a schedule.",
    points: [
      "Designed the AI content pipeline: brand documents become a brand brief that drives per-platform writer agents (OpenAI, Gemini). Rotating angles halved repetitive posts.",
      "Extended a 45-tool MCP server so Claude and ChatGPT users can create, schedule and publish from chat, secured with OAuth 2 and protections against prompt injection and SSRF attacks.",
      "Introduced per-model LLM cost tracking from real token usage, correcting a blended rate that had overstated cheap-model costs about 37 times.",
      "Delivered product features in Vue 3 and TypeScript, and made the whole app and marketing site fully responsive.",
    ],
    stack: ["Vue 3", "TypeScript", "OpenAI", "Gemini", "MCP", "OAuth 2"],
    links: [{ label: "theklipsy.com", href: "https://theklipsy.com" }],
    image: { avif: "/images/projects/klipsy.avif", webp: "/images/projects/klipsy.webp", width: 1200, height: 750, alt: "The Klipsy website's home page" },
  },
  {
    slug: "council",
    name: "Council",
    tagline: "AI journaling app for iOS",
    years: "2026",
    role: "Founder and sole developer",
    summary: "An iOS app in which a multi-persona LLM panel answers journal entries, with data encrypted on the device. Live on the App Store.",
    points: [
      "Shipped the app end to end in Flutter, with native Swift speech-to-text.",
      "Built an LLM gateway with Gemini-to-Mistral failover, structured output and per-user token limits, plus an AI-safety layer that detects crisis content and shows support resources.",
      "Localized into 8 languages, with a marketing site held to Lighthouse 95+ and WCAG 2.2.",
    ],
    stack: ["Flutter", "Swift", "Gemini", "Mistral"],
    links: [
      { label: "council.artiomleo.com", href: "https://council.artiomleo.com" },
      { label: "App Store", href: "https://apps.apple.com/app/id6781214823" },
    ],
    image: { avif: "/images/projects/council.avif", webp: "/images/projects/council.webp", width: 1200, height: 750, alt: "The Council website's home page" },
  },
  {
    slug: "askmanu",
    name: "AskManu",
    tagline: "AI coding assistant",
    years: "2024 – 2025",
    role: "Sole frontend developer in a two-person team",
    summary: "An AI chat assistant for developers, with code suggestions and connections to their GitHub repositories.",
    points: [
      "Built the Vue 3 frontend from scratch: streaming AI chat, a CodeMirror code editor and GitHub repository connection.",
      "Built an embeddable JavaScript chat widget and package-version context for more precise AI answers.",
    ],
    stack: ["Vue 3", "CodeMirror", "Streaming AI chat"],
    links: [{ label: "askmanu.co", href: "https://askmanu.co" }],
    image: { avif: "/images/projects/askmanu.avif", webp: "/images/projects/askmanu.webp", width: 1200, height: 750, alt: "The AskManu website's home page" },
  },
];

export const clientProjects: ClientProject[] = [
  {
    slug: "case-study-generator",
    title: "AI case-study generator",
    years: "2025",
    summary: "Took it to production: case studies went from days of manual writing to minutes, for Sales and Marketing. Built the React app and co-built the RAG service.",
    stack: ["React", "TypeScript", "RAG", "Azure OpenAI"],
    wireframe: "chat",
  },
  {
    slug: "agent-skill-mcp",
    title: "Agent-skill MCP server",
    years: "2026",
    summary: "A self-hosted MCP server that gives Claude Code and GitHub Copilot access to an agent-skill library, load-tested to 100 concurrent users at about 70 ms median latency. Plus reusable agent skills, including a code-review skill that must cite evidence.",
    stack: ["Node.js", "MCP", "Docker"],
    wireframe: "list",
  },
  {
    slug: "ai-delivery-platform",
    title: "AI-assisted software-delivery platform",
    years: "2025 – 2026",
    summary: "Frontend features for a platform where AI agents propose changes, including the human-in-the-loop flow that approves them.",
    stack: ["React", "TypeScript"],
    wireframe: "editor",
  },
  {
    slug: "compliance-saas",
    title: "Sustainability-compliance SaaS",
    years: "2025 – 2026",
    summary: "Frontend lead. Designed a React 19 micro-frontend architecture with a shared design system, role-based access and a typed API client, and built the core compliance workflows.",
    stack: ["React 19", "Module Federation", "Design system"],
    wireframe: "dashboard",
  },
  {
    slug: "pdf-signing",
    title: "PDF digital-signing library",
    years: "2026",
    summary: "A .NET library and Docker REST API for PDF signatures at PAdES B, T, LT and LTA levels under eIDAS, verified with pdfsig. Added multiple signatures, Azure Key Vault as the certificate source, and NuGet and Docker packaging.",
    stack: [".NET", "Docker", "Azure Key Vault"],
    wireframe: "document",
  },
  {
    slug: "occupational-health",
    title: "Occupational-health platform",
    years: "2023 – 2025",
    summary: "Frontend lead. Designed a Vue 3 micro-frontend architecture with a configurable dynamic-form engine; the platform passed a WCAG 2.1 AA audit. Led and mentored 4 developers.",
    stack: ["Vue 3", "Vite", "Micro-frontends", "Pinia"],
    wireframe: "form",
  },
  {
    slug: "fertility-clinic",
    title: "Fertility-clinic platform",
    years: "2019 – 2022",
    summary: "Rebuilt the client app in Vue 3 and automated kit-processing and shipping workflows, cutting manual paperwork by 50% and improving client retention by 20%.",
    stack: ["Vue 3", "Laravel", "Inertia.js", "MySQL", "AWS"],
    wireframe: "list",
  },
  {
    slug: "job-board-builder",
    title: "Multi-site job-board builder",
    years: "2019 – 2022",
    summary: "A Nuxt builder that runs many job-board sites from one server with per-site DNS mapping. Server-side rendering and SEO work raised the SEO score by 30%.",
    stack: ["Nuxt", "Vue", "Tailwind", "Multi-tenancy"],
    wireframe: "dashboard",
  },
  {
    slug: "copywriting-tool",
    title: "Copywriting tool",
    years: "2019 – 2022",
    summary: "Led a 2-developer team building a tool that generated articles through content-generation APIs, with Stripe payments.",
    stack: ["Content-generation APIs", "Stripe"],
    wireframe: "editor",
  },
  {
    slug: "license-management",
    title: "License-management platform",
    years: "2019 – 2022",
    summary: "A suite of apps that helps enterprises cut licensing costs.",
    stack: ["Vue.js", "Tailwind", "WebSockets"],
    wireframe: "dashboard",
  },
];
```

- [ ] **Step 6: Create `src/content/history.ts`**

```ts
import { education } from "./about";
import { roles } from "./experience";

export type HistoryItem = { id: string; years: string; label: string };

/** Version history panel: every experience entry and education, newest first. Ids match element ids in the frames. */
export const history: HistoryItem[] = [
  ...roles.flatMap((role) => [
    ...role.engagements.map((e) => ({ id: `entry-${e.id}`, years: e.years, label: e.title })),
    { id: `entry-${role.id}`, years: role.years, label: `${role.title} · ${role.company}` },
  ]),
  ...education.map((e) => ({ id: `entry-${e.id}`, years: e.years, label: e.short })),
];
```

- [ ] **Step 7: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass.

- [ ] **Step 8: Commit**

```bash
git add src/content
git commit -m "feat: add typed content from the 2026 CV"
```

---
### Task 4: Frame registry, layout state and the boot script

**Files:**
- Create: `src/frames/registry.ts`, `src/canvas/constants.ts`, `src/content/annotations.ts`, `src/lib/cx.ts`, `src/lib/storage.ts`, `src/lib/keys.ts`, `src/lib/useIsoLayoutEffect.ts`, `src/layout/LayoutProvider.tsx`
- Replace: `index.html`, `vite.config.ts`

- [ ] **Step 1: Create `src/frames/registry.ts`**

```ts
export type FrameId = "home" | "projects" | "experience" | "about" | "contact";
export type FrameDef = { id: FrameId; path: string; label: string; width: number };

// Canvas widths in CSS px. The boot script in index.html repeats them; keep both in sync.
export const FRAMES: FrameDef[] = [
  { id: "home", path: "/", label: "Home", width: 960 },
  { id: "projects", path: "/projects", label: "Projects", width: 1040 },
  { id: "experience", path: "/experience", label: "Experience", width: 880 },
  { id: "about", path: "/about", label: "About", width: 880 },
  { id: "contact", path: "/contact", label: "Contact", width: 640 },
];

export function normalizePath(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function frameForPath(path: string): FrameDef | undefined {
  const normalized = normalizePath(path);
  return FRAMES.find((f) => f.path === normalized);
}

export function frameById(id: FrameId): FrameDef {
  return FRAMES.find((f) => f.id === id)!;
}

export function nextFrame(id: FrameId): FrameDef | undefined {
  return FRAMES[FRAMES.findIndex((f) => f.id === id) + 1];
}
```

- [ ] **Step 2: Create `src/canvas/constants.ts`**

```ts
// The boot script in index.html repeats these values; keep both in sync.
export const CANVAS_QUERY = "(min-width: 1024px) and (pointer: fine)";
export const PANEL_W = 232;
export const PAD_X = 48;
export const PAD_TOP = 56;
export const FRAME_GAP = 160;
```

- [ ] **Step 3: Create `src/content/annotations.ts`**

Every sticky and comment repeats a fact that is also written in a frame.

```ts
import type { FrameId } from "@/frames/registry";

/** comment.target is the id of the element the PM cursor pins a comment on. */
export type FrameNote = { sticky?: string; comment?: { target: string; text: string } };

export const FRAME_NOTES: Record<FrameId, FrameNote> = {
  home: {
    sticky: "Case studies: days of writing, down to minutes",
    comment: { target: "hero-lede", text: "Since 2025: RAG, agents and MCP servers in production" },
  },
  projects: {
    sticky: "Council ships in 8 languages",
    comment: { target: "project-klipsy", text: "Per-model cost tracking fixed a 37× overstatement" },
  },
  experience: {
    sticky: "Mentored 4 developers",
    comment: { target: "entry-ai-tooling", text: "MCP server load-tested to 100 users at ~70 ms" },
  },
  about: {
    sticky: "Passed a WCAG 2.1 AA audit",
    comment: { target: "certifications", text: "Four Anthropic Academy courses in 2026" },
  },
  contact: {},
};
```

- [ ] **Step 4: Create the small helpers in `src/lib/`**

`src/lib/cx.ts`:

```ts
export const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");
```

`src/lib/storage.ts`:

```ts
export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the preference just isn't kept.
  }
}
```

`src/lib/keys.ts`:

```ts
/** True when a key press belongs to a text field, so shortcuts must ignore it. */
export function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || !el.tagName) return false;
  return el.isContentEditable || el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT";
}

/** True while a modal dialog is open; global shortcuts stay quiet then. */
export const dialogOpen = () => document.querySelector("dialog[open]") !== null;
```

`src/lib/useIsoLayoutEffect.ts`:

```ts
import { useEffect, useLayoutEffect } from "react";

/** useLayoutEffect in the browser, useEffect during prerendering (which avoids React's server warning). */
export const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
```

- [ ] **Step 5: Create `src/layout/LayoutProvider.tsx`**

```tsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CANVAS_QUERY } from "@/canvas/constants";
import { readStorage, writeStorage } from "@/lib/storage";

export type Theme = "light" | "dark";

type LayoutState = {
  /** False during prerendering and the hydration render, so both match the server HTML. */
  mounted: boolean;
  /** Wide screen with a fine primary pointer. */
  canCanvas: boolean;
  /** The visitor chose Page view on a screen that could show the canvas. */
  pageView: boolean;
  setPageView: (on: boolean) => void;
  theme: Theme;
  toggleTheme: () => void;
  reducedMotion: boolean;
};

const LayoutContext = createContext<LayoutState | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [canCanvas, setCanCanvas] = useState(false);
  const [pageView, setPageViewState] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const wide = matchMedia(CANVAS_QUERY);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setCanCanvas(wide.matches);
      setReducedMotion(motion.matches);
    };
    sync();
    setPageViewState(readStorage("view") === "page");
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    setMounted(true);
    wide.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  const setPageView = useCallback((on: boolean) => {
    writeStorage("view", on ? "page" : "canvas");
    setPageViewState(on);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    writeStorage("theme", next);
    setTheme(next);
  }, []);

  const value = useMemo(
    () => ({ mounted, canCanvas, pageView, setPageView, theme, toggleTheme, reducedMotion }),
    [mounted, canCanvas, pageView, setPageView, theme, toggleTheme, reducedMotion],
  );
  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export function useLayout(): LayoutState {
  const value = useContext(LayoutContext);
  if (!value) throw new Error("useLayout must be used inside LayoutProvider");
  return value;
}
```

- [ ] **Step 6: Replace `index.html`**

The GA snippet is the same tag and configuration as before. `<!--app-head-->` and `<!--app-html-->` are filled by `scripts/prerender.mjs` (Task 12).

```html
<!DOCTYPE html>
<html lang="en" data-layout="page" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>
      (function () {
        var d = document.documentElement, theme = null, view = null;
        try { theme = localStorage.getItem("theme"); view = localStorage.getItem("view"); } catch (e) {}
        var dark = theme ? theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
        d.setAttribute("data-theme", dark ? "dark" : "light");
        // Frame widths, panel width and paddings mirror src/frames/registry.ts and src/canvas/constants.ts.
        var widths = { "/": 960, "/projects": 1040, "/experience": 880, "/about": 880, "/contact": 640 };
        var w = widths[location.pathname.replace(/\/+$/, "") || "/"];
        if (w && view !== "page" && matchMedia("(min-width: 1024px) and (pointer: fine)").matches) {
          var vw = innerWidth - 232, z = Math.min(1, (vw - 96) / w);
          d.setAttribute("data-layout", "canvas");
          d.style.setProperty("--boot-z", String(z));
          d.style.setProperty("--boot-x", Math.round((vw - w * z) / 2) + "px");
        }
      })();
    </script>
    <!--app-head-->
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#F5F5F5" />
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1E1E1E" />
    <meta name="color-scheme" content="light dark" />
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-DLVRK2H5DD"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());

      gtag('config', 'G-DLVRK2H5DD');
    </script>
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Replace `vite.config.ts`**

`lucide-react` is bundled into the server build so Node never has to load its CommonJS build.

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssr: {
    noExternal: ["lucide-react"],
  },
});
```

- [ ] **Step 8: Verify**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all pass. `grep -c "data-layout" dist/index.html` prints `2` (the html attribute and the boot script).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add frame registry, layout state and boot script"
```

---

### Task 5: Camera math, frame layout and the canvas API

**Files:**
- Create: `src/canvas/camera.ts`, `src/canvas/layout.ts`, `src/canvas/rect.ts`, `src/canvas/CanvasApi.tsx`

These are pure modules and a context. Nothing renders them yet.

- [ ] **Step 1: Create `src/canvas/camera.ts`**

```ts
import { PAD_TOP, PAD_X } from "./constants";

export type Rect = { x: number; y: number; w: number; h: number };
/** z is the zoom; x and y are the world's translation in screen px. */
export type View = { z: number; x: number; y: number };
export type Viewport = { w: number; h: number };
export type Point = [number, number];

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 2;

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function toScreen(v: View, x: number, y: number): Point {
  return [x * v.z + v.x, y * v.z + v.y];
}

export function toWorld(v: View, x: number, y: number): Point {
  return [(x - v.x) / v.z, (y - v.y) / v.z];
}

/** Fit a frame's width between the side margins, top-aligned, never above 100%. Mirrors the boot script. */
export function focusFrame(r: Rect, vp: Viewport): View {
  const z = clamp((vp.w - PAD_X * 2) / r.w, MIN_ZOOM, 1);
  return { z, x: Math.round((vp.w - r.w * z) / 2 - r.x * z), y: Math.round(PAD_TOP - r.y * z) };
}

/** Fit a whole rectangle (Fit all). */
export function fitRect(r: Rect, vp: Viewport, pad = 40): View {
  const z = clamp(Math.min((vp.w - pad * 2) / r.w, (vp.h - pad * 2) / r.h), MIN_ZOOM, MAX_ZOOM);
  return { z, x: vp.w / 2 - (r.x + r.w / 2) * z, y: vp.h / 2 - (r.y + r.h / 2) * z };
}

/** Zoom to z while keeping the screen point (cx, cy) fixed. */
export function zoomAround(v: View, z: number, cx: number, cy: number): View {
  const nz = clamp(z, MIN_ZOOM, MAX_ZOOM);
  return { z: nz, x: cx - (cx - v.x) * (nz / v.z), y: cy - (cy - v.y) * (nz / v.z) };
}

/** Keep the zoom and put the world point (x, y) in the middle of the viewport. */
export function centerOn(v: View, vp: Viewport, x: number, y: number): View {
  return { z: v.z, x: vp.w / 2 - x * v.z, y: vp.h / 2 - y * v.z };
}

export type Flight = { from: View; to: View; vp: Viewport; dip: number; start: number; duration: number };

export function planFlight(from: View, to: View, vp: Viewport, start: number, duration: number): Flight {
  const [ax, ay] = toWorld(from, vp.w / 2, vp.h / 2);
  const [bx, by] = toWorld(to, vp.w / 2, vp.h / 2);
  const travel = (Math.hypot(bx - ax, by - ay) * Math.min(from.z, to.z)) / vp.w;
  return { from, to, vp, dip: clamp(travel * 0.5, 0, 0.42), start, duration };
}

/** Zoom moves on a log scale with a slight zoom-out dip mid-flight, as in the prototype. */
export function flightAt(f: Flight, now: number): { view: View; done: boolean } {
  const e = f.duration > 0 ? clamp((now - f.start) / f.duration, 0, 1) : 1;
  if (e >= 1) return { view: f.to, done: true };
  const s = ease(e);
  const [ax, ay] = toWorld(f.from, f.vp.w / 2, f.vp.h / 2);
  const [bx, by] = toWorld(f.to, f.vp.w / 2, f.vp.h / 2);
  const logZ = Math.log(f.from.z) + (Math.log(f.to.z) - Math.log(f.from.z)) * s;
  const z = Math.max(MIN_ZOOM, Math.exp(logZ) * (1 - f.dip * Math.sin(Math.PI * s)));
  const cx = ax + (bx - ax) * s;
  const cy = ay + (by - ay) * s;
  return { view: { z, x: f.vp.w / 2 - cx * z, y: f.vp.h / 2 - cy * z }, done: false };
}
```

- [ ] **Step 2: Create `src/canvas/layout.ts`**

```ts
import type { FrameId } from "@/frames/registry";
import type { Rect } from "./camera";
import { FRAME_GAP } from "./constants";

export type FrameRects = Record<FrameId, Rect>;
export type FrameSizes = Record<FrameId, { w: number; h: number }>;

/** Three columns: Home over Experience, then Projects, then About over Contact. */
export const COLUMNS: FrameId[][] = [["home", "experience"], ["projects"], ["about", "contact"]];

// Positions snap to the 20px dot grid so the grid doesn't shift when the canvas takes over.
const snap = (v: number) => Math.ceil(v / 20) * 20;

export function layoutFrames(sizes: FrameSizes): FrameRects {
  const rects = {} as FrameRects;
  let x = 0;
  for (const column of COLUMNS) {
    let y = 0;
    let width = 0;
    for (const id of column) {
      const { w, h } = sizes[id];
      rects[id] = { x, y, w, h };
      y = snap(y + h + FRAME_GAP);
      width = Math.max(width, w);
    }
    x = snap(x + width + FRAME_GAP);
  }
  return rects;
}

export function bounds(rects: Rect[]): Rect {
  const x0 = Math.min(...rects.map((r) => r.x));
  const y0 = Math.min(...rects.map((r) => r.y));
  const x1 = Math.max(...rects.map((r) => r.x + r.w));
  const y1 = Math.max(...rects.map((r) => r.y + r.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
```

- [ ] **Step 3: Create `src/canvas/rect.ts`**

```ts
import type { Rect } from "./camera";

/** An element's box in world coordinates. Uses offsets, so the camera transform doesn't affect it. */
export function rectIn(el: HTMLElement, world: HTMLElement): Rect {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== world) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}
```

- [ ] **Step 4: Create `src/canvas/CanvasApi.tsx`**

```tsx
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { FrameId } from "@/frames/registry";
import type { View, Viewport } from "./camera";
import type { FrameRects } from "./layout";

export type CanvasApi = {
  focusFrame: (id: FrameId) => void;
  /** Fly to the element with this id, switching the route to its frame. */
  focusElement: (elementId: string) => void;
  fitAll: () => void;
  zoomBy: (factor: number) => void;
  centerOn: (x: number, y: number) => void;
  /** Called on every camera change, and once immediately. Returns an unsubscribe function. */
  subscribe: (fn: (view: View) => void) => () => void;
  getView: () => View;
  getViewport: () => Viewport;
  getRects: () => FrameRects | null;
  getWorld: () => HTMLElement | null;
};

type Registry = { api: CanvasApi | null; setApi: (api: CanvasApi | null) => void };

const CanvasApiContext = createContext<Registry>({ api: null, setApi: () => {} });

export function CanvasApiProvider({ children }: { children: ReactNode }) {
  const [api, setApi] = useState<CanvasApi | null>(null);
  const value = useMemo(() => ({ api, setApi }), [api]);
  return <CanvasApiContext.Provider value={value}>{children}</CanvasApiContext.Provider>;
}

/** The canvas controls, or null in page layout. */
export const useCanvasApi = () => useContext(CanvasApiContext).api;
export const useRegisterCanvasApi = () => useContext(CanvasApiContext).setApi;
```

- [ ] **Step 5: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add src/canvas
git commit -m "feat: add camera math, frame layout and canvas API context"
```

---
### Task 6: Frame wrapper, shared UI, Home and 404

**Files:**
- Create: `src/frames/Frame.tsx`, `src/frames/ui.tsx`, `src/frames/Home.tsx`, `src/frames/NotFound.tsx`, `src/styles/frames.css`
- Modify: `src/index.css`

**Region markers:** `// #region layer:<id>` … `// #endregion` in TSX, and `/* #region layer:<id> */` … `/* #endregion */` in CSS, mark the code that Dev Mode shows for each layer (Task 15). Keep them exactly as written, and never nest them.

- [ ] **Step 1: Create `src/frames/Frame.tsx`**

```tsx
import { createContext, useContext, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { FRAME_NOTES } from "@/content/annotations";
import { frameById, nextFrame, type FrameId } from "./registry";

type FrameContextValue = { id: FrameId; primary: boolean };
const FrameContext = createContext<FrameContextValue | null>(null);

function useFrame(): FrameContextValue {
  const value = useContext(FrameContext);
  if (!value) throw new Error("FrameTitle and Heading must render inside <Frame>");
  return value;
}

type FrameProps = {
  id: FrameId;
  /** True when this frame's title is the page's h1: always in page layout, only Home on the canvas. */
  primary: boolean;
  children: ReactNode;
};

/** A frame section. Its children must render exactly one FrameTitle, which labels the section. */
export function Frame({ id, primary, children }: FrameProps) {
  const def = frameById(id);
  const next = nextFrame(id);
  const sticky = FRAME_NOTES[id].sticky;
  return (
    <section
      className="frame"
      data-frame={id}
      aria-labelledby={`${id}-title`}
      style={{ "--frame-w": `${def.width}px` } as CSSProperties}
    >
      <FrameLabel label={def.label} />
      <FrameContext.Provider value={{ id, primary }}>
        <div className="frame-body">{children}</div>
      </FrameContext.Provider>
      {sticky && <Sticky frame={id} text={sticky} />}
      {next && (
        <Link className="frame-next" to={next.path}>
          Next: {next.label} <span aria-hidden="true">→</span>
        </Link>
      )}
    </section>
  );
}

// #region layer:frame-label
export function FrameLabel({ label }: { label: string }) {
  return (
    <p className="frame-label" aria-hidden="true" data-layer="frame-label">
      <span className="frame-label-mark">#</span> {label}
    </p>
  );
}
// #endregion

// #region layer:frame-title
export function FrameTitle({
  children,
  className = "frame-title",
  layer = "frame-title",
}: {
  children: ReactNode;
  className?: string;
  layer?: string;
}) {
  const { id, primary } = useFrame();
  const Tag = primary ? "h1" : "h2";
  return (
    <Tag id={`${id}-title`} className={className} data-layer={layer}>
      {children}
    </Tag>
  );
}
// #endregion

/** A heading one (depth 1) or two (depth 2) levels below the frame title. */
export function Heading({ depth, ...props }: { depth: 1 | 2 } & HTMLAttributes<HTMLHeadingElement>) {
  const { primary } = useFrame();
  const level = (primary ? 1 : 2) + depth;
  const Tag = level === 2 ? "h2" : level === 3 ? "h3" : "h4";
  return <Tag {...props} />;
}

// #region layer:sticky
function Sticky({ frame, text }: { frame: FrameId; text: string }) {
  return (
    <div className="sticky" data-sticky={frame} data-layer="sticky" aria-hidden="true">
      {text}
    </div>
  );
}
// #endregion
```

- [ ] **Step 2: Create `src/frames/ui.tsx`**

```tsx
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

// #region layer:button-primary
export function PrimaryButton({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link className="btn btn--primary" to={to} data-layer="button-primary">
      {children}
    </Link>
  );
}
// #endregion

// #region layer:stack-tag
export function StackTags({ items, label }: { items: string[]; label: string }) {
  return (
    <ul className="tags" aria-label={label} role="list">
      {items.map((item) => (
        <li key={item} className="tag" data-layer="stack-tag">
          {item}
        </li>
      ))}
    </ul>
  );
}
// #endregion

export function NewTabNote() {
  return <span className="visually-hidden"> (opens in a new tab)</span>;
}
```

- [ ] **Step 3: Create `src/frames/Home.tsx`**

```tsx
import { Link } from "react-router-dom";
import { profile } from "@/content/profile";
import { Frame, FrameTitle, Heading } from "./Frame";
import { PrimaryButton } from "./ui";

export function Home({ primary }: { primary: boolean }) {
  return (
    <Frame id="home" primary={primary}>
      <div className="home">
        <p className="eyebrow">
          {profile.title} · {profile.focus}
        </p>
        <HeroTitle />
        <HeroLede />
        <div className="hero-actions">
          <PrimaryButton to="/projects">See projects</PrimaryButton>
          <Link className="btn btn--ghost" to="/contact">
            Get in touch
          </Link>
        </div>
        <div className="hero-now">
          <Heading depth={1} className="hero-now-title">
            Currently
          </Heading>
          <ul role="list">
            {profile.currently.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}

// #region layer:hero-title
function HeroTitle() {
  return (
    <FrameTitle className="hero-title" layer="hero-title">
      {profile.name} {profile.headline.lead} <em>{profile.headline.accent}</em>
    </FrameTitle>
  );
}
// #endregion

// #region layer:hero-lede
function HeroLede() {
  return (
    <p className="hero-lede" id="hero-lede" data-layer="hero-lede">
      {profile.lede}
    </p>
  );
}
// #endregion
```

- [ ] **Step 4: Create `src/frames/NotFound.tsx`**

```tsx
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { FrameLabel } from "./Frame";
import { FRAMES } from "./registry";

export function NotFound() {
  return (
    <section className="frame" aria-labelledby="not-found-title" style={{ "--frame-w": "640px" } as CSSProperties}>
      <FrameLabel label="404" />
      <div className="frame-body">
        <header className="frame-head">
          <p className="eyebrow">404</p>
          <h1 id="not-found-title" className="frame-title">
            Frame not found
          </h1>
          <p className="frame-lede">There's no frame at this address. Pick one of these instead:</p>
        </header>
        <ul className="not-found-links" role="list">
          {FRAMES.map((f) => (
            <li key={f.id}>
              <Link to={f.path}>{f.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create `src/styles/frames.css`**

```css
/* Frames: the site's pages, drawn as frames in a design file. */
.frame {
  position: relative;
  box-sizing: border-box;
  width: var(--frame-w);
  padding: 56px;
  background: var(--site-bg);
  color: var(--site-text);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.08), 0 0 0 1px var(--tool-line);
}

/* #region layer:frame-label */
.frame-label {
  position: absolute;
  left: 0;
  bottom: 100%;
  margin: 0;
  padding-bottom: 8px;
  font: 500 12.5px/1 var(--font-mono);
  color: var(--tool-muted);
  white-space: nowrap;
}
/* #endregion */

.frame-body {
  display: grid;
  gap: 40px;
}

.frame-head {
  display: grid;
  gap: 14px;
}

.eyebrow {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  transition: color 0.4s ease;
}

/* #region layer:frame-title */
.frame-title {
  margin: 0;
  max-width: 16ch;
  font: 400 56px/1 var(--font-display);
  letter-spacing: -0.01em;
}
/* #endregion */
.frame-lede {
  margin: 0;
  max-width: 52ch;
  font-size: 17px;
  line-height: 1.6;
  color: var(--site-muted);
}

/* Home */
.home {
  display: grid;
  gap: 24px;
  justify-items: start;
}

/* #region layer:hero-title */
.hero-title {
  margin: 8px 0 0;
  max-width: 13.5ch;
  font: 400 76px/0.98 var(--font-display);
  letter-spacing: -0.02em;
}
.hero-title em {
  font-style: italic;
  color: var(--accent);
  transition: color 0.4s ease;
}
/* #endregion */

/* #region layer:hero-lede */
.hero-lede {
  margin: 0;
  max-width: 52ch;
  font-size: 18px;
  line-height: 1.6;
  color: var(--site-muted);
}
/* #endregion */

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
}

.hero-now {
  width: 100%;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--site-line);
}
.hero-now-title {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--site-muted);
}
.hero-now ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 15px;
}
.hero-now li::before {
  content: "";
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 9px;
  border-radius: 50%;
  background: #1f9d55;
  vertical-align: 1px;
}

/* #region layer:button-primary */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 20px;
  border: 0;
  border-radius: var(--radius);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.4s ease, box-shadow 0.15s ease;
}
.btn--primary {
  background: var(--accent);
  color: var(--on-accent);
}
.btn--primary:hover {
  transform: translateY(-1px);
}
.btn[disabled] {
  opacity: 0.6;
  cursor: progress;
}
/* #endregion */
.btn--ghost {
  background: transparent;
  color: var(--site-text);
  box-shadow: inset 0 0 0 1.5px var(--site-line);
}
.btn--ghost:hover {
  box-shadow: inset 0 0 0 1.5px var(--site-text);
}

/* #region layer:stack-tag */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.tag {
  padding: 5px 10px;
  border-radius: 999px;
  background: var(--site-soft);
  color: var(--site-text);
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.3;
}
/* #endregion */

/* #region layer:sticky */
.sticky {
  position: absolute;
  top: 40px;
  right: -28px;
  z-index: 2;
  box-sizing: border-box;
  width: 170px;
  min-height: 132px;
  padding: 16px;
  background: var(--sticky);
  color: var(--sticky-text);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.35;
  box-shadow: 0 10px 20px -10px rgb(0 0 0 / 0.4);
  transform: rotate(-1.5deg);
}
/* #endregion */

.frame-next {
  display: inline-flex;
  gap: 6px;
  margin-top: 48px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
}
.frame-next:hover {
  text-decoration: underline;
}

.not-found-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-weight: 600;
}
.not-found-links a {
  color: var(--accent);
}

[data-layout="page"] .sticky {
  display: none;
}
[data-layout="canvas"] .frame-next {
  display: none;
}
```

- [ ] **Step 6: Replace `src/index.css`**

```css
@import "tailwindcss/base";
@import "./styles/tokens.css";
@import "./styles/base.css";
@import "./styles/frames.css";
@import "tailwindcss/utilities";
```

- [ ] **Step 7: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass. The frames render from Task 11 onwards.

- [ ] **Step 8: Commit**

```bash
git add src/frames src/styles/frames.css src/index.css
git commit -m "feat: add frame wrapper, Home and 404 frames"
```

---
### Task 7: Projects frame

**Files:**
- Create: `src/frames/Projects.tsx`, `src/frames/Wireframe.tsx`, `src/styles/projects.css`
- Modify: `src/index.css`

Screenshots for the side projects come in Task 17. Until then the `<img>` tags point at files that don't exist yet, which is expected.

- [ ] **Step 1: Create `src/frames/Wireframe.tsx`**

These are drawn thumbnails, deliberately unlike any real client UI.

```tsx
import type { ReactElement } from "react";
import type { WireframeKind } from "@/content/types";

const W = 320;
const H = 132;

const bars = [40, 64, 52, 88, 70];
const lines = [160, 120, 180, 90, 140, 100];
const rows = [180, 140, 200, 120];

const SHAPES: Record<WireframeKind, ReactElement> = {
  chat: (
    <g>
      <rect className="wf-soft" x="16" y="16" width="150" height="26" rx="13" />
      <rect className="wf-accent" x="154" y="52" width="150" height="26" rx="13" />
      <rect className="wf-soft" x="16" y="88" width="190" height="26" rx="13" />
    </g>
  ),
  dashboard: (
    <g>
      <rect className="wf-line" x="16" y="16" width="60" height="100" rx="4" />
      {bars.map((h, i) => (
        <rect key={i} className={i === 3 ? "wf-accent" : "wf-soft"} x={96 + i * 42} y={116 - h} width="28" height={h} rx="3" />
      ))}
    </g>
  ),
  form: (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect className="wf-line" x="16" y={16 + i * 34} width="60" height="6" rx="3" />
          <rect className="wf-soft" x="16" y={26 + i * 34} width="200" height="16" rx="4" />
        </g>
      ))}
      <rect className="wf-accent" x="236" y="94" width="68" height="22" rx="6" />
    </g>
  ),
  document: (
    <g>
      <rect className="wf-soft" x="96" y="12" width="128" height="108" rx="3" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} className="wf-line" x="108" y={24 + i * 14} width={i === 5 ? 60 : 104} height="5" rx="2.5" />
      ))}
      <rect className="wf-accent" x="180" y="100" width="36" height="10" rx="3" />
    </g>
  ),
  list: (
    <g>
      {rows.map((w, i) => (
        <g key={i}>
          <rect className={i === 1 ? "wf-accent" : "wf-soft"} x="16" y={14 + i * 28} width="18" height="18" rx="4" />
          <rect className="wf-line" x="44" y={19 + i * 28} width={w} height="8" rx="4" />
        </g>
      ))}
    </g>
  ),
  editor: (
    <g>
      <rect className="wf-line" x="16" y="16" width="44" height="100" rx="4" />
      {lines.map((w, i) => (
        <rect key={i} className={i === 2 ? "wf-accent" : "wf-soft"} x={72 + (i % 3) * 12} y={20 + i * 16} width={w} height="8" rx="4" />
      ))}
    </g>
  ),
};

export function Wireframe({ kind }: { kind: WireframeKind }) {
  return (
    <svg className="wireframe" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      <rect className="wf-bg" width={W} height={H} rx="8" />
      {SHAPES[kind]}
    </svg>
  );
}
```

- [ ] **Step 2: Create `src/frames/Projects.tsx`**

```tsx
import { ArrowUpRight } from "lucide-react";
import { clientProjects, sideProjects } from "@/content/projects";
import type { ClientProject, SideProject } from "@/content/types";
import { Frame, FrameTitle, Heading } from "./Frame";
import { NewTabNote, StackTags } from "./ui";
import { Wireframe } from "./Wireframe";

export function Projects({ primary }: { primary: boolean }) {
  return (
    <Frame id="projects" primary={primary}>
      <header className="frame-head">
        <p className="eyebrow">Projects</p>
        <FrameTitle>Things I've built</FrameTitle>
        <p className="frame-lede">
          Side projects I own end to end, and client work I led or built. Client work is described without names.
        </p>
      </header>
      <section className="projects-group" aria-labelledby="side-projects-title">
        <Heading depth={1} id="side-projects-title" className="group-title">
          Side projects
        </Heading>
        <div className="side-list">
          {sideProjects.map((p) => (
            <SideProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
      <section className="projects-group" aria-labelledby="client-work-title">
        <Heading depth={1} id="client-work-title" className="group-title">
          Client work
        </Heading>
        <div className="client-grid">
          {clientProjects.map((p) => (
            <ClientCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </Frame>
  );
}

// #region layer:project-card
function SideProjectCard({ project }: { project: SideProject }) {
  const { image } = project;
  return (
    <article className="side-card" id={`project-${project.slug}`} data-layer="project-card">
      <picture className="side-shot">
        <source srcSet={image.avif} type="image/avif" />
        <img src={image.webp} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
      </picture>
      <div className="side-body">
        <Heading depth={2} className="card-title">
          {project.name}{" "}
          <span className="card-tagline">{project.tagline}</span>
        </Heading>
        <p className="card-meta">
          {project.years} · {project.role}
        </p>
        <p className="card-summary">{project.summary}</p>
        <ul className="card-points">
          {project.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <StackTags items={project.stack} label={`${project.name} stack`} />
        <p className="card-links">
          {project.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label} <ArrowUpRight size={15} aria-hidden="true" />
              <NewTabNote />
            </a>
          ))}
        </p>
      </div>
    </article>
  );
}

function ClientCard({ project }: { project: ClientProject }) {
  return (
    <article className="client-card" data-layer="project-card">
      <Wireframe kind={project.wireframe} />
      <Heading depth={2} className="card-title">
        {project.title}
      </Heading>
      <p className="card-meta">{project.years}</p>
      <p className="card-summary">{project.summary}</p>
      <StackTags items={project.stack} label={`${project.title} stack`} />
    </article>
  );
}
// #endregion
```

- [ ] **Step 3: Create `src/styles/projects.css`**

```css
.projects-group {
  display: grid;
  gap: 24px;
}

.group-title {
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--site-line);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--site-muted);
}

.side-list {
  display: grid;
  gap: 40px;
}

/* #region layer:project-card */
.side-card {
  display: grid;
  grid-template-columns: minmax(0, 400px) minmax(0, 1fr);
  gap: 32px;
  align-items: start;
}
.side-shot img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--radius);
  box-shadow: 0 0 0 1px var(--site-line);
}
.side-body,
.client-card {
  display: grid;
  gap: 10px;
  align-content: start;
}
.card-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.25;
}
.card-tagline {
  display: block;
  font: italic 400 20px/1.3 var(--font-display);
  color: var(--site-muted);
}
.card-meta {
  margin: 0;
  font: 500 12.5px/1.5 var(--font-mono);
  color: var(--site-muted);
}
.card-summary {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.6;
}
.card-points {
  display: grid;
  gap: 6px;
  margin: 0;
  padding-left: 18px;
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--site-muted);
}
.card-links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 4px 0 0;
}
.card-links a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
}
.card-links a:hover {
  text-decoration: underline;
}
.client-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 36px 28px;
}
/* #endregion */

.wireframe {
  display: block;
  width: 100%;
  height: auto;
  margin-bottom: 4px;
}
.wf-bg { fill: var(--tool-bg); }
.wf-line { fill: var(--site-line); }
.wf-soft { fill: color-mix(in srgb, var(--accent) 16%, var(--site-bg)); transition: fill 0.4s ease; }
.wf-accent { fill: var(--accent); transition: fill 0.4s ease; }

@media (max-width: 899px) {
  [data-layout="page"] .side-card {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
@media (max-width: 640px) {
  [data-layout="page"] .client-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Add the import to `src/index.css`** (after `frames.css`)

```css
@import "tailwindcss/base";
@import "./styles/tokens.css";
@import "./styles/base.css";
@import "./styles/frames.css";
@import "./styles/projects.css";
@import "tailwindcss/utilities";
```

- [ ] **Step 5: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add src/frames src/styles/projects.css src/index.css
git commit -m "feat: add Projects frame with side projects and anonymised client work"
```

---
### Task 8: Experience and About frames

**Files:**
- Create: `src/frames/Experience.tsx`, `src/frames/About.tsx`, `src/styles/experience.css`, `src/styles/about.css`
- Modify: `src/index.css`

- [ ] **Step 1: Create `src/frames/Experience.tsx`**

Element ids (`entry-<id>`) are the targets for the version history panel.

```tsx
import { roles } from "@/content/experience";
import type { Role } from "@/content/types";
import { Frame, FrameTitle, Heading } from "./Frame";

export function Experience({ primary }: { primary: boolean }) {
  return (
    <Frame id="experience" primary={primary}>
      <header className="frame-head">
        <p className="eyebrow">Experience</p>
        <FrameTitle>7+ years, two companies</FrameTitle>
        <p className="frame-lede">
          Frontend architecture and team leadership on micro-frontend platforms, and since 2025, AI products.
        </p>
      </header>
      <ol className="roles" role="list">
        {roles.map((role) => (
          <RoleEntry key={role.id} role={role} />
        ))}
      </ol>
    </Frame>
  );
}

// #region layer:experience-entry
function RoleEntry({ role }: { role: Role }) {
  return (
    <li className="role" id={`entry-${role.id}`} data-layer="experience-entry">
      <div className="role-head">
        <Heading depth={1} className="role-title">
          {role.title}
        </Heading>
        <p className="role-meta">
          {role.company} · {role.location}
        </p>
        <p className="role-years">{role.years}</p>
      </div>
      {role.engagements.length > 0 && (
        <ol className="engagements" role="list">
          {role.engagements.map((e) => (
            <li key={e.id} className="engagement" id={`entry-${e.id}`}>
              <Heading depth={2} className="engagement-title">
                {e.title}
              </Heading>
              <p className="engagement-years">{e.years}</p>
              <ul className="points">
                {e.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
      {role.points.length > 0 && (
        <ul className="points">
          {role.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
    </li>
  );
}
// #endregion
```

- [ ] **Step 2: Create `src/frames/About.tsx`**

```tsx
import { Download } from "lucide-react";
import { certifications, education, languages, skills } from "@/content/about";
import { profile } from "@/content/profile";
import { Frame, FrameTitle, Heading } from "./Frame";
import { NewTabNote, StackTags } from "./ui";

export function About({ primary }: { primary: boolean }) {
  const { portrait } = profile;
  return (
    <Frame id="about" primary={primary}>
      <header className="frame-head">
        <p className="eyebrow">About</p>
        <FrameTitle>Frontend at the core, AI on top</FrameTitle>
      </header>
      <div className="about-intro">
        <picture className="about-portrait">
          <source srcSet={portrait.avif} type="image/avif" />
          <img src={portrait.webp} alt={portrait.alt} width={portrait.width} height={portrait.height} loading="lazy" decoding="async" />
        </picture>
        <div className="about-bio">
          {profile.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <a className="btn btn--ghost" href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
            <Download size={16} aria-hidden="true" /> Download CV
            <NewTabNote />
          </a>
        </div>
      </div>
      <section className="about-block" aria-labelledby="skills-title">
        <Heading depth={1} id="skills-title" className="block-title">
          Skills
        </Heading>
        <dl className="skills">
          {skills.map((group) => (
            <div key={group.name} className="skill-group">
              <dt>{group.name}</dt>
              <dd>
                <StackTags items={group.items} label={`${group.name} skills`} />
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="about-block" id="certifications" aria-labelledby="certifications-title">
        <Heading depth={1} id="certifications-title" className="block-title">
          Certifications
        </Heading>
        <ul className="certs" role="list">
          {certifications.map((c) => (
            <li key={c.issuer}>
              <p className="cert-issuer">
                {c.issuer} <span>{c.year}</span>
              </p>
              <ul>
                {c.courses.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
      <div className="about-row">
        <section className="about-block" aria-labelledby="education-title">
          <Heading depth={1} id="education-title" className="block-title">
            Education
          </Heading>
          {education.map((e) => (
            <div key={e.id} id={`entry-${e.id}`} className="edu">
              <p className="edu-degree">{e.degree}</p>
              <p className="edu-school">{e.school}</p>
              <p className="edu-years">{e.years}</p>
            </div>
          ))}
        </section>
        <section className="about-block" aria-labelledby="languages-title">
          <Heading depth={1} id="languages-title" className="block-title">
            Languages
          </Heading>
          <ul className="languages" role="list">
            {languages.map((l) => (
              <li key={l.name}>
                <span>{l.name}</span> <span>{l.level}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Frame>
  );
}
```

- [ ] **Step 3: Create `src/styles/experience.css`**

```css
.roles {
  display: grid;
  gap: 48px;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* #region layer:experience-entry */
.role {
  display: grid;
  gap: 20px;
  padding-top: 24px;
  border-top: 1px solid var(--site-line);
}
.role-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 4px 24px;
  align-items: baseline;
}
.role-title {
  margin: 0;
  font: 400 34px/1.1 var(--font-display);
}
.role-meta {
  grid-column: 1;
  margin: 0;
  font-size: 15px;
  color: var(--site-muted);
}
.role-years {
  grid-column: 2;
  grid-row: 1;
  margin: 0;
  font: 500 13px/1.6 var(--font-mono);
  color: var(--accent);
  white-space: nowrap;
}
.engagements {
  display: grid;
  gap: 24px;
  margin: 0;
  padding: 0 0 0 20px;
  list-style: none;
  border-left: 2px solid var(--site-soft);
}
.engagement {
  display: grid;
  gap: 6px;
}
.engagement-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}
.engagement-years {
  margin: 0;
  font: 500 12.5px/1.5 var(--font-mono);
  color: var(--site-muted);
}
.points {
  display: grid;
  gap: 8px;
  margin: 4px 0 0;
  padding-left: 18px;
  font-size: 15.5px;
  line-height: 1.6;
}
/* #endregion */

@media (max-width: 640px) {
  [data-layout="page"] .role-head {
    grid-template-columns: 1fr;
  }
  [data-layout="page"] .role-years {
    grid-column: 1;
    grid-row: auto;
  }
}
```

- [ ] **Step 4: Create `src/styles/about.css`**

```css
.about-intro {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
}
.about-portrait img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--radius);
}
.about-bio {
  display: grid;
  gap: 16px;
  justify-items: start;
  font-size: 16.5px;
  line-height: 1.65;
}
.about-bio p {
  max-width: 56ch;
  margin: 0;
}

.about-block {
  display: grid;
  gap: 16px;
  align-content: start;
}
.block-title {
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--site-line);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--site-muted);
}

.skills {
  display: grid;
  gap: 16px;
  margin: 0;
}
.skill-group {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 16px;
}
.skill-group dt {
  font-size: 15px;
  font-weight: 600;
}
.skill-group dd {
  margin: 0;
}

.certs {
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.cert-issuer {
  margin: 0 0 6px;
  font-weight: 600;
}
.cert-issuer span {
  margin-left: 8px;
  font: 500 12.5px var(--font-mono);
  color: var(--site-muted);
}
.certs ul {
  display: grid;
  gap: 4px;
  margin: 0;
  padding-left: 18px;
  color: var(--site-muted);
}

.about-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
}
.edu p {
  margin: 0;
}
.edu-degree {
  font-weight: 600;
}
.edu-school {
  color: var(--site-muted);
}
.edu-years {
  font: 500 12.5px/1.8 var(--font-mono);
  color: var(--accent);
}
.languages {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.languages li {
  display: flex;
  justify-content: space-between;
  max-width: 260px;
}
.languages li span:last-child {
  color: var(--site-muted);
}

@media (max-width: 720px) {
  [data-layout="page"] .about-intro,
  [data-layout="page"] .about-row,
  [data-layout="page"] .skill-group {
    grid-template-columns: 1fr;
  }
  [data-layout="page"] .about-portrait {
    max-width: 220px;
  }
}
```

- [ ] **Step 5: Add the imports to `src/index.css`**

```css
@import "tailwindcss/base";
@import "./styles/tokens.css";
@import "./styles/base.css";
@import "./styles/frames.css";
@import "./styles/projects.css";
@import "./styles/experience.css";
@import "./styles/about.css";
@import "tailwindcss/utilities";
```

- [ ] **Step 6: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass.

- [ ] **Step 7: Commit**

```bash
git add src/frames src/styles src/index.css
git commit -m "feat: add Experience and About frames"
```

---
### Task 9: Contact frame and the error reporter

**Files:**
- Create: `src/frames/contact/draft.ts`, `src/frames/contact/useContactForm.ts`, `src/frames/Contact.tsx`, `src/frames/index.ts`, `src/styles/contact.css`
- Replace: `netlify/functions/report-error.mjs`
- Modify: `src/index.css`

The form posts to Formspree's JSON endpoint with `fetch`, using the existing `VITE_FORM_ID`. That replaces `@formspree/react`.

- [ ] **Step 1: Create `src/frames/contact/draft.ts`**

```ts
/** Cursor chat on the canvas hands its text to the contact form through this window event. */
export const DRAFT_EVENT = "contact:draft";

export function sendDraft(text: string): void {
  window.dispatchEvent(new CustomEvent<string>(DRAFT_EVENT, { detail: text }));
}
```

- [ ] **Step 2: Create `src/frames/contact/useContactForm.ts`**

```ts
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { z } from "zod";
import { DRAFT_EVENT } from "./draft";

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100, "Use 100 characters or fewer."),
  email: z.string().trim().max(254, "Use 254 characters or fewer.").email("Enter an email address like name@example.com."),
  message: z.string().trim().min(10, "Write at least 10 characters.").max(5000, "Use 5,000 characters or fewer."),
});

export type ContactValues = z.infer<typeof schema>;
export type ContactField = keyof ContactValues;
export type ContactStatus = "idle" | "sending" | "sent" | "failed";

/** Honeypot field name. Formspree discards it; bots fill it in, people never see it. */
export const HONEYPOT = "_gotcha";
export const FORM_ACTION = `https://formspree.io/f/${import.meta.env.VITE_FORM_ID}`;

const EMPTY: ContactValues = { name: "", email: "", message: "" };

export function useContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [focusRequest, setFocusRequest] = useState(0);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  // A cursor-chat draft lands in the message field. Focus waits for the field to exist.
  useEffect(() => {
    const onDraft = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      setValues((v) => ({ ...v, message: v.message ? `${v.message}\n${text}` : text }));
      setErrors((current) => ({ ...current, message: undefined }));
      setStatus((s) => (s === "sending" ? s : "idle"));
      setFocusRequest((n) => n + 1);
    };
    window.addEventListener(DRAFT_EVENT, onDraft);
    return () => window.removeEventListener(DRAFT_EVENT, onDraft);
  }, []);

  useEffect(() => {
    if (focusRequest) messageRef.current?.focus({ preventScroll: true });
  }, [focusRequest]);

  // Move focus to the confirmation so it's announced and keyboard users aren't dropped on <body>.
  useEffect(() => {
    if (status === "sent") doneRef.current?.focus({ preventScroll: true });
  }, [status]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as ContactField;
    const value = e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    if (new FormData(form).get(HONEYPOT)) {
      setStatus("sent");
      return;
    }
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<ContactField, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as ContactField;
        next[field] ??= issue.message;
      }
      // Render the errors before moving focus, so screen readers read the field together with its error.
      flushSync(() => setErrors(next));
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch(FORM_ACTION, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}: ${(await res.text()).slice(0, 500)}`);
      setStatus("sent");
      setValues(EMPTY);
    } catch (err) {
      setStatus("failed");
      reportError(err, parsed.data);
    }
  };

  return { values, errors, status, onChange, submit, messageRef, doneRef };
}

function reportError(err: unknown, data: ContactValues): void {
  fetch("/.netlify/functions/report-error", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      error: String(err).slice(0, 1000),
      data: { name: data.name, email: data.email, message: data.message.slice(0, 1500) },
    }),
  }).catch(() => {
    // Reporting is best effort; the visitor already sees the failure message.
  });
}
```

- [ ] **Step 3: Create `src/frames/Contact.tsx`**

```tsx
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { profile } from "@/content/profile";
import { FORM_ACTION, HONEYPOT, useContactForm } from "./contact/useContactForm";
import { Frame, FrameTitle } from "./Frame";
import { NewTabNote } from "./ui";

export function Contact({ primary }: { primary: boolean }) {
  const form = useContactForm();
  const describedBy = (field: "name" | "email" | "message") =>
    form.errors[field] ? `contact-${field}-error` : undefined;

  return (
    <Frame id="contact" primary={primary}>
      <header className="frame-head">
        <p className="eyebrow">Contact</p>
        <FrameTitle>Let's talk</FrameTitle>
        <p className="frame-lede">Tell me about the product, the team or the role. Messages go straight to my inbox.</p>
      </header>

      {form.status === "sent" ? (
        <div className="form-done" role="status" tabIndex={-1} ref={form.doneRef}>
          <p className="form-done-title">Message sent</p>
          <p>Thanks for writing. I'll reply to the email address you gave.</p>
        </div>
      ) : (
        <form className="contact-form" method="post" action={FORM_ACTION} noValidate onSubmit={form.submit}>
          <Field id="contact-name" label="Name" error={form.errors.name}>
            <input id="contact-name" name="name" type="text" autoComplete="name" required value={form.values.name} onChange={form.onChange} aria-invalid={!!form.errors.name} aria-describedby={describedBy("name")} />
          </Field>
          <Field id="contact-email" label="Email" error={form.errors.email}>
            <input id="contact-email" name="email" type="email" autoComplete="email" required value={form.values.email} onChange={form.onChange} aria-invalid={!!form.errors.email} aria-describedby={describedBy("email")} />
          </Field>
          <Field id="contact-message" label="Message" error={form.errors.message}>
            <textarea id="contact-message" name="message" rows={6} ref={form.messageRef} required value={form.values.message} onChange={form.onChange} aria-invalid={!!form.errors.message} aria-describedby={describedBy("message")} />
          </Field>
          <div className="hp" aria-hidden="true">
            <label htmlFor="contact-gotcha">Leave this field empty</label>
            <input id="contact-gotcha" name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" />
          </div>
          {form.status === "failed" && (
            <p className="form-error" role="alert">
              Your message didn't send. Try again, or email <a href={`mailto:${profile.email}`}>{profile.email}</a>.
            </p>
          )}
          <button className="btn btn--primary" type="submit" disabled={form.status === "sending"}>
            {form.status === "sending" ? "Sending…" : "Send message"}
          </button>
        </form>
      )}

      <ul className="contact-links" role="list">
        <li>
          <Mail size={16} aria-hidden="true" />
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </li>
        <li>
          <Linkedin size={16} aria-hidden="true" />
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
            <NewTabNote />
          </a>
        </li>
        <li>
          <Github size={16} aria-hidden="true" />
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
            <NewTabNote />
          </a>
        </li>
        <li>
          <MapPin size={16} aria-hidden="true" />
          <span>{profile.location}</span>
        </li>
      </ul>
    </Frame>
  );
}

// #region layer:contact-field
function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="field" data-layer="contact-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
// #endregion
```

- [ ] **Step 4: Create `src/frames/index.ts`**

```ts
import type { ComponentType } from "react";
import { About } from "./About";
import { Contact } from "./Contact";
import { Experience } from "./Experience";
import { Home } from "./Home";
import { Projects } from "./Projects";
import type { FrameId } from "./registry";

export const FRAME_COMPONENTS: Record<FrameId, ComponentType<{ primary: boolean }>> = {
  home: Home,
  projects: Projects,
  experience: Experience,
  about: About,
  contact: Contact,
};
```

- [ ] **Step 5: Create `src/styles/contact.css`**

```css
.contact-form {
  display: grid;
  gap: 18px;
}
.contact-form .btn {
  justify-self: start;
}

/* #region layer:contact-field */
.field {
  display: grid;
  gap: 6px;
}
.field label {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--site-muted);
}
.field input,
.field textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 11px 13px;
  border: 1.5px solid var(--field-line);
  border-radius: var(--radius);
  background: var(--site-bg);
  color: var(--site-text);
  font: inherit;
  font-size: 16px;
  line-height: 1.5;
}
.field textarea {
  min-height: 150px;
  resize: vertical;
}
.field input:focus,
.field textarea:focus {
  outline: 2px solid transparent;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
}
.field [aria-invalid="true"] {
  border-color: var(--danger);
}
.field-error {
  margin: 0;
  font-size: 13.5px;
  color: var(--danger);
}
/* #endregion */

.form-error {
  margin: 0;
  padding: 12px 14px;
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--danger) 10%, var(--site-bg));
  font-size: 14.5px;
}
.form-error a {
  font-weight: 600;
}

.form-done {
  padding: 24px;
  border-radius: var(--radius);
  background: var(--site-soft);
}
.form-done p {
  margin: 0;
}
.form-done .form-done-title {
  margin: 0 0 6px;
  font: 400 30px/1.1 var(--font-display);
}
.form-done:focus {
  outline: none;
}

.contact-links {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 15px;
}
.contact-links li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--site-muted);
}
.contact-links a {
  color: var(--site-text);
  font-weight: 600;
  text-decoration: none;
}
.contact-links a:hover {
  color: var(--accent);
}

.hp {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
```

- [ ] **Step 6: Add the import to `src/index.css`**

```css
@import "tailwindcss/base";
@import "./styles/tokens.css";
@import "./styles/base.css";
@import "./styles/frames.css";
@import "./styles/projects.css";
@import "./styles/experience.css";
@import "./styles/about.css";
@import "./styles/contact.css";
@import "tailwindcss/utilities";
```

- [ ] **Step 7: Replace `netlify/functions/report-error.mjs`**

```js
// Reports contact-form failures to Slack. Accepts only small JSON posts from the site and its own deploy previews.
const MAX_BYTES = 4096;

const escapeSlack = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const field = (value, max) => (typeof value === "string" ? value.slice(0, max) : "");

export default async (req, context) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const allowed = [/^https:\/\/(www\.)?artiomleo\.com$/];
  const site = context?.site?.name;
  if (site) allowed.push(new RegExp(`^https://([a-z0-9-]+--)?${site}\\.netlify\\.app$`));
  const origin = req.headers.get("origin") ?? "";
  if (!allowed.some((pattern) => pattern.test(origin))) return new Response("Forbidden", { status: 403 });

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BYTES) return new Response("Payload too large", { status: 413 });
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > MAX_BYTES) return new Response("Payload too large", { status: 413 });

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body || typeof body !== "object" || typeof body.error !== "string") {
    return new Response("Invalid payload", { status: 400 });
  }

  // VITE_SLACK_WEBHOOK_URL is the old name; it works until the variable is renamed in Netlify.
  const webhookUrl = Netlify.env.get("SLACK_WEBHOOK_URL") || Netlify.env.get("VITE_SLACK_WEBHOOK_URL");
  if (!webhookUrl) return new Response("Reporting is not configured", { status: 500 });

  const data = body.data && typeof body.data === "object" ? body.data : {};
  const report = {
    error: field(body.error, 1000),
    name: field(data.name, 100),
    email: field(data.email, 254),
    message: field(data.message, 1500),
  };

  try {
    const slackRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: `Form submission error:\n\`\`\`${escapeSlack(JSON.stringify(report, null, 2))}\`\`\`` }),
      signal: AbortSignal.timeout(5000),
    });
    if (!slackRes.ok) return new Response("Failed to notify Slack", { status: 502 });
  } catch {
    return new Response("Failed to notify Slack", { status: 502 });
  }
  return new Response("Reported to Slack", { status: 200 });
};
```

- [ ] **Step 8: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass.

- [ ] **Step 9: Commit**

```bash
git add src/frames src/styles/contact.css src/index.css netlify/functions/report-error.mjs
git commit -m "feat: add Contact frame with validated form and harden the error reporter"
```

---
### Task 10: SEO head tags

**Files:**
- Create: `src/seo/site.ts`, `src/seo/routes.ts`, `src/seo/jsonld.ts`, `src/seo/head.ts`, `src/seo/useRouteMeta.ts`

- [ ] **Step 1: Create `src/seo/site.ts`**

```ts
export const SITE_URL = "https://artiomleo.com";
export const SITE_NAME = "Artiom Leontiev";
```

- [ ] **Step 2: Create `src/seo/routes.ts`**

```ts
import type { FrameId } from "@/frames/registry";
import { SITE_URL } from "./site";

export type RouteId = FrameId | "notFound";

export type RouteMeta = {
  id: RouteId;
  path: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const ROUTES: RouteMeta[] = [
  {
    id: "home",
    path: "/",
    title: "Artiom Leontiev · Senior Frontend Engineer, AI-powered apps",
    description: "Senior frontend engineer in Cluj-Napoca building AI-powered web apps with React and Vue: LLM integrations, RAG, agents and MCP servers.",
    image: "/og/home.png",
    imageAlt: "Artiom Leontiev, Senior Frontend Engineer, AI-powered applications",
  },
  {
    id: "projects",
    path: "/projects",
    title: "Projects · Artiom Leontiev",
    description: "Side projects including Klipsy and Council, plus client work in AI tooling, micro-frontends and accessible healthcare platforms.",
    image: "/og/projects.png",
    imageAlt: "Projects by Artiom Leontiev",
  },
  {
    id: "experience",
    path: "/experience",
    title: "Experience · Artiom Leontiev",
    description: "7+ years at Amdaris and BinarCode: AI products, frontend leadership on micro-frontend platforms, and full-stack Vue and Laravel work.",
    image: "/og/experience.png",
    imageAlt: "Experience of Artiom Leontiev",
  },
  {
    id: "about",
    path: "/about",
    title: "About · Artiom Leontiev",
    description: "Skills, certifications and background: Vue, React, TypeScript, AI engineering with Claude and OpenAI, accessibility and web performance.",
    image: "/og/about.png",
    imageAlt: "About Artiom Leontiev",
  },
  {
    id: "contact",
    path: "/contact",
    title: "Contact · Artiom Leontiev",
    description: "Get in touch with Artiom Leontiev about frontend architecture, React and Vue work, or AI product engineering. Based in Cluj-Napoca, Romania.",
    image: "/og/contact.png",
    imageAlt: "Contact Artiom Leontiev",
  },
  {
    id: "notFound",
    path: "/404",
    title: "Frame not found · Artiom Leontiev",
    description: "This page doesn't exist. Go to Home, Projects, Experience, About or Contact.",
    image: "/og/home.png",
    imageAlt: "Artiom Leontiev, Senior Frontend Engineer, AI-powered applications",
  },
];

export function routeMeta(id: RouteId): RouteMeta {
  return ROUTES.find((r) => r.id === id)!;
}

/** Canonical URL, or null for the 404 page. */
export function canonicalUrl(meta: RouteMeta): string | null {
  if (meta.id === "notFound") return null;
  return SITE_URL + (meta.path === "/" ? "/" : meta.path);
}
```

- [ ] **Step 3: Create `src/seo/jsonld.ts`**

```ts
import { profile } from "@/content/profile";
import type { RouteMeta } from "./routes";
import { SITE_NAME, SITE_URL } from "./site";

function person() {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: profile.name,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}${profile.portrait.webp}`,
    jobTitle: profile.title,
    description: profile.lede,
    address: { "@type": "PostalAddress", addressLocality: "Cluj-Napoca", addressCountry: "RO" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Technical University of Cluj-Napoca" },
    knowsAbout: ["Vue", "React", "TypeScript", "Micro-frontends", "Accessibility", "Web performance", "LLM integrations", "RAG", "AI agents", "Model Context Protocol"],
    sameAs: [profile.github, profile.linkedin],
  };
}

/** Person on every page; WebSite and ProfilePage on the home page; nothing on the 404 page. */
export function jsonLd(meta: RouteMeta): object[] {
  if (meta.id === "notFound") return [];
  if (meta.id !== "home") return [{ "@context": "https://schema.org", ...person() }];
  return [
    {
      "@context": "https://schema.org",
      "@graph": [
        person(),
        { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: SITE_NAME, inLanguage: "en" },
        {
          "@type": "ProfilePage",
          "@id": `${SITE_URL}/#profile`,
          url: `${SITE_URL}/`,
          name: meta.title,
          mainEntity: { "@id": `${SITE_URL}/#person` },
          isPartOf: { "@id": `${SITE_URL}/#website` },
        },
      ],
    },
  ];
}
```

- [ ] **Step 4: Create `src/seo/head.ts`**

```ts
import { jsonLd } from "./jsonld";
import { canonicalUrl, type RouteMeta } from "./routes";
import { SITE_NAME, SITE_URL } from "./site";

const escapeAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Head tags for one route, as an HTML string for the prerender script. */
export function headTags(meta: RouteMeta): string {
  const url = canonicalUrl(meta);
  const image = SITE_URL + meta.image;
  const tags: Array<string | false> = [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}">`,
    url !== null && `<link rel="canonical" href="${url}">`,
    meta.id === "notFound" && `<meta name="robots" content="noindex">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}">`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}">`,
    url !== null && `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${escapeAttr(meta.imageAlt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}">`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}">`,
    `<meta name="twitter:image" content="${image}">`,
    ...jsonLd(meta).map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`),
  ];
  return tags.filter(Boolean).join("\n    ");
}
```

- [ ] **Step 5: Create `src/seo/useRouteMeta.ts`**

```ts
import { useEffect } from "react";
import { canonicalUrl, routeMeta, type RouteId } from "./routes";
import { SITE_URL } from "./site";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (href === null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Keeps the title and share tags in step with client-side navigation. Prerendered HTML already has them. */
export function useRouteMeta(id: RouteId): void {
  useEffect(() => {
    const meta = routeMeta(id);
    const url = canonicalUrl(meta);
    const image = SITE_URL + meta.image;
    document.title = meta.title;
    setMeta("name", "description", meta.description);
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:title", meta.title);
    setMeta("name", "twitter:description", meta.description);
    setMeta("name", "twitter:image", image);
    if (url) setMeta("property", "og:url", url);
    else document.head.querySelector('meta[property="og:url"]')?.remove();
    setCanonical(url);
  }, [id]);
}
```

- [ ] **Step 6: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass.

- [ ] **Step 7: Commit**

```bash
git add src/seo
git commit -m "feat: add per-route meta, share tags and structured data"
```

---
### Task 11: Shell for the page layout

After this task the site works everywhere in page layout: phones, desktop Page view, and the canvas fallback until Task 13.

**Files:**
- Create: `src/devmode/swatches.ts`, `src/devmode/DevModeProvider.tsx`, `src/canvas/cursors.ts`, `src/shell/Mark.tsx`, `src/shell/ThemeToggle.tsx`, `src/shell/VersionHistory.tsx`, `src/shell/FramesNav.tsx`, `src/shell/TopBar.tsx`, `src/shell/Shell.tsx`, `src/styles/shell.css`, `src/styles/page.css`
- Replace: `src/App.tsx`, `src/main.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Create `src/devmode/swatches.ts`**

```ts
export type SwatchId = "violet" | "pink" | "blue" | "orange";

/** Light values take white text, dark values take #141414 text; all pass 4.5:1. CSS lives in tokens.css. */
export const SWATCHES: { id: SwatchId; name: string; light: string; dark: string }[] = [
  { id: "violet", name: "Violet", light: "#6A4DF5", dark: "#A08CFF" },
  { id: "pink", name: "Pink", light: "#D92D72", dark: "#F06A9B" },
  { id: "blue", name: "Blue", light: "#0A74D1", dark: "#4DA3FF" },
  { id: "orange", name: "Orange", light: "#C2410C", dark: "#F5894A" },
];

export function applyAccent(id: SwatchId): void {
  const root = document.documentElement;
  if (id === "violet") root.removeAttribute("data-accent");
  else root.setAttribute("data-accent", id);
}
```

- [ ] **Step 2: Create `src/devmode/DevModeProvider.tsx`** (Task 15 adds the inspector)

```tsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dialogOpen, isTypingTarget } from "@/lib/keys";
import { applyAccent, type SwatchId } from "./swatches";

type DevModeState = {
  on: boolean;
  toggle: () => void;
  exit: () => void;
  /** The visitor's chosen accent. Not saved between visits. */
  accent: SwatchId;
  setAccent: (id: SwatchId) => void;
};

const DevModeContext = createContext<DevModeState | null>(null);

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  const [accent, setAccentState] = useState<SwatchId>("violet");
  const toggle = useCallback(() => setOn((v) => !v), []);
  const exit = useCallback(() => setOn(false), []);
  const setAccent = useCallback((id: SwatchId) => {
    applyAccent(id);
    setAccentState(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target) || dialogOpen()) return;
      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        setOn((v) => !v);
      } else if (e.key === "Escape") {
        setOn(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-devmode", on);
  }, [on]);

  const value = useMemo(() => ({ on, toggle, exit, accent, setAccent }), [on, toggle, exit, accent, setAccent]);
  return <DevModeContext.Provider value={value}>{children}</DevModeContext.Provider>;
}

export function useDevMode(): DevModeState {
  const value = useContext(DevModeContext);
  if (!value) throw new Error("useDevMode must be used inside DevModeProvider");
  return value;
}
```

- [ ] **Step 3: Create `src/canvas/cursors.ts`**

```ts
/** The scripted demo cursors. White label text passes 4.5:1 on pink and violet; amber takes dark text. */
export const DEMO_CURSORS = [
  { id: "designer", name: "Designer", initials: "D", color: "var(--cursor-designer)", text: "#FFFFFF" },
  { id: "pm", name: "PM", initials: "PM", color: "var(--cursor-pm)", text: "#FFFFFF" },
  { id: "artiom", name: "Artiom", initials: "A", color: "var(--cursor-artiom)", text: "#1E1E1E" },
] as const;

export type DemoCursorId = (typeof DEMO_CURSORS)[number]["id"];
```

- [ ] **Step 4: Create `src/shell/Mark.tsx`**

```tsx
/** The site mark: a canvas cursor on the accent colour. Same shape as public/favicon.svg. */
export function Mark() {
  return (
    <svg className="mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect className="mark-bg" width="32" height="32" rx="8" />
      <path className="mark-cursor" d="M10 7v17.5l4.4-4.1 3 6.2 3.1-1.5-3-6.1h6.2z" />
    </svg>
  );
}
```

- [ ] **Step 5: Create `src/shell/ThemeToggle.tsx`**

```tsx
import { Moon, Sun } from "lucide-react";
import { useLayout } from "@/layout/LayoutProvider";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useLayout();
  return (
    <button type="button" className="tb-icon" onClick={toggleTheme} aria-label="Dark theme" aria-pressed={mounted ? theme === "dark" : false}>
      <Moon className="icon-moon" size={16} aria-hidden="true" />
      <Sun className="icon-sun" size={16} aria-hidden="true" />
    </button>
  );
}
```

- [ ] **Step 6: Create `src/shell/VersionHistory.tsx`**

Canvas only; it renders nothing in page layout.

```tsx
import { useCanvasApi } from "@/canvas/CanvasApi";
import { history } from "@/content/history";
import { cx } from "@/lib/cx";

// #region layer:history-item
export function VersionHistory() {
  const canvas = useCanvasApi();
  if (!canvas) return null;
  return (
    <section className="history" aria-label="Version history">
      <p className="panel-heading" aria-hidden="true">
        Version history
      </p>
      <ol className="history-list">
        {history.map((item, i) => (
          <li key={item.id}>
            <button type="button" className={cx("history-item", i === 0 && "history-item--now")} data-layer="history-item" onClick={() => canvas.focusElement(item.id)}>
              <span className="history-label">{item.label}</span>
              <span className="history-years">{item.years}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
// #endregion
```

- [ ] **Step 7: Create `src/shell/FramesNav.tsx`**

```tsx
import { Link } from "react-router-dom";
import { useCanvasApi } from "@/canvas/CanvasApi";
import { FRAMES, type FrameId } from "@/frames/registry";
import { VersionHistory } from "./VersionHistory";

// #region layer:nav
export function FramesNav({ current }: { current?: FrameId }) {
  const canvas = useCanvasApi();
  return (
    <nav className="frames-nav" aria-label="Frames" data-layer="nav">
      <p className="panel-heading" aria-hidden="true">
        Frames
      </p>
      <ul className="frames-list">
        {FRAMES.map((f, i) => (
          <li key={f.id}>
            <Link
              to={f.path}
              className="frames-link"
              aria-current={current === f.id ? "page" : undefined}
              onClick={() => canvas?.focusFrame(f.id)}
            >
              <span className="frames-link-mark" aria-hidden="true">#</span>
              <span>{f.label}</span>
              <kbd className="frames-link-key" aria-hidden="true">
                {i + 1}
              </kbd>
            </Link>
          </li>
        ))}
      </ul>
      <VersionHistory />
    </nav>
  );
}
// #endregion
```

- [ ] **Step 8: Create `src/shell/TopBar.tsx`**

```tsx
import { Code, Keyboard } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { DEMO_CURSORS } from "@/canvas/cursors";
import { useDevMode } from "@/devmode/DevModeProvider";
import { useLayout } from "@/layout/LayoutProvider";
import { Mark } from "./Mark";
import { ThemeToggle } from "./ThemeToggle";

/** onHelp is passed only in canvas layout, where keyboard shortcuts exist. */
export function TopBar({ onHelp }: { onHelp?: () => void }) {
  const { mounted, canCanvas, pageView, setPageView } = useLayout();
  const devMode = useDevMode();
  return (
    <header className="topbar">
      <Link to="/" className="topbar-file">
        <Mark />
        <span className="topbar-file-name">
          <b>artiom-leontiev</b>
          <span className="topbar-file-sub"> / portfolio</span>
        </span>
      </Link>
      <div className="topbar-people" aria-hidden="true">
        {DEMO_CURSORS.map((c) => (
          <span key={c.id} className="avatar" style={{ "--c": c.color, "--ct": c.text } as CSSProperties} title={`${c.name} · Demo cursor`}>
            {c.initials}
          </span>
        ))}
      </div>
      <div className="topbar-actions">
        <button type="button" className="tb-btn" aria-pressed={devMode.on} onClick={devMode.toggle}>
          <Code size={15} aria-hidden="true" />
          <span className="tb-btn-text">Dev Mode</span>
          <kbd aria-hidden="true">D</kbd>
        </button>
        {mounted && canCanvas && (
          <button type="button" className="tb-btn" onClick={() => setPageView(!pageView)}>
            {pageView ? "Canvas view" : "Page view"}
          </button>
        )}
        {onHelp && (
          <button type="button" className="tb-icon" onClick={onHelp} aria-label="Keyboard shortcuts">
            <Keyboard size={16} aria-hidden="true" />
          </button>
        )}
        <ThemeToggle />
        <Link to="/contact" className="topbar-cta">
          Contact
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 9: Create `src/shell/Shell.tsx`** (Task 13 adds the canvas branch)

```tsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FRAME_COMPONENTS } from "@/frames";
import { NotFound } from "@/frames/NotFound";
import { frameForPath, type FrameId } from "@/frames/registry";
import { useLayout } from "@/layout/LayoutProvider";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import { useRouteMeta } from "@/seo/useRouteMeta";
import { FramesNav } from "./FramesNav";
import { TopBar } from "./TopBar";

export function Shell() {
  const { pathname } = useLocation();
  const frame = frameForPath(pathname);
  const { mounted } = useLayout();
  const firstRender = useRef(true);

  useRouteMeta(frame?.id ?? "notFound");

  // Leave the boot script's choice alone until React has mounted.
  useIsoLayoutEffect(() => {
    if (mounted) document.documentElement.dataset.layout = "page";
  }, [mounted]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <TopBar />
      <FramesNav current={frame?.id} />
      <main id="main" className="page-main" tabIndex={-1}>
        {frame ? <PageFrame id={frame.id} /> : <NotFound />}
      </main>
    </>
  );
}

function PageFrame({ id }: { id: FrameId }) {
  const FrameComponent = FRAME_COMPONENTS[id];
  return <FrameComponent primary />;
}
```

- [ ] **Step 10: Replace `src/App.tsx`**

```tsx
import { CanvasApiProvider } from "@/canvas/CanvasApi";
import { DevModeProvider } from "@/devmode/DevModeProvider";
import { LayoutProvider } from "@/layout/LayoutProvider";
import { Shell } from "@/shell/Shell";

export default function App() {
  return (
    <LayoutProvider>
      <CanvasApiProvider>
        <DevModeProvider>
          <Shell />
        </DevModeProvider>
      </CanvasApiProvider>
    </LayoutProvider>
  );
}
```

- [ ] **Step 11: Replace `src/main.tsx`**

The root holds prerendered markup in production and only a comment in `vite dev`.

```tsx
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/onest/wght.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
```

- [ ] **Step 12: Create `src/styles/shell.css`**

```css
/* Top bar */
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 12px;
  height: var(--bar-h);
  padding: 0 12px;
  background: var(--tool-ui);
  border-bottom: 1px solid var(--tool-line);
  color: var(--tool-text);
  font-size: 13px;
}
[data-layout="canvas"] .topbar {
  position: fixed;
  left: 0;
  right: 0;
}
.topbar-file {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: var(--tool-muted);
  text-decoration: none;
  white-space: nowrap;
}
.topbar-file b {
  color: var(--tool-text);
  font-weight: 600;
}
.mark {
  flex: none;
  width: 24px;
  height: 24px;
}
.mark-bg {
  fill: var(--accent);
  transition: fill 0.4s ease;
}
.mark-cursor {
  fill: var(--on-accent);
}
.topbar-people {
  display: flex;
  margin-left: auto;
}
.avatar {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  margin-left: -7px;
  border-radius: 50%;
  background: var(--c);
  color: var(--ct);
  font-size: 10.5px;
  font-weight: 700;
  box-shadow: 0 0 0 2px var(--tool-ui);
  cursor: default;
}
.avatar:first-child {
  margin-left: 0;
}
.topbar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}
[data-layout="canvas"] .topbar-actions {
  margin-left: 12px;
}
.tb-btn,
.tb-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--tool-text);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
.tb-icon {
  width: 32px;
  padding: 0;
}
.tb-btn:hover,
.tb-icon:hover {
  background: color-mix(in srgb, var(--tool-text) 8%, transparent);
}
.tb-btn[aria-pressed="true"] {
  background: var(--select);
  color: var(--on-select);
}
.tb-btn kbd {
  padding: 0 4px;
  border-radius: 3px;
  background: color-mix(in srgb, currentColor 14%, transparent);
  font-size: 11px;
}
[data-theme="dark"] .icon-moon,
:root:not([data-theme="dark"]) .icon-sun {
  display: none;
}
.topbar-cta {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  background: var(--select);
  color: var(--on-select);
  font-weight: 600;
  text-decoration: none;
}

/* Frames panel (canvas) and frame bar (page) */
.panel-heading {
  margin: 0 0 6px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--tool-muted);
}
/* #region layer:nav */
.frames-nav {
  box-sizing: border-box;
  background: var(--tool-ui);
  color: var(--tool-text);
  font-size: 13px;
}
.frames-list {
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.frames-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 6px;
  color: var(--tool-text);
  text-decoration: none;
}
.frames-link:hover {
  background: color-mix(in srgb, var(--tool-text) 7%, transparent);
}
.frames-link[aria-current="page"] {
  background: color-mix(in srgb, var(--select) 15%, transparent);
  font-weight: 600;
}
.frames-link-mark {
  font-family: var(--font-mono);
  color: var(--tool-muted);
}
.frames-link-key {
  margin-left: auto;
  color: var(--tool-muted);
  font-size: 11px;
}
/* #endregion */
[data-layout="canvas"] .frames-nav {
  position: fixed;
  top: var(--bar-h);
  left: 0;
  bottom: 0;
  z-index: 20;
  width: var(--panel-w);
  padding: 14px 8px;
  border-right: 1px solid var(--tool-line);
  overflow-y: auto;
}
[data-layout="page"] .frames-nav {
  position: sticky;
  top: var(--bar-h);
  z-index: 20;
  padding: 6px 8px;
  border-bottom: 1px solid var(--tool-line);
  overflow-x: auto;
}
[data-layout="page"] .frames-nav .panel-heading,
[data-layout="page"] .frames-link-key,
[data-layout="page"] .topbar-people {
  display: none;
}
[data-layout="page"] .frames-list {
  display: flex;
  gap: 4px;
}
[data-layout="page"] .frames-link {
  white-space: nowrap;
}

/* Version history */
.history {
  margin-top: 20px;
}
.history-list {
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}
/* #region layer:history-item */
.history-item {
  position: relative;
  display: grid;
  gap: 1px;
  width: 100%;
  padding: 7px 8px 7px 24px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--tool-text);
  text-align: left;
  cursor: pointer;
}
.history-item::before {
  content: "";
  position: absolute;
  left: 10px;
  top: 13px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--tool-muted);
}
.history-item--now::before {
  background: var(--select);
}
.history-item:hover {
  background: color-mix(in srgb, var(--tool-text) 7%, transparent);
}
.history-label {
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.35;
}
.history-years {
  font-size: 12px;
  color: var(--tool-muted);
}
/* #endregion */

@media (max-width: 520px) {
  .topbar-file-sub {
    display: none;
  }
  .tb-btn .tb-btn-text {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
  .tb-btn kbd {
    display: none;
  }
}
```

- [ ] **Step 13: Create `src/styles/page.css`**

```css
/* Page layout: phones, tablets, Page view, no JavaScript. */
[data-layout="page"] body {
  background-color: var(--tool-bg);
  background-image: radial-gradient(var(--tool-dot) 1px, transparent 1.3px);
  background-size: 20px 20px;
}
.page-main {
  box-sizing: border-box;
  padding: 52px 16px 72px;
  outline: none;
}
[data-layout="page"] .page-main .frame {
  width: auto;
  max-width: var(--frame-w);
  margin: 0 auto;
  padding: clamp(24px, 6vw, 56px);
}
[data-layout="page"] .hero-title {
  font-size: clamp(44px, 11vw, 76px);
}
[data-layout="page"] .frame-title {
  font-size: clamp(40px, 9vw, 56px);
}
[data-layout="page"] .frame-body {
  gap: 32px;
}

/* First paint on the canvas, before React takes over: the route's frame sits where the camera will land.
   --boot-x and --boot-z come from the boot script in index.html; 56px is PAD_TOP. */
[data-layout="canvas"] body {
  overflow: hidden;
}
[data-layout="canvas"] .page-main {
  position: fixed;
  top: var(--bar-h);
  left: var(--panel-w);
  right: 0;
  bottom: 0;
  padding: 0;
  overflow: hidden;
  background-color: var(--tool-bg);
  background-image: radial-gradient(var(--tool-dot) 1px, transparent 1.3px);
  background-size: calc(20px * var(--boot-z, 1)) calc(20px * var(--boot-z, 1));
  background-position: var(--boot-x, 0px) 56px;
}
[data-layout="canvas"] .page-main > .frame {
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
  transform: translate(var(--boot-x, 0px), 56px) scale(var(--boot-z, 1));
}
```

- [ ] **Step 14: Add the imports to `src/index.css`**

```css
@import "tailwindcss/base";
@import "./styles/tokens.css";
@import "./styles/base.css";
@import "./styles/frames.css";
@import "./styles/projects.css";
@import "./styles/experience.css";
@import "./styles/about.css";
@import "./styles/contact.css";
@import "./styles/shell.css";
@import "./styles/page.css";
@import "tailwindcss/utilities";
```

- [ ] **Step 15: Verify the build**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all pass.

- [ ] **Step 16: Check the page layout in the browser**

Run `pnpm dev` and open http://localhost:8080. Then check:
- Every route shows exactly one frame: `/`, `/projects`, `/experience`, `/about` and `/contact`. The frame bar links switch between them, and each frame ends with "Next: …".
- `/nope` shows "Frame not found" with five links.
- At 390px wide (DevTools device toolbar), `document.documentElement.scrollWidth` equals `390` on every route.
- The theme toggle switches dark and light, and a reload keeps the choice.
- Pressing `D` turns the Dev Mode button blue (`aria-pressed="true"`), and `Esc` turns it off.
- On a desktop window, the boot script sets `data-layout="canvas"` on first paint, and the frame is drawn on the dot grid. After React mounts, Shell switches to page layout. Task 13 replaces this with the real canvas.
- Contact with an empty submit shows three field errors, and focus moves to Name.

- [ ] **Step 17: Commit**

```bash
git add -A
git commit -m "feat: add the shell and page layout"
```

---
### Task 12: Prerendering, sitemap, headers and Netlify config

**Files:**
- Create: `src/entry-server.tsx`, `scripts/prerender.mjs`, `netlify.toml`
- Replace: `public/_redirects`, `public/robots.txt`
- Delete: `public/sitemap.xml`
- Modify: `package.json` (`build` script)

All response headers live in the generated `dist/_headers`, so the CSP can carry the inline-script hashes. `netlify.toml` holds only the build settings. Netlify already serves HTML with `max-age=0, must-revalidate`.

- [ ] **Step 1: Create `src/entry-server.tsx`**

```tsx
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import { headTags } from "./seo/head";
import { ROUTES } from "./seo/routes";
import { SITE_URL } from "./seo/site";

export const routes = ROUTES;
export const siteUrl = SITE_URL;

export function render(url: string): { html: string; head: string } {
  const meta = ROUTES.find((r) => r.path === url);
  if (!meta) throw new Error(`No route meta for ${url}`);
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  return { html, head: headTags(meta) };
}
```

- [ ] **Step 2: Create `scripts/prerender.mjs`**

```js
// Runs after `vite build` and `vite build --ssr`. For every route it writes HTML with the rendered app and
// that route's head tags, then writes 404.html, sitemap.xml and _headers (CSP with inline-script hashes).
import { createHash } from "node:crypto";
import { readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render, routes, siteUrl } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const template = await readFile(path.join(dist, "index.html"), "utf8");

const assets = await readdir(path.join(dist, "assets"));
const heroFont = assets.find((f) => /^instrument-serif-latin-400-normal-[\w-]+\.woff2$/.test(f));
if (!heroFont) console.warn("prerender: hero font not found, skipping the preload");
const preload = heroFont ? `<link rel="preload" href="/assets/${heroFont}" as="font" type="font/woff2" crossorigin>` : "";

const scriptHashes = new Set();
const inlineScript = /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g;

for (const route of routes) {
  const { html, head } = render(route.path);
  // Replacer functions, so a "$" in the content is never read as a replacement pattern.
  const page = template.replace("<!--app-head-->", () => `${preload}\n    ${head}`).replace("<!--app-html-->", () => html);
  for (const match of page.matchAll(inlineScript)) {
    scriptHashes.add(`'sha256-${createHash("sha256").update(match[1]).digest("base64")}'`);
  }
  const file = route.id === "notFound" ? "404.html" : route.path === "/" ? "index.html" : `${route.path.slice(1)}.html`;
  await writeFile(path.join(dist, file), page);
  console.log(`prerender: ${file}`);
}

const today = new Date().toISOString().slice(0, 10);
const urls = routes
  .filter((r) => r.id !== "notFound")
  .map((r) => `  <url><loc>${siteUrl}${r.path === "/" ? "/" : r.path}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n");
await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

const csp = [
  "default-src 'self'",
  `script-src 'self' https://www.googletagmanager.com ${[...scriptHashes].join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://formspree.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://formspree.io",
  "object-src 'none'",
].join("; ");

await writeFile(
  path.join(dist, "_headers"),
  [
    "/*",
    `  Content-Security-Policy: ${csp}`,
    "  Strict-Transport-Security: max-age=31536000; includeSubDomains",
    "  X-Content-Type-Options: nosniff",
    "  Referrer-Policy: strict-origin-when-cross-origin",
    "  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "/assets/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    "",
  ].join("\n"),
);

await rm(ssrDir, { recursive: true, force: true });
console.log(`prerender: sitemap.xml, _headers (${scriptHashes.size} inline script hashes)`);
```

- [ ] **Step 3: Update the `build` script in `package.json`**

```json
    "build": "vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs",
```

- [ ] **Step 4: Create `netlify.toml`**

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

- [ ] **Step 5: Replace `public/_redirects`**

Removing the `/* /index.html 200` catch-all lets unknown paths get `404.html` with a real 404 status.

```
/home  /  301
```

- [ ] **Step 6: Replace `public/robots.txt`, delete the static sitemap**

```
User-agent: *
Allow: /

Sitemap: https://artiomleo.com/sitemap.xml
```

```bash
git rm -q public/sitemap.xml
```

- [ ] **Step 7: Build and check the output**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: the log lists `prerender: index.html`, `projects.html`, `experience.html`, `about.html`, `contact.html`, `404.html`, then `sitemap.xml, _headers (2 inline script hashes)`.

Then run:

```bash
ls dist/*.html
grep -o "<title>[^<]*</title>" dist/projects.html
grep -c 'data-frame="projects"' dist/projects.html
grep -c 'data-frame="home"' dist/projects.html
grep -c "<loc>" dist/sitemap.xml
grep -c 'rel="preload"' dist/index.html
grep -c 'name="robots" content="noindex"' dist/404.html
head -3 dist/_headers
```

Expected, in order:
1. Six HTML files.
2. `<title>Projects · Artiom Leontiev</title>`
3. `1`
4. `0`
5. `5`
6. `1`
7. `1`
8. `/*`, then the `Content-Security-Policy:` line with two `'sha256-…'` values.

- [ ] **Step 8: Check the served site**

Run `pnpm preview` and open http://localhost:3000. Then check:
- `/experience` loads the Experience frame, and the console shows no errors (React logs hydration mismatches as errors).
- With JavaScript disabled (DevTools → Settings → Debugger → Disable JavaScript), `/about` still shows the full About frame.
- `/nope` shows the "Frame not found" page.
- View source on `/` shows the title, description, canonical URL, `og:*` and `twitter:*` tags, and one JSON-LD script with `@graph`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: prerender every route with head tags, sitemap and security headers"
```

---
### Task 13: Canvas layout

**Files:**
- Create: `src/canvas/controller.ts`, `src/canvas/input.ts`, `src/canvas/ZoomControls.tsx`, `src/canvas/Minimap.tsx`, `src/canvas/useCanvasShortcuts.ts`, `src/shell/ShortcutsDialog.tsx`, `src/canvas/CanvasRoot.tsx`, `src/styles/canvas.css`
- Replace: `src/shell/Shell.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Create `src/canvas/controller.ts`**

```ts
import { flightAt, planFlight, zoomAround, type Flight, type View, type Viewport } from "./camera";

type Listener = (view: View) => void;

/** Owns the camera. Writes the world transform and dot grid straight to the DOM; React never re-renders for it. */
export class CameraController {
  view: View = { z: 1, x: 0, y: 0 };
  vp: Viewport = { w: 1, h: 1 };
  private flight: Flight | null = null;
  private raf = 0;
  private restTimer = 0;
  private listeners = new Set<Listener>();

  constructor(
    private viewport: HTMLElement,
    private world: HTMLElement,
    private reducedMotion: () => boolean,
  ) {}

  measure() {
    this.vp = { w: this.viewport.clientWidth || 1, h: this.viewport.clientHeight || 1 };
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.view);
    return () => {
      this.listeners.delete(fn);
    };
  }

  isFlying() {
    return this.flight !== null;
  }

  set(view: View) {
    this.stop();
    this.view = view;
    this.apply(true);
  }

  flyTo(to: View, duration = 1000) {
    if (this.reducedMotion() || duration <= 0) {
      this.set(to);
      return;
    }
    this.stop();
    this.flight = planFlight(this.view, to, this.vp, performance.now(), duration);
    const tick = (now: number) => {
      if (!this.flight) return;
      const { view, done } = flightAt(this.flight, now);
      this.view = view;
      if (done) {
        this.flight = null;
        this.apply(true);
        return;
      }
      this.apply(false);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  panBy(dx: number, dy: number) {
    this.stop();
    this.view = { ...this.view, x: this.view.x + dx, y: this.view.y + dy };
    this.moving();
  }

  zoomAt(z: number, cx: number, cy: number, animate = false) {
    const to = zoomAround(this.view, z, cx, cy);
    if (animate) {
      this.flyTo(to, 250);
      return;
    }
    this.stop();
    this.view = to;
    this.moving();
  }

  stop() {
    this.flight = null;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  cancel() {
    this.stop();
    window.clearTimeout(this.restTimer);
  }

  // While moving, use fractional px and will-change; at rest, round to whole px so text stays crisp.
  private moving() {
    this.apply(false);
    window.clearTimeout(this.restTimer);
    this.restTimer = window.setTimeout(() => this.apply(true), 140);
  }

  private apply(rest: boolean) {
    const { x, y, z } = this.view;
    const tx = rest ? Math.round(x) : x;
    const ty = rest ? Math.round(y) : y;
    this.world.style.transform = `translate(${tx}px, ${ty}px) scale(${z})`;
    this.world.style.willChange = rest ? "auto" : "transform";
    this.viewport.style.backgroundSize = `${20 * z}px ${20 * z}px`;
    this.viewport.style.backgroundPosition = `${tx}px ${ty}px`;
    this.listeners.forEach((fn) => fn(this.view));
  }
}
```

- [ ] **Step 2: Create `src/canvas/input.ts`**

```ts
import type { CameraController } from "./controller";

// Pointer-downs on these never start a pan.
const NO_PAN = "a, button, input, textarea, select, label, summary, [contenteditable], [data-nopan]";

/** Drag to pan, wheel to pan, Ctrl/⌘ + wheel or pinch to zoom. Returns a function that detaches everything. */
export function attachCanvasInput(viewport: HTMLElement, cam: CameraController, onUser: () => void): () => void {
  let pan: { x: number; y: number; id: number; moved: boolean } | null = null;
  let gestureZoom = 1;

  const swallowClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDown = (e: PointerEvent) => {
    if (e.button !== 0 || e.pointerType === "touch") return;
    if ((e.target as Element).closest(NO_PAN)) return;
    pan = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false };
  };

  const onMove = (e: PointerEvent) => {
    if (!pan || e.pointerId !== pan.id) return;
    const dx = e.clientX - pan.x;
    const dy = e.clientY - pan.y;
    if (!pan.moved) {
      if (Math.hypot(dx, dy) < 4) return;
      pan.moved = true;
      viewport.setPointerCapture(pan.id);
      viewport.classList.add("is-panning");
      onUser();
    }
    pan.x = e.clientX;
    pan.y = e.clientY;
    cam.panBy(dx, dy);
  };

  const onUp = () => {
    // A drag ends with a click on whatever is under the pointer; swallow it so nothing activates.
    if (pan?.moved) {
      window.addEventListener("click", swallowClick, { capture: true, once: true });
      window.setTimeout(() => window.removeEventListener("click", swallowClick, { capture: true }), 0);
    }
    pan = null;
    viewport.classList.remove("is-panning");
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    onUser();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? cam.vp.h : 1;
    if (e.ctrlKey || e.metaKey) {
      const r = viewport.getBoundingClientRect();
      cam.zoomAt(cam.view.z * Math.exp(-e.deltaY * unit * 0.0025), e.clientX - r.left, e.clientY - r.top);
    } else {
      cam.panBy(-e.deltaX * unit, -e.deltaY * unit);
    }
  };

  // Safari reports trackpad pinches as gesture events.
  type Gesture = Event & { scale: number; clientX: number; clientY: number };
  const onGestureStart = (e: Event) => {
    e.preventDefault();
    gestureZoom = cam.view.z;
    onUser();
  };
  const onGestureChange = (e: Event) => {
    e.preventDefault();
    const g = e as Gesture;
    const r = viewport.getBoundingClientRect();
    cam.zoomAt(gestureZoom * g.scale, g.clientX - r.left, g.clientY - r.top);
  };

  viewport.addEventListener("pointerdown", onDown);
  viewport.addEventListener("pointermove", onMove);
  viewport.addEventListener("pointerup", onUp);
  viewport.addEventListener("pointercancel", onUp);
  viewport.addEventListener("wheel", onWheel, { passive: false });
  viewport.addEventListener("gesturestart", onGestureStart);
  viewport.addEventListener("gesturechange", onGestureChange);

  return () => {
    viewport.removeEventListener("pointerdown", onDown);
    viewport.removeEventListener("pointermove", onMove);
    viewport.removeEventListener("pointerup", onUp);
    viewport.removeEventListener("pointercancel", onUp);
    viewport.removeEventListener("wheel", onWheel);
    viewport.removeEventListener("gesturestart", onGestureStart);
    viewport.removeEventListener("gesturechange", onGestureChange);
  };
}
```

- [ ] **Step 3: Create `src/canvas/ZoomControls.tsx`**

```tsx
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef } from "react";
import { useCanvasApi } from "./CanvasApi";

export function ZoomControls() {
  const api = useCanvasApi();
  const label = useRef<HTMLSpanElement>(null);

  useEffect(
    () =>
      api?.subscribe((v) => {
        if (label.current) label.current.textContent = `${Math.round(v.z * 100)}%`;
      }),
    [api],
  );

  if (!api) return null;
  return (
    <div className="zoom" role="group" aria-label="Zoom" data-nopan>
      <button type="button" onClick={() => api.zoomBy(0.8)} aria-label="Zoom out">
        <Minus size={15} aria-hidden="true" />
      </button>
      <span ref={label} className="zoom-value">
        100%
      </span>
      <button type="button" onClick={() => api.zoomBy(1.25)} aria-label="Zoom in">
        <Plus size={15} aria-hidden="true" />
      </button>
      <button type="button" className="zoom-fit" onClick={() => api.fitAll()}>
        Fit
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/canvas/Minimap.tsx`**

```tsx
import { useEffect, useRef, type MouseEvent } from "react";
import { FRAMES } from "@/frames/registry";
import { useCanvasApi } from "./CanvasApi";
import { toWorld } from "./camera";
import { bounds, type FrameRects } from "./layout";

const MAX_W = 168;
const MAX_H = 120;

/** A pointer shortcut; keyboard users have the frame shortcuts and Fit. */
export function Minimap({ rects }: { rects: FrameRects }) {
  const api = useCanvasApi();
  const viewRef = useRef<HTMLDivElement>(null);
  const b = bounds(Object.values(rects));
  const s = Math.min(MAX_W / b.w, MAX_H / b.h);

  useEffect(
    () =>
      api?.subscribe((v) => {
        const el = viewRef.current;
        if (!el) return;
        const vp = api.getViewport();
        const [x0, y0] = toWorld(v, 0, 0);
        el.style.transform = `translate(${(x0 - b.x) * s}px, ${(y0 - b.y) * s}px)`;
        el.style.width = `${(vp.w / v.z) * s}px`;
        el.style.height = `${(vp.h / v.z) * s}px`;
      }),
    [api, b.x, b.y, s],
  );

  if (!api) return null;
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    api.centerOn(b.x + (e.clientX - r.left) / s, b.y + (e.clientY - r.top) / s);
  };

  return (
    <div className="minimap" aria-hidden="true" data-nopan>
      <div className="minimap-inner" style={{ width: b.w * s, height: b.h * s }} onClick={onClick}>
        {FRAMES.map((f) => {
          const r = rects[f.id];
          return (
            <i
              key={f.id}
              className="minimap-frame"
              style={{ left: (r.x - b.x) * s, top: (r.y - b.y) * s, width: r.w * s, height: r.h * s }}
            />
          );
        })}
        <div ref={viewRef} className="minimap-view" />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/canvas/useCanvasShortcuts.ts`**

```ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FRAMES } from "@/frames/registry";
import { dialogOpen, isTypingTarget } from "@/lib/keys";
import type { CanvasApi } from "./CanvasApi";

/** 1–5 jump to frames, 0 fits all, + and − zoom, ? opens the shortcuts. D and Esc live in DevModeProvider. */
export function useCanvasShortcuts(api: CanvasApi | null, onHelp: () => void) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!api) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target) || dialogOpen()) return;
      const index = "12345".indexOf(e.key);
      if (index !== -1 && FRAMES[index]) {
        e.preventDefault();
        api.focusFrame(FRAMES[index].id);
        navigate(FRAMES[index].path);
      } else if (e.key === "0") {
        e.preventDefault();
        api.fitAll();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        api.zoomBy(1.25);
      } else if (e.key === "-") {
        e.preventDefault();
        api.zoomBy(0.8);
      } else if (e.key === "?") {
        e.preventDefault();
        onHelp();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [api, navigate, onHelp]);
}
```

- [ ] **Step 6: Create `src/shell/ShortcutsDialog.tsx`**

```tsx
import { forwardRef, useImperativeHandle, useRef } from "react";

export type ShortcutsHandle = { open: () => void };

const SHORTCUTS: Array<[string, string]> = [
  ["1–5", "Jump to a frame"],
  ["0", "Fit all frames"],
  ["+ / −", "Zoom in or out"],
  ["Ctrl/⌘ + scroll", "Zoom at the pointer"],
  ["Scroll or drag", "Move around the canvas"],
  ["D", "Turn Dev Mode on or off"],
  ["/", "Open cursor chat"],
  ["?", "Show these shortcuts"],
  ["Esc", "Close or exit"],
];

export const ShortcutsDialog = forwardRef<ShortcutsHandle>(function ShortcutsDialog(_props, ref) {
  const dialog = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => ({ open: () => dialog.current?.showModal() }), []);
  return (
    <dialog ref={dialog} className="shortcuts" aria-labelledby="shortcuts-title">
      <h2 id="shortcuts-title">Keyboard shortcuts</h2>
      <dl>
        {SHORTCUTS.map(([keys, action]) => (
          <div key={keys}>
            <dt>
              <kbd>{keys}</kbd>
            </dt>
            <dd>{action}</dd>
          </div>
        ))}
      </dl>
      <form method="dialog">
        <button className="btn btn--ghost">Close</button>
      </form>
    </dialog>
  );
});
```

- [ ] **Step 7: Create `src/canvas/CanvasRoot.tsx`**

```tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FRAME_COMPONENTS } from "@/frames";
import { FRAMES, frameById, type FrameId } from "@/frames/registry";
import { useLayout } from "@/layout/LayoutProvider";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import { useRegisterCanvasApi, type CanvasApi } from "./CanvasApi";
import { centerOn, fitRect, focusFrame } from "./camera";
import { CameraController } from "./controller";
import { attachCanvasInput } from "./input";
import { bounds, layoutFrames, type FrameRects, type FrameSizes } from "./layout";
import { Minimap } from "./Minimap";
import { rectIn } from "./rect";
import { useCanvasShortcuts } from "./useCanvasShortcuts";
import { ZoomControls } from "./ZoomControls";

type Props = { current: FrameId; onHelp: () => void };

export function CanvasRoot({ current, onHelp }: Props) {
  const viewportRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<CameraController | null>(null);
  const rectsRef = useRef<FrameRects | null>(null);
  /** The frame the camera is on. The route effect only flies when the route differs from it. */
  const focusedRef = useRef<FrameId>(current);
  /** True after the visitor pans or zooms; resizes then keep their view instead of refitting the frame. */
  const userMovedRef = useRef(false);
  const [rects, setRects] = useState<FrameRects | null>(null);
  const [api, setApi] = useState<CanvasApi | null>(null);
  const { reducedMotion } = useLayout();
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;
  const navigate = useNavigate();
  // react-router hands out a new navigate function on every route change; a ref keeps the API object stable.
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const registerApi = useRegisterCanvasApi();

  const frameEl = useCallback(
    (id: FrameId) => worldRef.current?.querySelector<HTMLElement>(`[data-frame="${id}"]`) ?? null,
    [],
  );

  const focusFrameId = useCallback((id: FrameId, duration = 1000) => {
    const cam = camRef.current;
    const r = rectsRef.current;
    if (!cam || !r) return;
    focusedRef.current = id;
    userMovedRef.current = false;
    cam.flyTo(focusFrame(r[id], cam.vp), duration);
  }, []);

  const showElement = useCallback((el: HTMLElement, duration = 700) => {
    const cam = camRef.current;
    const r = rectsRef.current;
    const world = worldRef.current;
    const id = el.closest<HTMLElement>("[data-frame]")?.dataset.frame as FrameId | undefined;
    if (!cam || !r || !world || !id) return;
    const base = focusFrame(r[id], cam.vp);
    const box = rectIn(el, world);
    // Keep the frame's fit, and move down until the element sits in the upper third.
    const y = Math.min(base.y, Math.round(cam.vp.h / 3 - box.y * base.z));
    focusedRef.current = id;
    userMovedRef.current = true;
    cam.flyTo({ ...base, y }, duration);
  }, []);

  // Measure, lay out and place the camera before the first paint, so the route's frame doesn't move.
  useIsoLayoutEffect(() => {
    const viewport = viewportRef.current;
    const world = worldRef.current;
    if (!viewport || !world) return;
    document.documentElement.dataset.layout = "canvas";
    const cam = new CameraController(viewport, world, () => reducedRef.current);
    camRef.current = cam;
    let alive = true;

    const measure = () => {
      cam.measure();
      const sizes = {} as FrameSizes;
      for (const f of FRAMES) {
        const el = frameEl(f.id)!;
        sizes[f.id] = { w: el.offsetWidth, h: el.offsetHeight };
      }
      const next = layoutFrames(sizes);
      for (const f of FRAMES) {
        const el = frameEl(f.id)!;
        el.style.left = `${next[f.id].x}px`;
        el.style.top = `${next[f.id].y}px`;
      }
      rectsRef.current = next;
      setRects(next);
      return next;
    };

    cam.set(focusFrame(measure()[focusedRef.current], cam.vp));

    let timer = 0;
    const refit = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!alive) return;
        const next = measure();
        if (!userMovedRef.current && !cam.isFlying()) cam.set(focusFrame(next[focusedRef.current], cam.vp));
      }, 80);
    };
    const observer = new ResizeObserver(refit);
    observer.observe(viewport);
    for (const f of FRAMES) observer.observe(frameEl(f.id)!);
    document.fonts?.ready.then(() => alive && refit());
    const detach = attachCanvasInput(viewport, cam, () => {
      userMovedRef.current = true;
    });

    return () => {
      alive = false;
      window.clearTimeout(timer);
      observer.disconnect();
      detach();
      cam.cancel();
      camRef.current = null;
    };
  }, [frameEl]);

  // Fly when the route changes: nav links, hero buttons, back and forward.
  useEffect(() => {
    if (focusedRef.current !== current) focusFrameId(current);
  }, [current, focusFrameId]);

  // Keyboard focus moves the camera. The viewport is overflow-hidden, so undo any scroll the browser does on focus.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest("[data-frame]")) return;
      const v = viewport.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      if (r.left < v.left || r.right > v.right || r.top < v.top || r.bottom > v.bottom) showElement(el, 500);
    };
    const onScroll = () => {
      viewport.scrollTop = 0;
      viewport.scrollLeft = 0;
    };
    viewport.addEventListener("focusin", onFocus);
    viewport.addEventListener("scroll", onScroll);
    return () => {
      viewport.removeEventListener("focusin", onFocus);
      viewport.removeEventListener("scroll", onScroll);
    };
  }, [showElement]);

  useEffect(() => {
    const next: CanvasApi = {
      focusFrame: (id) => focusFrameId(id),
      focusElement: (elementId) => {
        const el = document.getElementById(elementId);
        const id = el?.closest<HTMLElement>("[data-frame]")?.dataset.frame as FrameId | undefined;
        if (!el || !id) return;
        focusedRef.current = id; // stops the route effect from also flying to the frame's top
        navigateRef.current(frameById(id).path);
        showElement(el);
      },
      fitAll: () => {
        const cam = camRef.current;
        const r = rectsRef.current;
        if (!cam || !r) return;
        userMovedRef.current = true;
        cam.flyTo(fitRect(bounds(Object.values(r)), cam.vp, 60), 900);
      },
      zoomBy: (factor) => {
        const cam = camRef.current;
        if (!cam) return;
        userMovedRef.current = true;
        cam.zoomAt(cam.view.z * factor, cam.vp.w / 2, cam.vp.h / 2, true);
      },
      centerOn: (x, y) => {
        const cam = camRef.current;
        if (!cam) return;
        userMovedRef.current = true;
        cam.flyTo(centerOn(cam.view, cam.vp, x, y), 600);
      },
      subscribe: (fn) => camRef.current?.subscribe(fn) ?? (() => {}),
      getView: () => camRef.current?.view ?? { z: 1, x: 0, y: 0 },
      getViewport: () => camRef.current?.vp ?? { w: 1, h: 1 },
      getRects: () => rectsRef.current,
      getWorld: () => worldRef.current,
    };
    setApi(next);
    registerApi(next);
    return () => registerApi(null);
  }, [focusFrameId, showElement, registerApi]);

  useCanvasShortcuts(api, onHelp);

  return (
    <main id="main" className="canvas" ref={viewportRef} tabIndex={-1}>
      <div className="world" ref={worldRef}>
        {FRAMES.map((f) => {
          const FrameComponent = FRAME_COMPONENTS[f.id];
          return <FrameComponent key={f.id} primary={f.id === "home"} />;
        })}
      </div>
      {rects && <Minimap rects={rects} />}
      <ZoomControls />
    </main>
  );
}
```

- [ ] **Step 8: Replace `src/shell/Shell.tsx`**

```tsx
import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { CanvasRoot } from "@/canvas/CanvasRoot";
import { FRAME_COMPONENTS } from "@/frames";
import { NotFound } from "@/frames/NotFound";
import { frameForPath, type FrameId } from "@/frames/registry";
import { useLayout } from "@/layout/LayoutProvider";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import { useRouteMeta } from "@/seo/useRouteMeta";
import { FramesNav } from "./FramesNav";
import { ShortcutsDialog, type ShortcutsHandle } from "./ShortcutsDialog";
import { TopBar } from "./TopBar";

export function Shell() {
  const { pathname } = useLocation();
  const frame = frameForPath(pathname);
  const { mounted, canCanvas, pageView } = useLayout();
  const canvas = mounted && canCanvas && !pageView && frame !== undefined;
  const help = useRef<ShortcutsHandle>(null);
  const openHelp = useCallback(() => help.current?.open(), []);
  const firstRender = useRef(true);

  useRouteMeta(frame?.id ?? "notFound");

  // CanvasRoot sets "canvas" itself, before it measures. Leave the boot script's choice alone until mounted.
  useIsoLayoutEffect(() => {
    if (mounted && !canvas) document.documentElement.dataset.layout = "page";
  }, [mounted, canvas]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!canvas) window.scrollTo(0, 0);
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname, canvas]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <TopBar onHelp={canvas ? openHelp : undefined} />
      <FramesNav current={frame?.id} />
      {canvas && frame ? (
        <CanvasRoot current={frame.id} onHelp={openHelp} />
      ) : (
        <main id="main" className="page-main" tabIndex={-1}>
          {frame ? <PageFrame id={frame.id} /> : <NotFound />}
        </main>
      )}
      <ShortcutsDialog ref={help} />
    </>
  );
}

function PageFrame({ id }: { id: FrameId }) {
  const FrameComponent = FRAME_COMPONENTS[id];
  return <FrameComponent primary />;
}
```

- [ ] **Step 9: Create `src/styles/canvas.css`**

Task 14 appends the demo cursor and cursor chat styles to this file.

```css
/* Canvas layout */
.canvas {
  position: fixed;
  top: var(--bar-h);
  left: var(--panel-w);
  right: 0;
  bottom: 0;
  overflow: hidden;
  outline: none;
  background-color: var(--tool-bg);
  background-image: radial-gradient(var(--tool-dot) 1px, transparent 1.3px);
  background-size: 20px 20px;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  overscroll-behavior: none;
  touch-action: none;
}
.canvas.is-panning {
  cursor: grabbing;
}
.world {
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
}
.world > .frame {
  position: absolute;
}
.canvas a,
.canvas button {
  cursor: pointer;
}
.canvas input,
.canvas textarea {
  user-select: text;
  -webkit-user-select: text;
  cursor: text;
}

/* Zoom controls */
.zoom {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 6;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border-radius: 8px;
  background: var(--tool-ui);
  color: var(--tool-text);
  box-shadow: 0 0 0 1px var(--tool-line), 0 6px 16px -8px rgb(0 0 0 / 0.3);
  cursor: default;
}
.zoom button {
  display: grid;
  place-items: center;
  min-width: 30px;
  height: 28px;
  padding: 0 6px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--tool-text);
}
.zoom button:hover {
  background: color-mix(in srgb, var(--tool-text) 8%, transparent);
}
.zoom-fit {
  font-size: 12.5px;
  font-weight: 600;
}
.zoom-value {
  min-width: 46px;
  text-align: center;
  font-size: 12.5px;
  color: var(--tool-muted);
  font-variant-numeric: tabular-nums;
}

/* Minimap */
.minimap {
  position: absolute;
  left: 12px;
  bottom: 12px;
  z-index: 6;
  padding: 8px;
  border-radius: 8px;
  background: var(--tool-ui);
  box-shadow: 0 0 0 1px var(--tool-line), 0 6px 16px -8px rgb(0 0 0 / 0.3);
}
.minimap-inner {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.minimap-frame {
  position: absolute;
  border-radius: 1px;
  background: color-mix(in srgb, var(--tool-text) 16%, transparent);
}
.minimap-view {
  position: absolute;
  left: 0;
  top: 0;
  outline: 1.5px solid var(--select);
  background: color-mix(in srgb, var(--select) 12%, transparent);
  pointer-events: none;
}

/* Keyboard shortcuts dialog */
.shortcuts {
  width: min(420px, calc(100vw - 32px));
  padding: 24px;
  border: 0;
  border-radius: 12px;
  background: var(--tool-ui);
  color: var(--tool-text);
  box-shadow: 0 24px 48px -16px rgb(0 0 0 / 0.4), 0 0 0 1px var(--tool-line);
}
.shortcuts::backdrop {
  background: rgb(0 0 0 / 0.3);
}
.shortcuts h2 {
  margin: 0 0 16px;
  font-size: 18px;
}
.shortcuts dl {
  display: grid;
  gap: 8px;
  margin: 0 0 20px;
}
.shortcuts dl div {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 12px;
  align-items: baseline;
}
.shortcuts dd {
  margin: 0;
  color: var(--tool-muted);
}
.shortcuts kbd {
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--tool-ui-2);
  box-shadow: inset 0 0 0 1px var(--tool-line);
}
.shortcuts .btn--ghost {
  color: var(--tool-text);
}
```

- [ ] **Step 10: Add the import to `src/index.css`**

```css
@import "tailwindcss/base";
@import "./styles/tokens.css";
@import "./styles/base.css";
@import "./styles/frames.css";
@import "./styles/projects.css";
@import "./styles/experience.css";
@import "./styles/about.css";
@import "./styles/contact.css";
@import "./styles/shell.css";
@import "./styles/page.css";
@import "./styles/canvas.css";
@import "tailwindcss/utilities";
```

- [ ] **Step 11: Verify the build**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all pass.

- [ ] **Step 12: Check the canvas in the browser**

Run `pnpm build && pnpm preview` and open http://localhost:3000 in a 1440×900 desktop window. Then check:
- On load, Home sits top-aligned on the dot grid, and the frame does not jump when React takes over. Watch a hard reload a few times.
- Pressing `2` flies to Projects in about one second with a slight zoom-out dip, and the URL becomes `/projects`. Browser Back flies to Home.
- Scrolling pans the canvas, which is how you read down a long frame. Ctrl or ⌘ + scroll, and a trackpad pinch, zoom at the pointer.
- Dragging on empty canvas pans. Dragging that starts on a link does not pan, and a click after a drag does not follow a link.
- Fit (or `0`) shows all five frames. Clicking the minimap moves there. `+` and `−` zoom.
- From the Home "See projects" button, pressing Tab repeatedly into the Projects frame makes the camera follow the focused element.
- `?` (or the keyboard icon) opens the shortcuts dialog, and `Esc` closes it.
- Page view switches to page layout and back again (Canvas view).
- Resizing the window below 1024px switches to page layout.
- With reduced motion on (DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce), flights become instant jumps.
- The console shows no errors.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add the canvas layout with camera flights, zoom, minimap and shortcuts"
```

---
### Task 14: Demo cursors and cursor chat

The three scripted cursors act on whichever frame the route points at:
- Designer selects the frame title.
- PM pins that frame's comment.
- Artiom drags that frame's sticky.

The loop pauses for 6 seconds after any pointer-down, wheel or key press. It stops while Dev Mode is on and under reduced motion; in both cases the comment pin is shown without motion.

**Files:**
- Create: `src/canvas/timeline.ts`, `src/canvas/CursorIcon.tsx`, `src/canvas/DemoCursors.tsx`, `src/canvas/CursorChat.tsx`
- Modify: `src/canvas/CanvasRoot.tsx`, `src/styles/canvas.css`

- [ ] **Step 1: Create `src/canvas/timeline.ts`**

```ts
import { ease, type Point, type Rect } from "./camera";

/** [seconds, worldX, worldY] */
export type Key = [number, number, number];

export const LOOP = 14;
/** Where the Artiom cursor holds the sticky, relative to the sticky's corner. */
export const GRAB: Point = [26, 20];
/** How far the sticky moves when dragged. */
const STICKY_SHIFT: Point = [-28, 44];

export function along(keys: Key[], t: number): Point {
  if (t <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t <= b[0]) {
      const k = ease((t - a[0]) / (b[0] - a[0] || 1));
      return [a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
    }
  }
  const last = keys[keys.length - 1];
  return [last[1], last[2]];
}

const key = (t: number, p: Point, dx = 0, dy = 0): Key => [t, p[0] + dx, p[1] + dy];

export type Targets = { frame: Rect; title: Rect; comment: Rect | null; sticky: Rect | null };

export type Tracks = {
  designer: Key[];
  pm: Key[] | null;
  artiom: Key[] | null;
  select: { from: Point; to: Point };
  pin: Point | null;
  grab: { a: Point; b: Point } | null;
};

export function buildTracks({ frame: f, title, comment, sticky }: Targets): Tracks {
  const tl: Point = [title.x - 10, title.y - 10];
  const br: Point = [title.x + title.w + 10, title.y + title.h + 10];
  const designerRest: Point = [f.x + f.w * 0.64, f.y + Math.min(f.h - 60, 360)];
  const designer: Key[] = [
    key(0, designerRest),
    key(1, designerRest),
    key(2, tl),
    key(3.2, br),
    key(3.6, br, 14, 12),
    key(6.4, br, 14, 12),
    key(7.6, designerRest, 120, 0),
    key(LOOP, designerRest),
  ];

  let pm: Key[] | null = null;
  let pin: Point | null = null;
  if (comment) {
    pin = [comment.x + Math.min(comment.w * 0.62, comment.w - 24), comment.y + Math.min(comment.h * 0.3, 40)];
    const pmRest: Point = [f.x + f.w * 0.82, f.y + Math.min(f.h - 60, 520)];
    pm = [key(0, pmRest), key(3, pmRest), key(4.2, pin, 14, 12), key(9.8, pin, 14, 12), key(11, pmRest, 60, -40), key(LOOP, pmRest)];
  }

  let artiom: Key[] | null = null;
  let grab: Tracks["grab"] = null;
  if (sticky) {
    const a: Point = [sticky.x, sticky.y];
    const b: Point = [a[0] + STICKY_SHIFT[0], a[1] + STICKY_SHIFT[1]];
    const rest: Point = [f.x + f.w - 40, f.y + Math.min(f.h - 40, 300)];
    artiom = [
      key(0, rest),
      key(0.8, a, ...GRAB),
      key(1, a, ...GRAB),
      key(3.6, b, ...GRAB),
      key(4, b, ...GRAB),
      key(5.6, rest),
      key(8.2, rest),
      key(9.2, b, ...GRAB),
      key(9.4, b, ...GRAB),
      key(11.8, a, ...GRAB),
      key(LOOP, rest),
    ];
    grab = { a, b };
  }

  return { designer, pm, artiom, select: { from: tl, to: br }, pin, grab };
}
```

- [ ] **Step 2: Create `src/canvas/CursorIcon.tsx`**

```tsx
export function CursorIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
      <path d="M3 2.5v14.2l3.6-3.4 2.4 5 2.5-1.2-2.4-4.9h5z" />
    </svg>
  );
}
```

- [ ] **Step 3: Create `src/canvas/DemoCursors.tsx`**

```tsx
import { forwardRef, useEffect, useRef, type CSSProperties } from "react";
import { FRAME_NOTES } from "@/content/annotations";
import type { FrameId } from "@/frames/registry";
import { useLayout } from "@/layout/LayoutProvider";
import { useCanvasApi } from "./CanvasApi";
import { toScreen, type Point, type View } from "./camera";
import { DEMO_CURSORS, type DemoCursorId } from "./cursors";
import { CursorIcon } from "./CursorIcon";
import type { FrameRects } from "./layout";
import { rectIn } from "./rect";
import { along, buildTracks, GRAB, LOOP } from "./timeline";

const IDLE_RESUME_MS = 6000;

type Props = {
  current: FrameId;
  /** Re-plan the tracks when the layout changes. */
  rects: FrameRects;
  /** False while Dev Mode is on. */
  live: boolean;
};

export function DemoCursors({ current, rects, live }: Props) {
  const api = useCanvasApi();
  const { reducedMotion } = useLayout();
  const cursorRefs = useRef<Partial<Record<DemoCursorId, HTMLDivElement | null>>>({});
  const selectRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLSpanElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const comment = FRAME_NOTES[current].comment;
  const animate = live && !reducedMotion;

  useEffect(() => {
    const world = api?.getWorld();
    if (!api || !world) return;
    const frameEl = world.querySelector<HTMLElement>(`[data-frame="${current}"]`);
    const titleEl = document.getElementById(`${current}-title`);
    if (!frameEl || !titleEl) return;
    const commentEl = comment ? document.getElementById(comment.target) : null;
    const stickyEl = world.querySelector<HTMLElement>(`[data-sticky="${current}"]`);
    const titleBox = rectIn(titleEl, world);
    const tracks = buildTracks({
      frame: rectIn(frameEl, world),
      title: titleBox,
      comment: commentEl ? rectIn(commentEl, world) : null,
      sticky: stickyEl ? rectIn(stickyEl, world) : null,
    });

    let t = 0;
    let last = 0;
    let raf = 0;
    let lastInput = -Infinity;
    const onInput = () => {
      lastInput = performance.now();
    };

    const place = (el: HTMLElement | null | undefined, v: View, p: Point, dx = 0, dy = 0) => {
      if (!el) return;
      const [x, y] = toScreen(v, p[0], p[1]);
      el.style.transform = `translate(${x + dx}px, ${y + dy}px)`;
    };

    const draw = (v: View) => {
      const cursors = cursorRefs.current;
      const pin = pinRef.current;
      const pinOn = tracks.pin !== null && (!animate || (t >= 4.6 && t < 9.8));
      if (pin) {
        pin.hidden = !pinOn;
        if (pinOn && tracks.pin) place(pin, v, tracks.pin, -4, -40);
      }

      if (!animate) {
        for (const c of DEMO_CURSORS) {
          const el = cursors[c.id];
          if (el) el.hidden = true;
        }
        if (selectRef.current) selectRef.current.hidden = true;
        return;
      }

      const d = along(tracks.designer, t);
      if (cursors.designer) {
        cursors.designer.hidden = false;
        place(cursors.designer, v, d);
      }

      const sel = selectRef.current;
      if (sel) {
        if (t >= 2 && t < 6.8) {
          const end = t < 3.2 ? d : tracks.select.to;
          const [fx, fy] = tracks.select.from;
          const w = Math.abs(end[0] - fx);
          const h = Math.abs(end[1] - fy);
          place(sel, v, [Math.min(fx, end[0]), Math.min(fy, end[1])]);
          sel.style.width = `${w * v.z}px`;
          sel.style.height = `${h * v.z}px`;
          sel.hidden = false;
          if (sizeRef.current) {
            sizeRef.current.textContent =
              t < 3.2 ? `${Math.round(w)} × ${Math.round(h)}` : `${Math.round(titleBox.w)} × ${Math.round(titleBox.h)}`;
          }
        } else {
          sel.hidden = true;
        }
      }

      if (cursors.pm) {
        cursors.pm.hidden = !tracks.pm;
        if (tracks.pm) place(cursors.pm, v, along(tracks.pm, t));
      }

      if (cursors.artiom) {
        cursors.artiom.hidden = !tracks.artiom;
        if (tracks.artiom) place(cursors.artiom, v, along(tracks.artiom, t));
      }

      if (stickyEl && tracks.artiom && tracks.grab) {
        const holding = (t >= 1 && t < 3.6) || (t >= 9.4 && t < 11.8);
        const hand = along(tracks.artiom, t);
        const at: Point = holding ? [hand[0] - GRAB[0], hand[1] - GRAB[1]] : t >= 3.6 && t < 9.4 ? tracks.grab.b : tracks.grab.a;
        stickyEl.style.transform = `translate(${at[0] - tracks.grab.a[0]}px, ${at[1] - tracks.grab.a[1]}px) rotate(${holding ? 3 : -1.5}deg)`;
      }
    };

    const unsubscribe = api.subscribe(draw);
    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (now - lastInput > IDLE_RESUME_MS) {
        t = (t + dt) % LOOP;
        draw(api.getView());
      }
      raf = requestAnimationFrame(tick);
    };
    if (animate) {
      window.addEventListener("pointerdown", onInput);
      window.addEventListener("wheel", onInput, { passive: true });
      window.addEventListener("keydown", onInput);
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
      window.removeEventListener("pointerdown", onInput);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("keydown", onInput);
      if (stickyEl) stickyEl.style.transform = "";
    };
  }, [api, current, rects, comment, animate]);

  return (
    <div className="demo" aria-hidden="true">
      <div ref={selectRef} className="demo-select" hidden>
        <span ref={sizeRef} className="demo-select-size" />
      </div>
      {comment && <CommentPin ref={pinRef} text={comment.text} />}
      {DEMO_CURSORS.map((c) => (
        <div
          key={c.id}
          ref={(el) => {
            cursorRefs.current[c.id] = el;
          }}
          className="demo-cursor"
          style={{ "--c": c.color, "--ct": c.text } as CSSProperties}
          hidden
        >
          <CursorIcon />
          <span>{c.name}</span>
        </div>
      ))}
    </div>
  );
}

// #region layer:comment-pin
const CommentPin = forwardRef<HTMLDivElement, { text: string }>(function CommentPin({ text }, ref) {
  return (
    <div ref={ref} className="demo-pin" data-layer="comment-pin" hidden>
      <span className="demo-pin-dot">PM</span>
      <span className="demo-pin-bubble">{text}</span>
    </div>
  );
});
// #endregion
```

- [ ] **Step 4: Create `src/canvas/CursorChat.tsx`**

```tsx
import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { useNavigate } from "react-router-dom";
import { sendDraft } from "@/frames/contact/draft";
import { isTypingTarget } from "@/lib/keys";

/** Press / over the canvas to type a message; Enter takes it to the Contact form. */
export function CursorChat({ viewportRef }: { viewportRef: RefObject<HTMLElement> }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const openRef = useRef(open);
  openRef.current = open;
  const pointer = useRef({ x: 0, y: 0, inside: false });
  const tagRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = viewport.getBoundingClientRect();
      pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top, inside: true };
      const tag = tagRef.current;
      if (tag && !openRef.current) {
        tag.style.transform = `translate(${pointer.current.x + 14}px, ${pointer.current.y + 18}px)`;
        tag.hidden = false;
      }
    };
    const leave = () => {
      pointer.current.inside = false;
      if (tagRef.current) tagRef.current.hidden = true;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || !pointer.current.inside || openRef.current) return;
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
      e.preventDefault();
      setOpen(true);
    };
    viewport.addEventListener("pointermove", move);
    viewport.addEventListener("pointerleave", leave);
    window.addEventListener("keydown", onKey);
    return () => {
      viewport.removeEventListener("pointermove", move);
      viewport.removeEventListener("pointerleave", leave);
      window.removeEventListener("keydown", onKey);
    };
  }, [viewportRef]);

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  const close = () => {
    setOpen(false);
    setText("");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const message = text.trim();
    close();
    if (!message) return;
    navigate("/contact");
    window.setTimeout(() => sendDraft(message), 0);
  };

  return (
    <div className={open ? "chat-layer is-open" : "chat-layer"}>
      <div ref={tagRef} className="chat-tag" aria-hidden="true" hidden>
        Guest <kbd>/</kbd>
      </div>
      {open && (
        <form
          className="chat-bubble"
          style={{ transform: `translate(${pointer.current.x + 14}px, ${pointer.current.y + 18}px)` }}
          onSubmit={submit}
          data-nopan
        >
          <label htmlFor="cursor-chat" className="visually-hidden">
            Message for Artiom
          </label>
          <input
            id="cursor-chat"
            ref={inputRef}
            value={text}
            maxLength={280}
            autoComplete="off"
            placeholder="Say hi, then press Enter"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
            }}
            onBlur={close}
          />
        </form>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Render both in `src/canvas/CanvasRoot.tsx`**

Add these imports below the existing `./CanvasApi` import:

```tsx
import { useDevMode } from "@/devmode/DevModeProvider";
import { CursorChat } from "./CursorChat";
import { DemoCursors } from "./DemoCursors";
```

After `const registerApi = useRegisterCanvasApi();`, add:

```tsx
  const devMode = useDevMode();
```

Replace these two lines in the returned JSX:

```tsx
      {rects && <Minimap rects={rects} />}
      <ZoomControls />
```

with:

```tsx
      {rects && <DemoCursors current={current} rects={rects} live={!devMode.on} />}
      <CursorChat viewportRef={viewportRef} />
      {rects && <Minimap rects={rects} />}
      <ZoomControls />
```

- [ ] **Step 6: Append to `src/styles/canvas.css`**

```css
/* Demo cursors */
.demo {
  position: absolute;
  inset: 0;
  z-index: 5;
  overflow: hidden;
  pointer-events: none;
}
.demo [hidden] {
  display: none !important;
}
.demo-cursor {
  position: absolute;
  left: 0;
  top: 0;
  will-change: transform;
}
.demo-cursor svg {
  display: block;
  filter: drop-shadow(0 1px 1.5px rgb(0 0 0 / 0.3));
}
.demo-cursor path {
  fill: var(--c);
  stroke: #fff;
  stroke-width: 1.4;
}
.demo-cursor span {
  position: absolute;
  left: 15px;
  top: 18px;
  padding: 3px 8px;
  border-radius: 3px 10px 10px 10px;
  background: var(--c);
  color: var(--ct);
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
}
.demo-select {
  position: absolute;
  left: 0;
  top: 0;
  outline: 1.5px solid var(--select);
  background: color-mix(in srgb, var(--select) 7%, transparent);
}
.demo-select-size {
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translate(-50%, 7px);
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--select);
  color: var(--on-select);
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
/* #region layer:comment-pin */
.demo-pin {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.demo-pin-dot {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50% 50% 50% 0;
  background: var(--cursor-pm);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 0 0 2px #fff;
}
.demo-pin-bubble {
  max-width: 260px;
  padding: 10px 13px;
  border-radius: 10px;
  background: var(--tool-ui);
  color: var(--tool-text);
  box-shadow: 0 10px 26px -10px rgb(0 0 0 / 0.35), 0 0 0 1px var(--tool-line);
  font-size: 14px;
  line-height: 1.4;
  transform-origin: 0 100%;
  animation: pin-pop 0.35s cubic-bezier(0.2, 1.5, 0.4, 1);
}
/* #endregion */
@keyframes pin-pop {
  from { transform: scale(0.7); }
  to { transform: scale(1); }
}
[data-devmode] .demo-pin {
  pointer-events: auto;
}

/* Cursor chat */
.chat-layer {
  position: absolute;
  inset: 0;
  z-index: 7;
  pointer-events: none;
}
.chat-tag,
.chat-bubble {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 3px 12px 12px 12px;
  background: var(--tool-text);
  color: var(--tool-ui);
}
.chat-tag {
  padding: 3px 8px;
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
}
.chat-tag[hidden],
.chat-layer.is-open .chat-tag {
  display: none;
}
.chat-tag kbd {
  margin-left: 4px;
  padding: 0 4px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--tool-ui) 22%, transparent);
  font-size: 10.5px;
}
.chat-bubble {
  pointer-events: auto;
}
.chat-bubble:focus-within {
  box-shadow: 0 0 0 2px var(--select);
}
.chat-bubble input {
  width: 240px;
  padding: 8px 12px;
  border: 0;
  background: transparent;
  color: inherit;
  font: 500 14px var(--font-ui);
  outline: none;
}
.chat-bubble input::placeholder {
  color: color-mix(in srgb, var(--tool-ui) 70%, transparent);
}
```

- [ ] **Step 7: Verify**

Run: `pnpm typecheck && pnpm lint && pnpm build`, then `pnpm preview` and check on a 1440×900 desktop:
- On Home, within about 14 seconds:
  - Designer draws a selection around the headline with a "W × H" label.
  - PM's pin appears on the lede with "Since 2025: RAG, agents and MCP servers in production".
  - Artiom drags the yellow sticky down and back.
- Pressing `2` replays the same loop on Projects. The PM comment sits on the Klipsy card.
- Clicking anything freezes the cursors, and they resume about 6 seconds later.
- Pressing `/` with the pointer over the canvas opens the "Say hi" bubble. Typing "hello" and pressing Enter flies to Contact with "hello" in Message. `Esc` closes the bubble.
- With reduced motion on, no cursors move, and the current frame's comment pin is shown.
- In page layout (Page view), there are no cursors, stickies or chat.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add scripted demo cursors and cursor chat"
```

---
### Task 15: Dev Mode inspector

The inspector loads as a lazy chunk the first time Dev Mode is turned on.
- Hovering a registered layer outlines it. Clicking selects it.
- Inside frames, clicks inspect instead of following links. Chrome links still work, and they select their layer too.
- The panel shows real measurements, colour tokens and the component's own source: TSX and CSS, cut to the `#region` blocks.
- In canvas layout, once the visitor has been idle for 4 seconds, two demos run: the accent demo, and the Designer cursor auto-selecting layers.

**Files:**
- Create: `src/devmode/layers.ts`, `src/devmode/region.ts`, `src/devmode/sources.ts`, `src/devmode/measure.ts`, `src/devmode/CodeView.tsx`, `src/devmode/useActivityClock.ts`, `src/devmode/useAccentDemo.ts`, `src/devmode/useAutoSelect.ts`, `src/devmode/AccentPanel.tsx`, `src/devmode/Inspector.tsx`, `src/devmode/devmode.css`
- Modify: `src/devmode/DevModeProvider.tsx`

- [ ] **Step 1: Create `src/devmode/layers.ts`**

```ts
/** Every element with data-layer="<id>" in the markup. file and css are shown in the inspector header. */
export const LAYERS = {
  nav: { name: "Navigation / Frames", file: "src/shell/FramesNav.tsx" },
  "frame-label": { name: "Frame / Label", file: "src/frames/Frame.tsx" },
  "frame-title": { name: "Heading / Frame title", file: "src/frames/Frame.tsx" },
  "hero-title": { name: "Heading / Hero", file: "src/frames/Home.tsx" },
  "hero-lede": { name: "Text / Lede", file: "src/frames/Home.tsx" },
  "button-primary": { name: "Button / Primary", file: "src/frames/ui.tsx" },
  "project-card": { name: "Card / Project", file: "src/frames/Projects.tsx" },
  "stack-tag": { name: "Tag / Stack", file: "src/frames/ui.tsx" },
  "experience-entry": { name: "Entry / Role", file: "src/frames/Experience.tsx" },
  "history-item": { name: "Version history / Item", file: "src/shell/VersionHistory.tsx" },
  "contact-field": { name: "Input / Field", file: "src/frames/Contact.tsx" },
  sticky: { name: "Sticky note", file: "src/frames/Frame.tsx" },
  "comment-pin": { name: "Comment / Pin", file: "src/canvas/DemoCursors.tsx" },
} as const;

export type LayerId = keyof typeof LAYERS;

export const isLayerId = (value: string | undefined): value is LayerId => value !== undefined && value in LAYERS;
```

- [ ] **Step 2: Create `src/devmode/region.ts`**

```ts
/** The lines between "#region layer:<id>" and the next "#endregion", without the markers and dedented. */
export function region(source: string, id: string): string {
  const lines = source.split("\n");
  const start = lines.findIndex((line) => line.includes(`#region layer:${id}`));
  if (start === -1) return "";
  const end = lines.findIndex((line, i) => i > start && line.includes("#endregion"));
  const body = lines.slice(start + 1, end === -1 ? undefined : end);
  const indents = body.filter((line) => line.trim()).map((line) => line.length - line.trimStart().length);
  const indent = indents.length ? Math.min(...indents) : 0;
  return body.map((line) => line.slice(indent)).join("\n").trim();
}
```

- [ ] **Step 3: Create `src/devmode/sources.ts`**

```ts
import comments from "../canvas/DemoCursors.tsx?raw";
import contact from "../frames/Contact.tsx?raw";
import experience from "../frames/Experience.tsx?raw";
import frame from "../frames/Frame.tsx?raw";
import home from "../frames/Home.tsx?raw";
import projects from "../frames/Projects.tsx?raw";
import ui from "../frames/ui.tsx?raw";
import framesNav from "../shell/FramesNav.tsx?raw";
import versionHistory from "../shell/VersionHistory.tsx?raw";
import canvasCss from "../styles/canvas.css?raw";
import contactCss from "../styles/contact.css?raw";
import experienceCss from "../styles/experience.css?raw";
import framesCss from "../styles/frames.css?raw";
import projectsCss from "../styles/projects.css?raw";
import shellCss from "../styles/shell.css?raw";
import type { LayerId } from "./layers";
import { region } from "./region";

const TSX: Record<LayerId, string> = {
  nav: framesNav,
  "frame-label": frame,
  "frame-title": frame,
  "hero-title": home,
  "hero-lede": home,
  "button-primary": ui,
  "project-card": projects,
  "stack-tag": ui,
  "experience-entry": experience,
  "history-item": versionHistory,
  "contact-field": contact,
  sticky: frame,
  "comment-pin": comments,
};

const CSS: Record<LayerId, string> = {
  nav: shellCss,
  "frame-label": framesCss,
  "frame-title": framesCss,
  "hero-title": framesCss,
  "hero-lede": framesCss,
  "button-primary": framesCss,
  "project-card": projectsCss,
  "stack-tag": framesCss,
  "experience-entry": experienceCss,
  "history-item": shellCss,
  "contact-field": contactCss,
  sticky: framesCss,
  "comment-pin": canvasCss,
};

/** The real source behind a layer, imported at build time so it always matches what renders. */
export function sourceFor(id: LayerId): { tsx: string; css: string } {
  return { tsx: region(TSX[id], id), css: region(CSS[id], id) };
}
```

- [ ] **Step 4: Create `src/devmode/measure.ts`**

```ts
// Site tokens come first, so a value shared with a tool token resolves to the site token.
const TOKENS = [
  "--site-text", "--site-bg", "--site-muted", "--site-line", "--site-soft", "--accent", "--on-accent",
  "--tool-text", "--tool-ui", "--tool-bg", "--tool-muted", "--tool-line", "--select", "--sticky", "--sticky-text",
  "--field-line", "--danger",
];

export type ColorSpec = { property: "Text" | "Fill" | "Border"; token: string | null; value: string };

export type Specs = {
  width: number;
  height: number;
  font: string;
  type: string;
  weight: string;
  padding: string;
  colors: ColorSpec[];
};

function toHex(rgb: string): string | null {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m || m[4] === "0") return null;
  return `#${[m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

/** Live specs. offsetWidth/offsetHeight ignore the canvas zoom, so sizes are true CSS px. */
export function measure(el: HTMLElement): Specs {
  const cs = getComputedStyle(el);
  const root = getComputedStyle(document.documentElement);
  const tokenByHex = new Map<string, string>();
  for (const token of TOKENS) {
    const value = root.getPropertyValue(token).trim().toUpperCase();
    if (value && !tokenByHex.has(value)) tokenByHex.set(value, token);
  }
  const candidates: Array<[ColorSpec["property"], string]> = [
    ["Text", cs.color],
    ["Fill", cs.backgroundColor],
    ["Border", cs.borderTopWidth !== "0px" ? cs.borderTopColor : ""],
  ];
  const colors: ColorSpec[] = [];
  for (const [property, value] of candidates) {
    const hex = value ? toHex(value) : null;
    if (hex) colors.push({ property, token: tokenByHex.get(hex) ?? null, value: hex });
  }
  const lineHeight = cs.lineHeight === "normal" ? "normal" : String(Math.round(parseFloat(cs.lineHeight)));
  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
    font: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
    type: `${Math.round(parseFloat(cs.fontSize) * 10) / 10} / ${lineHeight}`,
    weight: cs.fontWeight,
    padding: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map((v) => Math.round(parseFloat(v))).join(" "),
    colors,
  };
}
```

- [ ] **Step 5: Create `src/devmode/CodeView.tsx`**

```tsx
import { useMemo } from "react";
import { highlight } from "sugar-high";

export function CodeView({ code, lang }: { code: string; lang: "typescript" | "css" }) {
  const html = useMemo(() => highlight(code, { lang }), [code, lang]);
  return (
    <pre className="code" tabIndex={0} aria-label={lang === "css" ? "CSS source" : "TSX source"}>
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
```

- [ ] **Step 6: Create `src/devmode/useActivityClock.ts`**

```ts
import { useEffect, useRef } from "react";

/** The time of the visitor's last pointer move, press, key or wheel. The demos wait for a few idle seconds. */
export function useActivityClock() {
  const last = useRef(performance.now());
  useEffect(() => {
    const mark = () => {
      last.current = performance.now();
    };
    const events = ["pointermove", "pointerdown", "keydown", "wheel"] as const;
    events.forEach((name) => window.addEventListener(name, mark, { passive: true }));
    return () => events.forEach((name) => window.removeEventListener(name, mark));
  }, []);
  return last;
}
```

- [ ] **Step 7: Create `src/devmode/useAccentDemo.ts`**

```ts
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { useLayout } from "@/layout/LayoutProvider";
import { useDevMode } from "./DevModeProvider";
import { applyAccent, SWATCHES, type SwatchId } from "./swatches";

const IDLE_MS = 4000;
const TYPE_MS = 85;
const HOLD_MS = 2400;
const ORDER: SwatchId[] = ["pink", "blue", "orange", "violet"];

/** "Artiom" retypes --accent through the swatches while the visitor is idle. Any activity restores their choice. */
export function useAccentDemo(enabled: boolean, lastActivity: MutableRefObject<number>) {
  const { accent } = useDevMode();
  const { theme } = useLayout();
  const [typed, setTyped] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const accentRef = useRef(accent);
  accentRef.current = accent;

  useEffect(() => {
    if (!enabled) return;
    let stopped = false;
    let timer = 0;
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });
    const idle = () => performance.now() - lastActivity.current >= IDLE_MS;
    const hex = (id: SwatchId) => {
      const s = SWATCHES.find((w) => w.id === id)!;
      return theme === "dark" ? s.dark : s.light;
    };

    const run = async () => {
      let shown: SwatchId = accentRef.current;
      let step = 0;
      while (!stopped) {
        if (!idle()) {
          if (shown !== accentRef.current) applyAccent(accentRef.current);
          shown = accentRef.current;
          setTyped(null);
          setActive(false);
          await sleep(400);
          continue;
        }
        setActive(true);
        let next = ORDER[step % ORDER.length];
        if (next === shown) next = ORDER[++step % ORDER.length];
        const from = hex(shown);
        const to = hex(next);
        for (let n = from.length - 1; n >= 1 && !stopped && idle(); n--) {
          setTyped(from.slice(0, n));
          await sleep(TYPE_MS);
        }
        for (let n = 2; n <= to.length && !stopped && idle(); n++) {
          setTyped(to.slice(0, n));
          await sleep(TYPE_MS);
        }
        if (stopped || !idle()) continue;
        applyAccent(next);
        shown = next;
        step++;
        await sleep(HOLD_MS);
      }
    };
    run();

    return () => {
      stopped = true;
      window.clearTimeout(timer);
      applyAccent(accentRef.current);
      setTyped(null);
      setActive(false);
    };
  }, [enabled, theme, lastActivity]);

  return { typed, active };
}
```

- [ ] **Step 8: Create `src/devmode/useAutoSelect.ts`**

```ts
import { useEffect, type MutableRefObject, type RefObject } from "react";

const IDLE_MS = 4000;
const EVERY_MS = 3600;
const PANEL_W = 340;

/** While the visitor is idle, the Designer cursor walks to a visible layer and selects it. */
export function useAutoSelect(
  enabled: boolean,
  lastActivity: MutableRefObject<number>,
  select: (el: HTMLElement) => void,
  cursorRef: RefObject<HTMLDivElement>,
) {
  useEffect(() => {
    if (!enabled) return;
    let index = 0;
    let pending = 0;
    const timer = window.setInterval(() => {
      const cursor = cursorRef.current;
      if (performance.now() - lastActivity.current < IDLE_MS) {
        if (cursor) cursor.hidden = true;
        return;
      }
      const view = document.querySelector(".canvas")?.getBoundingClientRect();
      if (!view) return;
      const visible = [...document.querySelectorAll<HTMLElement>("[data-frame] [data-layer]")].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.left >= view.left && r.right <= view.right - PANEL_W && r.top >= view.top && r.bottom <= view.bottom;
      });
      if (!visible.length) return;
      const el = visible[index++ % visible.length];
      const r = el.getBoundingClientRect();
      if (cursor) {
        cursor.hidden = false;
        cursor.style.transform = `translate(${r.left + Math.min(r.width * 0.6, r.width - 12)}px, ${r.top + Math.min(r.height * 0.5, 40)}px)`;
      }
      window.clearTimeout(pending);
      pending = window.setTimeout(() => select(el), 700);
    }, EVERY_MS);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(pending);
    };
  }, [enabled, lastActivity, select, cursorRef]);
}
```

- [ ] **Step 9: Create `src/devmode/AccentPanel.tsx`**

```tsx
import type { CSSProperties } from "react";
import { CursorIcon } from "@/canvas/CursorIcon";
import { useLayout } from "@/layout/LayoutProvider";
import { useDevMode } from "./DevModeProvider";
import { SWATCHES } from "./swatches";

export function AccentPanel({ typed, editing }: { typed: string | null; editing: boolean }) {
  const { accent, setAccent } = useDevMode();
  const { theme } = useLayout();
  const chosen = SWATCHES.find((s) => s.id === accent)!;
  const value = typed ?? (theme === "dark" ? chosen.dark : chosen.light);
  return (
    <section className="accent" aria-label="Accent token">
      <p className="accent-head">
        Token
        {editing && (
          <span className="accent-who">
            <CursorIcon /> Artiom
          </span>
        )}
      </p>
      <p className="accent-line">
        <code className="accent-name">--accent</code>:<code className="accent-value">{value}</code>
        {editing && <span className="accent-caret" aria-hidden="true" />};
      </p>
      <div className="accent-swatches" role="group" aria-label="Try an accent colour">
        {SWATCHES.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-label={s.name}
            aria-pressed={!editing && accent === s.id}
            style={{ "--swatch": theme === "dark" ? s.dark : s.light } as CSSProperties}
            onClick={() => setAccent(s.id)}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 10: Create `src/devmode/Inspector.tsx`**

```tsx
import { X } from "lucide-react";
import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { useCanvasApi } from "@/canvas/CanvasApi";
import { CursorIcon } from "@/canvas/CursorIcon";
import { useLayout } from "@/layout/LayoutProvider";
import { cx } from "@/lib/cx";
import { AccentPanel } from "./AccentPanel";
import { CodeView } from "./CodeView";
import { useDevMode } from "./DevModeProvider";
import { isLayerId, LAYERS } from "./layers";
import { measure } from "./measure";
import { sourceFor } from "./sources";
import { useAccentDemo } from "./useAccentDemo";
import { useActivityClock } from "./useActivityClock";
import { useAutoSelect } from "./useAutoSelect";
import "./devmode.css";

const layerOf = (target: EventTarget | null) =>
  target instanceof Element ? target.closest<HTMLElement>("[data-layer]") : null;

function placeBox(box: HTMLDivElement | null, el: HTMLElement | null) {
  if (!box) return;
  if (!el || !el.isConnected) {
    box.hidden = true;
    return;
  }
  const r = el.getBoundingClientRect();
  box.hidden = false;
  box.style.transform = `translate(${r.left}px, ${r.top}px)`;
  box.style.width = `${r.width}px`;
  box.style.height = `${r.height}px`;
}

export default function Inspector() {
  const { exit } = useDevMode();
  const { reducedMotion } = useLayout();
  const isCanvas = useCanvasApi() !== null;
  const [hovered, setHovered] = useState<HTMLElement | null>(null);
  const [selected, setSelected] = useState<HTMLElement | null>(null);
  const [tab, setTab] = useState<"tsx" | "css">("tsx");
  const hoverBox = useRef<HTMLDivElement>(null);
  const selectBox = useRef<HTMLDivElement>(null);
  const designerRef = useRef<HTMLDivElement>(null);
  const lastActivity = useActivityClock();
  const demos = isCanvas && !reducedMotion;
  const accentDemo = useAccentDemo(demos, lastActivity);
  useAutoSelect(demos, lastActivity, setSelected, designerRef);

  useEffect(() => {
    const over = (e: PointerEvent) => {
      const el = layerOf(e.target);
      setHovered(el && isLayerId(el.dataset.layer) && !el.closest(".inspector") ? el : null);
    };
    const click = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(".inspector")) return;
      const el = layerOf(target);
      if (!el || !isLayerId(el.dataset.layer)) return;
      // Inside frames a click inspects instead of following the link; the chrome keeps working.
      if (el.closest("[data-frame]")) {
        e.preventDefault();
        e.stopPropagation();
      }
      setSelected(el);
    };
    document.addEventListener("pointerover", over);
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("click", click, true);
    };
  }, []);

  // Outlines follow their elements every frame, including during camera flights.
  useEffect(() => {
    let raf = 0;
    const draw = () => {
      placeBox(hoverBox.current, hovered !== selected ? hovered : null);
      placeBox(selectBox.current, selected);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [hovered, selected]);

  const layer = selected && isLayerId(selected.dataset.layer) ? selected.dataset.layer : null;
  const info = layer ? LAYERS[layer] : null;
  const specs = selected?.isConnected ? measure(selected) : null;
  const code = layer ? sourceFor(layer) : null;
  const hoveredName = hovered && isLayerId(hovered.dataset.layer) ? LAYERS[hovered.dataset.layer].name : "";

  return (
    <>
      <div ref={hoverBox} className="dm-box dm-box--hover" hidden>
        <span className="dm-tag">{hoveredName}</span>
      </div>
      <div ref={selectBox} className="dm-box dm-box--select" hidden>
        <span className="dm-tag">{info?.name}</span>
        {specs && (
          <span className="dm-size">
            {specs.width} × {specs.height}
          </span>
        )}
      </div>
      {demos && (
        <div
          ref={designerRef}
          className="dm-cursor demo-cursor"
          style={{ "--c": "var(--cursor-designer)", "--ct": "#FFFFFF" } as CSSProperties}
          aria-hidden="true"
          hidden
        >
          <CursorIcon />
          <span>Designer</span>
        </div>
      )}
      <aside className={cx("inspector", !info && "inspector--empty")} aria-label="Dev Mode inspector" data-nopan>
        <header className="inspector-head">
          <p className="inspector-title">{info ? info.name : "Dev Mode"}</p>
          <p className="inspector-file">{info ? info.file : "Select any element to see its code and measurements."}</p>
          <button type="button" className="inspector-close" onClick={exit} aria-label="Exit Dev Mode">
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        {specs && (
          <dl className="inspector-specs">
            <dt>Size</dt>
            <dd>
              {specs.width} × {specs.height}
            </dd>
            <dt>Font</dt>
            <dd>{specs.font}</dd>
            <dt>Type</dt>
            <dd>{specs.type}</dd>
            <dt>Weight</dt>
            <dd>{specs.weight}</dd>
            <dt>Padding</dt>
            <dd>{specs.padding}</dd>
            {specs.colors.map((c) => (
              <Fragment key={c.property}>
                <dt>{c.property}</dt>
                <dd>
                  <span className="swatch-dot" style={{ background: c.value }} />
                  {c.token ? `${c.token} ${c.value}` : c.value}
                </dd>
              </Fragment>
            ))}
          </dl>
        )}
        <AccentPanel typed={accentDemo.typed} editing={accentDemo.active} />
        {code && (code.tsx || code.css) && (
          <div className="inspector-code">
            <div className="inspector-tabs" role="group" aria-label="Source">
              <button type="button" aria-pressed={tab === "tsx"} onClick={() => setTab("tsx")}>
                TSX
              </button>
              <button type="button" aria-pressed={tab === "css"} onClick={() => setTab("css")}>
                CSS
              </button>
            </div>
            <CodeView code={tab === "tsx" ? code.tsx : code.css} lang={tab === "tsx" ? "typescript" : "css"} />
          </div>
        )}
      </aside>
    </>
  );
}
```

- [ ] **Step 11: Create `src/devmode/devmode.css`**

```css
[data-devmode] [data-frame] [data-layer],
[data-devmode] [data-frame] a,
[data-devmode] [data-frame] button {
  cursor: default;
}

/* Outlines */
.dm-box {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 40;
  box-sizing: border-box;
  pointer-events: none;
  outline: 1.5px solid var(--select);
}
.dm-box[hidden] {
  display: none;
}
.dm-box--hover {
  outline-width: 1px;
  opacity: 0.8;
}
.dm-box--select {
  background: color-mix(in srgb, var(--select) 7%, transparent);
}
.dm-tag {
  position: absolute;
  left: -1px;
  bottom: 100%;
  margin-bottom: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--select);
  color: var(--on-select);
  font: 600 11px/1.4 var(--font-ui);
  white-space: nowrap;
}
.dm-size {
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translate(-50%, 6px);
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--select);
  color: var(--on-select);
  font: 600 11px/1.4 var(--font-mono);
  white-space: nowrap;
}
.dm-cursor {
  position: fixed;
  z-index: 45;
  pointer-events: none;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.dm-cursor[hidden] {
  display: none;
}

/* Panel: right side on the canvas, bottom sheet in page layout */
.inspector {
  position: fixed;
  z-index: 35;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  background: var(--tool-ui);
  color: var(--tool-text);
  font-size: 12.5px;
  overflow-y: auto;
}
[data-layout="canvas"] .inspector {
  top: var(--bar-h);
  right: 0;
  bottom: 0;
  width: 340px;
  border-left: 1px solid var(--tool-line);
}
[data-layout="page"] .inspector {
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 62vh;
  border-top: 1px solid var(--tool-line);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -12px 32px -16px rgb(0 0 0 / 0.35);
}
.inspector-head {
  position: relative;
  display: grid;
  gap: 2px;
  padding-right: 32px;
}
.inspector-title {
  margin: 0;
  font-size: 14.5px;
  font-weight: 700;
}
.inspector-file {
  margin: 0;
  font: 12px/1.5 var(--font-mono);
  color: var(--tool-muted);
}
.inspector--empty .inspector-file {
  font-family: var(--font-ui);
}
.inspector-close {
  position: absolute;
  right: -4px;
  top: -4px;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--tool-text);
  cursor: pointer;
}
.inspector-close:hover {
  background: color-mix(in srgb, var(--tool-text) 8%, transparent);
}
.inspector-specs {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 6px 14px;
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--tool-ui-2);
}
.inspector-specs dt {
  color: var(--tool-muted);
}
.inspector-specs dd {
  margin: 0;
  overflow: hidden;
  font: 12px/1.5 var(--font-mono);
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.swatch-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 6px;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.15);
  vertical-align: -1px;
}

/* Accent token */
.accent {
  display: grid;
  gap: 9px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--tool-ui-2);
}
.accent-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  font-weight: 600;
  color: var(--tool-muted);
}
.accent-who {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--cursor-artiom);
  color: #1e1e1e;
  font: 600 10.5px var(--font-ui);
}
.accent-who svg {
  width: 12px;
  height: 12px;
}
.accent-who path {
  fill: #1e1e1e;
}
.accent-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  font: 12.5px var(--font-mono);
}
.accent-name {
  color: var(--tk-property);
}
.accent-value {
  color: var(--tk-value);
}
.accent-caret {
  display: inline-block;
  width: 2px;
  height: 15px;
  margin-left: -4px;
  background: var(--cursor-artiom);
  animation: caret-blink 1s steps(1) infinite;
}
@keyframes caret-blink {
  50% { opacity: 0; }
}
.accent-swatches {
  display: flex;
  gap: 9px;
}
.accent-swatches button {
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  background: var(--swatch);
  box-shadow: 0 0 0 2px var(--tool-ui-2), 0 0 0 3.5px transparent;
  cursor: pointer;
}
.accent-swatches button[aria-pressed="true"] {
  box-shadow: 0 0 0 2px var(--tool-ui-2), 0 0 0 3.5px var(--tool-text);
}

/* Source code */
.inspector-code {
  display: grid;
  gap: 8px;
}
.inspector-tabs {
  display: flex;
  gap: 4px;
}
.inspector-tabs button {
  padding: 5px 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--tool-muted);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.inspector-tabs button[aria-pressed="true"] {
  background: var(--tool-ui-2);
  color: var(--tool-text);
}
.code {
  --sh-keyword: var(--tk-keyword);
  --sh-string: var(--tk-string);
  --sh-property: var(--tk-property);
  --sh-entity: var(--tk-property);
  --sh-class: var(--tk-value);
  --sh-jsxliterals: var(--tool-text);
  --sh-identifier: var(--tool-text);
  --sh-sign: var(--tool-muted);
  --sh-comment: var(--tk-comment);
  margin: 0;
  max-height: 340px;
  padding: 12px;
  border-radius: 8px;
  background: var(--tool-ui-2);
  color: var(--tool-text);
  font: 11.5px/1.6 var(--font-mono);
  overflow: auto;
  white-space: pre;
  tab-size: 2;
}
```

- [ ] **Step 12: Render the inspector from `src/devmode/DevModeProvider.tsx`**

Change the first import line to:

```tsx
import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
```

Below the imports, add:

```tsx
const Inspector = lazy(() => import("./Inspector"));
```

Replace the provider's return line:

```tsx
  return <DevModeContext.Provider value={value}>{children}</DevModeContext.Provider>;
```

with:

```tsx
  return (
    <DevModeContext.Provider value={value}>
      {children}
      {on && (
        <Suspense fallback={null}>
          <Inspector />
        </Suspense>
      )}
    </DevModeContext.Provider>
  );
```

- [ ] **Step 13: Verify**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all pass. `ls dist/assets | grep -i inspector` shows a separate chunk.

Then run `pnpm preview` on a 1440×900 desktop and check:
- `D` opens the inspector on the right, with "Select any element to see its code and measurements." The demo cursors disappear.
- Clicking the Home headline gives "Heading / Hero", the file `src/frames/Home.tsx`, a size matching the selection label, font "Instrument Serif", Type "76 / 74", and Text `--site-text #141414`. TSX shows the `HeroTitle` function, and CSS shows the `.hero-title` rules.
- Clicking "See projects" selects "Button / Primary" without navigating.
- Clicking "Projects" in the Frames panel flies there and selects "Navigation / Frames".
- Clicking the pink swatch recolours the accent: the headline italic, the buttons and the mark. In dark theme the swatch uses the lighter pink.
- Left idle for 4 seconds, the "Artiom" chip appears, `--accent` retypes, and the site recolours. The Designer cursor glides to layers and selects them. Moving the mouse stops both and restores the chosen swatch.
- `Esc` or the close button exits, and the demo cursors resume.
- In page layout at 390px, `D`, then tapping the headline, opens a bottom sheet with the same details.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: add the Dev Mode inspector with live specs, real source and accent demo"
```

---
### Task 16: Favicons and manifest

The mark is a canvas cursor on violet, replacing the green "AL" square. The app icons add the amber "AL" name tag used by the Artiom cursor. The letters are paths, so rendering doesn't depend on installed fonts.

**Files:**
- Create: `scripts/brand/mark-flat.svg`, `scripts/brand/app-icon.svg`, `scripts/brand/app-icon-rounded.svg`, `scripts/brand/app-icon-maskable.svg`, `scripts/brand/render.sh`, `public/favicon.svg`, `public/site.webmanifest`
- Generate: `public/favicon.ico`, `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png`
- Delete: `public/logo.svg`

- [ ] **Step 1: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    .bg { fill: #6A4DF5; }
    .cursor { fill: #FFFFFF; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #A08CFF; }
      .cursor { fill: #141414; }
    }
  </style>
  <rect class="bg" width="32" height="32" rx="8"/>
  <path class="cursor" d="M10 7v17.5l4.4-4.1 3 6.2 3.1-1.5-3-6.1h6.2z"/>
</svg>
```

- [ ] **Step 2: Create `scripts/brand/mark-flat.svg`** (raster source for `favicon.ico`)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#6A4DF5"/>
  <path d="M10 7v17.5l4.4-4.1 3 6.2 3.1-1.5-3-6.1h6.2z" fill="#FFFFFF"/>
</svg>
```

- [ ] **Step 3: Create `scripts/brand/app-icon.svg`** (full bleed; iOS rounds the corners)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#6A4DF5"/>
  <path d="M38 30v80l20-18.7 13.7 28.3 14.2-6.9-13.7-28h28.3z" fill="#FFFFFF"/>
  <g transform="translate(90 110)">
    <path d="M4 0h56a10 10 0 0 1 10 10v20a10 10 0 0 1-10 10H10A10 10 0 0 1 0 30V4a4 4 0 0 1 4-4z" fill="#FFAA00"/>
    <path transform="translate(19.6 10.4) scale(1.6)" fill="#1E1E1E" fill-rule="evenodd" d="M0 12 3.8 0h2.4L10 12H7.6l-.7-2.3H3.1L2.4 12zM3.7 7.7h2.6L5 3.4zM11.5 0h2.4v9.9h5.3V12h-7.7z"/>
  </g>
</svg>
```

- [ ] **Step 4: Create `scripts/brand/app-icon-rounded.svg`** (manifest "any" icons)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="40" fill="#6A4DF5"/>
  <path d="M38 30v80l20-18.7 13.7 28.3 14.2-6.9-13.7-28h28.3z" fill="#FFFFFF"/>
  <g transform="translate(90 110)">
    <path d="M4 0h56a10 10 0 0 1 10 10v20a10 10 0 0 1-10 10H10A10 10 0 0 1 0 30V4a4 4 0 0 1 4-4z" fill="#FFAA00"/>
    <path transform="translate(19.6 10.4) scale(1.6)" fill="#1E1E1E" fill-rule="evenodd" d="M0 12 3.8 0h2.4L10 12H7.6l-.7-2.3H3.1L2.4 12zM3.7 7.7h2.6L5 3.4zM11.5 0h2.4v9.9h5.3V12h-7.7z"/>
  </g>
</svg>
```

- [ ] **Step 5: Create `scripts/brand/app-icon-maskable.svg`** (content inside the 80% safe zone)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#6A4DF5"/>
  <g transform="translate(18 18) scale(0.8)">
    <path d="M38 30v80l20-18.7 13.7 28.3 14.2-6.9-13.7-28h28.3z" fill="#FFFFFF"/>
    <g transform="translate(90 110)">
      <path d="M4 0h56a10 10 0 0 1 10 10v20a10 10 0 0 1-10 10H10A10 10 0 0 1 0 30V4a4 4 0 0 1 4-4z" fill="#FFAA00"/>
      <path transform="translate(19.6 10.4) scale(1.6)" fill="#1E1E1E" fill-rule="evenodd" d="M0 12 3.8 0h2.4L10 12H7.6l-.7-2.3H3.1L2.4 12zM3.7 7.7h2.6L5 3.4zM11.5 0h2.4v9.9h5.3V12h-7.7z"/>
    </g>
  </g>
</svg>
```

- [ ] **Step 6: Create `scripts/brand/render.sh`**

```sh
#!/usr/bin/env sh
# Renders the raster icons in public/ from the SVG sources next to this script. Needs ImageMagick 7.
set -eu
cd "$(dirname "$0")"
OUT=../../public
TMP=$(mktemp -d)

for size in 16 32 48; do
  magick -background none -density 1200 mark-flat.svg -resize "${size}x${size}" "$TMP/fav-$size.png"
done
magick "$TMP/fav-16.png" "$TMP/fav-32.png" "$TMP/fav-48.png" "$OUT/favicon.ico"

magick -background "#6A4DF5" -density 600 app-icon.svg -resize 180x180 -flatten "$OUT/apple-touch-icon.png"
magick -background none -density 600 app-icon-rounded.svg -resize 192x192 "$OUT/icon-192.png"
magick -background none -density 600 app-icon-rounded.svg -resize 512x512 "$OUT/icon-512.png"
magick -background "#6A4DF5" -density 600 app-icon-maskable.svg -resize 512x512 -flatten "$OUT/icon-maskable-512.png"

rm -rf "$TMP"
echo "icons written to public/"
```

- [ ] **Step 7: Create `public/site.webmanifest`**

```json
{
  "name": "Artiom Leontiev",
  "short_name": "Artiom",
  "description": "Senior Frontend Engineer · AI-powered applications",
  "start_url": "/",
  "display": "browser",
  "background_color": "#F5F5F5",
  "theme_color": "#6A4DF5",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

- [ ] **Step 8: Render, check and clean up**

```bash
chmod +x scripts/brand/render.sh
scripts/brand/render.sh
magick identify public/favicon.ico public/apple-touch-icon.png public/icon-192.png public/icon-512.png public/icon-maskable-512.png
git rm -q public/logo.svg
```

Expected: `favicon.ico` lists 16x16, 32x32 and 48x48 frames; the PNGs are 180x180, 192x192, 512x512 and 512x512.

Open each PNG with an image viewer. The white cursor and the amber "AL" tag must be crisp, and the maskable icon's content must sit well inside the edges. In the browser tab, the favicon is a violet square with a white cursor, and a lighter violet in a dark-themed browser.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add cursor favicon set and web manifest"
```

---

### Task 17: Portrait and project screenshots

Only side projects get screenshots, captured from their public sites. Client work never does.

**Files:**
- Generate: `public/images/portrait.avif`, `public/images/portrait.webp`, `public/images/projects/{klipsy,council,askmanu}.{avif,webp}`
- Delete: `public/images/portrait.jpg`

- [ ] **Step 1: Re-encode the portrait** (640×683, matching `profile.portrait`)

```bash
magick public/images/portrait.jpg -resize 640x -strip -quality 55 public/images/portrait.avif
magick public/images/portrait.jpg -resize 640x -strip -quality 80 public/images/portrait.webp
magick identify public/images/portrait.webp
git rm -q public/images/portrait.jpg
```

Expected: `portrait.webp WEBP 640x683`.

- [ ] **Step 2: Capture the side-project home pages**

Set `CHROME` to the Google Chrome executable first.

```bash
: "${CHROME:?Set CHROME to the Google Chrome executable}"
SHOTS=$(mktemp -d)
"$CHROME" --headless=new --hide-scrollbars --window-size=1440,900 --virtual-time-budget=8000 --screenshot="$SHOTS/klipsy.png" https://theklipsy.com
"$CHROME" --headless=new --hide-scrollbars --window-size=1440,900 --virtual-time-budget=8000 --screenshot="$SHOTS/council.png" https://council.artiomleo.com
"$CHROME" --headless=new --hide-scrollbars --window-size=1440,900 --virtual-time-budget=8000 --screenshot="$SHOTS/askmanu.png" https://askmanu.co
echo "$SHOTS"
```

Open the three PNGs. If one shows a cookie banner, a loading state or a blank page, capture it again with `--virtual-time-budget=15000`.

- [ ] **Step 3: Encode them at 1200×750**

```bash
mkdir -p public/images/projects
for name in klipsy council askmanu; do
  magick "$SHOTS/$name.png" -resize 1200x750^ -gravity north -extent 1200x750 -strip -quality 55 "public/images/projects/$name.avif"
  magick "$SHOTS/$name.png" -resize 1200x750^ -gravity north -extent 1200x750 -strip -quality 80 "public/images/projects/$name.webp"
done
ls -la public/images/projects
```

Expected: six files, each 1200×750. Most are under 150 KB.

- [ ] **Step 4: Check in the browser**

Run `pnpm dev`. On `/projects`, the three side-project cards show their screenshots without layout shift (each `<img>` has width and height), and the About frame shows the portrait.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add portrait and side-project screenshots"
```

---
### Task 18: Social preview images

**Files:**
- Create: `scripts/og/og.html`
- Generate: `public/og/{home,projects,experience,about,contact}.png`

`og.html` is only served by the Vite dev server. It isn't a build input.

- [ ] **Step 1: Create `scripts/og/og.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Social preview</title>
    <script type="module">
      import "@fontsource-variable/onest/wght.css";
      import "@fontsource/instrument-serif/400.css";
      import "@fontsource/instrument-serif/400-italic.css";
      import "@fontsource-variable/jetbrains-mono/wght.css";

      const COPY = {
        home: ["Home", "Senior Frontend Engineer", "AI-powered applications"],
        projects: ["Projects", "Things I've built", "Klipsy, Council and client work"],
        experience: ["Experience", "7+ years, two companies", "Vue, React and AI products"],
        about: ["About", "Frontend at the core", "AI on top"],
        contact: ["Contact", "Let's talk", "contact@artiomleo.com"],
      };
      const id = new URLSearchParams(location.search).get("frame") ?? "home";
      const [label, title, sub] = COPY[id] ?? COPY.home;
      document.querySelector("[data-label]").textContent = label;
      document.querySelector("[data-title]").textContent = title;
      document.querySelector("[data-sub]").textContent = sub;
    </script>
    <style>
      html, body { margin: 0; }
      body {
        width: 1200px;
        height: 630px;
        overflow: hidden;
        background: #f5f5f5 radial-gradient(#d2d2d2 1.2px, transparent 1.5px) 0 0 / 24px 24px;
        font-family: "Onest Variable", sans-serif;
        color: #141414;
      }
      .frame {
        position: absolute;
        left: 96px;
        top: 112px;
        box-sizing: border-box;
        width: 860px;
        height: 400px;
        padding: 56px 64px;
        background: #fff;
        box-shadow: 0 0 0 1px #e2e2e2, 0 20px 40px -24px rgb(0 0 0 / 0.25);
      }
      .label {
        position: absolute;
        left: 0;
        bottom: 100%;
        padding-bottom: 10px;
        font: 500 18px "JetBrains Mono Variable", monospace;
        color: #6b6b6b;
      }
      .kicker {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #6a4df5;
      }
      h1 { margin: 22px 0 0; font: 400 80px/1 "Instrument Serif", serif; letter-spacing: -0.02em; }
      .sub { margin: 16px 0 0; font: italic 400 44px/1.1 "Instrument Serif", serif; color: #6a4df5; }
      .cursor { position: absolute; left: 900px; top: 440px; }
      .cursor svg { display: block; width: 44px; height: 44px; }
      .cursor span {
        position: absolute;
        left: 34px;
        top: 40px;
        padding: 6px 14px;
        border-radius: 4px 16px 16px 16px;
        background: #ffaa00;
        color: #1e1e1e;
        font-size: 22px;
        font-weight: 700;
        white-space: nowrap;
      }
    </style>
  </head>
  <body>
    <div class="frame">
      <span class="label"># <span data-label></span></span>
      <p class="kicker">Artiom Leontiev</p>
      <h1 data-title></h1>
      <p class="sub" data-sub></p>
    </div>
    <div class="cursor">
      <svg viewBox="0 0 20 20"><path d="M3 2.5v14.2l3.6-3.4 2.4 5 2.5-1.2-2.4-4.9h5z" fill="#FFAA00" stroke="#fff" stroke-width="1.4" /></svg>
      <span>Artiom</span>
    </div>
  </body>
</html>
```

- [ ] **Step 2: Capture the five images**

Start `pnpm dev` in another terminal, then run:

```bash
: "${CHROME:?Set CHROME to the Google Chrome executable}"
mkdir -p public/og
for frame in home projects experience about contact; do
  "$CHROME" --headless=new --hide-scrollbars --window-size=1200,630 --virtual-time-budget=5000 \
    --screenshot="public/og/$frame.png" "http://localhost:8080/scripts/og/og.html?frame=$frame"
done
magick identify public/og/*.png
```

Expected: five PNGs at 1200x630. Open each one: the serif title and the italic subtitle must render in Instrument Serif, not Georgia. If they don't, raise `--virtual-time-budget` to 10000.

- [ ] **Step 3: Commit**

```bash
git add scripts/og public/og
git commit -m "feat: add social preview images"
```

---

### Task 19: README

**Files:**
- Replace: `README.md`

- [ ] **Step 1: Replace `README.md`**

````markdown
# artiomleo.com

Personal portfolio. On desktop it's a design file: Home, Projects, Experience, About and Contact are frames on a canvas you can pan, zoom and fly between, and Dev Mode shows the real code and measurements behind any element. On phones and for search engines it's a normal, prerendered page per route.

## Stack

React 18, Vite 5, react-router 6, plain CSS with design tokens (Tailwind supplies the reset), Fontsource fonts, sugar-high, zod. Hosted on Netlify.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server on http://localhost:8080 (client-rendered) |
| `pnpm build` | Client build, server build, then `scripts/prerender.mjs` writes one HTML file per route, `404.html`, `sitemap.xml` and `_headers` |
| `pnpm preview` | Serves `dist/` on http://localhost:3000 with clean URLs and the 404 page |
| `pnpm typecheck` / `pnpm lint` | TypeScript and ESLint |

## Where things live

- `src/content/` holds all copy. Client work uses the `ClientProject` type, which has no name, link or image fields. Keep client and product names out of the whole repo.
- `src/frames/` holds the five frames and the 404 page. Each renders in both layouts.
- `src/canvas/` holds the camera (pure math in `camera.ts`), input, frame layout, minimap, demo cursors and cursor chat.
- `src/devmode/` holds the inspector, loaded lazily. Code shown in Dev Mode comes from `#region layer:<id>` blocks in the real source files.
- `src/seo/` holds per-route titles, descriptions, share images and JSON-LD.
- `index.html` has the boot script that picks canvas or page layout before first paint. Its frame widths and paddings mirror `src/frames/registry.ts` and `src/canvas/constants.ts`.

## Assets

- Icons: edit `scripts/brand/*.svg`, then run `scripts/brand/render.sh` (needs ImageMagick 7).
- Social images: run `pnpm dev`, then capture `scripts/og/og.html?frame=<id>` at 1200×630 with headless Chrome (see `docs/superpowers/plans/2026-10-23-canvas-redesign.md`, Task 18).
- Screenshots: side projects only, 1200×750, AVIF plus WebP in `public/images/projects/`.

## Environment

| Variable | Used by |
| --- | --- |
| `VITE_FORM_ID` | Formspree form ID for the contact form |
| `SLACK_WEBHOOK_URL` | `netlify/functions/report-error.mjs`, which reports failed form submissions. The old name `VITE_SLACK_WEBHOOK_URL` still works until it's renamed in Netlify. |
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: rewrite the README for the canvas redesign"
```

---

### Task 20: Final verification, Lighthouse and the PR

- [ ] **Step 1: Static checks**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all pass. The prerender log lists six HTML files and two inline script hashes.

- [ ] **Step 2: Name scan**

Create a plain-text file outside the repository. List, one per line: every client name, product or code name, and client domain from your work projects, plus your personal email addresses. Never commit or paste this list into the repo. Then run:

```bash
: "${NAMES_FILE:?Set NAMES_FILE to the path of the list outside the repo}"
git grep -n -i -F -f "$NAMES_FILE" -- . ':!pnpm-lock.yaml'
grep -r -n -i -F -f "$NAMES_FILE" dist || true
```

Expected: no output from either command.

- [ ] **Step 3: Browser checklist on `pnpm preview`** (http://localhost:3000)

Desktop, 1440×900:
- [ ] First paint: Home doesn't jump when React takes over. Hard-reload `/`, `/projects` and `/experience`.
- [ ] Nav, `1`–`5`, hero buttons, and Back/Forward all fly between frames and keep the URL in sync.
- [ ] Wheel pans; Ctrl/⌘ + wheel and pinch zoom; dragging pans; Fit, `+` and `−` work; the minimap moves the view.
- [ ] Tab moves the camera to focused elements. The skip link focuses the canvas.
- [ ] Clicking each Version history item flies to that entry in Experience, and education in About.
- [ ] Demo cursors act on the current frame and pause for 6 seconds after a click.
- [ ] Cursor chat: `/`, type, Enter lands in the Contact message field.
- [ ] Dev Mode: specs, TSX and CSS for at least the hero title, primary button, project card, contact field and sticky. Swatches, the accent demo, auto-select and `Esc` all work.
- [ ] Both themes look right, the choice survives a reload, and Page view and Canvas view toggle.
- [ ] Reduced motion: no flights, cursors or accent demo; the comment pin is static.

Phone, 390×844 (DevTools device toolbar):
- [ ] One frame per page; the frame bar and "Next" links work.
- [ ] `document.documentElement.scrollWidth === 390` on every route.
- [ ] Dev Mode opens a bottom sheet when you tap an element.
- [ ] The contact form shows field errors, and focus moves to the first invalid field.

General:
- [ ] With JavaScript disabled, every route still shows its full frame.
- [ ] `/nope` shows "Frame not found".
- [ ] The console is clean on every route: no hydration errors, no CSP violations.

- [ ] **Step 4: Lighthouse**

Run Chrome DevTools → Lighthouse against `pnpm preview`, then again against the Netlify deploy preview once Step 5 has pushed. Use navigation mode, for Mobile and for Desktop, on `/` and `/projects`.
- Targets: Performance at least 95, and 100 for Accessibility, Best Practices and SEO.
- Fix anything below target before merging.
- Record the eight score sets in the PR description.

On the deploy preview, also check:
- The contact form sends: a real submission arrives through Formspree.
- `curl -sI https://<preview>.netlify.app/nope` returns `404`.
- `curl -sI https://<preview>.netlify.app/home` returns `301` to `/`.
- `curl -sI https://<preview>.netlify.app/` includes the `content-security-policy` header.

- [ ] **Step 5: Push and open the PR**

```bash
git push -u origin redesign/canvas
gh pr create --base main --head redesign/canvas --title "Canvas redesign: design-file portfolio with Dev Mode" --body-file - <<'BODY'
## What changes
- On desktop the site becomes one design file. The five pages are frames on a canvas, and nav and shortcuts fly the camera between them.
- Dev Mode shows the live measurements, colour tokens and real source of any element.
- Phones, Page view and crawlers get a prerendered page per route.
- Content is rebuilt from the 2026 CV. Client work is anonymised: no names, links or screenshots.
- New palette, type and cursor favicon set; per-route meta, social images, JSON-LD, generated sitemap, real 404s and security headers.
- The contact form is validated, and the error reporter is hardened.
- About 45 unused dependencies are removed.

## Needs doing in Netlify
- Rename `VITE_SLACK_WEBHOOK_URL` to `SLACK_WEBHOOK_URL`. The old name keeps working until then.

## Lighthouse
| Page | Device | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- | --- |
| / | Mobile |  |  |  |  |
| / | Desktop |  |  |  |  |
| /projects | Mobile |  |  |  |  |
| /projects | Desktop |  |  |  |  |

## Checked
- Typecheck, lint and build pass.
- Built HTML checked for every route.
- Browser checklist from the plan, desktop and 390px.
- Name scan clean.
BODY
```

Fill the Lighthouse table with `gh pr edit` once the deploy preview scores are in. The PR body ends at "Checked", with no attribution line.
