import { useEffect, type MutableRefObject, type RefObject } from "react";

const IDLE_MS = 4000;
const EVERY_MS = 3600;
const PANEL_W = 340;

/** While the visitor is idle, the Designer cursor walks to a visible layer and selects it. */
export function useAutoSelect(
  enabled: boolean,
  lastActivity: MutableRefObject<number>,
  select: (el: HTMLElement) => void,
  cursorRef: RefObject<HTMLDivElement>,
) {
  useEffect(() => {
    if (!enabled) return;
    let index = 0;
    let pending = 0;
    const timer = window.setInterval(() => {
      const cursor = cursorRef.current;
      if (performance.now() - lastActivity.current < IDLE_MS) {
        if (cursor) cursor.hidden = true;
        return;
      }
      const view = document.querySelector(".canvas")?.getBoundingClientRect();
      if (!view) return;
      const visible = [...document.querySelectorAll<HTMLElement>("[data-frame] [data-layer]")].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.left >= view.left && r.right <= view.right - PANEL_W && r.top >= view.top && r.bottom <= view.bottom;
      });
      if (!visible.length) return;
      const el = visible[index++ % visible.length];
      const r = el.getBoundingClientRect();
      if (cursor) {
        cursor.hidden = false;
        cursor.style.transform = `translate(${r.left + Math.min(r.width * 0.6, r.width - 12)}px, ${r.top + Math.min(r.height * 0.5, 40)}px)`;
      }
      window.clearTimeout(pending);
      pending = window.setTimeout(() => select(el), 700);
    }, EVERY_MS);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(pending);
    };
  }, [enabled, lastActivity, select, cursorRef]);
}
