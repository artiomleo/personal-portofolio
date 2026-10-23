import type { CameraController } from "./controller";

// Pointer-downs on these never start a pan.
const NO_PAN = "a, button, input, textarea, select, label, summary, [contenteditable], [data-nopan]";

/** Drag to pan, wheel to pan, Ctrl/⌘ + wheel or pinch to zoom. Returns a function that detaches everything. */
export function attachCanvasInput(viewport: HTMLElement, cam: CameraController, onUser: () => void): () => void {
  let pan: { x: number; y: number; id: number; moved: boolean } | null = null;
  let gestureZoom = 1;

  const swallowClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDown = (e: PointerEvent) => {
    if (e.button !== 0 || e.pointerType === "touch") return;
    if ((e.target as Element).closest(NO_PAN)) return;
    pan = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false };
  };

  const onMove = (e: PointerEvent) => {
    if (!pan || e.pointerId !== pan.id) return;
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
    pan = null;
    viewport.classList.remove("is-panning");
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    onUser();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? cam.vp.h : 1;
    if (e.ctrlKey || e.metaKey) {
      const r = viewport.getBoundingClientRect();
      cam.zoomAt(cam.view.z * Math.exp(-e.deltaY * unit * 0.0025), e.clientX - r.left, e.clientY - r.top);
    } else {
      cam.panBy(-e.deltaX * unit, -e.deltaY * unit);
    }
  };

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
  viewport.addEventListener("gesturestart", onGestureStart);
  viewport.addEventListener("gesturechange", onGestureChange);

  return () => {
    viewport.removeEventListener("pointerdown", onDown);
    viewport.removeEventListener("pointermove", onMove);
    viewport.removeEventListener("pointerup", onUp);
    viewport.removeEventListener("pointercancel", onUp);
    viewport.removeEventListener("wheel", onWheel);
    viewport.removeEventListener("gesturestart", onGestureStart);
    viewport.removeEventListener("gesturechange", onGestureChange);
  };
}
