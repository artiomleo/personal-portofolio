import { useEffect, useRef } from "react";

/** The time of the visitor's last pointer move, press, key or wheel. The demos wait for a few idle seconds. */
export function useActivityClock() {
  const last = useRef(performance.now());
  useEffect(() => {
    const mark = () => {
      last.current = performance.now();
    };
    const events = ["pointermove", "pointerdown", "keydown", "wheel"] as const;
    events.forEach((name) => window.addEventListener(name, mark, { passive: true }));
    return () => events.forEach((name) => window.removeEventListener(name, mark));
  }, []);
  return last;
}
