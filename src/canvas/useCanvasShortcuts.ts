import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FRAMES } from "@/frames/registry";
import { dialogOpen, isTypingTarget } from "@/lib/keys";
import type { CanvasApi } from "./CanvasApi";

/** 1–5 jump to frames, 0 fits all, + and − zoom, ? opens the shortcuts. D and Esc live in DevModeProvider. */
export function useCanvasShortcuts(api: CanvasApi | null, onHelp: () => void) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!api) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target) || dialogOpen()) return;
      const index = "12345".indexOf(e.key);
      if (index !== -1 && FRAMES[index]) {
        e.preventDefault();
        api.focusFrame(FRAMES[index].id);
        navigate(FRAMES[index].path);
      } else if (e.key === "0") {
        e.preventDefault();
        api.fitAll();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        api.zoomBy(1.25);
      } else if (e.key === "-") {
        e.preventDefault();
        api.zoomBy(0.8);
      } else if (e.key === "?") {
        e.preventDefault();
        onHelp();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [api, navigate, onHelp]);
}
