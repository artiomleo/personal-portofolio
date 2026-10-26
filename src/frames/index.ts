import type { ComponentType } from "react";
import { About } from "./About";
import { Contact } from "./Contact";
import { Experience } from "./Experience";
import { Home } from "./Home";
import { Projects } from "./Projects";
import type { FrameId } from "./registry";

export const FRAME_COMPONENTS: Record<FrameId, ComponentType<{ primary: boolean }>> = {
  home: Home,
  projects: Projects,
  experience: Experience,
  about: About,
  contact: Contact,
};
