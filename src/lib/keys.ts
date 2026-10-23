/** True when a key press belongs to a text field, so shortcuts must ignore it. */
export function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || !el.tagName) return false;
  return el.isContentEditable || el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT";
}

/** True while a modal dialog is open; global shortcuts stay quiet then. */
export const dialogOpen = () => document.querySelector("dialog[open]") !== null;
