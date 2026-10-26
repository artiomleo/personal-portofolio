import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import { headTags } from "./seo/head";
import { ROUTES } from "./seo/routes";
import { SITE_URL } from "./seo/site";

export const routes = ROUTES;
export const siteUrl = SITE_URL;

export function render(url: string): { html: string; head: string } {
  const meta = ROUTES.find((r) => r.path === url);
  if (!meta) throw new Error(`No route meta for ${url}`);
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  return { html, head: headTags(meta) };
}
