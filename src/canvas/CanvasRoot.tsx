import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FRAME_COMPONENTS } from "@/frames";
import { FRAMES, frameById, type FrameId } from "@/frames/registry";
import { useLayout } from "@/layout/LayoutProvider";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import { useRegisterCanvasApi, type CanvasApi } from "./CanvasApi";
import { centerOn, fitRect, focusFrame } from "./camera";
import { CameraController } from "./controller";
import { attachCanvasInput } from "./input";
import { bounds, layoutFrames, type FrameRects, type FrameSizes } from "./layout";
import { Minimap } from "./Minimap";
import { rectIn } from "./rect";
import { useCanvasShortcuts } from "./useCanvasShortcuts";
import { ZoomControls } from "./ZoomControls";

type Props = { current: FrameId; onHelp: () => void };

export function CanvasRoot({ current, onHelp }: Props) {
  const viewportRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<CameraController | null>(null);
  const rectsRef = useRef<FrameRects | null>(null);
  /** The frame the camera is on. The route effect only flies when the route differs from it. */
  const focusedRef = useRef<FrameId>(current);
  /** True after the visitor pans or zooms; resizes then keep their view instead of refitting the frame. */
  const userMovedRef = useRef(false);
  const [rects, setRects] = useState<FrameRects | null>(null);
  const [api, setApi] = useState<CanvasApi | null>(null);
  const { reducedMotion } = useLayout();
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;
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
      rectsRef.current = next;
      setRects(next);
      return next;
    };

    cam.set(focusFrame(measure()[focusedRef.current], cam.vp));

    let timer = 0;
    const refit = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!alive) return;
        const next = measure();
        if (!userMovedRef.current && !cam.isFlying()) cam.set(focusFrame(next[focusedRef.current], cam.vp));
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

  // Fly when the route changes: nav links, hero buttons, back and forward.
  useEffect(() => {
    if (focusedRef.current !== current) focusFrameId(current);
  }, [current, focusFrameId]);

  // Keyboard focus moves the camera. The viewport is overflow-hidden, so undo any scroll the browser does on focus.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      // A frame itself gets focus after navigation, and the route effect already flies there.
      if (el.matches("[data-frame]") || !el.closest("[data-frame]")) return;
      const v = viewport.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      if (r.left < v.left || r.right > v.right || r.top < v.top || r.bottom > v.bottom) showElement(el, 500);
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
        focusedRef.current = id; // stops the route effect from also flying to the frame's top
        navigateRef.current(frameById(id).path);
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
        cam.zoomAt(cam.view.z * factor, cam.vp.w / 2, cam.vp.h / 2, true);
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
