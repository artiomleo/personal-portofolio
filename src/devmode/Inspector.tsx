import { X } from "lucide-react";
import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { useCanvasApi } from "@/canvas/CanvasApi";
import { CursorIcon } from "@/canvas/CursorIcon";
import { useLayout } from "@/layout/LayoutProvider";
import { cx } from "@/lib/cx";
import { AccentPanel } from "./AccentPanel";
import { CodeView } from "./CodeView";
import { useDevMode } from "./DevModeProvider";
import { isLayerId, LAYERS } from "./layers";
import { measure } from "./measure";
import { sourceFor } from "./sources";
import { useAccentDemo } from "./useAccentDemo";
import { useActivityClock } from "./useActivityClock";
import { useAutoSelect } from "./useAutoSelect";
import "./devmode.css";

const layerOf = (target: EventTarget | null) =>
  target instanceof Element ? target.closest<HTMLElement>("[data-layer]") : null;

function placeBox(box: HTMLDivElement | null, el: HTMLElement | null) {
  if (!box) return;
  if (!el || !el.isConnected) {
    box.hidden = true;
    return;
  }
  const r = el.getBoundingClientRect();
  box.hidden = false;
  box.style.transform = `translate(${r.left}px, ${r.top}px)`;
  box.style.width = `${r.width}px`;
  box.style.height = `${r.height}px`;
}

export default function Inspector() {
  const { exit } = useDevMode();
  const { reducedMotion } = useLayout();
  const isCanvas = useCanvasApi() !== null;
  const [hovered, setHovered] = useState<HTMLElement | null>(null);
  const [selected, setSelected] = useState<HTMLElement | null>(null);
  const [tab, setTab] = useState<"tsx" | "css">("tsx");
  const hoverBox = useRef<HTMLDivElement>(null);
  const selectBox = useRef<HTMLDivElement>(null);
  const designerRef = useRef<HTMLDivElement>(null);
  const lastActivity = useActivityClock();
  const demos = isCanvas && !reducedMotion;
  const accentDemo = useAccentDemo(demos, lastActivity);
  useAutoSelect(demos, lastActivity, setSelected, designerRef);

  useEffect(() => {
    const over = (e: PointerEvent) => {
      const el = layerOf(e.target);
      setHovered(el && isLayerId(el.dataset.layer) && !el.closest(".inspector") ? el : null);
    };
    const click = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(".inspector")) return;
      const el = layerOf(target);
      if (!el || !isLayerId(el.dataset.layer)) return;
      // Inside frames a click inspects instead of following the link; the chrome keeps working.
      if (el.closest("[data-frame]")) {
        e.preventDefault();
        e.stopPropagation();
      }
      setSelected(el);
    };
    document.addEventListener("pointerover", over);
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("click", click, true);
    };
  }, []);

  // Outlines follow their elements every frame, including during camera flights.
  useEffect(() => {
    let raf = 0;
    const draw = () => {
      placeBox(hoverBox.current, hovered !== selected ? hovered : null);
      placeBox(selectBox.current, selected);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [hovered, selected]);

  const layer = selected && isLayerId(selected.dataset.layer) ? selected.dataset.layer : null;
  const info = layer ? LAYERS[layer] : null;
  const specs = selected?.isConnected ? measure(selected) : null;
  const code = layer ? sourceFor(layer) : null;
  const hoveredName = hovered && isLayerId(hovered.dataset.layer) ? LAYERS[hovered.dataset.layer].name : "";

  return (
    <>
      <div ref={hoverBox} className="dm-box dm-box--hover" hidden>
        <span className="dm-tag">{hoveredName}</span>
      </div>
      <div ref={selectBox} className="dm-box dm-box--select" hidden>
        <span className="dm-tag">{info?.name}</span>
        {specs && (
          <span className="dm-size">
            {specs.width} × {specs.height}
          </span>
        )}
      </div>
      {demos && (
        <div
          ref={designerRef}
          className="dm-cursor demo-cursor"
          style={{ "--c": "var(--cursor-designer)", "--ct": "#FFFFFF" } as CSSProperties}
          aria-hidden="true"
          hidden
        >
          <CursorIcon />
          <span>Designer</span>
        </div>
      )}
      <aside className={cx("inspector", !info && "inspector--empty")} aria-label="Dev Mode inspector" data-nopan>
        <header className="inspector-head">
          <p className="inspector-title">{info ? info.name : "Dev Mode"}</p>
          <p className="inspector-file">{info ? info.file : "Select any element to see its code and measurements."}</p>
          <button type="button" className="inspector-close" onClick={exit} aria-label="Exit Dev Mode">
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        {specs && (
          <dl className="inspector-specs">
            <dt>Size</dt>
            <dd>
              {specs.width} × {specs.height}
            </dd>
            <dt>Font</dt>
            <dd>{specs.font}</dd>
            <dt>Type</dt>
            <dd>{specs.type}</dd>
            <dt>Weight</dt>
            <dd>{specs.weight}</dd>
            <dt>Padding</dt>
            <dd>{specs.padding}</dd>
            {specs.colors.map((c) => (
              <Fragment key={c.property}>
                <dt>{c.property}</dt>
                <dd>
                  <span className="swatch-dot" style={{ background: c.value }} />
                  {c.token ? `${c.token} ${c.value}` : c.value}
                </dd>
              </Fragment>
            ))}
          </dl>
        )}
        <AccentPanel typed={accentDemo.typed} editing={accentDemo.active} />
        {code && (code.tsx || code.css) && (
          <div className="inspector-code">
            <div className="inspector-tabs" role="group" aria-label="Source">
              <button type="button" aria-pressed={tab === "tsx"} onClick={() => setTab("tsx")}>
                TSX
              </button>
              <button type="button" aria-pressed={tab === "css"} onClick={() => setTab("css")}>
                CSS
              </button>
            </div>
            <CodeView code={tab === "tsx" ? code.tsx : code.css} lang={tab === "tsx" ? "typescript" : "css"} />
          </div>
        )}
      </aside>
    </>
  );
}
