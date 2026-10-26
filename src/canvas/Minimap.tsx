import { useRef, type MouseEvent } from "react";
import { FRAMES } from "@/frames/registry";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import { useCanvasApi } from "./CanvasApi";
import { toWorld } from "./camera";
import { bounds, type FrameRects } from "./layout";

const MAX_W = 168;
const MAX_H = 120;

/** A pointer shortcut; keyboard users have the frame shortcuts and Fit. */
export function Minimap({ rects }: { rects: FrameRects }) {
  const api = useCanvasApi();
  const viewRef = useRef<HTMLDivElement>(null);
  const b = bounds(Object.values(rects));
  const s = Math.min(MAX_W / b.w, MAX_H / b.h);

  useIsoLayoutEffect(
    () =>
      api?.subscribe((v) => {
        const el = viewRef.current;
        if (!el) return;
        const vp = api.getViewport();
        const [x0, y0] = toWorld(v, 0, 0);
        el.style.transform = `translate(${(x0 - b.x) * s}px, ${(y0 - b.y) * s}px)`;
        el.style.width = `${(vp.w / v.z) * s}px`;
        el.style.height = `${(vp.h / v.z) * s}px`;
      }),
    [api, b.x, b.y, s],
  );

  if (!api) return null;
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    api.centerOn(b.x + (e.clientX - r.left) / s, b.y + (e.clientY - r.top) / s);
  };

  return (
    <div className="minimap" aria-hidden="true" data-nopan>
      <div className="minimap-inner" style={{ width: b.w * s, height: b.h * s }} onClick={onClick}>
        {FRAMES.map((f) => {
          const r = rects[f.id];
          return (
            <i
              key={f.id}
              className="minimap-frame"
              style={{ left: (r.x - b.x) * s, top: (r.y - b.y) * s, width: r.w * s, height: r.h * s }}
            />
          );
        })}
        <div ref={viewRef} className="minimap-view" />
      </div>
    </div>
  );
}
