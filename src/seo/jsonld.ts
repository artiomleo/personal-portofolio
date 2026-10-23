import { profile } from "@/content/profile";
import type { RouteMeta } from "./routes";
import { SITE_NAME, SITE_URL } from "./site";

function person() {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: profile.name,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}${profile.portrait.webp}`,
    jobTitle: profile.title,
    description: profile.lede,
    address: { "@type": "PostalAddress", addressLocality: "Cluj-Napoca", addressCountry: "RO" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Technical University of Cluj-Napoca" },
    knowsAbout: ["Vue", "React", "TypeScript", "Micro-frontends", "Accessibility", "Web performance", "LLM integrations", "RAG", "AI agents", "Model Context Protocol"],
    sameAs: [profile.github, profile.linkedin],
  };
}

/** Person on every page; WebSite and ProfilePage on the home page; nothing on the 404 page. */
export function jsonLd(meta: RouteMeta): object[] {
  if (meta.id === "notFound") return [];
  if (meta.id !== "home") return [{ "@context": "https://schema.org", ...person() }];
  return [
    {
      "@context": "https://schema.org",
      "@graph": [
        person(),
        { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: SITE_NAME, inLanguage: "en" },
        {
          "@type": "ProfilePage",
          "@id": `${SITE_URL}/#profile`,
          url: `${SITE_URL}/`,
          name: meta.title,
          mainEntity: { "@id": `${SITE_URL}/#person` },
          isPartOf: { "@id": `${SITE_URL}/#website` },
        },
      ],
    },
  ];
}
