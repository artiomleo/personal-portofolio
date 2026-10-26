import { useEffect } from "react";
import { canonicalUrl, routeMeta, type RouteId } from "./routes";
import { SITE_URL } from "./site";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (href === null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Keeps the title and share tags in step with client-side navigation. Prerendered HTML already has them. */
export function useRouteMeta(id: RouteId): void {
  useEffect(() => {
    const meta = routeMeta(id);
    const url = canonicalUrl(meta);
    const image = SITE_URL + meta.image;
    document.title = meta.title;
    setMeta("name", "description", meta.description);
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:title", meta.title);
    setMeta("name", "twitter:description", meta.description);
    setMeta("name", "twitter:image", image);
    if (url) setMeta("property", "og:url", url);
    else document.head.querySelector('meta[property="og:url"]')?.remove();
    setCanonical(url);
  }, [id]);
}
