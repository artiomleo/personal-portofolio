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

export const isLayerId = (value: string | undefined): value is LayerId =>
  value !== undefined && Object.prototype.hasOwnProperty.call(LAYERS, value);
