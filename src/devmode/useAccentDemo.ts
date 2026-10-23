import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { useLayout } from "@/layout/LayoutProvider";
import { useDevMode } from "./DevModeProvider";
import { applyAccent, SWATCHES, type SwatchId } from "./swatches";

const IDLE_MS = 4000;
const TYPE_MS = 85;
const HOLD_MS = 2400;
const ORDER: SwatchId[] = ["pink", "blue", "orange", "violet"];

/** "Artiom" retypes --accent through the swatches while the visitor is idle. Any activity restores their choice. */
export function useAccentDemo(enabled: boolean, lastActivity: MutableRefObject<number>) {
  const { accent } = useDevMode();
  const { theme } = useLayout();
  const [typed, setTyped] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const accentRef = useRef(accent);
  accentRef.current = accent;

  useEffect(() => {
    if (!enabled) return;
    let stopped = false;
    let timer = 0;
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });
    const idle = () => performance.now() - lastActivity.current >= IDLE_MS;
    const hex = (id: SwatchId) => {
      const s = SWATCHES.find((w) => w.id === id)!;
      return theme === "dark" ? s.dark : s.light;
    };

    const run = async () => {
      let shown: SwatchId = accentRef.current;
      let step = 0;
      while (!stopped) {
        if (!idle()) {
          if (shown !== accentRef.current) applyAccent(accentRef.current);
          shown = accentRef.current;
          setTyped(null);
          setActive(false);
          await sleep(400);
          continue;
        }
        setActive(true);
        let next = ORDER[step % ORDER.length];
        if (next === shown) next = ORDER[++step % ORDER.length];
        const from = hex(shown);
        const to = hex(next);
        for (let n = from.length - 1; n >= 1 && !stopped && idle(); n--) {
          setTyped(from.slice(0, n));
          await sleep(TYPE_MS);
        }
        for (let n = 2; n <= to.length && !stopped && idle(); n++) {
          setTyped(to.slice(0, n));
          await sleep(TYPE_MS);
        }
        if (stopped || !idle()) continue;
        applyAccent(next);
        shown = next;
        step++;
        await sleep(HOLD_MS);
      }
    };
    run();

    return () => {
      stopped = true;
      window.clearTimeout(timer);
      applyAccent(accentRef.current);
      setTyped(null);
      setActive(false);
    };
  }, [enabled, theme, lastActivity]);

  return { typed, active };
}
