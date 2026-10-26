import { Link } from "react-router-dom";
import { useCanvasApi } from "@/canvas/CanvasApi";
import { FRAMES, type FrameId } from "@/frames/registry";
import { VersionHistory } from "./VersionHistory";

// #region layer:nav
export function FramesNav({ current }: { current?: FrameId }) {
  const canvas = useCanvasApi();
  return (
    <nav className="frames-nav" aria-label="Frames" data-layer="nav">
      <p className="panel-heading" aria-hidden="true">
        Frames
      </p>
      <ul className="frames-list">
        {FRAMES.map((f, i) => (
          <li key={f.id}>
            <Link
              to={f.path}
              className="frames-link"
              aria-current={current === f.id ? "page" : undefined}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                canvas?.focusFrame(f.id);
              }}
            >
              <span className="frames-link-mark" aria-hidden="true">#</span>
              <span>{f.label}</span>
              <kbd className="frames-link-key" aria-hidden="true">
                {i + 1}
              </kbd>
            </Link>
          </li>
        ))}
      </ul>
      <VersionHistory />
    </nav>
  );
}
// #endregion
