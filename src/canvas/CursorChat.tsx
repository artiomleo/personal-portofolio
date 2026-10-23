import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { useNavigate } from "react-router-dom";
import { sendDraft } from "@/frames/contact/draft";
import { isTypingTarget } from "@/lib/keys";

/** Press / over the canvas to type a message; Enter takes it to the Contact form. */
export function CursorChat({ viewportRef }: { viewportRef: RefObject<HTMLElement> }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const openRef = useRef(open);
  openRef.current = open;
  const pointer = useRef({ x: 0, y: 0, inside: false });
  const tagRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = viewport.getBoundingClientRect();
      pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top, inside: true };
      const tag = tagRef.current;
      if (tag && !openRef.current) {
        tag.style.transform = `translate(${pointer.current.x + 14}px, ${pointer.current.y + 18}px)`;
        tag.hidden = false;
      }
    };
    const leave = () => {
      pointer.current.inside = false;
      if (tagRef.current) tagRef.current.hidden = true;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || !pointer.current.inside || openRef.current) return;
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
      e.preventDefault();
      setOpen(true);
    };
    viewport.addEventListener("pointermove", move);
    viewport.addEventListener("pointerleave", leave);
    window.addEventListener("keydown", onKey);
    return () => {
      viewport.removeEventListener("pointermove", move);
      viewport.removeEventListener("pointerleave", leave);
      window.removeEventListener("keydown", onKey);
    };
  }, [viewportRef]);

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  const close = () => {
    setOpen(false);
    setText("");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const message = text.trim();
    close();
    if (!message) return;
    navigate("/contact");
    window.setTimeout(() => sendDraft(message), 0);
  };

  return (
    <div className={open ? "chat-layer is-open" : "chat-layer"}>
      <div ref={tagRef} className="chat-tag" aria-hidden="true" hidden>
        Guest <kbd>/</kbd>
      </div>
      {open && (
        <form
          className="chat-bubble"
          style={{ transform: `translate(${pointer.current.x + 14}px, ${pointer.current.y + 18}px)` }}
          onSubmit={submit}
          data-nopan
        >
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
              if (e.key === "Escape") close();
            }}
            onBlur={close}
          />
        </form>
      )}
    </div>
  );
}
