export type SwatchId = "violet" | "pink" | "blue" | "orange";

/** Light values take white text, dark values take #141414 text; all pass 4.5:1. CSS lives in tokens.css. */
export const SWATCHES: { id: SwatchId; name: string; light: string; dark: string }[] = [
  { id: "violet", name: "Violet", light: "#6A4DF5", dark: "#A08CFF" },
  { id: "pink", name: "Pink", light: "#D92D72", dark: "#F06A9B" },
  { id: "blue", name: "Blue", light: "#0A74D1", dark: "#4DA3FF" },
  { id: "orange", name: "Orange", light: "#C2410C", dark: "#F5894A" },
];

export function applyAccent(id: SwatchId): void {
  const root = document.documentElement;
  if (id === "violet") root.removeAttribute("data-accent");
  else root.setAttribute("data-accent", id);
}
