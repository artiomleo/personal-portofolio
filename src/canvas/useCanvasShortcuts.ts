import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FRAMES, normalizePath } from "@/frames/registry";
import { dialogOpen, isTypingTarget } from "@/lib/keys";
import type { CanvasApi } from "./CanvasApi";

// Space activates these, so it must not pan while one has focus.
const ACTIVATES_ON_SPACE = "a, button, summary, [role='button']";

/**
 * 1–5 jump to frames, 0 fits all, + and − zoom, arrows and Page keys move, Home and End go to the
 * frame's top and bottom, ? opens the shortcuts. D and Esc live in DevModeProvider.
 */
export function useCanvasShortcuts(api: CanvasApi | null, onHelp: () => void) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    if (!api) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target) || dialogOpen()) return;
      // Inside the Dev Mode panel, arrow, Page, Home, End and Space keys scroll the panel and its code.
      if ((e.target as Element).closest?.(".inspector") && /^(Arrow\w+|PageUp|PageDown|Home|End| )$/.test(e.key)) return;
      if (/^[1-5]$/.test(e.key)) {
        e.preventDefault();
        if (e.repeat) return;
        const frame = FRAMES[Number(e.key) - 1];
        api.focusFrame(frame.id);
        navigate(frame.path, { replace: normalizePath(pathname) === frame.path });
        return;
      }
      const screen = api.getViewport().h * 0.8;
      switch (e.key) {
        case "0":
          e.preventDefault();
          if (!e.repeat) api.fitAll();
          break;
        case "+":
        case "=":
          e.preventDefault();
          api.zoomBy(1.25);
          break;
        case "-":
          e.preventDefault();
          api.zoomBy(0.8);
          break;
        case "?":
          e.preventDefault();
          if (!e.repeat) onHelp();
          break;
        case "ArrowDown":
          e.preventDefault();
          api.panBy(0, 60);
          break;
        case "ArrowUp":
          e.preventDefault();
          api.panBy(0, -60);
          break;
        case "ArrowRight":
          e.preventDefault();
          api.panBy(60, 0);
          break;
        case "ArrowLeft":
          e.preventDefault();
          api.panBy(-60, 0);
          break;
        case "PageDown":
          e.preventDefault();
          api.panBy(0, screen);
          break;
        case "PageUp":
          e.preventDefault();
          api.panBy(0, -screen);
          break;
        case " ":
          if ((e.target as Element).closest?.(ACTIVATES_ON_SPACE)) return;
          e.preventDefault();
          api.panBy(0, e.shiftKey ? -screen : screen);
          break;
        case "Home":
          e.preventDefault();
          api.frameEdge("top");
          break;
        case "End":
          e.preventDefault();
          api.frameEdge("bottom");
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [api, navigate, pathname, onHelp]);
}
