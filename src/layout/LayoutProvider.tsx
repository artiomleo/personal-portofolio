import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CANVAS_QUERY } from "@/canvas/constants";
import { readStorage, writeStorage } from "@/lib/storage";

export type Theme = "light" | "dark";

type LayoutState = {
  /** False during prerendering and the hydration render, so both match the server HTML. */
  mounted: boolean;
  /** Wide screen with a fine primary pointer. */
  canCanvas: boolean;
  /** The visitor chose Page view on a screen that could show the canvas. */
  pageView: boolean;
  setPageView: (on: boolean) => void;
  theme: Theme;
  toggleTheme: () => void;
  reducedMotion: boolean;
};

const LayoutContext = createContext<LayoutState | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [canCanvas, setCanCanvas] = useState(false);
  const [pageView, setPageViewState] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const wide = matchMedia(CANVAS_QUERY);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setCanCanvas(wide.matches);
      setReducedMotion(motion.matches);
    };
    sync();
    setPageViewState(readStorage("view") === "page");
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    setMounted(true);
    wide.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  const setPageView = useCallback((on: boolean) => {
    writeStorage("view", on ? "page" : "canvas");
    setPageViewState(on);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    writeStorage("theme", next);
    setTheme(next);
  }, []);

  const value = useMemo(
    () => ({ mounted, canCanvas, pageView, setPageView, theme, toggleTheme, reducedMotion }),
    [mounted, canCanvas, pageView, setPageView, theme, toggleTheme, reducedMotion],
  );
  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export function useLayout(): LayoutState {
  const value = useContext(LayoutContext);
  if (!value) throw new Error("useLayout must be used inside LayoutProvider");
  return value;
}
