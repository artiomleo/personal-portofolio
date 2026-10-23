import { Minus, Plus } from "lucide-react";
import { useEffect, useRef } from "react";
import { useCanvasApi } from "./CanvasApi";

export function ZoomControls() {
  const api = useCanvasApi();
  const label = useRef<HTMLSpanElement>(null);

  useEffect(
    () =>
      api?.subscribe((v) => {
        if (label.current) label.current.textContent = `${Math.round(v.z * 100)}%`;
      }),
    [api],
  );

  if (!api) return null;
  return (
    <div className="zoom" role="group" aria-label="Zoom" data-nopan>
      <button type="button" onClick={() => api.zoomBy(0.8)} aria-label="Zoom out">
        <Minus size={15} aria-hidden="true" />
      </button>
      <span ref={label} className="zoom-value">
        100%
      </span>
      <button type="button" onClick={() => api.zoomBy(1.25)} aria-label="Zoom in">
        <Plus size={15} aria-hidden="true" />
      </button>
      <button type="button" className="zoom-fit" onClick={() => api.fitAll()}>
        Fit
      </button>
    </div>
  );
}
