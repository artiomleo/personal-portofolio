/** The lines between "#region layer:<id>" and the next "#endregion", without the markers and dedented. */
export function region(source: string, id: string): string {
  const lines = source.split("\n");
  const marker = new RegExp(`#region layer:${id}(?![\\w-])`);
  const start = lines.findIndex((line) => marker.test(line));
  if (start === -1) return "";
  const end = lines.findIndex((line, i) => i > start && line.includes("#endregion"));
  const body = lines.slice(start + 1, end === -1 ? undefined : end);
  const indents = body.filter((line) => line.trim()).map((line) => line.length - line.trimStart().length);
  const indent = indents.length ? Math.min(...indents) : 0;
  return body.map((line) => line.slice(indent)).join("\n").trim();
}
