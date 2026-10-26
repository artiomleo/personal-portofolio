import { ease, type Point, type Rect } from "./camera";

/** [seconds, worldX, worldY] */
export type Key = [number, number, number];

export const LOOP = 14;
/** Where the Artiom cursor holds the sticky, relative to the sticky's corner. */
export const GRAB: Point = [26, 20];
/** How far the sticky moves when dragged. */
const STICKY_SHIFT: Point = [-28, 44];

export function along(keys: Key[], t: number): Point {
  if (t <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t <= b[0]) {
      const k = ease((t - a[0]) / (b[0] - a[0] || 1));
      return [a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
    }
  }
  const last = keys[keys.length - 1];
  return [last[1], last[2]];
}

const key = (t: number, p: Point, dx = 0, dy = 0): Key => [t, p[0] + dx, p[1] + dy];

export type Targets = { frame: Rect; title: Rect; comment: Rect | null; sticky: Rect | null };

export type Tracks = {
  designer: Key[];
  pm: Key[] | null;
  artiom: Key[] | null;
  select: { from: Point; to: Point };
  pin: Point | null;
  grab: { a: Point; b: Point } | null;
};

export function buildTracks({ frame: f, title, comment, sticky }: Targets): Tracks {
  const tl: Point = [title.x - 10, title.y - 10];
  const br: Point = [title.x + title.w + 10, title.y + title.h + 10];
  const designerRest: Point = [f.x + f.w * 0.64, f.y + Math.min(f.h - 60, 360)];
  const designer: Key[] = [
    key(0, designerRest),
    key(1, designerRest),
    key(2, tl),
    key(3.2, br),
    key(3.6, br, 14, 12),
    key(6.4, br, 14, 12),
    key(7.6, designerRest, 120, 0),
    key(LOOP, designerRest),
  ];

  let pm: Key[] | null = null;
  let pin: Point | null = null;
  if (comment) {
    pin = [comment.x + Math.min(comment.w * 0.62, comment.w - 24), comment.y + Math.min(comment.h * 0.3, 40)];
    const pmRest: Point = [f.x + f.w * 0.82, f.y + Math.min(f.h - 60, 520)];
    pm = [key(0, pmRest), key(3, pmRest), key(4.2, pin, 14, 12), key(9.8, pin, 14, 12), key(11, pmRest, 60, -40), key(LOOP, pmRest)];
  }

  let artiom: Key[] | null = null;
  let grab: Tracks["grab"] = null;
  if (sticky) {
    const a: Point = [sticky.x, sticky.y];
    const b: Point = [a[0] + STICKY_SHIFT[0], a[1] + STICKY_SHIFT[1]];
    const rest: Point = [f.x + f.w - 40, f.y + Math.min(f.h - 40, 300)];
    artiom = [
      key(0, rest),
      key(0.8, a, ...GRAB),
      key(1, a, ...GRAB),
      key(3.6, b, ...GRAB),
      key(4, b, ...GRAB),
      key(5.6, rest),
      key(8.2, rest),
      key(9.2, b, ...GRAB),
      key(9.4, b, ...GRAB),
      key(11.8, a, ...GRAB),
      key(LOOP, rest),
    ];
    grab = { a, b };
  }

  return { designer, pm, artiom, select: { from: tl, to: br }, pin, grab };
}
