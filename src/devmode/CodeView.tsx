import { useMemo } from "react";
import { highlight } from "sugar-high";

export function CodeView({ code, lang }: { code: string; lang: "typescript" | "css" }) {
  const html = useMemo(() => highlight(code, { lang }), [code, lang]);
  return (
    <pre className="code" tabIndex={0} aria-label={lang === "css" ? "CSS source" : "TSX source"}>
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
