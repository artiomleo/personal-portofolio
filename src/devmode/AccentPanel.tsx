import type { CSSProperties } from "react";
import { CursorIcon } from "@/canvas/CursorIcon";
import { useLayout } from "@/layout/LayoutProvider";
import { useDevMode } from "./DevModeProvider";
import { SWATCHES } from "./swatches";

export function AccentPanel({ typed, editing }: { typed: string | null; editing: boolean }) {
  const { accent, setAccent } = useDevMode();
  const { theme } = useLayout();
  const chosen = SWATCHES.find((s) => s.id === accent)!;
  const value = typed ?? (theme === "dark" ? chosen.dark : chosen.light);
  return (
    <section className="accent" aria-label="Accent token">
      <p className="accent-head">
        Token
        {editing && (
          <span className="accent-who">
            <CursorIcon /> Artiom
          </span>
        )}
      </p>
      <p className="accent-line">
        <code className="accent-name">--accent</code>: <code className="accent-value">{value}</code>
        {editing && <span className="accent-caret" aria-hidden="true" />};
      </p>
      <div className="accent-swatches" role="group" aria-label="Try an accent colour">
        {SWATCHES.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-label={s.name}
            aria-pressed={!editing && accent === s.id}
            style={{ "--swatch": theme === "dark" ? s.dark : s.light } as CSSProperties}
            onClick={() => setAccent(s.id)}
          />
        ))}
      </div>
    </section>
  );
}
