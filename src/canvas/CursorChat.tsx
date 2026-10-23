import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendDraft } from "@/frames/contact/draft";
import { normalizePath } from "@/frames/registry";
import { dialogOpen, isTypingTarget } from "@/lib/keys";

// The bubble's size, used to keep it inside the canvas.
const BUBBLE_W = 248;
const BUBBLE_H = 42;
// The "Guest /" hint appears only once the pointer rests.
const HINT_DELAY_MS = 800;

/** Press / over the canvas to type a message; Enter takes it to the Contact form. */
export function CursorChat({ viewportRef }: { viewportRef: RefObject<HTMLElement> }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  /** Where the bubble sits while it's open, fixed when it opens. */
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);
  const [text, setText] = useState("");
  const openRef = useRef(false);
  openRef.current = at !== null;
  const pointer = useRef({ x: 0, y: 0, inside: false });
  const returnFocus = useRef<HTMLElement | null>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let hintTimer = 0;
    const hideTag = () => {
      window.clearTimeout(hintTimer);
      if (tagRef.current) tagRef.current.hidden = true;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = viewport.getBoundingClientRect();
      pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top, inside: true };
      hideTag();
      if (openRef.current || (e.target as Element).closest(".zoom, .minimap")) return;
      hintTimer = window.setTimeout(() => {
        const tag = tagRef.current;
        if (!tag || openRef.current || !pointer.current.inside) return;
        tag.style.transform = `translate(${pointer.current.x + 14}px, ${pointer.current.y + 18}px)`;
        tag.hidden = false;
      }, HINT_DELAY_MS);
    };
    const leave = () => {
      pointer.current.inside = false;
      hideTag();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || !pointer.current.inside || openRef.current) return;
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target) || dialogOpen()) return;
      e.preventDefault();
      hideTag();
      returnFocus.current = document.activeElement as HTMLElement | null;
      // Next to the pointer, kept inside the canvas.
      const { x, y } = pointer.current;
      setAt({
        x: Math.max(8, Math.min(x + 14, viewport.clientWidth - BUBBLE_W)),
        y: Math.max(8, Math.min(y + 18, viewport.clientHeight - BUBBLE_H)),
      });
    };
    viewport.addEventListener("pointermove", move);
    viewport.addEventListener("pointerleave", leave);
    window.addEventListener("keydown", onKey);
    return () => {
      hideTag();
      viewport.removeEventListener("pointermove", move);
      viewport.removeEventListener("pointerleave", leave);
      window.removeEventListener("keydown", onKey);
    };
  }, [viewportRef]);

  useEffect(() => {
    if (at) inputRef.current?.focus({ preventScroll: true });
  }, [at]);

  const close = (restoreFocus: boolean) => {
    setAt(null);
    setText("");
    const target = returnFocus.current;
    returnFocus.current = null;
    if (!restoreFocus) return;
    if (target && target.isConnected && target !== document.body) target.focus({ preventScroll: true });
    else document.getElementById("main")?.focus({ preventScroll: true });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const message = text.trim();
    close(false);
    if (!message) return;
    navigate("/contact", { replace: normalizePath(pathname) === "/contact" });
    window.setTimeout(() => sendDraft(message), 0);
  };

  return (
    <div className={at ? "chat-layer is-open" : "chat-layer"}>
      <div ref={tagRef} className="chat-tag" aria-hidden="true" hidden>
        Guest <kbd>/</kbd>
      </div>
      {at && (
        <form className="chat-bubble" style={{ transform: `translate(${at.x}px, ${at.y}px)` }} onSubmit={submit} data-nopan>
          <label htmlFor="cursor-chat" className="visually-hidden">
            Message for Artiom
          </label>
          <input
            id="cursor-chat"
            ref={inputRef}
            value={text}
            maxLength={280}
            autoComplete="off"
            placeholder="Say hi, then press Enter"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") close(true);
            }}
            onBlur={() => {
              // Switching windows also blurs; keep the draft then.
              if (document.hasFocus()) close(false);
            }}
          />
        </form>
      )}
    </div>
  );
}
