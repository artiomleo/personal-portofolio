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
