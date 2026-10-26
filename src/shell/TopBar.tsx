import { Code, Keyboard } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { DEMO_CURSORS } from "@/canvas/cursors";
import { useDevMode } from "@/devmode/DevModeProvider";
import { useLayout } from "@/layout/LayoutProvider";
import { Mark } from "./Mark";
import { ThemeToggle } from "./ThemeToggle";

/** onHelp is passed only in canvas layout, where keyboard shortcuts exist. */
export function TopBar({ onHelp }: { onHelp?: () => void }) {
  const { mounted, canCanvas, pageView, setPageView } = useLayout();
  const devMode = useDevMode();
  return (
    <header className="topbar">
      <Link to="/" className="topbar-file">
        <Mark />
        <span className="topbar-file-name">
          <b>artiom-leontiev</b>
          <span className="topbar-file-sub"> / portfolio</span>
        </span>
      </Link>
      <div className="topbar-people" aria-hidden="true">
        {DEMO_CURSORS.map((c) => (
          <span key={c.id} className="avatar" style={{ "--c": c.color, "--ct": c.text } as CSSProperties} title={`${c.name} · Demo cursor`}>
            {c.initials}
          </span>
        ))}
      </div>
      <div className="topbar-actions">
        <button type="button" className="tb-btn" aria-pressed={devMode.on} onClick={devMode.toggle}>
          <Code size={15} aria-hidden="true" />
          <span className="tb-btn-text">Dev Mode</span>
          <kbd aria-hidden="true">D</kbd>
        </button>
        {mounted && canCanvas && (
          <button type="button" className="tb-btn" onClick={() => setPageView(!pageView)}>
            {pageView ? "Canvas view" : "Page view"}
          </button>
        )}
        {onHelp && (
          <button type="button" className="tb-icon" onClick={onHelp} aria-label="Keyboard shortcuts">
            <Keyboard size={16} aria-hidden="true" />
          </button>
        )}
        <ThemeToggle />
        <Link to="/contact" className="topbar-cta">
          Contact
        </Link>
      </div>
    </header>
  );
}
