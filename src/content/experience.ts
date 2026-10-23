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
