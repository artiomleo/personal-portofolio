/** The site mark: a canvas cursor on the accent colour. Same shape as public/favicon.svg. */
export function Mark() {
  return (
    <svg className="mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect className="mark-bg" width="32" height="32" rx="8" />
      <path className="mark-cursor" d="M10 7v17.5l4.4-4.1 3 6.2 3.1-1.5-3-6.1h6.2z" />
    </svg>
  );
}
