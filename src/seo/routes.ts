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
    title: "Artiom Leontiev · Senior Frontend Engineer, AI-powered applications",
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
    description: "Get in touch about frontend or AI product work.",
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
