import { forwardRef, useImperativeHandle, useRef } from "react";

export type ShortcutsHandle = { open: () => void };

const SHORTCUTS: Array<[string, string]> = [
  ["1–5", "Jump to a frame"],
  ["0", "Fit all frames"],
  ["+ / −", "Zoom in or out"],
  ["Ctrl/⌘ + scroll", "Zoom at the pointer"],
  ["Scroll or drag", "Move around the canvas"],
  ["D", "Turn Dev Mode on or off"],
  ["/", "Open cursor chat"],
  ["?", "Show these shortcuts"],
  ["Esc", "Close or exit"],
];

export const ShortcutsDialog = forwardRef<ShortcutsHandle>(function ShortcutsDialog(_props, ref) {
  const dialog = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => ({ open: () => dialog.current?.showModal() }), []);
  return (
    <dialog ref={dialog} className="shortcuts" aria-labelledby="shortcuts-title">
      <h2 id="shortcuts-title">Keyboard shortcuts</h2>
      <dl>
        {SHORTCUTS.map(([keys, action]) => (
          <div key={keys}>
            <dt>
              <kbd>{keys}</kbd>
            </dt>
            <dd>{action}</dd>
          </div>
        ))}
      </dl>
      <form method="dialog">
        <button className="btn btn--ghost">Close</button>
      </form>
    </dialog>
  );
});
