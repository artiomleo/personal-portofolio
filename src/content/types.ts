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
