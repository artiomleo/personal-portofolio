import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { FrameLabel } from "./Frame";
import { FRAMES } from "./registry";

export function NotFound() {
  return (
    <section className="frame" aria-labelledby="not-found-title" style={{ "--frame-w": "640px" } as CSSProperties}>
      <FrameLabel label="404" />
      <div className="frame-body">
        <header className="frame-head">
          <p className="eyebrow">404</p>
          <h1 id="not-found-title" className="frame-title">
            Frame not found
          </h1>
          <p className="frame-lede">There's no frame at this address. Pick one of these instead:</p>
        </header>
        <ul className="not-found-links" role="list">
          {FRAMES.map((f) => (
            <li key={f.id}>
              <Link to={f.path}>{f.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
