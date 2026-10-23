import comments from "../canvas/DemoCursors.tsx?raw";
import contact from "../frames/Contact.tsx?raw";
import experience from "../frames/Experience.tsx?raw";
import frame from "../frames/Frame.tsx?raw";
import home from "../frames/Home.tsx?raw";
import projects from "../frames/Projects.tsx?raw";
import ui from "../frames/ui.tsx?raw";
import framesNav from "../shell/FramesNav.tsx?raw";
import versionHistory from "../shell/VersionHistory.tsx?raw";
import canvasCss from "../styles/canvas.css?raw";
import contactCss from "../styles/contact.css?raw";
import experienceCss from "../styles/experience.css?raw";
import framesCss from "../styles/frames.css?raw";
import projectsCss from "../styles/projects.css?raw";
import shellCss from "../styles/shell.css?raw";
import type { LayerId } from "./layers";
import { region } from "./region";

const TSX: Record<LayerId, string> = {
  nav: framesNav,
  "frame-label": frame,
  "frame-title": frame,
  "hero-title": home,
  "hero-lede": home,
  "button-primary": ui,
  "project-card": projects,
  "stack-tag": ui,
  "experience-entry": experience,
  "history-item": versionHistory,
  "contact-field": contact,
  sticky: frame,
  "comment-pin": comments,
};

const CSS: Record<LayerId, string> = {
  nav: shellCss,
  "frame-label": framesCss,
  "frame-title": framesCss,
  "hero-title": framesCss,
  "hero-lede": framesCss,
  "button-primary": framesCss,
  "project-card": projectsCss,
  "stack-tag": framesCss,
  "experience-entry": experienceCss,
  "history-item": shellCss,
  "contact-field": contactCss,
  sticky: framesCss,
  "comment-pin": canvasCss,
};

/** The real source behind a layer, imported at build time so it always matches what renders. */
export function sourceFor(id: LayerId): { tsx: string; css: string } {
  return { tsx: region(TSX[id], id), css: region(CSS[id], id) };
}
