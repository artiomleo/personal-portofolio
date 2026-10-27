export const profile = {
  name: "Artiom Leontiev",
  title: "Senior Frontend Engineer",
  focus: "AI-powered applications",
  location: "Cluj-Napoca, Romania",
  email: "contact@artiomleo.com",
  github: "https://github.com/artiomleo",
  linkedin: "https://www.linkedin.com/in/artiomleo/",
  cvUrl: "https://drive.google.com/file/d/1c296pwoO0QAl2fmsOOMBiI6i6DjtpRws/view?usp=sharing",
  headline: { lead: "builds web products,", accent: "and the AI behind them." },
  lede: "I've built web apps in Vue and React for 7+ years. Since 2025 most of my work has been AI products: LLM features, RAG search, agents, and MCP servers for Claude and ChatGPT. Based in Cluj-Napoca, Romania.",
  currently: ["Building AI products and internal tools at Amdaris", "Building Klipsy, an AI social media app, on the side"],
  bio: [
    "I'm a senior frontend engineer in Cluj-Napoca. I started as a full-stack developer at BinarCode, building Vue and Laravel apps for clients, then moved to Amdaris, where I've led frontend teams on large healthcare and compliance platforms.",
    "Since 2025 I've mostly built AI products: a case-study generator, an MCP server for coding agents, and, in my own time, Klipsy and Council. I use Claude Code every day, and I'm comfortable working in the backend when a feature needs it.",
  ],
  portrait: {
    avif: "/images/portrait.avif",
    webp: "/images/portrait.webp",
    width: 640,
    height: 683,
    alt: "Portrait of Artiom Leontiev",
  },
} as const;
