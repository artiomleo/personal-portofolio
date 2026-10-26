import { PAD_TOP, PAD_X } from "./constants";

export type Rect = { x: number; y: number; w: number; h: number };
/** z is the zoom; x and y are the world's translation in screen px. */
export type View = { z: number; x: number; y: number };
export type Viewport = { w: number; h: number };
export type Point = [number, number];

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 2;

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function toScreen(v: View, x: number, y: number): Point {
  return [x * v.z + v.x, y * v.z + v.y];
}

export function toWorld(v: View, x: number, y: number): Point {
  return [(x - v.x) / v.z, (y - v.y) / v.z];
}

/** Fit a frame's width between the side margins, top-aligned, never above 100%. Mirrors the boot script. */
export function focusFrame(r: Rect, vp: Viewport): View {
  const z = clamp((vp.w - PAD_X * 2) / r.w, MIN_ZOOM, 1);
  return { z, x: Math.round((vp.w - r.w * z) / 2 - r.x * z), y: Math.round(PAD_TOP - r.y * z) };
}

/** Fit a whole rectangle (Fit all). */
export function fitRect(r: Rect, vp: Viewport, pad = 40): View {
  const z = clamp(Math.min((vp.w - pad * 2) / r.w, (vp.h - pad * 2) / r.h), MIN_ZOOM, MAX_ZOOM);
  return { z, x: vp.w / 2 - (r.x + r.w / 2) * z, y: vp.h / 2 - (r.y + r.h / 2) * z };
}

/** Zoom to z while keeping the screen point (cx, cy) fixed. */
export function zoomAround(v: View, z: number, cx: number, cy: number): View {
  const nz = clamp(z, MIN_ZOOM, MAX_ZOOM);
  return { z: nz, x: cx - (cx - v.x) * (nz / v.z), y: cy - (cy - v.y) * (nz / v.z) };
}

/** Keep the zoom and put the world point (x, y) in the middle of the viewport. */
export function centerOn(v: View, vp: Viewport, x: number, y: number): View {
  return { z: v.z, x: vp.w / 2 - x * v.z, y: vp.h / 2 - y * v.z };
}

export type Flight = { from: View; to: View; vp: Viewport; dip: number; start: number; duration: number };

export function planFlight(from: View, to: View, vp: Viewport, start: number, duration: number): Flight {
  const [ax, ay] = toWorld(from, vp.w / 2, vp.h / 2);
  const [bx, by] = toWorld(to, vp.w / 2, vp.h / 2);
  const travel = (Math.hypot(bx - ax, by - ay) * Math.min(from.z, to.z)) / vp.w;
  return { from, to, vp, dip: clamp(travel * 0.5, 0, 0.42), start, duration };
}

/** Zoom moves on a log scale with a slight zoom-out dip mid-flight, as in the prototype. */
export function flightAt(f: Flight, now: number): { view: View; done: boolean } {
  const e = f.duration > 0 ? clamp((now - f.start) / f.duration, 0, 1) : 1;
  if (e >= 1) return { view: f.to, done: true };
  const s = ease(e);
  const [ax, ay] = toWorld(f.from, f.vp.w / 2, f.vp.h / 2);
  const [bx, by] = toWorld(f.to, f.vp.w / 2, f.vp.h / 2);
  const logZ = Math.log(f.from.z) + (Math.log(f.to.z) - Math.log(f.from.z)) * s;
  const z = Math.max(MIN_ZOOM, Math.exp(logZ) * (1 - f.dip * Math.sin(Math.PI * s)));
  const cx = ax + (bx - ax) * s;
  const cy = ay + (by - ay) * s;
  return { view: { z, x: f.vp.w / 2 - cx * z, y: f.vp.h / 2 - cy * z }, done: false };
}
