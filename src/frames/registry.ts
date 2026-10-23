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
