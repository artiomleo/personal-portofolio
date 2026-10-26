/** The scripted demo cursors. White label text passes 4.5:1 on pink and violet; amber takes dark text. */
export const DEMO_CURSORS = [
  { id: "designer", name: "Designer", initials: "D", color: "var(--cursor-designer)", text: "#FFFFFF" },
  { id: "pm", name: "PM", initials: "PM", color: "var(--cursor-pm)", text: "#FFFFFF" },
  { id: "artiom", name: "Artiom", initials: "A", color: "var(--cursor-artiom)", text: "#1E1E1E" },
] as const;

export type DemoCursorId = (typeof DEMO_CURSORS)[number]["id"];
