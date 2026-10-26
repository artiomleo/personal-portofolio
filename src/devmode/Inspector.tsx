import { X } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useCanvasApi } from "@/canvas/CanvasApi";
import { CursorIcon } from "@/canvas/CursorIcon";
import { useLayout } from "@/layout/LayoutProvider";
import { cx } from "@/lib/cx";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
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

const isInspectable = (el: HTMLElement | null): el is HTMLElement =>
  el !== null && isLayerId(el.dataset.layer) && !el.closest(".inspector");

function placeBox(box: HTMLDivElement | null, rect: DOMRect | null) {
  if (!box) return;
  if (!rect) {
    box.hidden = true;
    return;
  }
  box.hidden = false;
  box.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
  box.style.width = `${rect.width}px`;
  box.style.height = `${rect.height}px`;
}

export default function Inspector() {
  const { exit, accent } = useDevMode();
  const { reducedMotion, theme } = useLayout();
  const isCanvas = useCanvasApi() !== null;
  const [hovered, setHovered] = useState<HTMLElement | null>(null);
  const [selected, setSelected] = useState<HTMLElement | null>(null);
  const [tab, setTab] = useState<"tsx" | "css">("tsx");
  const hoverBox = useRef<HTMLDivElement>(null);
  const selectBox = useRef<HTMLDivElement>(null);
  const designerRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const focusInside = useRef(false);
  const lastActivity = useActivityClock();
  const demos = isCanvas && !reducedMotion;
  const accentDemo = useAccentDemo(demos, lastActivity);
  useAutoSelect(demos, lastActivity, setSelected, designerRef);

  useEffect(() => {
    const over = (e: PointerEvent) => {
      const el = layerOf(e.target);
      setHovered(isInspectable(el) ? el : null);
    };
    // Keyboard users select a layer by focusing it.
    const focus = (e: FocusEvent) => {
      const el = layerOf(e.target);
      if (isInspectable(el)) setSelected(el);
    };
    const click = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(".inspector")) return;
      // Inside frames every click inspects instead of following a link or submitting; the chrome keeps working.
      if (target.closest("[data-frame]")) {
        e.preventDefault();
        e.stopPropagation();
      }
      const el = layerOf(target);
      if (isInspectable(el)) setSelected(el);
    };
    document.addEventListener("pointerover", over);
    document.addEventListener("focusin", focus);
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("click", click, true);
    };
  }, []);

  // Outlines follow their elements every frame, including during camera flights. Idle when nothing is shown.
  useEffect(() => {
    if (!hovered && !selected) {
      placeBox(hoverBox.current, null);
      placeBox(selectBox.current, null);
      return;
    }
    let raf = 0;
    const draw = () => {
      if (selected && !selected.isConnected) {
        setSelected(null);
        return;
      }
      const hoverRect = hovered && hovered !== selected && hovered.isConnected ? hovered.getBoundingClientRect() : null;
      const selectRect = selected ? selected.getBoundingClientRect() : null;
      placeBox(hoverBox.current, hoverRect);
      placeBox(selectBox.current, selectRect);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [hovered, selected]);

  // The page-layout bottom sheet reserves its height at the end of the page, so nothing stays hidden under it.
  useIsoLayoutEffect(() => {
    const aside = asideRef.current;
    if (!aside) return;
    const root = document.documentElement;
    const sync = () => root.style.setProperty("--sheet-h", `${aside.offsetHeight}px`);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(aside);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--sheet-h");
    };
  }, []);

  // Closing from inside the panel would drop focus on <body>; hand it to the Dev Mode toggle instead.
  useEffect(() => {
    const aside = asideRef.current;
    if (!aside) return;
    const onIn = () => {
      focusInside.current = true;
    };
    const onOut = (e: FocusEvent) => {
      if (e.relatedTarget) focusInside.current = aside.contains(e.relatedTarget as Node);
    };
    aside.addEventListener("focusin", onIn);
    aside.addEventListener("focusout", onOut);
    return () => {
      aside.removeEventListener("focusin", onIn);
      aside.removeEventListener("focusout", onOut);
      if (focusInside.current) document.querySelector<HTMLElement>(".topbar .tb-btn[aria-pressed]")?.focus();
    };
  }, []);

  const layer = selected && isLayerId(selected.dataset.layer) ? selected.dataset.layer : null;
  const info = layer ? LAYERS[layer] : null;
  const code = useMemo(() => (layer ? sourceFor(layer) : null), [layer]);
  // Re-measured when the selection, accent or theme changes, including each colour the accent demo applies.
  const specs = useMemo(
    () => (selected?.isConnected ? measure(selected) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected, accent, theme, accentDemo.typed],
  );
  const hoveredName = isInspectable(hovered) ? LAYERS[hovered.dataset.layer as keyof typeof LAYERS].name : "";

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
      <aside ref={asideRef} className={cx("inspector", !info && "inspector--empty")} aria-label="Dev Mode inspector" data-nopan>
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
