// Site tokens come first, so a value shared with a tool token resolves to the site token.
const TOKENS = [
  "--site-text", "--site-bg", "--site-muted", "--site-line", "--site-soft", "--accent", "--on-accent",
  "--tool-text", "--tool-ui", "--tool-bg", "--tool-muted", "--tool-line", "--select", "--sticky", "--sticky-text",
  "--field-line", "--danger",
];

export type ColorSpec = { property: "Text" | "Fill" | "Border"; token: string | null; value: string };

export type Specs = {
  width: number;
  height: number;
  font: string;
  type: string;
  weight: string;
  padding: string;
  colors: ColorSpec[];
};

function toHex(rgb: string): string | null {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m || m[4] === "0") return null;
  return `#${[m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

/** Live specs. offsetWidth/offsetHeight ignore the canvas zoom, so sizes are true CSS px. */
export function measure(el: HTMLElement): Specs {
  const cs = getComputedStyle(el);
  const root = getComputedStyle(document.documentElement);
  const tokenByHex = new Map<string, string>();
  for (const token of TOKENS) {
    const value = root.getPropertyValue(token).trim().toUpperCase();
    if (value && !tokenByHex.has(value)) tokenByHex.set(value, token);
  }
  const candidates: Array<[ColorSpec["property"], string]> = [
    ["Text", cs.color],
    ["Fill", cs.backgroundColor],
    ["Border", cs.borderTopWidth !== "0px" ? cs.borderTopColor : ""],
  ];
  const colors: ColorSpec[] = [];
  for (const [property, value] of candidates) {
    const hex = value ? toHex(value) : null;
    if (hex) colors.push({ property, token: tokenByHex.get(hex) ?? null, value: hex });
  }
  const lineHeight = cs.lineHeight === "normal" ? "normal" : String(Math.round(parseFloat(cs.lineHeight)));
  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
    font: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
    type: `${Math.round(parseFloat(cs.fontSize) * 10) / 10} / ${lineHeight}`,
    weight: cs.fontWeight,
    padding: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map((v) => Math.round(parseFloat(v))).join(" "),
    colors,
  };
}
