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
