// Runs after `vite build` and `vite build --ssr`. For every route it writes HTML with the rendered app and
// that route's head tags, then writes 404.html, sitemap.xml and _headers (CSP with inline-script hashes).
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render, routes, siteUrl } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const template = await readFile(path.join(dist, "index.html"), "utf8");

// A second run without `vite build` would read an already-prerendered index.html and silently copy Home everywhere.
for (const marker of ["<!--app-head-->", "<!--app-html-->"]) {
  if (!template.includes(marker)) throw new Error(`prerender: ${marker} is missing from dist/index.html; run the full build`);
}

const assets = await readdir(path.join(dist, "assets"));
const preloadTag = (f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`;
// The hero headline uses both the regular and the italic cut; find both up front so either can be preloaded.
const [regular, italic] = ["normal", "italic"].map((style) =>
  assets.find((f) => new RegExp(`^instrument-serif-latin-400-${style}-[\\w-]+\\.woff2$`).test(f)),
);
if (!regular || !italic) {
  if (process.env.CI) throw new Error("prerender: hero font files not found; did a font package rename its files?");
  console.warn("prerender: hero font files not found, skipping the preload");
}
// The italic cut is used above the fold only by the Home hero and the Projects card taglines; preload it only on
// those routes, not on every route.
const ITALIC_ROUTES = new Set(["home", "projects"]);

// Inline the main stylesheet: one less render-blocking request on first load (about 11 KB gzipped).
const stylesheet = template.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
if (!stylesheet) throw new Error("prerender: main stylesheet link not found in dist/index.html");
const css = await readFile(path.join(dist, stylesheet[1]), "utf8");
const inlined = template.replace(stylesheet[0], () => `<style>${css}</style>`);

const scriptHashes = new Set();
const inlineScript = /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g;

for (const route of routes) {
  const { html, head } = render(route.path);
  const preload = [regular, ITALIC_ROUTES.has(route.id) ? italic : null].filter(Boolean).map(preloadTag).join("\n    ");
  // Replacer functions, so a "$" in the content is never read as a replacement pattern.
  const page = inlined.replace("<!--app-head-->", () => `${preload}\n    ${head}`).replace("<!--app-html-->", () => html);
  if (process.env.CONTEXT === "production" && page.includes("formspree.io/f/undefined")) {
    throw new Error("prerender: VITE_FORM_ID is not set for the production build");
  }
  for (const match of page.matchAll(inlineScript)) {
    scriptHashes.add(`'sha256-${createHash("sha256").update(match[1]).digest("base64")}'`);
  }
  const file = route.id === "notFound" ? "404.html" : route.path === "/" ? "index.html" : `${route.path.slice(1)}.html`;
  await writeFile(path.join(dist, file), page);
  console.log(`prerender: ${file}`);
}

// lastmod is the date of the latest commit, so it only moves when the site changes.
let lastmod = new Date().toISOString().slice(0, 10);
try {
  lastmod = execSync("git log -1 --format=%cs", { encoding: "utf8" }).trim() || lastmod;
} catch {
  // No git history available; keep today's date.
}
const urls = routes
  .filter((r) => r.id !== "notFound")
  .map((r) => `  <url><loc>${siteUrl}${r.path}</loc><lastmod>${lastmod}</lastmod></url>`)
  .join("\n");
await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

const csp = [
  "default-src 'self'",
  `script-src 'self' https://www.googletagmanager.com ${[...scriptHashes].join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://formspree.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://formspree.io",
  "object-src 'none'",
].join("; ");

await writeFile(
  path.join(dist, "_headers"),
  [
    "/*",
    `  Content-Security-Policy: ${csp}`,
    "  Strict-Transport-Security: max-age=31536000; includeSubDomains",
    "  X-Content-Type-Options: nosniff",
    "  Referrer-Policy: strict-origin-when-cross-origin",
    "  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "/assets/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    "",
  ].join("\n"),
);

await rm(ssrDir, { recursive: true, force: true });
console.log(`prerender: sitemap.xml, _headers (${scriptHashes.size} inline script hashes)`);
