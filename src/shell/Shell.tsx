import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FRAME_COMPONENTS } from "@/frames";
import { NotFound } from "@/frames/NotFound";
import { frameForPath, type FrameId } from "@/frames/registry";
import { useLayout } from "@/layout/LayoutProvider";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import { useRouteMeta } from "@/seo/useRouteMeta";
import { FramesNav } from "./FramesNav";
import { TopBar } from "./TopBar";

export function Shell() {
  const { pathname } = useLocation();
  const frame = frameForPath(pathname);
  const { mounted } = useLayout();
  const lastPath = useRef(pathname);

  useRouteMeta(frame?.id ?? "notFound");

  // Leave the boot script's choice alone until React has mounted.
  useIsoLayoutEffect(() => {
    if (mounted) document.documentElement.dataset.layout = "page";
  }, [mounted]);

  // On a real route change (not the first render, and not StrictMode's re-run), start at the top and move
  // focus to the frame now showing, so keyboard and screen-reader users continue from there.
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    window.scrollTo(0, 0);
    const target = frame
      ? document.querySelector<HTMLElement>(`[data-frame="${frame.id}"]`)
      : document.querySelector<HTMLElement>("#main section");
    target?.focus({ preventScroll: true });
  }, [pathname, frame]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <TopBar />
      <FramesNav current={frame?.id} />
      <main id="main" className="page-main" tabIndex={-1}>
        {frame ? <PageFrame id={frame.id} /> : <NotFound />}
      </main>
    </>
  );
}

function PageFrame({ id }: { id: FrameId }) {
  const FrameComponent = FRAME_COMPONENTS[id];
  return <FrameComponent primary />;
}
