import type { Config } from "tailwindcss";

// Tailwind supplies the preflight reset; components use the plain CSS in src/styles.
export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        site: {
          bg: "var(--site-bg)",
          text: "var(--site-text)",
          muted: "var(--site-muted)",
          line: "var(--site-line)",
          soft: "var(--site-soft)",
        },
        accent: { DEFAULT: "var(--accent)", on: "var(--on-accent)" },
        tool: {
          bg: "var(--tool-bg)",
          ui: "var(--tool-ui)",
          text: "var(--tool-text)",
          muted: "var(--tool-muted)",
          line: "var(--tool-line)",
        },
        select: "var(--select)",
      },
      fontFamily: {
        display: "var(--font-display)",
        ui: "var(--font-ui)",
        mono: "var(--font-mono)",
      },
    },
  },
} satisfies Config;
