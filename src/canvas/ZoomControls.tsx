import { Minus, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import { useCanvasApi } from "./CanvasApi";

export function ZoomControls() {
  const api = useCanvasApi();
  const label = useRef<HTMLSpanElement>(null);
  const [announcement, setAnnouncement] = useState("");

  useIsoLayoutEffect(
    () =>
      api?.subscribe((v) => {
        if (label.current) label.current.textContent = `${Math.round(v.z * 100)}%`;
      }),
    [api],
  );

  if (!api) return null;

  // Zoom changes are announced once they settle; the visible percentage updates every frame.
  const zoom = (factor?: number) => {
    if (factor) api.zoomBy(factor);
    else api.fitAll();
    window.setTimeout(() => setAnnouncement(`Zoom ${Math.round(api.getView().z * 100)}%`), factor ? 300 : 950);
  };

  return (
    <div className="zoom" role="group" aria-label="Zoom" data-nopan>
      <button type="button" onClick={() => zoom(0.8)} aria-label="Zoom out">
        <Minus size={15} aria-hidden="true" />
      </button>
      <span ref={label} className="zoom-value" aria-hidden="true">
        100%
      </span>
      <button type="button" onClick={() => zoom(1.25)} aria-label="Zoom in">
        <Plus size={15} aria-hidden="true" />
      </button>
      <button type="button" className="zoom-fit" onClick={() => zoom()} aria-label="Fit all frames">
        Fit
      </button>
      <span className="visually-hidden" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
