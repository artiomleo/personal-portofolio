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
    description: "Senior frontend engineer in Cluj-Napoca, Romania. I build web apps in React and Vue, and since 2025 mostly AI products with LLMs, RAG, agents and MCP servers.",
    image: "/og/home.png",
    imageAlt: "Artiom Leontiev, Senior Frontend Engineer, AI-powered applications",
  },
  {
    id: "projects",
    path: "/projects",
    title: "Projects · Artiom Leontiev",
    description: "Side projects Klipsy, Council and AskManu, plus client work on AI tools and on compliance and healthcare platforms.",
    image: "/og/projects.png",
    imageAlt: "Projects by Artiom Leontiev",
  },
  {
    id: "experience",
    path: "/experience",
    title: "Experience · Artiom Leontiev",
    description: "Senior frontend engineer at Amdaris since 2022, full-stack at BinarCode before that. Frontend lead on two large platforms, and AI products since 2025.",
    image: "/og/experience.png",
    imageAlt: "Experience of Artiom Leontiev",
  },
  {
    id: "about",
    path: "/about",
    title: "About · Artiom Leontiev",
    description: "Skills, certifications and education: Vue, React and TypeScript, AI work with Claude, OpenAI and Gemini, accessibility and web performance.",
    image: "/og/about.png",
    imageAlt: "About Artiom Leontiev",
  },
  {
    id: "contact",
    path: "/contact",
    title: "Contact · Artiom Leontiev",
    description: "Email Artiom Leontiev about a frontend or AI role, or a React or Vue project. Based in Cluj-Napoca, Romania.",
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
