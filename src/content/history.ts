import { education } from "./about";
import { roles } from "./experience";

export type HistoryItem = { id: string; years: string; label: string };

/** Version history panel: every experience entry and education, newest first. Ids match element ids in the frames. */
export const history: HistoryItem[] = [
  ...roles.flatMap((role) => [
    ...role.engagements.map((e) => ({ id: `entry-${e.id}`, years: e.years, label: e.title })),
    { id: `entry-${role.id}`, years: role.years, label: `${role.title} · ${role.company}` },
  ]),
  ...education.map((e) => ({ id: `entry-${e.id}`, years: e.years, label: e.short })),
];
