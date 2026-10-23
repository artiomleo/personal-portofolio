import type { ReactNode } from "react";
import { Link } from "react-router-dom";

// #region layer:button-primary
export function PrimaryButton({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link className="btn btn--primary" to={to} data-layer="button-primary">
      {children}
    </Link>
  );
}
// #endregion

// #region layer:stack-tag
export function StackTags({ items, label }: { items: string[]; label: string }) {
  return (
    <ul className="tags" aria-label={label} role="list">
      {items.map((item) => (
        <li key={item} className="tag" data-layer="stack-tag">
          {item}
        </li>
      ))}
    </ul>
  );
}
// #endregion

export function NewTabNote() {
  return <span className="visually-hidden"> (opens in a new tab)</span>;
}
