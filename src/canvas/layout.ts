import type { FrameId } from "@/frames/registry";
import type { Rect } from "./camera";
import { FRAME_GAP } from "./constants";

export type FrameRects = Record<FrameId, Rect>;
export type FrameSizes = Record<FrameId, { w: number; h: number }>;

/** Three columns: Home over Experience, then Projects, then About over Contact. */
export const COLUMNS: FrameId[][] = [["home", "experience"], ["projects"], ["about", "contact"]];

// Positions snap to the 20px dot grid so the grid doesn't shift when the canvas takes over.
const snap = (v: number) => Math.ceil(v / 20) * 20;

export function layoutFrames(sizes: FrameSizes): FrameRects {
  const rects = {} as FrameRects;
  let x = 0;
  for (const column of COLUMNS) {
    let y = 0;
    let width = 0;
    for (const id of column) {
      const { w, h } = sizes[id];
      rects[id] = { x, y, w, h };
      y = snap(y + h + FRAME_GAP);
      width = Math.max(width, w);
    }
    x = snap(x + width + FRAME_GAP);
  }
  return rects;
}

export function bounds(rects: Rect[]): Rect {
  const x0 = Math.min(...rects.map((r) => r.x));
  const y0 = Math.min(...rects.map((r) => r.y));
  const x1 = Math.max(...rects.map((r) => r.x + r.w));
  const y1 = Math.max(...rects.map((r) => r.y + r.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
