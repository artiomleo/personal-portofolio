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
          "Took an AI case-study generator to production. Sales and Marketing now get a case study in minutes instead of days. Built the React app and co-built the RAG service (Azure OpenAI).",
          "Built and self-hosted an MCP server that gives Claude Code and GitHub Copilot access to the company's agent-skill library. Load-tested it to 100 concurrent users at about 70 ms median latency.",
          "Contributed to a shared library of agent skills that add common features to a project in one step, such as Microsoft Entra ID sign-in, role-based permissions, audit trails and PDF digital signatures.",
          "Worked on an AI-assisted project-delivery platform where AI assistants act as product manager, architect and scrum master, drafting requirements, stories and reports for a person to accept or reject. It also hosts the team's code, pull-request reviews and build pipelines, with a VS Code extension (React, TypeScript).",
        ],
      },
      {
        id: "compliance",
        title: "Frontend lead, sustainability-compliance SaaS",
        years: "2025 – 2026",
        points: [
          "Designed a React 19 micro-frontend architecture (Module Federation) with a shared design system, role-based access and a typed API client, and built the core compliance workflows.",
          "Got the team using AI day to day: Claude Code commands for end-to-end tests and code review, and an agent workflow (BMAD) for writing stories and QA.",
        ],
      },
      {
        id: "occupational-health",
        title: "Frontend lead, occupational-health platform",
        years: "2023 – 2025",
        points: [
          "Designed the Vue 3 and Vite micro-frontend architecture, including an engine that builds forms from configuration. The platform passed a WCAG 2.1 AA accessibility audit.",
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
      "Built a Nuxt job-board builder that runs many sites, each on its own domain. Server-side rendering and SEO work raised its SEO score by 30%.",
      "Led a team of 2 building a tool that writes articles automatically, with paid plans through Stripe.",
      "Built web apps in Vue.js, Laravel and MySQL for companies in the USA, the UK and the Netherlands.",
    ],
  },
];
