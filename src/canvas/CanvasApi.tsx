import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { FrameId } from "@/frames/registry";
import type { View, Viewport } from "./camera";
import type { FrameRects } from "./layout";

export type CanvasApi = {
  focusFrame: (id: FrameId) => void;
  /** Fly to the element with this id, switching the route to its frame. */
  focusElement: (elementId: string) => void;
  fitAll: () => void;
  zoomBy: (factor: number) => void;
  centerOn: (x: number, y: number) => void;
  /** Move the camera by screen px (keyboard panning). */
  panBy: (dx: number, dy: number) => void;
  /** Move to the top or bottom of the current route's frame. */
  frameEdge: (edge: "top" | "bottom") => void;
  /** Called on every camera change, and once immediately. Returns an unsubscribe function. */
  subscribe: (fn: (view: View) => void) => () => void;
  getView: () => View;
  getViewport: () => Viewport;
  getRects: () => FrameRects | null;
  getWorld: () => HTMLElement | null;
};

type Registry = { api: CanvasApi | null; setApi: (api: CanvasApi | null) => void };

const CanvasApiContext = createContext<Registry>({ api: null, setApi: () => {} });

export function CanvasApiProvider({ children }: { children: ReactNode }) {
  const [api, setApi] = useState<CanvasApi | null>(null);
  const value = useMemo(() => ({ api, setApi }), [api]);
  return <CanvasApiContext.Provider value={value}>{children}</CanvasApiContext.Provider>;
}

/** The canvas controls, or null in page layout. */
export const useCanvasApi = () => useContext(CanvasApiContext).api;
export const useRegisterCanvasApi = () => useContext(CanvasApiContext).setApi;
