/** Cursor chat on the canvas hands its text to the contact form through this window event. */
export const DRAFT_EVENT = "contact:draft";

export function sendDraft(text: string): void {
  window.dispatchEvent(new CustomEvent<string>(DRAFT_EVENT, { detail: text }));
}
