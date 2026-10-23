import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FRAME_COMPONENTS } from "@/frames";
import { FRAMES, frameById, normalizePath, type FrameId } from "@/frames/registry";
import { useLayout } from "@/layout/LayoutProvider";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import { useRegisterCanvasApi, type CanvasApi } from "./CanvasApi";
import { centerOn, fitRect, focusFrame, toScreen } from "./camera";
import { PAD_TOP } from "./constants";
import { CameraController } from "./controller";
import { attachCanvasInput } from "./input";
import { bounds, layoutFrames, type FrameRects, type FrameSizes } from "./layout";
import { Minimap } from "./Minimap";
import { rectIn } from "./rect";
import { useCanvasShortcuts } from "./useCanvasShortcuts";
import { ZoomControls } from "./ZoomControls";

type Props = { current: FrameId; onHelp: () => void };

const sameRects = (a: FrameRects | null, b: FrameRects) =>
  a !== null &&
  FRAMES.every(({ id }) => a[id].x === b[id].x && a[id].y === b[id].y && a[id].w === b[id].w && a[id].h === b[id].h);

export function CanvasRoot({ current, onHelp }: Props) {
  const viewportRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<CameraController | null>(null);
  const rectsRef = useRef<FrameRects | null>(null);
  /** The frame the camera was last sent to. */
  const focusedRef = useRef<FrameId>(current);
  /** True after the visitor pans or zooms, or the camera moved to a focused element; resizes then keep the view. */
  const userMovedRef = useRef(false);
  /** Set by focusElement, which flies on its own, so the route effect skips that one navigation. */
  const routeHandledRef = useRef(false);
  const currentRef = useRef(current);
  currentRef.current = current;
  const [rects, setRects] = useState<FrameRects | null>(null);
  const [api, setApi] = useState<CanvasApi | null>(null);
  const { reducedMotion } = useLayout();
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;
  const location = useLocation();
  const pathRef = useRef(location.pathname);
  pathRef.current = location.pathname;
  const navigate = useNavigate();
  // react-router hands out a new navigate function on every route change; a ref keeps the API object stable.
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const registerApi = useRegisterCanvasApi();

  const frameEl = useCallback(
    (id: FrameId) => worldRef.current?.querySelector<HTMLElement>(`[data-frame="${id}"]`) ?? null,
    [],
  );

  const focusFrameId = useCallback((id: FrameId, duration = 1000) => {
    const cam = camRef.current;
    const r = rectsRef.current;
    if (!cam || !r) return;
    focusedRef.current = id;
    userMovedRef.current = false;
    cam.flyTo(focusFrame(r[id], cam.vp), duration);
  }, []);

  const showElement = useCallback((el: HTMLElement, duration = 700) => {
    const cam = camRef.current;
    const r = rectsRef.current;
    const world = worldRef.current;
    const id = el.closest<HTMLElement>("[data-frame]")?.dataset.frame as FrameId | undefined;
    if (!cam || !r || !world || !id) return;
    const base = focusFrame(r[id], cam.vp);
    const box = rectIn(el, world);
    // Keep the frame's fit, and move down until the element sits in the upper third.
    const y = Math.min(base.y, Math.round(cam.vp.h / 3 - box.y * base.z));
    focusedRef.current = id;
    userMovedRef.current = true;
    cam.flyTo({ ...base, y }, duration);
  }, []);

  // Measure, lay out and place the camera before the first paint, so the route's frame doesn't move.
  useIsoLayoutEffect(() => {
    const viewport = viewportRef.current;
    const world = worldRef.current;
    if (!viewport || !world) return;
    document.documentElement.dataset.layout = "canvas";
    const cam = new CameraController(viewport, world, () => reducedRef.current);
    camRef.current = cam;
    let alive = true;

    const measure = () => {
      cam.measure();
      const sizes = {} as FrameSizes;
      for (const f of FRAMES) {
        const el = frameEl(f.id)!;
        sizes[f.id] = { w: el.offsetWidth, h: el.offsetHeight };
      }
      const next = layoutFrames(sizes);
      for (const f of FRAMES) {
        const el = frameEl(f.id)!;
        el.style.left = `${next[f.id].x}px`;
        el.style.top = `${next[f.id].y}px`;
      }
      // Keep the same object when nothing moved, so consumers of `rects` don't re-plan.
      if (!sameRects(rectsRef.current, next)) {
        rectsRef.current = next;
        setRects(next);
      }
      return rectsRef.current!;
    };

    cam.set(focusFrame(measure()[focusedRef.current], cam.vp));

    let timer = 0;
    const refit = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!alive) return;
        const next = measure();
        if (cam.isFlying()) return;
        if (!userMovedRef.current) cam.set(focusFrame(next[focusedRef.current], cam.vp));
        else cam.set(cam.view); // re-applies, so the minimap picks up a new viewport size
      }, 80);
    };
    const observer = new ResizeObserver(refit);
    observer.observe(viewport);
    for (const f of FRAMES) observer.observe(frameEl(f.id)!);
    document.fonts?.ready.then(() => alive && refit());
    const detach = attachCanvasInput(viewport, cam, () => {
      userMovedRef.current = true;
    });

    return () => {
      alive = false;
      window.clearTimeout(timer);
      observer.disconnect();
      detach();
      cam.cancel();
      camRef.current = null;
    };
  }, [frameEl]);

  // Fly when the route changes: nav links, hero buttons, back and forward. location.key also changes when a
  // link points at the current route, so after a pan that link brings the frame back.
  useEffect(() => {
    if (routeHandledRef.current) {
      routeHandledRef.current = false;
      return;
    }
    if (focusedRef.current !== current || userMovedRef.current) focusFrameId(current);
  }, [current, location.key, focusFrameId]);

  // Keyboard focus moves the camera. The viewport clips rather than scrolls; undo any scroll a browser still does.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      // A frame itself gets focus after navigation, and the route effect already flies there.
      if (el.matches("[data-frame]") || !el.closest("[data-frame]")) return;
      const cam = camRef.current;
      const world = worldRef.current;
      if (!cam || !world) return;
      // World coordinates, so a browser scroll that happened before focusin can't hide the problem.
      const box = rectIn(el, world);
      const [left, top] = toScreen(cam.view, box.x, box.y);
      const [right, bottom] = toScreen(cam.view, box.x + box.w, box.y + box.h);
      if (left < 0 || top < 0 || right > cam.vp.w || bottom > cam.vp.h) showElement(el, 500);
    };
    const onScroll = () => {
      viewport.scrollTop = 0;
      viewport.scrollLeft = 0;
    };
    viewport.addEventListener("focusin", onFocus);
    viewport.addEventListener("scroll", onScroll);
    return () => {
      viewport.removeEventListener("focusin", onFocus);
      viewport.removeEventListener("scroll", onScroll);
    };
  }, [showElement]);

  useEffect(() => {
    const next: CanvasApi = {
      focusFrame: (id) => focusFrameId(id),
      focusElement: (elementId) => {
        const el = document.getElementById(elementId);
        const id = el?.closest<HTMLElement>("[data-frame]")?.dataset.frame as FrameId | undefined;
        if (!el || !id) return;
        const path = frameById(id).path;
        routeHandledRef.current = true; // showElement flies; the route effect must not fly to the frame's top too
        navigateRef.current(path, { replace: normalizePath(pathRef.current) === path });
        showElement(el);
      },
      fitAll: () => {
        const cam = camRef.current;
        const r = rectsRef.current;
        if (!cam || !r) return;
        userMovedRef.current = true;
        cam.flyTo(fitRect(bounds(Object.values(r)), cam.vp, 60), 900);
      },
      zoomBy: (factor) => {
        const cam = camRef.current;
        if (!cam) return;
        userMovedRef.current = true;
        // From the zoom the camera is heading to, so quick presses don't compound a mid-flight value.
        cam.zoomAt(cam.target().z * factor, cam.vp.w / 2, cam.vp.h / 2, true);
      },
      panBy: (dx, dy) => {
        const cam = camRef.current;
        if (!cam) return;
        userMovedRef.current = true;
        const v = cam.target();
        cam.flyTo({ ...v, x: v.x - dx, y: v.y - dy }, 160);
      },
      frameEdge: (edge) => {
        const cam = camRef.current;
        const r = rectsRef.current;
        if (!cam || !r) return;
        const frame = r[currentRef.current];
        const base = focusFrame(frame, cam.vp);
        const y = edge === "top" ? base.y : Math.min(base.y, Math.round(cam.vp.h - PAD_TOP - (frame.y + frame.h) * base.z));
        focusedRef.current = currentRef.current;
        userMovedRef.current = edge === "bottom";
        cam.flyTo({ ...base, y }, 500);
      },
      centerOn: (x, y) => {
        const cam = camRef.current;
        if (!cam) return;
        userMovedRef.current = true;
        cam.flyTo(centerOn(cam.view, cam.vp, x, y), 600);
      },
      subscribe: (fn) => camRef.current?.subscribe(fn) ?? (() => {}),
      getView: () => camRef.current?.view ?? { z: 1, x: 0, y: 0 },
      getViewport: () => camRef.current?.vp ?? { w: 1, h: 1 },
      getRects: () => rectsRef.current,
      getWorld: () => worldRef.current,
    };
    setApi(next);
    registerApi(next);
    return () => registerApi(null);
  }, [focusFrameId, showElement, registerApi]);

  useCanvasShortcuts(api, onHelp);

  return (
    <main id="main" className="canvas" ref={viewportRef} tabIndex={-1}>
      <div className="world" ref={worldRef}>
        {FRAMES.map((f) => {
          const FrameComponent = FRAME_COMPONENTS[f.id];
          return <FrameComponent key={f.id} primary={f.id === "home"} />;
        })}
      </div>
      {rects && <Minimap rects={rects} />}
      <ZoomControls />
    </main>
  );
}
