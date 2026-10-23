import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { FRAMES } from "./registry";

export function NotFound() {
  return (
    <section className="frame frame--404" aria-labelledby="not-found-title" style={{ "--frame-w": "640px" } as CSSProperties}>
      <p className="frame-label" aria-hidden="true">
        <span className="frame-label-mark">#</span> 404
      </p>
      <div className="frame-body">
        <header className="frame-head">
          <p className="eyebrow">404</p>
          <h1 id="not-found-title" className="frame-title">
            Frame not found
          </h1>
          <p className="frame-lede">There's no frame at this address. Pick one of these instead:</p>
        </header>
        <ul className="not-found-links">
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
