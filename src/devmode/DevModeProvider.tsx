import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dialogOpen, isTypingTarget } from "@/lib/keys";
import { applyAccent, type SwatchId } from "./swatches";

type DevModeState = {
  on: boolean;
  toggle: () => void;
  exit: () => void;
  /** The visitor's chosen accent. Not saved between visits. */
  accent: SwatchId;
  setAccent: (id: SwatchId) => void;
};

const DevModeContext = createContext<DevModeState | null>(null);

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  const [accent, setAccentState] = useState<SwatchId>("violet");
  const toggle = useCallback(() => setOn((v) => !v), []);
  const exit = useCallback(() => setOn(false), []);
  const setAccent = useCallback((id: SwatchId) => {
    applyAccent(id);
    setAccentState(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target) || dialogOpen()) return;
      if (e.key === "d" || e.key === "D") {
        if (e.repeat) return;
        e.preventDefault();
        setOn((v) => !v);
      } else if (e.key === "Escape") {
        setOn(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-devmode", on);
  }, [on]);

  const value = useMemo(() => ({ on, toggle, exit, accent, setAccent }), [on, toggle, exit, accent, setAccent]);
  return <DevModeContext.Provider value={value}>{children}</DevModeContext.Provider>;
}

export function useDevMode(): DevModeState {
  const value = useContext(DevModeContext);
  if (!value) throw new Error("useDevMode must be used inside DevModeProvider");
  return value;
}
