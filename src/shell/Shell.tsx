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
  const firstRender = useRef(true);

  useRouteMeta(frame?.id ?? "notFound");

  // Leave the boot script's choice alone until React has mounted.
  useIsoLayoutEffect(() => {
    if (mounted) document.documentElement.dataset.layout = "page";
  }, [mounted]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);

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
