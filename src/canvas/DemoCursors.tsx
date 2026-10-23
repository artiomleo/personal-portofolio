import { forwardRef, useEffect, useRef, type CSSProperties } from "react";
import { FRAME_NOTES } from "@/content/annotations";
import type { FrameId } from "@/frames/registry";
import { useLayout } from "@/layout/LayoutProvider";
import { useCanvasApi } from "./CanvasApi";
import { toScreen, type Point, type View } from "./camera";
import { DEMO_CURSORS, type DemoCursorId } from "./cursors";
import { CursorIcon } from "./CursorIcon";
import type { FrameRects } from "./layout";
import { rectIn } from "./rect";
import { along, buildTracks, GRAB, LOOP } from "./timeline";

const IDLE_RESUME_MS = 6000;

type Props = {
  current: FrameId;
  /** Re-plan the tracks when the layout changes. */
  rects: FrameRects;
  /** False while Dev Mode is on. */
  live: boolean;
};

export function DemoCursors({ current, rects, live }: Props) {
  const api = useCanvasApi();
  const { reducedMotion } = useLayout();
  const cursorRefs = useRef<Partial<Record<DemoCursorId, HTMLDivElement | null>>>({});
  const selectRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLSpanElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const comment = FRAME_NOTES[current].comment;
  const animate = live && !reducedMotion;

  useEffect(() => {
    const world = api?.getWorld();
    if (!api || !world) return;
    const frameEl = world.querySelector<HTMLElement>(`[data-frame="${current}"]`);
    const titleEl = document.getElementById(`${current}-title`);
    if (!frameEl || !titleEl) return;
    const commentEl = comment ? document.getElementById(comment.target) : null;
    const stickyEl = world.querySelector<HTMLElement>(`[data-sticky="${current}"]`);
    const titleBox = rectIn(titleEl, world);
    const tracks = buildTracks({
      frame: rectIn(frameEl, world),
      title: titleBox,
      comment: commentEl ? rectIn(commentEl, world) : null,
      sticky: stickyEl ? rectIn(stickyEl, world) : null,
    });

    let t = 0;
    let last = 0;
    let raf = 0;
    let lastInput = -Infinity;
    const onInput = () => {
      lastInput = performance.now();
    };

    const place = (el: HTMLElement | null | undefined, v: View, p: Point, dx = 0, dy = 0) => {
      if (!el) return;
      const [x, y] = toScreen(v, p[0], p[1]);
      el.style.transform = `translate(${x + dx}px, ${y + dy}px)`;
    };

    const draw = (v: View) => {
      const cursors = cursorRefs.current;
      const pin = pinRef.current;
      const pinOn = tracks.pin !== null && (!animate || (t >= 4.6 && t < 9.8));
      if (pin) {
        pin.hidden = !pinOn;
        if (pinOn && tracks.pin) place(pin, v, tracks.pin, -4, 0);
      }

      if (!animate) {
        for (const c of DEMO_CURSORS) {
          const el = cursors[c.id];
          if (el) el.hidden = true;
        }
        if (selectRef.current) selectRef.current.hidden = true;
        return;
      }

      const d = along(tracks.designer, t);
      if (cursors.designer) {
        cursors.designer.hidden = false;
        place(cursors.designer, v, d);
      }

      const sel = selectRef.current;
      if (sel) {
        if (t >= 2 && t < 6.8) {
          // A marquee while dragging, then the box snaps to the selected title, as in a design tool.
          const snapped = t >= 3.2;
          const [fx, fy] = tracks.select.from;
          const x = snapped ? titleBox.x : Math.min(fx, d[0]);
          const y = snapped ? titleBox.y : Math.min(fy, d[1]);
          const w = snapped ? titleBox.w : Math.abs(d[0] - fx);
          const h = snapped ? titleBox.h : Math.abs(d[1] - fy);
          place(sel, v, [x, y]);
          sel.style.width = `${w * v.z}px`;
          sel.style.height = `${h * v.z}px`;
          sel.hidden = false;
          const label = `${Math.round(w)} × ${Math.round(h)}`;
          if (sizeRef.current && sizeRef.current.textContent !== label) sizeRef.current.textContent = label;
        } else {
          sel.hidden = true;
        }
      }

      if (cursors.pm) {
        cursors.pm.hidden = !tracks.pm;
        if (tracks.pm) place(cursors.pm, v, along(tracks.pm, t));
      }

      if (cursors.artiom) {
        cursors.artiom.hidden = !tracks.artiom;
        if (tracks.artiom) place(cursors.artiom, v, along(tracks.artiom, t));
      }

      if (stickyEl && tracks.artiom && tracks.grab) {
        const holding = (t >= 1 && t < 3.6) || (t >= 9.4 && t < 11.8);
        const hand = along(tracks.artiom, t);
        const at: Point = holding ? [hand[0] - GRAB[0], hand[1] - GRAB[1]] : t >= 3.6 && t < 9.4 ? tracks.grab.b : tracks.grab.a;
        stickyEl.style.translate = `${at[0] - tracks.grab.a[0]}px ${at[1] - tracks.grab.a[1]}px`;
        // Adds to the note's own CSS tilt while it's held.
        stickyEl.style.rotate = holding ? "4.5deg" : "";
      }
    };

    const unsubscribe = api.subscribe(draw);
    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (now - lastInput > IDLE_RESUME_MS) {
        t = (t + dt) % LOOP;
        draw(api.getView());
      }
      raf = requestAnimationFrame(tick);
    };
    if (animate) {
      window.addEventListener("pointerdown", onInput);
      window.addEventListener("wheel", onInput, { passive: true });
      window.addEventListener("keydown", onInput);
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
      window.removeEventListener("pointerdown", onInput);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("keydown", onInput);
      if (stickyEl) {
        stickyEl.style.translate = "";
        stickyEl.style.rotate = "";
      }
    };
  }, [api, current, rects, comment, animate]);

  return (
    <div className="demo" aria-hidden="true">
      <div ref={selectRef} className="demo-select" hidden>
        <span ref={sizeRef} className="demo-select-size" />
      </div>
      {comment && <CommentPin ref={pinRef} text={comment.text} />}
      {DEMO_CURSORS.map((c) => (
        <div
          key={c.id}
          ref={(el) => {
            cursorRefs.current[c.id] = el;
          }}
          className="demo-cursor"
          style={{ "--c": c.color, "--ct": c.text } as CSSProperties}
          hidden
        >
          <CursorIcon />
          <span>{c.name}</span>
        </div>
      ))}
    </div>
  );
}

// #region layer:comment-pin
const CommentPin = forwardRef<HTMLDivElement, { text: string }>(function CommentPin({ text }, ref) {
  return (
    <div ref={ref} className="demo-pin" data-layer="comment-pin" hidden>
      <span className="demo-pin-dot">PM</span>
      <span className="demo-pin-bubble">{text}</span>
    </div>
  );
});
// #endregion
