import { useCanvasApi } from "@/canvas/CanvasApi";
import { history } from "@/content/history";
import { cx } from "@/lib/cx";

// #region layer:history-item
export function VersionHistory() {
  const canvas = useCanvasApi();
  if (!canvas) return null;
  return (
    <section className="history" aria-label="Version history">
      <p className="panel-heading" aria-hidden="true">
        Version history
      </p>
      <ol className="history-list">
        {history.map((item, i) => (
          <li key={item.id}>
            <button type="button" className={cx("history-item", i === 0 && "history-item--now")} data-layer="history-item" onClick={() => canvas.focusElement(item.id)}>
              <span className="history-label">{item.label}</span>
              <span className="history-years">{item.years}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
// #endregion
