import type { Config } from "tailwindcss";

// Tailwind supplies only the preflight reset (src/index.css imports tailwindcss/base, not utilities); components use the plain CSS in src/styles.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
} satisfies Config;
