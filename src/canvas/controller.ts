import { flightAt, planFlight, zoomAround, type Flight, type View, type Viewport } from "./camera";

type Listener = (view: View) => void;

/** Owns the camera. Writes the world transform and dot grid straight to the DOM; React never re-renders for it. */
export class CameraController {
  view: View = { z: 1, x: 0, y: 0 };
  vp: Viewport = { w: 1, h: 1 };
  private flight: Flight | null = null;
  private raf = 0;
  private restTimer = 0;
  private listeners = new Set<Listener>();

  constructor(
    private viewport: HTMLElement,
    private world: HTMLElement,
    private reducedMotion: () => boolean,
  ) {}

  measure() {
    this.vp = { w: this.viewport.clientWidth || 1, h: this.viewport.clientHeight || 1 };
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.view);
    return () => {
      this.listeners.delete(fn);
    };
  }

  isFlying() {
    return this.flight !== null;
  }

  set(view: View) {
    this.stop();
    this.view = view;
    this.apply(true);
  }

  flyTo(to: View, duration = 1000) {
    if (this.reducedMotion() || duration <= 0) {
      this.set(to);
      return;
    }
    this.stop();
    this.flight = planFlight(this.view, to, this.vp, performance.now(), duration);
    const tick = (now: number) => {
      if (!this.flight) return;
      const { view, done } = flightAt(this.flight, now);
      this.view = view;
      if (done) {
        this.flight = null;
        this.apply(true);
        return;
      }
      this.apply(false);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  panBy(dx: number, dy: number) {
    this.stop();
    this.view = { ...this.view, x: this.view.x + dx, y: this.view.y + dy };
    this.moving();
  }

  zoomAt(z: number, cx: number, cy: number, animate = false) {
    const to = zoomAround(this.view, z, cx, cy);
    if (animate) {
      this.flyTo(to, 250);
      return;
    }
    this.stop();
    this.view = to;
    this.moving();
  }

  stop() {
    this.flight = null;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  cancel() {
    this.stop();
    window.clearTimeout(this.restTimer);
  }

  // While moving, use fractional px and will-change; at rest, round to whole px so text stays crisp.
  private moving() {
    this.apply(false);
    window.clearTimeout(this.restTimer);
    this.restTimer = window.setTimeout(() => this.apply(true), 140);
  }

  private apply(rest: boolean) {
    const { x, y, z } = this.view;
    const tx = rest ? Math.round(x) : x;
    const ty = rest ? Math.round(y) : y;
    this.world.style.transform = `translate(${tx}px, ${ty}px) scale(${z})`;
    this.world.style.willChange = rest ? "auto" : "transform";
    this.viewport.style.backgroundSize = `${20 * z}px ${20 * z}px`;
    this.viewport.style.backgroundPosition = `${tx}px ${ty}px`;
    this.listeners.forEach((fn) => fn(this.view));
  }
}
