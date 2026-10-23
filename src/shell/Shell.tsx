import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { CanvasRoot } from "@/canvas/CanvasRoot";
import { FRAME_COMPONENTS } from "@/frames";
import { NotFound } from "@/frames/NotFound";
import { frameForPath, type FrameId } from "@/frames/registry";
import { useLayout } from "@/layout/LayoutProvider";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import { useRouteMeta } from "@/seo/useRouteMeta";
import { FramesNav } from "./FramesNav";
import { ShortcutsDialog, type ShortcutsHandle } from "./ShortcutsDialog";
import { TopBar } from "./TopBar";

export function Shell() {
  const { pathname } = useLocation();
  const frame = frameForPath(pathname);
  const { mounted, canCanvas, pageView } = useLayout();
  const canvas = mounted && canCanvas && !pageView && frame !== undefined;
  const help = useRef<ShortcutsHandle>(null);
  const openHelp = useCallback(() => help.current?.open(), []);
  const lastPath = useRef(pathname);
  const canvasRef = useRef(canvas);
  canvasRef.current = canvas;

  useRouteMeta(frame?.id ?? "notFound");

  // CanvasRoot sets "canvas" itself, before it measures. Leave the boot script's choice alone until mounted.
  useIsoLayoutEffect(() => {
    if (mounted && !canvas) document.documentElement.dataset.layout = "page";
  }, [mounted, canvas]);

  // On a real route change (not the first render, not StrictMode's re-run, not a layout switch), move focus to
  // the frame now showing. Page layout also starts at the top; the canvas flies there instead.
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (!canvasRef.current) window.scrollTo(0, 0);
    const target = frame
      ? document.querySelector<HTMLElement>(`[data-frame="${frame.id}"]`)
      : document.querySelector<HTMLElement>("#main section");
    target?.focus({ preventScroll: true });
  }, [pathname, frame]);

  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          const target = frame && document.querySelector<HTMLElement>(`[data-frame="${frame.id}"]`);
          if (!target) return;
          e.preventDefault();
          target.focus();
        }}
      >
        Skip to content
      </a>
      <TopBar onHelp={canvas ? openHelp : undefined} />
      <FramesNav current={frame?.id} />
      {canvas && frame ? (
        <CanvasRoot current={frame.id} onHelp={openHelp} />
      ) : (
        <main id="main" className="page-main" tabIndex={-1}>
          {frame ? <PageFrame id={frame.id} /> : <NotFound />}
        </main>
      )}
      <ShortcutsDialog ref={help} />
    </>
  );
}

function PageFrame({ id }: { id: FrameId }) {
  const FrameComponent = FRAME_COMPONENTS[id];
  return <FrameComponent primary />;
}
