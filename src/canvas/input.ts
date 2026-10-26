import type { CameraController } from "./controller";

// Pointer-downs on these never start a pan.
const NO_PAN = "a, button, input, textarea, select, label, summary, [contenteditable], [data-nopan]";
// Wheel events closer together than this belong to one gesture, trackpad momentum included.
const WHEEL_STREAM_MS = 150;

/** Drag to pan, wheel to pan, Ctrl/⌘ + wheel or pinch to zoom. Returns a function that detaches everything. */
export function attachCanvasInput(viewport: HTMLElement, cam: CameraController, onUser: () => void): () => void {
  let pan: { x: number; y: number; id: number; moved: boolean } | null = null;
  let gestureZoom = 1;
  let lastWheel = 0;
  let wheelStreamStart = 0;

  const swallowClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const endPan = () => {
    pan = null;
    viewport.classList.remove("is-panning");
  };

  const onDown = (e: PointerEvent) => {
    if (e.button !== 0 || e.pointerType === "touch") return;
    if ((e.target as Element).closest(NO_PAN)) return;
    pan = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false };
  };

  const onMove = (e: PointerEvent) => {
    if (!pan || e.pointerId !== pan.id) return;
    // The button was released outside the canvas before capture started.
    if (!(e.buttons & 1)) {
      endPan();
      return;
    }
    const dx = e.clientX - pan.x;
    const dy = e.clientY - pan.y;
    if (!pan.moved) {
      if (Math.hypot(dx, dy) < 4) return;
      pan.moved = true;
      viewport.setPointerCapture(pan.id);
      viewport.classList.add("is-panning");
      onUser();
    }
    pan.x = e.clientX;
    pan.y = e.clientY;
    cam.panBy(dx, dy);
  };

  const onUp = () => {
    // A drag ends with a click on whatever is under the pointer; swallow it so nothing activates.
    if (pan?.moved) {
      window.addEventListener("click", swallowClick, { capture: true, once: true });
      window.setTimeout(() => window.removeEventListener("click", swallowClick, { capture: true }), 0);
    }
    endPan();
  };

  const onWheel = (e: WheelEvent) => {
    const now = performance.now();
    if (now - lastWheel >= WHEEL_STREAM_MS) wheelStreamStart = now;
    lastWheel = now;
    // A textarea that can scroll keeps the wheel.
    const scroller = (e.target as Element).closest?.("textarea");
    if (scroller && scroller.scrollHeight > scroller.clientHeight) return;
    e.preventDefault();
    const zooming = e.ctrlKey || e.metaKey;
    // Momentum from a scroll that began before a flight would cancel it; ignore that stream until it ends.
    const flightStart = cam.flightStartedAt();
    if (!zooming && flightStart !== null && wheelStreamStart < flightStart) return;
    onUser();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? cam.vp.h : 1;
    if (zooming) {
      const r = viewport.getBoundingClientRect();
      cam.zoomAt(cam.view.z * Math.exp(-e.deltaY * unit * 0.0025), e.clientX - r.left, e.clientY - r.top);
    } else {
      cam.panBy(-e.deltaX * unit, -e.deltaY * unit);
    }
  };

  // Images would otherwise start a native drag instead of a pan.
  const onDragStart = (e: DragEvent) => e.preventDefault();

  // Safari reports trackpad pinches as gesture events.
  type Gesture = Event & { scale: number; clientX: number; clientY: number };
  const onGestureStart = (e: Event) => {
    e.preventDefault();
    gestureZoom = cam.view.z;
    onUser();
  };
  const onGestureChange = (e: Event) => {
    e.preventDefault();
    const g = e as Gesture;
    const r = viewport.getBoundingClientRect();
    cam.zoomAt(gestureZoom * g.scale, g.clientX - r.left, g.clientY - r.top);
  };

  viewport.addEventListener("pointerdown", onDown);
  viewport.addEventListener("pointermove", onMove);
  viewport.addEventListener("pointerup", onUp);
  viewport.addEventListener("pointercancel", onUp);
  viewport.addEventListener("wheel", onWheel, { passive: false });
  viewport.addEventListener("dragstart", onDragStart);
  viewport.addEventListener("gesturestart", onGestureStart);
  viewport.addEventListener("gesturechange", onGestureChange);

  return () => {
    viewport.removeEventListener("pointerdown", onDown);
    viewport.removeEventListener("pointermove", onMove);
    viewport.removeEventListener("pointerup", onUp);
    viewport.removeEventListener("pointercancel", onUp);
    viewport.removeEventListener("wheel", onWheel);
    viewport.removeEventListener("dragstart", onDragStart);
    viewport.removeEventListener("gesturestart", onGestureStart);
    viewport.removeEventListener("gesturechange", onGestureChange);
  };
}
